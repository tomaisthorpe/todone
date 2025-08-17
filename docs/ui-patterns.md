# UI Patterns

This document defines the consistent UI patterns used throughout Todone.

## Layout Patterns

### App Structure
```
Header (fixed)
├── Logo + Title
├── Add Task Button (opens AddItemModal)
└── Settings

Main Container (max-width, centered)
├── Smart Task Input (natural language parsing)
├── Today Section
└── Contexts Grid (2 columns on desktop)
```

### Today Section
```
Card
├── Header
│   ├── Calendar Icon + "Today"
│   └── Completion Counter
└── Task List (or empty state)
```

### Context Group
```
Card
├── Colored Header (collapsible)
│   ├── Chevron + Context Icon + Name/Description
│   ├── Health Percentage Badge
│   ├── Habit Counter
│   ├── "X in Today" indicator
│   └── Health Progress Bar
└── Task List (when expanded)
```

## Component Patterns

### TaskCard
**Structure:**
```
Row
├── Checkbox (circle/check)
├── Content
│   ├── Title + Task Type Indicators
│   └── Metadata (project, tags)
└── Status Badges (habit status, due date, urgency)
```

**Task Type Indicators:**
- **Habits**: Icon + streak/frequency info
- **Recurring**: 🔄 + "Every Xd"
- **Regular**: No special indicator

**Habit Icons by Type (all minimal):**
- Streak: 🏋️ (red, current streak + "(best: X)")
- Learning: 📖 (blue, current streak + "(best: X)")
- Wellness: 🔥 (green, current streak + "every Xd")
- Maintenance: 🔧 (gray, "every Xd" primary display)

### Status Badges

**Habit Status (minimal text-only):**
- `✓ Fresh` - Green text (`text-green-600`)
- `⏰ Getting due` - Yellow text (`text-yellow-600`)
- `⚡ Ready` - Blue text (`text-blue-600`)
- `🔄 Time for another` - Orange text (`text-orange-600`)

**Due Date Status:**
- `Today` - Blue
- `Tomorrow` - Green
- `In Xd` - Gray
- `Xd overdue` - Red (with alert icon)

**Urgency Score:**
- High (7+): Red background
- Medium (5-7): Orange background  
- Low (<5): Green background
- Format: `X.X` (one decimal)

### Context Health Bar
```
Progress Bar
├── Background: Semi-transparent white
├── Fill: Solid white
├── Height: 8px (h-2)
└── Rounded: Full
```

**Health Percentage Colors:**
- 80%+: Green
- 50-79%: Yellow
- <50%: Red

## Interactive States

### Hover States
- **TaskCard**: Light gray background (`hover:bg-gray-50`)
- **Context Header**: Semi-transparent white overlay
- **Buttons**: Darker shade of base color

### Collapse States
- **Expanded**: Chevron down, content visible, health bar shown
- **Collapsed**: Chevron right, content hidden, health bar shown

### Completion States
- **Completed Tasks**: 60% opacity, strikethrough text
- **Uncompleted**: Full opacity, normal text

## Color System

### Context Colors
- **Coding**: Blue (`bg-blue-500`)
- **Bathroom**: Cyan (`bg-cyan-500`)
- **Kitchen**: Green (`bg-green-500`)
- **Bedroom**: Purple (`bg-purple-500`)

### Status Colors
- **Success/Fresh**: Green variants
- **Warning/Due**: Yellow/Orange variants
- **Info/Ready**: Blue variants
- **Danger/Overdue**: Red variants

### Habit Type Colors
- **Streak**: Red (`text-red-500`)
- **Learning**: Blue (`text-blue-500`)
- **Wellness**: Green (`text-green-500`)
- **Maintenance**: Gray (`text-gray-500`)

## Typography Scale

### Headers
- **App Title**: `text-2xl font-bold`
- **Section Headers**: `text-xl font-semibold`
- **Context Names**: `font-semibold`
- **Subsection Headers**: `text-sm font-semibold`

