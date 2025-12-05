# Material Icon Control

Displays a Material Design icon with customizable icon name, size, and color.

## Tag Name
```
<material-icon>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Smart ARIA Handling**: Automatically adapts based on usage context
  - **Decorative icons** (non-clickable, no label): `aria-hidden="true"` to hide from screen readers
  - **Interactive icons** (clickable): `aria-label`, `role="button"`, keyboard support
  - **Labeled icons**: `aria-label` with `role="img"` for semantic meaning
- **Keyboard Navigation**: Enter and Space key support for clickable icons
- **Screen Reader Support**: Proper labeling based on icon purpose
- **Focus Management**: Visible focus indicators for interactive icons

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for interactive or semantic icons (WCAG required for clickable icons) | Falls back to tooltip or icon name |

## Properties

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `iconName` | Icon Name | The Material Icon name (e.g., 'home', 'settings', 'search', 'check_circle') | `home` |
| `iconStyle` | Icon Style | Material Icon style variant: `outlined`, `rounded`, `sharp`, or `filled` (default) | `filled` |

### Size Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `iconSize` | Icon Size | Size of the icon in pixels | `24` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `iconColor` | Icon Color | Color of the icon (CSS color value) | `#6b7280` |
| `hoverColor` | Hover Color | Color of the icon on hover (leave empty to disable hover effect) | `""` |

### Interaction Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `clickable` | Clickable | Whether the icon is clickable (true/false) | `false` |
| `tooltip` | Tooltip | Tooltip text shown on hover | `""` |

## Events

| Event | Description |
|-------|-------------|
| `Clicked` | Fires when the icon is clicked |

## Usage Example

### Basic Icon
```html
<material-icon
  icon-name="home"
  icon-size="24">
</material-icon>
```

### Large Colored Icon
```html
<material-icon
  icon-name="favorite"
  icon-size="48"
  icon-color="#E91E63">
</material-icon>
```

### Outlined Style Icon
```html
<material-icon
  icon-name="settings"
  icon-style="outlined"
  icon-size="32">
</material-icon>
```

### Clickable Icon with Tooltip
```html
<material-icon
  icon-name="info"
  clickable="true"
  tooltip="Click for more information"
  hover-color="#1976D2">
</material-icon>
```

### Rounded Style Icon
```html
<material-icon
  icon-name="search"
  icon-style="rounded"
  icon-color="#4CAF50">
</material-icon>
```

### Sharp Style Icon
```html
<material-icon
  icon-name="delete"
  icon-style="sharp"
  icon-color="#F44336">
</material-icon>
```

## Icon Styles

| Style | Description |
|-------|-------------|
| `filled` | Solid filled icons (default) |
| `outlined` | Icons with outline stroke |
| `rounded` | Icons with rounded corners |
| `sharp` | Icons with sharp corners |

## Finding Icon Names

You can browse all available Material Icons at:
- [Google Material Icons](https://fonts.google.com/icons)

Common icon examples:
- Navigation: `home`, `menu`, `arrow_back`, `close`
- Actions: `search`, `add`, `edit`, `delete`, `save`
- Communication: `email`, `phone`, `chat`, `notifications`
- Content: `favorite`, `bookmark`, `share`, `star`
- Files: `folder`, `file_copy`, `upload`, `download`
- Social: `person`, `group`, `public`, `share`
