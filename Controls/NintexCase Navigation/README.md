# NintexCase Navigation

Horizontal navigation menu with K2 list binding and mode filtering for case management solutions.

## Overview

The NintexCase Navigation control provides a modern, accessible horizontal navigation bar perfect for case management applications. It features K2 SmartObject list binding with automatic filtering based on a "Mode" field, allowing you to show different navigation options based on the current context.

## Key Features

- 📋 **K2 List Binding** - Direct SmartObject binding with Name and optional Mode fields
- 🎯 **Mode Filtering** - Automatically filter navigation items based on current mode
- 🎨 **Gradient Support** - All color properties support CSS gradients
- ♿ **WCAG 2.1 Level AA** - Full accessibility compliance
- ⌨️ **Keyboard Navigation** - Full keyboard support with proper focus management
- 📱 **Responsive** - Adapts to different screen sizes
- 🎭 **Modern Design** - Pill-style buttons with dark professional theme

## Installation

1. Upload the control to your K2 SmartForms environment
2. The control will appear in the toolbox as "NintexCase Navigation"
3. Drag and drop onto your form

## K2 List Binding

### Required Fields
- **Name** (string) - The navigation item text to display

### Optional Fields
- **Mode** (string) - Used to filter items based on current mode

### Example SmartObject Structure
```
NavigationItems SmartObject:
- Name (Text) - Required
- Mode (Text) - Optional
- SortOrder (Number) - Optional
```

### Sample Data
```
Name          | Mode
--------------|----------
Dashboard     | (empty)
My Cases      | (empty)
New Case      | create
Case Details  | view
Edit Case     | edit
Tasks         | (empty)
Documents     | (empty)
Reports       | (empty)
Admin         | admin
```

### Testing in Control Dojo

The control comes with sample data for testing. Try changing the **Current Mode** property to see filtering in action:

- **Mode = (empty)** → Shows: Dashboard, My Cases, Tasks, Documents, Reports
- **Mode = "create"** → Shows: Dashboard, My Cases, New Case, Tasks, Documents, Reports
- **Mode = "view"** → Shows: Dashboard, My Cases, Case Details, Tasks, Documents, Reports
- **Mode = "edit"** → Shows: Dashboard, My Cases, Edit Case, Tasks, Documents, Reports
- **Mode = "admin"** → Shows: Dashboard, My Cases, Tasks, Documents, Reports, Admin

## Properties

### Core Properties
- **Selected Value** - Currently selected navigation item name (output)
- **List** - K2 list binding for navigation items
- **Current Mode** - Filter items by this mode value

