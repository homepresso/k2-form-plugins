# NintexCase Quick Actions Control

A card-based quick actions control that displays action items in a responsive grid layout. Perfect for case management dashboards where users need quick access to common actions.

## Features

- **Card Grid Layout**: Responsive grid that adapts from 1-6 columns
- **K2 List Binding**: Populate cards from SmartObjects
- **Material Icons**: Uses Google Material Icons for card icons
- **Customizable Colors**: Full control over card styling and icon backgrounds
- **Click Events**: Fires events when cards are clicked
- **Sample Data**: Shows preview cards when list binding is empty
- **WCAG 2.1 AA Compliant**: Keyboard navigation, focus indicators, ARIA roles
- **Responsive Design**: Automatically adjusts columns for mobile/tablet/desktop

## Properties

### Value Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `SelectedValue` | String | `""` | Currently selected card title |

### Content Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `List` | List | Sample data | K2 list binding (requires Title, Description, Icon, IconBackground fields) |
| `Title` | String | `"Quick Actions"` | Section title text |
| `Columns` | Number | `4` | Number of columns in grid (1-6) |

### Card Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `CardBackground` | String | `"#FFFFFF"` | Card background color |
| `CardBorderColor` | String | `"#E0E0E0"` | Card border color |
| `CardBorderRadius` | String | `"12px"` | Card corner rounding |
| `CardTitleColor` | String | `"#1C1B1F"` | Card title text color |
| `CardDescriptionColor` | String | `"#666666"` | Card description text color |

### Other Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `TitleColor` | String | `"#1C1B1F"` | Section title text color |
| `IconSize` | Number | `48` | Icon container size in pixels |
| `Gap` | Number | `16` | Gap between cards in pixels |
| `FontFamily` | String | `"Roboto, sans-serif"` | Font family |

## Events

### CardClicked
Fires when a card is clicked.

**Event Data:**
```javascript
{
  title: "Create Case",              // Card title
  index: 0,                          // Card index in list
  item: {                            // Full item object
    Title: "Create Case",
    Description: "Start a new case",
    Icon: "add",
    IconBackground: "#4285F4"
  }
}
```

## Methods

### ClearSelection()
Clears the currently selected card.

```javascript
myQuickActions.clearSelection();
```

## K2 List Binding

### Required Fields

Your SmartObject must have these fields:

- **Title** (Text) - Card title (e.g., "Create Case")
- **Description** (Text) - Card description (e.g., "Start a new case")
- **Icon** (Text) - Material icon name (e.g., "add", "assignment", "bar_chart")
- **IconBackground** (Text) - Icon background color (e.g., "#4285F4", "#FF6F00")

### Example SmartObject Structure

```
QuickActionItems
├── Title (Text) - "Create Case"
├── Description (Text) - "Start a new case"
├── Icon (Text) - "add"
└── IconBackground (Text) - "#4285F4"
```

## Usage Examples

### Basic Setup with Sample Data

Add the control to your form. It will automatically display 4 sample action cards:
- **Create Case** - Blue background with add icon
- **My Tasks** - Orange background with assignment icon
- **Reports** - Purple background with bar_chart icon
- **Team Queue** - Green background with group icon

### Bind to SmartObject

1. Create a SmartObject with Title, Description, Icon, and IconBackground fields
2. Add items to your SmartObject list
3. Bind the `List` property to your SmartObject

**Example items:**
```
Title: "Create Case"
Description: "Start a new case"
Icon: "add"
IconBackground: "#4285F4"

Title: "My Tasks"
Description: "12 pending"
Icon: "assignment"
IconBackground: "#FF6F00"
```

### Material Icons Reference

Common icons you can use (from Material Icons):

**Actions:**
- `add` - Plus symbol
- `edit` - Pencil
- `delete` - Trash can
- `search` - Magnifying glass
- `settings` - Gear icon

**Business:**
- `assignment` - Clipboard
- `work` - Briefcase
- `attach_money` - Dollar sign
- `assessment` - Chart bars

**Communication:**
- `email` - Mail
- `phone` - Phone
- `chat` - Chat bubble
- `comment` - Comment bubble

**People:**
- `person` - Single person
- `group` - Multiple people
- `account_circle` - User avatar