### Body Text
- **Task Titles**: `text-sm font-medium`
- **Metadata**: `text-xs text-gray-500`
- **Status Badges**: `text-xs font-medium`
- **Descriptions**: `text-sm opacity-90`

## Spacing System

### Component Spacing
- **Card Padding**: `p-4` or `p-6`
- **Section Gaps**: `space-y-4` or `space-y-6`
- **Item Gaps**: `space-y-1` or `space-y-2`
- **Inline Spacing**: `space-x-2` or `space-x-3`

### Layout Spacing
- **Container**: `max-w-4xl mx-auto px-4 py-6`
- **Grid Gap**: `gap-4`
- **Header Padding**: `px-4 py-4`

## Animation Patterns

### Transitions
- **Health Bar Fill**: `transition-all duration-300`
- **Hover States**: Default transition
- **Collapse/Expand**: CSS transitions on height/opacity

### Loading States
- **Skeleton**: Gray backgrounds with pulse animation
- **Spinners**: Rotating icons for actions

## Icon Usage

### Consistent Icons
- **Today**: Calendar
- **Settings**: Gear/Cog
- **Add**: Plus
- **Complete**: CheckCircle2
- **Incomplete**: Circle
- **Expand**: ChevronDown
- **Collapse**: ChevronRight
- **Recurring**: RotateCcw
- **Overdue**: AlertCircle

### Context Icons
- **Coding**: Code
- **Home Contexts**: Home (generic)
- **Kitchen**: Coffee
- **Specific contexts**: Choose appropriate Lucide icons

## Responsive Patterns

### Desktop (md+)
- **Grid**: 2 columns for contexts
- **TaskCard**: Full metadata visible
- **Spacing**: Generous padding and gaps

### Mobile (<md)
- **Grid**: Single column
- **TaskCard**: Condensed metadata
- **Spacing**: Reduced padding
- **Touch Targets**: Minimum 44px height

## Empty States

### No Tasks Today
```
Empty State
├── Calendar Icon (large, gray)
├── "No tasks scheduled for today"
└── Optional: Quick add button
```

### Empty Context
```
"No tasks in this context" (centered, gray text)
```

## Error States

### Failed Actions
- Toast notifications
- Inline error messages
- Retry buttons where appropriate

### Invalid States
- Form validation messages
- Disabled buttons for invalid actions

## Accessibility Patterns

### Color
- Never rely on color alone for meaning
- Maintain WCAG contrast ratios
- Icons accompany color coding

### Interaction
- Keyboard navigation support
- Focus indicators
- Screen reader labels
- Touch-friendly targets (44px minimum)

### Content
- Semantic HTML
- Descriptive alt text
- Clear headings hierarchy
- Status announcements for dynamic changes

## Component Composition Examples

### Habit Display (Consistent Minimal)
```jsx
// Streak/Learning habits: current streak + best streak
<div className="flex items-center space-x-1">
  <Dumbbell className="w-3 h-3 text-red-500" />
  <span className="text-xs font-medium text-gray-600">12</span>
  <span className="text-xs text-gray-500">(best: 28)</span>
</div>

// Wellness habits: current streak + frequency
<div className="flex items-center space-x-1">
  <Flame className="w-3 h-3 text-green-500" />
  <span className="text-xs font-medium text-gray-600">5</span>
  <span className="text-xs text-gray-500">every 3d</span>
</div>

// Maintenance habits: frequency only
<div className="flex items-center space-x-1">
  <Wrench className="w-3 h-3 text-gray-500" />
  <span className="text-xs font-medium text-gray-600">every 7d</span>
</div>
```

### Habit Status (Text Only)
```jsx
// Minimal text-only status without background
<div className="text-xs font-medium whitespace-nowrap text-green-600">
  ✓ Fresh
</div>
```

### Context Health Badge
```jsx
<div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white text-green-700">
  85%
</div>
```

