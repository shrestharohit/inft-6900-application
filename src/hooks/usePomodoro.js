import { useState, useEffect, useRef } from "react";

const usePomodoro = (workMinutes = 25, breakMinutes = 5) => {
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const timerRef = useRef(null);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          const nextBreak = !onBreak;
          const nextTime = nextBreak ? breakMinutes * 60 : workMinutes * 60;
          setOnBreak(nextBreak);

          // Trigger notification
          new Notification(nextBreak ? "Break time!" : "Work session started!");
          return nextTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, onBreak, workMinutes, breakMinutes]);

  return { timeLeft, isRunning, onBreak, start, pause, reset };
};

export default usePomodoro;
