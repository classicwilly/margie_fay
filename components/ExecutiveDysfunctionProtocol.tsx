import React from 'react';
import ChecklistItem from './ChecklistItem';
import ContentCard from './ContentCard';
import { QuickJump } from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const ExecutiveDysfunctionProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Executive Dysfunction Protocol');
  
  const sections = protocolData.map(s => ({ id: s.id, title: s.title }));

  const renderSection = (section: (typeof protocolData)[0]) => (
    <section key={section.id} id={section.id}>
      <ContentCard title={section.title}>
        {section.description && <p className="text-lg text-text-light text-opacity-90 mb-4">{section.description}</p>}
        {section.items && (
          <ul className="list-none space-y-2">
            {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
          </ul>
        )}
      </ContentCard>
    </section>
  );

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">EXECUTIVE DYSFUNCTION EMERGENCY PROTOCOL (IPI-ED)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          <strong>Trigger:</strong> Everything feels impossible. You are frozen. <strong>Purpose:</strong> An emergency reboot to restore basic operational capacity.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(renderSection)}
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The freeze is not a moral failure. It&apos;s a systems failure. This protocol is the emergency fix. Now execute it.</p>
        </footer>
      </div>
    </div>
  );
};

export default ExecutiveDysfunctionProtocol;