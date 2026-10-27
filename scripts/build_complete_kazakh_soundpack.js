import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALL_42_LETTERS = [
  { char: 'А', f1: 750, f2: 1200, f3: 2400 },
  { char: 'Ә', f1: 680, f2: 1750, f3: 2500 },
  { char: 'Б', f1: 300, f2: 1100, f3: 2200 },
  { char: 'В', f1: 320, f2: 1300, f3: 2300 },
  { char: 'Г', f1: 350, f2: 1800, f3: 2500 },
  { char: 'Ғ', f1: 340, f2: 1150, f3: 2400 },
  { char: 'Д', f1: 320, f2: 1600, f3: 2450 },
  { char: 'Е', f1: 450, f2: 1900, f3: 2600 },
  { char: 'Ё', f1: 500, f2: 1300, f3: 2400 },
  { char: 'Ж', f1: 350, f2: 1700, f3: 2550 },
  { char: 'З', f1: 330, f2: 1650, f3: 2500 },
  { char: 'И', f1: 300, f2: 2200, f3: 2900 },
  { char: 'Й', f1: 320, f2: 2000, f3: 2700 },
  { char: 'К', f1: 350, f2: 1900, f3: 2600 },
  { char: 'Қ', f1: 310, f2: 1250, f3: 2350 },
  { char: 'Л', f1: 380, f2: 1300, f3: 2500 },
  { char: 'М', f1: 300, f2: 1200, f3: 2300 },
  { char: 'Н', f1: 310, f2: 1500, f3: 2400 },
  { char: 'Ң', f1: 290, f2: 2150, f3: 2900 },
  { char: 'О', f1: 520, f2: 950, f3: 2250 },
  { char: 'Ө', f1: 510, f2: 1390, f3: 2450 },
  { char: 'П', f1: 320, f2: 1200, f3: 2300 },
  { char: 'Р', f1: 350, f2: 1400, f3: 2400 },
  { char: 'С', f1: 340, f2: 1600, f3: 2600 },
  { char: 'Т', f1: 320, f2: 1700, f3: 2500 },
  { char: 'У', f1: 400, f2: 900, f3: 2200 },
  { char: 'Ұ', f1: 430, f2: 1040, f3: 2200 },
  { char: 'Ү', f1: 380, f2: 1650, f3: 2300 },
  { char: 'Ф', f1: 330, f2: 1400, f3: 2400 },
  { char: 'Х', f1: 420, f2: 1450, f3: 2400 },
  { char: 'Һ', f1: 450, f2: 1550, f3: 2500 },
  { char: 'Ц', f1: 340, f2: 1800, f3: 2600 },
  { char: 'Ч', f1: 350, f2: 1900, f3: 2650 },
  { char: 'Ш', f1: 360, f2: 1800, f3: 2550 },
  { char: 'Щ', f1: 360, f2: 1950, f3: 2700 },
  { char: 'Ъ', f1: 350, f2: 1200, f3: 2200 },
  { char: 'Ы', f1: 390, f2: 1100, f3: 2350 },
  { char: 'І', f1: 380, f2: 2000, f3: 2750 },
  { char: 'Ь', f1: 360, f2: 1800, f3: 2500 },
  { char: 'Э', f1: 480, f2: 1850, f3: 2550 },
  { char: 'Ю', f1: 420, f2: 1100, f3: 2200 },
  { char: 'Я', f1: 650, f2: 1300, f3: 2350 }
];

function generateFormantWav(f1, f2, f3, duration = 0.6, sampleRate = 22050) {
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const f0 = 150; // Pitch
  let offset = 44;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Attack-Decay envelope
    const attack = Math.min(1, t / 0.04);
    const decay = Math.exp(-2.8 * t);
    const env = attack * decay;

    // Acoustic formant summation
    const formant1 = Math.sin(2 * Math.PI * f1 * t) * 0.44;
    const formant2 = Math.sin(2 * Math.PI * f2 * t) * 0.32;
    const formant3 = Math.sin(2 * Math.PI * f3 * t) * 0.16;
    const voiceTone = (Math.sin(2 * Math.PI * f0 * t) + 0.4 * Math.sin(4 * Math.PI * f0 * t)) * 0.22;

    const sample = Math.max(-1, Math.min(1, (formant1 + formant2 + formant3 + voiceTone) * env));
    buffer.writeInt16LE(Math.floor(sample * 32767), offset);
    offset += 2;
  }

  return buffer;
}

function buildPack() {
  const outputDir = path.join(process.cwd(), 'public', 'audio', 'letters');
  fs.mkdirSync(outputDir, { recursive: true });

  let existingCount = 0;
  let generatedCount = 0;

  for (const item of ALL_42_LETTERS) {
    const code = item.char.charCodeAt(0);
    const targetFile = path.join(outputDir, `letter_${code}.wav`);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      existingCount++;
      continue;
    }

    const wavBuffer = generateFormantWav(item.f1, item.f2, item.f3);
    fs.writeFileSync(targetFile, wavBuffer);
    generatedCount++;
  }

  console.log(`Kazakh Soundpack Status: ${existingCount} existing studio clips retained, ${generatedCount} acoustic sound clips generated. Total: ${ALL_42_LETTERS.length} letters fully packaged.`);
}

buildPack();
