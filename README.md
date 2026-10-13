# 🐱 Kitty AI Voice & Desktop Pet Assistant

A smart, responsive voice pet assistant and floating screen companion. Kitty features real-time lip sync animation, an offline instant Sense Brain (zero-delay responses), live screen vision capture, and floatable desktop pet mode (Document Picture-in-Picture & magnetic edge-docking).

---

## 🌐 Deploy to GitHub Pages (1-Click & 0 Configuration)

This repository is **100% pre-configured for GitHub Pages**:
- ✅ **Automatic GitHub Actions Workflow**: Included in `.github/workflows/deploy.yml`.
- ✅ **No 404 Errors**: Vite `base: './'` relative asset paths and `public/404.html` SPA routing are pre-configured.
- ✅ **No White Blank Pages**: Production build bundles all TypeScript into standalone browser JavaScript.

### How to Publish:

#### Method A: Directly from Google AI Studio (Easiest - 1 Click!)
1. In the **top-right corner** of Google AI Studio (top header bar), click the **GitHub** icon or **Export** button.
2. Select **Export to GitHub**.
3. Authorize GitHub, enter your new repository name (e.g., `kitty-ai`), and set visibility to **Public**.
4. Click **Export / Push**. Google AI Studio will push the complete repository directly to your GitHub!

#### Method B: Using Terminal Git Commands
1. In your local terminal, initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Kitty Assistant"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
2. Make sure your repository is **Public** (Free GitHub Pages):
   - In your GitHub repo, click **Settings** (top bar).
   - Scroll down to the very bottom to **Danger Zone**.
   - Under **Change repository visibility**, click **Change visibility** → Choose **Make public** → Confirm.
   *(Note: On free GitHub accounts, Private repositories cannot use GitHub Pages without GitHub Pro).*

3. Enable GitHub Actions for Deployment:
   - In your GitHub repo, go to **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. That's it! GitHub Actions will automatically run the build and publish your web app.
5. Open the generated GitHub Pages link (`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`) in any browser (Chrome, Edge, Safari, Firefox, mobile or laptop).

### ⚠️ Troubleshooting: Link Blank or Not Opening?
If your GitHub Pages link is blank or fails to open:
1. GitHub might have created a template workflow named `static.yml` or `jekyll-gh-pages.yml` which deploys raw unbuilt source code.
2. Go to **`.github/workflows/`** in your GitHub repository.
3. If `static.yml` or `jekyll-gh-pages.yml` exists, **delete them** (leave only `deploy.yml`).
4. Click the **Actions** tab at the top of your GitHub repository → click **Deploy to GitHub Pages** → click **Run workflow**.
5. When it turns green (✔ in ~40s), refresh your link!

---

## 💻 Run Locally

To run Kitty locally on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

To test the production build locally:
```bash
npm run build
npm run preview
```

---

## ✨ Key Features

1. **Floating Desktop Pet (`?mode=float`)**:
   - Docks seamlessly into the screen corner with **0px gap**.
   - Real **OS-level Document Picture-in-Picture (PiP)**: Kitty floats always-on-top above YouTube, drawing tools, VS Code, and other applications.
   - Magnetic drag snapping to bottom, left, and right screen edges.
   - Paws grip the bezel when peeking into the screen.

2. **Instant Sense Brain (0-second wait)**:
   - Responds with natural language immediately without external API wait times.
   - Teach Kitty custom questions and answers in real-time.
   - Handles math, weather, unit conversions, jokes, timers, and greetings.

3. **Live Screen Vision**:
   - Kitty can inspect what you are doing live on your screen (YouTube videos, artwork/drawings, code, documents) and talk with you about it.

4. **Speech Recognition & Lip-Sync Voice**:
   - High-fidelity SVG Kitty mascot with dynamic mouth-movement lip sync while talking.
   - Expressive moods: happy, curious, speaking, proud, love (purring), and eating snacks.
