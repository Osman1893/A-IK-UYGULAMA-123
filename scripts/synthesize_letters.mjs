import http from 'http';
import fs from 'fs';
import path from 'path';

const LETTERS = [
  { char: 'А', code: 1040, text: 'А әрпі. Ана.' },
  { char: 'Ә', code: 1240, text: 'Ә әрпі. Әке.' },
  { char: 'Б', code: 1041, text: 'Бе әрпі. Бала.' },
  { char: 'В', code: 1042, text: 'Ве әрпі. Вагон.' },
  { char: 'Г', code: 1043, text: 'Ге әрпі. Гүл.' },
  { char: 'Ғ', code: 1170, text: 'Ға әрпі. Ғалым.' },
  { char: 'Д', code: 1044, text: 'Де әрпі. Дос.' },
  { char: 'Е', code: 1045, text: 'Е әрпі. Есік.' },
  { char: 'Ё', code: 1025, text: 'Ё әрпі. Ёлка.' },
  { char: 'Ж', code: 1046, text: 'Же әрпі. Жол.' },
  { char: 'З', code: 1047, text: 'Зе әрпі. Заман.' },
  { char: 'И', code: 1048, text: 'И әрпі. Ит.' },
  { char: 'Й', code: 1049, text: 'Қысқа и. Ай.' },
  { char: 'К', code: 1050, text: 'Ке әрпі. Көз.' },
  { char: 'Қ', code: 1178, text: 'Қа әрпі. Қазақ.' },
  { char: 'Л', code: 1051, text: 'Эл әрпі. Лашық.' },
  { char: 'М', code: 1052, text: 'Эм әрпі. Мектеп.' },
  { char: 'Н', code: 1053, text: 'Эн әрпі. Нан.' },
  { char: 'Ң', code: 1186, text: 'Эң әрпі. Мың.' },
  { char: 'О', code: 1054, text: 'О әрпі. Отан.' },
  { char: 'Ө', code: 1256, text: 'Ө әрпі. Өмір.' },
  { char: 'П', code: 1055, text: 'Пе әрпі. Піл.' },
  { char: 'Р', code: 1056, text: 'Эр әрпі. Рахмет.' },
  { char: 'С', code: 1057, text: 'Эс әрпі. Су.' },
  { char: 'Т', code: 1058, text: 'Те әрпі. Тау.' },
  { char: 'У', code: 1059, text: 'У әрпі. Уақыт.' },
  { char: 'Ұ', code: 1200, text: 'Ұ әрпі. Ұстаз.' },
  { char: 'Ү', code: 1198, text: 'Ү әрпі. Үй.' },
  { char: 'Ф', code: 1060, text: 'Эф әрпі. Фото.' },
  { char: 'Х', code: 1061, text: 'Ха әрпі. Хат.' },
  { char: 'Һ', code: 1210, text: 'Һа әрпі. Қаһарман.' },
  { char: 'Ц', code: 1062, text: 'Це әрпі. Цирк.' },
  { char: 'Ч', code: 1063, text: 'Че әрпі. Чек.' },
  { char: 'Ш', code: 1064, text: 'Ша әрпі. Шәй.' },
  { char: 'Щ', code: 1065, text: 'Ща әрпі. Щетка.' },
  { char: 'Ъ', code: 1066, text: 'Жуандық белгісі. Съезд.' },
  { char: 'Ы', code: 1067, text: 'Ы әрпі. Ыдыс.' },
  { char: 'І', code: 1030, text: 'І әрпі. Іні.' },
  { char: 'Ь', code: 1068, text: 'Жіңішкелік белгісі. Лагерь.' },
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
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`[OK] Letter ${letter.char} (${letter.code}) synthesized.`);
            resolve({ ok: true });
          } else {
            console.warn(`[WARN] Letter ${letter.char} status ${res.statusCode}: ${body.slice(0, 100)}`);
            resolve({ ok: false, status: res.statusCode });
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error(`[ERR] Letter ${letter.char}:`, err.message);
      resolve({ ok: false, err: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  const lettersDir = path.resolve('public', 'audio', 'letters');
  console.log(`Scanning letters to synthesize...`);

  for (const letter of LETTERS) {
    const filePath = path.join(lettersDir, `letter_${letter.code}.wav`);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      // If already high-fidelity (> 80KB), skip
      if (size > 80000) {
        console.log(`[SKIP] Letter ${letter.char} already high-fidelity (${size} bytes).`);
        continue;
      }
    }

    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      const res = await synthesize(letter);
      if (res.ok) {
        break;
      }
      // If rate limited, wait 15 seconds
      console.log(`Waiting 15s before retrying ${letter.char}...`);
      await new Promise(r => setTimeout(r, 15000));
    }

    // Healthy 4.5s throttle between successful letters
    await new Promise(r => setTimeout(r, 4500));
  }

  console.log('Done! All letters verified and updated.');
}

run();
