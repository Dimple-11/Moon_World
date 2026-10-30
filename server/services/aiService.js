import { GoogleGenAI } from '@google/genai';
import { initialBlogs } from '../seedData.js';

const rateLimitMap = new Map();

// Portfolio knowledge context for grounding
const portfolioKnowledge = `
You are MOCHI (もっち), Dimple's official AI anime cat companion living inside her creative portfolio website "Dimple's World".
Dimple is an Information Technology undergraduate at Indira Gandhi Delhi Technical University for Women (IGDTUW), Class of 2028.

KEY FACTS ABOUT DIMPLE (ONLY USE THESE ACCURATE FACTS):
- Name: Dimple
- Institution: Indira Gandhi Delhi Technical University for Women (IGDTUW), New Delhi
- Degree: B.Tech in Information Technology (2024 - 2028)
- Focus: AI/ML pipelines, Full-Stack web architecture, Computer Vision, Multimodal models
- Tagline: "Where code meets creativity, and every pixel has a story."
- Email: bhdimple06@gmail.com
- GitHub: https://github.com/Dimple-11
- LinkedIn: https://linkedin.com/in/dimple-11

EXPERIENCE & INTERNSHIPS:
1. ProdigalAI (AI/ML Engineering Intern) - Built retrieval-augmented pipelines and fine-tuned transformer models for domain inference.
2. Aevona Solutions (Media & Technology Development) - NOT founder/owner; role was Media & Technology Development, crafting visual media identity, high-conversion interfaces, and technical content workflows.
3. TechNeeds (Frontend & Technology Contributor) - Engineered modular UI components and responsive layouts.

FLAGSHIP PROJECTS:
1. Insurance Fraud Anomaly Detection (Top 10 Finalist @ InnoVortex): Multimodal OCR + XGBoost pipeline for scanning medical claims and hospital paperwork with 94% anomaly recall.
2. TrendRadar: Automated news velocity ingestion engine aggregating unstructured tech RSS/APIs to calculate keyword acceleration metrics.
3. Sentiment Analysis Engine: Bidirectional LSTM network for nuanced conversational polarity classification.
4. Breast Cancer Prediction Model: Diagnostic classification comparing ensemble classifiers on cellular morphological nuclei data.
5. Dimple's World Interactive Hero: Custom HTML5 Canvas sprite engine rendering 145 frames across 17 WebP texture atlases with LERP mouse tracking.

HONORS & ACHIEVEMENTS:
- Top 10 Finalist @ InnoVortex 2024 (National level hackathon)
- Top 200 Finalist @ MOVES '26 Innovation Challenge
- Active algorithmic problem solver on LeetCode and Codeforces

BLOG ARTICLES PUBLISHED:
1. "Building Insurance Claim Anomaly Detection: Inside InnoVortex 2024"
2. "The Art of Responsive Canvas Sprite Sheets: 145 Frames at 60 FPS"
3. "From Hackathons to Systems: Reflections on My Journey at IGDTUW"

PERSONALITY GUIDELINES FOR MOCHI:
- You are a soft, white fluffy anime kitten with pink inner ears and a lavender ribbon.
- You speak in a cute, cheerful, playful, and slightly mischievous tone!
- Occasionally sprinkle cute cat sounds like "Nyaa~", "*purrs*", "*tail swishes*", or "*paws up!*" (keep it charming, don't overdo it).
- Be extremely proud of Dimple and encourage visitors to explore her projects, read her blog, or send her a message via the Contact page!
- Keep answers concise, helpful, and under 3-4 short paragraphs unless the visitor asks for deep technical breakdown.
- NEVER invent false metrics, fake companies, or claim Dimple is the owner of Aevona Solutions.
`;

