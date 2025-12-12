if (!window.__nintexcasequickactionsRuntimeLoaded) {
  window.__nintexcasequickactionsRuntimeLoaded = true;

/**
 * NintexCase Quick Actions Control for K2 SmartForms
 * Card-based quick actions with icons and K2 list binding
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

  // Load Material Icons
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="fonts.googleapis.com/icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('nintexcase-quick-actions')) {
    window.customElements.define('nintexcase-quick-actions', class NintexCaseQuickActions extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for preview/testing
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
        this._fontFamily = 'Poppins, sans-serif';
        this._isVisible = true;
        this._isEnabled = true;

        // K2 list binding
        this._listConfig = null;
        this._listItems = [];

        // DOM refs
        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        loadMaterialIcons();
        this._hasRendered = true;
        setTimeout(() => {
          this._render();
        }, 0);
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

      _render() {
        this.innerHTML = '';
        this._buildCards();
        this._applyStyles();
        this._bindEvents();
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

        // Use list items or sample data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;

        items.forEach((item, index) => {
          const title = item.Title || item.title || `Card ${index + 1}`;
          const description = item.Description || item.description || '';
          const icon = item.Icon || item.icon || 'stars';
          const iconBg = item.IconBackground || item.iconBackground || '#4285F4';

          const card = document.createElement('div');
          card.className = 'ncqa-card';
          card.dataset.title = title;
          card.dataset.index = index;

          // Icon container
          const iconContainer = document.createElement('div');
          iconContainer.className = 'ncqa-icon-container';
          iconContainer.style.background = iconBg;

          const iconEl = document.createElement('span');
          iconEl.className = 'material-icons ncqa-icon';
          iconEl.textContent = icon;
          iconContainer.appendChild(iconEl);

          // Text content
          const content = document.createElement('div');
          content.className = 'ncqa-content';

          const cardTitle = document.createElement('div');
          cardTitle.className = 'ncqa-card-title';
          cardTitle.textContent = title;

          const cardDesc = document.createElement('div');
          cardDesc.className = 'ncqa-card-description';
          cardDesc.textContent = description;

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

        // Apply disabled state
        if (this._container) {
          this._container.classList.toggle('ncqa-disabled', !this._isEnabled);
        }
      }

      _bindEvents() {
        const cards = this._container?.querySelectorAll('.ncqa-card');
        if (!cards) return;

        cards.forEach(card => {
          card.addEventListener('click', (e) => this._handleCardClick(e));
          card.addEventListener('keydown', (e) => this._handleKeyDown(e));
        });
      }

      _handleCardClick(event) {
        if (!this._isEnabled) return;

        const card = event.currentTarget;
        const title = card.dataset.title;
        const index = parseInt(card.dataset.index);

        // Update selected value
        this._selectedValue = title;

        // Update active state
        const cards = this._container.querySelectorAll('.ncqa-card');
        cards.forEach(c => c.classList.remove('ncqa-active'));
        card.classList.add('ncqa-active');

        // Raise property changed event for K2
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }

        // Get the item data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;
        const item = items[index];

        // Fire custom event
        this.dispatchEvent(new CustomEvent('CardClicked', {
          bubbles: true,
          detail: {
            title: title,
            index: index,
            item: item
          }
        }));
      }

      _handleKeyDown(event) {
        if (!this._isEnabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this._handleCardClick(event);
        }
      }

      // Public Methods
      clearSelection() {
        this._selectedValue = '';
        const cards = this._container?.querySelectorAll('.ncqa-card');
        if (cards) {
          cards.forEach(card => card.classList.remove('ncqa-active'));
        }
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) {
          const cards = this._container?.querySelectorAll('.ncqa-card');
          if (cards) {
            cards.forEach(card => {
              if (card.dataset.title === this._selectedValue) {
                card.classList.add('ncqa-active');
              } else {
                card.classList.remove('ncqa-active');
              }
            });
          }
        }
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

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }
    });
  }
})();


}
