/**
 * Material Select Control for K2 SmartForms
 * Material 3 Design dropdown with outlined and filled variants
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
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=Source+Code+Pro:wght@400;500&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=Raleway:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Oswald:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Rubik:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;600;700&family=Inconsolata:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;500;600;700&family=Shadows+Into+Light&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-select')) {
    window.customElements.define('material-select', class MaterialSelect extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = '';
        this._displayValue = '';
        this._label = 'Select';
        this._listBinding = '';
        this._options = 'Option 1,Option 2,Option 3';
        this._delimiter = ',';
        this._variant = 'outlined';
        this._placeholder = '';
        this._leadingIcon = '';
        this._helperText = '';
        this._errorText = '';
        this._hasError = false;
        this._required = false;
        this._primaryColor = '#6750A4';
        this._textColor = '#1C1B1F';
        this._labelColor = '#79747E';
        this._borderColor = '#79747E';
        this._backgroundColor = '#E7E0EC';
        this._errorColor = '#B3261E';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;
        this._isOpen = false;

        // Parsed options
        this._parsedOptions = [];

        // DOM refs
        this._container = null;
        this._selectField = null;
        this._menu = null;

        // Bound handlers for cleanup
        this._handleClickOutside = this._handleClickOutside.bind(this);

        // K2 List binding
        this._listConfig = null;
        this._dataItems = [];
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseOptions();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      disconnectedCallback() {
        document.removeEventListener('click', this._handleClickOutside);
      }

      _parseOptions() {
        this._parsedOptions = [];

        // Try listBinding first (JSON array)
        if (this._listBinding && this._listBinding.trim()) {
          try {
            const parsed = JSON.parse(this._listBinding);
            if (Array.isArray(parsed)) {
              parsed.forEach(item => {
                if (item && typeof item === 'object') {
                  const value = item.value || item.Value || item.id || item.Id || item.ID || '';
                  const label = item.label || item.Label || item.text || item.Text || item.name || item.Name || item.title || item.Title || value;
                  if (value || label) {
                    this._parsedOptions.push({ value: value || label, label: label || value });
                  }
                } else if (typeof item === 'string') {
                  this._parsedOptions.push({ value: item, label: item });
                }
              });
              this._updateDisplayValue();
              return; // Successfully parsed listBinding, skip options parsing
            }
          } catch (e) {
            // Invalid JSON, fall through to options parsing
            console.warn('Material Select: Invalid listBinding JSON, falling back to options');
          }
        }

        // Fall back to options (delimited string)
        const delimiter = this._delimiter || ',';
        const items = this._options ? this._options.split(delimiter) : [];

        items.forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;

          // Check for value:label format
          const colonIndex = trimmed.indexOf(':');
          if (colonIndex > 0) {
            this._parsedOptions.push({
              value: trimmed.substring(0, colonIndex).trim(),
              label: trimmed.substring(colonIndex + 1).trim()
            });
          } else {
            this._parsedOptions.push({
              value: trimmed,
              label: trimmed
            });
          }
        });

        // Update display value
        this._updateDisplayValue();
      }

      _updateDisplayValue() {
        const option = this._parsedOptions.find(o => o.value === this._value);
        this._displayValue = option ? option.label : '';
      }

      _render() {
        this.innerHTML = '';
        this._buildSelect();
        this._applyStyles();
        this._bindEvents();
      }

      _buildSelect() {
        this._container = document.createElement('div');
        this._container.className = `msl-container msl-${this._variant}`;

        // Input wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'msl-input-wrapper';

        // Leading icon
        if (this._leadingIcon) {
          const icon = document.createElement('span');
          icon.className = 'msl-icon msl-icon-leading material-icons';
          icon.textContent = this._leadingIcon;
          wrapper.appendChild(icon);
        }

        // Select field
        this._selectField = document.createElement('div');
        this._selectField.className = 'msl-field';
        this._selectField.tabIndex = 0;
        this._selectField.setAttribute('role', 'combobox');
        this._selectField.setAttribute('aria-haspopup', 'listbox');
        this._selectField.setAttribute('aria-expanded', 'false');

        // Display text
        const displayText = document.createElement('span');
        displayText.className = 'msl-display-text';
        displayText.textContent = this._displayValue || this._placeholder || '';
        if (!this._displayValue) {
          displayText.classList.add('msl-placeholder');
        }
        this._selectField.appendChild(displayText);

        wrapper.appendChild(this._selectField);

        // Trailing dropdown arrow
        const arrow = document.createElement('span');
        arrow.className = 'msl-arrow material-icons';
        arrow.textContent = 'arrow_drop_down';
        wrapper.appendChild(arrow);

        // Floating label
        const labelEl = document.createElement('label');
        labelEl.className = 'msl-label';
        labelEl.textContent = this._label;
        if (this._required) {
          const asterisk = document.createElement('span');
          asterisk.className = 'msl-required';
          asterisk.textContent = ' *';
          labelEl.appendChild(asterisk);
        }
        wrapper.appendChild(labelEl);

        // Outlined variant notch
        if (this._variant === 'outlined') {
          const outline = document.createElement('fieldset');
          outline.className = 'msl-outline';
          const legend = document.createElement('legend');
          legend.className = 'msl-outline-legend';
          const legendSpan = document.createElement('span');
          legendSpan.textContent = this._label;
          if (this._required) legendSpan.textContent += ' *';
          legend.appendChild(legendSpan);
          outline.appendChild(legend);
          wrapper.appendChild(outline);
        }

        this._container.appendChild(wrapper);

        // Dropdown menu
        this._menu = document.createElement('div');
        this._menu.className = 'msl-menu';
        this._menu.setAttribute('role', 'listbox');
        this._buildMenuItems();
        this._container.appendChild(this._menu);

        // Supporting text
        const supporting = document.createElement('div');
        supporting.className = 'msl-supporting';
        const helperEl = document.createElement('span');
        helperEl.className = 'msl-helper-text';
        helperEl.textContent = this._hasError ? (this._errorText || 'Error') : this._helperText;
        supporting.appendChild(helperEl);
        this._container.appendChild(supporting);

        this.appendChild(this._container);
        this._updateState();
      }

      _buildMenuItems() {
        if (!this._menu) return;
        this._menu.innerHTML = '';

        this._parsedOptions.forEach((option, index) => {
          const item = document.createElement('div');
          item.className = 'msl-menu-item';
          item.setAttribute('role', 'option');
          item.setAttribute('data-value', option.value);
          item.tabIndex = -1;

          if (option.value === this._value) {
            item.classList.add('msl-selected');
            item.setAttribute('aria-selected', 'true');
          }

          const text = document.createElement('span');
          text.className = 'msl-item-text';
          text.textContent = option.label;
          item.appendChild(text);

          // Checkmark for selected
          if (option.value === this._value) {
            const check = document.createElement('span');
            check.className = 'msl-item-check material-icons';
            check.textContent = 'check';
            item.appendChild(check);
          }

          item.addEventListener('click', (e) => {
            e.stopPropagation();
            this._selectOption(option);
          });

          this._menu.appendChild(item);
        });
      }

      _selectOption(option) {
        this._value = option.value;
        this._displayValue = option.label;

        // Update display
        const displayText = this._selectField.querySelector('.msl-display-text');
        if (displayText) {
          displayText.textContent = this._displayValue;
          displayText.classList.remove('msl-placeholder');
        }

        this._buildMenuItems();
        this._updateState();
        this.close();

        safeRaisePropertyChanged(this, 'value');

        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: { value: this._value, label: this._displayValue }
        }));
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--msl-primary', this._primaryColor);
          this._container.style.setProperty('--msl-on-surface', this._textColor);
          this._container.style.setProperty('--msl-outline', this._labelColor);
          this._container.style.setProperty('--msl-border', this._borderColor);
          this._container.style.setProperty('--msl-surface-variant', this._backgroundColor);
          this._container.style.setProperty('--msl-error', this._errorColor);

          // Apply font styles directly to text elements
          const displayText = this._container.querySelector('.msl-display-text');
          if (displayText) {
            displayText.style.fontFamily = this._fontFamily;
            displayText.style.fontSize = `${this._fontSize}px`;
            displayText.style.fontWeight = this._fontWeight;
            displayText.style.fontStyle = this._fontStyle;
          }

          // Apply to menu items
          const menuItems = this._container.querySelectorAll('.msl-item-text');
          menuItems.forEach(item => {
            item.style.fontFamily = this._fontFamily;
            item.style.fontSize = `${this._fontSize}px`;
            item.style.fontWeight = this._fontWeight;
            item.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        // Toggle dropdown
        this._selectField.addEventListener('click', () => {
          if (!this._isEnabled) return;
          if (this._isOpen) {
            this.close();
          } else {
            this.open();
          }
        });

        // Keyboard support
        this._selectField.addEventListener('keydown', (e) => {
          if (!this._isEnabled) return;

          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault();
              if (this._isOpen) {
                this.close();
              } else {
                this.open();
              }
              break;
            case 'ArrowDown':
              e.preventDefault();
              if (!this._isOpen) {
                this.open();
              } else {
                this._focusNextItem();
              }
              break;
            case 'ArrowUp':
              e.preventDefault();
              if (this._isOpen) {
                this._focusPrevItem();
              }
              break;
            case 'Escape':
              this.close();
              break;
          }
        });

        // Click outside to close
        document.addEventListener('click', this._handleClickOutside);
      }

      _handleClickOutside(e) {
        if (this._isOpen && !this.contains(e.target)) {
          this.close();
        }
      }

      _focusNextItem() {
        const items = this._menu.querySelectorAll('.msl-menu-item');
        const focused = this._menu.querySelector('.msl-menu-item:focus');
        const currentIndex = focused ? Array.from(items).indexOf(focused) : -1;
        const nextIndex = Math.min(currentIndex + 1, items.length - 1);
        items[nextIndex]?.focus();
      }

      _focusPrevItem() {
        const items = this._menu.querySelectorAll('.msl-menu-item');
        const focused = this._menu.querySelector('.msl-menu-item:focus');
        const currentIndex = focused ? Array.from(items).indexOf(focused) : items.length;
        const prevIndex = Math.max(currentIndex - 1, 0);
        items[prevIndex]?.focus();
      }

      _updateState() {
        if (!this._container) return;

        const hasValue = !!this._value;
        this._container.classList.toggle('msl-has-value', hasValue);
        this._container.classList.toggle('msl-focused', this._isOpen);
        this._container.classList.toggle('msl-error', this._hasError);
        this._container.classList.toggle('msl-disabled', !this._isEnabled);
        this._container.classList.toggle('msl-open', this._isOpen);

        // Update supporting text
        const helperEl = this._container.querySelector('.msl-helper-text');
        if (helperEl) {
          helperEl.textContent = this._hasError ? (this._errorText || 'Error') : this._helperText;
        }
      }

      // Public methods
      open() {
        if (!this._isEnabled || this._isOpen) return;
        this._isOpen = true;
        this._selectField.setAttribute('aria-expanded', 'true');
        this._updateState();
      }

      close() {
        if (!this._isOpen) return;
        this._isOpen = false;
        this._selectField.setAttribute('aria-expanded', 'false');
        this._selectField.focus();
        this._updateState();
      }

      clear() {
        this._value = '';
        this._displayValue = '';
        const displayText = this._selectField.querySelector('.msl-display-text');
        if (displayText) {
          displayText.textContent = this._placeholder || '';
          displayText.classList.add('msl-placeholder');
        }
        this._buildMenuItems();
        this._updateState();
        safeRaisePropertyChanged(this, 'value');
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
        this._processDataItems();
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        if (Array.isArray(itemsChangedEventArgs?.NewItems)) {
          this._dataItems = itemsChangedEventArgs.NewItems;
          this._processDataItems();
        }
      }

      _processDataItems() {
        if (!this._dataItems || this._dataItems.length === 0) return;

        // Get field mappings from K2 config
        const mappings = this._listConfig?.partmappings || {};
        const valueProp = mappings['Value'] || 'value';
        const displayProp = mappings['Display'] || mappings['Label'] || 'display';

        // Convert K2 data items to select options
        this._parsedOptions = this._dataItems.map(item => {
          const value = item[valueProp] || item.value || item.Value || item.id || item.Id || item.ID || '';
          const label = item[displayProp] || item.label || item.Label || item.text || item.Text || item.name || item.Name || item.title || item.Title || value;
          return { value: value || label, label: label || value };
        });

        this._updateDisplayValue();
        if (this._hasRendered) {
          this._render();
        }
      }

      // Properties
      get value() { return this._value; }
      set value(v) {
        this._value = v || '';
        this._updateDisplayValue();
        if (this._hasRendered) {
          const displayText = this._selectField?.querySelector('.msl-display-text');
          if (displayText) {
            displayText.textContent = this._displayValue || this._placeholder || '';
            displayText.classList.toggle('msl-placeholder', !this._displayValue);
          }
          this._buildMenuItems();
          this._updateState();
        }
        safeRaisePropertyChanged(this, 'value');
      }
      get Value() { return this.value; }
      set Value(v) { this.value = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get listBinding() { return this._listBinding; }
      set listBinding(v) {
        this._listBinding = v || '';
        this._parseOptions();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'listBinding');
      }
      get ListBinding() { return this.listBinding; }
      set ListBinding(v) { this.listBinding = v; }

      get options() { return this._options; }
      set options(v) {
        this._options = v || '';
        this._parseOptions();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'options');
      }
      get Options() { return this.options; }
      set Options(v) { this.options = v; }

      get delimiter() { return this._delimiter; }
      set delimiter(v) {
        this._delimiter = v || ',';
        this._parseOptions();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'delimiter');
      }
      get Delimiter() { return this.delimiter; }
      set Delimiter(v) { this.delimiter = v; }

      get variant() { return this._variant; }
      set variant(v) {
        this._variant = (v === 'filled') ? 'filled' : 'outlined';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'placeholder');
      }
      get Placeholder() { return this.placeholder; }
      set Placeholder(v) { this.placeholder = v; }

      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'leadingIcon');
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get helperText() { return this._helperText; }
      set helperText(v) {
        this._helperText = v || '';
        this._updateState();
        safeRaisePropertyChanged(this, 'helperText');
      }
      get HelperText() { return this.helperText; }
      set HelperText(v) { this.helperText = v; }

      get errorText() { return this._errorText; }
      set errorText(v) {
        this._errorText = v || '';
        this._updateState();
        safeRaisePropertyChanged(this, 'errorText');
      }
      get ErrorText() { return this.errorText; }
      set ErrorText(v) { this.errorText = v; }

      get hasError() { return this._hasError; }
      set hasError(v) {
        this._hasError = (v === true || v === 'true');
        this._updateState();
        safeRaisePropertyChanged(this, 'hasError');
      }
      get HasError() { return this.hasError; }
      set HasError(v) { this.hasError = v; }

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'required');
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelColor');
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'backgroundColor');
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get errorColor() { return this._errorColor; }
      set errorColor(v) {
        this._errorColor = v || '#B3261E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'errorColor');
      }
      get ErrorColor() { return this.errorColor; }
      set ErrorColor(v) { this.errorColor = v; }

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
        this._fontSize = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontSize');
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || 'normal';
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
