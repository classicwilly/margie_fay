import React, { useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { ALL_CHECKLIST_DATA } from '../../../../checklist-data.js';
import ChecklistItem from '../../../ChecklistItem.js';

const DailyEssentials = () => {
    const { appState } = useAppState();
    const { checkedItems } = appState;
    
    const essentialsData = useMemo(() => ALL_CHECKLIST_DATA.find(section => section.id === 'essentials-tracker'), []);

    return (
        <details className="p-3 bg-gray-800 rounded-md border border-gray-700">
            <summary className="cursor-pointer font-bold text-accent-teal">⚙️ Daily Essentials</summary>
             <div className="mt-2 pt-2 border-t border-gray-700 space-y-2">
                {essentialsData?.subSections?.map(subSection => {
                    const allItemsInSectionDone = subSection.items?.every(item => checkedItems[item.id]);
                    return (
                        <div key={subSection.id}>
                            <h4 className="text-md font-semibold text-accent-blue mb-1">
                                {allItemsInSectionDone && '✅ '}
                                {subSection.title}
                            </h4>
                            <ul className="list-none grid grid-cols-2 sm:grid-cols-4 gap-x-2">
                                {subSection.items?.map(item => (
                                    <ChecklistItem key={item.id} id={item.id}>
                                        {item.label}
                                    </ChecklistItem>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </details>
    );
};

export default DailyEssentials;