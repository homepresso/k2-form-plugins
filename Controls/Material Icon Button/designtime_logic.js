/**
 * Material Icon Button Control for K2 SmartForms - Design Time
 * Material 3 Design icon button with standard, filled, tonal, and outlined variants
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

  if (!window.customElements.get('material-icon-button')) {
    window.customElements.define('material-icon-button', class MaterialIconButton extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._icon = 'favorite';
        this._variant = 'standard'; // standard, filled, tonal, outlined
        this._size = 'medium'; // small, medium, large
        this._toggle = false;
        this._selected = false;
        this._selectedIcon = '';
        this._tooltip = '';
        this._primaryColor = '#6750A4';
        this._iconColor = '#49454F';
        this._containerColor = '';
        this._outlineColor = '#79747E';
        this._selectedContainerColor = '';
        this._selectedIconColor = '#FFFFFF';
        this._surfaceVariantColor = '#E7E0EC';
        this._disableRipple = false;
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 24;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._button = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        this.setAttribute('tabindex', '-1'); // Prevent focus in design-time
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
        this._button.className = `mib-button mib-${this._variant} mib-${this._size}`;
        this._button.type = 'button';

        if (this._tooltip) {
          this._button.title = this._tooltip;
        }

        if (this._toggle && this._selected) {
          this._button.classList.add('mib-selected');
        }

        // Icon
        const iconEl = document.createElement('span');
        iconEl.className = 'mib-icon material-icons';
        iconEl.textContent = (this._toggle && this._selected && this._selectedIcon)
          ? this._selectedIcon
          : this._icon;
        this._button.appendChild(iconEl);

        // State layer
        const stateLayer = document.createElement('span');
        stateLayer.className = 'mib-state-layer';
        this._button.appendChild(stateLayer);

        // Ripple container
        if (!this._disableRipple) {
          const ripple = document.createElement('span');
          ripple.className = 'mib-ripple';
          this._button.appendChild(ripple);
        }

        this.appendChild(this._button);
        this._updateState();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';

        if (this._button) {
          this._button.style.setProperty('--mib-primary', this._primaryColor);
          this._button.style.setProperty('--mib-icon-color', this._iconColor);
          this._button.style.setProperty('--mib-outline', this._outlineColor);
          this._button.style.setProperty('--mib-surface-variant', this._surfaceVariantColor);
          this._button.style.setProperty('--mib-selected-icon-color', this._selectedIconColor);
          if (this._containerColor) {
            this._button.style.setProperty('--mib-container', this._containerColor);
          }
          if (this._selectedContainerColor) {
            this._button.style.setProperty('--mib-selected-container', this._selectedContainerColor);
          }

          // Apply font styles to icon
          const iconEl = this._button.querySelector('.mib-icon');
          if (iconEl) {
            iconEl.style.fontSize = `${this._fontSize}px`;
          }
        }
      }

      _bindEvents() {
        this._button.addEventListener('click', (e) => {
          if (!this._isEnabled) return;

          // Ripple effect
          if (!this._disableRipple) {
            this._createRipple(e);
          }

          // Toggle logic
          if (this._toggle) {
            this._selected = !this._selected;
            this._button.classList.toggle('mib-selected', this._selected);

            // Update icon
            const iconEl = this._button.querySelector('.mib-icon');
            if (iconEl) {
              iconEl.textContent = (this._selected && this._selectedIcon)
                ? this._selectedIcon
                : this._icon;
            }
          }

          this.dispatchEvent(new CustomEvent('Clicked', {
            bubbles: true,
            detail: { icon: this._icon, selected: this._selected }
          }));
        });
      }

      _createRipple(event) {
        const rippleContainer = this._button.querySelector('.mib-ripple');
        if (!rippleContainer) return;

        const ripple = document.createElement('span');
        ripple.className = 'mib-ripple-effect';

        const rect = this._button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${event.clientX - rect.left - size / 2}px;
          top: ${event.clientY - rect.top - size / 2}px;
        `;

        rippleContainer.appendChild(ripple);
      }

      _updateState() {
        if (!this._button) return;

        if (!this._isEnabled) {
          this._button.disabled = true;
          this._button.classList.add('mib-disabled');
        } else {
          this._button.disabled = true; // Design-time: always disabled
          this._button.classList.remove('mib-disabled');
        }
      }

      // Properties
      get icon() { return this._icon; }
      set icon(v) {
        this._icon = v || 'favorite';
        if (this._hasRendered) {
          const iconEl = this._button?.querySelector('.mib-icon');
          if (iconEl && !(this._toggle && this._selected && this._selectedIcon)) {
            iconEl.textContent = this._icon;
          }
        }
      }
      get Icon() { return this.icon; }
      set Icon(v) { this.icon = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['standard', 'filled', 'tonal', 'outlined'];
        this._variant = valid.includes(v) ? v : 'standard';
        if (this._hasRendered) this._render();
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get size() { return this._size; }
      set size(v) {
        const valid = ['small', 'medium', 'large'];
        this._size = valid.includes(v) ? v : 'medium';
        if (this._hasRendered) this._render();
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

      get toggle() { return this._toggle; }
      set toggle(v) {
        this._toggle = (v === true || v === 'true');
      }
      get Toggle() { return this.toggle; }
      set Toggle(v) { this.toggle = v; }

      get selected() { return this._selected; }
      set selected(v) {
        this._selected = (v === true || v === 'true');
        if (this._hasRendered) {
          this._button?.classList.toggle('mib-selected', this._selected);
          const iconEl = this._button?.querySelector('.mib-icon');
          if (iconEl) {
            iconEl.textContent = (this._selected && this._selectedIcon)
              ? this._selectedIcon
              : this._icon;
          }
        }
      }
      get Selected() { return this.selected; }
      set Selected(v) { this.selected = v; }

      get selectedIcon() { return this._selectedIcon; }
      set selectedIcon(v) {
        this._selectedIcon = v || '';
      }
      get SelectedIcon() { return this.selectedIcon; }
      set SelectedIcon(v) { this.selectedIcon = v; }

      get tooltip() { return this._tooltip; }
      set tooltip(v) {
        this._tooltip = v || '';
        if (this._button) this._button.title = this._tooltip;
      }
      get Tooltip() { return this.tooltip; }
      set Tooltip(v) { this.tooltip = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get containerColor() { return this._containerColor; }
      set containerColor(v) {
        this._containerColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get ContainerColor() { return this.containerColor; }
      set ContainerColor(v) { this.containerColor = v; }

      get outlineColor() { return this._outlineColor; }
      set outlineColor(v) {
        this._outlineColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
      }
      get OutlineColor() { return this.outlineColor; }
      set OutlineColor(v) { this.outlineColor = v; }

      get selectedContainerColor() { return this._selectedContainerColor; }
      set selectedContainerColor(v) {
        this._selectedContainerColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get SelectedContainerColor() { return this.selectedContainerColor; }
      set SelectedContainerColor(v) { this.selectedContainerColor = v; }

      get selectedIconColor() { return this._selectedIconColor; }
      set selectedIconColor(v) {
        this._selectedIconColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get SelectedIconColor() { return this.selectedIconColor; }
      set SelectedIconColor(v) { this.selectedIconColor = v; }

      get surfaceVariantColor() { return this._surfaceVariantColor; }
      set surfaceVariantColor(v) {
        this._surfaceVariantColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
      }
      get SurfaceVariantColor() { return this.surfaceVariantColor; }
      set SurfaceVariantColor(v) { this.surfaceVariantColor = v; }

      get disableRipple() { return this._disableRipple; }
      set disableRipple(v) {
        this._disableRipple = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get DisableRipple() { return this.disableRipple; }
      set DisableRipple(v) { this.disableRipple = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseInt(v) || 24;
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || 'normal';
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
