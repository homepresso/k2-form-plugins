# Material Label Control

A Material 3 Design label for displaying text with customizable styling.

## Tag Name
```
<material-label>
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
