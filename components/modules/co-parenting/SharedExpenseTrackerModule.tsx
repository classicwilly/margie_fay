

import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import type { ExpenseCategory } from '../../../types.js';

const SharedExpenseTrackerModule: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const { sharedExpenses } = appState;

    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('Kids');
    const [paidBy, setPaidBy] = useState<'me' | 'co-parent'>('me');

    const balance = useMemo(() => {
        return sharedExpenses
            .filter(exp => exp.status === 'pending')
            .reduce((acc, exp) => {
                if (exp.paidBy === 'me') {
                    return acc + exp.amount / 2;
                } else {
                    return acc - exp.amount / 2;
                }
            }, 0);
    }, [sharedExpenses]);

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!description.trim() || isNaN(numAmount) || numAmount <= 0) return;

        dispatch({
            type: 'ADD_SHARED_EXPENSE',
            payload: { description: description.trim(), amount: numAmount, category, paidBy },
        });

        // Reset form
        setDescription('');
        setAmount('');
    };

    const handleSettleExpense = (id: string) => {
        dispatch({ type: 'UPDATE_SHARED_EXPENSE_STATUS', payload: { id, status: 'settled' } });
    };

    const pendingExpenses = useMemo(() => 
        sharedExpenses.filter(exp => exp.status === 'pending')
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [sharedExpenses]
    );

    const categories: ExpenseCategory[] = ['Kids', 'Health', 'School', 'Other'];

    return (
        <ContentCard title="💰 Shared Expense Tracker" titleClassName="text-accent-blue text-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Balance & Form */}
                <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg text-center">
                        <h4 className="font-semibold text-accent-teal">Outstanding Balance</h4>
                        {balance > 0 ? (
                            <p className="text-2xl font-bold text-accent-green">Co-parent owes you ${balance.toFixed(2)}</p>
                        ) : balance < 0 ? (
                            <p className="text-2xl font-bold text-accent-warning">You owe co-parent ${Math.abs(balance).toFixed(2)}</p>
                        ) : (
                            <p className="text-2xl font-bold text-text-light">All Settled</p>
                        )}
                    </div>

                    <form onSubmit={handleAddExpense} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                         <h4 className="font-bold text-accent-green">Log New Shared Expense</h4>
                         <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required />
                         <input type="number" placeholder="Total Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required step="0.01" min="0.01" />
                                 <div className="flex gap-2">
                                     <div className="w-1/2">
                                          <label htmlFor="shared-expense-category" className="sr-only">Category</label>
                                          <select id="shared-expense-category" value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="shared-expense-paidby" className="sr-only">Paid By</label>
                                <select id="shared-expense-paidby" value={paidBy} onChange={e => setPaidBy(e.target.value as 'me' | 'co-parent')} className="w-full p-2 bg-gray-900 border border-gray-600 rounded">
                            <select value={paidBy} onChange={e => setPaidBy(e.target.value as 'me' | 'co-parent')} className="w-1/2 p-2 bg-gray-900 border border-gray-600 rounded">
                                <option value="me">I Paid</option>
                                <option value="co-parent">Co-Parent Paid</option>
                                </select>
                            </div>
                         </div>
                         <button type="submit" className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded">Add Expense</button>
                    </form>
                </div>
                
                {/* Pending Expenses List */}
                <div>
                    <h4 className="font-bold text-accent-teal mb-2">Pending Expenses ({pendingExpenses.length})</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {pendingExpenses.length > 0 ? pendingExpenses.map(exp => (
                            <div key={exp.id} className="p-2 bg-gray-800 rounded-md text-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{exp.description}</p>
                                        <p className="text-xs text-gray-400">
                                            Paid by: {exp.paidBy === 'me' ? 'Me' : 'Co-Parent'} on {new Date(exp.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="font-bold text-accent-blue">${exp.amount.toFixed(2)}</p>
                                </div>
                                 <button onClick={() => handleSettleExpense(exp.id)} className="w-full mt-2 text-xs p-1 bg-accent-green/20 text-accent-green rounded hover:bg-accent-green/40">
                                    Mark as Settled
                                </button>
                            </div>
                        )) : <p className="text-sm text-center text-gray-500 p-4">No pending expenses.</p>}
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

export default SharedExpenseTrackerModule;
