import express from "express";
	import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
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
app.use(express.static(path.join(__dirname, "../frontend/build")));

/* ===============================
   AZURE OPENAI CLIENT
================================ */
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: {
    "api-version": process.env.AZURE_OPENAI_API_VERSION,
  },
  defaultHeaders: {
    "api-key": process.env.AZURE_OPENAI_KEY,
  },
});

/* ===============================
   GENERATE CONTENT API
================================ */
app.post("/generate", async (req, res) => {
  const { category, level, taskNumber, usedTexts = [] } = req.body;

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
  }

  if (category === "sentences") {
    instruction =
      "Generate ONE simple English sentence for typing practice.";
  }

  if (category === "paragraphs") {
    instruction =
      "Generate ONE short English paragraph for typing practice.";
  }

  const avoidText =
    usedTexts.length > 0
      ? `
Do NOT repeat or reuse any of the following content:
${usedTexts.join("\n")}
`
      : "";

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

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    res.json({
      text: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("🔥 AZURE OPENAI ERROR 🔥");
    console.error(error?.response?.data || error.message);

    res.status(500).json({
      error: "Azure OpenAI failed",
      details: error?.response?.data || error.message,
    });
  }
});

/* ===============================
   REACT ROUTE FALLBACK
================================ */
// Serve React for any unknown route (Express 5 SAFE)
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html")
  );
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
