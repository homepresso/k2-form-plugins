/**
 * Material Label Control for K2 SmartForms
 * Material 3 Design label for displaying text
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

  // Load Material Icons
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="Material+Icons"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-label')) {
    window.customElements.define('material-label', class MaterialLabel extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = 'Label';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._textAlign = 'left';
        this._textColor = '#1C1B1F';
        this._backgroundColor = '';
        this._fontFamily = 'Roboto, sans-serif';
        this._padding = 8;
        this._lineHeight = '1.5';
        this._textDecoration = 'none';
        this._textTransform = 'none';
        this._wordWrap = true;
        this._clickable = false;
        this._isVisible = true;
        this._isEnabled = true;

        // Icon properties
        this._leadingIcon = '';
        this._trailingIcon = '';
        this._iconSize = 24;
        this._iconColor = '';
        this._iconSpacing = 8;

        // DOM refs
        this._textEl = null;
        this._leadingIconEl = null;
        this._trailingIconEl = null;
        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        loadMaterialIcons();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildContent();
        this._applyStyles();
        this._bindEvents();
      }

      _buildContent() {
        // Create container for flex layout
        this._container = document.createElement('div');
        this._container.className = 'mlb-container';

        // Leading icon
        if (this._leadingIcon) {
          this._leadingIconEl = document.createElement('span');
          this._leadingIconEl.className = 'mlb-icon mlb-icon-leading material-icons';
          this._leadingIconEl.textContent = this._leadingIcon;
          this._container.appendChild(this._leadingIconEl);
        }

        // Text element
        this._textEl = document.createElement('span');
        this._textEl.className = 'mlb-text';
        this._textEl.textContent = this._value;
        this._container.appendChild(this._textEl);

        // Trailing icon
        if (this._trailingIcon) {
          this._trailingIconEl = document.createElement('span');
          this._trailingIconEl.className = 'mlb-icon mlb-icon-trailing material-icons';
          this._trailingIconEl.textContent = this._trailingIcon;
          this._container.appendChild(this._trailingIconEl);
        }

        this.appendChild(this._container);
      }

      _updateIcons() {
        if (!this._container) return;

        // Update or create leading icon
        if (this._leadingIcon) {
          if (!this._leadingIconEl) {
            this._leadingIconEl = document.createElement('span');
            this._leadingIconEl.className = 'mlb-icon mlb-icon-leading material-icons';
            this._container.insertBefore(this._leadingIconEl, this._textEl);
          }
          this._leadingIconEl.textContent = this._leadingIcon;
          this._leadingIconEl.style.display = '';
        } else if (this._leadingIconEl) {
          this._leadingIconEl.style.display = 'none';
        }

        // Update or create trailing icon
        if (this._trailingIcon) {
          if (!this._trailingIconEl) {
            this._trailingIconEl = document.createElement('span');
            this._trailingIconEl.className = 'mlb-icon mlb-icon-trailing material-icons';
            this._container.appendChild(this._trailingIconEl);
          }
          this._trailingIconEl.textContent = this._trailingIcon;
          this._trailingIconEl.style.display = '';
        } else if (this._trailingIconEl) {
          this._trailingIconEl.style.display = 'none';
        }

        this._applyIconStyles();
      }

      _applyIconStyles() {
        const iconColor = this._iconColor || this._textColor;

        if (this._leadingIconEl) {
          this._leadingIconEl.style.fontSize = `${this._iconSize}px`;
          this._leadingIconEl.style.color = iconColor;
          this._leadingIconEl.style.marginRight = `${this._iconSpacing}px`;
        }

        if (this._trailingIconEl) {
          this._trailingIconEl.style.fontSize = `${this._iconSize}px`;
          this._trailingIconEl.style.color = iconColor;
          this._trailingIconEl.style.marginLeft = `${this._iconSpacing}px`;
        }
      }

      _applyStyles() {
        // Let CSS handle width: 100% by default - K2 controls width via inline styles
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.boxSizing = 'border-box';
        this.style.fontFamily = this._fontFamily;
        this.style.fontSize = `${this._fontSize}px`;
        this.style.fontWeight = this._fontWeight;
        this.style.fontStyle = this._fontStyle;
        this.style.color = this._textColor;
        this.style.textAlign = this._textAlign;
        this.style.padding = `${this._padding}px`;
        this.style.lineHeight = this._lineHeight;
        this.style.textDecoration = this._textDecoration;
        this.style.textTransform = this._textTransform;

        if (this._backgroundColor) {
          this.style.backgroundColor = this._backgroundColor;
        } else {
          this.style.backgroundColor = 'transparent';
        }

        if (this._wordWrap) {
          this.style.wordWrap = 'break-word';
          this.style.whiteSpace = 'normal';
        } else {
          this.style.wordWrap = 'normal';
          this.style.whiteSpace = 'nowrap';
          this.style.overflow = 'hidden';
          this.style.textOverflow = 'ellipsis';
        }

        if (this._clickable && this._isEnabled) {
          this.style.cursor = 'pointer';
        } else {
          this.style.cursor = 'default';
        }

        if (!this._isEnabled) {
          this.style.opacity = '0.5';
        } else {
          this.style.opacity = '1';
        }

        // Apply container styles for flex layout
        if (this._container) {
          this._container.style.display = 'flex';
          this._container.style.alignItems = 'center';
          this._container.style.justifyContent = this._textAlign === 'center' ? 'center' :
                                                  this._textAlign === 'right' ? 'flex-end' : 'flex-start';
        }

        // Apply icon styles
        this._applyIconStyles();
      }

      _bindEvents() {
        this.addEventListener('click', () => {
          if (this._clickable && this._isEnabled) {
            this.dispatchEvent(new CustomEvent('Click', {
              bubbles: true,
              detail: { value: this._value }
            }));
          }
        });
      }

      // Properties
      get Value() { return this._value; }
      set Value(v) {
        this._value = v !== null && v !== undefined ? String(v) : '';
        if (this._textEl) {
          this._textEl.textContent = this._value;
        }
        safeRaisePropertyChanged(this, 'Value');
      }

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

      get textAlign() { return this._textAlign; }
      set textAlign(v) {
        this._textAlign = ['left', 'center', 'right', 'justify'].includes(v) ? v : 'left';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textAlign');
      }
      get TextAlign() { return this.textAlign; }
      set TextAlign(v) { this.textAlign = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'backgroundColor');
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontFamily');
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get padding() { return this._padding; }
      set padding(v) {
        this._padding = parseInt(v) || 8;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'padding');
      }
      get Padding() { return this.padding; }
      set Padding(v) { this.padding = v; }

      get lineHeight() { return this._lineHeight; }
      set lineHeight(v) {
        this._lineHeight = v || '1.5';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'lineHeight');
      }
      get LineHeight() { return this.lineHeight; }
      set LineHeight(v) { this.lineHeight = v; }

      get textDecoration() { return this._textDecoration; }
      set textDecoration(v) {
        this._textDecoration = ['none', 'underline', 'line-through', 'overline'].includes(v) ? v : 'none';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textDecoration');
      }
      get TextDecoration() { return this.textDecoration; }
      set TextDecoration(v) { this.textDecoration = v; }

      get textTransform() { return this._textTransform; }
      set textTransform(v) {
        this._textTransform = ['none', 'uppercase', 'lowercase', 'capitalize'].includes(v) ? v : 'none';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textTransform');
      }
      get TextTransform() { return this.textTransform; }
      set TextTransform(v) { this.textTransform = v; }

      get wordWrap() { return this._wordWrap; }
      set wordWrap(v) {
        this._wordWrap = (v === true || v === 'true');
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'wordWrap');
      }
      get WordWrap() { return this.wordWrap; }
      set WordWrap(v) { this.wordWrap = v; }

      get clickable() { return this._clickable; }
      set clickable(v) {
        this._clickable = (v === true || v === 'true');
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'clickable');
      }
      get Clickable() { return this.clickable; }
      set Clickable(v) { this.clickable = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'IsVisible');
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'IsEnabled');
      }

      // Icon properties
      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        if (this._hasRendered) this._updateIcons();
        safeRaisePropertyChanged(this, 'leadingIcon');
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get trailingIcon() { return this._trailingIcon; }
      set trailingIcon(v) {
        this._trailingIcon = v || '';
        if (this._hasRendered) this._updateIcons();
        safeRaisePropertyChanged(this, 'trailingIcon');
      }
      get TrailingIcon() { return this.trailingIcon; }
      set TrailingIcon(v) { this.trailingIcon = v; }

      get iconSize() { return this._iconSize; }
      set iconSize(v) {
        this._iconSize = parseInt(v) || 24;
        if (this._hasRendered) this._applyIconStyles();
        safeRaisePropertyChanged(this, 'iconSize');
      }
      get IconSize() { return this.iconSize; }
      set IconSize(v) { this.iconSize = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '';
        if (this._hasRendered) this._applyIconStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get iconSpacing() { return this._iconSpacing; }
      set iconSpacing(v) {
        this._iconSpacing = parseInt(v) || 8;
        if (this._hasRendered) this._applyIconStyles();
        safeRaisePropertyChanged(this, 'iconSpacing');
      }
      get IconSpacing() { return this.iconSpacing; }
      set IconSpacing(v) { this.iconSpacing = v; }
    });
  }
})();
