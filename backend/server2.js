import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   FIX: DEFINE __dirname FIRST
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   SERVE REACT BUILD (AZURE)
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

    const { category, level, taskNumber, usedTexts } = req.body;

    // ---------- BASIC VALIDATION ----------
    if (!category || !level || !taskNumber) {
      console.error("❌ Missing required parameters");
      return res.status(400).json({
        error: "Missing required parameters",
        required: ["category", "level", "taskNumber"],
      });
    }

    const safeUsedTexts = Array.isArray(usedTexts) ? usedTexts : [];

    // ---------- INSTRUCTION BY CATEGORY ----------
    let instruction = "";

    if (category === "words") {
      instruction = `
Generate EXACTLY ONE English word.

Rules:
- Only ONE word
- No spaces
- No punctuation
- No numbering
- Plain text only
`;
    } else if (category === "sentences") {
      instruction =
        "Generate ONE simple English sentence for typing practice.";
    } else if (category === "paragraphs") {
      instruction =
        "Generate ONE short English paragraph for typing practice.";
    } else {
      console.error("❌ Invalid category:", category);
      return res.status(400).json({
        error: "Invalid category",
        allowed: ["words", "sentences", "paragraphs"],
      });
    }

    // ---------- UNIQUENESS BLOCK ----------
    const avoidText =
      safeUsedTexts.length > 0
        ? `
Do NOT repeat or reuse any of the following content:
${safeUsedTexts.join("\n")}
`
        : "";

    // ---------- PROMPT (UNCHANGED) ----------
    const prompt = `
You are a typing tutor.
Difficulty: ${level}
Task number: ${taskNumber}

${instruction}

${avoidText}

Rules:
- Plain text only
- No numbering
- No explanation
- Content must be NEW and DIFFERENT from all previous tasks
`;

    console.log("🧠 Sending prompt to Groq...");

    // ---------- GROQ CALL ----------
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const text = response?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      console.error("❌ Empty response from Gemini");
      return res.status(502).json({
        error: "Empty response from Gemini",
      });
    }

    console.log("✅ Generated text:", text);

    return res.status(200).json({ text });

  } catch (error) {
    console.error("🔥 /generate FAILED");
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

/* ===============================
   REACT ROUTE FALLBACK
================================ */
// Serve React for any unknown route (Express 5 SAFE)
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../build/index.html")
  );
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
