# Material List View Card

Material 3 Design list view displaying data as cards with K2 list binding support.

## Overview

The Material List View Card control provides a flexible way to display data as a list of Material Design 3 cards. It supports K2 SmartForms list data binding and offers three layout modes (vertical, horizontal, grid) with three visual variants (elevated, filled, outlined).

## Key Features

- ✅ **K2 List Binding** - Direct binding to SmartObject list data
- 🎨 **Three Variants** - Elevated (shadow), Filled (surface), Outlined (border)
- 📐 **Three Layout Modes** - Vertical (stacked), Horizontal (scrollable), Grid (1-4 columns)
- 🖼️ **Rich Card Content** - Images, titles, subtitles, descriptions, action buttons
- 🎯 **Interactive** - Clickable cards with selection states
- ♿ **WCAG 2.1 Level AA** - Full accessibility compliance
- 🎭 **Material Design 3** - Official MD3 specifications

## Installation

1. Upload the control to your K2 SmartForms environment
2. The control will appear in the toolbox as "Material List View Card"
3. Drag and drop onto your form

## K2 List Data Binding

### Data Model

The control expects the following columns in your list data:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `Image` | String | No | Card image URL |
| `Title` | String | Yes | Card title/headline |
| `Subtitle` | String | No | Card subtitle text |
| `Description` | String | No | Card body/supporting text |
| `Value` | String | Yes | Unique identifier for selection |
| `Action` | String | No | Action button text |

### Field Mapping

The control intelligently maps fields with fallback names:
- **Image**: `image`, `Image`, `img`, `imageUrl`, `ImageUrl`
- **Title**: `title`, `Title`, `name`, `Name`, `text`, `Text`
- **Subtitle**: `subtitle`, `Subtitle`, `subheader`, `Subheader`
- **Description**: `description`, `Description`, `content`, `Content`, `body`, `Body`
- **Value**: `value`, `Value`, `id`, `ID`
- **Action**: `action`, `Action`, `button`, `Button`, `actionText`, `ActionText`

### Example SmartObject Binding

```javascript
// SmartObject with columns: ProductImage, ProductName, Category, Description, ProductID, ActionText
// The control will automatically map:
// ProductImage → Image
// ProductName → Title
// Category → Subtitle
// Description → Description
// ProductID → Value
// ActionText → Action
```

## Properties

### Data Properties
- **List Data** - K2 list data binding (type: listdata)
- **Selected Value** - Currently selected card value

### Layout Properties
- **Variant** - Card style: `elevated`, `filled`, `outlined`
- **Layout** - Display mode: `vertical`, `horizontal`, `grid`
- **Grid Columns** - Number of columns for grid layout (1-4)
- **Card Gap** - Spacing between cards in pixels (default: 16)

### Display Properties
- **Clickable** - Enable card selection (true/false)
- **Show Image** - Display card images (true/false)
- **Image Height** - Card image height in pixels (default: 200)
- **Show Actions** - Display action buttons (true/false)

### Color Properties
- **Primary Color** - Accent color (#6750A4)
- **Background Color** - Card background (#FFFBFE)
- **Surface Color** - Filled variant surface (#F7F2FA)
- **Border Color** - Outlined variant border (#CAC4D0)
- **Title Color** - Title text color (#1C1B1F)
- **Subtitle Color** - Subtitle text color (#49454F)
- **Description Color** - Description text color (#49454F)

### Typography
- **Font Family** - Font for all text (default: Roboto, sans-serif)

## Events

### CardClicked
Fires when a card is clicked (if clickable is true).

**Event Data:**
- `value` - The card's value identifier
- `item` - The full card data object

**Example:**
```javascript
// K2 Rule: When CardClicked on Material List View Card
// Transfer Data: ListViewCard.CardClicked.value to View.Parameters.SelectedProduct
```

### ActionClicked
Fires when a card's action button is clicked.

**Event Data:**
- `value` - The card's value identifier
- `action` - The action button text
- `item` - The full card data object

## Methods

### clearSelection()
Clears the currently selected card.

**Example:**
```javascript
// K2 Rule: When Button Clicked
// Execute Method: Material List View Card.clearSelection()
```

## Layout Modes

### Vertical Layout
Cards are stacked vertically in a single column with full width.

**Best for:**
- Mobile interfaces
- Narrow containers
- Detailed content display

### Horizontal Layout
Cards are displayed side-by-side in a scrollable row (280-360px each).

**Best for:**
- Featured items
- Product recommendations
- Related content

### Grid Layout
Cards are arranged in a responsive grid with configurable columns (1-4).

**Best for:**
- Product catalogs
- Image galleries
- Team directories
- Content libraries

**Responsive breakpoints:**
- Mobile (<600px): 1 column
- Tablet (600-900px): 2 columns
- Desktop (900-1200px): 3 columns
- Large (>1200px): 4 columns (if configured)

## Variants

### Elevated
Cards with shadow elevation that lift on hover.

**Use when:** Default card style for most content

### Filled
Cards with solid surface color background.

**Use when:** Emphasizing content grouping or hierarchy

### Outlined
Cards with 1px border outline.

**Use when:** Minimal design or dense layouts

## Accessibility (WCAG 2.1 Level AA)

### Features
- ✅ Semantic HTML (`<article>` for each card)
- ✅ ARIA attributes (`role`, `aria-label`, `aria-selected`)
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus indicators (visible 2px outline)
- ✅ Screen reader support
- ✅ Color contrast compliance

### Keyboard Support
- **Tab** - Navigate between cards
- **Enter/Space** - Select/activate card
- **Tab** - Navigate to action button

## Use Cases

### Product Catalog
```javascript
Layout: Grid (3 columns)
Variant: Elevated
Show Image: true
Show Actions: true
Action: "Add to Cart"
```

### Blog/Article List
```javascript
Layout: Vertical
Variant: Outlined
Show Image: true
Show Actions: true
Action: "Read More"
```

### Team Directory
```javascript
Layout: Grid (4 columns)
Variant: Filled
Show Image: true (headshots)
Show Actions: true
Action: "Contact"
```

### Featured Content
```javascript
Layout: Horizontal
Variant: Elevated
Show Image: true
Show Actions: false
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [Material Design 3 Cards](https://m3.material.io/components/cards)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [K2 SmartForms Documentation](https://help.k2.com/)

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
Card Background: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material List View Card control
2. Find the color property (e.g., "Primary Color" or "Card Background")
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

## Version

**Version:** 1.0
**Last Updated:** December 2025
**WCAG Status:** WCAG 2.1 Level AA Compliant ✅
