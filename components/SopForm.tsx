import React, { useState } from "react";
import { Sop } from "../types";
import { generateId } from "@utils/generateId";
import { useAppState } from "@contexts/AppStateContext";
import { Button } from "./Button";

const SopForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]); // Start with one empty step input
  const [cues, setCues] = useState<string[]>([""]); // Start with one empty cue input
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAppState();

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length === 0 ? [""] : newSteps); // Ensure at least one input remains
  };

  const handleCueChange = (index: number, value: string) => {
    const newCues = [...cues];
    newCues[index] = value;
    setCues(newCues);
  };

  const handleAddCue = () => {
    setCues([...cues, ""]);
  };

  const handleRemoveCue = (index: number) => {
    const newCues = cues.filter((_, i) => i !== index);
    setCues(newCues.length === 0 ? [""] : newCues); // Ensure at least one input remains
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const filteredSteps = steps.filter((step) => step.trim() !== "");
    const filteredCues = cues.filter((cue) => cue.trim() !== "");

    if (!title.trim() || !description.trim() || filteredSteps.length === 0) {
      setError(
        "Title, description, and at least one step are required. Execute fully.",
      );
      return;
    }

    // Automatically prepend step numbers to each step content
    const formattedStepsForSop = filteredSteps.map(
      (stepContent, index) => `${index + 1}. ${stepContent}`,
    );

    const newSop: Sop = {
      id: generateId(), // Unique ID generation
      category: "M4_SOP_USER", // Category for user-defined SOPs
      title: title.trim(),
      description: description.trim(),
      steps: formattedStepsForSop, // Use the formatted steps with prepended numbers
      cues: filteredCues.length > 0 ? filteredCues : undefined,
    };

    dispatch({ type: "ADD_SOP", payload: newSop });
    handleClearForm(); // Reset form after submission
  };

  const handleClearForm = () => {
    setTitle("");
    setDescription("");
    setSteps([""]);
    setCues([""]);
    setError(null);
  };

  return (
    <section className="mb-10 p-6 bg-card-dark rounded-lg shadow-md border border-gray-700">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          Create New Protocol
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          Define a new Standard Operating Procedure. Be precise. Be clear. This
          is the structure that will absorb chaos.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-800 bg-opacity-30 border border-red-700 text-red-400 p-4 rounded-md mb-4"
          >
            <p className="font-semibold mb-2">Error: Non-Compliance Detected</p>
            <p>{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="sop-title"
            className="block text-accent-teal text-lg font-medium mb-2"
          >
            Protocol Title: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sop-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="e.g., Solo Execution Mode Refinement"
            required
          />
        </div>

        <div>
          <label
            htmlFor="sop-description"
            className="block text-accent-teal text-lg font-medium mb-2"
          >
            Description: <span className="text-red-500">*</span>
          </label>
          <textarea
            id="sop-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="e.g., Adjustments to deep work blocks for optimized focus. Mandatory."
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-accent-teal text-lg font-medium mb-2">
            Protocol Steps: <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-text-light font-bold flex-shrink-0 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  placeholder="Action to be executed (e.g., Water: Consume 500ml)."
                  aria-label={`Protocol Step ${index + 1} content`}
                  required={index === 0}
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="rounded"
                    variant="danger"
                    size="sm"
                    aria-label={`Remove protocol step ${index + 1}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleAddStep}
            className="mt-4"
            variant="secondary"
            aria-label="Add another protocol step"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Step
          </Button>
        </div>

        <div>
          <label className="block text-accent-teal text-lg font-medium mb-2">
            Actionable Cues: (Optional)
          </label>
          <div className="space-y-3">
            {cues.map((cue, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cue}
                  onChange={(e) => handleCueChange(index, e.target.value)}
                  className="grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  placeholder={`Cue ${index + 1}: Quick reminder.`}
                  aria-label={`Actionable Cue ${index + 1} content`}
                />
                {cues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCue(index)}
                    className="p-2 bg-red-700 bg-opacity-40 text-red-300 rounded-md hover:bg-red-600 transition-colors duration-200"
                    aria-label={`Remove actionable cue ${index + 1}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleAddCue}
            className="mt-4"
            variant="secondary"
            aria-label="Add another actionable cue"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Cue
          </Button>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={handleClearForm}
            className=""
            variant="secondary"
            aria-label="Clear all form fields"
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            className=""
            variant="primary"
            aria-label="Submit new protocol"
          >
            Add Protocol
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SopForm;
export { SopForm };
