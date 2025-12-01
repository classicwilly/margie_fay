'use client';

import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { generateProtocol, formDataToProtocolInput } from '../utils/protocolBuilder';
import { GeneratedProtocol } from '../types/protocol';

export default function Step8ProtocolGeneration() {
  const { formData, goToPreviousStep, resetForm } = useFormContext();
  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'individual' | 'stakeholders' | 'timeline' | 'metrics' | 'contingency' | 'full'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateProtocol = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const protocolInput = formDataToProtocolInput(formData);
      const generatedProtocol = generateProtocol(protocolInput);
      setProtocol(generatedProtocol);
      setIsGenerating(false);
    }, 500);
  };

  const handleDownload = () => {
    if (!protocol) return;
    const blob = new Blob([protocol.fullDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = 'protocol-' + dateStr + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!protocol) return;
    navigator.clipboard.writeText(protocol.fullDocument).then(() => {
      alert('Protocol copied to clipboard!');
    });
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📋' },
    { id: 'individual' as const, label: 'Individual Protocols', icon: '👤' },
    { id: 'stakeholders' as const, label: 'Stakeholders', icon: '🤝' },
    { id: 'timeline' as const, label: 'Timeline', icon: '📅' },
    { id: 'metrics' as const, label: 'Metrics', icon: '📊' },
    { id: 'contingency' as const, label: 'Contingency', icon: '⚠️' },
    { id: 'full' as const, label: 'Full Document', icon: '📄' },
  ];

  const renderContent = () => {
    if (!protocol) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="whitespace-pre-wrap bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-slate-300">
              {protocol.masterOverview}
            </pre>
          </div>
        );

      case 'individual':
        return (
          <div className="space-y-6">
            {protocol.individualProtocols.map((p, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {p.nodeName} - {p.role}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><strong className="text-slate-200">OS:</strong> {p.operatingSystem}</p>
                  <p className="text-slate-300"><strong className="text-slate-200">Approach:</strong> {p.approach}</p>
                  <p className="text-slate-300"><strong className="text-slate-200">Delivery:</strong> {p.deliveryMethod}</p>
                  <div>
                    <strong className="text-slate-200">Key Messages:</strong>
                    <ul className="list-disc list-inside ml-4 text-slate-300">
                      {p.keyMessages.map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-200">Support Needs:</strong>
                    <ul className="list-disc list-inside ml-4 text-slate-300">
                      {p.supportNeeds.map((need, i) => <li key={i}>{need}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-200">Red Flags:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {p.redFlags.map((flag, i) => <li key={i} className="text-red-400">⚠️ {flag}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'stakeholders':
        return (
          <div className="space-y-6">
            {protocol.stakeholderTemplates.map((t, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">{t.stakeholderType}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300"><strong className="text-slate-200">Purpose:</strong> {t.purpose}</p>
                  <p className="text-slate-300"><strong className="text-slate-200">Frequency:</strong> {t.frequency}</p>
                  <div>
                    <strong className="text-slate-200">Template:</strong>
                    <pre className="mt-2 whitespace-pre-wrap bg-slate-900/50 p-3 rounded border border-slate-700 text-xs text-slate-300">
                      {t.template}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-4">
            {['Communication', 'Wellbeing', 'Progress', 'System Health', 'Risk Management'].map(category => {
              const categoryMetrics = protocol.successMetrics.filter(m => m.category === category);
              if (categoryMetrics.length === 0) return null;
              return (
                <div key={category} className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-white">{category}</h3>
                  <div className="space-y-2">
                    {categoryMetrics.map((metric, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                        <p className="font-medium text-sm text-white">{metric.metric}</p>
                        <p className="text-sm text-slate-400">Target: {metric.target}</p>
                        <p className="text-xs text-slate-500">Measurement: {metric.measurement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'contingency':
        return (
          <div className="space-y-6">
            {protocol.contingencyPlans.map((plan, index) => (
              <div key={index} className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-red-300">
                  ⚠️ {plan.scenario}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-slate-200">Triggers:</strong>
                    <ul className="list-disc list-inside ml-4 text-slate-300">
                      {plan.triggers.map((trigger, i) => <li key={i}>{trigger}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-200">Response Protocol:</strong>
                    <pre className="whitespace-pre-wrap bg-slate-900/50 p-3 rounded border border-slate-700 mt-2 text-slate-300">
                      {plan.response}
                    </pre>
                  </div>
                  <div>
                    <strong className="text-slate-200">Escalation:</strong>
                    <p className="bg-slate-900/50 p-3 rounded border border-slate-700 mt-2 text-slate-300">{plan.escalation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'full':
        return (
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="whitespace-pre-wrap bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-xs text-slate-300">
              {protocol.fullDocument}
            </pre>
          </div>
        );

      default:
        return <div className="prose prose-sm prose-invert max-w-none text-slate-300">{protocol.masterOverview}</div>;
    }
  };

  const getTabClassName = (tabId: string) => {
    const base = 'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap';
    if (activeTab === tabId) {
      return base + ' border-blue-500 text-blue-400';
    }
    return base + ' border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Protocol Generation</h2>
        <p className="text-slate-400">
          Generate your customized deployment protocol based on all the information provided.
        </p>
      </div>

      {!protocol ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Your Protocol</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Click the button below to create a comprehensive deployment protocol tailored to your system configuration.
            </p>
          </div>
          <button
            onClick={handleGenerateProtocol}
            disabled={isGenerating}
            className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙️</span>
                Generating Protocol...
              </>
            ) : (
              'Generate Protocol'
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-slate-700 text-slate-200 font-medium rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              ⬇️ Download Markdown
            </button>
            <button
              onClick={() => setProtocol(null)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              🔄 Regenerate
            </button>
          </div>

          <div className="border-b border-slate-700 overflow-x-auto">
            <nav className="flex space-x-2 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={getTabClassName(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-800/30 rounded-lg border border-slate-700 p-6 min-h-[400px]">
            {renderContent()}
          </div>
        </>
      )}

      <div className="flex justify-between pt-4 border-t border-slate-700">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Start New Configuration
        </button>
      </div>
    </div>
  );
}