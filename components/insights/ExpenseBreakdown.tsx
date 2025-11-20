


import React, { useMemo, useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../ContentCard.js';

const ExpenseBreakdown = () => {
    const { appState } = useAppState();
    const { expenses } = appState;
    const [selectedCategory, setSelectedCategory] = useState(null);

    const monthlySummary = useMemo(() => {
        const now = new Date();
        return expenses
            .filter(exp => new Date(exp.date).getMonth() === now.getMonth() && new Date(exp.date).getFullYear() === now.getFullYear())
            .reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
                // FIX: Typed the accumulator to ensure `acc` properties are treated as numbers.
            }, {} as Record<string, number>);
    }, [expenses]);
    
    const transactionsForSelectedCategory = useMemo(() => {
        if (!selectedCategory) return [];
        const now = new Date();
        return expenses
            .filter(exp => 
                exp.category === selectedCategory &&
                new Date(exp.date).getMonth() === now.getMonth() &&
                new Date(exp.date).getFullYear() === now.getFullYear()
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, selectedCategory]);

    const maxSpent = useMemo(() => Math.max(...(Object.values(monthlySummary) as number[]), 0), [monthlySummary]);

    const categories = ['Housing', 'Utilities', 'Groceries', 'Transport', 'Health', 'Kids', 'Personal', 'Other'];

    if (Object.keys(monthlySummary).length === 0) {
        return (
            <ContentCard title="This Month's Expense Breakdown">
                <p className="text-text-light text-opacity-80 text-center p-4">No expenses logged for the current month.</p>
            </ContentCard>
        );
    }
    
    return (
        <ContentCard title="This Month's Expense Breakdown">
             <p className="text-sm text-gray-400 mb-4">Click a category to see individual transactions.</p>
            <div className="space-y-3">
                {categories.map(category => {
                    const spent = monthlySummary[category] || 0;
                    const width = maxSpent > 0 ? (spent / maxSpent) * 100 : 0;
                    if (spent === 0) return null; // Don't show categories with no spending
                    return (
                        <button key={category} onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={`w-full text-left p-2 rounded-md transition-colors ${selectedCategory === category ? 'bg-accent-blue/20' : 'hover:bg-gray-700/50'}`}>
                            <div className="grid grid-cols-4 items-center gap-2 text-sm">
                                <span className="col-span-1 font-semibold truncate">{category}</span>
                                <div className="col-span-2 bg-gray-700 rounded-full h-4" role="progressbar" aria-label={`${category} spending: ${Math.round(width)}%`}>
                                    <div ref={(el) => { if (el) el.style.setProperty('--progress', `${width}%`); }} className="bg-accent-blue h-4 rounded-full progress-fill"></div>
                                    <span className="sr-only">{category} spending: {Math.round(width)}%</span>
                                </div>
                                <span className="col-span-1 font-mono text-right">${spent.toFixed(2)}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {selectedCategory && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-bold text-accent-teal mb-2">Transactions for {selectedCategory}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {transactionsForSelectedCategory.map(exp => (
                             <div key={exp.id} className="flex justify-between items-center text-sm p-2 bg-gray-800 rounded-md">
                                <div>
                                    <p className="font-semibold">{exp.description}</p>
                                    <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                                <span className="font-bold text-accent-blue">${Number(exp.amount).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ContentCard>
    );
};

export default ExpenseBreakdown;