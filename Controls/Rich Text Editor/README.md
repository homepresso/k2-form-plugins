# Rich Text Editor Control

A comprehensive rich text editor with Material 3 design, supporting HTML content, formatting, lists, tables, and more.

## Tag Name
```
<rich-text-editor>
```

## Properties

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `Value` | Value | The HTML content of the editor | `""` |
| `plainText` | Plain Text | The plain text content without HTML formatting (read-only) | `""` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `placeholder` | Placeholder | Placeholder text when editor is empty | `Start typing...` |
| `showToolbar` | Show Toolbar | Show or hide the formatting toolbar (true/false) | `true` |

### Size Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `controlWidth` | Width | Width of the editor in pixels | `350` |
| `controlHeight` | Height | Height of the editor in pixels | `500` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color for Material 3 theme | `#6750A4` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when the content changes |
| `Focus` | Fires when the editor gains focus |
| `Blur` | Fires when the editor loses focus |

## Methods

| Method | Description |
|--------|-------------|
| `clear()` | Clears all content from the editor |
| `focus()` | Sets focus to the editor |

## Usage Example

### Basic Editor
```html
<rich-text-editor
  placeholder="Enter your content here...">
</rich-text-editor>
```

### Custom Size
```html
<rich-text-editor
  control-width="600"
  control-height="400">
</rich-text-editor>
```

### Without Toolbar
```html
<rich-text-editor
  show-toolbar="false"
  placeholder="Simple text area">
</rich-text-editor>
```

### With Custom Color
```html
<rich-text-editor
  primary-color="#1976D2"
  placeholder="Blue themed editor">
</rich-text-editor>
```

### Pre-filled Content
```html
<rich-text-editor
  Value="<h1>Welcome</h1><p>Start editing here...</p>">
</rich-text-editor>
```

## Toolbar Features

The editor toolbar includes:

- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Headings**: H1, H2, H3 heading styles
- **Lists**: Ordered and unordered lists
- **Alignment**: Left, center, right, justify
- **Links**: Insert and edit hyperlinks
- **Media**: Insert images
- **Tables**: Create and edit tables
- **Code**: Code blocks and inline code
- **Clear Formatting**: Remove all formatting

## Data Output

The editor provides two output formats:

| Property | Format | Description |
|----------|--------|-------------|
| `Value` | HTML | Full HTML markup with formatting |
| `plainText` | Plain text | Text content with no HTML tags |

## Notes

- The editor supports copy/paste from Word and other rich text sources
- Images can be inserted via URL
- The content is automatically saved to the `Value` property
- Use `plainText` property when you need content without formatting
