import { useState, useEffect } from "react";

export function useTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every minute, which is sufficient for time-based nudges
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return {
    hour: now.getHours(),
    day: now.getDay(),
    date: now,
  };
}
