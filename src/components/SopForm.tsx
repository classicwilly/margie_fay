import React, { useState, useEffect, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { generateId } from '@utils/generateId';
import { SOP_DATA } from '../constants.js';
import { Button } from '@components/Button';

const SopForm = () => {
  const { appState, dispatch } = useAppState();
  const generatedSopDraft = appState?.generatedSopDraft ?? null;
  const editingSopId = appState?.editingSopId ?? null;
  const userSops = appState?.userSops ?? [];
  const modifiedSops = appState?.modifiedSops ?? {};
  const activeSopTemplate = appState?.activeSopTemplate ?? null;
  const newSopType = appState?.newSopType ?? null;
  
  const isEditMode = editingSopId !== null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);
  const [cues, setCues] = useState(['']);
  const [taskTemplate, setTaskTemplate] = useState<{title: string, priority: string}[]>([]);
  const [isPageView, setIsPageView] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSops = useMemo(() => 
    SOP_DATA.map(sop => modifiedSops[sop.id] || sop).concat(userSops),
    [modifiedSops, userSops]
  );

  const isEditingCoreSop = useMemo(() => 
    isEditMode && SOP_DATA.some(s => s.id === editingSopId),
    [isEditMode, editingSopId]
  );
  
  const isCoreSopModified = useMemo(() =>
    isEditingCoreSop && !!modifiedSops[editingSopId],
    [isEditingCoreSop, modifiedSops, editingSopId]
  );

  useEffect(() => {
    let sopToLoad: any = null;

    if (isEditMode) {
      sopToLoad = allSops.find(s => s.id === editingSopId) || null;
    } else if (generatedSopDraft) {
      sopToLoad = { ...generatedSopDraft, id: '', category: '' }; // Adapt draft to SOP-like structure
      dispatch({ type: 'SET_GENERATED_SOP_DRAFT', payload: null });
    } else if (activeSopTemplate) {
      sopToLoad = activeSopTemplate;
      dispatch({ type: 'SET_ACTIVE_SOP_TEMPLATE', payload: null });
    }

    if (sopToLoad) {
        setTitle(sopToLoad.title);
        setDescription(sopToLoad.description);
        setSteps((sopToLoad.steps || ['']).map((s: string) => s.replace(/^\d+\.\s/, '')));
        setCues(sopToLoad.cues || ['']);
        setTaskTemplate(sopToLoad.taskTemplate || []);
        setIsPageView(sopToLoad.isPageView || false);
        setIsTemplate(false);
    } else if (!isEditMode && newSopType === 'template') {
        setIsTemplate(true);
    } else {
        setIsTemplate(false);
    }
    
  }, [editingSopId, allSops, generatedSopDraft, activeSopTemplate, dispatch, isEditMode, newSopType]);


  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length === 0 ? [''] : newSteps);
  };

  const handleCueChange = (index: number, value: string) => {
    const newCues = [...cues];
    newCues[index] = value;
    setCues(newCues);
  };

  const handleAddCue = () => setCues([...cues, '']);
  const handleRemoveCue = (index: number) => {
    const newCues = cues.filter((_, i) => i !== index);
    setCues(newCues.length === 0 ? [''] : newCues);
  };

  const handleTaskTemplateChange = (index: number, field: string, value: string) => {
    const newTemplate = [...taskTemplate];
    newTemplate[index] = { ...newTemplate[index], [field]: value };
    setTaskTemplate(newTemplate);
  };
  
  const handleAddTaskToTemplate = () => setTaskTemplate([...taskTemplate, { title: '', priority: 'Medium' }]);
  const handleRemoveTaskFromTemplate = (index: number) => setTaskTemplate(taskTemplate.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const filteredSteps = steps.filter(step => step.trim() !== '');
    const filteredCues = cues.filter(cue => cue.trim() !== '');
    const filteredTaskTemplate = taskTemplate.filter(task => task.title.trim() !== '');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required. Execute fully.');
      return;
    }

    const formattedStepsForSop = filteredSteps.map((stepContent, index) => `${index + 1}. ${stepContent}`);

    const newSopData = {
        title: title.trim(),
        description: description.trim(),
        steps: formattedStepsForSop.length > 0 ? formattedStepsForSop : undefined,
        cues: filteredCues.length > 0 ? filteredCues : undefined,
        taskTemplate: filteredTaskTemplate.length > 0 ? filteredTaskTemplate : undefined,
        isPageView: isTemplate ? false : isPageView,
    };

    if (isEditMode) {
      const originalSop = allSops.find(s => s.id === editingSopId);
      const updatedSop = { ...originalSop, ...newSopData, id: editingSopId };

      if (originalSop.category.includes('USER')) {
          dispatch({ type: 'UPDATE_USER_SOP', payload: updatedSop });
      } else {
          dispatch({ type: 'UPDATE_SOP', payload: updatedSop });
      }
      dispatch({ type: 'SET_EDITING_SOP_ID', payload: null });
    } else {
       if (isTemplate) {
        const newTemplate = { ...newSopData, id: generateId(), category: 'USER_TEMPLATE' };
        dispatch({ type: 'ADD_SOP_TEMPLATE', payload: newTemplate });
      } else {
        const newSop = { ...newSopData, id: generateId(), category: 'M4_SOP_USER' };
        dispatch({ type: 'ADD_SOP', payload: newSop });
      }
    }

    handleCancel();
  };

  const handleClearForm = () => {
    setTitle(''); setDescription(''); setSteps(['']); setCues(['']);
    setTaskTemplate([]); setIsPageView(false); setIsTemplate(false); setError(null);
  };

  const handleCancel = () => {
    handleClearForm();
    dispatch({ type: 'SET_EDITING_SOP_ID', payload: null });
    dispatch({ type: 'SET_NEW_SOP_TYPE', payload: null });
    dispatch({ type: 'SET_VIEW', payload: 'sop-vault' });
  };
  
  const handleResetToDefault = () => {
      if (editingSopId) dispatch({ type: 'RESET_SOP', payload: editingSopId });
  };

  return (
    <section className="mb-10 p-6 bg-sanctuary-card rounded-lg shadow-md border border-gray-700">
       <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">{isEditMode ? 'Edit Protocol' : 'Create New Protocol'}</h1>
        <p className="text-lg text-text-light text-opacity-80">{isEditMode ? 'Refine the structure that absorbs chaos.' : 'Define a new Standard Operating Procedure. Be precise. Be clear.'}</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div role="alert" aria-live="assertive" className="bg-red-800 bg-opacity-30 border border-red-700 text-red-400 p-4 rounded-md"><p className="font-semibold mb-2">Error: Non-Compliance Detected</p><p>{error}</p></div>}

        <fieldset className="space-y-4">
            <div>
                <label htmlFor="sop-title" className="block text-sm font-medium mb-1">Protocol Title: <span className="text-red-500">*</span></label>
                <input type="text" id="sop-title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" placeholder="e.g., Solo Execution Mode Refinement" required />
            </div>
            <div>
                <label htmlFor="sop-description" className="block text-sm font-medium mb-1">Description: <span className="text-red-500">*</span></label>
                <textarea id="sop-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" placeholder="e.g., Adjustments to deep work blocks for optimized focus." required />
            </div>
        </fieldset>

        <div>
            <label className="block text-lg font-semibold mb-2 text-accent-teal">Execution Steps</label>
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-md border border-gray-700">
                {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <span className="text-text-light font-bold w-8">{index + 1}.</span>
                    <input type="text" value={step} onChange={(e) => handleStepChange(index, e.target.value)} className="flex-grow p-2 bg-gray-800 border border-gray-600 rounded" placeholder="Action to be executed..." />
                     {steps.length > 1 && <Button type="button" onClick={() => handleRemoveStep(index)} className="p-2 rounded" variant="danger" aria-label={`Remove step ${index + 1}`}>&times;</Button>}
                </div>
                ))}
                 <Button type="button" onClick={handleAddStep} className="mt-2 px-3 py-1 text-sm" variant="secondary">+ Add Step</Button>
            </div>
        </div>

        <details className="p-4 border border-gray-700 rounded-lg group">
            <summary className="cursor-pointer font-semibold text-accent-teal text-lg">Task Template (for SOP Task Generator)</summary>
            <div className="space-y-3 pt-4 mt-2 border-t border-gray-700">
                {taskTemplate.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                        <input type="text" value={task.title} onChange={(e) => handleTaskTemplateChange(index, 'title', e.target.value)} className="flex-grow p-2 bg-gray-900 border border-gray-600 rounded" placeholder="Task title..." />
                        <select value={task.priority} onChange={(e) => handleTaskTemplateChange(index, 'priority', e.target.value)} className="p-2 bg-gray-900 border border-gray-600 rounded">
                            <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                        </select>
                        <Button type="button" onClick={() => handleRemoveTaskFromTemplate(index)} className="p-2" variant="danger" aria-label={`Remove task from template`}>&times;</Button>
                    </div>
                ))}
                 <Button type="button" onClick={handleAddTaskToTemplate} className="mt-2 px-3 py-1 text-sm" variant="secondary">+ Add Task to Template</Button>
            </div>
        </details>
        
        <details className="p-4 border border-gray-700 rounded-lg group">
            <summary className="cursor-pointer font-semibold text-accent-teal text-lg">Optional Details</summary>
            <div className="space-y-4 pt-4 mt-2 border-t border-gray-700">
                <div>
                    <label className="block text-sm font-medium mb-1">Actionable Cues:</label>
                    <div className="space-y-2">
                        {cues.map((cue, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input type="text" value={cue} onChange={(e) => handleCueChange(index, e.target.value)} className="flex-grow p-2 bg-gray-800 border border-gray-600 rounded" placeholder={`Cue ${index + 1}...`} />
                            {cues.length > 1 && <Button type="button" onClick={() => handleRemoveCue(index)} className="p-2" variant="danger" aria-label={`Remove cue ${index + 1}`}>&times;</Button>}
                        </div>
                        ))}
                    </div>
                    <Button type="button" onClick={handleAddCue} className="mt-3 px-3 py-1 text-sm" variant="secondary">+ Add Cue</Button>
                </div>
                
                {!isEditMode && <div className="flex items-center"><input type="checkbox" id="is-template" checked={isTemplate} onChange={(e) => setIsTemplate(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 text-accent-blue focus:ring-accent-blue" /><label htmlFor="is-template" className="ml-2 text-sm">Save as a reusable Template</label></div>}
                {!isEditingCoreSop && !isTemplate && <div className="flex items-center"><input type="checkbox" id="is-page-view" checked={isPageView} onChange={(e) => setIsPageView(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 text-accent-blue focus:ring-accent-blue" /><label htmlFor="is-page-view" className="ml-2 text-sm">Make this a navigable page</label></div>}
            </div>
        </details>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div>
                {isEditMode && isCoreSopModified && <Button type="button" onClick={handleResetToDefault} className="px-4 py-2 text-sm" variant="secondary">Reset to Default</Button>}
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" onClick={handleCancel} className="" variant="secondary">{isEditMode ? 'Cancel' : 'Clear Form'}</Button>
              <Button type="submit" className="" variant="primary">{isEditMode ? 'Save Changes' : 'Add Protocol'}</Button>
            </div>
        </div>
      </form>
    </section>
  );
};

export { SopForm };
export default SopForm;