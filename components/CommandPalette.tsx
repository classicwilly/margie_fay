import { useRef, useEffect, type FC } from "react";

const ResultIcon = ({ type }) => {
  const icons = {
    action: "⚡️",
    view: "🖥️",
    sop: "📄",
    task: "✅",
    knowledge: "🧠",
    objective: "🎯",
    project: "🏗️",
  };
  return <span className="text-xl mr-3">{icons[type] || "➡️"}</span>;
};

export const CommandPalette: FC<any> = ({
  isOpen,
  searchTerm,
  setSearchTerm,
  results,
  selectedIndex,
  onClose,
  onSelect,
}) => {
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-card-dark rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Flight Protocols, tasks, views, or run a command..."
            data-testid="command-palette-input"
            className="w-full p-4 bg-transparent text-lg text-text-light placeholder-gray-500 focus:outline-none border-b border-gray-700"
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500 hidden sm:block">
            <kbd className="px-2 py-1.5 border border-gray-600 rounded">
              Esc
            </kbd>{" "}
            to close
          </div>
        </div>
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={result.id}
                data-testid={`command-palette-item-${result.id}`}
                onClick={() => onSelect(result)}
                className={`w-full text-left p-4 flex items-center transition-colors ${
                  selectedIndex === index
                    ? "bg-accent-blue/20"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <ResultIcon type={result.type} />
                <div>
                  <p className="font-semibold text-text-light">
                    {result.title}
                  </p>
                  {result.description && (
                    <p className="text-sm text-gray-400">
                      {result.description}
                    </p>
                  )}
                </div>
              </button>
            ))
          ) : (
            <p className="p-6 text-center text-gray-500">No results found.</p>
          )}
        </div>
        <div className="p-2 bg-gray-800 text-xs text-center text-gray-500 border-t border-gray-700">
          Use{" "}
          <kbd className="px-1.5 py-1 border border-gray-600 rounded">↑</kbd>{" "}
          <kbd className="px-1.5 py-1 border border-gray-600 rounded">↓</kbd> to
          navigate and{" "}
          <kbd className="px-1.5 py-1 border border-gray-600 rounded">
            Enter
          </kbd>{" "}
          to select.
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
