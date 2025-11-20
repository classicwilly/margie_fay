import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const AccessibilitySafetyProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Accessibility & Safety Protocol');
  
  const sections = protocolData.map(s => ({ id: s.id, title: s.title }));
  
  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Accessibility &amp; Safety Protocol</h1>
        <p className="text-lg text-text-light text-opacity-70 font-mono">2025-11-10 — M4_SOP_accessibility-safety-protocol</p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(section => (
          <ContentCard key={section.id} title={section.title}>
            {section.description && <p className="text-lg text-text-light text-opacity-90">{section.description}</p>}
            {section.items && (
              <ul className="list-none space-y-2">
                {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
              </ul>
            )}
          </ContentCard>
        ))}
      </div>
    </div>
  );
};

export default AccessibilitySafetyProtocol;