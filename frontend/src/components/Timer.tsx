import React, { useEffect, useState } from 'react';

interface TimerProps {
  seconds: number;
  onExpire: () => void;
}

const Timer: React.FC<TimerProps> = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
      {minutes}:{secs.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
