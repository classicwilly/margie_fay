import React from 'react';
import ChecklistItem from './ChecklistItem';
import ContentCard from './ContentCard';
import { QuickJump } from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA, ChecklistSectionData } from '../checklist-data.tsx';


const SensoryOverloadProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Sensory Overload Protocol');
  
  const sections = protocolData.map(s => ({ id: s.id, title: s.title }));

  const renderSubSections = (subSections: ChecklistSectionData[]) => (
    <div className="grid md:grid-cols-2 gap-8">
      {subSections.map(subSection => (
        <ContentCard key={subSection.id} title={subSection.title} showHeader={true} titleClassName="text-accent-teal text-xl">
          <ul className="list-none space-y-2">
            {subSection.items?.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
          </ul>
        </ContentCard>
      ))}
    </div>
  );

  const renderSection = (section: ChecklistSectionData) => (
    <section key={section.id} id={section.id}>
      <ContentCard title={section.title}>
        {section.description && <p className="text-lg text-text-light text-opacity-90 mb-4">{section.description}</p>}
        {section.items && (
          <ul className="list-none space-y-2">
            {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
          </ul>
        )}
        {section.subSections && renderSubSections(section.subSections)}
      </ContentCard>
    </section>
  );

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">SENSORY OVERLOAD EMERGENCY PROTOCOL (IPI-SO)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          <strong>Trigger:</strong> The environment has become unbearable. <strong>Purpose:</strong> Immediate actions to reduce sensory input and retreat to safety.
        </p>
      </header>
      
      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(renderSection)}
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">Key principle: Retreat early. Recover fully. Prevent recurrence.</p>
        </footer>
      </div>
    </div>
  );
};

export default SensoryOverloadProtocol;