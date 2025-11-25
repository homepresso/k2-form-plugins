/**
 * Google Address Lookup Control for K2 SmartForms
 * Uses Google Places Autocomplete API
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

  function loadGoogleMapsApi(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
        return;
      }

      if (loadedApiKeys.has(apiKey)) {
        // Already loading, wait for it
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });
  }

  const template = document.createElement('template');
  template.innerHTML = `
    <div class="ga-wrapper">
      <input type="text" class="ga-input" autocomplete="off" />
      <button type="button" class="ga-clear-btn" title="Clear">&times;</button>
      <div class="ga-error"></div>
    </div>
  `;

  if (!window.customElements.get('google-address')) {
    window.customElements.define('google-address', class GoogleAddress extends HTMLElement {
      constructor() {
        super();
        this._value = null;
        this._hasRendered = false;
        this._autocomplete = null;

        // Properties
        this._apiKey = '';
        this._placeholderText = 'Start typing an address...';
        this._controlWidth = 400;
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
        this._errorDiv = null;
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

        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        this._wrapper = this.querySelector('.ga-wrapper');
        this._input = this.querySelector('.ga-input');
        this._clearBtn = this.querySelector('.ga-clear-btn');
        this._errorDiv = this.querySelector('.ga-error');

        this.style.cssText = `display:inline-block;width:${w}px;`;
        this._wrapper.style.cssText = `position:relative;width:100%;`;
        this._input.style.cssText = `width:100%;padding:8px 32px 8px 12px;border:1px solid #ccc;border-radius:4px;font-size:14px;box-sizing:border-box;`;
        this._input.placeholder = this._placeholderText;
        this._clearBtn.style.cssText = `position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:18px;color:#999;cursor:pointer;padding:0 4px;display:none;`;
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

        this._input.addEventListener('input', function() {
          self._clearBtn.style.display = this.value ? 'block' : 'none';
        });

        this._clearBtn.addEventListener('click', function() {
          self.clear();
        });

        this._input.addEventListener('keydown', function(e) {
          // Prevent form submission on enter
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        });
      }

      _initAutocomplete() {
        if (!this._apiKey) {
          this._showError('Google API Key is required');
          return;
        }

        const self = this;

        loadGoogleMapsApi(this._apiKey)
          .then(() => {
            self._setupAutocomplete();
          })
          .catch((err) => {
            self._showError('Failed to load Google Maps API: ' + err.message);
          });
      }

      _setupAutocomplete() {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          this._showError('Google Maps API not loaded');
          return;
        }

        const options = {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry', 'place_id']
        };

        // Add country restriction if specified
        if (this._countryRestriction) {
          const countries = this._countryRestriction.split(',').map(c => c.trim().toLowerCase());
          options.componentRestrictions = { country: countries };
        }

        this._autocomplete = new google.maps.places.Autocomplete(this._input, options);

        const self = this;
        this._autocomplete.addListener('place_changed', function() {
          self._onPlaceSelected();
        });

        this._hideError();
      }

      _onPlaceSelected() {
        const place = this._autocomplete.getPlace();

        if (!place || !place.address_components) {
          return;
        }

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

        this.dispatchEvent(new Event('change', {bubbles: true}));
        this.dispatchEvent(new CustomEvent('Changed', {detail: addressData}));
      }

      _parseAddressComponents(place) {
        // Reset all fields
        this._streetNumber = '';
        this._streetName = '';
        this._city = '';
        this._state = '';
        this._postalCode = '';
        this._country = '';

        // Parse components
        for (const component of place.address_components) {
          const type = component.types[0];

          switch (type) {
            case 'street_number':
              this._streetNumber = component.long_name;
              break;
            case 'route':
              this._streetName = component.long_name;
              break;
            case 'locality':
              this._city = component.long_name;
              break;
            case 'administrative_area_level_1':
              this._state = component.short_name;
              break;
            case 'postal_code':
              this._postalCode = component.long_name;
              break;
            case 'country':
              this._country = component.long_name;
              break;
            case 'sublocality_level_1':
              // Fallback for city in some countries
              if (!this._city) this._city = component.long_name;
              break;
            case 'postal_town':
              // UK uses postal_town for city
              if (!this._city) this._city = component.long_name;
              break;
          }
        }

        this._formattedAddress = place.formatted_address || '';
        this._placeId = place.place_id || '';

        if (place.geometry && place.geometry.location) {
          this._latitude = place.geometry.location.lat().toString();
          this._longitude = place.geometry.location.lng().toString();
        }
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
          this._input.style.backgroundColor = this._isEnabled ? '#fff' : '#f5f5f5';
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

        if (this._input) {
          this._input.value = '';
        }
        if (this._clearBtn) {
          this._clearBtn.style.display = 'none';
        }

        safeRaisePropertyChanged(this, 'Value');
        this.dispatchEvent(new Event('change', {bubbles: true}));
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
        if (this._hasRendered && this._apiKey && !this._autocomplete) {
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

      get countryRestriction() { return this._countryRestriction; }
      set countryRestriction(v) {
        this._countryRestriction = v || '';
      }
      get CountryRestriction() { return this.countryRestriction; }
      set CountryRestriction(v) { this.countryRestriction = v; }

      // Read-only parsed address properties
      get formattedAddress() { return this._formattedAddress; }
      set formattedAddress(v) { /* Read-only at runtime */ }
      get FormattedAddress() { return this.formattedAddress; }
      set FormattedAddress(v) { this.formattedAddress = v; }

      get streetNumber() { return this._streetNumber; }
      set streetNumber(v) { /* Read-only at runtime */ }
      get StreetNumber() { return this.streetNumber; }
      set StreetNumber(v) { this.streetNumber = v; }

      get streetName() { return this._streetName; }
      set streetName(v) { /* Read-only at runtime */ }
      get StreetName() { return this.streetName; }
      set StreetName(v) { this.streetName = v; }

      get city() { return this._city; }
      set city(v) { /* Read-only at runtime */ }
      get City() { return this.city; }
      set City(v) { this.city = v; }

      get state() { return this._state; }
      set state(v) { /* Read-only at runtime */ }
      get State() { return this.state; }
      set State(v) { this.state = v; }

      get postalCode() { return this._postalCode; }
      set postalCode(v) { /* Read-only at runtime */ }
      get PostalCode() { return this.postalCode; }
      set PostalCode(v) { this.postalCode = v; }

      get country() { return this._country; }
      set country(v) { /* Read-only at runtime */ }
      get Country() { return this.country; }
      set Country(v) { this.country = v; }

      get latitude() { return this._latitude; }
      set latitude(v) { /* Read-only at runtime */ }
      get Latitude() { return this.latitude; }
      set Latitude(v) { this.latitude = v; }

      get longitude() { return this._longitude; }
      set longitude(v) { /* Read-only at runtime */ }
      get Longitude() { return this.longitude; }
      set Longitude(v) { this.longitude = v; }

      get placeId() { return this._placeId; }
      set placeId(v) { /* Read-only at runtime */ }
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
