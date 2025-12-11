# Material Progress Bar

Material 3 Design progress indicators with linear and circular variants.

## Overview

The Material Progress Bar control provides visual feedback about ongoing processes with two variants (linear and circular) and two modes (determinate and indeterminate). It follows Material Design 3 specifications and is fully WCAG 2.1 Level AA compliant.

## Key Features

- 📊 **Two Variants** - Linear (horizontal bar), Circular (circular indicator)
- ⏳ **Two Modes** - Determinate (specific value), Indeterminate (loading animation)
- 📏 **Four Sizes** - Small, Medium, Large, XLarge (circular variant)
- 🏷️ **Label Support** - Inside, Outside, or Center positioning
- 📦 **Buffer Support** - Secondary progress for linear variant (streaming/buffering)
- 🎬 **Animated** - Smooth transitions for value changes
- ♿ **WCAG 2.1 Level AA** - Full accessibility compliance
- 🎭 **Material Design 3** - Official MD3 specifications

## Installation

1. Upload the control to your K2 SmartForms environment
2. The control will appear in the toolbox as "Material Progress Bar"
3. Drag and drop onto your form

## Properties

### Core Properties
- **Value** - Progress value (0-100)
- **Variant** - Progress type: `linear`, `circular`
- **Mode** - Progress mode: `determinate`, `indeterminate`

### Size & Appearance
- **Size** (circular only) - Indicator size: `small` (32px), `medium` (48px), `large` (64px), `xlarge` (96px)
- **Thickness** - Track thickness in pixels
  - Linear: 4-12px (default: 4)
  - Circular: 2-8px (default: 4)

### Label Properties
- **Show Label** - Display progress percentage (true/false)
- **Label Position** - Label placement: `inside`, `outside`, `center`
  - `inside` - Overlay on progress bar
  - `outside` - Below (linear) or right (circular)
  - `center` - Center of circular indicator
- **Custom Label** - Override percentage with custom text

### Animation
- **Animated** - Enable smooth transitions for value changes (true/false)

### Buffer (Linear Only)
- **Buffer Value** - Secondary progress value (0-100)
- Useful for streaming/buffering scenarios

### Accessibility
- **ARIA Label** - Custom accessible label (defaults to "Progress: X%")

