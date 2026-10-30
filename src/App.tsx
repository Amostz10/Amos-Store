import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { MobileFrame } from './components/MobileFrame';
import { UserPortalLayout } from './components/user/UserPortalLayout';
import { AdminPortalLayout } from './components/admin/AdminPortalLayout';
import { AuthModal } from './components/AuthModal';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { DigitalIdModal } from './components/common/DigitalIdModal';
import { DocumentReviewModal } from './components/admin/DocumentReviewModal';

const MainAppContent: React.FC = () => {
  const { showSplash, dismissSplash, currentUser, portalView } = useApp();

  if (showSplash) {
    return <SplashScreen onComplete={dismissSplash} />;
  }

  return (
    <MobileFrame>
      {!currentUser ? (
        <AuthModal isOpen={true} />
      ) : portalView === 'admin' ? (
        <AdminPortalLayout />
      ) : (
        <UserPortalLayout />
      )}

      {/* Global Modals */}
      <DocumentViewerModal />
      <DigitalIdModal />
      <DocumentReviewModal />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
