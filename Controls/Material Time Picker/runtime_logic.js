/**
 * Material Time Picker Control for K2 SmartForms
 * Material 3 Design time picker with dial and input modes
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

  if (!window.customElements.get('material-time-picker')) {
    window.customElements.define('material-time-picker', class MaterialTimePicker extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = '';
        this._label = 'Time';
        this._placeholder = 'Select time';
        this._variant = 'outlined'; // outlined, filled
        this._format = '12h'; // 12h, 24h
        this._minuteStep = 1; // 1, 5, 10, 15, 30
        this._required = false;
        this._helperText = '';
        this._errorText = '';
        this._hasError = false;

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '';
        this._textColor = '#1C1B1F';
        this._labelColor = '#49454F';
        this._borderColor = '#79747E';
        this._errorColor = '#B3261E';
        this._surfaceColor = '#FFFBFE';
        this._dialColor = '#EADDFF';
        this._dialTextColor = '#1D192B';
        this._selectedColor = '#6750A4';
        this._selectedTextColor = '#FFFFFF';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;
        this._isOpen = false;

        // Internal state
        this._hours = 12;
        this._minutes = 0;
        this._period = 'AM';
        this._selectingMinutes = false;

        // DOM refs
        this._container = null;
        this._input = null;
        this._dialog = null;

        // Bound handlers
        this._handleClickOutside = this._handleClickOutside.bind(this);
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
      }

      _parseValue() {
        if (!this._value) {
          this._hours = 12;
          this._minutes = 0;
          this._period = 'AM';
          return;
        }

        // Parse time string (HH:MM or HH:MM AM/PM)
        const match = this._value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (match) {
          let hours = parseInt(match[1], 10);
          this._minutes = parseInt(match[2], 10);

          if (match[3]) {
            this._period = match[3].toUpperCase();
            if (this._period === 'PM' && hours < 12) hours += 12;
            if (this._period === 'AM' && hours === 12) hours = 0;
          }

          if (this._format === '12h') {
            this._period = hours >= 12 ? 'PM' : 'AM';
            this._hours = hours % 12 || 12;
          } else {
            this._hours = hours;
          }
        }
      }

      _formatValue() {
        let hours = this._hours;
        const minutes = String(this._minutes).padStart(2, '0');

        if (this._format === '12h') {
          return `${hours}:${minutes} ${this._period}`;
        } else {
          if (this._period === 'PM' && hours < 12) hours += 12;
          if (this._period === 'AM' && hours === 12) hours = 0;
          return `${String(hours).padStart(2, '0')}:${minutes}`;
        }
      }

      _render() {
        this.innerHTML = '';
        this._buildInput();
        this._applyStyles();
        this._bindEvents();
      }

      _buildInput() {
        this._container = document.createElement('div');
        this._container.className = `mtp-container mtp-${this._variant}`;

        // Input wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mtp-input-wrapper';

        // Input field
        this._input = document.createElement('div');
        this._input.className = 'mtp-field';
        this._input.tabIndex = 0;
        this._input.setAttribute('role', 'combobox');
        this._input.setAttribute('aria-haspopup', 'dialog');

        const displayText = document.createElement('span');
        displayText.className = 'mtp-display-text';
        if (this._value) {
          displayText.textContent = this._formatValue();
        } else {
          displayText.textContent = this._placeholder;
          displayText.classList.add('mtp-placeholder');
        }
        this._input.appendChild(displayText);

        // Clock icon
        const icon = document.createElement('span');
        icon.className = 'mtp-icon material-icons';
        icon.textContent = 'schedule';
        wrapper.appendChild(icon);

        wrapper.appendChild(this._input);

        // Floating label
        const labelEl = document.createElement('label');
        labelEl.className = 'mtp-label';
        labelEl.textContent = this._label;
        if (this._required) {
          const asterisk = document.createElement('span');
          asterisk.className = 'mtp-required';
          asterisk.textContent = ' *';
          labelEl.appendChild(asterisk);
        }
        wrapper.appendChild(labelEl);

        // Outline (for outlined variant)
        if (this._variant === 'outlined') {
          const outline = document.createElement('fieldset');
          outline.className = 'mtp-outline';
          const legend = document.createElement('legend');
          legend.className = 'mtp-outline-legend';
          legend.innerHTML = `<span>${this._label}${this._required ? ' *' : ''}</span>`;
          outline.appendChild(legend);
          wrapper.appendChild(outline);
        }

        this._container.appendChild(wrapper);

        // Supporting text
        const supporting = document.createElement('div');
        supporting.className = 'mtp-supporting';
        const helperEl = document.createElement('span');
        helperEl.className = 'mtp-helper-text';
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
        this._dialog.className = 'mtp-dialog';

        // Dialog content
        const content = document.createElement('div');
        content.className = 'mtp-dialog-content';

        // Header with time display
        const header = document.createElement('div');
        header.className = 'mtp-header';

        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'mtp-time-display';

        const hoursBtn = document.createElement('button');
        hoursBtn.className = 'mtp-time-btn mtp-hours-btn' + (!this._selectingMinutes ? ' mtp-active' : '');
        hoursBtn.type = 'button';
        hoursBtn.textContent = this._format === '12h'
          ? String(this._hours)
          : String(this._hours).padStart(2, '0');
        hoursBtn.addEventListener('click', () => {
          this._selectingMinutes = false;
          this._updateDialog();
        });

        const separator = document.createElement('span');
        separator.className = 'mtp-time-separator';
        separator.textContent = ':';

        const minutesBtn = document.createElement('button');
        minutesBtn.className = 'mtp-time-btn mtp-minutes-btn' + (this._selectingMinutes ? ' mtp-active' : '');
        minutesBtn.type = 'button';
        minutesBtn.textContent = String(this._minutes).padStart(2, '0');
        minutesBtn.addEventListener('click', () => {
          this._selectingMinutes = true;
          this._updateDialog();
        });

        timeDisplay.appendChild(hoursBtn);
        timeDisplay.appendChild(separator);
        timeDisplay.appendChild(minutesBtn);

        // AM/PM toggle for 12h format
        if (this._format === '12h') {
          const periodToggle = document.createElement('div');
          periodToggle.className = 'mtp-period-toggle';

          const amBtn = document.createElement('button');
          amBtn.className = 'mtp-period-btn' + (this._period === 'AM' ? ' mtp-active' : '');
          amBtn.type = 'button';
          amBtn.textContent = 'AM';
          amBtn.addEventListener('click', () => {
            this._period = 'AM';
            this._updateDialog();
          });

          const pmBtn = document.createElement('button');
          pmBtn.className = 'mtp-period-btn' + (this._period === 'PM' ? ' mtp-active' : '');
          pmBtn.type = 'button';
          pmBtn.textContent = 'PM';
          pmBtn.addEventListener('click', () => {
            this._period = 'PM';
            this._updateDialog();
          });

          periodToggle.appendChild(amBtn);
          periodToggle.appendChild(pmBtn);
          timeDisplay.appendChild(periodToggle);
        }

        header.appendChild(timeDisplay);
        content.appendChild(header);

        // Clock dial
        const dialContainer = document.createElement('div');
        dialContainer.className = 'mtp-dial-container';

        const dial = document.createElement('div');
        dial.className = 'mtp-dial';

        // Center dot
        const centerDot = document.createElement('div');
        centerDot.className = 'mtp-center-dot';
        dial.appendChild(centerDot);

        // Clock hand
        const hand = document.createElement('div');
        hand.className = 'mtp-hand';
        dial.appendChild(hand);

        // Numbers
        if (this._selectingMinutes) {
          // Minutes (0, 5, 10, ... 55)
          for (let i = 0; i < 12; i++) {
            const minute = i * 5;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 100;
            const x = 120 + radius * Math.cos(angle);
            const y = 120 + radius * Math.sin(angle);

            const num = document.createElement('div');
            num.className = 'mtp-number' + (this._minutes === minute ? ' mtp-selected' : '');
            num.style.left = `${x}px`;
            num.style.top = `${y}px`;
            num.textContent = String(minute).padStart(2, '0');
            num.addEventListener('click', () => {
              this._minutes = minute;
              this._updateDialog();
            });
            dial.appendChild(num);
          }

          // Update hand position
          const minuteAngle = (this._minutes / 60) * 360 - 90;
          hand.style.transform = `rotate(${minuteAngle}deg)`;
        } else {
          // Hours
          const maxHour = this._format === '12h' ? 12 : 24;
          const displayHours = this._format === '12h' ? 12 : (this._format === '24h' ? 12 : 24);

          for (let i = 1; i <= displayHours; i++) {
            const hour = this._format === '12h' ? i : i;
            const angle = ((i % 12) * 30 - 90) * (Math.PI / 180);
            const radius = 100;
            const x = 120 + radius * Math.cos(angle);
            const y = 120 + radius * Math.sin(angle);

            const num = document.createElement('div');
            num.className = 'mtp-number' + (this._hours === hour ? ' mtp-selected' : '');
            num.style.left = `${x}px`;
            num.style.top = `${y}px`;
            num.textContent = this._format === '24h' ? String(hour).padStart(2, '0') : String(hour);
            num.addEventListener('click', () => {
              this._hours = hour;
              this._selectingMinutes = true;
              this._updateDialog();
            });
            dial.appendChild(num);
          }

          // Inner circle for 24h format (13-24 / 0)
          if (this._format === '24h') {
            for (let i = 0; i < 12; i++) {
              const hour = i === 0 ? 0 : i + 12;
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const radius = 65;
              const x = 120 + radius * Math.cos(angle);
              const y = 120 + radius * Math.sin(angle);

              const num = document.createElement('div');
              num.className = 'mtp-number mtp-inner' + (this._hours === hour ? ' mtp-selected' : '');
              num.style.left = `${x}px`;
              num.style.top = `${y}px`;
              num.textContent = String(hour).padStart(2, '0');
              num.addEventListener('click', () => {
                this._hours = hour;
                this._selectingMinutes = true;
                this._updateDialog();
              });
              dial.appendChild(num);
            }
          }

          // Update hand position
          const hourValue = this._format === '12h' ? this._hours : (this._hours % 12);
          const hourAngle = (hourValue / 12) * 360 - 90;
          hand.style.transform = `rotate(${hourAngle}deg)`;
          if (this._format === '24h' && (this._hours === 0 || this._hours > 12)) {
            hand.classList.add('mtp-hand-inner');
          }
        }

        dialContainer.appendChild(dial);
        content.appendChild(dialContainer);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'mtp-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'mtp-action-btn';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => this.close());

        const okBtn = document.createElement('button');
        okBtn.className = 'mtp-action-btn mtp-action-primary';
        okBtn.type = 'button';
        okBtn.textContent = 'OK';
        okBtn.addEventListener('click', () => this._confirmSelection());

        actions.appendChild(cancelBtn);
        actions.appendChild(okBtn);
        content.appendChild(actions);

        this._dialog.appendChild(content);
        this._container.appendChild(this._dialog);

        // Apply dialog styles
        this._dialog.style.setProperty('--mtp-primary', this._primaryColor);
        this._dialog.style.setProperty('--mtp-surface', this._surfaceColor);
        this._dialog.style.setProperty('--mtp-dial-bg', this._dialColor);
        this._dialog.style.setProperty('--mtp-dial-text', this._dialTextColor);
        this._dialog.style.setProperty('--mtp-selected', this._selectedColor);
        this._dialog.style.setProperty('--mtp-selected-text', this._selectedTextColor);
      }

      _updateDialog() {
        if (this._dialog) {
          this._buildDialog();
        }
      }

      _confirmSelection() {
        this._value = this._formatValue();
        this.close();

        // Update display
        const displayText = this._input.querySelector('.mtp-display-text');
        if (displayText) {
          displayText.textContent = this._value;
          displayText.classList.remove('mtp-placeholder');
        }
        this._container.classList.add('mtp-has-value');

        safeRaisePropertyChanged(this, 'value');
        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: { value: this._value, hours: this._hours, minutes: this._minutes, period: this._period }
        }));
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'inline-block' : 'none';
        this.style.fontFamily = this._fontFamily;
        this.style.fontSize = `${this._fontSize}px`;
        this.style.fontWeight = this._fontWeight;
        this.style.fontStyle = this._fontStyle;

        if (this._container) {
          this._container.style.setProperty('--mtp-primary', this._primaryColor);
          this._container.style.setProperty('--mtp-on-surface', this._textColor);
          this._container.style.setProperty('--mtp-outline', this._borderColor);
          this._container.style.setProperty('--mtp-label-color', this._labelColor);
          this._container.style.setProperty('--mtp-error', this._errorColor);
          this._container.style.setProperty('--mtp-surface', this._surfaceColor);
          if (this._backgroundColor) {
            this._container.style.setProperty('--mtp-surface-variant', this._backgroundColor);
          }

          // Apply font properties to input and label elements
          const displayText = this._input?.querySelector('.mtp-display-text');
          if (displayText) {
            displayText.style.fontSize = `${this._fontSize}px`;
            displayText.style.fontWeight = this._fontWeight;
            displayText.style.fontStyle = this._fontStyle;
          }

          const label = this._container.querySelector('.mtp-label');
          if (label) {
            label.style.fontSize = `${this._fontSize}px`;
            label.style.fontWeight = this._fontWeight;
            label.style.fontStyle = this._fontStyle;
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
        if (this._isOpen && !this._container.contains(e.target)) {
          this.close();
        }
      }

      _updateState() {
        if (!this._container) return;

        this._container.classList.toggle('mtp-disabled', !this._isEnabled);
        this._container.classList.toggle('mtp-error', this._hasError);
        this._container.classList.toggle('mtp-has-value', !!this._value);
        this._container.classList.toggle('mtp-focused', this._isOpen);
      }

      // Public methods
      open() {
        if (!this._isEnabled || this._isOpen) return;
        this._isOpen = true;
        this._selectingMinutes = false;
        this._buildDialog();
        this._updateState();
      }

      close() {
        if (!this._isOpen) return;
        this._isOpen = false;
        if (this._dialog) {
          this._dialog.remove();
          this._dialog = null;
        }
        this._updateState();
      }

      clear() {
        this._value = '';
        this._hours = 12;
        this._minutes = 0;
        this._period = 'AM';

        const displayText = this._input?.querySelector('.mtp-display-text');
        if (displayText) {
          displayText.textContent = this._placeholder;
          displayText.classList.add('mtp-placeholder');
        }
        this._container?.classList.remove('mtp-has-value');
        safeRaisePropertyChanged(this, 'value');
      }

      // Properties
      get value() { return this._value; }
      set value(v) {
        this._value = v || '';
        this._parseValue();
        if (this._hasRendered) {
          const displayText = this._input?.querySelector('.mtp-display-text');
          if (displayText) {
            if (this._value) {
              displayText.textContent = this._formatValue();
              displayText.classList.remove('mtp-placeholder');
            } else {
              displayText.textContent = this._placeholder;
              displayText.classList.add('mtp-placeholder');
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
        this._label = v || 'Time';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || 'Select time';
        if (this._hasRendered && !this._value) {
          const displayText = this._input?.querySelector('.mtp-display-text');
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

      get format() { return this._format; }
      set format(v) {
        this._format = (v === '24h') ? '24h' : '12h';
        this._parseValue();
        if (this._hasRendered) {
          const displayText = this._input?.querySelector('.mtp-display-text');
          if (displayText && this._value) {
            displayText.textContent = this._formatValue();
          }
        }
        safeRaisePropertyChanged(this, 'format');
      }
      get Format() { return this.format; }
      set Format(v) { this.format = v; }

      get minuteStep() { return this._minuteStep; }
      set minuteStep(v) {
        const valid = [1, 5, 10, 15, 30];
        this._minuteStep = valid.includes(parseInt(v)) ? parseInt(v) : 1;
        safeRaisePropertyChanged(this, 'minuteStep');
      }
      get MinuteStep() { return this.minuteStep; }
      set MinuteStep(v) { this.minuteStep = v; }

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
          const helper = this._container?.querySelector('.mtp-helper-text');
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
          const helper = this._container?.querySelector('.mtp-helper-text');
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

      get dialColor() { return this._dialColor; }
      set dialColor(v) {
        this._dialColor = v || '#EADDFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'dialColor');
      }
      get DialColor() { return this.dialColor; }
      set DialColor(v) { this.dialColor = v; }

      get dialTextColor() { return this._dialTextColor; }
      set dialTextColor(v) {
        this._dialTextColor = v || '#1D192B';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'dialTextColor');
      }
      get DialTextColor() { return this.dialTextColor; }
      set DialTextColor(v) { this.dialTextColor = v; }

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
        this._fontSize = v || 16;
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
