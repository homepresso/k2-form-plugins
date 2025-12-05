# Material Controls Overview

Comprehensive collection of 21 Material Design 3 controls for K2 SmartForms, all **WCAG 2.1 Level AA compliant**.

---

## Control Categories

### Form Controls (7)
- [Material Textbox](#material-textbox)
- [Material Select](#material-select)
- [Material Checkbox](#material-checkbox)
- [Material Switch](#material-switch)
- [Material Slider](#material-slider)
- [Material Date Picker](#material-date-picker)
- [Material Time Picker](#material-time-picker)

### Button Controls (4)
- [Material Button](#material-button)
- [Material Icon Button](#material-icon-button)
- [Material Split Button](#material-split-button)
- [Material FAB Menu](#material-fab-menu)

### Selection Controls (2)
- [Material Segmented Button](#material-segmented-button)
- [Material Chips](#material-chips)

### Display Controls (5)
- [Material Card](#material-card)
- [Material List](#material-list)
- [Material List View Card](#material-list-view-card)
- [Material Carousel](#material-carousel)
- [Material Label](#material-label)

### Utility Controls (3)
- [Material Icon](#material-icon)
- [Material Progress Bar](#material-progress-bar)
- [Material Address Lookup](#material-address-lookup)

---

## Quick Reference

| Control | Primary Use | K2 List Binding | Key Features |
|---------|-------------|-----------------|--------------|
| **Material Textbox** | Text input with validation | No | Floating labels, icons, helper text, error states |
| **Material Select** | Dropdown selection | ✅ Yes | Outlined/filled variants, keyboard navigation |
| **Material Checkbox** | Single/multiple selection | No | Indeterminate state, custom colors |
| **Material Switch** | Toggle on/off | No | Material 3 design, smooth animation |
| **Material Slider** | Range selection | No | Min/max values, step intervals, labels |
| **Material Date Picker** | Date selection | No | Calendar popup, format customization |
| **Material Time Picker** | Time selection | No | 12/24 hour format, AM/PM support |
| **Material Button** | Actions | No | 5 variants, icons, toggle mode, ripple effect |
| **Material Icon Button** | Icon-only actions | No | 4 variants, toggle support, tooltips |
| **Material Split Button** | Primary + dropdown | No | Combined action and menu |
| **Material FAB Menu** | Floating actions | No | Expandable menu, extended FAB |
| **Material Segmented Button** | Mutually exclusive options | No | Single/multi-select, icons, checkmarks |
| **Material Chips** | Tags/filters | No | Input/filter/suggestion/assist types |
| **Material Card** | Content containers | No | Media, actions, clickable, 3 variants |
| **Material List** | Item lists | ✅ Yes | Icons, avatars, checkboxes, dividers |
| **Material List View Card** | Card list view | ✅ Yes | Grid/vertical/horizontal layouts, actions |
| **Material Carousel** | Image slideshow | ✅ Yes | Auto-play, indicators, 3 variants |
| **Material Label** | Text display | No | Form label associations, typography |
| **Material Icon** | Icon display | No | 4 styles, clickable, smart ARIA |
| **Material Progress Bar** | Progress indicator | No | Linear/circular, determinate/indeterminate |
| **Material Address Lookup** | Address autocomplete | No | Google Places integration, validation |

---

## Material Textbox

**Path:** `Controls/Material Textbox/`

Material 3 Design textbox with floating labels, icons, helper text, and validation support.

### Key Features
- **Variants:** Outlined, Filled
- **Input Types:** text, password, email, number, tel, url, search
- **Validation:** Built-in validation with error states, pattern matching
- **Icons:** Leading and trailing icons (clickable trailing icon)
- **Character Count:** Optional character counter with max length
- **WCAG:** aria-label, aria-required, aria-invalid, aria-describedby

### Properties
- Value, Label, Placeholder, Helper Text, Error Text
- Input Type, Max Length, Pattern, Autocomplete
- Leading Icon, Trailing Icon, Trailing Icon Clickable
- Show Character Count, Required, Has Error
- **NEW:** aria-label

### Events
- Changed, Focus, Blur, OnEnter, IconClicked

### Methods
- focus(), clear(), validate()

---

## Material Select

**Path:** `Controls/Material Select/`

Material 3 Design dropdown/select with outlined and filled variants.

### Key Features
- **K2 List Binding:** ✅ Supports proper K2 list data binding (type: listdata)
- **Variants:** Outlined, Filled
- **Data Sources:** K2 List Data, JSON binding, delimited string
- **Keyboard Navigation:** Arrow keys, Enter, Space, Escape
- **WCAG:** Complete ARIA combobox pattern (role="combobox", aria-expanded, aria-selected)

### Data Model (K2 List Binding)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Value | String | Yes | Option value (stored) |
| Display or Label | String | Yes | Option display text |

### Properties
- Value, List (listdata), List Binding (JSON), Options, Delimiter
- Label, Placeholder, Helper Text, Error Text
- Variant, Leading Icon, Required, Has Error

### Events
- Changed

### Methods
- clear(), open(), close()

---

## Material Checkbox

**Path:** `Controls/Material Checkbox/`

Material 3 Design checkbox with checked, unchecked, and indeterminate states.

### Key Features
- **States:** Checked, Unchecked, Indeterminate
- **Customization:** Custom colors, sizes, labels
- **WCAG:** role="checkbox", aria-checked, keyboard support

### Properties
- Checked, Indeterminate, Label, Value
- Primary Color, Checkbox Color, Text Color
- Font Family, Font Size, Font Weight

### Events
- Changed

---

## Material Switch

**Path:** `Controls/Material Switch/`

Material 3 Design toggle switch for on/off states.

### Key Features
- **Material 3 Design:** Track and thumb with smooth animation
- **Icons:** Optional icons for on/off states
- **WCAG:** role="switch", aria-checked, keyboard support

### Properties
- Checked, Label, On Icon, Off Icon
- Track Color, Thumb Color, Text Color
- Font properties

### Events
- Changed

---

## Material Slider

**Path:** `Controls/Material Slider/`

Material 3 Design slider for selecting values from a range.

### Key Features
- **Range Selection:** Min/max values with step intervals
- **Labels:** Optional value labels, tick marks
- **WCAG:** role="slider", aria-valuemin/max/now, keyboard support

### Properties
- Value, Min, Max, Step
- Show Value Label, Show Tick Marks
- Primary Color, Track Color, Thumb Color

### Events
- Changed

---

## Material Date Picker

**Path:** `Controls/Material Date Picker/`

Material 3 Design date picker with calendar popup.

### Key Features
- **Calendar Popup:** Interactive date selection
- **Format Customization:** Configurable date formats
- **WCAG:** role="combobox", aria-haspopup="dialog", keyboard navigation

### Properties
- Value, Label, Placeholder, Helper Text
- Date Format, Min Date, Max Date
- Variant (outlined/filled)

### Events
- Changed, Focus, Blur

### Methods
- clear(), open(), close()

---

## Material Time Picker

**Path:** `Controls/Material Time Picker/`

Material 3 Design time picker with clock interface.

### Key Features
- **Clock Interface:** Visual time selection
- **Format Support:** 12-hour and 24-hour formats
- **WCAG:** role="combobox", aria-haspopup="dialog", keyboard navigation

### Properties
- Value, Label, Placeholder, Helper Text
- Time Format (12h/24h)
- Variant (outlined/filled)

### Events
- Changed, Focus, Blur

### Methods
- clear(), open(), close()

---

## Material Button

**Path:** `Controls/Material Button/`

Material 3 Design button with multiple variants, icons, and ripple effect.

### Key Features
- **Variants:** Filled, Outlined, Text, Elevated, Tonal (5 total)
- **Icons:** Leading and trailing icons
- **Toggle Mode:** NEW - aria-pressed toggle button support
- **Sizes:** Small, Medium, Large
- **WCAG:** aria-label for icon-only, aria-pressed for toggles

### Properties
- Text, Tooltip, Variant, Size, Full Width
- Leading Icon, Trailing Icon, Icon Only
- **NEW:** aria-label, toggleMode, pressed
- Disable Ripple

### Events
- Clicked

---

## Material Icon Button

**Path:** `Controls/Material Icon Button/`

Material 3 Design icon button with standard, filled, tonal, and outlined variants.

### Key Features
- **Variants:** Standard, Filled, Tonal, Outlined (4 total)
- **Toggle Support:** Optional toggle behavior with selected icon
- **Sizes:** Small (36px), Medium (48px), Large (56px)
- **Color Adaptability:** NEW - Dynamic color mixing for any background
- **WCAG:** aria-label, aria-pressed, smart fallbacks

### Properties
- Icon, Selected Icon, Variant, Size
- Toggle, Selected, Tooltip, Disable Ripple
- **NEW:** aria-label
- Primary Color, Icon Color, Container Color, Outline Color
- Selected Container Color, Selected Icon Color

### Events
- Clicked

---

## Material Split Button

**Path:** `Controls/Material Split Button/`

Material 3 Design split button with primary action and dropdown menu.

### Key Features
- **Dual Actions:** Primary button + dropdown menu
- **Variants:** Filled, Outlined, Tonal
- **Menu Items:** Icon:label format support
- **WCAG:** aria-label for both buttons, aria-haspopup, aria-expanded, keyboard navigation

### Properties
- Text, Icon, Menu Items, Delimiter
- Variant, Disable Ripple
- **NEW:** aria-label, dropdownAriaLabel
- Primary Color, Text Color, Outline Color

### Events
- PrimaryClicked, MenuItemClicked

### Methods
- open(), close()

---

## Material FAB Menu

**Path:** `Controls/Material FAB Menu/`

Material 3 Design Floating Action Button with expandable menu.

### Key Features
- **Expandable Menu:** Popup action menu
- **Extended FAB:** Optional label text
- **Sizes:** Small, Regular, Large
- **Variants:** Primary, Secondary, Tertiary, Surface
- **WCAG:** aria-label, aria-haspopup, aria-expanded, keyboard navigation

### Properties
- Icon, Open Icon, Size, Variant
- Label, Extended, Menu Items, Delimiter
- **NEW:** aria-label
- Position (bottom-right/left/center)

### Events
- Clicked, MenuItemClicked

### Methods
- open(), close(), toggle()

---

## Material Segmented Button

**Path:** `Controls/Material Segmented Button/`

Material 3 Design segmented button for selecting from a set of options.

### Key Features
- **Selection Modes:** Single-select or multi-select
- **Icons:** Optional icons for each segment
- **Checkmarks:** Optional checkmark on selected segments
- **Density:** Default, Comfortable, Compact
- **WCAG:** aria-pressed, arrow key navigation (Left/Right/Up/Down/Home/End)

### Properties
- Segments, Delimiter, Value, Multi Select
- Show Checkmark, Density
- Primary Color, Border Color, Text Color, Icon Color

### Events
- Changed

### Methods
- selectSegment(), clearSelection()

---

## Material Chips

**Path:** `Controls/Material Chips/`

Material 3 Design chips for tags, filters, and selections.

### Key Features
- **Types:** Input, Filter, Suggestion, Assist
- **Icons:** Leading icons, avatar support
- **Removable:** Optional remove icon
- **Selectable:** Single or multi-select
- **WCAG:** role="group", aria-checked, aria-label, keyboard support

### Properties
- Chips, Delimiter, Type, Selected Values
- Removable, Selectable, Multi Select
- Primary Color, Text Color, Icon Color

### Events
- ChipClicked, ChipRemoved, SelectionChanged

### Methods
- addChip(), removeChip(), clearAll()

---

## Material Card

**Path:** `Controls/Material Card/`

Material 3 Design card for displaying content with media, header, and actions.

### Key Features
- **Variants:** Elevated, Filled, Outlined
- **Media:** Image support (top/bottom position)
- **Header:** Avatar, overline, headline, subhead
- **Actions:** Primary and secondary action buttons
- **Clickable:** Optional clickable card behavior
- **WCAG:** role="button" when clickable, aria-label, keyboard support

### Properties
- Headline, Subhead, Supporting Text, Overline
- Image, Image Position, Avatar, Avatar Text
- Primary Action, Secondary Action, Show Divider
- Clickable, **NEW:** aria-label
- Variant

### Events
- CardClicked, PrimaryActionClicked, SecondaryActionClicked

---

## Material List

**Path:** `Controls/Material List/`

Material 3 Design list for displaying items with icons and avatars.

### Key Features
- **K2 List Binding:** ✅ Supports proper K2 list data binding (type: listdata)
- **Variants:** One-line, Two-line, Three-line
- **Checkbox Mode:** Multi-selection support
- **Icons/Avatars:** Leading icon or avatar display
- **WCAG:** role="listbox", aria-selected, aria-checked, arrow key navigation

### Data Model (K2 List Binding)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Icon or Image | String | No | Material icon name or image URL |
| Title or Display | String | Yes | Primary item text |
| Subtitle or Description | String | No | Secondary item text |
| Value | String | Yes | Unique identifier |
| Checked or IsChecked | Boolean | No | Pre-checked state (checkbox mode) |

### Properties
- List (listdata), Selected Value, Checked Values
- Variant, Show Dividers, Show Leading/Trailing Icon
- Avatar Mode, Selectable, Checkbox Mode

### Events
- ItemClicked, SelectionChanged

---

## Material List View Card

**Path:** `Controls/Material List View Card/`

Material 3 Design list view displaying data as cards with K2 list binding support.

### Key Features
- **K2 List Binding:** ✅ Supports proper K2 list data binding (type: listdata)
- **Layout Modes:** Vertical (stacked), Horizontal (side-by-side), Grid (responsive 1-4 columns)
- **Variants:** Elevated, Filled, Outlined
- **Card Features:** Images, titles, subtitles, descriptions, action buttons
- **Clickable:** Selectable cards with visual states
- **WCAG:** role="article", aria-label, aria-selected, keyboard navigation

### Data Model (K2 List Binding)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Image | String | No | Card image URL |
| Title | String | Yes | Card title/headline |
| Subtitle | String | No | Card subtitle text |
| Description | String | No | Card body/supporting text |
| Value | String | Yes | Unique identifier |
| Action | String | No | Action button text |

### Properties
- List (listdata), Selected Value
- Variant (elevated/filled/outlined), Layout (vertical/horizontal/grid)
- Columns (1-4 for grid), Card Gap, Clickable
- Show Image, Image Height, Show Actions
- Color properties (primary, background, surface, border, title, subtitle, description)
- Font Family

### Events
- CardClicked, ActionClicked

### Methods
- clearSelection()

---

## Material Carousel

**Path:** `Controls/Material Carousel/`

Material 3 Design carousel for displaying scrollable image content.

### Key Features
- **K2 List Binding:** ✅ Supports proper K2 list data binding (type: listdata)
- **Variants:** Contained, Hero, Full-screen
- **Auto-Play:** Configurable interval
- **Navigation:** Arrows and indicators
- **WCAG:** aria-label on controls, keyboard navigation

### Data Model (K2 List Binding)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Image or Display | String | Yes | URL for slide image |
| Title | String | No | Slide title text |
| Subtitle or Description | String | No | Slide subtitle text |

### Properties
- List (listdata), List Binding (JSON), Items, Delimiter
- Current Index, Height, Variant
- Auto Play, Auto Play Interval
- Show Arrows, Show Indicators, Loop

### Events
- SlideChanged

### Methods
- next(), prev(), goTo()

---

## Material Label

**Path:** `Controls/Material Label/`

Material 3 Design label for displaying text with customizable styling.

### Key Features
- **Semantic HTML:** Uses `<label>` element for form associations
- **Label Associations:** NEW - Supports `for` attribute (labelFor property)
- **Typography:** Extensive font customization
- **WCAG:** Proper label-control relationships (WCAG 1.3.1)

### Properties
- Value (text), **NEW:** labelFor
- Font Size, Font Weight, Font Style, Font Family
- Line Height, Text Align, Text Transform
- Text Color, Background Color

### Usage Example
```html
<material-label label-for="email-input" value="Email Address:"></material-label>
<material-textbox id="email-input"></material-textbox>
```

---

## Material Icon

**Path:** `Controls/Material Icon/`

Displays a Material Design icon with customizable properties.

### Key Features
- **Icon Styles:** Filled, Outlined, Rounded, Sharp (4 styles)
- **Smart ARIA:** NEW - Automatically adapts based on usage
  - Decorative: aria-hidden="true"
  - Interactive: aria-label + role="button"
  - Labeled: aria-label + role="img"
- **Clickable:** Optional click behavior
- **WCAG:** Context-aware accessibility

### Properties
- Icon Name, Icon Style, Icon Size
- Icon Color, Hover Color
- Clickable, Tooltip, **NEW:** aria-label

### Events
- Clicked

---

## Material Progress Bar

**Path:** `Controls/Material Progress Bar/`

Material 3 Design progress indicators with linear and circular variants.

### Key Features
- **Variants:** Linear (horizontal bar), Circular (circular indicator)
- **Modes:** Determinate (specific value 0-100), Indeterminate (animated loop)
- **Sizes:** Small (32px), Medium (48px), Large (64px), XLarge (96px) for circular
- **Label Display:** Inside (overlay), Outside (below/right), Center (circular only)
- **Buffer Support:** Secondary progress bar for linear variant (streaming/buffering)
- **Animated:** Smooth transitions when value changes
- **WCAG:** role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax, aria-label

### Properties
- Value (0-100), Variant (linear/circular), Mode (determinate/indeterminate)
- Size (circular: small/medium/large/xlarge), Thickness (2-12px)
- Show Label, Label Position, Custom Label
- Animated, Buffer Value (linear only)
- **NEW:** aria-label
- Color properties (primary, track, buffer, label)
- Font properties (family, size, weight)

### Events
- Complete (fires when progress reaches 100%)

### Methods
- reset() - Sets progress to 0
- complete() - Sets progress to 100%

---

## Material Address Lookup

**Path:** `Controls/Material Address Lookup/`

Material 3 Design address autocomplete with Google Places API integration.

### Key Features
- **Google Places:** Autocomplete address suggestions
- **Component Extraction:** Separate street, city, state, zip, country
- **Validation:** Address validation support
- **WCAG:** Proper ARIA autocomplete pattern

### Properties
- Value, Label, Placeholder, API Key
- Country Restriction, Component Restrictions
- Extract Components

### Events
- AddressSelected, Changed

---

## WCAG Compliance Summary

All 21 Material controls are **WCAG 2.1 Level AA compliant** with:

### Universal Features
✅ **Keyboard Navigation** - All interactive controls fully keyboard accessible
✅ **ARIA Attributes** - Complete ARIA implementation for screen readers
✅ **Focus Management** - Visible focus indicators on all interactive elements
✅ **Screen Reader Support** - Proper labels and state announcements
✅ **Color Contrast** - Meets WCAG AA contrast requirements

### Phase 1 Enhancements (5 controls)
Previously non-compliant, now compliant with new properties:
- Material Icon Button - `ariaLabel`
- Material FAB Menu - `ariaLabel`
- Material Split Button - `ariaLabel`, `dropdownAriaLabel`
- Material Icon - `ariaLabel`
- Material Label - `labelFor`

### Phase 2 Enhancements (4 controls)
Enhanced from partial to full compliance:
- Material Button - `ariaLabel`, `toggleMode`, `pressed`
- Material Card - `ariaLabel`
- Material Segmented Button - Arrow key navigation
- Material Textbox - `ariaLabel`, `aria-required`, `aria-invalid`, `aria-describedby`

### Already Compliant (12 controls)
- Material Checkbox, Material Switch, Material Select, Material Slider
- Material List, Material List View Card, Material Date Picker, Material Time Picker
- Material Address Lookup, Material Chips, Material Carousel, Material Progress Bar

---

## K2 SmartForms Integration

### Controls with List Data Binding (4)

**Material Select**
- Bind to: SmartObject list data
- Columns: `Value`, `Display` or `Label`
- Use case: Dropdown options from database

**Material List**
- Bind to: SmartObject list data
- Columns: `Icon`, `Title`, `Subtitle`, `Value`, `Checked`
- Use case: Navigation menus, task lists, item selections

**Material List View Card**
- Bind to: SmartObject list data
- Columns: `Image`, `Title`, `Subtitle`, `Description`, `Value`, `Action`
- Use case: Product catalogs, article listings, team directories, portfolios

**Material Carousel**
- Bind to: SmartObject list data
- Columns: `Image`, `Title`, `Subtitle`
- Use case: Image galleries, product showcases, announcements

### All Controls Support
- Value binding for form data
- Property expressions for dynamic configuration
- Rules for show/hide, enable/disable
- Conditional formatting

---

## Design System

All controls follow Material Design 3 specifications:

### Color System
- **Primary:** Main brand color (#6750A4 default)
- **Secondary:** Accent colors for variety
- **Surface:** Container backgrounds
- **Error:** Validation and error states (#B3261E default)
- **On-colors:** Text colors for surfaces

### Typography
- **Roboto** default font family
- Support for: Open Sans, Poppins, Montserrat, Inter, Lato, and more
- Configurable font size, weight, and style per control

### Elevation
- **Elevated:** Raised cards and buttons
- **Filled:** Solid backgrounds
- **Outlined:** Bordered containers
- **Tonal:** Subtle filled backgrounds

### Motion
- **Ripple effects** on interactive elements (can be disabled)
- **Smooth transitions** for state changes
- **Touch feedback** for mobile devices

---

## Browser Support

All controls support:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requirements:
- Modern browser with ES6 support
- Custom Elements v1 support
- CSS Grid and Flexbox support

---

## Getting Started

1. **Import Controls** into your K2 SmartForms environment
2. **Add to Forms** via drag-and-drop in the designer
3. **Configure Properties** in the properties panel
4. **Bind Data** using SmartObject list binding (where supported)
5. **Add Rules** for dynamic behavior
6. **Test Accessibility** with keyboard navigation and screen readers

---

## Resources

- **Material Design 3:** https://m3.material.io/
- **Material Icons:** https://fonts.google.com/icons
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **K2 Documentation:** Refer to K2 SmartForms documentation for control integration

---

**Last Updated:** December 2025
**Version:** 1.0
**WCAG Status:** All controls WCAG 2.1 Level AA compliant ✅
