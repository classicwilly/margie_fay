
import React from 'react';
import Button from './Button';

const ImportConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-modal-title"
        >
            <div
                className="bg-card-dark rounded-lg shadow-2xl p-8 border border-red-700 w-full max-w-lg m-4"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center mb-6">
                    <h2 id="import-modal-title" className="text-3xl font-extrabold text-accent-warning">Confirm State Import</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white" aria-label="Close modal">&times;</button>
                </header>

                <div className="p-4 bg-red-900/30 rounded-lg border border-red-700">
                    <p className="font-bold text-red-300 text-lg">⚠️ System Overwrite Warning!</p>
                    <p className="text-red-300 mt-2">
                        You are about to import a new OS state from a backup file. This action will completely and irreversibly overwrite all of your current data, including checklists, tasks, habits, financial records, and knowledge vault entries.
                    </p>
                    <p className="text-red-200 mt-3 font-semibold">
                        This cannot be undone.
                    </p>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                    <Button onClick={onConfirm} variant="danger">Confirm & Overwrite</Button>
                </div>
            </div>
        </div>
    );
};

export default ImportConfirmationModal;