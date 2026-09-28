/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

import {
  BusinessProfile,
  Company,
  Entry,
  Gang,
  ToastMessage,
  User,
  ViewType,
} from '../types';

import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_COMPANIES,
  INITIAL_ENTRIES,
  INITIAL_GANGS,
  INITIAL_USERS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  companies: Company[];
  gangs: Gang[];
  entries: Entry[];
  businessProfile: BusinessProfile;
  activeView: ViewType;
  selectedEntryId: string | null;
  mobileMenuOpen: boolean;
  toasts: ToastMessage[];
  isOwner: boolean;
  isOperator: boolean;

  // Navigation
  navigate: (view: ViewType, entryId?: string) => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Auth
  login: (email: string, role?: 'owner' | 'operator') => boolean;
  logout: () => void;

  // Entries
  addEntry: (
    entryData: Omit<
      Entry,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'shift'
    >
  ) => Entry;
  updateEntry: (id: string, entryData: Partial<Entry>) => void;
  archiveEntry: (id: string) => void;
  getEntryById: (id: string) => Entry | undefined;

  // Companies
  addCompany: (name: string) => Company;
  updateCompany: (id: string, name: string) => void;
  toggleCompanyStatus: (id: string) => void;

  // Gangs
  addGang: (name: string, workerCount: number) => Gang;
  updateGang: (id: string, name: string, workerCount: number) => void;
  toggleGangStatus: (id: string) => void;

  // Operators
  addOperator: (
    name: string,
    email: string,
    phoneNumber?: string
  ) => User;
  updateOperator: (
    id: string,
    name: string,
    email: string,
    phoneNumber?: string
  ) => void;
  toggleOperatorStatus: (id: string) => void;
  deleteOperator: (id: string) => {
    success: boolean;
    message?: string;
  };
  operatorHasEntries: (operatorName: string) => boolean;

  // Profile
  updateBusinessProfile: (profile: BusinessProfile) => void;
  updateOwnerAccount: (
    name: string,
    email: string,
    phoneNumber: string
  ) => Promise<void>;

  registerOwner: (data: {
    businessName: string;
    ownerName: string;
    email: string;
    phoneNumber: string;
  }) => Promise<void>;

  // Toasts
  showToast: (
    message: string,
    type?: 'success' | 'info' | 'error'
  ) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Application starts unauthenticated.
  // The first screen must be the Login page.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [companies, setCompanies] =
    useState<Company[]>(INITIAL_COMPANIES);
  const [gangs, setGangs] = useState<Gang[]>(INITIAL_GANGS);
  const [entries, setEntries] =
    useState<Entry[]>(INITIAL_ENTRIES);
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);

  // Application starts on Login instead of directly opening Dashboard.
  const [activeView, setActiveView] =
    useState<ViewType>('login');

  const [selectedEntryId, setSelectedEntryId] =
    useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState<boolean>(false);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  const isOwner = currentUser?.role === 'owner';
  const isOperator = currentUser?.role === 'operator';

  // Toast handler
  const showToast = (
    message: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = Math.random()
      .toString(36)
      .substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  // Safe navigation with role permissions
  const navigate = (
    view: ViewType,
    entryId?: string
  ) => {
    if (entryId !== undefined) {
      setSelectedEntryId(entryId);
    }

    // Operator restrictions check
    if (isOperator) {
      const restrictedViews: ViewType[] = [
        'reports',
        'settings',
        'settings-companies',
        'settings-gangs',
        'settings-operators',
        'settings-profile',
        'edit-entry',
      ];

      if (restrictedViews.includes(view)) {
        showToast(
          'Access restricted to Owner account',
          'error'
        );
        return;
      }
    }

    setActiveView(view);
    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Auth actions
  const login = (
    email: string,
    requestedRole?: 'owner' | 'operator'
  ): boolean => {
    const trimmed = email.trim().toLowerCase();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (requestedRole &&
          u.role === requestedRole)
    );

    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');

      showToast(
        `Welcome back, ${user.name}`
      );

      return true;
    }

    // Fallback if typed demo email
    if (trimmed.includes('operator')) {
      const op =
        users.find(
          (u) => u.role === 'operator'
        ) || users[1];

      setCurrentUser(op);
      setActiveView('dashboard');

      showToast(
        `Welcome back, ${op.name}`
      );

      return true;
    } else {
      const owner =
        users.find(
          (u) => u.role === 'owner'
        ) || users[0];

      setCurrentUser(owner);
      setActiveView('dashboard');

      showToast(
        `Welcome back, ${owner.name}`
      );

      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('login');

    showToast(
      'Logged out successfully'
    );
  };

  // Entry Management
  const addEntry = (
    entryData: Omit<
      Entry,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'shift'
    >
  ): Entry => {
    const now = new Date();
    const currentHour = now.getHours();

    const shift =
      currentHour >= 6 && currentHour < 14
        ? 'Morning Shift'
        : 'Evening Shift';

    // Auto-generate entry ID
    const entrySeq = entries.length + 129;
    const newId = `ENT-2026-0${entrySeq}`;

    // Format current time
    const timeFormatted =
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    const dateFormatted =
      now.toISOString().split('T')[0];

    const newEntry: Entry = {
      ...entryData,
      id: newId,
      date: dateFormatted,
      time: timeFormatted,
      createdBy:
        currentUser?.name || 'Operator',
      shift,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setEntries((prev) => [
      newEntry,
      ...prev,
    ]);

    showToast(
      'Entry saved successfully.'
    );

    return newEntry;
  };

  const updateEntry = (
    id: string,
    entryData: Partial<Entry>
  ) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...entryData,
              updatedAt:
                new Date().toISOString(),
            }
          : e
      )
    );

    showToast(
      'Changes saved successfully.'
    );
  };

  const archiveEntry = (
    id: string
  ) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isArchived: true,
            }
          : e
      )
    );

    showToast(
      'Entry archived successfully.'
    );
  };

  const getEntryById = (
    id: string
  ) => {
    return entries.find(
      (e) => e.id === id
    );
  };

  // Companies Management
  const addCompany = (
    name: string
  ): Company => {
    const newCompany: Company = {
      id: `cmp-${Date.now()}`,
      name: name.trim(),
      status: 'active',
    };

    setCompanies((prev) => [
      ...prev,
      newCompany,
    ]);

    showToast(
      'Company added successfully.'
    );

    return newCompany;
  };

  const updateCompany = (
    id: string,
    name: string
  ) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: name.trim(),
            }
          : c
      )
    );

    // Update company name in entries as well
    setEntries((prev) =>
      prev.map((e) =>
        e.companyId === id
          ? {
              ...e,
              companyName:
                name.trim(),
            }
          : e
      )
    );

    showToast(
      'Changes saved successfully.'
    );
  };

  const toggleCompanyStatus = (
    id: string
  ) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus =
            c.status === 'active'
              ? 'inactive'
              : 'active';

          showToast(
            `Company marked as ${newStatus}.`
          );

          return {
            ...c,
            status: newStatus,
          };
        }

        return c;
      })
    );
  };

  // Gangs Management
  const addGang = (
    name: string,
    workerCount: number
  ): Gang => {
    const newGang: Gang = {
      id: `gng-${Date.now()}`,
      name: name.trim(),
      workerCount,
      status: 'active',
    };

    setGangs((prev) => [
      ...prev,
      newGang,
    ]);

    showToast(
      'Gang added successfully.'
    );

    return newGang;
  };

  const updateGang = (
    id: string,
    name: string,
    workerCount: number
  ) => {
    setGangs((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              name: name.trim(),
              workerCount,
            }
          : g
      )
    );

    showToast(
      'Gang updated successfully.'
    );
  };

  const toggleGangStatus = (
    id: string
  ) => {
    setGangs((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newStatus =
            g.status === 'active'
              ? 'inactive'
              : 'active';

          showToast(
            `Gang marked as ${newStatus}.`
          );

          return {
            ...g,
            status: newStatus,
          };
        }

        return g;
      })
    );
  };

  // Operators Management
  const operatorHasEntries = (
    operatorName: string
  ): boolean => {
    return entries.some(
      (e) =>
        e.createdBy === operatorName
    );
  };

  const addOperator = (
    name: string,
    email: string,
    phoneNumber?: string
  ): User => {
    const newOp: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phoneNumber:
        phoneNumber?.trim(),
      role: 'operator',
      status: 'active',
    };

    setUsers((prev) => [
      ...prev,
      newOp,
    ]);

    showToast(
      'Operator added successfully.'
    );

    return newOp;
  };

  const updateOperator = (
    id: string,
    name: string,
    email: string,
    phoneNumber?: string
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              name: name.trim(),
              email: email.trim(),
              phoneNumber:
                phoneNumber?.trim(),
            }
          : u
      )
    );

    showToast(
      'Changes saved successfully.'
    );
  };

  const toggleOperatorStatus = (
    id: string
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus =
            u.status === 'active'
              ? 'inactive'
              : 'active';

          showToast(
            `Operator ${
              newStatus === 'inactive'
                ? 'deactivated'
                : 'activated'
            } successfully.`
          );

          return {
            ...u,
            status: newStatus,
          };
        }

        return u;
      })
    );
  };

  const deleteOperator = (
    id: string
  ): {
    success: boolean;
    message?: string;
  } => {
    const targetUser =
      users.find(
        (u) => u.id === id
      );

    if (!targetUser) {
      return {
        success: false,
        message:
          'Operator not found.',
      };
    }

    if (
      operatorHasEntries(
        targetUser.name
      )
    ) {
      // Historical entries exist: deactivate instead of delete
      toggleOperatorStatus(id);

      return {
        success: true,
        message:
          'Operator has existing entries; status changed to inactive.',
      };
    }

    setUsers((prev) =>
      prev.filter(
        (u) => u.id !== id
      )
    );

    showToast(
      'Operator deleted successfully.'
    );

    return {
      success: true,
    };
  };

  // Profile Management
  const updateBusinessProfile = (
    profile: BusinessProfile
  ) => {
    setBusinessProfile(profile);

    showToast(
      'Changes saved successfully.'
    );
  };

  const updateOwnerAccount = async (
    name: string,
    email: string,
    phoneNumber: string
  ) => {
    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    const trimmedPhone =
      phoneNumber.trim();

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: trimmedName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
      };

      setCurrentUser(updatedUser);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? updatedUser
            : u
        )
      );

      setBusinessProfile((prev) => ({
        ...prev,
        ownerName: trimmedName,
        contactNumber:
          trimmedPhone,
      }));
    }
  };

  const registerOwner = async (
    data: {
      businessName: string;
      ownerName: string;
      email: string;
      phoneNumber: string;
    }
  ) => {
    const newOwner: User = {
      id: `usr-${Date.now()}`,
      name: data.ownerName.trim(),
      email: data.email.trim(),
      phoneNumber:
        data.phoneNumber.trim(),
      role: 'owner',
      status: 'active',
    };

    setUsers((prev) => [
      newOwner,
      ...prev,
    ]);

    setCurrentUser(newOwner);

    setBusinessProfile({
      businessName:
        data.businessName.trim(),
      ownerName:
        data.ownerName.trim(),
      contactNumber:
        data.phoneNumber.trim(),
      businessAddress:
        'Industrial Zone, Plot 42, Pune, Maharashtra 411019',
    });

    setActiveView('dashboard');

    showToast(
      'Account created successfully.'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        companies,
        gangs,
        entries,
        businessProfile,
        activeView,
        selectedEntryId,
        mobileMenuOpen,
        toasts,
        isOwner,
        isOperator,
        navigate,
        setMobileMenuOpen,
        login,
        logout,
        addEntry,
        updateEntry,
        archiveEntry,
        getEntryById,
        addCompany,
        updateCompany,
        toggleCompanyStatus,
        addGang,
        updateGang,
        toggleGangStatus,
        addOperator,
        updateOperator,
        toggleOperatorStatus,
        deleteOperator,
        operatorHasEntries,
        updateBusinessProfile,
        updateOwnerAccount,
        registerOwner,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};