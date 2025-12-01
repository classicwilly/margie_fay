'use client';

import React from 'react';
import { useFormContext } from '../context/FormContext';
import ProgressIndicator from './ProgressIndicator';
import Step1StructureIdentification from './Step1StructureIdentification';
import Step2FamilyDivorceSeparation from './Step2FamilyDivorceSeparation';
import Step2FamilyIntact from './Step2FamilyIntact';
import Step2WorkTeam from './Step2WorkTeam';
import Step8ProtocolGeneration from './Step8ProtocolGeneration';

const STEP_NAMES = [
  'Structure ID',
  'Details',
  'Node Count',
  'State Assessment',
  'Operating Systems',
  'Stakeholders',
  'Timeline',
  'Protocol',
];

export default function FormWizard() {
  const { currentStep, formData, goToPreviousStep, resetForm } = useFormContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1StructureIdentification />;

      case 2:
        if (formData.structureType === 'family') {
          if (formData.familySubType === 'divorce-separation') {
            return <Step2FamilyDivorceSeparation />;
          } else if (formData.familySubType === 'intact') {
            return <Step2FamilyIntact />;
          }
        } else if (formData.structureType === 'team') {
          return <Step2WorkTeam />;
        } else if (formData.structureType === 'self' || formData.structureType === 'org') {
          return (
            <div className="text-center py-12">
              <p className="text-slate-300">Step 2: Additional Details (Coming Soon)</p>
              <p className="text-sm text-slate-500 mt-2">
                For {formData.structureType} structures, we will move directly to node configuration.
              </p>
            </div>
          );
        }
        return (
          <div className="text-center py-12">
            <p className="text-slate-300">Please complete Step 1 first.</p>
          </div>
        );

      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return (
          <div className="text-center py-12">
            <p className="text-slate-300">Step {currentStep}: Coming Soon</p>
            <p className="text-sm text-slate-500 mt-2">This step is under development.</p>
          </div>
        );

      case 8:
        return <Step8ProtocolGeneration />;

      default:
        return <Step1StructureIdentification />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            Protocol Deployment Guide
          </h2>
          <button
            onClick={resetForm}
            className="text-sm text-slate-400 hover:text-red-400 transition-colors"
            title="Reset form"
          >
            Reset
          </button>
        </div>
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={8}
          steps={STEP_NAMES}
        />
      </div>

      {/* Form Content */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        {renderStep()}

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={goToPreviousStep}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Previous Step
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-slate-500">
        <p>Your progress is automatically saved to your browser.</p>
      </div>
    </div>
  );
}
