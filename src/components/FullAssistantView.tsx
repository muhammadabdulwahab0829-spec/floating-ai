import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Plus,
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Check,
  Copy,
  Tv,
  Eye,
  Minimize2,
  Globe,
} from 'lucide-react';
import { KittyCharacter } from './KittyCharacter';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'kitty';
  text: string;
  timestamp: string;
  senseCategory?: string;
  source?: 'gemini-vision' | 'gemini-ai' | 'sense-engine';
}

interface FullAssistantViewProps {
  userName: string;
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  activeTranscript: string;
  mood: 'happy' | 'curious' | 'speaking' | 'proud' | 'love' | 'sleepy' | 'eating';
  onSendMessage: (text: string) => void;
  onToggleMic: () => void;
  onReplayAudio: (text: string) => void;
  onOpenMenu: () => void;
  onOpenActions: () => void;
  onPetKitty: () => void;
  onSwitchToFloat: () => void;
  onOpenAndroidStudioModal?: () => void;
  onToggleLiveScreen?: () => void;
  isCapturingScreen?: boolean;
  isLiveWatching?: boolean;
  onToggleLiveWatching?: () => void;
  activeTimer: number | null;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenGitHubModal?: () => void;
}

export const FullAssistantView: React.FC<FullAssistantViewProps> = ({
  userName,
  messages,
  isListening,
  isSpeaking,
  activeTranscript,
  mood,
  onSendMessage,
  onToggleMic,
  onReplayAudio,
  onOpenMenu,
  onOpenActions,
  onPetKitty,
  onSwitchToFloat,
  onToggleLiveScreen,
  isCapturingScreen = false,
  isLiveWatching = false,
  onToggleLiveWatching,
  activeTimer,
  voiceEnabled,
  onToggleVoice,
  onOpenGitHubModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('15:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-white flex flex-col justify-between relative overflow-hidden select-none font-sans px-5 pb-3">
      {/* 1. TOP MOBILE STATUS BAR (Exact match to screenshot: 15:00 on left, Cellular + Battery on right) */}
      <div className="pt-3 px-1 flex items-center justify-between text-[#1E293B] text-[13px] font-semibold z-20">
        <span className="font-bold tracking-tight text-[#0F172A]">{currentTime}</span>
        <div className="flex items-center gap-2 text-[#0F172A]">
          {/* Android Cellular Signal Triangle */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3L2 21h20L12 3z" />
          </svg>
          {/* Android Battery Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M16 4h-2V2h-4v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
      </div>

      {/* 2. TOP ACTION ROW: Rounded Square Hamburger Menu Icon on Left, subtle quick float/vision tools on right */}
      <div className="pt-3 px-1 flex items-center justify-between z-20">
        {/* Exact Rounded Square Menu Button from Screenshot: light grey background #ECEEF1 */}
        <button
          onClick={onOpenMenu}
          className="w-12 h-12 rounded-2xl bg-[#EBEFF3] hover:bg-[#E2E8F0] active:scale-95 text-[#1E293B] flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
          title="Open Menu & Assistant Features"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-[#0F172A] stroke-[2.4]" />
        </button>

        {/* Floating/Screen controls with minimal pill appearance */}
        <div className="flex items-center gap-1.5">
          {onToggleLiveScreen && (
            <button
              onClick={onToggleLiveScreen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95 border ${
                isCapturingScreen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                  : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-slate-200/80 text-slate-600'
              }`}
              title={isCapturingScreen ? 'Click to stop live screen vision' : 'Share live screen with Kitty'}
            >
              {isCapturingScreen ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[11px]">Live Vision</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[11px] font-medium">See Screen</span>
                </>
              )}
            </button>
          )}

          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95"
              title="GitHub Pages & Any Web Browser Setup - Zero 404"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold">Web/GitHub</span>
            </button>
          )}

          <button
            onClick={onSwitchToFloat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-slate-700 border border-slate-200/80 rounded-full text-xs font-medium transition-all cursor-pointer active:scale-95"
            title="Float Kitty on live screen like Siri"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px] font-semibold">Float</span>
          </button>
        </div>
      </div>

      {/* 3. CENTER CONTENT: KITTY CHARACTER & CLEAN PROMINENT TYPOGRAPHY */}
      <div className="flex-1 flex flex-col justify-center items-start w-full my-auto py-2 z-10">
        {/* Animated Kitty Mascot (Centered horizontally) */}
        <div className="w-full flex flex-col items-center justify-center my-3 relative">
          <KittyCharacter
            isSpeaking={isSpeaking}
            isListening={isListening}
            mood={mood}
            size={messages.length > 0 ? 190 : 230}
            onPet={onPetKitty}
            showSpeechBubble={false}
          />

          {/* Listening Pulsing Status Tag */}
          {isListening && (
            <div className="absolute -bottom-2 px-3.5 py-1 bg-sky-600 text-white rounded-full text-[11px] font-semibold shadow-lg shadow-sky-500/20 flex items-center gap-1.5 animate-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Listening...</span>
            </div>
          )}
        </div>

        {/* Live speech transcription text preview */}
        {isListening && activeTranscript && (
          <div className="w-full max-w-sm mx-auto mb-2 px-3 py-1.5 bg-sky-50 text-sky-900 border border-sky-200/80 rounded-xl text-xs font-medium animate-in fade-in text-center">
            &ldquo;{activeTranscript}&rdquo;
          </div>
        )}

        {/* Exact Typography matching screenshot */}
        <div className="text-left w-full mt-4 space-y-1.5 px-1">
          <p className="text-[#64748B] text-[17px] font-normal leading-relaxed tracking-normal">
            Hi <strong className="font-semibold text-[#0F172A]">{userName}</strong>, I'm{' '}
            <strong className="font-semibold text-[#0284C7]">Kitty!</strong>
          </p>
          <h1 className="text-[34px] sm:text-[38px] font-black text-[#0F172A] tracking-tight leading-[1.12]">
            How can I help you today?
          </h1>
        </div>

        {/* Conversation Stream (When Messages Exist) */}
        {messages.length > 0 && (
          <div className="w-full mt-3 max-h-48 overflow-y-auto space-y-2 pr-1 py-1 text-left scrollbar-thin">
            {messages.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] p-3 rounded-2xl text-xs leading-relaxed transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#0F172A] text-white rounded-tr-xs'
                      : 'bg-[#F8FAFC] border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Direct Screen Share Prompt Button if requested */}
                  {msg.sender === 'kitty' && !isCapturingScreen && msg.text.includes('See Live Screen') && onToggleLiveScreen && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={onToggleLiveScreen}
                        className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Start Live Screen Share</span>
                      </button>
                    </div>
                  )}

                  {/* Kitty Action Bar */}
                  {msg.sender === 'kitty' && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-sky-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {msg.senseCategory || 'Instant Sense Brain (0s)'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onReplayAudio(msg.text)}
                          className="hover:text-sky-600 transition-colors p-0.5 cursor-pointer"
                          title="Speak answer out loud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Live Screen Vision Quick Suggestion Chips (When screen is sharing) */}
        {isCapturingScreen && (
          <div className="w-full mt-2 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
            <button
              onClick={() => onSendMessage('What am I doing on my screen right now?')}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-full font-medium whitespace-nowrap cursor-pointer transition-colors active:scale-95"
            >
              👁️ What am I doing?
            </button>
            <button
              onClick={() => onSendMessage('Look at my drawing and tell me what I am drawing!')}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-full font-medium whitespace-nowrap cursor-pointer transition-colors active:scale-95"
            >
              🎨 What am I drawing?
            </button>
            <button
              onClick={() => onSendMessage('What is this YouTube video about?')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-full font-medium whitespace-nowrap cursor-pointer transition-colors active:scale-95"
            >
              📺 What video is this?
            </button>
          </div>
        )}
      </div>

      {/* 4. BOTTOM FLOATING SEARCH PILL BAR & HOME INDICATOR (Exact replica of screenshot!) */}
      <div className="w-full z-20 pt-2 pb-1">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-full shadow-[0_4px_22px_rgba(0,0,0,0.07)] border border-slate-200/90 px-4 py-3 flex items-center gap-3 transition-all focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.12)] focus-within:border-sky-300"
        >
          {/* Plus icon button on left */}
          <button
            type="button"
            onClick={onOpenActions}
            className="text-[#94A3B8] hover:text-[#475569] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            title="Open Tools & Senses (+)"
            aria-label="Add options"
          >
            <Plus className="w-5 h-5 stroke-[2.4]" />
          </button>

          {/* Search Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isCapturingScreen ? "Ask about what's on screen..." : "Search"}
            className="flex-1 bg-transparent text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden font-normal"
          />

          {/* Microphone Icon Button on right (Or send button when text is typed) */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleMic}
              className={`text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isListening ? 'text-rose-500 animate-pulse' : ''
              }`}
              title={isListening ? 'Stop listening' : 'Speak to Kitty'}
              aria-label="Voice input"
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-rose-500 stroke-[2.2]" />
              ) : (
                <Mic className="w-5 h-5 stroke-[2.3]" />
              )}
            </button>
          )}
        </form>

        {/* Bottom home indicator pill bar (Exact dark pill centered underneath input) */}
        <div className="w-36 h-[4.5px] bg-[#334155] rounded-full mx-auto mt-4 mb-1" />
      </div>
    </div>
  );
};
