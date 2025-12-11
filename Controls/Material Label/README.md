# Material Label Control

A Material 3 Design label for displaying text with customizable styling.

## Tag Name
```
<material-label>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Semantic HTML**: Uses `<label>` element when associated with form controls
- **Label Associations**: Supports `for` attribute to connect with input fields (WCAG 1.3.1)
- **Screen Reader Support**: Proper semantic structure for assistive technology
- **Programmatic Relationships**: Creates accessible label-control associations

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `labelFor` | Label For | ID of the form control this label is associated with (enables semantic `<label for="">` binding) | `""` |

**Usage for Accessible Forms:**
```html
<material-label label-for="email-input" value="Email Address:"></material-label>
<material-textbox id="email-input"></material-textbox>
```

## Properties

### Content Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `Value` | Text | The text to display | `Label` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontSize` | Font Size | Font size in pixels | `16` |
| `fontWeight` | Font Weight | Font weight: `normal`, `bold`, `100`-`900` | `normal` |
| `fontStyle` | Font Style | Font style: `normal`, `italic` | `normal` |
| `fontFamily` | Font Family | Font family (Roboto, Open Sans, Poppins, Montserrat, Inter, Lato, etc.) | `Roboto, sans-serif` |
| `lineHeight` | Line Height | Line height (e.g., 1.5, 24px, normal) | `1.5` |

### Alignment Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `textAlign` | Text Align | Text alignment: `left`, `center`, `right` | `left` |

### Text Decoration Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `textDecoration` | Text Decoration | Text decoration: `none`, `underline`, `line-through` | `none` |
| `textTransform` | Text Transform | Text transform: `none`, `uppercase`, `lowercase`, `capitalize` | `none` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `textColor` | Text Color | Color of the text | `#1C1B1F` |
| `backgroundColor` | Background Color | Background color (leave empty for transparent) | `""` |

### Layout Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `padding` | Padding | Padding around the text in pixels | `8` |
| `wordWrap` | Word Wrap | Allow text to wrap (true/false) | `true` |

### Interaction Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `clickable` | Clickable | Make the label clickable (true/false) | `false` |

## Events

| Event | Description |
|-------|-------------|
| `Click` | Fires when the label is clicked |

## Usage Example

### Basic Label
```html
<material-label
  Value="Hello, World!">
</material-label>
```

### Styled Heading
```html
<material-label
  Value="Welcome to Our App"
  font-size="32"
  font-weight="bold"
  text-align="center">
</material-label>
```

### Colored Label with Background
```html
<material-label
  Value="Important Notice"
  text-color="#FFFFFF"
  background-color="#F44336"
  padding="16">
</material-label>
```

### Italic Underlined Text
```html
<material-label
  Value="Terms and Conditions"
  font-style="italic"
  text-decoration="underline"
  clickable="true">
</material-label>
```

### Uppercase Label
```html
<material-label
  Value="section header"
  text-transform="uppercase"
  font-weight="500"
  font-size="12">
</material-label>
```

### Custom Font
```html
<material-label
  Value="Custom Typography"
  font-family="Poppins, sans-serif"
  font-size="20"
  font-weight="600">
</material-label>
```

### Centered Multi-line Text
```html
<material-label
  Value="This is a longer piece of text that will wrap to multiple lines when it exceeds the container width."
  text-align="center"
  word-wrap="true"
  line-height="1.6">
</material-label>
```

## Font Weight Options

| Weight | Description |
|--------|-------------|
| `normal` | Normal weight (400) |
| `bold` | Bold weight (700) |
| `100` | Thin |
| `200` | Extra Light |
| `300` | Light |
| `400` | Normal |
| `500` | Medium |
| `600` | Semi Bold |
| `700` | Bold |
| `800` | Extra Bold |
| `900` | Black |

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Text Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Text Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
```

**Multi-Color Gradient:**
```
Text Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material Label control
2. Find the color property (e.g., "Text Color")
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
