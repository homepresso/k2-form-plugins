# Material Address Lookup Control

A Material 3 Design address input with Google Places Autocomplete integration, floating labels, and parsed address components.

## Tag Name
```
<material-address>
```

## Known Issues

### K2 Designer Clipping
In the K2 SmartForms designer, the outlined variant's top border may be clipped when the control is placed near the edge of a view or container. This is due to the K2 designer's parent container having `overflow: hidden`. The control displays correctly at runtime.

**Workaround:** Position the control with some margin from the top edge of views/containers in the designer.

## Properties

### Google API Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `apiKey` | API Key | Google Maps API key with Places API enabled | `""` |
| `countryRestriction` | Country Restriction | Restrict results to specific country (ISO 3166-1 Alpha-2 code, e.g., 'US', 'GB', 'AU') | `""` |

### Value Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `Value` | Value | JSON string containing full address data | `""` |
| `formattedAddress` | Formatted Address | Full formatted address string (read-only) | `""` |
| `streetNumber` | Street Number | Street number component (read-only) | `""` |
| `streetName` | Street Name | Street name component (read-only) | `""` |
| `city` | City | City/locality component (read-only) | `""` |
| `state` | State | State/province component (read-only) | `""` |
| `postalCode` | Postal Code | Postal/ZIP code component (read-only) | `""` |
| `country` | Country | Country component (read-only) | `""` |
| `latitude` | Latitude | Latitude coordinate (read-only) | `""` |
| `longitude` | Longitude | Longitude coordinate (read-only) | `""` |
| `placeId` | Place ID | Google Place ID (read-only) | `""` |

### Label Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `label` | Label | Floating label text | `Address` |
| `placeholder` | Placeholder | Placeholder text when empty | `Start typing an address...` |
| `helperText` | Helper Text | Helper text displayed below the input | `""` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `variant` | Variant | Style variant: `filled`, `outlined` | `outlined` |
| `controlHeight` | Height | Height of the input field in pixels | `56` |
| `controlPadding` | Padding | Padding around the control in pixels | `8` |

### Icon Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `leadingIcon` | Leading Icon | Material icon name for leading icon | `location_on` |

### Validation Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `required` | Required | Mark field as required (true/false) | `false` |
| `hasError` | Has Error | Show error state (true/false) | `false` |
| `errorText` | Error Text | Error message displayed when hasError is true | `""` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `primaryColor` | Primary Color | Primary/accent color for focus state | `#6750A4` |
| `textColor` | Text Color | Color of the input text | `#1C1B1F` |
| `labelColor` | Label Color | Color of the floating label | `#49454F` |
| `borderColor` | Border Color | Color of the border/outline | `#79747E` |
| `backgroundColor` | Background Color | Background color (for filled variant) | `#E7E0EC` |
| `errorColor` | Error Color | Color used for error state | `#B3261E` |
| `iconColor` | Icon Color | Color of the leading icon | `#49454F` |
| `labelBackground` | Label Background | Background color behind floating label | `#ffffff` |

### Typography Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `fontFamily` | Font Family | Font family for input text | `Roboto, sans-serif` |
| `fontSize` | Font Size | Font size in pixels | `16` |
| `fontWeight` | Font Weight | Font weight: normal, bold, 100-900 | `normal` |
| `fontStyle` | Font Style | Font style: normal, italic | `normal` |
| `labelFontSize` | Label Font Size | Font size for label in pixels | `16` |
| `labelFontWeight` | Label Font Weight | Font weight for label | `normal` |
| `labelFontStyle` | Label Font Style | Font style for label: normal, italic | `normal` |

## Events

| Event | Description |
|-------|-------------|
| `AddressSelected` | Fires when a user selects an address from suggestions |
| `AddressCleared` | Fires when the address is cleared |
| `Focus` | Fires when the input receives focus |
| `Blur` | Fires when the input loses focus |

## Methods

| Method | Description |
|--------|-------------|
| `focus()` | Sets focus to the input |
| `clear()` | Clears the selected address |

## Usage Example

### Basic Address Lookup
```html
<material-address
  api-key="YOUR_GOOGLE_API_KEY"
  label="Delivery Address">
</material-address>
```

### With Country Restriction
```html
<material-address
  api-key="YOUR_GOOGLE_API_KEY"
  label="Address"
  country-restriction="US"
  placeholder="Enter US address">
</material-address>
```

### Filled Variant
```html
<material-address
  api-key="YOUR_GOOGLE_API_KEY"
  variant="filled"
  label="Shipping Address"
  helper-text="Start typing to search">
</material-address>
```

### Required with Custom Colors
```html
<material-address
  api-key="YOUR_GOOGLE_API_KEY"
  label="Home Address"
  required="true"
  primary-color="#1976D2"
  error-color="#D32F2F">
</material-address>
```

### Custom Styling
```html
<material-address
  api-key="YOUR_GOOGLE_API_KEY"
  label="Office Location"
  font-family="Poppins, sans-serif"
  font-size="18"
  leading-icon="business">
</material-address>
```

## Value Format

The `Value` property returns a JSON string with the following structure:

```json
{
  "formattedAddress": "123 Main St, New York, NY 10001, USA",
  "streetNumber": "123",
  "streetName": "Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "placeId": "ChIJd8BlQ2BZwokRAFUEcm_qrcA"
}
```

## Google API Setup

1. Create a Google Cloud project
2. Enable the Places API (New)
3. Create an API key with Places API access
4. Restrict the API key to your domains for security

## Variants

| Variant | Description |
|---------|-------------|
| `outlined` | Border outline with floating label |
| `filled` | Solid background with floating label |
