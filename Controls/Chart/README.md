# Chart Control

A comprehensive charting control with Material 3 design supporting pie, bar, line, scatter, waterfall, doughnut, radar, and more.

## Tag Name
```
<k2-chart>
```

## Properties

### Data Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `labels` | Labels | Labels/names for chart data points (separated by delimiter) | `Sales,Marketing,Development,Support,Operations` |
| `values` | Values | Values for chart data points (separated by delimiter) | `45,25,30,15,20` |
| `delimiter` | Delimiter | Character used to separate labels and values | `,` |
| `selectedLabel` | Selected Label | The label of the clicked segment (read-only) | `""` |
| `selectedValue` | Selected Value | The value of the clicked segment (read-only) | `""` |

### Chart Configuration

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `chartType` | Chart Type | Type of chart: `pie`, `doughnut`, `bar`, `horizontalBar`, `line`, `area`, `scatter`, `radar`, `polarArea`, `waterfall`, `bubble` | `bar` |
| `chartTitle` | Chart Title | Title displayed above the chart | `""` |
| `controlWidth` | Width | Width of the chart in pixels | `500` |
| `controlHeight` | Height | Height of the chart in pixels | `400` |

### Legend Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showLegend` | Show Legend | Show or hide the legend (true/false) | `true` |
| `legendPosition` | Legend Position | Position of the legend: `top`, `bottom`, `left`, `right` | `top` |

### Display Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `showDataLabels` | Show Data Labels | Show values on chart segments (true/false) | `false` |
| `showGrid` | Show Grid Lines | Show grid lines on axes (true/false) | `true` |
| `enableAnimation` | Enable Animation | Enable chart animations (true/false) | `true` |
| `aspectRatio` | Maintain Aspect Ratio | Maintain aspect ratio on resize (true/false) | `false` |

### Style Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `colorScheme` | Color Scheme | Color palette: `material`, `pastel`, `vibrant`, `monochrome`, `gradient`, `ocean`, `forest`, `sunset`, `custom` | `material` |
| `customColors` | Custom Colors | Comma-separated hex colors for custom color scheme | `""` |
| `primaryColor` | Primary Color | Primary accent color (Material 3) | `#6750A4` |
| `backgroundColor` | Background Color | Chart container background color | `""` |

### Axis Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `xAxisLabel` | X-Axis Label | Label for the X-axis | `""` |
| `yAxisLabel` | Y-Axis Label | Label for the Y-axis | `""` |

### Advanced Properties

| Property | Friendly Name | Description | Default |
|----------|--------------|-------------|---------|
| `stacked` | Stacked | Stack bars/areas for multi-series data (true/false) | `false` |
| `tension` | Line Tension | Smoothness of line charts (0 = straight, 0.4 = curved) | `0.3` |
| `borderRadius` | Bar Border Radius | Rounded corners on bars (pixels) | `8` |

## Events

| Event | Description |
|-------|-------------|
| `SegmentClicked` | Fires when a chart segment is clicked |
| `DataLoaded` | Fires when chart data is loaded |

## Methods

| Method | Description |
|--------|-------------|
| `refresh()` | Re-renders the chart with current data |

## Usage Example

### Basic Bar Chart
```html
<k2-chart
  chart-type="bar"
  labels="Q1,Q2,Q3,Q4"
  values="120,150,180,200"
  chart-title="Quarterly Sales">
</k2-chart>
```

### Pie Chart with Custom Colors
```html
<k2-chart
  chart-type="pie"
  labels="North,South,East,West"
  values="35,28,22,15"
  color-scheme="custom"
  custom-colors="#FF6384,#36A2EB,#FFCE56,#4BC0C0">
</k2-chart>
```

### Line Chart with Curved Lines
```html
<k2-chart
  chart-type="line"
  labels="Jan,Feb,Mar,Apr,May"
  values="10,25,15,30,45"
  tension="0.4"
  show-grid="true">
</k2-chart>
```

### Horizontal Bar Chart
```html
<k2-chart
  chart-type="horizontalBar"
  labels="Product A,Product B,Product C"
  values="85,62,43"
  show-data-labels="true">
</k2-chart>
```
