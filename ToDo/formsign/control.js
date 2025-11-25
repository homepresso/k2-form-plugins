/**
 * Signature Pad Control for K2 SmartForms
 */
(function() {
  'use strict';

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2 && typeof window.K2.RaisePropertyChanged === 'function') {
      window.K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  const template = document.createElement('template');
  template.innerHTML = `
    <div class="sig-wrapper">
      <canvas class="sig-canvas"></canvas>
      <div class="sig-placeholder">Sign here</div>
      <button type="button" class="sig-clear-btn">Clear</button>
    </div>
  `;

  if (!window.customElements.get('signature-pad')) {
    window.customElements.define('signature-pad', class SignaturePad extends HTMLElement {
      constructor() {
        super();
        this._value = null;
        this._hasRendered = false;
        this._strokes = [];

        // Defaults
        this._penColor = '#000000';
        this._penWidth = 2;
        this._backgroundColor = '#ffffff';
        this._showClearButton = true;
        this._placeholderText = 'Sign here';
        this._controlWidth = 400;
        this._controlHeight = 200;
        this._isVisible = true;
        this._isEnabled = true;
        this._isReadOnly = false;

        // Drawing state
        this._isDrawing = false;
        this._lastX = 0;
        this._lastY = 0;
        this._currentStroke = null;

        // DOM refs
        this._wrapper = null;
        this._canvas = null;
        this._ctx = null;
        this._placeholder = null;
        this._clearBtn = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        const w = this._controlWidth;
        const h = this._controlHeight;

        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        this._wrapper = this.querySelector('.sig-wrapper');
        this._canvas = this.querySelector('.sig-canvas');
        this._placeholder = this.querySelector('.sig-placeholder');
        this._clearBtn = this.querySelector('.sig-clear-btn');

        this.style.cssText = `display:inline-block;width:${w}px;height:${h}px;overflow:hidden;`;
        this._wrapper.style.cssText = `position:relative;width:${w}px;height:${h}px;background:${this._backgroundColor};border:1px solid #ccc;border-radius:4px;box-sizing:border-box;overflow:hidden;`;

        const canvasW = w - 2;
        const canvasH = h - 2;
        this._canvas.width = canvasW;
        this._canvas.height = canvasH;
        this._canvas.style.cssText = `display:block;width:${canvasW}px;height:${canvasH}px;cursor:crosshair;touch-action:none;`;

        this._placeholder.textContent = this._placeholderText;
        this._placeholder.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#999;font-size:14px;font-style:italic;pointer-events:none;`;

        this._clearBtn.style.cssText = `position:absolute;top:8px;right:8px;padding:4px 12px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;font-size:12px;z-index:10;`;

        this._ctx = this._canvas.getContext('2d');
        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.fillRect(0, 0, canvasW, canvasH);

        this._bindEvents();
        this._updateUI();

        if (this._strokes.length > 0) {
          this._redraw();
        }
      }

      _bindEvents() {
        const canvas = this._canvas;
        const self = this;

        canvas.addEventListener('mousedown', function(e) { self._onPointerDown(e); });
        canvas.addEventListener('mousemove', function(e) { self._onPointerMove(e); });
        canvas.addEventListener('mouseup', function(e) { self._onPointerUp(e); });
        canvas.addEventListener('mouseleave', function(e) { self._onPointerUp(e); });

        canvas.addEventListener('touchstart', function(e) {
          e.preventDefault();
          if (e.touches.length === 1) self._onPointerDown(e.touches[0]);
        }, { passive: false });
        
        canvas.addEventListener('touchmove', function(e) {
          e.preventDefault();
          if (e.touches.length === 1) self._onPointerMove(e.touches[0]);
        }, { passive: false });
        
        canvas.addEventListener('touchend', function(e) { self._onPointerUp(e); });

        this._clearBtn.addEventListener('click', function() { self.clear(); });
      }

      _getPos(e) {
        const rect = this._canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }

      _onPointerDown(e) {
        if (this._isReadOnly || !this._isEnabled) return;
        
        const pos = this._getPos(e);
        this._isDrawing = true;
        this._lastX = pos.x;
        this._lastY = pos.y;
        this._currentStroke = {
          color: this._penColor,
          width: this._penWidth,
          points: [{x: pos.x, y: pos.y, t: Date.now()}]
        };

        this._ctx.beginPath();
        this._ctx.arc(pos.x, pos.y, this._penWidth / 2, 0, Math.PI * 2);
        this._ctx.fillStyle = this._penColor;
        this._ctx.fill();
      }

      _onPointerMove(e) {
        if (!this._isDrawing) return;
        
        const pos = this._getPos(e);
        this._currentStroke.points.push({x: pos.x, y: pos.y, t: Date.now()});

        this._ctx.beginPath();
        this._ctx.moveTo(this._lastX, this._lastY);
        this._ctx.lineTo(pos.x, pos.y);
        this._ctx.strokeStyle = this._penColor;
        this._ctx.lineWidth = this._penWidth;
        this._ctx.lineCap = 'round';
        this._ctx.lineJoin = 'round';
        this._ctx.stroke();

        this._lastX = pos.x;
        this._lastY = pos.y;
      }

      _onPointerUp(e) {
        if (!this._isDrawing) return;
        
        if (this._currentStroke && this._currentStroke.points.length > 0) {
          this._strokes.push(this._currentStroke);
          this._onValueChanged();
        }
        this._isDrawing = false;
        this._currentStroke = null;
      }

      _redraw() {
        if (!this._ctx) return;

        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        for (const stroke of this._strokes) {
          if (!stroke.points || stroke.points.length === 0) continue;

          const color = stroke.color || this._penColor;
          const width = stroke.width || this._penWidth;

          if (stroke.points.length === 1) {
            this._ctx.beginPath();
            this._ctx.arc(stroke.points[0].x, stroke.points[0].y, width / 2, 0, Math.PI * 2);
            this._ctx.fillStyle = color;
            this._ctx.fill();
          } else {
            this._ctx.beginPath();
            this._ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              this._ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            this._ctx.strokeStyle = color;
            this._ctx.lineWidth = width;
            this._ctx.lineCap = 'round';
            this._ctx.lineJoin = 'round';
            this._ctx.stroke();
          }
        }

        this._updatePlaceholder();
      }

      _onValueChanged() {
        this._updatePlaceholder();
        safeRaisePropertyChanged(this, 'Value');
        this.dispatchEvent(new Event('change', {bubbles: true}));
        this.dispatchEvent(new CustomEvent('Changed', {detail: {value: this.Value}}));
      }

      _updatePlaceholder() {
        if (this._placeholder) {
          this._placeholder.style.display = this._strokes.length > 0 ? 'none' : 'block';
        }
      }

      _updateUI() {
        if (this._clearBtn) {
          const show = this._showClearButton && this._isEnabled && !this._isReadOnly;
          this._clearBtn.style.display = show ? 'block' : 'none';
        }
        if (this._canvas) {
          this._canvas.style.cursor = (this._isReadOnly || !this._isEnabled) ? 'default' : 'crosshair';
        }
        if (this._wrapper) {
          this._wrapper.style.opacity = this._isEnabled ? '1' : '0.6';
        }
      }

      clear() {
        this._strokes = [];
        if (this._ctx) {
          this._ctx.fillStyle = this._backgroundColor;
          this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
        this._updatePlaceholder();
        safeRaisePropertyChanged(this, 'Value');
        this.dispatchEvent(new Event('change', {bubbles: true}));
        this.dispatchEvent(new CustomEvent('Cleared'));
      }

      refreshData() {
        this._redraw();
      }

      get Value() {
        if (this._strokes.length === 0) return '';
        return JSON.stringify({
          version: 1,
          width: this._canvas ? this._canvas.width : this._controlWidth - 2,
          height: this._canvas ? this._canvas.height : this._controlHeight - 2,
          strokes: this._strokes
        });
      }

      set Value(val) {
        if (!val || (typeof val === 'string' && !val.trim())) {
          this._strokes = [];
        } else {
          try {
            const data = typeof val === 'string' ? JSON.parse(val) : val;
            this._strokes = data.strokes || [];
          } catch (e) {
            this._strokes = [];
          }
        }
        if (this._hasRendered) this._redraw();
        safeRaisePropertyChanged(this, 'Value');
      }

      get controlWidth() { return this._controlWidth; }
      set controlWidth(v) {
        this._controlWidth = parseInt(v) || 400;
        if (this._hasRendered) this._render();
      }
      get ControlWidth() { return this.controlWidth; }
      set ControlWidth(v) { this.controlWidth = v; }

      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) {
        this._controlHeight = parseInt(v) || 200;
        if (this._hasRendered) this._render();
      }
      get ControlHeight() { return this.controlHeight; }
      set ControlHeight(v) { this.controlHeight = v; }

      get penColor() { return this._penColor; }
      set penColor(v) { this._penColor = v || '#000000'; }
      get PenColor() { return this.penColor; }
      set PenColor(v) { this.penColor = v; }

      get penWidth() { return this._penWidth; }
      set penWidth(v) { this._penWidth = parseFloat(v) || 2; }
      get PenWidth() { return this.penWidth; }
      set PenWidth(v) { this.penWidth = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#ffffff';
        if (this._hasRendered) this._redraw();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get showClearButton() { return this._showClearButton; }
      set showClearButton(v) {
        this._showClearButton = (v === true || v === 'true');
        if (this._hasRendered) this._updateUI();
      }
      get ShowClearButton() { return this.showClearButton; }
      set ShowClearButton(v) { this.showClearButton = v; }

      get placeholderText() { return this._placeholderText; }
      set placeholderText(v) {
        this._placeholderText = v || 'Sign here';
        if (this._placeholder) this._placeholder.textContent = this._placeholderText;
      }
      get PlaceholderText() { return this.placeholderText; }
      set PlaceholderText(v) { this.placeholderText = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'inline-block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._updateUI();
      }

      get IsReadOnly() { return this._isReadOnly; }
      set IsReadOnly(val) {
        this._isReadOnly = (val === true || val === 'true');
        if (this._hasRendered) this._updateUI();
      }
    });
  }
})();
