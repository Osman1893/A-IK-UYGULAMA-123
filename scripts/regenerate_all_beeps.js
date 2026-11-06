import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const LETTERS_TO_REPLACE = [
  { char: 'П', word: 'Піл', code: 1055 },
  { char: 'Р', word: 'Рахмет', code: 1056 },
  { char: 'С', word: 'Су', code: 1057 },
  { char: 'Т', word: 'Тау', code: 1058 },
  { char: 'У', word: 'Уақыт', code: 1059 },
  { char: 'Ф', word: 'Фото', code: 1060 },
  { char: 'Х', word: 'Хат', code: 1061 },
  { char: 'Ц', word: 'Цирк', code: 1062 },
  { char: 'Ч', word: 'Чек', code: 1063 },
  { char: 'Ш', word: 'Шәй', code: 1064 },
  { char: 'Щ', word: 'Щетка', code: 1065 },
  { char: 'Ы', word: 'Ыдыс', code: 1067 },
  { char: 'Э', word: 'Экран', code: 1069 },
  { char: 'Ю', word: 'Аю', code: 1070 },
  { char: 'Я', word: 'Аяқ', code: 1071 }
];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const ai = new GoogleGenAI();
  const dir = path.resolve('public', 'audio', 'letters');

  console.log(`Starting real Gemini AI synthesis for ${LETTERS_TO_REPLACE.length} letters...`);

  for (const item of LETTERS_TO_REPLACE) {
    const targetFile = path.resolve(dir, `letter_${item.code}.wav`);
    console.log(`Synthesizing ${item.char} (${item.code}) with example «${item.word}»...`);

    try {
      const res = await ai.models.generateContent({
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

      const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (b64) {
        const buf = Buffer.from(b64, 'base64');
        fs.writeFileSync(targetFile, buf);
        console.log(`SUCCESS: Replaced letter_${item.code}.wav (${buf.length} bytes)`);
      } else {
        console.warn(`No audio returned for ${item.char}`);
      }
    } catch (err) {
      console.error(`Error synthesizing ${item.char}:`, err.message);
    }

    // Small delay between calls
    await sleep(1500);
  }

  console.log('All remaining letter audio files successfully synthesized with Gemini AI!');
}

main().catch(console.error);
