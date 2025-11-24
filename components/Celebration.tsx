import React, { useEffect, useState } from "react";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Celebration: React.FC<{ active?: boolean }> = ({ active = false }) => {
  const [hearts, setHearts] = useState<number[]>([]);
  const choices = {
    left: [
      "left-5",
      "left-15",
      "left-25",
      "left-35",
      "left-45",
      "left-55",
      "left-65",
      "left-75",
      "left-85",
    ],
    top: ["top-0", "top-5", "top-10"],
    size: ["size-12", "size-16", "size-20"],
    delay: ["delay-0", "delay-80", "delay-160", "delay-240"],
  };
  useEffect(() => {
    if (!active) {
      setHearts([]);
      return;
    }
    const arr = Array.from({ length: 16 }, (_, i) => i);
    setHearts(arr);
    const timer = setTimeout(() => setHearts([]), 3000);
    return () => clearTimeout(timer);
  }, [active]);
  if (!active) {
    return null;
  }
  return (
    <div className="confetti" aria-hidden>
      {hearts.map((h, i) => {
        const left =
          choices.left[Math.floor(Math.random() * choices.left.length)];
        const top = choices.top[Math.floor(Math.random() * choices.top.length)];
        const size =
          choices.size[Math.floor(Math.random() * choices.size.length)];
        const delay =
          choices.delay[Math.floor(Math.random() * choices.delay.length)];
        const cls = `heart ${"heart-" + left} ${"heart-" + top} ${"heart-" + size} ${"heart-" + delay}`;
        return <div key={h} className={cls} />;
      })}
    </div>
  );
};

export default Celebration;
