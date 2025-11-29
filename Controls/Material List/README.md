# Material List Control

Material 3 Design list for displaying items with icons and avatars. Supports checkbox mode for multi-selection and K2 SmartObject data binding.

## Tag Name
```
<material-list>
```

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding through the `List Data` property (type: `listdata`).

### Setting Up Data Binding in K2 Designer

1. Add the Material List control to your form
2. In the control properties, find **List Data** under the Detail category
3. Click the binding icon and select your SmartObject
4. Map the SmartObject fields to the control's expected fields:
   - **Icon** → Your icon field (Material icon name or image URL)
   - **Title** or **Display** → Your display text field
   - **Subtitle** or **Description** → Your secondary text field
   - **Value** → Your unique identifier field
   - **Checked** or **IsChecked** → Your boolean checked state field (for checkbox mode)

### Expected Data Model

When binding to a SmartObject, the control looks for these field mappings (in order of priority):

| Control Field | SmartObject Field Options | Type | Description |
|--------------|---------------------------|------|-------------|
| Icon | `Icon`, `Image`, `icon`, `image` | String | Material icon name (e.g., "inbox", "star") or image URL |
| Title | `Title`, `Display`, `title`, `name`, `text` | String | Primary list item text |
| Subtitle | `Subtitle`, `Description`, `subtitle`, `description` | String | Secondary list item text |
| Value | `Value`, `value`, `id`, `Id`, `ID` | String | Unique identifier for the item |
| Checked | `Checked`, `IsChecked`, `Selected`, `checked` | Boolean | Pre-checked state (for checkbox mode) |

### Example SmartObject Data

#### Basic List Data
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
  },
  {
    "icon": "send",
    "title": "Sent",
    "subtitle": "24 messages",
    "value": "sent"
  }
]
```

#### Checkbox List Data (with pre-checked items)
```json
[
  {
    "icon": "task",
    "title": "Complete report",
    "subtitle": "Due tomorrow",
    "value": "task1",
    "checked": true
  },
  {
    "icon": "task",
    "title": "Review code",
    "subtitle": "Priority: High",
    "value": "task2",
    "checked": false
  },
  {
    "icon": "task",
    "title": "Send email",
    "subtitle": "To: Team",
    "value": "task3",
    "checked": true
  }
]
```

### Alternative Field Names

The control is flexible and will recognize common field naming conventions:

| Expected | Also Accepts |
|----------|-------------|
| `icon` | `Icon`, `image`, `Image` |
| `title` | `Title`, `name`, `Name`, `text`, `Text` |
| `subtitle` | `Subtitle`, `description`, `Description` |
| `value` | `Value`, `id`, `Id`, `ID` |
| `checked` | `Checked`, `IsChecked`, `Selected` |

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
| `checkboxPosition` | Checkbox Position | Position of checkbox: `left`, `right` | `left` |

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

### Checkbox List (Left Position - Default)
```html
<material-list
  checkbox-mode="true"
  items="task1:Complete report::task1|task2:Review code::task2|task3:Send email::task3">
</material-list>
```

### Checkbox List (Right Position)
```html
<material-list
  checkbox-mode="true"
  checkbox-position="right"
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
  variant="two-line"
  selectable="true">
</material-list>
```
*Note: Bind your SmartObject to the "List Data" property in the K2 Designer*

### Checkbox List with K2 Data Binding
```html
<material-list
  checkbox-mode="true"
  checkbox-position="right"
  variant="two-line">
</material-list>
```
*Note: Include a `Checked` boolean field in your SmartObject to pre-check items*

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
