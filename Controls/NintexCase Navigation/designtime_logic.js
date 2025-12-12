if (!window.__nintexcasenavigationDesigntimeLoaded) {
  window.__nintexcasenavigationDesigntimeLoaded = true;

/**
 * NintexCase Navigation Control - Design Time Logic
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-navigation-designtime')) {
    window.customElements.define('nintexcase-navigation-designtime', class extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for design time preview - showcasing mode filtering
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

        // Properties
        this._selectedValue = '';
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

        this._container = null;
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

      connectedCallback() {
        if (this._hasRendered) return;
        this._hasRendered = true;
        setTimeout(() => {
          this._render();
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildNav();
        this._applyStyles();
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

        const nav = document.createElement('nav');
        nav.className = 'ncn-nav';

        const navList = document.createElement('ul');
        navList.className = 'ncn-list';

        // Filter items based on current mode (same logic as runtime)
        const filteredItems = this._sampleItems.filter(item => {
          // If no mode filter or item has no Mode field, include it
          if (!this._mode || !item.Mode) {
            return true;
          }
          // Otherwise, check if item's Mode matches current mode
          return item.Mode === this._mode;
        });

        filteredItems.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'ncn-item';

          const button = document.createElement('button');
          button.className = 'ncn-button';
          button.type = 'button';
          button.textContent = item.Name;

          if (index === 0 || item.Name === this._selectedValue) {
            button.classList.add('ncn-active');
          }

          listItem.appendChild(button);
          navList.appendChild(listItem);
        });

        nav.appendChild(navList);
        this._container.appendChild(nav);

        // User menu (if enabled)
        if (this._showUserMenu) {
          const userMenuContainer = document.createElement('div');
          userMenuContainer.className = 'ncn-user-menu-container';

          const userButton = document.createElement('button');
          userButton.className = 'ncn-user-button';
          userButton.type = 'button';
          userButton.textContent = this._getInitials(this._displayName);

          userMenuContainer.appendChild(userButton);
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
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) this._render();
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

      get mode() { return this._mode; }
      set mode(v) {
        this._mode = v || '';
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
        if (this._hasRendered) this._render();
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
      }
    });
  }
})();


}
