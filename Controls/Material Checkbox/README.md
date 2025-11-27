# Material Checkbox Control

Material 3 Design checkbox with label, indeterminate state, and ripple effect.

## Tag Name
```
<material-checkbox>
```

## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `checked` | Checked | Whether the checkbox is checked | `false` |
| `indeterminate` | Indeterminate | Show indeterminate (mixed) state | `false` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Label text displayed next to the checkbox | `Checkbox` |
| `labelPosition` | Label Position | Position of the label: `start` or `end` | `end` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Mark the checkbox as required | `false` |
| `hasError` | Has Error | Show error state | `false` |
| `errorText` | Error Text | Error message to display | `""` |

### Behavior Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `disableRipple` | Disable Ripple | Disable the ripple effect on click | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary color for the checkbox when checked | `#6750A4` |
| `checkColor` | Check Color | Color of the checkmark icon | `#FFFFFF` |
| `borderColor` | Border Color | Border color when unchecked | `#79747E` |
| `labelColor` | Label Color | Color of the label text | `#1C1B1F` |
| `errorColor` | Error Color | Color used for error state | `#B3261E` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the checkbox state changes |

## Methods

| Method | Description |
|--------|-------------|
| `toggle()` | Toggle the checkbox state |
| `check()` | Set the checkbox to checked |
| `uncheck()` | Set the checkbox to unchecked |

## Usage Example

### Basic Checkbox
```html
<material-checkbox
  label="Accept terms and conditions"
  checked="false">
</material-checkbox>
```

### Required Checkbox with Error
```html
<material-checkbox
  label="I agree to the privacy policy"
  required="true"
  has-error="true"
  error-text="You must accept the privacy policy">
</material-checkbox>
```

### Indeterminate State
```html
<material-checkbox
  label="Select All"
  indeterminate="true">
</material-checkbox>
```

### Label on Left Side
```html
<material-checkbox
  label="Enable notifications"
  label-position="start">
</material-checkbox>
```

### Custom Colors
```html
<material-checkbox
  label="Custom styled"
  primary-color="#1976D2"
  check-color="#FFFFFF"
  border-color="#64B5F6">
</material-checkbox>
```

### Without Ripple Effect
```html
<material-checkbox
  label="No ripple effect"
  disable-ripple="true">
</material-checkbox>
```

## Checkbox States

| State | Description |
|-------|-------------|
| Unchecked | Default empty state |
| Checked | Selected state with checkmark |
| Indeterminate | Mixed state (dash icon) - useful for "select all" scenarios |
| Disabled | Non-interactive state (via IsEnabled support) |
| Error | Shows error styling and message |
