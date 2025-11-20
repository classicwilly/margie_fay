


import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../ContentCard.js';

const personaDetails = {
    'william': { name: 'Dad', emoji: '🛠️' },
    'willow': { name: 'Willow', emoji: '🌸' },
    'sebastian': { name: 'Bash', emoji: '🦖' },
    'co-parenting': { name: 'Co-Parent', emoji: '👨‍👧‍👦' },
    'launcher': { name: 'System', emoji: '🌱' },
};

const FamilyChatModule = () => {
    const { appState, dispatch } = useAppState();
    const { chatMessages, dashboardType } = appState;
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        dispatch({
            type: 'ADD_CHAT_MESSAGE',
            payload: {
                persona: dashboardType,
                text: newMessage.trim(),
            }
        });

        setNewMessage('');
    };

    return (
        <ContentCard title="💬 Family Chat">
            <div className="flex flex-col h-full min-h-[400px]">
                <div className="flex-grow overflow-y-auto p-3 bg-gray-800 rounded-md border border-gray-700 mb-4 space-y-4">
                    {chatMessages.length > 0 ? (
                        chatMessages.map(msg => {
                            const isCurrentUser = msg.persona === dashboardType;
                            const details = personaDetails[msg.persona] || personaDetails.launcher;

                            return (
                                <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    {!isCurrentUser && (
                                        <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center bg-card-dark rounded-full">
                                            {details.emoji}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] p-3 rounded-xl ${isCurrentUser ? 'bg-accent-blue text-background-dark rounded-br-none' : 'bg-gray-700 text-text-light rounded-bl-none'}`}>
                                        <p className="text-sm break-words">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-200' : 'text-gray-400'} text-opacity-80`}>
                                            {details.name} - {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-light text-opacity-80">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        aria-label="Chat message input"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </ContentCard>
    );
};

export default FamilyChatModule;