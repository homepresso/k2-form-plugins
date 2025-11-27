# Material Segmented Button Control

Material 3 Design segmented button for selecting from a set of options.

## Tag Name
```
<material-segmented-button>
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `segments` | Segments | Delimited list of segment labels (format: icon:label:value) | `Day\|Week\|Month\|Year` |
| `delimiter` | Delimiter | Character used to separate segments | `\|` |
| `value` | Value | Currently selected segment value | `""` |

### Behavior Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `multiSelect` | Multi Select | Enable multiple segment selection (true/false) | `false` |
| `showCheckmark` | Show Checkmark | Show checkmark on selected segments (true/false) | `true` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `density` | Density | Button density: `default`, `comfortable`, `compact` | `default` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/focus color | `#6750A4` |
| `borderColor` | Border Color | Border/outline color | `#79747E` |
| `selectedBackgroundColor` | Selected Background | Background color for selected segments | `#E8DEF8` |
| `textColor` | Text Color | Text/label color | `#1C1B1F` |
| `selectedTextColor` | Selected Text Color | Text color for selected segments | `#1D192B` |
| `iconColor` | Icon Color | Color of icons | `""` |
| `checkmarkColor` | Checkmark Color | Color of selection checkmark | `""` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for labels | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the selection changes |

## Methods

| Method | Description |
|--------|-------------|
| `selectSegment()` | Selects a segment by value |
| `clearSelection()` | Clears all selections |

## Usage Example

### Basic Segmented Button
```html
<material-segmented-button
  segments="Day|Week|Month|Year"
  value="Week">
</material-segmented-button>
```

### With Icons
```html
<material-segmented-button
  segments="view_list:List:list|grid_view:Grid:grid|view_module:Cards:cards">
</material-segmented-button>
```

### Multi-Select
```html
<material-segmented-button
  segments="Bold|Italic|Underline"
  multi-select="true">
</material-segmented-button>
```

### Compact Density
```html
<material-segmented-button
  segments="S|M|L|XL"
  density="compact">
</material-segmented-button>
```

### Without Checkmarks
```html
<material-segmented-button
  segments="Option 1|Option 2|Option 3"
  show-checkmark="false">
</material-segmented-button>
```

### Custom Colors
```html
<material-segmented-button
  segments="Light|Dark|System"
  primary-color="#1976D2"
  selected-background-color="#BBDEFB"
  selected-text-color="#0D47A1">
</material-segmented-button>
```

### Icon Only Segments
```html
<material-segmented-button
  segments="format_align_left::left|format_align_center::center|format_align_right::right">
</material-segmented-button>
```

## Segment Format

Segments can be defined in several ways:

| Format | Example | Description |
|--------|---------|-------------|
| Label only | `Day\|Week\|Month` | Simple text labels |
| Icon:Label:Value | `star:Favorites:fav` | Icon with label and value |
| Icon::Value | `home::home` | Icon only with value |

## Density Options

| Density | Description |
|---------|-------------|
| `default` | Standard button height and padding |
| `comfortable` | Slightly reduced padding |
| `compact` | Minimal padding for tight spaces |
