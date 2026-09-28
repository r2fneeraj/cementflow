import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, KeyRound, CheckCircle2, X, Edit3 } from 'lucide-react';

export const AccountView: React.FC = () => {
  const { currentUser, isOwner, logout, showToast, updateOwnerAccount } = useApp();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Edit Mode states for Owner
  const displayName = currentUser?.name || (isOwner ? 'Vikram Singhania' : 'Ramesh Patil');
  const displayEmail = currentUser?.email || (isOwner ? 'owner@cementflow.demo' : 'operator@cementflow.demo');
  const displayPhone = currentUser?.phoneNumber || (isOwner ? '+91 98220 12345' : '+91 98221 54321');
  const displayRole = isOwner ? 'Owner' : 'Operator';

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editEmail, setEditEmail] = useState(displayEmail);
  const [editPhone, setEditPhone] = useState(displayPhone);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const handleStartEdit = () => {
    setEditName(displayName);
    setEditEmail(displayEmail);
    setEditPhone(displayPhone);
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!editName.trim()) {
      setEditError('Owner Name is required');
      return;
    }
    if (!editEmail.trim()) {
      setEditError('Email / Username is required');
      return;
    }
    if (!editPhone.trim()) {
      setEditError('Phone Number is required');
      return;
    }

    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await updateOwnerAccount(editName, editEmail, editPhone);
      showToast('Account details updated successfully.');
      setIsEditing(false);
    } catch {
      setEditError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!oldPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSuccess(true);
    showToast('Password changed successfully.');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPasswordSuccess(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your account credentials and authenticated session
        </p>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            User Information
          </h2>

          {/* Edit button (Only for Owner and when not in edit mode) */}
          {isOwner && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditing ? (
          /* Edit Mode Form */
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {editError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  disabled={isSaving}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email / Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editEmail}
                  disabled={isSaving}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  disabled={isSaving}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Role</span>
                <span className="font-semibold text-slate-900 mt-1 block py-1.5">
                  {displayRole}
                </span>
                <span className="text-[11px] text-slate-400">Role cannot be changed</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Account Status</span>
                <span className="inline-flex items-center text-xs font-semibold text-teal-700 mt-2">
                  Active
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleCancelEdit}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* Normal View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {isOwner ? 'Owner Name' : 'Operator Name'}
              </span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {displayName}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Email / Username</span>
              <span className="font-medium text-slate-800 mt-0.5 block">
                {displayEmail}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Phone Number</span>
              <span className="font-medium text-slate-800 tabular-nums mt-0.5 block">
                {displayPhone}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Role</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {displayRole}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Account Status</span>
              <span className="inline-flex items-center text-xs font-semibold text-teal-700 mt-1">
                Active
              </span>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Change Password trigger */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="text-sm font-medium text-slate-900">
                  Password updated successfully!
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                {passwordError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                    {passwordError}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