### Urgency Score
```jsx
<div className="px-1.5 py-0.5 rounded text-xs font-semibold text-red-600 bg-red-100">
  8.5
</div>
```

### Subtasks Component
```jsx
<SubtasksInput
  value={[
    { id: "1", text: "Research competitors", completed: true },
    { id: "2", text: "Create wireframes", completed: false },
    { id: "3", text: "Get feedback", completed: false }
  ]}
  onChange={(subtasks) => handleSubtasksChange(subtasks)}
  placeholder="Add a subtask..."
/>
```

## Navigation Patterns

### Header Navigation
```
Header
├── Logo + Title (linkable to dashboard)
├── Breadcrumb (for sub-pages)
├── User Info + Actions
│   ├── User Avatar/Name
│   ├── Sign Out Button
│   ├── Completed Tasks Link
│   ├── Settings Button
│   └── Add Task Modal
```

**Completed Tasks Link:**
- Ghost button style with CheckCircle2 icon
- Positioned between Sign Out and Settings
- Maintains header spacing consistency

## Page Patterns

### Completed Tasks Page
```
Page Layout
├── Header (with breadcrumb navigation)
├── Page Header
│   ├── Icon + Title + Description
│   └── Back to Dashboard Button
└── Content Area
    ├── Task List (with completion timestamps)
    └── Pagination
```

**Page Header:**
- Clock icon in green background circle
- Task count in description
- Right-aligned back button

**Task List Item:**
```
Row
├── TaskCard (existing component)
└── Completion Timestamp
    ├── "Completed" label
    ├── Date (localized)
    └── Time (HH:MM format)
```

## Pagination Patterns

### Pagination Component
```
Pagination Bar
├── Mobile View (Previous/Next only)
└── Desktop View
    ├── Results Summary ("Showing X to Y of Z")
    └── Page Navigation
        ├── Previous Button
        ├── Page Numbers (with ellipsis)
        └── Next Button
```

**Page Navigation Logic:**
- Always show first and last page numbers
- Show ellipsis when gaps exist
- Show current page ±1 pages when possible
- Maximum 5 visible page numbers
- Hide pagination if only 1 page

**Pagination Styling:**
- Border-top separator from content
- White background with padding
- Blue highlight for current page
- Disabled state for unavailable actions
- Responsive: full controls on desktop, simplified on mobile

**URL Integration:**
- Uses URLSearchParams for page state
- Removes 'page' param when on page 1
- Preserves other search parameters
- Client-side navigation with Next.js router

## Modal Patterns

### SmartTaskInput
**Structure:**
```
Card
├── Header ("Quick Add Task")
├── Smart Input Field
│   ├── Natural Language Input
│   ├── Send Button (inline)
│   └── Real-time Parsing Preview
├── Parsed Task Preview
│   ├── Preview Header ("Task Preview")
│   └── Field Grid (Title, Context, Priority, Due Date, Tags)
└── Help Text (syntax guide)
```

**Smart Input Features:**
- **Context Parsing**: `!contextName` - Blue highlight (semi-transparent background)
- **Tag Parsing**: `#tagname` - Green highlight (semi-transparent background) 
- **Priority Parsing**: `p1/p2/p3` - Purple highlight (semi-transparent background)
- **Date Parsing**: Natural language (tomorrow, next week) - Orange highlight (semi-transparent background)
- **Title Extraction**: Remaining text after parsing special syntax
- **Inline Highlighting**: Overlay technique shows highlights directly in input field
- **Editable Preview**: Toggle edit mode to correct parsing mistakes with form controls

**Visual Feedback:**
- Monospace font for input field with pixel-perfect inline highlighting
- Color-coded highlighting directly in input field using positioned overlay technique
- Real-time badge updates in editable task preview
- Disabled submit state until valid title exists
- Edit mode toggle for correcting parsing mistakes
- Uses reusable TaskForm component for consistent UX with main modal

