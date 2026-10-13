import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Maximize2,
  ExternalLink,
  Code2,
  Tv,
  StopCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  Fish,
  Share2,
  Info,
  X,
  Eye,
  Radio,
  Globe,
} from 'lucide-react';
import { KittyCharacter } from './KittyCharacter';
import { ChatMessage } from './FullAssistantView';
import { FloatingPetCard } from './FloatingPetCard';
import { soundEngine } from '../services/soundEngine';
import { screenVisionService } from '../services/screenVision';

interface LaptopFloatScreenProps {
  userName: string;
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  activeTranscript: string;
  mood: 'happy' | 'curious' | 'speaking' | 'proud' | 'love' | 'sleepy' | 'eating';
  onSendMessage: (text: string) => void;
  onToggleMic: () => void;
  onReplayAudio: (text: string) => void;
  onRestoreFullView: () => void;
  onPetKitty: () => void;
  onFeedSnack: (snack: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  petHappiness: number;
  onOpenAndroidStudioModal: () => void;
  onOpenGitHubModal?: () => void;
}

export const LaptopFloatScreen: React.FC<LaptopFloatScreenProps> = ({
  userName,
  messages,
  isListening,
  isSpeaking,
  activeTranscript,
  mood,
  onSendMessage,
  onToggleMic,
  onReplayAudio,
  onRestoreFullView,
  onPetKitty,
  onFeedSnack,
  voiceEnabled,
  onToggleVoice,
  petHappiness,
  onOpenAndroidStudioModal,
  onOpenGitHubModal,
}) => {
  // Floating position relative to laptop viewport (x: from right, y: from bottom)
  // Initialized to 0, 0 to eliminate any gap and combine Kitty flush with edge
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Floating dialog expanded/collapsed
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [inputText, setInputText] = useState('');

  // Corner Peek / Rotation style (tilted like screenshot, peeking from edge with 0 gap)
  const [peekCorner, setPeekCorner] = useState<'bottom-right' | 'bottom-left' | 'bottom' | 'none'>('bottom-right');
  const [customAngle, setCustomAngle] = useState<number>(-22); // -22deg matches user screenshot tilt!
  const [hideInEdge, setHideInEdge] = useState<boolean>(true);

  // Document Picture-in-Picture state (Real OS Floating Window over YouTube/other apps)
  const [pipContainer, setPipContainer] = useState<HTMLElement | null>(null);
  const pipWindowRef = useRef<any>(null);

  // Live Screen / YouTube Capture state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);
  const [isLiveWatching, setIsLiveWatching] = useState(false);

  useEffect(() => {
    return screenVisionService.subscribe((state) => {
      setIsCapturingScreen(state.isStreaming);
      setIsLiveWatching(state.isLiveWatching);
      if (videoRef.current && state.isStreaming) {
        const stream = screenVisionService.getStream();
        if (stream && videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
        }
      }
    });
  }, []);

  // Dragging Kitty around laptop screen
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: floatPos.x,
      posY: floatPos.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: floatPos.x,
      posY: floatPos.y,
    };
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = dragStartRef.current.mouseX - clientX;
      const deltaY = dragStartRef.current.mouseY - clientY;
      let nextX = Math.max(0, Math.min(window.innerWidth - 120, dragStartRef.current.posX + deltaX));
      let nextY = Math.max(0, Math.min(window.innerHeight - 150, dragStartRef.current.posY + deltaY));

      // Magnetic zero-gap edge snapping
      if (nextX < 45) nextX = 0;
      if (nextY < 45) nextY = 0;

      if (nextX === 0 && nextY === 0) {
        setPeekCorner('bottom-right');
        setCustomAngle(-22);
        setHideInEdge(true);
      } else if (nextY === 0 && nextX > 60 && nextX < window.innerWidth - 220) {
        setPeekCorner('bottom');
        setCustomAngle(0);
      } else if (nextX > window.innerWidth - 200 && nextY === 0) {
        setPeekCorner('bottom-left');
        setCustomAngle(22);
      } else if (nextX > 50 && nextY > 50 && peekCorner !== 'none') {
        setPeekCorner('none');
        setCustomAngle(0);
      }

