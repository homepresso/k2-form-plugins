# NintexCase Queue Control

A comprehensive case queue control with advanced features including search, sort, filter, pagination, swipe-to-remove, and quick actions.

## Features

- 📋 **Interactive Table** - Displays cases in a sortable, searchable table
- 🔍 **Search** - Real-time search across all fields
- ↕️ **Sorting** - Click column headers to sort (with visual indicators)
- ⚙️ **Configuration Panel** - Filter by date, SLA, status, and more
- 👆 **Swipe to Remove** - Drag or swipe rows to remove items from queue
- 📄 **Pagination** - Navigate through multiple pages of data
- 🎯 **Quick Actions** - Per-row action buttons (Open, Redirect, Push, Pull)
- 🎨 **Fully Customizable** - Colors, fonts, sizing, visibility options
- ♿ **Accessible** - Keyboard navigation and ARIA support

## List Data Structure

The control expects a K2 list with the following fields:

### Required Fields

```javascript
{
  "Title": "string",      // Case title (displays in first column with icon)
  "Type": "string",       // Case type (Onboarding, Support, Contract, Bug, etc.)
  "Assigned": "string",   // Assigned user name
  "SLA": "string",        // SLA time (e.g., "2 days", "4 hours", "30 minutes")
  "Status": "string",     // Status (Open, In Progress, Assigned, Closed, etc.)
  "Stage": "string"       // Current stage/workflow step
}
```

### Optional Fields

```javascript
{
  "Priority": "string",   // Priority level (Critical, High, Medium, Low)
  "Date": "datetime"      // Case date (used for date filtering)
}
```

### Example Data

```javascript
const queueData = [
  {
    Title: "Customer Onboarding - Acme Corp",
    Type: "Onboarding",
    Assigned: "John Doe",
    Priority: "High",
    SLA: "2 days",
    Status: "In Progress",
    Stage: "Documentation",
    Date: new Date("2025-12-10")
  },
  {
    Title: "Support Request - Payment Issue",
    Type: "Support",
    Assigned: "Jane Smith",
    Priority: "Critical",
    SLA: "4 hours",
    Status: "Open",
    Stage: "Triage",
    Date: new Date("2025-12-11")
  }
];

// Bind to control
queueControl.listItemsChangedCallback({ NewItems: queueData });
```

### Supported Case Types

The control recognizes these case types and displays appropriate icons:

- **Onboarding** - `person_add` icon (Blue)
- **Support** - `support_agent` icon (Orange)
- **Contract** - `description` icon (Purple)
- **Bug** - `bug_report` icon (Red)
- **Enhancement/Feature** - `auto_awesome`/`star` icon (Green/Yellow)
- **Task** - `assignment` icon (Cyan)
- **Incident** - `warning` icon (Orange)
- **Change** - `sync` icon (Purple)
- **Request** - `request_page` icon (Blue)

## Properties

### Display Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | "Case Queue" | Section title text |
| `showTitle` | boolean | true | Show/hide title |
| `showSearch` | boolean | true | Show/hide search bar |
| `searchPlaceholder` | string | "Search cases..." | Search input placeholder |
| `showPagination` | boolean | true | Show/hide pagination |
| `pageSize` | number | 10 | Items per page |
| `showQuickActions` | boolean | true | Show/hide action buttons |
| `showConfig` | boolean | true | Show/hide config button |

### Swipe Feature

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableSwipe` | boolean | true | Enable/disable swipe-to-remove |

When enabled:
- Drag rows left/right with mouse
- Swipe rows on touch devices
- Items are permanently removed from the queue
- RowSwipedLeft/RowSwipedRight events fire

### Config Settings (Output)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `configJSON` | string | "" | JSON string of current configuration (output only) |

Use this property to save and reload user's filter/sort preferences:

```javascript
// After user applies config, save the JSON
queue.addEventListener('ConfigChanged', (e) => {
  const configJSON = queue.configJSON;
  // Save to database/variable
  localStorage.setItem('queueConfig', configJSON);
});

