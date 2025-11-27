# Material Split Button Control

Material 3 Design split button with primary action and dropdown menu.

## Tag Name
```
<material-split-button>
```

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
