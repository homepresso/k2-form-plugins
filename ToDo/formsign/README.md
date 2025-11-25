# Signature Pad Control for K2 SmartForms

A custom **SmartForms control** that provides signature capture functionality. Users can sign using mouse or touch, and the signature is stored as JSON data that can be reloaded to display the signature in read-only mode.

This is a Modern K2 Form control which is an easy, standards-compliant, web-component based approach to making Custom SmartForms controls.

---

## 📦 Installation (Manage Custom Controls → Add a Control)

Download the `signature-pad.zip` file.

### 1. Upload via "Manage Custom Controls — Add a Control"

1. Open the **K2 Management** site in your browser.
2. Navigate to the Custom Controls section, e.g.:
   - **Manage Custom Controls**, then  
   - Click **Add a Control**.

3. In the **Add Control** dialog:
   - Browse to and select your `signature-pad.zip`.
   - Confirm the control name and metadata from the manifest.
   - Complete the wizard to upload and register the control.

4. After a successful upload:
   - The control will appear in the **Custom Controls** list.
   - It will be available in the **SmartForms Designer Toolbox** under **Signature Pad**.

---

## 💡 How to Use the Control

### Properties

The manifest exposes these key properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Value** | text | "" | JSON string containing the signature data |
| **penColor** | string | "#000000" | Color of the signature pen |
| **penWidth** | number | 2 | Width of the signature stroke |
| **backgroundColor** | string | "#ffffff" | Background color of the signature pad |
| **showClearButton** | boolean | true | Whether to show the clear button |
| **placeholderText** | string | "Sign here" | Placeholder text when empty |

Standard SmartForms properties:
- **Width**
- **Height**
- **IsVisible**
- **IsEnabled**
- **IsReadOnly**
- **DataBinding / ValuePropertyID** integration

### Events

| Event | Description |
|-------|-------------|
| **Changed** | Fired when the signature changes |
| **Cleared** | Fired when the signature is cleared |

### Methods

| Method | Description |
|--------|-------------|
| **clear** | Clears the signature pad |
| **refreshData** | Refreshes/redraws the signature from the Value |

---

## 🎯 Runtime Behavior

### Signing Mode (Default)
When the control is empty and `IsReadOnly` is `false`:
1. The canvas displays a placeholder text ("Sign here")
2. Users can draw their signature using mouse or touch
3. The **Clear** button appears in the top-right corner
4. Each stroke is captured and stored in the Value property as JSON

### Read-Only Mode
When `IsReadOnly` is set to `true`:
1. The signature is displayed but cannot be edited
2. The clear button is hidden
3. A "Read Only" indicator appears
4. Touch/mouse events are disabled

### Loading Existing Signatures
When you set the **Value** property with existing JSON data:
1. The signature is rendered on the canvas
2. The control can be set to read-only to prevent modifications
3. The original strokes are preserved with full fidelity

---

## 📊 Data Shape (Value JSON)

The **Value** property contains JSON like:

```json
{
  "version": 1,
  "width": 800,
  "height": 300,
  "strokes": [
    {
      "color": "#000000",
      "width": 2,
      "points": [
        { "x": 100.5, "y": 50.2, "time": 1730891743000 },
        { "x": 102.3, "y": 51.8, "time": 1730891743016 },
        { "x": 105.1, "y": 54.2, "time": 1730891743032 }
      ]
    },
    {
      "color": "#000000",
      "width": 2,
      "points": [
        { "x": 150.0, "y": 60.0, "time": 1730891744000 }
      ]
    }
  ]
}
```

### Data Structure Details

- **version**: Schema version for future compatibility
- **width/height**: Canvas dimensions when signature was captured
- **strokes**: Array of pen strokes, each containing:
  - **color**: Stroke color (hex)
  - **width**: Stroke width in pixels
  - **points**: Array of points with x, y coordinates and timestamp

You can store this in:
- A SmartObject memo/text field
- A form parameter / view parameter
- Any `string`-type property in K2

---

## 🖼️ Screenshot

```
┌─────────────────────────────────────────────────┐
│                                      [Clear]    │
│                                                 │
│              ∼∼∼∼∼∼∼∼∼∼                        │
│            /          \                         │
│           /            \_____                   │
│          /                                      │
│ ────────────────────────────────────────────── │
│ SIGNATURE                                       │
└─────────────────────────────────────────────────┘
```

