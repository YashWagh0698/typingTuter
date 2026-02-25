export async function generateContent(
  category,
  level,
  tutorialNumber,
  taskNumber
) {
  const saved = sessionStorage.getItem(
    `tutorial-${category}-${level}-${tutorialNumber}`
  );

  const usedTexts = saved
    ? JSON.parse(saved).map(t => t.correctText)
    : [];

  const res = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      level,
      tutorialNumber, // ✅ REQUIRED BY BACKEND
      taskNumber,
      usedTexts,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate content");
  }

  const data = await res.json();
  return data.text;
}
