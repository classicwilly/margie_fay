'use client';

import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  steps
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="w-full py-4">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-700">
          <div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
            role="progressbar"
            aria-label={`Step ${currentStep} of ${totalSteps}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex justify-between items-start">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-all duration-300 ' +
                  (isCompleted ? 'bg-green-500 text-white ' : '') +
                  (isCurrent ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white ring-2 ring-purple-400/50 ' : '') +
                  (isUpcoming ? 'bg-slate-700 text-slate-400 ' : '')
                }
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Label */}
              <div
                className={
                  'text-xs text-center max-w-20 ' +
                  (isCurrent ? 'text-purple-400 font-semibold ' : 'text-slate-500 ')
                }
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden text-center">
        <div className="text-sm font-semibold text-purple-400 mb-1">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="text-xs text-slate-400">{steps[currentStep - 1]}</div>
      </div>
    </div>
  );
}
