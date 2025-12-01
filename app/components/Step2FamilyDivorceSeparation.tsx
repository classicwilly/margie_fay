'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { familyDivorceSeparationSchema, FamilyDivorceSeparationData } from '../schemas/validation';
import { useFormContext } from '../context/FormContext';

export default function Step2FamilyDivorceSeparation() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const [childrenAges, setChildrenAges] = React.useState<number[]>(
    formData.familyDivorceSeparation?.childrenAges || [0]
  );
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FamilyDivorceSeparationData>({
    resolver: zodResolver(familyDivorceSeparationSchema),
    defaultValues: {
      custodyStatus: formData.familyDivorceSeparation?.custodyStatus,
      custodyDetails: formData.familyDivorceSeparation?.custodyDetails || '',
      coParentRelationship: formData.familyDivorceSeparation?.coParentRelationship,
      relationshipNotes: formData.familyDivorceSeparation?.relationshipNotes || '',
      childrenAges: formData.familyDivorceSeparation?.childrenAges || [0],
      legalInvolvement: formData.familyDivorceSeparation?.legalInvolvement,
      legalDetails: formData.familyDivorceSeparation?.legalDetails || '',
    },
  });

  const updateChildAge = (index: number, value: number) => {
    const newAges = [...childrenAges];
    newAges[index] = value;
    setChildrenAges(newAges);
    setValue('childrenAges', newAges);
  };

  const addChild = () => {
    const newAges = [...childrenAges, 0];
    setChildrenAges(newAges);
    setValue('childrenAges', newAges);
  };

  const removeChild = (index: number) => {
    if (childrenAges.length <= 1) return;
    const newAges = childrenAges.filter((_, i) => i !== index);
    setChildrenAges(newAges);
    setValue('childrenAges', newAges);
  };

  const onSubmit = (data: FamilyDivorceSeparationData) => {
    updateFormData({ familyDivorceSeparation: { ...data, childrenAges } });
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Family Context Configuration</h2>
        <p className="text-slate-400">Provide details about your family context to customize the protocol deployment.</p>
      </div>

      {/* Custody Status */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Custody Status <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'joint', label: 'Joint Custody', desc: 'Shared legal and physical custody' },
            { value: 'primary', label: 'Primary Custody', desc: 'One parent has primary custody' },
            { value: 'shared', label: 'Shared Custody', desc: '50/50 time split' },
            { value: 'pending', label: 'Pending', desc: 'Custody arrangement pending' },
            { value: 'none', label: 'Not Applicable', desc: 'No children or custody not relevant' },
          ].map((option) => (
            <label key={option.value} className="flex items-start p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50">
              <input type="radio" value={option.value} {...register('custodyStatus')} className="mt-1 mr-3 accent-blue-500" />
              <div>
                <span className="block text-sm font-medium text-white">{option.label}</span>
                <span className="block text-xs text-slate-400">{option.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.custodyStatus && <p className="mt-2 text-sm text-red-400">{errors.custodyStatus.message}</p>}
      </div>

      {/* Custody Details */}
      <div>
        <label htmlFor="custodyDetails" className="block text-sm font-medium text-slate-300 mb-2">
          Custody Details <span className="text-red-400">*</span>
        </label>
        <textarea
          id="custodyDetails"
          rows={3}
          {...register('custodyDetails')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe the custody arrangement, schedules, and any special considerations..."
        />
        {errors.custodyDetails && <p className="mt-2 text-sm text-red-400">{errors.custodyDetails.message}</p>}
      </div>

      {/* Co-Parent Relationship */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Co-Parent Relationship <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'cooperative', label: 'Cooperative', desc: 'Working well together for children' },
            { value: 'parallel', label: 'Parallel', desc: 'Minimal interaction, separate parenting' },
            { value: 'conflicted', label: 'Conflicted', desc: 'Ongoing disagreements and tension' },
            { value: 'no-contact', label: 'No Contact', desc: 'Communication through third parties only' },
          ].map((option) => (
            <label key={option.value} className="flex items-start p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50">
              <input type="radio" value={option.value} {...register('coParentRelationship')} className="mt-1 mr-3 accent-blue-500" />
              <div>
                <span className="block text-sm font-medium text-white">{option.label}</span>
                <span className="block text-xs text-slate-400">{option.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.coParentRelationship && <p className="mt-2 text-sm text-red-400">{errors.coParentRelationship.message}</p>}
      </div>

      {/* Relationship Notes */}
      <div>
        <label htmlFor="relationshipNotes" className="block text-sm font-medium text-slate-300 mb-2">
          Relationship Notes <span className="text-red-400">*</span>
        </label>
        <textarea
          id="relationshipNotes"
          rows={3}
          {...register('relationshipNotes')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe the co-parent relationship dynamics, communication patterns, challenges..."
        />
        {errors.relationshipNotes && <p className="mt-2 text-sm text-red-400">{errors.relationshipNotes.message}</p>}
      </div>

      {/* Children Ages */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Children&apos;s Ages <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          {childrenAges.map((age, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => updateChildAge(index, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-white placeholder-slate-500"
                  placeholder="Child age"
                  min="0"
                  max="25"
                />
              </div>
              {childrenAges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addChild} className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium">
          + Add Another Child
        </button>
        {errors.childrenAges && <p className="mt-2 text-sm text-red-400">{errors.childrenAges.message}</p>}
      </div>

      {/* Legal Involvement */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Legal Involvement <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'none', label: 'None', desc: 'No legal involvement' },
            { value: 'mediation', label: 'Mediation', desc: 'Using mediation services' },
            { value: 'lawyers', label: 'Lawyers Involved', desc: 'Both parties have legal representation' },
            { value: 'court-ordered', label: 'Court-Ordered', desc: 'Court-mandated arrangements' },
            { value: 'active-litigation', label: 'Active Litigation', desc: 'Ongoing court proceedings' },
          ].map((option) => (
            <label key={option.value} className="flex items-start p-3 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition-colors bg-slate-800/50">
              <input type="radio" value={option.value} {...register('legalInvolvement')} className="mt-1 mr-3 accent-blue-500" />
              <div>
                <span className="block text-sm font-medium text-white">{option.label}</span>
                <span className="block text-xs text-slate-400">{option.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.legalInvolvement && <p className="mt-2 text-sm text-red-400">{errors.legalInvolvement.message}</p>}
      </div>

      {/* Legal Details */}
      <div>
        <label htmlFor="legalDetails" className="block text-sm font-medium text-slate-300 mb-2">
          Legal Details <span className="text-red-400">*</span>
        </label>
        <textarea
          id="legalDetails"
          rows={3}
          {...register('legalDetails')}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-white placeholder-slate-500"
          placeholder="Describe legal arrangements, pending issues, court orders, or other relevant details..."
        />
        {errors.legalDetails && <p className="mt-2 text-sm text-red-400">{errors.legalDetails.message}</p>}
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