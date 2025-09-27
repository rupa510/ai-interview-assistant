import React, { useEffect, useState } from 'react';

const Timer = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  return (
    <div className="badge bg-secondary">
      Time Left: {timeLeft}s
    </div>
  );
};

export default Timer;
