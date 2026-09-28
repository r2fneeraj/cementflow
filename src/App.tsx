/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './views/DashboardView';
import { RecordEntryView } from './views/RecordEntryView';
import { AllEntriesView } from './views/AllEntriesView';
import { EntryDetailsView } from './views/EntryDetailsView';
import { EditEntryView } from './views/EditEntryView';
import { ReportsView } from './views/ReportsView';
import { SettingsHubView } from './views/SettingsHubView';
import { CompaniesView } from './views/CompaniesView';
import { GangsView } from './views/GangsView';
import { OperatorsView } from './views/OperatorsView';
import { BusinessProfileView } from './views/BusinessProfileView';
import { AccountView } from './views/AccountView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ResetPasswordView } from './views/ResetPasswordView';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  // Standalone auth pages without sidebar/header layout
  if (activeView === 'login') {
    return <LoginView />;
  }
  if (activeView === 'register') {
    return <RegisterView />;
  }
  if (activeView === 'forgot-password') {
    return <ForgotPasswordView />;
  }
  if (activeView === 'reset-password') {
    return <ResetPasswordView />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'record-entry':
        return <RecordEntryView />;
      case 'all-entries':
        return <AllEntriesView />;
      case 'entry-details':
        return <EntryDetailsView />;
      case 'edit-entry':
        return <EditEntryView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsHubView />;
      case 'settings-companies':
        return <CompaniesView />;
      case 'settings-gangs':
        return <GangsView />;
      case 'settings-operators':
        return <OperatorsView />;
      case 'settings-profile':
        return <BusinessProfileView />;
      case 'account':
        return <AccountView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Fixed Left Sidebar on desktop / Drawer on mobile */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
