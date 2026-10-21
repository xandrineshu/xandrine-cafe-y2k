<div align="center">

# 🧋 Xandrine's Y2K Café ‹𝟹
*A cozy, interactive retro desktop web application built with Node.js, Express, and pure Y2K nostalgia.*

</div>

---

## ✨ Features

- **Retro Desktop Environment**: Floating, draggable windows powered by custom modular JavaScript (`drag.js`) with dynamic `z-index` focusing.
- **Kuroo the Café Mascot**: An autonomous companion cat that roams your screen, takes naps (`💤`), reacts to clicks (`🐾`), and can be fed treats (`🐟`).
- **Smart Mascot Sync**: A dock toggle that controls Kuroo and his companion window simultaneously, complete with visibility guards to keep background loops muted when he's hidden.
- **Interactive Café Menu & Spawners**: Clickable cafe items that you can drag around the desktop and persist seamlessly via `localStorage`.
- **Aesthetic Error Pages**: Custom-styled 404 and 500 error pop-ups featuring a draggable warning window that hides a secret Easter egg underneath! 🤫✨
- **Cozy Guestbook**: Leave your signature and cute messages with automatic `@` handle formatting.

---

## 🗂️ Project Structure

```text
xandrine-cafe-y2k/
├── public/
│   ├── audio/              # Background ambient sounds & SFX
│   ├── css/                # Modular stylesheets (home.css, error.css)
│   └── images/             # UI assets & kuroo-animation/ GIFs
├── src/
│   └── views/              # EJS templates
│       ├── errors/         # Custom 404 & system error views
│       ├── partials/       # Reusable components (head, dock, etc.)
│       ├── home.ejs        # Main desktop interface
│       ├── about.ejs       # About page
│       ├── portfolio.ejs   # Portfolio showcase
│       └── guestbook.ejs   # Interactive visitor guestbook
├── server.js               # Express application backend & routes
└── package.json            # Project dependencies
