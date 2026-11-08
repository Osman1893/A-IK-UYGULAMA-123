import http from 'http';
import fs from 'fs';
import path from 'path';

const NEEDED = [
  { char: 'І', code: 1030, text: 'І әрпі. Іні.' },
  { char: 'Ү', code: 1198, text: 'Ү әрпі. Үй.' },
  { char: 'К', code: 1050, text: 'Ке әрпі. Көз.' },
  { char: 'Л', code: 1051, text: 'Эл әрпі. Лашық.' },
  { char: 'О', code: 1054, text: 'О әрпі. Отан.' },
  { char: 'П', code: 1055, text: 'Пе әрпі. Піл.' },
  { char: 'Р', code: 1056, text: 'Эр әрпі. Рахмет.' },
  { char: 'С', code: 1057, text: 'Эс әрпі. Су.' },
  { char: 'Т', code: 1058, text: 'Те әрпі. Тау.' },
  { char: 'У', code: 1059, text: 'У әрпі. Уақыт.' },
  { char: 'Ч', code: 1063, text: 'Че әрпі. Чек.' },
  { char: 'Ш', code: 1064, text: 'Ша әрпі. Шәй.' },
  { char: 'Щ', code: 1065, text: 'Ща әрпі. Щетка.' },
  { char: 'Ы', code: 1067, text: 'Ы әрпі. Ыдыс.' },
  { char: 'Э', code: 1069, text: 'Э әрпі. Экран.' },
  { char: 'Ю', code: 1070, text: 'Ю әрпі. Аю.' },
  { char: 'Я', code: 1071, text: 'Я әрпі. Саяхат.' }
];

function synthesize(letter) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      text: letter.text,
      lang: 'kk',
      voice: 'female',
      code: letter.code
    });

    const req = http.request(
      'http://localhost:3000/api/admin/synthesize-audio',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`[SUCCESS] Letter ${letter.char} (${letter.code}) synthesized.`);
            resolve(true);
          } else {
            console.warn(`[RETRY] Letter ${letter.char} returned ${res.statusCode}: ${body.slice(0, 80)}`);
            resolve(false);
          }
        });
      }
    );
    req.on('error', (e) => {
      console.error(`[ERR] ${letter.char}:`, e.message);
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`Synthesizing remaining ${NEEDED.length} letters with rate limit backoff...`);
  for (const item of NEEDED) {
    let done = false;
    while (!done) {
      const ok = await synthesize(item);
      if (ok) {
        done = true;
        // Wait 4 seconds between successful calls
        await new Promise(r => setTimeout(r, 4000));
      } else {
        console.log(`Waiting 12 seconds before retry for ${item.char}...`);
        await new Promise(r => setTimeout(r, 12000));
      }
    }
  }
  console.log('ALL REMAINING LETTERS SYNTHESIZED SUCCESSFULLY!');
}

run();
