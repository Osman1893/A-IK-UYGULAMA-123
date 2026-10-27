import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LETTERS_DATA = [
  { char: 'А', example: 'Ана' },
  { char: 'Ә', example: 'Әке' },
  { char: 'Б', example: 'Бала' },
  { char: 'В', example: 'Вагон' },
  { char: 'Г', example: 'Гүл' },
  { char: 'Ғ', example: 'Ғалым' },
  { char: 'Д', example: 'Дос' },
  { char: 'Е', example: 'Есік' },
  { char: 'Ё', example: 'Ёлка' },
  { char: 'Ж', example: 'Жол' },
  { char: 'З', example: 'Заман' },
  { char: 'И', example: 'Ит' },
  { char: 'Й', example: 'Ай' },
  { char: 'К', example: 'Көз' },
  { char: 'Қ', example: 'Қазақ' },
  { char: 'Л', example: 'Лашық' },
  { char: 'М', example: 'Мектеп' },
  { char: 'Н', example: 'Нан' },
  { char: 'Ң', example: 'Мың' },
  { char: 'О', example: 'Отан' },
  { char: 'Ө', example: 'Өмір' },
  { char: 'П', example: 'Піл' },
  { char: 'Р', example: 'Рахмет' },
  { char: 'С', example: 'Су' },
  { char: 'Т', example: 'Тау' },
  { char: 'У', example: 'Уақыт' },
  { char: 'Ұ', example: 'Ұл' },
  { char: 'Ү', example: 'Үй' },
  { char: 'Ф', example: 'Фото' },
  { char: 'Х', example: 'Хат' },
  { char: 'Һ', example: 'Қаһарман' },
  { char: 'Ц', example: 'Цирк' },
  { char: 'Ч', example: 'Чек' },
  { char: 'Ш', example: 'Шәй' },
  { char: 'Щ', example: 'Щетка' },
  { char: 'Ъ', example: 'Съезд' },
  { char: 'Ы', example: 'Ыдыс' },
  { char: 'І', example: 'Іні' },
  { char: 'Ь', example: 'Лагерь' },
  { char: 'Э', example: 'Экран' },
  { char: 'Ю', example: 'Аю' },
  { char: 'Я', example: 'Аяқ' }
];

async function generateAll() {
  const outputDir = path.join(process.cwd(), 'public', 'audio', 'letters');
  fs.mkdirSync(outputDir, { recursive: true });

  const ai = new GoogleGenAI();
  console.log(`Starting generation for ${LETTERS_DATA.length} Kazakh alphabet letters...`);

  for (let i = 0; i < LETTERS_DATA.length; i++) {
    const item = LETTERS_DATA[i];
    const code = item.char.charCodeAt(0);
    const targetFile = path.join(outputDir, `letter_${code}.wav`);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      console.log(`[${i + 1}/${LETTERS_DATA.length}] ${item.char} already exists (${fs.statSync(targetFile).size} bytes)`);
      continue;
    }

    try {
      const phrase = `${item.char}. ${item.example}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [{
          role: 'user',
          parts: [{ text: phrase }]
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
        console.log(`[${i + 1}/${LETTERS_DATA.length}] Generated ${item.char} -> letter_${code}.wav (${fs.statSync(targetFile).size} bytes)`);
      } else {
        console.warn(`[${i + 1}/${LETTERS_DATA.length}] No audio returned for ${item.char}`);
      }
    } catch (err) {
      console.error(`Error generating ${item.char}:`, err.message);
    }
  }

  console.log('Finished Kazakh alphabet audio pack generation.');
}

generateAll().catch(console.error);