**Data:**
- `bar_chart` - Bar chart
- `pie_chart` - Pie chart
- `analytics` - Line graph
- `table_chart` - Data table

**Files:**
- `folder` - Folder
- `description` - Document
- `upload` - Upload arrow
- `download` - Download arrow

[View all Material Icons](https://fonts.google.com/icons)

### Customize Layout

**Set number of columns:**
```javascript
myQuickActions.Columns = 3; // 3 columns wide
```

**Change section title:**
```javascript
myQuickActions.Title = "Common Tasks";
```

**Adjust card spacing:**
```javascript
myQuickActions.Gap = 20; // 20px gap between cards
```

### Customize Card Styling

**Change card background:**
```javascript
myQuickActions.CardBackground = "#F5F5F5";
```

**Change card border:**
```javascript
myQuickActions.CardBorderColor = "#CCCCCC";
myQuickActions.CardBorderRadius = "8px";
```

**Customize text colors:**
```javascript
myQuickActions.CardTitleColor = "#000000";
myQuickActions.CardDescriptionColor = "#888888";
```

**Change icon size:**
```javascript
myQuickActions.IconSize = 56; // Larger icons
```

### Handle Card Clicks

Respond to card clicks:

```javascript
// When CardClicked event fires:
var selectedCard = myQuickActions.SelectedValue;

if (selectedCard === "Create Case") {
    // Navigate to create case form
} else if (selectedCard === "My Tasks") {
    // Navigate to tasks view
} else if (selectedCard === "Reports") {
    // Navigate to reports
}
```

### Complete Form Example

**Step 1: Create SmartObject**
- Name: `QuickActionItems`
- Fields: `Title` (Text), `Description` (Text), `Icon` (Text), `IconBackground` (Text)

**Step 2: Add Data**
```
Title: "Create Case"
Description: "Start a new case"
Icon: "add"
IconBackground: "#4285F4"

Title: "My Tasks"
Description: "12 pending"
Icon: "assignment"
IconBackground: "#FF6F00"

Title: "Reports"
Description: "View analytics"
Icon: "bar_chart"
IconBackground: "#9C27B0"

Title: "Team Queue"
Description: "8 unassigned"
Icon: "group"
IconBackground: "#66BB6A"
```

**Step 3: Add Control to Form**
- Drag NintexCase Quick Actions control to form
- Bind `List` property to `QuickActionItems` SmartObject

**Step 4: Add Click Handler**
- Create rule: When `CardClicked` fires
- Transfer `SelectedValue` to data label
- Add conditional navigation based on selected card

## Color Examples

### Icon Background Colors

**Material Design Colors:**
- Blue: `#4285F4`
- Red: `#EA4335`
- Yellow: `#FBBC04`
- Green: `#34A853`
- Orange: `#FF6F00`
- Purple: `#9C27B0`
- Teal: `#009688`
- Pink: `#E91E63`

**Gradient Backgrounds:**
```javascript
// Cards don't support gradients for icons, but you can use solid colors
// that match your theme
```

## Responsive Behavior

The control automatically adjusts columns based on screen size:

- **Desktop (>1200px)**: Uses configured column count
- **Tablet (900-1200px)**: Maximum 3 columns
- **Mobile (600-900px)**: Maximum 2 columns
- **Small Mobile (<600px)**: Single column

## Accessibility

This control is WCAG 2.1 Level AA compliant:

- **Keyboard Navigation**: Tab to navigate between cards, Enter/Space to activate
- **Focus Indicators**: Clear visual focus outline for keyboard users
- **Screen Readers**: Proper ARIA roles and semantic markup
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- K2 SmartForms Runtime

## Tips

1. **Icon Names**: Use lowercase Material Icon names (e.g., "add" not "Add")
2. **Colors**: Use hex colors for icon backgrounds (#4285F4 format)
3. **Descriptions**: Keep descriptions short (1-2 words) for best appearance
4. **Columns**: 4 columns works well on desktop, fewer for mobile-first designs
5. **Consistent Icons**: Use a consistent icon style throughout your app
6. **Color Meaning**: Use colors consistently (blue for create, green for success, etc.)
7. **Testing**: Test with Material Icons library loaded to see icons properly

## Related Controls

- **NintexCase Navigation** - Navigation menu bar
- **NintexCase User Menu** - User menu dropdown
- **Material Card** - Single card component
