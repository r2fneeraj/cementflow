import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  Truck,
  BarChart3,
  Settings as SettingsIcon,
  UserCheck,
  X,
} from 'lucide-react';
import { ViewType } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeView,
    navigate,
    mobileMenuOpen,
    setMobileMenuOpen,
    isOwner,
  } = useApp();

  interface NavItem {
    label: string;
    view: ViewType;
    icon: React.ElementType;
  }

  const ownerNavItems: NavItem[] = [
    { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Record Entry', view: 'record-entry', icon: PlusCircle },
    { label: 'All Entries', view: 'all-entries', icon: Truck },
    { label: 'Reports', view: 'reports', icon: BarChart3 },
    { label: 'Settings', view: 'settings', icon: SettingsIcon },
  ];

  const operatorNavItems: NavItem[] = [
    { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Record Entry', view: 'record-entry', icon: PlusCircle },
    { label: 'All Entries', view: 'all-entries', icon: Truck },
    { label: 'Account', view: 'account', icon: UserCheck },
  ];

  const navItems = isOwner ? ownerNavItems : operatorNavItems;

  const isNavActive = (view: ViewType) => {
    if (activeView === view) return true;
    if (view === 'settings' && activeView.startsWith('settings-')) return true;
    if (view === 'all-entries' && (activeView === 'entry-details' || activeView === 'edit-entry')) return true;
    return false;
  };

  const handleNavClick = (view: ViewType) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
            CF
          </div>
          <div>
            <span className="font-semibold text-base text-slate-900 tracking-tight leading-none block">
              CementFlow
            </span>
            <span className="text-[11px] text-slate-500 font-normal leading-tight block">
              Operations, simplified.
            </span>
          </div>
        </div>

        {/* Mobile close button only in mobile drawer */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.view);
          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active ? 'text-blue-600' : 'text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info at the bottom - NO Logout here! */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => handleNavClick('account')}
          className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
          title="View Account"
        >
          <div className="text-sm font-semibold text-slate-900 truncate">
            {currentUser?.name || 'Vikram Singhania'}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {isOwner ? 'Business Owner' : 'Operator'}
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Only when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slideout panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
