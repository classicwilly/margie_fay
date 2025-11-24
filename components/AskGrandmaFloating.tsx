import React from "react";

const AskGrandmaFloating: React.FC = () => {
  const openGrandma = () => {
    // Dispatch both legacy and new events so either listener will respond
    const legacy = new CustomEvent("set-grandma-query", {
      detail: { value: "" },
    });
    const generic = new CustomEvent("set-ai-query", { detail: { value: "" } });
    window.dispatchEvent(legacy);
    window.dispatchEvent(generic);
    // If the input exists, focus it
    const el = document.getElementById(
      "grandma-input",
    ) as HTMLInputElement | null;
    if (el) {
      el.focus();
    }
  };
  return (
    <button
      aria-label="Open Ask Grandma"
      title="Ask AI"
      data-workshop-testid="open-ask-ai"
      onClick={openGrandma}
      className="fixed bottom-6 right-6 z-[99999] btn-primary fab fab-enforced rounded-full shadow-neon-md text-2xl p-4 hover:scale-105 transition-transform"
    >
      ❤️
    </button>
  );
};

export default AskGrandmaFloating;
