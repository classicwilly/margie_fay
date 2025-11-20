

import React, { useState, useRef } from 'react';
import { Type } from '@google/genai';
import useSafeAI from '../../../hooks/useSafeAI';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import { useAIPromptSafety } from '../../../hooks/useAIPromptSafety.js';
import AIConsentModal from '../../AIConsentModal.js';
import Button from '../../Button';
import PIIWarningModal from '../../PIIWarningModal.js';

const CalendarModal = ({ item, onClose, onSubmit }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(date, time);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-accent-teal mb-4">Schedule Appointment</h3>
                <p className="text-sm mb-1">Event: <span className="font-semibold">{item.actionableItem}</span></p>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="flex gap-2">
                                                <div className="w-full">
                                                    <label htmlFor="calendar-date" className="sr-only">Date</label>
                                                    <input id="calendar-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required/>
                                                </div>
                                                <div>
                                                    <label htmlFor="calendar-time" className="sr-only">Time</label>
                                                    <input id="calendar-time" type="time" value={time} onChange={e => setTime(e.target.value)} className="p-2 bg-gray-800 border border-gray-600 rounded" required/>
                                                </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                            <Button type="button" onClick={onClose} variant="secondary" size="sm">Cancel</Button>
                                <Button type="submit" variant="primary" size="sm">Save Event</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const BrainDumpModule = () => {
    const { appState, dispatch } = useAppState();
    const { brainDumpText } = appState;

    const [processedItems, setProcessedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
                        try {
                            const { generate } = useSafeAI();
                            const response = await generate(prompt, {
                                model: 'gemini-2.5-flash',
                                responseMimeType: 'application/json',
                                responseSchema: {
                                    type: Type.OBJECT,
                                    properties: {
                                        processedItems: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    category: { type: Type.STRING },
                                                    summary: { type: Type.STRING },
                                                    actionableItem: { type: Type.STRING },
                                                }
                                            }
                                        }
                                    }
                                },
                                timeoutMs: 20000
                            });

                            const jsonResponse = response.json;
    };
    
    const handleClearAndArchive = () => {
        if (!processedText) return;

        const date = new Date().toLocaleString();
        dispatch({
            type: 'ADD_KNOWLEDGE_ENTRY',
            payload: {
                title: `Brain Dump Archive - ${date}`,
                content: processedText,
                tags: ['archive', 'braindump']
            }
        });
        
        handleClearAll();
    };

    const handleProcess = async (safePrompt?: string) => {
        if (!brainDumpText.trim()) {
            setError("Brain Dump is empty. There is no chaos to process.");
            return;
        }
        setLoading(true);
        setError('');
        setProcessedItems([]);
        setActionedItems([]);
        setProcessedText(brainDumpText); // Archive the text on process

        const prompt = `
            Analyze the following unstructured brain dump from a neurodivergent user. For each distinct thought, categorize it, create a concise summary, and extract a single concrete actionable item.

            Brain Dump Text:
        try {
            const { generate } = useSafeAI();
            const response = await generate(safePrompt ?? prompt, {
                model: 'gemini-2.5-flash',
                // contents will be set by useSafeAI via the safePrompt arg
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            processedItems: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        category: { type: Type.STRING },
                                        summary: { type: Type.STRING },
                                        actionableItem: { type: Type.STRING },
                                    }
                                }
                            }
                        }
                    },
                }
                , timeoutMs: 20000, skipPromptSafety: true
            });
            
            const jsonResponse = response?.json ?? (response?.text ? JSON.parse(response.text) : null);
            if (jsonResponse.processedItems && Array.isArray(jsonResponse.processedItems)) {
                setProcessedItems(jsonResponse.processedItems);
            } else {
                throw new Error("Invalid response format from AI.");
            }

        } catch (e) {
            setError(`Error processing dump: ${e.message || 'Failed to communicate with model.'}`);
            console.error(e);
        }
        setLoading(false);
    };
    
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            recorder.onstop = async () => {
                setTranscribing(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    // FIX: Added type check for reader.result to ensure it's a string before splitting.
                    if (typeof reader.result === 'string') {
                        const base64Audio = reader.result.split(',')[1];
                        try {
                            const { generate } = useSafeAI();
                            const result = await generate('Transcribe this audio recording.', {
                                model: 'gemini-2.5-flash',
                                inputs: [{ text: 'Transcribe this audio recording.' }, { inlineData: { mimeType: 'audio/webm', data: base64Audio } }],
                                timeoutMs: 24000,
                                skipPromptSafety: true
                            });
                            
                            const newText = result.text;
                            const timestamp = new Date().toLocaleString();
                            const updatedBrainDump = `${brainDumpText}\n\n--- Voice Memo [${timestamp}] ---\n${newText}`.trim();
                            dispatch({ type: 'SET_BRAIN_DUMP', payload: updatedBrainDump });

                        } catch (e) {
                            setError(`Transcription failed: ${e.message}`);
                        } finally {
                            setTranscribing(false);
                        }
                    }
                };
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Microphone access was denied or an error occurred.');
            console.error('Error starting recording:', err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleTriageAll = () => {
        const itemsToTriage = processedItems.filter((_, index) => !actionedItems.includes(index));
        
        itemsToTriage.forEach(item => {
            switch(item.category) {
                case 'Task':
                    dispatch({
                        type: 'ADD_TASK',
                        payload: { title: item.actionableItem, priority: 'Medium', dueDate: null }
                    });
                    break;
                case 'Appointment':
                    dispatch({
                        type: 'ADD_CALENDAR_EVENT',
                        payload: {
                            title: `[NEEDS CONFIRMATION] ${item.actionableItem}`,
                            date: new Date().toISOString(),
                            type: 'appointment'
                        }
                    });
                    break;
                case 'Idea':
                case 'Emotion':
                case 'Reference':
                    dispatch({
                        type: 'ADD_KNOWLEDGE_ENTRY',
                        payload: {
                            title: item.summary,
                            content: item.actionableItem,
                            tags: [item.category.toLowerCase(), 'from-braindump']
                        }
                    });
                    break;
            }
        });
        setActionedItems(processedItems.map((_, index) => index));
    };

    const handleAddTask = (item, index) => {
        dispatch({
            type: 'ADD_TASK',
            payload: {
                title: item.actionableItem,
                priority: 'Medium',
                dueDate: null,
            }
        });
        setActionedItems(prev => [...prev, index]);
    };

    const handleSendToVault = (item, index) => {
        dispatch({
            type: 'ADD_KNOWLEDGE_ENTRY',
            payload: {
                title: item.summary,
                content: item.actionableItem,
                tags: [item.category.toLowerCase(), 'from-braindump']
            }
        });
        setActionedItems(prev => [...prev, index]);
    };
    
    const handleScheduleClick = (item, index) => {
        setSchedulingItem(item);
        setSchedulingItemIndex(index);
    };

    const handleCalendarModalSubmit = (date, time) => {
        if (!schedulingItem || schedulingItemIndex === null) return;
        const dateWithTime = new Date(`${date}T${time}:00`);
        dispatch({
            type: 'ADD_CALENDAR_EVENT',
            payload: {
                title: schedulingItem.actionableItem,
                date: dateWithTime.toISOString(),
                type: 'appointment'
            }
        });
        setActionedItems(prev => [...prev, schedulingItemIndex]);
        setSchedulingItem(null);
        setSchedulingItemIndex(null);
    };

    const categoryStyles = {
        Task: { bg: 'bg-accent-blue/20', text: 'text-accent-blue' },
        Idea: { bg: 'bg-accent-green/20', text: 'text-accent-green' },
        Appointment: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
        Emotion: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
        Reference: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    };

    const renderActionButton = (item, index) => {
        const isActioned = actionedItems.includes(index);
        const baseButtonClass = "ml-2 px-2 py-1 text-xs font-semibold rounded transition-colors flex-shrink-0";
        
        if (isActioned) {
            return <button disabled className={`${baseButtonClass} bg-gray-700 text-gray-400 cursor-not-allowed`}>✓ Done</button>;
        }

        switch(item.category) {
            case 'Task':
                return <button onClick={() => handleAddTask(item, index)} className={`${baseButtonClass} bg-accent-green text-background-dark hover:bg-green-500`}>Add to Task Matrix</button>;
            case 'Appointment':
                return <button onClick={() => handleScheduleClick(item, index)} className={`${baseButtonClass} bg-yellow-500 text-background-dark hover:bg-yellow-400`}>Add to Calendar</button>;
            case 'Idea':
            case 'Emotion':
            case 'Reference':
                return <button onClick={() => handleSendToVault(item, index)} className={`${baseButtonClass} bg-accent-purple text-white hover:bg-purple-500`}>Send to Vault</button>;
            default:
                return null;
        }
    };


    return (
        <ContentCard title="🧠 Brain Dump & Processor">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            {schedulingItem && <CalendarModal item={schedulingItem} onClose={() => {setSchedulingItem(null); setSchedulingItemIndex(null);}} onSubmit={handleCalendarModalSubmit} />}
            <div className="flex flex-col h-full">
                <p className="text-sm text-text-light text-opacity-80 mb-2">
                    Capture any thought, then process it with AI to extract and route actionable insights.
                </p>
                <textarea
                    value={brainDumpText}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue min-h-[150px]"
                    placeholder="Externalize chaos here..."
                />
                <div className="flex justify-between items-center gap-2 mt-2">
                    {!isRecording ? (
                        <Button
                            onClick={handleStartRecording}
                            disabled={transcribing}
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                            {transcribing ? 'Transcribing...' : 'Record Memo'}
                        </button>
                    ) : (
                        <Button
                            onClick={handleStopRecording}
                            variant="danger"
                            size="sm"
                            className="flex items-center gap-2 animate-pulse"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            Stop Recording
                        <Button
                    )}
                    <button
                            variant="primary"
                            size="sm"
                        disabled={loading || !brainDumpText.trim()}
                        className="px-4 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Processing...' : '✨ Process with AI'}
                    </button>
                </div>

                {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}

                {processedItems.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-700 flex-grow overflow-y-auto max-h-80 pr-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-accent-green">Processed Items</h4>
                            <Button onClick={handleTriageAll} variant="primary" size="sm" className="text-xs">Add All to System</Button>
                        </div>
                        <div className="space-y-2">
                            {processedItems.map((item, index) => {
                                const style = categoryStyles[item.category] || categoryStyles.Reference;
                                return (
                                    <div key={index} className={`p-2 rounded-md border text-sm ${style.bg} border-gray-700`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{item.category}</span>
                                                <p className="font-semibold mt-1">{item.summary}</p>
                                                <p className="text-xs text-gray-400">{item.actionableItem}</p>
                                            </div>
                                            {renderActionButton(item, index)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button onClick={handleClearAll} variant="secondary" size="sm" className="text-xs">Clear All</Button>
                             <Button onClick={handleClearAndArchive} variant="secondary" size="sm" className="text-xs text-yellow-400">Clear & Archive Dump</Button>
                        </div>
                    </div>
                )}
            </div>
        </ContentCard>
    );
};

export default BrainDumpModule;