### Color Properties
- **Primary Color** - Progress indicator color (#6750A4)
- **Track Color** - Background track color (#E7E0EC)
- **Buffer Color** - Buffer indicator color (#CAC4D0)
- **Label Color** - Label text color (#1C1B1F)

### Typography
- **Font Family** - Font for label text (default: Roboto, sans-serif)
- **Font Size** - Label font size in pixels (default: 12)
- **Font Weight** - Label font weight (default: 500)

## Events

### Complete
Fires when progress reaches 100%.

**Example:**
```javascript
// K2 Rule: When Complete on Material Progress Bar
// Execute Method: ShowSuccessMessage()
```

## Methods

### reset()
Resets progress to 0.

**Example:**
```javascript
// K2 Rule: When Button Clicked
// Execute Method: Material Progress Bar.reset()
```

### complete()
Sets progress to 100%.

**Example:**
```javascript
// K2 Rule: When Process Finished
// Execute Method: Material Progress Bar.complete()
```

## Variants

### Linear

Horizontal progress bar suitable for inline progress indicators.

**Determinate Mode:**
Shows specific progress value (0-100) with smooth animation.

```javascript
Variant: linear
Mode: determinate
Value: 65
Show Label: true
Label Position: outside
```

**Indeterminate Mode:**
Animated loading bar for unknown duration.

```javascript
Variant: linear
Mode: indeterminate
```

**With Buffer:**
Shows primary and secondary progress (e.g., video buffering).

```javascript
Variant: linear
Mode: determinate
Value: 45 (playback position)
Buffer: 75 (buffered content)
```

### Circular

Circular progress indicator for compact spaces or standalone loaders.

**Determinate Mode:**
Shows specific progress value with arc animation.

```javascript
Variant: circular
Mode: determinate
Value: 75
Size: medium
Show Label: true
Label Position: center
```

**Indeterminate Mode:**
Rotating spinner for loading states.

```javascript
Variant: circular
Mode: indeterminate
Size: large
```

## Size Guide (Circular)

| Size | Diameter | Best Use |
|------|----------|----------|
| Small | 32px | Inline loading, buttons, chips |
| Medium | 48px | Card loading, form sections |
| Large | 64px | Page loading, modal dialogs |
| XLarge | 96px | Full-page loading, splash screens |

## Label Positions

### Inside (Linear)
Label overlays the progress bar with blend mode for visibility.

**Best for:** Wide progress bars with adequate space

### Outside (Linear/Circular)
Label displays below (linear) or to the right (circular).

**Best for:** Always visible labels, narrow progress bars

### Center (Circular Only)
Label displays in the center of the circular indicator.

**Best for:** Circular progress with percentage display

## Use Cases

### File Upload Progress
```javascript
Variant: linear
Mode: determinate
Value: [Upload Progress %]
Show Label: true
Label Position: outside
```

### Form Submission
```javascript
Variant: circular
Mode: indeterminate
Size: medium
```

### Video Buffering
```javascript
Variant: linear
Mode: determinate
Value: [Current Time %]
Buffer: [Buffered %]
Show Label: false
```

### Multi-Step Form
```javascript
Variant: linear
Mode: determinate
Value: [Step Number / Total Steps * 100]
Show Label: true
Custom Label: "Step 2 of 5"
```

### Download Progress
```javascript
Variant: circular
Mode: determinate
Value: [Download %]
Size: large
Show Label: true
Label Position: center
```

### Page Loading
```javascript
Variant: linear
Mode: indeterminate
Thickness: 2
(Placed at top of page)
```

## Accessibility (WCAG 2.1 Level AA)

### Features
- ✅ `role="progressbar"` attribute
- ✅ `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- ✅ `aria-label` for screen readers
- ✅ Proper semantic structure
- ✅ Color contrast compliance
- ✅ Reduced motion support

### Screen Reader Announcements
The control automatically announces:
- Current progress value
- Progress completion
- Custom label text if provided

### Reduced Motion
When users prefer reduced motion:
- Indeterminate animations are replaced with gentle pulse
- Transitions are disabled
- Functionality remains intact

## Styling & Theming

### CSS Custom Properties
```css
--mpb-primary: #6750A4;       /* Progress color */
--mpb-track: #E7E0EC;         /* Track background */
--mpb-buffer: #CAC4D0;        /* Buffer color */
--mpb-label: #1C1B1F;         /* Label text color */
--mpb-thickness: 4px;         /* Track thickness */
```

### Customization Example
```javascript
// K2 Rule: On Form Initialize
// Set Properties:
Primary Color: "#1976D2"      // Blue progress
Track Color: "#BBDEFB"        // Light blue track
Thickness: "8"                // Thicker bar
```

## Animation Behavior

### Determinate Mode
- Smooth transitions when value changes (300ms ease)
- GPU-accelerated transforms for performance
- Can be disabled with `Animated: false`

### Indeterminate Mode
- **Linear**: Continuous left-to-right sweep (2s duration)
- **Circular**: Rotating spinner with stroke animation (1.4s duration)
- Automatically loops

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Uses CSS transforms for GPU acceleration
- Efficient SVG rendering for circular variant
- Minimal reflows during animations
- Optimized for smooth 60fps animations

## Best Practices

### DO
- ✅ Use determinate mode when progress is measurable
- ✅ Use indeterminate mode for unknown duration
- ✅ Provide meaningful ARIA labels
- ✅ Match progress bar variant to context (linear for wide areas, circular for compact spaces)
- ✅ Show labels for longer operations

### DON'T
- ❌ Don't use progress bars for instant operations
- ❌ Don't make progress jump backwards (unless buffering)
- ❌ Don't hide important context (show labels or descriptions)
- ❌ Don't use overly thick progress bars (keep it subtle)

## Resources

- [Material Design 3 Progress Indicators](https://m3.material.io/components/progress-indicators)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [K2 SmartForms Documentation](https://help.k2.com/)

## Using CSS Gradients

All color properties support CSS gradients, allowing you to create visually rich designs beyond solid colors.

### Basic Gradient Examples

**Linear Gradient (Purple to Pink):**
```
Progress Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Radial Gradient:**
```
Progress Color: radial-gradient(circle, #ee7752, #e73c7e, #23a6d5)
```

**Multi-Color Gradient:**
```
Progress Color: linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #667eea 100%)
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

1. Select the Material Progress Bar control
2. Find the color property (e.g., "Progress Color" or "Track Color")
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

## Version

**Version:** 1.0
**Last Updated:** December 2025
**WCAG Status:** WCAG 2.1 Level AA Compliant ✅
