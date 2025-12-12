# NintexCase Header Control

A comprehensive header control that combines horizontal navigation with an optional user menu. Perfect for case management solutions where you need both navigation and user controls in a single unified header.

## Features

- **Combined Header**: Navigation menu and user menu in one control
- **K2 List Binding**: Populate both navigation items and user menu items from SmartObjects
- **Mode Filtering**: Show different navigation items based on application context
- **User Menu Toggle**: Show or hide the user menu with `ShowUserMenu` property
- **Auto-Generated Initials**: Displays user initials in a circular avatar button
- **Gradient Backgrounds**: Full support for CSS gradients throughout
- **WCAG 2.1 AA Compliant**: Keyboard navigation, ARIA roles, focus indicators
- **Sample Data**: Shows preview data when list bindings are empty
- **Dual Events**: Separate events for navigation clicks and user menu clicks

## Properties

### Value Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `SelectedValue` | String | `""` | Currently selected navigation item name |
| `SelectedUserMenuItem` | String | `""` | Currently selected user menu item name |

### Navigation Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `NavigationList` | List | Sample data | K2 list binding for navigation items (requires `Name` field, optional `Mode` field) |
| `Mode` | String | `""` | Filter navigation items by mode (empty shows all items) |

### User Menu Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `UserMenuList` | List | Sample data | K2 list binding for user menu items (requires `Name` field) |
| `ShowUserMenu` | Boolean | `true` | Show or hide the user menu |
| `DisplayName` | String | `"John Doe"` | User's full name (used to generate initials) |

### Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `BackgroundColor` | String | Gradient | Header background (supports solid colors and gradients) |
| `TextColor` | String | `rgba(255, 255, 255, 0.95)` | Navigation text color |
| `ActiveColor` | String | `#FFFFFF` | Active navigation item background |
| `HoverColor` | String | `rgba(255, 255, 255, 0.15)` | Navigation hover color |
| `Height` | Number | `60` | Header height in pixels |
| `FontFamily` | String | `"Roboto, sans-serif"` | Font family |
| `FontSize` | Number | `14` | Font size in pixels |

## Events

### NavigationItemClicked
Fires when a navigation item is clicked.

**Event Data:**
```javascript
{
  name: "Dashboard",           // Navigation item name
  index: 0,                    // Item index in list
  mode: "",                    // Item mode (if specified)
  item: { Name: "Dashboard", Mode: "" }  // Full item object
}
```

### UserMenuItemClicked
Fires when a user menu item is clicked.

**Event Data:**
```javascript
{
  name: "My Profile",          // Menu item name
  index: 0,                    // Item index in list
  item: { Name: "My Profile" } // Full item object
}
```

## Methods

### ClearSelection()
Clears the currently selected navigation item.

```javascript
// Clear navigation selection
myHeaderControl.clearSelection();
```

### CloseUserMenu()
Closes the user menu dropdown if it's open.

```javascript
// Close the user menu
myHeaderControl.closeUserMenu();
```

## Usage Examples

### Basic Header with Sample Data

Add the control to your form. It will automatically display sample navigation items and a user menu:

**Sample Navigation Items:**
- Dashboard
- My Cases
- Documents
- Reports

**Sample User Menu Items:**
- My Profile
- Settings
- Help
- Sign Out

### Bind to SmartObjects

**Navigation List Binding:**
1. Configure a SmartObject with a `Name` field (required) and optional `Mode` field
2. Bind the `NavigationList` property to your SmartObject list
3. The control will automatically populate navigation items

Example SmartObject structure:
```
CaseNavigationItems
├── Name (Text) - "Dashboard"
└── Mode (Text) - "view" (optional)
```

**User Menu List Binding:**
1. Configure a SmartObject with a `Name` field (required)
2. Bind the `UserMenuList` property to your SmartObject list
3. The control will automatically populate menu items

Example SmartObject structure:
```
UserMenuItems
├── Name (Text) - "My Profile"
```

### Mode Filtering

Show different navigation items based on application context:

**Example: Create Mode**
```javascript
// Show only items with Mode="create" or items with no Mode
myHeaderControl.Mode = "create";
```

**Example: View Mode**
```javascript
// Show only items with Mode="view" or items with no Mode
myHeaderControl.Mode = "view";
```

**Example: Show All Items**
```javascript
// Clear mode filter to show all navigation items
myHeaderControl.Mode = "";
```

### Toggle User Menu

Show or hide the user menu dynamically:

```javascript
// Hide user menu
myHeaderControl.ShowUserMenu = false;

// Show user menu
myHeaderControl.ShowUserMenu = true;
```

