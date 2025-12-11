# Material Time Picker Control

Material 3 Design time picker with clock dial interface.

## Tag Name
```
<material-time-picker>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features with proper ARIA attributes, keyboard navigation, and screen reader support.


## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `value` | Value | Selected time value (HH:MM or HH:MM AM/PM) | `""` |
| `format` | Format | Time format: `12h` or `24h` | `12h` |
| `minuteStep` | Minute Step | Minute increment (1, 5, 10, 15, 30) | `1` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Field label text | `Time` |
| `placeholder` | Placeholder | Placeholder text when empty | `Select time` |
| `helperText` | Helper Text | Helper text displayed below the field | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Input style: `outlined` or `filled` | `outlined` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Whether the field is required | `false` |
| `hasError` | Has Error | Whether the field has an error | `false` |
| `errorText` | Error Text | Error message displayed when hasError is true | `""` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color | `#6750A4` |
| `backgroundColor` | Background Color | Input background color | `""` |
| `textColor` | Text Color | Text color | `#1C1B1F` |
| `labelColor` | Label Color | Label text color | `#49454F` |
| `borderColor` | Border Color | Border/outline color | `#79747E` |
| `errorColor` | Error Color | Error state color | `#B3261E` |

### Clock Dialog Colors

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `surfaceColor` | Surface Color | Dialog surface color | `#FFFBFE` |
| `dialColor` | Dial Color | Clock dial background color | `#EADDFF` |
| `dialTextColor` | Dial Text Color | Clock dial numbers color | `#1D192B` |
| `selectedColor` | Selected Color | Selected time indicator color | `#6750A4` |
| `selectedTextColor` | Selected Text Color | Selected number text color | `#FFFFFF` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the time value changes |

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Open the time picker dialog |
| `close()` | Close the time picker dialog |
| `clear()` | Clear the selected time |

## Usage Example

### Basic Time Picker
```html
<material-time-picker
  label="Start Time"
  placeholder="Select start time">
</material-time-picker>
```

### 24-Hour Format
```html
<material-time-picker
  label="Meeting Time"
  format="24h">
</material-time-picker>
```

### 15-Minute Intervals
```html
<material-time-picker
  label="Appointment"
  minute-step="15"
  helper-text="Available in 15-minute slots">
</material-time-picker>
```

### Filled Variant
```html
<material-time-picker
  variant="filled"
  label="Reminder Time">
</material-time-picker>
```

### Required with Error
```html
<material-time-picker
  label="Departure Time"
  required="true"
  has-error="true"
  error-text="Please select a departure time">
</material-time-picker>
```

### With Pre-selected Value
```html
<material-time-picker
  label="Alarm"
  value="7:30 AM"
  format="12h">
</material-time-picker>
```

### Custom Colors
```html
<material-time-picker
  label="Event Time"
  primary-color="#1976D2"
  dial-color="#E3F2FD"
  selected-color="#1976D2">
</material-time-picker>
```

### 30-Minute Intervals in 24h Format
```html
<material-time-picker
  label="Schedule"
  format="24h"
  minute-step="30">
</material-time-picker>
```

## Time Formats

| Format | Example Output |
|--------|----------------|
| `12h` | 2:30 PM |
| `24h` | 14:30 |

## Minute Step Options

| Step | Description |
|------|-------------|
| `1` | Every minute (default) |
| `5` | 5-minute intervals |
| `10` | 10-minute intervals |
| `15` | Quarter-hour intervals |
| `30` | Half-hour intervals |

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

1. Select the Material Time Picker control
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
