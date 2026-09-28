import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const {
    currentUser,
    setMobileMenuOpen,
    activeView,
    login,
    isOwner,
  } = useApp();

  const getPageTitle = () => {
    if (title) return title;
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'record-entry':
        return 'Record Truck Entry';
      case 'all-entries':
        return 'All Entries';
      case 'entry-details':
        return 'Entry Details';
      case 'edit-entry':
        return 'Edit Entry';
      case 'reports':
        return 'Reports';
      case 'settings':
      case 'settings-companies':
      case 'settings-gangs':
      case 'settings-operators':
      case 'settings-profile':
        return 'Settings';
      case 'account':
        return 'Account';
      default:
        return 'CementFlow';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xs border-b border-slate-200">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Mobile Header: Left Hamburger, Center/Left Logo */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs tracking-tight">
              CF
            </div>
            <span className="font-semibold text-base text-slate-900 tracking-tight">
              CementFlow
            </span>
          </div>
        </div>

        {/* Desktop Header: Clean Page Title */}
        <div className="hidden md:flex items-center gap-4">
          <h1 className="text-base font-semibold text-slate-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side: Clean spacing, no profile icon on mobile or role switcher */}
        <div className="flex items-center gap-2"></div>
      </div>
    </header>
  );
};
