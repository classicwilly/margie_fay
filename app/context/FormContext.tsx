'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, startTransition } from 'react';
import { FormData, StepData } from '../types/form';

interface FormContextType {
  formData: Partial<FormData>;
  currentStep: number;
  updateFormData: (data: StepData) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const STORAGE_KEY = 'phenix-form-data';
const STEP_KEY = 'phenix-current-step';

const initialFormData: Partial<FormData> = {
  structureType: undefined,
  structureDescription: '',
  nodeCount: 0,
  nodes: [],
  currentState: undefined,
  stateDescription: '',
  stakeholders: [],
  timelineStart: '',
  timelineEnd: '',
  constraints: [],
  protocolNotes: '',
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<FormData>>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);

    startTransition(() => {
      if (savedData) {
        try {
          setFormData(JSON.parse(savedData));
        } catch {
          // Ignore parse errors
        }
      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
      setIsHydrated(true);
    });
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isHydrated]);

  // Save current step to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STEP_KEY, currentStep.toString());
    }
  }, [currentStep, isHydrated]);

  const updateFormData = (data: StepData) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 8) {
      setCurrentStep(step);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}