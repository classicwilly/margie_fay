import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import { QuickJump } from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const FamilyStructureModeProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Family Structure Mode Protocol');
  
  const sections = protocolData.map(section => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">FAMILY STRUCTURE MODE (FSM-SOP)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          <strong>Active Period:</strong> Friday 4:00 PM → Monday 6:00 PM
        </p>
        <p className="text-lg text-text-light text-opacity-90 mt-2 font-semibold">
          Purpose: Shared structure, low-stimulation environment, and high-vigilance parenting.
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
              {section.subSections?.map(subSection => (
                 <ContentCard key={subSection.id} title={subSection.title} titleClassName="text-yellow-400 text-xl" className="border-yellow-500 mt-4">
                    {subSection.description && <p className="text-lg text-text-light text-opacity-90 mb-6">{subSection.description}</p>}
                    <ul className="list-none space-y-2 text-lg">
                        {subSection.items?.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                    </ul>
                 </ContentCard>
              ))}
            </ContentCard>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FamilyStructureModeProtocol;