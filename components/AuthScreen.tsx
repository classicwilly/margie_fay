


import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';

import { auth, db } from '../firebase.js';
import { defaultUserState } from '../defaultStates.js';



const getAuthDiagnostic = (errorMessage) => {
    if (errorMessage.includes('auth/invalid-credential')) {
        return {
            title: 'AUTHENTICATION FAILURE',
            analysis: 'Credentials rejected by authentication server.',
            rootCause: 'Invalid email or password combination.',
            correctiveAction: 'Verify credentials and re-attempt. Check for typos.',
        };
    }
    if (errorMessage.includes('auth/email-already-in-use')) {
        return {
            title: 'ACCOUNT PROVISIONING FAILURE',
            analysis: 'The provided identity (email) is already registered in the system.',
            rootCause: 'An account with this email address already exists.',
            correctiveAction: 'Proceed to the login screen to access the existing account.',
        };
    }
    if (errorMessage.includes('auth/weak-password')) {
        return {
            title: 'SECURITY PROTOCOL VIOLATION',
            analysis: 'Submitted password does not meet minimum system security requirements.',
            rootCause: 'Password must be at least 6 characters long.',
            correctiveAction: 'Provide a stronger password and re-attempt account creation.',
        };
    }
    if (errorMessage.includes('auth/invalid-email')) {
        return {
            title: 'INPUT VALIDATION FAILURE',
            analysis: 'The provided identity (email) does not conform to a valid format.',
            rootCause: 'The email address is not valid.',
            correctiveAction: 'Correct the email format and re-attempt.',
        };
    }
    // Fallback for other errors
    return {
        title: 'UNKNOWN SYSTEM ERROR',
        analysis: 'An unexpected fault occurred during the authentication process.',
        rootCause: 'Could not establish a secure connection or process the request.',
        correctiveAction: 'Check your network connection and try again. If the problem persists, the service may be temporarily unavailable.',
    };
};

const AuthErrorDisplay = ({ error }) => (
    <div role="alert" className="p-4 bg-red-900/30 border-2 border-accent-warning/50 rounded-lg mb-4 text-sm animate-pulse-slow">
        <h3 className="font-bold text-lg text-accent-warning flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            NON-CONFORMING CONDITION REPORT
        </h3>
        <p className="text-yellow-400/80 text-xs font-mono mb-3">{error.title}</p>
        <div className="space-y-2 border-l-2 border-accent-warning/30 pl-3">
            <p><strong className="text-yellow-300">Analysis:</strong> {error.analysis}</p>
            <p><strong className="text-yellow-300">Root Cause:</strong> {error.rootCause}</p>
            <p><strong className="text-yellow-300">Corrective Action:</strong> {error.correctiveAction}</p>
        </div>
    </div>
);


const AuthScreen = () => {
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newUserType, setNewUserType] = useState('william');


    const handleLogin = async (loginEmail, loginPass) => {
        setLoading(true);
        setAuthError(null);
        try {
            await auth.signInWithEmailAndPassword(loginEmail, loginPass);
            // onAuthStateChanged in context will handle the rest
        } catch (e) {
            setAuthError(getAuthDiagnostic(e.message));
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAuthError(null);
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const newUser = userCredential.user;
            
            // Create the initial user state in the database
            const initialState = {
                ...defaultUserState,
                dashboardType: newUserType,
                view: 'garden-view', // All new users start at the Garden View
            };
            
            await db.setDoc(newUser.uid, initialState);
            // Login will be handled by onAuthStateChanged
            
        } catch (e) {
            setAuthError(getAuthDiagnostic(e.message));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-accent-teal mb-6">🌱 Wonky Sprout OS</h1>
                <p className="text-xl md:text-2xl text-text-light text-opacity-90 max-w-2xl mx-auto">
                    An engineering solution for neurodivergent life management.
                </p>
            </header>

            <section className="max-w-sm mx-auto p-6 bg-card-dark rounded-lg border border-gray-700">
                 <h2 className="text-2xl font-bold text-center mb-6">{isCreating ? 'Create a New Sprout' : 'Login'}</h2>
                
                {authError && <AuthErrorDisplay error={authError} />}
                
                <form onSubmit={handleCreateUser} className="space-y-4">
                    {isCreating && (
                        <div>
                            <label htmlFor="sprout-type" className="block text-sm font-medium text-gray-300 mb-1">Sprout Type:</label>
                            <select
                                id="sprout-type"
                                value={newUserType}
                                onChange={e => setNewUserType(e.target.value)}
                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
                            >
                                <option value="william">Personal Sprout (Default)</option>
                                <option value="co-parenting">Co-Parenting Sprout</option>
                                <option value="willow">Kid Sprout (Willow style)</option>
                                <option value="sebastian">Kid Sprout (Bash style)</option>
                            </select>
                            <p className="text-xs text-gray-400 mt-2">
                                <strong>Personal:</strong> Full-featured OS for an individual.
                                <br/>
                                <strong>Co-Parenting:</strong> A shared hub for managing kid logistics.
                                <br/>
                                <strong>Kid Sprout:</strong> A simplified dashboard for a child's routines.
                            </p>
                        </div>
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
                        required
                    />

                    {isCreating ? (
                         <button type="submit" disabled={loading} className="w-full p-3 bg-accent-green text-background-dark font-bold rounded disabled:bg-gray-600">
                            {loading ? 'Planting...' : 'Create Sprout'}
                        </button>
                    ) : (
                         <button type="button" onClick={() => handleLogin(email, password)} disabled={loading} className="w-full p-3 bg-accent-blue text-background-dark font-bold rounded disabled:bg-gray-600">
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    )}

                </form>

                 <div className="text-center mt-6">
                    <button
                        onClick={() => { setIsCreating(!isCreating); setAuthError(null); }}
                        className="text-sm text-accent-green font-semibold hover:underline"
                    >
                        {isCreating ? 'Already have a Sprout? Login' : "Don't have a Sprout? Create one"}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AuthScreen;