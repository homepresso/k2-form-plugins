# Material Textbox Control

A Material 3 Design textbox with floating labels, icons, helper text, and validation support.

## Tag Name
```
<material-textbox>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for text input
- **ARIA Attributes**: Complete ARIA implementation for form accessibility
  - `aria-label` for accessible field names (configurable)
  - `aria-required` for required fields
  - `aria-invalid` for validation errors
  - `aria-describedby` linking to helper text and error messages
- **Screen Reader Support**: All labels, hints, and errors properly announced
- **Form Validation**: Proper error state communication to assistive technology
- **Label Associations**: Floating label with accessible text

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for screen readers (WCAG required) | Falls back to label text |

## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `Value` | Value | The text value of the textbox | `""` |
| `inputType` | Input Type | Input type: `text`, `password`, `email`, `number`, `tel`, `url`, `search` | `text` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Floating label text | `Label` |
| `placeholder` | Placeholder | Placeholder text when empty | `""` |
| `helperText` | Helper Text | Helper text displayed below the textbox | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Style variant: `filled`, `outlined` | `outlined` |
| `controlHeight` | Height | Height of the input field in pixels | `56` |
| `controlPadding` | Padding | Padding around the control in pixels | `8` |

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `leadingIcon` | Leading Icon | Material icon name for leading icon (e.g., 'search', 'person') | `""` |
| `trailingIcon` | Trailing Icon | Material icon name for trailing icon (e.g., 'clear', 'visibility') | `""` |
| `trailingIconClickable` | Trailing Icon Clickable | Make trailing icon clickable (true/false) | `false` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Mark field as required (true/false) | `false` |
| `hasError` | Has Error | Show error state (true/false) | `false` |
| `errorText` | Error Text | Error message displayed when hasError is true | `""` |
| `pattern` | Pattern | Regex pattern for validation | `""` |
| `maxLength` | Max Length | Maximum character length (0 for unlimited) | `0` |
| `showCharCount` | Show Character Count | Show character count (true/false) | `false` |

### Browser Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `autocomplete` | Autocomplete | Browser autocomplete attribute (on, off, email, username, etc.) | `off` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color for focus state | `#6750A4` |
| `textColor` | Text Color | Color of the input text | `#1C1B1F` |
| `labelColor` | Label Color | Color of the floating label | `#49454F` |
| `borderColor` | Border Color | Color of the border/outline | `#79747E` |
| `backgroundColor` | Background Color | Background color (for filled variant) | `#E7E0EC` |
| `errorColor` | Error Color | Color used for error state | `#B3261E` |
| `iconColor` | Icon Color | Color of the leading/trailing icons | `#49454F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |
| `fontSize` | Font Size | Font size in pixels | `16` |
| `fontWeight` | Font Weight | Font weight: normal, bold, 100-900 | `normal` |
| `fontStyle` | Font Style | Font style: normal, italic | `normal` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the textbox value changes |
| `Focus` | Fires when the textbox receives focus |
| `Blur` | Fires when the textbox loses focus |
| `OnEnter` | Fires when Enter key is pressed |
| `IconClicked` | Fires when the icon is clicked |

## Methods

| Method | Description |
|--------|-------------|
| `focus()` | Sets focus to the textbox |
| `clear()` | Clears the textbox value |
| `validate()` | Triggers validation and updates error state |

## Usage Example

### Basic Textbox
```html
<material-textbox
  label="Full Name"
  placeholder="Enter your full name">
</material-textbox>
```

### Email Input with Validation
```html
<material-textbox
  label="Email"
  input-type="email"
  leading-icon="email"
  required="true"
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
</material-textbox>
```

### Password Input
```html
<material-textbox
  label="Password"
  input-type="password"
  trailing-icon="visibility"
  trailing-icon-clickable="true">
</material-textbox>
```

### Search Input
```html
<material-textbox
  label="Search"
  input-type="search"
  leading-icon="search"
  trailing-icon="clear"
  trailing-icon-clickable="true">
</material-textbox>
```

### Filled Variant with Helper Text
```html
<material-textbox
  variant="filled"
  label="Username"
  helper-text="Choose a unique username">
</material-textbox>
```

### With Character Count
```html
<material-textbox
  label="Bio"
  max-length="150"
  show-char-count="true"
  helper-text="Brief description about yourself">
</material-textbox>
```

### Error State
```html
<material-textbox
  label="Email"
  has-error="true"
  error-text="Please enter a valid email address">
</material-textbox>
```

### Phone Number Input
```html
<material-textbox
  label="Phone"
  input-type="tel"
  leading-icon="phone"
  placeholder="(555) 123-4567">
</material-textbox>
```

### Custom Styled
```html
<material-textbox
  label="Custom"
  primary-color="#1976D2"
  font-family="Poppins, sans-serif"
  font-size="18">
</material-textbox>
```

## Input Types

| Type | Description |
|------|-------------|
| `text` | Standard text input |
| `password` | Hidden password input |
| `email` | Email with validation |
| `number` | Numeric input |
| `tel` | Telephone number |
| `url` | URL input |
| `search` | Search input with clear button |

## Textbox Variants

| Variant | Description |
|---------|-------------|
| `outlined` | Border outline with floating label |
| `filled` | Solid background with floating label |

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

1. Select the Material Textbox control
2. Find the color property (e.g., "Primary Color", "Background Color", or "Border Color")
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
