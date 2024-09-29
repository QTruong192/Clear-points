import { useEffect, useRef, useState } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setTime(
          parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(1))
        );
      }
    }, 100);
  };

  const resetTimer = () => {
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { time, startTimer, resetTimer };
};
