/**
 * Material Label Control for K2 SmartForms
 * Material 3 Design label for displaying text
 * Design-time version
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

        // DOM refs
        this._textEl = null;
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
        this._buildContent();
        this._applyStyles();
        this._bindEvents();
      }

      _buildContent() {
        this._textEl = document.createElement('span');
        this._textEl.className = 'mlb-text';
        this._textEl.textContent = this._value;
        this.appendChild(this._textEl);
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
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }
    });
  }
})();
