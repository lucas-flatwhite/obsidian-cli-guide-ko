# ⬡ Obsidian CLI — Korean Guide

[Korean](./README.md) / **English**

This is a Korean guide website based on the official Obsidian CLI documentation.  
It is structured so even first-time CLI users can understand and use it easily.

**🌐 Live site:** [https://lucas-flatwhite.github.io/obsidian-cli-guide-ko/](https://lucas-flatwhite.github.io/obsidian-cli-guide-ko/)  
**Source docs:** [https://help.obsidian.md/cli](https://help.obsidian.md/cli)

---

## 📌 Overview

Obsidian CLI is a command-line interface you can control directly from your terminal.  
Use scripting, automation, and external tool integrations to maximize your note workflow productivity.

- Script repetitive tasks and automate workflows
- Integrate with external tools (cron, shell scripts, CI/CD, etc.)
- Use developer tooling for plugin and theme development
- Navigate interactively with TUI (terminal UI)

---

## 🖥 Preview

| Section | Description |
|------|------|
| **Hero** | CLI introduction and basic example commands |
| **Installation** | Step-by-step guide for macOS / Windows / Linux |
| **Use Cases** | Everyday use / developer / automation scripts |
| **All Commands** | Category accordion + real-time search |
| **Keyboard Shortcuts** | Full list of TUI shortcuts |
| **Troubleshooting** | Platform-specific troubleshooting guide |

---

## 🌐 Deployment

Deployment runs automatically via GitHub Actions whenever you push to `main`.

| Item | Details |
|------|------|
| **URL** | https://lucas-flatwhite.github.io/obsidian-cli-guide-ko/ |
| **Method** | GitHub Actions (`.github/workflows/deploy.yml`) |
| **Trigger** | Auto-run on push to `main` branch |

---

## 🚀 Run Locally

You can run this as a static site without any build tools.

```bash
# Clone repository
git clone https://github.com/lucas-flatwhite/obsidian-cli-guide-ko.git
cd obsidian-cli-guide-ko

# Run local server with Python
python3 -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

---

## 📁 File Structure

```
obsidian-cli-guide-ko/
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions auto deployment
├── index.html           # Main page (Korean/English guide)
├── style.css            # Dark modern minimalist design system
├── app.js               # Interactions (tabs, search, copy, etc.)
├── LICENSE
├── README.md            # Korean README
└── README.en.md         # English README
```

---

## ✨ Key Features

- **Real-time command search** — filters matching commands instantly as you type
- **Copy buttons for code blocks** — one-click copy to clipboard
- **OS tab switching** — macOS / Windows / Linux installation tabs
- **Example tabs** — everyday / developer / automation scenario examples
- **Responsive layout** — supports both mobile and desktop
- **Scroll navigation** — auto-detects active section and highlights nav item

---

## 🛠 Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — pure static page without frameworks
- **CSS Custom Properties** — consistent design token system
- **IntersectionObserver API** — scroll-based navigation highlighting

---

## 📄 License

This project is distributed under the [MIT License](./LICENSE).  
Guide content is based on the [official Obsidian documentation](https://help.obsidian.md/cli).
