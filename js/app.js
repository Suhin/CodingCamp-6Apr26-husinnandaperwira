// Life Dashboard — app.js
// Modules: GreetingModule, FocusTimer, TaskManager, QuickLinks


// ---------------------------------------------------------------------------
// Storage Utility
// ---------------------------------------------------------------------------
const Storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage.set failed for key "' + key + '":', err);
    }
  },
};

// ---------------------------------------------------------------------------
// GreetingModule
// ---------------------------------------------------------------------------
const GreetingModule = window.GreetingModule = {
  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good morning';
    if (hour >= 12 && hour <= 17) return 'Good afternoon';
    if (hour >= 18 && hour <= 21) return 'Good evening';
    return 'Good night';
  },

  formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
  },

  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  _render() {
    const now = new Date();
    const greetingEl = document.getElementById('greeting-text');
    const timeEl = document.getElementById('time-display');
    const dateEl = document.getElementById('date-display');

    if (greetingEl) greetingEl.textContent = GreetingModule.getGreeting(now.getHours());
    if (timeEl) timeEl.textContent = GreetingModule.formatTime(now);
    if (dateEl) dateEl.textContent = GreetingModule.formatDate(now);
  },

  init() {
    GreetingModule._render();
    setInterval(GreetingModule._render, 60 * 1000);
  },
};

// ---------------------------------------------------------------------------
// FocusTimer
// ---------------------------------------------------------------------------
const FocusTimer = window.FocusTimer = {
  remaining: 1500,
  _intervalId: null,

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return mm + ':' + ss;
  },

  _render() {
    const display = document.getElementById('timer-display');
    if (display) display.textContent = FocusTimer.formatTime(FocusTimer.remaining);
  },

  start() {
    if (FocusTimer._intervalId !== null) return; // no-op if already running
    FocusTimer._intervalId = setInterval(function () {
      FocusTimer.remaining -= 1;
      FocusTimer._render();
      if (FocusTimer.remaining === 0) {
        FocusTimer.stop();
        const completion = document.getElementById('timer-completion');
        if (completion) completion.classList.remove('hidden');
      }
    }, 1000);
  },

  stop() {
    clearInterval(FocusTimer._intervalId);
    FocusTimer._intervalId = null;
  },

  reset() {
    FocusTimer.stop();
    FocusTimer.remaining = 1500;
    FocusTimer._render();
    const completion = document.getElementById('timer-completion');
    if (completion) completion.classList.add('hidden');
  },

  init() {
    FocusTimer.remaining = 1500;
    FocusTimer._render();
    const startBtn = document.getElementById('timer-start');
    const stopBtn = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');
    if (startBtn) startBtn.addEventListener('click', function () { FocusTimer.start(); });
    if (stopBtn) stopBtn.addEventListener('click', function () { FocusTimer.stop(); });
    if (resetBtn) resetBtn.addEventListener('click', function () { FocusTimer.reset(); });
  },
};

// ---------------------------------------------------------------------------
// TaskManager
// ---------------------------------------------------------------------------
const TaskManager = window.TaskManager = {
  tasks: [],

  addTask(label) {
    const trimmed = label.trim();
    if (!trimmed) return;
    const task = { id: String(Date.now()), label: trimmed, completed: false };
    TaskManager.tasks.push(task);
    TaskManager.save();
    TaskManager.render();
  },

  editTask(id, newLabel) {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    const task = TaskManager.tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.label = trimmed;
    TaskManager.save();
    TaskManager.render();
  },

  toggleTask(id) {
    const task = TaskManager.tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    TaskManager.save();
    TaskManager.render();
  },

  deleteTask(id) {
    TaskManager.tasks = TaskManager.tasks.filter(function (t) { return t.id !== id; });
    TaskManager.save();
    TaskManager.render();
  },

  save() {
    Storage.set('tasks', TaskManager.tasks);
  },

  render() {
    const list = document.getElementById('task-list');
    if (!list) return;
    list.innerHTML = '';
    TaskManager.tasks.forEach(function (task) {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      const labelSpan = document.createElement('span');
      labelSpan.className = 'task-label';
      labelSpan.textContent = task.label;

      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'task-edit-input hidden';
      editInput.value = task.label;

      const editBtn = document.createElement('button');
      editBtn.className = 'task-edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', function () {
        editInput.value = task.label;
        labelSpan.classList.add('hidden');
        editInput.classList.remove('hidden');
        editBtn.classList.add('hidden');
        confirmBtn.classList.remove('hidden');
      });

      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'task-confirm-btn hidden';
      confirmBtn.textContent = 'Save';
      confirmBtn.addEventListener('click', function () {
        TaskManager.editTask(task.id, editInput.value);
      });

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'task-toggle-btn';
      toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
      toggleBtn.addEventListener('click', function () {
        TaskManager.toggleTask(task.id);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function () {
        TaskManager.deleteTask(task.id);
      });

      li.appendChild(toggleBtn);
      li.appendChild(labelSpan);
      li.appendChild(editInput);
      li.appendChild(editBtn);
      li.appendChild(confirmBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  },

  init() {
    TaskManager.tasks = Storage.get('tasks') ?? [];
    TaskManager.render();
    const form = document.getElementById('task-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = document.getElementById('task-input');
        if (input) {
          TaskManager.addTask(input.value);
          input.value = '';
        }
      });
    }
  },
};

// ---------------------------------------------------------------------------
// QuickLinks
// ---------------------------------------------------------------------------
const QuickLinks = window.QuickLinks = {
  links: [],

  addLink(label, url) {
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();
    if (!trimmedLabel || !trimmedUrl) return;
    const link = { id: String(Date.now()), label: trimmedLabel, url: trimmedUrl };
    QuickLinks.links.push(link);
    QuickLinks.save();
    QuickLinks.render();
  },

  deleteLink(id) {
    QuickLinks.links = QuickLinks.links.filter(function (l) { return l.id !== id; });
    QuickLinks.save();
    QuickLinks.render();
  },

  save() {
    Storage.set('links', QuickLinks.links);
  },

  render() {
    const list = document.getElementById('links-list');
    if (!list) return;
    list.innerHTML = '';
    QuickLinks.links.forEach(function (link) {
      const li = document.createElement('li');

      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.textContent = link.label;
      anchor.target = '_blank';
      anchor.rel = 'noopener';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'link-delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', 'Delete ' + link.label);
      deleteBtn.addEventListener('click', function () {
        QuickLinks.deleteLink(link.id);
      });

      li.appendChild(anchor);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  },

  init() {
    QuickLinks.links = Storage.get('links') ?? [];
    QuickLinks.render();
    const form = document.getElementById('links-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const labelInput = document.getElementById('link-label-input');
        const urlInput = document.getElementById('link-url-input');
        if (labelInput && urlInput) {
          QuickLinks.addLink(labelInput.value, urlInput.value);
          labelInput.value = '';
          urlInput.value = '';
        }
      });
    }
  },
};

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  GreetingModule.init();
  FocusTimer.init();
  TaskManager.init();
  QuickLinks.init();
});
