if (!window.__nintexcaseheaderDesigntimeLoaded) {
  window.__nintexcaseheaderDesigntimeLoaded = true;

/**
 * NintexCase Header Navigation Control - Design Time Logic
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-header')) {
    window.customElements.define('nintexcase-header', class extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data
        this._sampleNavItems = [
          { Name: 'Dashboard', Mode: '' },
          { Name: 'My Cases', Mode: '' },
          { Name: 'Documents', Mode: '' },
          { Name: 'Reports', Mode: '' }
        ];

        // Properties
        this._selectedValue = 'Documents';
        this._mode = '';
        this._title = 'Case Manager';
        this._showTitle = true;
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
        this._isVisible = true;

        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;

        // Ensure full-width header with no gaps
        this.style.width = '100%';
        this.style.margin = '0';
        this.style.padding = '0';
        this.style.display = 'block';

        this._hasRendered = true;
        setTimeout(() => {
          this._render();
        }, 0);
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

        const navList = document.createElement('ul');
        navList.className = 'nch-nav-list';

        // Filter items based on mode
        const filteredItems = this._sampleNavItems.filter(item => {
          if (!this._mode || !item.Mode) return true;
          return item.Mode === this._mode;
        });

        filteredItems.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'nch-nav-item';

          const button = document.createElement('button');
          button.className = 'nch-nav-button';
          button.type = 'button';
          button.textContent = item.Name;

          if (item.Name === this._selectedValue) {
            button.classList.add('nch-active');
          }

          listItem.appendChild(button);
          navList.appendChild(listItem);
        });

        nav.appendChild(navList);
        this._container.appendChild(nav);

        // User menu
        if (this._showUserMenu) {
          const userMenuContainer = document.createElement('div');
          userMenuContainer.className = 'nch-user-menu-container';

          const userButton = document.createElement('button');
          userButton.className = 'nch-user-button';
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
          this._container.style.setProperty('--nch-bg', this._backgroundColor);
          this._container.style.setProperty('--nch-text', this._textColor);
          this._container.style.setProperty('--nch-active', this._activeColor);
          this._container.style.setProperty('--nch-hover', this._hoverColor);
          this._container.style.setProperty('--nch-height', `${this._height}px`);
          this._container.style.setProperty('--nch-font-family', this._fontFamily);
          this._container.style.setProperty('--nch-font-size', `${this._fontSize}px`);
          this._container.style.borderRadius = `0 0 ${this._borderRadius} ${this._borderRadius}`;
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
        if (this._hasRendered) this._render();
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

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return true; }
      set IsEnabled(val) { }
    });
  }
})();


}
