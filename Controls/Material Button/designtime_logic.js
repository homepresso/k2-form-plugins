/**
 * Material Button Control for K2 SmartForms
 * Material 3 Design with variants, icons, and ripple effect
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

  if (!window.customElements.get('material-button')) {
    window.customElements.define('material-button', class MaterialButton extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._text = 'Button';
        this._variant = 'filled';
        this._leadingIcon = '';
        this._trailingIcon = '';
        this._iconOnly = false;
        this._fullWidth = false;
        this._size = 'medium';
        this._primaryColor = '#6750A4';
        this._textColor = '';
        this._outlineColor = '#79747E';
        this._surfaceColor = '#FFFBFE';
        this._iconColor = '';
        this._disableRipple = false;
        this._loading = false;
        this._tooltip = '';
        this._fontFamily = 'Roboto, sans-serif';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._button = null;
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
        this._buildButton();
        this._applyStyles();
        this._bindEvents();
      }

      _buildButton() {
        this._button = document.createElement('button');
        this._button.className = `mbtn mbtn-${this._variant} mbtn-${this._size}`;
        this._button.type = 'button';

        if (this._iconOnly) {
          this._button.classList.add('mbtn-icon-only');
        }
        if (this._fullWidth) {
          this._button.classList.add('mbtn-full-width');
        }
        if (this._tooltip) {
          this._button.title = this._tooltip;
        }

        // Build button content
        this._updateContent();

        this.appendChild(this._button);
      }

      _updateContent() {
        if (!this._button) return;

        let content = '';

        // Loading spinner
        if (this._loading) {
          content += '<span class="mbtn-spinner"></span>';
        } else {
          // Leading icon
          if (this._leadingIcon) {
            content += `<span class="mbtn-icon material-icons">${this._leadingIcon}</span>`;
          }
        }

        // Text (hide when icon only or loading)
        if (!this._iconOnly && !this._loading) {
          content += `<span class="mbtn-label">${this._text}</span>`;
        } else if (this._iconOnly && !this._leadingIcon && !this._loading) {
          // Show text if icon-only but no icon provided
          content += `<span class="mbtn-label">${this._text}</span>`;
        }

        // Trailing icon (hide when loading)
        if (this._trailingIcon && !this._loading) {
          content += `<span class="mbtn-icon material-icons">${this._trailingIcon}</span>`;
        }

        // Ripple container
        if (!this._disableRipple) {
          content += '<span class="mbtn-ripple"></span>';
        }

        this._button.innerHTML = content;
      }

      _applyStyles() {
        this.style.cssText = `
          display: ${this._isVisible ? 'inline-block' : 'none'};
          ${this._fullWidth ? 'width: 100%;' : ''}
          font-family: ${this._fontFamily};
        `;

        if (this._button) {
          this._button.style.setProperty('--mbtn-primary', this._primaryColor);
          this._button.style.setProperty('--mbtn-outline', this._outlineColor);
          this._button.style.setProperty('--mbtn-surface', this._surfaceColor);

          // Calculate contrasting text color if not specified
          if (this._textColor) {
            this._button.style.setProperty('--mbtn-on-primary', this._textColor);
            this._button.style.setProperty('--mbtn-on-surface', this._textColor);
          }

          // Icon color
          if (this._iconColor) {
            this._button.style.setProperty('--mbtn-icon-color', this._iconColor);
          }

          // Generate tonal and surface colors from primary
          this._button.style.setProperty('--mbtn-primary-container', this._lightenColor(this._primaryColor, 0.9));
          this._button.style.setProperty('--mbtn-on-primary-container', this._darkenColor(this._primaryColor, 0.3));

          // Apply font family to button
          this._button.style.fontFamily = this._fontFamily;
        }
      }

      _lightenColor(hex, factor) {
        const rgb = this._hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
      }

      _darkenColor(hex, factor) {
        const rgb = this._hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.round(rgb.r * (1 - factor));
        const g = Math.round(rgb.g * (1 - factor));
        const b = Math.round(rgb.b * (1 - factor));
        return `rgb(${r}, ${g}, ${b})`;
      }

      _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

      _bindEvents() {
        this._button.addEventListener('click', (e) => {
          if (!this._isEnabled || this._loading) return;

          // Trigger ripple effect
          if (!this._disableRipple) {
            this._createRipple(e);
          }

          this.dispatchEvent(new CustomEvent('Clicked', {
            bubbles: true,
            detail: { text: this._text }
          }));
        });
      }

      _createRipple(event) {
        const rippleContainer = this._button.querySelector('.mbtn-ripple');
        if (!rippleContainer) return;

        const ripple = document.createElement('span');
        ripple.className = 'mbtn-ripple-effect';

        const rect = this._button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
        `;

        rippleContainer.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      }

      _updateState() {
        if (!this._button) return;

        if (!this._isEnabled) {
          this._button.disabled = true;
          this._button.classList.add('mbtn-disabled');
        } else {
          this._button.disabled = false;
          this._button.classList.remove('mbtn-disabled');
        }

        if (this._loading) {
          this._button.classList.add('mbtn-loading');
        } else {
          this._button.classList.remove('mbtn-loading');
        }
      }

      // Public method
      click() {
        if (this._button && this._isEnabled && !this._loading) {
          this._button.click();
        }
      }

      // Properties
      get text() { return this._text; }
      set text(v) {
        this._text = v || 'Button';
        this._updateContent();
        safeRaisePropertyChanged(this, 'text');
      }
      get Text() { return this.text; }
      set Text(v) { this.text = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['filled', 'outlined', 'text', 'elevated', 'tonal'];
        this._variant = valid.includes(v) ? v : 'filled';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        this._updateContent();
        safeRaisePropertyChanged(this, 'leadingIcon');
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get trailingIcon() { return this._trailingIcon; }
      set trailingIcon(v) {
        this._trailingIcon = v || '';
        this._updateContent();
        safeRaisePropertyChanged(this, 'trailingIcon');
      }
      get TrailingIcon() { return this.trailingIcon; }
      set TrailingIcon(v) { this.trailingIcon = v; }

      get iconOnly() { return this._iconOnly; }
      set iconOnly(v) {
        this._iconOnly = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'iconOnly');
      }
      get IconOnly() { return this.iconOnly; }
      set IconOnly(v) { this.iconOnly = v; }

      get fullWidth() { return this._fullWidth; }
      set fullWidth(v) {
        this._fullWidth = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'fullWidth');
      }
      get FullWidth() { return this.fullWidth; }
      set FullWidth(v) { this.fullWidth = v; }

      get size() { return this._size; }
      set size(v) {
        const valid = ['small', 'medium', 'large'];
        this._size = valid.includes(v) ? v : 'medium';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'size');
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

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
        this._textColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get outlineColor() { return this._outlineColor; }
      set outlineColor(v) {
        this._outlineColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'outlineColor');
      }
      get OutlineColor() { return this.outlineColor; }
      set OutlineColor(v) { this.outlineColor = v; }

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'surfaceColor');
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get disableRipple() { return this._disableRipple; }
      set disableRipple(v) {
        this._disableRipple = (v === true || v === 'true');
        this._updateContent();
        safeRaisePropertyChanged(this, 'disableRipple');
      }
      get DisableRipple() { return this.disableRipple; }
      set DisableRipple(v) { this.disableRipple = v; }

      get loading() { return this._loading; }
      set loading(v) {
        this._loading = (v === true || v === 'true');
        this._updateContent();
        this._updateState();
        safeRaisePropertyChanged(this, 'loading');
      }
      get Loading() { return this.loading; }
      set Loading(v) { this.loading = v; }

      get tooltip() { return this._tooltip; }
      set tooltip(v) {
        this._tooltip = v || '';
        if (this._button) this._button.title = this._tooltip;
        safeRaisePropertyChanged(this, 'tooltip');
      }
      get Tooltip() { return this.tooltip; }
      set Tooltip(v) { this.tooltip = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontFamily');
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

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
