import React from "react";
import { MemorialEntry } from "../data/memorials";
import { Button } from "./Button";

interface Props {
  entry: MemorialEntry;
  onCelebrate?: () => void;
  onAddMemory?: () => void;
}

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : "");

const MemorialCard: React.FC<Props> = ({ entry, onCelebrate, onAddMemory }) => {
  return (
    <div className="card-base w-full flex items-start gap-4 rounded-lg shadow-lg border border-accent-teal bg-card-dark p-6">
      <div className="flex-shrink-0">
        <img
          src={entry.photo || "/grandma.png"}
          alt={entry.name}
          className="h-24 w-24 rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-mono font-bold text-accent-teal mb-2 border-b border-surface-700 pb-2">
          {entry.name}
        </h3>
        <p className="text-sm text-text-muted">
          {formatDate(entry.birthDate)} — {formatDate(entry.deathDate)}
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap">{entry.excerpt}</p>
        <div className="mt-3 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="bg-accent-teal/10 text-accent-teal"
            onClick={onAddMemory}
          >
            Share a memory
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-accent-pink/10 text-accent-pink"
            onClick={onCelebrate}
          >
            Celebrate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemorialCard;
