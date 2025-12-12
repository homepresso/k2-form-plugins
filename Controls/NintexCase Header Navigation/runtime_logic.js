if (!window.__nintexcaseheaderRuntimeLoaded) {
  window.__nintexcaseheaderRuntimeLoaded = true;

/**
 * NintexCase Header Control for K2 SmartForms
 * Complete header with navigation and user menu
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

  if (!window.customElements.get('nintexcase-header')) {
    window.customElements.define('nintexcase-header', class NintexCaseHeader extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data
        this._sampleNavItems = [
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
        this._showTitle = false;
        this._titleColor = '#FFFFFF';
        this._titleFontSize = 20;
        this._titleFontWeight = 700;
        this._showUserMenu = true;
        this._displayName = 'John Doe';
        this._backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this._textColor = 'rgba(255, 255, 255, 0.95)';
        this._activeColor = '#FFFFFF';
        this._hoverColor = 'rgba(255, 255, 255, 0.15)';
        this._height = 60;
        this._fontFamily = 'Poppins, sans-serif';
        this._fontSize = 14;
        this._borderRadius = '0px';
        this._position = 'static';
        this._zIndex = 100;
        this._isVisible = true;
        this._isEnabled = true;
        this._isUserMenuOpen = false;

        // K2 list binding
        this._navListConfig = null;
        this._navListItems = [];
        this._filteredNavItems = [];

        this._userMenuListConfig = null;
        this._userMenuListItems = [];

        // DOM refs
        this._container = null;
        this._userMenuButton = null;
        this._userMenuDropdown = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();

        // Ensure full-width header with no gaps
        this.style.width = '100%';
        this.style.margin = '0';
        this.style.padding = '0';
        this.style.display = 'block';
        this.style.position = this._position;
        this.style.zIndex = this._zIndex;

        // For sticky/fixed positioning, ensure it's at the top
        if (this._position === 'sticky' || this._position === 'fixed') {
          this.style.top = '0';
          this.style.left = '0';
          this.style.right = '0';
        }

        this._hasRendered = true;
        this._processNavItems();
        setTimeout(() => {
          this._render();
          this._addGlobalClickListener();
        }, 0);
      }

      disconnectedCallback() {
        this._removeGlobalClickListener();
      }

      // K2 List Binding Callbacks for Navigation
      listConfigChangedCallback(config, listname) {
        if (listname === 'NavigationList') {
          this._navListConfig = config;
        } else if (listname === 'UserMenuList') {
          this._userMenuListConfig = config;
        }
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const listname = itemsChangedEventArgs?.ListName;
        const items = itemsChangedEventArgs?.NewItems;

        if (listname === 'NavigationList' && items && Array.isArray(items)) {
          this._navListItems = items;
          this._processNavItems();
          if (this._hasRendered) {
            this._render();
          }
        } else if (listname === 'UserMenuList' && items && Array.isArray(items)) {
          this._userMenuListItems = items;
          if (this._hasRendered) {
            this._render();
          }
        }
      }

      _processNavItems() {
        const sourceItems = this._navListItems.length > 0 ? this._navListItems : this._sampleNavItems;
        this._filteredNavItems = sourceItems.filter(item => {
          if (!this._mode || !item.Mode) {
            return true;
          }
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
        this._buildHeader();
        this._applyStyles();
        this._bindEvents();
      }

      _buildHeader() {
        this._container = document.createElement('div');
        this._container.className = 'nch-container';

        // Title (if enabled)
        if (this._showTitle && this._title) {
          const titleElement = document.createElement('div');
          titleElement.className = 'nch-title';
          titleElement.textContent = this._title;
          titleElement.style.color = this._titleColor;
          titleElement.style.fontSize = `${this._titleFontSize}px`;
          titleElement.style.fontWeight = this._titleFontWeight;
          this._container.appendChild(titleElement);
        }

        const nav = document.createElement('nav');
        nav.className = 'nch-nav';
        nav.setAttribute('role', 'navigation');

        // Navigation items
        const navList = document.createElement('ul');
        navList.className = 'nch-nav-list';

        this._filteredNavItems.forEach((item, index) => {
          const name = item.Name || item.name || `Item ${index + 1}`;

          const listItem = document.createElement('li');
          listItem.className = 'nch-nav-item';

          const button = document.createElement('button');
          button.className = 'nch-nav-button';
          button.type = 'button';
          button.textContent = name;
          button.dataset.name = name;
          button.dataset.index = index;

          if (name === this._selectedValue) {
            button.classList.add('nch-active');
            button.setAttribute('aria-current', 'page');
          }

          button.setAttribute('role', 'menuitem');
          button.tabIndex = 0;

          listItem.appendChild(button);
          navList.appendChild(listItem);
        });

        nav.appendChild(navList);
        this._container.appendChild(nav);

        // User menu (if enabled)
        if (this._showUserMenu) {
          const userMenuContainer = document.createElement('div');
          userMenuContainer.className = 'nch-user-menu-container';

          // Avatar button
          this._userMenuButton = document.createElement('button');
          this._userMenuButton.className = 'nch-user-button';
          this._userMenuButton.type = 'button';
          this._userMenuButton.setAttribute('aria-haspopup', 'true');
          this._userMenuButton.setAttribute('aria-expanded', 'false');
          this._userMenuButton.textContent = this._getInitials(this._displayName);

          // Dropdown
          this._userMenuDropdown = document.createElement('div');
          this._userMenuDropdown.className = 'nch-user-dropdown';
          this._userMenuDropdown.setAttribute('role', 'menu');
          this._userMenuDropdown.style.display = 'none';

          const userMenuList = document.createElement('ul');
          userMenuList.className = 'nch-user-menu-list';

          const userMenuItems = this._userMenuListItems.length > 0 ? this._userMenuListItems : this._sampleUserMenuItems;

          userMenuItems.forEach((item, index) => {
            const name = item.Name || item.name || `Item ${index + 1}`;

            const listItem = document.createElement('li');
            listItem.className = 'nch-user-menu-item';

            const menuButton = document.createElement('button');
            menuButton.className = 'nch-user-menu-button';
            menuButton.type = 'button';
            menuButton.textContent = name;
            menuButton.dataset.name = name;
            menuButton.dataset.index = index;
            menuButton.setAttribute('role', 'menuitem');

            listItem.appendChild(menuButton);
            userMenuList.appendChild(listItem);
          });

          this._userMenuDropdown.appendChild(userMenuList);
          userMenuContainer.appendChild(this._userMenuButton);
          userMenuContainer.appendChild(this._userMenuDropdown);
          this._container.appendChild(userMenuContainer);
        }

        this.appendChild(this._container);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--nch-bg', this._backgroundColor);
          this._container.style.setProperty('--nch-text', this._textColor);
          this._container.style.setProperty('--nch-active', this._activeColor);
          this._container.style.setProperty('--nch-hover', this._hoverColor);
          this._container.style.setProperty('--nch-height', `${this._height}px`);
          this._container.style.setProperty('--nch-font-family', this._fontFamily);
          this._container.style.setProperty('--nch-font-size', `${this._fontSize}px`);
          this._container.style.borderRadius = `0 0 ${this._borderRadius} ${this._borderRadius}`;
        }

        // Apply disabled state
        if (this._container) {
          this._container.classList.toggle('nch-disabled', !this._isEnabled);
        }
      }

      _bindEvents() {
        // Navigation items
        const navButtons = this._container?.querySelectorAll('.nch-nav-button');
        if (navButtons) {
          navButtons.forEach(button => {
            button.addEventListener('click', (e) => this._handleNavItemClick(e));
          });
        }

        // User menu button
        if (this._userMenuButton) {
          this._userMenuButton.addEventListener('click', (e) => this._handleUserMenuButtonClick(e));
        }

        // User menu items
        const userMenuButtons = this._userMenuDropdown?.querySelectorAll('.nch-user-menu-button');
        if (userMenuButtons) {
          userMenuButtons.forEach(button => {
            button.addEventListener('click', (e) => this._handleUserMenuItemClick(e));
          });
        }
      }

      _handleNavItemClick(event) {
        if (!this._isEnabled) return;

        const button = event.currentTarget;
        const name = button.dataset.name;
        const index = parseInt(button.dataset.index);

        this._selectedValue = name;

        // Update active state
        const buttons = this._container.querySelectorAll('.nch-nav-button');
        buttons.forEach(btn => {
          btn.classList.remove('nch-active');
          btn.removeAttribute('aria-current');
        });
        button.classList.add('nch-active');
        button.setAttribute('aria-current', 'page');

        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }

        this.dispatchEvent(new CustomEvent('NavigationItemClicked', {
          bubbles: true,
          detail: {
            name: name,
            index: index,
            item: this._filteredNavItems[index]
          }
        }));
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

        this._selectedUserMenuItem = name;
        this._closeUserMenu();

        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedUserMenuItem');
        }

        const items = this._userMenuListItems.length > 0 ? this._userMenuListItems : this._sampleUserMenuItems;
        const item = items[index];

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
          if (this._isUserMenuOpen && this._container && !this._container.contains(e.target)) {
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
        const buttons = this._container?.querySelectorAll('.nch-nav-button');
        if (buttons) {
          buttons.forEach(btn => {
            btn.classList.remove('nch-active');
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
          const buttons = this._container?.querySelectorAll('.nch-nav-button');
          if (buttons) {
            buttons.forEach(btn => {
              if (btn.dataset.name === this._selectedValue) {
                btn.classList.add('nch-active');
                btn.setAttribute('aria-current', 'page');
              } else {
                btn.classList.remove('nch-active');
                btn.removeAttribute('aria-current');
              }
            });
          }
        }
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

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
        this._processNavItems();
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

      get showTitle() { return this._showTitle; }
      set showTitle(v) {
        this._showTitle = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowTitle() { return this.showTitle; }
      set ShowTitle(v) { this.showTitle = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#FFFFFF';
        if (this._hasRendered) this._render();
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get titleFontSize() { return this._titleFontSize; }
      set titleFontSize(v) {
        this._titleFontSize = parseInt(v) || 20;
        if (this._hasRendered) this._render();
      }
      get TitleFontSize() { return this.titleFontSize; }
      set TitleFontSize(v) { this.titleFontSize = v; }

      get titleFontWeight() { return this._titleFontWeight; }
      set titleFontWeight(v) {
        this._titleFontWeight = parseInt(v) || 700;
        if (this._hasRendered) this._render();
      }
      get TitleFontWeight() { return this.titleFontWeight; }
      set TitleFontWeight(v) { this.titleFontWeight = v; }

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

      get height() { return this._height; }
      set height(v) {
        this._height = parseInt(v) || 60;
        if (this._hasRendered) this._applyStyles();
      }
      get Height() { return this.height; }
      set Height(v) { this.height = v; }

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

      get borderRadius() { return this._borderRadius; }
      set borderRadius(v) {
        this._borderRadius = v || '0px';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderRadius() { return this.borderRadius; }
      set BorderRadius(v) { this.borderRadius = v; }

      get position() { return this._position; }
      set position(v) {
        this._position = v || 'static';
        this.style.position = this._position;
        if (this._position === 'sticky' || this._position === 'fixed') {
          this.style.top = '0';
          this.style.left = '0';
          this.style.right = '0';
        } else {
          this.style.top = '';
          this.style.left = '';
          this.style.right = '';
        }
      }
      get Position() { return this.position; }
      set Position(v) { this.position = v; }

      get zIndex() { return this._zIndex; }
      set zIndex(v) {
        this._zIndex = parseInt(v) || 100;
        this.style.zIndex = this._zIndex;
      }
      get ZIndex() { return this.zIndex; }
      set ZIndex(v) { this.zIndex = v; }

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
