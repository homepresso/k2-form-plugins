/**
 * Material Slider Control for K2 SmartForms
 * Material 3 Design slider for selecting values from a range
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
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-slider')) {
    window.customElements.define('material-slider', class MaterialSlider extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = 50;
        this._min = 0;
        this._max = 100;
        this._step = 1;
        this._label = '';
        this._showValue = true;
        this._showTicks = false;
        this._discrete = false;
        this._rangeMode = false;
        this._valueStart = 25;
        this._valueEnd = 75;

        // Color properties
        this._primaryColor = '#6750A4';
        this._trackColor = '#E7E0EC';
        this._trackActiveColor = '';
        this._thumbColor = '';
        this._labelColor = '#49454F';
        this._valueColor = '#1C1B1F';
        this._tickColor = '';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 12;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._container = null;
        this._track = null;
        this._thumb = null;
        this._thumbStart = null;
        this._thumbEnd = null;

        // Interaction state
        this._isDragging = false;
        this._activeThumb = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildSlider();
        this._applyStyles();
        this._bindEvents();
      }

      _buildSlider() {
        this._container = document.createElement('div');
        this._container.className = 'msl-container';
        if (this._discrete) this._container.classList.add('msl-discrete');
        if (this._rangeMode) this._container.classList.add('msl-range');

        // Label
        if (this._label) {
          const labelEl = document.createElement('div');
          labelEl.className = 'msl-label';
          labelEl.textContent = this._label;
          this._container.appendChild(labelEl);
        }

        // Slider wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'msl-wrapper';

        // Track
        this._track = document.createElement('div');
        this._track.className = 'msl-track';

        const trackInactive = document.createElement('div');
        trackInactive.className = 'msl-track-inactive';
        this._track.appendChild(trackInactive);

        const trackActive = document.createElement('div');
        trackActive.className = 'msl-track-active';
        this._track.appendChild(trackActive);

        // Ticks
        if (this._showTicks && this._discrete) {
          const ticksContainer = document.createElement('div');
          ticksContainer.className = 'msl-ticks';
          const numTicks = Math.floor((this._max - this._min) / this._step) + 1;
          for (let i = 0; i < numTicks; i++) {
            const tick = document.createElement('div');
            tick.className = 'msl-tick';
            const percent = (i * this._step) / (this._max - this._min) * 100;
            tick.style.left = `${percent}%`;
            ticksContainer.appendChild(tick);
          }
          this._track.appendChild(ticksContainer);
        }

        wrapper.appendChild(this._track);

        // Thumbs
        if (this._rangeMode) {
          // Start thumb
          this._thumbStart = this._createThumb('start');
          wrapper.appendChild(this._thumbStart);

          // End thumb
          this._thumbEnd = this._createThumb('end');
          wrapper.appendChild(this._thumbEnd);
        } else {
          // Single thumb
          this._thumb = this._createThumb('single');
          wrapper.appendChild(this._thumb);
        }

        this._container.appendChild(wrapper);

        // Value display
        if (this._showValue && !this._discrete) {
          const valueDisplay = document.createElement('div');
          valueDisplay.className = 'msl-value-display';
          if (this._rangeMode) {
            valueDisplay.textContent = `${this._valueStart} - ${this._valueEnd}`;
          } else {
            valueDisplay.textContent = this._value;
          }
          this._container.appendChild(valueDisplay);
        }

        this.appendChild(this._container);
        this._updateTrack();
        this._updateState();
      }

      _createThumb(type) {
        const thumb = document.createElement('div');
        thumb.className = 'msl-thumb';
        thumb.setAttribute('data-thumb', type);
        thumb.setAttribute('role', 'slider');
        thumb.setAttribute('tabindex', '0');

        if (this._rangeMode) {
          const value = type === 'start' ? this._valueStart : this._valueEnd;
          thumb.setAttribute('aria-valuemin', this._min);
          thumb.setAttribute('aria-valuemax', this._max);
          thumb.setAttribute('aria-valuenow', value);
        } else {
          thumb.setAttribute('aria-valuemin', this._min);
          thumb.setAttribute('aria-valuemax', this._max);
          thumb.setAttribute('aria-valuenow', this._value);
        }

        // Thumb handle
        const handle = document.createElement('div');
        handle.className = 'msl-thumb-handle';
        thumb.appendChild(handle);

        // State layer
        const stateLayer = document.createElement('div');
        stateLayer.className = 'msl-state-layer';
        thumb.appendChild(stateLayer);

        // Value indicator (for discrete slider)
        if (this._discrete) {
          const indicator = document.createElement('div');
          indicator.className = 'msl-value-indicator';
          const indicatorValue = document.createElement('span');
          indicatorValue.className = 'msl-indicator-value';
          if (this._rangeMode) {
            indicatorValue.textContent = type === 'start' ? this._valueStart : this._valueEnd;
          } else {
            indicatorValue.textContent = this._value;
          }
          indicator.appendChild(indicatorValue);
          thumb.appendChild(indicator);
        }

        return thumb;
      }

      _updateTrack() {
        const trackActive = this._track?.querySelector('.msl-track-active');
        if (!trackActive) return;

        if (this._rangeMode) {
          const startPercent = ((this._valueStart - this._min) / (this._max - this._min)) * 100;
          const endPercent = ((this._valueEnd - this._min) / (this._max - this._min)) * 100;
          trackActive.style.left = `${startPercent}%`;
          trackActive.style.width = `${endPercent - startPercent}%`;

          if (this._thumbStart) {
            this._thumbStart.style.left = `${startPercent}%`;
            const indicator = this._thumbStart.querySelector('.msl-indicator-value');
            if (indicator) indicator.textContent = this._valueStart;
          }
          if (this._thumbEnd) {
            this._thumbEnd.style.left = `${endPercent}%`;
            const indicator = this._thumbEnd.querySelector('.msl-indicator-value');
            if (indicator) indicator.textContent = this._valueEnd;
          }
        } else {
          const percent = ((this._value - this._min) / (this._max - this._min)) * 100;
          trackActive.style.left = '0';
          trackActive.style.width = `${percent}%`;

          if (this._thumb) {
            this._thumb.style.left = `${percent}%`;
            this._thumb.setAttribute('aria-valuenow', this._value);
            const indicator = this._thumb.querySelector('.msl-indicator-value');
            if (indicator) indicator.textContent = this._value;
          }
        }

        // Update value display
        const valueDisplay = this._container?.querySelector('.msl-value-display');
        if (valueDisplay) {
          if (this._rangeMode) {
            valueDisplay.textContent = `${this._valueStart} - ${this._valueEnd}`;
          } else {
            valueDisplay.textContent = this._value;
          }
        }
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--msl-primary', this._primaryColor);
          this._container.style.setProperty('--msl-track', this._trackColor);
          this._container.style.setProperty('--msl-track-active', this._trackActiveColor || this._primaryColor);
          this._container.style.setProperty('--msl-thumb', this._thumbColor || this._primaryColor);
          this._container.style.setProperty('--msl-label', this._labelColor);
          this._container.style.setProperty('--msl-value', this._valueColor);
          if (this._tickColor) {
            this._container.style.setProperty('--msl-tick', this._tickColor);
          }

          // Apply font styling to label and value display
          const labelEl = this._container.querySelector('.msl-label');
          if (labelEl) {
            labelEl.style.fontSize = `${this._fontSize}px`;
            labelEl.style.fontWeight = this._fontWeight;
            labelEl.style.fontStyle = this._fontStyle;
          }

          const valueDisplay = this._container.querySelector('.msl-value-display');
          if (valueDisplay) {
            valueDisplay.style.fontSize = `${this._fontSize}px`;
            valueDisplay.style.fontWeight = this._fontWeight;
            valueDisplay.style.fontStyle = this._fontStyle;
          }

          // Apply font styling to value indicators (discrete mode)
          const indicators = this._container.querySelectorAll('.msl-indicator-value');
          indicators.forEach(indicator => {
            indicator.style.fontSize = `${this._fontSize}px`;
            indicator.style.fontWeight = this._fontWeight;
            indicator.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        const thumbs = this._rangeMode
          ? [this._thumbStart, this._thumbEnd]
          : [this._thumb];

        thumbs.forEach(thumb => {
          if (!thumb) return;

          // Mouse events
          thumb.addEventListener('mousedown', (e) => this._startDrag(e, thumb));

          // Touch events
          thumb.addEventListener('touchstart', (e) => this._startDrag(e, thumb), { passive: false });

          // Keyboard events
          thumb.addEventListener('keydown', (e) => this._handleKeydown(e, thumb));
        });

        // Track click
        this._track.addEventListener('click', (e) => this._handleTrackClick(e));

        // Document events for dragging
        document.addEventListener('mousemove', (e) => this._drag(e));
        document.addEventListener('mouseup', () => this._endDrag());
        document.addEventListener('touchmove', (e) => this._drag(e), { passive: false });
        document.addEventListener('touchend', () => this._endDrag());
      }

      _startDrag(e, thumb) {
        if (!this._isEnabled) return;
        e.preventDefault();
        this._isDragging = true;
        this._activeThumb = thumb;
        thumb.classList.add('msl-active');
        this._container.classList.add('msl-dragging');
      }

      _drag(e) {
        if (!this._isDragging || !this._activeThumb) return;
        e.preventDefault();

        const rect = this._track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let percent = (clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        let newValue = this._min + percent * (this._max - this._min);
        newValue = this._snapToStep(newValue);

        const thumbType = this._activeThumb.getAttribute('data-thumb');

        if (this._rangeMode) {
          if (thumbType === 'start') {
            this._valueStart = Math.min(newValue, this._valueEnd - this._step);
          } else {
            this._valueEnd = Math.max(newValue, this._valueStart + this._step);
          }
        } else {
          this._value = newValue;
        }

        this._updateTrack();
      }

      _endDrag() {
        if (!this._isDragging) return;
        this._isDragging = false;
        if (this._activeThumb) {
          this._activeThumb.classList.remove('msl-active');
        }
        this._container?.classList.remove('msl-dragging');
        this._activeThumb = null;

        this._fireChangeEvent();
      }

      _handleTrackClick(e) {
        if (!this._isEnabled || this._isDragging) return;

        const rect = this._track.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        let newValue = this._min + percent * (this._max - this._min);
        newValue = this._snapToStep(newValue);

        if (this._rangeMode) {
          // Move closest thumb
          const distToStart = Math.abs(newValue - this._valueStart);
          const distToEnd = Math.abs(newValue - this._valueEnd);
          if (distToStart < distToEnd) {
            this._valueStart = Math.min(newValue, this._valueEnd - this._step);
          } else {
            this._valueEnd = Math.max(newValue, this._valueStart + this._step);
          }
        } else {
          this._value = newValue;
        }

        this._updateTrack();
        this._fireChangeEvent();
      }

      _handleKeydown(e, thumb) {
        if (!this._isEnabled) return;

        const thumbType = thumb.getAttribute('data-thumb');
        let currentValue = this._rangeMode
          ? (thumbType === 'start' ? this._valueStart : this._valueEnd)
          : this._value;

        let newValue = currentValue;
        const largeStep = (this._max - this._min) / 10;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            newValue = Math.min(currentValue + this._step, this._max);
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            newValue = Math.max(currentValue - this._step, this._min);
            e.preventDefault();
            break;
          case 'PageUp':
            newValue = Math.min(currentValue + largeStep, this._max);
            e.preventDefault();
            break;
          case 'PageDown':
            newValue = Math.max(currentValue - largeStep, this._min);
            e.preventDefault();
            break;
          case 'Home':
            newValue = this._min;
            e.preventDefault();
            break;
          case 'End':
            newValue = this._max;
            e.preventDefault();
            break;
          default:
            return;
        }

        newValue = this._snapToStep(newValue);

        if (this._rangeMode) {
          if (thumbType === 'start') {
            this._valueStart = Math.min(newValue, this._valueEnd - this._step);
          } else {
            this._valueEnd = Math.max(newValue, this._valueStart + this._step);
          }
        } else {
          this._value = newValue;
        }

        this._updateTrack();
        this._fireChangeEvent();
      }

      _snapToStep(value) {
        const steps = Math.round((value - this._min) / this._step);
        return Math.max(this._min, Math.min(this._max, this._min + steps * this._step));
      }

      _fireChangeEvent() {
        safeRaisePropertyChanged(this, 'value');
        if (this._rangeMode) {
          safeRaisePropertyChanged(this, 'valueStart');
          safeRaisePropertyChanged(this, 'valueEnd');
        }

        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: this._rangeMode
            ? { valueStart: this._valueStart, valueEnd: this._valueEnd }
            : { value: this._value }
        }));
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('msl-disabled', !this._isEnabled);
      }

      // Properties
      get value() { return this._value; }
      set value(v) {
        this._value = this._snapToStep(parseFloat(v) || 0);
        if (this._hasRendered) this._updateTrack();
        safeRaisePropertyChanged(this, 'value');
      }
      get Value() { return this.value; }
      set Value(v) { this.value = v; }

      get min() { return this._min; }
      set min(v) {
        this._min = parseFloat(v) || 0;
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'min');
      }
      get Min() { return this.min; }
      set Min(v) { this.min = v; }

      get max() { return this._max; }
      set max(v) {
        this._max = parseFloat(v) || 100;
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'max');
      }
      get Max() { return this.max; }
      set Max(v) { this.max = v; }

      get step() { return this._step; }
      set step(v) {
        this._step = Math.max(0.001, parseFloat(v) || 1);
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'step');
      }
      get Step() { return this.step; }
      set Step(v) { this.step = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'label');
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get showValue() { return this._showValue; }
      set showValue(v) {
        this._showValue = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showValue');
      }
      get ShowValue() { return this.showValue; }
      set ShowValue(v) { this.showValue = v; }

      get showTicks() { return this._showTicks; }
      set showTicks(v) {
        this._showTicks = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showTicks');
      }
      get ShowTicks() { return this.showTicks; }
      set ShowTicks(v) { this.showTicks = v; }

      get discrete() { return this._discrete; }
      set discrete(v) {
        this._discrete = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'discrete');
      }
      get Discrete() { return this.discrete; }
      set Discrete(v) { this.discrete = v; }

      get rangeMode() { return this._rangeMode; }
      set rangeMode(v) {
        this._rangeMode = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'rangeMode');
      }
      get RangeMode() { return this.rangeMode; }
      set RangeMode(v) { this.rangeMode = v; }

      get valueStart() { return this._valueStart; }
      set valueStart(v) {
        this._valueStart = this._snapToStep(parseFloat(v) || 0);
        if (this._hasRendered) this._updateTrack();
        safeRaisePropertyChanged(this, 'valueStart');
      }
      get ValueStart() { return this.valueStart; }
      set ValueStart(v) { this.valueStart = v; }

      get valueEnd() { return this._valueEnd; }
      set valueEnd(v) {
        this._valueEnd = this._snapToStep(parseFloat(v) || 100);
        if (this._hasRendered) this._updateTrack();
        safeRaisePropertyChanged(this, 'valueEnd');
      }
      get ValueEnd() { return this.valueEnd; }
      set ValueEnd(v) { this.valueEnd = v; }

      // Color properties
      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'primaryColor');
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get trackColor() { return this._trackColor; }
      set trackColor(v) {
        this._trackColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'trackColor');
      }
      get TrackColor() { return this.trackColor; }
      set TrackColor(v) { this.trackColor = v; }

      get trackActiveColor() { return this._trackActiveColor; }
      set trackActiveColor(v) {
        this._trackActiveColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'trackActiveColor');
      }
      get TrackActiveColor() { return this.trackActiveColor; }
      set TrackActiveColor(v) { this.trackActiveColor = v; }

      get thumbColor() { return this._thumbColor; }
      set thumbColor(v) {
        this._thumbColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'thumbColor');
      }
      get ThumbColor() { return this.thumbColor; }
      set ThumbColor(v) { this.thumbColor = v; }

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'labelColor');
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get valueColor() { return this._valueColor; }
      set valueColor(v) {
        this._valueColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'valueColor');
      }
      get ValueColor() { return this.valueColor; }
      set ValueColor(v) { this.valueColor = v; }

      get tickColor() { return this._tickColor; }
      set tickColor(v) {
        this._tickColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'tickColor');
      }
      get TickColor() { return this.tickColor; }
      set TickColor(v) { this.tickColor = v; }

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
        this._fontSize = parseFloat(v) || 12;
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
    });
  }
})();
