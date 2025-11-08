# Design Decisions

This document captures the key design decisions made during Todone's development and the reasoning behind them.

## Core Philosophy

### Habits ≠ Tasks ≠ Deadlines
**Decision**: Treat habits as flexible, supportive routines rather than rigid deadlines.

**Reasoning**: Traditional productivity apps create stress by treating missed habits as failures. Todone uses encouraging language like "⚡ Ready" instead of "Overdue" to maintain psychological sustainability.

**Impact**: Habit status language, visual styling, and completion tracking all reflect this supportive approach.

### Context-Based Organization
**Decision**: Organize tasks by context (where/when they're done) rather than projects.

**Reasoning**: Inspired by Getting Things Done methodology. When you're in the bathroom, you want to see bathroom tasks regardless of which "project" they belong to.

**Impact**: Primary navigation is by context, with project information as secondary metadata.

### Urgency Over Priority
**Decision**: Use mathematical urgency scoring instead of simple priority labels.

**Reasoning**: Inspired by TaskWarrior. Urgency can factor in age, due dates, project importance, and tags in a consistent, customizable way.

**Impact**: All sorting is urgency-based, with visual urgency indicators throughout the UI.

## UI Architecture Decisions

### Unified Task Lists
**Decision**: Show habits and tasks in the same list, sorted by urgency.

**Evolution**: 
- Started with separate "Habits" and "Tasks" sections
- Tried three sections: "Habits", "Recurring", "Tasks"  
- Settled on unified list with visual type indicators

**Reasoning**: Everything competes for attention based on actual urgency. Visual icons distinguish types without artificial separation.

### Context Health from Habits Only
**Decision**: Context completion percentage only considers habits, not one-off tasks.

**Reasoning**: One-off tasks are temporary. Context "health" should reflect how well-maintained that life area is, which comes from consistent habits (cleaning, routines, etc.).

**Impact**: Health bars show habit completion ratio, giving a sense of life balance.

### Always-Visible Health Bars
**Decision**: Show context health bars even when contexts are collapsed.

**Reasoning**: Enables quick scanning of life balance without expanding every context. You can immediately see which areas need attention.

### Collapsible Contexts
**Decision**: Allow contexts to be collapsed to headers only.

**Reasoning**: Reduces cognitive load when focusing on specific areas. Health bars provide enough information for collapsed contexts.

### "Today" Section Priority
**Decision**: Dedicated "Today" section at the top, pulling tasks from all contexts.

**Reasoning**: Due dates create genuine urgency that transcends context boundaries. Today's tasks need immediate visibility regardless of context.

## Task Type System

### Three Task Types
**Decision**: Support three distinct task types with different behaviors.

1. **Regular Tasks**: One-off items with due dates
2. **Habits**: Recurring activities with flexible timing  
3. **Recurring Tasks**: Scheduled items with strict deadlines

**Reasoning**: Each type has different psychological and functional needs. Habits need flexibility, recurring tasks need deadline awareness, regular tasks need completion tracking.

### Recurring Tasks with Regular Tasks
**Decision**: Show recurring tasks alongside regular tasks, not as separate section.

**Evolution**: Initially considered separate "Recurring" section, but moved to unified tasks.

**Reasoning**: Recurring tasks compete for attention based on urgency like any other task. The 🔄 icon provides visual distinction without artificial separation.

## Visual Design Decisions

### Habit Type Differentiation
**Decision**: Different habit types get different visual treatment.

- **Streak Habits** (🏋️): Prominent red badges with personal bests
- **Learning Habits** (📖): Moderate emphasis with progress ratios  
- **Wellness Habits** (🔥): Balanced display
- **Maintenance Habits** (🔧): De-emphasized streaks, focus on frequency

**Reasoning**: Different habits have different motivational patterns. Exercise benefits from streak prominence, while cleaning just needs to get done regularly.

### Relaxed Status Language
**Decision**: Use supportive, non-judgmental language for habit status.

Examples:
- "✓ Fresh" instead of "Completed"
- "⚡ Ready" instead of "Due"
- "🔄 Time for another" instead of "Overdue"

**Reasoning**: Language shapes psychology. Harsh deadline language creates stress and guilt, undermining long-term habit formation.

### Urgency Color Coding
**Decision**: Consistent color system for urgency across all components.

- High (7+): Red
- Medium (5-7): Orange/Yellow  
- Low (<5): Green

**Reasoning**: Quick visual scanning for priority without reading numbers. Consistent throughout the app.

## Technical Architecture Decisions

### Component Strategy
**Decision**: Use shadcn/ui for basics, custom components for Todone-specific patterns.

**Reasoning**: shadcn provides solid foundation (buttons, cards, inputs) while allowing full customization for unique components (TaskCard, ContextGroup, habit badges).

### Modal Interaction Blocking
**Decision**: Explicitly enable modal behavior for all dialogs to prevent background interaction.

**Reasoning**: Modal dialogs should block user interaction with background elements to maintain focus and prevent accidental actions. Added `modal={true}` prop to all Dialog components and enhanced overlay with proper z-index layering and pointer events.

**Impact**: Users can no longer accidentally interact with background elements when task editing modal, context creation modal, or confirmation dialogs are open, providing better UX and preventing data loss scenarios.

### Z-Index Layering Strategy
**Decision**: Use a clear z-index hierarchy: Modal overlays at z-50, modal content at z-[51], and dropdown components at z-[100].

**Reasoning**: Dropdown components (Select, TagsInput, Tooltips) that appear in modals need to render above the modal overlay to remain interactive. Using z-[100] ensures these components work correctly within modal contexts.

**Impact**: All dropdown interactions work seamlessly within modals, including task form selects, context form selects, and tag input suggestions.

### State Management
**Decision**: Start with local state, design for future persistence.

**Reasoning**: Get core functionality working first, then add persistence. Keep data structures simple and serializable.

### Text-First Entry
**Decision**: Support natural language task entry like "Call mom tomorrow #family !context p1".

**Reasoning**: Inspired by Todoist. Reduces friction for task creation, especially on mobile.

**Implementation**: `components/smart-task-input.tsx` with real-time parsing and inline highlighting using positioned overlay technique.

### Progressive Web App (PWA)
**Decision**: Build as a full PWA with service worker, offline support, and Badge API integration.

**Reasoning**:
- Task management is used throughout the day across multiple contexts (home, work, mobile)
- Offline support ensures access even without connectivity
- Installability provides native-like experience without app store friction
- Badge API creates persistent awareness of due/overdue tasks

**Impact**:
- Users can install on home screen (iOS/Android) or desktop (Windows/Mac/Linux)
- App badge shows task count even when app is closed
- Service worker caches assets for instant loading
- Works offline with automatic sync when online

**Implementation**: `next-pwa` package with comprehensive caching strategy, `lib/badge-utils.ts` for badge management, permission banner for iOS users.

### Subtasks Feature
**Decision**: Support hierarchical task breakdown with independent completion tracking.

**Reasoning**:
- Complex tasks benefit from step-by-step breakdown
- Subtasks provide clarity without cluttering main task list
- Independent completion allows tracking progress without completing parent
- Stored as JSON for flexibility and denormalized performance

**Impact**:
- Reduces need for creating many small interconnected tasks
- Better visualization of task complexity
- Drag-and-drop reordering for prioritizing subtask order
- Progress indicators show completion ratio

**Implementation**: Stored as JSON array in Task model, managed via `components/ui/subtasks-input.tsx` with `@dnd-kit/sortable` for drag-and-drop.

### Archived Contexts
**Decision**: Allow contexts to be archived rather than deleted.

**Reasoning**:
- Life circumstances change (moved out of apartment, changed jobs, completed projects)
- Deleting contexts loses historical data and task associations
- Archiving preserves data while removing clutter from active view
- Users may want to reference past contexts later

**Impact**:
- Keeps dashboard focused on active life areas
- Maintains data integrity for completed tasks
- Easy restoration if context becomes relevant again
- Supports life transitions without data loss

**Implementation**: Boolean `archived` field on Context model, dedicated modal for viewing/restoring archived contexts, filter archived contexts from main dashboard query.

### Completed Tasks Page
**Decision**: Separate page for viewing completed tasks with pagination.

**Reasoning**:
- Completed tasks clutter the main dashboard over time
- Users sometimes need to reference what they've accomplished
- Historical view helps with reflection and productivity analysis
- Pagination handles large datasets efficiently

**Impact**:
- Main dashboard remains focused on actionable items
- Easy access to completion history for accountability
- Performance optimization through pagination
- Supports productivity tracking and reporting

**Implementation**: Dedicated `/tasks/completed` route, server-side pagination with 20 items per page, sortable by completion date.

### Feature Limits Configuration
**Decision**: Centralized configuration for resource limits (tasks, contexts) with infinite defaults.

**Reasoning**:
- Prepares infrastructure for future subscription tiers
- Allows easy adjustment of limits without code changes
- Server-side enforcement prevents abuse
- Currently unlimited to avoid friction during initial launch

**Impact**:
- Ready for freemium/premium pricing model
- Consistent limit enforcement across all creation flows
- Clear error messages when limits reached
- Easy A/B testing of limit configurations

**Implementation**: `lib/feature-limits.ts` with exported constants, checked in server actions before resource creation.

## Rejected Approaches

### Separate Habit App
**Rejected**: Building habits as a separate app from tasks.

**Reasoning**: Habits and tasks often relate to the same contexts and projects. Unified view provides better life balance perspective.

### Strict Habit Schedules
**Rejected**: Treating habits like recurring tasks with fixed schedules.

**Reasoning**: Creates guilt and stress when missed. Flexible approach is more sustainable long-term.

### Project-First Organization
**Rejected**: Primary navigation by project instead of context.

**Reasoning**: Context-switching is more natural for daily use. Projects span multiple contexts.

### Complex Priority Systems
**Rejected**: Multiple priority dimensions (importance, urgency, effort, etc.).

**Reasoning**: Single urgency score is simpler and can incorporate multiple factors mathematically.

## Future Decisions to Make

### Shared Contexts
How to handle task assignment and context health in shared spaces (family kitchen, office).

### Hardware Integration
How to surface context status on physical displays for location-based reminders.

### Mobile Experience
How to adapt the context-based organization for mobile constraints (already PWA-ready, but UX could be optimized further).

### Urgency Customization UI
UI for adjusting urgency calculation weights per user preferences (backend supports this via coefficients).

### Subscription Tiers
Which features to gate behind paid tiers vs. keep free (feature limits infrastructure is ready).

### Push Notifications
Whether to add push notifications for due tasks beyond badge API (could create notification fatigue).

### Task Dependencies
How to handle tasks that block other tasks (subtasks partially address this, but explicit dependencies could be useful).

### Burndown Chart Placement
Where to display the burndown chart for maximum value (dashboard widget vs. dedicated analytics page).