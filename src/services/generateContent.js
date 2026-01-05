export async function generateContent(category, level, taskNumber, tutorial) {
  const saved = sessionStorage.getItem(
    `tutorial-${category}-${level}-${tutorial}`
  );

  const usedTexts = saved
    ? JSON.parse(saved).map(t => t.correctText)
    : [];

  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category,
      level,
      taskNumber,
      usedTexts, // 🔴 IMPORTANT
    }),
  });

  const data = await res.json();
  return data.text;
}
