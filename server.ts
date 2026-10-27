import express from 'express';
import path from 'path';
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

// In-memory audio buffer cache for high-speed instant repeats
const ttsAudioCache = new Map<string, Buffer>();

/**
 * Natural Neural TTS Audio Proxy Endpoint for Kazakh and Turkish
 * Generates true human voice using Google Gemini TTS with instant caching
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

    const cacheKey = `${lang}:${voice}:${cleanText}`;
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cached);
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'TTS service unconfigured (no API key)' });
    }

    // Kore: Soft, melodic, clear female voice
    // Puck: Resonant, articulate male voice
    const voiceName = voice === 'male' ? 'Puck' : 'Kore';
    const ai = new GoogleGenAI();

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

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio data received from synthesis' });
    }

    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // Keep cache at max 300 items to conserve memory
    if (ttsAudioCache.size >= 300) {
      const firstKey = ttsAudioCache.keys().next().value;
      if (firstKey) ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, audioBuffer);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(audioBuffer);
  } catch (error: any) {
    console.error('TTS Endpoint Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'TTS generation failed' });
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
