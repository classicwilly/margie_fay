import React from 'react';
import ContentCard from './ContentCard';
import ChecklistItem from './ChecklistItem';
import QuickJump from './QuickJump';
import AICommunicationCoach from './AICommunicationCoach';
import SharedCalendar from './SharedCalendar';
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA, ChecklistSectionData } from '../checklist-data.tsx';

const CoParentingProtocol: React.FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Co-Parenting Protocol');
  
  const sections = [
    { id: 'cpp-purpose', title: '🎯 Purpose' },
    { id: 'cpp-principles', title: '📜 Core Principles' },
    { id: 'ai-coach', title: '🤖 AI Coach' },
    { id: 'cpp-quick-sync', title: '📝 Quick Sync' },
    { id: 'cpp-de-escalation', title: '🛑 De-escalation' },
    { id: 'calendar', title: '🗓️ Calendar' },
    { id: 'cpp-handoffs', title: '🔄 Handoffs' },
    { id: 'cpp-emergency', title: '🚨 Emergency' },
  ];

  const quickSyncTemplate = `**Kids Weekly Status Update:**

*   **Health:** (Any illnesses, doctor's visits, medication changes?)
*   **School:** (Any major projects, achievements, or concerns?)
*   **Needs:** (e.g., "Willow needs new shoes," "Bash needs poster board for a project.")
*   **Positive Moment:** (Share one brief, positive story from your time.)`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderSection = (section: ChecklistSectionData) => (
    <section key={section.id} id={section.id}>
      <ContentCard title={section.title}>
        {section.description && <p className="text-lg text-text-light text-opacity-90">{section.description}</p>}
        {section.items && (
          <ul className="list-none space-y-2 text-lg">
            {section.items.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
          </ul>
        )}
        {section.subSections && (
          <div className="grid md:grid-cols-2 gap-6">
            {section.subSections.map(sub => (
              <ContentCard key={sub.id} title={sub.title} titleClassName="text-accent-blue text-lg">
                <ul className="list-none text-lg">
                  {sub.items?.map(item => <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>)}
                </ul>
              </ContentCard>
            ))}
          </div>
        )}
      </ContentCard>
    </section>
  );

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">CO-PARENTING OPERATIONS TOOLKIT</h1>
        <p className="text-lg text-text-light text-opacity-80">
          A structured system for low-friction, high-clarity communication and logistics. This is about operational efficiency, not emotional processing.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-8">
        {protocolData.map(renderSection)}

        <section id="ai-coach">
          <AICommunicationCoach />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section id="cpp-quick-sync">
            <ContentCard title="Weekly Quick Sync Template">
                <p className="text-md text-text-light text-opacity-80 mb-4">
                  Use this template for the weekly update Google Doc. It removes the executive load of starting from scratch and keeps communication focused.
                </p>
                <pre className="bg-gray-800 p-4 rounded-md text-text-light whitespace-pre-wrap text-sm border border-gray-700">{quickSyncTemplate}</pre>
                <button onClick={() => copyToClipboard(quickSyncTemplate)} className="mt-4 w-full p-2 bg-accent-green text-background-dark font-bold rounded">Copy Template</button>
            </ContentCard>
          </section>

          <section id="cpp-de-escalation">
            <ContentCard title="Emergency De-escalation Checklist">
                <p className="text-md text-text-light text-opacity-80 mb-4">
                  If a text exchange becomes emotionally charged, execute this IPI immediately.
                </p>
                <ul className="list-none space-y-2 text-lg">
                  {ALL_CHECKLIST_DATA.find(s => s.id === 'cpp-de-escalation')?.items?.map(item => (
                    <ChecklistItem key={item.id} id={item.id}>{item.label}</ChecklistItem>
                  ))}
                </ul>
            </ContentCard>
          </section>
        </div>

        <section id="calendar">
          <SharedCalendar />
        </section>

        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">This system is designed to protect the children from conflict and the parents from unnecessary stress. Adherence is mandatory for system stability.</p>
        </footer>
      </div>
    </div>
  );
};

export default CoParentingProtocol;