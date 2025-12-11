if (!window.__materialiconRuntimeLoaded) {
  window.__materialiconRuntimeLoaded = true;

/**
 * Material Icon Control for K2 SmartForms
 * Displays Material Design icons with customizable properties
 */
(function() {
  'use strict';

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2 && typeof window.K2.RaisePropertyChanged === 'function') {
      window.K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  // Track if Material Icons font is loaded
  let fontLoaded = false;
  const fontLoadPromises = {};

  function loadMaterialIconsFont(style) {
    const fontFamily = style === 'filled' ? 'Material Icons' : `Material Icons ${style.charAt(0).toUpperCase() + style.slice(1)}`;
    const fontUrl = style === 'filled'
      ? 'https://fonts.googleapis.com/icon?family=Material+Icons'
      : `https://fonts.googleapis.com/icon?family=Material+Icons+${style.charAt(0).toUpperCase() + style.slice(1)}`;

    if (fontLoadPromises[style]) return fontLoadPromises[style];

    fontLoadPromises[style] = new Promise((resolve) => {
      // Check if already loaded
      const testSpan = document.createElement('span');
      testSpan.style.fontFamily = `"${fontFamily}"`;
      testSpan.style.position = 'absolute';
      testSpan.style.left = '-9999px';
      testSpan.textContent = 'home';
      document.body.appendChild(testSpan);

      // Check if link already exists
      const existingLink = document.querySelector(`link[href*="${encodeURIComponent(fontFamily.replace(/ /g, '+'))}"]`);
      if (existingLink) {
        document.body.removeChild(testSpan);
        resolve();
        return;
      }

      // Load the font
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      link.onload = () => {
        document.body.removeChild(testSpan);
        resolve();
      };
      link.onerror = () => {
        document.body.removeChild(testSpan);
        resolve(); // Resolve anyway to not block
      };
      document.head.appendChild(link);
    });

    return fontLoadPromises[style];
  }

  if (!window.customElements.get('material-icon')) {
    window.customElements.define('material-icon', class MaterialIcon extends HTMLElement {
      constructor() {
        super();
        this._hasRendered = false;

        // Properties with defaults
        this._iconName = 'home';
        this._iconSize = 24;
        this._iconColor = '#6b7280'; // Nice gray (Tailwind gray-500)
        this._hoverColor = '';
        this._iconStyle = 'filled';
        this._clickable = false;
        this._tooltip = '';
        this._ariaLabel = '';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._iconSpan = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        // Load the appropriate font
        loadMaterialIconsFont(this._iconStyle).then(() => {
          this._updateIcon();
        });

        this.innerHTML = '';

        // Create icon span
        this._iconSpan = document.createElement('span');
        this._iconSpan.className = this._getFontClass();
        this._iconSpan.textContent = this._iconName;

        // WCAG: Add appropriate ARIA attributes
        if (this._clickable) {
          // Interactive icon - needs aria-label
          const label = this._ariaLabel || this._tooltip || this._iconName;
          this.setAttribute('aria-label', label);
          this.setAttribute('role', 'button');
          this.setAttribute('tabindex', this._isEnabled ? '0' : '-1');
        } else if (!this._ariaLabel) {
          // Decorative icon - hide from screen readers
          this.setAttribute('aria-hidden', 'true');
        } else {
          // Has aria-label but not clickable - use img role
          this.setAttribute('aria-label', this._ariaLabel);
          this.setAttribute('role', 'img');
        }

        this.appendChild(this._iconSpan);
        this._applyStyles();
        this._bindEvents();
      }

      _getFontClass() {
        switch (this._iconStyle) {
          case 'outlined':
            return 'material-icons-outlined';
          case 'rounded':
            return 'material-icons-round';
          case 'sharp':
            return 'material-icons-sharp';
          default:
            return 'material-icons';
        }
      }

      _applyStyles() {
        const size = this._iconSize;
        const color = this._iconColor;
        const clickable = this._clickable && this._isEnabled;

        this.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          ${!this._isVisible ? 'display: none;' : ''}
        `;

        if (this._iconSpan) {
          this._iconSpan.style.cssText = `
            font-size: ${size}px;
            width: ${size}px;
            height: ${size}px;
            color: ${color};
            cursor: ${clickable ? 'pointer' : 'default'};
            user-select: none;
            transition: color 0.2s ease, transform 0.15s ease;
            opacity: ${this._isEnabled ? '1' : '0.5'};
            line-height: 1;
          `;
        }

        // Set tooltip
        if (this._tooltip) {
          this.title = this._tooltip;
        } else {
          this.removeAttribute('title');
        }
      }

      _bindEvents() {
        const self = this;

        if (this._iconSpan) {
          this._iconSpan.addEventListener('mouseenter', () => {
            if (self._hoverColor && self._isEnabled) {
              self._iconSpan.style.color = self._hoverColor;
            }
            if (self._clickable && self._isEnabled) {
              self._iconSpan.style.transform = 'scale(1.1)';
            }
          });

          this._iconSpan.addEventListener('mouseleave', () => {
            self._iconSpan.style.color = self._iconColor;
            self._iconSpan.style.transform = 'scale(1)';
          });

          this._iconSpan.addEventListener('click', (e) => {
            if (self._clickable && self._isEnabled) {
              self.dispatchEvent(new CustomEvent('Clicked', {
                bubbles: true,
                detail: { iconName: self._iconName }
              }));
            }
          });
        }
      }

      _updateIcon() {
        if (this._iconSpan) {
          this._iconSpan.className = this._getFontClass();
          this._iconSpan.textContent = this._iconName;
          this._applyStyles();
        }
      }

      // Properties
      get iconName() { return this._iconName; }
      set iconName(v) {
        this._iconName = v || 'home';
        if (this._hasRendered) this._updateIcon();
        safeRaisePropertyChanged(this, 'iconName');
      }
      get IconName() { return this.iconName; }
      set IconName(v) { this.iconName = v; }

      get iconSize() { return this._iconSize; }
      set iconSize(v) {
        this._iconSize = parseInt(v) || 24;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconSize');
      }
      get IconSize() { return this.iconSize; }
      set IconSize(v) { this.iconSize = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#6b7280';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get hoverColor() { return this._hoverColor; }
      set hoverColor(v) {
        this._hoverColor = v || '';
        safeRaisePropertyChanged(this, 'hoverColor');
      }
      get HoverColor() { return this.hoverColor; }
      set HoverColor(v) { this.hoverColor = v; }

      get iconStyle() { return this._iconStyle; }
      set iconStyle(v) {
        const validStyles = ['filled', 'outlined', 'rounded', 'sharp'];
        this._iconStyle = validStyles.includes(v) ? v : 'filled';
        if (this._hasRendered) {
          loadMaterialIconsFont(this._iconStyle).then(() => {
            this._updateIcon();
          });
        }
        safeRaisePropertyChanged(this, 'iconStyle');
      }
      get IconStyle() { return this.iconStyle; }
      set IconStyle(v) { this.iconStyle = v; }

      get clickable() { return this._clickable; }
      set clickable(v) {
        this._clickable = (v === true || v === 'true');
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'clickable');
      }
      get Clickable() { return this.clickable; }
      set Clickable(v) { this.clickable = v; }

      get tooltip() { return this._tooltip; }
      set tooltip(v) {
        this._tooltip = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'tooltip');
      }
      get Tooltip() { return this.tooltip; }
      set Tooltip(v) { this.tooltip = v; }

      get ariaLabel() { return this._ariaLabel; }
      set ariaLabel(v) {
        this._ariaLabel = v || '';
        if (this._hasRendered) {
          if (this._clickable) {
            const label = this._ariaLabel || this._tooltip || this._iconName;
            this.setAttribute('aria-label', label);
          } else if (!this._ariaLabel) {
            this.setAttribute('aria-hidden', 'true');
            this.removeAttribute('aria-label');
            this.removeAttribute('role');
          } else {
            this.setAttribute('aria-label', this._ariaLabel);
            this.setAttribute('role', 'img');
            this.removeAttribute('aria-hidden');
          }
        }
        safeRaisePropertyChanged(this, 'ariaLabel');
      }
      get AriaLabel() { return this.ariaLabel; }
      set AriaLabel(v) { this.ariaLabel = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'inline-flex' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }

      // Value property alias for K2 binding
      get Value() { return this._iconName; }
      set Value(v) { this.iconName = v; }
    });
  }
})();

}
