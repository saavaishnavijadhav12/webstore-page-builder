import { useEffect, useState } from "react";

interface IdleTimeoutProps {
  timeout: number;
  onTimeout: () => void;
}

const IdleTimeout: React.FC<IdleTimeoutProps> = ({ timeout, onTimeout }) => {
  const [idleTime, setIdleTime] = useState(0);

  // Function to reset idle time
  const resetIdleTime = () => {
    setIdleTime(0);
  };

  useEffect(() => {
    let idleTimer: string | number | NodeJS.Timer | undefined;

    // Function to increment idle time
    const incrementIdleTime = () => {
      setIdleTime(idleTime + 1);
    };

    // Event listener to reset idle time on user activity
    const resetIdleTimerOnActivity = () => {
      resetIdleTime();
      window.removeEventListener("mousemove", resetIdleTimerOnActivity);
      window.removeEventListener("keypress", resetIdleTimerOnActivity);
    };

    // Start idle timer
    const startIdleTimer = () => {
      idleTimer = setInterval(incrementIdleTime, 1000);
    };

    // Start idle timer on component mount
    startIdleTimer();

    // Reset idle time on user activity
    window.addEventListener("mousemove", resetIdleTimerOnActivity);
    window.addEventListener("keypress", resetIdleTimerOnActivity);

    // Clear idle timer on component unmount
    return () => {
      clearInterval(idleTimer);
      window.removeEventListener("mousemove", resetIdleTimerOnActivity);
      window.removeEventListener("keypress", resetIdleTimerOnActivity);
    };
  }, [idleTime]);

  // Check for timeout
  useEffect(() => {
    if (idleTime >= timeout) {
      onTimeout();
    }
  }, [idleTime, timeout, onTimeout]);

  return null;
};

export default IdleTimeout;
