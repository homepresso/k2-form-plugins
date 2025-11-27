# Material List Control

Material 3 Design list for displaying items with icons and avatars.

## Tag Name
```
<material-list>
```

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding. Add `"DataBinding"` to your supports configuration.

### Expected Data Structure

When binding to a SmartObject, the control expects the following field mappings:

| Control Field | SmartObject Field | Description |
|--------------|-------------------|-------------|
| Icon | `Icon` or `Image` | Material icon name or image URL |
| Title | `Title` or `Display` | List item title text |
| Subtitle | `Subtitle` or `Description` | List item subtitle text |
| Value | `Value` | Unique identifier for the item |

### Example SmartObject Data
```json
[
  {
    "icon": "inbox",
    "title": "Inbox",
    "subtitle": "3 new messages",
    "value": "inbox"
  },
  {
    "icon": "star",
    "title": "Starred",
    "subtitle": "12 items",
    "value": "starred"
  }
]
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `listBinding` | List Binding | JSON array of items [{icon, title, subtitle, value}] - takes priority over Items if provided | `""` |
| `items` | Items | List items (pipe-separated, format: icon:title:subtitle:value) - used if List Binding is empty | Sample data |
| `delimiter` | Delimiter | Character to separate items | `\|` |
| `subDelimiter` | Sub Delimiter | Character to separate item parts | `:` |
| `selectedValue` | Selected Value | Currently selected item value | `""` |
| `checkedValues` | Checked Values | Comma-separated list of checked item values | `""` |

### Layout Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | List variant: `one-line`, `two-line`, `three-line` | `one-line` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showDividers` | Show Dividers | Show dividers (true/false) | `false` |
| `showLeadingIcon` | Show Leading Icon | Show leading icon (true/false) | `true` |
| `showTrailingIcon` | Show Trailing Icon | Show trailing icon (true/false) | `false` |
| `trailingIcon` | Trailing Icon | Trailing icon name | `chevron_right` |
| `avatarMode` | Avatar Mode | Display as avatar (true/false) | `false` |

### Interaction Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `selectable` | Selectable | Allow item selection (true/false) | `true` |
| `checkboxMode` | Checkbox Mode | Show checkboxes next to items (true/false) | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `backgroundColor` | Background Color | List background color | `#FFFBFE` |
| `textColor` | Text Color | Primary text color | `#1C1B1F` |
| `secondaryTextColor` | Secondary Text Color | Subtitle text color | `#49454F` |
| `iconColor` | Icon Color | Leading icon color | `#49454F` |
| `dividerColor` | Divider Color | Divider line color | `#CAC4D0` |
| `hoverColor` | Hover Color | Item hover background | `""` |
| `selectedColor` | Selected Color | Selected item background | `#E8DEF8` |
| `checkboxColor` | Checkbox Color | Checkbox accent color when checked | `#6750A4` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `ItemSelected` | Fires when a list item is selected |
| `ItemChecked` | Fires when a checkbox is checked or unchecked |

## Methods

| Method | Description |
|--------|-------------|
| `clearSelection()` | Clears the current selection |
| `checkAll()` | Checks all items in checkbox mode |
| `uncheckAll()` | Unchecks all items in checkbox mode |

## Usage Example

### Basic One-Line List
```html
<material-list
  variant="one-line"
  items="inbox:Inbox::inbox|star:Starred::starred|send:Sent::sent">
</material-list>
```

### Two-Line List with Subtitles
```html
<material-list
  variant="two-line"
  items="inbox:Inbox:3 new messages:inbox|star:Starred:12 items:starred">
</material-list>
```

### List with Dividers and Trailing Icons
```html
<material-list
  show-dividers="true"
  show-trailing-icon="true"
  trailing-icon="chevron_right">
</material-list>
```

### Checkbox List
```html
<material-list
  checkbox-mode="true"
  items="task1:Complete report::task1|task2:Review code::task2|task3:Send email::task3">
</material-list>
```

### Avatar Mode
```html
<material-list
  avatar-mode="true"
  variant="two-line"
  items="https://example.com/avatar1.jpg:John Doe:Software Engineer:user1">
</material-list>
```

### With K2 Data Binding
```html
<material-list
  list-binding="{SmartObject.Data}"
  variant="two-line"
  selectable="true">
</material-list>
```

### Custom Colors
```html
<material-list
  primary-color="#1976D2"
  selected-color="#BBDEFB"
  icon-color="#1976D2">
</material-list>
```

## List Variants

| Variant | Description |
|---------|-------------|
| `one-line` | Single line items with title only |
| `two-line` | Items with title and subtitle |
| `three-line` | Items with title, subtitle, and additional text |
