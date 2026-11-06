import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const SPECIAL_9 = [
  { char: 'Ә', code: 1240, text: 'Ә. Әке.' },
  { char: 'І', code: 1030, text: 'І. Іні.' },
  { char: 'Ң', code: 1186, text: 'Ң. Жаңа, мың.' },
  { char: 'Ғ', code: 1170, text: 'Ғ. Ғалым.' },
  { char: 'Ү', code: 1198, text: 'Ү. Үй.' },
  { char: 'Ұ', code: 1200, text: 'Ұ. Ұл.' },
  { char: 'Қ', code: 1178, text: 'Қ. Қазақ.' },
  { char: 'Ө', code: 1256, text: 'Ө. Өмір.' },
  { char: 'Һ', code: 1210, text: 'Һ. Қаһарман.' }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function main() {
  const outputDir = path.join(process.cwd(), 'public', 'audio', 'letters');
  fs.mkdirSync(outputDir, { recursive: true });
  const ai = new GoogleGenAI();

  console.log('--- Generating Studio Audio for 9 Kazakh Special Letters with Gemini AI ---');

  for (const item of SPECIAL_9) {
    const targetFile = path.join(outputDir, `letter_${item.code}.wav`);

    // If file exists and is authentic studio audio (>50KB, not the 19KB/26KB formant synth)
    if (fs.existsSync(targetFile)) {
      const size = fs.statSync(targetFile).size;
      if (size > 50000 && item.char !== 'І' && item.char !== 'Ү' && item.char !== 'Һ') {
        console.log(`Letter ${item.char} (${item.code}) is already studio quality (${size} bytes). Skipping.`);
        continue;
      }
    }

    let success = false;
    let attempts = 0;

    while (!success && attempts < 5) {
      attempts++;
      try {
        console.log(`[${item.char}] Requesting TTS from gemini-3.8-flash-tts for "${item.text}" (attempt ${attempts})...`);
        const res = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [{ role: 'user', parts: [{ text: item.text }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }
              }
            }
          }
        });

        const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          const buffer = Buffer.from(b64, 'base64');
          fs.writeFileSync(targetFile, buffer);
          console.log(`[${item.char}] SUCCESS: Saved ${targetFile} (${buffer.length} bytes)`);
          success = true;
          // Wait 22 seconds to respect 3 RPM limit
          console.log('Waiting 22s for next request...');
          await sleep(22000);
        } else {
          console.warn(`[${item.char}] No audio returned, retrying in 10s...`);
          await sleep(10000);
        }
      } catch (err) {
        console.warn(`[${item.char}] Error: ${err.message}. Waiting 22s before retry...`);
        await sleep(22000);
      }
    }
  }

  console.log('--- Completed All 9 Kazakh Special Letters Generation ---');
}

main().catch(console.error);