### Set User Display Name

The control automatically generates initials from the display name:

```javascript
// Single name: uses first 2 characters
myHeaderControl.DisplayName = "Administrator";  // Shows "AD"

// Full name: uses first + last initial
myHeaderControl.DisplayName = "John Doe";       // Shows "JD"
myHeaderControl.DisplayName = "Mary Jane Smith"; // Shows "MS"
```

### Gradient Backgrounds

The control supports CSS gradients for modern, visually appealing designs:

**Default Gradient (Purple):**
```javascript
myHeaderControl.BackgroundColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
```

**Blue Gradient:**
```javascript
myHeaderControl.BackgroundColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
```

**Ocean Gradient:**
```javascript
myHeaderControl.BackgroundColor = "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)";
```

**Sunset Gradient:**
```javascript
myHeaderControl.BackgroundColor = "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 50%, #2BFF88 100%)";
```

**Solid Color:**
```javascript
myHeaderControl.BackgroundColor = "#2D3E66";
```

### Handle Navigation Clicks

Respond to navigation item clicks:

```javascript
// When NavigationItemClicked event fires:
// 1. Get the selected item name
var selectedNav = myHeaderControl.SelectedValue;

// 2. Route to different views based on selection
if (selectedNav === "Dashboard") {
    // Show dashboard view
} else if (selectedNav === "My Cases") {
    // Show cases view
} else if (selectedNav === "Documents") {
    // Show documents view
}
```

### Handle User Menu Clicks

Respond to user menu item clicks:

```javascript
// When UserMenuItemClicked event fires:
// 1. Get the selected menu item
var selectedItem = myHeaderControl.SelectedUserMenuItem;

// 2. Handle different menu actions
if (selectedItem === "My Profile") {
    // Navigate to profile page
} else if (selectedItem === "Settings") {
    // Open settings
} else if (selectedItem === "Sign Out") {
    // Sign out user
}
```

### Complete Form Example

**Step 1: Add Control**
- Drag NintexCase Header control to top of form

**Step 2: Configure Navigation**
- Create SmartObject `NavigationItems` with fields: `Name` (Text), `Mode` (Text)
- Add items:
  - Name: "Dashboard", Mode: ""
  - Name: "New Case", Mode: "create"
  - Name: "My Cases", Mode: "view"
  - Name: "Documents", Mode: ""
- Bind `NavigationList` property to `NavigationItems` list

**Step 3: Configure User Menu**
- Create SmartObject `UserMenuOptions` with field: `Name` (Text)
- Add items:
  - Name: "My Profile"
  - Name: "Settings"
  - Name: "Help"
  - Name: "Sign Out"
- Bind `UserMenuList` property to `UserMenuOptions` list

**Step 4: Set Display Name**
- Create data label `CurrentUserName`
- Transfer current user's display name to data label
- Bind `DisplayName` property to `CurrentUserName`

**Step 5: Add Navigation Event Rule**
- Create rule: When `NavigationItemClicked` fires
- Transfer data: `SelectedValue` → `SelectedPage` data label
- Add action: Execute view switching logic based on `SelectedPage`

**Step 6: Add User Menu Event Rule**
- Create rule: When `UserMenuItemClicked` fires
- Transfer data: `SelectedUserMenuItem` → `MenuAction` data label
- Add action: Execute logic based on `MenuAction` (profile, settings, sign out)

## Accessibility

This control is WCAG 2.1 Level AA compliant:

- **Keyboard Navigation**:
  - Tab/Shift+Tab to navigate between items
  - Enter/Space to activate items
  - Escape to close user menu
- **ARIA Roles**: Proper semantic markup with `role="navigation"` and `role="menu"`
- **Focus Indicators**: Clear visual focus indicators for keyboard users
- **Screen Readers**: Descriptive ARIA labels and state announcements
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- K2 SmartForms Runtime

## Tips

1. **Navigation Structure**: Use clear, concise navigation item names (1-2 words)
2. **Mode Usage**: Use modes to show context-specific navigation (create, view, edit)
3. **User Menu Items**: Keep user menu focused on profile/account actions
4. **Gradient Consistency**: Match header gradient with your application's color scheme
5. **Display Name**: Always bind to actual user's name from K2 data for personalization
6. **Event Handling**: Use separate rules for navigation vs user menu events
7. **Mobile Considerations**: Control is responsive but consider showing fewer nav items on mobile

## Related Controls

- **NintexCase Navigation** - Standalone navigation menu without user menu
- **NintexCase User Menu** - Standalone user menu without navigation
