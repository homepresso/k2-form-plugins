/**
 * Material Switch Control for K2 SmartForms
 * Material 3 Design toggle switch with icons and smooth animations
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

  if (!window.customElements.get('material-switch')) {
    window.customElements.define('material-switch', class MaterialSwitch extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._checked = false;
        this._label = 'Switch';
        this._labelPosition = 'end';
        this._showIcons = true;
        this._iconStyle = 'check-x';
        this._primaryColor = '#6750A4';
        this._thumbColor = '#FFFFFF';
        this._trackColor = '#E7E0EC';
        this._borderColor = '#79747E';
        this._labelColor = '#1C1B1F';
        this._required = false;
        this._helperText = '';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._container = null;
        this._switch = null;
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
        this._buildSwitch();
        this._applyStyles();
        this._bindEvents();
      }

      _buildSwitch() {
        this._container = document.createElement('div');
        this._container.className = 'msw-container';
        if (this._labelPosition === 'start') {
          this._container.classList.add('msw-label-start');
        }

        // Wrapper for switch and label
        const wrapper = document.createElement('div');
        wrapper.className = 'msw-wrapper';

        // Hidden input for form compatibility
        this._input = document.createElement('input');
        this._input.type = 'checkbox';
        this._input.className = 'msw-native-input';
        this._input.checked = this._checked;

        // Switch track
        this._switch = document.createElement('div');
        this._switch.className = 'msw-switch';
        this._switch.setAttribute('role', 'switch');
        this._switch.setAttribute('aria-checked', String(this._checked));
        this._switch.tabIndex = 0;

        // Track
        const track = document.createElement('div');
        track.className = 'msw-track';

        // Thumb
        const thumb = document.createElement('div');
        thumb.className = 'msw-thumb';

        // Icons inside thumb
        if (this._showIcons) {
          const iconOn = document.createElement('span');
          iconOn.className = 'msw-icon msw-icon-on';
          iconOn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `;

          const iconOff = document.createElement('span');
          iconOff.className = 'msw-icon msw-icon-off';
          iconOff.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          `;

          thumb.appendChild(iconOn);
          thumb.appendChild(iconOff);
        }

        // State layer for hover/focus
        const stateLayer = document.createElement('div');
        stateLayer.className = 'msw-state-layer';
        thumb.appendChild(stateLayer);

        track.appendChild(thumb);
        this._switch.appendChild(track);

        // Label
        const labelEl = document.createElement('label');
        labelEl.className = 'msw-label';
        labelEl.textContent = this._label;
        if (this._required) {
          const asterisk = document.createElement('span');
          asterisk.className = 'msw-required';
          asterisk.textContent = ' *';
          labelEl.appendChild(asterisk);
        }

        wrapper.appendChild(this._input);
        wrapper.appendChild(this._switch);
        wrapper.appendChild(labelEl);

        this._container.appendChild(wrapper);

        // Helper text
        if (this._helperText) {
          const helperEl = document.createElement('div');
          helperEl.className = 'msw-helper-text';
          helperEl.textContent = this._helperText;
          this._container.appendChild(helperEl);
        }

        this.appendChild(this._container);
        this._updateState();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--msw-primary', this._primaryColor);
          this._container.style.setProperty('--msw-on-primary', this._thumbColor);
          this._container.style.setProperty('--msw-surface-variant', this._trackColor);
          this._container.style.setProperty('--msw-outline', this._borderColor);
          this._container.style.setProperty('--msw-on-surface', this._labelColor);

          // Apply font styles directly to label
          const labelEl = this._container.querySelector('.msw-label');
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

          this._checked = !this._checked;
          this._input.checked = this._checked;
          this._updateState();

          safeRaisePropertyChanged(this, 'checked');

          this.dispatchEvent(new CustomEvent('Changed', {
            bubbles: true,
            detail: { checked: this._checked }
          }));
        };

        this._switch.addEventListener('click', handleClick);
        this._container.querySelector('.msw-label').addEventListener('click', handleClick);

        // Keyboard support
        this._switch.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleClick(e);
          }
        });
      }

      _updateState() {
        if (!this._switch || !this._container) return;

        // Update aria
        this._switch.setAttribute('aria-checked', String(this._checked));

        // Update classes
        this._switch.classList.toggle('msw-checked', this._checked);
        this._container.classList.toggle('msw-disabled', !this._isEnabled);
      }

      // Public methods
      toggle() {
        if (this._isEnabled) {
          this._checked = !this._checked;
          this._input.checked = this._checked;
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      turnOn() {
        if (this._isEnabled && !this._checked) {
          this._checked = true;
          this._input.checked = true;
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      turnOff() {
        if (this._isEnabled && this._checked) {
          this._checked = false;
          this._input.checked = false;
          this._updateState();
          safeRaisePropertyChanged(this, 'checked');
        }
      }

      // Properties
      get checked() { return this._checked; }
      set checked(v) {
        this._checked = (v === true || v === 'true');
        if (this._input) this._input.checked = this._checked;
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

      get labelPosition() { return this._labelPosition; }
      set labelPosition(v) {
        this._labelPosition = (v === 'start') ? 'start' : 'end';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'labelPosition');
      }
      get LabelPosition() { return this.labelPosition; }
      set LabelPosition(v) { this.labelPosition = v; }

      get showIcons() { return this._showIcons; }
      set showIcons(v) {
        this._showIcons = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showIcons');
      }
      get ShowIcons() { return this.showIcons; }
      set ShowIcons(v) { this.showIcons = v; }

      get iconStyle() { return this._iconStyle; }
      set iconStyle(v) {
        this._iconStyle = v || 'check-x';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'iconStyle');
      }
      get IconStyle() { return this.iconStyle; }
      set IconStyle(v) { this.iconStyle = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get thumbColor() { return this._thumbColor; }
      set thumbColor(v) {
        this._thumbColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'thumbColor');
      }
      get ThumbColor() { return this.thumbColor; }
      set ThumbColor(v) { this.thumbColor = v; }

      get trackColor() { return this._trackColor; }
      set trackColor(v) {
        this._trackColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'trackColor');
      }
      get TrackColor() { return this.trackColor; }
      set TrackColor(v) { this.trackColor = v; }

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

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'required');
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get helperText() { return this._helperText; }
      set helperText(v) {
        this._helperText = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'helperText');
      }
      get HelperText() { return this.helperText; }
      set HelperText(v) { this.helperText = v; }

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
