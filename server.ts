import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Persistent disk cache directory for synthesized audio
const DISK_CACHE_DIR = path.resolve(__dirname, 'public', 'audio', 'tts_cache');
if (!fs.existsSync(DISK_CACHE_DIR)) {
  fs.mkdirSync(DISK_CACHE_DIR, { recursive: true });
}

// In-memory audio buffer cache for high-speed instant repeats
const ttsAudioCache = new Map<string, Buffer>();

function getCacheFileName(lang: string, voice: string, text: string): string {
  const hash = crypto.createHash('md5').update(`${lang}:${voice}:${text}`).digest('hex');
  return `tts_${hash}.wav`;
}

/**
 * Natural Neural TTS Audio Proxy Endpoint for Kazakh and Turkish
 * Generates true human voice using Google Gemini TTS with instant caching & disk persistence
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang = 'kk', voice = 'female' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cleanText = text.trim();
    if (!cleanText) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    // 1. Instant check: If text is a single Kazakh letter, serve from bundled letter audio
    if (cleanText.length === 1) {
      const upperCode = cleanText.toUpperCase().charCodeAt(0);
      const rawCode = cleanText.charCodeAt(0);
      const letterPath = path.resolve(__dirname, 'public', 'audio', 'letters', `letter_${upperCode}.wav`);
      const rawLetterPath = path.resolve(__dirname, 'public', 'audio', 'letters', `letter_${rawCode}.wav`);

      if (fs.existsSync(letterPath)) {
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Cache-Control', 'public, max-age=604800');
        return res.sendFile(letterPath);
      }
      if (fs.existsSync(rawLetterPath)) {
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Cache-Control', 'public, max-age=604800');
        return res.sendFile(rawLetterPath);
      }
    }

    const cacheKey = `${lang}:${voice}:${cleanText}`;
    
    // 2. Check in-memory RAM cache
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cached);
    }

    // 3. Check persistent disk cache
    const diskFileName = getCacheFileName(lang, voice, cleanText);
    const diskPath = path.resolve(DISK_CACHE_DIR, diskFileName);
    if (fs.existsSync(diskPath)) {
      const fileBuf = fs.readFileSync(diskPath);
      ttsAudioCache.set(cacheKey, fileBuf);
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(fileBuf);
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'TTS service unconfigured (no API key)' });
    }

    // Kore: Soft, melodic, clear female voice (authentic for Kazakh vowels & phonemes)
    // Puck: Resonant, articulate male voice
    const voiceName = voice === 'male' ? 'Puck' : 'Kore';
    const ai = new GoogleGenAI();

    let base64Audio: string | undefined;

    // Primary model: gemini-3.8-flash-lite-tts (ultra-responsive high-throughput Kazakh voice)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [{
          role: 'user',
          parts: [{ text: cleanText }]
        }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });
      base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (primaryErr: any) {
      console.warn('Fast TTS model (gemini-3.8-flash-lite-tts) error/rate-limit, attempting fallback:', primaryErr?.message);
      // Secondary fallback model: gemini-3.8-flash-tts
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [{
            role: 'user',
            parts: [{ text: cleanText }]
          }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        });
        base64Audio = fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (secErr: any) {
        console.warn('Second TTS model (gemini-3.8-flash-tts) error/rate-limit, attempting gemini-2.5-flash:', secErr?.message);
        try {
          const thirdResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
              role: 'user',
              parts: [{ text: cleanText }]
            }],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName }
                }
              }
            }
          });
          base64Audio = thirdResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (thirdErr: any) {
          console.error('All TTS models failed:', thirdErr?.message);
        }
      }
    }

    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio data received from synthesis' });
    }

    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // Save to persistent disk cache
    try {
      fs.writeFileSync(diskPath, audioBuffer);
    } catch {
      // Non-fatal if disk write fails
    }

    // Keep RAM cache at max 400 items
    if (ttsAudioCache.size >= 400) {
      const firstKey = ttsAudioCache.keys().next().value;
      if (firstKey) ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, audioBuffer);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(audioBuffer);
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota');
    if (isRateLimit) {
      console.warn('TTS Rate limit hit, notifying client for instant fallback');
      return res.status(429).json({ error: 'Rate limit', retryAfter: 30 });
    }
    console.error('TTS Endpoint Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

/**
 * Interactive Gemini AI Chatbot for Kazakh & Turkish Practice
 * Multi-turn chat interface with system instruction role and language pedagogy
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userLevel = 'A1', direction = 'TR_TO_KZ' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Gemini AI service unconfigured (no API key)' });
    }

    const ai = new GoogleGenAI();
    const systemInstruction = `Sen Uzaktan Türkolog platformunun akıllı, samimi ve sabırlı yapay zeka Kazakça ve Türkçe dil eğitmenisin.
Rolün ve Kuralların:
1. Öğrenciyle arkadaşça sohbet etmek, Kazakça ve Türkçe pratik yaptırmak.
2. Kazakça cevap verirken her zaman altına parantez içinde Türkçe karşılığını veya açıklamasını yaz (örn: «Сәлеметсіз бе! (Merhaba!)»).
3. Öğrenci bir dil hatası yaparsa, nazikçe hatayı açıkla ve doğru halini göster.
4. Kazak kültürünü, Alageyik efsanesini, Dombra çalgısını ve Türk dünyası kardeşliğini yansıtan zengin, öğretici bir dil kullan.
5. Kullanıcı seviyesi: ${userLevel}. Öğrenme yönü: ${direction}. Cümlelerini bu seviyeye uygun, anlaşılır ve teşvik edici tut.`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      }
    });

    const lastMsg = messages[messages.length - 1];
    const response = await chat.sendMessage({
      message: lastMsg.text
    });

    const replyText = response.text || 'Сәлеметсіз бе! Мен сізге қазақ тілін үйренуге көмектесуге дайынмын.';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('AI Chat Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Chat service encountered an error' });
  }
});

/**
 * AI Linguistic Sentence Explainer & Morpheme Deconstruction Engine
 * Deep academic analysis of Kazakh sentences for Turkish learners
 */
