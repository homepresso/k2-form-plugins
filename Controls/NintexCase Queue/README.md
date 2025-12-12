# NintexCase Queue Control

A professional table-based list control for K2 SmartForms, designed for case management systems. Displays cases in a structured table format with columns for Title, Type, Assigned, SLA, Status, and Stage.

## Features

- **Clean Table Layout** - Professional grid design with proper spacing and alignment
- **K2 List Binding** - Seamlessly integrates with K2 SmartObject data sources
- **Multiple Interaction Events** - Single-click, double-click, swipe left, and swipe right gestures
- **Status Badges** - Color-coded status indicators with 6 predefined styles
- **Responsive Design** - Adapts to desktop, tablet, and mobile screen sizes
- **Touch Gesture Support** - Swipe detection for mobile interactions
- **Keyboard Navigation** - Full keyboard support with Enter/Space activation
- **WCAG 2.1 Compliant** - Accessible design with proper focus indicators and ARIA roles
- **Customizable Styling** - 15+ properties for complete visual control

## Installation

1. Copy the `NintexCase Queue` folder to your K2 SmartForms controls directory
2. Register the control in K2 Designer
3. The control will appear in your toolbox as "NintexCase Queue"

## Table Columns

The control displays 6 columns by default:

| Column | Width | Description |
|--------|-------|-------------|
| **Title** | 30% | Case title or name (bold, primary field) |
| **Type** | 12% | Case type or category |
| **Assigned** | 15% | Assigned user or team |
| **SLA** | 10% | Service level agreement deadline |
| **Status** | 12% | Current status with colored badge |
| **Stage** | 15% | Current workflow stage |

## K2 List Binding

### Required SmartObject Fields

Your K2 SmartObject or List must include these fields:

- `Title` (string) - Case title
- `Type` (string) - Case type
- `Assigned` (string) - Assigned to
- `SLA` (string) - SLA deadline
- `Status` (string) - Current status
- `Stage` (string) - Current stage

### Binding Steps

1. Add the NintexCase Queue control to your form
2. Open control properties
3. Click the **List** property
4. Select your SmartObject data source
5. Map the required fields to the corresponding columns
6. Save and preview

### Example SmartObject Structure

```
CaseItem
├─ Title (Text)
├─ Type (Text)
├─ Assigned (Text)
├─ SLA (Text)
├─ Status (Text)
└─ Stage (Text)
```

## Properties

### Data Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **selectedValue** | string | "" | Currently selected case title (read-only) |
| **List** | listdata | - | K2 list binding for case data |

### Display Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **title** | string | "Case Queue" | Section title displayed above the table |
| **showTitle** | boolean | true | Show or hide the section title |
| **backgroundColor** | string | "#FFFFFF" | Table background color |
| **borderRadius** | string | "8px" | Corner rounding (e.g., "0", "8px", "12px") |

### Header Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **headerBackground** | string | "#F5F5F5" | Header row background color |
| **headerTextColor** | string | "#666666" | Header text color |

### Row Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **rowBackground** | string | "#FFFFFF" | Row background color |
| **rowHoverBackground** | string | "#F9F9F9" | Row hover state color |
| **rowBorderColor** | string | "#E0E0E0" | Border color between rows |
| **textColor** | string | "#1C1B1F" | Row text color |

### Typography

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **titleColor** | string | "#1C1B1F" | Section title color |
| **fontFamily** | string | "Poppins, sans-serif" | Font family (Poppins, Roboto, Arial, etc.) |
| **fontSize** | number | 14 | Base font size in pixels |

### Standard Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **IsVisible** | boolean | true | Control visibility |
| **IsEnabled** | boolean | true | Control enabled state |

## Events

### RowClicked

Fires when a row is single-clicked.

**Event Detail:**
```javascript
{
  title: "Customer Onboarding - Acme Corp",  // Case title
  index: 0,                                   // Row index
  item: {                                     // Full case item data
    Title: "Customer Onboarding - Acme Corp",
    Type: "Onboarding",
    Assigned: "John Doe",
    SLA: "2 days",
    Status: "In Progress",
    Stage: "Documentation"
  }
}
```

**Usage:** Navigate to case details, open case view form, update status

### RowDoubleClicked

Fires when a row is double-clicked.

**Event Detail:** Same structure as RowClicked

**Usage:** Quick edit mode, open case in modal dialog

### RowSwipedLeft

Fires when a row is swiped left on touch devices (minimum 50px swipe distance).

**Event Detail:**
```javascript
{
  title: "Customer Onboarding - Acme Corp",
  index: 0,
  item: { /* full case data */ },
  direction: "left"
}
```

**Usage:** Archive case, delete case, mark as completed

### RowSwipedRight

Fires when a row is swiped right on touch devices (minimum 50px swipe distance).

**Event Detail:**
```javascript
{
  title: "Customer Onboarding - Acme Corp",
  index: 0,
  item: { /* full case data */ },
  direction: "right"
}
```

**Usage:** Assign case, flag case, add to favorites

## Status Badges

The control includes 6 predefined status badge styles. The badge color is automatically applied based on the `Status` field value.

