import React from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DeadlinesPage from './pages/DeadlinesPage';
import HomePage from './pages/HomePage';
import InsightsPage from './pages/InsightsPage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import DeadlineDetailsModal from './components/DeadlineDetailsModal';
import AddDeadlineModal from './components/AddDeadlineModal';
import ShareDeadlineModal from './components/ShareDeadlineModal';
import AddFriendModal from './components/AddFriendModal';
import FriendProfileModal from './components/FriendProfileModal';
import { AppProvider, useApp } from './context/AppContext';

/**
 * MainLayout - Inner container consuming AppContext.
 * Coordinates tab views and global modals across the unified mobile/desktop shell.
 */
function MainLayout() {
  const {
    activeTab,
    setActiveTab,
    selectedDeadline,
    setSelectedDeadline,
    isAddDeadlineOpen,
    setIsAddDeadlineOpen,
    editingDeadline,
    setEditingDeadline,
    isShareModalOpen,
    setIsShareModalOpen,
    isAddFriendOpen,
    setIsAddFriendOpen,
    selectedFriend,
    setSelectedFriend,
  } = useApp();

  // Map 4 primary tabs + profile view
  const PAGE_MAP = {
    home:      <HomePage />,
    deadlines: <DeadlinesPage />,
    insights:  <InsightsPage />,
    friends:   <FriendsPage />,
    profile:   <ProfilePage />,
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        {/* Sticky top brand & notification header */}
        <Header />

        {/* Scrollable content area for active tab */}
        <main className="main-content" id="main-content">
          {PAGE_MAP[activeTab] || <HomePage />}
        </main>

        {/* Persistent bottom navigation (Home, Deadlines, Insights, Friends) */}
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />

        {/* Global Action Modals */}
        <DeadlineDetailsModal
          deadline={selectedDeadline}
          isOpen={Boolean(selectedDeadline)}
          onClose={() => setSelectedDeadline(null)}
        />

        <AddDeadlineModal
          isOpen={isAddDeadlineOpen}
          initialData={editingDeadline}
          onClose={() => {
            setIsAddDeadlineOpen(false);
            setEditingDeadline(null);
          }}
        />

        <ShareDeadlineModal
          deadline={selectedDeadline}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />

        <AddFriendModal
          isOpen={isAddFriendOpen}
          onClose={() => setIsAddFriendOpen(false)}
        />

        <FriendProfileModal
          friend={selectedFriend}
          isOpen={Boolean(selectedFriend)}
          onClose={() => setSelectedFriend(null)}
        />
      </div>
    </div>
  );
}

/**
 * AppContent - Controls authentication gate.
 * Renders LoginPage if demo session is logged out, otherwise MainLayout.
 */
function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
}

/**
 * App - Root application entry wrapped with AppProvider.
 */
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