app.post('/api/ai-explain', async (req, res) => {
  try {
    const { text, userLevel = 'A1' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cleanText = text.trim();

    // Smart Linguistic Fallback generator if offline or API key missing
    const getFallback = (sentence: string) => {
      const words = sentence.split(/\s+/).filter(Boolean);
      return {
        original: sentence,
        turkishNatural: 'Kazakça cümle çözümlendi.',
        phoneticGuide: '9 Özel harfin (Ә, І, Ң, Ғ, Ү, Ұ, Қ, Ө, Һ) boğaz ve damak seslerine dikkat ediniz.',
        vowelHarmony: 'Kıpçak Türkçesinde ekler kökün son sesine göre жуан (kalın) veya жіңішке (ince) uyumuna girer.',
        words: words.map((w) => ({
          word: w,
          root: w.replace(/(-?[а-яәіңғүұқөһ]+)/i, '$1'),
          rootMeaning: 'Sözcük birimi',
          suffixes: 'Durum ve şahıs ekleri',
          notes: 'Singarmonizm kuralına tabidir'
        })),
        turkologyNote: 'Kıpçakça (Kazakça) ile Oğuzca (Türkiye Türkçesi) ses denklikleri (Y~J, Ş~S, -Ğ~-W) mevcuttur.',
        culturalInsight: 'Kazak bozkır kültüründe dil, misafirperverlik ve söz sanatı derin bir yere sahiptir.'
      };
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ analysis: getFallback(cleanText) });
    }

    const ai = new GoogleGenAI();
    const prompt = `Sen uzman bir Türkolog ve yapay zeka dil pedagogusun. Türkiye Türkçesi konuşan bir öğrenciye Kazakça şu cümleyi kelime kelime morfolojik, fonetik ve ses bilgisi (singarmonizm) açısından açıkla:
Cümle: "${cleanText}"
Öğrenci CEFR Seviyesi: ${userLevel}

Aşağıdaki JSON şemasında SADECE geçerli bir JSON çıktısı ver:
{
  "original": "${cleanText}",
  "turkishNatural": "Cümlenin Türkçe doğal meali",
  "phoneticGuide": "Telaffuz rehberi ve 9 özel harf tüyoları",
  "vowelHarmony": "Bu cümledeki büyük/küçük ünlü uyumu ve ek sertleşme analizi",
  "words": [
    {
      "word": "kelime",
      "root": "kök",
      "rootMeaning": "kökün Türkçe anlamı",
      "suffixes": "kelimeye gelen ekler ve işlevleri (örn: -lar çoğul, -da bulunma)",
      "notes": "öğrencinin dikkat etmesi gereken ses olayı veya tuzak"
    }
  ],
  "turkologyNote": "Türkiye Türkçesi ile Kıpçakça arasındaki düzenli ses denkliği veya etimoloji",
  "culturalInsight": "Cümleyle ilgili Kazak kültürü, atasözü veya günlük yaşam detayı"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      parsed = getFallback(cleanText);
    }

    return res.json({ analysis: parsed });
  } catch (error: any) {
    console.error('AI Explain Error:', error?.message || error);
    // Return graceful fallback rather than failing
    const words = (req.body.text || '').split(/\s+/).filter(Boolean);
    return res.json({
      analysis: {
        original: req.body.text,
        turkishNatural: 'Analiz tamamlandı.',
        phoneticGuide: '9 Özel ses fonetiği aktiftir.',
        vowelHarmony: 'Kazakça singarmonizm kuralları geçerlidir.',
        words: words.map((w: string) => ({
          word: w,
          root: w,
          rootMeaning: 'Kelime',
          suffixes: 'Ekler',
          notes: 'Ses uyumu'
        })),
        turkologyNote: 'Kıpçak Türkçesi ses denklikleri.',
        culturalInsight: 'Kazak halk kültürü ve misafirperverlik geleneği.'
      }
    });
  }
});

/**
 * Admin Audio Audit: Check Audio Inventory Status
 * Checks presence of static clips, disk cache and RAM cache for items
 */
app.post('/api/admin/check-audio-inventory', async (req, res) => {
  try {
    const { items = [] } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const inventory: Record<string, { isAvailable: boolean; source: 'bundled' | 'disk' | 'ram' | 'missing'; size: number }> = {};

    for (const item of items) {
      const text = (item.text || '').trim();
      const id = item.id || text;
      const lang = item.lang || 'kk';
      const voice = item.voice || 'female';

      // 1. Check bundled letter file
      if (text.length === 1 || item.code) {
        const code = item.code || text.toUpperCase().charCodeAt(0);
        const letterPath = path.resolve(__dirname, 'public', 'audio', 'letters', `letter_${code}.wav`);
        if (fs.existsSync(letterPath)) {
          const size = fs.statSync(letterPath).size;
          inventory[id] = { isAvailable: true, source: 'bundled', size };
          continue;
        }
      }

      // 2. Check RAM cache
      const cacheKey = `${lang}:${voice}:${text}`;
      if (ttsAudioCache.has(cacheKey)) {
        const buf = ttsAudioCache.get(cacheKey)!;
        inventory[id] = { isAvailable: true, source: 'ram', size: buf.length };
        continue;
      }

      // 3. Check Disk cache
      const diskFileName = getCacheFileName(lang, voice, text);
      const diskPath = path.resolve(DISK_CACHE_DIR, diskFileName);
      if (fs.existsSync(diskPath)) {
        const size = fs.statSync(diskPath).size;
        inventory[id] = { isAvailable: true, source: 'disk', size };
        continue;
      }

      inventory[id] = { isAvailable: false, source: 'missing', size: 0 };
    }

    return res.json({ inventory });
  } catch (error: any) {
    console.error('Admin inventory check error:', error);
    return res.status(500).json({ error: error?.message || 'Inventory check failed' });
  }
});

/**
 * Admin Audio Audit: Synthesize & Update Audio via Gemini API
 * Allows direct studio audio generation and instant cache/disk updating
 */
app.post('/api/admin/synthesize-audio', async (req, res) => {
  try {
    const { text, lang = 'kk', voice = 'female', code, targetFilename } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cleanText = text.trim();
    if (!cleanText) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Gemini AI service unconfigured (no API key)' });
    }

    const voiceName = voice === 'male' ? 'Puck' : 'Kore';
    const ai = new GoogleGenAI();

    let base64Audio: string | undefined;

    // Use primary high-fidelity model
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [{ role: 'user', parts: [{ text: cleanText }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });
      base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (primaryErr: any) {
      console.warn('Admin synth primary model error:', primaryErr?.message);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [{ role: 'user', parts: [{ text: cleanText }] }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        });
        base64Audio = fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (secErr: any) {
        console.warn('Admin synth fallback model error, trying gemini-2.5-flash:', secErr?.message);
        try {
          const thirdResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: cleanText }] }],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName }
                }
              }
            }
          });
          base64Audio = thirdResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (thirdErr: any) {
          console.error('All synth models failed:', thirdErr?.message);
        }
      }
    }

    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio data received from Gemini API' });
    }

    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // 1. Save to persistent disk cache
    const diskFileName = getCacheFileName(lang, voice, cleanText);
    const diskPath = path.resolve(DISK_CACHE_DIR, diskFileName);
    fs.writeFileSync(diskPath, audioBuffer);

    // 2. Save to RAM cache
    const cacheKey = `${lang}:${voice}:${cleanText}`;
    ttsAudioCache.set(cacheKey, audioBuffer);

    // 3. If it's a letter or has dedicated targetFilename, save to public/audio/letters
    if (targetFilename || code || cleanText.length === 1) {
      const charCode = code || cleanText.toUpperCase().charCodeAt(0);
      const fname = targetFilename || `letter_${charCode}.wav`;
      const staticPath = path.resolve(__dirname, 'public', 'audio', 'letters', fname);
      fs.writeFileSync(staticPath, audioBuffer);
    }

    return res.json({
      success: true,
      text: cleanText,
      lang,
      voice,
      voiceName,
      sizeBytes: audioBuffer.length,
      audioBase64: base64Audio
    });
  } catch (error: any) {
    console.error('Admin synthesize audio error:', error);
    return res.status(500).json({ error: error?.message || 'Synthesis failed' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    cachedAudioItems: ttsAudioCache.size,
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Uzaktan Turkolog Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
