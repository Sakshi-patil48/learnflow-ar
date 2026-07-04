import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (
      apiKey && 
      apiKey !== "MY_GEMINI_API_KEY" && 
      apiKey !== "YOUR_GEMINI_API_KEY" &&
      apiKey !== "undefined" &&
      apiKey !== "null" &&
      apiKey.trim() !== ""
    ) {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log("Gemini client initialized successfully.");
      } catch (e) {
        console.error("Failed to initialize Gemini client:", e);
      }
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiAvailable: !!process.env.GEMINI_API_KEY });
  });

  // Serve the custom logo file
  app.get("/learnflow.jpeg", (req, res) => {
    const file = path.join(process.cwd(), "learnflow.jpeg");
    if (fs.existsSync(file)) {
      res.sendFile(file);
    } else {
      res.status(404).send("Logo file not found");
    }
  });

  // Serve the custom chemistry book cover
  const chemCoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "chem book cover .jpeg");
    const path2 = path.join(process.cwd(), "chem 12.jpeg");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else {
      res.status(404).send("Chemistry cover file not found");
    }
  };
  app.get("/chem_book_cover.png", chemCoverHandler);
  app.get("/chem_book_cover.jpeg", chemCoverHandler);
  app.get("/chem%20book%20cover%20.png", chemCoverHandler);
  app.get("/chem%20book%20cover%20.jpeg", chemCoverHandler);
  app.get("/chem book cover .png", chemCoverHandler);
  app.get("/chem book cover .jpeg", chemCoverHandler);

  // Serve the custom 12th chemistry book cover
  const chem12CoverHandler = (req: express.Request, res: express.Response) => {
    const files = [
      path.join(process.cwd(), "chem 12.jpeg"),
      path.join(process.cwd(), "chem12.jpeg")
    ];
    let served = false;
    for (const file of files) {
      if (fs.existsSync(file)) {
        res.sendFile(file);
        served = true;
        break;
      }
    }
    if (!served) {
      res.status(404).send("Chemistry 12 cover file not found");
    }
  };
  app.get("/chem_12.png", chem12CoverHandler);
  app.get("/chem_12.jpeg", chem12CoverHandler);
  app.get("/chem%2012.png", chem12CoverHandler);
  app.get("/chem%2012.jpeg", chem12CoverHandler);
  app.get("/chem 12.png", chem12CoverHandler);
  app.get("/chem 12.jpeg", chem12CoverHandler);
  app.get("/chem12.png", chem12CoverHandler);
  app.get("/chem12.jpeg", chem12CoverHandler);

  // Serve the custom 11th chemistry book cover
  const chem11CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "11chem.jpeg");
    const path2 = path.join(process.cwd(), "11chem.jpec");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else {
      res.status(404).send("Chemistry 11 cover file not found");
    }
  };
  app.get("/11chem.png", chem11CoverHandler);
  app.get("/11chem.jpeg", chem11CoverHandler);
  app.get("/chem11.png", chem11CoverHandler);
  app.get("/chem11.jpeg", chem11CoverHandler);
  app.get("/chem_11.png", chem11CoverHandler);
  app.get("/chem_11.jpeg", chem11CoverHandler);

  // Serve the custom 12th biology book cover
  const bio12CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "bio12.jpeg");
    const path2 = path.join(process.cwd(), "bio 12.jpeg");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else {
      res.status(404).send("Biology 12 cover file not found");
    }
  };
  app.get("/bio12.png", bio12CoverHandler);
  app.get("/bio12.jpeg", bio12CoverHandler);
  app.get("/bio_12.png", bio12CoverHandler);
  app.get("/bio_12.jpeg", bio12CoverHandler);
  app.get("/bio%2012.png", bio12CoverHandler);
  app.get("/bio%2012.jpeg", bio12CoverHandler);
  app.get("/bio 12.png", bio12CoverHandler);
  app.get("/bio 12.jpeg", bio12CoverHandler);

  // Serve the custom 11th biology book cover
  const bio11CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "bio11.jpeg");
    const path2 = path.join(process.cwd(), "bio 11.jpeg");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else {
      res.status(404).send("Biology 11 cover file not found");
    }
  };
  app.get("/bio11.png", bio11CoverHandler);
  app.get("/bio11.jpeg", bio11CoverHandler);
  app.get("/bio_11.png", bio11CoverHandler);
  app.get("/bio_11.jpeg", bio11CoverHandler);
  app.get("/bio%2011.png", bio11CoverHandler);
  app.get("/bio%2011.jpeg", bio11CoverHandler);

  // Serve the custom 12th physics book cover
  const phy12CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "phy12.jpeg");
    const path2 = path.join(process.cwd(), "phy 12.jpeg");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else {
      res.status(404).send("Physics 12 cover file not found");
    }
  };
  app.get("/phy12.png", phy12CoverHandler);
  app.get("/phy12.jpeg", phy12CoverHandler);
  app.get("/phy_12.png", phy12CoverHandler);
  app.get("/phy_12.jpeg", phy12CoverHandler);
  app.get("/phy%2012.png", phy12CoverHandler);
  app.get("/phy%2012.jpeg", phy12CoverHandler);
  app.get("/phy 12.png", phy12CoverHandler);
  app.get("/phy 12.jpeg", phy12CoverHandler);

  // Serve the custom 11th physics book cover
  const phy11CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "11phy.jp.jpeg");
    const path2 = path.join(process.cwd(), "phy11.jpeg");
    const path3 = path.join(process.cwd(), "phy 11.jpeg");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else if (fs.existsSync(path3)) {
      res.sendFile(path3);
    } else {
      res.status(404).send("Physics 11 cover file not found");
    }
  };
  app.get("/11phy.jp.png", phy11CoverHandler);
  app.get("/11phy.jp.jpeg", phy11CoverHandler);
  app.get("/phy11.png", phy11CoverHandler);
  app.get("/phy11.jpeg", phy11CoverHandler);
  app.get("/phy_11.png", phy11CoverHandler);
  app.get("/phy_11.jpeg", phy11CoverHandler);

  // Serve the custom 12th maths book cover
  const maths12CoverHandler = (req: express.Request, res: express.Response) => {
    const files = [
      path.join(process.cwd(), "maths 12.jpeg"),
      path.join(process.cwd(), "math 12.jpeg"),
      path.join(process.cwd(), "maths12.jpeg"),
      path.join(process.cwd(), "math12.jpeg")
    ];
    let served = false;
    for (const file of files) {
      if (fs.existsSync(file)) {
        res.sendFile(file);
        served = true;
        break;
      }
    }
    if (!served) {
      res.status(404).send("Maths 12 cover file not found");
    }
  };
  app.get("/maths_12.png", maths12CoverHandler);
  app.get("/maths_12.jpeg", maths12CoverHandler);
  app.get("/maths%2012.png", maths12CoverHandler);
  app.get("/maths%2012.jpeg", maths12CoverHandler);
  app.get("/maths 12.png", maths12CoverHandler);
  app.get("/maths 12.jpeg", maths12CoverHandler);
  app.get("/math_12.png", maths12CoverHandler);
  app.get("/math_12.jpeg", maths12CoverHandler);
  app.get("/math%2012.png", maths12CoverHandler);
  app.get("/math%2012.jpeg", maths12CoverHandler);
  app.get("/math 12.png", maths12CoverHandler);
  app.get("/math 12.jpeg", maths12CoverHandler);
  app.get("/math12.png", maths12CoverHandler);
  app.get("/math12.jpeg", maths12CoverHandler);
  app.get("/maths12.png", maths12CoverHandler);
  app.get("/maths12.jpeg", maths12CoverHandler);

  // Serve the custom 11th maths book cover
  const maths11CoverHandler = (req: express.Request, res: express.Response) => {
    const path1 = path.join(process.cwd(), "math11.jpeg");
    const path2 = path.join(process.cwd(), "maths11.jpeg");
    const path3 = path.join(process.cwd(), "maths 11.jpeg");
    const path4 = path.join(process.cwd(), "maths11.jpec");
    if (fs.existsSync(path1)) {
      res.sendFile(path1);
    } else if (fs.existsSync(path2)) {
      res.sendFile(path2);
    } else if (fs.existsSync(path3)) {
      res.sendFile(path3);
    } else if (fs.existsSync(path4)) {
      res.sendFile(path4);
    } else {
      res.status(404).send("Maths 11 cover file not found");
    }
  };
  app.get("/math11.png", maths11CoverHandler);
  app.get("/math11.jpeg", maths11CoverHandler);
  app.get("/maths11.png", maths11CoverHandler);
  app.get("/maths11.jpeg", maths11CoverHandler);
  app.get("/maths_11.png", maths11CoverHandler);
  app.get("/maths_11.jpeg", maths11CoverHandler);

  // 1. AI Tutor Chat Endpoint
  app.post("/api/tutor/chat", async (req, res) => {
    try {
      const { messages, selectedClass, selectedSubject, currentTopic, attachedFile } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // Fallback responses if Gemini is not configured
        console.log("Using local educational mock for AI Tutor (no API key)");
        const lastMessage = messages[messages.length - 1]?.content || "";
        let reply = "";
        let tasks: any[] = [];

        if (attachedFile) {
          reply = `I have received your file **"${attachedFile.name}"** (${attachedFile.mimeType}). Since my Gemini AI engine is currently running in local offline demo mode (no API key configured), I can't read the file's contents, but I've successfully received it!\n\nTo unlock actual document/image comprehension and let me answer any particular doubts, please add a valid **GEMINI_API_KEY** in the Settings/Secrets panel!`;
          tasks = [
            { title: "Configure GEMINI_API_KEY", description: "Unlock full PDF and image reading capabilities in your local workspace." },
            { title: "Study Chapter Notes", description: "Use the integrated digital notes on the Bookshelf while configuring keys." }
          ];
        } else if (lastMessage.toLowerCase().includes("hello") || lastMessage.toLowerCase().includes("hi")) {
          reply = `Hello! I am your LearnFlow AR tutor for ${selectedClass}, specializing in **${selectedSubject}**. I can help explain difficult concepts, visualize 3D systems, or generate a structured task list to help you study effectively! What topic would you like to explore today?`;
        } else {
          reply = `That is an excellent question about **${currentTopic || selectedSubject}** for ${selectedClass}! Let's break this concept down:

1. **Key Concept**: This topic is central to understanding the fundamentals of ${selectedSubject}.
2. **Interactive Visualization**: You can explore the corresponding 3D model in your library to see the spatial relationships of its parts.
3. **Actionable Study Tasks**: I have prepared a quick study task list for you. Click the button below to add them to your planner!`;

          tasks = [
            { title: `Read syllabus introduction to ${currentTopic || selectedSubject}`, description: "Go through the textbook and summarize core definitions." },
            { title: `Interact with 3D Model of ${currentTopic || selectedSubject}`, description: "Rotate and zoom in on the main components to build spatial memory." },
            { title: `Solve practice exercises for ${currentTopic || selectedSubject}`, description: "Test your understanding with 5 conceptual questions." }
          ];
        }

        return res.json({
          reply,
          tasks,
          isMock: true
        });
      }

      // Format messages for Gemini Chat with strict educational compliance
      const systemInstruction = `You are LearnFlow's advanced AI Tutor, a highly engaging and personalized study co-pilot for high-school students in ${selectedClass} studying ${selectedSubject}. 
Your goal is to explain educational concepts clearly, encourage critical and spatial thinking, and guide the student towards correct understanding.

CRITICAL SAFETY & EDUCATIONAL COMPLIANCE:
You are strictly an educational tutor. You are forbidden from discussing non-educational or off-topic subjects such as movies, celebrities, politics, entertainment, personal opinions, jokes, hacking, or illegal activities.
If the student's prompt or question is off-topic or unrelated to standard academic school subjects (such as NCERT, CBSE, Science, Mathematics, Biology, Chemistry, Physics, English, Computer Science, general homework, assignments, or competitive exams), you MUST ignore the query and respond exactly with:
"This assistant is dedicated to educational and study-related topics only. Please ask a question related to your learning material."

For all valid academic questions, explain clearly. Highlight key terms with markdown bold.
Whenever the student asks about a concept, topic, or how to study something, you MUST include a JSON block at the very end of your message in the following format so the application can automatically convert your study guide into actionable planner tasks for the student:
[TASK_LIST]: [{"title": "Task title here", "description": "Short description of what the student should do"}]`;

      const prompt = messages[messages.length - 1]?.content || "";
      
      // Fast off-topic pre-filtering to guarantee safety
      const lowerPrompt = prompt.toLowerCase();
      const offTopicWords = [
        "movie", "film", "actor", "actress", "celebrity", "gossip", 
        "politics", "politician", "election", "hacking", "hack", "cracked",
        "illegal", "pirate", "joke", "funny story", "standup", "entertainment", 
        "pop star", "gaming console", "cheat code"
      ];
      
      const isOffTopic = offTopicWords.some(word => {
        // Simple word-boundary check
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerPrompt);
      });

      if (isOffTopic && !lowerPrompt.includes("science") && !lowerPrompt.includes("math") && !lowerPrompt.includes("physics") && !lowerPrompt.includes("history")) {
        return res.json({
          reply: "This assistant is dedicated to educational and study-related topics only. Please ask a question related to your learning material.",
          tasks: [],
          isMock: true
        });
      }

      let contents: any;
      if (attachedFile && attachedFile.base64) {
        const filePart = {
          inlineData: {
            mimeType: attachedFile.mimeType,
            data: attachedFile.base64
          }
        };
        const textPart = {
          text: prompt
        };
        contents = { parts: [filePart, textPart] };
      } else {
        contents = prompt;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const fullText = response.text || "";
      let cleanedText = fullText;
      let tasks: any[] = [];

      // Extract [TASK_LIST] if present
      const taskListIndex = fullText.indexOf("[TASK_LIST]:");
      if (taskListIndex !== -1) {
        try {
          const jsonStr = fullText.substring(taskListIndex + 12).trim();
          cleanedText = fullText.substring(0, taskListIndex).trim();
          tasks = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to parse task list from Gemini output:", e);
        }
      }

      res.json({
        reply: cleanedText,
        tasks,
        isMock: false
      });

    } catch (error: any) {
      console.error("Error in /api/tutor/chat:", error);
      
      const errorMessage = error.message || "";
      const isApiKeyError = errorMessage.includes("API_KEY") || 
                            errorMessage.includes("API key") || 
                            errorMessage.includes("key is invalid") || 
                            errorMessage.includes("invalid key") ||
                            errorMessage.includes("API Key") ||
                            errorMessage.includes("403") ||
                            errorMessage.includes("400");

      if (isApiKeyError) {
        console.log("Detected API key issue. Serving offline backup response with key warning.");
        const { messages, selectedClass, selectedSubject, currentTopic, attachedFile } = req.body;
        const lastMessage = messages[messages.length - 1]?.content || "";
        
        let warningHeader = "⚠️ **GEMINI_API_KEY Config Warning**: The configured API Key is invalid, has expired, or lacks quota.\n\nTo help you study without interruption, I have provided an offline educational study guide:\n\n---\n\n";
        let reply = "";
        let tasks: any[] = [];

        if (attachedFile) {
          reply = warningHeader + `I have received your file **"${attachedFile.name}"** (${attachedFile.mimeType}). Since your GEMINI_API_KEY is currently invalid or has a quota limit, I cannot perform actual document/image content analysis. However, here is a helpful study tip for **${currentTopic || selectedSubject}**:\n\n1. Review the key terms in the Digital Book chapter on the Bookshelf.\n2. Tap the 3D exploration buttons to view geometric and structural layouts of the concept.\n3. Complete the study checklist in your task planner!`;
          tasks = [
            { title: "Fix GEMINI_API_KEY", description: "Replace with a valid key in the Settings/Secrets panel to read files." },
            { title: "Read Book Chapter", description: "Review textbook digital notes for additional context." }
          ];
        } else if (lastMessage.toLowerCase().includes("hello") || lastMessage.toLowerCase().includes("hi")) {
          reply = warningHeader + `Hello! I am your LearnFlow AR tutor for ${selectedClass}, specializing in **${selectedSubject}**. I can help explain difficult concepts, visualize 3D systems, or generate a structured task list to help you study effectively! What topic would you like to explore today?`;
        } else {
          reply = warningHeader + `That is an excellent question about **${currentTopic || selectedSubject}** for ${selectedClass}! Let's break this concept down:\n\n1. **Key Concept**: This topic is central to understanding the fundamentals of ${selectedSubject}.\n2. **Interactive Visualization**: You can explore the corresponding 3D model in your library to see the spatial relationships of its parts.\n3. **Actionable Study Tasks**: I have prepared a quick study task list for you. Click the button below to add them to your planner!`;

          tasks = [
            { title: `Read syllabus introduction to ${currentTopic || selectedSubject}`, description: "Go through the textbook and summarize core definitions." },
            { title: `Interact with 3D Model of ${currentTopic || selectedSubject}`, description: "Rotate and zoom in on the main components to build spatial memory." },
            { title: `Solve practice exercises for ${currentTopic || selectedSubject}`, description: "Test your understanding with 5 conceptual questions." }
          ];
        }

        return res.json({
          reply,
          tasks,
          isMock: true,
          apiKeyWarning: true
        });
      }

      res.status(500).json({ error: error.message || "An error occurred during AI Tutor generation" });
    }
  });

  // Chapter-specific Task Planner generation Endpoint
  app.post("/api/planner/generate", async (req, res) => {
    try {
      const { classLevel, subject, chapterNumber, chapterTitle, topics } = req.body;
      const client = getGeminiClient();

      if (!client) {
        console.log("Gemini client offline. Serving standard structured study plan.");
        // Return standard structured study plan
        const generatedTasks: any[] = [];

        generatedTasks.push({
          title: `📖 Read NCERT: Chapter ${chapterNumber} - ${chapterTitle}`,
          description: `Thoroughly read and study the core explanations for ${chapterTitle}.`,
          type: "syllabus"
        });

        if (topics && topics.length > 0) {
          topics.slice(0, 3).forEach((topic: string) => {
            generatedTasks.push({
              title: `📝 Concept: Master ${topic}`,
              description: `Create key reference notes, formulas, or structures for "${topic}".`,
              type: "syllabus"
            });
          });
        }

        generatedTasks.push({
          title: `❓ Textbook Questions: ${chapterTitle}`,
          description: `Solve the back-of-the-chapter NCERT exercise questions for ${chapterTitle}.`,
          type: "syllabus"
        });

        generatedTasks.push({
          title: `🤖 Doubt Solver Quiz: ${chapterTitle}`,
          description: `Enter the AI Tutor tab to ask doubts and attempt a mock concept check quiz on ${chapterTitle}.`,
          type: "syllabus"
        });

        return res.json({
          tasks: generatedTasks,
          isMock: true
        });
      }

      // We have Gemini! Let's query it.
      const systemInstruction = `You are LearnFlow's academic curriculum planner. Your goal is to design a highly structured, step-by-step, actionable study plan for a specific chapter in the NCERT/CBSE syllabus. 
You must output a JSON array of study tasks. Each task must have exactly these keys:
- "title": A brief, engaging, action-oriented title with an emoji (e.g., "📖 Read Section 1.2: ...", "📝 Solve Practice Set ..."). Keep it concise (max 80 characters).
- "description": A clear, practical explanation of what the student needs to focus on, what concept to understand, or how to practice.

You should generate exactly 4 to 6 logical sequential tasks that cover:
1. Core reading of the chapter, highlighting the primary concepts.
2. Conceptual mastery or hands-on notes of specific subtopics provided.
3. Solving textbook/NCERT back exercises or key numericals/questions.
4. Active self-testing, mock quiz, or doubt solving using AI.

You MUST respond ONLY with the raw JSON array in the format:
[
  {
    "title": "...",
    "description": "..."
  }
]
Do not include any other markdown wrappers, markdown code block backticks (\`\`\`json ... \`\`\`), or prefix text. Just raw JSON.`;

      const userPrompt = `Create a step-by-step study plan for:
Class: Class ${classLevel}
Subject: ${subject}
Chapter ${chapterNumber}: ${chapterTitle}
Core Subtopics: ${topics ? topics.join(", ") : "Main concepts of the chapter"}

Generate 4-6 highly specific study checklist items focusing on these subtopics.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "[]";
      let tasks = [];
      try {
        tasks = JSON.parse(text.trim());
      } catch (err) {
        console.error("Failed to parse JSON study plan from Gemini:", err, text);
        // Fallback to extraction in case it was wrapped in a code block or something
        let cleaned = text.trim();
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.substring(7);
        }
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
          cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        try {
          tasks = JSON.parse(cleaned.trim());
        } catch (e2) {
          throw new Error("Could not parse Gemini output as JSON array.");
        }
      }

      // Add task type to each generated task
      const formattedTasks = tasks.map((t: any) => ({
        title: t.title || "Study Goal",
        description: t.description || "Review and practice concepts.",
        type: "syllabus"
      }));

      return res.json({
        tasks: formattedTasks,
        isMock: false
      });

    } catch (error: any) {
      console.error("Failed to generate plan via Gemini:", error);
      res.status(500).json({ error: error.message || "An error occurred during study plan generation" });
    }
  });

  // 2. Scan & Learn AI Document Analyzer Endpoint (Premium Workspace Creator)
  app.post("/api/scan/analyze", async (req, res) => {
    const { pageDescription, selectedClass, selectedSubject, attachedFile } = req.body;
    try {
      const client = getGeminiClient();

      if (!client) {
        console.log("Gemini client offline. Serving premium simulated document workspace details.");
        const simulatedData = getSimulatedAnalysis(selectedSubject, pageDescription, selectedClass, attachedFile?.name);
        return res.json({
          workspace: simulatedData,
          isMock: true
        });
      }

      // Generate premium educational study material workspace!
      const systemInstruction = `You are LearnFlow's premium AI-powered Document Scanner, OCR Parser & Interactive Study Workspace Generator.
Analyze the student's textbook page, homework sheet, or scanned handwritten study notes (delivered as an image or PDF base64 file).
Extract the text with maximum precision, detect any formulas or equations, identify diagrams, and synthesize this content into a premium structured study workspace package.

CRITICAL SAFETY & EDUCATIONAL COMPLIANCE:
You must only process educational, academic, and study-related files. If the uploaded document or description is off-topic, unrelated to school curricula, or contains offensive/unsafe material, you MUST return a JSON containing an "error" property:
{ "error": "This assistant is dedicated to educational and study-related topics only. Please upload valid study or textbook material." }

For valid academic material, perform high-fidelity OCR and curriculum alignment, then return a response matching the following strict JSON schema:
{
  "title": "Clear, premium chapter or topic title",
  "summary": "Comprehensive 2-3 paragraph academic summary of the scanned material.",
  "importantPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "definitions": [
    { "term": "Term or concept name", "definition": "Clear, accurate educational definition" }
  ],
  "keyConcepts": [
    { "concept": "Concept or Sub-heading", "description": "Detailed multi-sentence explanation of this concept" }
  ],
  "formulas": [
    { "name": "Formula/Equation Name", "equation": "Renderable math equation in Unicode or clear LaTeX notation (e.g. B = \\mu_0 n I)", "derivation": "Brief step-by-step physical derivation or explanation of variables" }
  ],
  "memoryTricks": [
    { "concept": "Target Concept Name", "trick": "A clever mnemonic, acronym, or vivid memory trick to remember this" }
  ],
  "faqs": [
    { "question": "Frequently asked exam question on this", "answer": "Detailed high-scoring answer" }
  ],
  "vivaQuestions": [
    { "question": "Oral test or viva question", "answer": "Quick-fire, precise response" }
  ],
  "mcqs": [
    {
      "question": "A conceptual multiple-choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Exact matching string from the options list",
      "explanation": "Clear explanation of why this option is correct"
    }
  ],
  "shortAnswers": [
    { "question": "Short-answer style question", "answer": "2-3 sentence structured response" }
  ],
  "longAnswers": [
    { "question": "Long-answer essay-style exam question", "answer": "Thoroughly structured response with bulleted details" }
  ],
  "revisionNotes": "A beautiful, complete markdown revision guide for the entire chapter content.",
  "examTips": ["Exam tip 1", "Exam tip 2", "Exam tip 3"],
  "diagrams": [
    {
      "title": "Name of the key scientific diagram discussed (e.g., Structure of Mitochondria, Ray Reflection, Orbitals)",
      "description": "Comprehensive academic description explaining parts and functional pathways of the structure.",
      "labels": ["Label Part 1", "Label Part 2", "Label Part 3", "Label Part 4"]
    }
  ],
  "model": {
    "name": "Creative name for the corresponding 3D interactive model",
    "category": "Specific category of the model",
    "description": "Brief description explaining how this interactive 3D layout correlates with the chapter.",
    "nodes": ["Node 1", "Node 2", "Node 3", "Node 4"],
    "tasks": [
      { "title": "Checklist Study Task 1", "description": "Actionable task for this 3D concept" },
      { "title": "Checklist Study Task 2", "description": "Actionable task for this 3D concept" }
    ]
  }
}

Ensure the response is strictly valid JSON conforming exactly to this structure. Do NOT wrap it in any markdown code blocks or include any text outside the JSON block.`;

      let contents: any;
      if (attachedFile && attachedFile.base64) {
        const filePart = {
          inlineData: {
            mimeType: attachedFile.mimeType,
            data: attachedFile.base64
          }
        };
        const textPart = {
          text: `Class Level: Class ${selectedClass}
Subject Context: ${selectedSubject}
User Description: ${pageDescription || "Parse this curriculum study material and generate a complete study guide workspace."}`
        };
        contents = { parts: [filePart, textPart] };
      } else {
        contents = `Class Level: Class ${selectedClass}
Subject Context: ${selectedSubject}
Textbook Page Description: ${pageDescription || "Generate detailed study workspace on Chapter 1 of " + selectedSubject}`;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const responseText = response.text || "{}";
      let cleanText = responseText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\s*/i, "");
        cleanText = cleanText.replace(/\s*```$/, "");
      }
      
      const workspaceData = JSON.parse(cleanText.trim());

      if (workspaceData.error) {
        return res.json({
          error: workspaceData.error,
          isMock: false
        });
      }

      res.json({
        workspace: workspaceData,
        isMock: false
      });

    } catch (error: any) {
      console.error("Error in /api/scan/analyze:", error);
      // Fallback on error to ensure process never freezes
      const simulatedData = getSimulatedAnalysis(selectedSubject, pageDescription, selectedClass, attachedFile?.name);
      res.json({
        workspace: simulatedData,
        isMock: true,
        errorOccurred: true,
        errorMessage: error.message
      });
    }
  });

  // Legacy route for backward compatibility that wraps the analyze endpoint output
  app.post("/api/scan/simulate", async (req, res) => {
    const { pageDescription, selectedClass, selectedSubject, attachedFile } = req.body;
    try {
      const client = getGeminiClient();

      if (!client) {
        const simulatedData = getSimulatedAnalysis(selectedSubject, pageDescription, selectedClass, attachedFile?.name);
        return res.json({
          model: simulatedData.model,
          isMock: true
        });
      }

      const systemInstruction = `You are a high-fidelity 3D textbook scan processor. 
Analyze the student's textbook page description, attached PDF/image file, selected class, and selected subject.
Generate a structured JSON output representing an interactive 3D model that LearnFlow AR can render on their tablet.
The response must be strictly valid JSON in the following schema:
{
  "name": "Creative name for the 3D educational concept",
  "category": "Specific branch of the subject",
  "description": "High-quality academic description explaining the 3D model's significance in curriculum",
  "nodes": ["Node 1 name", "Node 2 name", "Node 3 name", "Node 4 name", "Node 5 name"],
  "tasks": [
    { "title": "A highly targeted study task", "description": "Clear academic instruction" },
    { "title": "Another targeted study task", "description": "Clear academic instruction" }
  ]
}
Ensure there is NO surrounding markdown formatting, just the raw JSON block.`;

      let contents: any;
      if (attachedFile && attachedFile.base64) {
        const filePart = {
          inlineData: {
            mimeType: attachedFile.mimeType,
            data: attachedFile.base64
          }
        };
        const textPart = {
          text: `Class: ${selectedClass}
Subject: ${selectedSubject}
Task: Analyze this attached textbook page/notes/PDF. Extrapolate its content to generate an interactive 3D model.
User description: ${pageDescription || "Generate the most relevant interactive 3D concept discussed in this material."}`
        };
        contents = { parts: [filePart, textPart] };
      } else {
        const prompt = `Class: ${selectedClass}
Subject: ${selectedSubject}
Textbook description: ${pageDescription || "Core topic and structures discussed in Chapter 1 of the syllabus"}`;
        contents = prompt;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const responseText = response.text || "{}";
      let cleanText = responseText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\s*/i, "");
        cleanText = cleanText.replace(/\s*```$/, "");
      }
      
      const modelData = JSON.parse(cleanText.trim());

      res.json({
        model: modelData,
        isMock: false
      });

    } catch (error: any) {
      console.error("Error in /api/scan/simulate:", error);
      const simulatedData = getSimulatedAnalysis(selectedSubject, pageDescription, selectedClass, attachedFile?.name);
      res.json({
        model: simulatedData.model,
        isMock: true
      });
    }
  });

  // Comprehensive fallback study material generator helper (works offline or when API key fails)
  function getSimulatedAnalysis(selectedSubject: string, pageDescription: string, classLevel: string, fileName?: string) {
    const cleanSubject = selectedSubject || "Biology";
    const desc = ((pageDescription || "") + " " + (fileName || "")).toLowerCase();

    // 1. BIOLOGY
    if (cleanSubject === "Biology" || desc.includes("heart") || desc.includes("circulat") || desc.includes("cell") || desc.includes("dna") || desc.includes("organ")) {
      const isCell = desc.includes("cell") || desc.includes("plant") || desc.includes("animal") || desc.includes("mitochondria");
      const isDNA = desc.includes("dna") || desc.includes("genetics") || desc.includes("helix") || desc.includes("chromosome");
      
      if (isCell) {
        return {
          title: "Structure and Function of the Eukaryotic Plant Cell",
          summary: "The eukaryotic plant cell is a highly complex, membrane-bound structure that serves as the basic unit of life in plants. Unlike animal cells, plant cells possess a rigid cellulose cell wall, large central vacuoles, and specialized organelles called chloroplasts which are responsible for photosynthesis.",
          importantPoints: [
            "Cell wall provides mechanical strength, turgidity, and protection.",
            "Chloroplasts contain chlorophyll pigments to capture light energy for sugar synthesis.",
            "The large central vacuole regulates water potential and stores vital nutrients and ions.",
            "Nucleus contains the genetic blueprint (DNA) and directs all cellular activities."
          ],
          definitions: [
            { term: "Photosynthesis", definition: "The biochemical process by which green plants use sunlight, carbon dioxide, and water to synthesize glucose and release oxygen." },
            { term: "Turgor Pressure", definition: "The hydrostatic pressure exerted by the fluid inside the central vacuole against the surrounding rigid cell wall, maintaining cell shape." },
            { term: "Organelle", definition: "A specialized membrane-bound subunit within a cell that performs a specific metabolic function." }
          ],
          keyConcepts: [
            { concept: "Photosynthesis Mechanics", description: "Takes place in two phases: the light-dependent reactions in the thylakoid membranes generating ATP and NADPH, and the light-independent reactions (Calvin Cycle) in the stroma synthesizing sugars." },
            { concept: "Selective Permeability", description: "The plasma membrane regulates the influx and efflux of molecules through active transport, passive diffusion, and facilitated channels, maintaining cellular homeostasis." }
          ],
          formulas: [
            { name: "Photosynthesis Overall Equation", equation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂", derivation: "Six carbon dioxide molecules and six water molecules are converted in the chloroplast stroma into one molecule of glucose and six molecules of gaseous oxygen." }
          ],
          memoryTricks: [
            { concept: "Plant vs Animal Cell Organelles", trick: "Remember 'C-C-V': Chloroplasts, Cell wall, and central Vacuole are unique to plant cells!" }
          ],
          faqs: [
            { question: "Why do plant cells have a cell wall while animal cells do not?", answer: "Plants do not have skeletal systems for physical support. The rigid cell wall of cellulose provides mechanical structure, helps the plant stand upright, and prevents osmotic bursting when water enters the cell." }
          ],
          vivaQuestions: [
            { question: "Which organelle is called the 'Powerhouse of the Cell'?", answer: "The Mitochondrion, because it performs cellular respiration to generate ATP, the cell's energy currency." }
          ],
          mcqs: [
            { question: "Which organelle is directly responsible for protein synthesis?", options: ["Ribosome", "Chloroplast", "Lysosome", "Centrosome"], answer: "Ribosome", explanation: "Ribosomes translate mRNA codes into polypeptide chains of amino acids, forming functional proteins." },
            { question: "The primary structural component of the plant cell wall is:", options: ["Cellulose", "Peptidoglycan", "Chitin", "Glycogen"], answer: "Cellulose", explanation: "Cellulose is a strong, complex carbohydrate polymer of glucose that provides tensile strength." }
          ],
          shortAnswers: [
            { question: "Explain the role of the central vacuole in plant cells.", answer: "The central vacuole maintains turgor pressure against the cell wall, stores water, nutrients, and waste products, and plays a key role in plant cell growth by absorbing water to expand the cell." }
          ],
          longAnswers: [
            { question: "Describe how plant cells produce food through photosynthesis.", answer: "Photosynthesis occurs in the chloroplasts. In the light-dependent reactions, chlorophyll absorbs sunlight to split water molecules, generating ATP, NADPH, and releasing oxygen. In the Calvin Cycle (light-independent reactions), the energy from ATP and NADPH is used to fix carbon dioxide into glucose molecules, which serve as the cell's primary food source." }
          ],
          revisionNotes: "# Eukaryotic Plant Cell Revision Summary\n\n- **Cell Wall**: Rigid exterior made of cellulose.\n- **Plasma Membrane**: Selectively permeable lipid bilayer.\n- **Plastids**: Chloroplasts (photosynthesis), Chromoplasts (pigments), Amyloplasts (starch storage).\n- **Energy Systems**: Dual system of Chloroplasts (glucose creators) and Mitochondria (ATP generators).\n- **Exam Strategy**: Always practice drawing the plant cell, emphasizing the double-membrane boundary of the cell wall and plasma membrane.",
          examTips: [
            "Be sure to contrast plant cells with animal cells in double-column tables for maximum scoring.",
            "Label the cell wall, central vacuole, and chloroplasts clearly in any diagram question."
          ],
          diagrams: [
            {
              title: "Plant Cell Structure Diagram",
              description: "A detailed structural map of a typical eukaryotic plant cell highlighting core organelle layers and cellular components.",
              labels: ["Cell Wall", "Plasma Membrane", "Large Central Vacuole", "Chloroplast", "Nucleus", "Mitochondria"]
            }
          ],
          model: {
            name: "Plant Cell Structure",
            category: "Botany",
            description: "An interactive, high-definition 3D plant cell structure illustrating specialized plant organelles like the cell wall and chloroplast.",
            nodes: ["Cell Wall", "Central Vacuole", "Chloroplast", "Nucleus", "Mitochondrion"],
            tasks: [
              { title: "Inspect the Chloroplast Structure", description: "Locate the thylakoid stacks (grana) and the fluid stroma." },
              { title: "Understand Osmotic Balance", description: "Observe how water shifts between the vacuole and the external environment." }
            ]
          }
        };
      } else if (isDNA) {
        return {
          title: "DNA Double Helix & Molecular Genetics",
          summary: "DNA (Deoxyribonucleic Acid) is the primary carrier of genetic information in nearly all living organisms. Structurally, it forms a double-stranded helical polymer composed of repeating nucleotides. The twin strands are held together by complementary base pairing across antiparallel sugar-phosphate backbones.",
          importantPoints: [
            "DNA consists of four nitrogenous bases: Adenine, Thymine, Cytosine, and Guanine.",
            "The backbones are held together by phosphodiester bonds, running in antiparallel 5' to 3' directions.",
            "Hydrogen bonds link complementary bases: A binds to T (2 bonds), and C binds to G (3 bonds).",
            "Watson and Crick discovered the double helix structure in 1953."
          ],
          definitions: [
            { term: "Nucleotide", definition: "The basic structural unit of nucleic acids, consisting of a nitrogenous base, a pentose sugar (deoxyribose), and a phosphate group." },
            { term: "Antiparallel", definition: "The orientation of the two strands of a DNA double helix, which run parallel to each other but in opposite directions (5'→3' and 3'→5')." },
            { term: "Codon", definition: "A sequence of three consecutive nucleotides in DNA or mRNA that specifies a single amino acid during protein synthesis." }
          ],
          keyConcepts: [
            { concept: "Complementary Base Pairing", description: "Adenine always pairs with Thymine, and Cytosine pairs with Guanine. This ensures precise genetic replication because each strand serves as a template for synthesizing a new complementary partner." },
            { concept: "DNA Replication", description: "A semi-conservative process where the double helix unwinds via Helicase, and DNA Polymerase adds nucleotides matching the template strand, producing two identical DNA molecules." }
          ],
          formulas: [
            { name: "Chargaff's Rule Equation", equation: "%A = %T  and  %G = %C", derivation: "In any double-stranded DNA molecule, the concentration of Adenine equals Thymine, and Guanine equals Cytosine, summing up to 100% of the total base content." }
          ],
          memoryTricks: [
            { concept: "Complementary Base Pairs", trick: "Remember 'An Apple in the Tree, a Car in the Garage': Adenine binds to Thymine (A-T), Cytosine binds to Guanine (C-G)!" }
          ],
          faqs: [
            { question: "Why are the DNA strands called antiparallel?", answer: "Because one strand runs in the 5' to 3' direction, while its complementary strand runs in the opposite 3' to 5' direction. This is essential for the hydrogen bonds to align correctly between the bases." }
          ],
          vivaQuestions: [
            { question: "How many hydrogen bonds hold a G-C pair together?", answer: "Three hydrogen bonds, which makes G-C pairings slightly stronger and more stable than A-T pairings (which only have two)." }
          ],
          mcqs: [
            { question: "Which enzyme is responsible for unwinding the DNA double helix during replication?", options: ["Helicase", "Polymerase", "Ligase", "Amylase"], answer: "Helicase", explanation: "Helicase breaks the weak hydrogen bonds holding the nitrogenous base pairs together, opening the helix." },
            { question: "If a DNA sample has 30% Adenine, what is the percentage of Cytosine?", options: ["20%", "30%", "40%", "50%"], answer: "20%", explanation: "According to Chargaff's rule, A=T so A+T=60%. The remaining 40% is split equally between G and C, so G=20% and C=20%." }
          ],
          shortAnswers: [
            { question: "Describe Watson and Crick's model of DNA.", answer: "Their model describes DNA as a double-stranded, right-handed helix. The sugar-phosphate backbones form the outside of the helix, and the nitrogenous bases face inward, pairing via hydrogen bonds (A-T, C-G)." }
          ],
          longAnswers: [
            { question: "Explain the semi-conservative model of DNA replication.", answer: "Replication begins at origin sites. Helicase unwinds the double helix, creating a replication fork. DNA Polymerase reads each parental strand in the 3' to 5' direction and synthesizes a new complementary daughter strand in the 5' to 3' direction. Because each resulting DNA double helix contains one original parent strand and one newly synthesized daughter strand, the process is called semi-conservative." }
          ],
          revisionNotes: "# DNA Structure Revision Sheet\n\n- **Double Helix**: Twin coiled antiparallel strands.\n- **Sugar-Phosphate Rails**: Locked by phosphodiester bonds.\n- **Complementary Rungs**: Purines (A, G) bind to Pyrimidines (T, C).\n- **Replication Fork**: Helicase unwinds; Polymerase builds; Ligase seals fragments.",
          examTips: [
            "Be careful with hydrogen bond counts in drawings: draw 2 dotted lines for A-T, 3 for C-G.",
            "Always specify the 5' and 3' labels on the backbones."
          ],
          diagrams: [
            {
              title: "DNA Double Helix Blueprint",
              description: "A highly informative blueprint mapping nitrogenous bases, bonds, and antiparallel backbones.",
              labels: ["Adenine", "Thymine", "Cytosine", "Guanine", "Sugar-Phosphate Backbone", "Hydrogen Bonds"]
            }
          ],
          model: {
            name: "DNA Double Helix",
            category: "Genetics",
            description: "An interactive 3D double helix model detailing base pairing, hydrogen bond limits, and backbone orientation.",
            nodes: ["Adenine", "Thymine", "Cytosine", "Guanine", "Sugar-Phosphate Backbone"],
            tasks: [
              { title: "Count the Hydrogen Bonds", description: "Double-click base pairs to inspect hydrogen bonding vectors." },
              { title: "Analyze Antiparallel Ends", description: "Identify the 5-prime phosphate and 3-prime hydroxyl terminal nodes." }
            ]
          }
        };
      } else {
        // DEFAULT: Cardiovascular System & Heart
        return {
          title: "The Human Heart & Cardiovascular System",
          summary: "The human heart is a specialized, four-chambered muscular organ designed to drive double circulation. It separates oxygenated blood returning from the lungs from deoxygenated blood returning from bodily tissues, ensuring optimal metabolic delivery to all organs.",
          importantPoints: [
            "The heart has four chambers: two upper atria and two lower ventricles.",
            "The muscular septum prevents any mixing of oxygenated and deoxygenated blood.",
            "Double circulation consists of a Pulmonary loop (lungs) and a Systemic loop (body).",
            "Valves (tricuspid, bicuspid, semilunar) ensure strictly one-way blood flow, preventing backflow."
          ],
          definitions: [
            { term: "Double Circulation", definition: "A circulatory system where blood passes through the heart twice during one complete cycle through the body." },
            { term: "Septum", definition: "The thick, muscular partition separating the left and right sides of the heart to prevent the mixing of blood." },
            { term: "Cardiac Cycle", definition: "The sequence of events in a single heartbeat, consisting of diastole (muscular relaxation) and systole (muscular contraction)." }
          ],
          keyConcepts: [
            { concept: "Separation of Oxygenated & Deoxygenated Blood", description: "Deoxygenated blood enters the Right Atrium via the Vena Cava, is pumped into the Right Ventricle, and goes to the Lungs. Oxygenated blood from the lungs enters the Left Atrium, is pumped to the Left Ventricle, and is driven through the Aorta to the entire body." },
            { concept: "Role of Heart Valves", description: "Valves act as check gates. When ventricles contract, the bicuspid and tricuspid valves slam shut (creating the first 'LUB' sound), forcing blood through open semilunar valves into the major arteries." }
          ],
          formulas: [
            { name: "Cardiac Output Equation", equation: "Cardiac Output (CO) = Heart Rate (HR) × Stroke Volume (SV)", derivation: "The total volume of blood pumped by one ventricle per minute is equal to the number of heartbeats per minute multiplied by the volume of blood ejected with each beat (~70 mL)." }
          ],
          memoryTricks: [
            { concept: "Left vs Right Side Blood Types", trick: "Remember 'LORD': Left side is Oxygenated, Right side is Deoxygenated!" }
          ],
          faqs: [
            { question: "Why is the left ventricle wall much thicker than the right ventricle wall?", answer: "The right ventricle only pumps deoxygenated blood to the nearby lungs (low resistance). The left ventricle must build enough pressure to drive oxygenated blood to the entire body, from head to toes, requiring a much stronger muscular wall." }
          ],
          vivaQuestions: [
            { question: "What causes the heart sounds 'lub-dub'?", answer: "The 'lub' sound is caused by the sudden closure of the atrioventricular (bicuspid/tricuspid) valves at the start of systole. The 'dub' sound is caused by the closure of the semilunar valves at the start of diastole." }
          ],
          mcqs: [
            { question: "Which major blood vessel carries oxygenated blood from the lungs to the left atrium?", options: ["Pulmonary Vein", "Aorta", "Pulmonary Artery", "Vena Cava"], answer: "Pulmonary Vein", explanation: "Uniquely among veins, the pulmonary vein carries fresh, highly oxygenated blood from the lungs back to the left side of the heart." },
            { question: "Which node is known as the natural pacemaker of the heart?", options: ["Sinoatrial (SA) Node", "Atrioventricular (AV) Node", "Bundle of His", "Purkinje Fibers"], answer: "Sinoatrial (SA) Node", explanation: "The SA node, located in the right atrium, generates spontaneous electrical impulses that initiate cardiac contraction." }
          ],
          shortAnswers: [
            { question: "What is the clinical significance of double circulation?", answer: "Double circulation keeps oxygenated and deoxygenated blood separate. This allows a highly pressurized, efficient supply of oxygen to organs, supporting the high metabolic rates of warm-blooded organisms like birds and mammals." }
          ],
          longAnswers: [
            { question: "Explain the complete pathway of blood flow through the human heart.", answer: "Deoxygenated blood from the body enters the right atrium via the superior and inferior vena cava. The right atrium contracts, pushing blood through the tricuspid valve into the right ventricle. The right ventricle pumps blood through the pulmonary semilunar valve into the pulmonary artery, leading to the lungs where carbon dioxide is exchanged for oxygen. This oxygenated blood returns via the pulmonary veins into the left atrium. The left atrium contracts, passing blood through the bicuspid (mitral) valve into the left ventricle. Finally, the highly muscular left ventricle contracts, forcing blood through the aortic semilunar valve into the aorta, distributing oxygenated blood to all systemic body systems." }
          ],
          revisionNotes: "# Cardiovascular System Revision Guide\n\n- **Atria**: Receiving chambers (thin-walled).\n- **Ventricles**: Distributing chambers (thick-walled).\n- **Septum**: Perfect divider of left/right oxygen systems.\n- **Pulmonary Loop**: Heart -> Lungs -> Heart.\n- **Systemic Loop**: Heart -> Body -> Heart.\n- **Pacemaker**: SA Node controls default muscular rhythm.",
          examTips: [
            "Draw arrows in your heart diagrams to show blood entry, lung transport, and systemic release.",
            "Do not confuse the Pulmonary Artery (carries deoxygenated blood) with standard arteries (which carry oxygenated blood)."
          ],
          diagrams: [
            {
              title: "Internal Structure of the Human Heart",
              description: "A comprehensive cross-sectional schematic illustrating chambers, valves, and key systemic vascular connections.",
              labels: ["Left Ventricle", "Right Atrium", "Aorta", "Pulmonary Artery", "Mitral Valve", "Muscular Septum"]
            }
          ],
          model: {
            name: "Cardiovascular System",
            category: "Anatomy",
            description: "An interactive, fully functional 3D cardiovascular system detailing chambers, valves, septum partitions, and pressure directions.",
            nodes: ["Left Ventricle", "Right Atrium", "Aorta", "Pulmonary Artery", "Mitral Valve"],
            tasks: [
              { title: "Inspect Left Ventricle Wall", description: "Observe the cross-sectional thickness compared to the right ventricle." },
              { title: "Trace Oxygenated Pathway", description: "Trigger the systemic pump and observe blood vectors moving from the mitral valve into the aorta." }
            ]
          }
        };
      }
    }

    // 2. PHYSICS
    if (cleanSubject === "Physics" || desc.includes("magnet") || desc.includes("solenoid") || desc.includes("force") || desc.includes("field") || desc.includes("electric") || desc.includes("gravity") || desc.includes("lens") || desc.includes("prism")) {
      return {
        title: "Electromagnetism & Magnetic Field of a Solenoid",
        summary: "A solenoid is a long coil of insulated wire wound in a close helical shape. When an electric current passes through the solenoid, it generates a magnetic field. This field is highly uniform and strong inside the solenoid, behaving similarly to a bar magnet with distinct North and South poles.",
        importantPoints: [
          "Inside a current-carrying solenoid, the magnetic field lines are parallel straight lines.",
          "The parallel lines indicate that the magnetic field is uniform (constant strength) at all points inside.",
          "Inserting a soft iron core inside the solenoid dramatically increases the magnetic field strength.",
          "The magnetic field is directly proportional to both the current and the number of turns per unit length."
        ],
        definitions: [
          { term: "Solenoid", definition: "A cylindrical coil of wire acting as a magnet when carrying electric current." },
          { term: "Magnetic Flux", definition: "A measure of the total magnetic field passing through a given surface area." },
          { term: "Electromagnet", definition: "A temporary magnet made of a solenoid wrapped around a soft ferromagnetic iron core." }
        ],
        keyConcepts: [
          { concept: "Uniform Internal Field", description: "The straight, parallel magnetic field lines inside the solenoid indicate that the field strength and direction are identical at all interior points, unlike the spreading, weaker field on the outer boundaries." },
          { concept: "The Soft Iron Core Enhancement", description: "Soft iron has high magnetic permeability. When current flows, the domain spins in the iron align with the solenoid's field, multiplying the net magnetic flux. The core loses its magnetism instantly when current is shut off." }
        ],
        formulas: [
          { name: "Solenoid Magnetic Field Equation", equation: "B = μ₀ * n * I", derivation: "The magnetic field strength B inside an infinitely long solenoid is the product of the permeability of free space μ₀, the number of turns per unit length n (N/L), and the electric current I." }
        ],
        memoryTricks: [
          { concept: "Right-Hand Grip Rule", trick: "Curl your right-hand fingers in the direction of the electric current loops. Your extended thumb will point directly to the magnetic North Pole of the solenoid!" }
        ],
        faqs: [
          { question: "Why are the magnetic field lines inside a solenoid parallel to each other?", answer: "The current in each adjacent loop flows in the same direction, generating individual magnetic fields that add up constructively inside the cylinder, resulting in a clean, parallel, and uniform magnetic field vector alignment." }
        ],
        vivaQuestions: [
          { question: "How does reversing the current direction affect the solenoid's magnetic field?", answer: "It flips the magnetic polarity. The North pole becomes the South pole, and the South pole becomes the North pole, while the field magnitude remains constant." }
        ],
        mcqs: [
          { question: "Inside a current-carrying solenoid, the magnetic field is:", options: ["Uniform", "Zero", "Decreasing towards the ends", "Randomly aligned"], answer: "Uniform", explanation: "The parallel straight lines of the magnetic field indicate identical strength and direction at all interior coordinates." },
          { question: "Which material makes the best temporary core for an electromagnet?", options: ["Soft Iron", "Steel", "Alnico", "Copper"], answer: "Soft Iron", explanation: "Soft iron magnetizes and demagnetizes extremely rapidly with the current switch, preventing residual magnetic retention." }
        ],
        shortAnswers: [
          { question: "State three ways to increase the magnetic field strength of a solenoid.", answer: "First, increase the electric current (I) flowing through the coils. Second, increase the density of turns per unit length (n). Third, insert a soft ferromagnetic core (like soft iron) inside the cylinder." }
        ],
        longAnswers: [
          { question: "Contrast a permanent bar magnet with an electromagnet.", answer: "A permanent bar magnet retains its magnetism indefinitely, its poles are fixed, and its field strength cannot be easily changed. In contrast, an electromagnet is temporary (only magnetic while current flows), its polarity can be flipped by reversing the electric current, and its magnetic field strength can be amplified or dimmed by adjusting the current or the number of wire loops." }
        ],
        revisionNotes: "# Solenoid Electromagnetism Revision\n\n- **Formula**: $B = \\mu_0 (N/L) I$.\n- **Pattern**: External field mimics a bar magnet; internal field is perfectly parallel.\n- **Polarity Test**: Clock Rule or Right-Hand Grip Rule.\n- **Electromagnet Core**: Prefer soft iron (retains low residual field) over hard steel.",
        examTips: [
          "In solenoid diagrams, always show the direction of current loops clearly so the grader can verify your North-South polar labels.",
          "Remember that field lines emerge from the North pole and enter the South pole on the exterior."
        ],
        diagrams: [
          {
            title: "Solenoid Coil & Magnetic Field Lines",
            description: "A detailed physical mapping showing the coil loops, direction of current, and resulting closed loops of magnetic force.",
            labels: ["Solenoid Coil", "Magnetic Flux Line", "Iron Core", "Electric Current Vector", "North Pole", "South Pole"]
          }
        ],
        model: {
          name: "Electromagnetism",
          category: "Electrodynamics",
          description: "An interactive 3D current-carrying solenoid demonstrating uniform magnetic field lines, vector fields, and ferromagnetic core influence.",
          nodes: ["Solenoid Coil", "Magnetic Flux Line", "Iron Core", "Electric Current Vector"],
          tasks: [
            { title: "Toggle Iron Core", description: "Observe the immediate spike in the magnetic flux lines count and density." },
            { title: "Reverse Current Direction", description: "Watch the current vectors and the North-South magnetic orientation flip." }
          ]
        }
      };
    }

    // 3. CHEMISTRY
    if (cleanSubject === "Chemistry" || desc.includes("chem") || desc.includes("bond") || desc.includes("molecule") || desc.includes("carbon") || desc.includes("water") || desc.includes("equilibrium") || desc.includes("acid") || desc.includes("reaction")) {
      return {
        title: "Covalent Bonding & Organic Tetrahedral Carbon Geometry",
        summary: "Carbon has a tetravalent nature with four valence electrons. To achieve a stable octet, it forms four covalent bonds by sharing electrons with other atoms. In organic molecules like methane (CH₄), the carbon atom undergoes sp³ hybridization, creating a highly stable tetrahedral geometry.",
        importantPoints: [
          "Carbon can form single, double, or triple covalent bonds to fulfill its octet.",
          "Covalent bonding involves the mutual sharing of valence electron pairs between atoms.",
          "The tetrahedral bond angle is precisely 109.5°.",
          "Organic compounds exhibit low melting points and poor electrical conductivity due to their molecular nature."
        ],
        definitions: [
          { term: "Covalent Bond", definition: "A chemical bond formed by the sharing of one or more pairs of electrons between non-metal atoms." },
          { term: "Tetrahedral Geometry", definition: "A molecular shape where a central atom is positioned in the center with four substituents located at the corners of a tetrahedron." },
          { term: "Hybridization", definition: "The conceptual mixing of atomic orbitals (like s and p) to form new equivalent hybrid orbitals suitable for bonding." }
        ],
        keyConcepts: [
          { concept: "Tetravalent Nature of Carbon", description: "With an atomic number of 6, carbon's electronic configuration is 2, 4. To complete its outer shell, it must share 4 electrons, leading to diverse single/double chains and rings." },
          { concept: "Orbital Hybridization sp³", description: "The single 2s and three 2p orbitals of carbon combine to form four degenerate sp³ hybrid orbitals. These orbitals repel each other equally, pointing towards the vertices of a regular tetrahedron." }
        ],
        formulas: [
          { name: "Tetrahedral Bond Angle", equation: "θ = 109.5°", derivation: "Calculated geometrically to minimize electron-pair repulsion between the four equivalent C-H sigma bonds in space." }
        ],
        memoryTricks: [
          { concept: "Valence Electron Bonding Limits", trick: "Remember 'HONC': Hydrogen (1 bond), Oxygen (2 bonds), Nitrogen (3 bonds), Carbon (4 bonds)!" }
        ],
        faqs: [
          { question: "Why does carbon form covalent bonds instead of ionic bonds?", answer: "Carbon has 4 valence electrons. Removing 4 electrons to form C⁴⁺ would require a massive amount of ionization energy. Adding 4 electrons to form C⁴⁻ is extremely difficult due to electron-electron repulsion. Hence, sharing electrons via covalent bonds is the most energetically favorable path." }
        ],
        vivaQuestions: [
          { question: "What is the hybridization of carbon in a double-bonded alkene like ethene?", answer: "It is sp² hybridized, leaving one unhybridized p-orbital to form the pi (π) bond, resulting in a planar trigonal geometry with 120° bond angles." }
        ],
        mcqs: [
          { question: "What is the bond angle in a symmetrical tetrahedral molecule like methane?", options: ["109.5°", "120°", "180°", "90°"], answer: "109.5%", explanation: "109.5° is the geometric angle that maximizes separation and minimizes electrostatic repulsion between four bonding pairs of electrons." },
          { question: "Which type of hybridization is found in diamond's carbon framework?", options: ["sp³", "sp²", "sp", "dsp²"], answer: "sp³", explanation: "In diamond, each carbon atom is covalently bonded to four other carbon atoms in a continuous, rigid 3D tetrahedral network." }
        ],
        shortAnswers: [
          { question: "Define catenation and explain why carbon exhibits this property uniquely.", answer: "Catenation is the ability of an element to form stable, long covalent chains or rings with atoms of its own kind. Carbon exhibits this uniquely due to its small size and the extremely high strength and stability of the C-C single bond." }
        ],
        longAnswers: [
          { question: "Explain the formation of single covalent bonds in methane (CH₄) using orbital concepts.", answer: "The central carbon atom has ground state configuration 1s² 2s² 2p². Upon excitation, one electron from the 2s orbital jumps to the empty 2p_z orbital. The one 2s and three 2p orbitals hybridize to form four equivalent sp³ hybrid orbitals, each containing one unpaired electron. These hybrid orbitals align towards tetrahedral corners with 109.5° angles. Four hydrogen atoms, each bringing a 1s electron, overlap head-on with these sp³ orbitals, forming four strong localized sigma (σ) covalent bonds." }
        ],
        revisionNotes: "# Covalent Bonding & Carbon Geometry\n\n- **Hybridization**: $sp^3$ (tetrahedral), $sp^2$ (trigonal planar), $sp$ (linear).\n- **Covalent Bond**: Electron pair sharing to complete valence octets.\n- **Carbon Qualities**: Tetravalency and Catenation (strong chain forming).\n- **Geometry Rules**: VSEPR theory dictates angles to minimize repulsion.",
        examTips: [
          "In tetrahedral drawings, use wedges to represent bonds coming forward, dashes for bonds going backward, and normal lines for bonds in the plane of the paper.",
          "Always define covalent bonds as electron sharing, never as electron transfer."
        ],
        diagrams: [
          {
            title: "Carbon Tetrahedral sp³ Overlap Map",
            description: "A spatial orbital map demonstrating the four sp³ hybrid lobes of a central carbon atom overlapping with hydrogen 1s orbitals.",
            labels: ["Tetrahedral Carbon", "Single C-H Bond", "Double C-C Bond", "Electron Cloud", "Bond Angle 109.5°"]
          }
        ],
        model: {
          name: "Carbon Molecule",
          category: "Organic Chemistry",
          description: "An interactive 3D model of a hybridized carbon compound mapping covalent single bonds, tetrahedral geometry, and electron density distributions.",
          nodes: ["Tetrahedral Carbon", "Single C-H Bond", "Double C-C Bond", "Electron Cloud"],
          tasks: [
            { title: "Measure tetrahedral bond angle", description: "Double click adjacent H-nodes to verify the 109.5-degree spacing." },
            { title: "Inspect Sigma overlap", description: "Zoom in to observe the head-on orbital boundaries between the Carbon hybrid lobe and Hydrogen." }
          ]
        }
      };
    }

    // 4. MATHEMATICS & DEFAULT FALLBACK
    return {
      title: "3D Analytical Geometry & The Paraboloid Shape",
      summary: "A paraboloid is a quadric surface that has exactly one axis of symmetry and no center of symmetry. In cylindrical coordinates, a circular paraboloid is formed by rotating a parabola around its primary central axis, creating a curved bowl structure widely used in reflective antennas, satellite dishes, and optical headlights.",
      importantPoints: [
        "The vertical cross-section of a paraboloid is always a parabola.",
        "The horizontal cross-section at any positive height z is a circle.",
        "Incoming parallel rays reflecting off a paraboloid's interior surface are concentrated precisely at its focus.",
        "The point of maximum curvature is called the vertex, typically situated at the origin (0,0,0)."
      ],
      definitions: [
        { term: "Paraboloid", definition: "A three-dimensional surface whose intersections with planes parallel to its axis of symmetry are parabolas." },
        { term: "Directrix Plane", definition: "A flat reference plane used in conjunction with the focus point to define the geometric path of quadratic curves." },
        { term: "Vertex", definition: "The central turning point of the paraboloid surface where the curvature reaches its absolute extremum." }
      ],
      keyConcepts: [
        { concept: "Focus Reflective Property", description: "For any parabolic reflector, any ray entering parallel to the central axis is reflected directly through the single focus point, explaining why paraboloid shapes are utilized for deep-space signal receivers and solar thermal concentrators." },
        { concept: "Quadratic Equations in 3D Space", description: "Extending a 2D parabola $y = ax^2$ into 3D by adding a rotational symmetry variable yields $z = a(x^2 + y^2)$, which defines a circular paraboloid bowl expanding infinitely." }
      ],
      formulas: [
        { name: "Circular Paraboloid Equation", equation: "z = a * (x² + y²)", derivation: "Derived by taking the standard 2D parabola equation on the X-Z plane and substituting the horizontal radius $r^2 = x^2 + y^2$ to create perfect rotational symmetry around the Z-axis." }
      ],
      memoryTricks: [
        { concept: "Paraboloid Shape Analogy", trick: "Think of a Paraboloid as a 'Perfect parabolic soup bowl'—all parallel soup drops falling in reflect straight to the central cherry at the focus!" }
      ],
      faqs: [
        { question: "What is the difference between an elliptic paraboloid and a hyperbolic paraboloid?", answer: "An elliptic paraboloid curves upwards like a bowl ($z = x^2/a^2 + y^2/b^2$), whereas a hyperbolic paraboloid is shaped like a saddle ($z = x^2/a^2 - y^2/b^2$), curving up along one axis and down along the other." }
      ],
      vivaQuestions: [
        { question: "Where is the focal point of a paraboloid $z = x^2 + y^2$ located?", answer: "The focus is located on the axis of symmetry (the Z-axis) at a distance of $1/(4a)$ units above the vertex." }
      ],
      mcqs: [
        { question: "The horizontal cross-section of the paraboloid $z = 4(x^2 + y^2)$ at plane $z = 16$ is a:", options: ["Circle of radius 2", "Parabola", "Ellipse of semi-axis 4", "Hyperbola"], answer: "Circle of radius 2", explanation: "Substituting $z = 16$ yields $16 = 4(x^2 + y^2) \\rightarrow x^2 + y^2 = 4$, which is the equation of a circle with a radius of $\\sqrt{4} = 2$." },
        { question: "Which device relies directly on the focus reflection property of the paraboloid?", options: ["Satellite Dish Antenna", "Flat Window Glass", "Spherical Door Knob", "Prism Spectrometer"], answer: "Satellite Dish Antenna", explanation: "Satellite dishes concentrate incoming parallel radio waves into a receiver positioned precisely at the focal point." }
      ],
      shortAnswers: [
        { question: "State the equation of a hyperbolic paraboloid saddle.", answer: "The equation is typically written as $z/c = x^2/a^2 - y^2/b^2$, where the signs of the quadratic terms are opposite, creating a saddle shape with dual-axis curvature." }
      ],
      longAnswers: [
        { question: "Prove that parallel lines reflecting off a parabola pass through the focus point.", answer: "According to the geometric definition of a parabola, any point on the curve is equidistant from the focus and the directrix. By taking the tangent line at any point and using the law of reflection (angle of incidence equals angle of reflection), we can prove mathematically that a ray parallel to the axis of symmetry reflects off the tangent line directly towards the focal coordinate, minimizing the travel time (Fermat's Principle)." }
      ],
      revisionNotes: "# 3D Paraboloid Geometry Summary\n\n- **Formula**: $z = a(x^2 + y^2)$.\n- **Cross Sections**: Parallel to axis = Parabolas; Perpendicular = Circles.\n- **Focus Position**: $(0, 0, 1/(4a))$.\n- **Application**: Focus reflecting concentrations (antennas, satellite dishes).",
      examTips: [
        "Always check the signs of $x^2$ and $y^2$: same positive sign is an Elliptic bowl; opposite signs is a Hyperbolic saddle.",
        "The vertex is the absolute minimum point of the circular bowl if $a > 0$."
      ],
      diagrams: [
        {
          title: "Circular Paraboloid Reflective Geometry",
          description: "A 3D coordinate model mapping vertex origins, focus locations, parallel incoming ray vectors, and target focal concentration.",
          labels: ["Vertex (0,0,0)", "Focus Point", "Directrix Plane", "Z-Axis Cross Section", "Parallel Ray", "Reflected Ray"]
        }
      ],
      model: {
        name: "3D Paraboloid",
        category: "Analytical Geometry",
        description: "An interactive, fully responsive 3D circular paraboloid geometry illustrating rotational curvature, coordinate planes, and focal points.",
        nodes: ["Vertex (0,0,0)", "Focus Point", "Directrix Plane", "Z-Axis Cross Section"],
        tasks: [
          { title: "Observe Focal Concentration", description: "Trace the reflective parallel lines as they intersect exactly at the Focus Point node." },
          { title: "Examine Slice Geometry", description: "Select positive Z plane slices to confirm the cross-section circle radius changes." }
        ]
      }
    };
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
