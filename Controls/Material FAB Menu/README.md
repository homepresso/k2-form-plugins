# Material FAB Menu Control

Material 3 Design Floating Action Button with expandable menu.

## Tag Name
```
<material-fab-menu>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with Escape to close menu
- **ARIA Attributes**: Proper ARIA implementation
  - `aria-label` for main FAB button (configurable)
  - `aria-haspopup="menu"` to indicate expandable menu
  - `aria-expanded` for menu state (true/false)
  - `aria-label` on each menu action button
- **Screen Reader Support**: All menu items properly labeled for assistive technology
- **Focus Management**: Visible focus indicators and returns focus to trigger after menu closes

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for main FAB button (WCAG required) | Falls back to label or "Menu" |

## Properties

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `icon` | Icon | Main FAB icon (e.g., 'add', 'edit', 'menu') | `add` |
| `openIcon` | Open Icon | Icon to show when menu is open | `close` |

### Size and Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `size` | Size | FAB size: `small`, `regular`, `large` | `regular` |
| `variant` | Variant | Color variant: `primary`, `secondary`, `tertiary`, `surface` | `primary` |
| `position` | Position | Menu alignment: `bottom-right`, `bottom-left`, `bottom-center` | `bottom-right` |

### Extended FAB Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Label text for extended FAB | `""` |
| `extended` | Extended | Show as extended FAB with label | `false` |

### Menu Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `menuItems` | Menu Items | Menu items (icon:label format, pipe-separated) | `edit:Edit\|delete:Delete\|share:Share` |
| `delimiter` | Delimiter | Character to separate menu items | `\|` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary color for the FAB | `#6750A4` |
| `containerColor` | Container Color | Background color of the FAB | `""` |
| `iconColor` | Icon Color | Color of the icon | `#FFFFFF` |
| `secondaryColor` | Secondary Color | Secondary variant color | `#625B71` |
| `tertiaryColor` | Tertiary Color | Tertiary variant color | `#7D5260` |
| `surfaceColor` | Surface Color | Surface variant background color | `#FFFBFE` |

### Menu Item Colors

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `menuItemBackgroundColor` | Menu Item Background | Background color of mini FAB menu items | `""` |
| `menuItemIconColor` | Menu Item Icon Color | Icon color of mini FAB menu items | `""` |
| `menuLabelBackgroundColor` | Menu Label Background | Background color of menu labels | `""` |
| `menuLabelTextColor` | Menu Label Text Color | Text color of menu labels | `#1C1B1F` |

## Events

| Event | Description |
|-------|-------------|
| `Clicked` | Fires when the FAB is clicked (no menu items) |
| `ItemClicked` | Fires when a menu item is clicked |

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Open the menu |
| `close()` | Close the menu |
| `toggle()` | Toggle the menu open/closed |

## Usage Example

### Basic FAB with Menu
```html
<material-fab-menu
  icon="add"
  menu-items="edit:Edit|delete:Delete|share:Share">
</material-fab-menu>
```

### Extended FAB
```html
<material-fab-menu
  icon="add"
  extended="true"
  label="Create New"
  menu-items="note:Note|reminder:Reminder|task:Task">
</material-fab-menu>
```

### Large FAB with Custom Colors
```html
<material-fab-menu
  size="large"
  primary-color="#1976D2"
  icon-color="#FFFFFF"
  icon="menu">
</material-fab-menu>
```

### Secondary Variant
```html
<material-fab-menu
  variant="secondary"
  icon="more_vert"
  menu-items="settings:Settings|help:Help|logout:Logout">
</material-fab-menu>
```

### Surface Variant (Light)
```html
<material-fab-menu
  variant="surface"
  icon="add"
  menu-items="photo:Photo|video:Video|file:File">
</material-fab-menu>
```

### Simple FAB (No Menu)
```html
<material-fab-menu
  icon="add"
  menu-items="">
</material-fab-menu>
```

## FAB Sizes

| Size | Description |
|------|-------------|
| `small` | Compact FAB for tight spaces |
| `regular` | Standard FAB size (56dp) |
| `large` | Larger FAB for emphasis (96dp) |

## FAB Variants

| Variant | Description |
|---------|-------------|
| `primary` | Primary brand color |
| `secondary` | Secondary brand color |
| `tertiary` | Tertiary accent color |
| `surface` | Light surface color with tinted icon |

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
Container Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material FAB Menu control
2. Find the color property (e.g., "Primary Color" or "Container Color")
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
