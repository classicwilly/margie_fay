import React, { useState, useMemo } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../../ContentCard.js";

const QuickReferenceVaultModule = () => {
  const { appState, dispatch } = useAppState();
  const { quickReferenceEntries } = appState;
  const [searchTerm, setSearchTerm] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [visibleValues, setVisibleValues] = useState({});

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      return;
    }

    dispatch({
      type: "ADD_QUICK_REFERENCE_ENTRY",
      payload: {
        key: newKey.trim(),
        value: newValue.trim(),
      },
    });
    setNewKey("");
    setNewValue("");
  };

  const handleDelete = (id) => {
    dispatch({ type: "REMOVE_QUICK_REFERENCE_ENTRY", payload: id });
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  };

  const toggleVisibility = (id) => {
    setVisibleValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) {
      return quickReferenceEntries;
    }
    return quickReferenceEntries.filter((entry) =>
      entry.key.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, quickReferenceEntries]);

  return (
    <ContentCard title="🗂️ Quick Reference Vault">
      <div className="flex flex-col h-full">
        <p className="text-sm text-text-light text-opacity-80 mb-3">
          Store and retrieve small, critical pieces of information. Values are
          hidden by default.
        </p>
        <label htmlFor="quickref-search" className="sr-only">
          Search quick reference
        </label>
        <input
          type="text"
          id="quickref-search"
          placeholder="Search by key..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-800 border-2 border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />

        <div className="flex-grow space-y-2 mb-4 overflow-y-auto max-h-64 pr-2">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const isVisible = !!visibleValues[entry.id];
              return (
                <div
                  key={entry.id}
                  className="p-3 bg-gray-800 rounded-md border border-gray-700"
                >
                  <h4 className="font-bold text-accent-teal break-words">
                    {entry.key}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={entry.value}
                      readOnly
                      aria-label={`${entry.key} value`}
                      className="flex-grow p-1 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm"
                    />
                    <button
                      onClick={() => toggleVisibility(entry.id)}
                      className="p-2"
                      aria-label={isVisible ? "Hide value" : "Show value"}
                    >
                      {isVisible ? "👁️" : "🔒"}
                    </button>
                    <button
                      onClick={() => handleCopy(entry.value)}
                      className="p-2"
                      aria-label="Copy value"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-500"
                      aria-label="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-500 p-4">
              No entries found. Add one below.
            </p>
          )}
        </div>

        <form
          onSubmit={handleAddEntry}
          className="mt-auto pt-3 border-t border-gray-700 space-y-2"
        >
          <h4 className="font-semibold text-accent-green">Add New Entry</h4>
          <label htmlFor="quickref-key" className="sr-only">
            Key
          </label>
          <input
            type="text"
            id="quickref-key"
            placeholder="Key (e.g., Guest Wifi)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <label htmlFor="quickref-value" className="sr-only">
            Value
          </label>
          <input
            type="text"
            id="quickref-value"
            placeholder="Value (e.g., ChaosNet123!)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors"
          >
            Add to Vault
          </button>
        </form>
      </div>
    </ContentCard>
  );
};

export default QuickReferenceVaultModule;
