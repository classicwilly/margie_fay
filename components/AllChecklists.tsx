import React from 'react';
import ChecklistItem from './ChecklistItem';
import ContentCard from './ContentCard';
import { ALL_CHECKLIST_DATA, ChecklistSectionData } from '../checklist-data.tsx';
import QuickJump from './QuickJump';
import { exportChecklists, importChecklists } from '../src/utils/importExport';

const AllChecklists: React.FC = () => {
  const groupedBySource = ALL_CHECKLIST_DATA.reduce<Record<string, ChecklistSectionData[]>>((acc, section) => {
    const source = section.sourceDocument;
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(section);
    return acc;
  }, {});

  const sourceToId = (source: string) => `checklist-group-${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  
  const quickJumpSections = Object.keys(groupedBySource).map(source => ({
    id: sourceToId(source),
    title: source,
  }));

  const handlePrint = () => {
    window.print();
  };

  const renderSection = (section: ChecklistSectionData, level: number = 0): React.ReactNode => {
    const titleClass = level === 0 ? "text-accent-teal text-xl" : "text-accent-blue text-lg";
    const containerClass = level > 0 ? "border-l-4 border-gray-700 pl-4 mt-4" : "";

    return (
      <ContentCard 
        key={section.id} 
        title={section.title} 
        showHeader={true} 
        titleClassName={titleClass}
        className={containerClass}
      >
        {section.items && (
          <ul className="list-none">
            {section.items.map(item => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                gemAwardId={item.gemAwardId}
                gemRecipient={item.gemRecipient}
                achievementAwardId={item.achievementAwardId}
                large={item.large}
              >
                {item.label}
              </ChecklistItem>
            ))}
          </ul>
        )}
        {section.subSections && (
          <div className="space-y-4">
            {section.subSections.map(subSection => renderSection(subSection, level + 1))}
          </div>
        )}
      </ContentCard>
    );
  };

  return (
    <div>
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Master Checklist Control</h1>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
          An aggregated, editable, and printable view of every checklist across the Wonky Sprout OS. Use this for comprehensive reviews or offline execution.
        </p>
        <button
          onClick={handlePrint}
          className="no-print absolute top-0 right-0 mt-2 px-6 py-3 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center"
          aria-label="Print all checklists"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print
        </button>
        <button
          onClick={() => {
            const exported = exportChecklists(ALL_CHECKLIST_DATA);
            if (navigator.clipboard) navigator.clipboard.writeText(exported);
            alert('Checklist JSON copied to clipboard.');
          }}
          className="no-print absolute top-0 right-40 mt-2 px-6 py-3 bg-transparent text-accent-teal rounded-md hover:bg-white/5 transition-colors duration-200 font-semibold flex items-center"
          aria-label="Export all checklists"
        >Export Checklists</button>
      </header>

      <QuickJump sections={quickJumpSections} />

      <div className="printable-content space-y-8">
        {Object.entries(groupedBySource).map(([sourceDocument, sections]) => (
          <section key={sourceDocument} id={sourceToId(sourceDocument)}>
            <ContentCard title={sourceDocument} titleClassName="text-accent-blue text-3xl">
              <div className="space-y-6">
                {sections.map(section => renderSection(section))}
              </div>
            </ContentCard>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AllChecklists;