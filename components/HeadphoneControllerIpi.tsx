import type { FC, ReactNode } from "react";
import ContentCard from "./ContentCard";
import ChecklistItem from "./ChecklistItem";
import { QuickJump } from "./QuickJump";
// Fix: Added '.tsx' extension to the import path to ensure the file is treated as a module.
import { ALL_CHECKLIST_DATA } from "../checklist-data.tsx";
import { SecureMarkdown } from "../utils/secureMarkdownRenderer.js";

const Citation: FC<{ children: ReactNode }> = ({ children }) => (
  <em className="text-text-light text-opacity-70 text-sm"> {children}</em>
);

const HeadphoneControllerIpi: FC = () => {
  const protocolData = ALL_CHECKLIST_DATA.filter(
    (s) => s.sourceDocument === "Headphone Controller IPI",
  );

  const sections = protocolData.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          IPI: "Wonky Sprout" Headphone Controller
        </h1>
        <p className="text-lg text-text-light text-opacity-80">
          A structured protocol to reverse engineer Soundcore headphone
          Bluetooth commands and build a desktop controller.
        </p>
      </header>

      <QuickJump sections={sections} />

      <div className="space-y-6">
        {protocolData.map((section) => (
          <ContentCard key={section.id} title={section.title}>
            {section.description && (
              <div className="text-lg text-text-light text-opacity-90 mb-4">
                <SecureMarkdown content={section.description} />
              </div>
            )}
            {section.items && (
              <ul className="list-none space-y-2 text-lg">
                {section.items.map((item) => (
                  <ChecklistItem key={item.id} id={item.id}>
                    {item.label}
                  </ChecklistItem>
                ))}
              </ul>
            )}
            {section.subSections?.map((sub) => (
              <ContentCard
                key={sub.id}
                title={sub.title}
                titleClassName="text-accent-teal text-xl"
              >
                <pre className="bg-gray-800 p-4 rounded-md text-text-light whitespace-pre-wrap text-sm md:text-base">
                  <code>{sub.description}</code>
                </pre>
              </ContentCard>
            ))}
          </ContentCard>
        ))}

        <footer className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-xl font-bold text-accent-blue">
            This is the "fix," William. It is the ultimate "I fix stuff"
            project.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HeadphoneControllerIpi;