| Status | Background | Text Color | Use Case |
|--------|------------|------------|----------|
| **Open** | Light Blue (#E3F2FD) | Blue (#1976D2) | New cases awaiting assignment |
| **In Progress** | Light Orange (#FFF3E0) | Orange (#F57C00) | Cases currently being worked |
| **Assigned** | Light Purple (#F3E5F5) | Purple (#7B1FA2) | Cases assigned but not started |
| **Completed** | Light Green (#E8F5E9) | Green (#388E3C) | Successfully completed cases |
| **Closed** | Light Gray (#EEEEEE) | Gray (#616161) | Archived or closed cases |
| **On Hold** | Light Red (#FBE9E7) | Red-Orange (#D84315) | Cases paused or blocked |

**Note:** Status values are case-insensitive and spaces are converted to hyphens for matching.

## Methods

### clearSelection()

Clears the currently selected row.

**Example:**
```javascript
// Clear selection programmatically
NintexCaseQueueControl.clearSelection();
```

## Usage Examples

### Example 1: Basic Case Queue

Display a simple case queue with default styling:

```
1. Add NintexCase Queue control to form
2. Bind List property to Cases SmartObject
3. Map fields: Title, Type, Assigned, SLA, Status, Stage
4. Configure RowClicked event to navigate to case details form
```

### Example 2: Mobile-Friendly Queue with Swipe Actions

Enable swipe gestures for mobile case management:

```
1. Add NintexCase Queue control
2. Configure RowSwipedRight event:
   - Transfer data to hidden fields
   - Call "AssignCaseToMe" SmartObject method
   - Show success notification

3. Configure RowSwipedLeft event:
   - Confirm with user
   - Call "ArchiveCase" SmartObject method
   - Refresh list
```

### Example 3: Custom Branding

Match your organization's branding:

```
Properties:
- backgroundColor: "#FAFAFA"
- headerBackground: "#667eea"
- headerTextColor: "#FFFFFF"
- rowHoverBackground: "#EEF2FF"
- fontFamily: "Arial, sans-serif"
- borderRadius: "12px"
```

### Example 4: Complete Form Integration

Full case management workflow:

```
Form Structure:
├─ NintexCase Navigation (top bar)
├─ NintexCase Quick Actions (action cards)
└─ NintexCase Queue (case list)

Workflow:
1. User clicks "My Cases" in Navigation
2. Quick Actions shows "New Case", "My Tasks", "Reports"
3. Queue displays filtered cases
4. Single-click row → View case details
5. Double-click row → Edit case
6. Swipe right → Assign to me
7. Swipe left → Archive case
```

## Responsive Behavior

The control automatically adapts to different screen sizes:

**Desktop (>1024px)**
- Full 6-column layout
- 64px row height
- 16px cell padding

**Tablet (768px - 1024px)**
- Full 6-column layout
- Reduced padding (12px)
- Maintained row height

**Mobile (<768px)**
- Single-column stacked layout
- Reduced font size (13px)
- Auto row height
- Touch-optimized spacing

## Keyboard Navigation

Full keyboard support for accessibility:

- **Tab** - Navigate between rows
- **Enter** or **Space** - Select row (fires RowClicked event)
- **Shift + Tab** - Navigate backwards

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Accessibility

WCAG 2.1 Level AA compliant:

- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA roles (table, row, cell)
- ✅ Color contrast ratios
- ✅ Screen reader support
- ✅ Reduced motion support

## Troubleshooting

### List not displaying data

1. Verify SmartObject has all required fields (Title, Type, Assigned, SLA, Status, Stage)
2. Check field name spelling (case-sensitive)
3. Ensure List property is bound correctly
4. Verify SmartObject returns data (use List View to test)

### Events not firing

1. Verify control IsEnabled property is true
2. Check that event is configured in K2 rules
3. For swipe events, ensure minimum 50px swipe distance
4. Test double-click with slower clicks (timing-sensitive)

### Status badges showing wrong colors

1. Status field must match predefined values: "Open", "In Progress", "Assigned", "Completed", "Closed", "On Hold"
2. Values are case-insensitive
3. Spaces are automatically converted to hyphens
4. Custom status values will use default badge styling

### Mobile swipe not working

1. Ensure device supports touch events
2. Check that swipe distance is at least 50px
3. Verify row is enabled (not disabled)
4. Test with slower, more deliberate swipes

## Advanced Customization

### Custom Status Badges

To add custom status badge colors, extend the runtime_style.css:

```css
.ncq-badge-pending-review {
  background: #FFF9C4;
  color: #F57F17;
}

.ncq-badge-escalated {
  background: #FFEBEE;
  color: #C62828;
}
```

### Custom Column Widths

Column widths are defined in the JavaScript (runtime_logic.js). To customize:

```javascript
const columns = [
  { id: 'title', label: 'Title', width: '40%' },    // Increased from 30%
  { id: 'type', label: 'Type', width: '10%' },      // Reduced from 12%
  // ... adjust other columns
];
```

## Support

For issues, questions, or feature requests:
- GitHub: [Control-Dojo Repository](https://github.com/yourusername/control-dojo)
- Email: support@yourcompany.com

## License

This control is part of the Control-Dojo library. See LICENSE file for details.

## Version History

- **1.0.0** - Initial release
  - Table-based case queue layout
  - K2 list binding support
  - 4 interaction events (click, double-click, swipe left/right)
  - 6 status badge styles
  - Full responsive design
  - WCAG 2.1 Level AA compliance
