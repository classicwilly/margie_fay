import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppState } from "@contexts/AppStateContext";

import { SOP_DATA } from "../constants.js";

export function useCommandPalette() {
  const { appState, dispatch } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  interface CommandPaletteResult {
    id: string;
    type: string;
    title: string;
    description: string;
    action: () => void;
  }
  const [results, setResults] = useState<CommandPaletteResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const closePalette = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const staticActions = useMemo<CommandPaletteResult[]>(
    () => [
      {
        id: "action-interrupt",
        type: "action",
        title: "I've been interrupted!",
        description: "Run the Context Switching Recovery Protocol.",
        action: () => {
          dispatch({ type: "SET_CONTEXT_CAPTURE_MODAL_OPEN", payload: true });
        },
      },
      {
        id: "action-new-task",
        type: "action",
        title: "Create New Task",
        description: "Add a new item to the Task Matrix.",
        action: () => {
          dispatch({ type: "SET_VIEW", payload: "operations-control" });
          setTimeout(() => {
            const taskMatrix = document.getElementById(
              "module-task-matrix-module",
            );
            if (taskMatrix) {
              taskMatrix.scrollIntoView({ behavior: "smooth" });
              (
                taskMatrix.querySelector("details") as HTMLDetailsElement
              ).setAttribute("open", "");
              (
                taskMatrix.querySelector(
                  'input[placeholder="New task title..."]',
                ) as HTMLInputElement
              )?.focus();
            }
          }, 100);
        },
      },
      {
        id: "action-new-sop",
        type: "action",
        title: "Create New SOP",
        description: "Define a new Standard Operating Procedure.",
        action: () => dispatch({ type: "SET_VIEW", payload: "create-sop" }),
      },
      {
        id: "action-toggle-mod-mode",
        type: "action",
        title: "Toggle Mod Mode",
        description: "Enable or disable customization mode.",
        action: () => dispatch({ type: "TOGGLE_MOD_MODE" }),
      },
      {
        id: "action-start-pomodoro",
        type: "action",
        title: "Start Pomodoro (Work)",
        description: "Begin a 25-minute work session.",
        action: () => {
          dispatch({ type: "POMODORO_SET_MODE", payload: "work" });
          dispatch({ type: "POMODORO_TOGGLE" });
          const pomodoro = document.getElementById(
            "module-pomodoro-timer-module",
          );
          if (pomodoro) {
            pomodoro.scrollIntoView({ behavior: "smooth" });
          }
        },
      },
    ],
    [dispatch],
  );

  const searchableViews = useMemo<CommandPaletteResult[]>(
    () => [
      {
        id: "view-workshop",
        type: "view",
        title: "Workshop",
        description: "View the high-level OS overview.",
        action: () => dispatch({ type: "SET_VIEW", payload: "workshop" }),
      },
      {
        id: "view-operations-dashboard",
        type: "view",
        title: "My Dashboard",
        description: "Go to your main dashboard.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "operations-control" }),
      },
      {
        id: "view-sop-vault",
        type: "view",
        title: "Flight Protocol Vault",
        description: "View all protocols.",
        action: () => dispatch({ type: "SET_VIEW", payload: "sop-vault" }),
      },
      {
        id: "view-daily-debrief",
        type: "view",
        title: "System Diagnostics",
        description: "Run the end-of-day shutdown and review protocol.",
        action: () => dispatch({ type: "SET_VIEW", payload: "daily-debrief" }),
      },
      {
        id: "view-weekly-review",
        type: "view",
        title: "Weekly Review",
        description: "Open the weekly review checklist.",
        action: () => {
          dispatch({ type: "SET_WEEKLY_REVIEW_MODE", payload: "checklist" });
          dispatch({ type: "SET_VIEW", payload: "weekly-review" });
        },
      },
      {
        id: "view-weekly-review-wizard",
        type: "view",
        title: "Weekly Review (Wizard)",
        description: "Open the Weekly Review wizard flow.",
        action: () => {
          dispatch({ type: "SET_WEEKLY_REVIEW_MODE", payload: "wizard" });
          dispatch({ type: "SET_VIEW", payload: "weekly-review" });
        },
      },
      {
        id: "view-quarterly-review",
        type: "view",
        title: "Quarterly Strategic Review",
        description: "Plan and review long-term objectives.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "quarterly-review" }),
      },
      {
        id: "view-event-horizon",
        type: "view",
        title: "Event Horizon Prep",
        description: "Prepare for a major upcoming event.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "event-horizon-prep" }),
      },
      {
        id: "view-strategic-roadmap",
        type: "view",
        title: "Strategic Roadmap",
        description: "View long-range project timelines.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "strategic-roadmap" }),
      },
      {
        id: "view-archive-log",
        type: "view",
        title: "Archive Log",
        description: "View completed projects and archived notes.",
        action: () => dispatch({ type: "SET_VIEW", payload: "archive-log" }),
      },
      {
        id: "view-game-master",
        type: "view",
        title: "Game Master Hub",
        description: "Manage kids' rewards and quests.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "game-master-dashboard" }),
      },
      {
        id: "view-system-insights",
        type: "view",
        title: "System Insights",
        description: "View analytics and AI correlations.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "system-insights" }),
      },
      {
        id: "view-all-checklists",
        type: "view",
        title: "All Checklists",
        description: "View a master list of all checklists.",
        action: () => dispatch({ type: "SET_VIEW", payload: "all-checklists" }),
      },
      {
        id: "view-neuro-onboarding",
        type: "view",
        title: "Neuro Onboarding",
        description: "Personalize experience via neurodivergent presets.",
        action: () =>
          dispatch({ type: "SET_VIEW", payload: "neuro-onboarding" }),
      },
      {
        id: "view-daily-report",
        type: "view",
        title: "Print Daily Report",
        description: "Generate a printable mission sheet for the day.",
        action: () => dispatch({ type: "SET_VIEW", payload: "daily-report" }),
      },
      {
        id: "view-wonky-toolkit",
        type: "view",
        title: "Wonky Toolkit",
        description: "Open the Wonky Toolkit",
        action: () => dispatch({ type: "SET_VIEW", payload: "wonky-toolkit" }),
      },
    ],
    [dispatch],
  );

  // Search logic
  useEffect(() => {
    if (!isOpen || !appState) {
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    // If empty search, show the static and view results
    if (!lowerSearch) {
      setResults([
        ...staticActions,
        ...searchableViews.map((v, i) => ({ ...v, id: `view-${i}` })),
      ]);
      setSelectedIndex(0);
      return;
    }

    // Otherwise, perform a basic search across sops and views only to keep logic simple
    const allSops = [...SOP_DATA, ...((appState.userSops as any[]) || [])];
    const sopResults = allSops
      .filter(
        (sop: any) =>
          sop.title.toLowerCase().includes(lowerSearch) ||
          sop.description.toLowerCase().includes(lowerSearch),
      )
      .map(
        (sop: any) =>
          ({
            id: `sop-${sop.id}`,
            type: "sop",
            title: sop.title,
            description: sop.description,
            action: () => {
              if (sop.viewId) {
                dispatch({ type: "SET_VIEW", payload: sop.viewId });
              } else if (sop.isPageView) {
                dispatch({ type: "SET_ACTIVE_USER_SOP_ID", payload: sop.id });
                dispatch({ type: "SET_VIEW", payload: "user-sop-view" });
              }
            },
          }) as CommandPaletteResult,
      );

    const actionResults = staticActions.filter((a) =>
      a.title.toLowerCase().includes(lowerSearch),
    );
    const viewResults = searchableViews
      .map((v, i) => ({ ...v, id: `view-${i}` }))
      .filter((v) => v.title.toLowerCase().includes(lowerSearch));

    setResults([...actionResults, ...viewResults, ...sopResults]);
    setSelectedIndex(0);
  }, [searchTerm, isOpen, appState, dispatch, staticActions, searchableViews]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) {
        return;
      }

      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          selectedResult.action();
          closePalette();
        }
      }
    },
    [isOpen, results, selectedIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onSelect = (result: CommandPaletteResult) => {
    result.action();
    closePalette();
  };

  return {
    commandPaletteProps: {
      isOpen,
      searchTerm,
      setSearchTerm,
      results,
      selectedIndex,
      onClose: closePalette,
      onSelect,
    },
  };
}
