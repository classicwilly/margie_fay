import { useState, useMemo, type FC } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard.js";

const ArchiveLog: FC = () => {
  const { appState, dispatch } = useAppState();
  const { projects, objectives, knowledgeVaultEntries } = appState;
  const [activeTab, setActiveTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");

  const archivedProjects = useMemo(
    () => projects.filter((p: any) => p.isArchived),
    [projects],
  );
  const archivedKnowledge = useMemo(
    () => knowledgeVaultEntries.filter((k: any) => k.isArchived),
    [knowledgeVaultEntries],
  );

  const filteredKnowledge = useMemo(() => {
    if (!searchTerm) {
      return archivedKnowledge;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return archivedKnowledge.filter(
      (entry: any) =>
        entry.title.toLowerCase().includes(lowerSearch) ||
        entry.content.toLowerCase().includes(lowerSearch) ||
        entry.tags.some((tag: string) =>
          tag.toLowerCase().includes(lowerSearch),
        ),
    );
  }, [searchTerm, archivedKnowledge]);

  const projectsByObjective = useMemo(() => {
    return archivedProjects.reduce(
      (acc: Record<string, any[]>, project: any) => {
        const objective = objectives.find(
          (o: any) => o.id === project.objectiveId,
        );
        const objectiveTitle = objective ? objective.title : "Uncategorized";
        if (!acc[objectiveTitle]) {
          acc[objectiveTitle] = [];
        }
        acc[objectiveTitle].push(project);
        return acc;
      },
      {},
    );
  }, [archivedProjects, objectives]);

  const handleUnarchiveKnowledge = (id: string) => {
    dispatch({ type: "UNARCHIVE_KNOWLEDGE_ENTRY", payload: id });
  };

  const TabButton = ({
    label,
    target,
    count,
  }: {
    label: string;
    target: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(target)}
      className={`btn-primary w-1/2 rounded-t-md text-lg font-semibold transition-colors ${
        activeTab === target
          ? "bg-surface-900 border-b-2 border-accent-blue text-accent-blue"
          : "bg-surface-800 text-text-light hover:bg-surface-700"
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          🏆 Accomplishments & Archive
        </h1>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
          A historical log of your completed projects and archived knowledge.
          Review your progress.
        </p>
      </header>

      <div className="flex border-b border-surface-700 mb-6">
        <TabButton
          label="Completed Projects"
          target="projects"
          count={archivedProjects.length}
        />
        <TabButton
          label="Archived Knowledge"
          target="knowledge"
          count={archivedKnowledge.length}
        />
      </div>

      {activeTab === "projects" && (
        <div className="space-y-6">
          {Object.entries(projectsByObjective).map(
            ([objectiveTitle, projects]) => (
              <ContentCard key={objectiveTitle} title={`🎯 ${objectiveTitle}`}>
                <div className="space-y-3">
                  {Array.isArray(projects) &&
                    projects.map((project: any) => (
                      <div key={project.id} className="card-base">
                        <p className="font-semibold text-accent-green">
                          ✅ {project.title}
                        </p>
                        <p className="text-xs text-text-light mt-1">
                          Completed & Archived
                        </p>
                      </div>
                    ))}
                </div>
              </ContentCard>
            ),
          )}
          {archivedProjects.length === 0 && (
            <p className="text-center text-text-light">
              No projects have been completed and archived yet.
            </p>
          )}
        </div>
      )}

      {activeTab === "knowledge" && (
        <div>
          <input
            type="search"
            placeholder="Search archived knowledge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 card-base border-2 border-surface-700 mb-4"
          />
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {filteredKnowledge.map((entry: any) => (
              <details
                key={entry.id}
                className="card-base border border-surface-700 group"
              >
                <summary className="cursor-pointer font-bold text-accent-teal">
                  {entry.title}
                </summary>
                <div className="pt-2 mt-2 border-t border-surface-600">
                  <p className="whitespace-pre-wrap text-sm mb-2">
                    {entry.content}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleUnarchiveKnowledge(entry.id)}
                      className="btn-primary text-xs font-semibold"
                    >
                      Restore to Vault
                    </button>
                  </div>
                </div>
              </details>
            ))}
            {archivedKnowledge.length === 0 && (
              <p className="text-center text-text-light">
                No knowledge entries have been archived yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveLog;