// Later, reload the config
const savedConfig = localStorage.getItem('queueConfig');
if (savedConfig) {
  queue.configJSON = savedConfig; // Automatically applies settings
}
```

### Color Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | color | #FFFFFF | List background |
| `headerBackground` | color | #667eea | Header row background |
| `headerTextColor` | color | #FFFFFF | Header text color |
| `rowBackground` | color | #FFFFFF | Row background |
| `rowHoverBackground` | color | #F9F9F9 | Row hover background |
| `rowBorderColor` | color | #E0E0E0 | Row border color |
| `textColor` | color | #1C1B1F | Text color |
| `titleColor` | color | #1C1B1F | Title color |
| `configButtonColor` | color | #667eea | Config button color |
| `configButtonHoverColor` | color | #5568d3 | Config button hover |

### Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `borderRadius` | string | "8px" | Corner rounding |
| `fontFamily` | string | "Poppins, sans-serif" | Font family |
| `fontSize` | number | 14 | Font size in pixels |

### Config Button Customization

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `configIcon` | string | "settings" | Material icon name |
| `configIconColor` | color | #FFFFFF | Icon color |

## Events

### RowClicked
Fires when a row is single-clicked.

```javascript
queue.addEventListener('RowClicked', (e) => {
  console.log('Clicked:', e.detail.title);
  console.log('Index:', e.detail.index);
  console.log('Item:', e.detail.item);
});
```

### RowDoubleClicked
Fires when a row is double-clicked.

```javascript
queue.addEventListener('RowDoubleClicked', (e) => {
  console.log('Double-clicked:', e.detail.title);
});
```

### RowSwipedLeft
Fires when a row is swiped left (item is removed after event).

```javascript
queue.addEventListener('RowSwipedLeft', (e) => {
  console.log('Swiped left:', e.detail.title);
  console.log('Direction:', e.detail.direction); // "left"
});
```

### RowSwipedRight
Fires when a row is swiped right (item is removed after event).

```javascript
queue.addEventListener('RowSwipedRight', (e) => {
  console.log('Swiped right:', e.detail.title);
  console.log('Direction:', e.detail.direction); // "right"
});
```

### ActionClicked
Fires when a quick action button is clicked.

```javascript
queue.addEventListener('ActionClicked', (e) => {
  console.log('Action:', e.detail.action); // "open", "redirect", "push", "pull"
  console.log('Case:', e.detail.title);
  console.log('Item:', e.detail.item);
});
```

### ConfigChanged
Fires when configuration settings are applied.

```javascript
queue.addEventListener('ConfigChanged', (e) => {
  console.log('New settings:', e.detail.settings);
  console.log('Old settings:', e.detail.oldSettings);
  console.log('Config JSON:', queue.configJSON); // Get JSON to save
});
```

### DataReloaded
Fires when the `reloadData()` method is called.

```javascript
queue.addEventListener('DataReloaded', (e) => {
  console.log('Items reloaded:', e.detail.itemCount);
  console.log('Timestamp:', e.detail.timestamp);
});
```

## Methods

### clearSelection()
Clears the currently selected row.

```javascript
queue.clearSelection();
```

### reloadData()
Reloads and re-renders the queue data. Useful after external data updates.

```javascript
queue.reloadData();
```

## Configuration Panel Options

The config panel (accessed via the settings button) provides:

### Sort Options
- Sort by Date (Newest first)
- Sort by SLA (Most urgent first)

### Filter Options
- Show Today's Cases Only
- Show This Week's Cases Only
- Show Open Cases Only
- Show In Progress Cases Only
- Show Assigned Cases Only

Multiple filters can be combined. The "Filters Active" indicator appears when any filters are applied.

## Usage Example

```html
<nintexcase-queue id="myQueue"></nintexcase-queue>

<script>
  const queue = document.getElementById('myQueue');

  // Configure appearance
  queue.title = 'Active Cases';
  queue.showTitle = true;
  queue.showSearch = true;
  queue.enableSwipe = true;
  queue.pageSize = 10;

  // Bind data
  const cases = [
    {
      Title: "Customer Onboarding",
      Type: "Onboarding",
      Assigned: "John Doe",
      SLA: "2 days",
      Status: "In Progress",
      Stage: "Documentation",
      Priority: "High"
    }
  ];

  queue.listItemsChangedCallback({ NewItems: cases });

  // Handle events
  queue.addEventListener('RowClicked', (e) => {
    console.log('Case selected:', e.detail.title);
  });

  queue.addEventListener('RowSwipedLeft', (e) => {
    console.log('Case dismissed:', e.detail.title);
    // Item is automatically removed from queue
  });

  queue.addEventListener('ConfigChanged', (e) => {
    // Save user's filter preferences
    savePreferences(queue.configJSON);
  });
</script>
```

## K2 SmartForms Integration

### List Binding
1. Add the control to your form
2. Configure the **List** property with your K2 list
3. Ensure your list has the required fields (Title, Type, Assigned, SLA, Status, Stage)

### Value Binding
The control's value property (`selectedValue`) updates when a row is clicked:
- Use **Transfer Data** rules to capture the selected case
- The value contains the selected row's Title

### Config Persistence
Save and reload user preferences:

```
When Form Initialized:
  Transfer Data from [SavedConfig Variable] to [Queue].ConfigJSON

When [Queue].ConfigChanged:
  Transfer Data from [Queue].ConfigJSON to [SavedConfig Variable]
  Execute [SaveToDatabase] method
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Keyboard navigation with Tab/Enter
- ARIA labels and roles
- Screen reader support
- Focus indicators
- Reduced motion support

## Performance

- Efficient pagination (renders only visible items)
- Optimized search (debounced)
- Smooth animations
- Handles 1000+ items efficiently
