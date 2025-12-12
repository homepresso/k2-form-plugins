if (!window.__nintexcaseusermenuRuntimeLoaded) {
  window.__nintexcaseusermenuRuntimeLoaded = true;

/**
 * NintexCase User Menu Control for K2 SmartForms
 * Avatar button with initials and dropdown menu
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
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('nintexcase-user-menu')) {
    window.customElements.define('nintexcase-user-menu', class NintexCaseUserMenu extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for preview/testing when list binding is empty
        this._sampleItems = [
          { Name: 'My Profile' },
          { Name: 'Settings' },
          { Name: 'Help' },
          { Name: 'Sign Out' }
        ];

        // Properties
        this._selectedValue = '';
        this._displayName = 'John Doe';
        this._backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this._textColor = '#FFFFFF';
        this._dropdownBackgroundColor = '#FFFFFF';
        this._dropdownTextColor = '#1C1B1F';
        this._hoverColor = '#F5F5F5';
        this._size = 40;
        this._fontSize = 14;
        this._fontFamily = 'Roboto, sans-serif';
        this._isVisible = true;
        this._isEnabled = true;
        this._isOpen = false;

        // K2 list binding
        this._listConfig = null;
        this._listItems = [];

        // DOM refs
        this._container = null;
        this._button = null;
        this._dropdown = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        this._hasRendered = true;
        setTimeout(() => {
          this._render();
          this._addGlobalClickListener();
        }, 0);
      }

      disconnectedCallback() {
        this._removeGlobalClickListener();
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const items = itemsChangedEventArgs?.NewItems;
        if (items && Array.isArray(items)) {
          this._listItems = items;
          if (this._hasRendered) {
            this._render();
          }
        }
      }

      _getInitials(name) {
        if (!name || name.trim() === '') return '??';
        const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
        if (parts.length === 0) return '??';
        if (parts.length === 1) {
          // Single name: take first 2 characters
          return parts[0].substring(0, 2).toUpperCase();
        }
        // Multiple names: first char of first name + first char of last name
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      }

      _render() {
        this.innerHTML = '';
        this._buildMenu();
        this._applyStyles();
        this._bindEvents();
      }

      _buildMenu() {
        this._container = document.createElement('div');
        this._container.className = 'ncum-container';

        // Avatar button
        this._button = document.createElement('button');
        this._button.className = 'ncum-button';
        this._button.type = 'button';
        this._button.setAttribute('aria-haspopup', 'true');
        this._button.setAttribute('aria-expanded', 'false');
        this._button.textContent = this._getInitials(this._displayName);

        // Dropdown menu
        this._dropdown = document.createElement('div');
        this._dropdown.className = 'ncum-dropdown';
        this._dropdown.setAttribute('role', 'menu');
        this._dropdown.style.display = 'none';

        const menuList = document.createElement('ul');
        menuList.className = 'ncum-menu-list';

        // Use list items or sample data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;

        items.forEach((item, index) => {
          const name = item.Name || item.name || `Item ${index + 1}`;

          const listItem = document.createElement('li');
          listItem.className = 'ncum-menu-item';

          const menuButton = document.createElement('button');
          menuButton.className = 'ncum-menu-button';
          menuButton.type = 'button';
          menuButton.textContent = name;
          menuButton.dataset.name = name;
          menuButton.dataset.index = index;
          menuButton.setAttribute('role', 'menuitem');

          listItem.appendChild(menuButton);
          menuList.appendChild(listItem);
        });

        this._dropdown.appendChild(menuList);
        this._container.appendChild(this._button);
        this._container.appendChild(this._dropdown);
        this.appendChild(this._container);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--ncum-bg', this._backgroundColor);
          this._container.style.setProperty('--ncum-text', this._textColor);
          this._container.style.setProperty('--ncum-dropdown-bg', this._dropdownBackgroundColor);
          this._container.style.setProperty('--ncum-dropdown-text', this._dropdownTextColor);
          this._container.style.setProperty('--ncum-hover', this._hoverColor);
          this._container.style.setProperty('--ncum-size', `${this._size}px`);
          this._container.style.setProperty('--ncum-font-size', `${this._fontSize}px`);
          this._container.style.setProperty('--ncum-font-family', this._fontFamily);
        }

        // Apply disabled state
        if (this._button) {
          this._button.disabled = !this._isEnabled;
        }
      }

      _bindEvents() {
        if (this._button) {
          this._button.addEventListener('click', (e) => this._handleButtonClick(e));
        }

        const menuButtons = this._dropdown?.querySelectorAll('.ncum-menu-button');
        if (menuButtons) {
          menuButtons.forEach(button => {
            button.addEventListener('click', (e) => this._handleMenuItemClick(e));
          });
        }
      }

      _handleButtonClick(event) {
        if (!this._isEnabled) return;
        event.stopPropagation();
        this._toggleMenu();
      }

      _toggleMenu() {
        this._isOpen = !this._isOpen;
        if (this._isOpen) {
          this._openMenu();
        } else {
          this._closeMenu();
        }
      }

      _openMenu() {
        if (this._dropdown) {
          this._dropdown.style.display = 'block';
          this._button.setAttribute('aria-expanded', 'true');
        }
      }

      _closeMenu() {
        if (this._dropdown) {
          this._dropdown.style.display = 'none';
          this._button.setAttribute('aria-expanded', 'false');
          this._isOpen = false;
        }
      }

      _handleMenuItemClick(event) {
        if (!this._isEnabled) return;

        const button = event.currentTarget;
        const name = button.dataset.name;
        const index = parseInt(button.dataset.index);

        // Update selected value
        this._selectedValue = name;

        // Close menu
        this._closeMenu();

        // Raise property changed event for K2
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }

        // Get the item data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;
        const item = items[index];

        // Fire custom event
        this.dispatchEvent(new CustomEvent('MenuItemClicked', {
          bubbles: true,
          detail: {
            name: name,
            index: index,
            item: item
          }
        }));
      }

      _addGlobalClickListener() {
        this._globalClickHandler = (e) => {
          if (this._isOpen && !this._container?.contains(e.target)) {
            this._closeMenu();
          }
        };
        document.addEventListener('click', this._globalClickHandler);
      }

      _removeGlobalClickListener() {
        if (this._globalClickHandler) {
          document.removeEventListener('click', this._globalClickHandler);
        }
      }

      // Public Methods
      closeMenu() {
        this._closeMenu();
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      // K2 Value property (maps to selectedValue)
      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

      get displayName() { return this._displayName; }
      set displayName(v) {
        this._displayName = v || 'User';
        if (this._hasRendered && this._button) {
          this._button.textContent = this._getInitials(this._displayName);
        }
      }
      get DisplayName() { return this.displayName; }
      set DisplayName(v) { this.displayName = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get dropdownBackgroundColor() { return this._dropdownBackgroundColor; }
      set dropdownBackgroundColor(v) {
        this._dropdownBackgroundColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get DropdownBackgroundColor() { return this.dropdownBackgroundColor; }
      set DropdownBackgroundColor(v) { this.dropdownBackgroundColor = v; }

      get dropdownTextColor() { return this._dropdownTextColor; }
      set dropdownTextColor(v) {
        this._dropdownTextColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get DropdownTextColor() { return this.dropdownTextColor; }
      set DropdownTextColor(v) { this.dropdownTextColor = v; }

      get hoverColor() { return this._hoverColor; }
      set hoverColor(v) {
        this._hoverColor = v || '#F5F5F5';
        if (this._hasRendered) this._applyStyles();
      }
      get HoverColor() { return this.hoverColor; }
      set HoverColor(v) { this.hoverColor = v; }

      get size() { return this._size; }
      set size(v) {
        this._size = parseInt(v) || 40;
        if (this._hasRendered) this._applyStyles();
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseInt(v) || 14;
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
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
        if (this._button) {
          this._button.disabled = !this._isEnabled;
        }
      }
    });
  }
})();


}
