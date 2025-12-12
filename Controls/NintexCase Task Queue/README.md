# NintexCase Task Queue Control

A sophisticated task queue list component for K2 SmartForms and Nintex Workflow Cloud that displays task management data with rich column support, quick actions, search, sorting, and pagination.

## Overview

The **NintexCase Task Queue** control is designed specifically for task management workflows. It displays tasks in a modern, interactive table format with support for task-specific data fields and actions. This control is a companion to the [NintexCase Queue](../NintexCase%20Queue/) control, which is designed for case management.

### Key Features

- ✅ **8 Task-Specific Columns** - TaskName, DueDate, AssignedBy, AssignedTo, Priority, Status, Stage, Case
- ✅ **4 Quick Actions** - Action, Redirect, Sleep, Share with visual icons and colors
- ✅ **Search & Filter** - Real-time search across all task fields
- ✅ **Column Sorting** - Click headers to sort by any column
- ✅ **Pagination** - Configurable page size with navigation controls
- ✅ **Configuration Panel** - Runtime filters and settings
- ✅ **Swipe Gestures** - Left/right swipe support for mobile interactions
- ✅ **Fully Customizable** - Colors, fonts, styles, visibility options
- ✅ **WCAG Compliant** - Accessible design with keyboard navigation
- ✅ **K2 List Binding** - Direct binding to K2 SmartObject lists

## Screenshot

![Task Queue Preview](./docs/preview.png)

## Columns

The task queue displays the following columns:

| Column | Description | Width | Badge |
|--------|-------------|-------|-------|
| **Task Name** | The name or title of the task with task icon | 18-25% | Teal assignment icon |
| **Due Date** | When the task is due | 10% | - |
| **Assigned By** | Person who assigned the task | 12% | - |
| **Assigned To** | Person responsible for the task | 12% | - |
| **Priority** | Task priority level (Critical, High, Medium, Low) | 8% | Colored badge |
| **Status** | Current task status (Pending, In Progress, Completed, etc.) | 10% | Colored badge |
| **Stage** | Task workflow stage (Review, Approval, Investigation, etc.) | 10% | - |
| **Case** | Parent case this task belongs to | 12% | - |
| **Actions** | Quick action buttons (optional) | 15% | Action icons |

### Task Icon

All tasks display a teal assignment icon (Material Icons: `assignment`) in the Task Name column, providing a consistent visual identifier for task items.

## Quick Actions

The task queue includes 4 quick action buttons that appear in the Actions column:

| Action | Icon | Color | Description |
|--------|------|-------|-------------|
| **Action** | `check_circle` | Green | Mark task as completed or take action on task |
| **Redirect** | `forward` | Purple | Redirect or reassign the task to another user |
| **Sleep** | `snooze` | Purple | Put the task on hold or snooze until later |
| **Share** | `share` | Orange | Share task details with other users or systems |

Each action button fires the `ActionClicked` event with the action type and task data.

## K2 List Binding

The control requires a K2 SmartObject list with the following fields:

### Required Fields

```
TaskName     (string)  - The task title/name
DueDate      (string)  - Task due date
AssignedBy   (string)  - Person who assigned the task
AssignedTo   (string)  - Person assigned to complete the task
Priority     (string)  - Task priority (Critical, High, Medium, Low)
Status       (string)  - Task status (Pending, In Progress, Completed, etc.)
Stage        (string)  - Workflow stage (Review, Approval, Investigation, etc.)
Case         (string)  - Parent case name or reference
```

### Field Name Flexibility

The control supports both PascalCase and camelCase field names:
- `TaskName` or `taskName`
- `DueDate` or `dueDate`
- `AssignedBy` or `assignedBy`
- `AssignedTo` or `assignedTo`
- `Priority` or `priority`
- `Status` or `status`
- `Stage` or `stage`
- `Case` or `case`

## Properties

### Data Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selectedValue` | string | "" | Currently selected task name (read/write) |
| `configJSON` | string | "" | JSON configuration state (output only) |
| `List` | listdata | - | K2 list binding for task data |

### Display Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | "Task Queue" | Section title text |
| `showTitle` | string | "true" | Show or hide section title |
| `showSearch` | string | "true" | Show or hide search bar |
| `searchPlaceholder` | string | "Search tasks..." | Search input placeholder |
| `showPagination` | string | "true" | Show or hide pagination |
| `pageSize` | string | "10" | Number of items per page |
| `showQuickActions` | string | "true" | Show or hide action buttons |
| `showConfig` | string | "true" | Show or hide config button |
| `enableSwipe` | string | "true" | Enable or disable swipe gestures |

### Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | string | "#FFFFFF" | List background color |
| `headerBackground` | string | "#667eea" | Header row background |
| `headerTextColor` | string | "#FFFFFF" | Header text color |
| `rowBackground` | string | "#FFFFFF" | Row background color |
| `rowHoverBackground` | string | "#F9F9F9" | Row hover background |
| `rowBorderColor` | string | "#E0E0E0" | Row border color |
| `textColor` | string | "#1C1B1F" | Row text color |
| `titleColor` | string | "#1C1B1F" | Section title color |
| `borderRadius` | string | "8px" | Corner rounding |
| `fontFamily` | string | "Poppins, sans-serif" | Font family |
| `fontSize` | string | "14" | Font size in pixels |

### Config Button Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `configIcon` | string | "settings" | Material icon name for config button |
| `configIconColor` | string | "#FFFFFF" | Config icon color |
| `configButtonColor` | string | "#667eea" | Config button background |
| `configButtonHoverColor` | string | "#5568d3" | Config button hover background |

## Events

### RowClicked

Fires when a task row is single-clicked.

**Event Data:**
```javascript
{
  taskName: "Review customer documents",
  dueDate: "2025-12-15",
  assignedBy: "Alice Manager",
  assignedTo: "John Doe",
  priority: "High",
  status: "In Progress",
  stage: "Review",
  case: "Onboarding - Acme Corp"
}
```

### RowDoubleClicked

Fires when a task row is double-clicked. Same event data as RowClicked.

### RowSwipedLeft

Fires when a task row is swiped left (mobile/touch). Same event data as RowClicked.

### RowSwipedRight

Fires when a task row is swiped right (mobile/touch). Same event data as RowClicked.

### ActionClicked

Fires when any quick action button is clicked.

**Event Data:**
```javascript
{
  action: "action" | "redirect" | "sleep" | "share",
  taskName: "Review customer documents",
  dueDate: "2025-12-15",
  assignedBy: "Alice Manager",
  assignedTo: "John Doe",
  priority: "High",
  status: "In Progress",
  stage: "Review",
  case: "Onboarding - Acme Corp"
}
```

### ConfigChanged

Fires when configuration settings are applied through the config panel.

**Event Data:**
```javascript
{
  filters: { /* filter settings */ },
  configJSON: "{ /* full config */ }"
}
```

### DataReloaded

Fires when the `reloadData()` method is called and data is refreshed.

## Methods

### clearSelection()

Clears the currently selected task.

**Example:**
```javascript
// Clear selection when form loads
myTaskQueue.clearSelection();
```

### reloadData()

Reloads the task queue data from the K2 list binding and refreshes the display.

**Example:**
```javascript
// Reload data after updating a task
myTaskQueue.reloadData();
```

## Usage Examples

### Basic Setup

1. Drag the NintexCase Task Queue control onto your K2 form
2. Bind the List property to your K2 SmartObject task list
3. Configure the title and colors to match your theme
4. Handle the RowClicked event to navigate to task details
5. Handle the ActionClicked event to process quick actions

### Example: Handle Row Click

```javascript
// When task is clicked, navigate to task details
function TaskQueue_RowClicked(taskData) {
  // Store selected task
  myTaskQueue.selectedValue = taskData.taskName;

  // Navigate to task detail view
  window.location.href = "/TaskDetails.aspx?task=" + encodeURIComponent(taskData.taskName);
}
```

### Example: Handle Quick Actions

```javascript
// Handle quick action clicks
function TaskQueue_ActionClicked(eventData) {
  var action = eventData.action;
  var taskName = eventData.taskName;

  switch(action) {
    case "action":
      // Complete or take action on task
      completeTask(taskName);
      break;

    case "redirect":
      // Redirect task to another user
      showRedirectDialog(taskName);
      break;

    case "sleep":
      // Put task on hold
      sleepTask(taskName);
      break;

    case "share":
      // Share task details
      shareTask(taskName);
      break;
  }
}
```

### Example: Search and Filter

```javascript
// The search is built-in and searches across all task fields
// To programmatically reload data after filter changes:
function ApplyFilters() {
  myTaskQueue.reloadData();
}
```

### Example: Swipe Actions (Mobile)

```javascript
// Handle left swipe - maybe mark complete
function TaskQueue_RowSwipedLeft(taskData) {
  if (confirm("Mark task '" + taskData.taskName + "' as complete?")) {
    completeTask(taskData.taskName);
    myTaskQueue.reloadData();
  }
}

// Handle right swipe - maybe reassign
function TaskQueue_RowSwipedRight(taskData) {
  showReassignDialog(taskData.taskName);
}
```

