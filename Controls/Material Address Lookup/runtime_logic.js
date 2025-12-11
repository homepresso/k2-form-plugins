if (!window.__materialaddresslookupRuntimeLoaded) {
  window.__materialaddresslookupRuntimeLoaded = true;

/**
 * Material Address Lookup Control for K2 SmartForms
 * Material 3 Design with Google Places Autocomplete
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
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // Track loaded API keys to avoid duplicate script loading
  const loadedApiKeys = new Set();
  let apiLoadPromise = null;

  function loadGoogleMapsApi(apiKey) {
    if (apiLoadPromise) return apiLoadPromise;

    apiLoadPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
        return;
      }

      if (loadedApiKeys.has(apiKey)) {
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      loadedApiKeys.add(apiKey);

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const checkReady = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkReady);
            resolve();
          }
        }, 50);
      };
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });

    return apiLoadPromise;
  }

  if (!window.customElements.get('material-address')) {
    window.customElements.define('material-address', class MaterialAddress extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;
        this._value = null;
        this._sessionToken = null;
        this._debounceTimer = null;
        this._suggestions = [];
        this._programmaticUpdate = false;

        // Google API properties
        this._apiKey = '';
        this._countryRestriction = '';

        // Material styling properties
        this._label = 'Address';
        this._placeholder = 'Start typing an address...';
        this._helperText = '';
        this._errorText = '';
        this._hasError = false;
        this._variant = 'outlined';
        this._leadingIcon = 'location_on';
        this._controlHeight = 56;
        this._controlPadding = 8;
        this._primaryColor = '#6750A4';
        this._textColor = '#1C1B1F';
        this._labelColor = '#49454F';
        this._borderColor = '#79747E';
        this._backgroundColor = '#E7E0EC';
        this._errorColor = '#B3261E';
        this._iconColor = '#49454F';
        this._labelBackground = '#ffffff';
        this._labelFontSize = 16;
        this._labelFontWeight = 'normal';
        this._labelFontStyle = 'normal';
        this._required = false;
        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 16;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // Parsed address components
        this._formattedAddress = '';
        this._streetNumber = '';
        this._streetName = '';
        this._city = '';
        this._state = '';
        this._postalCode = '';
        this._country = '';
        this._latitude = '';
        this._longitude = '';
        this._placeId = '';

        // DOM refs
        this._container = null;
        this._input = null;
        this._labelEl = null;
        this._helperEl = null;
        this._leadingIconEl = null;
        this._clearBtn = null;
        this._dropdown = null;

        // Bound event handlers for cleanup
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleResize = this._handleResize.bind(this);
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

      disconnectedCallback() {
        // Clean up portaled dropdown
        if (this._dropdown && this._dropdown.__portaled && this._dropdown.parentNode) {
          this._dropdown.parentNode.removeChild(this._dropdown);
        }
        // Remove event listeners
        document.removeEventListener('click', this._handleOutsideClick);
        window.removeEventListener('scroll', this._handleScroll, true);
        window.removeEventListener('resize', this._handleResize);
      }

      _render() {
        this.innerHTML = '';
        this._buildContainer();
        this._applyStyles();
        this._bindEvents();
        this._initAutocomplete();
      }

      _buildContainer() {
        this._container = document.createElement('div');
        this._container.className = `mal-container mal-${this._variant}`;

        // Input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'mal-input-wrapper';

        // Leading icon
        if (this._leadingIcon) {
          this._leadingIconEl = document.createElement('span');
          this._leadingIconEl.className = 'mal-icon mal-icon-leading material-icons';
          this._leadingIconEl.textContent = this._leadingIcon;
          inputWrapper.appendChild(this._leadingIconEl);
        }

        // Input field
        this._input = document.createElement('input');
        this._input.type = 'text';
        this._input.className = 'mal-input';
        this._input.placeholder = this._placeholder || ' ';
        this._input.autocomplete = 'off';
        this._input.disabled = !this._isEnabled;

        inputWrapper.appendChild(this._input);

        // Floating label
        this._labelEl = document.createElement('label');
        this._labelEl.className = 'mal-label';
        this._labelEl.textContent = this._label;
        if (this._required) {
          this._labelEl.innerHTML = `${this._label}<span class="mal-required">*</span>`;
        }
        inputWrapper.appendChild(this._labelEl);

        // Clear button
        this._clearBtn = document.createElement('button');
        this._clearBtn.type = 'button';
        this._clearBtn.className = 'mal-clear-btn material-icons';
        this._clearBtn.textContent = 'close';
        this._clearBtn.style.display = 'none';
        inputWrapper.appendChild(this._clearBtn);

        // Border/outline for outlined variant
        if (this._variant === 'outlined') {
          const fieldset = document.createElement('fieldset');
          fieldset.className = 'mal-outline';
          fieldset.innerHTML = `<legend class="mal-outline-legend"><span>${this._label}${this._required ? '*' : ''}</span></legend>`;
          inputWrapper.appendChild(fieldset);
        }

        this._container.appendChild(inputWrapper);

        // Supporting text (helper/error)
        const supportingWrapper = document.createElement('div');
        supportingWrapper.className = 'mal-supporting';

        this._helperEl = document.createElement('span');
        this._helperEl.className = 'mal-helper-text';
        this._helperEl.textContent = this._hasError ? this._errorText : this._helperText;
        supportingWrapper.appendChild(this._helperEl);

        this._container.appendChild(supportingWrapper);
        this.appendChild(this._container);

        // Create dropdown (will be portaled to body)
        this._dropdown = document.createElement('div');
        this._dropdown.className = 'mal-dropdown';
        this._dropdown.style.display = 'none';

        // Set initial state
        this._updateState();

        // If we have an existing value, populate the input
        if (this._formattedAddress) {
          this._input.value = this._formattedAddress;
          this._clearBtn.style.display = 'block';
          this._container.classList.add('mal-has-value');
        }
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.boxSizing = 'border-box';
        this.style.fontFamily = this._fontFamily;
        this.style.padding = `${this._controlPadding}px`;

        this._container.style.setProperty('--mal-primary', this._primaryColor);
        this._container.style.setProperty('--mal-error', this._errorColor);
        this._container.style.setProperty('--mal-on-surface', this._textColor);
        this._container.style.setProperty('--mal-outline', this._borderColor);
        this._container.style.setProperty('--mal-surface-variant', this._backgroundColor);
        this._container.style.setProperty('--mal-label-color', this._labelColor);
        this._container.style.setProperty('--mal-icon-color', this._iconColor);
        this._container.style.setProperty('--mal-label-background', this._labelBackground);
        this._container.style.setProperty('--mal-label-font-size', `${this._labelFontSize}px`);
        this._container.style.setProperty('--mal-label-font-weight', this._labelFontWeight);
        this._container.style.setProperty('--mal-label-font-style', this._labelFontStyle);
        this._container.style.setProperty('--mal-height', `${this._controlHeight}px`);
        this._container.style.setProperty('--mal-font-family', this._fontFamily);
        this._container.style.setProperty('--mal-font-size', `${this._fontSize}px`);
        this._container.style.setProperty('--mal-font-weight', this._fontWeight);
        this._container.style.setProperty('--mal-font-style', this._fontStyle);

        // Apply font styles directly to input element
        if (this._input) {
          this._input.style.fontFamily = this._fontFamily;
          this._input.style.fontSize = `${this._fontSize}px`;
          this._input.style.fontWeight = this._fontWeight;
          this._input.style.fontStyle = this._fontStyle;
        }

        // Apply label font styles directly
        if (this._labelEl) {
          this._labelEl.style.fontSize = `${this._labelFontSize}px`;
          this._labelEl.style.fontWeight = this._labelFontWeight;
          this._labelEl.style.fontStyle = this._labelFontStyle;
        }
      }

      _bindEvents() {
        // Input events
        this._input.addEventListener('input', (e) => {
          const value = e.target.value;
          this._clearBtn.style.display = value ? 'block' : 'none';

          if (value) {
            this._container.classList.add('mal-has-value');
          } else {
            this._container.classList.remove('mal-has-value');
          }

          // Debounce the API call
          clearTimeout(this._debounceTimer);
          if (value.length >= 2) {
            this._debounceTimer = setTimeout(() => {
              this._fetchSuggestions(value);
            }, 300);
          } else {
            this._hideDropdown();
          }
        });

        this._input.addEventListener('focus', () => {
          this._container.classList.add('mal-focused');
          if (this._input.value.length >= 2 && this._suggestions.length > 0) {
            this._showDropdown();
          }
          this.dispatchEvent(new CustomEvent('Focus', { bubbles: true }));
        });

        this._input.addEventListener('blur', () => {
          this._container.classList.remove('mal-focused');
          this._updateState();
          this.dispatchEvent(new CustomEvent('Blur', { bubbles: true }));
        });

        this._input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this._hideDropdown();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._focusNextItem();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._focusPrevItem();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const focused = this._dropdown.querySelector('.mal-suggestion-item:focus');
            if (focused) {
              focused.click();
            }
          }
        });

        this._clearBtn.addEventListener('click', () => {
          this.clear();
        });

        // Outside click to close dropdown
        document.addEventListener('click', this._handleOutsideClick);

        // Reposition dropdown on scroll/resize
        window.addEventListener('scroll', this._handleScroll, true);
        window.addEventListener('resize', this._handleResize);
      }

      _handleOutsideClick(e) {
        if (!this.contains(e.target) && !this._dropdown.contains(e.target)) {
          this._hideDropdown();
        }
      }

      _handleScroll() {
        this._positionDropdown();
      }

      _handleResize() {
        this._positionDropdown();
      }

      _initAutocomplete() {
        if (!this._apiKey) {
          return;
        }

        const self = this;
        loadGoogleMapsApi(this._apiKey)
          .then(() => {
            self._createSessionToken();
          })
          .catch((err) => {
            console.error('Failed to load Google Maps API:', err.message);
          });
      }

      _createSessionToken() {
        if (window.google && window.google.maps && window.google.maps.places) {
          this._sessionToken = new google.maps.places.AutocompleteSessionToken();
        }
      }

      async _fetchSuggestions(input) {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          return;
        }

        try {
          const { AutocompleteSuggestion } = google.maps.places;

          const request = {
            input: input,
            sessionToken: this._sessionToken,
            includedPrimaryTypes: ['street_address', 'premise', 'subpremise', 'route', 'locality']
          };

          // Add country restriction if specified
          if (this._countryRestriction) {
            const countries = this._countryRestriction.split(',').map(c => c.trim().toUpperCase());
            request.includedRegionCodes = countries;
          }

          const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

          this._suggestions = suggestions || [];
          this._renderSuggestions();

        } catch (err) {
          console.error('Error fetching suggestions:', err);
          this._suggestions = [];
          this._hideDropdown();
        }
      }

      _renderSuggestions() {
        if (this._suggestions.length === 0) {
          this._hideDropdown();
          return;
        }

        // Clear existing items
        this._dropdown.innerHTML = '';

        // Create suggestion items
        this._suggestions.forEach((suggestion, index) => {
          const item = document.createElement('div');
          item.className = 'mal-suggestion-item';
          item.setAttribute('tabindex', '0');
          item.setAttribute('role', 'option');
          item.setAttribute('data-index', index);

          const prediction = suggestion.placePrediction;
          const mainText = prediction.mainText?.text || '';
          const secondaryText = prediction.secondaryText?.text || '';

          item.innerHTML = `
            <span class="mal-suggestion-icon material-icons">place</span>
            <div class="mal-suggestion-text">
              <div class="mal-suggestion-main">${this._escapeHtml(mainText)}</div>
              <div class="mal-suggestion-secondary">${this._escapeHtml(secondaryText)}</div>
            </div>
          `;

          item.addEventListener('click', () => this._selectSuggestion(suggestion));
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              this._selectSuggestion(suggestion);
            }
          });

          this._dropdown.appendChild(item);
        });

        this._showDropdown();
      }

      _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      async _selectSuggestion(suggestion) {
        try {
          const prediction = suggestion.placePrediction;
          const place = prediction.toPlace();

          // Fetch place details
          await place.fetchFields({
            fields: ['addressComponents', 'formattedAddress', 'location', 'id']
          });

          // Parse address components
          this._parseAddressComponents(place);

          // Build value object
          const addressData = {
            formattedAddress: this._formattedAddress,
            streetNumber: this._streetNumber,
            streetName: this._streetName,
            city: this._city,
            state: this._state,
            postalCode: this._postalCode,
            country: this._country,
            latitude: this._latitude,
            longitude: this._longitude,
            placeId: this._placeId
          };

          this._value = addressData;
          this._input.value = this._formattedAddress;
          this._clearBtn.style.display = 'block';
          this._container.classList.add('mal-has-value');

          // Hide dropdown
          this._hideDropdown();

          // Create new session token for next search
          this._createSessionToken();

          // Raise property changed for all fields
          safeRaisePropertyChanged(this, 'Value');
          safeRaisePropertyChanged(this, 'formattedAddress');
          safeRaisePropertyChanged(this, 'streetNumber');
          safeRaisePropertyChanged(this, 'streetName');
          safeRaisePropertyChanged(this, 'city');
          safeRaisePropertyChanged(this, 'state');
          safeRaisePropertyChanged(this, 'postalCode');
          safeRaisePropertyChanged(this, 'country');
          safeRaisePropertyChanged(this, 'latitude');
          safeRaisePropertyChanged(this, 'longitude');
          safeRaisePropertyChanged(this, 'placeId');

          this.dispatchEvent(new Event('change', { bubbles: true }));
          this.dispatchEvent(new CustomEvent('Changed', { detail: addressData }));

        } catch (err) {
          console.error('Error selecting suggestion:', err);
        }
      }

      _parseAddressComponents(place) {
        // Reset all fields
        this._streetNumber = '';
        this._streetName = '';
        this._city = '';
        this._state = '';
        this._postalCode = '';
        this._country = '';

        if (place.addressComponents) {
          for (const component of place.addressComponents) {
            const types = component.types;

            if (types.includes('street_number')) {
              this._streetNumber = component.longText || component.shortText || '';
            } else if (types.includes('route')) {
              this._streetName = component.longText || component.shortText || '';
            } else if (types.includes('locality')) {
              this._city = component.longText || component.shortText || '';
            } else if (types.includes('administrative_area_level_1')) {
              this._state = component.shortText || component.longText || '';
            } else if (types.includes('postal_code')) {
              this._postalCode = component.longText || component.shortText || '';
            } else if (types.includes('country')) {
              this._country = component.longText || component.shortText || '';
            } else if (types.includes('sublocality_level_1') && !this._city) {
              this._city = component.longText || component.shortText || '';
            } else if (types.includes('postal_town') && !this._city) {
              this._city = component.longText || component.shortText || '';
            }
          }
        }

        this._formattedAddress = place.formattedAddress || '';
        this._placeId = place.id || '';

        if (place.location) {
          this._latitude = place.location.lat().toString();
          this._longitude = place.location.lng().toString();
        }
      }

      _showDropdown() {
        // Portal dropdown to body for overlay behavior
        if (!this._dropdown.__portaled) {
          document.body.appendChild(this._dropdown);
          this._dropdown.__portaled = true;
        }

        this._dropdown.style.display = 'block';
        this._positionDropdown();
      }

      _hideDropdown() {
        if (this._dropdown) {
          this._dropdown.style.display = 'none';
        }
      }

      _positionDropdown() {
        if (!this._dropdown || this._dropdown.style.display === 'none') return;

        const inputWrapper = this._container.querySelector('.mal-input-wrapper');
        if (!inputWrapper) return;

        const rect = inputWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = Math.min(300, this._dropdown.scrollHeight || 200);

        // Position below input, or above if not enough space
        let top = rect.bottom + 4;
        if (top + dropdownHeight > viewportHeight && rect.top > dropdownHeight) {
          top = rect.top - dropdownHeight - 4;
        }
        if (top < 8) top = 8;

        this._dropdown.style.position = 'fixed';
        this._dropdown.style.top = top + 'px';
        this._dropdown.style.left = rect.left + 'px';
        this._dropdown.style.width = rect.width + 'px';
        this._dropdown.style.zIndex = '2147483647';
      }

      _focusNextItem() {
        const items = this._dropdown.querySelectorAll('.mal-suggestion-item');
        const focused = this._dropdown.querySelector('.mal-suggestion-item:focus');
        const currentIndex = focused ? parseInt(focused.getAttribute('data-index')) : -1;
        const nextIndex = Math.min(currentIndex + 1, items.length - 1);
        if (items[nextIndex]) items[nextIndex].focus();
      }

      _focusPrevItem() {
        const items = this._dropdown.querySelectorAll('.mal-suggestion-item');
        const focused = this._dropdown.querySelector('.mal-suggestion-item:focus');
        const currentIndex = focused ? parseInt(focused.getAttribute('data-index')) : items.length;
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (items[prevIndex]) items[prevIndex].focus();
      }

      _updateState() {
        if (!this._container) return;

        // Has value state
        if (this._input && this._input.value) {
          this._container.classList.add('mal-has-value');
        } else {
          this._container.classList.remove('mal-has-value');
        }

        // Error state
        if (this._hasError) {
          this._container.classList.add('mal-error');
          if (this._helperEl) this._helperEl.textContent = this._errorText || this._helperText;
        } else {
          this._container.classList.remove('mal-error');
          if (this._helperEl) this._helperEl.textContent = this._helperText;
        }

        // Disabled state
        if (!this._isEnabled) {
          this._container.classList.add('mal-disabled');
          if (this._input) this._input.disabled = true;
        } else {
          this._container.classList.remove('mal-disabled');
          if (this._input) this._input.disabled = false;
        }
      }

      _updateLabel() {
        if (!this._labelEl) return;
        if (this._required) {
          this._labelEl.innerHTML = `${this._label}<span class="mal-required">*</span>`;
        } else {
          this._labelEl.textContent = this._label;
        }

        // Update outline legend too
        const legend = this._container?.querySelector('.mal-outline-legend span');
        if (legend) {
          legend.textContent = this._label + (this._required ? '*' : '');
        }
      }

      // Public methods
      focus() {
        if (this._input) this._input.focus();
      }

      clear() {
        this._value = null;
        this._formattedAddress = '';
        this._streetNumber = '';
        this._streetName = '';
        this._city = '';
        this._state = '';
        this._postalCode = '';
        this._country = '';
        this._latitude = '';
        this._longitude = '';
        this._placeId = '';
        this._suggestions = [];

        if (this._input) {
          this._input.value = '';
        }
        if (this._clearBtn) {
          this._clearBtn.style.display = 'none';
        }

        this._container.classList.remove('mal-has-value');
        this._hideDropdown();

        safeRaisePropertyChanged(this, 'Value');
        safeRaisePropertyChanged(this, 'formattedAddress');
        safeRaisePropertyChanged(this, 'streetNumber');
        safeRaisePropertyChanged(this, 'streetName');
        safeRaisePropertyChanged(this, 'city');
        safeRaisePropertyChanged(this, 'state');
        safeRaisePropertyChanged(this, 'postalCode');
        safeRaisePropertyChanged(this, 'country');
        safeRaisePropertyChanged(this, 'latitude');
        safeRaisePropertyChanged(this, 'longitude');
        safeRaisePropertyChanged(this, 'placeId');

        this.dispatchEvent(new Event('change', { bubbles: true }));
        this.dispatchEvent(new CustomEvent('Cleared'));
      }

      // Properties
      get Value() {
        if (!this._value) return '';
        return JSON.stringify(this._value);
      }

      set Value(val) {
        this._programmaticUpdate = true;

        if (!val || (typeof val === 'string' && !val.trim())) {
          this._value = null;
          this._formattedAddress = '';
          this._streetNumber = '';
          this._streetName = '';
          this._city = '';
          this._state = '';
          this._postalCode = '';
          this._country = '';
          this._latitude = '';
          this._longitude = '';
          this._placeId = '';
        } else {
          try {
            const data = typeof val === 'string' ? JSON.parse(val) : val;
            this._value = data;
            this._formattedAddress = data.formattedAddress || '';
            this._streetNumber = data.streetNumber || '';
            this._streetName = data.streetName || '';
            this._city = data.city || '';
            this._state = data.state || '';
            this._postalCode = data.postalCode || '';
            this._country = data.country || '';
            this._latitude = data.latitude || '';
            this._longitude = data.longitude || '';
            this._placeId = data.placeId || '';
          } catch (e) {
            this._value = null;
          }
        }

        if (this._input) {
          this._input.value = this._formattedAddress;
          if (this._clearBtn) {
            this._clearBtn.style.display = this._formattedAddress ? 'block' : 'none';
          }
        }
        this._updateState();

        if (!this._programmaticUpdate) {
          safeRaisePropertyChanged(this, 'Value');
        }
        this._programmaticUpdate = false;
      }

      get apiKey() { return this._apiKey; }
      set apiKey(v) {
        this._apiKey = v || '';
        if (this._hasRendered && this._apiKey && !this._sessionToken) {
          this._initAutocomplete();
        }
      }
      get ApiKey() { return this.apiKey; }
      set ApiKey(v) { this.apiKey = v; }

      get countryRestriction() { return this._countryRestriction; }
      set countryRestriction(v) {
        this._countryRestriction = v || '';
      }
      get CountryRestriction() { return this.countryRestriction; }
      set CountryRestriction(v) { this.countryRestriction = v; }

      get label() { return this._label; }
      set label(v) {
        this._label = v || '';
        this._updateLabel();
      }
      get Label() { return this.label; }
      set Label(v) { this.label = v; }

      get placeholder() { return this._placeholder; }
      set placeholder(v) {
        this._placeholder = v || '';
        if (this._input) this._input.placeholder = this._placeholder || ' ';
      }
      get Placeholder() { return this.placeholder; }
      set Placeholder(v) { this.placeholder = v; }

      get helperText() { return this._helperText; }
      set helperText(v) {
        this._helperText = v || '';
        if (!this._hasError && this._helperEl) {
          this._helperEl.textContent = this._helperText;
        }
      }
      get HelperText() { return this.helperText; }
      set HelperText(v) { this.helperText = v; }

      get errorText() { return this._errorText; }
      set errorText(v) {
        this._errorText = v || '';
        if (this._hasError && this._helperEl) {
          this._helperEl.textContent = this._errorText;
        }
      }
      get ErrorText() { return this.errorText; }
      set ErrorText(v) { this.errorText = v; }

      get hasError() { return this._hasError; }
      set hasError(v) {
        this._hasError = (v === true || v === 'true');
        this._updateState();
      }
      get HasError() { return this.hasError; }
      set HasError(v) { this.hasError = v; }

      get variant() { return this._variant; }
      set variant(v) {
        this._variant = ['filled', 'outlined'].includes(v) ? v : 'outlined';
        if (this._hasRendered) this._render();
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get leadingIcon() { return this._leadingIcon; }
      set leadingIcon(v) {
        this._leadingIcon = v || '';
        if (this._leadingIconEl) {
          this._leadingIconEl.textContent = this._leadingIcon;
          this._leadingIconEl.style.display = this._leadingIcon ? 'block' : 'none';
        }
      }
      get LeadingIcon() { return this.leadingIcon; }
      set LeadingIcon(v) { this.leadingIcon = v; }

      get primaryColor() { return this._primaryColor; }
      set primaryColor(v) {
        this._primaryColor = v || '#6750A4';
        if (this._hasRendered) this._applyStyles();
      }
      get PrimaryColor() { return this.primaryColor; }
      set PrimaryColor(v) { this.primaryColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get labelColor() { return this._labelColor; }
      set labelColor(v) {
        this._labelColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
      }
      get LabelColor() { return this.labelColor; }
      set LabelColor(v) { this.labelColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#E7E0EC';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get errorColor() { return this._errorColor; }
      set errorColor(v) {
        this._errorColor = v || '#B3261E';
        if (this._hasRendered) this._applyStyles();
      }
      get ErrorColor() { return this.errorColor; }
      set ErrorColor(v) { this.errorColor = v; }

      get iconColor() { return this._iconColor; }
      set iconColor(v) {
        this._iconColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
      }
      get IconColor() { return this.iconColor; }
      set IconColor(v) { this.iconColor = v; }

      get labelBackground() { return this._labelBackground; }
      set labelBackground(v) {
        this._labelBackground = v || '#ffffff';
        if (this._hasRendered) this._applyStyles();
      }
      get LabelBackground() { return this.labelBackground; }
      set LabelBackground(v) { this.labelBackground = v; }

      get labelFontSize() { return this._labelFontSize; }
      set labelFontSize(v) {
        this._labelFontSize = parseInt(v) || 16;
        if (this._hasRendered) this._applyStyles();
      }
      get LabelFontSize() { return this.labelFontSize; }
      set LabelFontSize(v) { this.labelFontSize = v; }

      get labelFontWeight() { return this._labelFontWeight; }
      set labelFontWeight(v) {
        this._labelFontWeight = v || 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get LabelFontWeight() { return this.labelFontWeight; }
      set LabelFontWeight(v) { this.labelFontWeight = v; }

      get labelFontStyle() { return this._labelFontStyle; }
      set labelFontStyle(v) {
        this._labelFontStyle = ['normal', 'italic'].includes(v) ? v : 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get LabelFontStyle() { return this.labelFontStyle; }
      set LabelFontStyle(v) { this.labelFontStyle = v; }

      get required() { return this._required; }
      set required(v) {
        this._required = (v === true || v === 'true');
        this._updateLabel();
      }
      get Required() { return this.required; }
      set Required(v) { this.required = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseInt(v) || 16;
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
        this._fontStyle = ['normal', 'italic'].includes(v) ? v : 'normal';
        if (this._hasRendered) this._applyStyles();
      }
      get FontStyle() { return this.fontStyle; }
      set FontStyle(v) { this.fontStyle = v; }

      // Height property
      get Height() { return this._controlHeight; }
      set Height(v) {
        const height = parseInt(v);
        if (height && height > 0) {
          this._controlHeight = height;
          if (this._hasRendered) this._applyStyles();
        }
      }
      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) { this.Height = v; }

      // Padding property
      get Padding() { return this._controlPadding; }
      set Padding(v) {
        const padding = parseInt(v);
        if (padding >= 0) {
          this._controlPadding = padding;
          if (this._hasRendered) this._applyStyles();
        }
      }
      get controlPadding() { return this._controlPadding; }
      set controlPadding(v) { this.Padding = v; }

      // Read-only parsed address properties
      get formattedAddress() { return this._formattedAddress; }
      set formattedAddress(v) { /* Read-only */ }
      get FormattedAddress() { return this.formattedAddress; }
      set FormattedAddress(v) { this.formattedAddress = v; }

      get streetNumber() { return this._streetNumber; }
      set streetNumber(v) { /* Read-only */ }
      get StreetNumber() { return this.streetNumber; }
      set StreetNumber(v) { this.streetNumber = v; }

      get streetName() { return this._streetName; }
      set streetName(v) { /* Read-only */ }
      get StreetName() { return this.streetName; }
      set StreetName(v) { this.streetName = v; }

      get city() { return this._city; }
      set city(v) { /* Read-only */ }
      get City() { return this.city; }
      set City(v) { this.city = v; }

      get state() { return this._state; }
      set state(v) { /* Read-only */ }
      get State() { return this.state; }
      set State(v) { this.state = v; }

      get postalCode() { return this._postalCode; }
      set postalCode(v) { /* Read-only */ }
      get PostalCode() { return this.postalCode; }
      set PostalCode(v) { this.postalCode = v; }

      get country() { return this._country; }
      set country(v) { /* Read-only */ }
      get Country() { return this.country; }
      set Country(v) { this.country = v; }

      get latitude() { return this._latitude; }
      set latitude(v) { /* Read-only */ }
      get Latitude() { return this.latitude; }
      set Latitude(v) { this.latitude = v; }

      get longitude() { return this._longitude; }
      set longitude(v) { /* Read-only */ }
      get Longitude() { return this.longitude; }
      set Longitude(v) { this.longitude = v; }

      get placeId() { return this._placeId; }
      set placeId(v) { /* Read-only */ }
      get PlaceId() { return this.placeId; }
      set PlaceId(v) { this.placeId = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) {
          this._updateState();
        }
      }
    });
  }
})();


}