### Color Properties
- **Background Color** - Navigation bar background (linear-gradient(135deg, #667eea 0%, #764ba2 100%) - purple gradient)
- **Text Color** - Item text color (rgba(255, 255, 255, 0.95) - bright white with slight opacity)
- **Active Color** - Selected item background (#FFFFFF - white pill button)
- **Hover Color** - Item hover background (rgba(255, 255, 255, 0.15) - subtle white overlay)
- **Border Color** - Legacy property (not used in pill design)

### Layout Properties
- **Height** - Navigation bar height in pixels (60)

### Typography
- **Font Family** - Font for navigation items (Roboto, sans-serif)
- **Font Size** - Font size in pixels (14)
- **Font Weight** - Font weight (500)

## Events

### ItemClicked
Fires when a navigation item is clicked.

**Event Detail:**
- `name` - The name of the clicked item
- `index` - The index of the clicked item
- `item` - The full item data object

**Example:**
```javascript
// K2 Rule: When ItemClicked on NintexCase Navigation
// Execute Method: Navigate(Selected Value)
```

## Methods

### clearSelection()
Clears the current selection and removes active state from all items.

**Example:**
```javascript
// K2 Rule: When Reset Button Clicked
// Execute Method: NintexCase Navigation.clearSelection()
```

## Mode Filtering

The Mode property allows you to show different navigation items based on context:

### Example: Context-Sensitive Navigation

**All Items (Mode = empty):**
- Dashboard
- Cases
- Tasks
- Reports

**Create Mode (Mode = "create"):**
- Dashboard
- Cases
- New Case ← Only shown in create mode
- Tasks
- Reports

**Edit Mode (Mode = "edit"):**
- Dashboard
- Cases
- Edit Case ← Only shown in edit mode
- Tasks
- Reports

**K2 Rule Example:**
```javascript
// When user clicks "New Case" button:
Set NintexCase Navigation.Mode = "create"

// When form loads existing case:
Set NintexCase Navigation.Mode = "edit"

// When returning to list:
Set NintexCase Navigation.Mode = ""
```

## Use Cases

### Case Management Dashboard
```javascript
Navigation Items:
- Dashboard (always shown)
- My Cases (always shown)
- New Case (mode: create)
- Case Details (mode: view)
- Edit Case (mode: edit)
- Reports (always shown)
```

### Multi-Step Workflow
```javascript
// Step 1: List view (mode = "list")
- Dashboard, Cases, Reports

// Step 2: Create (mode = "create")
- Dashboard, Cases, New Case, Cancel

// Step 3: Review (mode = "review")
- Dashboard, Cases, Submit, Back, Cancel
```

### Role-Based Navigation
```javascript
// Use Mode property with user roles:
Set NintexCase Navigation.Mode = [Current User Role]

Items:
- Dashboard (mode: empty - shown to all)
- Admin Panel (mode: admin)
- Manager View (mode: manager)
- Agent Queue (mode: agent)
```

## Using CSS Gradients

All color properties support CSS gradients. The control comes with a beautiful purple-to-purple gradient by default, but you can easily customize it.

### How to Change Gradient

Simply update the **Background Color** property with any CSS gradient:

1. In K2 SmartForms Designer, select the NintexCase Navigation control
2. Find the **Background Color** property
3. Paste your desired gradient (examples below)
4. The control will update immediately

### Basic Gradient Examples

**Blue to Indigo (Default):**
```
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Ocean Blue:**
```
linear-gradient(135deg, #667eea 0%, #06b6d4 100%)
```

**Sunset Orange:**
```
linear-gradient(135deg, #f97316 0%, #dc2626 100%)
```

**Forest Green:**
```
linear-gradient(135deg, #10b981 0%, #059669 100%)
```

**Dark Corporate:**
```
linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)
```

**Gradient Active Button:**
```
Active Color: linear-gradient(90deg, #667eea 0%, #764ba2 100%)
```

### Popular Case Management Themes

**Corporate Blue:**
```
Background Color: linear-gradient(to right, #1e40af 0%, #3b82f6 100%)
Active Color: #FFFFFF
```

**Modern Dark:**
```
Background Color: linear-gradient(135deg, #1f2937 0%, #111827 100%)
Active Color: linear-gradient(to right, #06b6d4 0%, #3b82f6 100%)
```

**Professional Purple:**
```
Background Color: linear-gradient(to right, #6366f1 0%, #8b5cf6 100%)
Active Color: #FFFFFF
```

## Accessibility (WCAG 2.1 Level AA)

### Features
- ✅ Proper ARIA roles (`navigation`, `menuitem`)
- ✅ `aria-current="page"` for active item
- ✅ Keyboard navigation (Enter, Space)
- ✅ Focus indicators
- ✅ Proper color contrast
- ✅ Reduced motion support

### Keyboard Support
- **Tab** - Navigate between items
- **Enter/Space** - Select item
- **Arrow Keys** - Navigate items (native browser behavior)

## Best Practices

### DO
- ✅ Use clear, concise navigation item names
- ✅ Limit to 5-7 top-level items for usability
- ✅ Use Mode filtering for context-sensitive navigation
- ✅ Provide visual feedback for active item
- ✅ Test keyboard navigation

### DON'T
- ❌ Don't overload with too many items (consider sub-navigation)
- ❌ Don't use Mode filtering as primary navigation strategy
- ❌ Don't change navigation items without user action
- ❌ Don't use low-contrast colors

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Integration with K2

### Basic Setup
1. Create NavigationItems SmartObject with Name and Mode fields
2. Add NintexCase Navigation control to form
3. Bind List property to SmartObject
4. Add rule: When ItemClicked → Set form variable to Selected Value

### Advanced: Dynamic Mode Switching
```javascript
// Rule: When view mode changes
If [ViewMode] = "Create"
  Then Set NintexCase Navigation.Mode = "create"
Else If [ViewMode] = "Edit"
  Then Set NintexCase Navigation.Mode = "edit"
Else
  Set NintexCase Navigation.Mode = ""
```

## Version

**Version:** 1.0
**Last Updated:** December 2025
**WCAG Status:** WCAG 2.1 Level AA Compliant ✅
