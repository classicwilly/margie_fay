import type { FC } from "react";

interface QuickJumpProps {
  sections: { id: string; title: string }[];
}

export const QuickJump: FC<QuickJumpProps> = ({ sections }) => {
  const handleJump = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="quick-jump"
      className="mb-10 p-4 bg-gray-800 rounded-lg border border-gray-700 no-print"
    >
      <h2 className="text-2xl font-bold text-accent-green mb-4">
        🚀 QUICK JUMP TO SECTION
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => handleJump(section.id)}
              className="block w-full text-left p-2 text-accent-blue hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
