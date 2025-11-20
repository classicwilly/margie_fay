import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const LifeMaintenanceProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Life Maintenance Protocol');

  const sections = protocolData.map(section => ({
    id: section.id,
    title: section.title.replace(/SECTION \d: /, ''), // Clean up title for quick jump
  }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">LIFE MAINTENANCE PROTOCOL (SOP-LM)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          The unglamorous survival tasks that collapse when executive function fails: House cleaning, groceries, and personal hygiene.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(section => (
          <section key={section.id} id={section.id}>
            <ContentCard title={section.title}>
              {section.description && <p className="text-lg text-text-light text-opacity-90 font-semibold mb-4">{section.description}</p>}
              {section.items && (
                <ul className="list-none space-y-2 text-lg mt-4">
                  {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                </ul>
              )}
              {section.subSections?.map(subSection => (
                <ContentCard key={subSection.id} title={subSection.title} titleClassName="text-accent-teal text-xl" className="mb-4">
                  {subSection.description && <p className="text-md text-text-light text-opacity-80 mb-4 pl-4">{subSection.description}</p>}
                  {subSection.items && (
                    <ul className="list-none space-y-2 text-lg">
                      {subSection.items.map(item => <ChecklistItem key={item.id} id={item.id} achievementAwardId={item.achievementAwardId}>{item.label}</ChecklistItem>)}
                    </ul>
                  )}
                  {subSection.subSections && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {subSection.subSections.map(grocerySection => (
                        <ContentCard key={grocerySection.id} title={grocerySection.title} titleClassName="text-accent-blue text-lg">
                          <ul className="list-none text-lg">
                            {grocerySection.items?.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                          </ul>
                        </ContentCard>
                      ))}
                    </div>
                  )}
                </ContentCard>
              ))}
            </ContentCard>
          </section>
        ))}

        <footer id="reminder" className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">These tasks do not define your worth. This SOP exists to remove shame and provide mechanical steps. Use it. Adapt it. Survive.</p>
        </footer>
      </div>
    </div>
  );
};

export default LifeMaintenanceProtocol;