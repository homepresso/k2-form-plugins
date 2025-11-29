/**
 * Material Date Picker Control for K2 SmartForms
 * Material 3 Design date picker with calendar interface
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

  if (!window.customElements.get('material-date-picker')) {
    window.customElements.define('material-date-picker', class MaterialDatePicker extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = '';
        this._label = 'Date';
        this._placeholder = 'Select date';
        this._variant = 'outlined'; // outlined, filled
        this._dateFormat = 'MM/DD/YYYY'; // MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
        this._minDate = '';
        this._maxDate = '';
        this._required = false;
        this._helperText = '';
        this._errorText = '';
        this._hasError = false;
        this._firstDayOfWeek = 0; // 0 = Sunday, 1 = Monday

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '';
        this._textColor = '#1C1B1F';
        this._labelColor = '#49454F';
        this._borderColor = '#79747E';
        this._errorColor = '#B3261E';
        this._surfaceColor = '#FFFBFE';
        this._headerBackgroundColor = '#EADDFF';
        this._headerTextColor = '#1D192B';
        this._selectedColor = '#6750A4';
        this._selectedTextColor = '#FFFFFF';
        this._todayColor = '#6750A4';
        this._weekdayColor = '#49454F';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._height = 56;
        this._padding = 8;
        this._isVisible = true;
        this._isEnabled = true;
        this._isOpen = false;

        // Internal state
        this._selectedDate = null;
        this._viewDate = new Date();
        this._viewMode = 'days'; // days, months, years

        // DOM refs
        this._container = null;
        this._input = null;
        this._dialog = null;

        // Bound handlers
        this._handleClickOutside = this._handleClickOutside.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleResize = this._handleResize.bind(this);
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._parseValue();
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      disconnectedCallback() {
        document.removeEventListener('click', this._handleClickOutside);
        window.removeEventListener('scroll', this._handleScroll, true);
        window.removeEventListener('resize', this._handleResize);

        // Clean up portaled dialog
        if (this._dialog && this._dialog.parentNode) {
          this._dialog.parentNode.removeChild(this._dialog);
        }
      }

      _parseValue() {
        if (!this._value) {
          this._selectedDate = null;
          this._viewDate = new Date();
          return;
        }

        let date;
        if (this._dateFormat === 'YYYY-MM-DD') {
          date = new Date(this._value + 'T00:00:00');
        } else if (this._dateFormat === 'DD/MM/YYYY') {
          const parts = this._value.split('/');
          if (parts.length === 3) {
            date = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        } else {
          // MM/DD/YYYY
          const parts = this._value.split('/');
          if (parts.length === 3) {
            date = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }

        if (date && !isNaN(date.getTime())) {
          this._selectedDate = date;
          this._viewDate = new Date(date);
        }
      }

      _formatDate(date) {
        if (!date) return '';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        switch (this._dateFormat) {
          case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
          case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
          default: // MM/DD/YYYY
            return `${month}/${day}/${year}`;
        }
      }

      _formatDisplayDate(date) {
        if (!date) return '';
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }

      _render() {
        this.innerHTML = '';
        this._buildInput();
        this._applyStyles();
        this._bindEvents();
      }

      _buildInput() {
        this._container = document.createElement('div');
        this._container.className = `mdp-container mdp-${this._variant}`;

        // Input wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mdp-input-wrapper';

        // Input field
        this._input = document.createElement('div');
        this._input.className = 'mdp-field';
        this._input.tabIndex = 0;
        this._input.setAttribute('role', 'combobox');
        this._input.setAttribute('aria-haspopup', 'dialog');

        const displayText = document.createElement('span');
        displayText.className = 'mdp-display-text';
        if (this._selectedDate) {
          displayText.textContent = this._formatDate(this._selectedDate);
        } else {
          displayText.textContent = this._placeholder;
          displayText.classList.add('mdp-placeholder');
        }
        this._input.appendChild(displayText);

        // Calendar icon
        const icon = document.createElement('span');
        icon.className = 'mdp-icon material-icons';
        icon.textContent = 'calendar_today';
        wrapper.appendChild(icon);

        wrapper.appendChild(this._input);

        // Floating label
        const labelEl = document.createElement('label');
        labelEl.className = 'mdp-label';
        labelEl.textContent = this._label;
        if (this._required) {
          const asterisk = document.createElement('span');
          asterisk.className = 'mdp-required';
          asterisk.textContent = ' *';
          labelEl.appendChild(asterisk);
        }
        wrapper.appendChild(labelEl);

        // Outline (for outlined variant)
        if (this._variant === 'outlined') {
          const outline = document.createElement('fieldset');
          outline.className = 'mdp-outline';
          const legend = document.createElement('legend');
          legend.className = 'mdp-outline-legend';
          legend.innerHTML = `<span>${this._label}${this._required ? ' *' : ''}</span>`;
          outline.appendChild(legend);
          wrapper.appendChild(outline);
        }

        this._container.appendChild(wrapper);

        // Supporting text
        const supporting = document.createElement('div');
        supporting.className = 'mdp-supporting';
        const helperEl = document.createElement('span');
        helperEl.className = 'mdp-helper-text';
        helperEl.textContent = this._hasError ? this._errorText : this._helperText;
        supporting.appendChild(helperEl);
        this._container.appendChild(supporting);

        this.appendChild(this._container);
        this._updateState();
      }

      _buildDialog() {
        if (this._dialog) {
          this._dialog.remove();
        }

        this._dialog = document.createElement('div');
        this._dialog.className = 'mdp-dialog';

        const content = document.createElement('div');
        content.className = 'mdp-dialog-content';

        // Header
        const header = document.createElement('div');
        header.className = 'mdp-header';

        const headerLabel = document.createElement('div');
        headerLabel.className = 'mdp-header-label';
        headerLabel.textContent = 'Select date';

        const headerDate = document.createElement('div');
        headerDate.className = 'mdp-header-date';
        headerDate.textContent = this._selectedDate
          ? this._formatDisplayDate(this._selectedDate)
          : 'No date selected';

        header.appendChild(headerLabel);
        header.appendChild(headerDate);
        content.appendChild(header);

        // Calendar body
        const body = document.createElement('div');
        body.className = 'mdp-body';

        if (this._viewMode === 'days') {
          this._buildDaysView(body);
        } else if (this._viewMode === 'months') {
          this._buildMonthsView(body);
        } else {
          this._buildYearsView(body);
        }

        content.appendChild(body);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'mdp-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'mdp-action-btn';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => this.close());

        const okBtn = document.createElement('button');
        okBtn.className = 'mdp-action-btn mdp-action-primary';
        okBtn.type = 'button';
        okBtn.textContent = 'OK';
        okBtn.addEventListener('click', () => this._confirmSelection());

        actions.appendChild(cancelBtn);
        actions.appendChild(okBtn);
        content.appendChild(actions);

        this._dialog.appendChild(content);

        // Portal dialog to body for overlay behavior
        document.body.appendChild(this._dialog);

        // Position and style the dialog
        this._positionDialog();

        // Apply dialog styles
        this._dialog.style.setProperty('--mdp-primary', this._primaryColor);
        this._dialog.style.setProperty('--mdp-surface', this._surfaceColor);
        this._dialog.style.setProperty('--mdp-header-bg', this._headerBackgroundColor);
        this._dialog.style.setProperty('--mdp-header-text', this._headerTextColor);
        this._dialog.style.setProperty('--mdp-selected', this._selectedColor);
        this._dialog.style.setProperty('--mdp-selected-text', this._selectedTextColor);
        this._dialog.style.setProperty('--mdp-today', this._todayColor);
        this._dialog.style.setProperty('--mdp-weekday', this._weekdayColor);
      }

      _buildDaysView(container) {
        // Navigation
        const nav = document.createElement('div');
        nav.className = 'mdp-nav';

        const monthYearBtn = document.createElement('button');
        monthYearBtn.className = 'mdp-month-year-btn';
        monthYearBtn.type = 'button';
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearBtn.innerHTML = `${monthNames[this._viewDate.getMonth()]} ${this._viewDate.getFullYear()} <span class="material-icons">arrow_drop_down</span>`;
        monthYearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewMode = 'months';
          this._updateDialog();
        });

        const navBtns = document.createElement('div');
        navBtns.className = 'mdp-nav-btns';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'mdp-nav-btn material-icons';
        prevBtn.type = 'button';
        prevBtn.textContent = 'chevron_left';
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setMonth(this._viewDate.getMonth() - 1);
          this._updateDialog();
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'mdp-nav-btn material-icons';
        nextBtn.type = 'button';
        nextBtn.textContent = 'chevron_right';
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setMonth(this._viewDate.getMonth() + 1);
          this._updateDialog();
        });

        navBtns.appendChild(prevBtn);
        navBtns.appendChild(nextBtn);

        nav.appendChild(monthYearBtn);
        nav.appendChild(navBtns);
        container.appendChild(nav);

        // Weekday headers
        const weekdays = document.createElement('div');
        weekdays.className = 'mdp-weekdays';
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const orderedDays = [...dayNames.slice(this._firstDayOfWeek), ...dayNames.slice(0, this._firstDayOfWeek)];
        orderedDays.forEach(day => {
          const dayEl = document.createElement('div');
          dayEl.className = 'mdp-weekday';
          dayEl.textContent = day;
          weekdays.appendChild(dayEl);
        });
        container.appendChild(weekdays);

        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'mdp-days';

        const year = this._viewDate.getFullYear();
        const month = this._viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = (firstDay.getDay() - this._firstDayOfWeek + 7) % 7;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const minDate = this._minDate ? new Date(this._minDate) : null;
        const maxDate = this._maxDate ? new Date(this._maxDate) : null;
        if (minDate) minDate.setHours(0, 0, 0, 0);
        if (maxDate) maxDate.setHours(0, 0, 0, 0);

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        for (let i = startDay - 1; i >= 0; i--) {
          const dayEl = document.createElement('button');
          dayEl.className = 'mdp-day mdp-day-other';
          dayEl.type = 'button';
          dayEl.textContent = prevMonth.getDate() - i;
          dayEl.disabled = true;
          daysGrid.appendChild(dayEl);
        }

        // Current month days
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);

          const dayEl = document.createElement('button');
          dayEl.className = 'mdp-day';
          dayEl.type = 'button';
          dayEl.textContent = day;

          // Today
          if (date.getTime() === today.getTime()) {
            dayEl.classList.add('mdp-today');
          }

          // Selected
          if (this._selectedDate && date.getTime() === this._selectedDate.getTime()) {
            dayEl.classList.add('mdp-selected');
          }

          // Disabled (out of range)
          const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
          if (isDisabled) {
            dayEl.classList.add('mdp-day-disabled');
            dayEl.disabled = true;
          } else {
            dayEl.addEventListener('click', (e) => {
              e.stopPropagation();
              this._selectedDate = date;
              this._updateDialog();
            });
          }

          daysGrid.appendChild(dayEl);
        }

        // Next month days
        const totalCells = startDay + lastDay.getDate();
        const remaining = 42 - totalCells; // 6 rows x 7 days
        for (let i = 1; i <= remaining && totalCells + i <= 42; i++) {
          const dayEl = document.createElement('button');
          dayEl.className = 'mdp-day mdp-day-other';
          dayEl.type = 'button';
          dayEl.textContent = i;
          dayEl.disabled = true;
          daysGrid.appendChild(dayEl);
        }

        container.appendChild(daysGrid);
      }

      _buildMonthsView(container) {
        // Navigation
        const nav = document.createElement('div');
        nav.className = 'mdp-nav';

        const yearBtn = document.createElement('button');
        yearBtn.className = 'mdp-month-year-btn';
        yearBtn.type = 'button';
        yearBtn.innerHTML = `${this._viewDate.getFullYear()} <span class="material-icons">arrow_drop_down</span>`;
        yearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewMode = 'years';
          this._updateDialog();
        });

        const navBtns = document.createElement('div');
        navBtns.className = 'mdp-nav-btns';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'mdp-nav-btn material-icons';
        prevBtn.type = 'button';
        prevBtn.textContent = 'chevron_left';
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setFullYear(this._viewDate.getFullYear() - 1);
          this._updateDialog();
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'mdp-nav-btn material-icons';
        nextBtn.type = 'button';
        nextBtn.textContent = 'chevron_right';
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setFullYear(this._viewDate.getFullYear() + 1);
          this._updateDialog();
        });

        navBtns.appendChild(prevBtn);
        navBtns.appendChild(nextBtn);

        nav.appendChild(yearBtn);
        nav.appendChild(navBtns);
        container.appendChild(nav);

        // Months grid
        const monthsGrid = document.createElement('div');
        monthsGrid.className = 'mdp-months';

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        monthNames.forEach((name, index) => {
          const monthEl = document.createElement('button');
          monthEl.className = 'mdp-month';
          monthEl.type = 'button';
          monthEl.textContent = name;

          if (this._viewDate.getMonth() === index) {
            monthEl.classList.add('mdp-selected');
          }

          monthEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this._viewDate.setMonth(index);
            this._viewMode = 'days';
            this._updateDialog();
          });

          monthsGrid.appendChild(monthEl);
        });

        container.appendChild(monthsGrid);
      }

      _buildYearsView(container) {
        // Navigation
        const nav = document.createElement('div');
        nav.className = 'mdp-nav';

        const currentYear = this._viewDate.getFullYear();
        const startYear = Math.floor(currentYear / 12) * 12;

        const rangeBtn = document.createElement('button');
        rangeBtn.className = 'mdp-month-year-btn';
        rangeBtn.type = 'button';
        rangeBtn.textContent = `${startYear} - ${startYear + 11}`;
        rangeBtn.disabled = true;

        const navBtns = document.createElement('div');
        navBtns.className = 'mdp-nav-btns';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'mdp-nav-btn material-icons';
        prevBtn.type = 'button';
        prevBtn.textContent = 'chevron_left';
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setFullYear(this._viewDate.getFullYear() - 12);
          this._updateDialog();
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'mdp-nav-btn material-icons';
        nextBtn.type = 'button';
        nextBtn.textContent = 'chevron_right';
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._viewDate.setFullYear(this._viewDate.getFullYear() + 12);
          this._updateDialog();
        });

        navBtns.appendChild(prevBtn);
        navBtns.appendChild(nextBtn);

        nav.appendChild(rangeBtn);
        nav.appendChild(navBtns);
        container.appendChild(nav);

        // Years grid
        const yearsGrid = document.createElement('div');
        yearsGrid.className = 'mdp-years';

        for (let i = 0; i < 12; i++) {
          const year = startYear + i;
          const yearEl = document.createElement('button');
          yearEl.className = 'mdp-year';
          yearEl.type = 'button';
          yearEl.textContent = year;

          if (currentYear === year) {
            yearEl.classList.add('mdp-selected');
          }

          yearEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this._viewDate.setFullYear(year);
            this._viewMode = 'months';
            this._updateDialog();
          });

          yearsGrid.appendChild(yearEl);
        }

        container.appendChild(yearsGrid);
      }

      _updateDialog() {
        if (this._dialog) {
          this._isUpdatingDialog = true;
          this._buildDialog();
          // Reset flag after a tick to allow the current event to complete
          setTimeout(() => { this._isUpdatingDialog = false; }, 0);
        }
      }

      _confirmSelection() {
        if (this._selectedDate) {
          this._value = this._formatDate(this._selectedDate);
        }
        this.close();

        // Update display
        const displayText = this._input.querySelector('.mdp-display-text');
        if (displayText) {
          if (this._selectedDate) {
            displayText.textContent = this._value;
            displayText.classList.remove('mdp-placeholder');
          } else {
            displayText.textContent = this._placeholder;
            displayText.classList.add('mdp-placeholder');
          }
        }
        this._container.classList.toggle('mdp-has-value', !!this._selectedDate);

        safeRaisePropertyChanged(this, 'value');
        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: { value: this._value, date: this._selectedDate }
        }));
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;

        // Set CSS custom properties on the container element
        if (this._container) {
          this._container.style.setProperty('--mdp-primary', this._primaryColor);
          this._container.style.setProperty('--mdp-on-surface', this._textColor);
          this._container.style.setProperty('--mdp-outline', this._borderColor);
          this._container.style.setProperty('--mdp-label-color', this._labelColor);
          this._container.style.setProperty('--mdp-error', this._errorColor);
          this._container.style.setProperty('--mdp-surface', this._surfaceColor);
          this._container.style.setProperty('--mdp-height', `${this._height}px`);
          if (this._backgroundColor) {
            this._container.style.setProperty('--mdp-surface-variant', this._backgroundColor);
          }

          // Apply height and padding to input wrapper and field
          const wrapper = this._container.querySelector('.mdp-input-wrapper');
          if (wrapper) {
            wrapper.style.minHeight = `${this._height}px`;
          }
          const field = this._container.querySelector('.mdp-field');
          if (field) {
            field.style.height = `${this._height}px`;
            field.style.padding = `${this._padding}px 16px`;
            field.style.paddingLeft = '48px'; // Account for icon
          }

          // Apply font styling to input/label text elements
          const displayText = this._input?.querySelector('.mdp-display-text');
          if (displayText) {
            displayText.style.fontSize = `${this._fontSize}px`;
            displayText.style.fontWeight = this._fontWeight;
            displayText.style.fontStyle = this._fontStyle;
          }

          const label = this._container.querySelector('.mdp-label');
          if (label) {
            label.style.fontSize = `${this._fontSize}px`;
            label.style.fontWeight = this._fontWeight;
            label.style.fontStyle = this._fontStyle;
          }

          const helperText = this._container.querySelector('.mdp-helper-text');
          if (helperText) {
            helperText.style.fontSize = `${Math.max(12, this._fontSize - 4)}px`;
            helperText.style.fontWeight = this._fontWeight;
            helperText.style.fontStyle = this._fontStyle;
          }
        }
      }

      _bindEvents() {
        this._input.addEventListener('click', () => {
          if (this._isEnabled && !this._isOpen) {
            this.open();
          }
        });

        this._input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!this._isOpen) {
              this.open();
            }
          } else if (e.key === 'Escape' && this._isOpen) {
            this.close();
          }
        });

        document.addEventListener('click', this._handleClickOutside);
      }

      _handleClickOutside(e) {
        // Skip if we're in the middle of updating the dialog (rebuilding DOM)
        if (this._isUpdatingDialog) return;
        if (this._isOpen && !this._container.contains(e.target) && !this._dialog?.contains(e.target)) {
          this.close();
        }
      }

      _handleScroll() {
        if (this._isOpen) {
          this._positionDialog();
        }
      }

      _handleResize() {
        if (this._isOpen) {
          this._positionDialog();
        }
      }

      _positionDialog() {
        if (!this._dialog || !this._input) return;

        const inputRect = this._input.getBoundingClientRect();
        const dialogHeight = this._dialog.offsetHeight || 400;
        const dialogWidth = this._dialog.offsetWidth || 328;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate position - prefer below input, flip above if not enough space
        let top = inputRect.bottom + 4;
        if (top + dialogHeight > viewportHeight && inputRect.top > dialogHeight) {
          top = inputRect.top - dialogHeight - 4;
        }

        // Horizontal positioning - align with input left edge, but ensure it stays on screen
        let left = inputRect.left;
        if (left + dialogWidth > viewportWidth) {
          left = viewportWidth - dialogWidth - 8;
        }
        if (left < 8) left = 8;

        this._dialog.style.position = 'fixed';
        this._dialog.style.top = `${top}px`;
        this._dialog.style.left = `${left}px`;
        this._dialog.style.zIndex = '2147483647';
        this._dialog.style.margin = '0';
      }

      _updateState() {
        if (!this._container) return;

        this._container.classList.toggle('mdp-disabled', !this._isEnabled);
        this._container.classList.toggle('mdp-error', this._hasError);
        this._container.classList.toggle('mdp-has-value', !!this._selectedDate);
        this._container.classList.toggle('mdp-focused', this._isOpen);
      }

      // Public methods
      open() {
        if (!this._isEnabled || this._isOpen) return;
        this._isOpen = true;
        this._viewMode = 'days';
        if (this._selectedDate) {
          this._viewDate = new Date(this._selectedDate);
        } else {
          this._viewDate = new Date();
        }
        this._buildDialog();
        this._updateState();

        // Add scroll/resize listeners for repositioning
        window.addEventListener('scroll', this._handleScroll, true);
        window.addEventListener('resize', this._handleResize);
      }

      close() {
        if (!this._isOpen) return;
        this._isOpen = false;
        if (this._dialog) {
          this._dialog.remove();
          this._dialog = null;
        }
        this._updateState();

        // Remove scroll/resize listeners
        window.removeEventListener('scroll', this._handleScroll, true);
        window.removeEventListener('resize', this._handleResize);
      }

      clear() {
        this._value = '';
        this._selectedDate = null;
        this._viewDate = new Date();

        const displayText = this._input?.querySelector('.mdp-display-text');
        if (displayText) {
          displayText.textContent = this._placeholder;
          displayText.classList.add('mdp-placeholder');
        }
        this._container?.classList.remove('mdp-has-value');
        safeRaisePropertyChanged(this, 'value');
      }

      goToToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this._selectedDate = today;
        this._viewDate = new Date(today);
        this._value = this._formatDate(today);

        const displayText = this._input?.querySelector('.mdp-display-text');
        if (displayText) {
          displayText.textContent = this._value;
          displayText.classList.remove('mdp-placeholder');
        }
        this._container?.classList.add('mdp-has-value');

        if (this._isOpen) {
          this._updateDialog();
        }

        safeRaisePropertyChanged(this, 'value');
      }

      // Properties
      get value() { return this._value; }
      set value(v) {
        this._value = v || '';
        this._parseValue();
        if (this._hasRendered) {
          const displayText = this._input?.querySelector('.mdp-display-text');
          if (displayText) {
            if (this._selectedDate) {
              displayText.textContent = this._formatDate(this._selectedDate);
              displayText.classList.remove('mdp-placeholder');
            } else {
              displayText.textContent = this._placeholder;
              displayText.classList.add('mdp-placeholder');
            }
          }
          this._updateState();
        }
        safeRaisePropertyChanged(this, 'value');
      }
      get Value() { return this.value; }
      set Value(v) { this.value = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || 'Date';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || 'Select date';
        if (this._hasRendered && !this._selectedDate) {
          const displayText = this._input?.querySelector('.mdp-display-text');
          if (displayText) displayText.textContent = this._placeholder;
        }
        safeRaisePropertyChanged(this, 'placeholder');
      }
      get Placeholder() { return this.placeholder; }
      set Placeholder(v) { this.placeholder = v; }

      get variant() { return this._variant; }
      set variant(v) {
        this._variant = (v === 'filled') ? 'filled' : 'outlined';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get dateFormat() { return this._dateFormat; }
      set dateFormat(v) {
        const valid = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
        this._dateFormat = valid.includes(v) ? v : 'MM/DD/YYYY';
        if (this._hasRendered && this._selectedDate) {
          const displayText = this._input?.querySelector('.mdp-display-text');
          if (displayText) {
            displayText.textContent = this._formatDate(this._selectedDate);
          }
          this._value = this._formatDate(this._selectedDate);
        }
        safeRaisePropertyChanged(this, 'dateFormat');
      }
      get DateFormat() { return this.dateFormat; }
      set DateFormat(v) { this.dateFormat = v; }

      get minDate() { return this._minDate; }
      set minDate(v) {
        this._minDate = v || '';
        safeRaisePropertyChanged(this, 'minDate');
      }
      get MinDate() { return this.minDate; }
      set MinDate(v) { this.minDate = v; }

      get maxDate() { return this._maxDate; }
      set maxDate(v) {
        this._maxDate = v || '';
        safeRaisePropertyChanged(this, 'maxDate');
      }
      get MaxDate() { return this.maxDate; }
      set MaxDate(v) { this.maxDate = v; }

      get firstDayOfWeek() { return this._firstDayOfWeek; }
      set firstDayOfWeek(v) {
        this._firstDayOfWeek = (parseInt(v) === 1) ? 1 : 0;
        safeRaisePropertyChanged(this, 'firstDayOfWeek');
      }
      get FirstDayOfWeek() { return this.firstDayOfWeek; }
      set FirstDayOfWeek(v) { this.firstDayOfWeek = v; }

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'required');
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get helperText() { return this._helperText; }
      set helperText(v) {
        this._helperText = v || '';
        if (this._hasRendered && !this._hasError) {
          const helper = this._container?.querySelector('.mdp-helper-text');
          if (helper) helper.textContent = this._helperText;
        }
        safeRaisePropertyChanged(this, 'helperText');
      }
      get HelperText() { return this.helperText; }
      set HelperText(v) { this.helperText = v; }

      get errorText() { return this._errorText; }
      set errorText(v) {
        this._errorText = v || '';
        safeRaisePropertyChanged(this, 'errorText');
      }
      get ErrorText() { return this.errorText; }
      set ErrorText(v) { this.errorText = v; }

      get hasError() { return this._hasError; }
      set hasError(v) {
        this._hasError = (v === true || v === 'true');
        if (this._hasRendered) {
          const helper = this._container?.querySelector('.mdp-helper-text');
          if (helper) helper.textContent = this._hasError ? this._errorText : this._helperText;
          this._updateState();
        }
        safeRaisePropertyChanged(this, 'hasError');
      }
      get HasError() { return this.hasError; }
      set HasError(v) { this.hasError = v; }

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
        this._backgroundColor = v || '';
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

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelColor');
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get errorColor() { return this._errorColor; }
      set errorColor(v) {
        this._errorColor = v || '#B3261E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'errorColor');
      }
      get ErrorColor() { return this.errorColor; }
      set ErrorColor(v) { this.errorColor = v; }

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#FFFBFE';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'surfaceColor');
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get headerBackgroundColor() { return this._headerBackgroundColor; }
      set headerBackgroundColor(v) {
        this._headerBackgroundColor = v || '#EADDFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'headerBackgroundColor');
      }
      get HeaderBackgroundColor() { return this.headerBackgroundColor; }
      set HeaderBackgroundColor(v) { this.headerBackgroundColor = v; }

      get headerTextColor() { return this._headerTextColor; }
      set headerTextColor(v) {
        this._headerTextColor = v || '#1D192B';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'headerTextColor');
      }
      get HeaderTextColor() { return this.headerTextColor; }
      set HeaderTextColor(v) { this.headerTextColor = v; }

      get selectedColor() { return this._selectedColor; }
      set selectedColor(v) {
        this._selectedColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'selectedColor');
      }
      get SelectedColor() { return this.selectedColor; }
      set SelectedColor(v) { this.selectedColor = v; }

      get selectedTextColor() { return this._selectedTextColor; }
      set selectedTextColor(v) {
        this._selectedTextColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'selectedTextColor');
      }
      get SelectedTextColor() { return this.selectedTextColor; }
      set SelectedTextColor(v) { this.selectedTextColor = v; }

      get todayColor() { return this._todayColor; }
      set todayColor(v) {
        this._todayColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'todayColor');
      }
      get TodayColor() { return this.todayColor; }
      set TodayColor(v) { this.todayColor = v; }

      get weekdayColor() { return this._weekdayColor; }
      set weekdayColor(v) {
        this._weekdayColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'weekdayColor');
      }
      get WeekdayColor() { return this.weekdayColor; }
      set WeekdayColor(v) { this.weekdayColor = v; }

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
        this._fontSize = parseInt(v) || 16;
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

      get height() { return this._height; }
      set height(v) {
        this._height = parseInt(v) || 56;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'height');
      }
      get Height() { return this.height; }
      set Height(v) { this.height = v; }

      get padding() { return this._padding; }
      set padding(v) {
        this._padding = parseInt(v) || 8;
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'padding');
      }
      get Padding() { return this.padding; }
      set Padding(v) { this.padding = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'inline-block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        this._updateState();
      }
    });
  }
})();
