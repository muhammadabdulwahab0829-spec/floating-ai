import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Battery,
  HelpCircle,
  Minimize2,
  Trash2,
  Fish,
  Coffee,
  Heart,
  Smile,
  Code2,
} from 'lucide-react';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  soundFxEnabled: boolean;
  onToggleSoundFx: () => void;
  onSelectAction: (query: string) => void;
  onFeedSnack: (snack: string) => void;
  onSwitchToFloat: () => void;
  onOpenTeachBrain: () => void;
  onOpenAndroidStudio?: () => void;
  onClearHistory: () => void;
  petHappiness: number;
  userName: string;
  onToggleLiveScreen?: () => void;
  isCapturingScreen?: boolean;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  voiceEnabled,
  onToggleVoice,
  soundFxEnabled,
  onToggleSoundFx,
  onSelectAction,
  onFeedSnack,
  onSwitchToFloat,
  onOpenTeachBrain,
  onOpenAndroidStudio,
  onClearHistory,
  petHappiness,
  onToggleLiveScreen,
  isCapturingScreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Kitty Assistant Tools & Senses</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Live Screen Vision Section */}
          {onToggleLiveScreen && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/70">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isCapturingScreen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span>Live Screen Vision (Gemini AI)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isCapturingScreen ? 'Currently watching your screen' : 'Kitty can see YouTube, drawings, and other apps'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onToggleLiveScreen();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                    isCapturingScreen
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {isCapturingScreen ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          )}
          {/* Pet Status & Feed Section */}
          <div className="bg-gradient-to-br from-sky-50 via-sky-50/50 to-indigo-50/40 p-4 rounded-2xl border border-sky-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Pet Happiness Meter
              </span>
              <span className="text-xs font-semibold text-sky-700">{petHappiness}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-sky-100 mb-3 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-rose-400 transition-all duration-500 rounded-full"
                style={{ width: `${petHappiness}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mb-2 font-medium">Feed Kitty a treat:</div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onFeedSnack('fish');
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 px-1 bg-white hover:bg-sky-100 rounded-xl border border-sky-100 text-xs text-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <Fish className="w-4 h-4 text-sky-500 mb-1" />
                <span>Fish</span>
              </button>
              <button
                onClick={() => {
                  onFeedSnack('milk');
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 px-1 bg-white hover:bg-sky-100 rounded-xl border border-sky-100 text-xs text-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <Coffee className="w-4 h-4 text-amber-500 mb-1" />
                <span>Milk</span>
              </button>
              <button
                onClick={() => {
                  onFeedSnack('donut');
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 px-1 bg-white hover:bg-sky-100 rounded-xl border border-sky-100 text-xs text-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <span className="text-base leading-none mb-1">🍩</span>
                <span>Donut</span>
              </button>
              <button
                onClick={() => {
                  onFeedSnack('berry');
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 px-1 bg-white hover:bg-sky-100 rounded-xl border border-sky-100 text-xs text-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <span className="text-base leading-none mb-1">🍓</span>
                <span>Berry</span>
              </button>
            </div>
          </div>

          {/* Assistant View Mode: Float Mode */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display &amp; Siri Float Mode</div>
            <button
              onClick={() => {
                onSwitchToFloat();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10 cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Float on Live Laptop Screen</div>
                  <div className="text-[11px] text-slate-300">Floats like Siri in corner with voice &amp; apps</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-sky-500 text-white rounded-lg font-semibold">Active</span>
            </button>

            {onOpenAndroidStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAndroidStudio();
                }}
                className="w-full mt-2 flex items-center justify-between p-3 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border border-indigo-200/80 rounded-2xl transition-colors cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Android Studio Overlay Code &amp; Link</div>
                    <div className="text-[11px] text-indigo-600">Float link in Android apps or laptop browsers</div>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Voice vs Written Mode Settings */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Voice & Speech Mode</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onToggleVoice}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                  voiceEnabled
                    ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <div className="text-left">
                  <div>Voice Mode</div>
                  <div className="text-[10px] font-normal text-slate-500">
                    {voiceEnabled ? 'Auto-speaks answers' : 'Written answers only'}
                  </div>
                </div>
              </button>

              <button
                onClick={onToggleSoundFx}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                  soundFxEnabled
                    ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Smile className="w-4 h-4 text-sky-600" />
                <div className="text-left">
                  <div>Sound FX</div>
                  <div className="text-[10px] font-normal text-slate-500">
                    {soundFxEnabled ? 'Chimes & Purrs on' : 'Muted'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Sense Triggers */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Instant Senses</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectAction('set a timer for 15 seconds');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium transition-colors text-left cursor-pointer"
              >
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>15s Timer</span>
              </button>

              <button
                onClick={() => {
                  onSelectAction('check battery status');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium transition-colors text-left cursor-pointer"
              >
                <Battery className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Battery Sense</span>
              </button>

              <button
                onClick={() => {
                  onSelectAction('tell me a funny joke');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium transition-colors text-left cursor-pointer"
              >
                <Smile className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tell a Joke</span>
              </button>

              <button
                onClick={() => {
                  onSelectAction('what can you do?');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium transition-colors text-left cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Capabilities</span>
              </button>
            </div>
          </div>

          {/* Mini-Brain Customization & Clear */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenTeachBrain();
              }}
              className="flex-1 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teach Mini-Brain</span>
            </button>

            <button
              onClick={() => {
                onClearHistory();
                onClose();
              }}
              className="py-2.5 px-3 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
