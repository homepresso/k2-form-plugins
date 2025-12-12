if (!window.__nintexcasequickactionsDesigntimeLoaded) {
  window.__nintexcasequickactionsDesigntimeLoaded = true;

/**
 * NintexCase Quick Actions Control - Design Time Logic
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-quick-actions')) {
    window.customElements.define('nintexcase-quick-actions', class extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for design time preview
        this._sampleItems = [
          { Title: 'Create Case', Description: 'Start a new case', Icon: 'add', IconBackground: '#4285F4' },
          { Title: 'My Tasks', Description: '12 pending', Icon: 'assignment', IconBackground: '#FF6F00' },
          { Title: 'Reports', Description: 'View analytics', Icon: 'bar_chart', IconBackground: '#9C27B0' },
          { Title: 'Team Queue', Description: '8 unassigned', Icon: 'group', IconBackground: '#66BB6A' }
        ];

        // Properties
        this._selectedValue = '';
        this._title = 'Quick Actions';
        this._columns = 4;
        this._cardBackground = '#FFFFFF';
        this._cardBorderColor = '#E0E0E0';
        this._cardBorderRadius = '12px';
        this._titleColor = '#1C1B1F';
        this._cardTitleColor = '#1C1B1F';
        this._cardDescriptionColor = '#666666';
        this._iconSize = 48;
        this._gap = 16;
        this._fontFamily = 'Roboto, sans-serif';
        this._isVisible = true;

        this._container = null;
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
        this._buildCards();
        this._applyStyles();
      }

      _buildCards() {
        this._container = document.createElement('div');
        this._container.className = 'ncqa-container';

        // Section title
        if (this._title) {
          const titleEl = document.createElement('h2');
          titleEl.className = 'ncqa-title';
          titleEl.textContent = this._title;
          this._container.appendChild(titleEl);
        }

        // Cards grid
        const grid = document.createElement('div');
        grid.className = 'ncqa-grid';

        this._sampleItems.forEach((item, index) => {
          const card = document.createElement('div');
          card.className = 'ncqa-card';

          // Icon container
          const iconContainer = document.createElement('div');
          iconContainer.className = 'ncqa-icon-container';
          iconContainer.style.background = item.IconBackground;

          const iconEl = document.createElement('span');
          iconEl.className = 'material-icons ncqa-icon';
          iconEl.textContent = item.Icon;
          iconContainer.appendChild(iconEl);

          // Text content
          const content = document.createElement('div');
          content.className = 'ncqa-content';

          const cardTitle = document.createElement('div');
          cardTitle.className = 'ncqa-card-title';
          cardTitle.textContent = item.Title;

          const cardDesc = document.createElement('div');
          cardDesc.className = 'ncqa-card-description';
          cardDesc.textContent = item.Description;

          content.appendChild(cardTitle);
          content.appendChild(cardDesc);

          card.appendChild(iconContainer);
          card.appendChild(content);
          grid.appendChild(card);
        });

        this._container.appendChild(grid);
        this.appendChild(this._container);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--ncqa-card-bg', this._cardBackground);
          this._container.style.setProperty('--ncqa-card-border', this._cardBorderColor);
          this._container.style.setProperty('--ncqa-card-radius', this._cardBorderRadius);
          this._container.style.setProperty('--ncqa-title-color', this._titleColor);
          this._container.style.setProperty('--ncqa-card-title-color', this._cardTitleColor);
          this._container.style.setProperty('--ncqa-card-desc-color', this._cardDescriptionColor);
          this._container.style.setProperty('--ncqa-icon-size', `${this._iconSize}px`);
          this._container.style.setProperty('--ncqa-gap', `${this._gap}px`);
          this._container.style.setProperty('--ncqa-columns', this._columns);
          this._container.style.setProperty('--ncqa-font-family', this._fontFamily);
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

      get title() { return this._title; }
      set title(v) {
        this._title = v || 'Quick Actions';
        if (this._hasRendered) this._render();
      }
      get Title() { return this.title; }
      set Title(v) { this.title = v; }

      get columns() { return this._columns; }
      set columns(v) {
        this._columns = parseInt(v) || 4;
        if (this._columns < 1) this._columns = 1;
        if (this._columns > 6) this._columns = 6;
        if (this._hasRendered) this._applyStyles();
      }
      get Columns() { return this.columns; }
      set Columns(v) { this.columns = v; }

      get cardBackground() { return this._cardBackground; }
      set cardBackground(v) {
        this._cardBackground = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get CardBackground() { return this.cardBackground; }
      set CardBackground(v) { this.cardBackground = v; }

      get cardBorderColor() { return this._cardBorderColor; }
      set cardBorderColor(v) {
        this._cardBorderColor = v || '#E0E0E0';
        if (this._hasRendered) this._applyStyles();
      }
      get CardBorderColor() { return this.cardBorderColor; }
      set CardBorderColor(v) { this.cardBorderColor = v; }

      get cardBorderRadius() { return this._cardBorderRadius; }
      set cardBorderRadius(v) {
        this._cardBorderRadius = v || '12px';
        if (this._hasRendered) this._applyStyles();
      }
      get CardBorderRadius() { return this.cardBorderRadius; }
      set CardBorderRadius(v) { this.cardBorderRadius = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get cardTitleColor() { return this._cardTitleColor; }
      set cardTitleColor(v) {
        this._cardTitleColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get CardTitleColor() { return this.cardTitleColor; }
      set CardTitleColor(v) { this.cardTitleColor = v; }

      get cardDescriptionColor() { return this._cardDescriptionColor; }
      set cardDescriptionColor(v) {
        this._cardDescriptionColor = v || '#666666';
        if (this._hasRendered) this._applyStyles();
      }
      get CardDescriptionColor() { return this.cardDescriptionColor; }
      set CardDescriptionColor(v) { this.cardDescriptionColor = v; }

      get iconSize() { return this._iconSize; }
      set iconSize(v) {
        this._iconSize = parseInt(v) || 48;
        if (this._hasRendered) this._applyStyles();
      }
      get IconSize() { return this.iconSize; }
      set IconSize(v) { this.iconSize = v; }

      get gap() { return this._gap; }
      set gap(v) {
        this._gap = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
      }
      get Gap() { return this.gap; }
      set Gap(v) { this.gap = v; }

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
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return true; }
      set IsEnabled(val) { }
    });
  }
})();


}
