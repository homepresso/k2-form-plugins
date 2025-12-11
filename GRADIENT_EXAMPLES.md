# CSS Gradient Support for Material Controls

All 21 Material Design controls now support CSS gradients for background color properties!

## What Changed

All Material controls' CSS files have been updated to use `background: var(...)` instead of `background-color: var(...)`, enabling full CSS gradient support while maintaining backward compatibility with solid colors.

## How to Use Gradients

### Linear Gradients

**Horizontal Gradient:**
```css
Primary Color: linear-gradient(90deg, #667eea 0%, #764ba2 100%)
```

**Diagonal Gradient:**
```css
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Vertical Gradient:**
```css
Background Color: linear-gradient(180deg, #f093fb 0%, #f5576c 100%)
```

**Multi-Color Gradient:**
```css
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
```

### Radial Gradients

**Centered Circle:**
```css
Container Color: radial-gradient(circle, #ff6b6b 0%, #4ecdc4 100%)
```

**Ellipse from Top:**
```css
Background Color: radial-gradient(ellipse at top, #e0c3fc 0%, #8ec5fc 100%)
```

### Conic Gradients

**Rainbow Effect:**
```css
Primary Color: conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)
```

## Popular Gradient Combinations

### Professional & Business

**Blue to Purple:**
```css
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Teal to Blue:**
```css
linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)
```

**Warm Sunset:**
```css
linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)
```

### Vibrant & Modern

**Pink to Orange:**
```css
linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
```

**Green to Cyan:**
```css
linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

**Purple to Pink:**
```css
linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)
```

### Dark & Sleek

**Dark Blue:**
```css
linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)
```

**Deep Purple:**
```css
linear-gradient(135deg, #2c003e 0%, #512b58 50%, #764ba2 100%)
```

**Slate Gray:**
```css
linear-gradient(135deg, #283c86 0%, #45a247 100%)
```

## Control-Specific Examples

### Material Button
```javascript
// K2 Property Settings:
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Hover Color: linear-gradient(135deg, #5568d3 0%, #654a8e 100%)
```

### Material Card
```javascript
// K2 Property Settings:
Background Color: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
Surface Color: linear-gradient(180deg, #ffecd2 0%, #fcb69f 100%)
```

### Material Progress Bar
```javascript
// K2 Property Settings:
Primary Color: linear-gradient(90deg, #667eea 0%, #764ba2 100%)
Track Color: linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 100%)
```

### Material List View Card
```javascript
// K2 Property Settings:
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Background Color: radial-gradient(circle at top left, #ffffff 0%, #f5f5f5 100%)
Surface Color: linear-gradient(180deg, #ffecd2 0%, #fcb69f 100%)
```

### Material FAB Menu
```javascript
// K2 Property Settings:
Primary Color: linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 100%)
Secondary Color: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

### Material Split Button
```javascript
// K2 Property Settings:
Primary Color: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Surface Variant Color: linear-gradient(90deg, #e7e0ec 0%, #d5cce0 100%)
```

## Gradient Tools & Resources

**Online Gradient Generators:**
- [CSS Gradient](https://cssgradient.io/) - Visual gradient builder
- [UI Gradients](https://uigradients.com/) - Curated gradient collection
- [Gradient Hunt](https://gradienthunt.com/) - Free gradient inspirations
- [WebGradients](https://webgradients.com/) - 180 linear gradients

**CSS Gradient Syntax:**
```css
/* Linear Gradient Syntax */
linear-gradient(direction, color-stop1, color-stop2, ...)

/* Radial Gradient Syntax */
radial-gradient(shape size at position, color-stop1, color-stop2, ...)

/* Conic Gradient Syntax */
conic-gradient(from angle at position, color-stop1, color-stop2, ...)
```

## Browser Support

All modern browsers support CSS gradients:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Backward Compatibility

Solid colors still work perfectly:
```css
Primary Color: #6750A4
Background Color: #FFFBFE
```

You can mix and match - use gradients for some properties and solid colors for others!

## Tips for Best Results

1. **Keep it Simple:** Start with 2-3 colors for readability
2. **Test Contrast:** Ensure text remains readable on gradient backgrounds
3. **Use Opacity:** Add transparency with rgba colors: `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)`
4. **Match Direction:** Use 90deg for horizontal progress bars, 135deg for buttons/cards
5. **Consistent Angles:** Use the same angle across related elements for cohesion

## WCAG Compliance Note

When using gradients with text:
- Ensure text color contrasts with ALL parts of the gradient
- Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Consider using semi-transparent overlays for complex gradients with text

## Version

**Updated:** December 2025
**Controls Updated:** All 21 Material Design 3 controls
**Gradient Support:** ✅ Full CSS gradient support enabled
