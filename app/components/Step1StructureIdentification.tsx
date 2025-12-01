'use client';
/* eslint-disable react-hooks/incompatible-library */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1Data } from '../schemas/validation';
import { useFormContext } from '../context/FormContext';

export default function Step1StructureIdentification() {
  const { formData, updateFormData, goToNextStep } = useFormContext();
  const [selectedStructure, setSelectedStructure] = useState<string>(formData.structureType || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      structureType: formData.structureType,
      structureDescription: formData.structureDescription || '',
      familySubType: formData.familySubType,
      teamSubType: formData.teamSubType,
    },
  });

  const watchStructureType = watch('structureType');

  React.useEffect(() => {
    if (watchStructureType) {
      setSelectedStructure(watchStructureType);
    }
  }, [watchStructureType]);

  const onSubmit = (data: Step1Data) => {
    updateFormData(data);
    goToNextStep();
  };

  const structureTypes = [
    { value: 'family' as const, label: 'Family', description: 'Family unit or household system', icon: '👨‍👩‍👧‍👦' },
    { value: 'team' as const, label: 'Team', description: 'Work team or project group', icon: '👥' },
    { value: 'self' as const, label: 'Self', description: 'Individual or personal system', icon: '🧘' },
    { value: 'org' as const, label: 'Organization', description: 'Company or organizational system', icon: '🏢' },
  ];

  const familySubTypes = [
    { value: 'divorce-separation' as const, label: 'Divorce/Separation', description: 'Going through or navigating post-divorce/separation' },
    { value: 'intact' as const, label: 'Intact Family', description: 'Family unit experiencing stress or seeking improvement' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Identify Your Deployment Context</h2>
        <p className="text-slate-400">Select the context where you're deploying the resilience protocol.</p>
      </div>

      {/* Structure Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          What is your deployment context? <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {structureTypes.map((type) => {
            const isSelected = selectedStructure === type.value;
            return (
              <label
                key={type.value}
                className={'relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ' + 
                  (isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-700/50')}
              >
                <input type="radio" value={type.value} {...register('structureType')} className="sr-only" />
                <div className="flex items-start w-full">
                  <span className="text-3xl mr-3">{type.icon}</span>
                  <div className="flex-1">
                    <span className="block text-sm font-semibold text-white">{type.label}</span>
                    <span className="block text-xs text-slate-400 mt-1">{type.description}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.structureType && <p className="mt-2 text-sm text-red-400">{errors.structureType.message}</p>}
      </div>

      {/* Family Sub-Type Selection */}
      {selectedStructure === 'family' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Family Type <span className="text-red-400">*</span>
          </label>
          <div className="space-y-3">
            {familySubTypes.map((subType) => (
              <label key={subType.value} className="flex items-start p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 bg-slate-700/50 transition-colors">
                <input type="radio" value={subType.value} {...register('familySubType')} className="mt-1 mr-3 accent-purple-500" />
                <div>
                  <span className="block text-sm font-semibold text-white">{subType.label}</span>
                  <span className="block text-xs text-slate-400 mt-1">{subType.description}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.familySubType && <p className="mt-2 text-sm text-red-400">{errors.familySubType.message}</p>}
        </div>
      )}

      {/* Team Sub-Type Selection */}
      {selectedStructure === 'team' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Team Type <span className="text-red-400">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-start p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-green-500 bg-slate-700/50 transition-colors">
              <input type="radio" value="work-team" {...register('teamSubType')} className="mt-1 mr-3 accent-green-500" />
              <div>
                <span className="block text-sm font-semibold text-white">Work Team</span>
                <span className="block text-xs text-slate-400 mt-1">Professional team in organizational setting</span>
              </div>
            </label>
          </div>
          {errors.teamSubType && <p className="mt-2 text-sm text-red-400">{errors.teamSubType.message}</p>}
        </div>
      )}

      {/* Structure Description */}
      <div>
        <label htmlFor="structureDescription" className="block text-sm font-medium text-slate-300 mb-2">
          Structure Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="structureDescription"
          rows={4}
          {...register('structureDescription')}
          className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none"
          placeholder="Describe your structure, its purpose, and key characteristics..."
        />
        {errors.structureDescription && <p className="mt-2 text-sm text-red-400">{errors.structureDescription.message}</p>}
        <p className="mt-2 text-xs text-slate-500">Minimum 10 characters required</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
}
