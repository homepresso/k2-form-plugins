# Material Select Control

Material 3 Design dropdown/select with outlined and filled variants.

## Tag Name
```
<material-select>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, Space, and Escape
- **ARIA Attributes**: Complete ARIA combobox pattern implementation
  - `role="combobox"` on select field
  - `role="listbox"` on dropdown menu
  - `role="option"` on menu items
  - `aria-expanded` for menu state
  - `aria-haspopup="listbox"` for menu indicator
  - `aria-selected` for selected options
- **Screen Reader Support**: All elements properly labeled for assistive technology
- **Focus Management**: Visible focus indicators and logical focus order

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding. Add `"DataBinding"` to your supports configuration.

### List Data Binding (Recommended)

The control now supports proper K2 list binding using the **List Data** property (type: `listdata`). This enables direct binding to K2 SmartForm data sources in the designer.

**Required Data Model Columns:**

| Column Name | Type | Description | Required |
|------------|------|-------------|----------|
| `Value` | String | Option value (stored value) | Yes |
| `Display` or `Label` | String | Option display text | Yes |

**Example K2 List Binding:**
```json
[
  {
    "value": "us",
    "display": "United States"
  },
  {
    "value": "ca",
    "display": "Canada"
  },
  {
    "value": "mx",
    "display": "Mexico"
  }
]
```

### Legacy JSON Binding

For backward compatibility, the **List Binding (JSON)** property accepts JSON string format:
```json
"[{\"value\":\"us\",\"label\":\"United States\"},{\"value\":\"ca\",\"label\":\"Canada\"}]"
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `value` | Value | Currently selected value | `""` |
| `List` | List Data | K2 list binding (type: listdata) - Recommended for K2 SmartForms | `[{value, label}]` |
| `listBinding` | List Binding (JSON) | JSON array of options [{value, label}] - For backward compatibility | `""` |
| `options` | Options | Dropdown options (comma-separated, or value:label pairs) - used if List Data is empty | `Option 1,Option 2,Option 3` |
| `delimiter` | Delimiter | Character used to separate options | `,` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Floating label text | `Select` |
| `placeholder` | Placeholder | Placeholder text when no selection | `""` |
| `helperText` | Helper Text | Helper text displayed below the select | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Visual style: `outlined` or `filled` | `outlined` |
| `leadingIcon` | Leading Icon | Material icon name for leading icon | `""` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Mark the field as required | `false` |
| `hasError` | Has Error | Show error state | `false` |
| `errorText` | Error Text | Error message to display | `""` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color | `#6750A4` |
| `textColor` | Text Color | Color of the selected text | `#1C1B1F` |
| `labelColor` | Label Color | Color of the floating label | `#79747E` |
| `borderColor` | Border Color | Color of the border/outline | `#79747E` |
| `backgroundColor` | Background Color | Background color (for filled variant) | `#E7E0EC` |
| `errorColor` | Error Color | Color used for error state | `#B3261E` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the selection changes |

## Methods

| Method | Description |
|--------|-------------|
| `clear()` | Clear the current selection |
| `open()` | Open the dropdown menu |
| `close()` | Close the dropdown menu |

## Usage Example

### Basic Select
```html
<material-select
  label="Country"
  options="United States,Canada,Mexico">
</material-select>
```

### With Value:Label Pairs
```html
<material-select
  label="Status"
  options="active:Active,inactive:Inactive,pending:Pending">
</material-select>
```

### Filled Variant with Helper Text
```html
<material-select
  variant="filled"
  label="Category"
  helper-text="Select a product category"
  options="Electronics,Clothing,Books,Home">
</material-select>
```

### With Leading Icon
```html
<material-select
  label="Sort By"
  leading-icon="sort"
  options="name:Name,date:Date,price:Price">
</material-select>
```

### Required with Error State
```html
<material-select
  label="Department"
  required="true"
  has-error="true"
  error-text="Please select a department"
  options="Sales,Marketing,Engineering,Support">
</material-select>
```

### With K2 Data Binding
```html
<material-select
  label="Select Item"
  list-binding="{SmartObject.Data}">
</material-select>
```

### Custom Colors
```html
<material-select
  label="Theme"
  primary-color="#1976D2"
  options="light:Light Mode,dark:Dark Mode,system:System Default">
</material-select>
```

## Options Format

Options can be defined in several ways:

| Format | Example | Description |
|--------|---------|-------------|
| Simple list | `Option 1,Option 2,Option 3` | Value equals label |
| Value:Label | `us:United States,ca:Canada` | Separate value and display text |
| JSON binding | `[{\"value\":\"us\",\"label\":\"USA\"}]` | JSON array for listBinding |

## Select Variants

| Variant | Description |
|---------|-------------|
| `outlined` | Border outline with floating label |
| `filled` | Solid background with floating label |
