# Material Card Control

Material 3 Design card for displaying content with media, header, and actions.

## Tag Name
```
<material-card>
```

## WCAG Compliance

✅ **WCAG 2.1 Level AA Compliant**

This control implements comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for clickable cards (Enter and Space keys)
- **ARIA Attributes**: Proper ARIA implementation for interactive cards
  - `role="button"` for clickable cards
  - `aria-label` for accessible card names (configurable)
  - `tabindex="0"` for keyboard accessibility
- **Screen Reader Support**: Clickable cards properly labeled for assistive technology
- **Focus Management**: Visible focus indicators for interactive cards

### New Accessibility Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `ariaLabel` | ARIA Label | Accessible label for clickable cards (WCAG required for clickable) | Falls back to headline or "Card" |

## Properties

### Content Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `headline` | Headline | Card headline/title text | `Card Title` |
| `subhead` | Subhead | Card subhead text | `""` |
| `supportingText` | Supporting Text | Card body/description text | `""` |
| `overline` | Overline | Overline text above headline | `""` |

### Media Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `image` | Image | Card media image URL | `""` |
| `imagePosition` | Image Position | Image position: `top`, `bottom` | `top` |

### Avatar Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `avatar` | Avatar | Avatar image URL or Material icon name | `""` |
| `avatarText` | Avatar Text | Avatar text (first letter shown) | `""` |

### Action Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryAction` | Primary Action | Primary action button text | `""` |
| `secondaryAction` | Secondary Action | Secondary action button text | `""` |
| `showDivider` | Show Divider | Show divider above actions (true/false) | `false` |
| `clickable` | Clickable | Make entire card clickable (true/false) | `false` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Card style: `elevated`, `filled`, `outlined` | `elevated` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color | `#6750A4` |
| `backgroundColor` | Background Color | Card background color | `#FFFBFE` |
| `surfaceColor` | Surface Color | Filled variant surface color | `#F7F2FA` |
| `borderColor` | Border Color | Outlined variant border color | `#CAC4D0` |
| `headlineColor` | Headline Color | Headline text color | `#1C1B1F` |
| `subheadColor` | Subhead Color | Subhead text color | `#49454F` |
| `supportingTextColor` | Supporting Text Color | Body text color | `#49454F` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for text | `Roboto, sans-serif` |

## Events

| Event | Description |
|-------|-------------|
| `CardClicked` | Fires when clickable card is clicked |
| `PrimaryAction` | Fires when primary action button is clicked |
| `SecondaryAction` | Fires when secondary action button is clicked |

## Usage Example

### Basic Card
```html
<material-card
  headline="Project Update"
  subhead="Marketing Team"
  supporting-text="The campaign launch has been rescheduled for next week.">
</material-card>
```

### Card with Image
```html
<material-card
  image="https://example.com/image.jpg"
  image-position="top"
  headline="Nature Photography"
  supporting-text="Explore the beauty of nature through stunning photography.">
</material-card>
```

### Card with Avatar and Actions
```html
<material-card
  avatar="person"
  headline="John Doe"
  subhead="Software Engineer"
  supporting-text="Working on exciting new features."
  primary-action="View Profile"
  secondary-action="Message">
</material-card>
```

### Outlined Clickable Card
```html
<material-card
  variant="outlined"
  clickable="true"
  headline="Click to Learn More"
  overline="FEATURED"
  supporting-text="This entire card is clickable.">
</material-card>
```

### Filled Card with Divider
```html
<material-card
  variant="filled"
  headline="Settings"
  supporting-text="Configure your preferences"
  primary-action="Save"
  secondary-action="Cancel"
  show-divider="true">
</material-card>
```

## Card Variants

| Variant | Description |
|---------|-------------|
| `elevated` | Card with shadow/elevation effect |
| `filled` | Card with solid background fill |
| `outlined` | Card with border outline |
