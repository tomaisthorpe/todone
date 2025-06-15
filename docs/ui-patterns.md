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

**Habit Icons by Type:**
- Streak: 🏋️ (red, prominent badge for streaks)
- Learning: 📖 (blue, moderate emphasis)
- Wellness: 🔥 (green, balanced)
- Maintenance: 🔧 (gray, minimal emphasis)

### Status Badges

**Habit Status (relaxed language):**
- `✓ Fresh` - Green
- `⏰ Getting due` - Yellow
- `⚡ Ready` - Blue
- `🔄 Time for another` - Orange

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

### Streak Habit (Prominent)
```jsx
<div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-md border border-red-200">
  <Dumbbell className="w-4 h-4 text-red-500" />
  <span className="text-sm font-bold text-red-700">12</span>
  <span className="text-xs text-gray-500">best: 28</span>
</div>
```

### Maintenance Habit (Minimal)
```jsx
<div className="flex items-center space-x-1">
  <Wrench className="w-3 h-3 text-gray-500" />
  <span className="text-xs font-medium text-orange-600">/7d</span>
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

## Modal Patterns

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
- Tags (disabled, placeholder for future)

**Context Form Fields:**
- Name (required, full-width)
- Icon (select with icon previews)
- Color (select with color swatches)
- Description (optional textarea)

**Conditional Logic:**
- Habit-specific fields only show when Task Type = "HABIT"
- Form validation prevents submission with missing required fields
- Loading states show "Creating..." text on submit buttons

These patterns ensure consistency across the app while maintaining the flexibility to evolve specific components as needed.