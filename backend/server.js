import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   DEFINE __dirname
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   SERVE REACT BUILD
================================ */
app.use(express.static(path.join(__dirname, "../build")));

/* ===============================
   GROQ CLIENT
================================ */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ===============================
   GENERATE CONTENT API
================================ */
app.post("/generate", async (req, res) => {
  try {
    console.log("📥 /generate called with:", req.body);

    const {
      category,
      level,
      tutorialNumber,
      taskNumber,
      usedTexts,
    } = req.body;

    if (!category || !level || !tutorialNumber || !taskNumber) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: [
          "category",
          "level",
          "tutorialNumber",
          "taskNumber",
        ],
      });
    }

    const safeUsedTexts = Array.isArray(usedTexts) ? usedTexts : [];

    /* ===============================
       CATEGORY RULES
    ================================ */
    let categoryRules = "";

    if (category === "words") {
      categoryRules = `
Generate EXACTLY ONE English word.

Rules:
- One word only
- No spaces
- No punctuation
- No hyphens
`;
    } else if (category === "sentences") {
      categoryRules = `
Generate EXACTLY ONE English sentence.

Rules:
- One sentence only
- Plain text
`;
    } else if (category === "paragraphs") {
      categoryRules = `
Generate ONE English paragraph.

Rules:
- 2 to 4 sentences
- No line breaks
- Plain text
`;
    } else {
      return res.status(400).json({
        error: "Invalid category",
        allowed: ["words", "sentences", "paragraphs"],
      });
    }

    /* ===============================
       LEVEL RULES
    ================================ */
    const levelRulesMap = {
      "very-easy": `
- Extremely common vocabulary
- Very short length
- No commas
- No complex words
`,
      "easy": `
- Common everyday vocabulary
- Short length
- Simple structure
`,
      "easy-medium": `
- Mostly common vocabulary
- Slightly longer content
- Simple structure
`,
      "medium": `
- Mixed vocabulary
- Medium length
- May include one comma
`,
      "medium-hard": `
- Less common vocabulary
- Longer content
- May include commas
`,
      "hard": `
- Advanced vocabulary
- Long content
- Complex structure
- Multiple commas allowed
`,
      "very-hard": `
- Rare or advanced vocabulary
- Long and complex structure
- High typing difficulty
`,
    };

    const levelRules =
      levelRulesMap[level] || levelRulesMap["medium"];

    /* ===============================
       TUTORIAL PROGRESSION RULES
    ================================ */
    let tutorialRules = "";

    if (tutorialNumber <= 3) {
      tutorialRules = `
- This tutorial is EARLY in the level
- Stay near the LOWER bound of the level difficulty
`;
    } else if (tutorialNumber <= 6) {
      tutorialRules = `
- This tutorial is MIDWAY through the level
- Use the CORE difficulty of the level
`;
    } else {
      tutorialRules = `
- This tutorial is LATE in the level
- Push toward the UPPER bound of the level difficulty
`;
    }

    /* ===============================
       TASK PROGRESSION RULES
    ================================ */
    let taskRules = "";

    if (taskNumber <= 3) {
      taskRules = `
- This task is EASY within the tutorial
- Keep typing difficulty low
`;
    } else if (taskNumber <= 6) {
      taskRules = `
- This task is MODERATE within the tutorial
- Slightly increase typing challenge
`;
    } else {
      taskRules = `
- This task is HARD within the tutorial
- Maximize difficulty allowed by the level
`;
    }

    /* ===============================
       AVOID REPEATED CONTENT
    ================================ */
    const avoidText =
      safeUsedTexts.length > 0
        ? `
Do NOT repeat or reuse any of the following content:
${safeUsedTexts.join("\n")}
`
        : "";

    /* ===============================
       FINAL PROMPT
    ================================ */
    const prompt = `
You are an expert typing tutor creating practice content.

CATEGORY: ${category}
LEVEL: ${level}
TUTORIAL: ${tutorialNumber} of 10
TASK: ${taskNumber} of 10

GOAL:
Generate typing content that strictly follows the category rules,
matches the difficulty level, progresses across tutorials,
and increases slightly with each task.

CATEGORY RULES:
${categoryRules}

LEVEL RULES:
${levelRules}

TUTORIAL PROGRESSION RULES:
${tutorialRules}

TASK PROGRESSION RULES:
${taskRules}

${avoidText}

ABSOLUTE RULES:
- Output ONLY the typing content
- Plain text only
- No explanations
- No numbering
- No labels
- Do NOT mention category, level, tutorial, or task
- Content must be NEW and NOT similar to previous tasks
`;

    /* ===============================
       TEMPERATURE BY LEVEL
    ================================ */
    const temperatureMap = {
      "very-easy": 0.4,
      "easy": 0.5,
      "easy-medium": 0.6,
      "medium": 0.7,
      "medium-hard": 0.8,
      "hard": 0.9,
      "very-hard": 1.0,
    };

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: temperatureMap[level] ?? 0.7,
    });

    const text = response?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(502).json({ error: "Empty response from Groq" });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error("🔥 /generate FAILED:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

/* ===============================
   REACT FALLBACK
================================ */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
