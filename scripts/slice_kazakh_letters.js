import fs from 'fs';
import path from 'path';

const wavBuffer = fs.readFileSync('public/audio/letters/batch_all_letters.wav');
const sampleRate = wavBuffer.readUInt32LE(24);

const samples = [];
for (let i = 44; i < wavBuffer.length; i += 2) {
  samples.push(wavBuffer.readInt16LE(i));
}

// Window RMS energy
const windowSize = Math.floor(sampleRate * 0.04); // 40ms window
const step = Math.floor(sampleRate * 0.015); // 15ms step
const energy = [];
for (let i = 0; i < samples.length - windowSize; i += step) {
  let sumSq = 0;
  for (let j = 0; j < windowSize; j++) sumSq += samples[i + j] * samples[i + j];
  energy.push({ time: i / sampleRate, rms: Math.sqrt(sumSq / windowSize) });
}

// Segment detection
const threshold = 300;
let inSegment = false;
let segStart = 0;
const segments = [];

for (const e of energy) {
  if (!inSegment && e.rms > threshold) {
    inSegment = true;
    segStart = Math.max(0, e.time - 0.06);
  } else if (inSegment && e.rms < 120) {
    inSegment = false;
    const segEnd = e.time + 0.06;
    if (segEnd - segStart > 0.22) {
      segments.push({ start: segStart, end: segEnd });
    }
  }
}

console.log('Total segments detected:', segments.length);

const lettersInBatch = [
  'А', 'Ә', 'Б', 'В', 'Г', 'Ғ', 'Д', 'Е', 'Ё', 'Ж', 
  'З', 'И', 'Й', 'К', 'Қ', 'Л', 'М', 'Н', 'Ң', 'О', 
  'Ө', 'П', 'Р', 'С', 'Т', 'У', 'Ұ', 'Ү', 'Ф', 'Х', 
  'Һ', 'Ц', 'Ч', 'Ш', 'Щ', 'Ы', 'І', 'Э', 'Ю', 'Я'
];

if (segments.length !== lettersInBatch.length) {
  console.warn(`Segments (${segments.length}) does not match letters count (${lettersInBatch.length})!`);
}

function writeWav(sliceSamples, filePath) {
  const dataSize = sliceSamples.length * 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // Mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const body = Buffer.alloc(dataSize);
  // Apply fade-in (15ms) and fade-out (25ms)
  const fadeInSamples = Math.floor(sampleRate * 0.015);
  const fadeOutSamples = Math.floor(sampleRate * 0.025);
  const total = sliceSamples.length;

  for (let i = 0; i < total; i++) {
    let s = sliceSamples[i];
    if (i < fadeInSamples) {
      s = Math.round(s * (i / fadeInSamples));
    } else if (i > total - fadeOutSamples) {
      s = Math.round(s * ((total - i) / fadeOutSamples));
    }
    body.writeInt16LE(s, i * 2);
  }

  fs.writeFileSync(filePath, Buffer.concat([header, body]));
}

const outDir = path.join(process.cwd(), 'public', 'audio', 'letters');
fs.mkdirSync(outDir, { recursive: true });

segments.forEach((seg, idx) => {
  if (idx >= lettersInBatch.length) return;
  const letter = lettersInBatch[idx];
  const charCode = letter.charCodeAt(0);
  const startIdx = Math.floor(seg.start * sampleRate);
  const endIdx = Math.floor(seg.end * sampleRate);
  const sliceSamples = samples.slice(startIdx, endIdx);
  const outPath = path.join(outDir, `letter_${charCode}.wav`);
  writeWav(sliceSamples, outPath);
  console.log(`Saved ${letter} (code ${charCode}) -> ${outPath} (${(sliceSamples.length / sampleRate).toFixed(2)}s)`);
});
