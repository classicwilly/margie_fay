import React, { useMemo } from "react";
import useProgressVar from "@hooks/useProgressVar";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard.js";

const getQuarter = (d = new Date()) => Math.floor(d.getMonth() / 3) + 1;
const getYear = (d = new Date()) => d.getFullYear();

const StrategicRoadmap = () => {
  const { appState } = useAppState();
  const { objectives, projects, tasks } = appState;

  const currentQuarter = useMemo(() => {
    const now = new Date();
    const year = getYear(now);
    const quarter = getQuarter(now);
    const startDate = new Date(year, (quarter - 1) * 3, 1);
    const endDate = new Date(year, quarter * 3, 0);
    return { startDate, endDate, year, quarter };
  }, []);

  const totalDaysInQuarter = useMemo(() => {
    return (
      (currentQuarter.endDate.getTime() - currentQuarter.startDate.getTime()) /
      (1000 * 3600 * 24)
    );
  }, [currentQuarter]);

  const getProjectStyle = (project) => {
    const projStart = project.startDate
      ? new Date(project.startDate)
      : currentQuarter.startDate;
    const projEnd = project.endDate
      ? new Date(project.endDate)
      : currentQuarter.endDate;

    const startDay = Math.max(
      0,
      (projStart.getTime() - currentQuarter.startDate.getTime()) /
        (1000 * 3600 * 24),
    );
    const endDay = Math.min(
      totalDaysInQuarter,
      (projEnd.getTime() - currentQuarter.startDate.getTime()) /
        (1000 * 3600 * 24),
    );

    const leftPercentage = (startDay / totalDaysInQuarter) * 100;
    const widthPercentage = ((endDay - startDay) / totalDaysInQuarter) * 100;

    return {
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
    };
  };

  const monthMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentQuarter.startDate);
      monthDate.setMonth(currentQuarter.startDate.getMonth() + i);
      const monthStartDay =
        (monthDate.getTime() - currentQuarter.startDate.getTime()) /
        (1000 * 3600 * 24);
      const left = (monthStartDay / totalDaysInQuarter) * 100;
      markers.push({
        name: monthDate.toLocaleString("default", { month: "long" }),
        left: `${left}%`,
        width: `${(1 / 3) * 100}%`,
      });
    }
    return markers;
  }, [currentQuarter, totalDaysInQuarter]);

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          Strategic Roadmap
        </h1>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
          A high-level visual plan of all active projects for Q
          {currentQuarter.quarter} {currentQuarter.year}.
        </p>
      </header>

      <ContentCard title="Quarterly Timeline">
        <div className="relative">
          {/* Month Markers */}
          <div className="flex h-8 mb-4">
            {monthMarkers.map((marker) => (
              <MonthMarker key={marker.name} marker={marker} />
            ))}
          </div>

          {/* Project Rows */}
          <div className="space-y-6">
            {objectives
              .filter((o) => !o.isArchived)
              .map((objective) => {
                const objectiveProjects = projects.filter(
                  (p) =>
                    p.objectiveId === objective.id &&
                    !p.isArchived &&
                    p.startDate &&
                    p.endDate,
                );
                if (objectiveProjects.length === 0) {
                  return null;
                }
                return (
                  <div key={objective.id}>
                    <h3 className="font-bold text-accent-green mb-3">
                      🎯 {objective.title}
                    </h3>
                    <div className="space-y-2">
                      {objectiveProjects.map((project) => {
                        // FIX: Correctly calculate task completion progress.
                        const linkedTasks = tasks.filter(
                          (t) => t.projectId === project.id,
                        );
                        const completed = linkedTasks.filter(
                          (t) => t.status === "done",
                        ).length;
                        const total = linkedTasks.length;
                        const progressPercentage =
                          total > 0 ? (completed / total) * 100 : 0;

                        return (
                          <ProgressProjectBar
                            key={project.id}
                            project={project}
                            progressPercentage={progressPercentage}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </ContentCard>
    </div>
  );
};

const MonthMarker: React.FC<{ marker: any }> = ({ marker }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  // The marker width is already a percentage string (e.g., '33.3333%'), so use that as progress
  useProgressVar(ref, marker.width);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--progress", marker.width);
    }
  }, [marker.width]);
  return (
    <div
      ref={ref}
      className="month-marker text-center font-bold text-accent-blue border-r border-gray-700 last:border-r-0"
      aria-hidden="true"
    >
      {marker.name}
    </div>
  );
};

const ProgressProjectBar: React.FC<{
  project: any;
  progressPercentage: number;
}> = ({ project, progressPercentage }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const style = getProjectStyle(project);
    ref.current.style.setProperty("--left", style.left);
    ref.current.style.setProperty("--width", style.width);
    // Use CSS variable for progress so we avoid inline style attributes in JSX
    ref.current.style.setProperty("--progress", `${progressPercentage}%`);
  }, [project, progressPercentage]);

  return (
    <div className="relative h-10">
      <div ref={ref} className="timeline-track bg-gray-800 rounded">
        <div
          className="h-full bg-accent-blue rounded progress-fill"
          role="progressbar"
          aria-label={`Project ${project.title} progress: ${Math.round(progressPercentage)}%`}
        />
        <span className="sr-only">
          Project progress: {Math.round(progressPercentage)}%
        </span>
        <span className="absolute inset-0 flex items-center px-2 text-sm font-semibold text-white truncate">
          {project.title}
        </span>
      </div>
    </div>
  );
};

export default StrategicRoadmap;
