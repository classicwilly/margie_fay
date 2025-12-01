import React from 'react';
import type { Sop } from '../types';
import { useAppState } from '@contexts/AppStateContext';
import { Button } from '@components/Button';

const SopCard = ({ sop, isTemplate = false }: { sop: Sop, isTemplate?: boolean }) => {
  const { appState, dispatch } = useAppState();
  const isUserSop = sop.category.includes('USER');

  const handleNavigate = () => {
    if (sop.viewId) {
      dispatch({ type: 'SET_VIEW', payload: sop.viewId });
    } else if (isUserSop && sop.isPageView) {
      dispatch({ type: 'SET_ACTIVE_USER_SOP_ID', payload: sop.id });
      dispatch({ type: 'SET_VIEW', payload: 'user-sop-view' });
    }
  };

  const handleUseTemplate = () => {
    dispatch({ type: 'SET_ACTIVE_SOP_TEMPLATE', payload: sop });
    dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
  };

  const handleEdit = () => {
    dispatch({ type: 'SET_EDITING_SOP_ID', payload: sop.id });
    dispatch({ type: 'SET_VIEW', payload: 'create-sop' });
  };

  const handleDelete = () => {
    const itemType = isTemplate ? 'template' : 'protocol';
    if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to permanently delete the ${itemType} "${sop.title}"? This cannot be undone.`)) {
      if (isTemplate) {
        dispatch({ type: 'DELETE_SOP_TEMPLATE', payload: sop.id });
      } else {
        dispatch({ type: 'DELETE_USER_SOP', payload: sop.id });
      }
    }
  };
  
  const canNavigate = sop.viewId || (isUserSop && sop.isPageView);

  const cardContent = (
    <>
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-accent-green group-hover:text-accent-teal mb-3 break-words">
          {sop.title}
        </h2>
        <p className="text-sanctuary-text-secondary leading-relaxed">
          {sop.description}
        </p>
      </div>
       {appState.isModMode && (
        <div className="mt-4 pt-4 border-t border-sanctuary-border flex justify-end gap-2">
          {!isTemplate && (
            <Button onClick={handleEdit} className="px-4 py-2 text-sm" variant="secondary" size="sm">Edit</Button>
          )}
          {isTemplate && <p className="text-xs text-gray-500 italic flex-grow text-left self-center">Templates cannot be edited.</p>}
          {(isUserSop || isTemplate) && (
            <Button onClick={handleDelete} className="px-4 py-2 text-sm" variant="danger" size="sm">Delete</Button>
          )}
        </div>
      )}
    </>
  );
  
  if (isTemplate) {
    return (
      <button
        onClick={handleUseTemplate}
        className="bg-sanctuary-card rounded-lg shadow-md p-6 border border-sanctuary-border hover:border-sanctuary-purple transform hover:-translate-y-1 flex flex-col text-left w-full group"
        aria-label={`Use template: ${sop.title}`}
      >
        {cardContent}
      </button>
    );
  }
  
  if (canNavigate) {
    return (
      <button
        onClick={handleNavigate}
        className="bg-sanctuary-card rounded-lg shadow-md p-6 border border-sanctuary-border hover:border-sanctuary-accent transform hover:-translate-y-1 flex flex-col text-left w-full group"
        aria-label={`View details for ${sop.title}`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="bg-sanctuary-card rounded-lg shadow-md p-6 border border-sanctuary-border flex flex-col h-full">
      {cardContent}
    </div>
  );
};

export { SopCard };
export default SopCard;