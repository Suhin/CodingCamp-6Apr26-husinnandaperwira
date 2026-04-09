# Requirements Document

## Introduction

A vanilla JavaScript Life Dashboard web app that serves as a personal productivity hub. It displays the current time, date, and a contextual greeting, includes a 25-minute Pomodoro-style focus timer, a persistent to-do list, and a quick-links panel — all stored client-side using the browser's Local Storage API. No backend or framework is required.

## Glossary

- **Dashboard**: The single-page web application rendered in the browser.
- **Greeting_Module**: The UI component that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The countdown timer component set to 25 minutes by default.
- **Task_Manager**: The UI component responsible for creating, editing, completing, and deleting tasks.
- **Task**: A single to-do item with a text label and a completion state.
- **Quick_Links**: The UI component that displays user-defined shortcut buttons to external URLs.
- **Link**: A single quick-link entry with a label and a URL.
- **Storage**: The browser's Local Storage API used to persist all user data.

---

## Requirements

### Requirement 1: Greeting and Time Display

**User Story:** As a user, I want to see the current time, date, and a greeting when I open the dashboard, so that I have immediate context about the time of day.

#### Acceptance Criteria

1. THE Greeting_Module SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Module SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").
3. WHEN the current local time is between 05:00 and 11:59, THE Greeting_Module SHALL display the message "Good morning".
4. WHEN the current local time is between 12:00 and 17:59, THE Greeting_Module SHALL display the message "Good afternoon".
5. WHEN the current local time is between 18:00 and 21:59, THE Greeting_Module SHALL display the message "Good evening".
6. WHEN the current local time is between 22:00 and 04:59, THE Greeting_Module SHALL display the message "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second per second.
3. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown at the current value.
4. WHEN the user activates the reset control, THE Focus_Timer SHALL return the countdown value to 25 minutes and stop any active countdown.
5. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual indicator that the session has ended.
7. IF the user activates the start control while the Focus_Timer is already counting down, THEN THE Focus_Timer SHALL ignore the action.

---

### Requirement 3: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to a list and see them displayed, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an input field and a submit control for adding new tasks.
2. WHEN the user submits a non-empty task label, THE Task_Manager SHALL add the Task to the list and display it.
3. IF the user submits an empty or whitespace-only task label, THEN THE Task_Manager SHALL reject the submission and not add a Task.
4. THE Task_Manager SHALL display all Tasks in the order they were added.

---

### Requirement 4: To-Do List — Edit, Complete, and Delete Tasks

**User Story:** As a user, I want to edit, mark as done, and delete tasks, so that I can keep my list accurate and up to date.

#### Acceptance Criteria

1. WHEN the user activates the edit control on a Task, THE Task_Manager SHALL replace the Task label with an editable input field pre-filled with the current label.
2. WHEN the user confirms an edit with a non-empty label, THE Task_Manager SHALL update the Task label and return to display mode.
3. IF the user confirms an edit with an empty or whitespace-only label, THEN THE Task_Manager SHALL reject the update and retain the original Task label.
4. WHEN the user activates the complete control on a Task, THE Task_Manager SHALL toggle the Task's completion state.
5. WHILE a Task is in the completed state, THE Task_Manager SHALL apply a visual distinction to that Task (e.g., strikethrough text).
6. WHEN the user activates the delete control on a Task, THE Task_Manager SHALL remove the Task from the list permanently.

---

### Requirement 5: Task Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that they are still there when I reopen the dashboard.

#### Acceptance Criteria

1. WHEN a Task is added, edited, completed, or deleted, THE Storage SHALL be updated to reflect the current state of all Tasks.
2. WHEN the Dashboard loads, THE Task_Manager SHALL read all Tasks from Storage and display them.
3. IF no Tasks exist in Storage, THEN THE Task_Manager SHALL display an empty list with no errors.

---

### Requirement 6: Quick Links — Add and Display

**User Story:** As a user, I want to add shortcut buttons to my favorite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links component SHALL provide input fields for a link label and a URL, and a submit control.
2. WHEN the user submits a non-empty label and a valid URL, THE Quick_Links component SHALL add the Link and display it as a clickable button.
3. IF the user submits an empty label or an empty URL, THEN THE Quick_Links component SHALL reject the submission and not add the Link.
4. WHEN the user activates a Link button, THE Quick_Links component SHALL open the associated URL in a new browser tab.
5. THE Quick_Links component SHALL display all Links in the order they were added.

---

### Requirement 7: Quick Links — Delete and Persistence

**User Story:** As a user, I want to remove quick links and have them saved automatically, so that my link list stays relevant across sessions.

#### Acceptance Criteria

1. WHEN the user activates the delete control on a Link, THE Quick_Links component SHALL remove the Link permanently.
2. WHEN a Link is added or deleted, THE Storage SHALL be updated to reflect the current state of all Links.
3. WHEN the Dashboard loads, THE Quick_Links component SHALL read all Links from Storage and display them.
4. IF no Links exist in Storage, THEN THE Quick_Links component SHALL display an empty state with no errors.
