# Material Slider Control

Material 3 Design slider for selecting values from a range.

## Tag Name
```
<material-slider>
```

## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `value` | Value | Current slider value | `50` |
| `min` | Min | Minimum value | `0` |
| `max` | Max | Maximum value | `100` |
| `step` | Step | Step increment | `1` |

### Range Mode Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `rangeMode` | Range Mode | Enable range selection (true/false) | `false` |
| `valueStart` | Value Start | Start value (range mode) | `25` |
| `valueEnd` | Value End | End value (range mode) | `75` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Label text above slider | `""` |
| `showValue` | Show Value | Show value display (true/false) | `true` |
| `showTicks` | Show Ticks | Show tick marks (true/false) | `false` |
| `discrete` | Discrete | Enable discrete mode (true/false) | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `trackColor` | Track Color | Inactive track color | `#E7E0EC` |
| `trackActiveColor` | Track Active Color | Active track color | `""` |
| `thumbColor` | Thumb Color | Thumb handle color | `""` |
| `labelColor` | Label Color | Label text color | `#49454F` |
| `valueColor` | Value Color | Value display text color | `#1C1B1F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the slider value changes |

## Usage Example

### Basic Slider
```html
<material-slider
  label="Volume"
  min="0"
  max="100"
  value="50">
</material-slider>
```

### Slider with Steps
```html
<material-slider
  label="Rating"
  min="1"
  max="5"
  step="1"
  value="3"
  discrete="true"
  show-ticks="true">
</material-slider>
```

### Range Slider
```html
<material-slider
  label="Price Range"
  range-mode="true"
  min="0"
  max="1000"
  value-start="200"
  value-end="800">
</material-slider>
```

### Slider with Custom Step
```html
<material-slider
  label="Temperature"
  min="60"
  max="90"
  step="0.5"
  value="72">
</material-slider>
```

### Discrete Slider with Ticks
```html
<material-slider
  label="Quality"
  min="0"
  max="10"
  step="1"
  discrete="true"
  show-ticks="true">
</material-slider>
```

### Without Value Display
```html
<material-slider
  min="0"
  max="100"
  show-value="false">
</material-slider>
```

### Custom Colors
```html
<material-slider
  label="Progress"
  primary-color="#4CAF50"
  track-color="#E8F5E9"
  track-active-color="#4CAF50"
  value="65">
</material-slider>
```

### Percentage Slider
```html
<material-slider
  label="Opacity"
  min="0"
  max="100"
  step="5"
  value="100"
  show-value="true">
</material-slider>
```

## Slider Modes

| Mode | Description |
|------|-------------|
| Continuous | Smooth sliding without steps |
| Discrete | Snaps to defined step values |
| Range | Two handles for selecting a range |

## Tips

- Use `discrete="true"` with `step` for integer-only values
- Use `show-ticks="true"` to visualize step increments
- Range mode provides `valueStart` and `valueEnd` outputs
- The value updates continuously as the user drags the slider
