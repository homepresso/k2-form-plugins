# Material Carousel Control

Material 3 Design carousel for displaying scrollable image content.

## Tag Name
```
<material-carousel>
```

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding. Add `"DataBinding"` to your supports configuration.

### Expected Data Structure

When binding to a SmartObject, the control expects the following field mappings:

| Control Field | SmartObject Field | Description |
|--------------|-------------------|-------------|
| Image | `Image` or `Display` | URL for the carousel slide image |
| Title | `Title` | Slide title text |
| Subtitle | `Subtitle` or `Description` | Slide subtitle/description text |

### Example SmartObject Data
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

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `listBinding` | List Binding | JSON array of items [{image, title, subtitle}] - takes priority over Items if provided | `""` |
| `items` | Items | Carousel items (pipe-separated, format: image:title:subtitle) - used if List Binding is empty | Sample data |
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
