import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const SPECIAL_9 = [
  { char: 'Ә', word: 'Әке', code: 1240 },
  { char: 'Ғ', word: 'Ғалым', code: 1170 },
  { char: 'Қ', word: 'Қазақ', code: 1178 },
  { char: 'Ң', word: 'Мың', code: 1186 },
  { char: 'Ө', word: 'Өмір', code: 1256 },
  { char: 'Ұ', word: 'Ұл', code: 1200 },
  { char: 'Ү', word: 'Үй', code: 1202 },
  { char: 'Һ', word: 'Қаһарман', code: 1210 },
  { char: 'І', word: 'Іні', code: 1030 }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function generateSpecial9() {
  const outputDir = path.join(process.cwd(), 'public', 'audio', 'letters');
  fs.mkdirSync(outputDir, { recursive: true });
  const ai = new GoogleGenAI();

  console.log('Generating authentic native audio for 9 Special Kazakh letters...');

  for (const item of SPECIAL_9) {
    const targetFile = path.join(outputDir, `letter_${item.code}.wav`);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      console.log(`Letter ${item.char} (${item.code}) already exists.`);
      continue;
    }

    let success = false;
    let attempts = 0;

    while (!success && attempts < 5) {
      attempts++;
      try {
        console.log(`Generating ${item.char} (word: ${item.word}, attempt ${attempts})...`);
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [{
            role: 'user',
            parts: [{ text: `${item.char}. ${item.word}.` }]
          }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }
              }
            }
          }
        });

        const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          fs.writeFileSync(targetFile, Buffer.from(b64, 'base64'));
          console.log(`SUCCESS: Saved ${item.char} -> ${targetFile} (${fs.statSync(targetFile).size} bytes)`);
          success = true;
          // Wait 22 seconds to respect Free Tier 3 RPM limit (60s / 3 = 20s)
          await sleep(22000);
        } else {
          console.warn(`No audio in response for ${item.char}`);
          await sleep(10000);
        }
      } catch (err) {
        console.warn(`Attempt ${attempts} failed for ${item.char}: ${err.message}. Waiting 15s...`);
        await sleep(15000);
      }
    }
  }

  console.log('Finished 9 Special Kazakh letters generation.');
}

generateSpecial9().catch(console.error);
