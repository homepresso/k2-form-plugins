/**
 * Rich Text Editor Control for K2 SmartForms
 * Material 3 Design with comprehensive formatting options
 */
(function() {
  'use strict';

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2 && typeof window.K2.RaisePropertyChanged === 'function') {
      window.K2.RaisePropertyChanged(ctrl, prop);
    }
  }

  // Load Material Icons for toolbar
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="Material+Icons"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }

  // Load Google Fonts for font family options
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=Source+Code+Pro:wght@400;500&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=Raleway:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Oswald:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Rubik:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;600;700&family=Inconsolata:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Caveat:wght@400;500;600;700&family=Shadows+Into+Light&display=swap';
    document.head.appendChild(link);
  }

  const FONTS = [
    { name: 'Default', value: '' },
    // Sans-serif
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: '"Open Sans", sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Nunito', value: 'Nunito, sans-serif' },
    { name: 'Raleway', value: 'Raleway, sans-serif' },
    { name: 'PT Sans', value: '"PT Sans", sans-serif' },
    { name: 'Oswald', value: 'Oswald, sans-serif' },
    { name: 'Quicksand', value: 'Quicksand, sans-serif' },
    { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
    { name: 'Rubik', value: 'Rubik, sans-serif' },
    { name: 'Work Sans', value: '"Work Sans", sans-serif' },
    { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Tahoma', value: 'Tahoma, sans-serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    // Serif
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'PT Serif', value: '"PT Serif", serif' },
    { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
    { name: 'Crimson Text', value: '"Crimson Text", serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Garamond', value: 'Garamond, serif' },
    { name: 'Palatino', value: '"Palatino Linotype", Palatino, serif' },
    // Monospace
    { name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
    { name: 'Inconsolata', value: 'Inconsolata, monospace' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Consolas', value: 'Consolas, monospace' },
    // Handwriting / Display
    { name: 'Dancing Script', value: '"Dancing Script", cursive' },
    { name: 'Pacifico', value: 'Pacifico, cursive' },
    { name: 'Caveat', value: 'Caveat, cursive' },
    { name: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' }
  ];

  const FONT_SIZES = [
    { name: '8', value: '8px' },
    { name: '10', value: '10px' },
    { name: '12', value: '12px' },
    { name: '14', value: '14px' },
    { name: '16', value: '16px' },
    { name: '18', value: '18px' },
    { name: '20', value: '20px' },
    { name: '24', value: '24px' },
    { name: '28', value: '28px' },
    { name: '32', value: '32px' },
    { name: '36', value: '36px' },
    { name: '48', value: '48px' },
    { name: '72', value: '72px' }
  ];

  const COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
    '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
  ];

  if (!window.customElements.get('rich-text-editor')) {
    window.customElements.define('rich-text-editor', class RichTextEditor extends HTMLElement {
      constructor() {
        super();
        this._hasRendered = false;
        this._value = '';
        this._placeholder = 'Start typing...';
        this._controlWidth = 350;
        this._controlHeight = 500;
        this._showToolbar = true;
        this._primaryColor = '#6750A4';
        this._isVisible = true;
        this._isEnabled = true;
        this._isReadOnly = false;

        // DOM refs
        this._container = null;
        this._toolbar = null;
        this._editor = null;
        this._colorPicker = null;
        this._bgColorPicker = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadMaterialIcons();
        loadGoogleFonts();
        setTimeout(() => {
          this._render();
          this._hasRendered = true;
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildContainer();
        this._buildToolbar();
        this._buildEditor();
        this._applyStyles();
        this._bindEvents();

        if (this._value) {
          this._editor.innerHTML = this._value;
        }
      }

      _buildContainer() {
        this._container = document.createElement('div');
        this._container.className = 'rte-container';
        this.appendChild(this._container);
      }

      _buildToolbar() {
        this._toolbar = document.createElement('div');
        this._toolbar.className = 'rte-toolbar';

        // Row 1: History, Font, Size
        const row1 = document.createElement('div');
        row1.className = 'rte-toolbar-row';

        // Undo/Redo
        row1.appendChild(this._createToolbarGroup([
          { icon: 'undo', command: 'undo', title: 'Undo' },
          { icon: 'redo', command: 'redo', title: 'Redo' }
        ]));

        // Font Family dropdown
        row1.appendChild(this._createFontSelect());

        // Font Size dropdown
        row1.appendChild(this._createFontSizeSelect());

        // Row 2: Basic formatting
        const row2 = document.createElement('div');
        row2.className = 'rte-toolbar-row';

        // Text formatting
        row2.appendChild(this._createToolbarGroup([
          { icon: 'format_bold', command: 'bold', title: 'Bold (Ctrl+B)' },
          { icon: 'format_italic', command: 'italic', title: 'Italic (Ctrl+I)' },
          { icon: 'format_underlined', command: 'underline', title: 'Underline (Ctrl+U)' },
          { icon: 'strikethrough_s', command: 'strikeThrough', title: 'Strikethrough' }
        ]));

        // Text color & highlight
        row2.appendChild(this._createColorGroup());

        // Subscript/Superscript
        row2.appendChild(this._createToolbarGroup([
          { icon: 'subscript', command: 'subscript', title: 'Subscript', text: 'X₂' },
          { icon: 'superscript', command: 'superscript', title: 'Superscript', text: 'X²' }
        ]));

        // Row 3: Alignment, Lists, Indent
        const row3 = document.createElement('div');
        row3.className = 'rte-toolbar-row';

        // Alignment
        row3.appendChild(this._createToolbarGroup([
          { icon: 'format_align_left', command: 'justifyLeft', title: 'Align Left' },
          { icon: 'format_align_center', command: 'justifyCenter', title: 'Align Center' },
          { icon: 'format_align_right', command: 'justifyRight', title: 'Align Right' },
          { icon: 'format_align_justify', command: 'justifyFull', title: 'Justify' }
        ]));

        // Lists
        row3.appendChild(this._createToolbarGroup([
          { icon: 'format_list_bulleted', command: 'insertUnorderedList', title: 'Bullet List' },
          { icon: 'format_list_numbered', command: 'insertOrderedList', title: 'Numbered List' }
        ]));

        // Indent
        row3.appendChild(this._createToolbarGroup([
          { icon: 'format_indent_decrease', command: 'outdent', title: 'Decrease Indent' },
          { icon: 'format_indent_increase', command: 'indent', title: 'Increase Indent' }
        ]));

        // Row 4: Headings, special inserts
        const row4 = document.createElement('div');
        row4.className = 'rte-toolbar-row';

        // Heading dropdown
        row4.appendChild(this._createHeadingSelect());

        // Links, images, etc
        row4.appendChild(this._createToolbarGroup([
          { icon: 'link', command: 'createLink', title: 'Insert Link', prompt: true },
          { icon: 'link_off', command: 'unlink', title: 'Remove Link' },
          { icon: 'image', command: 'insertImage', title: 'Insert Image', prompt: true },
          { icon: 'horizontal_rule', command: 'insertHorizontalRule', title: 'Horizontal Line' }
        ]));

        // Quote & Code
        row4.appendChild(this._createToolbarGroup([
          { icon: 'format_quote', command: 'formatBlock', value: 'blockquote', title: 'Block Quote' },
          { icon: 'code', command: 'formatBlock', value: 'pre', title: 'Code Block' }
        ]));

        // Clear formatting
        row4.appendChild(this._createToolbarGroup([
          { icon: 'format_clear', command: 'removeFormat', title: 'Clear Formatting' }
        ]));

        this._toolbar.appendChild(row1);
        this._toolbar.appendChild(row2);
        this._toolbar.appendChild(row3);
        this._toolbar.appendChild(row4);

        this._container.appendChild(this._toolbar);
      }

      _createToolbarGroup(buttons) {
        const group = document.createElement('div');
        group.className = 'rte-toolbar-group';

        buttons.forEach(btn => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'rte-btn';
          button.title = btn.title;
          button.dataset.command = btn.command;
          if (btn.value) button.dataset.value = btn.value;
          if (btn.prompt) button.dataset.prompt = 'true';

          if (btn.text) {
            button.innerHTML = `<span class="rte-btn-text">${btn.text}</span>`;
          } else {
            button.innerHTML = `<span class="material-icons">${btn.icon}</span>`;
          }

          group.appendChild(button);
        });

        return group;
      }

      _createFontSelect() {
        const wrapper = document.createElement('div');
        wrapper.className = 'rte-select-wrapper';

        const select = document.createElement('select');
        select.className = 'rte-select rte-font-select';
        select.title = 'Font Family';

        FONTS.forEach(font => {
          const option = document.createElement('option');
          option.value = font.value;
          option.textContent = font.name;
          if (font.value) option.style.fontFamily = font.value;
          select.appendChild(option);
        });

        select.addEventListener('change', () => {
          this._editor.focus();
          if (select.value) {
            document.execCommand('fontName', false, select.value);
          }
          this._updateValue();
        });

        wrapper.appendChild(select);
        return wrapper;
      }

      _createFontSizeSelect() {
        const wrapper = document.createElement('div');
        wrapper.className = 'rte-select-wrapper';

        const select = document.createElement('select');
        select.className = 'rte-select rte-size-select';
        select.title = 'Font Size';

        FONT_SIZES.forEach(size => {
          const option = document.createElement('option');
          option.value = size.value;
          option.textContent = size.name;
          if (size.value === '14px') option.selected = true;
          select.appendChild(option);
        });

        select.addEventListener('change', () => {
          this._editor.focus();
          this._setFontSize(select.value);
          this._updateValue();
        });

        wrapper.appendChild(select);
        return wrapper;
      }

      _createHeadingSelect() {
        const wrapper = document.createElement('div');
        wrapper.className = 'rte-select-wrapper';

        const select = document.createElement('select');
        select.className = 'rte-select rte-heading-select';
        select.title = 'Heading';

        const headings = [
          { name: 'Paragraph', value: 'p' },
          { name: 'Heading 1', value: 'h1' },
          { name: 'Heading 2', value: 'h2' },
          { name: 'Heading 3', value: 'h3' },
          { name: 'Heading 4', value: 'h4' },
          { name: 'Heading 5', value: 'h5' },
          { name: 'Heading 6', value: 'h6' }
        ];

        headings.forEach(h => {
          const option = document.createElement('option');
          option.value = h.value;
          option.textContent = h.name;
          select.appendChild(option);
        });

        select.addEventListener('change', () => {
          this._editor.focus();
          document.execCommand('formatBlock', false, select.value);
          this._updateValue();
        });

        wrapper.appendChild(select);
        return wrapper;
      }

      _createColorGroup() {
        const group = document.createElement('div');
        group.className = 'rte-toolbar-group';

        // Text color
        const textColorBtn = document.createElement('button');
        textColorBtn.type = 'button';
        textColorBtn.className = 'rte-btn rte-color-btn';
        textColorBtn.title = 'Text Color';
        textColorBtn.innerHTML = `
          <span class="material-icons">format_color_text</span>
          <span class="rte-color-indicator" style="background-color: #000000;"></span>
        `;
        textColorBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._showColorPicker(textColorBtn, 'foreColor');
        });

        // Background color
        const bgColorBtn = document.createElement('button');
        bgColorBtn.type = 'button';
        bgColorBtn.className = 'rte-btn rte-color-btn';
        bgColorBtn.title = 'Highlight Color';
        bgColorBtn.innerHTML = `
          <span class="material-icons">format_color_fill</span>
          <span class="rte-color-indicator" style="background-color: #ffff00;"></span>
        `;
        bgColorBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._showColorPicker(bgColorBtn, 'hiliteColor');
        });

        group.appendChild(textColorBtn);
        group.appendChild(bgColorBtn);

        return group;
      }

      _showColorPicker(button, command) {
        // Remove existing picker
        const existingPicker = document.querySelector('.rte-color-picker');
        if (existingPicker) existingPicker.remove();

        const picker = document.createElement('div');
        picker.className = 'rte-color-picker';

        COLORS.forEach(color => {
          const swatch = document.createElement('div');
          swatch.className = 'rte-color-swatch';
          swatch.style.backgroundColor = color;
          swatch.title = color;
          swatch.addEventListener('click', () => {
            this._editor.focus();
            document.execCommand(command, false, color);
            button.querySelector('.rte-color-indicator').style.backgroundColor = color;
            picker.remove();
            this._updateValue();
          });
          picker.appendChild(swatch);
        });

        // Position picker
        const rect = button.getBoundingClientRect();
        picker.style.position = 'fixed';
        picker.style.top = (rect.bottom + 4) + 'px';
        picker.style.left = rect.left + 'px';
        picker.style.zIndex = '2147483647';

        document.body.appendChild(picker);

        // Close on outside click
        const closeHandler = (e) => {
          if (!picker.contains(e.target) && e.target !== button) {
            picker.remove();
            document.removeEventListener('click', closeHandler);
          }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
      }

      _setFontSize(size) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const span = document.createElement('span');
        span.style.fontSize = size;

        try {
          range.surroundContents(span);
        } catch (e) {
          // Handle complex selections
          document.execCommand('fontSize', false, '7');
          const fontElements = this._editor.querySelectorAll('font[size="7"]');
          fontElements.forEach(el => {
            el.removeAttribute('size');
            el.style.fontSize = size;
          });
        }
      }

      _buildEditor() {
        const editorWrapper = document.createElement('div');
        editorWrapper.className = 'rte-editor-wrapper';

        this._editor = document.createElement('div');
        this._editor.className = 'rte-editor';
        this._editor.contentEditable = 'true';
        this._editor.setAttribute('data-placeholder', this._placeholder);

        editorWrapper.appendChild(this._editor);
        this._container.appendChild(editorWrapper);
      }

      _applyStyles() {
        const w = this._controlWidth;
        const h = this._controlHeight;
        const toolbarHeight = this._showToolbar ? 160 : 0;

        this.style.cssText = `
          display: ${this._isVisible ? 'block' : 'none'};
          width: ${w}px;
        `;

        this._container.style.cssText = `
          width: 100%;
          height: ${h}px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--md-outline, #79747E);
          border-radius: 12px;
          overflow: hidden;
          background: var(--md-surface, #FFFBFE);
          font-family: 'Roboto', sans-serif;
        `;

        // Hide toolbar in read-only mode, otherwise respect showToolbar setting
        const showToolbarNow = this._showToolbar && !this._isReadOnly;
        this._toolbar.style.display = showToolbarNow ? 'flex' : 'none';

        this._editor.style.cssText = `
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          outline: none;
          min-height: 100px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--md-on-surface, #1C1B1F);
        `;

        if (!this._isEnabled) {
          this._editor.contentEditable = 'false';
          this._editor.style.backgroundColor = 'var(--md-surface-variant, #E7E0EC)';
          this._editor.style.opacity = '0.5';
          this._toolbar.style.pointerEvents = 'none';
          this._toolbar.style.opacity = '0.5';
        } else if (this._isReadOnly) {
          this._editor.contentEditable = 'false';
          // Keep normal appearance for read-only, just no editing
        } else {
          this._editor.contentEditable = 'true';
        }

        // Apply primary color to CSS variable
        this._container.style.setProperty('--rte-primary', this._primaryColor);
      }

      _bindEvents() {
        // Toolbar button clicks
        this._toolbar.addEventListener('click', (e) => {
          const btn = e.target.closest('.rte-btn');
          if (!btn || btn.classList.contains('rte-color-btn')) return;

          const command = btn.dataset.command;
          const value = btn.dataset.value || null;
          const needsPrompt = btn.dataset.prompt === 'true';

          this._editor.focus();

          if (needsPrompt) {
            if (command === 'createLink') {
              const url = prompt('Enter URL:', 'https://');
              if (url) document.execCommand(command, false, url);
            } else if (command === 'insertImage') {
              const url = prompt('Enter image URL:', 'https://');
              if (url) document.execCommand(command, false, url);
            }
          } else {
            document.execCommand(command, false, value);
          }

          this._updateValue();
        });

        // Editor input
        this._editor.addEventListener('input', () => {
          this._updateValue();
        });

        // Focus/blur events
        this._editor.addEventListener('focus', () => {
          this._container.classList.add('rte-focused');
          this.dispatchEvent(new CustomEvent('Focus', { bubbles: true }));
        });

        this._editor.addEventListener('blur', () => {
          this._container.classList.remove('rte-focused');
          this.dispatchEvent(new CustomEvent('Blur', { bubbles: true }));
        });

        // Keyboard shortcuts
        this._editor.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
              case 'b':
                e.preventDefault();
                document.execCommand('bold');
                this._updateValue();
                break;
              case 'i':
                e.preventDefault();
                document.execCommand('italic');
                this._updateValue();
                break;
              case 'u':
                e.preventDefault();
                document.execCommand('underline');
                this._updateValue();
                break;
            }
          }
        });

        // Paste as plain text option (hold Shift)
        this._editor.addEventListener('paste', (e) => {
          if (e.shiftKey) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
            this._updateValue();
          }
        });
      }

      _updateValue() {
        this._value = this._editor.innerHTML;
        safeRaisePropertyChanged(this, 'Value');
        safeRaisePropertyChanged(this, 'plainText');
        this.dispatchEvent(new CustomEvent('Changed', {
          bubbles: true,
          detail: { html: this._value, text: this.plainText }
        }));
      }

      // Public methods
      clear() {
        this._editor.innerHTML = '';
        this._updateValue();
      }

      focus() {
        this._editor.focus();
      }

      // Properties
      get Value() { return this._value; }
      set Value(v) {
        this._value = v || '';
        if (this._editor) {
          this._editor.innerHTML = this._value;
        }
        safeRaisePropertyChanged(this, 'Value');
      }

      get plainText() {
        if (!this._editor) return '';
        return this._editor.innerText || this._editor.textContent || '';
      }
      set plainText(v) { /* Read-only */ }
      get PlainText() { return this.plainText; }
      set PlainText(v) { this.plainText = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || 'Start typing...';
        if (this._editor) {
          this._editor.setAttribute('data-placeholder', this._placeholder);
        }
      }
      get Placeholder() { return this.placeholder; }
      set Placeholder(v) { this.placeholder = v; }

      get controlWidth() { return this._controlWidth; }
      set controlWidth(v) {
        this._controlWidth = parseInt(v) || 600;
        if (this._hasRendered) this._applyStyles();
      }
      get ControlWidth() { return this.controlWidth; }
      set ControlWidth(v) { this.controlWidth = v; }

      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) {
        this._controlHeight = parseInt(v) || 400;
        if (this._hasRendered) this._applyStyles();
      }
      get ControlHeight() { return this.controlHeight; }
      set ControlHeight(v) { this.controlHeight = v; }

      get showToolbar() { return this._showToolbar; }
      set showToolbar(v) {
        this._showToolbar = (v === true || v === 'true');
        if (this._hasRendered) this._applyStyles();
      }
      get ShowToolbar() { return this.showToolbar; }
      set ShowToolbar(v) { this.showToolbar = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

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

      get IsReadOnly() { return this._isReadOnly; }
      set IsReadOnly(val) {
        this._isReadOnly = (val === true || val === 'true');
        if (this._hasRendered) this._applyStyles();
      }
    });
  }
})();