      setFloatPos({ x: nextX, y: nextY });
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Launch True Document Picture-in-Picture window (Hovers over YouTube, Android Studio, all apps)
  const handleLaunchPiP = async () => {
    if ('documentPictureInPicture' in window) {
      try {
        if (pipWindowRef.current) {
          pipWindowRef.current.close();
          setPipContainer(null);
          pipWindowRef.current = null;
          return;
        }

        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 360,
          height: 490,
        });
        pipWindowRef.current = pipWindow;

        // Copy stylesheets into PiP window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
          } catch {
            if (styleSheet.href) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.type = styleSheet.type;
              link.media = styleSheet.media.toString();
              link.href = styleSheet.href;
              pipWindow.document.head.appendChild(link);
            }
          }
        });

        // Setup container in PiP document
        pipWindow.document.body.className = 'bg-white p-3 flex flex-col justify-end select-none font-sans overflow-hidden';
        setPipContainer(pipWindow.document.body);

        pipWindow.addEventListener('pagehide', () => {
          setPipContainer(null);
          pipWindowRef.current = null;
        });

        soundEngine.playDoneChime();
        return;
      } catch (err) {
        console.error('Document PiP error:', err);
      }
    }

    // Popup window fallback
    const floatUrl = `${window.location.origin}/?mode=float`;
    window.open(
      floatUrl,
      'KittyFloatPet',
      'width=360,height=480,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
  };

  // Live Screen Capture via screenVisionService
  const handleToggleLiveScreen = async () => {
    if (isCapturingScreen) {
      screenVisionService.stopScreenShare();
      return;
    }

    soundEngine.playWakeChime();
    const stream = await screenVisionService.startScreenShare();
    if (stream) {
      soundEngine.playDoneChime();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Ask Kitty to immediately observe and welcome
      setTimeout(() => {
        onSendMessage('Look at my screen and tell me what you see right now!');
      }, 1200);
    }
  };

  const handleToggleLiveWatcher = () => {
    if (isLiveWatching) {
      screenVisionService.stopLiveWatcher();
    } else {
      screenVisionService.startLiveWatcher(
        (observation) => {
          onSendMessage(observation);
        },
        14000,
        userName
      );
    }
  };

  const latestMessage = messages[messages.length - 1];

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-white font-sans text-slate-900 flex flex-col justify-between">
      {/* 1. PRISTINE ALL-WHITE BACKGROUND */}
      <div className="absolute inset-0 bg-radial from-white via-slate-50/70 to-slate-100/50 pointer-events-none" />

      {/* 2. TOP ALL-WHITE NAVIGATION BAR */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-sky-500/20">
            K
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-900">Kitty</span>
            <span className="text-xs text-sky-600 font-semibold ml-2">Floating Live Screen Vision</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* See Live Screen button */}
          <button
            onClick={handleToggleLiveScreen}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCapturingScreen
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80'
            }`}
            title="See your live YouTube or other app tabs directly with Kitty"
          >
            {isCapturingScreen ? (
              <>
                <StopCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Stop Screen View</span>
              </>
            ) : (
              <>
                <Tv className="w-3.5 h-3.5 text-emerald-600" />
                <span>See Live Screen</span>
              </>
            )}
          </button>

          {/* Always-on-Top Floating Window (PiP) */}
          <button
            onClick={handleLaunchPiP}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              pipContainer
                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Pop out Kitty into real OS window on laptop that stays on top of YouTube & other apps"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
            <span>{pipContainer ? 'Float Window Active' : 'Float Over Other Apps (PiP)'}</span>
          </button>

          {/* Edge Corner Dock & Hide Controls (0px gap seamlessly combined with screen edge) */}
          <button
            onClick={() => {
              if (peekCorner === 'bottom-right' && floatPos.x === 0 && floatPos.y === 0) {
                // If already docked, cycle to deep hide or free float
                if (!hideInEdge) {
                  setHideInEdge(true);
                } else {
                  setHideInEdge(false);
                  setPeekCorner('none');
                  setCustomAngle(0);
                  setFloatPos({ x: 50, y: 50 });
                }
              } else {
                // Snap to absolute edge with 0 gap and -22deg tilt
                setFloatPos({ x: 0, y: 0 });
                setPeekCorner('bottom-right');
                setCustomAngle(-22);
                setHideInEdge(false);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              peekCorner === 'bottom-right' && floatPos.x === 0 && floatPos.y === 0
                ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Dock Kitty right to the bottom-right corner with 0px gap (no margin)"
          >
            <span>🐱</span>
            <span>
              {peekCorner === 'bottom-right' && floatPos.x === 0 && floatPos.y === 0
                ? hideInEdge
                  ? 'Hiding in Edge (Bezel)'
                  : 'Docked to Edge (0 Gap)'
                : 'Dock Corner (0 Gap)'}
            </span>
          </button>

          {/* Submerge / Flush edge toggle */}
          {peekCorner === 'bottom-right' && floatPos.x === 0 && floatPos.y === 0 && (
            <button
              onClick={() => setHideInEdge(!hideInEdge)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                hideInEdge
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="Toggle between flush 0-gap edge and hiding deeper behind screen bezel"
            >
              <span>{hideInEdge ? '🐾 Peeking Bezel' : '📏 Flush 0-Gap'}</span>
            </button>
          )}

          {/* GitHub Pages & Browser Link Modal */}
          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="GitHub Pages & Web Browser Setup - Zero 404 Errors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">GitHub &amp; Any Browser</span>
            </button>
          )}

          {/* Android Studio link modal */}
          <button
            onClick={onOpenAndroidStudioModal}
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Get Android Studio code and direct link"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android Studio &amp; Link</span>
          </button>

          {/* Expand to Full Assistant Screen */}
          <button
            onClick={onRestoreFullView}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Assistant</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE / LIVE SCREEN STREAM CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        {isCapturingScreen ? (
          /* LIVE SCREEN / YOUTUBE STREAM DISPLAY */
          <div className="relative w-full max-w-5xl h-[70vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 flex flex-col">
            <div className="px-4 py-2.5 bg-slate-800 text-white text-xs flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">Live Screen Stream Active (YouTube / Drawing / Code)</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Live Watcher Toggle */}
                <button
                  onClick={handleToggleLiveWatcher}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLiveWatching
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle automatic continuous live commentary"
                >
                  <Radio className="w-3 h-3" />
                  <span>{isLiveWatching ? 'Live Watcher ON' : 'Auto Watcher'}</span>
                </button>

                <button
                  onClick={handleToggleLiveScreen}
                  className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Stream</span>
                </button>
              </div>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />

            {/* Quick Interactive Screen Vision Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 flex items-center gap-2 shadow-2xl z-20">
              <button
                onClick={() => onSendMessage('What am I doing on my screen right now?')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>What am I doing?</span>
              </button>
              <button
                onClick={() => onSendMessage('Look at my drawing and tell me what I am drawing!')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>🎨 What am I drawing?</span>
              </button>
              <button
                onClick={() => onSendMessage('What YouTube video or scene is on my screen?')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>📺 What video is this?</span>
              </button>
            </div>
          </div>
        ) : (
          /* CLEAN WHITE INSTRUCTIONS HERO */
          <div className="max-w-xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full text-xs font-semibold text-sky-700">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Float Mode Active · Floats Over Any Screen</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Kitty floats on your laptop &amp; sees your live screen!
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Use <strong>Float Over Other Apps (PiP)</strong> to pop Kitty out into an always-on-top window over YouTube, Android Studio, and drawing apps. Or click <strong>See Live Screen</strong> to let Kitty inspect what you're doing live!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleLaunchPiP}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Float Over Other Apps (PiP Window)</span>
              </button>

              <button
                onClick={handleToggleLiveScreen}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Tv className="w-4 h-4 text-emerald-600" />
                <span>See Live Screen (YouTube / Drawing)</span>
              </button>

              {onOpenGitHubModal && (
                <button
                  onClick={onOpenGitHubModal}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Globe className="w-4 h-4" />
                  <span>GitHub &amp; Any Browser Setup</span>
                </button>
              )}

              <button
                onClick={onOpenAndroidStudioModal}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Android Studio Overlay Code</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. RENDER EITHER INSIDE DOCUMENT PIP WINDOW OR IN-PAGE CORNER */}
      {pipContainer ? (
        createPortal(
          <FloatingPetCard
            userName={userName}
            latestMessage={latestMessage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            activeTranscript={activeTranscript}
            mood={mood}
            petHappiness={petHappiness}
            inputText={inputText}
            onInputChange={setInputText}
            onSubmit={handleSubmit}
            onToggleMic={onToggleMic}
            onReplayAudio={onReplayAudio}
            onPetKitty={onPetKitty}
            onFeedSnack={onFeedSnack}
            isDialogOpen={isDialogOpen}
            onToggleDialog={() => setIsDialogOpen(!isDialogOpen)}
            onExpand={onRestoreFullView}
            peekCorner={peekCorner}
            rotationAngle={customAngle}
            hideInEdge={hideInEdge}
          />,
          pipContainer
        )
      ) : (
        /* FLOATING DRAGGABLE KITTY MASCOT IN CORNER OF LAPTOP SCREEN */
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="fixed z-40 touch-none"
          style={{
            right: `${floatPos.x}px`,
            bottom: `${floatPos.y}px`,
          }}
        >
          <FloatingPetCard
            userName={userName}
            latestMessage={latestMessage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            activeTranscript={activeTranscript}
            mood={mood}
            petHappiness={petHappiness}
            inputText={inputText}
            onInputChange={setInputText}
            onSubmit={handleSubmit}
            onToggleMic={onToggleMic}
            onReplayAudio={onReplayAudio}
            onPetKitty={onPetKitty}
            onFeedSnack={onFeedSnack}
            isDialogOpen={isDialogOpen}
            onToggleDialog={() => setIsDialogOpen(!isDialogOpen)}
            onExpand={onRestoreFullView}
            peekCorner={peekCorner}
            rotationAngle={customAngle}
            hideInEdge={hideInEdge}
          />
        </div>
      )}
    </div>
  );
};
