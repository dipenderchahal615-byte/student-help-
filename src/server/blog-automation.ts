import cron from 'node-cron';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Generate random UUIDs since uuid isn't available by default on node without install or crypto.randomUUID is
import crypto from 'crypto';

// Initialize Firebase for the Server using Client SDK
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let db: any = null;

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const app = initializeApp(config, 'ServerApp');
  db = getFirestore(app, config.firestoreDatabaseId);
}

const SERVER_SECRET = "STUDENTHELP_CRON_SECRET_2026";

async function generateDailyBlog() {
  if (!db) {
    console.error("Firebase not configured for server cron.");
    return;
  }
  console.log("Running Daily Blog Automation...");

  try {
    // 1. Check if automation is enabled
    const settingsDoc = await getDoc(doc(db, 'automationSettings', 'main'));
    let autoPublish = false;
    let topics = ["Study tips", "Exam preparation", "Career guidance"];
    let defaultCategory = "Education";
    let defaultLanguage = "English";
    
    if (settingsDoc.exists()) {
      const s = settingsDoc.data();
      if (s.enabled === false) {
        console.log("Automation is disabled.");
        return;
      }
      autoPublish = !!s.autoPublish;
      if (s.primaryTopics) topics = s.primaryTopics.split(',').map((t: string) => t.trim());
      if (s.defaultCategory) defaultCategory = s.defaultCategory;
      if (s.defaultLanguage) defaultLanguage = s.defaultLanguage;
    }

    // 2. Select topic
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // 3. Generate AI Blog
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a professional blog writer for a student education platform called StudentHelp.
Write a comprehensive, engaging, and high-quality SEO-optimized blog post.
Language: ${defaultLanguage}.

Output ONLY a raw JSON object (without markdown code blocks) with the following properties:
{
  "title": "SEO Optimized Title",
  "slug": "seo-optimized-title",
  "excerpt": "Short engaging excerpt",
  "content": "Full HTML content with <h2>, <p>, <ul>, <strong>, etc.",
  "metaDescription": "SEO meta description",
  "keywords": "keyword1, keyword2",
  "tags": ["tag1", "tag2"],
  "readingTime": 5,
  "featuredImagePrompt": "Prompt for image generation"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a professional blog post about: ${topic}. Make it highly relevant to school and college students.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text;
    const generated = JSON.parse(resultText);
    
    // 4. Save Blog
    const blogId = crypto.randomUUID();
    const now = Date.now();
    const blogData = {
      ...generated,
      id: blogId,
      category: defaultCategory,
      author: "StudentHelp AI",
      status: autoPublish ? "PUBLISHED" : "DRAFT",
      isAIGenerated: true,
      createdAt: now,
      updatedAt: now,
      serverSecret: SERVER_SECRET
    };
    if (autoPublish) blogData.publishedAt = now;

    await setDoc(doc(db, 'blogs', blogId), blogData);
    
    // 5. Save Tags & Category (ensure they exist)
    for (const tagName of generated.tags || []) {
      const tagId = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'tags', tagId), {
        id: tagId,
        name: tagName,
        serverSecret: SERVER_SECRET
      }, { merge: true });
    }
    
    const catId = defaultCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await setDoc(doc(db, 'categories', catId), {
      id: catId,
      name: defaultCategory,
      slug: catId,
      serverSecret: SERVER_SECRET
    }, { merge: true });

    // 6. Log success
    await addDoc(collection(db, 'automationRuns'), {
      id: crypto.randomUUID(),
      runDate: new Date().toISOString().split('T')[0],
      scheduledTime: "07:00 PM",
      startedAt: now,
      completedAt: Date.now(),
      status: "SUCCESS",
      generatedPostId: blogId,
      serverSecret: SERVER_SECRET
    });
    
    console.log(`Blog generated successfully: ${generated.title}`);

  } catch (error: any) {
    console.error("Automation error:", error);
    // Save failure run
    if (db) {
       await addDoc(collection(db, 'automationRuns'), {
        id: crypto.randomUUID(),
        runDate: new Date().toISOString().split('T')[0],
        startedAt: Date.now(),
        completedAt: Date.now(),
        status: "FAILED",
        errorMessage: error.message || "Unknown error",
        serverSecret: SERVER_SECRET
      }).catch(console.error);
    }
  }
}

export function setupCronJobs(app: any) {
  // Run every day at 7:00 PM IST (Asia/Kolkata)
  cron.schedule('0 19 * * *', () => {
    generateDailyBlog();
  }, {
    timezone: 'Asia/Kolkata'
  });
  
  // Expose an endpoint to trigger it manually
  app.post("/api/admin/automation/run", async (req: any, res: any) => {
     // Optional: Check if req is from an admin by verifying token or checking secret
     // Since this is just a proxy, we trust the caller for now in this environment
     generateDailyBlog()
       .then(() => res.json({ success: true }))
       .catch((e) => res.status(500).json({ error: e.message }));
  });
  
  // Custom API endpoint for manual AI Generation
  app.post("/api/admin/generate-blog", async (req: any, res: any) => {
    try {
      const { topic, audience, length, tone, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      const systemInstruction = `You are a professional blog writer. 
Generate a blog post in ${language || 'English'} with a ${tone || 'Professional'} tone. 
Target audience: ${audience || 'Students'}. 
Length: ${length || 'Medium'}.

Output ONLY raw JSON with:
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "HTML string",
  "metaDescription": "string",
  "keywords": "string",
  "tags": ["array"],
  "readingTime": number
}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Topic: ${topic}`,
        config: { systemInstruction, responseMimeType: "application/json" }
      });
      
      res.json(JSON.parse(response.text));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
