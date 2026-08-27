import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client
const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.post("/api/ai/notes", async (req, res) => {
  try {
    const { topic, course, difficulty, language, type } = req.body;
    if (!topic || !type) return res.status(400).json({ error: "Topic and type are required" });
    
    const ai = initGemini();
    let systemInstruction = `You are a helpful study assistant for school and college students. 
You are generating content about the topic: "${topic}".
Context: The student is in class/course: "${course || 'Not specified'}" and prefers a "${difficulty || 'Standard'}" difficulty level.
Language constraint: You MUST respond entirely in ${language || 'English'}.
Format the response nicely in Markdown.
Important Note to include at the END of your response (in the requested language): Do not present AI-generated information as guaranteed correct academic authority. Encourage students to verify important academic information with their textbook/teacher.`;

    if (type === 'Explain') {
      systemInstruction += "\nTask: Generate a clear, student-friendly explanation of the topic.";
    } else if (type === 'Short Notes') {
      systemInstruction += "\nTask: Generate concise revision notes with headings and bullet points.";
    } else if (type === 'Important Points') {
      systemInstruction += "\nTask: Generate the most important concepts and takeaways for quick revision.";
    } else if (type === 'Quiz') {
      systemInstruction += "\nTask: Generate 5 multiple-choice questions with four options each, and provide an answer key at the end.";
    } else {
      systemInstruction += `\nTask: Generate content based on the requested type: ${type}.`;
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${type} on the topic: ${topic}`,
      config: { systemInstruction }
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Notes Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate notes" });
  }
});

app.post("/api/ai/roadmap", async (req, res) => {
  try {
    const { career } = req.body;
    if (!career) return res.status(400).json({ error: "Career is required" });
    
    const ai = initGemini();
    const systemInstruction = "You are a career counselor. Create a beginner-to-advanced learning roadmap for the requested career/skill. Include Skills to learn, Suggested projects, Portfolio ideas, and Next steps. Use Markdown.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: career,
      config: { systemInstruction }
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Roadmap Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap" });
  }
});

app.post("/api/ai/interview", async (req, res) => {
  try {
    const { field, level, answer, question } = req.body;
    const ai = initGemini();
    
    if (answer && question) {
      // Evaluate answer
      const systemInstruction = "You are an expert technical interviewer. Evaluate the candidate's answer to the question. Provide constructive feedback on: Clarity, Relevance, Structure, and Areas to improve. Use Markdown.";
      const prompt = `Question: ${question}\nCandidate Answer: ${answer}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      return res.json({ text: response.text });
    } else if (field && level) {
      // Generate question
      const systemInstruction = "You are an expert interviewer. Ask exactly ONE practice interview question for the requested field and experience level. Do not include introductory text, just the question.";
      const prompt = `Field: ${field}, Experience Level: ${level}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      return res.json({ text: response.text });
    } else {
      return res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (error: any) {
    console.error("AI Interview Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate interview response" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    const ai = initGemini();
    const systemInstruction = "You are StudentHelp's smart digital companion. You help students with studying, productivity, career advice, and general guidance. Be friendly, encouraging, and concise. Do not use complex formatting unless necessary.";
    
    // Create a new chat session with history
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      }
    });

    // We can't directly pass history to ai.chats.create in this SDK version easily if it requires formatted contents.
    // Instead we can use generateContent with history formatted manually.
    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role && msg.content) {
          contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
        }
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction }
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
