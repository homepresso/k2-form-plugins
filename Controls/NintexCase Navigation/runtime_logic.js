if (!window.__nintexcasenavigationRuntimeLoaded) {
  window.__nintexcasenavigationRuntimeLoaded = true;

/**
 * NintexCase Navigation Control for K2 SmartForms
 * Horizontal navigation menu with optional user menu on the right
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
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('nintexcase-navigation')) {
    window.customElements.define('nintexcase-navigation', class NintexCaseNavigation extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for preview/testing when list binding is empty
        this._sampleItems = [
          { Name: 'Dashboard', Mode: '' },
          { Name: 'My Cases', Mode: '' },
          { Name: 'New Case', Mode: 'create' },
          { Name: 'Case Details', Mode: 'view' },
          { Name: 'Edit Case', Mode: 'edit' },
          { Name: 'Tasks', Mode: '' },
          { Name: 'Documents', Mode: '' },
          { Name: 'Reports', Mode: '' },
          { Name: 'Admin', Mode: 'admin' }
        ];

        // Sample user menu items
        this._sampleUserMenuItems = [
          { Name: 'My Profile' },
          { Name: 'Settings' },
          { Name: 'Help' },
          { Name: 'Sign Out' }
        ];

        // Properties
        this._selectedValue = '';
        this._selectedUserMenuItem = '';
        this._mode = '';
        this._title = '';
        this._titleColor = '#FFFFFF';
        this._titleFontSize = 18;
        this._titleFontWeight = '700';
        this._titleFontFamily = '';
        this._showUserMenu = true;
        this._displayName = 'John Doe';
        this._userMenuButtonBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this._userMenuButtonTextColor = '#FFFFFF';
        this._userMenuButtonBorderColor = 'rgba(255, 255, 255, 0.3)';
        this._userMenuButtonSize = 40;
        this._userMenuDropdownBackground = '#FFFFFF';
        this._userMenuDropdownTextColor = '#1C1B1F';
        this._userMenuDropdownHoverColor = '#F5F5F5';
        this._backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this._textColor = 'rgba(255, 255, 255, 0.95)';
        this._activeColor = '#FFFFFF';
        this._hoverColor = 'rgba(255, 255, 255, 0.15)';
        this._borderColor = '#E0E0E0';
        this._height = 60;
        this._borderRadius = '0';
        this._fontFamily = 'Poppins, sans-serif';
        this._fontSize = 14;
        this._fontWeight = '500';
        this._isVisible = true;
        this._isEnabled = true;
        this._isUserMenuOpen = false;

        // K2 list binding
        this._listConfig = null;
        this._navListConfig = null;
        this._userMenuListConfig = null;
        this._listItems = [];
        this._userMenuListItems = [];
        this._filteredItems = [];

        // DOM refs
        this._container = null;
        this._nav = null;
        this._userMenuButton = null;
        this._userMenuDropdown = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        this._hasRendered = true;
        this._processListItems(); // Initialize with sample data
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
        if (listname === 'UserMenuList') {
          this._userMenuListConfig = config;
        } else {
          this._listConfig = config;
        }
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const listname = itemsChangedEventArgs?.ListName;
        const items = itemsChangedEventArgs?.NewItems;

        if (listname === 'UserMenuList' && items && Array.isArray(items)) {
          this._userMenuListItems = items;
          if (this._hasRendered) {
            this._render();
          }
        } else if (items && Array.isArray(items)) {
          this._listItems = items;
          this._processListItems();
          if (this._hasRendered) {
            this._render();
          }
        }
      }

      _processListItems() {
        // Use sample data as fallback when list binding is empty
        const sourceItems = this._listItems.length > 0 ? this._listItems : this._sampleItems;

        // Filter items based on current mode if Mode field exists
        this._filteredItems = sourceItems.filter(item => {
          // If no mode filter or item has no Mode field, include it
          if (!this._mode || !item.Mode) {
            return true;
          }
          // Otherwise, check if item's Mode matches current mode
          return item.Mode === this._mode;
        });
      }

      _getInitials(name) {
        if (!name || name.trim() === '') return '??';
        const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
        if (parts.length === 0) return '??';
        if (parts.length === 1) {
          return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      }

      _render() {
        this.innerHTML = '';
        this._buildNav();
        this._applyStyles();
        this._bindEvents();
      }

      _buildNav() {
        this._container = document.createElement('div');
        this._container.className = 'ncn-container';

        // Optional title
        if (this._title && this._title.trim() !== '') {
          const titleEl = document.createElement('div');
          titleEl.className = 'ncn-title';
          titleEl.textContent = this._title;
          this._container.appendChild(titleEl);
        }

        // Navigation section
        this._nav = document.createElement('nav');
        this._nav.className = 'ncn-nav';
        this._nav.setAttribute('role', 'navigation');
        this._nav.setAttribute('aria-label', 'NintexCase Navigation');

        const navList = document.createElement('ul');
        navList.className = 'ncn-list';

        // Build navigation items
        this._filteredItems.forEach((item, index) => {
          const name = item.Name || item.name || `Item ${index + 1}`;

          const listItem = document.createElement('li');
          listItem.className = 'ncn-item';

          const button = document.createElement('button');
          button.className = 'ncn-button';
          button.type = 'button';
          button.textContent = name;
          button.dataset.name = name;
          button.dataset.index = index;

          // Set active state if this is the selected item
          if (name === this._selectedValue) {
            button.classList.add('ncn-active');
            button.setAttribute('aria-current', 'page');
          }

          // WCAG: Button should be keyboard accessible
          button.setAttribute('role', 'menuitem');
          button.tabIndex = 0;

          listItem.appendChild(button);
          navList.appendChild(listItem);
        });

        this._nav.appendChild(navList);
        this._container.appendChild(this._nav);

        // User menu (if enabled)
        if (this._showUserMenu) {
          const userMenuContainer = document.createElement('div');
          userMenuContainer.className = 'ncn-user-menu-container';

          // Avatar button
          this._userMenuButton = document.createElement('button');
          this._userMenuButton.className = 'ncn-user-button';
          this._userMenuButton.type = 'button';
          this._userMenuButton.setAttribute('aria-haspopup', 'true');
          this._userMenuButton.setAttribute('aria-expanded', 'false');
          this._userMenuButton.textContent = this._getInitials(this._displayName);

          // Dropdown menu
          this._userMenuDropdown = document.createElement('div');
          this._userMenuDropdown.className = 'ncn-user-dropdown';
          this._userMenuDropdown.setAttribute('role', 'menu');
          this._userMenuDropdown.style.display = 'none';

          const menuList = document.createElement('ul');
          menuList.className = 'ncn-user-menu-list';

          // Use list items or sample data
          const items = this._userMenuListItems.length > 0 ? this._userMenuListItems : this._sampleUserMenuItems;

          items.forEach((item, index) => {
            const name = item.Name || item.name || `Item ${index + 1}`;

            const listItem = document.createElement('li');
            listItem.className = 'ncn-user-menu-item';

            const menuButton = document.createElement('button');
            menuButton.className = 'ncn-user-menu-button';
            menuButton.type = 'button';
            menuButton.textContent = name;
            menuButton.dataset.name = name;
            menuButton.dataset.index = index;
            menuButton.setAttribute('role', 'menuitem');

            listItem.appendChild(menuButton);
            menuList.appendChild(listItem);
          });

          this._userMenuDropdown.appendChild(menuList);
          userMenuContainer.appendChild(this._userMenuButton);
          userMenuContainer.appendChild(this._userMenuDropdown);
          this._container.appendChild(userMenuContainer);
        }

        this.appendChild(this._container);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--ncn-bg', this._backgroundColor);
          this._container.style.setProperty('--ncn-text', this._textColor);
          this._container.style.setProperty('--ncn-active', this._activeColor);
          this._container.style.setProperty('--ncn-hover', this._hoverColor);
          this._container.style.setProperty('--ncn-border', this._borderColor);
          this._container.style.setProperty('--ncn-height', `${this._height}px`);
          this._container.style.setProperty('--ncn-border-radius', this._borderRadius);
          this._container.style.setProperty('--ncn-font-family', this._fontFamily);
          this._container.style.setProperty('--ncn-font-size', `${this._fontSize}px`);
          this._container.style.setProperty('--ncn-font-weight', this._fontWeight);

          // Title styles
          this._container.style.setProperty('--ncn-title-color', this._titleColor);
          this._container.style.setProperty('--ncn-title-font-size', `${this._titleFontSize}px`);
          this._container.style.setProperty('--ncn-title-font-weight', this._titleFontWeight);
          this._container.style.setProperty('--ncn-title-font-family', this._titleFontFamily || this._fontFamily);

          // User menu styles
          this._container.style.setProperty('--ncn-user-button-bg', this._userMenuButtonBackground);
          this._container.style.setProperty('--ncn-user-button-text', this._userMenuButtonTextColor);
          this._container.style.setProperty('--ncn-user-button-border', this._userMenuButtonBorderColor);
          this._container.style.setProperty('--ncn-user-button-size', `${this._userMenuButtonSize}px`);
          this._container.style.setProperty('--ncn-user-dropdown-bg', this._userMenuDropdownBackground);
          this._container.style.setProperty('--ncn-user-dropdown-text', this._userMenuDropdownTextColor);
          this._container.style.setProperty('--ncn-user-dropdown-hover', this._userMenuDropdownHoverColor);
        }

        // Apply disabled state
        if (this._nav) {
          this._nav.classList.toggle('ncn-disabled', !this._isEnabled);
        }

        // Apply disabled state to user menu
        if (this._userMenuButton) {
          this._userMenuButton.disabled = !this._isEnabled;
        }
      }

      _bindEvents() {
        const buttons = this._container?.querySelectorAll('.ncn-button');
        if (buttons) {
          buttons.forEach(button => {
            button.addEventListener('click', (e) => this._handleItemClick(e));
            button.addEventListener('keydown', (e) => this._handleKeyDown(e));
          });
        }

        if (this._userMenuButton) {
          this._userMenuButton.addEventListener('click', (e) => this._handleUserMenuButtonClick(e));
        }

        const userMenuButtons = this._userMenuDropdown?.querySelectorAll('.ncn-user-menu-button');
        if (userMenuButtons) {
          userMenuButtons.forEach(button => {
            button.addEventListener('click', (e) => this._handleUserMenuItemClick(e));
          });
        }
      }

      _handleItemClick(event) {
        if (!this._isEnabled) return;

        const button = event.currentTarget;
        const name = button.dataset.name;
        const index = parseInt(button.dataset.index);

        // Update selected value
        this._selectedValue = name;

        // Update active state
        const buttons = this._container.querySelectorAll('.ncn-button');
        buttons.forEach(btn => {
          btn.classList.remove('ncn-active');
          btn.removeAttribute('aria-current');
        });
        button.classList.add('ncn-active');
        button.setAttribute('aria-current', 'page');

        // Raise property changed event for K2
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }

        // Fire custom event
        this.dispatchEvent(new CustomEvent('ItemClicked', {
          bubbles: true,
          detail: {
            name: name,
            index: index,
            item: this._filteredItems[index]
          }
        }));
      }

      _handleKeyDown(event) {
        if (!this._isEnabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this._handleItemClick(event);
        }
      }

      _handleUserMenuButtonClick(event) {
        if (!this._isEnabled) return;
        event.stopPropagation();
        this._toggleUserMenu();
      }

      _toggleUserMenu() {
        this._isUserMenuOpen = !this._isUserMenuOpen;
        if (this._isUserMenuOpen) {
          this._openUserMenu();
        } else {
          this._closeUserMenu();
        }
      }

      _openUserMenu() {
        if (this._userMenuDropdown) {
          this._userMenuDropdown.style.display = 'block';
          this._userMenuButton.setAttribute('aria-expanded', 'true');
        }
      }

      _closeUserMenu() {
        if (this._userMenuDropdown) {
          this._userMenuDropdown.style.display = 'none';
          this._userMenuButton.setAttribute('aria-expanded', 'false');
          this._isUserMenuOpen = false;
        }
      }

      _handleUserMenuItemClick(event) {
        if (!this._isEnabled) return;

        const button = event.currentTarget;
        const name = button.dataset.name;
        const index = parseInt(button.dataset.index);

        // Update selected value
        this._selectedUserMenuItem = name;

        // Close menu
        this._closeUserMenu();

        // Raise property changed event for K2
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedUserMenuItem');
        }

        // Get the item data
        const items = this._userMenuListItems.length > 0 ? this._userMenuListItems : this._sampleUserMenuItems;
        const item = items[index];

        // Fire custom event
        this.dispatchEvent(new CustomEvent('UserMenuItemClicked', {
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
          if (this._isUserMenuOpen && !this._container?.contains(e.target)) {
            this._closeUserMenu();
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
      clearSelection() {
        this._selectedValue = '';
        const buttons = this._container?.querySelectorAll('.ncn-button');
        if (buttons) {
          buttons.forEach(btn => {
            btn.classList.remove('ncn-active');
            btn.removeAttribute('aria-current');
          });
        }
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }
      }

      closeUserMenu() {
        this._closeUserMenu();
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) {
          // Update active state based on new value
          const buttons = this._container?.querySelectorAll('.ncn-button');
          if (buttons) {
            buttons.forEach(btn => {
              if (btn.dataset.name === this._selectedValue) {
                btn.classList.add('ncn-active');
                btn.setAttribute('aria-current', 'page');
              } else {
                btn.classList.remove('ncn-active');
                btn.removeAttribute('aria-current');
              }
            });
          }
        }
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      // K2 Value property (maps to selectedValue)
      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

      get selectedUserMenuItem() { return this._selectedUserMenuItem; }
      set selectedUserMenuItem(v) {
        this._selectedUserMenuItem = v || '';
      }
      get SelectedUserMenuItem() { return this.selectedUserMenuItem; }
      set SelectedUserMenuItem(v) { this.selectedUserMenuItem = v; }

      get mode() { return this._mode; }
      set mode(v) {
        this._mode = v || '';
        this._processListItems();
        if (this._hasRendered) this._render();
      }
      get Mode() { return this.mode; }
      set Mode(v) { this.mode = v; }

      get title() { return this._title; }
      set title(v) {
        this._title = v || '';
        if (this._hasRendered) this._render();
      }
      get Title() { return this.title; }
      set Title(v) { this.title = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get titleFontSize() { return this._titleFontSize; }
      set titleFontSize(v) {
        this._titleFontSize = parseInt(v) || 18;
        if (this._hasRendered) this._applyStyles();
      }
      get TitleFontSize() { return this.titleFontSize; }
      set TitleFontSize(v) { this.titleFontSize = v; }

      get titleFontWeight() { return this._titleFontWeight; }
      set titleFontWeight(v) {
        this._titleFontWeight = v || '700';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleFontWeight() { return this.titleFontWeight; }
      set TitleFontWeight(v) { this.titleFontWeight = v; }

      get titleFontFamily() { return this._titleFontFamily; }
      set titleFontFamily(v) {
        this._titleFontFamily = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleFontFamily() { return this.titleFontFamily; }
      set TitleFontFamily(v) { this.titleFontFamily = v; }

      get showUserMenu() { return this._showUserMenu; }
      set showUserMenu(v) {
        this._showUserMenu = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowUserMenu() { return this.showUserMenu; }
      set ShowUserMenu(v) { this.showUserMenu = v; }

      get displayName() { return this._displayName; }
      set displayName(v) {
        this._displayName = v || 'User';
        if (this._hasRendered && this._userMenuButton) {
          this._userMenuButton.textContent = this._getInitials(this._displayName);
        }
      }
      get DisplayName() { return this.displayName; }
      set DisplayName(v) { this.displayName = v; }

      get userMenuButtonBackground() { return this._userMenuButtonBackground; }
      set userMenuButtonBackground(v) {
        this._userMenuButtonBackground = v || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuButtonBackground() { return this.userMenuButtonBackground; }
      set UserMenuButtonBackground(v) { this.userMenuButtonBackground = v; }

      get userMenuButtonTextColor() { return this._userMenuButtonTextColor; }
      set userMenuButtonTextColor(v) {
        this._userMenuButtonTextColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuButtonTextColor() { return this.userMenuButtonTextColor; }
      set UserMenuButtonTextColor(v) { this.userMenuButtonTextColor = v; }

      get userMenuButtonBorderColor() { return this._userMenuButtonBorderColor; }
      set userMenuButtonBorderColor(v) {
        this._userMenuButtonBorderColor = v || 'rgba(255, 255, 255, 0.3)';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuButtonBorderColor() { return this.userMenuButtonBorderColor; }
      set UserMenuButtonBorderColor(v) { this.userMenuButtonBorderColor = v; }

      get userMenuButtonSize() { return this._userMenuButtonSize; }
      set userMenuButtonSize(v) {
        this._userMenuButtonSize = parseInt(v) || 40;
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuButtonSize() { return this.userMenuButtonSize; }
      set UserMenuButtonSize(v) { this.userMenuButtonSize = v; }

      get userMenuDropdownBackground() { return this._userMenuDropdownBackground; }
      set userMenuDropdownBackground(v) {
        this._userMenuDropdownBackground = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuDropdownBackground() { return this.userMenuDropdownBackground; }
      set UserMenuDropdownBackground(v) { this.userMenuDropdownBackground = v; }

      get userMenuDropdownTextColor() { return this._userMenuDropdownTextColor; }
      set userMenuDropdownTextColor(v) {
        this._userMenuDropdownTextColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuDropdownTextColor() { return this.userMenuDropdownTextColor; }
      set UserMenuDropdownTextColor(v) { this.userMenuDropdownTextColor = v; }

      get userMenuDropdownHoverColor() { return this._userMenuDropdownHoverColor; }
      set userMenuDropdownHoverColor(v) {
        this._userMenuDropdownHoverColor = v || '#F5F5F5';
        if (this._hasRendered) this._applyStyles();
      }
      get UserMenuDropdownHoverColor() { return this.userMenuDropdownHoverColor; }
      set UserMenuDropdownHoverColor(v) { this.userMenuDropdownHoverColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || 'rgba(255, 255, 255, 0.95)';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get activeColor() { return this._activeColor; }
      set activeColor(v) {
        this._activeColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get ActiveColor() { return this.activeColor; }
      set ActiveColor(v) { this.activeColor = v; }

      get hoverColor() { return this._hoverColor; }
      set hoverColor(v) {
        this._hoverColor = v || 'rgba(255, 255, 255, 0.15)';
        if (this._hasRendered) this._applyStyles();
      }
      get HoverColor() { return this.hoverColor; }
      set HoverColor(v) { this.hoverColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#E0E0E0';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get height() { return this._height; }
      set height(v) {
        this._height = parseInt(v) || 60;
        if (this._hasRendered) this._applyStyles();
      }
      get Height() { return this.height; }
      set Height(v) { this.height = v; }

      get borderRadius() { return this._borderRadius; }
      set borderRadius(v) {
        this._borderRadius = v || '0';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderRadius() { return this.borderRadius; }
      set BorderRadius(v) { this.borderRadius = v; }

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

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }
    });
  }
})();


}
