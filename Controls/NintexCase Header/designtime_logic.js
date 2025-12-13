if (!window.__nintexcasecaseheaderDesigntimeLoaded) {
  window.__nintexcasecaseheaderDesigntimeLoaded = true;

/**
 * NintexCase Header Control - Design Time Logic
 * Creates a static, readonly preview for the designer
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-case-header-designtime')) {
    window.customElements.define('nintexcase-case-header-designtime', class NintexCaseCaseHeaderDesigntime extends HTMLElement {
      constructor() {
        super();

        // Default property values
        this._title = 'Case Title';
        this._subtitle = 'Case details';
        this._showBackButton = true;
        this._statusText = 'In Review';
        this._statusIcon = 'schedule';
        this._statusColor = '#FFF3E0';
        this._statusTextColor = '#E65100';
        this._showStatus = true;
        this._priorityText = 'High Priority';
        this._priorityIcon = 'flag';
        this._priorityColor = '#FFEBEE';
        this._priorityTextColor = '#C62828';
        this._showPriority = true;
        this._showStarButton = true;
        this._showShareButton = true;
        this._showPrintButton = true;
        this._showEditButton = true;
        this._editButtonText = 'Edit';
        this._showReassignButton = true;
        this._reassignButtonText = 'Reassign';
        this._primaryActionText = 'Approve Claim';
        this._primaryActionColor = '#4CAF50';
        this._primaryActionTextColor = '#FFFFFF';
        this._showPrimaryAction = true;
        this._dropdownActions = 'Approve,Reject,Send Back';
        this._showDropdown = false;
        this._showMenuButton = true;
        this._backgroundColor = '#FFFFFF';
        this._titleColor = '#1C1B1F';
        this._subtitleColor = '#666666';
        this._borderColor = '#E0E0E0';
        this._fontFamily = 'Roboto, sans-serif';
      }

      connectedCallback() {
        this.render();
      }

      // Property getters and setters
      get title() { return this._title; }
      set title(v) {
        this._title = v;
        this.render();
      }

      get subtitle() { return this._subtitle; }
      set subtitle(v) {
        this._subtitle = v;
        this.render();
      }

      get showBackButton() { return this._showBackButton; }
      set showBackButton(v) {
        this._showBackButton = v === 'true' || v === true;
        this.render();
      }

      get statusText() { return this._statusText; }
      set statusText(v) {
        this._statusText = v;
        this.render();
      }

      get statusIcon() { return this._statusIcon; }
      set statusIcon(v) {
        this._statusIcon = v;
        this.render();
      }

      get statusColor() { return this._statusColor; }
      set statusColor(v) {
        this._statusColor = v;
        this.render();
      }

      get statusTextColor() { return this._statusTextColor; }
      set statusTextColor(v) {
        this._statusTextColor = v;
        this.render();
      }

      get showStatus() { return this._showStatus; }
      set showStatus(v) {
        this._showStatus = v === 'true' || v === true;
        this.render();
      }

      get priorityText() { return this._priorityText; }
      set priorityText(v) {
        this._priorityText = v;
        this.render();
      }

      get priorityIcon() { return this._priorityIcon; }
      set priorityIcon(v) {
        this._priorityIcon = v;
        this.render();
      }

      get priorityColor() { return this._priorityColor; }
      set priorityColor(v) {
        this._priorityColor = v;
        this.render();
      }

      get priorityTextColor() { return this._priorityTextColor; }
      set priorityTextColor(v) {
        this._priorityTextColor = v;
        this.render();
      }

      get showPriority() { return this._showPriority; }
      set showPriority(v) {
        this._showPriority = v === 'true' || v === true;
        this.render();
      }

      get showStarButton() { return this._showStarButton; }
      set showStarButton(v) {
        this._showStarButton = v === 'true' || v === true;
        this.render();
      }

      get showShareButton() { return this._showShareButton; }
      set showShareButton(v) {
        this._showShareButton = v === 'true' || v === true;
        this.render();
      }

      get showPrintButton() { return this._showPrintButton; }
      set showPrintButton(v) {
        this._showPrintButton = v === 'true' || v === true;
        this.render();
      }

      get showEditButton() { return this._showEditButton; }
      set showEditButton(v) {
        this._showEditButton = v === 'true' || v === true;
        this.render();
      }

      get editButtonText() { return this._editButtonText; }
      set editButtonText(v) {
        this._editButtonText = v;
        this.render();
      }

      get showReassignButton() { return this._showReassignButton; }
      set showReassignButton(v) {
        this._showReassignButton = v === 'true' || v === true;
        this.render();
      }

      get reassignButtonText() { return this._reassignButtonText; }
      set reassignButtonText(v) {
        this._reassignButtonText = v;
        this.render();
      }

      get primaryActionText() { return this._primaryActionText; }
      set primaryActionText(v) {
        this._primaryActionText = v;
        this.render();
      }

      get primaryActionColor() { return this._primaryActionColor; }
      set primaryActionColor(v) {
        this._primaryActionColor = v;
        this.render();
      }

      get primaryActionTextColor() { return this._primaryActionTextColor; }
      set primaryActionTextColor(v) {
        this._primaryActionTextColor = v;
        this.render();
      }

      get showPrimaryAction() { return this._showPrimaryAction; }
      set showPrimaryAction(v) {
        this._showPrimaryAction = v === 'true' || v === true;
        this.render();
      }

      get dropdownActions() { return this._dropdownActions; }
      set dropdownActions(v) {
        this._dropdownActions = v;
        this.render();
      }

      get showDropdown() { return this._showDropdown; }
      set showDropdown(v) {
        this._showDropdown = v === 'true' || v === true;
        this.render();
      }

      get showMenuButton() { return this._showMenuButton; }
      set showMenuButton(v) {
        this._showMenuButton = v === 'true' || v === true;
        this.render();
      }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v;
        this.render();
      }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v;
        this.render();
      }

      get subtitleColor() { return this._subtitleColor; }
      set subtitleColor(v) {
        this._subtitleColor = v;
        this.render();
      }

      get borderColor() { return this._borderColor; }
      set borderColor(v) {
        this._borderColor = v;
        this.render();
      }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v;
        this.render();
      }

      get selectedAction() { return this._selectedAction || ''; }
      set selectedAction(v) {
        this._selectedAction = v;
      }

      render() {
        // Create container with CSS variables
        this.innerHTML = '';
        this.style.setProperty('--nch-bg', this._backgroundColor);
        this.style.setProperty('--nch-border-color', this._borderColor);
        this.style.setProperty('--nch-font-family', this._fontFamily);
        this.style.setProperty('--nch-title-color', this._titleColor);
        this.style.setProperty('--nch-subtitle-color', this._subtitleColor);

        const container = document.createElement('div');
        container.className = 'nch-container';

        // Add preview label
        const previewLabel = document.createElement('div');
        previewLabel.style.cssText = 'background: #F5F5F5; padding: 4px 8px; text-align: center; font-size: 11px; color: #999; border-bottom: 1px solid #E0E0E0;';
        previewLabel.textContent = 'DESIGN PREVIEW (Read-Only)';
        this.appendChild(previewLabel);

        // Left section
        const leftSection = document.createElement('div');
        leftSection.className = 'nch-left-section';

        // Back button
        if (this._showBackButton) {
          const backBtn = document.createElement('button');
          backBtn.className = 'nch-back-btn';
          backBtn.type = 'button';
          backBtn.disabled = true; // Readonly for designtime
          backBtn.innerHTML = '<span class="material-icons">arrow_back</span>';
          leftSection.appendChild(backBtn);
        }

        // Title area
        const titleArea = document.createElement('div');
        titleArea.className = 'nch-title-area';

        const titleRow = document.createElement('div');
        titleRow.className = 'nch-title-row';

        const title = document.createElement('h1');
        title.className = 'nch-title';
        title.textContent = this._title;
        titleRow.appendChild(title);

        // Status badge
        if (this._showStatus) {
          const statusBadge = document.createElement('span');
          statusBadge.className = 'nch-badge nch-status-badge';
          statusBadge.style.backgroundColor = this._statusColor;
          statusBadge.style.color = this._statusTextColor;

          if (this._statusIcon) {
            const statusIcon = document.createElement('span');
            statusIcon.className = 'material-icons nch-badge-icon';
            statusIcon.textContent = this._statusIcon;
            statusBadge.appendChild(statusIcon);
          }

          statusBadge.appendChild(document.createTextNode(this._statusText));
          titleRow.appendChild(statusBadge);
        }

        // Priority badge
        if (this._showPriority) {
          const priorityBadge = document.createElement('span');
          priorityBadge.className = 'nch-badge nch-priority-badge';
          priorityBadge.style.backgroundColor = this._priorityColor;
          priorityBadge.style.color = this._priorityTextColor;

          if (this._priorityIcon) {
            const priorityIcon = document.createElement('span');
            priorityIcon.className = 'material-icons nch-badge-icon';
            priorityIcon.textContent = this._priorityIcon;
            priorityBadge.appendChild(priorityIcon);
          }

          priorityBadge.appendChild(document.createTextNode(this._priorityText));
          titleRow.appendChild(priorityBadge);
        }

        titleArea.appendChild(titleRow);

        // Subtitle
        const subtitle = document.createElement('div');
        subtitle.className = 'nch-subtitle';
        subtitle.textContent = this._subtitle;
        titleArea.appendChild(subtitle);

        leftSection.appendChild(titleArea);
        container.appendChild(leftSection);

        // Right section
        const rightSection = document.createElement('div');
        rightSection.className = 'nch-right-section';

        // Icon buttons (Star, Share, Print)
        const iconButtons = document.createElement('div');
        iconButtons.className = 'nch-icon-buttons';

        if (this._showStarButton) {
          const starBtn = document.createElement('button');
          starBtn.className = 'nch-icon-btn';
          starBtn.type = 'button';
          starBtn.disabled = true;
          starBtn.innerHTML = '<span class="material-icons">star_border</span>';
          iconButtons.appendChild(starBtn);
        }

        if (this._showShareButton) {
          const shareBtn = document.createElement('button');
          shareBtn.className = 'nch-icon-btn';
          shareBtn.type = 'button';
          shareBtn.disabled = true;
          shareBtn.innerHTML = '<span class="material-icons">share</span>';
          iconButtons.appendChild(shareBtn);
        }

        if (this._showPrintButton) {
          const printBtn = document.createElement('button');
          printBtn.className = 'nch-icon-btn';
          printBtn.type = 'button';
          printBtn.disabled = true;
          printBtn.innerHTML = '<span class="material-icons">print</span>';
          iconButtons.appendChild(printBtn);
        }

        rightSection.appendChild(iconButtons);

        // Text buttons (Edit, Reassign)
        const textButtons = document.createElement('div');
        textButtons.className = 'nch-text-buttons';

        if (this._showEditButton) {
          const editBtn = document.createElement('button');
          editBtn.className = 'nch-text-btn';
          editBtn.type = 'button';
          editBtn.disabled = true;
          editBtn.innerHTML = `<span class="material-icons">edit</span>${this._editButtonText}`;
          textButtons.appendChild(editBtn);
        }

        if (this._showReassignButton) {
          const reassignBtn = document.createElement('button');
          reassignBtn.className = 'nch-text-btn';
          reassignBtn.type = 'button';
          reassignBtn.disabled = true;
          reassignBtn.innerHTML = `<span class="material-icons">person_add</span>${this._reassignButtonText}`;
          textButtons.appendChild(reassignBtn);
        }

        rightSection.appendChild(textButtons);

        // Primary action button OR Dropdown
        if (this._showDropdown) {
          const dropdownContainer = document.createElement('div');
          dropdownContainer.className = 'nch-dropdown-container';

          const dropdownButton = document.createElement('button');
          dropdownButton.className = 'nch-primary-btn nch-dropdown-btn';
          dropdownButton.type = 'button';
          dropdownButton.disabled = true;
          dropdownButton.style.backgroundColor = this._primaryActionColor;
          dropdownButton.style.color = this._primaryActionTextColor;

          const actions = this._dropdownActions.split(',').map(a => a.trim()).filter(a => a);
          const firstAction = actions[0] || 'Actions';

          dropdownButton.innerHTML = `${firstAction}<span class="material-icons">arrow_drop_down</span>`;

          dropdownContainer.appendChild(dropdownButton);
          rightSection.appendChild(dropdownContainer);

        } else if (this._showPrimaryAction) {
          const primaryBtn = document.createElement('button');
          primaryBtn.className = 'nch-primary-btn';
          primaryBtn.type = 'button';
          primaryBtn.disabled = true;
          primaryBtn.textContent = this._primaryActionText;
          primaryBtn.style.backgroundColor = this._primaryActionColor;
          primaryBtn.style.color = this._primaryActionTextColor;
          rightSection.appendChild(primaryBtn);
        }

        // Menu button
        if (this._showMenuButton) {
          const menuBtn = document.createElement('button');
          menuBtn.className = 'nch-icon-btn';
          menuBtn.type = 'button';
          menuBtn.disabled = true;
          menuBtn.innerHTML = '<span class="material-icons">more_vert</span>';
          rightSection.appendChild(menuBtn);
        }

        container.appendChild(rightSection);
        this.appendChild(container);
      }
    });
  }
})();

}
