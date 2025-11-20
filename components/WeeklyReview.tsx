import React from 'react';
import QuickJump from './QuickJump';
import ChecklistItem from './ChecklistItem';
import ContentCard from './ContentCard';
import { ALL_CHECKLIST_DATA } from '../checklist-data.tsx';
import { useNeuroPrefs } from '@contexts/NeurodivergentPreferencesContext';

const WeeklyReview: React.FC = () => {
    const { prefs } = useNeuroPrefs();
    const { microStepsMode } = prefs;
    const sections = [
    { id: 'setup-heading', title: 'Pre-Protocol Setup' },
    { id: 'phase1-heading', title: 'Phase 1: Chaos Processing' },
    { id: 'phase2-heading', title: 'Phase 2: Task Review' },
    { id: 'phase3-heading', title: 'Phase 3: System Health' },
    { id: 'phase4-heading', title: 'Phase 4: Week Ahead' },
    { id: 'phase5-heading', title: 'Phase 5: Optimization' },
    { id: 'post-protocol-heading', title: 'Post-Protocol Actions' },
    { id: 'success-heading', title: 'Success Criteria' },
  ];

  const weeklyReviewData = ALL_CHECKLIST_DATA.filter(s => s.sourceDocument === 'Weekly Review');

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Weekly Review Checklist</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Use this checklist every Friday 3-4 PM (Solo Mode) or Sunday 8:30-9:30 PM (Family Mode). Progress saves automatically.
        </p>
      </header>
      
      <QuickJump sections={sections} />

      <div className="space-y-6">
        {weeklyReviewData.map(section => (
           <ContentCard key={section.id} title={section.title} titleClassName="text-accent-green">
              {section.items && (
                <ul className="list-none">
                  {section.items.map(item => {
                    const fullLabel = item.label;
                    const microSteps = microStepsMode && fullLabel.includes(':') ? fullLabel.split('. ').filter(s => s.trim() !== '') : [fullLabel];

                    return microSteps.map((step, idx) => (
                      <ChecklistItem 
                        key={`${item.id}-${idx}`}
                        id={item.id}
                        gemAwardId={item.gemAwardId}
                        gemRecipient={item.gemRecipient}
                        achievementAwardId={item.achievementAwardId}
                        large={item.large}
                      >
                        {microStepsMode && microSteps.length > 1 ? `• ${step}` : step}
                      </ChecklistItem>
                    ));
                  })}
                </ul>
              )}
              {section.subSections && section.subSections.map(subSection => (
                  <ContentCard key={subSection.id} title={subSection.title} showHeader={true} titleClassName="text-accent-teal text-xl" className="mb-4">
                    <ul className="list-none">
                       {subSection.items?.map(item => (
                         <ChecklistItem key={item.id} id={item.id} achievementAwardId={item.achievementAwardId}>
                           {item.label}
                         </ChecklistItem>
                       ))}
                    </ul>
                  </ContentCard>
              ))}
           </ContentCard>
        ))}
      </div>
    </div>
  );
};

export default WeeklyReview;
