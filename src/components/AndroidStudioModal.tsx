import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Code2, ExternalLink, Sparkles } from 'lucide-react';

interface AndroidStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidStudioModal: React.FC<AndroidStudioModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/?mode=float` : '';

  const kotlinCode = `// Android Studio: Floating Window Service (FloatingPetService.kt)
// Allows Kitty to float on top of any Android screen as a live overlay widget!

package com.example.kittyassistant

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class FloatingPetService : Service() {
    private var windowManager: WindowManager? = null
    private var floatingView: View? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // Setup WindowManager LayoutParams for overlay
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            360, 480,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.END
            x = 24
            y = 24
        }

        // Create WebView to load the web link in float mode
        val webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            webViewClient = WebViewClient()
            loadUrl("${currentUrl}")
        }

        floatingView = webView
        windowManager?.addView(floatingView, params)
    }

    override fun onDestroy() {
        super.onDestroy()
        if (floatingView != null) windowManager?.removeView(floatingView)
    }
}
`;

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(kotlinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Android Studio &amp; Browser Live Link</h3>
              <p className="text-xs text-slate-500">
                Use your web link to float Kitty on laptop or build an Android overlay app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Live Web Link with ?mode=float */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Live Float Web Link
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Boots directly in Float Mode
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Open this link in any browser on your laptop or mobile to have Kitty float immediately:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Float Kitty on YouTube & Any Other Tab (1-Click Bookmarklet) */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                Float Kitty on YouTube &amp; Any Browser Tab
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded-full">
                Works on all websites!
              </span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Want Kitty to float over <strong>YouTube, Gmail, or other tabs</strong>? Drag this bookmark button to your browser bookmarks bar (or copy the code):
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`javascript:(function(){if(document.getElementById('kitty-float-frame')){document.getElementById('kitty-float-frame').remove();return;}var f=document.createElement('iframe');f.id='kitty-float-frame';f.src='${currentUrl}';f.style.cssText='position:fixed;bottom:20px;right:20px;width:380px;height:520px;border:none;z-index:9999999;background:transparent;border-radius:28px;box-shadow:0 20px 50px rgba(0,0,0,0.3);';document.body.appendChild(f);})();`}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Drag this button "🐱 Float Kitty on YouTube" directly to your browser Bookmarks Bar! Then open YouTube and click it anytime to float Kitty on YouTube!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-grab flex items-center gap-2"
                title="Drag to your Bookmarks Bar!"
              >
                <span>🐱 Drag me: Float Kitty on YouTube</span>
              </a>

              <button
                onClick={() => {
                  const code = `javascript:(function(){if(document.getElementById('kitty-float-frame')){document.getElementById('kitty-float-frame').remove();return;}var f=document.createElement('iframe');f.id='kitty-float-frame';f.src='${currentUrl}';f.style.cssText='position:fixed;bottom:20px;right:20px;width:380px;height:520px;border:none;z-index:9999999;background:transparent;border-radius:28px;box-shadow:0 20px 50px rgba(0,0,0,0.3);';document.body.appendChild(f);})();`;
                  navigator.clipboard.writeText(code);
                  alert('Bookmarklet code copied! Create a new bookmark and paste this in the URL field.');
                }}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Copy Bookmarklet Code
              </button>
            </div>
          </div>

          {/* Section 3: Android Studio Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                Android Studio Overlay Code (FloatingPetService.kt)
              </span>
              <button
                onClick={copyCode}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Kotlin Code'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste this service into your Android Studio project. It creates an overlay WindowManager view that floats this exact web link over all Android apps!
            </p>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
              {kotlinCode}
            </pre>
          </div>

          {/* Section 3: AndroidManifest.xml instruction */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-sky-900">AndroidManifest.xml Permissions needed:</div>
            <code className="block p-2 bg-white rounded-lg border border-sky-200 font-mono text-[11px] text-sky-800">
              &lt;uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/&gt;<br />
              &lt;uses-permission android:name="android.permission.INTERNET"/&gt;
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
