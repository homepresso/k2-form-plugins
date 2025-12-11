# Material Split Button Control

Material 3 Design split button with primary action and dropdown menu.

## Tag Name
```
<material-split-button>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with Escape to close menu
- **ARIA Attributes**: Proper ARIA implementation
  - `aria-label` for primary button (configurable)
  - `aria-label` for dropdown trigger ("More options" by default)
  - `aria-haspopup="menu"` on dropdown trigger
  - `aria-expanded` for menu state (true/false)
- **Screen Reader Support**: Both buttons properly labeled for assistive technology
- **Focus Management**: Visible focus indicators and logical tab order

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for primary button | Falls back to button text |
| `dropdownAriaLabel` | Dropdown ARIA Label | Accessible label for dropdown trigger | "More options" |

## Properties

### Content Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `text` | Text | Primary button text | `Save` |
| `icon` | Icon | Leading icon for primary button (optional) | `""` |

### Menu Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `menuItems` | Menu Items | Dropdown items (pipe-separated, optional icon:label format) | `Save as Draft\|Save and Close\|Save and New` |
| `delimiter` | Delimiter | Character to separate menu items | `\|` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Button style: `filled`, `outlined`, `tonal` | `filled` |
| `disableRipple` | Disable Ripple | Disable the ripple effect | `false` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color | `#6750A4` |
| `textColor` | Text Color | Button text color (leave empty for default) | `""` |
| `outlineColor` | Outline Color | Border color for outlined variant | `#79747E` |
| `surfaceColor` | Surface Color | Surface/menu background color | `#FFFBFE` |
| `surfaceVariantColor` | Surface Variant Color | Background color for tonal variant | `#E7E0EC` |
| `dividerColor` | Divider Color | Color of the divider between buttons | `""` |

### Menu Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `menuBackgroundColor` | Menu Background Color | Custom dropdown menu background color | `""` |
| `menuTextColor` | Menu Text Color | Dropdown menu text color | `#1C1B1F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for the button text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `PrimaryClicked` | Fires when the primary button is clicked |
| `MenuItemClicked` | Fires when a menu item is clicked |

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Open the dropdown menu |
| `close()` | Close the dropdown menu |

## Usage Example

### Basic Split Button
```html
<material-split-button
  text="Save"
  menu-items="Save as Draft|Save and Close|Save and New">
</material-split-button>
```

### With Primary Icon
```html
<material-split-button
  text="Download"
  icon="download"
  menu-items="Download PDF|Download CSV|Download Excel">
</material-split-button>
```

### Outlined Variant
```html
<material-split-button
  variant="outlined"
  text="Export"
  menu-items="Export to PDF|Export to Word|Export to HTML">
</material-split-button>
```

### Tonal Variant
```html
<material-split-button
  variant="tonal"
  text="Share"
  menu-items="share:Share via Email|link:Copy Link|print:Print">
</material-split-button>
```

### Menu Items with Icons
```html
<material-split-button
  text="Actions"
  menu-items="edit:Edit|content_copy:Duplicate|delete:Delete">
</material-split-button>
```

### Custom Colors
```html
<material-split-button
  text="Submit"
  primary-color="#4CAF50"
  text-color="#FFFFFF"
  menu-items="Submit for Review|Submit and Close">
</material-split-button>
```

### Without Ripple Effect
```html
<material-split-button
  text="Options"
  disable-ripple="true"
  menu-items="Option 1|Option 2|Option 3">
</material-split-button>
```

## Menu Item Format

Menu items can include optional icons:

| Format | Example | Description |
|--------|---------|-------------|
| Label only | `Save as Draft` | Text-only menu item |
| Icon:Label | `save:Save as Draft` | Menu item with leading icon |

## Button Variants

| Variant | Description |
|---------|-------------|
| `filled` | Solid background color (primary action) |
| `outlined` | Border outline with transparent background |
| `tonal` | Subtle tonal background color |

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

1. Select the Material Split Button control
2. Find the color property (e.g., "Primary Color" or "Background Color")
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
