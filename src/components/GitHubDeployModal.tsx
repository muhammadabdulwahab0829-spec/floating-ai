import React, { useState } from 'react';
import { X, Copy, Check, Globe, Github, Sparkles, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const gitCommands = `# 1. Push to your new GitHub repository:
git init
git add .
git commit -m "Deploy Kitty Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kitty-assistant.git
git push -u origin main

# 2. In GitHub Repo Settings -> Pages:
# Select "GitHub Actions" as the Source!
# It builds and publishes automatically with 0 errors!`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>GitHub Pages &amp; Any Browser Ready</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Zero 404
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Fix for the white screen &amp; 404 error — opens in any web browser!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Why the old repo showed 404 & how it is solved */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Why your new repository will open without any errors:</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-emerald-800/90 leading-relaxed">
              <li>
                <strong>Relative paths enabled (<code>base: './'</code>)</strong>: Assets load perfectly from sub-paths like <code>github.io/floating-ai/</code> instead of requesting the root domain.
              </li>
              <li>
                <strong>Favicon 404 Eliminated</strong>: Embedded inline SVG and duplicate root/public favicons prevent <code>floating-ai/favicon.ico</code> 404s.
              </li>
              <li>
                <strong>Automatic GitHub Actions workflow (<code>.github/workflows/deploy.yml</code>)</strong>: Automatically runs Vite build so your browser never gets uncompiled TypeScript or a blank white page.
              </li>
              <li>
                <strong>SPA 404 Handler (<code>404.html</code>)</strong>: Prevents white pages when refreshing sub-routes or direct links.
              </li>
              <li>
                <strong>Zero Gap Edge Docking</strong>: Kitty connects flush with your browser window border with no gap.
              </li>
            </ul>
          </div>

          {/* Direct Export from Google AI Studio */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center text-[11px] font-bold">★</span>
              <span>Method 1: Directly from Google AI Studio (Recommended - 1 Click)</span>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50/70 via-sky-50/60 to-purple-50/70 border border-indigo-200/80 rounded-2xl space-y-2.5 leading-relaxed text-indigo-950">
              <p className="font-semibold text-xs text-indigo-900">
                You do not need to download files or use terminal commands. You can export directly from Google AI Studio:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-indigo-900 text-[11px]">
                <li>
                  Look at the <strong>top-right corner</strong> of Google AI Studio (the header bar above this preview).
                </li>
                <li>
                  Click the <strong>GitHub</strong> icon or <strong>Export</strong> button (or three dots <code>...</code> &rarr; <strong>Export to GitHub</strong>).
                </li>
                <li>
                  Click <strong>Connect with GitHub</strong> (if prompted) and enter a new repository name like <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">kitty-assistant</code>.
                </li>
                <li>
                  Set visibility to <strong>Public</strong> (so GitHub Pages works for free).
                </li>
                <li>
                  Click <strong>Export / Push</strong>. Google AI Studio creates the fresh repo and uploads all files in seconds!
                </li>
              </ol>
            </div>
          </div>

          {/* Quick 2-Step GitHub Pages Instructions */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px]">1</span>
              <span>Method 2: Using Git Terminal (Alternative)</span>
            </div>
            <div className="relative bg-slate-950 text-slate-200 rounded-2xl p-3.5 font-mono text-[11px] leading-relaxed border border-slate-800">
              <button
                onClick={handleCopyCmd}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-sans font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied!' : 'Copy Commands'}</span>
              </button>
              <pre className="overflow-x-auto pr-24 whitespace-pre-wrap">{gitCommands}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px]">2</span>
              <span>Enable GitHub Actions in your repo settings (Only 1 Click)</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 leading-relaxed">
              <p>
                Once exported to GitHub, enable GitHub Pages:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                <li>Click <strong>Settings</strong> at the top of your GitHub repository.</li>
                <li>In the left sidebar, click <strong>Pages</strong>.</li>
                <li>Under <strong>Build and deployment &rarr; Source</strong>, choose <strong>GitHub Actions</strong>.</li>
                <li>The built-in workflow builds and deploys your app in ~30 seconds with <strong>zero errors</strong>!</li>
              </ol>
            </div>
          </div>

          {/* How to make repository public */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px]">!</span>
              <span>Important: Make your repository Public (Required for free GitHub Pages)</span>
            </div>
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2 leading-relaxed text-amber-950">
              <p className="font-semibold text-xs">
                If your repository is currently <strong>Private</strong>, GitHub Pages will not open or will give an error unless you have GitHub Pro. To make it <strong>Public</strong> in 10 seconds:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-amber-900 text-[11px]">
                <li>Open your repository on GitHub.</li>
                <li>Click <strong>Settings</strong> (the top menu bar, next to Insights).</li>
                <li>Stay on the <strong>General</strong> tab and scroll down to the bottom to <strong>Danger Zone</strong>.</li>
                <li>Find <strong>Change repository visibility</strong> and click <strong>Change visibility</strong>.</li>
                <li>Click <strong>Make public</strong> and confirm.</li>
              </ol>
            </div>
          </div>

          {/* Fix if page is blank or not opening */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[11px]">🛠</span>
              <span>Link Not Opening or Blank? (Fast 1-Minute Fix)</span>
            </div>
            <div className="p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-2xl space-y-2 leading-relaxed text-rose-950">
              <p className="font-semibold text-xs text-rose-900">
                If GitHub added a default <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800">static.yml</code> or <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800">jekyll-gh-pages.yml</code> file:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-rose-900 text-[11px]">
                <li>
                  Open your repository on GitHub and click into the folder <strong>.github/workflows</strong>.
                </li>
                <li>
                  Delete <strong>static.yml</strong> and <strong>jekyll-gh-pages.yml</strong> (click each file &rarr; click trash can icon &rarr; Commit changes). Keep ONLY <strong>deploy.yml</strong>.
                </li>
                <li>
                  Click the <strong>Actions</strong> tab at the top &rarr; select <strong>Deploy to GitHub Pages</strong> &rarr; click <strong>Run workflow</strong>.
                </li>
              </ol>
              <p className="text-[11px] text-rose-800 font-medium">
                Once the green checkmark appears (~40s), refresh your link and Kitty will load immediately!
              </p>
            </div>
          </div>

          {/* Current Direct URL */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-200/70 rounded-2xl flex items-center justify-between gap-3">
            <div className="truncate">
              <div className="font-semibold text-sky-900 text-[11px]">Direct Browser Link:</div>
              <div className="font-mono text-[11px] text-sky-700 truncate">{currentUrl}</div>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
          >
            Got it, Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};
