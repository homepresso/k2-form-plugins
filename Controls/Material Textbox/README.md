# Material Textbox Control

A Material 3 Design textbox with floating labels, icons, helper text, and validation support.

## Tag Name
```
<material-textbox>
```

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
