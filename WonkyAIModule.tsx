import React, { useState } from 'react';
import GrandmaHelper from './components/GrandmaHelper';

const WonkyAIModule: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleAsk = () => {
    console.log("Asking Grandma:", query);
    // Implement AI logic here
  };

  return (
    <div className="relative bg-gradient-to-br from-background-dark to-primary-dark-300 p-6 rounded-lg shadow-neon-md border border-primary-dark-200 overflow-hidden">
      <GrandmaHelper />
      <div className="absolute right-0 top-0 h-full w-1 bg-accent-400/80"></div>
      <div className="mt-4 relative">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-background-dark text-text-light placeholder-pink-500/30 focus:outline-none focus:ring-2 focus:ring-accent-500 pr-28"
          placeholder="What's overwhelming you, honey?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-accent-600 text-white font-bold rounded shadow-md hover:bg-accent-700 transition-colors"
          onClick={handleAsk}
        >
          ASK
        </button>
      </div>
      <button
        aria-label="Ask Grandma quick action"
        className="absolute -bottom-4 right-6 h-12 w-12 rounded-full bg-yellow-400 ring-4 ring-pink-600/70 shadow-lg flex items-center justify-center text-lg"
        onClick={() => setQuery("Hi Grandma!")}
      >
        🍋
      </button>
    </div>
  );
};

export default WonkyAIModule;
