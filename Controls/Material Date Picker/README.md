# Material Date Picker Control

Material 3 Design date picker with calendar dialog.

## Tag Name
```
<material-date-picker>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features with proper ARIA attributes, keyboard navigation, and screen reader support.


## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `value` | Value | Selected date value | `""` |
| `dateFormat` | Date Format | Date format: `MM/DD/YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD` | `MM/DD/YYYY` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Field label text | `Select date` |
| `placeholder` | Placeholder | Placeholder text | `MM/DD/YYYY` |
| `helperText` | Helper Text | Helper text below field | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Field style: `outlined`, `filled` | `outlined` |

### Date Constraints

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `minDate` | Min Date | Minimum selectable date (YYYY-MM-DD) | `""` |
| `maxDate` | Max Date | Maximum selectable date (YYYY-MM-DD) | `""` |
| `firstDayOfWeek` | First Day of Week | First day (0=Sunday, 1=Monday) | `0` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Field is required (true/false) | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `backgroundColor` | Background Color | Field background color | `#E7E0EC` |
| `textColor` | Text Color | Main text color | `#1C1B1F` |
| `labelColor` | Label Color | Label text color | `#49454F` |
| `borderColor` | Border Color | Border/outline color | `#79747E` |
| `errorColor` | Error Color | Error state color | `#B3261E` |

### Calendar Dialog Colors

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `surfaceColor` | Surface Color | Dialog surface color | `#FFFBFE` |
| `headerBackgroundColor` | Header Background Color | Calendar header background color | `#EADDFF` |
| `headerTextColor` | Header Text Color | Calendar header text color | `#1D192B` |
| `selectedColor` | Selected Color | Selected date background color | `#6750A4` |
| `selectedTextColor` | Selected Text Color | Selected date text color | `#FFFFFF` |
| `todayColor` | Today Color | Today indicator border color | `#6750A4` |
| `weekdayColor` | Weekday Color | Weekday header text color | `#49454F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the selected date changes |

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Opens the date picker |
| `close()` | Closes the date picker |
| `clear()` | Clears the selected date |

## Usage Example

### Basic Date Picker
```html
<material-date-picker
  label="Birth Date"
  placeholder="Select your birth date">
</material-date-picker>
```

### With Date Format
```html
<material-date-picker
  label="Event Date"
  date-format="YYYY-MM-DD">
</material-date-picker>
```

### With Min/Max Constraints
```html
<material-date-picker
  label="Appointment Date"
  min-date="2024-01-01"
  max-date="2024-12-31">
</material-date-picker>
```

### Filled Variant
```html
<material-date-picker
  variant="filled"
  label="Due Date"
  required="true">
</material-date-picker>
```

### Monday as First Day
```html
<material-date-picker
  label="Week Start"
  first-day-of-week="1">
</material-date-picker>
```

### With Helper Text
```html
<material-date-picker
  label="Start Date"
  helper-text="Select the project start date">
</material-date-picker>
```

### Custom Colors
```html
<material-date-picker
  primary-color="#1976D2"
  selected-color="#1976D2"
  header-background-color="#E3F2FD">
</material-date-picker>
```

## Date Format Options

| Format | Example |
|--------|---------|
| `MM/DD/YYYY` | 12/25/2024 |
| `DD/MM/YYYY` | 25/12/2024 |
| `YYYY-MM-DD` | 2024-12-25 |

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Background Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
```

**Multi-Color Gradient:**
```
Border Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material Date Picker control
2. Find the color property (e.g., "Primary Color", "Background Color", or "Border Color")
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
