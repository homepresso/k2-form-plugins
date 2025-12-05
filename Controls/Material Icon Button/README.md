# Material Icon Button Control

Material 3 Design icon button with standard, filled, tonal, and outlined variants.

## Tag Name
```
<material-icon-button>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with Enter and Space keys
- **ARIA Attributes**: Proper ARIA implementation
  - `aria-label` for accessible button names (configurable)
  - `aria-pressed` for toggle button state
  - Smart defaults: uses aria-label → tooltip → icon name
- **Screen Reader Support**: Icon-only buttons properly labeled for assistive technology
- **Focus Management**: Visible focus indicators with outline
- **Color Adaptability**: Dynamic color mixing ensures visibility on any background

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for screen readers (WCAG required) | Falls back to tooltip or icon name |

## Properties

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `icon` | Icon | Material icon name (e.g., 'favorite', 'bookmark', 'share') | `favorite` |
| `selectedIcon` | Selected Icon | Icon to show when selected (optional) | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Button style: `standard`, `filled`, `tonal`, `outlined` | `standard` |
| `size` | Size | Button size: `small`, `medium`, `large` | `medium` |

### Toggle Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `toggle` | Toggle | Enable toggle behavior | `false` |
| `selected` | Selected | Whether the button is selected (for toggle mode) | `false` |

### Interaction Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `tooltip` | Tooltip | Tooltip text on hover | `""` |
| `disableRipple` | Disable Ripple | Disable the ripple effect | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color | `#6750A4` |
| `iconColor` | Icon Color | Color of the icon | `#49454F` |
| `containerColor` | Container Color | Background color (for filled/tonal variants) | `""` |
| `outlineColor` | Outline Color | Border color (for outlined variant) | `#79747E` |
| `surfaceVariantColor` | Surface Variant Color | Surface variant color for tonal backgrounds | `#E7E0EC` |

### Selected State Colors

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `selectedContainerColor` | Selected Container Color | Background color when selected | `""` |
| `selectedIconColor` | Selected Icon Color | Icon color when selected | `#FFFFFF` |

## Events

| Event | Description |
|-------|-------------|
| `Clicked` | Fires when the icon button is clicked |

## Usage Example

### Standard Icon Button
```html
<material-icon-button
  icon="favorite"
  tooltip="Add to favorites">
</material-icon-button>
```

### Filled Icon Button
```html
<material-icon-button
  icon="add"
  variant="filled"
  primary-color="#1976D2">
</material-icon-button>
```

### Outlined Icon Button
```html
<material-icon-button
  icon="bookmark"
  variant="outlined"
  outline-color="#79747E">
</material-icon-button>
```

### Tonal Icon Button
```html
<material-icon-button
  icon="share"
  variant="tonal">
</material-icon-button>
```

### Toggle Icon Button
```html
<material-icon-button
  icon="favorite_border"
  selected-icon="favorite"
  toggle="true"
  selected="false">
</material-icon-button>
```

### Large Icon Button
```html
<material-icon-button
  icon="play_arrow"
  size="large"
  variant="filled">
</material-icon-button>
```

### Custom Colors
```html
<material-icon-button
  icon="star"
  icon-color="#FFC107"
  variant="standard">
</material-icon-button>
```

## Icon Button Variants

| Variant | Description |
|---------|-------------|
| `standard` | No background, icon only |
| `filled` | Solid background color |
| `tonal` | Subtle tonal background |
| `outlined` | Border outline with transparent background |

## Icon Button Sizes

| Size | Description |
|------|-------------|
| `small` | 24dp icon button |
| `medium` | 40dp icon button (default) |
| `large` | 48dp icon button |
