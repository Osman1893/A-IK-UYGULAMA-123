import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const LETTERS_TO_FINISH = [
  { char: 'П', word: 'Піл', code: 1055 },
  { char: 'Р', word: 'Рахмет', code: 1056 },
  { char: 'С', word: 'Су', code: 1057 },
  { char: 'Т', word: 'Тау', code: 1058 },
  { char: 'У', word: 'Уақыт', code: 1059 },
  { char: 'Ш', word: 'Шәй', code: 1064 },
  { char: 'Щ', word: 'Щетка', code: 1065 },
  { char: 'Ы', word: 'Ыдыс', code: 1067 },
  { char: 'Э', word: 'Экран', code: 1069 },
  { char: 'Ю', word: 'Аю', code: 1070 },
  { char: 'Я', word: 'Аяқ', code: 1071 }
];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function synthesizeWithFallback(ai, text) {
  // Try flash-tts first, then flash-lite-tts
  const models = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (b64) return Buffer.from(b64, 'base64');
    } catch (e) {
      console.warn(`Model ${model} failed for «${text}»:`, e.message?.slice(0, 80));
    }
  }
  return null;
}

async function run() {
  const ai = new GoogleGenAI();
  const dir = path.resolve('public', 'audio', 'letters');

  for (const item of LETTERS_TO_FINISH) {
    const target = path.resolve(dir, `letter_${item.code}.wav`);
    console.log(`Processing ${item.char} (${item.code})...`);

    let buf = null;
    let attempts = 0;
    while (!buf && attempts < 5) {
      attempts++;
      buf = await synthesizeWithFallback(ai, `${item.char}. ${item.word}.`);
      if (!buf) {
        console.log(`Attempt ${attempts} failed for ${item.char}, waiting 10s...`);
        await sleep(10000);
      }
    }

    if (buf) {
      fs.writeFileSync(target, buf);
      console.log(`SUCCESS: Saved letter_${item.code}.wav (${buf.length} bytes)`);
    } else {
      console.error(`FAILED to generate ${item.char} after ${attempts} attempts`);
    }

    // Free tier spacing
    await sleep(4000);
  }

  // Also create lowercase copies / symlinks so uppercase & lowercase codes work
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (!f.startsWith('letter_') || !f.endsWith('.wav')) continue;
    const code = parseInt(f.replace('letter_', '').replace('.wav', ''), 10);
    const char = String.fromCharCode(code);
    const lower = char.toLowerCase();
    const lowerCode = lower.charCodeAt(0);
    if (lowerCode !== code) {
      const lowerFile = path.resolve(dir, `letter_${lowerCode}.wav`);
      if (!fs.existsSync(lowerFile)) {
        fs.copyFileSync(path.resolve(dir, f), lowerFile);
      }
    }
  }

  console.log('All letters are finalized and synchronized!');
}

run().catch(console.error);
