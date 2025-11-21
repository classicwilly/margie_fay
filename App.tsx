import React, { useState } from 'react';
import { WeeklyReview } from '@components/WeeklyReview';
import ContextSwitchingProtocol from '@components/ContextSwitchingProtocol';
import ExecutiveDysfunctionProtocol from '@components/ExecutiveDysfunctionProtocol';
import SensoryOverloadProtocol from '@components/SensoryOverloadProtocol';
import ClassicWillyProtocol from '@components/ClassicWillyProtocol';
import FoundationalProtocols from '@components/FoundationalProtocols';
import FamilyStructureModeProtocol from '@components/FamilyStructureModeProtocol';
import LifeMaintenanceProtocol from '@components/LifeMaintenanceProtocol';
import MorningTransitionProtocol from '@components/MorningTransitionProtocol';
import PersonalHygieneProtocol from '@components/PersonalHygieneProtocol';
import SoloExecutionModeProtocol from '@components/SoloExecutionModeProtocol';
import CommandCenterSetupSop from '@components/CommandCenterSetupSop';
import PixelFoldSetupSop from '@components/PixelFoldSetupSop';
import AccessibilitySafetyProtocol from '@components/AccessibilitySafetyProtocol';
import BubbleShieldProtocol from '@components/BubbleShieldProtocol';
import Manifesto from '@components/Manifesto';
import HeadphoneControllerIpi from '@components/HeadphoneControllerIpi';
import { CommandCenter } from '@components/CommandCenter';
import SopVault from '@components/SopVault';
import { useCurrentMode } from './hooks/useCurrentMode';
import { AppStateProvider, useAppState } from '@contexts/AppStateContext';
import { Header } from '@components/Header';
import { E2EGate } from '@components/E2EGate';
import { SopForm } from '@components/SopForm';
import SystemIntegrationGuide from '@components/SystemIntegrationGuide';
import { AllChecklists } from '@components/AllChecklists';
import CoParentingProtocol from '@components/CoParentingProtocol';
import KidsCorner from '@components/KidsCorner';
import SystemResetModal from '@components/SystemResetModal';
import WillowsCorner from '@components/WillowsCorner';
import BashsCorner from '@components/BashsCorner';
import ScrollToTopButton from '@components/ScrollToTopButton';
import { ContextSwitchRestoreModal } from '@components/ContextSwitchRestoreModal';

const AppContent: React.FC = () => {
  const { appState } = useAppState();
  const { view } = appState;
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const currentMode = useCurrentMode();

  const handleOpenResetModal = () => setResetModalOpen(true);
  const handleCloseResetModal = () => setResetModalOpen(false);

  const renderContent = () => {
    switch (view) {
      case 'command-center':
        return <CommandCenter currentMode={currentMode} />;
      case 'sop-vault':
        return <SopVault />;
      case 'weekly-review':
        return <WeeklyReview />;
      case 'kids-corner':
        return <KidsCorner />;
      case 'manifesto':
        return <Manifesto />;
      case 'context-switching':
        return <ContextSwitchingProtocol />;
      case 'executive-dysfunction':
        return <ExecutiveDysfunctionProtocol />;
      case 'sensory-overload':
        return <SensoryOverloadProtocol />;
      case 'classic-willy-protocol':
        return <ClassicWillyProtocol />;
      case 'foundational-protocols':
        return <FoundationalProtocols />;
      case 'family-structure-mode':
        return <FamilyStructureModeProtocol />;
      case 'life-maintenance-protocol':
        return <LifeMaintenanceProtocol />;
      case 'morning-transition-protocol':
        return <MorningTransitionProtocol />;
      case 'personal-hygiene-protocol':
        return <PersonalHygieneProtocol />;
      case 'bubble-shield-protocol':
        return <BubbleShieldProtocol />;
      case 'solo-execution-mode':
        return <SoloExecutionModeProtocol />;
      case 'command-center-setup':
        return <CommandCenterSetupSop />;
      case 'pixel-fold-setup':
        return <PixelFoldSetupSop />;
      case 'accessibility-safety':
        return <AccessibilitySafetyProtocol />;
      case 'headphone-controller-ipi':
        return <HeadphoneControllerIpi />;
      case 'create-sop':
        return <SopForm />;
      case 'system-integration':
        return <SystemIntegrationGuide />;
      case 'co-parenting-protocol':
        return <CoParentingProtocol />;
      case 'all-checklists':
        return <AllChecklists />;
      case 'willows-corner':
        return <WillowsCorner />;
      case 'bashs-corner':
        return <BashsCorner />;
      default:
        return <CommandCenter currentMode={currentMode} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background-dark text-text-light flex flex-col">
      <Header openResetModal={handleOpenResetModal} />
      <E2EGate />
      <div className="flex-1 flex">
        <main id="main-content" className="flex-grow w-full container mx-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
      <footer className="w-full py-6 px-4 md:px-8 bg-card-dark text-text-light text-opacity-80 text-center text-sm border-t border-gray-700 mt-auto no-print">
        <p>&copy; {new Date().getFullYear()} Wonky Sprout OS by classicwilly. Anti-BS Structure for Chaos.</p>
      </footer>
      <SystemResetModal isOpen={isResetModalOpen} onClose={handleCloseResetModal} />
      <ScrollToTopButton />
      {appState.isContextRestoreModalOpen && <ContextSwitchRestoreModal />}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
};

export default App;