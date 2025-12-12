# NintexCase User Menu

User avatar button with initials and dropdown menu for case management solutions.

## Overview

The NintexCase User Menu control provides a modern, accessible user menu with an avatar button displaying user initials and a dropdown list of menu options. Perfect for user profile menus, account settings, and navigation options.

## Key Features

- 👤 **Auto-Generated Initials** - Automatically extracts initials from display name
- 📋 **K2 List Binding** - Direct SmartObject binding for menu items
- 🎨 **Gradient Support** - Avatar button supports CSS gradients
- ♿ **WCAG 2.1 Level AA** - Full accessibility compliance
- ⌨️ **Keyboard Navigation** - Full keyboard support
- 🎯 **Click Outside to Close** - Automatically closes when clicking outside
- 🎭 **Modern Design** - Beautiful circular avatar with smooth animations

## Installation

1. Upload the control to your K2 SmartForms environment
2. The control will appear in the toolbox as "NintexCase User Menu"
3. Drag and drop onto your form

## K2 List Binding

### Required Fields
- **Name** (string) - The menu item text to display

### Optional Fields
- **Icon** (string) - Icon name or URL (future enhancement)

### Example SmartObject Structure
```
UserMenuItems SmartObject:
- Name (Text) - Required
- SortOrder (Number) - Optional
```

### Sample Data
```
Name
-----------
My Profile
Settings
Help
Sign Out
```

### Testing in Control Dojo

The control comes with sample data for testing:
- My Profile
- Settings
- Help
- Sign Out

## Properties

### Core Properties
- **Selected Value** - Currently selected menu item name (output)
- **Display Name** - User's full name (used to generate initials)
- **List** - K2 list binding for menu items

### Color Properties
- **Background Color** - Avatar button background (linear-gradient(135deg, #667eea 0%, #764ba2 100%) - gradient)
- **Text Color** - Avatar initials text color (#FFFFFF - white)
- **Dropdown Background** - Dropdown menu background (#FFFFFF - white)
- **Dropdown Text Color** - Dropdown menu text color (#1C1B1F - dark gray)
- **Hover Color** - Dropdown item hover background (#F5F5F5 - light gray)

### Size Properties
- **Button Size** - Size of the avatar button in pixels (40)
- **Font Size** - Font size for initials in pixels (16)

### Typography
- **Font Family** - Font for all text (Roboto, sans-serif)

## Events

### MenuItemClicked
Fires when a menu item is clicked.

**Event Detail:**
- `name` - The name of the clicked item
- `index` - The index of the clicked item
- `item` - The full item data object

**Example:**
```javascript
// K2 Rule: When MenuItemClicked on NintexCase User Menu
// If Selected Value = "Sign Out" Then Execute SignOut()
```

## Methods

### closeMenu()
Programmatically closes the dropdown menu.

**Example:**
```javascript
// K2 Rule: When Close Button Clicked
// Execute Method: NintexCase User Menu.closeMenu()
```

## How Initials Work

The control automatically generates initials from the Display Name:

| Display Name | Initials |
|--------------|----------|
| John Doe     | JD       |
| Jane Smith   | JS       |
| Mary         | MA       |
| Bob Johnson Jr | BJ     |
| (empty)      | ??       |

**Logic:**
- Single word: First 2 letters (e.g., "Mary" → "MA")
- Multiple words: First letter of first word + First letter of last word (e.g., "John Doe" → "JD")
- Empty: "??"

## Use Cases

### User Profile Menu
```javascript
Display Name: [Current User Name]

Menu Items:
- My Profile
- Account Settings
- Notifications
- Sign Out

Rule: When MenuItemClicked
  If Selected Value = "My Profile" → Navigate to Profile
  If Selected Value = "Sign Out" → Execute Logout
```

### Admin Menu
```javascript
Display Name: [Current User Name]

Menu Items:
- Dashboard
- User Management
- System Settings
- Reports
- Help
- Logout

Rule: When MenuItemClicked → Navigate([Selected Value])
```

### Context-Sensitive Menu
```javascript
// Bind menu items to SmartObject filtered by user role
List: Get UserMenuItems Where Role = [Current User Role]

Display Name: [Current User Full Name]
```

## Using CSS Gradients

The avatar button background supports CSS gradients:

### Basic Gradient Examples

**Blue to Purple (Default):**
```
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Ocean Blue:**
```
linear-gradient(135deg, #667eea 0%, #06b6d4 100%)
```

**Sunset Orange:**
```
linear-gradient(135deg, #f97316 0%, #dc2626 100%)
```

**Forest Green:**
```
linear-gradient(135deg, #10b981 0%, #059669 100%)
```

**Corporate Gray:**
```
linear-gradient(135deg, #475569 0%, #1e293b 100%)
```

### Solid Colors

You can also use solid colors:
```
Background Color: #6750A4
```

## Accessibility (WCAG 2.1 Level AA)

### Features
- ✅ Proper ARIA roles (`button`, `menu`, `menuitem`)
- ✅ `aria-haspopup` and `aria-expanded` for button
- ✅ Keyboard navigation (Tab, Enter, Space, Escape)
- ✅ Focus indicators
- ✅ Proper color contrast
- ✅ Screen reader support
- ✅ Reduced motion support

### Keyboard Support
- **Tab** - Focus on avatar button
- **Enter/Space** - Open/close menu
- **Escape** - Close menu (when menu is focused)
- **Arrow Keys** - Navigate menu items

## Best Practices

### DO
- ✅ Use real user names from K2 data
- ✅ Keep menu items concise (5-7 items max)
- ✅ Place in top-right corner of navigation
- ✅ Use consistent menu items across app
- ✅ Test with long names (e.g., "Jean-Baptiste De La Fontaine")

### DON'T
- ❌ Don't hardcode display name
- ❌ Don't overload with too many menu items
- ❌ Don't use low-contrast colors for avatar
- ❌ Don't forget to handle "Sign Out" action

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Integration with K2

### Basic Setup
1. Add NintexCase User Menu control to form
2. Set Display Name to `[Current User Full Name]`
3. Create UserMenuItems SmartObject with Name field
4. Bind List property to SmartObject
5. Add rule: When MenuItemClicked → Handle action based on Selected Value

### Advanced: Dynamic Menu Based on Role
```javascript
// SmartObject: UserMenuItems
// Fields: Name, Role, SortOrder

// Rule: When form initializes
Set NintexCase User Menu.DisplayName = [Current User Full Name]
Set NintexCase User Menu.List = Get UserMenuItems Where Role = [Current User Role] OR Role IS NULL

// Rule: When MenuItemClicked
Switch [Selected Value]
  Case "My Profile" → Navigate to Profile Form
  Case "Settings" → Navigate to Settings Form
  Case "Help" → Open Help Dialog
  Case "Sign Out" → Execute Logout Method
```

## Positioning

The dropdown appears below the avatar button, aligned to the right. To position the menu button:

**In Navigation Bar:**
```css
/* Use K2 form positioning or custom CSS */
position: absolute;
top: 10px;
right: 20px;
```

**With NintexCase Navigation:**
Place the User Menu control adjacent to the Navigation control for a complete header.

## Version

**Version:** 1.0
**Last Updated:** December 2025
**WCAG Status:** WCAG 2.1 Level AA Compliant ✅
