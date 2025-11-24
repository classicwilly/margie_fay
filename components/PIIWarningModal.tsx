import React from "react";

import { Modal } from "./Modal";
import { Button } from "./Button";

const PIIWarningModal = ({ isOpen, onCancel, onConfirm, matches }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabelledBy="pii-warning-title"
      preventBackgroundClick={true}
    >
      <div className="bg-card-dark rounded-lg shadow-2xl p-8 border border-accent-warning w-full max-w-lg m-4">
        <header className="flex justify-between items-center mb-6">
          <h2
            id="pii-warning-title"
            className="text-3xl font-extrabold text-accent-warning"
          >
            Data Privacy Warning
          </h2>
        </header>

        <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700">
          <p
            data-testid="pii-warning-title"
            className="font-bold text-yellow-300 text-lg"
          >
            Potential Sensitive Data Detected!
          </p>
          <p className="text-yellow-300 mt-2 text-sm">
            Our scanner found the following potentially sensitive information in
            your prompt. For your privacy, we recommend removing it before
            sending to the AI.
          </p>
          <ul className="list-disc list-inside mt-3 text-sm text-yellow-200 space-y-1 max-h-40 overflow-y-auto">
            {matches.map((match, index) => (
              <li key={index}>
                <strong>{match.type}:</strong> "{match.value}"
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button
            data-testid="pii-edit-prompt"
            variant="secondary"
            onClick={onCancel}
          >
            Edit Prompt
          </Button>
          <Button
            data-testid="pii-send-anyway"
            variant="danger"
            onClick={onConfirm}
            autoFocus
          >
            Send Anyway
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PIIWarningModal;
