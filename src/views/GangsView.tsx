import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Edit3, X } from 'lucide-react';

export const GangsView: React.FC = () => {
  const { gangs, addGang, updateGang, toggleGangStatus, navigate, isOwner } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGangName, setNewGangName] = useState('');
  const [newGangCount, setNewGangCount] = useState('12');

  const [editingGangId, setEditingGangId] = useState<string | null>(null);
  const [editGangName, setEditGangName] = useState('');
  const [editGangCount, setEditGangCount] = useState('12');

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">Access restricted to Business Owner.</p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(newGangCount, 10);
    if (!newGangName.trim() || isNaN(count) || count <= 0) return;
    addGang(newGangName.trim(), count);
    setNewGangName('');
    setNewGangCount('12');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(editGangCount, 10);
    if (!editingGangId || !editGangName.trim() || isNaN(count) || count <= 0) return;
    updateGang(editingGangId, editGangName.trim(), count);
    setEditingGangId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gang</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Workforce Gangs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational unloading labor groups and worker headcounts
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {gangs.map((gang) => (
            <div
              key={gang.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{gang.name}</span>
                  <span className="text-xs font-semibold text-slate-600 tabular-nums">
                    · {gang.workerCount} workers
                  </span>
                </div>
                <span
                  className={`inline-block text-[11px] font-medium mt-0.5 ${
                    gang.status === 'active' ? 'text-teal-700' : 'text-slate-400'
                  }`}
                >
                  {gang.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingGangId(gang.id);
                    setEditGangName(gang.name);
                    setEditGangCount(gang.workerCount.toString());
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => toggleGangStatus(gang.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    gang.status === 'active'
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                  }`}
                >
                  {gang.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Gang Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Add Gang</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gang Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gang D"
                  value={newGangName}
                  onChange={(e) => setNewGangName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Worker Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={newGangCount}
                  onChange={(e) => setNewGangCount(e.target.value)}
                  className="w-full px-3 py-2 text-sm tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Gang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Gang Modal */}
      {editingGangId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Edit Gang</h3>
              <button
                onClick={() => setEditingGangId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gang Name
                </label>
                <input
                  type="text"
                  value={editGangName}
                  onChange={(e) => setEditGangName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Worker Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={editGangCount}
                  onChange={(e) => setEditGangCount(e.target.value)}
                  className="w-full px-3 py-2 text-sm tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGangId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
