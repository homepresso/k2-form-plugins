/**
 * Material Progress Bar Control for K2 SmartForms - Design-time
 * Material 3 Design progress indicators with linear and circular variants
 */
(function() {
  'use strict';

  // Design-time preview only - non-interactive

  if (typeof window.K2 === "undefined") {
    window.K2 = {};
  }

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('material-progress-bar')) {
    window.customElements.define('material-progress-bar', class MaterialProgressBar extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._value = 50;
        this._variant = 'linear';
        this._mode = 'determinate';
        this._size = 'medium';
        this._thickness = 4;
        this._showLabel = false;
        this._labelPosition = 'outside';
        this._customLabel = '';
        this._animated = true;
        this._buffer = null;
        this._ariaLabel = '';

        // Color properties
        this._primaryColor = '#6750A4';
        this._trackColor = '#E7E0EC';
        this._bufferColor = '#CAC4D0';
        this._labelColor = '#1C1B1F';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 12;
        this._fontWeight = '500';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._container = null;
        this._progressElement = null;
        this._labelElement = null;

        // State
        this._previousValue = 0;
        this._completeEventFired = false;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        this.setAttribute('tabindex', '-1'); // Prevent focus in design-time
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildProgress();
        this._applyStyles();
      }

      _buildProgress() {
        this._container = document.createElement('div');
        this._container.className = `mpb-container mpb-${this._variant}`;
        this._container.style.pointerEvents = "none"; // Design-time: non-interactive

        if (this._variant === 'linear') {
          this._buildLinear();
        } else {
          this._buildCircular();
        }

        this.appendChild(this._container);
        this._updateProgress();
      }

      _buildLinear() {
        const track = document.createElement('div');
        track.className = 'mpb-linear-track';
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', this._mode === 'determinate' ? this._value : '0');

        const ariaLabel = this._ariaLabel || `Progress: ${this._value}%`;
        track.setAttribute('aria-label', ariaLabel);

        if (this._mode === 'indeterminate') {
          track.classList.add('mpb-indeterminate');
        }

        // Buffer bar (behind progress)
        if (this._buffer !== null && this._mode === 'determinate') {
          const bufferBar = document.createElement('div');
          bufferBar.className = 'mpb-linear-buffer';
          track.appendChild(bufferBar);
        }

        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'mpb-linear-bar';
        track.appendChild(progressBar);

        this._progressElement = track;
        this._container.appendChild(track);

        // Label
        if (this._showLabel) {
          this._labelElement = document.createElement('div');
          this._labelElement.className = `mpb-label mpb-label-${this._labelPosition}`;
          this._container.appendChild(this._labelElement);
        }
      }

      _buildCircular() {
        const wrapper = document.createElement('div');
        wrapper.className = `mpb-circular-wrapper mpb-size-${this._size}`;
        wrapper.setAttribute('role', 'progressbar');
        wrapper.setAttribute('aria-valuemin', '0');
        wrapper.setAttribute('aria-valuemax', '100');
        wrapper.setAttribute('aria-valuenow', this._mode === 'determinate' ? this._value : '0');

        const ariaLabel = this._ariaLabel || `Progress: ${this._value}%`;
        wrapper.setAttribute('aria-label', ariaLabel);

        // Get size dimensions
        const sizes = {
          'small': 32,
          'medium': 48,
          'large': 64,
          'xlarge': 96
        };
        const size = sizes[this._size] || 48;
        const strokeWidth = parseInt(this._thickness) || 4;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;

        // SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'mpb-circular-svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

        // Background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('class', 'mpb-circular-bg');
        bgCircle.setAttribute('cx', size / 2);
        bgCircle.setAttribute('cy', size / 2);
        bgCircle.setAttribute('r', radius);
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke-width', strokeWidth);
        svg.appendChild(bgCircle);

        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('class', 'mpb-circular-progress');
        progressCircle.setAttribute('cx', size / 2);
        progressCircle.setAttribute('cy', size / 2);
        progressCircle.setAttribute('r', radius);
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke-width', strokeWidth);
        progressCircle.setAttribute('stroke-dasharray', circumference);
        progressCircle.setAttribute('stroke-dashoffset', circumference);
        progressCircle.setAttribute('stroke-linecap', 'round');

        if (this._mode === 'indeterminate') {
          progressCircle.classList.add('mpb-indeterminate');
        }

        svg.appendChild(progressCircle);

        wrapper.appendChild(svg);
        this._progressElement = wrapper;
        this._container.appendChild(wrapper);

        // Label (center position for circular)
        if (this._showLabel) {
          this._labelElement = document.createElement('div');
          this._labelElement.className = `mpb-label mpb-label-${this._labelPosition}`;

          if (this._labelPosition === 'center') {
            wrapper.appendChild(this._labelElement);
          } else {
            this._container.appendChild(this._labelElement);
          }
        }
      }

      _updateProgress() {
        if (!this._progressElement) return;

        const value = Math.max(0, Math.min(100, parseFloat(this._value) || 0));

        this._previousValue = value;

        if (this._mode === 'indeterminate') {
          // Update ARIA to indicate indeterminate state
          this._progressElement.setAttribute('aria-valuenow', '0');
          this._progressElement.removeAttribute('aria-valuetext');
        } else {
          // Update ARIA attributes
          this._progressElement.setAttribute('aria-valuenow', Math.round(value));
          const ariaLabel = this._ariaLabel || `Progress: ${Math.round(value)}%`;
          this._progressElement.setAttribute('aria-label', ariaLabel);

          if (this._variant === 'linear') {
            const progressBar = this._progressElement.querySelector('.mpb-linear-bar');
            if (progressBar) {
              progressBar.style.transform = `scaleX(${value / 100})`;
            }

            // Update buffer
            if (this._buffer !== null) {
              const bufferValue = Math.max(0, Math.min(100, parseFloat(this._buffer) || 0));
              const bufferBar = this._progressElement.querySelector('.mpb-linear-buffer');
              if (bufferBar) {
                bufferBar.style.transform = `scaleX(${bufferValue / 100})`;
              }
            }
          } else {
            // Circular
            const progressCircle = this._progressElement.querySelector('.mpb-circular-progress');
            if (progressCircle) {
              const circumference = parseFloat(progressCircle.getAttribute('stroke-dasharray'));
              const offset = circumference - (value / 100) * circumference;
              progressCircle.style.strokeDashoffset = offset;
            }
          }
        }

        // Update label
        if (this._labelElement) {
          const labelText = this._customLabel || `${Math.round(value)}%`;
          this._labelElement.textContent = this._mode === 'indeterminate' ? 'Loading...' : labelText;
        }
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        if (this._container) {
          this._container.style.setProperty('--mpb-primary', this._primaryColor);
          this._container.style.setProperty('--mpb-track', this._trackColor);
          this._container.style.setProperty('--mpb-buffer', this._bufferColor);
          this._container.style.setProperty('--mpb-label', this._labelColor);
          this._container.style.setProperty('--mpb-thickness', `${this._thickness}px`);

          // Apply animation class
          if (this._animated && this._mode === 'determinate') {
            this._container.classList.add('mpb-animated');
          } else {
            this._container.classList.remove('mpb-animated');
          }

          // Apply disabled state
          if (!this._isEnabled) {
            this._container.classList.add('mpb-disabled');
          } else {
            this._container.classList.remove('mpb-disabled');
          }

          // Apply font styles to label
          if (this._labelElement) {
            this._labelElement.style.fontSize = `${this._fontSize}px`;
            this._labelElement.style.fontWeight = this._fontWeight;
            this._labelElement.style.fontFamily = this._fontFamily;
            this._labelElement.style.color = this._labelColor;
          }
        }
      }

      // Public methods
      reset() {
        this._value = 0;
        this._completeEventFired = false;
        this._updateProgress();
      }

      complete() {
        this._value = 100;
        this._updateProgress();
      }

      // Properties
      get value() { return this._value; }
      set value(v) {
        this._value = Math.max(0, Math.min(100, parseFloat(v) || 0));
        if (this._hasRendered) this._updateProgress();
      }
      get Value() { return this.value; }
      set Value(v) { this.value = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['linear', 'circular'];
        this._variant = valid.includes(v) ? v : 'linear';
        if (this._hasRendered) this._render();
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get mode() { return this._mode; }
      set mode(v) {
        const valid = ['determinate', 'indeterminate'];
        this._mode = valid.includes(v) ? v : 'determinate';
        if (this._hasRendered) this._render();
      }
      get Mode() { return this.mode; }
      set Mode(v) { this.mode = v; }

      get size() { return this._size; }
      set size(v) {
        const valid = ['small', 'medium', 'large', 'xlarge'];
        this._size = valid.includes(v) ? v : 'medium';
        if (this._hasRendered && this._variant === 'circular') this._render();
      }
      get Size() { return this.size; }
      set Size(v) { this.size = v; }

      get thickness() { return this._thickness; }
      set thickness(v) {
        this._thickness = Math.max(1, parseFloat(v) || 4);
        if (this._hasRendered) this._render();
      }
      get Thickness() { return this.thickness; }
      set Thickness(v) { this.thickness = v; }

      get showLabel() { return this._showLabel; }
      set showLabel(v) {
        this._showLabel = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowLabel() { return this.showLabel; }
      set ShowLabel(v) { this.showLabel = v; }

      get labelPosition() { return this._labelPosition; }
      set labelPosition(v) {
        const valid = ['inside', 'outside', 'center'];
        this._labelPosition = valid.includes(v) ? v : 'outside';
        if (this._hasRendered) this._render();
      }
      get LabelPosition() { return this.labelPosition; }
      set LabelPosition(v) { this.labelPosition = v; }

      get customLabel() { return this._customLabel; }
      set customLabel(v) {
        this._customLabel = v || '';
        if (this._hasRendered) this._updateProgress();
      }
      get CustomLabel() { return this.customLabel; }
      set CustomLabel(v) { this.customLabel = v; }

      get animated() { return this._animated; }
      set animated(v) {
        this._animated = (v === true || v === 'true');
        if (this._hasRendered) this._applyStyles();
      }
      get Animated() { return this.animated; }
      set Animated(v) { this.animated = v; }

      get buffer() { return this._buffer; }
      set buffer(v) {
        const num = parseFloat(v);
        this._buffer = isNaN(num) ? null : Math.max(0, Math.min(100, num));
        if (this._hasRendered) this._render();
      }
      get Buffer() { return this.buffer; }
      set Buffer(v) { this.buffer = v; }

      get ariaLabel() { return this._ariaLabel; }
      set ariaLabel(v) {
        this._ariaLabel = v || '';
        if (this._hasRendered && this._progressElement) {
          const label = this._ariaLabel || `Progress: ${Math.round(this._value)}%`;
          this._progressElement.setAttribute('aria-label', label);
        }
      }
      get AriaLabel() { return this.ariaLabel; }
      set AriaLabel(v) { this.ariaLabel = v; }

      // Color properties
      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get trackColor() { return this._trackColor; }
      set trackColor(v) {
        this._trackColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
      }
      get TrackColor() { return this.trackColor; }
      set TrackColor(v) { this.trackColor = v; }

      get bufferColor() { return this._bufferColor; }
      set bufferColor(v) {
        this._bufferColor = v || '#CAC4D0';
        if (this._hasRendered) this._applyStyles();
      }
      get BufferColor() { return this.bufferColor; }
      set BufferColor(v) { this.bufferColor = v; }

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseFloat(v) || 12;
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get fontWeight() { return this._fontWeight; }
      set fontWeight(v) {
        this._fontWeight = v || '500';
        if (this._hasRendered) this._applyStyles();
      }
      get FontWeight() { return this.fontWeight; }
      set FontWeight(v) { this.fontWeight = v; }

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
