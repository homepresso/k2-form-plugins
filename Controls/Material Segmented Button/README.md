# Material Segmented Button Control

Material 3 Design segmented button for selecting from a set of options.

## Tag Name
```
<material-segmented-button>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for segment selection
  - Arrow keys (Left/Right/Up/Down) to navigate between segments
  - Home key to jump to first segment
  - End key to jump to last segment
  - Circular wrapping for seamless navigation
- **ARIA Attributes**: Proper ARIA implementation
  - `role="group"` on container
  - `aria-pressed` on each segment to indicate selected state
  - Accessible names for all segments
- **Screen Reader Support**: Selection state properly announced
- **Focus Management**: Visible focus indicators and logical focus order

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

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Selected Background Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
```

**Multi-Color Gradient:**
```
Primary Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
```

### Popular Gradient Combinations

**Sunset:**
```
linear-gradient(to right, #ff512f 0%, #dd2476 100%)
```

**Ocean Blue:**
```
linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)
```

**Green Beach:**
```
linear-gradient(to right, #02aab0 0%, #00cdac 100%)
```

**Soft Pink:**
```
linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)
```

### How to Apply

In K2 SmartForms, simply paste the gradient CSS directly into any color property:

1. Select the Material Segmented Button control
2. Find the color property (e.g., "Primary Color" or "Selected Background Color")
3. Paste the gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Advanced Techniques

**Diagonal Gradient:**
```
linear-gradient(45deg, #fa709a 0%, #fee140 100%)
```

**Gradient with Transparency:**
```
linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))
```

**Animated Gradient Effect:**
```
linear-gradient(45deg, #ff6b6b, #ee5a6f, #f06595, #cc5de8)
```

All modern browsers support CSS gradients (Chrome, Firefox, Edge, Safari).
