
# ⏱️ Stopwatch+

> **Track Time. Anywhere.**

A minimal floating stopwatch and timer for Chrome.

Stopwatch+ puts a small, distraction-free time tracker directly on the webpage you're using — perfect for coding, competitive programming, studying, debugging, or any task where you want to know where your time is going.

---

## ✨ Features

### ⏱️ Stopwatch

Start a stopwatch directly from the floating widget.

```text
┌──────────────────────────┐
│ ⠿  ■  00:23:17        ⋮ │
└──────────────────────────┘
````

Click the stop button to finish the session.

---

### ⌛ Timer

Choose **Timer** from the idle screen and set a countdown.

```text
Hours    Minutes    Seconds

[ 00 ]   [ 05 ]     [ 00 ]

        [ Start ]
```

The final 10 seconds enter a warning state with a sound notification.

---

### 🎛️ Simple Idle Screen

When nothing is running, Stopwatch+ gives you two simple choices:

```text
┌──────────────────────────┐
│        ⏱️  │  ⌛         │
└──────────────────────────┘
```

* **Stopwatch** → starts a fresh stopwatch
* **Timer** → opens timer setup

No unnecessary menus or screens.
![alt text](./media/image.png)
![alt text](./media/screenshot.png)
---
### 📝 Save Tracked Time

When you stop a session, you can save it with a title and optional notes.

```text
┌──────────────────────────┐
│ Save tracked time        │
│                          │
│ [ Title                ] │
│ [ Notes (optional)...  ] │
│                          │
│                  [Save]  │
└──────────────────────────┘
```

Example:

```text
Title:
Codeforces - Graph Problem

Notes:
Solved using DFS + visited array
```

---

### 📚 Daily History

View your tracked sessions from the three-dot menu.

Only the current day's history is kept.

At local midnight, the previous day's history is automatically removed.

---

### 📤 CSV Export

Export your daily history as a CSV file.

The exported data includes:

```text
Title
Notes
Duration
Mode
Created At
```

---

### 🖱️ Press-and-Hold Dragging

The widget can be placed anywhere on the webpage.

Press and hold a non-interactive part of the widget for about 180ms, then drag it.

```text
Press → Hold → Drag → Release
```

The position is saved and restored later.

Interactive elements such as buttons, menus, and form fields remain clickable.

The widget is also kept inside the visible viewport when the browser is resized.

---

### 🎨 Minimal Neumorphic UI

The floating widget uses a soft, tactile UI:

* Dark rounded bezel
* Subtle bevels
* Soft shadows
* Recessed display
* Raised controls
* Compact layout
* Minimal visual distraction

The widget is designed to feel like a small physical timer floating on your screen.

---

## 🎯 Why Stopwatch+?

When you're solving a programming problem, it's easy to lose track of time.

You start thinking:

> "I'll solve this in 30 minutes."

And suddenly...

> **2 hours later. 😭**

Opening another application just to run a timer is also unnecessary.

Stopwatch+ keeps the timer **where you're already working**.

For example:

```text
Codeforces
        ↓
Start Stopwatch+
        ↓
Solve problem
        ↓
Submit
        ↓
Stop
        ↓
Save session
```

Now you know exactly how much time you spent.

---

## 💻 Great For

### Competitive Programming

Use it while solving:

* Codeforces
* LeetCode
* AtCoder
* HackerRank
* CodeChef
* Other online judges

Example:

```text
Problem A → 08:21
Problem B → 17:43
Problem C → 42:18
Problem D → 01:13:05
```

This makes it easier to understand your actual problem-solving speed.

---

### 👨‍💻 Development

Track time spent:

* Debugging
* Implementing a feature
* Reading documentation
* Fixing a bug
* Learning a new technology

---

### 📖 Studying

Use the stopwatch while studying or use the timer when you want a fixed study session.

---

## 🛠️ Tech Stack

* JavaScript
* HTML
* CSS
* Chrome Extension Manifest V3
* Chrome Storage API
* Chrome Alarms API
* Chrome Downloads API
* Shadow DOM

No backend.

No database.

No external server.

---

## 🏗️ Architecture

```text
                    Chrome Tab
                        │
                        ▼
               ┌─────────────────┐
               │    content.js   │
               │                 │
               │ Floating Widget │
               └────────┬────────┘
                        │
                        │ Messages
                        ▼
               ┌─────────────────┐
               │  background.js  │
               │                 │
               │ Timer State     │
               │ Stopwatch State │
               │ History         │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ chrome.storage  │
               └─────────────────┘
```

### `content.js`

Responsible for:

* Floating widget
* UI rendering
* Stopwatch controls
* Timer controls
* Dragging
* History interface
* Session saving
* CSV export

### `background.js`

Responsible for:

* Timer state
* Stopwatch state
* Persistent storage
* Chrome alarms
* Timer completion
* Daily history cleanup
* Communication with content scripts

### `content.css`

Contains the widget styling.

The widget is rendered inside **Shadow DOM**, preventing most host-page CSS from interfering with Stopwatch+.

---

## 📁 Project Structure

```text
Stopwatch+/
│
├── manifest.json
├── background.js
├── content.js
├── content.css
├── README.md
│
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🚀 Installation

Stopwatch+ can currently be installed as an unpacked Chrome extension.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Stopwatch+
```

### 2. Open Chrome Extensions

Go to:

```text
chrome://extensions
```

### 3. Enable Developer Mode

Enable:

```text
Developer mode
```

### 4. Load the extension

Click:

```text
Load unpacked
```

Select the Stopwatch+ project directory.

### 5. Open a webpage

Open any HTTP/HTTPS webpage.

The floating Stopwatch+ widget will appear automatically.

---

## 🔒 Privacy

Stopwatch+ is designed to work locally.

There is:

* ❌ No account
* ❌ No backend
* ❌ No analytics
* ❌ No external server
* ❌ No cloud database

Timer state and history are stored locally using Chrome's extension storage.

---

## 🧠 Design Philosophy

Stopwatch+ follows one simple principle:

> **The timer should stay out of your way.**

It isn't trying to become another giant productivity dashboard.

No:

* complicated task management
* social features
* unnecessary notifications
* productivity scores
* distracting dashboards

Just a small timer that is available whenever you need it.

---

## 🗺️ Roadmap

The project is intentionally kept small.

Possible future improvements:

* [ ] Keyboard shortcuts
* [ ] Improved accessibility
* [ ] Better timer controls
* [ ] More export options
* [ ] Chrome Web Store release

Features that add unnecessary complexity will intentionally be avoided.

---

## 🤝 Contributing

Found a bug or have an idea?

Feel free to open an issue or submit a pull request.

Feedback from competitive programmers and developers is especially welcome.

---

## ⭐ Feedback

If you use Stopwatch+ while solving problems or working, I'd love to hear how you use it.

Especially if you use:

* Codeforces
* LeetCode
* AtCoder
* CodeChef
* GitHub
* Other coding platforms

---

## 📜 License

MIT License

```

**One small branding detail:** I'd keep the tagline right under the title:

> **Stopwatch+ — Track Time. Anywhere.**

That's strong enough for the GitHub README and also fits the icon/branding you've been building.
```
