

import React from 'react';
import AITrendAnalysis from './insights/AITrendAnalysis.js';
import HabitHeatmap from './insights/HabitHeatmap.js';
import ExpenseBreakdown from './insights/ExpenseBreakdown.js';
import SpendingVelocityChart from './insights/SpendingVelocityChart.js';
import AIFinancialAnalysis from './insights/AIFinancialAnalysis.js';
import AIRealtimeDiagnostic from './insights/AIRealtimeDiagnostic.js';

const SystemInsights = () => {
    return (
        <div>
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">System Insights & Analytics</h1>
                <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
                    A high-level analytics dashboard for the entire OS. Visualize trends and review automated AI diagnostics to find correlations.
                </p>
            </header>
            
            <section id="ai-diagnostics" className="mb-12">
                 <h2 className="text-3xl font-bold text-accent-green mb-6 text-center border-b-2 border-gray-700 pb-2">AI Diagnostics</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AIRealtimeDiagnostic />
                    <AITrendAnalysis />
                 </div>
            </section>
            
            <section id="financial-command-center" className="mb-12">
                <h2 className="text-3xl font-bold text-accent-green mb-6 text-center border-b-2 border-gray-700 pb-2">Financial Command Center</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SpendingVelocityChart />
                    <AIFinancialAnalysis />
                    <div className="lg:col-span-2">
                        <ExpenseBreakdown />
                    </div>
                </div>
            </section>
            
            <section id="behavioral-analytics">
                 <h2 className="text-3xl font-bold text-accent-green mb-6 text-center border-b-2 border-gray-700 pb-2">Behavioral Analytics</h2>
                <HabitHeatmap />
            </section>
        </div>
    );
};

export default SystemInsights;