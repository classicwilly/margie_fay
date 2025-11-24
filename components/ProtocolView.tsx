import React from "react";
import ContentCard from "./ContentCard.js";
import ChecklistItem from "./ChecklistItem.js";
import { QuickJump } from "./QuickJump.js";
import { ALL_CHECKLIST_DATA } from "../checklist-data.js";
import { SecureMarkdown } from "../utils/secureMarkdownRenderer.js";

// FIX: Made the 'footer' prop optional by adding a question mark to its type definition. This resolves errors in multiple components that call ProtocolView without providing a footer, which is valid for many protocols.
const ProtocolView: React.FC<{
  sourceDocument: any;
  title: any;
  subtitle: any;
  footer?: React.ReactNode;
}> = ({ sourceDocument, title, subtitle, footer }) => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === sourceDocument,
  );

  if (!protocolData || protocolData.length === 0) {
    return (
      <ContentCard title="Error">
        <p>Could not find protocol data for: {sourceDocument}</p>
      </ContentCard>
    );
  }

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  const renderItems = (items) => {
    if (!items) {
      return null;
    }
    return (
      <ul className="list-none space-y-2 text-lg">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            achievementAwardId={item.achievementAwardId}
          >
            {item.label}
          </ChecklistItem>
        ))}
      </ul>
    );
  };

  const renderSubSections = (subSections) => {
    if (!subSections) {
      return null;
    }
    return (
      <div className="space-y-4">
        {subSections.map((sub) => (
          <ContentCard
            key={sub.id}
            title={sub.title}
            showHeader={true}
            titleClassName="text-accent-teal text-xl"
          >
            <div className="text-lg text-text-light text-opacity-90 mb-4">
              <SecureMarkdown content={sub.description} />
            </div>
            {renderItems(sub.items)}
          </ContentCard>
        ))}
      </div>
    );
  };

  return (
    <div>
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        <button
          onClick={() => window.print()}
          className="no-print absolute top-0 right-0 mt-2 px-4 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold flex items-center text-sm"
          aria-label="Print this protocol"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          Print
        </button>
      </header>

      {sections.length > 1 && <QuickJump sections={sections} />}

      <div className="space-y-6">
        {protocolData.map((section) => (
          <ContentCard key={section.id} title={section.title}>
            {section.description && (
              <div className="text-lg text-text-light text-opacity-90 mb-4">
                <SecureMarkdown content={section.description} />
              </div>
            )}
            {renderItems(section.items)}
            {renderSubSections(section.subSections)}
          </ContentCard>
        ))}
      </div>

      {footer}
    </div>
  );
};

export default ProtocolView;
