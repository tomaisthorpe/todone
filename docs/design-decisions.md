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

### State Management
**Decision**: Start with local state, design for future persistence.

**Reasoning**: Get core functionality working first, then add persistence. Keep data structures simple and serializable.

### Text-First Entry (Planned)
**Decision**: Support natural language task entry like "Call mom tomorrow #family @home".

**Reasoning**: Inspired by Todoist. Reduces friction for task creation, especially on mobile.

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
How to adapt the context-based organization for mobile constraints.

### Urgency Customization
UI for adjusting urgency calculation weights per user preferences.

### Text Entry Parsing
Grammar and patterns for natural language task creation.