---

## 🧩 Example Real-World Scenarios

### ✅ Digital Document Signing

**Scenario:**
A company needs employees to sign expense reports, time sheets, or approval forms digitally.

**Using the Signature Pad Control:**

1. The form includes the expense details and a Signature Pad control.
2. The employee reviews the information and signs using mouse/touch.
3. Upon submission:
   - The **Value** JSON is stored in a SmartObject
   - The timestamp from the stroke data provides a signing audit trail
   - The form can be reopened later with the signature displayed in read-only mode

### ✅ Customer Agreement Forms

**Scenario:**
A retail or service business needs customers to sign agreements on tablets or kiosks.

**Using the Signature Pad Control:**

1. Terms and conditions are displayed on the form.
2. Customer signs in the Signature Pad area.
3. The signature data is stored with the agreement record.
4. Future retrieval displays the exact signature that was captured.

### ✅ Field Inspection Reports

**Scenario:**
Technicians need to capture customer signatures acknowledging completed work.

**Using the Signature Pad Control:**

1. The form is filled out on a mobile device or tablet.
2. Customer signs to acknowledge the work is complete.
3. The **Changed** event triggers saving of the signature.
4. The signature becomes part of the permanent inspection record.

---

## 🛠️ Development & Customization

### File Structure

```
signature-pad/
├── manifest.json      # Control definition
├── control.js         # Main web component code
├── control.css        # Styling
├── icon.svg           # Toolbox icon
└── README.md          # This file
```

### Quick Local Test (Outside K2)

For fast iteration, test in a plain HTML file:

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="./control.css" />
    <style>
      body { font-family: sans-serif; padding: 20px; }
      .demo { margin: 20px 0; }
      button { margin: 5px; padding: 8px 16px; }
      pre { background: #f5f5f5; padding: 10px; overflow: auto; max-height: 200px; }
    </style>
  </head>
  <body>
    <h1>Signature Pad Demo</h1>
    
    <div class="demo">
      <h3>Editable Signature</h3>
      <signature-pad 
        id="sig1"
        style="width: 500px; height: 200px;"
        penColor="#000080"
        penWidth="2.5"
        placeholderText="Please sign here">
      </signature-pad>
    </div>
    
    <div>
      <button onclick="getSignature()">Get JSON</button>
      <button onclick="clearSignature()">Clear</button>
      <button onclick="loadToReadOnly()">Load to Read-Only</button>
    </div>
    
    <h4>JSON Output:</h4>
    <pre id="output"></pre>
    
    <div class="demo">
      <h3>Read-Only Signature</h3>
      <signature-pad 
        id="sig2"
        style="width: 500px; height: 200px;"
        IsReadOnly="true">
      </signature-pad>
    </div>

    <script src="./control.js"></script>
    <script>
      function getSignature() {
        const sig = document.getElementById('sig1');
        document.getElementById('output').textContent = sig.Value || '(empty)';
      }
      
      function clearSignature() {
        document.getElementById('sig1').clear();
        document.getElementById('output').textContent = '(cleared)';
      }
      
      function loadToReadOnly() {
        const sig1 = document.getElementById('sig1');
        const sig2 = document.getElementById('sig2');
        sig2.Value = sig1.Value;
      }
    </script>
  </body>
</html>
```

### Building the ZIP

To create the deployable ZIP file:

```bash
cd signature-pad
zip -r ../signature-pad.zip manifest.json control.js control.css icon.svg README.md
```

---

## ⚙️ Configuration Tips

### Pen Settings
- **penColor**: Use hex colors like `#000000`, `#0000FF`, etc.
- **penWidth**: Values between 1-5 work best; 2 is a good default

### Sizing
- Set explicit **Width** and **Height** for consistent appearance
- The control will maintain its canvas resolution when resized
- Minimum recommended size: 300×150 pixels

### Touch Devices
- The control fully supports touch input
- Consider larger dimensions on tablets for easier signing
- The `touch-action: none` CSS prevents scroll interference

---

## 📝 License

This control is provided for use with K2 SmartForms. Customize and extend as needed for your organization.

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial release |
