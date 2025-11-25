# Google Address Lookup Control for K2 SmartForms

A custom **SmartForms control** that provides Google Places Address Autocomplete functionality. Users can type an address and select from suggestions, with the full address components automatically parsed and available as separate properties.

## 📦 Installation

1. Download the `google-address.zip` file
2. Navigate to **Management > Custom Controls**
3. Click **New** and upload the zip file
4. Save the control

## 🔑 Google API Key Setup

You need a Google Cloud Platform API key with the Places API enabled:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **Places API**
4. Create an API key under **Credentials**
5. (Recommended) Restrict the API key to your domain

## 💡 Properties

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **apiKey** | string | "" | Your Google Places API key (required) |
| **placeholderText** | string | "Start typing an address..." | Input placeholder |
| **controlWidth** | string | "400" | Width in pixels |
| **countryRestriction** | string | "" | Restrict to countries (e.g., "us" or "us,ca,mx") |

### Output Properties (Read-Only)

When a user selects an address, these properties are populated:

| Property | Description | Example |
|----------|-------------|---------|
| **Value** | Full JSON object with all data | `{"formattedAddress":"...","city":"..."}` |
| **formattedAddress** | Full formatted address | "123 Main St, Denver, CO 80202, USA" |
| **streetNumber** | Street number | "123" |
| **streetName** | Street name | "Main St" |
| **city** | City/Locality | "Denver" |
| **state** | State/Province (short) | "CO" |
| **postalCode** | ZIP/Postal code | "80202" |
| **country** | Country name | "United States" |
| **latitude** | Latitude coordinate | "39.7392358" |
| **longitude** | Longitude coordinate | "-104.990251" |
| **placeId** | Google Place ID | "ChIJzxcfI6qAa4cR1jaKJ_j0jhE" |

### Events

| Event | Description |
|-------|-------------|
| **Changed** | Fired when an address is selected |
| **Cleared** | Fired when the address is cleared |

### Methods

| Method | Description |
|--------|-------------|
| **clear** | Clears the address input and all properties |

## 🎯 Usage Example

### Basic Setup

1. Drag the **Google Address Lookup** control onto your form
2. Set the **apiKey** property to your Google API key
3. Optionally set **countryRestriction** to limit results (e.g., "us")

### Binding to SmartObject Fields

You can bind the individual address components to SmartObject fields:

1. Create a rule: **When** Google Address Lookup **Address Selected**
2. **Then** transfer:
   - `GoogleAddressLookup.streetNumber` → `YourSmartObject.StreetNumber`
   - `GoogleAddressLookup.streetName` → `YourSmartObject.StreetName`
   - `GoogleAddressLookup.city` → `YourSmartObject.City`
   - `GoogleAddressLookup.state` → `YourSmartObject.State`
   - `GoogleAddressLookup.postalCode` → `YourSmartObject.PostalCode`
   - `GoogleAddressLookup.country` → `YourSmartObject.Country`

### Storing Complete Address Data

To store the complete address as JSON:

1. Bind the **Value** property to a text/memo field in your SmartObject
2. The JSON contains all parsed components for later retrieval

## 📊 Value JSON Structure

```json
{
  "formattedAddress": "123 Main St, Denver, CO 80202, USA",
  "streetNumber": "123",
  "streetName": "Main St",
  "city": "Denver",
  "state": "CO",
  "postalCode": "80202",
  "country": "United States",
  "latitude": "39.7392358",
  "longitude": "-104.990251",
  "placeId": "ChIJzxcfI6qAa4cR1jaKJ_j0jhE"
}
```

## 🌍 Country Restriction

Limit address suggestions to specific countries using ISO 3166-1 Alpha-2 codes:

- Single country: `us`
- Multiple countries: `us,ca,mx`
- UK: `gb`

## ⚠️ Troubleshooting

### "Google API Key is required"
- Ensure you've set the **apiKey** property

### "Failed to load Google Maps API"
- Check your API key is valid
- Ensure Places API is enabled in Google Cloud Console
- Check for domain restrictions on your API key

### No suggestions appearing
- Verify your API key has Places API enabled
- Check browser console for errors
- Ensure you're typing a valid address format

## 📝 License

This control is provided for use with K2 SmartForms. You are responsible for compliance with Google's Terms of Service and API usage policies.
