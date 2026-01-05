import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Azure OpenAI client
 */
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

app.post("/generate", async (req, res) => {
  // 🔹 CHANGE 1: read usedTexts
  const { category, level, taskNumber, usedTexts = [] } = req.body;

  let instruction = "";

  if (category === "words") {
    instruction = `
Generate EXACTLY ONE English word for typing practice.

Rules:
- Only ONE word
- No spaces
- No punctuation
- No numbering
- No explanation
- Plain text only
`;
  }

  if (category === "sentences") {
    instruction =
      "Generate a simple English sentence for typing practice.";
  }

  if (category === "paragraphs") {
    instruction =
      "Generate a short English paragraph for typing practice.";
  }

  // 🔹 CHANGE 2: uniqueness block (ONLY if previous tasks exist)
  const avoidText =
    usedTexts.length > 0
      ? `
Do NOT repeat or reuse any of the following content:
${usedTexts.join("\n")}
`
      : "";

  // 🔹 CHANGE 3: add uniqueness rule to prompt
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
- Content must be NEW and DIFFERENT from all previous tasks in this tutorial
`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT, // 🔥 REQUIRED FOR AZURE
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
