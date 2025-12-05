/**
 * Material Button Control for K2 SmartForms - Design Time
 * Material 3 Design with variants, icons, and ripple effect
 */
(() => {
  'use strict';

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
    window.customElements.define('material-button', class MaterialButtonDesign extends HTMLElement {

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
        this._backgroundColor = '#6750A4';
        this._primaryColor = '#6750A4';
        this._textColor = '';
        this._outlineColor = '#79747E';
        this._surfaceColor = '#FFFBFE';
        this._iconColor = '';
        this._hoverColor = '';
        this._disableRipple = false;
        this._loading = false;
        this._tooltip = '';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = '500';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._button = null;
      }

      static get observedAttributes() {
        return [
          'text', 'variant', 'leadingicon', 'trailingicon', 'icononly',
          'fullwidth', 'size', 'backgroundcolor', 'primarycolor', 'textcolor',
          'outlinecolor', 'surfacecolor', 'iconcolor', 'hovercolor',
          'disableripple', 'loading', 'tooltip', 'fontfamily', 'fontsize',
          'fontweight', 'fontstyle', 'isvisible', 'isenabled'
        ];
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        const propertyMap = {
          'text': 'text',
          'variant': 'variant',
          'leadingicon': 'leadingIcon',
          'trailingicon': 'trailingIcon',
          'icononly': 'iconOnly',
          'fullwidth': 'fullWidth',
          'size': 'size',
          'backgroundcolor': 'backgroundColor',
          'primarycolor': 'primaryColor',
          'textcolor': 'textColor',
          'outlinecolor': 'outlineColor',
          'surfacecolor': 'surfaceColor',
          'iconcolor': 'iconColor',
          'hovercolor': 'hoverColor',
          'disableripple': 'disableRipple',
          'loading': 'loading',
          'tooltip': 'tooltip',
          'fontfamily': 'fontFamily',
          'fontsize': 'fontSize',
          'fontweight': 'fontWeight',
          'fontstyle': 'fontStyle',
          'isvisible': 'IsVisible',
          'isenabled': 'IsEnabled'
        };

        const prop = propertyMap[name.toLowerCase()];
        if (prop) {
          this[prop] = newValue;
        }
      }

      connectedCallback() {
        if (this._hasRendered) return;
        this.setAttribute('tabindex', '-1'); // Prevent focus in design-time
        loadMaterialIcons();
        loadGoogleFonts();
        this._render();
        this._hasRendered = true;
      }

      _render() {
        this.innerHTML = '';
        this._buildButton();
        this._applyStyles();
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

        // Ripple container (visual only in design-time)
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
        
          pointer-events: none;`;

        if (this._button) {
          // Background color takes precedence for filled variant
          const bgColor = this._backgroundColor || this._primaryColor;
          this._button.style.setProperty('--mbtn-primary', bgColor);
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

          // Hover color
          if (this._hoverColor) {
            this._button.style.setProperty('--mbtn-hover', this._hoverColor);
          }

          // Generate tonal and surface colors from background color
          this._button.style.setProperty('--mbtn-primary-container', this._lightenColor(bgColor, 0.9));
          this._button.style.setProperty('--mbtn-on-primary-container', this._darkenColor(bgColor, 0.3));

          // Apply font styles directly to button
          this._button.style.fontFamily = this._fontFamily;
          this._button.style.fontSize = `${this._fontSize}px`;
          this._button.style.fontWeight = this._fontWeight;
          this._button.style.fontStyle = this._fontStyle;

          // Design-time state
          if (!this._isEnabled || this._loading) {
            this._button.disabled = true;
            this._button.classList.add('mbtn-disabled');
          } else {
            this._button.disabled = true; // Design-time: always disabled
            this._button.classList.remove('mbtn-disabled');
          }

          if (this._loading) {
            this._button.classList.add('mbtn-loading');
          } else {
            this._button.classList.remove('mbtn-loading');
          }
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

      // Properties (design-time doesn't need RaisePropertyChanged)
      get text() { return this._text; }
      set text(v) {
        this._text = v || 'Button';
        if (this._hasRendered) this._updateContent();
      }
      get Text() { return this.text; }
      set Text(v) { this.text = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['filled', 'outlined', 'text', 'elevated', 'tonal'];
        this._variant = valid.includes(v) ? v : 'filled';
        if (this._hasRendered) this._render();
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        if (this._hasRendered) this._updateContent();
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get trailingIcon() { return this._trailingIcon; }
      set trailingIcon(v) {
        this._trailingIcon = v || '';
        if (this._hasRendered) this._updateContent();
      }
      get TrailingIcon() { return this.trailingIcon; }
      set TrailingIcon(v) { this.trailingIcon = v; }

      get iconOnly() { return this._iconOnly; }
      set iconOnly(v) {
        this._iconOnly = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get IconOnly() { return this.iconOnly; }
      set IconOnly(v) { this.iconOnly = v; }

      get fullWidth() { return this._fullWidth; }
      set fullWidth(v) {
        this._fullWidth = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get FullWidth() { return this.fullWidth; }
      set FullWidth(v) { this.fullWidth = v; }

      get size() { return this._size; }
      set size(v) {
        const valid = ['small', 'medium', 'large'];
        this._size = valid.includes(v) ? v : 'medium';
        if (this._hasRendered) this._render();
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get outlineColor() { return this._outlineColor; }
      set outlineColor(v) {
        this._outlineColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
      }
      get OutlineColor() { return this.outlineColor; }
      set OutlineColor(v) { this.outlineColor = v; }

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get hoverColor() { return this._hoverColor; }
      set hoverColor(v) {
        this._hoverColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get HoverColor() { return this.hoverColor; }
      set HoverColor(v) { this.hoverColor = v; }

      get disableRipple() { return this._disableRipple; }
      set disableRipple(v) {
        this._disableRipple = (v === true || v === 'true');
        if (this._hasRendered) this._updateContent();
      }
      get DisableRipple() { return this.disableRipple; }
      set DisableRipple(v) { this.disableRipple = v; }

      get loading() { return this._loading; }
      set loading(v) {
        this._loading = (v === true || v === 'true');
        if (this._hasRendered) {
          this._updateContent();
          this._applyStyles();
        }
      }
      get Loading() { return this.loading; }
      set Loading(v) { this.loading = v; }

      get tooltip() { return this._tooltip; }
      set tooltip(v) {
        this._tooltip = v || '';
        if (this._button) this._button.title = this._tooltip;
      }
      get Tooltip() { return this.tooltip; }
      set Tooltip(v) { this.tooltip = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseInt(v) || 14;
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || '500';
        if (this._hasRendered) this._applyStyles();
      }
      get FontWeight() { return this.fontWeight; }
      set FontWeight(v) { this.fontWeight = v; }

      get fontStyle() { return this._fontStyle; }
      set fontStyle(v) {
        this._fontStyle = v || 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get FontStyle() { return this.fontStyle; }
      set FontStyle(v) { this.fontStyle = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }
    });
  }
})();