### Example: Custom Styling

Set properties to match your brand:

```javascript
// Modern blue theme
myTaskQueue.headerBackground = "#1976D2";
myTaskQueue.headerTextColor = "#FFFFFF";
myTaskQueue.titleColor = "#1976D2";
myTaskQueue.fontFamily = "Roboto, sans-serif";
myTaskQueue.borderRadius = "12px";

// Dark theme
myTaskQueue.backgroundColor = "#1E1E1E";
myTaskQueue.rowBackground = "#2D2D2D";
myTaskQueue.rowHoverBackground = "#3D3D3D";
myTaskQueue.textColor = "#FFFFFF";
myTaskQueue.headerBackground = "#424242";
```

## Comparison with Case Queue

| Feature | NintexCase Queue | NintexCase Task Queue |
|---------|------------------|----------------------|
| **Purpose** | Case management | Task management |
| **Columns** | 7 (Title, Type, Assigned, Priority, SLA, Status, Stage) | 8 (TaskName, DueDate, AssignedBy, AssignedTo, Priority, Status, Stage, Case) |
| **Quick Actions** | Open, Redirect, Push Down, Pull Up | Action, Redirect, Sleep, Share |
| **Icon** | Dynamic type-based icons (multiple colors) | Single assignment icon (teal) |
| **Use Case** | Managing cases with type categories | Managing tasks with assignments and due dates |
| **Tag Name** | `nintexcase-queue` | `nintexcase-task-queue` |

### When to Use Which Control?

**Use NintexCase Queue when:**
- Managing cases that have different types (support, billing, etc.)
- Need to organize cases in hierarchy (push down/pull up)
- Focus is on case status and SLA tracking
- Cases are categorized by type

**Use NintexCase Task Queue when:**
- Managing tasks assigned to users
- Need to track who assigned and who is assigned to
- Focus is on due dates and task completion
- Tasks are related to parent cases
- Need sleep/share/action workflow actions

### Using Both Controls Together

You can place both controls on the same form and use a toggle switch to show/hide them:

```javascript
// Switch between case and task view
function ViewSwitch_Changed(viewType) {
  if (viewType === "cases") {
    caseQueue.IsVisible = true;
    taskQueue.IsVisible = false;
  } else {
    caseQueue.IsVisible = false;
    taskQueue.IsVisible = true;
  }
}
```

## Badge Styling

The control includes built-in badge styles for Priority and Status fields:

### Priority Badges

- **Critical** - Red background (#FEE2E2), red text (#991B1B)
- **High** - Orange background (#FED7AA), orange text (#9A3412)
- **Medium** - Yellow background (#FEF3C7), yellow text (#78350F)
- **Low** - Green background (#D1FAE5), green text (#065F46)

### Status Badges

Common status values are styled with appropriate colors:
- **Pending** - Gray
- **In Progress** - Blue
- **Completed** - Green
- **Assigned** - Purple
- **On Hold** - Yellow

## Accessibility (WCAG)

The control follows WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation support (Tab, Enter, Escape)
- ✅ Focus indicators on all interactive elements
- ✅ ARIA labels and roles
- ✅ Semantic HTML structure
- ✅ Color contrast ratios meet AA standards
- ✅ Screen reader friendly
- ✅ Reduced motion support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- Material Icons (loaded via CDN or local)
- Modern browser with Web Components support

## Installation

1. Copy the `NintexCase Task Queue` folder to your Control Dojo `Controls` directory
2. Refresh Control Dojo to see the new control
3. The control will appear in the toolbox as "NintexCase Task Queue"

## File Structure

```
NintexCase Task Queue/
├── manifest.json           # Control metadata and properties
├── runtime_logic.js        # Runtime behavior and logic
├── runtime_style.css       # Runtime styling
├── designtime_logic.js     # Designer preview logic
├── designtime_style.css    # Designer preview styling
├── icon.svg                # Control toolbox icon
├── README.md               # This documentation
└── example.html            # Working example
```

## License

This control is part of the Control Dojo project. See the main repository for license information.

## Support

For issues, questions, or contributions:
- Open an issue on the Control Dojo GitHub repository
- Consult the Control Dojo documentation
- Check the example.html file for working demonstrations

## Version History

### v1.0.0 (2025-12-12)
- Initial release
- 8 task-specific columns
- 4 quick actions (Action, Redirect, Sleep, Share)
- Search, sort, pagination
- Swipe gesture support
- Configuration panel
- Full K2 SmartForms integration
- WCAG accessibility compliance

## Credits

Created as part of the Control Dojo custom control library for K2 SmartForms and Nintex Workflow Cloud.
