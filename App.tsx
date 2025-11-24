import React, { useEffect } from "react";
import DemoPage from "./DemoPage";
import Workshop from "./components/Workshop";
import OriginStory from "./components/OriginStory";
import ContextSwitchRestoreModal from "./components/ContextSwitchRestoreModal";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { getModuleRoutes } from "./src/module_registry";
// Import the module index so module manifests register themselves with the ModuleManager
import "./src/modules/index";
import { initModules, startModules, stopModules } from "./src/module_registry";

import { AppStateProvider, useAppState } from "./src/contexts/AppStateContext";
import { OscilloscopeProvider } from "./src/contexts/OscilloscopeContext";

import { useNavigate } from "react-router-dom";

const NavButton: React.FC<{ to: string; className?: string; children: React.ReactNode; [key: string]: any }> = ({ to, className, children, ...rest }) => {
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

const App: React.FC = () => {
  useEffect(() => {
    // Initialize modules on app start; starting is handled inside the Router
    (async () => {
      try {
        await initModules();
      } catch (err) {
        console.error("ModuleManager init error", err);
      }
    })();
  }, []);
  const AppRouter: React.FC = () => {
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
          <nav className="bg-white shadow p-2" role="navigation" aria-label="top nav">
            <ul className="flex gap-4 list-none p-0 m-0">
              <li><NavButton to="/" className="font-medium text-green-700" data-workshop-testid="nav-workshop" data-testid="nav-workshop" role="menuitem">Home</NavButton></li>
              <li><NavButton to="/template-sample" className="text-gray-700 hover:underline" data-workshop-testid="nav-template-sample" role="menuitem">template-sample</NavButton></li>
              <li><NavButton to="/grandpa-helper" className="text-gray-700 hover:underline" data-workshop-testid="nav-grandpa-helper" role="menuitem">grandpa-helper</NavButton></li>
              <li><NavButton to="/housekeeping" className="text-gray-700 hover:underline" data-workshop-testid="nav-housekeeping" role="menuitem">housekeeping</NavButton></li>
              <li><NavButton to="/system" className="text-gray-700 hover:underline" data-workshop-testid="nav-system" data-testid="nav-system" role="menuitem">System</NavButton></li>
              <li><NavButton to="/weekly-review" className="text-gray-700 hover:underline" data-workshop-testid="nav-weekly-review" role="menuitem">Weekly Review</NavButton></li>
                <li><NavButton to="/child-dashboard" className="text-gray-700 hover:underline" data-workshop-testid="nav-child-dashboard" data-testid="nav-child-dashboard" role="menuitem">Child Dashboard</NavButton></li>
              <li><NavButton to="/bio-hacks" className="text-gray-700 hover:underline" data-workshop-testid="nav-bio-hacks" data-testid="nav-bio-hacks" aria-label="💊 The Apothecary" role="menuitem">Bio Hacks</NavButton></li>
              <li><NavButton to="/critical-tasks" className="text-gray-700 hover:underline" data-workshop-testid="nav-critical-tasks" role="menuitem">Critical Tasks</NavButton></li>
              <li><NavButton to="/achievements" className="text-gray-700 hover:underline" data-workshop-testid="nav-achievements" role="menuitem">Achievements</NavButton></li>
              <li><NavButton to="/origin" className="text-gray-700 hover:underline" data-workshop-testid="nav-origin" role="menuitem">Origin</NavButton></li>
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
      </OscilloscopeProvider>
    </AppStateProvider>
  );
};

export default App;
