export type UserRole = 'owner' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface Company {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Gang {
  id: string;
  name: string;
  workerCount: number;
  status: 'active' | 'inactive';
}

export interface Entry {
  id: string;
  driverName: string;
  truckNumber: string;
  phoneNumber: string;
  cementQuantity: number; // in tons
  companyId: string;
  companyName: string;
  gangId: string;
  gangName: string;
  workerCount: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:45 AM"
  createdBy: string;
  shift: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface BusinessProfile {
  businessName: string;
  ownerName: string;
  contactNumber: string;
  businessAddress: string;
  logoUrl?: string;
}

export type ViewType =
  | 'dashboard'
  | 'record-entry'
  | 'all-entries'
  | 'entry-details'
  | 'edit-entry'
  | 'reports'
  | 'settings'
  | 'settings-companies'
  | 'settings-gangs'
  | 'settings-operators'
  | 'settings-profile'
  | 'account'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
