/**
 * Material FAB Menu Control for K2 SmartForms
 * Material 3 Design Floating Action Button with expandable menu
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

  if (!window.customElements.get('material-fab-menu')) {
    window.customElements.define('material-fab-menu', class MaterialFabMenu extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._icon = 'add';
        this._openIcon = 'close';
        this._size = 'regular'; // small, regular, large
        this._variant = 'primary'; // primary, secondary, tertiary, surface
        this._position = 'bottom-right'; // bottom-right, bottom-left, bottom-center
        this._menuItems = 'edit:Edit|delete:Delete|share:Share';
        this._delimiter = '|';
        this._label = '';
        this._extended = false;
        this._primaryColor = '#6750A4';
        this._containerColor = '';
        this._iconColor = '#FFFFFF';
        this._secondaryColor = '#625B71';
        this._tertiaryColor = '#7D5260';
        this._surfaceColor = '#FFFBFE';
        this._menuItemBackgroundColor = '';
        this._menuItemIconColor = '';
        this._menuLabelBackgroundColor = '';
        this._menuLabelTextColor = '#1C1B1F';
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = '500';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;
        this._isOpen = false;

        // Parsed menu items
        this._parsedItems = [];

        // DOM refs
        this._container = null;
        this._fab = null;
        this._menu = null;

        // Bound handlers
        this._handleClickOutside = this._handleClickOutside.bind(this);
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseMenuItems();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      disconnectedCallback() {
        document.removeEventListener('click', this._handleClickOutside);
      }

      _parseMenuItems() {
        this._parsedItems = [];
        const delimiter = this._delimiter || '|';
        const items = this._menuItems ? this._menuItems.split(delimiter) : [];

        items.forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;

          const colonIndex = trimmed.indexOf(':');
          if (colonIndex > 0) {
            this._parsedItems.push({
              icon: trimmed.substring(0, colonIndex).trim(),
              label: trimmed.substring(colonIndex + 1).trim()
            });
          } else {
            this._parsedItems.push({
              icon: trimmed,
              label: trimmed
            });
          }
        });
      }

      _render() {
        this.innerHTML = '';
        this._buildFabMenu();
        this._applyStyles();
        this._bindEvents();
      }

      _buildFabMenu() {
        this._container = document.createElement('div');
        this._container.className = `mfab-container mfab-${this._position}`;

        // Menu items (above FAB)
        this._menu = document.createElement('div');
        this._menu.className = 'mfab-menu';
        this._buildMenuItems();
        this._container.appendChild(this._menu);

        // Main FAB button
        this._fab = document.createElement('button');
        this._fab.className = `mfab-button mfab-${this._size} mfab-${this._variant}`;
        this._fab.type = 'button';

        if (this._extended && this._label) {
          this._fab.classList.add('mfab-extended');
        }

        // Icon
        const iconEl = document.createElement('span');
        iconEl.className = 'mfab-icon material-icons';
        iconEl.textContent = this._icon;
        this._fab.appendChild(iconEl);

        // Label for extended FAB
        if (this._extended && this._label) {
          const labelEl = document.createElement('span');
          labelEl.className = 'mfab-label';
          labelEl.textContent = this._label;
          this._fab.appendChild(labelEl);
        }

        // State layer
        const stateLayer = document.createElement('span');
        stateLayer.className = 'mfab-state-layer';
        this._fab.appendChild(stateLayer);

        this._container.appendChild(this._fab);
        this.appendChild(this._container);
        this._updateState();
      }

      _buildMenuItems() {
        if (!this._menu) return;
        this._menu.innerHTML = '';

        this._parsedItems.forEach((item, index) => {
          const menuItem = document.createElement('div');
          menuItem.className = 'mfab-menu-item';
          menuItem.style.transitionDelay = `${index * 50}ms`;

          // Mini FAB
          const miniFab = document.createElement('button');
          miniFab.className = 'mfab-mini';
          miniFab.type = 'button';

          const iconEl = document.createElement('span');
          iconEl.className = 'mfab-mini-icon material-icons';
          iconEl.textContent = item.icon;
          miniFab.appendChild(iconEl);

          menuItem.appendChild(miniFab);

          // Label
          const labelEl = document.createElement('span');
          labelEl.className = 'mfab-menu-label';
          labelEl.textContent = item.label;
          menuItem.appendChild(labelEl);

          menuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            this._selectItem(item, index);
          });

          this._menu.appendChild(menuItem);
        });
      }

      _selectItem(item, index) {
        this.close();

        this.dispatchEvent(new CustomEvent('ItemClicked', {
          bubbles: true,
          detail: { icon: item.icon, label: item.label, index: index }
        }));
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--mfab-primary', this._primaryColor);
          this._container.style.setProperty('--mfab-secondary', this._secondaryColor);
          this._container.style.setProperty('--mfab-tertiary', this._tertiaryColor);
          this._container.style.setProperty('--mfab-surface', this._surfaceColor);
          this._container.style.setProperty('--mfab-on-surface', this._menuLabelTextColor);
          if (this._menuItemBackgroundColor) {
            this._container.style.setProperty('--mfab-menu-item-bg', this._menuItemBackgroundColor);
          }
          if (this._menuItemIconColor) {
            this._container.style.setProperty('--mfab-menu-item-icon', this._menuItemIconColor);
          }
          if (this._menuLabelBackgroundColor) {
            this._container.style.setProperty('--mfab-menu-label-bg', this._menuLabelBackgroundColor);
          }
        }

        if (this._fab) {
          this._fab.style.setProperty('--mfab-primary', this._primaryColor);
          this._fab.style.setProperty('--mfab-icon-color', this._iconColor);
          if (this._containerColor) {
            this._fab.style.setProperty('--mfab-container', this._containerColor);
          }

          // Apply font styles to FAB label
          const fabLabel = this._fab.querySelector('.mfab-label');
          if (fabLabel) {
            fabLabel.style.fontFamily = this._fontFamily;
            fabLabel.style.fontSize = `${this._fontSize}px`;
            fabLabel.style.fontWeight = this._fontWeight;
            fabLabel.style.fontStyle = this._fontStyle;
          }
        }

        // Apply font styles to menu labels
        if (this._menu) {
          const menuLabels = this._menu.querySelectorAll('.mfab-menu-label');
          menuLabels.forEach(label => {
            label.style.fontFamily = this._fontFamily;
            label.style.fontSize = `${this._fontSize}px`;
            label.style.fontWeight = this._fontWeight;
            label.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        // Main FAB click
        this._fab.addEventListener('click', (e) => {
          if (!this._isEnabled) return;
          e.stopPropagation();

          if (this._parsedItems.length > 0) {
            if (this._isOpen) {
              this.close();
            } else {
              this.open();
            }
          } else {
            this.dispatchEvent(new CustomEvent('Clicked', {
              bubbles: true,
              detail: { icon: this._icon }
            }));
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

      _updateState() {
        if (!this._fab || !this._container) return;

        if (!this._isEnabled) {
          this._fab.disabled = true;
          this._fab.classList.add('mfab-disabled');
        } else {
          this._fab.disabled = false;
          this._fab.classList.remove('mfab-disabled');
        }

        this._container.classList.toggle('mfab-open', this._isOpen);

        // Update icon
        const iconEl = this._fab.querySelector('.mfab-icon');
        if (iconEl) {
          iconEl.textContent = this._isOpen ? this._openIcon : this._icon;
        }
      }

      // Public methods
      open() {
        if (!this._isEnabled || this._isOpen) return;
        this._isOpen = true;
        this._updateState();
      }

      close() {
        if (!this._isOpen) return;
        this._isOpen = false;
        this._updateState();
      }

      toggle() {
        if (this._isOpen) {
          this.close();
        } else {
          this.open();
        }
      }

      // Properties
      get fabIcon() { return this._icon; }
      set fabIcon(v) {
        this._icon = v || 'add';
        if (this._hasRendered && !this._isOpen) {
          const iconEl = this._fab?.querySelector('.mfab-icon');
          if (iconEl) iconEl.textContent = this._icon;
        }
        safeRaisePropertyChanged(this, 'fabIcon');
      }
      get FabIcon() { return this.fabIcon; }
      set FabIcon(v) { this.fabIcon = v; }

      get openIcon() { return this._openIcon; }
      set openIcon(v) {
        this._openIcon = v || 'close';
        safeRaisePropertyChanged(this, 'openIcon');
      }
      get OpenIcon() { return this.openIcon; }
      set OpenIcon(v) { this.openIcon = v; }

      get size() { return this._size; }
      set size(v) {
        const valid = ['small', 'regular', 'large'];
        this._size = valid.includes(v) ? v : 'regular';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'size');
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['primary', 'secondary', 'tertiary', 'surface'];
        this._variant = valid.includes(v) ? v : 'primary';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get position() { return this._position; }
      set position(v) {
        const valid = ['bottom-right', 'bottom-left', 'bottom-center'];
        this._position = valid.includes(v) ? v : 'bottom-right';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'position');
      }
      get Position() { return this.position; }
      set Position(v) { this.position = v; }

      get menuItems() { return this._menuItems; }
      set menuItems(v) {
        this._menuItems = v || '';
        this._parseMenuItems();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'menuItems');
      }
      get MenuItems() { return this.menuItems; }
      set MenuItems(v) { this.menuItems = v; }

      get delimiter() { return this._delimiter; }
      set delimiter(v) {
        this._delimiter = v || '|';
        this._parseMenuItems();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'delimiter');
      }
      get Delimiter() { return this.delimiter; }
      set Delimiter(v) { this.delimiter = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get extended() { return this._extended; }
      set extended(v) {
        this._extended = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'extended');
      }
      get Extended() { return this.extended; }
      set Extended(v) { this.extended = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get containerColor() { return this._containerColor; }
      set containerColor(v) {
        this._containerColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'containerColor');
      }
      get ContainerColor() { return this.containerColor; }
      set ContainerColor(v) { this.containerColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get secondaryColor() { return this._secondaryColor; }
      set secondaryColor(v) {
        this._secondaryColor = v || '#625B71';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'secondaryColor');
      }
      get SecondaryColor() { return this.secondaryColor; }
      set SecondaryColor(v) { this.secondaryColor = v; }

      get tertiaryColor() { return this._tertiaryColor; }
      set tertiaryColor(v) {
        this._tertiaryColor = v || '#7D5260';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'tertiaryColor');
      }
      get TertiaryColor() { return this.tertiaryColor; }
      set TertiaryColor(v) { this.tertiaryColor = v; }

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'surfaceColor');
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get menuItemBackgroundColor() { return this._menuItemBackgroundColor; }
      set menuItemBackgroundColor(v) {
        this._menuItemBackgroundColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'menuItemBackgroundColor');
      }
      get MenuItemBackgroundColor() { return this.menuItemBackgroundColor; }
      set MenuItemBackgroundColor(v) { this.menuItemBackgroundColor = v; }

      get menuItemIconColor() { return this._menuItemIconColor; }
      set menuItemIconColor(v) {
        this._menuItemIconColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'menuItemIconColor');
      }
      get MenuItemIconColor() { return this.menuItemIconColor; }
      set MenuItemIconColor(v) { this.menuItemIconColor = v; }

      get menuLabelBackgroundColor() { return this._menuLabelBackgroundColor; }
      set menuLabelBackgroundColor(v) {
        this._menuLabelBackgroundColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'menuLabelBackgroundColor');
      }
      get MenuLabelBackgroundColor() { return this.menuLabelBackgroundColor; }
      set MenuLabelBackgroundColor(v) { this.menuLabelBackgroundColor = v; }

      get menuLabelTextColor() { return this._menuLabelTextColor; }
      set menuLabelTextColor(v) {
        this._menuLabelTextColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'menuLabelTextColor');
      }
      get MenuLabelTextColor() { return this.menuLabelTextColor; }
      set MenuLabelTextColor(v) { this.menuLabelTextColor = v; }

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
        this._fontWeight = v || '500';
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
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        this._updateState();
      }
    });
  }
})();
