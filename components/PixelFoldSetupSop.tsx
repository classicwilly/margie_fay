import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';

const PixelFoldSetupSop: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Pixel Fold Setup SOP');

  const sections = protocolData.map(section => ({
    id: section.id,
    title: section.title,
  }));
  
  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">PIXEL 9 PRO FOLD SETUP SOP (PFS-SOP)</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Configure the mobile extension of the Wonky Sprout OS for chaos capture, continuity, and emergency access.
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
            </ContentCard>
          </section>
        ))}

        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">The Pixel Fold is a tool, not a toy. It extends the Command Center into your pocket. Every setting serves the dual-mode life structure.</p>
        </footer>
      </div>
    </div>
  );
};

export default PixelFoldSetupSop;