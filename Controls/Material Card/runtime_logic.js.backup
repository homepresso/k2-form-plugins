if (!window.__materialcardRuntimeLoaded) {
  window.__materialcardRuntimeLoaded = true;

/**
 * Material Card Control for K2 SmartForms
 * Material 3 Design card for displaying content in a contained format
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

  if (!window.customElements.get('material-card')) {
    window.customElements.define('material-card', class MaterialCard extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._variant = 'elevated'; // elevated, filled, outlined
        this._headline = '';
        this._subhead = '';
        this._supportingText = '';
        this._image = '';
        this._imagePosition = 'top'; // top, bottom
        this._avatar = '';
        this._avatarText = '';
        this._overline = '';
        this._primaryAction = '';
        this._secondaryAction = '';
        this._showDivider = false;
        this._clickable = false;
        this._ariaLabel = '';

        // Color properties
        this._primaryColor = '#6750A4';
        this._backgroundColor = '#FFFBFE';
        this._surfaceColor = '#F7F2FA';
        this._borderColor = '#CAC4D0';
        this._headlineColor = '#1C1B1F';
        this._subheadColor = '#49454F';
        this._supportingTextColor = '#49454F';
        this._overlineColor = '#79747E';
        this._actionColor = '';
        this._dividerColor = '#CAC4D0';
        this._avatarBackgroundColor = '#E8DEF8';
        this._avatarTextColor = '#1D192B';

        this._fontFamily = 'Roboto, sans-serif';
        this._fontSize = 14;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._isVisible = true;
        this._isEnabled = true;

        // DOM refs
        this._container = null;
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
        this._buildCard();
        this._applyStyles();
        this._bindEvents();
      }

      _buildCard() {
        this._container = document.createElement('div');
        this._container.className = `mcd-container mcd-${this._variant}`;
        if (this._clickable) {
          this._container.classList.add('mcd-clickable');
          this._container.setAttribute('role', 'button');
          this._container.setAttribute('tabindex', '0');

          // WCAG 2.4.4: Clickable cards must have accessible names
          const accessibleLabel = this._ariaLabel || this._headline || 'Card';
          this._container.setAttribute('aria-label', accessibleLabel);
        }

        // Media (top position)
        if (this._image && this._imagePosition === 'top') {
          this._buildMedia();
        }

        // Header
        if (this._avatar || this._avatarText || this._headline || this._subhead || this._overline) {
          this._buildHeader();
        }

        // Media (bottom position)
        if (this._image && this._imagePosition === 'bottom') {
          this._buildMedia();
        }

        // Supporting text
        if (this._supportingText) {
          const content = document.createElement('div');
          content.className = 'mcd-content';
          const text = document.createElement('p');
          text.className = 'mcd-supporting-text';
          text.textContent = this._supportingText;
          content.appendChild(text);
          this._container.appendChild(content);
        }

        // Divider
        if (this._showDivider && (this._primaryAction || this._secondaryAction)) {
          const divider = document.createElement('div');
          divider.className = 'mcd-divider';
          this._container.appendChild(divider);
        }

        // Actions
        if (this._primaryAction || this._secondaryAction) {
          this._buildActions();
        }

        // State layer for clickable
        if (this._clickable) {
          const stateLayer = document.createElement('div');
          stateLayer.className = 'mcd-state-layer';
          this._container.appendChild(stateLayer);
        }

        this.appendChild(this._container);
        this._updateState();
      }

      _buildMedia() {
        const media = document.createElement('div');
        media.className = 'mcd-media';
        media.style.backgroundImage = `url(${this._image})`;
        this._container.appendChild(media);
      }

      _buildHeader() {
        const header = document.createElement('div');
        header.className = 'mcd-header';

        // Avatar
        if (this._avatar || this._avatarText) {
          const avatar = document.createElement('div');
          avatar.className = 'mcd-avatar';

          if (this._avatar) {
            if (this._avatar.startsWith('http') || this._avatar.startsWith('/') || this._avatar.startsWith('data:')) {
              const img = document.createElement('img');
              img.src = this._avatar;
              img.alt = this._headline || 'Avatar';
              avatar.appendChild(img);
            } else {
              // Material icon
              avatar.innerHTML = `<span class="material-icons">${this._avatar}</span>`;
            }
          } else if (this._avatarText) {
            avatar.textContent = this._avatarText.charAt(0).toUpperCase();
          }

          header.appendChild(avatar);
        }

        // Header text
        const headerText = document.createElement('div');
        headerText.className = 'mcd-header-text';

        if (this._overline) {
          const overline = document.createElement('span');
          overline.className = 'mcd-overline';
          overline.textContent = this._overline;
          headerText.appendChild(overline);
        }

        if (this._headline) {
          const headline = document.createElement('h3');
          headline.className = 'mcd-headline';
          headline.textContent = this._headline;
          headerText.appendChild(headline);
        }

        if (this._subhead) {
          const subhead = document.createElement('span');
          subhead.className = 'mcd-subhead';
          subhead.textContent = this._subhead;
          headerText.appendChild(subhead);
        }

        header.appendChild(headerText);
        this._container.appendChild(header);
      }

      _buildActions() {
        const actions = document.createElement('div');
        actions.className = 'mcd-actions';

        if (this._secondaryAction) {
          const secondaryBtn = document.createElement('button');
          secondaryBtn.className = 'mcd-action mcd-action-secondary';
          secondaryBtn.type = 'button';
          secondaryBtn.textContent = this._secondaryAction;
          actions.appendChild(secondaryBtn);
        }

        if (this._primaryAction) {
          const primaryBtn = document.createElement('button');
          primaryBtn.className = 'mcd-action mcd-action-primary';
          primaryBtn.type = 'button';
          primaryBtn.textContent = this._primaryAction;
          actions.appendChild(primaryBtn);
        }

        this._container.appendChild(actions);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';
        this.style.fontFamily = this._fontFamily;

        // Set CSS custom properties on the container element
        if (this._container) {
          this._container.style.setProperty('--mcd-primary', this._primaryColor);
          this._container.style.setProperty('--mcd-background', this._backgroundColor);
          this._container.style.setProperty('--mcd-surface', this._surfaceColor);
          this._container.style.setProperty('--mcd-border', this._borderColor);
          this._container.style.setProperty('--mcd-headline', this._headlineColor);
          this._container.style.setProperty('--mcd-subhead', this._subheadColor);
          this._container.style.setProperty('--mcd-supporting', this._supportingTextColor);
          this._container.style.setProperty('--mcd-overline', this._overlineColor);
          this._container.style.setProperty('--mcd-divider', this._dividerColor);
          this._container.style.setProperty('--mcd-avatar-bg', this._avatarBackgroundColor);
          this._container.style.setProperty('--mcd-avatar-text', this._avatarTextColor);
          this._container.style.setProperty('--mcd-action', this._actionColor || this._primaryColor);

          // Apply font styling directly to text elements
          const headline = this._container.querySelector('.mcd-headline');
          const subhead = this._container.querySelector('.mcd-subhead');
          const supportingText = this._container.querySelector('.mcd-supporting-text');
          const overline = this._container.querySelector('.mcd-overline');

          [headline, subhead, supportingText, overline].forEach(el => {
            if (el) {
              el.style.fontSize = `${this._fontSize}px`;
              el.style.fontWeight = this._fontWeight;
              el.style.fontStyle = this._fontStyle;
            }
          });
        }
      }

      _bindEvents() {
        // Card click
        if (this._clickable) {
          this._container.addEventListener('click', (e) => {
            if (!this._isEnabled) return;
            if (e.target.classList.contains('mcd-action')) return;

            this.dispatchEvent(new CustomEvent('CardClicked', {
              bubbles: true,
              detail: { headline: this._headline }
            }));
          });

          this._container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._container.click();
            }
          });
        }

        // Action buttons
        const primaryBtn = this._container.querySelector('.mcd-action-primary');
        const secondaryBtn = this._container.querySelector('.mcd-action-secondary');

        if (primaryBtn) {
          primaryBtn.addEventListener('click', (e) => {
            if (!this._isEnabled) return;
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('PrimaryAction', {
              bubbles: true,
              detail: { action: this._primaryAction }
            }));
          });
        }

        if (secondaryBtn) {
          secondaryBtn.addEventListener('click', (e) => {
            if (!this._isEnabled) return;
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('SecondaryAction', {
              bubbles: true,
              detail: { action: this._secondaryAction }
            }));
          });
        }
      }

      _updateState() {
        if (!this._container) return;
        this._container.classList.toggle('mcd-disabled', !this._isEnabled);
      }

      // Properties
      get variant() { return this._variant; }
      set variant(v) {
        const valid = ['elevated', 'filled', 'outlined'];
        this._variant = valid.includes(v) ? v : 'elevated';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'variant');
      }
      get Variant() { return this.variant; }
      set Variant(v) { this.variant = v; }

      get headline() { return this._headline; }
      set headline(v) {
        this._headline = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'headline');
      }
      get Headline() { return this.headline; }
      set Headline(v) { this.headline = v; }

      get subhead() { return this._subhead; }
      set subhead(v) {
        this._subhead = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'subhead');
      }
      get Subhead() { return this.subhead; }
      set Subhead(v) { this.subhead = v; }

      get supportingText() { return this._supportingText; }
      set supportingText(v) {
        this._supportingText = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'supportingText');
      }
      get SupportingText() { return this.supportingText; }
      set SupportingText(v) { this.supportingText = v; }

      get image() { return this._image; }
      set image(v) {
        this._image = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'image');
      }
      get Image() { return this.image; }
      set Image(v) { this.image = v; }

      get imagePosition() { return this._imagePosition; }
      set imagePosition(v) {
        this._imagePosition = (v === 'bottom') ? 'bottom' : 'top';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'imagePosition');
      }
      get ImagePosition() { return this.imagePosition; }
      set ImagePosition(v) { this.imagePosition = v; }

      get avatar() { return this._avatar; }
      set avatar(v) {
        this._avatar = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'avatar');
      }
      get Avatar() { return this.avatar; }
      set Avatar(v) { this.avatar = v; }

      get avatarText() { return this._avatarText; }
      set avatarText(v) {
        this._avatarText = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'avatarText');
      }
      get AvatarText() { return this.avatarText; }
      set AvatarText(v) { this.avatarText = v; }

      get overline() { return this._overline; }
      set overline(v) {
        this._overline = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'overline');
      }
      get Overline() { return this.overline; }
      set Overline(v) { this.overline = v; }

      get primaryAction() { return this._primaryAction; }
      set primaryAction(v) {
        this._primaryAction = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'primaryAction');
      }
      get PrimaryAction() { return this.primaryAction; }
      set PrimaryAction(v) { this.primaryAction = v; }

      get secondaryAction() { return this._secondaryAction; }
      set secondaryAction(v) {
        this._secondaryAction = v || '';
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'secondaryAction');
      }
      get SecondaryAction() { return this.secondaryAction; }
      set SecondaryAction(v) { this.secondaryAction = v; }

      get showDivider() { return this._showDivider; }
      set showDivider(v) {
        this._showDivider = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'showDivider');
      }
      get ShowDivider() { return this.showDivider; }
      set ShowDivider(v) { this.showDivider = v; }

      get clickable() { return this._clickable; }
      set clickable(v) {
        this._clickable = (v === true || v === 'true');
        if (this._hasRendered) this._render();
        safeRaisePropertyChanged(this, 'clickable');
      }
      get Clickable() { return this.clickable; }
      set Clickable(v) { this.clickable = v; }

      get ariaLabel() { return this._ariaLabel; }
      set ariaLabel(v) {
        this._ariaLabel = v || '';
        if (this._hasRendered && this._clickable && this._container) {
          const accessibleLabel = this._ariaLabel || this._headline || 'Card';
          this._container.setAttribute('aria-label', accessibleLabel);
        }
        safeRaisePropertyChanged(this, 'ariaLabel');
      }
      get AriaLabel() { return this.ariaLabel; }
      set AriaLabel(v) { this.ariaLabel = v; }

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

      get surfaceColor() { return this._surfaceColor; }
      set surfaceColor(v) {
        this._surfaceColor = v || '#F7F2FA';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'surfaceColor');
      }
      get SurfaceColor() { return this.surfaceColor; }
      set SurfaceColor(v) { this.surfaceColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#CAC4D0';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'borderColor');
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get headlineColor() { return this._headlineColor; }
      set headlineColor(v) {
        this._headlineColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'headlineColor');
      }
      get HeadlineColor() { return this.headlineColor; }
      set HeadlineColor(v) { this.headlineColor = v; }

      get subheadColor() { return this._subheadColor; }
      set subheadColor(v) {
        this._subheadColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'subheadColor');
      }
      get SubheadColor() { return this.subheadColor; }
      set SubheadColor(v) { this.subheadColor = v; }

      get supportingTextColor() { return this._supportingTextColor; }
      set supportingTextColor(v) {
        this._supportingTextColor = v || '#49454F';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'supportingTextColor');
      }
      get SupportingTextColor() { return this.supportingTextColor; }
      set SupportingTextColor(v) { this.supportingTextColor = v; }

      get overlineColor() { return this._overlineColor; }
      set overlineColor(v) {
        this._overlineColor = v || '#79747E';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'overlineColor');
      }
      get OverlineColor() { return this.overlineColor; }
      set OverlineColor(v) { this.overlineColor = v; }

      get actionColor() { return this._actionColor; }
      set actionColor(v) {
        this._actionColor = v || '';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'actionColor');
      }
      get ActionColor() { return this.actionColor; }
      set ActionColor(v) { this.actionColor = v; }

      get dividerColor() { return this._dividerColor; }
      set dividerColor(v) {
        this._dividerColor = v || '#CAC4D0';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'dividerColor');
      }
      get DividerColor() { return this.dividerColor; }
      set DividerColor(v) { this.dividerColor = v; }

      get avatarBackgroundColor() { return this._avatarBackgroundColor; }
      set avatarBackgroundColor(v) {
        this._avatarBackgroundColor = v || '#E8DEF8';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'avatarBackgroundColor');
      }
      get AvatarBackgroundColor() { return this.avatarBackgroundColor; }
      set AvatarBackgroundColor(v) { this.avatarBackgroundColor = v; }

      get avatarTextColor() { return this._avatarTextColor; }
      set avatarTextColor(v) {
        this._avatarTextColor = v || '#1D192B';
        if (this._hasRendered) this._applyStyles();
        safeRaisePropertyChanged(this, 'avatarTextColor');
      }
      get AvatarTextColor() { return this.avatarTextColor; }
      set AvatarTextColor(v) { this.avatarTextColor = v; }

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
        this._fontSize = v || 14;
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

}
