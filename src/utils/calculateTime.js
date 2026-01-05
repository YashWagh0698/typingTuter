import { levelTimeMultiplier } from "./timeConfig";

export function calculateTime(text, level) {
  if (!text) return 10;

  const characters = text.length;

  // 1 word ≈ 5 characters
  const words = characters / 5;

  // Base seconds per word
  const baseSecondsPerWord = 2;

  const multiplier = levelTimeMultiplier[level] || 1.8;

  const timeInSeconds =
    Math.ceil(words * baseSecondsPerWord * multiplier);

  // Minimum & maximum safety limits
  return Math.min(Math.max(timeInSeconds, 10), 300);
}
