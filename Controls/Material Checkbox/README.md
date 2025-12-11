# Material Checkbox Control

Material 3 Design checkbox with label, indeterminate state, and ripple effect.

## Tag Name
```
<material-checkbox>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features with proper ARIA attributes, keyboard navigation, and screen reader support.


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

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Primary Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
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

1. Select the Material Checkbox control
2. Find the color property (e.g., "Primary Color" or "Border Color")
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
