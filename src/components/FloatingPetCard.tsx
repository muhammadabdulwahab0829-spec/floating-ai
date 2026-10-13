import React from 'react';
import {
  Maximize2,
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  Heart,
  Fish,
} from 'lucide-react';
import { KittyCharacter } from './KittyCharacter';
import { ChatMessage } from './FullAssistantView';

interface FloatingPetCardProps {
  userName: string;
  latestMessage?: ChatMessage;
  isListening: boolean;
  isSpeaking: boolean;
  activeTranscript: string;
  mood: 'happy' | 'curious' | 'speaking' | 'proud' | 'love' | 'sleepy' | 'eating';
  petHappiness: number;
  inputText: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMic: () => void;
  onReplayAudio: (text: string) => void;
  onPetKitty: () => void;
  onFeedSnack: (snack: string) => void;
  onClose?: () => void;
  onExpand?: () => void;
  isDialogOpen: boolean;
  onToggleDialog: () => void;
  peekCorner?: 'bottom-right' | 'bottom-left' | 'bottom' | 'none';
  rotationAngle?: number;
  hideInEdge?: boolean;
}

export const FloatingPetCard: React.FC<FloatingPetCardProps> = ({
  userName,
  latestMessage,
  isListening,
  isSpeaking,
  activeTranscript,
  mood,
  petHappiness,
  inputText,
  onInputChange,
  onSubmit,
  onToggleMic,
  onReplayAudio,
  onPetKitty,
  onFeedSnack,
  onClose,
  onExpand,
  isDialogOpen,
  onToggleDialog,
  peekCorner = 'bottom-right',
  rotationAngle,
  hideInEdge = false,
}) => {
  return (
    <div className={`flex flex-col select-none font-sans text-slate-900 ${
      peekCorner === 'bottom-right' ? 'items-end' : peekCorner === 'bottom-left' ? 'items-start' : 'items-center'
    }`}>
      {/* SIRI-STYLE FLOATING RESPONSE BUBBLE & INPUT */}
      {isDialogOpen && (
        <div className={`mb-2 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 p-5 text-slate-900 animate-in fade-in zoom-in-95 duration-200 ${
          peekCorner === 'bottom-right' ? 'mr-3' : peekCorner === 'bottom-left' ? 'ml-3' : ''
        }`}>
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Kitty Floating Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              {onExpand && (
                <button
                  onClick={onExpand}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Expand to Full Assistant Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onToggleDialog}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Collapse Bubble"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live speech transcription or latest message */}
          {isListening && activeTranscript ? (
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200/80 text-xs text-sky-900 mb-3 animate-pulse">
              &ldquo;{activeTranscript}&rdquo;
            </div>
          ) : latestMessage ? (
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs mb-3 space-y-1.5 max-h-36 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {latestMessage.sender === 'user' ? 'You asked:' : 'Kitty replied:'}
              </div>
              <p className="leading-relaxed text-slate-800 whitespace-pre-wrap">
                {latestMessage.text}
              </p>
              {latestMessage.sender === 'kitty' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onReplayAudio(latestMessage.text)}
                    className="text-sky-600 hover:text-sky-700 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 mb-3">
              Hey {userName}! I'm floating right here over your screen. Tap mic or type anytime!
            </p>
          )}

          {/* Pet nurturing treats */}
          <div className="flex items-center justify-between text-xs mb-3 px-1">
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Happiness: {petHappiness}%
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFeedSnack('fish')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                title="Feed fish treat"
              >
                🐟 Fish
              </button>
              <button
                onClick={() => onFeedSnack('donut')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                title="Feed sweet donut"
              >
                🍩 Donut
              </button>
            </div>
          </div>

          {/* Bottom mini input row */}
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask or say anything..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-sky-500 transition-all"
            />
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleMic}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice recognition'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            )}
          </form>
        </div>
      )}

      {/* FLOATING DRAGGABLE KITTY MASCOT WITH SIRI GLOW HALO */}
      <div className={`relative group flex flex-col ${
        peekCorner === 'bottom-right' ? 'items-end' : peekCorner === 'bottom-left' ? 'items-start' : 'items-center'
      }`}>
        {/* Toggle bubble button if collapsed */}
        {!isDialogOpen && (
          <button
            onClick={onToggleDialog}
            className="absolute -top-8 px-3 py-1 bg-sky-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full shadow-lg hover:bg-sky-500 transition-all cursor-pointer flex items-center gap-1.5 animate-bounce"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            <span>Open Siri Kitty</span>
          </button>
        )}

        {/* Siri Iridescent Halo Glow Effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 -z-10 ${
            isListening
              ? 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-80 scale-125 animate-pulse'
              : isSpeaking
              ? 'bg-gradient-to-tr from-sky-400 via-teal-300 to-purple-500 opacity-70 scale-115 animate-pulse'
              : 'bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-blue-600/30 opacity-40 group-hover:opacity-75 scale-105'
          }`}
        />

        <div
          className="relative cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
          onClick={() => {
            onPetKitty();
            if (!isDialogOpen) onToggleDialog();
          }}
        >
          <KittyCharacter
            isSpeaking={isSpeaking}
            isListening={isListening}
            mood={mood}
            size={135}
            onPet={onPetKitty}
            showShadow={peekCorner === 'none'}
            peekCorner={peekCorner}
            rotationAngle={rotationAngle}
            hideInEdge={hideInEdge}
          />
        </div>
      </div>
    </div>
  );
};
