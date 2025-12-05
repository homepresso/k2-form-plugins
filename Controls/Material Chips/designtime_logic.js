/**
 * Material Chips Control for K2 SmartForms - Design Time
 * Material 3 Design chips for input, filter, or action
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

  if (!window.customElements.get('material-chips')) {
    window.customElements.define('material-chips', class MaterialChips extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._chips = '';
        this._delimiter = '|';
        this._subDelimiter = ':';
        this._variant = 'assist'; // assist, filter, input, suggestion
        this._multiSelect = false;
        this._selectedValues = [];
        this._selectedValue = '';
        this._removable = false;
        this._showCheckmark = true;

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '#FFFBFE';
        this._borderColor = '#79747E';
        this._textColor = '#1C1B1F';
        this._selectedBackgroundColor = '#E8DEF8';
        this._selectedBorderColor = '';
        this._selectedTextColor = '#1D192B';
        this._iconColor = '#49454F';
        this._removeIconColor = '';
        this._elevatedBackgroundColor = '#F3EDF7';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = '14';
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed chips
        this._parsedChips = [];

        // DOM refs
        this._container = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        this.setAttribute('tabindex', '-1'); // Prevent focus in design-time
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseChips();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _parseChips() {
        this._parsedChips = [];
        const chips = this._chips ? this._chips.split(this._delimiter) : [];

        chips.forEach(chip => {
          const trimmed = chip.trim();
          if (!trimmed) return;

          // Format: icon:label:value or label:value or label
          const parts = trimmed.split(this._subDelimiter);

          if (parts.length >= 3) {
            this._parsedChips.push({
              icon: parts[0].trim(),
              label: parts[1].trim(),
              value: parts[2].trim()
            });
          } else if (parts.length === 2) {
            const first = parts[0].trim();
            const second = parts[1].trim();
            // If first part is short and no spaces, treat as icon
            if (first.length <= 20 && !first.includes(' ')) {
              this._parsedChips.push({
                icon: first,
                label: second,
                value: second
              });
            } else {
              this._parsedChips.push({
                icon: '',
                label: first,
                value: second
              });
            }
          } else {
            this._parsedChips.push({
              icon: '',
              label: trimmed,
              value: trimmed
            });
          }
        });
      }

      _render() {
        this.innerHTML = '';
        this._buildChips();
        this._applyStyles();
        this._bindEvents();
      }

      _buildChips() {
        this._container = document.createElement('div');
        this._container.style.pointerEvents = "none"; // Design-time: non-interactive
        this._container.className = `mcp-container mcp-${this._variant}`;
        this._container.setAttribute('role', 'group');

        this._parsedChips.forEach(chip => {
          const chipEl = this._createChip(chip);
          this._container.appendChild(chipEl);
        });

        this.appendChild(this._container);
        this._updateState();
      }

      _createChip(chip) {
        const chipEl = document.createElement('button');
        chipEl.className = 'mcp-chip';
        chipEl.type = 'button';
        chipEl.setAttribute('data-value', chip.value);
        chipEl.setAttribute('role', this._variant === 'filter' ? 'checkbox' : 'button');

        const isSelected = this._multiSelect
          ? this._selectedValues.includes(chip.value)
          : this._selectedValue === chip.value;

        if (isSelected) {
          chipEl.classList.add('mcp-selected');
          chipEl.setAttribute('aria-checked', 'true');
        }

        // Content wrapper
        const content = document.createElement('span');
        content.className = 'mcp-content';

        // Checkmark for filter chips
        if (this._variant === 'filter' && this._showCheckmark && isSelected) {
          const checkmark = document.createElement('span');
          checkmark.className = 'mcp-checkmark material-icons';
          checkmark.textContent = 'check';
          content.appendChild(checkmark);
        }

        // Leading icon
        if (chip.icon && !(this._variant === 'filter' && this._showCheckmark && isSelected)) {
          const icon = document.createElement('span');
          icon.className = 'mcp-icon material-icons';
          icon.textContent = chip.icon;
          content.appendChild(icon);
        }

        // Label
        const label = document.createElement('span');
        label.className = 'mcp-label';
        label.textContent = chip.label;
        content.appendChild(label);

        // Remove button for input chips
        if (this._removable || this._variant === 'input') {
          const removeBtn = document.createElement('span');
          removeBtn.className = 'mcp-remove material-icons';
          removeBtn.textContent = 'close';
          removeBtn.setAttribute('role', 'button');
          removeBtn.setAttribute('aria-label', `Remove ${chip.label}`);
          content.appendChild(removeBtn);
        }

        chipEl.appendChild(content);

        // State layer
        const stateLayer = document.createElement('span');
        stateLayer.className = 'mcp-state-layer';
        chipEl.appendChild(stateLayer);

        return chipEl;
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-flex' : 'none';
        this.style.fontFamily = this._fontFamily;

        // Set CSS custom properties on the container element
        if (this._container) {
          this._container.style.setProperty('--mcp-primary', this._primaryColor);
          this._container.style.setProperty('--mcp-background', this._backgroundColor);
          this._container.style.setProperty('--mcp-border', this._borderColor);
          this._container.style.setProperty('--mcp-text', this._textColor);
          this._container.style.setProperty('--mcp-selected-bg', this._selectedBackgroundColor);
          this._container.style.setProperty('--mcp-selected-text', this._selectedTextColor);
          this._container.style.setProperty('--mcp-icon', this._iconColor);
          this._container.style.setProperty('--mcp-elevated-bg', this._elevatedBackgroundColor);
          if (this._selectedBorderColor) {
            this._container.style.setProperty('--mcp-selected-border', this._selectedBorderColor);
          }
          if (this._removeIconColor) {
            this._container.style.setProperty('--mcp-remove-icon', this._removeIconColor);
          }

          // Apply font styling to chip labels
          const labels = this._container.querySelectorAll('.mcp-label');
          labels.forEach(label => {
            label.style.fontSize = this._fontSize + 'px';
            label.style.fontWeight = this._fontWeight;
            label.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        const chips = this._container.querySelectorAll('.mcp-chip');
        chips.forEach(chip => {
          chip.addEventListener('click', (e) => {
            if (!this._isEnabled) return;

            // Check if remove button was clicked
            if (e.target.classList.contains('mcp-remove')) {
              e.stopPropagation();
              const value = chip.getAttribute('data-value');
              this._removeChip(value);
              return;
            }

            const value = chip.getAttribute('data-value');
            this._selectChip(value);
          });

          chip.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
              if (this._removable || this._variant === 'input') {
                e.preventDefault();
                const value = chip.getAttribute('data-value');
                this._removeChip(value);
              }
            }
          });
        });
      }

      _selectChip(value) {
        if (this._variant === 'filter' || this._multiSelect) {
          const index = this._selectedValues.indexOf(value);
          if (index > -1) {
            this._selectedValues.splice(index, 1);
          } else {
            this._selectedValues.push(value);
          }
          this._selectedValue = this._selectedValues.join(this._delimiter);
        } else {
          if (this._selectedValue === value) {
            this._selectedValue = '';
          } else {
            this._selectedValue = value;
          }
        }

        this._updateSelection();
        this._fireChangeEvent();
      }

      _removeChip(value) {
        // Remove from parsed chips
        const index = this._parsedChips.findIndex(c => c.value === value);
        if (index > -1) {
          this._parsedChips.splice(index, 1);
        }

        // Remove from selected values
        const selectedIndex = this._selectedValues.indexOf(value);
        if (selectedIndex > -1) {
          this._selectedValues.splice(selectedIndex, 1);
        }
        if (this._selectedValue === value) {
          this._selectedValue = '';
        }

        // Update chips string
        this._chips = this._parsedChips.map(c =>
          c.icon ? `${c.icon}${this._subDelimiter}${c.label}${this._subDelimiter}${c.value}` : c.label
        ).join(this._delimiter);

        // Re-render
        this._render();

        this.dispatchEvent(new CustomEvent('ChipRemoved', {
          bubbles: true,
          detail: { value }
        }));
      }

      _updateSelection() {
        const chips = this._container.querySelectorAll('.mcp-chip');
        chips.forEach(chip => {
          const value = chip.getAttribute('data-value');
          const isSelected = this._multiSelect || this._variant === 'filter'
            ? this._selectedValues.includes(value)
            : this._selectedValue === value;

          chip.classList.toggle('mcp-selected', isSelected);
          chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');

          // Update checkmark visibility
          const content = chip.querySelector('.mcp-content');
          const existingCheckmark = content?.querySelector('.mcp-checkmark');
          const existingIcon = content?.querySelector('.mcp-icon');
          const chipData = this._parsedChips.find(c => c.value === value);

          if (this._variant === 'filter' && this._showCheckmark) {
            if (isSelected && !existingCheckmark) {
              const checkmark = document.createElement('span');
              checkmark.className = 'mcp-checkmark material-icons';
              checkmark.textContent = 'check';
              content.insertBefore(checkmark, content.firstChild);
              if (existingIcon) existingIcon.remove();
            } else if (!isSelected && existingCheckmark) {
              existingCheckmark.remove();
              if (chipData?.icon && !content.querySelector('.mcp-icon')) {
                const icon = document.createElement('span');
                icon.className = 'mcp-icon material-icons';
                icon.textContent = chipData.icon;
                content.insertBefore(icon, content.firstChild);
              }
            }
          }
        });
      }

      _fireChangeEvent() {

        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: {
            selectedValue: this._selectedValue,
            selectedValues: [...this._selectedValues]
          }
        }));
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('mcp-disabled', !this._isEnabled);
      }

      // Public methods
      addChip(label, value, icon) {
        const newChip = {
          icon: icon || '',
          label: label,
          value: value || label
        };
        this._parsedChips.push(newChip);

        // Update chips string
        this._chips = this._parsedChips.map(c =>
          c.icon ? `${c.icon}${this._subDelimiter}${c.label}${this._subDelimiter}${c.value}` : c.label
        ).join(this._delimiter);

        this._render();
        this.dispatchEvent(new CustomEvent('ChipAdded', {
          bubbles: true,
          detail: newChip
        }));
      }

      clearSelection() {
        this._selectedValue = '';
        this._selectedValues = [];
        this._updateSelection();
        this._fireChangeEvent();
      }

      // Properties
      get chips() { return this._chips; }
      set chips(v) {
        this._chips = v || '';
        this._parseChips();
        if (this._hasRendered) this._render();
      }
      get Chips() { return this.chips; }
      set Chips(v) { this.chips = v; }

      get delimiter() { return this._delimiter; }
      set delimiter(v) {
        this._delimiter = v || '|';
        this._parseChips();
        if (this._hasRendered) this._render();
      }
      get Delimiter() { return this.delimiter; }
      set Delimiter(v) { this.delimiter = v; }

      get subDelimiter() { return this._subDelimiter; }
      set subDelimiter(v) {
        this._subDelimiter = v || ':';
        this._parseChips();
        if (this._hasRendered) this._render();
      }
      get SubDelimiter() { return this.subDelimiter; }
      set SubDelimiter(v) { this.subDelimiter = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['assist', 'filter', 'input', 'suggestion'];
        this._variant = valid.includes(v) ? v : 'assist';
        if (this._hasRendered) this._render();
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get multiSelect() { return this._multiSelect; }
      set multiSelect(v) {
        this._multiSelect = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get MultiSelect() { return this.multiSelect; }
      set MultiSelect(v) { this.multiSelect = v; }

      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._multiSelect || this._variant === 'filter') {
          this._selectedValues = this._selectedValue ? this._selectedValue.split(this._delimiter).map(s => s.trim()) : [];
        }
        if (this._hasRendered) this._updateSelection();
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get selectedValues() { return this._selectedValues.join(this._delimiter); }
      set selectedValues(v) {
        this._selectedValues = v ? v.split(this._delimiter).map(s => s.trim()) : [];
        this._selectedValue = this._selectedValues.join(this._delimiter);
        if (this._hasRendered) this._updateSelection();
      }
      get SelectedValues() { return this.selectedValues; }
      set SelectedValues(v) { this.selectedValues = v; }

      get removable() { return this._removable; }
      set removable(v) {
        this._removable = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get Removable() { return this.removable; }
      set Removable(v) { this.removable = v; }

      get showCheckmark() { return this._showCheckmark; }
      set showCheckmark(v) {
        this._showCheckmark = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowCheckmark() { return this.showCheckmark; }
      set ShowCheckmark(v) { this.showCheckmark = v; }

      // Color properties
      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get selectedBackgroundColor() { return this._selectedBackgroundColor; }
      set selectedBackgroundColor(v) {
        this._selectedBackgroundColor = v || '#E8DEF8';
        if (this._hasRendered) this._applyStyles();
      }
      get SelectedBackgroundColor() { return this.selectedBackgroundColor; }
      set SelectedBackgroundColor(v) { this.selectedBackgroundColor = v; }

      get selectedBorderColor() { return this._selectedBorderColor; }
      set selectedBorderColor(v) {
        this._selectedBorderColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get SelectedBorderColor() { return this.selectedBorderColor; }
      set SelectedBorderColor(v) { this.selectedBorderColor = v; }

      get selectedTextColor() { return this._selectedTextColor; }
      set selectedTextColor(v) {
        this._selectedTextColor = v || '#1D192B';
        if (this._hasRendered) this._applyStyles();
      }
      get SelectedTextColor() { return this.selectedTextColor; }
      set SelectedTextColor(v) { this.selectedTextColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get removeIconColor() { return this._removeIconColor; }
      set removeIconColor(v) {
        this._removeIconColor = v || '';
        if (this._hasRendered) this._applyStyles();
      }
      get RemoveIconColor() { return this.removeIconColor; }
      set RemoveIconColor(v) { this.removeIconColor = v; }

      get elevatedBackgroundColor() { return this._elevatedBackgroundColor; }
      set elevatedBackgroundColor(v) {
        this._elevatedBackgroundColor = v || '#F3EDF7';
        if (this._hasRendered) this._applyStyles();
      }
      get ElevatedBackgroundColor() { return this.elevatedBackgroundColor; }
      set ElevatedBackgroundColor(v) { this.elevatedBackgroundColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = v || '14';
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get FontWeight() { return this.fontWeight; }
      set FontWeight(v) { this.fontWeight = v; }

      get fontStyle() { return this._fontStyle; }
      set fontStyle(v) {
        this._fontStyle = v || 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get FontStyle() { return this.fontStyle; }
      set FontStyle(v) { this.fontStyle = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'inline-flex' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        this._updateState();
      }
    });
  }
})();
