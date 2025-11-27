# Card List Control

A comprehensive card list control with Material 3 design for displaying list data in customizable card layouts.

## Tag Name
```
<card-list>
```

## K2 SmartObject Data Binding

This control supports K2 SmartObject data binding. Add `"DataBinding"` to your supports configuration.

### Expected Data Structure

When binding to a SmartObject, the control expects the following field mappings:

| Control Field | SmartObject Field | Description |
|--------------|-------------------|-------------|
| Title | `Title` or `Display` | Card title text |
| Subtitle | `Subtitle` | Card subtitle text |
| Description | `Description` | Card body/description text |
| Image | `Image` | URL for card image |
| Badge | `Badge` or `Status` | Status badge text |
| Meta | `Meta` | Meta information (e.g., "Updated 2 hours ago") |
| Value | `Value` | Unique identifier for the card |
| Avatar | `Avatar` | Avatar image URL or icon |
| Icon | `Icon` | Material icon name |

### Example SmartObject Data
```json
[
  {
    "title": "Project Alpha",
    "subtitle": "Marketing Campaign",
    "description": "A comprehensive marketing initiative targeting new demographics.",
    "image": "https://example.com/image.jpg",
    "badge": "Active",
    "meta": "Updated 2 hours ago",
    "value": "project-1"
  }
]
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `cardData` | Card Data | JSON array or bound list data | Sample data |
| `selectedValue` | Selected Value | Value of selected card (read-only) | `""` |
| `selectedIndex` | Selected Index | Index of selected card (read-only) | `-1` |

### Layout Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `layout` | Layout | Card layout: `grid`, `list`, `masonry` | `grid` |
| `columns` | Columns | Number of columns (1-6) | `3` |
| `cardStyle` | Card Style | Style: `elevated`, `filled`, `outlined` | `elevated` |
| `cardWidth` | Card Width | Fixed width in pixels (0 for auto) | `0` |
| `cardHeight` | Card Height | Fixed height in pixels (0 for auto) | `0` |
| `gap` | Card Gap | Gap between cards in pixels | `16` |
| `borderRadius` | Border Radius | Corner radius in pixels | `16` |

### Image Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `imagePosition` | Image Position | Position: `top`, `left`, `right`, `background`, `none` | `top` |
| `imageHeight` | Image Height | Height in pixels | `160` |
| `imageAspectRatio` | Image Aspect Ratio | Ratio: `16:9`, `4:3`, `1:1`, `auto` | `16:9` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showTitle` | Show Title | Show card title | `true` |
| `showSubtitle` | Show Subtitle | Show card subtitle | `true` |
| `showDescription` | Show Description | Show card description | `true` |
| `showBadge` | Show Badge | Show status badge | `true` |
| `showMeta` | Show Meta | Show meta information | `true` |
| `showActions` | Show Actions | Show action buttons | `false` |
| `actionLabels` | Action Labels | Comma-separated action button labels | `View,Edit` |
| `descriptionLines` | Description Lines | Max lines (0 for unlimited) | `3` |
| `showAvatar` | Show Avatar | Show avatar in card header | `false` |
| `avatarStyle` | Avatar Style | Style: `circle`, `square`, `rounded` | `circle` |
| `emptyMessage` | Empty Message | Message when no data | `No items to display` |
| `maxItems` | Max Items | Maximum cards to display (0 for unlimited) | `0` |

### Interaction Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `selectable` | Selectable | Allow card selection | `true` |
| `multiSelect` | Multi-Select | Allow multiple selection | `false` |
| `hoverEffect` | Hover Effect | Effect: `lift`, `glow`, `border`, `none` | `lift` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary accent color | `#6750A4` |
| `backgroundColor` | Background Color | Card background color | `""` |
| `textColor` | Text Color | Card text color | `""` |

## Events

| Event | Description |
|-------|-------------|
| `CardClicked` | Fires when a card is clicked |
| `ActionClicked` | Fires when a card action button is clicked |
| `SelectionChanged` | Fires when card selection changes |

## Methods

| Method | Description |
|--------|-------------|
| `refresh()` | Re-renders cards with current data |
| `clearSelection()` | Clears all selected cards |

## Usage Example

### Basic Usage
```html
<card-list
  layout="grid"
  columns="3"
  card-style="elevated"
  selectable="true">
</card-list>
```

### With Custom Colors
```html
<card-list
  primary-color="#1976D2"
  background-color="#FFFFFF"
  hover-effect="lift">
</card-list>
```

### List Layout with Actions
```html
<card-list
  layout="list"
  show-actions="true"
  action-labels="View,Edit,Delete"
  image-position="left">
</card-list>
```
