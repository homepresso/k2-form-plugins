/**
 * Material Textbox Control for K2 SmartForms
 * Material 3 Design with floating labels, icons, and validation
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

  if (!window.customElements.get('material-textbox')) {
    window.customElements.define('material-textbox', class MaterialTextbox extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = '';
        this._label = 'Label';
        this._placeholder = '';
        this._helperText = '';
        this._errorText = '';
        this._hasError = false;
        this._variant = 'outlined';
        this._leadingIcon = '';
        this._trailingIcon = '';
        this._trailingIconClickable = false;
        this._inputType = 'text';
        this._maxLength = 0;
        this._showCharCount = false;
        this._controlHeight = 56;
        this._controlPadding = 8;
        this._primaryColor = '#6750A4';
        this._textColor = '#1C1B1F';
        this._labelColor = '#49454F';
        this._borderColor = '#79747E';
        this._backgroundColor = '#E7E0EC';
        this._errorColor = '#B3261E';
        this._iconColor = '#49454F';
        this._labelBackground = '#ffffff';
        this._labelFontSize = 16;
        this._labelFontWeight = 'normal';
        this._labelFontStyle = 'normal';
        this._required = false;
        this._pattern = '';
        this._autocomplete = 'off';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;
        this._isReadOnly = false;

        // DOM refs
        this._container = null;
        this._input = null;
        this._labelEl = null;
        this._helperEl = null;
        this._leadingIconEl = null;
        this._trailingIconEl = null;
        this._charCountEl = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildContainer();
        this._applyStyles();
        this._bindEvents();
      }

      _buildContainer() {
        this._container = document.createElement('div');
        this._container.className = `mtb-container mtb-${this._variant}`;

        // Input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'mtb-input-wrapper';

        // Leading icon
        if (this._leadingIcon) {
          this._leadingIconEl = document.createElement('span');
          this._leadingIconEl.className = 'mtb-icon mtb-icon-leading material-icons';
          this._leadingIconEl.textContent = this._leadingIcon;
          inputWrapper.appendChild(this._leadingIconEl);
        }

        // Input field
        this._input = document.createElement('input');
        this._input.type = this._inputType;
        this._input.className = 'mtb-input';
        this._input.placeholder = this._placeholder || ' ';
        this._input.value = this._value;
        this._input.autocomplete = this._autocomplete;
        this._input.readOnly = this._isReadOnly;
        this._input.disabled = !this._isEnabled;

        if (this._maxLength > 0) {
          this._input.maxLength = this._maxLength;
        }
        if (this._pattern) {
          this._input.pattern = this._pattern;
        }
        if (this._required) {
          this._input.required = true;
        }

        inputWrapper.appendChild(this._input);

        // Floating label
        this._labelEl = document.createElement('label');
        this._labelEl.className = 'mtb-label';
        this._labelEl.textContent = this._label;
        if (this._required) {
          this._labelEl.innerHTML = `${this._label}<span class="mtb-required">*</span>`;
        }
        inputWrapper.appendChild(this._labelEl);

        // Trailing icon
        if (this._trailingIcon) {
          this._trailingIconEl = document.createElement('span');
          this._trailingIconEl.className = 'mtb-icon mtb-icon-trailing material-icons';
          if (this._trailingIconClickable) {
            this._trailingIconEl.classList.add('mtb-icon-clickable');
          }
          this._trailingIconEl.textContent = this._trailingIcon;
          inputWrapper.appendChild(this._trailingIconEl);
        }

        // Border/outline for outlined variant
        if (this._variant === 'outlined') {
          const fieldset = document.createElement('fieldset');
          fieldset.className = 'mtb-outline';
          fieldset.innerHTML = `<legend class="mtb-outline-legend"><span>${this._label}${this._required ? '*' : ''}</span></legend>`;
          inputWrapper.appendChild(fieldset);
        }

        this._container.appendChild(inputWrapper);

        // Supporting text (helper/error + char count)
        const supportingWrapper = document.createElement('div');
        supportingWrapper.className = 'mtb-supporting';

        this._helperEl = document.createElement('span');
        this._helperEl.className = 'mtb-helper-text';
        this._helperEl.textContent = this._hasError ? this._errorText : this._helperText;
        supportingWrapper.appendChild(this._helperEl);

        if (this._showCharCount) {
          this._charCountEl = document.createElement('span');
          this._charCountEl.className = 'mtb-char-count';
          this._updateCharCount();
          supportingWrapper.appendChild(this._charCountEl);
        }

        this._container.appendChild(supportingWrapper);
        this.appendChild(this._container);

        // Set initial state
        this._updateState();
      }

      _applyStyles() {
        // Let CSS handle width: 100% by default - K2 controls width via inline styles
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.boxSizing = 'border-box';
        this.style.fontFamily = this._fontFamily;
        this.style.padding = `${this._controlPadding}px`;

        this._container.style.setProperty('--mtb-primary', this._primaryColor);
        this._container.style.setProperty('--mtb-error', this._errorColor);
        this._container.style.setProperty('--mtb-on-surface', this._textColor);
        this._container.style.setProperty('--mtb-outline', this._borderColor);
        this._container.style.setProperty('--mtb-surface-variant', this._backgroundColor);
        this._container.style.setProperty('--mtb-label-color', this._labelColor);
        this._container.style.setProperty('--mtb-icon-color', this._iconColor);
        this._container.style.setProperty('--mtb-label-background', this._labelBackground);
        this._container.style.setProperty('--mtb-label-font-size', `${this._labelFontSize}px`);
        this._container.style.setProperty('--mtb-label-font-weight', this._labelFontWeight);
        this._container.style.setProperty('--mtb-label-font-style', this._labelFontStyle);
        this._container.style.setProperty('--mtb-height', `${this._controlHeight}px`);
        this._container.style.setProperty('--mtb-font-family', this._fontFamily);
        this._container.style.setProperty('--mtb-font-size', `${this._fontSize}px`);
        this._container.style.setProperty('--mtb-font-weight', this._fontWeight);
        this._container.style.setProperty('--mtb-font-style', this._fontStyle);

        // Apply font styles directly to input element for K2 compatibility
        if (this._input) {
          this._input.style.fontFamily = this._fontFamily;
          this._input.style.fontSize = `${this._fontSize}px`;
          this._input.style.fontWeight = this._fontWeight;
          this._input.style.fontStyle = this._fontStyle;
        }

        // Apply label font styles directly for K2 compatibility
        if (this._labelEl) {
          this._labelEl.style.fontSize = `${this._labelFontSize}px`;
          this._labelEl.style.fontWeight = this._labelFontWeight;
          this._labelEl.style.fontStyle = this._labelFontStyle;
        }
      }

      _bindEvents() {
        this._input.addEventListener('input', (e) => {
          this._value = e.target.value;
          this._updateCharCount();
          safeRaisePropertyChanged(this, 'Value');
          this.dispatchEvent(new CustomEvent('Changed', {
            bubbles: true,
            detail: { value: this._value }
          }));
        });

        this._input.addEventListener('focus', () => {
          this._container.classList.add('mtb-focused');
          this.dispatchEvent(new CustomEvent('Focus', { bubbles: true }));
        });

        this._input.addEventListener('blur', () => {
          this._container.classList.remove('mtb-focused');
          this._updateState();
          this.dispatchEvent(new CustomEvent('Blur', { bubbles: true }));
        });

        this._input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.dispatchEvent(new CustomEvent('OnEnter', {
              bubbles: true,
              detail: { value: this._value }
            }));
          }
        });

        // Trailing icon click
        if (this._trailingIconEl && this._trailingIconClickable) {
          this._trailingIconEl.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('IconClicked', {
              bubbles: true,
              detail: { icon: this._trailingIcon, value: this._value }
            }));
          });
        }
      }

      _updateState() {
        if (!this._container) return;

        // Has value state
        if (this._value) {
          this._container.classList.add('mtb-has-value');
        } else {
          this._container.classList.remove('mtb-has-value');
        }

        // Error state
        if (this._hasError) {
          this._container.classList.add('mtb-error');
          this._helperEl.textContent = this._errorText || this._helperText;
        } else {
          this._container.classList.remove('mtb-error');
          this._helperEl.textContent = this._helperText;
        }

        // Disabled state
        if (!this._isEnabled) {
          this._container.classList.add('mtb-disabled');
          this._input.disabled = true;
        } else {
          this._container.classList.remove('mtb-disabled');
          this._input.disabled = false;
        }

        // Read-only state
        if (this._isReadOnly) {
          this._input.readOnly = true;
          this._container.classList.add('mtb-readonly');
        } else {
          this._input.readOnly = false;
          this._container.classList.remove('mtb-readonly');
        }
      }

      _updateCharCount() {
        if (!this._charCountEl) return;
        const current = this._value ? this._value.length : 0;
        if (this._maxLength > 0) {
          this._charCountEl.textContent = `${current}/${this._maxLength}`;
        } else {
          this._charCountEl.textContent = `${current}`;
        }
      }

      _updateLabel() {
        if (!this._labelEl) return;
        if (this._required) {
          this._labelEl.innerHTML = `${this._label}<span class="mtb-required">*</span>`;
        } else {
          this._labelEl.textContent = this._label;
        }

        // Update outline legend too
        const legend = this._container?.querySelector('.mtb-outline-legend span');
        if (legend) {
          legend.textContent = this._label + (this._required ? '*' : '');
        }
      }

      _rebuildIcons() {
        if (!this._hasRendered) return;
        // Full re-render for icon changes
        this._render();
      }

      // Public methods
      focus() {
        if (this._input) this._input.focus();
      }

      clear() {
        this._value = '';
        if (this._input) this._input.value = '';
        this._updateCharCount();
        this._updateState();
        safeRaisePropertyChanged(this, 'Value');
      }

      validate() {
        if (!this._input) return;

        let isValid = true;
        let errorMsg = '';

        // Required validation
        if (this._required && !this._value) {
          isValid = false;
          errorMsg = 'This field is required';
        }

        // Pattern validation
        if (isValid && this._pattern && this._value) {
          const regex = new RegExp(this._pattern);
          if (!regex.test(this._value)) {
            isValid = false;
            errorMsg = 'Invalid format';
          }
        }

        // Type-specific validation
        if (isValid && this._value) {
          if (this._inputType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this._value)) {
              isValid = false;
              errorMsg = 'Invalid email address';
            }
          }
        }

        this._hasError = !isValid;
        if (!isValid && !this._errorText) {
          this._errorText = errorMsg;
        }
        this._updateState();
        safeRaisePropertyChanged(this, 'hasError');
      }

      // Properties
      get Value() { return this._value; }
      set Value(v) {
        this._value = v !== null && v !== undefined ? String(v) : '';
        if (this._input) {
          this._input.value = this._value;
        }
        this._updateCharCount();
        this._updateState();
        safeRaisePropertyChanged(this, 'Value');
      }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        this._updateLabel();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || '';
        if (this._input) this._input.placeholder = this._placeholder || ' ';
        safeRaisePropertyChanged(this, 'placeholder');
      }
      get Placeholder() { return this.placeholder; }
      set Placeholder(v) { this.placeholder = v; }

      get helperText() { return this._helperText; }
      set helperText(v) {
        this._helperText = v || '';
        if (!this._hasError && this._helperEl) {
          this._helperEl.textContent = this._helperText;
        }
        safeRaisePropertyChanged(this, 'helperText');
      }
      get HelperText() { return this.helperText; }
      set HelperText(v) { this.helperText = v; }

      get errorText() { return this._errorText; }
      set errorText(v) {
        this._errorText = v || '';
        if (this._hasError && this._helperEl) {
          this._helperEl.textContent = this._errorText;
        }
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

      get variant() { return this._variant; }
      set variant(v) {
        this._variant = ['filled', 'outlined'].includes(v) ? v : 'outlined';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        if (this._hasRendered) this._rebuildIcons();
        safeRaisePropertyChanged(this, 'leadingIcon');
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get trailingIcon() { return this._trailingIcon; }
      set trailingIcon(v) {
        this._trailingIcon = v || '';
        if (this._hasRendered) this._rebuildIcons();
        safeRaisePropertyChanged(this, 'trailingIcon');
      }
      get TrailingIcon() { return this.trailingIcon; }
      set TrailingIcon(v) { this.trailingIcon = v; }

      get trailingIconClickable() { return this._trailingIconClickable; }
      set trailingIconClickable(v) {
        this._trailingIconClickable = (v === true || v === 'true');
        if (this._hasRendered) this._rebuildIcons();
        safeRaisePropertyChanged(this, 'trailingIconClickable');
      }
      get TrailingIconClickable() { return this.trailingIconClickable; }
      set TrailingIconClickable(v) { this.trailingIconClickable = v; }

      get inputType() { return this._inputType; }
      set inputType(v) {
        const validTypes = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'];
        this._inputType = validTypes.includes(v) ? v : 'text';
        if (this._input) this._input.type = this._inputType;
        safeRaisePropertyChanged(this, 'inputType');
      }
      get InputType() { return this.inputType; }
      set InputType(v) { this.inputType = v; }

      get maxLength() { return this._maxLength; }
      set maxLength(v) {
        this._maxLength = parseInt(v) || 0;
        if (this._input) {
          if (this._maxLength > 0) {
            this._input.maxLength = this._maxLength;
          } else {
            this._input.removeAttribute('maxLength');
          }
        }
        this._updateCharCount();
        safeRaisePropertyChanged(this, 'maxLength');
      }
      get MaxLength() { return this.maxLength; }
      set MaxLength(v) { this.maxLength = v; }

      get showCharCount() { return this._showCharCount; }
      set showCharCount(v) {
        this._showCharCount = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showCharCount');
      }
      get ShowCharCount() { return this.showCharCount; }
      set ShowCharCount(v) { this.showCharCount = v; }

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
        this._labelColor = v || '#49454F';
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

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get labelBackground() { return this._labelBackground; }
      set labelBackground(v) {
        this._labelBackground = v || '#ffffff';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelBackground');
      }
      get LabelBackground() { return this.labelBackground; }
      set LabelBackground(v) { this.labelBackground = v; }

      get labelFontSize() { return this._labelFontSize; }
      set labelFontSize(v) {
        this._labelFontSize = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelFontSize');
      }
      get LabelFontSize() { return this.labelFontSize; }
      set LabelFontSize(v) { this.labelFontSize = v; }

      get labelFontWeight() { return this._labelFontWeight; }
      set labelFontWeight(v) {
        this._labelFontWeight = v || 'normal';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelFontWeight');
      }
      get LabelFontWeight() { return this.labelFontWeight; }
      set LabelFontWeight(v) { this.labelFontWeight = v; }

      get labelFontStyle() { return this._labelFontStyle; }
      set labelFontStyle(v) {
        this._labelFontStyle = ['normal', 'italic'].includes(v) ? v : 'normal';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelFontStyle');
      }
      get LabelFontStyle() { return this.labelFontStyle; }
      set LabelFontStyle(v) { this.labelFontStyle = v; }

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        if (this._input) this._input.required = this._required;
        this._updateLabel();
        safeRaisePropertyChanged(this, 'required');
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get pattern() { return this._pattern; }
      set pattern(v) {
        this._pattern = v || '';
        if (this._input) {
          if (this._pattern) {
            this._input.pattern = this._pattern;
          } else {
            this._input.removeAttribute('pattern');
          }
        }
        safeRaisePropertyChanged(this, 'pattern');
      }
      get Pattern() { return this.pattern; }
      set Pattern(v) { this.pattern = v; }

      get autocomplete() { return this._autocomplete; }
      set autocomplete(v) {
        this._autocomplete = v || 'off';
        if (this._input) this._input.autocomplete = this._autocomplete;
        safeRaisePropertyChanged(this, 'autocomplete');
      }
      get Autocomplete() { return this.autocomplete; }
      set Autocomplete(v) { this.autocomplete = v; }

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
        this._fontStyle = ['normal', 'italic'].includes(v) ? v : 'normal';
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
        if (this._hasRendered) {
          this._updateState();
        }
        safeRaisePropertyChanged(this, 'IsEnabled');
      }

      get IsReadOnly() { return this._isReadOnly; }
      set IsReadOnly(val) {
        this._isReadOnly = (val === true || val === 'true');
        if (this._hasRendered) {
          this._updateState();
        }
        safeRaisePropertyChanged(this, 'IsReadOnly');
      }

      // Height property
      get Height() { return this._controlHeight; }
      set Height(v) {
        const height = parseInt(v);
        if (height && height > 0) {
          this._controlHeight = height;
          if (this._hasRendered) this._applyStyles();
        }
      }
      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) { this.Height = v; }

      // Padding property
      get Padding() { return this._controlPadding; }
      set Padding(v) {
        const padding = parseInt(v);
        if (padding >= 0) {
          this._controlPadding = padding;
          if (this._hasRendered) this._applyStyles();
        }
      }
      get controlPadding() { return this._controlPadding; }
      set controlPadding(v) { this.Padding = v; }
    });
  }
})();
