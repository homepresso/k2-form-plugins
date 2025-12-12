if (!window.__nintexcaseusermenuDesigntimeLoaded) {
  window.__nintexcaseusermenuDesigntimeLoaded = true;

/**
 * NintexCase User Menu Control - Design Time Logic
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-user-menu')) {
    window.customElements.define('nintexcase-user-menu', class extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for design time preview
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

        this._container = null;
        this._button = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
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
      }

      _buildMenu() {
        this._container = document.createElement('div');
        this._container.className = 'ncum-container';

        // Avatar button (no dropdown in design time)
        this._button = document.createElement('button');
        this._button.className = 'ncum-button';
        this._button.type = 'button';
        this._button.textContent = this._getInitials(this._displayName);

        this._container.appendChild(this._button);
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
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

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
      }
    });
  }
})();


}
