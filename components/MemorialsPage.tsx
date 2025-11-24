import React, { useEffect, useState } from "react";
import MemorialCard from "./MemorialCard";
import initialMemorials from "@data/memorials";
import { loadMemorials, saveMemorials } from "@utils/memorialStorage";

const isToday = (isoDate?: string) => {
  if (!isoDate) {
    return false;
  }
  const d = new Date(isoDate);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
};

const MemorialsPage: React.FC = () => {
  const [items, setItems] = useState(() => {
    const stored = loadMemorials();
    return stored.length ? stored : initialMemorials;
  });
  const [celebrate, setCelebrate] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    saveMemorials(items);
  }, [items]);

  useEffect(() => {
    // If today matches any birthday show the celebration
    const hasBirthday = items.some((item) => isToday(item.birthDate));
    setCelebrate(hasBirthday);
    if (hasBirthday) {
      setTimeout(() => setCelebrate(false), 12000);
    }
  }, [items]);

  const onAddMemory = (id: string) => {
    const note = prompt("Share a memory:");
    if (!note) {
      return;
    }
    // For simplicity we store a simple appended excerpt
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              excerpt: `${p.excerpt}\n\n${new Date().toLocaleDateString()}: ${note}`,
            }
          : p,
      ),
    );
  };

  const onCelebrate = (id: string) => {
    setSelected(id);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 10000);
  };

  return (
    <main className="container mx-auto p-4">
      {celebrate && (
        <div className="p-4 mb-6 bg-accent-teal/10 rounded shadow-neon-sm text-center font-bold">
          Celebrating a loved one today 💖
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id}>
            <MemorialCard
              entry={item}
              onCelebrate={() => onCelebrate(item.id)}
              onAddMemory={() => onAddMemory(item.id)}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default MemorialsPage;
