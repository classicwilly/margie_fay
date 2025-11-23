



import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';

const ExpenseTrackerModule = () => {
    const { appState, dispatch } = useAppState();
    const { expenses } = appState;

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Other');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!description.trim() || isNaN(numAmount) || numAmount <= 0) return;

        dispatch({
            type: 'ADD_EXPENSE',
            payload: {
                description: description.trim(),
                amount: numAmount,
                category,
            },
        });
        setDescription('');
        setAmount('');
        setCategory('Other');
    };
    
    const handleDelete = (id: string) => {
        dispatch({ type: 'REMOVE_EXPENSE', payload: id });
    };

    const monthlySummary = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const summary = expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
            })
            // FIX: Typed the accumulator to ensure `acc` properties are treated as numbers.
            .reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
            }, {} as Record<string, number>);

        // FIX: Cast Object.values to number[] to satisfy TypeScript.
        const total = (Object.values(summary) as number[]).reduce((sum, val) => sum + val, 0);

        return { summary, total };
    }, [expenses]);

    const categories = ['Housing', 'Utilities', 'Groceries', 'Transport', 'Health', 'Kids', 'Personal', 'Other'];

    return (
        <ContentCard title="💸 Simple Expense Tracker">
            <div className="flex flex-col h-full">
                <p className="text-sm text-text-light text-opacity-80 mb-3">
                    Quickly log expenses to track spending patterns. All data is for the current month.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Add Expense Form */}
                    <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-gray-800 rounded-md border border-gray-700">
                        <h4 className="font-semibold text-accent-green">Log New Expense</h4>
                        <label htmlFor="expense-description" className="sr-only">Description</label>
                        <input
                            type="text"
                            id="expense-description"
                            placeholder="Description (e.g., Groceries)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                            required
                        />
                                <label htmlFor="expense-amount" className="sr-only">Amount</label>
                                <input
                            type="number"
                                     id="expense-amount"
                                     placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                            required
                            step="0.01"
                            min="0.01"
                        />
                        <label htmlFor="expense-category" className="sr-only">Category</label>
                        <select
                            id="expense-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <button type="submit" className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                            Add Expense
                        </button>
                    </form>

                    {/* Monthly Summary */}
                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700">
                        <h4 className="font-semibold text-accent-green mb-2">This Month's Spending</h4>
                        <div className="text-2xl font-bold mb-2">
                            Total: ${monthlySummary.total.toFixed(2)}
                        </div>
                        <div className="space-y-1 text-sm">
                            {Object.entries(monthlySummary.summary).map(([cat, total]) => (
                                <div key={cat} className="flex justify-between">
                                    <span>{cat}:</span>
                                    {/* FIX: Cast total to number to use toFixed. */}
                                    <span className="font-semibold">${(total as number).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-4">
                    <h4 className="font-semibold text-accent-teal mb-2">Recent Transactions</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {expenses.slice(0, 10).map(exp => (
                            <div key={exp.id} className="flex justify-between items-center text-sm p-2 bg-gray-800 rounded-md">
                                <div>
                                    <p className="font-semibold">{exp.description}</p>
                                    <p className="text-xs text-gray-400">{exp.category} - {new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-accent-blue">${(Number(exp.amount)).toFixed(2)}</span>
                                     <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-400" aria-label={`Delete expense ${exp.description}`}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

export default ExpenseTrackerModule;