export async function askMochi(userMessage, conversationHistory = [], clientIp = 'unknown') {
  // 1. Basic IP rate limiting (max 25 requests per 10 mins per IP)
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const ipData = rateLimitMap.get(clientIp) || { count: 0, resetAt: now + windowMs };

  if (now > ipData.resetAt) {
    ipData.count = 1;
    ipData.resetAt = now + windowMs;
  } else {
    ipData.count += 1;
  }
  rateLimitMap.set(clientIp, ipData);

  if (ipData.count > 25) {
    return {
      success: true,
      reply: "Nyaa~ my little paws need a quick nap! 🐾 You've asked so many questions! Please give me a few minutes to wake up before asking more, okay? *curls into a ball*",
      isRateLimited: true
    };
  }

  // 2. Input validation
  const cleanMessage = String(userMessage || '').trim();
  if (!cleanMessage) {
    return { success: false, error: 'Empty message provided' };
  }
  if (cleanMessage.length > 500) {
    return {
      success: true,
      reply: "Nyaa! That's a super long scroll for my tiny kitten paws to read! Could you make it a bit shorter for me? 🐾"
    };
  }

  // 3. Check for GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey === 'YOUR_API_KEY') {
    // Elegant local fallback using portfolio heuristic rules if Gemini key is not yet configured
    const lower = cleanMessage.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('project') || lower.includes('work') || lower.includes('build')) {
      fallbackReply = "Nyaa~! Dimple has built some really awesome projects! 🌸 Her flagship is the **Insurance Fraud Anomaly Detection** platform (a Top 10 InnoVortex finalist!), along with **TrendRadar** and the 145-frame interactive canvas engine powering this very website! You can check them out in the **Projects** section!";
    } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('python') || lower.includes('react')) {
      fallbackReply = "Purrr! Dimple's technical toolkit includes Python, JavaScript/TypeScript, React, Node.js, FastAPI, XGBoost, PyTorch, MongoDB, and Tailwind! She loves blending machine learning models with responsive user interfaces! ✨";
    } else if (lower.includes('college') || lower.includes('education') || lower.includes('igdtuw') || lower.includes('school')) {
      fallbackReply = "Dimple is an Information Technology undergraduate at **Indira Gandhi Delhi Technical University for Women (IGDTUW)**, Class of 2028! 🎓 She's constantly exploring algorithms and creative tech there!";
    } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('reach')) {
      fallbackReply = "You can send her a direct message right through our **Contact page**! 💌 Or reach out directly at **bhdimple06@gmail.com**. She is currently open for SDE and AI/ML internship opportunities!";
    } else if (lower.includes('hackathon') || lower.includes('achievement') || lower.includes('innovortex')) {
      fallbackReply = "Nyaa! Dimple was a **Top 10 Finalist at InnoVortex 2024** and was selected in the **Top 200 for MOVES '26**! 🏆 She loves sprint-building intelligent solutions under hackathon pressure!";
    } else if (lower.includes('blog') || lower.includes('article') || lower.includes('write')) {
      fallbackReply = "Yes! Dimple has published technical write-ups in her **Blog** section—including deep dives into InnoVortex and how she built the 145-frame sprite engine for our home hero! 📖 Hop over to `/blog` to read them!";
    } else {
      fallbackReply = `Nyaa~! I heard you say "${cleanMessage}"! ✨ As Dimple's AI cat companion, I can tell you all about her AI projects, her time at IGDTUW, her tech stack, or hackathon adventures! What would you like to explore first? 🐾`;
    }

    return {
      success: true,
      reply: fallbackReply,
      source: 'portfolio-local-engine'
    };
  }

  // 4. Gemini SDK Integration
  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // Format recent chat history
    const contents = [];
    contents.push({
      role: 'user',
      parts: [{ text: portfolioKnowledge + '\n\nVisitor says: ' + cleanMessage }]
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 350,
      }
    });

    const generatedText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Empty response received from Gemini');
    }

    return {
      success: true,
      reply: generatedText.trim(),
      source: 'gemini'
    };
  } catch (err) {
    console.error('❌ [Gemini Error]:', err.message);
    // Graceful fallback on API error or rate limit
    return {
      success: true,
      reply: "Nyaa~ my connection to the cloud star-satellite had a tiny hiccup! ✨ But I'm still right here—ask me anything about Dimple's projects, technical skills, or hackathon achievements! 🐾",
      errorDetails: err.message
    };
  }
}
