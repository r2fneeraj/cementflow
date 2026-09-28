import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Users2, Shield, UserCircle, Building } from 'lucide-react';
import { ViewType } from '../types';

export const SettingsHubView: React.FC = () => {
  const { navigate, isOwner } = useApp();

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          Access restricted. Settings are exclusively accessible to the Business Owner.
        </p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const options: {
    title: string;
    description: string;
    view: ViewType;
    icon: React.ElementType;
  }[] = [
    {
      title: 'Companies',
      description: 'Manage cement companies',
      view: 'settings-companies',
      icon: Building2,
    },
    {
      title: 'Gangs',
      description: 'Manage workforce gangs',
      view: 'settings-gangs',
      icon: Users2,
    },
    {
      title: 'Operators',
      description: 'Manage operators',
      view: 'settings-operators',
      icon: Shield,
    },
    {
      title: 'Business Profile',
      description: 'Manage business information',
      view: 'settings-profile',
      icon: Building,
    },
    {
      title: 'Account',
      description: 'Manage account and password',
      view: 'account',
      icon: UserCircle,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your business settings and accounts.
        </p>
      </div>

      <div className="space-y-2.5">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.title}
              onClick={() => navigate(option.view)}
              className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-all shadow-xs flex items-center gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                  {option.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
