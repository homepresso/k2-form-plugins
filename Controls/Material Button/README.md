# Material Button Control

A Material 3 Design button with multiple variants, icons, and ripple effect.

## Tag Name
```
<material-button>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with Enter and Space keys
- **ARIA Attributes**: Proper ARIA implementation
  - `aria-label` for icon-only buttons (configurable)
  - `aria-pressed` for toggle buttons
  - Accessible names for all button states
- **Screen Reader Support**: Icon-only buttons properly labeled for assistive technology
- **Focus Management**: Visible focus indicators with outline
- **Toggle State**: Proper state communication for toggle mode

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for icon-only buttons (WCAG required for icon-only) | Falls back to text or icon |
| `toggleMode` | Toggle Mode | Enable toggle button behavior with aria-pressed | `false` |
| `pressed` | Pressed | Whether the toggle button is in pressed state | `false` |

## Properties

### Content Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `text` | Text | Button text | `Button` |
| `tooltip` | Tooltip | Tooltip text shown on hover | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Button variant: `filled`, `outlined`, `text`, `elevated`, `tonal` | `filled` |
| `size` | Size | Button size: `small`, `medium`, `large` | `medium` |
| `fullWidth` | Full Width | Make button full width of container (true/false) | `false` |

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `leadingIcon` | Leading Icon | Material icon name for leading icon (e.g., 'add', 'send') | `""` |
| `trailingIcon` | Trailing Icon | Material icon name for trailing icon | `""` |
| `iconOnly` | Icon Only | Show only icon without text (true/false) | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `backgroundColor` | Background Color | Button background color | `#6750A4` |
| `primaryColor` | Primary Color | Primary accent color (used for focus states) | `#6750A4` |
| `textColor` | Text Color | Button text color (leave empty for default) | `""` |
| `outlineColor` | Outline Color | Border color for outlined variant | `#79747E` |
| `surfaceColor` | Surface Color | Background color for elevated variant | `#FFFBFE` |
| `iconColor` | Icon Color | Color of leading/trailing icons (leave empty for default) | `""` |
| `hoverColor` | Hover Color | Button hover/focus background color | `""` |

### Behavior Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `disableRipple` | Disable Ripple | Disable ripple effect (true/false) | `false` |
| `loading` | Loading | Show loading spinner (true/false) | `false` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Clicked` | Fires when the button is clicked |

## Methods

| Method | Description |
|--------|-------------|
| `click()` | Programmatically triggers a click |

## Usage Example

### Basic Filled Button
```html
<material-button
  text="Submit"
  variant="filled">
</material-button>
```

### Outlined Button with Icon
```html
<material-button
  text="Add Item"
  variant="outlined"
  leading-icon="add">
</material-button>
```

### Icon Only Button
```html
<material-button
  leading-icon="favorite"
  icon-only="true"
  variant="tonal">
</material-button>
```

### Elevated Button with Custom Colors
```html
<material-button
  text="Download"
  variant="elevated"
  leading-icon="download"
  primary-color="#1976D2"
  background-color="#E3F2FD">
</material-button>
```

### Full Width Loading Button
```html
<material-button
  text="Processing..."
  full-width="true"
  loading="true">
</material-button>
```

## Button Variants

| Variant | Description |
|---------|-------------|
| `filled` | Primary action button with solid background |
| `outlined` | Secondary button with border outline |
| `text` | Low-emphasis button without background |
| `elevated` | Button with shadow/elevation |
| `tonal` | Filled button with subtle tonal color |
