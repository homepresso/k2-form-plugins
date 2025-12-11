# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Control Dojo is a web-based development environment for Nintex K2 custom controls. It provides debugging, inspection, and control generation capabilities for K2 SmartForms custom controls. The project consists of a Vue.js frontend and Express.js backend, with a comprehensive collection of Material Design 3 controls.

## Development Commands

### Starting the Application
```bash
# Start both frontend and backend (recommended)
npm run dev:full

# Start backend only (port 3001)
npm run start:backend

# Start frontend only (port 3000)
npm run start:frontend
```

Access the application at `http://localhost:3000`

### Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview

# Generate controls list
npm run generate-controls
```

## Architecture

### Frontend (Port 3000)
- **Framework:** Vue 3 with Vite
- **UI:** Flowbite Vue components with Tailwind CSS
- **Key Libraries:** markdown-it (documentation rendering), highlight.js (code syntax), jszip (client-side ZIP creation)
- **Main Entry:** Frontend files in root directory

### Backend (Port 3001)
- **Framework:** Express.js
- **Purpose:** File operations, ZIP generation, serving control files
- **Main File:** `server.js`
- **Key Features:** Serves controls from `/Controls` directory, generates ZIP archives via archiver

### Control Structure

Each K2 custom control follows a strict file structure in `Controls/[Control Name]/`:

**Required Files:**
- `manifest.json` - Control configuration and metadata
- `runtime_logic.js` - Production JavaScript (executed in K2 runtime)
- `runtime_style.css` - Production styles
- `designtime_logic.js` - Designer preview JavaScript (executed in K2 designer)
- `designtime_style.css` - Designer preview styles
- `icon.svg` - Control icon for K2 toolbox
- `README.md` - Control documentation

### Manifest.json Structure

Critical K2-specific requirements:
```json
{
  "icon": "icon.svg",
  "displayName": "Control Name",
  "tagName": "custom-element-name",
  "valuePropertyID": "propertyId",
  "supports": ["Value", "Width", "IsVisible", "IsEnabled"],
  "properties": [
    {
      "id": "propertyId",
      "type": "string",          // NOT "boolean" - use "string" for booleans
      "inputlength": "255",
      "refreshdisplay": "true",
      "changesdisplay": true
    }
  ],
  "methods": [
    {
      "id": "methodId",          // NOT "name"
      "displayname": "Method",   // lowercase 'n'
      "returntype": "None",
      "parameters": []
    }
  ]
}
```

**Critical K2 Limitations:**
- Boolean type is NOT supported - use `"type": "string"` with `"initialvalue": "false"`
- Methods require: `id`, `displayname` (lowercase 'n'), `returntype`, `parameters` array
- Property IDs cannot conflict with manifest root keys (e.g., can't have both `"icon": "icon.svg"` and a property `"id": "icon"`)

### Material Controls Collection (21 Controls)

**K2 List Binding Pattern:**
Controls with `"type": "listdata"` in properties support direct SmartObject binding:
```json
{
  "id": "List",
  "type": "listdata",
  "category": "Detail",
  "refreshdisplay": "true"
}
```

**JavaScript Implementation:**
```javascript
// K2 list binding callbacks
listConfigChangedCallback(config, listname) {
  this._listConfig = config;
}

listItemsChangedCallback(itemsChangedEventArgs) {
  const items = itemsChangedEventArgs?.NewItems;
  this._processDataItems(items);
}
```

**Controls with K2 List Binding:**
- Material Select (columns: Value, Display/Label)
- Material List (columns: Icon, Title, Subtitle, Value, Checked)
- Material List View Card (columns: Image, Title, Subtitle, Description, Value, Action)
- Material Carousel (columns: Image, Title, Subtitle)

**Common Patterns:**
- All Material controls are WCAG 2.1 Level AA compliant
- Custom elements defined with `window.customElements.define()`
- Property getters/setters provide both lowercase and PascalCase (e.g., `get value()` and `get Value()`)
- Use `safeRaisePropertyChanged(this, 'propertyName')` for K2 binding updates
- Load Material Icons and Google Fonts (Roboto) in connectedCallback
- CSS uses custom properties (CSS variables) for theming

### JavaScript Control Pattern

```javascript
(function() {
  'use strict';

  // Helper for K2 property notifications
  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2?.RaisePropertyChanged) {
      K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  // Load fonts
  function loadMaterialIcons() { /* ... */ }
  function loadGoogleFonts() { /* ... */ }

  if (!window.customElements.get('tag-name')) {
    window.customElements.define('tag-name', class ControlName extends HTMLElement {
      constructor() {
        super();
        this._hasRendered = false;
        this._propertyName = 'defaultValue';
        // ... properties
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      // Property getters/setters with K2 notifications
      get propertyName() { return this._propertyName; }
      set propertyName(v) {
        this._propertyName = v || 'default';
        if (this._hasRendered) this._applyChanges();
        safeRaisePropertyChanged(this, 'propertyName');
      }
      get PropertyName() { return this.propertyName; }
      set PropertyName(v) { this.propertyName = v; }

      // Standard K2 properties
      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }
    });
  }
})();
```

### Design-time vs Runtime Differences

**Design-time (designtime_logic.js):**
- Adds `tabindex="-1"` to prevent focus
- Disables pointer events or interactive behavior
- May simplify complex features for preview
- Does NOT call `safeRaisePropertyChanged()` (no K2 context needed)

**Runtime (runtime_logic.js):**
- Full interactivity enabled
- Calls `safeRaisePropertyChanged()` for K2 binding
- May include K2 BaseControl inheritance: `window.K2BaseControl || HTMLElement`
- Dispatches CustomEvents with `bubbles: true` for K2 event handling

## File Validation

Always validate files before committing:
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('path/to/manifest.json', 'utf8')); console.log('Valid JSON')"

# Validate JavaScript syntax
node -c path/to/script.js
```

## Material Design 3 Specifications

All Material controls follow MD3 guidelines:
- **Colors:** Primary (#6750A4), Surface (#FFFBFE), variants
- **Typography:** Roboto font family, MD3 type scale
- **Elevation:** Standard shadow tokens for elevated variants
- **State Layers:** Hover (8%), Focus (12%), Pressed (16%), Selected (12%)
- **Border Radius:** 12px for cards, 4px for buttons
- **Motion:** 200ms transitions with Material easing curve

## Documentation Files

- **MATERIAL_CONTROLS.md** - Comprehensive overview of all 21 Material controls
- **Controls/[Name]/README.md** - Individual control documentation with usage examples, properties, events, methods, accessibility features

## Common Issues

1. **Boolean Properties:** K2 doesn't support boolean type - always use string with "true"/"false" values
2. **Property Name Conflicts:** Property IDs cannot duplicate manifest root keys
3. **Method Format:** Must use `id`, `displayname` (lowercase), `returntype`, `parameters` array
4. **List Binding:** Requires implementing `listConfigChangedCallback` and `listItemsChangedCallback`
5. **Icon Button Background:** `containerColor` only applies to filled/tonal variants, not standard/outlined
6. **Property Changes:** Always call `safeRaisePropertyChanged()` in runtime setters for K2 binding updates

## WCAG Compliance Requirements

All controls must be WCAG 2.1 Level AA compliant:
- Proper ARIA attributes (role, aria-label, aria-pressed, aria-selected, etc.)
- Keyboard navigation support (Tab, Enter, Space, Arrow keys)
- Focus indicators (visible outlines)
- Screen reader support with descriptive labels
- Color contrast meeting AA standards
- Reduced motion support (`@media (prefers-reduced-motion: reduce)`)
