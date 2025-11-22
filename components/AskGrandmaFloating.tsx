import React from 'react';

const AskGrandmaFloating: React.FC = () => {
  const openGrandma = () => {
    // Ask Grandma input listens to this event to focus; send a hint
    const event = new CustomEvent('set-grandma-query', { detail: { value: '' } });
    window.dispatchEvent(event);
    // If the input exists, focus it
    const el = document.getElementById('grandma-input') as HTMLInputElement | null;
    if (el) el.focus();
  };
  return (
    <button
      aria-label="Open Ask Grandma"
      title="Ask Grandma"
      onClick={openGrandma}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-accent-pink to-accent-teal text-white p-3 rounded-full shadow-neon-md hover:scale-105 transition-transform"
    >
      ❤️
    </button>
  );
};

export default AskGrandmaFloating;
