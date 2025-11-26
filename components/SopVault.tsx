import { useState } from "react";
import type { FC } from "react";
// Intentional: Not referencing SopCard/SOP_DATA here currently. Kept imports removed until vault is fleshed out.
import { useAppState } from "@contexts/AppStateContext";
import { Button } from "./Button";
import { NEURO_SOP_TEMPLATES } from "../src/sops/neuro/neuro_sop_templates";
// Removed unused utility imports to reduce noise

const SopVault: FC = () => {
  // CONSOLIDATED: Only keep the clean, modern layout and protocol vault view
  const { dispatch } =
    typeof useAppState === "function" ? useAppState() : { dispatch: () => {} };
  const [showImportMenu, setShowImportMenu] = useState(false);
  const handleImport = () => setShowImportMenu((v) => !v);
  const handleImportNeuro = () => {
    if (Array.isArray(NEURO_SOP_TEMPLATES)) {
      NEURO_SOP_TEMPLATES.forEach((tpl) => {
        dispatch && dispatch({ type: "ADD_SOP", payload: tpl });
      });
    }
    setShowImportMenu(false);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-extrabold text-accent-teal">
              Flight Protocol Vault: All Protocols
            </h2>
            <p className="text-lg text-text-light text-opacity-90 max-w-3xl leading-relaxed mt-2">
              The central library for every protocol in the Wonky Sprout OS.
              Find the system you need to execute.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex items-center flex-shrink-0"
              variant="primary"
              aria-label="Create a new protocol"
            >
              Create New Protocol
            </Button>
            <Button
              className="flex items-center flex-shrink-0"
              variant="secondary"
              aria-label="Import"
              data-testid="import-btn"
              onClick={handleImport}
            >
              Import
            </Button>
            {showImportMenu && (
              <div
                role="menu"
                aria-label="Import Menu"
                className="absolute z-50 mt-2 right-0 bg-surface-900 border border-accent-teal rounded shadow-lg min-w-[220px] import-menu-dropdown"
              >
                <button
                  role="menuitem"
                  className="block w-full text-left px-4 py-2 hover:bg-accent-teal hover:text-white focus:outline-none"
                  onClick={handleImportNeuro}
                  data-testid="import-neuro-option"
                >
                  Neurodivergent Templates
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search Flight Protocols by title or description..."
            className="w-full p-4 bg-surface-800 border-2 border-accent-teal rounded-md text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-teal"
          />
        </div>
      </section>
      <section>
        <h3 className="text-2xl font-bold text-accent-green mb-4">
          Foundational Protocols
        </h3>
        <p className="text-lg text-text-light text-opacity-80 mb-6">
          Core, repeatable systems for managing daily operations and maintaining
          stability.
        </p>
        {/* Example protocol cards, replace with dynamic rendering as needed */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card-base">
            <h4 className="font-bold text-accent-teal mb-2">
              Foundational Daily Protocol
            </h4>
            <p className="text-text-light text-opacity-80">
              The core 5 protocols required for system stability. Execute
              sequentially without deviation.
            </p>
          </div>
          <div className="card-base">
            <h4 className="font-bold text-accent-teal mb-2">
              Morning Transition Protocol
            </h4>
            <p className="text-text-light text-opacity-80">
              A structured sequence to bridge the gap between sleep and active
              mode.
            </p>
          </div>
          <div className="card-base">
            <h4 className="font-bold text-accent-teal mb-2">
              Solo Execution Mode
            </h4>
            <p className="text-text-light text-opacity-80">
              Optimized for deep work and focused output. Strictly adhere to
              hourly blocks. Minimize distractions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SopVault;
export { SopVault };
