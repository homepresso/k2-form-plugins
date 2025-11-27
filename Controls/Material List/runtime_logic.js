/**
 * Material List Control for K2 SmartForms
 * Material 3 Design list for displaying items with various layouts
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

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-list')) {
    window.customElements.define('material-list', class MaterialList extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._items = '';
        this._delimiter = '|';
        this._subDelimiter = ':';
        this._variant = 'one-line'; // one-line, two-line, three-line
        this._selectedValue = '';
        this._selectable = true;
        this._showDividers = false;
        this._showLeadingIcon = true;
        this._showTrailingIcon = false;
        this._trailingIcon = 'chevron_right';
        this._avatarMode = false;

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
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed items
        this._parsedItems = [];

        // DOM refs
        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseItems();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _parseItems() {
        this._parsedItems = [];
        const items = this._items ? this._items.split(this._delimiter) : [];

        items.forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;

          // Format: icon:title:subtitle:value or title:subtitle:value or title:value or title
          const parts = trimmed.split(this._subDelimiter);

          if (parts.length >= 4) {
            this._parsedItems.push({
              icon: parts[0].trim(),
              title: parts[1].trim(),
              subtitle: parts[2].trim(),
              value: parts[3].trim()
            });
          } else if (parts.length === 3) {
            // Check if first part looks like icon
            const first = parts[0].trim();
            if (first.length <= 30 && !first.includes(' ')) {
              this._parsedItems.push({
                icon: first,
                title: parts[1].trim(),
                subtitle: '',
                value: parts[2].trim()
              });
            } else {
              this._parsedItems.push({
                icon: '',
                title: first,
                subtitle: parts[1].trim(),
                value: parts[2].trim()
              });
            }
          } else if (parts.length === 2) {
            this._parsedItems.push({
              icon: '',
              title: parts[0].trim(),
              subtitle: '',
              value: parts[1].trim()
            });
          } else {
            this._parsedItems.push({
              icon: '',
              title: trimmed,
              subtitle: '',
              value: trimmed
            });
          }
        });
      }

      _render() {
        this.innerHTML = '';
        this._buildList();
        this._applyStyles();
        this._bindEvents();
      }

      _buildList() {
        this._container = document.createElement('ul');
        this._container.className = `mls-container mls-${this._variant}`;
        this._container.setAttribute('role', 'listbox');

        this._parsedItems.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'mls-item';
          listItem.setAttribute('role', 'option');
          listItem.setAttribute('data-value', item.value);
          listItem.setAttribute('tabindex', this._selectable ? '0' : '-1');

          if (this._selectedValue === item.value) {
            listItem.classList.add('mls-selected');
            listItem.setAttribute('aria-selected', 'true');
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

          // Trailing icon
          if (this._showTrailingIcon) {
            const trailing = document.createElement('div');
            trailing.className = 'mls-trailing';
            const icon = document.createElement('span');
            icon.className = 'mls-trailing-icon material-icons';
            icon.textContent = this._trailingIcon;
            trailing.appendChild(icon);
            listItem.appendChild(trailing);
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

        this.appendChild(this._container);
        this._updateState();
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
          if (this._hoverColor) {
            this._container.style.setProperty('--mls-hover', this._hoverColor);
          }
          if (this._trailingIconColor) {
            this._container.style.setProperty('--mls-trailing-icon', this._trailingIconColor);
          }
        }
      }

      _bindEvents() {
        const items = this._container.querySelectorAll('.mls-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            if (!this._isEnabled || !this._selectable) return;
            const value = item.getAttribute('data-value');
            this._selectItem(value);
          });

          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!this._isEnabled || !this._selectable) return;
              const value = item.getAttribute('data-value');
              this._selectItem(value);
            }
          });
        });
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

      // Properties
      get items() { return this._items; }
      set items(v) {
        this._items = v || '';
        this._parseItems();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'items');
      }
      get Items() { return this.items; }
      set Items(v) { this.items = v; }

      get delimiter() { return this._delimiter; }
      set delimiter(v) {
        this._delimiter = v || '|';
        this._parseItems();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'delimiter');
      }
      get Delimiter() { return this.delimiter; }
      set Delimiter(v) { this.delimiter = v; }

      get subDelimiter() { return this._subDelimiter; }
      set subDelimiter(v) {
        this._subDelimiter = v || ':';
        this._parseItems();
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'subDelimiter');
      }
      get SubDelimiter() { return this.subDelimiter; }
      set SubDelimiter(v) { this.subDelimiter = v; }

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
    });
  }
})();
