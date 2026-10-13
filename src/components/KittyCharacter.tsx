import React, { useEffect, useState, useRef } from 'react';

export interface KittyCharacterProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  mood?: 'happy' | 'curious' | 'speaking' | 'proud' | 'love' | 'sleepy' | 'eating';
  size?: number; // default ~240px
  onPet?: () => void;
  className?: string;
  showShadow?: boolean;
  showSpeechBubble?: boolean;
  speechText?: string;
  peekCorner?: 'bottom-right' | 'bottom-left' | 'bottom' | 'none';
  rotationAngle?: number;
  flipHorizontal?: boolean;
  hideInEdge?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: string;
  opacity: number;
  scale: number;
}

export const KittyCharacter: React.FC<KittyCharacterProps> = ({
  isSpeaking = false,
  isListening = false,
  mood = 'happy',
  size = 240,
  onPet,
  className = '',
  showShadow = true,
  showSpeechBubble = false,
  speechText = '',
  peekCorner = 'none',
  rotationAngle,
  flipHorizontal = false,
  hideInEdge = false,
}) => {
  // Blinking cycle state
  const [isBlinking, setIsBlinking] = useState(false);
  // Lip-sync viseme index (0: closed, 1: small open, 2: wide open, 3: rounded 'O')
  const [mouthViseme, setMouthViseme] = useState(0);
  // Ear wiggle angle
  const [earWiggle, setEarWiggle] = useState(0);
  // Hover & pet feedback
  const [isPetted, setIsPetted] = useState(false);
  // Floating particles (hearts, stars, notes)
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  // Natural blink loop (every 3.5 to 6 seconds)
  useEffect(() => {
    let blinkTimeout: number;
    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 2800;
      blinkTimeout = window.setTimeout(() => {
        setIsBlinking(true);
        // Sometimes double blink
        const doubleBlink = Math.random() > 0.7;
        setTimeout(() => {
          setIsBlinking(false);
          if (doubleBlink) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleBlink();
              }, 120);
            }, 100);
          } else {
            scheduleBlink();
          }
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Lip sync animation loop when isSpeaking is active
  useEffect(() => {
    if (!isSpeaking) {
      setMouthViseme(0);
      return;
    }

    const interval = window.setInterval(() => {
      // cycle through mouth shapes randomly or rhythmically
      setMouthViseme((prev) => {
        const next = Math.floor(Math.random() * 4);
        return next === prev ? (next + 1) % 4 : next;
      });
      // gentle ear twitch when speaking
      if (Math.random() > 0.6) {
        setEarWiggle((Math.random() - 0.5) * 6);
        setTimeout(() => setEarWiggle(0), 120);
      }
    }, 120);

    return () => {
      clearInterval(interval);
      setMouthViseme(0);
    };
  }, [isSpeaking]);

  // Particle management
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - 1.8,
            opacity: p.opacity - 0.035,
            scale: p.scale + 0.015,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [particles]);

  const triggerHeart = (x = size / 2, y = size / 3, icon = '💖') => {
    const newP: Particle = {
      id: ++particleIdRef.current,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 20,
      icon,
      opacity: 1,
      scale: 0.8,
    };
    setParticles((prev) => [...prev.slice(-8), newP]);
  };

  const handlePet = (e: React.MouseEvent) => {
    setIsPetted(true);
    triggerHeart(size / 2, size / 3, mood === 'love' ? '💖' : '✨');
    setEarWiggle(8);
    setTimeout(() => setEarWiggle(-8), 120);
    setTimeout(() => setEarWiggle(0), 240);
    setTimeout(() => setIsPetted(false), 800);
    onPet?.();
  };

  // Determine current eye expression
  const isHappySquint = isPetted || mood === 'love' || mood === 'eating';
  const isWideCurious = isListening || mood === 'curious';

  // Corner peeking rotation:
  // In the user's screenshot, Kitty tilts from bottom-right corner (~ -22 degrees)
  let computedRotation = rotationAngle;
  if (computedRotation === undefined) {
    if (peekCorner === 'bottom-right') computedRotation = -22;
    else if (peekCorner === 'bottom-left') computedRotation = 22;
    else computedRotation = 0;
  }

  // Exact edge alignment to finish the gap completely:
  // Eliminates transparent margins from SVG viewBox (240x250 with cat body at x: 44..196, y: 52..220)
  // Shifts Kitty so she merges seamlessly flush with screen edge, or hides partially behind the edge
  let edgeShiftX = 0;
  let edgeShiftY = 0;
  if (peekCorner === 'bottom-right') {
    if (hideInEdge) {
      // Submerged slightly deeper behind bezel (cat hides in edge)
      edgeShiftX = size * 0.22;
      edgeShiftY = size * 1.15 * 0.16;
    } else {
      // Flush zero-gap right on edge
      edgeShiftX = size * 0.165;
      edgeShiftY = size * 1.15 * 0.10;
    }
  } else if (peekCorner === 'bottom-left') {
    edgeShiftX = hideInEdge ? -size * 0.22 : -size * 0.165;
    edgeShiftY = hideInEdge ? size * 1.15 * 0.16 : size * 1.15 * 0.10;
  } else if (peekCorner === 'bottom') {
    edgeShiftX = 0;
    edgeShiftY = hideInEdge ? size * 1.15 * 0.18 : size * 1.15 * 0.10;
  }

  const transformStyle = [
    (edgeShiftX || edgeShiftY) ? `translate(${edgeShiftX}px, ${edgeShiftY}px)` : '',
    computedRotation ? `rotate(${computedRotation}deg)` : '',
    flipHorizontal ? 'scaleX(-1)' : '',
    isListening ? 'scale(1.05)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer select-none group ${className}`}
      onClick={handlePet}
      style={{
        width: size,
        height: size * 1.15,
        transform: transformStyle || undefined,
        transformOrigin: peekCorner === 'bottom-right' ? 'bottom right' : peekCorner === 'bottom-left' ? 'bottom left' : 'bottom center',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      title="Click or pet Kitty!"
    >
      {/* Optional Siri-style Speech Bubble above Kitty */}
      {showSpeechBubble && speechText && (
        <div className="absolute -top-16 z-30 max-w-xs px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-sky-900/10 border border-sky-100 text-xs font-medium text-slate-800 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <p className="line-clamp-3 leading-relaxed">{speechText}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-sky-100 rotate-45" />
        </div>
      )}

      {/* Floating Particles overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-transform duration-75 text-base"
            style={{
              left: p.x,
              top: p.y,
              opacity: p.opacity,
              transform: `translate(-50%, -50%) scale(${p.scale})`,
            }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      {/* Floating/Breathing Wrapper */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${
          isSpeaking ? 'animate-[bounce_1.4s_infinite]' : 'animate-[pulse_4s_ease-in-out_infinite]'
        }`}
      >
        <svg
          viewBox="0 0 240 250"
          className="w-full h-full overflow-visible drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Aura Glow Filter */}
            <filter id="kitty-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Inner Body Glow / Rim Gradient */}
            <linearGradient id="auraGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#80d8ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#40c4ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0091ea" stopOpacity="0.3" />
            </linearGradient>

            {/* Vibrant Main Body Gradient matching screenshot */}
            <radialGradient id="bodyGradient" cx="45%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#29b6f6" />
              <stop offset="40%" stopColor="#0288d1" />
              <stop offset="85%" stopColor="#01579b" />
              <stop offset="100%" stopColor="#004680" />
            </radialGradient>

            {/* Specular Highlight on Head/Forehead */}
            <radialGradient id="headHighlight" cx="48%" cy="28%" r="45%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Base Glass Refraction Arc */}
            <linearGradient id="bottomRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#80d8ff" stopOpacity="0" />
              <stop offset="100%" stopColor="#b3e5fc" stopOpacity="0.65" />
            </linearGradient>

            {/* Ear Inner Depth Gradient */}
            <linearGradient id="earInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0277bd" />
              <stop offset="100%" stopColor="#014f86" />
            </linearGradient>

            {/* Blush Gradient */}
            <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4081" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#ff4081" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff4081" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. OUTER TRANSLUCENT AURA / GLASS RIM (Matching screenshot's cyan-blue outer border) */}
          <path
            d="M 68 52
               C 74 65, 82 82, 88 88
               C 100 84, 140 84, 152 88
               C 158 82, 166 65, 172 52
               C 180 78, 192 110, 196 132
               C 202 165, 198 198, 172 216
               C 148 230, 92 230, 68 216
               C 42 198, 38 165, 44 132
               C 48 110, 60 78, 68 52 Z"
            fill="url(#auraGradient)"
            stroke="#64d8cb"
            strokeWidth={isListening ? 7 : 5}
            strokeOpacity={isListening ? 0.9 : 0.65}
            className={`transition-all duration-300 ${isListening ? 'animate-pulse' : ''}`}
            filter="url(#kitty-glow)"
          />

          {/* 2. MAIN OPAQUE BODY WITH CAT EARS */}
          <g style={{ transformOrigin: '120px 140px', transform: `rotate(${earWiggle}deg)` }}>
            {/* The unified silhouette of ears + teardrop dome body */}
            <path
              d="M 74 64
                 C 79 74, 85 86, 92 90
                 C 102 87, 138 87, 148 90
                 C 155 86, 161 74, 166 64
                 C 172 86, 184 114, 187 134
                 C 192 162, 188 192, 165 208
                 C 144 220, 96 220, 75 208
                 C 52 192, 48 162, 53 134
                 C 56 114, 68 86, 74 64 Z"
              fill="url(#bodyGradient)"
              stroke="#80d8ff"
              strokeWidth="2.5"
              strokeOpacity="0.8"
            />

            {/* Inner Ear Depth Accents */}
            <path
              d="M 76 72 L 87 88 L 82 89 Z"
              fill="url(#earInner)"
              opacity="0.8"
            />
            <path
              d="M 164 72 L 153 88 L 158 89 Z"
              fill="url(#earInner)"
              opacity="0.8"
            />

            {/* 3. HEAD 3D SPECULAR HIGHLIGHT */}
            <ellipse
              cx="120"
              cy="115"
              rx="62"
              ry="45"
              fill="url(#headHighlight)"
            />

            {/* Bottom Translucent Jelly Rim Arc */}
            <path
              d="M 68 195 C 92 215, 148 215, 172 195 C 158 206, 82 206, 68 195 Z"
              fill="url(#bottomRim)"
            />

            {/* 4. BLUSHING CHEEKS (Matching screenshot's vibrant pink ovals) */}
            <ellipse
              cx="86"
              cy="162"
              rx={isPetted ? 16 : 13}
              ry={isPetted ? 9 : 7}
              fill="url(#blushGradient)"
              className="transition-all duration-200"
            />
            <ellipse
              cx="154"
              cy="162"
              rx={isPetted ? 16 : 13}
              ry={isPetted ? 9 : 7}
              fill="url(#blushGradient)"
              className="transition-all duration-200"
            />

            {/* 5. EYES (Animatable: Blink, Happy, Curious, Normal) */}
            {/* LEFT EYE */}
            <g
              style={{
                transformOrigin: '92px 148px',
                transform: isBlinking
                  ? 'scaleY(0.08)'
                  : isHappySquint
                  ? 'scaleY(0.2)'
                  : isWideCurious
                  ? 'scale(1.12)'
                  : 'scale(1)',
                transition: 'transform 0.12s ease-out',
              }}
            >
              {isHappySquint ? (
                // Happy curved anime eyes ^ ^
                <path
                  d="M 80 148 Q 92 136 104 148"
                  stroke="#081426"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Normal shiny anime eye with highlights (Exact match to screenshot)
                <>
                  {/* Eye Base (Dark deep pupil) */}
                  <ellipse cx="92" cy="148" rx="14" ry="17" fill="#091424" />
                  {/* Large Primary Specular Highlight (top-left) */}
                  <circle cx="87" cy="142" r="6.5" fill="#ffffff" />
                  {/* Secondary Highlight (bottom-right) */}
                  <circle cx="98" cy="155" r="3.2" fill="#ffffff" />
                  {/* Subtle Tiny Sparkle in Listening state */}
                  {isListening && <circle cx="96" cy="142" r="1.8" fill="#80d8ff" />}
                </>
              )}
            </g>

            {/* RIGHT EYE */}
            <g
              style={{
                transformOrigin: '148px 148px',
                transform: isBlinking
                  ? 'scaleY(0.08)'
                  : isHappySquint
                  ? 'scaleY(0.2)'
                  : isWideCurious
                  ? 'scale(1.12)'
                  : 'scale(1)',
                transition: 'transform 0.12s ease-out',
              }}
            >
              {isHappySquint ? (
                // Happy curved anime eyes ^ ^
                <path
                  d="M 136 148 Q 148 136 160 148"
                  stroke="#081426"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Normal shiny anime eye with highlights
                <>
                  {/* Eye Base */}
                  <ellipse cx="148" cy="148" rx="14" ry="17" fill="#091424" />
                  {/* Large Primary Highlight (top-left) */}
                  <circle cx="143" cy="142" r="6.5" fill="#ffffff" />
                  {/* Secondary Highlight (bottom-right) */}
                  <circle cx="154" cy="155" r="3.2" fill="#ffffff" />
                  {/* Subtle Tiny Sparkle in Listening state */}
                  {isListening && <circle cx="152" cy="142" r="1.8" fill="#80d8ff" />}
                </>
              )}
            </g>

            {/* 6. MOUTH (Animatable: Idle :3 cat mouth, talking mouth visemes, eating) */}
            <g className="transition-all duration-100">
              {isSpeaking ? (
                // Dynamically changing talking mouth shapes!
                mouthViseme === 1 ? (
                  // Slight open mouth
                  <ellipse cx="120" cy="162" rx="7" ry="5" fill="#091424" />
                ) : mouthViseme === 2 ? (
                  // Wide speaking mouth with cute tongue
                  <g>
                    <path
                      d="M 112 158 Q 120 172 128 158 Z"
                      fill="#091424"
                    />
                    <path
                      d="M 115 165 Q 120 169 125 165 Z"
                      fill="#ff4081"
                    />
                  </g>
                ) : mouthViseme === 3 ? (
                  // Rounded 'O' mouth
                  <ellipse cx="120" cy="162" rx="5" ry="7" fill="#091424" />
                ) : (
                  // Open smile
                  <path
                    d="M 113 159 Q 120 168 127 159"
                    stroke="#091424"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                )
              ) : isHappySquint ? (
                // Super cute open smiling laugh ^o^
                <path
                  d="M 113 158 Q 120 168 127 158 Z"
                  fill="#091424"
                />
              ) : (
                // Classic kawaii cat :3 mouth from screenshot: two tiny touching curves!
                <path
                  d="M 112 157 Q 116 161 120 158 Q 124 161 128 157"
                  stroke="#091424"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </g>

            {/* Cute Edge Peeking Paws (gripping screen edge when peeking) */}
            {peekCorner !== 'none' && (
              <g className="filter drop-shadow-xs">
                {/* Left Paw holding screen bezel */}
                <ellipse cx="94" cy="216" rx="13" ry="8" fill="#0288d1" stroke="#80d8ff" strokeWidth="2.5" />
                <circle cx="89" cy="217" r="2.2" fill="#e0f7fa" />
                <circle cx="94" cy="215" r="2.2" fill="#e0f7fa" />
                <circle cx="99" cy="217" r="2.2" fill="#e0f7fa" />

                {/* Right Paw holding screen bezel */}
                <ellipse cx="146" cy="216" rx="13" ry="8" fill="#0288d1" stroke="#80d8ff" strokeWidth="2.5" />
                <circle cx="141" cy="217" r="2.2" fill="#e0f7fa" />
                <circle cx="146" cy="215" r="2.2" fill="#e0f7fa" />
                <circle cx="151" cy="217" r="2.2" fill="#e0f7fa" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* 7. SOFT AMBIENT FLOOR SHADOW (Only visible in center mode; suppressed when combined with edge) */}
      {showShadow && peekCorner === 'none' && (
        <div
          className={`w-36 h-4 -mt-3 bg-slate-400/25 dark:bg-slate-900/40 rounded-full blur-xs transition-transform duration-300 ${
            isSpeaking ? 'scale-90 opacity-60' : 'scale-100 opacity-90'
          }`}
        />
      )}
    </div>
  );
};
