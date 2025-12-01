'use client';
/* eslint-disable react-hooks/incompatible-library */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { familyIntactSchema, FamilyIntactData } from '../schemas/validation';
import { useFormContext } from '../context/FormContext';

export default function Step2FamilyIntact() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const [customStressPoint, setCustomStressPoint] = useState('');
  const [customChange, setCustomChange] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FamilyIntactData>({
    resolver: zodResolver(familyIntactSchema),
    defaultValues: {
      stressPoints: formData.familyIntact?.stressPoints || [],
      stressDescription: formData.familyIntact?.stressDescription || '',
      communicationPattern: formData.familyIntact?.communicationPattern,
      communicationNotes: formData.familyIntact?.communicationNotes || '',
      recentChanges: formData.familyIntact?.recentChanges || [],
      changeDescription: formData.familyIntact?.changeDescription || '',
    },
  });

  const stressPoints = watch('stressPoints') || [];
  const recentChanges = watch('recentChanges') || [];

  const onSubmit = (data: FamilyIntactData) => {
    updateFormData({ familyIntact: data });
    goToNextStep();
  };

  const commonStressPoints = [
    'Financial pressures',
    'Work-life balance',
    'Parenting disagreements',
    'Extended family issues',
    'Health concerns',
    'Communication breakdown',
  ];

  const commonChanges = [
    'New job/career change',
    'Relocation/moving',
    'Birth of child',
    'Child starting school',
    'Loss of family member',
    'Health diagnosis',
    'Financial change',
  ];

  const toggleStressPoint = (point: string) => {
    const current = stressPoints;
    if (current.includes(point)) {
      setValue('stressPoints', current.filter(p => p !== point));
    } else {
      setValue('stressPoints', [...current, point]);
    }
  };

  const addCustomStressPoint = () => {
    if (customStressPoint.trim()) {
      setValue('stressPoints', [...stressPoints, customStressPoint.trim()]);
      setCustomStressPoint('');
    }
  };

  const toggleChange = (change: string) => {
    const current = recentChanges;
    if (current.includes(change)) {
      setValue('recentChanges', current.filter(c => c !== change));
    } else {
      setValue('recentChanges', [...current, change]);
    }
  };

  const addCustomChange = () => {
    if (customChange.trim()) {
      setValue('recentChanges', [...recentChanges, customChange.trim()]);
      setCustomChange('');
    }
  };

  const removeStressPoint = (point: string) => {
    setValue('stressPoints', stressPoints.filter(p => p !== point));
  };

  const removeChange = (change: string) => {
    setValue('recentChanges', recentChanges.filter(c => c !== change));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Intact Family Details
        </h2>
        <p className="text-slate-400">
          Help us understand the current dynamics and challenges in your family system.
        </p>
      </div>

      {/* Stress Points */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Stress Points <span className="text-red-400">*</span>
        </label>
        <p className="text-sm text-slate-500 mb-3">Select all that apply:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {commonStressPoints.map((point) => (
            <label
              key={point}
              className="flex items-center p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50"
            >
              <input
                type="checkbox"
                checked={stressPoints.includes(point)}
                onChange={() => toggleStressPoint(point)}
                className="mr-3 accent-blue-500"
              />
              <span className="text-sm text-white">{point}</span>
            </label>
          ))}
        </div>

        {/* Custom Stress Point */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customStressPoint}
            onChange={(e) => setCustomStressPoint(e.target.value)}
            placeholder="Add custom stress point..."
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-slate-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomStressPoint();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomStressPoint}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Selected Stress Points */}
        {stressPoints.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {stressPoints.map((point) => (
              <span
                key={point}
                className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
              >
                {point}
                <button
                  type="button"
                  onClick={() => removeStressPoint(point)}
                  className="ml-2 text-blue-400 hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.stressPoints && (
          <p className="mt-2 text-sm text-red-400">{errors.stressPoints.message}</p>
        )}
      </div>

      {/* Stress Description */}
      <div>
        <label htmlFor="stressDescription" className="block text-sm font-medium text-slate-300 mb-2">
          Stress Point Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="stressDescription"
          rows={4}
          {...register('stressDescription')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe the stress points in detail, including how they affect family dynamics..."
        />
        {errors.stressDescription && (
          <p className="mt-2 text-sm text-red-400">{errors.stressDescription.message}</p>
        )}
      </div>

      {/* Communication Pattern */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Communication Pattern <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'open', label: 'Open', desc: 'Family members communicate freely and honestly' },
            { value: 'selective', label: 'Selective', desc: 'Some topics are discussed, others avoided' },
            { value: 'avoidant', label: 'Avoidant', desc: 'Difficult conversations are avoided' },
            { value: 'aggressive', label: 'Aggressive', desc: 'Conflict often escalates to arguments' },
            { value: 'passive-aggressive', label: 'Passive-Aggressive', desc: 'Indirect expression of feelings' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50"
            >
              <input
                type="radio"
                value={option.value}
                {...register('communicationPattern')}
                className="mt-1 mr-3 accent-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-white">{option.label}</span>
                <span className="block text-xs text-slate-400">{option.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.communicationPattern && (
          <p className="mt-2 text-sm text-red-400">{errors.communicationPattern.message}</p>
        )}
      </div>

      {/* Communication Notes */}
      <div>
        <label htmlFor="communicationNotes" className="block text-sm font-medium text-slate-300 mb-2">
          Communication Notes <span className="text-red-400">*</span>
        </label>
        <textarea
          id="communicationNotes"
          rows={4}
          {...register('communicationNotes')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe communication patterns in your family, including examples and any concerns..."
        />
        {errors.communicationNotes && (
          <p className="mt-2 text-sm text-red-400">{errors.communicationNotes.message}</p>
        )}
      </div>

      {/* Recent Changes */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Recent Changes <span className="text-red-400">*</span>
        </label>
        <p className="text-sm text-slate-500 mb-3">Select all that apply:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {commonChanges.map((change) => (
            <label
              key={change}
              className="flex items-center p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50"
            >
              <input
                type="checkbox"
                checked={recentChanges.includes(change)}
                onChange={() => toggleChange(change)}
                className="mr-3 accent-blue-500"
              />
              <span className="text-sm text-white">{change}</span>
            </label>
          ))}
        </div>

        {/* Custom Change */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customChange}
            onChange={(e) => setCustomChange(e.target.value)}
            placeholder="Add custom change..."
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-slate-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomChange();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomChange}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Selected Changes */}
        {recentChanges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {recentChanges.map((change) => (
              <span
                key={change}
                className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30"
              >
                {change}
                <button
                  type="button"
                  onClick={() => removeChange(change)}
                  className="ml-2 text-green-400 hover:text-green-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.recentChanges && (
          <p className="mt-2 text-sm text-red-400">{errors.recentChanges.message}</p>
        )}
      </div>

      {/* Change Description */}
      <div>
        <label htmlFor="changeDescription" className="block text-sm font-medium text-slate-300 mb-2">
          Change Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="changeDescription"
          rows={4}
          {...register('changeDescription')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe how these changes have affected your family, including timing and impact..."
        />
        {errors.changeDescription && (
          <p className="mt-2 text-sm text-red-400">{errors.changeDescription.message}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
}
