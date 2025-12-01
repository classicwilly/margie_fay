'use client';
/* eslint-disable react-hooks/incompatible-library */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workTeamSchema, WorkTeamData } from '../schemas/validation';
import { useFormContext } from '../context/FormContext';

export default function Step2WorkTeam() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const [customDysfunction, setCustomDysfunction] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkTeamData>({
    resolver: zodResolver(workTeamSchema),
    defaultValues: {
      teamSize: formData.workTeam?.teamSize || 2,
      reportingStructure: formData.workTeam?.reportingStructure,
      structureDetails: formData.workTeam?.structureDetails || '',
      currentDysfunction: formData.workTeam?.currentDysfunction || [],
      dysfunctionDescription: formData.workTeam?.dysfunctionDescription || '',
    },
  });

  const currentDysfunction = watch('currentDysfunction') || [];

  const onSubmit = (data: WorkTeamData) => {
    updateFormData({ workTeam: data });
    goToNextStep();
  };

  const commonDysfunctions = [
    'Lack of trust',
    'Fear of conflict',
    'Lack of commitment',
    'Avoidance of accountability',
    'Inattention to results',
    'Poor communication',
    'Unclear roles',
    'Resource constraints',
    'Leadership issues',
    'Siloed departments',
  ];

  const toggleDysfunction = (dysfunction: string) => {
    const current = currentDysfunction;
    if (current.includes(dysfunction)) {
      setValue('currentDysfunction', current.filter(d => d !== dysfunction));
    } else {
      setValue('currentDysfunction', [...current, dysfunction]);
    }
  };

  const addCustomDysfunction = () => {
    if (customDysfunction.trim()) {
      setValue('currentDysfunction', [...currentDysfunction, customDysfunction.trim()]);
      setCustomDysfunction('');
    }
  };

  const removeDysfunction = (dysfunction: string) => {
    setValue('currentDysfunction', currentDysfunction.filter(d => d !== dysfunction));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Work Team Details
        </h2>
        <p className="text-slate-400">
          Help us understand your team structure and current challenges.
        </p>
      </div>

      {/* Team Size */}
      <div>
        <label htmlFor="teamSize" className="block text-sm font-medium text-slate-300 mb-2">
          Team Size <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          id="teamSize"
          {...register('teamSize', { valueAsNumber: true })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-slate-500"
          placeholder="Number of team members"
          min="2"
          max="100"
        />
        {errors.teamSize && (
          <p className="mt-2 text-sm text-red-400">{errors.teamSize.message}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Number of people in your team (2-100)
        </p>
      </div>

      {/* Reporting Structure */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Reporting Structure <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {[
            {
              value: 'flat',
              label: 'Flat',
              desc: 'Minimal hierarchy, team members report to single leader',
            },
            {
              value: 'hierarchical',
              label: 'Hierarchical',
              desc: 'Clear chain of command with multiple levels',
            },
            {
              value: 'matrix',
              label: 'Matrix',
              desc: 'Team members report to multiple managers',
            },
            {
              value: 'hybrid',
              label: 'Hybrid',
              desc: 'Mix of different reporting structures',
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50"
            >
              <input
                type="radio"
                value={option.value}
                {...register('reportingStructure')}
                className="mt-1 mr-3 accent-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-white">{option.label}</span>
                <span className="block text-xs text-slate-400">{option.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.reportingStructure && (
          <p className="mt-2 text-sm text-red-400">{errors.reportingStructure.message}</p>
        )}
      </div>

      {/* Structure Details */}
      <div>
        <label htmlFor="structureDetails" className="block text-sm font-medium text-slate-300 mb-2">
          Structure Details <span className="text-red-400">*</span>
        </label>
        <textarea
          id="structureDetails"
          rows={4}
          {...register('structureDetails')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe your team's reporting structure, key roles, decision-making processes..."
        />
        {errors.structureDetails && (
          <p className="mt-2 text-sm text-red-400">{errors.structureDetails.message}</p>
        )}
      </div>

      {/* Current Dysfunction */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Current Dysfunction <span className="text-red-400">*</span>
        </label>
        <p className="text-sm text-slate-500 mb-3">Select all that apply (based on The Five Dysfunctions of a Team):</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {commonDysfunctions.map((dysfunction) => (
            <label
              key={dysfunction}
              className="flex items-center p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50"
            >
              <input
                type="checkbox"
                checked={currentDysfunction.includes(dysfunction)}
                onChange={() => toggleDysfunction(dysfunction)}
                className="mr-3 accent-blue-500"
              />
              <span className="text-sm text-white">{dysfunction}</span>
            </label>
          ))}
        </div>

        {/* Custom Dysfunction */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customDysfunction}
            onChange={(e) => setCustomDysfunction(e.target.value)}
            placeholder="Add custom dysfunction..."
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-slate-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomDysfunction();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomDysfunction}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Selected Dysfunctions */}
        {currentDysfunction.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {currentDysfunction.map((dysfunction) => (
              <span
                key={dysfunction}
                className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30"
              >
                {dysfunction}
                <button
                  type="button"
                  onClick={() => removeDysfunction(dysfunction)}
                  className="ml-2 text-red-400 hover:text-red-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.currentDysfunction && (
          <p className="mt-2 text-sm text-red-400">{errors.currentDysfunction.message}</p>
        )}
      </div>

      {/* Dysfunction Description */}
      <div>
        <label htmlFor="dysfunctionDescription" className="block text-sm font-medium text-slate-300 mb-2">
          Dysfunction Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="dysfunctionDescription"
          rows={4}
          {...register('dysfunctionDescription')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe the team dysfunctions in detail, including examples and impact on performance..."
        />
        {errors.dysfunctionDescription && (
          <p className="mt-2 text-sm text-red-400">{errors.dysfunctionDescription.message}</p>
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
