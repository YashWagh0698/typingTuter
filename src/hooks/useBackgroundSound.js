import { useEffect, useRef } from "react";

export function useBackgroundSound(timeLeft, isRunning) {
  const tickRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    tickRef.current = new Audio("/audio/tick.mp3");
    timeoutRef.current = new Audio("/audio/timeOut.mp3");
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft > 0) {
      tickRef.current.currentTime = 0;
      tickRef.current.play().catch(() => {});
    }

    if (timeLeft === 0) {
      timeoutRef.current.play().catch(() => {});
    }
  }, [timeLeft, isRunning]);
}
