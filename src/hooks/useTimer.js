import { useEffect, useState } from "react";

export function useTimer(initialTime) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = (time) => {
    setTimeLeft(time);
    setIsRunning(false);
  };

  return { timeLeft, start, stop, reset, isRunning };
}
