/**
 * Google Address Lookup Control for K2 SmartForms
 * Uses Google Places AutocompleteSuggestion.fetchAutocompleteSuggestions() API
 * with a custom input and dropdown for full styling control
 */
(function() {
  'use strict';

  function safeRaisePropertyChanged(ctrl, prop) {
    if (window.K2 && typeof window.K2.RaisePropertyChanged === 'function') {
      window.K2.RaisePropertyChanged(ctrl, prop);
    }
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

  const template = document.createElement('template');
  template.innerHTML = `
    <div class="ga-wrapper">
      <input type="text" class="ga-input" autocomplete="off" />
      <button type="button" class="ga-clear-btn" title="Clear">&times;</button>
      <div class="ga-dropdown"></div>
      <div class="ga-error"></div>
    </div>
  `;

  if (!window.customElements.get('google-address')) {
    window.customElements.define('google-address', class GoogleAddress extends HTMLElement {
      constructor() {
        super();
        this._value = null;
        this._hasRendered = false;
        this._sessionToken = null;
        this._debounceTimer = null;
        this._suggestions = [];

        // Properties
        this._apiKey = '';
        this._placeholderText = 'Start typing an address...';
        this._controlWidth = 400;
        this._controlHeight = 40;
        this._countryRestriction = '';
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
        this._wrapper = null;
        this._input = null;
        this._clearBtn = null;
        this._dropdown = null;
        this._errorDiv = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
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
        const w = this._controlWidth;
        const h = this._controlHeight;

        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        this._wrapper = this.querySelector('.ga-wrapper');
        this._input = this.querySelector('.ga-input');
        this._clearBtn = this.querySelector('.ga-clear-btn');
        this._dropdown = this.querySelector('.ga-dropdown');
        this._errorDiv = this.querySelector('.ga-error');

        // Style the control
        this.style.cssText = `display:inline-block;width:${w}px;`;
        this._wrapper.style.cssText = `position:relative;width:100%;`;
        this._input.style.cssText = `
          width: 100%;
          height: ${h}px;
          padding: 8px 32px 8px 12px;
          border: none;
          border-bottom: 1px solid var(--input-border-color, #b2b2b2);
          border-radius: 0;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
          background-color: var(--input-background-color, #ffffff);
          color: var(--input-text-color, #666666);
          outline: none;
        `;
        this._input.placeholder = this._placeholderText;
        this._clearBtn.style.cssText = `
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          color: #999;
          cursor: pointer;
          padding: 0 4px;
          display: none;
          z-index: 10;
        `;
        this._dropdown.style.cssText = `display: none;`;
        this._errorDiv.style.cssText = `color:#d32f2f;font-size:12px;margin-top:4px;display:none;`;

        this._bindEvents();
        this._initAutocomplete();
        this._updateUI();

        // If we have an existing value, populate the input
        if (this._formattedAddress) {
          this._input.value = this._formattedAddress;
          this._clearBtn.style.display = 'block';
        }
      }

      _bindEvents() {
        const self = this;

        // Input events
        this._input.addEventListener('input', (e) => {
          const value = e.target.value;
          self._clearBtn.style.display = value ? 'block' : 'none';

          // Debounce the API call
          clearTimeout(self._debounceTimer);
          if (value.length >= 2) {
            self._debounceTimer = setTimeout(() => {
              self._fetchSuggestions(value);
            }, 300);
          } else {
            self._hideDropdown();
          }
        });

        this._input.addEventListener('focus', () => {
          if (this._input.value.length >= 2 && this._suggestions.length > 0) {
            this._showDropdown();
          }
        });

        this._input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            self._hideDropdown();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            self._focusNextItem();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            self._focusPrevItem();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const focused = self._dropdown.querySelector('.ga-suggestion-item:focus');
            if (focused) {
              focused.click();
            }
          }
        });

        this._clearBtn.addEventListener('click', () => {
          self.clear();
        });

        // Outside click to close dropdown
        this._handleOutsideClick = (e) => {
          if (!self.contains(e.target) && !self._dropdown.contains(e.target)) {
            self._hideDropdown();
          }
        };
        document.addEventListener('click', this._handleOutsideClick);

        // Reposition dropdown on scroll/resize
        this._handleScroll = () => self._positionDropdown();
        this._handleResize = () => self._positionDropdown();
        window.addEventListener('scroll', this._handleScroll, true);
        window.addEventListener('resize', this._handleResize);
      }

      _initAutocomplete() {
        if (!this._apiKey) {
          this._showError('Google API Key is required');
          return;
        }

        const self = this;
        loadGoogleMapsApi(this._apiKey)
          .then(() => {
            // Create a new session token
            self._createSessionToken();
            self._hideError();
          })
          .catch((err) => {
            self._showError('Failed to load Google Maps API: ' + err.message);
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
          item.className = 'ga-suggestion-item';
          item.setAttribute('tabindex', '0');
          item.setAttribute('role', 'option');
          item.setAttribute('data-index', index);

          const prediction = suggestion.placePrediction;
          const mainText = prediction.mainText?.text || '';
          const secondaryText = prediction.secondaryText?.text || '';

          item.innerHTML = `
            <div class="ga-suggestion-main">${this._escapeHtml(mainText)}</div>
            <div class="ga-suggestion-secondary">${this._escapeHtml(secondaryText)}</div>
          `;

          item.style.cssText = `
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
          `;

          item.addEventListener('click', () => this._selectSuggestion(suggestion));
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              this._selectSuggestion(suggestion);
            }
          });

          item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f5f5f5';
          });
          item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '#ffffff';
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
          this._showError('Failed to get place details');
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
        // Portal dropdown to body for overlay behavior (like Arabic Calendar)
        if (!this._dropdown.__portaled) {
          document.body.appendChild(this._dropdown);
          this._dropdown.__portaled = true;
        }

        this._dropdown.style.cssText = `
          display: block;
          position: fixed;
          background-color: #ffffff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-height: 300px;
          overflow-y: auto;
          z-index: 2147483647;
        `;

        this._positionDropdown();
      }

      _hideDropdown() {
        if (this._dropdown) {
          this._dropdown.style.display = 'none';
        }
      }

      _positionDropdown() {
        if (!this._dropdown || this._dropdown.style.display === 'none') return;

        const rect = this._input.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = Math.min(300, this._dropdown.scrollHeight);

        // Position below input, or above if not enough space
        let top = rect.bottom + 4;
        if (top + dropdownHeight > viewportHeight) {
          top = rect.top - dropdownHeight - 4;
        }
        if (top < 8) top = 8;

        this._dropdown.style.top = top + 'px';
        this._dropdown.style.left = rect.left + 'px';
        this._dropdown.style.width = rect.width + 'px';
      }

      _focusNextItem() {
        const items = this._dropdown.querySelectorAll('.ga-suggestion-item');
        const focused = this._dropdown.querySelector('.ga-suggestion-item:focus');
        const currentIndex = focused ? parseInt(focused.getAttribute('data-index')) : -1;
        const nextIndex = Math.min(currentIndex + 1, items.length - 1);
        if (items[nextIndex]) items[nextIndex].focus();
      }

      _focusPrevItem() {
        const items = this._dropdown.querySelectorAll('.ga-suggestion-item');
        const focused = this._dropdown.querySelector('.ga-suggestion-item:focus');
        const currentIndex = focused ? parseInt(focused.getAttribute('data-index')) : items.length;
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (items[prevIndex]) items[prevIndex].focus();
      }

      _showError(message) {
        if (this._errorDiv) {
          this._errorDiv.textContent = message;
          this._errorDiv.style.display = 'block';
        }
      }

      _hideError() {
        if (this._errorDiv) {
          this._errorDiv.style.display = 'none';
        }
      }

      _updateUI() {
        if (this._input) {
          this._input.disabled = !this._isEnabled;
          this._input.style.backgroundColor = this._isEnabled
            ? 'var(--input-background-color, #ffffff)'
            : 'var(--input-disabled-background-color, #f5f5f5)';
          this._input.style.color = this._isEnabled
            ? 'var(--input-text-color, #666666)'
            : 'var(--input-disabled-text-color, #b2b2b2)';
        }
        if (this._clearBtn) {
          this._clearBtn.style.display = (this._input && this._input.value) ? 'block' : 'none';
        }
      }

      // Public methods
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
          this._clearBtn.style.display = this._formattedAddress ? 'block' : 'none';
        }

        safeRaisePropertyChanged(this, 'Value');
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

      get placeholderText() { return this._placeholderText; }
      set placeholderText(v) {
        this._placeholderText = v || 'Start typing an address...';
        if (this._input) this._input.placeholder = this._placeholderText;
      }
      get PlaceholderText() { return this.placeholderText; }
      set PlaceholderText(v) { this.placeholderText = v; }

      get controlWidth() { return this._controlWidth; }
      set controlWidth(v) {
        this._controlWidth = parseInt(v) || 400;
        if (this._hasRendered) {
          this.style.width = this._controlWidth + 'px';
        }
      }
      get ControlWidth() { return this.controlWidth; }
      set ControlWidth(v) { this.controlWidth = v; }

      get controlHeight() { return this._controlHeight; }
      set controlHeight(v) {
        this._controlHeight = parseInt(v) || 40;
        if (this._hasRendered && this._input) {
          this._input.style.height = this._controlHeight + 'px';
        }
      }
      get ControlHeight() { return this.controlHeight; }
      set ControlHeight(v) { this.controlHeight = v; }

      get countryRestriction() { return this._countryRestriction; }
      set countryRestriction(v) {
        this._countryRestriction = v || '';
      }
      get CountryRestriction() { return this.countryRestriction; }
      set CountryRestriction(v) { this.countryRestriction = v; }

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
        this.style.display = this._isVisible ? 'inline-block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
        if (this._hasRendered) this._updateUI();
      }
    });
  }
})();
