# Material Carousel Control

Material 3 Design carousel for displaying scrollable image content.

## Tag Name
```
<material-carousel>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for carousel navigation
- **ARIA Attributes**: Proper ARIA labels for all navigation controls
  - `aria-label` on navigation buttons (Previous/Next slide)
  - `aria-label` on indicator buttons (Go to slide N)
  - Accessible names for all interactive elements
- **Screen Reader Support**: Slide changes and navigation properly announced
- **Focus Management**: Visible focus indicators on all controls

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding. Add `"DataBinding"` to your supports configuration.

### List Data Binding (Recommended)

The control now supports proper K2 list binding using the **List Data** property (type: `listdata`). This enables direct binding to K2 SmartForm data sources in the designer.

**Required Data Model Columns:**

| Column Name | Type | Description | Required |
|------------|------|-------------|----------|
| `Image` or `Display` | String | URL for the carousel slide image | Yes |
| `Title` | String | Slide title text | No |
| `Subtitle` or `Description` | String | Slide subtitle/description text | No |

**Example K2 List Binding:**
```json
[
  {
    "image": "https://example.com/slide1.jpg",
    "title": "Welcome",
    "subtitle": "Discover amazing features"
  },
  {
    "image": "https://example.com/slide2.jpg",
    "title": "Explore",
    "subtitle": "Find what you need"
  }
]
```

### Legacy JSON Binding

For backward compatibility, the **List Binding (JSON)** property accepts JSON string format:
```json
"[{\"image\":\"https://example.com/slide1.jpg\",\"title\":\"Welcome\",\"subtitle\":\"Discover amazing features\"}]"
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `List` | List Data | K2 list binding (type: listdata) - Recommended for K2 SmartForms | `[{image, title, subtitle}]` |
| `listBinding` | List Binding (JSON) | JSON array of items [{image, title, subtitle}] - For backward compatibility | `""` |
| `items` | Items | Carousel items (pipe-separated, format: image:title:subtitle) - used if List Data is empty | Sample data |
| `delimiter` | Delimiter | Character to separate items | `\|` |
| `subDelimiter` | Sub Delimiter | Character to separate item parts | `:` |
| `currentIndex` | Current Index | Current slide index (0-based) | `0` |

### Layout Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `height` | Height | Carousel height in pixels (ignored for full-screen variant) | `300` |
| `variant` | Variant | Carousel style: `contained`, `hero`, `full-screen` | `contained` |

### Navigation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showArrows` | Show Arrows | Show navigation arrows (true/false) | `true` |
| `showIndicators` | Show Indicators | Show slide indicators (true/false) | `true` |
| `loop` | Loop | Enable infinite loop (true/false) | `true` |

### Auto Play Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `autoPlay` | Auto Play | Enable automatic slide advancement (true/false) | `false` |
| `autoPlayInterval` | Auto Play Interval | Time between slides in milliseconds | `5000` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `backgroundColor` | Background Color | Container background color | `#FFFBFE` |
| `arrowColor` | Arrow Color | Navigation arrow icon color | `#FFFFFF` |
| `arrowBackgroundColor` | Arrow Background | Navigation arrow background color | `rgba(0, 0, 0, 0.3)` |
| `indicatorColor` | Indicator Color | Inactive indicator color | `rgba(255, 255, 255, 0.5)` |
| `indicatorActiveColor` | Indicator Active | Active indicator color | `#FFFFFF` |
| `textColor` | Text Color | Caption text color | `#FFFFFF` |
| `captionBackgroundColor` | Caption Background | Caption background color | `rgba(0, 0, 0, 0.5)` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `SlideChanged` | Fires when the current slide changes |

## Methods

| Method | Description |
|--------|-------------|
| `next()` | Go to next slide |
| `prev()` | Go to previous slide |
| `goTo()` | Go to specific slide |

## Usage Example

### Basic Usage
```html
<material-carousel
  items="https://picsum.photos/800/400?1:Welcome:First slide|https://picsum.photos/800/400?2:Explore:Second slide"
  height="400">
</material-carousel>
```

### With Auto Play
```html
<material-carousel
  auto-play="true"
  auto-play-interval="3000"
  loop="true">
</material-carousel>
```

### Hero Variant
```html
<material-carousel
  variant="hero"
  show-indicators="true"
  show-arrows="true">
</material-carousel>
```

### With Custom Colors
```html
<material-carousel
  primary-color="#1976D2"
  arrow-color="#FFFFFF"
  indicator-active-color="#1976D2">
</material-carousel>
```

### With K2 Data Binding
```html
<material-carousel
  list-binding="{SmartObject.Data}">
</material-carousel>
```

## Carousel Variants

| Variant | Description |
|---------|-------------|
| `contained` | Standard carousel with fixed height |
| `hero` | Larger, more prominent carousel |
| `full-screen` | Takes up the full viewport height |

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
Indicator Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material Carousel control
2. Find the color property (e.g., "Primary Color" or "Indicator Color")
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
