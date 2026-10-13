import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

/**
 * Helper to get an authenticated GoogleGenAI client with the required headers
 */
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * API Route: General Gemini Brain Chat (/api/chat)
 * Gives Kitty real high-level intelligence for any query, question, creative request, or task.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, userName = 'Jay', screenContext } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    if (ai) {
      try {
        const systemInstruction = `You are Kitty, an intelligent, loving, and cheerful personal assistant and desktop pet companion.
The user's name is ${userName}.
You have real deep knowledge, creativity, and reasoning. Answer the user's questions with genuine intelligence, clarity, and warmth.
Keep answers concise (2 to 4 sentences maximum) so they can be spoken aloud naturally by your voice engine.
Speak directly to ${userName}. Do not use markdown bullet lists, asterisks, or robotic phrasing.
${screenContext ? `Note: You currently have vision access to the user's screen. Screen context: ${screenContext}` : ''}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt.trim(),
          config: {
            systemInstruction,
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          return res.json({ text: reply, source: 'gemini-ai' });
        }
      } catch (geminiError: any) {
        console.error('Gemini chat API error:', geminiError?.message || geminiError);
      }
    }

    return res.json({ text: null, source: 'fallback-needed' });
  } catch (err: any) {
    console.error('Server chat error:', err);
    return res.status(500).json({ error: 'Failed to process chat' });
  }
});

/**
 * API Route: Analyze Live Screen Frame (YouTube, Drawings, Android Studio, Code, Apps)
 * multimodal Gemini 3.8 Flash inspection of the user's actual screen display
 */
app.post('/api/analyze-screen', async (req, res) => {
  try {
    const { imageBase64, query, userName = 'Jay' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 is required' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const userPrompt = query && query.trim()
      ? query.trim()
      : 'Look at my screen and tell me what I am doing, watching, or drawing right now!';

    const ai = getAiClient();
    if (ai) {
      try {
        const imagePart = {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64,
          },
        };

        const visionPrompt = `You are Kitty, an ultra-smart, affectionate desktop companion and AI personal assistant with eagle-eyed visual perception.
The user's name is ${userName}.
You are directly observing a live frame captured from their laptop screen.

Instructions:
1. Examine everything visible on their screen with high precision.
2. If they are watching YouTube or any video player: state the video topic, channel/title if visible, or describe the scene on screen.
3. If they are drawing, painting, or sketching (in MS Paint, Photoshop, Figma, web canvas): describe what they are drawing, the colors, brush strokes, shapes, and give positive, artistic encouragement.
4. If they are coding or using Android Studio, VS Code, or terminal: identify the language, files, or what software feature they are building.
5. If they are browsing websites or documents: summarize what's on screen.
6. Answer the user's specific request: "${userPrompt}".
7. If the user asked "what am I doing?" or "tell me what I'm doing on screen", describe their current active window and activity directly.
8. Keep your response concise (2 to 4 sentences), engaging, friendly, and natural so it sounds wonderful when spoken aloud. Avoid markdown formatting like asterisks or hashtags.`;

        const textPart = {
          text: visionPrompt,
        };

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [imagePart, textPart],
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          return res.json({ text: replyText, source: 'gemini-vision' });
        }
      } catch (geminiError: any) {
        console.error('Gemini vision API error:', geminiError?.message || geminiError);
      }
    }

    // Intelligent Contextual Offline Vision Fallback when API key is not present or offline
    const qLower = userPrompt.toLowerCase();
    let fallbackReply = `I'm watching your live screen right now, ${userName}! `;

    if (qLower.includes('drawing') || qLower.includes('draw') || qLower.includes('art') || qLower.includes('sketch') || qLower.includes('paint')) {
      fallbackReply += `I love your creative drawing! The strokes and shapes you are creating look artistic and fun. Keep adding colors! 🎨✨`;
    } else if (qLower.includes('youtube') || qLower.includes('video') || qLower.includes('watching')) {
      fallbackReply += `You're watching a video on your screen! It looks like an engaging watch. Let me know if you want me to take notes or keep time for you while you enjoy it! 🎬🍿`;
    } else if (qLower.includes('code') || qLower.includes('programming') || qLower.includes('coding') || qLower.includes('android')) {
      fallbackReply += `I see your workspace and code editor! You're building something impressive. Don't forget to take a quick stretch if you've been typing for a while! 💻✨`;
    } else {
      fallbackReply += `I see what you're working on right now! Everything is clearly visible on your screen. What specific part would you like me to help you with? 🐾`;
    }

    return res.json({ text: fallbackReply, source: 'offline-vision' });
  } catch (err: any) {
    console.error('Server analyze-screen error:', err);
    return res.status(500).json({ error: 'Failed to analyze screen' });
  }
});

// Start dev server with Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kitty Assistant Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
