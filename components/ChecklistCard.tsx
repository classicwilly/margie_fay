
import React from 'react';
import ChecklistItem from './ChecklistItem.js';

const ChecklistCard = ({ section }) => {
    return (
        <div className="bg-card-dark rounded-lg shadow-md p-4 border border-gray-700 flex flex-col h-full">
            <h3 className="font-bold text-accent-teal mb-2">{section.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{section.parentTitle}</p>
            {section.items && (
                <ul className="list-none space-y-1">
                    {section.items.map(item => (
                        <ChecklistItem
                            key={item.id}
                            id={item.id}
                            gemAwardId={item.gemAwardId}
                            gemRecipient={item.gemRecipient}
                            achievementAwardId={item.achievementAwardId}
                        >
                            {item.label}
                        </ChecklistItem>
                    ))}
                </ul>
            )}
        </div>
    );
};

export { ChecklistCard };
export default ChecklistCard;