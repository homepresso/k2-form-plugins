/**
 * Material Checkbox Control for K2 SmartForms
 * Material 3 Design with indeterminate state and ripple effect
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

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=Source+Code+Pro:wght@400;500&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=Raleway:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Oswald:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Rubik:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;600;700&family=Inconsolata:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;500;600;700&family=Shadows+Into+Light&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-checkbox')) {
    window.customElements.define('material-checkbox', class MaterialCheckbox extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._checked = false;
        this._label = 'Checkbox';
        this._indeterminate = false;
        this._labelPosition = 'end';
        this._primaryColor = '#6750A4';
        this._checkColor = '#FFFFFF';
        this._borderColor = '#79747E';
        this._labelColor = '#1C1B1F';
        this._errorColor = '#B3261E';
        this._disableRipple = false;
        this._required = false;
        this._errorText = '';
        this._hasError = false;
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._container = null;
        this._checkbox = null;
        this._input = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildCheckbox();
        this._applyStyles();
        this._bindEvents();
      }

      _buildCheckbox() {
        this._container = document.createElement('div');
        this._container.className = 'mcb-container';
        if (this._labelPosition === 'start') {
          this._container.classList.add('mcb-label-start');
        }

        // Hidden input for form compatibility
        this._input = document.createElement('input');
        this._input.type = 'checkbox';
        this._input.className = 'mcb-native-input';
        this._input.checked = this._checked;
        this._input.indeterminate = this._indeterminate;

        // Checkbox visual
        this._checkbox = document.createElement('div');
        this._checkbox.className = 'mcb-checkbox';
        this._checkbox.setAttribute('role', 'checkbox');
        this._checkbox.setAttribute('aria-checked', this._indeterminate ? 'mixed' : String(this._checked));
        this._checkbox.tabIndex = 0;

        this._updateCheckboxContent();

        // Ripple container
        if (!this._disableRipple) {
          const ripple = document.createElement('span');
          ripple.className = 'mcb-ripple';
          this._checkbox.appendChild(ripple);
        }

        // Label
        const labelEl = document.createElement('label');
        labelEl.className = 'mcb-label';
        labelEl.textContent = this._label;
        if (this._required) {
          const asterisk = document.createElement('span');
          asterisk.className = 'mcb-required';
          asterisk.textContent = ' *';
          labelEl.appendChild(asterisk);
        }

        this._container.appendChild(this._input);
        this._container.appendChild(this._checkbox);
        this._container.appendChild(labelEl);

        // Error text
        if (this._errorText || this._hasError) {
          const errorEl = document.createElement('div');
          errorEl.className = 'mcb-error-text';
          errorEl.textContent = this._errorText || 'This field is required';
          this._container.appendChild(errorEl);
        }

        this.appendChild(this._container);
        this._updateState();
      }

      _updateCheckboxContent() {
        if (!this._checkbox) return;

        // Remove existing icon
        const existingIcon = this._checkbox.querySelector('.mcb-icon');
        if (existingIcon) existingIcon.remove();

        // Create icon container
        const iconContainer = document.createElement('span');
        iconContainer.className = 'mcb-icon';

        if (this._indeterminate) {
          // Indeterminate icon (minus)
          iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" class="mcb-svg">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          `;
        } else if (this._checked) {
          // Checkmark icon
          iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" class="mcb-svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `;
        }

        this._checkbox.insertBefore(iconContainer, this._checkbox.firstChild);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--mcb-primary', this._primaryColor);
          this._container.style.setProperty('--mcb-on-primary', this._checkColor);
          this._container.style.setProperty('--mcb-outline', this._borderColor);
          this._container.style.setProperty('--mcb-on-surface', this._labelColor);
          this._container.style.setProperty('--mcb-error', this._errorColor);

          // Apply font styles directly to label
          const labelEl = this._container.querySelector('.mcb-label');
          if (labelEl) {
            labelEl.style.fontFamily = this._fontFamily;
            labelEl.style.fontSize = `${this._fontSize}px`;
            labelEl.style.fontWeight = this._fontWeight;
            labelEl.style.fontStyle = this._fontStyle;
          }
        }
      }

      _bindEvents() {
        const handleClick = (e) => {
          if (!this._isEnabled) return;
          e.preventDefault();

          // Create ripple
          if (!this._disableRipple) {
            this._createRipple(e);
          }

          // Toggle state
          if (this._indeterminate) {
            this._indeterminate = false;
            this._checked = true;
          } else {
            this._checked = !this._checked;
          }

          this._input.checked = this._checked;
          this._input.indeterminate = this._indeterminate;
          this._updateCheckboxContent();
          this._updateState();

          safeRaisePropertyChanged(this, 'checked');

          this.dispatchEvent(new CustomEvent('Changed', {
            bubbles: true,
            detail: { checked: this._checked, indeterminate: this._indeterminate }
          }));
        };

        this._checkbox.addEventListener('click', handleClick);
        this._container.querySelector('.mcb-label').addEventListener('click', handleClick);

        // Keyboard support
        this._checkbox.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleClick(e);
          }
        });
      }

      _createRipple(event) {
        const rippleContainer = this._checkbox.querySelector('.mcb-ripple');
        if (!rippleContainer) return;

        const ripple = document.createElement('span');
        ripple.className = 'mcb-ripple-effect';

        rippleContainer.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      }

      _updateState() {
        if (!this._checkbox || !this._container) return;

        // Update aria
        this._checkbox.setAttribute('aria-checked', this._indeterminate ? 'mixed' : String(this._checked));

        // Update classes
        this._checkbox.classList.toggle('mcb-checked', this._checked || this._indeterminate);
        this._checkbox.classList.toggle('mcb-indeterminate', this._indeterminate);
        this._container.classList.toggle('mcb-disabled', !this._isEnabled);
        this._container.classList.toggle('mcb-error', this._hasError);
      }

      // Public methods
      toggle() {
        if (this._isEnabled) {
          this._checked = !this._checked;
          this._indeterminate = false;
          this._input.checked = this._checked;
          this._input.indeterminate = false;
          this._updateCheckboxContent();
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      check() {
        if (this._isEnabled) {
          this._checked = true;
          this._indeterminate = false;
          this._input.checked = true;
          this._input.indeterminate = false;
          this._updateCheckboxContent();
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      uncheck() {
        if (this._isEnabled) {
          this._checked = false;
          this._indeterminate = false;
          this._input.checked = false;
          this._input.indeterminate = false;
          this._updateCheckboxContent();
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      // Properties
      get checked() { return this._checked; }
      set checked(v) {
        this._checked = (v === true || v === 'true');
        if (this._input) this._input.checked = this._checked;
        this._updateCheckboxContent();
        this._updateState();
        safeRaisePropertyChanged(this, 'checked');
      }
      get Checked() { return this.checked; }
      set Checked(v) { this.checked = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get indeterminate() { return this._indeterminate; }
      set indeterminate(v) {
        this._indeterminate = (v === true || v === 'true');
        if (this._input) this._input.indeterminate = this._indeterminate;
        this._updateCheckboxContent();
        this._updateState();
        safeRaisePropertyChanged(this, 'indeterminate');
      }
      get Indeterminate() { return this.indeterminate; }
      set Indeterminate(v) { this.indeterminate = v; }

      get labelPosition() { return this._labelPosition; }
      set labelPosition(v) {
        this._labelPosition = (v === 'start') ? 'start' : 'end';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'labelPosition');
      }
      get LabelPosition() { return this.labelPosition; }
      set LabelPosition(v) { this.labelPosition = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get checkColor() { return this._checkColor; }
      set checkColor(v) {
        this._checkColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'checkColor');
      }
      get CheckColor() { return this.checkColor; }
      set CheckColor(v) { this.checkColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelColor');
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get errorColor() { return this._errorColor; }
      set errorColor(v) {
        this._errorColor = v || '#B3261E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'errorColor');
      }
      get ErrorColor() { return this.errorColor; }
      set ErrorColor(v) { this.errorColor = v; }

      get disableRipple() { return this._disableRipple; }
      set disableRipple(v) {
        this._disableRipple = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'disableRipple');
      }
      get DisableRipple() { return this.disableRipple; }
      set DisableRipple(v) { this.disableRipple = v; }

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'required');
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get errorText() { return this._errorText; }
      set errorText(v) {
        this._errorText = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'errorText');
      }
      get ErrorText() { return this.errorText; }
      set ErrorText(v) { this.errorText = v; }

      get hasError() { return this._hasError; }
      set hasError(v) {
        this._hasError = (v === true || v === 'true');
        this._updateState();
        if (this._hasRendered && !this._container.querySelector('.mcb-error-text') && this._hasError) {
          this._render();
        }
        safeRaisePropertyChanged(this, 'hasError');
      }
      get HasError() { return this.hasError; }
      set HasError(v) { this.hasError = v; }

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
        this._fontSize = parseInt(v) || 14;
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
