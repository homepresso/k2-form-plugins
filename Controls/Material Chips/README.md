# Material Chips Control

Material 3 Design chips for filtering, input, or actions.

## Tag Name
```
<material-chips>
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `chips` | Chips | Chip items (pipe-separated, format: icon:label:value) | `star:Featured:featured\|schedule:Recent:recent\|trending_up:Popular:popular` |
| `delimiter` | Delimiter | Character to separate chips | `\|` |
| `subDelimiter` | Sub Delimiter | Character to separate chip parts | `:` |
| `selectedValue` | Selected Value | Selected chip value(s) | `""` |

### Behavior Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Chip style: `assist`, `filter`, `input`, `suggestion` | `assist` |
| `multiSelect` | Multi Select | Allow multiple chip selection (true/false) | `false` |
| `removable` | Removable | Allow chips to be removed (true/false) | `false` |
| `showCheckmark` | Show Checkmark | Show checkmark on selected filter chips (true/false) | `true` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `backgroundColor` | Background Color | Chip background color | `#FFFBFE` |
| `borderColor` | Border Color | Chip border color | `#79747E` |
| `textColor` | Text Color | Chip text color | `#1C1B1F` |
| `iconColor` | Icon Color | Chip icon color | `#49454F` |

### Selected State Colors

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `selectedBackgroundColor` | Selected Background Color | Selected chip background color | `#E8DEF8` |
| `selectedBorderColor` | Selected Border Color | Selected chip border color | `""` |
| `selectedTextColor` | Selected Text Color | Selected chip text color | `#1D192B` |

### Additional Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `removeIconColor` | Remove Icon Color | Remove button icon color | `""` |
| `elevatedBackgroundColor` | Elevated Background Color | Background color for suggestion/elevated chips | `#F3EDF7` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fires when selection changes |
| `ChipRemoved` | Fires when a chip is removed |
| `ChipAdded` | Fires when a chip is added |

## Methods

| Method | Description |
|--------|-------------|
| `addChip()` | Adds a new chip programmatically |
| `clearSelection()` | Clears all selected chips |

## Usage Example

### Basic Filter Chips
```html
<material-chips
  variant="filter"
  chips="all:All:all|active:Active:active|completed:Completed:completed"
  multi-select="true">
</material-chips>
```

### Assist Chips with Icons
```html
<material-chips
  variant="assist"
  chips="directions:Directions:dir|bookmark:Bookmark:save|share:Share:share">
</material-chips>
```

### Removable Input Chips
```html
<material-chips
  variant="input"
  removable="true"
  chips="tag1:JavaScript:js|tag2:Python:py|tag3:React:react">
</material-chips>
```

### Suggestion Chips
```html
<material-chips
  variant="suggestion"
  chips="coffee:Coffee:coffee|lunch:Lunch:lunch|dinner:Dinner:dinner">
</material-chips>
```

### Multi-Select with Checkmarks
```html
<material-chips
  variant="filter"
  multi-select="true"
  show-checkmark="true"
  chips="small:Small:sm|medium:Medium:md|large:Large:lg">
</material-chips>
```

### Custom Colors
```html
<material-chips
  primary-color="#1976D2"
  selected-background-color="#BBDEFB"
  selected-text-color="#0D47A1">
</material-chips>
```

## Chip Variants

| Variant | Description |
|---------|-------------|
| `assist` | Action chips that help users complete tasks |
| `filter` | Filter chips for refining content |
| `input` | Input chips representing user-provided information |
| `suggestion` | Suggestion chips for quick actions or recommendations |
