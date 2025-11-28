# QR Code Control

Generates and displays QR codes from text, URLs, or any data value.

## Tag Name
```
<qr-code>
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `Value` | Value | The text, URL, or data to encode in the QR code | `https://example.com` |

### Size Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `size` | Size | Size of the QR code in pixels | `150` |
| `quietZone` | Quiet Zone | Size of the white border around the QR code in modules | `4` |

### Color Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `foregroundColor` | Foreground Color | Color of the QR code modules (dark squares) | `#000000` |
| `backgroundColor` | Background Color | Background color of the QR code | `#ffffff` |

### Error Correction

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `errorCorrectionLevel` | Error Correction Level | Error correction level: `L` (7%), `M` (15%), `Q` (25%), `H` (30%) | `M` |

## Events

| Event | Description |
|-------|-------------|
| `Generated` | Fires when QR code is successfully generated |

## Methods

| Method | Description |
|--------|-------------|
| `refresh()` | Regenerates the QR code with current settings |

## Usage Example

### Basic QR Code
```html
<qr-code
  Value="https://example.com">
</qr-code>
```

### Large QR Code
```html
<qr-code
  Value="https://mywebsite.com"
  size="300">
</qr-code>
```

### Custom Colors
```html
<qr-code
  Value="Contact Info"
  foreground-color="#1976D2"
  background-color="#E3F2FD">
</qr-code>
```

### High Error Correction
```html
<qr-code
  Value="Important Data"
  error-correction-level="H"
  size="200">
</qr-code>
```

### Minimal Quiet Zone
```html
<qr-code
  Value="Compact QR"
  quiet-zone="1"
  size="100">
</qr-code>
```

### vCard Contact
```html
<qr-code
  Value="BEGIN:VCARD
VERSION:3.0
N:Doe;John
TEL:+1234567890
EMAIL:john@example.com
END:VCARD">
</qr-code>
```

## Error Correction Levels

| Level | Recovery Capacity | Best For |
|-------|-------------------|----------|
| `L` | ~7% | Clean environments, maximum data |
| `M` | ~15% | General use (default) |
| `Q` | ~25% | Industrial environments |
| `H` | ~30% | Harsh conditions, logo overlays |

## Common Use Cases

- **URLs**: Website links, app download links
- **Contact Info**: vCard format for phone contacts
- **WiFi**: WiFi network credentials
- **Email**: Pre-filled email addresses
- **Phone**: Click-to-call phone numbers
- **Text**: Plain text messages
- **Location**: Geographic coordinates
