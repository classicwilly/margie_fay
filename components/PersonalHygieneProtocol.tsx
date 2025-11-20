import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const PersonalHygieneProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Personal Hygiene Protocol');

  const sections = protocolData.map(section => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">PERSONAL HYGIENE PROTOCOL (SOP-PH)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          A tiered hygiene system for neurodivergent brains. Match hygiene to your capacity.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map(section => (
          <section key={section.id} id={section.id}>
            <ContentCard title={section.title}>
              <p className="text-lg text-text-light text-opacity-90 mb-4">
                {section.description}
              </p>
              <ul className="list-none space-y-2 text-lg">
                {section.items?.map(item => (
                  <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>
                ))}
              </ul>
              {section.id.startsWith('php-t') && (
                 <p className="mt-4 text-lg font-semibold text-accent-blue pl-4">{section.validation}</p>
              )}
            </ContentCard>
          </section>
        ))}

        <footer id="reminder" className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">Your hygiene is not your worth. Skipped shower ≠ bad person. This protocol exists to remove shame and provide structure. Use it. Adapt it. Survive.</p>
        </footer>
      </div>
    </div>
  );
};

export default PersonalHygieneProtocol;