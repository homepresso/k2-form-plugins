# Material Switch Control

Material 3 Design toggle switch with label, icons, and smooth animations.

## Tag Name
```
<material-switch>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features with proper ARIA attributes, keyboard navigation, and screen reader support.


## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `checked` | Checked | Whether the switch is on | `false` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Label text displayed next to the switch | `Switch` |
| `labelPosition` | Label Position | Position of the label: `start` or `end` | `end` |
| `helperText` | Helper Text | Helper text displayed below the switch | `""` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showIcons` | Show Icons | Show check and X icons inside the switch thumb | `true` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Mark the switch as required | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary color for the switch when on | `#6750A4` |
| `thumbColor` | Thumb Color | Color of the switch thumb when on | `#FFFFFF` |
| `trackColor` | Track Color | Background color of the switch track when off | `#E7E0EC` |
| `borderColor` | Border Color | Border color of the switch track when off | `#79747E` |
| `labelColor` | Label Color | Color of the label text | `#1C1B1F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the switch state changes |

## Methods

| Method | Description |
|--------|-------------|
| `toggle()` | Toggle the switch state |
| `turnOn()` | Set the switch to on |
| `turnOff()` | Set the switch to off |

## Usage Example

### Basic Switch
```html
<material-switch
  label="Enable notifications"
  checked="false">
</material-switch>
```

### Switch On by Default
```html
<material-switch
  label="Dark mode"
  checked="true">
</material-switch>
```

### Label on Left Side
```html
<material-switch
  label="Airplane mode"
  label-position="start">
</material-switch>
```

### Without Icons
```html
<material-switch
  label="Simple switch"
  show-icons="false">
</material-switch>
```

### With Helper Text
```html
<material-switch
  label="Auto-save"
  helper-text="Automatically save changes every 5 minutes">
</material-switch>
```

### Required Switch
```html
<material-switch
  label="I accept the terms and conditions"
  required="true">
</material-switch>
```

### Custom Colors
```html
<material-switch
  label="Custom styled"
  primary-color="#4CAF50"
  thumb-color="#FFFFFF"
  track-color="#C8E6C9">
</material-switch>
```

### Settings List Example
```html
<material-switch label="Wi-Fi" checked="true"></material-switch>
<material-switch label="Bluetooth" checked="false"></material-switch>
<material-switch label="Location" checked="true"></material-switch>
<material-switch label="Do Not Disturb" checked="false"></material-switch>
```

## Switch States

| State | Description |
|-------|-------------|
| Off | Track shows border, thumb is on the left |
| On | Track is filled with primary color, thumb is on the right |
| Disabled | Reduced opacity, non-interactive (via IsEnabled support) |

## Comparison with Checkbox

| Feature | Switch | Checkbox |
|---------|--------|----------|
| Use case | Settings, preferences, on/off states | Forms, multiple selections |
| Immediate effect | Yes - changes apply immediately | No - typically requires form submission |
| Label | Always present | Optional |
| State | Binary (on/off) | Can be indeterminate |

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Track Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
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

1. Select the Material Switch control
2. Find the color property (e.g., "Primary Color" or "Track Color")
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
