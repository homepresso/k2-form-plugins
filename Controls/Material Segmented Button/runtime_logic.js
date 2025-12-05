if (!window.__materialsegmentedbuttonRuntimeLoaded) {
  window.__materialsegmentedbuttonRuntimeLoaded = true;

/**
 * Material Segmented Button Control for K2 SmartForms
 * Material 3 Design segmented button for single or multi-select options
 */
(function() {
  'use strict';

  if (typeof window.K2 === "undefined") {
    window.K2 = {};
  }

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2?.RaisePropertyChanged) {
      K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  // Load Material Icons
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="Material+Icons"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-segmented-button')) {
    window.customElements.define('material-segmented-button', class MaterialSegmentedButton extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._segments = 'Day|Week|Month|Year';
        this._delimiter = '|';
        this._value = '';
        this._multiSelect = false;
        this._selectedValues = [];
        this._showCheckmark = true;
        this._density = 'default'; // default, comfortable, compact
        this._primaryColor = '#6750A4';
        this._borderColor = '#79747E';
        this._selectedBackgroundColor = '';
        this._textColor = '#1C1B1F';
        this._selectedTextColor = '#1D192B';
        this._iconColor = '';
        this._checkmarkColor = '';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = '500';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed segments
        this._parsedSegments = [];

        // DOM refs
        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseSegments();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _parseSegments() {
        this._parsedSegments = [];
        const delimiter = this._delimiter || '|';
        const items = this._segments ? this._segments.split(delimiter) : [];

        items.forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;

          // Check for icon:label:value format or icon:label or just label
          const parts = trimmed.split(':');
          if (parts.length >= 3) {
            this._parsedSegments.push({
              icon: parts[0].trim(),
              label: parts[1].trim(),
              value: parts[2].trim()
            });
          } else if (parts.length === 2) {
            // Could be icon:label or label:value - check if first part looks like an icon
            const firstPart = parts[0].trim();
            const secondPart = parts[1].trim();
            // If first part contains spaces or is long, treat as label:value
            if (firstPart.includes(' ') || firstPart.length > 20) {
              this._parsedSegments.push({
                icon: '',
                label: firstPart,
                value: secondPart
              });
            } else {
              this._parsedSegments.push({
                icon: firstPart,
                label: secondPart,
                value: secondPart
              });
            }
          } else {
            this._parsedSegments.push({
              icon: '',
              label: trimmed,
              value: trimmed
            });
          }
        });
      }

      _render() {
        this.innerHTML = '';
        this._buildSegmentedButton();
        this._applyStyles();
        this._bindEvents();
      }

      _buildSegmentedButton() {
        this._container = document.createElement('div');
        this._container.className = `mseg-container mseg-${this._density}`;
        this._container.setAttribute('role', 'group');

        this._parsedSegments.forEach((segment, index) => {
          const button = document.createElement('button');
          button.className = 'mseg-segment';
          button.type = 'button';
          button.setAttribute('data-value', segment.value);

          // Check if selected
          const isSelected = this._multiSelect
            ? this._selectedValues.includes(segment.value)
            : this._value === segment.value;

          if (isSelected) {
            button.classList.add('mseg-selected');
          }

          // Position classes
          if (index === 0) {
            button.classList.add('mseg-first');
          }
          if (index === this._parsedSegments.length - 1) {
            button.classList.add('mseg-last');
          }

          // Content wrapper
          const content = document.createElement('span');
          content.className = 'mseg-content';

          // Checkmark for selected state
          if (this._showCheckmark && isSelected) {
            const checkmark = document.createElement('span');
            checkmark.className = 'mseg-checkmark material-icons';
            checkmark.textContent = 'check';
            content.appendChild(checkmark);
          }

          // Icon (if not showing checkmark or not selected)
          if (segment.icon && !(this._showCheckmark && isSelected)) {
            const icon = document.createElement('span');
            icon.className = 'mseg-icon material-icons';
            icon.textContent = segment.icon;
            content.appendChild(icon);
          }

          // Label
          if (segment.label) {
            const label = document.createElement('span');
            label.className = 'mseg-label';
            label.textContent = segment.label;
            content.appendChild(label);
          }

          button.appendChild(content);

          // State layer
          const stateLayer = document.createElement('span');
          stateLayer.className = 'mseg-state-layer';
          button.appendChild(stateLayer);

          this._container.appendChild(button);
        });

        this.appendChild(this._container);
        this._updateState();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;

        // Set CSS custom properties on the container element
        if (this._container) {
          this._container.style.setProperty('--mseg-primary', this._primaryColor);
          this._container.style.setProperty('--mseg-outline', this._borderColor);
          this._container.style.setProperty('--mseg-on-surface', this._textColor);
          this._container.style.setProperty('--mseg-on-secondary-container', this._selectedTextColor);
          if (this._selectedBackgroundColor) {
            this._container.style.setProperty('--mseg-selected-container', this._selectedBackgroundColor);
          }
          if (this._iconColor) {
            this._container.style.setProperty('--mseg-icon-color', this._iconColor);
          }
          if (this._checkmarkColor) {
            this._container.style.setProperty('--mseg-checkmark-color', this._checkmarkColor);
          }

          // Apply font styling to all label elements
          const labels = this._container.querySelectorAll('.mseg-label');
          labels.forEach(label => {
            label.style.fontSize = `${this._fontSize}px`;
            label.style.fontWeight = this._fontWeight;
            label.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        const buttons = this._container.querySelectorAll('.mseg-segment');
        buttons.forEach(button => {
          button.addEventListener('click', (e) => {
            if (!this._isEnabled) return;

            const value = button.getAttribute('data-value');
            this._selectSegment(value);
          });
        });
      }

      _selectSegment(value) {
        if (this._multiSelect) {
          const index = this._selectedValues.indexOf(value);
          if (index > -1) {
            this._selectedValues.splice(index, 1);
          } else {
            this._selectedValues.push(value);
          }
          this._value = this._selectedValues.join(this._delimiter);
        } else {
          this._value = value;
        }

        this._updateSelection();
        safeRaisePropertyChanged(this, 'value');

        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: {
            value: this._value,
            selectedValues: this._multiSelect ? [...this._selectedValues] : [this._value]
          }
        }));
      }

      _updateSelection() {
        const buttons = this._container.querySelectorAll('.mseg-segment');
        buttons.forEach(button => {
          const value = button.getAttribute('data-value');
          const isSelected = this._multiSelect
            ? this._selectedValues.includes(value)
            : this._value === value;

          button.classList.toggle('mseg-selected', isSelected);

          // Update content (checkmark visibility)
          const content = button.querySelector('.mseg-content');
          if (content) {
            const existingCheckmark = content.querySelector('.mseg-checkmark');
            const existingIcon = content.querySelector('.mseg-icon');
            const segment = this._parsedSegments.find(s => s.value === value);

            if (this._showCheckmark && isSelected) {
              if (!existingCheckmark) {
                const checkmark = document.createElement('span');
                checkmark.className = 'mseg-checkmark material-icons';
                checkmark.textContent = 'check';
                content.insertBefore(checkmark, content.firstChild);
              }
              if (existingIcon) {
                existingIcon.remove();
              }
            } else {
              if (existingCheckmark) {
                existingCheckmark.remove();
              }
              if (segment?.icon && !content.querySelector('.mseg-icon')) {
                const icon = document.createElement('span');
                icon.className = 'mseg-icon material-icons';
                icon.textContent = segment.icon;
                content.insertBefore(icon, content.firstChild);
              }
            }
          }
        });
      }

      _updateState() {
        if (!this._container) return;

        this._container.classList.toggle('mseg-disabled', !this._isEnabled);

        const buttons = this._container.querySelectorAll('.mseg-segment');
        buttons.forEach(button => {
          button.disabled = !this._isEnabled;
        });
      }

      // Properties
      get segments() { return this._segments; }
      set segments(v) {
        this._segments = v || '';
        this._parseSegments();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'segments');
      }
      get Segments() { return this.segments; }
      set Segments(v) { this.segments = v; }

      get delimiter() { return this._delimiter; }
      set delimiter(v) {
        this._delimiter = v || '|';
        this._parseSegments();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'delimiter');
      }
      get Delimiter() { return this.delimiter; }
      set Delimiter(v) { this.delimiter = v; }

      get value() { return this._value; }
      set value(v) {
        this._value = v || '';
        if (this._multiSelect) {
          this._selectedValues = this._value ? this._value.split(this._delimiter).map(s => s.trim()) : [];
        }
        if (this._hasRendered) this._updateSelection();
        safeRaisePropertyChanged(this, 'value');
      }
      get Value() { return this.value; }
      set Value(v) { this.value = v; }

      get multiSelect() { return this._multiSelect; }
      set multiSelect(v) {
        this._multiSelect = (v === true || v === 'true');
        if (this._multiSelect && this._value) {
          this._selectedValues = [this._value];
        }
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'multiSelect');
      }
      get MultiSelect() { return this.multiSelect; }
      set MultiSelect(v) { this.multiSelect = v; }

      get showCheckmark() { return this._showCheckmark; }
      set showCheckmark(v) {
        this._showCheckmark = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showCheckmark');
      }
      get ShowCheckmark() { return this.showCheckmark; }
      set ShowCheckmark(v) { this.showCheckmark = v; }

      get density() { return this._density; }
      set density(v) {
        const valid = ['default', 'comfortable', 'compact'];
        this._density = valid.includes(v) ? v : 'default';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'density');
      }
      get Density() { return this.density; }
      set Density(v) { this.density = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get selectedBackgroundColor() { return this._selectedBackgroundColor; }
      set selectedBackgroundColor(v) {
        this._selectedBackgroundColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'selectedBackgroundColor');
      }
      get SelectedBackgroundColor() { return this.selectedBackgroundColor; }
      set SelectedBackgroundColor(v) { this.selectedBackgroundColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get selectedTextColor() { return this._selectedTextColor; }
      set selectedTextColor(v) {
        this._selectedTextColor = v || '#1D192B';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'selectedTextColor');
      }
      get SelectedTextColor() { return this.selectedTextColor; }
      set SelectedTextColor(v) { this.selectedTextColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get checkmarkColor() { return this._checkmarkColor; }
      set checkmarkColor(v) {
        this._checkmarkColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'checkmarkColor');
      }
      get CheckmarkColor() { return this.checkmarkColor; }
      set CheckmarkColor(v) { this.checkmarkColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontFamily');
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = v || 14;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontSize');
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || '500';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontWeight');
      }
      get FontWeight() { return this.fontWeight; }
      set FontWeight(v) { this.fontWeight = v; }

      get fontStyle() { return this._fontStyle; }
      set fontStyle(v) {
        this._fontStyle = v || 'normal';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontStyle');
      }
      get FontStyle() { return this.fontStyle; }
      set FontStyle(v) { this.fontStyle = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'inline-block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        this._updateState();
      }
    });
  }
})();


}