**Example Usage:**
```
Input: "Setup Todone !Homelab #sideprojects #setup p1 tomorrow"
Parsing:
- Title: "Setup Todone"
- Context: "Homelab" (blue badge)
- Tags: ["sideprojects", "setup"] (green badges)
- Priority: "HIGH" (red badge)
- Due Date: "Tomorrow" (orange badge)
```

**Syntax Guide Display:**
- `!context` for context (blue example)
- `#tag` for tags (green example)
- `p1/p2/p3` for priority levels (purple example)
- Natural date phrases (orange example)

### TaskForm (Reusable Component)
**Structure:**
```
Form Component
├── Title Field (required in full mode)
├── Task Type Field (full mode only)
├── Priority Select
├── Context Select (with icons & colors)
├── Due Date Input
├── Conditional Fields (Habit/Recurring - full mode only)
├── Project Field (full mode only)
└── Tags Field (TagsInput in full mode, text input in compact)
```

**Usage Modes:**
- **Full Mode**: Complete form with all fields for modal usage
- **Compact Mode**: Essential fields only for inline editing
- **Consistent Styling**: Shared field validation and error handling
- **Icon Integration**: Context icons and visual indicators

### AddItemModal
**Structure:**
```
Dialog Modal
├── Header ("Add New Item")
├── Tab Navigation (Task | Context)
├── Dynamic Form Content
│   ├── Task Form (with conditional habit fields)
│   └── Context Form (icon & color selection)
└── Action Buttons (Cancel | Create)
```

**Tab Navigation:**
- Active tab: Blue border-bottom, blue text
- Inactive tab: Transparent border, gray text with hover
- Icons accompany text labels

**Form Layout:**
- Grid-based responsive layout (2 columns on desktop)
- Full-width elements span both columns
- Labels above inputs
- Validation errors below fields in red text

**Task Form Fields:**
- Title (required, full-width)
- Task Type (select: Task/Habit/Recurring)
- Priority (select: Low/Medium/High)
- Context (select with visual indicators)
- Due Date (datetime-local input)
- Habit Type (conditional, select with icons)
- Frequency (conditional, number input)
- Project (optional text)
- Notes (optional textarea)
- Subtasks (interactive checklist, full-width)
- Tags (tags input with autocomplete)

**Context Form Fields:**
- Name (required, full-width)
- Icon (select with icon previews)
- Color (select with color swatches)
- Description (optional textarea)

**Conditional Logic:**
- Habit-specific fields only show when Task Type = "HABIT"
- Form validation prevents submission with missing required fields
- Loading states show "Creating..." text on submit buttons

### SubtasksInput Component
**Structure:**
```
Subtasks Section
├── Existing Subtasks List
│   └── For each subtask:
│       ├── Drag Handle (GripVertical icon)
│       ├── Checkbox (completion toggle)
│       ├── Inline Text Input (editable)
│       └── Delete Button (X icon, hover-visible)
├── Add New Subtask Row
│   ├── Text Input (full-width)
│   └── Add Button (Plus icon)
└── Progress Summary ("X of Y completed")
```

**Interaction Patterns:**
- **Add Subtask**: Enter text and press Enter or click Plus button
- **Edit Subtask**: Click on text to edit inline
- **Complete Subtask**: Click checkbox (doesn't affect main task completion)
- **Delete Subtask**: Hover over subtask row to reveal X button
- **Visual Feedback**: Completed subtasks show checked state but remain editable

**Styling:**
- Background: Light gray (`bg-gray-50`) for subtask rows
- Hover states: Show delete button with opacity transition
- Drag handle: Gray color (`text-gray-400`) with grab cursor
- Progress summary: Small gray text (`text-xs text-gray-500`)
- Spacing: Consistent gaps between subtask items

**Data Structure:**
```typescript
interface Subtask {
  id: string;           // Unique identifier
  text: string;         // Subtask description
  completed: boolean;   // Completion status
}
```

These patterns ensure consistency across the app while maintaining the flexibility to evolve specific components as needed.