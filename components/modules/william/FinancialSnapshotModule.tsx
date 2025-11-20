



import React, { useState, useMemo, useRef } from 'react';
import useProgressVar from '@hooks/useProgressVar';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';

const FinancialSnapshotModule = () => {
    const { appState, dispatch } = useAppState();
    const { expenses, financialBudgets } = appState;
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [budgetValue, setBudgetValue] = useState('');

    const monthlySummary = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
            })
            // FIX: Typed the accumulator to ensure `acc` properties are treated as numbers.
            .reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
            }, {} as Record<string, number>);
    }, [expenses]);
    
    // FIX: Cast Object.values to number[] to fix reduce type error.
    const totalSpent = (Object.values(monthlySummary) as number[]).reduce((sum, val) => sum + val, 0);
    const totalBudget = (Object.values(financialBudgets) as number[]).reduce((sum, val) => sum + val, 0);

    const categories = ['Housing', 'Utilities', 'Groceries', 'Transport', 'Health', 'Kids', 'Personal', 'Other'];

    const handleSetBudget = (category: string) => {
        const amount = parseFloat(budgetValue);
        if (!isNaN(amount) && amount >= 0) {
            dispatch({ type: 'SET_FINANCIAL_BUDGET', payload: { category, amount } });
        }
        setEditingCategory(null);
        setBudgetValue('');
    };

    const handleEditClick = (category: string) => {
        setEditingCategory(category);
        setBudgetValue(String(financialBudgets[category] || ''));
    };
    
    const getProgressBarColor = (percentage: number) => {
        if (percentage > 100) return 'bg-red-500';
        if (percentage > 75) return 'bg-yellow-500';
        return 'bg-accent-green';
    };

    return (
        <ContentCard title="📊 Financial Snapshot">
            <div className="flex flex-col h-full">
                <p className="text-sm text-text-light text-opacity-80 mb-4">
                    Set monthly budgets and track spending against them for a high-level overview.
                </p>

                <div className="mb-4 p-3 bg-gray-800 rounded-md border border-gray-700">
                    <h4 className="font-bold text-accent-teal">This Month's Overview</h4>
                    <p className="text-2xl font-bold">${totalSpent.toFixed(2)} <span className="text-lg font-normal text-gray-400">spent of</span> ${totalBudget.toFixed(2)}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2" role="progressbar" aria-label={`Spending vs budget: ${Math.round((totalBudget > 0 ? totalSpent/totalBudget : 0)*100)}%`}> 
                        <div ref={(el) => el && el.style.setProperty('--progress', `${Math.min(100, (totalBudget > 0 ? totalSpent/totalBudget : 0)*100)}%`)} className={`${getProgressBarColor((totalBudget > 0 ? totalSpent/totalBudget : 0)*100)} h-2.5 rounded-full progress-fill`}></div>
                        <span className="sr-only">Spending vs budget: {Math.round((totalBudget > 0 ? totalSpent/totalBudget : 0)*100)}%</span>
                    </div>
                </div>

                <div className="flex-grow space-y-2 overflow-y-auto max-h-80 pr-2">
                    {categories.map(category => {
                        const spent = Number(monthlySummary[category] || 0);
                        const budget = Number(financialBudgets[category] || 0);
                        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                        
                        return (
                            <div key={category} className="p-3 bg-gray-800 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold">{category}</span>
                                    {editingCategory === category ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSetBudget(category); }} className="flex items-center gap-1">
                                            <input type="number" value={budgetValue} onChange={e => setBudgetValue(e.target.value)} className="w-20 p-1 text-sm bg-gray-900 border border-gray-600 rounded" placeholder="0" autoFocus onBlur={() => setEditingCategory(null)} />
                                            <button type="submit" className="text-xs px-2 py-1 bg-accent-green text-background-dark rounded">Set</button>
                                        </form>
                                    ) : (
                                        <button onClick={() => handleEditClick(category)} className="text-sm text-gray-400 hover:text-white">
                                            ${spent.toFixed(2)} / <span className="font-bold">${budget.toFixed(2)}</span>
                                        </button>
                                    )}
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5" role="progressbar" aria-label={`${category} spending: ${Math.round(percentage)}%`}>
                                    <div ref={(el) => el && el.style.setProperty('--progress', `${Math.min(100, percentage)}%`)} className={`${getProgressBarColor(percentage)} h-1.5 rounded-full progress-fill`}></div>
                                    <span className="sr-only">{category} spending: {Math.round(percentage)}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </ContentCard>
    );
};

export default FinancialSnapshotModule;
