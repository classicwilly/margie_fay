import { useEffect } from "react";
import type { FC, ReactNode } from "react";
import DemoPage from "./DemoPage";
import Workshop from "./components/Workshop";
import OriginStory from "./components/OriginStory";
import ContextSwitchRestoreModal from "./components/ContextSwitchRestoreModal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getModuleRoutes } from "./src/module_registry";
// Import the module index so module manifests register themselves with the ModuleManager
import "./src/modules/index";
import { initModules, startModules, stopModules } from "./src/module_registry";
import offlineQueue from "./src/services/offlineQueue";

import { AppStateProvider, useAppState } from "./src/contexts/AppStateContext";
import E2EDebugView from "./src/components/E2EDebugView";
import { OscilloscopeProvider } from "./src/contexts/OscilloscopeContext";

import { useNavigate } from "react-router-dom";

const NavButton: FC<{
  to: string;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}> = ({ to, className, children, ...rest }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={className}
      onClick={() => navigate(to)}
      {...rest}
    >
      {children}
    </button>
  );
};

const App: FC = () => {
  useEffect(() => {
    // Initialize modules on app start; starting is handled inside the Router
    (async () => {
      try {
        await initModules();
      } catch (err) {
        console.error("ModuleManager init error", err);
      }
    })();
    // Install offline queue auto-flush
    if (offlineQueue && typeof offlineQueue.installAutoFlush === "function") {
      offlineQueue.installAutoFlush();
    }
  }, []);
  const AppRouter: FC = () => {
    const { appState } = useAppState() as any;
    const moduleRoutes = getModuleRoutes(appState?.moduleStates);
    useEffect(() => {
      (async () => {
        try {
          await startModules(appState?.moduleStates);
        } catch (e) {
          console.error("startModules failed", e);
        }
      })();
      return () => {
        (async () => {
          try {
            await stopModules();
          } catch (e) {
            /* ignore */
          }
        })();
      };
    }, [appState?.moduleStates]);
    return (
      <BrowserRouter>
        <nav
          className="bg-white shadow p-2"
          role="navigation"
          aria-label="top nav"
        >
          <ul className="flex gap-4 list-none p-0 m-0" role="menubar">
            <li role="none">
              <NavButton
                to="/"
                className="font-medium text-green-700"
                data-workshop-testid="nav-workshop"
                data-testid="nav-workshop"
                role="menuitem"
              >
                Home
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/template-sample"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-template-sample"
                role="menuitem"
              >
                template-sample
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/grandpa-helper"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-grandpa-helper"
                role="menuitem"
              >
                grandpa-helper
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/housekeeping"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-housekeeping"
                role="menuitem"
              >
                housekeeping
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/system"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-system"
                data-testid="nav-system"
                role="menuitem"
              >
                System
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/weekly-review"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-weekly-review"
                role="menuitem"
              >
                Weekly Review
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/child-dashboard"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-child-dashboard"
                data-testid="nav-child-dashboard"
                role="menuitem"
              >
                Child Dashboard
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/bio-hacks"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-bio-hacks"
                data-testid="nav-bio-hacks"
                aria-label="💊 The Apothecary"
                role="menuitem"
              >
                Bio Hacks
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/critical-tasks"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-critical-tasks"
              >
                Critical Tasks
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/achievements"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-achievements"
              >
                Achievements
              </NavButton>
            </li>
            <li role="none">
              <NavButton
                to="/origin"
                className="text-gray-700 hover:underline"
                data-workshop-testid="nav-origin"
              >
                Origin
              </NavButton>
            </li>
          </ul>
        </nav>
        <Routes>
          {/* Keep a legacy demo route for quick preview, render Workshop on root as the new name */}
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/" element={<Workshop />} />
          <Route path="/origin" element={<OriginStory />} />
          {moduleRoutes.map((r) => {
            const Cmp = r.component as React.ComponentType<any>;
            return <Route key={r.id} path={r.path} element={<Cmp />} />;
          })}
        </Routes>
        {/* Global modals that are conditionally rendered via AppState */}
        <ContextSwitchRestoreModal />
      </BrowserRouter>
    );
  };

  return (
    <AppStateProvider>
      <OscilloscopeProvider>
        <AppRouter />
        {/* Always render E2E debug view (it returns null unless running with E2E flags) */}
        <E2EDebugView />
      </OscilloscopeProvider>
    </AppStateProvider>
  );
};

export default App;
