/**
 * Card List Control for K2 SmartForms
 * Material 3 Design with comprehensive card options
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

  // Badge color mapping
  const BADGE_COLORS = {
    'active': { bg: '#E8F5E9', text: '#2E7D32' },
    'pending': { bg: '#FFF3E0', text: '#E65100' },
    'completed': { bg: '#E3F2FD', text: '#1565C0' },
    'cancelled': { bg: '#FFEBEE', text: '#C62828' },
    'draft': { bg: '#F5F5F5', text: '#616161' },
    'new': { bg: '#E8EAF6', text: '#3949AB' },
    'urgent': { bg: '#FCE4EC', text: '#AD1457' },
    'default': { bg: '#F3E5F5', text: '#7B1FA2' }
  };

  const BaseClass = window.K2BaseControl || HTMLElement;

  if (!window.customElements.get('card-list')) {
    window.customElements.define('card-list', class CardListControl extends BaseClass {

      constructor() {
        super();

        this._hasRendered = false;
        this._listConfig = { partmappings: {} };
        this._dataItems = [];
        this._cards = [];
        this._selectedIndices = new Set();

        // Properties
        this._selectedValue = '';
        this._selectedIndex = -1;
        this._layout = 'grid';
        this._columns = 3;
        this._cardStyle = 'elevated';
        this._cardWidth = 0;
        this._cardHeight = 0;
        this._imagePosition = 'top';
        this._imageHeight = 160;
        this._imageAspectRatio = '16:9';
        this._showTitle = true;
        this._showSubtitle = true;
        this._showDescription = true;
        this._showBadge = true;
        this._showMeta = true;
        this._showActions = false;
        this._actionLabels = 'View,Edit';
        this._descriptionLines = 3;
        this._selectable = true;
        this._multiSelect = false;
        this._hoverEffect = 'lift';
        this._borderRadius = 16;
        this._gap = 16;
        this._primaryColor = '#6750A4';
        this._backgroundColor = '';
        this._textColor = '';
        this._showAvatar = false;
        this._avatarStyle = 'circle';
        this._emptyMessage = 'No items to display';
        this._maxItems = 0;
        this._isVisible = true;
        this._isEnabled = true;

        // Initial data
        this._initialListValue = '[{"title": "Project Alpha", "subtitle": "Marketing Campaign", "description": "A comprehensive marketing initiative targeting new demographics.", "image": "", "badge": "Active", "meta": "Updated 2 hours ago"}, {"title": "Project Beta", "subtitle": "Product Launch", "description": "New product release scheduled for Q4 with full market coverage.", "image": "", "badge": "Pending", "meta": "Updated yesterday"}, {"title": "Project Gamma", "subtitle": "Infrastructure", "description": "System upgrade and modernization of legacy infrastructure.", "image": "", "badge": "Completed", "meta": "Updated 3 days ago"}]';

        // DOM refs
        this._container = null;
        this._cardContainer = null;
      }

      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        if (this._hasRendered) return;

        loadMaterialIcons();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      // K2 List API Methods
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
        this._processDataItems();
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const isDesignTime = window.K2?.IsDesigner === true;
        let itemsToProcess = itemsChangedEventArgs.NewItems;

        if (isDesignTime && (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0)) {
          try {
            itemsToProcess = JSON.parse(this._initialListValue);
          } catch (e) {
            console.error('[Card List] Error parsing fallback:', e);
          }
        }

        if (Array.isArray(itemsToProcess)) {
          this._dataItems = itemsToProcess;
          this._processDataItems();
        }
      }

      _processDataItems() {
        this._cards = [];

        if (!Array.isArray(this._dataItems) || this._dataItems.length === 0) {
          try {
            this._dataItems = JSON.parse(this._initialListValue);
          } catch (e) {
            this._dataItems = [];
          }
        }

        // Get field mappings
        const mappings = this._listConfig?.partmappings || {};
        const titleProp = mappings['Title'] || mappings['Display'] || 'title';
        const subtitleProp = mappings['Subtitle'] || 'subtitle';
        const descProp = mappings['Description'] || 'description';
        const imageProp = mappings['Image'] || 'image';
        const badgeProp = mappings['Badge'] || mappings['Status'] || 'badge';
        const metaProp = mappings['Meta'] || 'meta';
        const valueProp = mappings['Value'] || 'value';
        const avatarProp = mappings['Avatar'] || 'avatar';
        const iconProp = mappings['Icon'] || 'icon';

        let items = this._dataItems;
        if (this._maxItems > 0) {
          items = items.slice(0, this._maxItems);
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          let title = this._getFieldValue(item, titleProp) || '';
          let subtitle = this._getFieldValue(item, subtitleProp) || '';
          let description = this._getFieldValue(item, descProp) || '';
          let image = this._getFieldValue(item, imageProp) || '';
          let badge = this._getFieldValue(item, badgeProp) || '';
          let meta = this._getFieldValue(item, metaProp) || '';
          let value = this._getFieldValue(item, valueProp) || String(i);
          let avatar = this._getFieldValue(item, avatarProp) || '';
          let icon = this._getFieldValue(item, iconProp) || '';

          // Handle K2 collection XML for images
          if (image && image.includes('<collection>')) {
            image = this._parseK2ImageUrl(image);
          }
          if (avatar && avatar.includes('<collection>')) {
            avatar = this._parseK2ImageUrl(avatar);
          }

          this._cards.push({
            title,
            subtitle,
            description,
            image,
            badge,
            meta,
            value,
            avatar,
            icon,
            index: i,
            rawData: item
          });
        }

        if (this._hasRendered) {
          this._renderCards();
        }
      }

      _getFieldValue(item, prop) {
        if (!prop || !item) return '';

        // Handle template strings
        if (prop.startsWith('<Template>') && this.parseDisplayTemplate) {
          return this.parseDisplayTemplate(prop, item);
        }

        return item[prop] !== undefined ? item[prop] : '';
      }

      _parseK2ImageUrl(xmlString) {
        try {
          const urlMatch = xmlString.match(/<url[^>]*>([^<]+)<\/url>/i);
          if (urlMatch) return urlMatch[1];
          const contentMatch = xmlString.match(/<content[^>]*>([^<]+)<\/content>/i);
          if (contentMatch) return 'data:image/png;base64,' + contentMatch[1];
        } catch (e) {}
        return '';
      }

      _render() {
        this.innerHTML = '';

        this._container = document.createElement('div');
        this._container.className = 'cl-container';

        this._cardContainer = document.createElement('div');
        this._cardContainer.className = 'cl-card-container';

        this._container.appendChild(this._cardContainer);
        this.appendChild(this._container);

        this._applyStyles();
        this._processDataItems();
      }

      _applyStyles() {
        this.style.cssText = `
          display: ${this._isVisible ? 'block' : 'none'};
        `;

        this._container.style.cssText = `
          width: 100%;
          font-family: 'Roboto', sans-serif;
          --cl-primary: ${this._primaryColor};
          --cl-radius: ${this._borderRadius}px;
          --cl-gap: ${this._gap}px;
          --cl-bg: ${this._backgroundColor || ''};
          --cl-text: ${this._textColor || ''};
        `;

        this._updateContainerLayout();
      }

      _updateContainerLayout() {
        if (!this._cardContainer) return;

        let layoutStyles = '';

        if (this._layout === 'grid') {
          const colCount = Math.min(Math.max(1, this._columns), 6);
          layoutStyles = `
            display: grid;
            grid-template-columns: repeat(${colCount}, 1fr);
            gap: var(--cl-gap);
          `;
        } else if (this._layout === 'list') {
          layoutStyles = `
            display: flex;
            flex-direction: column;
            gap: var(--cl-gap);
          `;
        } else if (this._layout === 'masonry') {
          layoutStyles = `
            column-count: ${Math.min(Math.max(1, this._columns), 6)};
            column-gap: var(--cl-gap);
          `;
        }

        this._cardContainer.style.cssText = layoutStyles;
      }

      _renderCards() {
        if (!this._cardContainer) return;

        this._cardContainer.innerHTML = '';

        if (this._cards.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'cl-empty';
          empty.textContent = this._emptyMessage;
          empty.style.cssText = `
            text-align: center;
            padding: 48px 24px;
            color: #666;
            font-size: 14px;
            grid-column: 1 / -1;
          `;
          this._cardContainer.appendChild(empty);
          return;
        }

        this._cards.forEach((card, index) => {
          const cardEl = this._createCardElement(card, index);
          this._cardContainer.appendChild(cardEl);
        });
      }

      _createCardElement(card, index) {
        const cardEl = document.createElement('div');
        cardEl.className = `cl-card cl-card--${this._cardStyle} cl-card--hover-${this._hoverEffect}`;
        cardEl.dataset.index = index;
        cardEl.dataset.value = card.value;

        if (this._selectedIndices.has(index)) {
          cardEl.classList.add('cl-card--selected');
        }

        // Card styles
        let cardStyles = `
          border-radius: var(--cl-radius);
          overflow: hidden;
          position: relative;
          transition: all 0.2s ease;
          ${this._backgroundColor ? `background: ${this._backgroundColor} !important;` : ''}
          ${this._textColor ? `color: ${this._textColor};` : ''}
        `;

        if (this._cardWidth > 0) {
          cardStyles += `width: ${this._cardWidth}px;`;
        }
        if (this._cardHeight > 0) {
          cardStyles += `height: ${this._cardHeight}px;`;
        }

        if (this._layout === 'masonry') {
          cardStyles += 'break-inside: avoid; margin-bottom: var(--cl-gap);';
        }

        // Image position affects layout
        if (this._imagePosition === 'left' || this._imagePosition === 'right') {
          cardStyles += 'display: flex;';
          if (this._imagePosition === 'right') {
            cardStyles += 'flex-direction: row-reverse;';
          }
        }

        cardEl.style.cssText = cardStyles;

        // Build card content
        if (this._imagePosition === 'background' && card.image) {
          cardEl.classList.add('cl-card--bg-image');
          cardEl.style.backgroundImage = `url(${card.image})`;
          cardEl.style.backgroundSize = 'cover';
          cardEl.style.backgroundPosition = 'center';
          cardEl.innerHTML = '<div class="cl-card-overlay"></div>';
        }

        // Image section
        if (card.image && this._imagePosition !== 'none' && this._imagePosition !== 'background') {
          const imageSection = this._createImageSection(card);
          cardEl.appendChild(imageSection);
        }

        // Content section
        const content = this._createContentSection(card);
        cardEl.appendChild(content);

        // Actions section
        if (this._showActions) {
          const actions = this._createActionsSection(card, index);
          cardEl.appendChild(actions);
        }

        // Event listeners
        if (this._selectable && this._isEnabled) {
          cardEl.style.cursor = 'pointer';
          cardEl.addEventListener('click', (e) => {
            if (e.target.closest('.cl-card-action')) return;
            this._handleCardClick(card, index);
          });
        }

        return cardEl;
      }

      _createImageSection(card) {
        const section = document.createElement('div');
        section.className = 'cl-card-image';

        let aspectRatio = '';
        if (this._imageAspectRatio === '16:9') aspectRatio = '56.25%';
        else if (this._imageAspectRatio === '4:3') aspectRatio = '75%';
        else if (this._imageAspectRatio === '1:1') aspectRatio = '100%';

        let sectionStyles = `
          position: relative;
          overflow: hidden;
          background: #f0f0f0;
        `;

        if (this._imagePosition === 'left' || this._imagePosition === 'right') {
          sectionStyles += `
            width: ${this._imageHeight}px;
            flex-shrink: 0;
          `;
        } else if (aspectRatio) {
          sectionStyles += `padding-top: ${aspectRatio};`;
        } else {
          sectionStyles += `height: ${this._imageHeight}px;`;
        }

        section.style.cssText = sectionStyles;

        const img = document.createElement('img');
        img.src = card.image;
        img.alt = card.title || '';
        img.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        img.onerror = () => {
          img.style.display = 'none';
          section.innerHTML = '<span class="material-icons" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:48px;color:#ccc;">image</span>';
        };

        section.appendChild(img);

        // Badge on image
        if (this._showBadge && card.badge && this._imagePosition === 'top') {
          const badge = this._createBadge(card.badge);
          badge.style.position = 'absolute';
          badge.style.top = '12px';
          badge.style.right = '12px';
          section.appendChild(badge);
        }

        return section;
      }

      _createContentSection(card) {
        const content = document.createElement('div');
        content.className = 'cl-card-content';
        content.style.cssText = `
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          ${this._imagePosition === 'background' ? 'position: relative; z-index: 1; color: #fff;' : ''}
        `;

        // Header with avatar
        if (this._showAvatar && (card.avatar || card.icon)) {
          const header = document.createElement('div');
          header.className = 'cl-card-header';
          header.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 12px;';

          const avatarEl = document.createElement('div');
          avatarEl.className = 'cl-card-avatar';

          let avatarRadius = '50%';
          if (this._avatarStyle === 'square') avatarRadius = '0';
          else if (this._avatarStyle === 'rounded') avatarRadius = '8px';

          avatarEl.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: ${avatarRadius};
            overflow: hidden;
            background: var(--cl-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            flex-shrink: 0;
          `;

          if (card.avatar) {
            avatarEl.innerHTML = `<img src="${card.avatar}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'material-icons\\'>person</span>'">`;
          } else if (card.icon) {
            avatarEl.innerHTML = `<span class="material-icons">${card.icon}</span>`;
          } else {
            avatarEl.innerHTML = `<span class="material-icons">person</span>`;
          }

          header.appendChild(avatarEl);

          const headerText = document.createElement('div');
          headerText.style.flex = '1';

          if (this._showTitle && card.title) {
            const title = document.createElement('div');
            title.className = 'cl-card-title';
            title.textContent = card.title;
            title.style.cssText = `font-size: 16px; font-weight: 500; line-height: 1.3; ${this._textColor ? `color: ${this._textColor};` : ''}`;
            headerText.appendChild(title);
          }

          if (this._showSubtitle && card.subtitle) {
            const subtitle = document.createElement('div');
            subtitle.className = 'cl-card-subtitle';
            subtitle.textContent = card.subtitle;
            subtitle.style.cssText = `font-size: 13px; margin-top: 2px; ${this._textColor ? `color: ${this._textColor}; opacity: 0.8;` : 'color: #666;'}`;
            headerText.appendChild(subtitle);
          }

          header.appendChild(headerText);
          content.appendChild(header);
        } else {
          // Title without avatar
          if (this._showTitle && card.title) {
            const title = document.createElement('div');
            title.className = 'cl-card-title';
            title.textContent = card.title;
            title.style.cssText = `font-size: 18px; font-weight: 500; line-height: 1.3; margin-bottom: 4px; ${this._textColor ? `color: ${this._textColor};` : ''}`;
            content.appendChild(title);
          }

          if (this._showSubtitle && card.subtitle) {
            const subtitle = document.createElement('div');
            subtitle.className = 'cl-card-subtitle';
            subtitle.textContent = card.subtitle;
            subtitle.style.cssText = `font-size: 14px; margin-bottom: 8px; ${this._textColor ? `color: ${this._textColor}; opacity: 0.8;` : 'color: #666;'}`;
            content.appendChild(subtitle);
          }
        }

        // Badge (if not on image)
        if (this._showBadge && card.badge && (this._imagePosition !== 'top' || !card.image)) {
          const badge = this._createBadge(card.badge);
          badge.style.marginBottom = '8px';
          content.appendChild(badge);
        }

        // Description
        if (this._showDescription && card.description) {
          const desc = document.createElement('div');
          desc.className = 'cl-card-description';
          desc.textContent = card.description;

          let descStyles = `font-size: 14px; line-height: 1.5; flex: 1; ${this._textColor ? `color: ${this._textColor}; opacity: 0.9;` : 'color: #444;'}`;
          if (this._descriptionLines > 0) {
            descStyles += `
              display: -webkit-box;
              -webkit-line-clamp: ${this._descriptionLines};
              -webkit-box-orient: vertical;
              overflow: hidden;
            `;
          }
          desc.style.cssText = descStyles;
          content.appendChild(desc);
        }

        // Meta
        if (this._showMeta && card.meta) {
          const meta = document.createElement('div');
          meta.className = 'cl-card-meta';
          meta.textContent = card.meta;
          meta.style.cssText = `font-size: 12px; margin-top: 12px; ${this._textColor ? `color: ${this._textColor}; opacity: 0.7;` : 'color: #888;'}`;
          content.appendChild(meta);
        }

        return content;
      }

      _createBadge(text) {
        const badge = document.createElement('span');
        badge.className = 'cl-card-badge';
        badge.textContent = text;

        const key = text.toLowerCase();
        const colors = BADGE_COLORS[key] || BADGE_COLORS.default;

        badge.style.cssText = `
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: ${colors.bg};
          color: ${colors.text};
        `;

        return badge;
      }

      _createActionsSection(card, index) {
        const actions = document.createElement('div');
        actions.className = 'cl-card-actions';
        actions.style.cssText = `
          padding: 8px 16px 16px;
          display: flex;
          gap: 8px;
          border-top: 1px solid rgba(0,0,0,0.08);
        `;

        const labels = this._actionLabels.split(',').map(l => l.trim()).filter(l => l);

        labels.forEach((label, actionIndex) => {
          const btn = document.createElement('button');
          btn.className = 'cl-card-action';
          btn.textContent = label;
          btn.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            ${actionIndex === 0 ?
              `background: var(--cl-primary); color: #fff;` :
              `background: transparent; color: var(--cl-primary); border: 1px solid var(--cl-primary);`
            }
          `;

          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('ActionClicked', {
              bubbles: true,
              detail: {
                action: label,
                actionIndex: actionIndex,
                cardIndex: index,
                cardValue: card.value,
                rawData: card.rawData
              }
            }));
          });

          btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '0.85';
            btn.style.transform = 'scale(1.02)';
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
          });

          actions.appendChild(btn);
        });

        return actions;
      }

      _handleCardClick(card, index) {
        if (this._multiSelect) {
          if (this._selectedIndices.has(index)) {
            this._selectedIndices.delete(index);
          } else {
            this._selectedIndices.add(index);
          }
        } else {
          this._selectedIndices.clear();
          this._selectedIndices.add(index);
        }

        this._selectedIndex = index;
        this._selectedValue = card.value;

        safeRaisePropertyChanged(this, 'selectedIndex');
        safeRaisePropertyChanged(this, 'selectedValue');

        // Update visual selection
        this._cardContainer.querySelectorAll('.cl-card').forEach((el, i) => {
          el.classList.toggle('cl-card--selected', this._selectedIndices.has(i));
        });

        this.dispatchEvent(new CustomEvent('CardClicked', {
          bubbles: true,
          detail: {
            index: index,
            value: card.value,
            title: card.title,
            rawData: card.rawData
          }
        }));

        this.dispatchEvent(new CustomEvent('SelectionChanged', {
          bubbles: true,
          detail: {
            selectedIndices: Array.from(this._selectedIndices),
            selectedValues: Array.from(this._selectedIndices).map(i => this._cards[i]?.value)
          }
        }));
      }

      // Public methods
      refresh() {
        this._renderCards();
      }

      clearSelection() {
        this._selectedIndices.clear();
        this._selectedIndex = -1;
        this._selectedValue = '';
        safeRaisePropertyChanged(this, 'selectedIndex');
        safeRaisePropertyChanged(this, 'selectedValue');
        this._renderCards();
      }

      // Properties
      get cardData() { return JSON.stringify(this._cards); }
      set cardData(v) {
        if (typeof v === 'string') {
          try {
            this._dataItems = JSON.parse(v);
            this._processDataItems();
          } catch (e) {}
        } else if (Array.isArray(v)) {
          this._dataItems = v;
          this._processDataItems();
        }
      }
      get CardData() { return this.cardData; }
      set CardData(v) { this.cardData = v; }

      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) { /* Read-only */ }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get selectedIndex() { return this._selectedIndex; }
      set selectedIndex(v) { /* Read-only */ }
      get SelectedIndex() { return this.selectedIndex; }
      set SelectedIndex(v) { this.selectedIndex = v; }

      get layout() { return this._layout; }
      set layout(v) {
        this._layout = ['grid', 'list', 'masonry'].includes(v) ? v : 'grid';
        if (this._hasRendered) {
          this._updateContainerLayout();
          this._renderCards();
        }
      }
      get Layout() { return this.layout; }
      set Layout(v) { this.layout = v; }

      get columns() { return this._columns; }
      set columns(v) {
        this._columns = parseInt(v) || 3;
        if (this._hasRendered) {
          this._updateContainerLayout();
        }
      }
      get Columns() { return this.columns; }
      set Columns(v) { this.columns = v; }

      get cardStyle() { return this._cardStyle; }
      set cardStyle(v) {
        this._cardStyle = ['elevated', 'filled', 'outlined'].includes(v) ? v : 'elevated';
        if (this._hasRendered) this._renderCards();
      }
      get CardStyle() { return this.cardStyle; }
      set CardStyle(v) { this.cardStyle = v; }

      get cardWidth() { return this._cardWidth; }
      set cardWidth(v) {
        this._cardWidth = parseInt(v) || 0;
        if (this._hasRendered) this._renderCards();
      }
      get CardWidth() { return this.cardWidth; }
      set CardWidth(v) { this.cardWidth = v; }

      get cardHeight() { return this._cardHeight; }
      set cardHeight(v) {
        this._cardHeight = parseInt(v) || 0;
        if (this._hasRendered) this._renderCards();
      }
      get CardHeight() { return this.cardHeight; }
      set CardHeight(v) { this.cardHeight = v; }

      get imagePosition() { return this._imagePosition; }
      set imagePosition(v) {
        this._imagePosition = ['top', 'left', 'right', 'background', 'none'].includes(v) ? v : 'top';
        if (this._hasRendered) this._renderCards();
      }
      get ImagePosition() { return this.imagePosition; }
      set ImagePosition(v) { this.imagePosition = v; }

      get imageHeight() { return this._imageHeight; }
      set imageHeight(v) {
        this._imageHeight = parseInt(v) || 160;
        if (this._hasRendered) this._renderCards();
      }
      get ImageHeight() { return this.imageHeight; }
      set ImageHeight(v) { this.imageHeight = v; }

      get imageAspectRatio() { return this._imageAspectRatio; }
      set imageAspectRatio(v) {
        this._imageAspectRatio = v || '16:9';
        if (this._hasRendered) this._renderCards();
      }
      get ImageAspectRatio() { return this.imageAspectRatio; }
      set ImageAspectRatio(v) { this.imageAspectRatio = v; }

      get showTitle() { return this._showTitle; }
      set showTitle(v) {
        this._showTitle = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowTitle() { return this.showTitle; }
      set ShowTitle(v) { this.showTitle = v; }

      get showSubtitle() { return this._showSubtitle; }
      set showSubtitle(v) {
        this._showSubtitle = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowSubtitle() { return this.showSubtitle; }
      set ShowSubtitle(v) { this.showSubtitle = v; }

      get showDescription() { return this._showDescription; }
      set showDescription(v) {
        this._showDescription = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowDescription() { return this.showDescription; }
      set ShowDescription(v) { this.showDescription = v; }

      get showBadge() { return this._showBadge; }
      set showBadge(v) {
        this._showBadge = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowBadge() { return this.showBadge; }
      set ShowBadge(v) { this.showBadge = v; }

      get showMeta() { return this._showMeta; }
      set showMeta(v) {
        this._showMeta = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowMeta() { return this.showMeta; }
      set ShowMeta(v) { this.showMeta = v; }

      get showActions() { return this._showActions; }
      set showActions(v) {
        this._showActions = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowActions() { return this.showActions; }
      set ShowActions(v) { this.showActions = v; }

      get actionLabels() { return this._actionLabels; }
      set actionLabels(v) {
        this._actionLabels = v || 'View,Edit';
        if (this._hasRendered) this._renderCards();
      }
      get ActionLabels() { return this.actionLabels; }
      set ActionLabels(v) { this.actionLabels = v; }

      get descriptionLines() { return this._descriptionLines; }
      set descriptionLines(v) {
        this._descriptionLines = parseInt(v) || 3;
        if (this._hasRendered) this._renderCards();
      }
      get DescriptionLines() { return this.descriptionLines; }
      set DescriptionLines(v) { this.descriptionLines = v; }

      get selectable() { return this._selectable; }
      set selectable(v) {
        this._selectable = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get Selectable() { return this.selectable; }
      set Selectable(v) { this.selectable = v; }

      get multiSelect() { return this._multiSelect; }
      set multiSelect(v) {
        this._multiSelect = (v === true || v === 'true');
      }
      get MultiSelect() { return this.multiSelect; }
      set MultiSelect(v) { this.multiSelect = v; }

      get hoverEffect() { return this._hoverEffect; }
      set hoverEffect(v) {
        this._hoverEffect = ['lift', 'glow', 'border', 'none'].includes(v) ? v : 'lift';
        if (this._hasRendered) this._renderCards();
      }
      get HoverEffect() { return this.hoverEffect; }
      set HoverEffect(v) { this.hoverEffect = v; }

      get borderRadius() { return this._borderRadius; }
      set borderRadius(v) {
        this._borderRadius = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
      }
      get BorderRadius() { return this.borderRadius; }
      set BorderRadius(v) { this.borderRadius = v; }

      get gap() { return this._gap; }
      set gap(v) {
        this._gap = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
      }
      get Gap() { return this.gap; }
      set Gap(v) { this.gap = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '';
        if (this._hasRendered) {
          this._applyStyles();
          this._renderCards();
        }
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '';
        if (this._hasRendered) {
          this._applyStyles();
          this._renderCards();
        }
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get showAvatar() { return this._showAvatar; }
      set showAvatar(v) {
        this._showAvatar = (v === true || v === 'true');
        if (this._hasRendered) this._renderCards();
      }
      get ShowAvatar() { return this.showAvatar; }
      set ShowAvatar(v) { this.showAvatar = v; }

      get avatarStyle() { return this._avatarStyle; }
      set avatarStyle(v) {
        this._avatarStyle = ['circle', 'square', 'rounded'].includes(v) ? v : 'circle';
        if (this._hasRendered) this._renderCards();
      }
      get AvatarStyle() { return this.avatarStyle; }
      set AvatarStyle(v) { this.avatarStyle = v; }

      get emptyMessage() { return this._emptyMessage; }
      set emptyMessage(v) {
        this._emptyMessage = v || 'No items to display';
        if (this._hasRendered) this._renderCards();
      }
      get EmptyMessage() { return this.emptyMessage; }
      set EmptyMessage(v) { this.emptyMessage = v; }

      get maxItems() { return this._maxItems; }
      set maxItems(v) {
        this._maxItems = parseInt(v) || 0;
        if (this._hasRendered) this._processDataItems();
      }
      get MaxItems() { return this.maxItems; }
      set MaxItems(v) { this.maxItems = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._container) {
          this._container.style.opacity = this._isEnabled ? '1' : '0.6';
          this._container.style.pointerEvents = this._isEnabled ? '' : 'none';
        }
      }
    });
  }
})();
