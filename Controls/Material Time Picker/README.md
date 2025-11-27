# Material Time Picker Control

Material 3 Design time picker with clock dial interface.

## Tag Name
```
<material-time-picker>
```

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
