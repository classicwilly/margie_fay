import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA, ChecklistSectionData } from '../checklist-data.tsx';

const CommandCenterSetupSop: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Command Center Setup SOP');

  const sections = protocolData.map(section => ({
    id: section.id,
    title: section.title,
  }));
  
  const renderSubSections = (subSections: ChecklistSectionData[], grid: boolean = false) => {
    const containerClass = grid ? 'grid md:grid-cols-2 gap-6' : '';
    return (
      <div className={containerClass}>
        {subSections.map(subSection => (
          <ContentCard key={subSection.id} title={subSection.title} titleClassName="text-accent-teal text-xl" className="mb-4">
            <ul className="list-none space-y-2 text-lg">
              {subSection.items?.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
            </ul>
          </ContentCard>
        ))}
      </div>
    );
  };

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">COMMAND CENTER SETUP SOP (CCS-SOP)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Define the complete equipment, software, and spatial requirements for the neurodivergent-optimized Command Center.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(section => (
          <section key={section.id} id={section.id}>
            <ContentCard title={section.title}>
              {section.description && <p className="text-lg text-text-light text-opacity-90 mb-4">{section.description}</p>}
              {section.items && (
                <ul className="list-none space-y-2 text-lg">
                  {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                </ul>
              )}
              {section.subSections && renderSubSections(section.subSections, section.id === 'ccs-setup')}
            </ContentCard>
          </section>
        ))}
        
        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The Command Center is not about having the best gear. It's about eliminating every friction point between your brain and your output.</p>
        </footer>
      </div>
    </div>
  );
};

export default CommandCenterSetupSop;