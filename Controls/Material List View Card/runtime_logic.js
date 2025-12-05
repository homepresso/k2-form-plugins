if (!window.__materiallistviewcardRuntimeLoaded) {
  window.__materiallistviewcardRuntimeLoaded = true;

/**
 * Material List View Card Control for K2 SmartForms
 * Material 3 Design card view for displaying data with various layouts
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
    if (document.querySelector('link[href*="Material+Icons"], link[href*="material-icons"]')) return;
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

  // Font loading state management
  let fontsLoaded = false;
  let fontsLoadPromise = null;
  const pendingInstances = [];

  // Load fonts with simple approach
  function loadFonts() {
    // Load fonts immediately (non-blocking)
    loadMaterialIcons();
    loadGoogleFonts();

    if (fontsLoaded) return Promise.resolve();
    if (fontsLoadPromise) return fontsLoadPromise;

    fontsLoadPromise = new Promise((resolve) => {
      // Use a short timeout to let fonts start loading
      setTimeout(() => {
        fontsLoaded = true;
        resolve();
        // Notify pending instances
        pendingInstances.forEach(fn => fn());
        pendingInstances.length = 0;
      }, 100);
    });

    return fontsLoadPromise;
  }

  function onFontsReady(callback) {
    if (fontsLoaded) {
      callback();
    } else {
      pendingInstances.push(callback);
    }
  }

  // Use K2BaseControl if available, fallback to HTMLElement
  const BaseClass = window.K2BaseControl || HTMLElement;

  if (!window.customElements.get('material-list-view-card')) {
    window.customElements.define('material-list-view-card', class MaterialListViewCard extends BaseClass {

      constructor() {
        super();
        this._hasRendered = false;
        this._fontsReady = false;
        this._pendingRender = false;

        // Properties
        this._variant = 'elevated'; // elevated, filled, outlined
        this._layout = 'vertical'; // vertical, horizontal, grid
        this._columns = '2';
        this._selectedValue = '';
        this._clickable = true;
        this._showImage = true;
        this._imageHeight = '200';
        this._showActions = true;
        this._cardGap = '16';

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '#FFFBFE';
        this._surfaceColor = '#F7F2FA';
        this._borderColor = '#CAC4D0';
        this._titleColor = '#1C1B1F';
        this._subtitleColor = '#49454F';
        this._descriptionColor = '#49454F';

        this._fontFamily = 'Roboto, sans-serif';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed items
        this._parsedItems = [];

        // DOM refs
        this._container = null;

        // K2 List binding
        this._listConfig = { partmappings: {} };
        this._dataItems = [];

        // Initial data for design-time fallback
        this._initialListValue = '[{"image": "https://picsum.photos/300/200?random=1", "title": "Card Title 1", "subtitle": "Card Subtitle", "description": "Supporting text for the card content", "value": "card1", "action": "Learn More"},{"image": "https://picsum.photos/300/200?random=2", "title": "Card Title 2", "subtitle": "Card Subtitle", "description": "Supporting text for the card content", "value": "card2", "action": "Learn More"}]';
      }

      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        if (this._hasRendered) return;

        // Render container immediately
        this._renderContainer();
        this._hasRendered = true;

        // Load fonts and render list when ready
        loadFonts().then(() => {
          this._fontsReady = true;
          // Process any data that arrived before fonts were ready
          if (this._parsedItems.length > 0 || this._pendingRender) {
            this._renderCards();
          } else {
            // Process initial data
            this._parseItems();
            this._renderCards();
          }
        }).catch(err => {
          console.warn('Font loading issue:', err);
          // Render anyway after timeout
          this._fontsReady = true;
          this._parseItems();
          this._renderCards();
        });
      }

      _renderContainer() {
        this.innerHTML = '';
        this._container = document.createElement('div');
        this._container.className = `mlvc-container mlvc-${this._layout} mlvc-${this._variant}`;
        this._container.setAttribute('role', 'group');
        this._container.setAttribute('aria-label', 'Card list');
        this.appendChild(this._container);
        this._applyStyles();
      }

      _parseItems() {
        this._parsedItems = [];
        // Data is populated via K2 list binding through listItemsChangedCallback
        // and processed by _processDataItems - nothing to parse here
      }

      _render() {
        // Full re-render (when already rendered)
        if (!this._container) {
          this._renderContainer();
        }
        this._renderCards();
      }

      _renderCards() {
        if (!this._container) return;

        // Clear existing items
        this._container.innerHTML = '';
        this._container.className = `mlvc-container mlvc-${this._layout} mlvc-${this._variant}`;

        this._parsedItems.forEach((item, index) => {
          const card = document.createElement('div');
          card.className = 'mlvc-card';
          card.setAttribute('role', 'article');
          card.setAttribute('data-value', item.value);
          card.setAttribute('tabindex', this._clickable ? '0' : '-1');
          card.setAttribute('aria-label', item.title);

          if (this._selectedValue === item.value) {
            card.classList.add('mlvc-selected');
            card.setAttribute('aria-selected', 'true');
          }

          // Image
          if (this._showImage && item.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'mlvc-image';
            imageContainer.setAttribute('role', 'img');
            imageContainer.setAttribute('aria-label', item.title);

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.loading = 'lazy';
            imageContainer.appendChild(img);

            card.appendChild(imageContainer);
          }

          // Content
          const content = document.createElement('div');
          content.className = 'mlvc-content';

          // Title
          if (item.title) {
            const title = document.createElement('h3');
            title.className = 'mlvc-title';
            title.textContent = item.title;
            content.appendChild(title);
          }

          // Subtitle
          if (item.subtitle) {
            const subtitle = document.createElement('div');
            subtitle.className = 'mlvc-subtitle';
            subtitle.textContent = item.subtitle;
            content.appendChild(subtitle);
          }

          // Description
          if (item.description) {
            const description = document.createElement('div');
            description.className = 'mlvc-description';
            description.textContent = item.description;
            content.appendChild(description);
          }

          card.appendChild(content);

          // Actions
          if (this._showActions && item.action) {
            const actions = document.createElement('div');
            actions.className = 'mlvc-actions';

            const actionBtn = document.createElement('button');
            actionBtn.className = 'mlvc-action-btn';
            actionBtn.type = 'button';
            actionBtn.textContent = item.action;
            actionBtn.setAttribute('aria-label', `${item.action} for ${item.title}`);
            actionBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (!this._isEnabled) return;
              this._handleActionClick(item, e);
            });

            actions.appendChild(actionBtn);
            card.appendChild(actions);
          }

          // State layer
          const stateLayer = document.createElement('div');
          stateLayer.className = 'mlvc-state-layer';
          card.appendChild(stateLayer);

          this._container.appendChild(card);
        });

        this._updateState();
        this._applyStyles();
        this._bindEvents();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--mlvc-primary', this._primaryColor);
          this._container.style.setProperty('--mlvc-background', this._backgroundColor);
          this._container.style.setProperty('--mlvc-surface', this._surfaceColor);
          this._container.style.setProperty('--mlvc-border', this._borderColor);
          this._container.style.setProperty('--mlvc-title', this._titleColor);
          this._container.style.setProperty('--mlvc-subtitle', this._subtitleColor);
          this._container.style.setProperty('--mlvc-description', this._descriptionColor);
          this._container.style.setProperty('--mlvc-gap', this._cardGap + 'px');
          this._container.style.setProperty('--mlvc-image-height', this._imageHeight + 'px');

          // Set grid columns
          if (this._layout === 'grid') {
            const cols = Math.max(1, Math.min(4, parseInt(this._columns) || 2));
            this._container.style.setProperty('--mlvc-columns', cols);
          }
        }
      }

      _bindEvents() {
        const cards = this._container.querySelectorAll('.mlvc-card');
        cards.forEach(card => {
          card.addEventListener('click', (e) => {
            // Don't trigger if clicking action button
            if (e.target.closest('.mlvc-action-btn')) return;
            if (!this._isEnabled || !this._clickable) return;
            const value = card.getAttribute('data-value');
            this._selectCard(value);
          });

          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!this._isEnabled || !this._clickable) return;
              const value = card.getAttribute('data-value');
              this._selectCard(value);
            }
          });
        });
      }

      _selectCard(value) {
        this._selectedValue = value;

        // Update selection state
        const cards = this._container.querySelectorAll('.mlvc-card');
        cards.forEach(card => {
          const cardValue = card.getAttribute('data-value');
          const isSelected = cardValue === value;
          card.classList.toggle('mlvc-selected', isSelected);
          card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });

        safeRaisePropertyChanged(this, 'selectedValue');
        this.dispatchEvent(new CustomEvent('CardClicked', {
          bubbles: true,
          detail: { value, item: this._parsedItems.find(i => i.value === value) }
        }));
      }

      _handleActionClick(item, event) {
        this.dispatchEvent(new CustomEvent('ActionClicked', {
          bubbles: true,
          detail: {
            value: item.value,
            action: item.action,
            item: item
          }
        }));
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('mlvc-disabled', !this._isEnabled);
      }

      // List property getter/setter for K2 data binding
      get List() {
        return this._dataItems;
      }

      set List(value) {
        // Handle JSON string (from initial value or direct assignment)
        if (typeof value === 'string' && value.trim()) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              this._dataItems = parsed;
              this._processDataItems();
              return;
            }
          } catch (e) {
            console.warn('[Material List View Card] Failed to parse List value as JSON:', e);
          }
        }

        // Handle array directly
        if (Array.isArray(value)) {
          this._dataItems = value;
          this._processDataItems();
          return;
        }

        // Handle K2 list object with items property
        if (value && typeof value === 'object' && Array.isArray(value.items)) {
          this._dataItems = value.items;
          this._processDataItems();
          return;
        }
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const isDesignTime = window.K2?.IsDesigner === true;
        let itemsToProcess = itemsChangedEventArgs?.NewItems;

        // Fallback: If at design time and we receive 0 items, use initial value
        if (isDesignTime && (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0)) {
          try {
            const fallbackItems = JSON.parse(this._initialListValue);
            if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
              itemsToProcess = fallbackItems;
            }
          } catch (error) {
            console.warn('[Material List View Card] Error parsing fallback initial value:', error);
          }
        }

        if (Array.isArray(itemsToProcess)) {
          this._dataItems = itemsToProcess;
          this._processDataItems();
        } else {
          console.warn('[Material List View Card] NewItems is not an array:', itemsChangedEventArgs);
        }
      }

      _processDataItems() {
        // Use initial value as fallback if no data
        if (!this._dataItems || this._dataItems.length === 0) {
          try {
            this._dataItems = JSON.parse(this._initialListValue);
          } catch (e) {
            this._dataItems = [];
          }
        }

        if (!this._dataItems || this._dataItems.length === 0) {
          console.log('[Material List View Card] No data items to process');
          return;
        }

        // Get field mappings from K2 config
        const mappings = this._listConfig?.partmappings || {};

        // Helper function to get field value with fallbacks
        const getFieldValue = (item, mappedProp, ...fallbacks) => {
          // First try the K2-mapped property
          if (mappedProp && item[mappedProp] !== undefined) {
            return item[mappedProp];
          }
          // Then try fallback property names
          for (const prop of fallbacks) {
            if (item[prop] !== undefined) {
              return item[prop];
            }
          }
          return '';
        };

        const imageProp = mappings['Image'];
        const titleProp = mappings['Title'];
        const subtitleProp = mappings['Subtitle'];
        const descriptionProp = mappings['Description'];
        const valueProp = mappings['Value'];
        const actionProp = mappings['Action'];

        // Convert K2 data items to card items
        this._parsedItems = this._dataItems.map((item, index) => {
          const parsed = {
            image: getFieldValue(item, imageProp, 'image', 'Image', 'img', 'imageUrl', 'ImageUrl'),
            title: getFieldValue(item, titleProp, 'title', 'Title', 'name', 'Name', 'text', 'Text'),
            subtitle: getFieldValue(item, subtitleProp, 'subtitle', 'Subtitle', 'subheader', 'Subheader'),
            description: getFieldValue(item, descriptionProp, 'description', 'Description', 'content', 'Content', 'body', 'Body'),
            value: String(getFieldValue(item, valueProp, 'value', 'Value', 'id', 'ID') || getFieldValue(item, titleProp, 'title', 'Title') || index),
            action: getFieldValue(item, actionProp, 'action', 'Action', 'button', 'Button', 'actionText', 'ActionText')
          };
          return parsed;
        });

        if (this._hasRendered) {
          if (this._fontsReady) {
            this._renderCards();
          } else {
            this._pendingRender = true;
            loadFonts().then(() => {
              this._fontsReady = true;
              if (this._pendingRender) {
                this._pendingRender = false;
                this._renderCards();
              }
            });
          }
        }
      }

      // Properties
      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['elevated', 'filled', 'outlined'];
        this._variant = valid.includes(v) ? v : 'elevated';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get layout() { return this._layout; }
      set layout(v) {
        const valid = ['vertical', 'horizontal', 'grid'];
        this._layout = valid.includes(v) ? v : 'vertical';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'layout');
      }
      get Layout() { return this.layout; }
      set Layout(v) { this.layout = v; }

      get columns() { return this._columns; }
      set columns(v) {
        this._columns = v || '2';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'columns');
      }
      get Columns() { return this.columns; }
      set Columns(v) { this.columns = v; }

      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) {
          const cards = this._container?.querySelectorAll('.mlvc-card');
          cards?.forEach(card => {
            const cardValue = card.getAttribute('data-value');
            const isSelected = cardValue === this._selectedValue;
            card.classList.toggle('mlvc-selected', isSelected);
            card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          });
        }
        safeRaisePropertyChanged(this, 'selectedValue');
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get clickable() { return this._clickable; }
      set clickable(v) {
        this._clickable = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'clickable');
      }
      get Clickable() { return this.clickable; }
      set Clickable(v) { this.clickable = v; }

      get showImage() { return this._showImage; }
      set showImage(v) {
        this._showImage = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showImage');
      }
      get ShowImage() { return this.showImage; }
      set ShowImage(v) { this.showImage = v; }

      get imageHeight() { return this._imageHeight; }
      set imageHeight(v) {
        this._imageHeight = v || '200';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'imageHeight');
      }
      get ImageHeight() { return this.imageHeight; }
      set ImageHeight(v) { this.imageHeight = v; }

      get showActions() { return this._showActions; }
      set showActions(v) {
        this._showActions = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showActions');
      }
      get ShowActions() { return this.showActions; }
      set ShowActions(v) { this.showActions = v; }

      get cardGap() { return this._cardGap; }
      set cardGap(v) {
        this._cardGap = v || '16';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'cardGap');
      }
      get CardGap() { return this.cardGap; }
      set CardGap(v) { this.cardGap = v; }

      // Color properties
      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'backgroundColor');
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#F7F2FA';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'surfaceColor');
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#CAC4D0';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'titleColor');
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get subtitleColor() { return this._subtitleColor; }
      set subtitleColor(v) {
        this._subtitleColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'subtitleColor');
      }
      get SubtitleColor() { return this.subtitleColor; }
      set SubtitleColor(v) { this.subtitleColor = v; }

      get descriptionColor() { return this._descriptionColor; }
      set descriptionColor(v) {
        this._descriptionColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'descriptionColor');
      }
      get DescriptionColor() { return this.descriptionColor; }
      set DescriptionColor(v) { this.descriptionColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontFamily');
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
        this._updateState();
      }

      // Methods
      clearSelection() {
        this._selectedValue = '';
        const cards = this._container?.querySelectorAll('.mlvc-card');
        cards?.forEach(card => {
          card.classList.remove('mlvc-selected');
          card.setAttribute('aria-selected', 'false');
        });
        safeRaisePropertyChanged(this, 'selectedValue');
      }
    });
  }
})();


}
