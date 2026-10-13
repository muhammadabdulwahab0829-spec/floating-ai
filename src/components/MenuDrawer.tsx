import React, { useState } from 'react';
import {
  X,
  User,
  Sliders,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  Trash2,
  Brain,
  Info,
  Check,
  Code2,
  Globe,
} from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  soundFxEnabled: boolean;
  onToggleSoundFx: () => void;
  onSwitchToFloat: () => void;
  onOpenTeachBrain: () => void;
  onOpenAndroidStudio?: () => void;
  onOpenGitHubModal?: () => void;
  onClearHistory: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  voiceEnabled,
  onToggleVoice,
  soundFxEnabled,
  onToggleSoundFx,
  onSwitchToFloat,
  onOpenTeachBrain,
  onOpenAndroidStudio,
  onOpenGitHubModal,
  onClearHistory,
}) => {
  const [editingName, setEditingName] = useState(userName);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    onUpdateUserName(editingName.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 border-r border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/20">
              K
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Kitty Assistant</h3>
              <p className="text-[11px] text-slate-400">Settings & Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Profile Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              User Profile
            </label>
            <form onSubmit={handleSaveName} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Your Name (e.g. Jay)"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white text-slate-800"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Update Name</span>
                )}
              </button>
            </form>
          </div>

          {/* Mode Switching */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Assistant Experience
            </label>
            <button
              onClick={() => {
                onSwitchToFloat();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/80 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Float on Laptop Screen</div>
                <div className="text-[10px] text-slate-500">Corner pet &amp; Always-on-Top PiP window</div>
              </div>
            </button>

            {onOpenAndroidStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAndroidStudio();
                }}
                className="w-full mt-2 flex items-center gap-3 p-3 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-2xl text-left transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Android Studio Link &amp; Code</div>
                  <div className="text-[10px] text-indigo-700">Direct float URL &amp; overlay service</div>
                </div>
              </button>
            )}

            {onOpenGitHubModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGitHubModal();
                }}
                className="w-full mt-2 flex items-center gap-3 p-3 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-2xl text-left transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">GitHub Pages &amp; Any Browser</div>
                  <div className="text-[10px] text-emerald-700">Zero 404 fix · Deploy link · Relative base</div>
                </div>
              </button>
            )}
          </div>

          {/* Voice & Speech Toggles */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Audio Preferences
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4 text-sky-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Voice Synthesis</div>
                    <div className="text-[10px] text-slate-500">Read responses out loud</div>
                  </div>
                </div>
                <button
                  onClick={onToggleVoice}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    voiceEnabled ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      voiceEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Sound FX</div>
                    <div className="text-[10px] text-slate-500">Siri chimes, purrs & chirps</div>
                  </div>
                </div>
                <button
                  onClick={onToggleSoundFx}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    soundFxEnabled ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      soundFxEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Teach Brain */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Intelligence Engine
            </label>
            <button
              onClick={() => {
                onClose();
                onOpenTeachBrain();
              }}
              className="w-full flex items-center gap-3 p-3 bg-sky-50/70 hover:bg-sky-100 border border-sky-100 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Custom Mini-Brain</div>
                <div className="text-[10px] text-sky-700">Teach custom Q&amp;A rules</div>
              </div>
            </button>
          </div>

          {/* Reset */}
          <div>
            <button
              onClick={() => {
                onClearHistory();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Conversation History</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Standalone offline Mini-Brain with lip-sync and audio synthesis.</span>
        </div>
      </div>
    </div>
  );
};
