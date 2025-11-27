# Material Switch Control

Material 3 Design toggle switch with label, icons, and smooth animations.

## Tag Name
```
<material-switch>
```

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
