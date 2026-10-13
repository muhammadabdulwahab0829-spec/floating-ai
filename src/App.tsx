/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { FullAssistantView, ChatMessage } from './components/FullAssistantView';
import { LaptopFloatScreen } from './components/LaptopFloatScreen';
import { ActionSheet } from './components/ActionSheet';
import { MenuDrawer } from './components/MenuDrawer';
import { TeachBrainModal } from './components/TeachBrainModal';
import { AndroidStudioModal } from './components/AndroidStudioModal';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { senseBrain } from './services/senseBrain';
import { speechService } from './services/speech';
import { soundEngine } from './services/soundEngine';
import { screenVisionService } from './services/screenVision';

export default function App() {
  // View mode: 'full' (screenshot phone assistant) or 'float' (floating pet on laptop/screen)
  const [viewMode, setViewMode] = useState<'full' | 'float'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'float' || window.location.hash === '#float') {
        return 'float';
      }
    }
    return 'full';
  });

  // User Profile
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('kitty_username') || 'Jay';
  });

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('kitty_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Speech & character states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState('');
  const [mood, setMood] = useState<'happy' | 'curious' | 'speaking' | 'proud' | 'love' | 'sleepy' | 'eating'>('happy');

  // Audio preferences
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);

  // Active Timer state
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  // Pet happiness
  const [petHappiness, setPetHappiness] = useState<number>(() => {
    const saved = localStorage.getItem('kitty_pet_happiness');
    return saved ? parseInt(saved, 10) : 85;
  });

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isTeachBrainOpen, setIsTeachBrainOpen] = useState(false);
  const [isAndroidStudioOpen, setIsAndroidStudioOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);

  // Screen vision capture state
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);
  const [isLiveWatching, setIsLiveWatching] = useState(false);

  useEffect(() => {
    return screenVisionService.subscribe((state) => {
      setIsCapturingScreen(state.isStreaming);
      setIsLiveWatching(state.isLiveWatching);
    });
  }, []);

  // Sync username to brain
  useEffect(() => {
    senseBrain.setUserName(userName);
    localStorage.setItem('kitty_username', userName);
  }, [userName]);

  // Sync soundEngine setting
  useEffect(() => {
    soundEngine.enabled = soundFxEnabled;
  }, [soundFxEnabled]);

  // Save messages
  useEffect(() => {
    try {
      localStorage.setItem('kitty_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Save happiness
  useEffect(() => {
    localStorage.setItem('kitty_pet_happiness', petHappiness.toString());
  }, [petHappiness]);

  // Timer countdown loop
  useEffect(() => {
    if (activeTimer === null || activeTimer <= 0) return;
    const interval = setInterval(() => {
      setActiveTimer((prev) => {
        if (prev === null || prev <= 1) {
          // Timer finished!
          soundEngine.playAlarm();
          const timerMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'kitty',
            text: `⏰ BEEP BEEP! Your timer is done, ${userName}!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senseCategory: 'Timer Alert',
          };
          setMessages((msgs) => [...msgs, timerMsg]);
          if (voiceEnabled) {
            speechService.speak(`Beep beep! Your timer is done, ${userName}!`);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, userName, voiceEnabled]);

  // Handle pet interaction
  const handlePetKitty = () => {
    setMood('love');
    soundEngine.playPurr();
    setPetHappiness((prev) => Math.min(100, prev + 5));
    setTimeout(() => setMood('happy'), 1500);
  };

  // Handle feeding snacks
  const handleFeedSnack = (snack: string) => {
    setMood('eating');
    soundEngine.playMunch();
    setPetHappiness((prev) => Math.min(100, prev + 10));

    const feedMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'kitty',
      text: `Nom nom nom! That ${snack} was delicious! Kitty's energy is boosted! ✨🐾`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senseCategory: 'Pet Care',
    };
    setMessages((prev) => [...prev, feedMsg]);

    if (voiceEnabled) {
      speechService.speak(`Nom nom nom! That ${snack} was so delicious, ${userName}! Thank you!`);
    }

    setTimeout(() => {
      soundEngine.playPurr();
      setMood('love');
      setTimeout(() => setMood('happy'), 1500);
    }, 1200);
  };

  // Process user text / speech query
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMood('speaking');

    // Mini-Brain thinking
    const response = await senseBrain.think(text);

    // Apply sounds
    if (response.sound === 'chime') soundEngine.playDoneChime();
    else if (response.sound === 'purr') soundEngine.playPurr();
    else if (response.sound === 'meow') soundEngine.playMeow();
    else if (response.sound === 'munch') soundEngine.playMunch();

    // Check actions
    if (response.action === 'FLOAT_MODE') {
      setViewMode('float');
    } else if (response.action === 'FULL_MODE') {
      setViewMode('full');
    } else if (response.action === 'TIMER' && response.actionData?.seconds) {
      setActiveTimer(response.actionData.seconds);
    } else if (response.action === 'CLEAR_HISTORY') {
      setMessages([]);
      return;
    } else if (response.action === 'FEED') {
      setPetHappiness((prev) => Math.min(100, prev + 10));
    } else if (response.action === 'PURR') {
      setPetHappiness((prev) => Math.min(100, prev + 5));
    }

    if (response.mood) {
      setMood(response.mood);
    }

    // Add Kitty response
    const kittyMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'kitty',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senseCategory: response.action ? `${response.action} Sense` : 'Sense Brain',
      source: response.source,
    };

    setMessages((prev) => [...prev, kittyMsg]);

    // Voice synthesis with lip-sync callbacks
    if (voiceEnabled) {
      speechService.speak(response.text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setTimeout(() => setMood('happy'), 500);
        },
      });
    } else {
      setTimeout(() => setMood('happy'), 1200);
    }
  };

  // Toggle microphone voice recognition
  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setActiveTranscript('');
      return;
    }

    soundEngine.playWakeChime();
    setIsListening(true);
    setMood('curious');

    const started = speechService.listen(
      (transcript, isFinal) => {
        setActiveTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          setActiveTranscript('');
          handleSendMessage(transcript.trim());
        }
      },
      (error) => {
        setIsListening(false);
        setActiveTranscript('');
        // If microphone denied, tell user in assistant message
        const errMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'kitty',
          text: `I couldn't hear your microphone (${error}). You can type in the search bar anytime!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senseCategory: 'Audio Sense',
        };
        setMessages((prev) => [...prev, errMsg]);
      },
      () => {
        setIsListening(false);
        setActiveTranscript('');
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  // Replay speech out loud
  const handleReplayAudio = (text: string) => {
    soundEngine.playDoneChime();
    setMood('speaking');
    speechService.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setMood('happy');
      },
    });
  };

  // Toggle Live Screen Capture (YouTube, Drawing, Apps)
  const handleToggleLiveScreen = async () => {
    if (isCapturingScreen) {
      screenVisionService.stopScreenShare();
      setIsCapturingScreen(false);
    } else {
      soundEngine.playWakeChime();
      const stream = await screenVisionService.startScreenShare();
      if (stream) {
        setIsCapturingScreen(true);
        soundEngine.playDoneChime();
        setMood('proud');

        // Immediately inspect screen with Gemini and speak observation
        setTimeout(async () => {
          const observation = await screenVisionService.analyzeScreen(
            'Look at my screen and tell me what you see right now in 1 or 2 fun sentences!',
            userName
          );
          const streamMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'kitty',
            text: observation,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senseCategory: 'Screen Vision',
            source: 'gemini-vision',
          };
          setMessages((prev) => [...prev, streamMsg]);
          if (voiceEnabled) {
            speechService.speak(observation, {
              onStart: () => setIsSpeaking(true),
              onEnd: () => {
                setIsSpeaking(false);
                setMood('happy');
              },
            });
          }
        }, 1000);
      }
    }
  };

  const handleToggleLiveWatching = () => {
    if (isLiveWatching) {
      screenVisionService.stopLiveWatcher();
    } else {
      screenVisionService.startLiveWatcher(
        (observation) => {
          handleSendMessage(observation);
        },
        14000,
        userName
      );
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-slate-900 flex items-center justify-center font-sans antialiased">
      {viewMode === 'full' ? (
        <FullAssistantView
          userName={userName}
          messages={messages}
          isListening={isListening}
          isSpeaking={isSpeaking}
          activeTranscript={activeTranscript}
          mood={mood}
          onSendMessage={handleSendMessage}
          onToggleMic={handleToggleMic}
          onReplayAudio={handleReplayAudio}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenActions={() => setIsActionSheetOpen(true)}
          onPetKitty={handlePetKitty}
          onSwitchToFloat={() => setViewMode('float')}
          onOpenAndroidStudioModal={() => setIsAndroidStudioOpen(true)}
          onToggleLiveScreen={handleToggleLiveScreen}
          isCapturingScreen={isCapturingScreen}
          isLiveWatching={isLiveWatching}
          onToggleLiveWatching={handleToggleLiveWatching}
          activeTimer={activeTimer}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          onOpenGitHubModal={() => setIsGitHubOpen(true)}
        />
      ) : (
        <LaptopFloatScreen
          userName={userName}
          messages={messages}
          isListening={isListening}
          isSpeaking={isSpeaking}
          activeTranscript={activeTranscript}
          mood={mood}
          onSendMessage={handleSendMessage}
          onToggleMic={handleToggleMic}
          onReplayAudio={handleReplayAudio}
          onRestoreFullView={() => setViewMode('full')}
          onPetKitty={handlePetKitty}
          onFeedSnack={handleFeedSnack}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          petHappiness={petHappiness}
          onOpenAndroidStudioModal={() => setIsAndroidStudioOpen(true)}
          onOpenGitHubModal={() => setIsGitHubOpen(true)}
        />
      )}

      {/* Action & Senses Sheet */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        soundFxEnabled={soundFxEnabled}
        onToggleSoundFx={() => setSoundFxEnabled(!soundFxEnabled)}
        onSelectAction={handleSendMessage}
        onFeedSnack={handleFeedSnack}
        onSwitchToFloat={() => setViewMode('float')}
        onOpenTeachBrain={() => setIsTeachBrainOpen(true)}
        onOpenAndroidStudio={() => setIsAndroidStudioOpen(true)}
        onClearHistory={() => setMessages([])}
        petHappiness={petHappiness}
        userName={userName}
        onToggleLiveScreen={handleToggleLiveScreen}
        isCapturingScreen={isCapturingScreen}
      />

      {/* Settings / Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userName={userName}
        onUpdateUserName={setUserName}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        soundFxEnabled={soundFxEnabled}
        onToggleSoundFx={() => setSoundFxEnabled(!soundFxEnabled)}
        onSwitchToFloat={() => setViewMode('float')}
        onOpenTeachBrain={() => setIsTeachBrainOpen(true)}
        onOpenAndroidStudio={() => setIsAndroidStudioOpen(true)}
        onOpenGitHubModal={() => setIsGitHubOpen(true)}
        onClearHistory={() => setMessages([])}
      />

      {/* Teach Mini-Brain Customization Modal */}
      <TeachBrainModal
        isOpen={isTeachBrainOpen}
        onClose={() => setIsTeachBrainOpen(false)}
        onUpdated={() => {
          // brain updated
        }}
      />

      {/* Android Studio & Browser Link Modal */}
      <AndroidStudioModal
        isOpen={isAndroidStudioOpen}
        onClose={() => setIsAndroidStudioOpen(false)}
      />

      {/* GitHub Pages & Any Browser Deploy Modal */}
      <GitHubDeployModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
      />
    </main>
  );
}
