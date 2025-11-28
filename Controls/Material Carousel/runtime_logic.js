/**
 * Material Carousel Control for K2 SmartForms
 * Material 3 Design carousel for displaying scrollable content
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

  // Font loading state management
  let fontsLoaded = false;
  let fontsLoadPromise = null;
  const pendingInstances = [];

  // Load Material Icons and Google Fonts with robust loading
  function loadFonts() {
    if (fontsLoaded) return Promise.resolve();
    if (fontsLoadPromise) return fontsLoadPromise;

    fontsLoadPromise = new Promise((resolve) => {
      const fontsToLoad = [];

      // Load Material Icons
      if (!document.querySelector('link[href*="Material+Icons"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        document.head.appendChild(iconLink);
        fontsToLoad.push(new Promise(res => {
          iconLink.onload = res;
          iconLink.onerror = res;
        }));
      }

      // Load Google Fonts
      if (!document.querySelector('link[href*="fonts.googleapis.com/css2"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
        document.head.appendChild(fontLink);
        fontsToLoad.push(new Promise(res => {
          fontLink.onload = res;
          fontLink.onerror = res;
        }));
      }

      if (fontsToLoad.length === 0) {
        fontsLoaded = true;
        resolve();
        return;
      }

      // Wait for fonts to load with timeout
      Promise.race([
        Promise.all(fontsToLoad),
        new Promise(res => setTimeout(res, 2000))
      ]).then(() => {
        fontsLoaded = true;
        resolve();
        pendingInstances.forEach(fn => fn());
        pendingInstances.length = 0;
      });
    });

    return fontsLoadPromise;
  }

  if (!window.customElements.get('material-carousel')) {
    window.customElements.define('material-carousel', class MaterialCarousel extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;
        this._fontsReady = false;
        this._pendingRender = false;

        // Properties
        this._listBinding = '';
        this._items = '';
        this._delimiter = '|';
        this._subDelimiter = ':';
        this._height = '300';
        this._currentIndex = 0;
        this._autoPlay = false;
        this._autoPlayInterval = 5000;
        this._showArrows = true;
        this._showIndicators = true;
        this._loop = true;
        this._variant = 'contained'; // contained, hero, full-screen

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '#FFFBFE';
        this._arrowColor = '#FFFFFF';
        this._arrowBackgroundColor = 'rgba(0, 0, 0, 0.3)';
        this._indicatorColor = 'rgba(255, 255, 255, 0.5)';
        this._indicatorActiveColor = '#FFFFFF';
        this._overlayColor = '';
        this._textColor = '#FFFFFF';
        this._captionBackgroundColor = 'rgba(0, 0, 0, 0.5)';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed items
        this._parsedItems = [];

        // DOM refs
        this._container = null;
        this._track = null;
        this._indicators = null;

        // Auto play timer
        this._autoPlayTimer = null;

        // Touch handling
        this._touchStartX = 0;
        this._touchEndX = 0;

        // K2 List binding
        this._listConfig = null;
        this._dataItems = [];
      }

      connectedCallback() {
        if (this._hasRendered) return;

        // Render container immediately
        this._renderContainer();
        this._hasRendered = true;

        // Load fonts and render carousel when ready
        loadFonts().then(() => {
          this._fontsReady = true;
          this._parseItems();
          this._renderCarousel();
          if (this._autoPlay) this._startAutoPlay();
        }).catch(() => {
          this._fontsReady = true;
          this._parseItems();
          this._renderCarousel();
          if (this._autoPlay) this._startAutoPlay();
        });
      }

      disconnectedCallback() {
        this._stopAutoPlay();
      }

      _parseItems() {
        this._parsedItems = [];

        // Try listBinding first (JSON array)
        if (this._listBinding && this._listBinding.trim()) {
          try {
            const parsed = JSON.parse(this._listBinding);
            if (Array.isArray(parsed)) {
              parsed.forEach(item => {
                if (item && typeof item === 'object') {
                  this._parsedItems.push({
                    image: item.image || item.Image || item.url || item.Url || item.src || item.Src || '',
                    title: item.title || item.Title || item.name || item.Name || '',
                    subtitle: item.subtitle || item.Subtitle || item.description || item.Description || ''
                  });
                }
              });
              return; // Successfully parsed listBinding, skip items parsing
            }
          } catch (e) {
            // Invalid JSON, fall through to items parsing
            console.warn('Material Carousel: Invalid listBinding JSON, falling back to items');
          }
        }

        // Fall back to items (delimited string)
        const items = this._items ? this._items.split(this._delimiter) : [];

        items.forEach(item => {
          const trimmed = item.trim();
          if (!trimmed) return;

          // Format: image:title:subtitle or image:title or image
          // Handle URLs by temporarily replacing :// to avoid splitting on protocol
          const placeholder = '___PROTOCOL___';
          const escaped = trimmed.replace(/:\/\//g, placeholder);
          const parts = escaped.split(this._subDelimiter).map(p => p.replace(new RegExp(placeholder, 'g'), '://').trim());

          if (parts.length >= 3) {
            this._parsedItems.push({
              image: parts[0],
              title: parts[1],
              subtitle: parts[2]
            });
          } else if (parts.length === 2) {
            this._parsedItems.push({
              image: parts[0],
              title: parts[1],
              subtitle: ''
            });
          } else {
            this._parsedItems.push({
              image: trimmed,
              title: '',
              subtitle: ''
            });
          }
        });
      }

      _renderContainer() {
        this.innerHTML = '';
        this._container = document.createElement('div');
        this._container.className = `mcr-container mcr-${this._variant}`;
        this.appendChild(this._container);
        this._applyStyles();
      }

      _render() {
        // Full re-render
        if (!this._container) {
          this._renderContainer();
        }
        this._renderCarousel();
      }

      _renderCarousel() {
        if (!this._container) return;

        // Clear and rebuild
        this._container.innerHTML = '';
        this._buildCarouselContent();
        this._applyStyles();
        this._bindEvents();
      }

      _buildCarouselContent() {
        // Viewport
        const viewport = document.createElement('div');
        viewport.className = 'mcr-viewport';

        // Track
        this._track = document.createElement('div');
        this._track.className = 'mcr-track';

        this._parsedItems.forEach((item, index) => {
          const slide = document.createElement('div');
          slide.className = 'mcr-slide';
          slide.setAttribute('data-index', index);

          // Image
          const img = document.createElement('div');
          img.className = 'mcr-image';
          img.style.backgroundImage = `url(${item.image})`;
          slide.appendChild(img);

          // Caption
          if (item.title || item.subtitle) {
            const caption = document.createElement('div');
            caption.className = 'mcr-caption';

            if (item.title) {
              const title = document.createElement('div');
              title.className = 'mcr-title';
              title.textContent = item.title;
              caption.appendChild(title);
            }

            if (item.subtitle) {
              const subtitle = document.createElement('div');
              subtitle.className = 'mcr-subtitle';
              subtitle.textContent = item.subtitle;
              caption.appendChild(subtitle);
            }

            slide.appendChild(caption);
          }

          this._track.appendChild(slide);
        });

        viewport.appendChild(this._track);
        this._container.appendChild(viewport);

        // Navigation arrows
        if (this._showArrows && this._parsedItems.length > 1) {
          const prevBtn = document.createElement('button');
          prevBtn.className = 'mcr-arrow mcr-prev';
          prevBtn.type = 'button';
          prevBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
          prevBtn.setAttribute('aria-label', 'Previous slide');
          this._container.appendChild(prevBtn);

          const nextBtn = document.createElement('button');
          nextBtn.className = 'mcr-arrow mcr-next';
          nextBtn.type = 'button';
          nextBtn.innerHTML = '<span class="material-icons">chevron_right</span>';
          nextBtn.setAttribute('aria-label', 'Next slide');
          this._container.appendChild(nextBtn);
        }

        // Indicators
        if (this._showIndicators && this._parsedItems.length > 1) {
          this._indicators = document.createElement('div');
          this._indicators.className = 'mcr-indicators';

          this._parsedItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'mcr-indicator';
            dot.type = 'button';
            dot.setAttribute('data-index', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === this._currentIndex) {
              dot.classList.add('mcr-active');
            }
            this._indicators.appendChild(dot);
          });

          this._container.appendChild(this._indicators);
        }

        this._goToSlide(this._currentIndex, false);
        this._updateState();
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        // Set height
        const height = parseInt(this._height) || 300;
        if (this._variant !== 'full-screen') {
          this.style.height = `${height}px`;
        }

        // Set CSS custom properties on the container element
        if (this._container) {
          this._container.style.height = '100%';
          this._container.style.setProperty('--mcr-primary', this._primaryColor);
          this._container.style.setProperty('--mcr-background', this._backgroundColor);
          this._container.style.setProperty('--mcr-arrow', this._arrowColor);
          this._container.style.setProperty('--mcr-arrow-bg', this._arrowBackgroundColor);
          this._container.style.setProperty('--mcr-indicator', this._indicatorColor);
          this._container.style.setProperty('--mcr-indicator-active', this._indicatorActiveColor);
          this._container.style.setProperty('--mcr-text', this._textColor);
          this._container.style.setProperty('--mcr-caption-bg', this._captionBackgroundColor);
          if (this._overlayColor) {
            this._container.style.setProperty('--mcr-overlay', this._overlayColor);
          }

          // Apply font properties to caption text elements
          const titles = this._container.querySelectorAll('.mcr-title');
          const subtitles = this._container.querySelectorAll('.mcr-subtitle');
          const fontSize = `${parseInt(this._fontSize) || 16}px`;

          titles.forEach(title => {
            title.style.fontSize = fontSize;
            title.style.fontWeight = this._fontWeight;
            title.style.fontStyle = this._fontStyle;
          });

          subtitles.forEach(subtitle => {
            subtitle.style.fontSize = fontSize;
            subtitle.style.fontWeight = this._fontWeight;
            subtitle.style.fontStyle = this._fontStyle;
          });
        }
      }

      _bindEvents() {
        // Arrow buttons
        const prevBtn = this._container.querySelector('.mcr-prev');
        const nextBtn = this._container.querySelector('.mcr-next');

        if (prevBtn) {
          prevBtn.addEventListener('click', () => this.prev());
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', () => this.next());
        }

        // Indicators
        if (this._indicators) {
          const dots = this._indicators.querySelectorAll('.mcr-indicator');
          dots.forEach(dot => {
            dot.addEventListener('click', () => {
              const index = parseInt(dot.getAttribute('data-index'));
              this._goToSlide(index);
            });
          });
        }

        // Touch events
        const viewport = this._container.querySelector('.mcr-viewport');
        viewport.addEventListener('touchstart', (e) => this._handleTouchStart(e), { passive: true });
        viewport.addEventListener('touchend', (e) => this._handleTouchEnd(e), { passive: true });

        // Keyboard events
        this._container.addEventListener('keydown', (e) => this._handleKeydown(e));

        // Pause on hover
        if (this._autoPlay) {
          this._container.addEventListener('mouseenter', () => this._stopAutoPlay());
          this._container.addEventListener('mouseleave', () => this._startAutoPlay());
        }
      }

      _handleTouchStart(e) {
        this._touchStartX = e.changedTouches[0].screenX;
      }

      _handleTouchEnd(e) {
        this._touchEndX = e.changedTouches[0].screenX;
        const diff = this._touchStartX - this._touchEndX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.next();
          } else {
            this.prev();
          }
        }
      }

      _handleKeydown(e) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      }

      _goToSlide(index, animate = true) {
        if (this._parsedItems.length === 0) return;

        // Handle loop
        if (this._loop) {
          if (index < 0) index = this._parsedItems.length - 1;
          if (index >= this._parsedItems.length) index = 0;
        } else {
          index = Math.max(0, Math.min(index, this._parsedItems.length - 1));
        }

        this._currentIndex = index;

        // Move track
        if (this._track) {
          this._track.style.transition = animate ? 'transform 0.3s ease' : 'none';
          this._track.style.transform = `translateX(-${index * 100}%)`;
        }

        // Update indicators
        if (this._indicators) {
          const dots = this._indicators.querySelectorAll('.mcr-indicator');
          dots.forEach((dot, i) => {
            dot.classList.toggle('mcr-active', i === index);
          });
        }

        // Update arrow states
        if (!this._loop) {
          const prevBtn = this._container?.querySelector('.mcr-prev');
          const nextBtn = this._container?.querySelector('.mcr-next');
          if (prevBtn) prevBtn.disabled = index === 0;
          if (nextBtn) nextBtn.disabled = index === this._parsedItems.length - 1;
        }

        safeRaisePropertyChanged(this, 'currentIndex');
        this.dispatchEvent(new CustomEvent('SlideChanged', {
          bubbles: true,
          detail: { index, item: this._parsedItems[index] }
        }));
      }

      _startAutoPlay() {
        if (!this._autoPlay || this._parsedItems.length <= 1) return;
        this._stopAutoPlay();
        this._autoPlayTimer = setInterval(() => this.next(), this._autoPlayInterval);
      }

      _stopAutoPlay() {
        if (this._autoPlayTimer) {
          clearInterval(this._autoPlayTimer);
          this._autoPlayTimer = null;
        }
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('mcr-disabled', !this._isEnabled);
      }

      // Public methods
      next() {
        if (!this._isEnabled) return;
        this._goToSlide(this._currentIndex + 1);
      }

      prev() {
        if (!this._isEnabled) return;
        this._goToSlide(this._currentIndex - 1);
      }

      goTo(index) {
        if (!this._isEnabled) return;
        this._goToSlide(parseInt(index) || 0);
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
        this._processDataItems();
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        if (Array.isArray(itemsChangedEventArgs?.NewItems)) {
          this._dataItems = itemsChangedEventArgs.NewItems;
          this._processDataItems();
        }
      }

      _processDataItems() {
        if (!this._dataItems || this._dataItems.length === 0) return;

        // Get field mappings from K2 config
        const mappings = this._listConfig?.partmappings || {};
        const imageProp = mappings['Image'] || mappings['Display'] || 'image';
        const titleProp = mappings['Title'] || 'title';
        const subtitleProp = mappings['Subtitle'] || mappings['Description'] || 'subtitle';

        // Convert K2 data items to carousel items
        this._parsedItems = this._dataItems.map(item => ({
          image: item[imageProp] || item.image || item.Image || item.url || item.Url || item.src || item.Src || '',
          title: item[titleProp] || item.title || item.Title || item.name || item.Name || '',
          subtitle: item[subtitleProp] || item.subtitle || item.Subtitle || item.description || item.Description || ''
        }));

        if (this._hasRendered && this._fontsReady) {
          this._renderCarousel();
        }
      }

      // Properties
      get listBinding() { return this._listBinding; }
      set listBinding(v) {
        this._listBinding = v || '';
        this._parseItems();
        if (this._hasRendered && this._fontsReady) {
          this._renderCarousel();
        } else if (this._hasRendered) {
          this._pendingRender = true;
        }
        safeRaisePropertyChanged(this, 'listBinding');
      }
      get ListBinding() { return this.listBinding; }
      set ListBinding(v) { this.listBinding = v; }

      get items() { return this._items; }
      set items(v) {
        this._items = v || '';
        this._parseItems();
        if (this._hasRendered && this._fontsReady) {
          this._renderCarousel();
        } else if (this._hasRendered) {
          this._pendingRender = true;
        }
        safeRaisePropertyChanged(this, 'items');
      }
      get Items() { return this.items; }
      set Items(v) { this.items = v; }

      get height() { return this._height; }
      set height(v) {
        this._height = v || '300';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'height');
      }
      get Height() { return this.height; }
      set Height(v) { this.height = v; }

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

      get currentIndex() { return this._currentIndex; }
      set currentIndex(v) {
        this._currentIndex = parseInt(v) || 0;
        if (this._hasRendered) this._goToSlide(this._currentIndex);
        safeRaisePropertyChanged(this, 'currentIndex');
      }
      get CurrentIndex() { return this.currentIndex; }
      set CurrentIndex(v) { this.currentIndex = v; }

      get autoPlay() { return this._autoPlay; }
      set autoPlay(v) {
        this._autoPlay = (v === true || v === 'true');
        if (this._hasRendered) {
          if (this._autoPlay) {
            this._startAutoPlay();
          } else {
            this._stopAutoPlay();
          }
        }
        safeRaisePropertyChanged(this, 'autoPlay');
      }
      get AutoPlay() { return this.autoPlay; }
      set AutoPlay(v) { this.autoPlay = v; }

      get autoPlayInterval() { return this._autoPlayInterval; }
      set autoPlayInterval(v) {
        this._autoPlayInterval = parseInt(v) || 5000;
        if (this._autoPlay && this._hasRendered) {
          this._startAutoPlay();
        }
        safeRaisePropertyChanged(this, 'autoPlayInterval');
      }
      get AutoPlayInterval() { return this.autoPlayInterval; }
      set AutoPlayInterval(v) { this.autoPlayInterval = v; }

      get showArrows() { return this._showArrows; }
      set showArrows(v) {
        this._showArrows = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showArrows');
      }
      get ShowArrows() { return this.showArrows; }
      set ShowArrows(v) { this.showArrows = v; }

      get showIndicators() { return this._showIndicators; }
      set showIndicators(v) {
        this._showIndicators = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showIndicators');
      }
      get ShowIndicators() { return this.showIndicators; }
      set ShowIndicators(v) { this.showIndicators = v; }

      get loop() { return this._loop; }
      set loop(v) {
        this._loop = (v === true || v === 'true');
        safeRaisePropertyChanged(this, 'loop');
      }
      get Loop() { return this.loop; }
      set Loop(v) { this.loop = v; }

      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['contained', 'hero', 'full-screen'];
        this._variant = valid.includes(v) ? v : 'contained';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

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

      get arrowColor() { return this._arrowColor; }
      set arrowColor(v) {
        this._arrowColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'arrowColor');
      }
      get ArrowColor() { return this.arrowColor; }
      set ArrowColor(v) { this.arrowColor = v; }

      get arrowBackgroundColor() { return this._arrowBackgroundColor; }
      set arrowBackgroundColor(v) {
        this._arrowBackgroundColor = v || 'rgba(0, 0, 0, 0.3)';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'arrowBackgroundColor');
      }
      get ArrowBackgroundColor() { return this.arrowBackgroundColor; }
      set ArrowBackgroundColor(v) { this.arrowBackgroundColor = v; }

      get indicatorColor() { return this._indicatorColor; }
      set indicatorColor(v) {
        this._indicatorColor = v || 'rgba(255, 255, 255, 0.5)';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'indicatorColor');
      }
      get IndicatorColor() { return this.indicatorColor; }
      set IndicatorColor(v) { this.indicatorColor = v; }

      get indicatorActiveColor() { return this._indicatorActiveColor; }
      set indicatorActiveColor(v) {
        this._indicatorActiveColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'indicatorActiveColor');
      }
      get IndicatorActiveColor() { return this.indicatorActiveColor; }
      set IndicatorActiveColor(v) { this.indicatorActiveColor = v; }

      get overlayColor() { return this._overlayColor; }
      set overlayColor(v) {
        this._overlayColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'overlayColor');
      }
      get OverlayColor() { return this.overlayColor; }
      set OverlayColor(v) { this.overlayColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'textColor');
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get captionBackgroundColor() { return this._captionBackgroundColor; }
      set captionBackgroundColor(v) {
        this._captionBackgroundColor = v || 'rgba(0, 0, 0, 0.5)';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'captionBackgroundColor');
      }
      get CaptionBackgroundColor() { return this.captionBackgroundColor; }
      set CaptionBackgroundColor(v) { this.captionBackgroundColor = v; }

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
