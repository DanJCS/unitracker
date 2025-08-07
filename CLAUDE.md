# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Application Architecture

### Core Stack
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM with nested routes
- **Styling**: Styled Components with light/dark themes
- **State Management**: React Context with localStorage persistence
- **Icons**: React Icons library
- **Date Handling**: date-fns library
- **Markdown**: react-markdown with GitHub Flavored Markdown

### Key Architectural Patterns

**Context-Based State Management**:
- Central `AppContext` manages all application state (milestones, tasks, theme, semester dates)
- Uses `usePersistentState` hook for automatic localStorage persistence
- State includes milestones, tasks with time tracking, theme preferences, and semester date ranges

**Layout Structure**:
- `Layout.jsx` provides app shell with collapsible sidebar and responsive design
- Uses React Router's `Outlet` for nested route rendering
- Sidebar collapses to 80px on mobile, expands to 250px on desktop

**Time Tracking System**:
- Web Worker (`timerWorker.js`) runs timers in separate thread for accuracy
- Timer continues running even when tab is inactive
- Tasks track `timeSpent` in seconds, managed through context functions

**Theme System**:
- Light/dark theme support with styled-components `ThemeProvider`
- Theme state persisted in localStorage
- Consistent color variables defined in `src/styles/theme.js`

### Data Models

**Task Object Structure**:
```javascript
{
  id: string,          // UUID
  name: string,
  description: string,
  dueDate: string,     // ISO date
  priority: string,    // 'high', 'medium', 'low'
  timeSpent: number,   // seconds
  completed: boolean
}
```

**Milestone Object Structure**:
```javascript
{
  id: string,          // UUID
  name: string,
  date: string,        // ISO date
  description: string,
  completed: boolean
}
```

### Page Structure
- **Overview**: Dashboard with progress bars and task summary
- **ImminentTasks**: Task list with filtering and time tracking
- **Milestones**: Milestone management with timeline view
- **ImmersiveZone**: Full-screen focus mode for individual tasks (route: `/immersive/:taskId`)

### Component Organization
- `src/components/layout/`: App shell components (Layout, Sidebar, MobileMenuButton)
- `src/components/common/`: Reusable components (modals, timer, progress indicators)
- `src/pages/`: Route components
- `src/context/`: React Context providers
- `src/hooks/`: Custom hooks (localStorage persistence)
- `src/workers/`: Web Workers (timer functionality)
- `src/utils/`: Utility functions (time formatting)

### Key Implementation Notes
- Uses UUID library for generating unique IDs
- Date handling with date-fns for semester date calculations
- Mobile-first responsive design with styled-components media queries
- ESLint configured with React-specific rules and unused variable exceptions for constants