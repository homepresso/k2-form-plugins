if (!window.__nintexcaseheaderRuntimeLoaded) {
  window.__nintexcaseheaderRuntimeLoaded = true;

/**
 * NintexCase Header Control for K2 SmartForms
 * Header with title, subtitle, badges, action buttons, and configurable dropdown
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-case-header')) {
    window.customElements.define('nintexcase-case-header', class NintexCaseHeader extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Properties
        this._selectedAction = '';
        this._title = 'Case Title';
        this._subtitle = 'Case details';
        this._showBackButton = true;

        // Status badge
        this._statusText = 'In Review';
        this._statusIcon = 'schedule';
        this._statusColor = '#FFF3E0';
        this._statusTextColor = '#E65100';
        this._showStatus = true;

        // Priority badge
        this._priorityText = 'High Priority';
        this._priorityIcon = 'flag';
        this._priorityColor = '#FFEBEE';
        this._priorityTextColor = '#C62828';
        this._showPriority = true;

        // Action buttons
        this._showStarButton = true;
        this._showShareButton = true;
        this._showPrintButton = true;
        this._showEditButton = true;
        this._editButtonText = 'Edit';
        this._showReassignButton = true;
        this._reassignButtonText = 'Reassign';

        // Primary action / Dropdown
        this._primaryActionText = 'Approve Claim';
        this._primaryActionColor = '#4CAF50';
        this._primaryActionTextColor = '#FFFFFF';
        this._showPrimaryAction = true;
        this._dropdownActions = 'Approve,Reject,Send Back';
        this._showDropdown = false;
        this._showMenuButton = true;

        // Styling
        this._backgroundColor = '#FFFFFF';
        this._titleColor = '#1C1B1F';
        this._subtitleColor = '#666666';
        this._borderColor = '#E0E0E0';
        this._fontFamily = 'Roboto, sans-serif';

        this._isVisible = true;
        this._isEnabled = true;

        this._container = null;
        this._dropdownOpen = false;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        this._hasRendered = true;
        setTimeout(() => {
          this._render();
        }, 0);
      }

      _render() {
        this.innerHTML = '';
        this._buildHeader();
        this._applyStyles();
      }

      _buildHeader() {
        this._container = document.createElement('div');
        this._container.className = 'nch-container';

        // Left section: Back button + Title area
        const leftSection = document.createElement('div');
        leftSection.className = 'nch-left-section';

        // Back button
        if (this._showBackButton) {
          const backButton = document.createElement('button');
          backButton.className = 'nch-back-btn';
          backButton.type = 'button';
          backButton.title = 'Go back';
          backButton.setAttribute('aria-label', 'Go back');

          const backIcon = document.createElement('span');
          backIcon.className = 'material-icons';
          backIcon.textContent = 'arrow_back';
          backButton.appendChild(backIcon);

          backButton.addEventListener('click', () => {
            this._fireEvent('BackClicked', {});
          });

          leftSection.appendChild(backButton);
        }

        // Title area
        const titleArea = document.createElement('div');
        titleArea.className = 'nch-title-area';

        // Title row (title + badges)
        const titleRow = document.createElement('div');
        titleRow.className = 'nch-title-row';

        const titleText = document.createElement('h1');
        titleText.className = 'nch-title';
        titleText.textContent = this._title;
        titleRow.appendChild(titleText);

        // Status badge
        if (this._showStatus && this._statusText) {
          const statusBadge = document.createElement('div');
          statusBadge.className = 'nch-badge nch-status-badge';
          statusBadge.style.background = this._statusColor;
          statusBadge.style.color = this._statusTextColor;

          if (this._statusIcon) {
            const statusIconEl = document.createElement('span');
            statusIconEl.className = 'material-icons nch-badge-icon';
            statusIconEl.textContent = this._statusIcon;
            statusBadge.appendChild(statusIconEl);
          }

          const statusTextEl = document.createElement('span');
          statusTextEl.textContent = this._statusText;
          statusBadge.appendChild(statusTextEl);

          titleRow.appendChild(statusBadge);
        }

        // Priority badge
        if (this._showPriority && this._priorityText) {
          const priorityBadge = document.createElement('div');
          priorityBadge.className = 'nch-badge nch-priority-badge';
          priorityBadge.style.background = this._priorityColor;
          priorityBadge.style.color = this._priorityTextColor;

          if (this._priorityIcon) {
            const priorityIconEl = document.createElement('span');
            priorityIconEl.className = 'material-icons nch-badge-icon';
            priorityIconEl.textContent = this._priorityIcon;
            priorityBadge.appendChild(priorityIconEl);
          }

          const priorityTextEl = document.createElement('span');
          priorityTextEl.textContent = this._priorityText;
          priorityBadge.appendChild(priorityTextEl);

          titleRow.appendChild(priorityBadge);
        }

        titleArea.appendChild(titleRow);

        // Subtitle
        if (this._subtitle) {
          const subtitleEl = document.createElement('div');
          subtitleEl.className = 'nch-subtitle';
          subtitleEl.textContent = this._subtitle;
          titleArea.appendChild(subtitleEl);
        }

        leftSection.appendChild(titleArea);
        this._container.appendChild(leftSection);

        // Right section: Action buttons
        const rightSection = document.createElement('div');
        rightSection.className = 'nch-right-section';

        // Icon buttons (Star, Share, Print)
        const iconButtons = document.createElement('div');
        iconButtons.className = 'nch-icon-buttons';

        if (this._showStarButton) {
          const starBtn = this._createIconButton('star_border', 'Favorite', 'star');
          iconButtons.appendChild(starBtn);
        }

        if (this._showShareButton) {
          const shareBtn = this._createIconButton('share', 'Share', 'share');
          iconButtons.appendChild(shareBtn);
        }

        if (this._showPrintButton) {
          const printBtn = this._createIconButton('print', 'Print', 'print');
          iconButtons.appendChild(printBtn);
        }

        rightSection.appendChild(iconButtons);

        // Text action buttons (Edit, Reassign)
        const textButtons = document.createElement('div');
        textButtons.className = 'nch-text-buttons';

        if (this._showEditButton) {
          const editBtn = this._createTextButton('edit', this._editButtonText, 'edit');
          textButtons.appendChild(editBtn);
        }

        if (this._showReassignButton) {
          const reassignBtn = this._createTextButton('autorenew', this._reassignButtonText, 'reassign');
          textButtons.appendChild(reassignBtn);
        }

        rightSection.appendChild(textButtons);

        // Primary action button or Dropdown
        if (this._showDropdown) {
          const dropdownContainer = document.createElement('div');
          dropdownContainer.className = 'nch-dropdown-container';

          const dropdownButton = document.createElement('button');
          dropdownButton.className = 'nch-primary-btn nch-dropdown-btn';
          dropdownButton.type = 'button';
          dropdownButton.style.background = this._primaryActionColor;
          dropdownButton.style.color = this._primaryActionTextColor;

          const dropdownText = document.createElement('span');
          dropdownText.textContent = this._primaryActionText;
          dropdownButton.appendChild(dropdownText);

          const dropdownIcon = document.createElement('span');
          dropdownIcon.className = 'material-icons';
          dropdownIcon.textContent = 'arrow_drop_down';
          dropdownButton.appendChild(dropdownIcon);

          dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this._toggleDropdown();
          });

          dropdownContainer.appendChild(dropdownButton);

          // Dropdown menu
          const dropdownMenu = document.createElement('div');
          dropdownMenu.className = 'nch-dropdown-menu';
          dropdownMenu.style.display = 'none';

          const actions = this._dropdownActions.split(',').map(a => a.trim()).filter(a => a);
          actions.forEach(action => {
            const menuItem = document.createElement('button');
            menuItem.className = 'nch-dropdown-item';
            menuItem.type = 'button';
            menuItem.textContent = action;

            menuItem.addEventListener('click', () => {
              this._selectedAction = action;
              this._fireEvent('DropdownActionClicked', { action: action });
              this._closeDropdown();
            });

            dropdownMenu.appendChild(menuItem);
          });

          dropdownContainer.appendChild(dropdownMenu);
          rightSection.appendChild(dropdownContainer);

          // Close dropdown when clicking outside
          document.addEventListener('click', () => {
            this._closeDropdown();
          });

        } else if (this._showPrimaryAction) {
          const primaryBtn = document.createElement('button');
          primaryBtn.className = 'nch-primary-btn';
          primaryBtn.type = 'button';
          primaryBtn.textContent = this._primaryActionText;
          primaryBtn.style.background = this._primaryActionColor;
          primaryBtn.style.color = this._primaryActionTextColor;

          primaryBtn.addEventListener('click', () => {
            this._fireEvent('PrimaryActionClicked', { action: this._primaryActionText });
          });

          rightSection.appendChild(primaryBtn);
        }

        // Three-dot menu button
        if (this._showMenuButton) {
          const menuBtn = this._createIconButton('more_vert', 'More options', 'menu');
          rightSection.appendChild(menuBtn);
        }

        this._container.appendChild(rightSection);
        this.appendChild(this._container);
      }

      _createIconButton(icon, title, action) {
        const btn = document.createElement('button');
        btn.className = 'nch-icon-btn';
        btn.type = 'button';
        btn.title = title;
        btn.setAttribute('aria-label', title);

        const iconEl = document.createElement('span');
        iconEl.className = 'material-icons';
        iconEl.textContent = icon;
        btn.appendChild(iconEl);

        btn.addEventListener('click', () => {
          this._fireEvent('ActionClicked', { action: action });
        });

        return btn;
      }

      _createTextButton(icon, text, action) {
        const btn = document.createElement('button');
        btn.className = 'nch-text-btn';
        btn.type = 'button';

        const iconEl = document.createElement('span');
        iconEl.className = 'material-icons';
        iconEl.textContent = icon;
        btn.appendChild(iconEl);

        const textEl = document.createElement('span');
        textEl.textContent = text;
        btn.appendChild(textEl);

        btn.addEventListener('click', () => {
          this._fireEvent('ActionClicked', { action: action });
        });

        return btn;
      }

      _toggleDropdown() {
        const dropdown = this.querySelector('.nch-dropdown-menu');
        if (dropdown) {
          this._dropdownOpen = !this._dropdownOpen;
          dropdown.style.display = this._dropdownOpen ? 'block' : 'none';
        }
      }

      _closeDropdown() {
        const dropdown = this.querySelector('.nch-dropdown-menu');
        if (dropdown) {
          this._dropdownOpen = false;
          dropdown.style.display = 'none';
        }
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--nch-bg', this._backgroundColor);
          this._container.style.setProperty('--nch-title-color', this._titleColor);
          this._container.style.setProperty('--nch-subtitle-color', this._subtitleColor);
          this._container.style.setProperty('--nch-border-color', this._borderColor);
          this._container.style.setProperty('--nch-font-family', this._fontFamily);
        }

        if (!this._isEnabled) {
          const buttons = this.querySelectorAll('button');
          buttons.forEach(btn => {
            btn.disabled = true;
          });
        }
      }

      _fireEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
          detail: detail,
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      }

      // Properties
      get selectedAction() { return this._selectedAction; }
      set selectedAction(v) {
        this._selectedAction = v || '';
      }
      get SelectedAction() { return this.selectedAction; }
      set SelectedAction(v) { this.selectedAction = v; }

      get Value() { return this._selectedAction; }
      set Value(v) { this.selectedAction = v; }

      get title() { return this._title; }
      set title(v) {
        this._title = v || 'Case Title';
        if (this._hasRendered) this._render();
      }
      get Title() { return this.title; }
      set Title(v) { this.title = v; }

      get subtitle() { return this._subtitle; }
      set subtitle(v) {
        this._subtitle = v || '';
        if (this._hasRendered) this._render();
      }
      get Subtitle() { return this.subtitle; }
      set Subtitle(v) { this.subtitle = v; }

      get showBackButton() { return this._showBackButton; }
      set showBackButton(v) {
        this._showBackButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowBackButton() { return this.showBackButton; }
      set ShowBackButton(v) { this.showBackButton = v; }

      get statusText() { return this._statusText; }
      set statusText(v) {
        this._statusText = v || '';
        if (this._hasRendered) this._render();
      }
      get StatusText() { return this.statusText; }
      set StatusText(v) { this.statusText = v; }

      get statusIcon() { return this._statusIcon; }
      set statusIcon(v) {
        this._statusIcon = v || '';
        if (this._hasRendered) this._render();
      }
      get StatusIcon() { return this.statusIcon; }
      set StatusIcon(v) { this.statusIcon = v; }

      get statusColor() { return this._statusColor; }
      set statusColor(v) {
        this._statusColor = v || '#FFF3E0';
        if (this._hasRendered) this._render();
      }
      get StatusColor() { return this.statusColor; }
      set StatusColor(v) { this.statusColor = v; }

      get statusTextColor() { return this._statusTextColor; }
      set statusTextColor(v) {
        this._statusTextColor = v || '#E65100';
        if (this._hasRendered) this._render();
      }
      get StatusTextColor() { return this.statusTextColor; }
      set StatusTextColor(v) { this.statusTextColor = v; }

      get showStatus() { return this._showStatus; }
      set showStatus(v) {
        this._showStatus = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowStatus() { return this.showStatus; }
      set ShowStatus(v) { this.showStatus = v; }

      get priorityText() { return this._priorityText; }
      set priorityText(v) {
        this._priorityText = v || '';
        if (this._hasRendered) this._render();
      }
      get PriorityText() { return this.priorityText; }
      set PriorityText(v) { this.priorityText = v; }

      get priorityIcon() { return this._priorityIcon; }
      set priorityIcon(v) {
        this._priorityIcon = v || '';
        if (this._hasRendered) this._render();
      }
      get PriorityIcon() { return this.priorityIcon; }
      set PriorityIcon(v) { this.priorityIcon = v; }

      get priorityColor() { return this._priorityColor; }
      set priorityColor(v) {
        this._priorityColor = v || '#FFEBEE';
        if (this._hasRendered) this._render();
      }
      get PriorityColor() { return this.priorityColor; }
      set PriorityColor(v) { this.priorityColor = v; }

      get priorityTextColor() { return this._priorityTextColor; }
      set priorityTextColor(v) {
        this._priorityTextColor = v || '#C62828';
        if (this._hasRendered) this._render();
      }
      get PriorityTextColor() { return this.priorityTextColor; }
      set PriorityTextColor(v) { this.priorityTextColor = v; }

      get showPriority() { return this._showPriority; }
      set showPriority(v) {
        this._showPriority = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowPriority() { return this.showPriority; }
      set ShowPriority(v) { this.showPriority = v; }

      get showStarButton() { return this._showStarButton; }
      set showStarButton(v) {
        this._showStarButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowStarButton() { return this.showStarButton; }
      set ShowStarButton(v) { this.showStarButton = v; }

      get showShareButton() { return this._showShareButton; }
      set showShareButton(v) {
        this._showShareButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowShareButton() { return this.showShareButton; }
      set ShowShareButton(v) { this.showShareButton = v; }

      get showPrintButton() { return this._showPrintButton; }
      set showPrintButton(v) {
        this._showPrintButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowPrintButton() { return this.showPrintButton; }
      set ShowPrintButton(v) { this.showPrintButton = v; }

      get showEditButton() { return this._showEditButton; }
      set showEditButton(v) {
        this._showEditButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowEditButton() { return this.showEditButton; }
      set ShowEditButton(v) { this.showEditButton = v; }

      get editButtonText() { return this._editButtonText; }
      set editButtonText(v) {
        this._editButtonText = v || 'Edit';
        if (this._hasRendered) this._render();
      }
      get EditButtonText() { return this.editButtonText; }
      set EditButtonText(v) { this.editButtonText = v; }

      get showReassignButton() { return this._showReassignButton; }
      set showReassignButton(v) {
        this._showReassignButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowReassignButton() { return this.showReassignButton; }
      set ShowReassignButton(v) { this.showReassignButton = v; }

      get reassignButtonText() { return this._reassignButtonText; }
      set reassignButtonText(v) {
        this._reassignButtonText = v || 'Reassign';
        if (this._hasRendered) this._render();
      }
      get ReassignButtonText() { return this.reassignButtonText; }
      set ReassignButtonText(v) { this.reassignButtonText = v; }

      get primaryActionText() { return this._primaryActionText; }
      set primaryActionText(v) {
        this._primaryActionText = v || 'Approve Claim';
        if (this._hasRendered) this._render();
      }
      get PrimaryActionText() { return this.primaryActionText; }
      set PrimaryActionText(v) { this.primaryActionText = v; }

      get primaryActionColor() { return this._primaryActionColor; }
      set primaryActionColor(v) {
        this._primaryActionColor = v || '#4CAF50';
        if (this._hasRendered) this._render();
      }
      get PrimaryActionColor() { return this.primaryActionColor; }
      set PrimaryActionColor(v) { this.primaryActionColor = v; }

      get primaryActionTextColor() { return this._primaryActionTextColor; }
      set primaryActionTextColor(v) {
        this._primaryActionTextColor = v || '#FFFFFF';
        if (this._hasRendered) this._render();
      }
      get PrimaryActionTextColor() { return this.primaryActionTextColor; }
      set PrimaryActionTextColor(v) { this.primaryActionTextColor = v; }

      get showPrimaryAction() { return this._showPrimaryAction; }
      set showPrimaryAction(v) {
        this._showPrimaryAction = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowPrimaryAction() { return this.showPrimaryAction; }
      set ShowPrimaryAction(v) { this.showPrimaryAction = v; }

      get dropdownActions() { return this._dropdownActions; }
      set dropdownActions(v) {
        this._dropdownActions = v || '';
        if (this._hasRendered) this._render();
      }
      get DropdownActions() { return this.dropdownActions; }
      set DropdownActions(v) { this.dropdownActions = v; }

      get showDropdown() { return this._showDropdown; }
      set showDropdown(v) {
        this._showDropdown = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowDropdown() { return this.showDropdown; }
      set ShowDropdown(v) { this.showDropdown = v; }

      get showMenuButton() { return this._showMenuButton; }
      set showMenuButton(v) {
        this._showMenuButton = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowMenuButton() { return this.showMenuButton; }
      set ShowMenuButton(v) { this.showMenuButton = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get subtitleColor() { return this._subtitleColor; }
      set subtitleColor(v) {
        this._subtitleColor = v || '#666666';
        if (this._hasRendered) this._applyStyles();
      }
      get SubtitleColor() { return this.subtitleColor; }
      set SubtitleColor(v) { this.subtitleColor = v; }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v || '#E0E0E0';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderColor() { return this.borderColor; }
      set BorderColor(v) { this.borderColor = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Roboto, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

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

}
