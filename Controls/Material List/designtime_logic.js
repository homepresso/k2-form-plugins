/**
 * Material List Control for K2 SmartForms
 * Material 3 Design list for displaying items with various layouts
 * Design-time version
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

  if (!window.customElements.get('material-list')) {
    window.customElements.define('material-list', class MaterialList extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;
        this._fontsReady = false;
        this._pendingRender = false;

        // Properties
        this._variant = 'one-line'; // one-line, two-line, three-line
        this._selectedValue = '';
        this._selectable = true;
        this._showDividers = false;
        this._showLeadingIcon = true;
        this._showTrailingIcon = false;
        this._trailingIcon = 'chevron_right';
        this._avatarMode = false;
        this._checkboxMode = false;
        this._checkboxPosition = 'left';
        this._checkedValues = '';
        this._checkedSet = new Set();
        this._checkboxColor = '#6750A4';

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '#FFFBFE';
        this._textColor = '#1C1B1F';
        this._secondaryTextColor = '#49454F';
        this._dividerColor = '#CAC4D0';
        this._hoverColor = '';
        this._selectedColor = '#E8DEF8';
        this._iconColor = '#49454F';
        this._trailingIconColor = '';
        this._avatarBackgroundColor = '#E8DEF8';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = '16';
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed items
        this._parsedItems = [];

        // DOM refs
        this._container = null;

        // K2 List binding
        this._listConfig = null;
        this._dataItems = [];
      }

      connectedCallback() {
        if (this._hasRendered) return;

        // Render container immediately
        this._renderContainer();
        this._hasRendered = true;

        // Load fonts and render list when ready
        loadFonts().then(() => {
          this._fontsReady = true;
          // Process any data that arrived before fonts were ready
          if (this._parsedItems.length > 0 || this._pendingRender) {
            this._renderList();
          } else {
            // Process initial data
            this._parseItems();
            this._renderList();
          }
        }).catch(err => {
          console.warn('Font loading issue:', err);
          // Render anyway after timeout
          this._fontsReady = true;
          this._parseItems();
          this._renderList();
        });
      }

      _renderContainer() {
        this.innerHTML = '';
        this._container = document.createElement('ul');
        this._container.className = `mls-container mls-${this._variant}`;
        this._container.setAttribute('role', 'listbox');
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
        this._renderList();
      }

      _renderList() {
        if (!this._container) return;

        // Clear existing items
        this._container.innerHTML = '';
        this._container.className = `mls-container mls-${this._variant}`;
        if (this._checkboxMode) {
          this._container.classList.add('mls-checkbox-mode');
          if (this._checkboxPosition === 'right') {
            this._container.classList.add('mls-checkbox-right');
          }
        }

        this._parsedItems.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'mls-item';
          listItem.setAttribute('role', this._checkboxMode ? 'checkbox' : 'option');
          listItem.setAttribute('data-value', item.value);
          listItem.setAttribute('tabindex', (this._selectable || this._checkboxMode) ? '0' : '-1');

          if (this._selectedValue === item.value) {
            listItem.classList.add('mls-selected');
            listItem.setAttribute('aria-selected', 'true');
          }

          // Checkbox (if checkbox mode - left position)
          let checkboxWrapper = null;
          if (this._checkboxMode) {
            checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'mls-checkbox-wrapper';

            const checkbox = document.createElement('div');
            checkbox.className = 'mls-checkbox';
            const isChecked = this._checkedSet.has(item.value);
            if (isChecked) {
              checkbox.classList.add('mls-checked');
              listItem.setAttribute('aria-checked', 'true');
            } else {
              listItem.setAttribute('aria-checked', 'false');
            }

            const checkIcon = document.createElement('span');
            checkIcon.className = 'mls-check-icon material-icons';
            checkIcon.textContent = 'check';
            checkbox.appendChild(checkIcon);

            checkboxWrapper.appendChild(checkbox);

            // Only append now if position is left
            if (this._checkboxPosition !== 'right') {
              listItem.appendChild(checkboxWrapper);
            }
          }

          // Leading content (icon or avatar)
          if (this._showLeadingIcon && item.icon) {
            const leading = document.createElement('div');
            leading.className = 'mls-leading';

            if (this._avatarMode) {
              const avatar = document.createElement('div');
              avatar.className = 'mls-avatar';
              if (item.icon.startsWith('http') || item.icon.startsWith('/')) {
                const img = document.createElement('img');
                img.src = item.icon;
                img.alt = item.title;
                avatar.appendChild(img);
              } else {
                avatar.textContent = item.icon.charAt(0).toUpperCase();
              }
              leading.appendChild(avatar);
            } else {
              const icon = document.createElement('span');
              icon.className = 'mls-icon material-icons';
              icon.textContent = item.icon;
              leading.appendChild(icon);
            }

            listItem.appendChild(leading);
          }

          // Text content
          const content = document.createElement('div');
          content.className = 'mls-content';

          const title = document.createElement('span');
          title.className = 'mls-title';
          title.textContent = item.title;
          content.appendChild(title);

          if (item.subtitle && (this._variant === 'two-line' || this._variant === 'three-line')) {
            const subtitle = document.createElement('span');
            subtitle.className = 'mls-subtitle';
            subtitle.textContent = item.subtitle;
            content.appendChild(subtitle);
          }

          listItem.appendChild(content);

          // Trailing icon (not shown in checkbox mode by default)
          if (this._showTrailingIcon && !this._checkboxMode) {
            const trailing = document.createElement('div');
            trailing.className = 'mls-trailing';
            const icon = document.createElement('span');
            icon.className = 'mls-trailing-icon material-icons';
            icon.textContent = this._trailingIcon;
            trailing.appendChild(icon);
            listItem.appendChild(trailing);
          }

          // Checkbox on right side (if checkbox mode and position is right)
          if (this._checkboxMode && this._checkboxPosition === 'right' && checkboxWrapper) {
            listItem.appendChild(checkboxWrapper);
          }

          // State layer
          const stateLayer = document.createElement('div');
          stateLayer.className = 'mls-state-layer';
          listItem.appendChild(stateLayer);

          this._container.appendChild(listItem);

          // Divider
          if (this._showDividers && index < this._parsedItems.length - 1) {
            const divider = document.createElement('li');
            divider.className = 'mls-divider';
            divider.setAttribute('role', 'separator');
            this._container.appendChild(divider);
          }
        });

        this._updateState();
        this._applyStyles();
        this._bindEvents();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--mls-primary', this._primaryColor);
          this._container.style.setProperty('--mls-background', this._backgroundColor);
          this._container.style.setProperty('--mls-text', this._textColor);
          this._container.style.setProperty('--mls-secondary-text', this._secondaryTextColor);
          this._container.style.setProperty('--mls-divider', this._dividerColor);
          this._container.style.setProperty('--mls-selected', this._selectedColor);
          this._container.style.setProperty('--mls-icon', this._iconColor);
          this._container.style.setProperty('--mls-avatar-bg', this._avatarBackgroundColor);
          this._container.style.setProperty('--mls-checkbox', this._checkboxColor || this._primaryColor);
          if (this._hoverColor) {
            this._container.style.setProperty('--mls-hover', this._hoverColor);
          }
          if (this._trailingIconColor) {
            this._container.style.setProperty('--mls-trailing-icon', this._trailingIconColor);
          }

          // Apply font properties to text elements
          const titles = this._container.querySelectorAll('.mls-title');
          const subtitles = this._container.querySelectorAll('.mls-subtitle');

          titles.forEach(title => {
            title.style.fontSize = this._fontSize + 'px';
            title.style.fontWeight = this._fontWeight;
            title.style.fontStyle = this._fontStyle;
          });

          subtitles.forEach(subtitle => {
            subtitle.style.fontSize = this._fontSize + 'px';
            subtitle.style.fontWeight = this._fontWeight;
            subtitle.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        const items = this._container.querySelectorAll('.mls-item');
        items.forEach(item => {
          item.addEventListener('click', (e) => {
            if (!this._isEnabled) return;
            const value = item.getAttribute('data-value');

            if (this._checkboxMode) {
              this._toggleCheckbox(value, item);
            } else if (this._selectable) {
              this._selectItem(value);
            }
          });

          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!this._isEnabled) return;
              const value = item.getAttribute('data-value');

              if (this._checkboxMode) {
                this._toggleCheckbox(value, item);
              } else if (this._selectable) {
                this._selectItem(value);
              }
            }
          });
        });
      }

      _toggleCheckbox(value, listItem) {
        const checkbox = listItem.querySelector('.mls-checkbox');
        const isChecked = this._checkedSet.has(value);

        if (isChecked) {
          this._checkedSet.delete(value);
          checkbox?.classList.remove('mls-checked');
          listItem.setAttribute('aria-checked', 'false');
        } else {
          this._checkedSet.add(value);
          checkbox?.classList.add('mls-checked');
          listItem.setAttribute('aria-checked', 'true');
        }

        // Update checkedValues string
        this._checkedValues = Array.from(this._checkedSet).join(',');
        safeRaisePropertyChanged(this, 'checkedValues');

        // Fire ItemChecked event
        this.dispatchEvent(new CustomEvent('ItemChecked', {
          bubbles: true,
          detail: {
            value,
            checked: !isChecked,
            checkedValues: this._checkedValues,
            item: this._parsedItems.find(i => i.value === value)
          }
        }));

        // Check if all items are now checked and fire AllItemsChecked event
        if (this._parsedItems.length > 0 && this._checkedSet.size === this._parsedItems.length) {
          this.dispatchEvent(new CustomEvent('AllItemsChecked', {
            bubbles: true,
            detail: {
              checkedValues: this._checkedValues,
              count: this._checkedSet.size
            }
          }));
        }
      }

      _selectItem(value) {
        this._selectedValue = value;

        // Update selection state
        const items = this._container.querySelectorAll('.mls-item');
        items.forEach(item => {
          const itemValue = item.getAttribute('data-value');
          const isSelected = itemValue === value;
          item.classList.toggle('mls-selected', isSelected);
          item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });

        safeRaisePropertyChanged(this, 'selectedValue');
        this.dispatchEvent(new CustomEvent('ItemSelected', {
          bubbles: true,
          detail: { value, item: this._parsedItems.find(i => i.value === value) }
        }));
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('mls-disabled', !this._isEnabled);
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        console.log('[Material List DT] listConfigChangedCallback called', { config, listname });
        this._listConfig = config;
        // Don't call _processDataItems here - wait for listItemsChangedCallback to provide data
        // The config just tells us field mappings, not actual data
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        console.log('[Material List DT] listItemsChangedCallback called', itemsChangedEventArgs);
        const isDesignTime = window.K2?.IsDesigner === true;
        let itemsToProcess = itemsChangedEventArgs?.NewItems;

        // Fallback: If at design time and we receive 0 items, use initial value
        if (isDesignTime && (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0)) {
          try {
            const fallbackItems = JSON.parse('[{"icon": "inbox", "title": "Inbox", "subtitle": "3 new messages", "value": "inbox"},{"icon": "star", "title": "Starred", "subtitle": "12 items", "value": "starred"}]');
            if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
              itemsToProcess = fallbackItems;
            }
          } catch (error) {
            console.warn('[Material List DT] Error parsing fallback initial value:', error);
          }
        }

        if (Array.isArray(itemsToProcess)) {
          this._dataItems = itemsToProcess;
          this._processDataItems();
        } else {
          console.warn('[Material List DT] NewItems is not an array:', itemsChangedEventArgs);
        }
      }

      _processDataItems() {
        console.log('[Material List DT] _processDataItems called', { dataItems: this._dataItems, listConfig: this._listConfig });
        if (!this._dataItems || this._dataItems.length === 0) {
          console.log('[Material List DT] No data items to process');
          return;
        }

        // Get field mappings from K2 config
        const mappings = this._listConfig?.partmappings || {};
        const iconProp = mappings['Icon'] || mappings['Image'] || 'icon';
        const titleProp = mappings['Title'] || mappings['Display'] || 'title';
        const subtitleProp = mappings['Subtitle'] || mappings['Description'] || 'subtitle';
        const valueProp = mappings['Value'] || 'value';
        const checkedProp = mappings['Checked'] || mappings['IsChecked'] || mappings['Selected'] || 'checked';

        // Convert K2 data items to list items
        this._parsedItems = this._dataItems.map(item => ({
          icon: item[iconProp] || item.icon || item.Icon || item.image || item.Image || '',
          title: item[titleProp] || item.title || item.Title || item.name || item.Name || item.text || item.Text || '',
          subtitle: item[subtitleProp] || item.subtitle || item.Subtitle || item.description || item.Description || '',
          value: String(item[valueProp] || item.value || item.Value || item.id || item.Id || item.ID || item[titleProp] || ''),
          checked: item[checkedProp] === true || item[checkedProp] === 'true'
        }));

        // Update checked set from data if in checkbox mode
        if (this._checkboxMode) {
          const checkedFromData = this._parsedItems.filter(item => item.checked).map(item => item.value);
          if (checkedFromData.length > 0) {
            this._checkedSet = new Set(checkedFromData);
            this._checkedValues = Array.from(this._checkedSet).join(',');
          }
        }

        if (this._hasRendered) {
          if (this._fontsReady) {
            this._renderList();
          } else {
            // Fonts not ready yet, wait for them
            this._pendingRender = true;
            loadFonts().then(() => {
              this._fontsReady = true;
              if (this._pendingRender) {
                this._pendingRender = false;
                this._renderList();
              }
            });
          }
        }
      }

      // Properties
      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['one-line', 'two-line', 'three-line'];
        this._variant = valid.includes(v) ? v : 'one-line';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) {
          const items = this._container?.querySelectorAll('.mls-item');
          items?.forEach(item => {
            const itemValue = item.getAttribute('data-value');
            const isSelected = itemValue === this._selectedValue;
            item.classList.toggle('mls-selected', isSelected);
            item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          });
        }
        safeRaisePropertyChanged(this, 'selectedValue');
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get selectable() { return this._selectable; }
      set selectable(v) {
        this._selectable = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'selectable');
      }
      get Selectable() { return this.selectable; }
      set Selectable(v) { this.selectable = v; }

      get showDividers() { return this._showDividers; }
      set showDividers(v) {
        this._showDividers = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showDividers');
      }
      get ShowDividers() { return this.showDividers; }
      set ShowDividers(v) { this.showDividers = v; }

      get showLeadingIcon() { return this._showLeadingIcon; }
      set showLeadingIcon(v) {
        this._showLeadingIcon = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showLeadingIcon');
      }
      get ShowLeadingIcon() { return this.showLeadingIcon; }
      set ShowLeadingIcon(v) { this.showLeadingIcon = v; }

      get showTrailingIcon() { return this._showTrailingIcon; }
      set showTrailingIcon(v) {
        this._showTrailingIcon = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showTrailingIcon');
      }
      get ShowTrailingIcon() { return this.showTrailingIcon; }
      set ShowTrailingIcon(v) { this.showTrailingIcon = v; }

      get trailingIcon() { return this._trailingIcon; }
      set trailingIcon(v) {
        this._trailingIcon = v || 'chevron_right';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'trailingIcon');
      }
      get TrailingIcon() { return this.trailingIcon; }
      set TrailingIcon(v) { this.trailingIcon = v; }

      get avatarMode() { return this._avatarMode; }
      set avatarMode(v) {
        this._avatarMode = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'avatarMode');
      }
      get AvatarMode() { return this.avatarMode; }
      set AvatarMode(v) { this.avatarMode = v; }

      get checkboxMode() { return this._checkboxMode; }
      set checkboxMode(v) {
        this._checkboxMode = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'checkboxMode');
      }
      get CheckboxMode() { return this.checkboxMode; }
      set CheckboxMode(v) { this.checkboxMode = v; }

      get checkboxPosition() { return this._checkboxPosition; }
      set checkboxPosition(v) {
        const valid = ['left', 'right'];
        this._checkboxPosition = valid.includes(v) ? v : 'left';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'checkboxPosition');
      }
      get CheckboxPosition() { return this.checkboxPosition; }
      set CheckboxPosition(v) { this.checkboxPosition = v; }

      get checkedValues() { return this._checkedValues; }
      set checkedValues(v) {
        this._checkedValues = v || '';
        // Parse into Set
        this._checkedSet = new Set(
          this._checkedValues ? this._checkedValues.split(',').map(s => s.trim()).filter(s => s) : []
        );
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'checkedValues');
      }
      get CheckedValues() { return this.checkedValues; }
      set CheckedValues(v) { this.checkedValues = v; }

      get checkboxColor() { return this._checkboxColor; }
      set checkboxColor(v) {
        this._checkboxColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'checkboxColor');
      }
      get CheckboxColor() { return this.checkboxColor; }
      set CheckboxColor(v) { this.checkboxColor = v; }

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

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get secondaryTextColor() { return this._secondaryTextColor; }
      set secondaryTextColor(v) {
        this._secondaryTextColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'secondaryTextColor');
      }
      get SecondaryTextColor() { return this.secondaryTextColor; }
      set SecondaryTextColor(v) { this.secondaryTextColor = v; }

      get dividerColor() { return this._dividerColor; }
      set dividerColor(v) {
        this._dividerColor = v || '#CAC4D0';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'dividerColor');
      }
      get DividerColor() { return this.dividerColor; }
      set DividerColor(v) { this.dividerColor = v; }

      get hoverColor() { return this._hoverColor; }
      set hoverColor(v) {
        this._hoverColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'hoverColor');
      }
      get HoverColor() { return this.hoverColor; }
      set HoverColor(v) { this.hoverColor = v; }

      get selectedColor() { return this._selectedColor; }
      set selectedColor(v) {
        this._selectedColor = v || '#E8DEF8';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'selectedColor');
      }
      get SelectedColor() { return this.selectedColor; }
      set SelectedColor(v) { this.selectedColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'iconColor');
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get trailingIconColor() { return this._trailingIconColor; }
      set trailingIconColor(v) {
        this._trailingIconColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'trailingIconColor');
      }
      get TrailingIconColor() { return this.trailingIconColor; }
      set TrailingIconColor(v) { this.trailingIconColor = v; }

      get avatarBackgroundColor() { return this._avatarBackgroundColor; }
      set avatarBackgroundColor(v) {
        this._avatarBackgroundColor = v || '#E8DEF8';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'avatarBackgroundColor');
      }
      get AvatarBackgroundColor() { return this.avatarBackgroundColor; }
      set AvatarBackgroundColor(v) { this.avatarBackgroundColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontFamily');
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = v || '16';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontSize');
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || 'normal';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontWeight');
      }
      get FontWeight() { return this.fontWeight; }
      set FontWeight(v) { this.fontWeight = v; }

      get fontStyle() { return this._fontStyle; }
      set fontStyle(v) {
        this._fontStyle = v || 'normal';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'fontStyle');
      }
      get FontStyle() { return this.fontStyle; }
      set FontStyle(v) { this.fontStyle = v; }

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
        const items = this._container?.querySelectorAll('.mls-item');
        items?.forEach(item => {
          item.classList.remove('mls-selected');
          item.setAttribute('aria-selected', 'false');
        });
        safeRaisePropertyChanged(this, 'selectedValue');
      }

      checkAll() {
        if (!this._checkboxMode) return;
        this._checkedSet = new Set(this._parsedItems.map(item => item.value));
        this._checkedValues = Array.from(this._checkedSet).join(',');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'checkedValues');

        // Fire AllItemsChecked event
        if (this._parsedItems.length > 0) {
          this.dispatchEvent(new CustomEvent('AllItemsChecked', {
            bubbles: true,
            detail: {
              checkedValues: this._checkedValues,
              count: this._checkedSet.size
            }
          }));
        }
      }

      uncheckAll() {
        if (!this._checkboxMode) return;
        this._checkedSet.clear();
        this._checkedValues = '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'checkedValues');
      }
    });
  }
})();
