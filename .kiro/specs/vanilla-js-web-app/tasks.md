# Implementation Plan: Life Dashboard (Vanilla JS Web App)

## Overview

Build a single-page Life Dashboard as three files: `index.html`, `css/styles.css`, and `js/app.js`. Each module (Greeting, FocusTimer, TaskManager, QuickLinks) is implemented as an IIFE-style module inside `app.js`. All state is persisted via the browser's Local Storage API. No build step, no framework, no backend.

## Tasks

- [x] 1. Create project file structure and HTML skeleton
  - Create `index.html` with semantic sections for each module: greeting, focus timer, task manager, quick links
  - Link `css/styles.css` and `js/app.js` in the HTML
  - Add all required DOM elements: time/date/greeting display, timer display and controls, task form and list, links form and list
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 6.1_

- [x] 2. Implement Storage utility and GreetingModule
  - [x] 2.1 Implement `Storage` utility in `js/app.js`
    - Write `Storage.get(key)` wrapping `JSON.parse(localStorage.getItem(key))` with null fallback
    - Write `Storage.set(key, value)` wrapping `localStorage.setItem` with try/catch; log warning on failure
    - _Requirements: 5.1, 5.2, 7.2, 7.3_

  - [x] 2.2 Implement `GreetingModule` in `js/app.js`
    - Write `getGreeting(hour)` returning the correct string for ranges 5–11, 12–17, 18–21, 22–4
    - Write `formatTime(date)` returning zero-padded HH:MM (24-hour)
    - Write `formatDate(date)` returning human-readable date string (e.g. "Monday, July 14, 2025")
    - Write `init()` to render immediately and schedule `setInterval` every 60 seconds
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 2.3 Write property tests for GreetingModule
    - **Property 1: Greeting correctness for all hours** — for every hour in [0, 23], `getGreeting` returns the correct string
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
    - **Property 2: Time formatting correctness** — for any Date, `formatTime` returns a string matching `HH:MM`
    - **Validates: Requirements 1.1**

- [x] 3. Implement FocusTimer
  - [x] 3.1 Implement `FocusTimer` in `js/app.js`
    - Write `formatTime(seconds)` returning zero-padded MM:SS
    - Write `init()` setting `remaining = 1500`, rendering display, attaching start/stop/reset click handlers
    - Write `start()` as a no-op if already running; otherwise set interval ticking every 1000 ms, decrement `remaining`, re-render; auto-stop and show completion indicator when `remaining === 0`
    - Write `stop()` clearing the interval while preserving `remaining`
    - Write `reset()` clearing interval, setting `remaining = 1500`, re-rendering, clearing completion indicator
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 3.2 Write property tests for FocusTimer
    - **Property 3: Timer display formatting correctness** — for any integer in [0, 1500], `formatTime` returns a valid `MM:SS` string
    - **Validates: Requirements 2.5**
    - **Property 4: Timer reset always returns to initial state** — after any state, `reset()` sets remaining to 1500 and stops countdown
    - **Validates: Requirements 2.4**
    - **Property 5: Start is idempotent while running** — calling `start()` multiple times does not change the countdown rate
    - **Validates: Requirements 2.7**

- [x] 4. Checkpoint — verify greeting and timer work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement TaskManager
  - [x] 5.1 Implement `TaskManager` in `js/app.js`
    - Write `addTask(label)`: trim label, reject if empty/whitespace-only, create `{ id, label, completed: false }`, append, save, re-render
    - Write `editTask(id, newLabel)`: trim, reject if empty/whitespace-only (retain original), update matching task, save, re-render
    - Write `toggleTask(id)`: flip `completed`, save, re-render
    - Write `deleteTask(id)`: remove by id, save, re-render
    - Write `save()`: write tasks array to `localStorage` key `"tasks"` via `Storage.set`
    - Write `render()`: clear list DOM, re-render all tasks in insertion order; completed tasks get CSS class `"completed"`; each row has edit/complete/delete controls; edit control pre-fills input with current label
    - Write `init()`: load from storage (treat `null` as `[]`), render, attach submit handler on add form
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3_

  - [ ]* 5.2 Write property tests for TaskManager
    - **Property 6: Adding a valid task grows the list** — any non-empty label increases array length by 1, new task is last with trimmed label and `completed: false`
    - **Validates: Requirements 3.2, 3.4**
    - **Property 7: Whitespace-only labels are always rejected** — any whitespace-only string leaves tasks array unchanged
    - **Validates: Requirements 3.3, 4.3**
    - **Property 8: Edit with valid label updates the task** — only the target task's label changes; all other tasks and `completed` fields are unchanged
    - **Validates: Requirements 4.2**
    - **Property 9: Toggle completion is a round-trip** — calling `toggleTask` twice restores original `completed` value
    - **Validates: Requirements 4.4**
    - **Property 10: Deleting a task removes it from the list** — only the target task is removed; all others remain in original order
    - **Validates: Requirements 4.6**
    - **Property 11: Task storage round-trip** — after any sequence of operations, localStorage `"tasks"` equals in-memory array; `init()` restores identical state
    - **Validates: Requirements 5.1, 5.2**

- [x] 6. Implement QuickLinks
  - [x] 6.1 Implement `QuickLinks` in `js/app.js`
    - Write `addLink(label, url)`: trim both, reject if either is empty/whitespace-only, create `{ id, label, url }`, append, save, re-render
    - Write `deleteLink(id)`: remove by id, save, re-render
    - Write `save()`: write links array to `localStorage` key `"links"` via `Storage.set`
    - Write `render()`: clear links DOM, re-render all links in insertion order; each link is a button/anchor opening in new tab with `target="_blank" rel="noopener"`; each has a delete control
    - Write `init()`: load from storage (treat `null` as `[]`), render, attach submit handler on add form
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 6.2 Write property tests for QuickLinks
    - **Property 12: Adding a valid link grows the links list** — any non-empty label and URL increases array length by 1, new link is last
    - **Validates: Requirements 6.2, 6.5**
    - **Property 13: Link with empty label or URL is always rejected** — any empty/whitespace label or URL leaves links array unchanged
    - **Validates: Requirements 6.3**
    - **Property 14: Deleting a link removes it from the list** — only the target link is removed; all others remain in original order
    - **Validates: Requirements 7.1**
    - **Property 15: Link storage round-trip** — after any sequence of operations, localStorage `"links"` equals in-memory array; `init()` restores identical state
    - **Validates: Requirements 7.2, 7.3**

- [x] 7. Wire all modules together and add CSS styling
  - [x] 7.1 Wire modules in `js/app.js`
    - Add `DOMContentLoaded` listener that calls `GreetingModule.init()`, `FocusTimer.init()`, `TaskManager.init()`, `QuickLinks.init()` in order
    - _Requirements: 1.1, 2.1, 3.1, 6.1_

  - [x] 7.2 Write all styles in `css/styles.css`
    - Style the dashboard layout (grid or flexbox) to display all four modules on one screen
    - Style completed tasks with strikethrough (`.completed` class)
    - Style the timer completion indicator
    - Style link buttons and form controls
    - _Requirements: 2.6, 4.5_

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- NFR-1: no test framework setup is required; optional property tests can be run via a `test.html` file in the browser using fast-check from CDN
- All modules live in the single `js/app.js` file — do not create additional JS files
- All styles live in the single `css/styles.css` file — do not create additional CSS files
