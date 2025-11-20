



import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import Button from '../../Button';
import { Type } from '@google/genai';
import useSafeAI from '../../../hooks/useSafeAI';
import { useAIPromptSafety } from '../../../hooks/useAIPromptSafety.js';
import AIConsentModal from '../../AIConsentModal.js';
import PIIWarningModal from '../../PIIWarningModal.js';

const KnowledgeCaptureVaultModule = () => {
    const { appState, dispatch } = useAppState();
    const { knowledgeVaultEntries } = appState;

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormVisible, setFormVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    // New state for related notes
    const [relatedNotes, setRelatedNotes] = useState({});
    const [loadingRelated, setLoadingRelated] = useState({});
    const [relatedError, setRelatedError] = useState({});
    const { checkAndExecute, isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel, isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain } = useAIPromptSafety();


    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    
    const activeEntries = useMemo(() => knowledgeVaultEntries.filter(e => !e.isArchived), [knowledgeVaultEntries]);

    const openAddForm = () => {
        setEditingEntry(null);
        setTitle('');
        setContent('');
        setTags('');
        setFormVisible(true);
    };

    const openEditForm = (entry) => {
        setEditingEntry(entry);
        setTitle(entry.title);
        setContent(entry.content);
        setTags(entry.tags.join(', '));
        setFormVisible(true);
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        
        const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

        if (editingEntry) {
            dispatch({
                type: 'UPDATE_KNOWLEDGE_ENTRY',
                payload: { ...editingEntry, title: title.trim(), content: content.trim(), tags: tagsArray }
            });
        } else {
            dispatch({
                type: 'ADD_KNOWLEDGE_ENTRY',
                payload: { title: title.trim(), content: content.trim(), tags: tagsArray }
            });
        }
        
        setFormVisible(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to permanently delete this knowledge entry?")) {
            dispatch({ type: 'REMOVE_KNOWLEDGE_ENTRY', payload: id });
        }
    };
    
    const handleArchive = (id) => {
        dispatch({ type: 'ARCHIVE_KNOWLEDGE_ENTRY', payload: id });
    };

    const findRelatedNotes = async (entry) => {
        setLoadingRelated(prev => ({ ...prev, [entry.id]: true }));
        setRelatedError(prev => ({ ...prev, [entry.id]: '' }));

        const otherEntries = activeEntries.filter(e => e.id !== entry.id);
        if (otherEntries.length === 0) {
            setLoadingRelated(prev => ({ ...prev, [entry.id]: false }));
            setRelatedNotes(prev => ({ ...prev, [entry.id]: [] }));
            return;
        }

        const prompt = `
            Analyze the content of the Primary Note. From the list of Other Note Titles, identify the top 3 most thematically related notes.

            Primary Note Content:
            """
            ${entry.title}
            ${entry.content}
            """

            Other Note Titles (with their IDs):
            ${otherEntries.map(e => `- ID: "${e.id}", Title: "${e.title}"`).join('\n')}
        `;

        try {
            const { generate } = useSafeAI();
            const response = await generate(prompt, {
                model: 'gemini-2.5-flash',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relatedIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                },
                timeoutMs: 20000,
                skipPromptSafety: true
            });
            const { relatedIds } = response.json || (response.text ? JSON.parse(response.text) : {});
            const foundNotes = otherEntries.filter(e => relatedIds.includes(e.id));
            setRelatedNotes(prev => ({ ...prev, [entry.id]: foundNotes }));
        } catch (e) {
            setRelatedError(prev => ({ ...prev, [entry.id]: `AI analysis failed: ${e.message}` }));
            console.error(e);
        } finally {
            setLoadingRelated(prev => ({ ...prev, [entry.id]: false }));
        }
    };
    
    const handleToggleEntry = (entry, isOpen) => {
        if (isOpen && !relatedNotes[entry.id] && !loadingRelated[entry.id]) {
            checkAndExecute(entry.content, () => findRelatedNotes(entry));
        }
    };
    
    const jumpToNote = (noteId) => {
        const element = document.getElementById(`entry-details-${noteId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.setAttribute('open', '');
        }
    };

    const filteredEntries = useMemo(() => {
        if (!searchTerm.trim()) return activeEntries;
        const lowerSearch = searchTerm.toLowerCase();
        return activeEntries.filter(entry => 
            entry.title.toLowerCase().includes(lowerSearch) ||
            entry.content.toLowerCase().includes(lowerSearch) ||
            entry.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
        );
    }, [searchTerm, activeEntries]);

    if (isFormVisible) {
        return (
            <ContentCard title={editingEntry ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required />
                    <textarea placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required />
                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={() => setFormVisible(false)} variant="secondary" size="sm">Cancel</Button>
                        <Button type="submit" variant="primary" size="sm">{editingEntry ? 'Save Changes' : 'Save Entry'}</Button>
                    </div>
                </form>
            </ContentCard>
        );
    }

    return (
        <ContentCard title="🧠 Knowledge Synthesis Engine">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <div className="flex flex-col h-full">
                <p className="text-sm text-text-light text-opacity-80 mb-3">
                    A searchable second brain that finds connections between your ideas.
                </p>
                <div className="flex gap-2 mb-3">
                    <input
                        type="search"
                        placeholder="Search vault..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-gray-800 border-2 border-gray-700 rounded"
                    />
                    <Button onClick={openAddForm} variant="primary" size="sm">+ New</Button>
                </div>
                
                <div className="flex-grow space-y-2 overflow-y-auto max-h-96 pr-2">
                    {filteredEntries.length > 0 ? (
                        filteredEntries.map(entry => (
                            <details key={entry.id} id={`entry-details-${entry.id}`} 
                                // FIX: Cast the event target to `HTMLDetailsElement` to safely access the `open` property and resolve the TypeScript error.
                                onToggle={(e) => handleToggleEntry(entry, (e.target as HTMLDetailsElement).open)} 
                                className="p-3 bg-gray-800 rounded-md border border-gray-700 group">
                                <summary className="cursor-pointer font-bold text-accent-teal">
                                    {entry.title}
                                </summary>
                                <div className="pt-2 mt-2 border-t border-gray-600">
                                    <p className="whitespace-pre-wrap text-sm mb-2">{entry.content}</p>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {entry.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    
                                    {/* Related Notes Section */}
                                    <div className="pt-2 border-t border-gray-600/50">
                                        <h5 className="text-xs font-bold text-accent-blue mb-2">Related Notes:</h5>
                                        {loadingRelated[entry.id] && <p className="text-xs text-gray-400 animate-pulse">Finding connections...</p>}
                                        {relatedError[entry.id] && <p className="text-xs text-red-400">{relatedError[entry.id]}</p>}
                                        {relatedNotes[entry.id] && (
                                            relatedNotes[entry.id].length > 0 ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    {relatedNotes[entry.id].map(related => (
                                                        <button key={related.id} onClick={() => jumpToNote(related.id)} className="text-xs text-accent-green hover:underline text-left">
                                                            - {related.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500">No strong connections found.</p>
                                            )
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button onClick={() => handleArchive(entry.id)} variant="secondary" size="sm" className="text-xs text-yellow-400">Archive</Button>
                                        <Button onClick={() => openEditForm(entry)} variant="secondary" size="sm" className="text-xs text-accent-blue">Edit</Button>
                                        <Button onClick={() => handleDelete(entry.id)} variant="danger" size="sm" className="text-xs">Delete</Button>
                                    </div>
                                </div>
                            </details>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 p-4">No entries yet. Add one to get started.</p>
                    )}
                </div>
            </div>
        </ContentCard>
    );
};

export default KnowledgeCaptureVaultModule;