/**
 * Chart Control for K2 SmartForms
 * Material 3 Design with comprehensive charting options
 * Uses Chart.js for rendering
 */
(function() {
  'use strict';

  // Ensure K2 namespace exists
  if (typeof window.K2 === "undefined") {
    window.K2 = {};
  }

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2?.RaisePropertyChanged) {
      K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  // Load Chart.js from CDN
  let chartJsLoaded = false;
  let chartJsLoadPromise = null;

  function loadChartJs() {
    if (chartJsLoaded) return Promise.resolve();
    if (chartJsLoadPromise) return chartJsLoadPromise;

    chartJsLoadPromise = new Promise((resolve, reject) => {
      if (window.Chart) {
        chartJsLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.async = true;
      script.onload = () => {
        // Load datalabels plugin
        const pluginScript = document.createElement('script');
        pluginScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js';
        pluginScript.async = true;
        pluginScript.onload = () => {
          chartJsLoaded = true;
          resolve();
        };
        pluginScript.onerror = () => {
          chartJsLoaded = true;
          resolve(); // Continue without plugin
        };
        document.head.appendChild(pluginScript);
      };
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    });

    return chartJsLoadPromise;
  }

  // Color schemes
  const COLOR_SCHEMES = {
    material: [
      '#6750A4', '#7D5260', '#625B71', '#B3261E', '#E8DEF8',
      '#9A82DB', '#D0BCFF', '#CCC2DC', '#EFB8C8', '#F7DEE3'
    ],
    pastel: [
      '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
      '#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'
    ],
    vibrant: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#7BC225', '#E8C3B9'
    ],
    monochrome: [
      '#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560',
      '#393e46', '#222831', '#00adb5', '#eeeeee', '#4a4e69'
    ],
    gradient: [
      '#667eea', '#764ba2', '#6B8DD6', '#8E37D7', '#B721FF',
      '#21D4FD', '#B721FF', '#FA709A', '#FEE140', '#00C9FF'
    ],
    ocean: [
      '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#03045E',
      '#023E8A', '#0096C7', '#48CAE4', '#ADE8F4', '#0077B6'
    ],
    forest: [
      '#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2',
      '#B7E4C7', '#D8F3DC', '#1B4332', '#081C15', '#2D6A4F'
    ],
    sunset: [
      '#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8',
      '#3A0CA3', '#3F37C9', '#4361EE', '#4895EF', '#4CC9F0'
    ]
  };

  // Get base class - check if K2BaseControl exists
  const BaseClass = window.K2BaseControl || HTMLElement;

  if (!window.customElements.get('k2-chart')) {
    window.customElements.define('k2-chart', class K2ChartControl extends BaseClass {

      constructor() {
        super();

        this._hasRendered = false;
        this._chart = null;
        this._listConfig = { partmappings: {} };
        this._dataItems = [];
        this._chartData = [];

        // Properties
        this._chartType = 'bar';
        this._chartTitle = '';
        this._controlWidth = 500;
        this._controlHeight = 400;
        this._showLegend = true;
        this._legendPosition = 'top';
        this._showDataLabels = false;
        this._colorScheme = 'material';
        this._customColors = '';
        this._primaryColor = '#6750A4';
        this._backgroundColor = '';
        this._showGrid = true;
        this._enableAnimation = true;
        this._stacked = false;
        this._tension = 0.3;
        this._borderRadius = 8;
        this._aspectRatio = false;
        this._xAxisLabel = '';
        this._yAxisLabel = '';
        this._isVisible = true;
        this._isEnabled = true;

        // Selected segment
        this._selectedLabel = '';
        this._selectedValue = '';

        // Initial sample data
        this._initialListValue = '[{"label": "Sales", "value": 45}, {"label": "Marketing", "value": 25}, {"label": "Development", "value": 30}, {"label": "Support", "value": 15}, {"label": "Operations", "value": 20}]';

        // DOM refs
        this._container = null;
        this._canvas = null;
      }

      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        if (this._hasRendered) return;

        loadChartJs().then(() => {
          this._render();
          this._hasRendered = true;
        }).catch(err => {
          console.error('Failed to load Chart.js:', err);
        });
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) super.disconnectedCallback();
        if (this._chart) {
          this._chart.destroy();
          this._chart = null;
        }
      }

      // K2 List API Methods
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
        this._processDataItems();
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const isDesignTime = window.K2?.IsDesigner === true;
        let itemsToProcess = itemsChangedEventArgs.NewItems;

        // Fallback for design time
        if (isDesignTime && (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0)) {
          try {
            itemsToProcess = JSON.parse(this._initialListValue);
          } catch (e) {
            console.error('[Chart] Error parsing fallback:', e);
          }
        }

        if (Array.isArray(itemsToProcess)) {
          this._dataItems = itemsToProcess;
          this._processDataItems();
        }
      }

      _processDataItems() {
        this._chartData = [];

        if (!Array.isArray(this._dataItems) || this._dataItems.length === 0) {
          // Use initial value if no data
          try {
            this._dataItems = JSON.parse(this._initialListValue);
          } catch (e) {
            this._dataItems = [];
          }
        }

        // Get field mappings
        let labelProp = 'label';
        let valueProp = 'value';
        let valueProp2 = 'value2'; // For bubble/scatter
        let valueProp3 = 'value3'; // For bubble radius

        if (this._listConfig?.partmappings) {
          labelProp = this._listConfig.partmappings['Display'] || this._listConfig.partmappings['Label'] || 'label';
          valueProp = this._listConfig.partmappings['Value'] || 'value';
        }

        // Process items
        for (const item of this._dataItems) {
          let label = item[labelProp] || item.label || item.name || item.category || '';
          let value = parseFloat(item[valueProp] || item.value || 0);
          let value2 = parseFloat(item[valueProp2] || item.value2 || item.x || 0);
          let value3 = parseFloat(item[valueProp3] || item.value3 || item.r || 10);

          // Handle template strings
          if (labelProp.startsWith('<Template>') && this.parseDisplayTemplate) {
            label = this.parseDisplayTemplate(labelProp, item);
          }

          this._chartData.push({
            label: String(label),
            value: isNaN(value) ? 0 : value,
            value2: isNaN(value2) ? 0 : value2,
            value3: isNaN(value3) ? 10 : value3,
            rawData: item
          });
        }

        if (this._hasRendered) {
          this._renderChart();
        }

        this.dispatchEvent(new CustomEvent('DataLoaded', {
          bubbles: true,
          detail: { itemCount: this._chartData.length }
        }));
      }

      _render() {
        this.innerHTML = '';

        this._container = document.createElement('div');
        this._container.className = 'chart-container';

        this._canvas = document.createElement('canvas');
        this._container.appendChild(this._canvas);

        this.appendChild(this._container);
        this._applyStyles();

        // Process initial data
        this._processDataItems();
      }

      _applyStyles() {
        this.style.cssText = `
          display: ${this._isVisible ? 'block' : 'none'};
          width: ${this._controlWidth}px;
          height: ${this._controlHeight}px;
        `;

        const bgColor = this._backgroundColor && this._backgroundColor.trim() !== ''
          ? this._backgroundColor
          : '#FFFBFE';

        this._container.style.cssText = `
          width: 100%;
          height: 100%;
          padding: 16px;
          box-sizing: border-box;
          background: ${bgColor};
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          font-family: 'Roboto', sans-serif;
        `;
      }

      _getColors() {
        if (this._customColors) {
          return this._customColors.split(',').map(c => c.trim());
        }
        return COLOR_SCHEMES[this._colorScheme] || COLOR_SCHEMES.material;
      }

      _renderChart() {
        if (!this._canvas || !window.Chart) return;

        // Destroy existing chart
        if (this._chart) {
          this._chart.destroy();
          this._chart = null;
        }

        const ctx = this._canvas.getContext('2d');
        const colors = this._getColors();
        const labels = this._chartData.map(d => d.label);
        const values = this._chartData.map(d => d.value);

        // Determine chart type and config
        let chartType = this._chartType;
        let data, options;

        // Handle special chart types
        if (chartType === 'horizontalBar') {
          chartType = 'bar';
        }

        if (chartType === 'area') {
          chartType = 'line';
        }

        if (chartType === 'waterfall') {
          // Waterfall is a special bar chart
          chartType = 'bar';
          data = this._getWaterfallData(labels, values, colors);
        } else if (chartType === 'bubble') {
          data = this._getBubbleData(colors);
        } else if (chartType === 'scatter') {
          data = this._getScatterData(colors);
        } else {
          data = this._getStandardData(labels, values, colors);
        }

        options = this._getChartOptions();

        // Register datalabels plugin if available
        const plugins = [];
        if (window.ChartDataLabels && this._showDataLabels) {
          Chart.register(ChartDataLabels);
        }

        this._chart = new Chart(ctx, {
          type: chartType,
          data: data,
          options: options
        });
      }

      _getStandardData(labels, values, colors) {
        const isPieType = ['pie', 'doughnut', 'polarArea'].includes(this._chartType);
        const isLineType = ['line', 'area'].includes(this._chartType);
        const isRadar = this._chartType === 'radar';

        const backgroundColors = isPieType || isRadar
          ? colors.slice(0, values.length)
          : colors[0];

        const borderColors = isPieType
          ? '#ffffff'
          : colors[0];

        const dataset = {
          label: this._chartTitle || 'Data',
          data: values,
          backgroundColor: isPieType ? backgroundColors : this._addAlpha(colors[0], 0.7),
          borderColor: isLineType ? colors[0] : borderColors,
          borderWidth: isPieType ? 2 : isLineType ? 3 : 0,
          borderRadius: this._borderRadius,
          tension: this._tension,
          fill: this._chartType === 'area',
          pointBackgroundColor: colors[0],
          pointBorderColor: '#fff',
          pointRadius: isLineType ? 4 : 3,
          pointHoverRadius: 6
        };

        return {
          labels: labels,
          datasets: [dataset]
        };
      }

      _getWaterfallData(labels, values, colors) {
        // Calculate cumulative values for waterfall
        let cumulative = 0;
        const waterfallData = [];
        const backgroundColors = [];

        for (let i = 0; i < values.length; i++) {
          const value = values[i];
          const isLast = i === values.length - 1;

          if (isLast) {
            // Total bar
            waterfallData.push([0, cumulative + value]);
            backgroundColors.push(colors[2] || '#6750A4');
          } else if (value >= 0) {
            // Positive
            waterfallData.push([cumulative, cumulative + value]);
            backgroundColors.push(colors[0] || '#4CAF50');
            cumulative += value;
          } else {
            // Negative
            waterfallData.push([cumulative + value, cumulative]);
            backgroundColors.push(colors[1] || '#F44336');
            cumulative += value;
          }
        }

        return {
          labels: labels,
          datasets: [{
            label: this._chartTitle || 'Waterfall',
            data: waterfallData,
            backgroundColor: backgroundColors,
            borderRadius: this._borderRadius,
            borderSkipped: false
          }]
        };
      }

      _getBubbleData(colors) {
        const data = this._chartData.map((d, i) => ({
          x: d.value,
          y: d.value2,
          r: Math.min(d.value3, 50) // Cap radius
        }));

        return {
          datasets: [{
            label: this._chartTitle || 'Data',
            data: data,
            backgroundColor: this._addAlpha(colors[0], 0.6),
            borderColor: colors[0],
            borderWidth: 2
          }]
        };
      }

      _getScatterData(colors) {
        const data = this._chartData.map(d => ({
          x: d.value,
          y: d.value2
        }));

        return {
          datasets: [{
            label: this._chartTitle || 'Data',
            data: data,
            backgroundColor: this._addAlpha(colors[0], 0.7),
            borderColor: colors[0],
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        };
      }

      _getChartOptions() {
        const self = this;
        const isPieType = ['pie', 'doughnut', 'polarArea'].includes(this._chartType);
        const isHorizontal = this._chartType === 'horizontalBar';

        const options = {
          responsive: true,
          maintainAspectRatio: this._aspectRatio,
          animation: {
            duration: this._enableAnimation ? 1000 : 0
          },
          plugins: {
            legend: {
              display: this._showLegend,
              position: this._legendPosition,
              labels: {
                font: {
                  family: "'Roboto', sans-serif",
                  size: 12
                },
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            title: {
              display: !!this._chartTitle,
              text: this._chartTitle,
              font: {
                family: "'Roboto', sans-serif",
                size: 16,
                weight: '500'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleFont: {
                family: "'Roboto', sans-serif"
              },
              bodyFont: {
                family: "'Roboto', sans-serif"
              },
              cornerRadius: 8,
              padding: 12
            },
            datalabels: this._showDataLabels ? {
              color: isPieType ? '#fff' : '#333',
              font: {
                weight: 'bold',
                size: 11
              },
              formatter: (value) => {
                if (typeof value === 'object') return '';
                return Math.round(value);
              }
            } : false
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const index = element.index;
              const data = self._chartData[index];

              if (data) {
                self._selectedLabel = data.label;
                self._selectedValue = String(data.value);

                safeRaisePropertyChanged(self, 'selectedLabel');
                safeRaisePropertyChanged(self, 'selectedValue');

                self.dispatchEvent(new CustomEvent('SegmentClicked', {
                  bubbles: true,
                  detail: {
                    label: data.label,
                    value: data.value,
                    index: index,
                    rawData: data.rawData
                  }
                }));
              }
            }
          }
        };

        // Add scales for non-pie charts
        if (!isPieType && this._chartType !== 'radar') {
          options.scales = {
            x: {
              display: true,
              grid: {
                display: this._showGrid,
                color: 'rgba(0,0,0,0.05)'
              },
              title: {
                display: !!this._xAxisLabel,
                text: this._xAxisLabel,
                font: {
                  family: "'Roboto', sans-serif",
                  size: 12
                }
              },
              stacked: this._stacked,
              ticks: {
                font: {
                  family: "'Roboto', sans-serif"
                }
              }
            },
            y: {
              display: true,
              grid: {
                display: this._showGrid,
                color: 'rgba(0,0,0,0.05)'
              },
              title: {
                display: !!this._yAxisLabel,
                text: this._yAxisLabel,
                font: {
                  family: "'Roboto', sans-serif",
                  size: 12
                }
              },
              stacked: this._stacked,
              beginAtZero: true,
              ticks: {
                font: {
                  family: "'Roboto', sans-serif"
                }
              }
            }
          };

          // Horizontal bar
          if (isHorizontal) {
            options.indexAxis = 'y';
          }
        }

        // Radar specific
        if (this._chartType === 'radar') {
          options.scales = {
            r: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
              },
              pointLabels: {
                font: {
                  family: "'Roboto', sans-serif"
                }
              }
            }
          };
        }

        return options;
      }

      _addAlpha(color, alpha) {
        // Convert hex to rgba
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return color;
      }

      // Public method
      refresh() {
        this._renderChart();
      }

      // Properties
      get chartData() {
        return JSON.stringify(this._chartData);
      }
      set chartData(v) {
        if (typeof v === 'string') {
          try {
            this._dataItems = JSON.parse(v);
            this._processDataItems();
          } catch (e) {
            console.error('[Chart] Invalid JSON:', e);
          }
        } else if (Array.isArray(v)) {
          this._dataItems = v;
          this._processDataItems();
        }
      }
      get ChartData() { return this.chartData; }
      set ChartData(v) { this.chartData = v; }

      get chartType() { return this._chartType; }
      set chartType(v) {
        const validTypes = ['pie', 'doughnut', 'bar', 'horizontalBar', 'line', 'area', 'scatter', 'radar', 'polarArea', 'waterfall', 'bubble'];
        this._chartType = validTypes.includes(v) ? v : 'bar';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'chartType');
      }
      get ChartType() { return this.chartType; }
      set ChartType(v) { this.chartType = v; }

      get chartTitle() { return this._chartTitle; }
      set chartTitle(v) {
        this._chartTitle = v || '';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'chartTitle');
      }
      get ChartTitle() { return this.chartTitle; }
      set ChartTitle(v) { this.chartTitle = v; }

      get controlWidth() { return this._controlWidth; }
      set controlWidth(v) {
        this._controlWidth = parseInt(v) || 500;
        if (this._hasRendered) {
          this._applyStyles();
          this._renderChart();
        }
        safeRaisePropertyChanged(this, 'controlWidth');
      }
      get ControlWidth() { return this.controlWidth; }
      set ControlWidth(v) { this.controlWidth = v; }

      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) {
        this._controlHeight = parseInt(v) || 400;
        if (this._hasRendered) {
          this._applyStyles();
          this._renderChart();
        }
        safeRaisePropertyChanged(this, 'controlHeight');
      }
      get ControlHeight() { return this.controlHeight; }
      set ControlHeight(v) { this.controlHeight = v; }

      get showLegend() { return this._showLegend; }
      set showLegend(v) {
        this._showLegend = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'showLegend');
      }
      get ShowLegend() { return this.showLegend; }
      set ShowLegend(v) { this.showLegend = v; }

      get legendPosition() { return this._legendPosition; }
      set legendPosition(v) {
        const valid = ['top', 'bottom', 'left', 'right'];
        this._legendPosition = valid.includes(v) ? v : 'top';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'legendPosition');
      }
      get LegendPosition() { return this.legendPosition; }
      set LegendPosition(v) { this.legendPosition = v; }

      get showDataLabels() { return this._showDataLabels; }
      set showDataLabels(v) {
        this._showDataLabels = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'showDataLabels');
      }
      get ShowDataLabels() { return this.showDataLabels; }
      set ShowDataLabels(v) { this.showDataLabels = v; }

      get colorScheme() { return this._colorScheme; }
      set colorScheme(v) {
        this._colorScheme = v || 'material';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'colorScheme');
      }
      get ColorScheme() { return this.colorScheme; }
      set ColorScheme(v) { this.colorScheme = v; }

      get customColors() { return this._customColors; }
      set customColors(v) {
        this._customColors = v || '';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'customColors');
      }
      get CustomColors() { return this.customColors; }
      set CustomColors(v) { this.customColors = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v !== null && v !== undefined ? String(v) : '';
        if (this._container) {
          const bgColor = this._backgroundColor && this._backgroundColor.trim() !== ''
            ? this._backgroundColor
            : '#FFFBFE';
          this._container.style.background = bgColor;
        }
        safeRaisePropertyChanged(this, 'backgroundColor');
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get showGrid() { return this._showGrid; }
      set showGrid(v) {
        this._showGrid = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'showGrid');
      }
      get ShowGrid() { return this.showGrid; }
      set ShowGrid(v) { this.showGrid = v; }

      get enableAnimation() { return this._enableAnimation; }
      set enableAnimation(v) {
        this._enableAnimation = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'enableAnimation');
      }
      get EnableAnimation() { return this.enableAnimation; }
      set EnableAnimation(v) { this.enableAnimation = v; }

      get stacked() { return this._stacked; }
      set stacked(v) {
        this._stacked = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'stacked');
      }
      get Stacked() { return this.stacked; }
      set Stacked(v) { this.stacked = v; }

      get tension() { return this._tension; }
      set tension(v) {
        this._tension = parseFloat(v) || 0.3;
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'tension');
      }
      get Tension() { return this.tension; }
      set Tension(v) { this.tension = v; }

      get borderRadius() { return this._borderRadius; }
      set borderRadius(v) {
        this._borderRadius = parseInt(v) || 8;
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'borderRadius');
      }
      get BorderRadius() { return this.borderRadius; }
      set BorderRadius(v) { this.borderRadius = v; }

      get aspectRatio() { return this._aspectRatio; }
      set aspectRatio(v) {
        this._aspectRatio = (v === true || v === 'true');
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'aspectRatio');
      }
      get AspectRatio() { return this.aspectRatio; }
      set AspectRatio(v) { this.aspectRatio = v; }

      get xAxisLabel() { return this._xAxisLabel; }
      set xAxisLabel(v) {
        this._xAxisLabel = v || '';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'xAxisLabel');
      }
      get XAxisLabel() { return this.xAxisLabel; }
      set XAxisLabel(v) { this.xAxisLabel = v; }

      get yAxisLabel() { return this._yAxisLabel; }
      set yAxisLabel(v) {
        this._yAxisLabel = v || '';
        if (this._hasRendered) this._renderChart();
        safeRaisePropertyChanged(this, 'yAxisLabel');
      }
      get YAxisLabel() { return this.yAxisLabel; }
      set YAxisLabel(v) { this.yAxisLabel = v; }

      get selectedLabel() { return this._selectedLabel; }
      set selectedLabel(v) { /* Read-only */ }
      get SelectedLabel() { return this.selectedLabel; }
      set SelectedLabel(v) { this.selectedLabel = v; }

      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) { /* Read-only */ }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
        if (this._isVisible && this._hasRendered) {
          this._renderChart();
        }
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._container) {
          this._container.style.opacity = this._isEnabled ? '1' : '0.5';
          this._container.style.pointerEvents = this._isEnabled ? '' : 'none';
        }
      }
    });
  }
})();
