if (!window.__nintexcasequeueDesigntimeLoaded) {
  window.__nintexcasequeueDesigntimeLoaded = true;

/**
 * NintexCase Queue Control - Design Time Logic
 */
(function() {
  'use strict';

  if (!window.customElements.get('nintexcase-queue')) {
    window.customElements.define('nintexcase-queue', class extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for design time preview
        this._sampleItems = [
          { Title: 'Customer Onboarding - Acme Corp', Type: 'Onboarding', Assigned: 'John Doe', Priority: 'High', SLA: '2 days', Status: 'In Progress', Stage: 'Documentation' },
          { Title: 'Support Request - Payment Issue', Type: 'Support', Assigned: 'Jane Smith', Priority: 'Critical', SLA: '4 hours', Status: 'Open', Stage: 'Triage' },
          { Title: 'Contract Renewal - TechCo', Type: 'Contract', Assigned: 'Mike Johnson', Priority: 'Medium', SLA: '5 days', Status: 'In Progress', Stage: 'Review' }
        ];

        // Properties
        this._selectedValue = '';
        this._title = 'Case Queue';
        this._showTitle = true;
        this._showSearch = true;
        this._searchPlaceholder = 'Search cases...';
        this._backgroundColor = '#FFFFFF';
        this._headerBackground = '#667eea';
        this._headerTextColor = '#FFFFFF';
        this._rowBackground = '#FFFFFF';
        this._rowHoverBackground = '#F9F9F9';
        this._rowBorderColor = '#E0E0E0';
        this._textColor = '#1C1B1F';
        this._titleColor = '#1C1B1F';
        this._borderRadius = '8px';
        this._fontFamily = 'Poppins, sans-serif';
        this._fontSize = 14;
        this._isVisible = true;
        this._isEnabled = true;
        this._showPagination = true;
        this._pageSize = 10;
        this._showQuickActions = true;
        this._showConfig = true;
        this._configIcon = 'settings';
        this._configIconColor = '#FFFFFF';
        this._configButtonColor = '#667eea';
        this._configButtonHoverColor = '#5568d3';

        this._container = null;
      }

      // Get icon and color for case type
      _getTypeIcon(type) {
        const typeMap = {
          'onboarding': { icon: 'person_add', color: '#4285F4' },
          'support': { icon: 'support_agent', color: '#FF6F00' },
          'contract': { icon: 'description', color: '#9C27B0' },
          'bug': { icon: 'bug_report', color: '#F44336' },
          'enhancement': { icon: 'auto_awesome', color: '#66BB6A' },
          'feature': { icon: 'star', color: '#FFB300' },
          'task': { icon: 'assignment', color: '#00ACC1' },
          'incident': { icon: 'warning', color: '#EF6C00' },
          'change': { icon: 'sync', color: '#5E35B1' },
          'request': { icon: 'request_page', color: '#039BE5' }
        };

        const normalizedType = (type || '').toLowerCase().trim();
        return typeMap[normalizedType] || { icon: 'folder', color: '#757575' };
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
        this._buildQueue();
        this._applyStyles();
      }

      _buildQueue() {
        this._container = document.createElement('div');
        this._container.className = 'ncq-container';

        // Header area
        const headerArea = document.createElement('div');
        headerArea.className = 'ncq-header-area';

        // Section title
        if (this._showTitle && this._title) {
          const titleEl = document.createElement('h2');
          titleEl.className = 'ncq-title';
          titleEl.textContent = this._title;
          headerArea.appendChild(titleEl);
        }

        // Search bar preview
        if (this._showSearch) {
          const searchWrapper = document.createElement('div');
          searchWrapper.className = 'ncq-search-wrapper';

          const searchIcon = document.createElement('span');
          searchIcon.className = 'material-icons ncq-search-icon';
          searchIcon.textContent = 'search';

          const searchInput = document.createElement('input');
          searchInput.type = 'text';
          searchInput.className = 'ncq-search-input';
          searchInput.placeholder = this._searchPlaceholder;
          searchInput.disabled = true; // Disabled in design time

          searchWrapper.appendChild(searchIcon);
          searchWrapper.appendChild(searchInput);
          headerArea.appendChild(searchWrapper);
        }

        // Config button preview
        if (this._showConfig) {
          const configBtn = document.createElement('button');
          configBtn.className = 'ncq-config-btn';
          configBtn.type = 'button';
          configBtn.disabled = true;
          configBtn.style.background = this._configButtonColor;

          const configIcon = document.createElement('span');
          configIcon.className = 'material-icons';
          configIcon.textContent = this._configIcon;
          configIcon.style.color = this._configIconColor;

          configBtn.appendChild(configIcon);
          headerArea.appendChild(configBtn);
        }

        if (headerArea.children.length > 0) {
          this._container.appendChild(headerArea);
        }

        // Table wrapper
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'ncq-table-wrapper';

        // Table
        const table = document.createElement('table');
        table.className = 'ncq-table';

        // Header
        const thead = document.createElement('thead');
        thead.className = 'ncq-thead';
        const headerRow = document.createElement('tr');
        headerRow.className = 'ncq-header-row';

        const columns = [
          { id: 'title', label: 'Title', width: this._showQuickActions ? '20%' : '25%' },
          { id: 'type', label: 'Type', width: '10%' },
          { id: 'assigned', label: 'Assigned', width: '12%' },
          { id: 'priority', label: 'Priority', width: '8%' },
          { id: 'sla', label: 'SLA', width: '8%' },
          { id: 'status', label: 'Status', width: '10%' },
          { id: 'stage', label: 'Stage', width: '12%' }
        ];

        if (this._showQuickActions) {
          columns.push({ id: 'actions', label: 'Actions', width: '15%' });
        }

        columns.forEach(col => {
          const th = document.createElement('th');
          th.className = 'ncq-header-cell';
          th.style.width = col.width;
          th.textContent = col.label;
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        tbody.className = 'ncq-tbody';

        this._sampleItems.forEach((item, index) => {
          const row = document.createElement('tr');
          row.className = 'ncq-row';
          if (index === 0) row.classList.add('ncq-active');

          // Title cell with icon
          const titleCell = document.createElement('td');
          titleCell.className = 'ncq-cell ncq-cell-title';

          // Type icon
          const typeIconInfo = this._getTypeIcon(item.Type);
          const iconContainer = document.createElement('div');
          iconContainer.className = 'ncq-type-icon';
          iconContainer.style.background = typeIconInfo.color;

          const iconEl = document.createElement('span');
          iconEl.className = 'material-icons';
          iconEl.style.color = '#FFFFFF';
          iconEl.textContent = typeIconInfo.icon;
          iconContainer.appendChild(iconEl);

          // Title text
          const titleText = document.createElement('div');
          titleText.className = 'ncq-title-text';
          titleText.textContent = item.Title;
          titleText.style.color = this._textColor;

          titleCell.appendChild(iconContainer);
          titleCell.appendChild(titleText);
          row.appendChild(titleCell);

          // Type cell
          const typeCell = document.createElement('td');
          typeCell.className = 'ncq-cell';
          typeCell.textContent = item.Type;
          row.appendChild(typeCell);

          // Assigned cell
          const assignedCell = document.createElement('td');
          assignedCell.className = 'ncq-cell';
          assignedCell.textContent = item.Assigned;
          row.appendChild(assignedCell);

          // Priority cell with badge
          const priorityCell = document.createElement('td');
          priorityCell.className = 'ncq-cell';
          const priorityBadge = document.createElement('span');
          priorityBadge.className = 'ncq-badge ncq-badge-priority-' + item.Priority.toLowerCase().replace(/\s+/g, '-');
          priorityBadge.textContent = item.Priority;
          priorityCell.appendChild(priorityBadge);
          row.appendChild(priorityCell);

          // SLA cell
          const slaCell = document.createElement('td');
          slaCell.className = 'ncq-cell';
          slaCell.textContent = item.SLA;
          row.appendChild(slaCell);

          // Status cell with badge
          const statusCell = document.createElement('td');
          statusCell.className = 'ncq-cell';
          const statusBadge = document.createElement('span');
          statusBadge.className = 'ncq-badge ncq-badge-' + item.Status.toLowerCase().replace(/\s+/g, '-');
          statusBadge.textContent = item.Status;
          statusCell.appendChild(statusBadge);
          row.appendChild(statusCell);

          // Stage cell
          const stageCell = document.createElement('td');
          stageCell.className = 'ncq-cell';
          stageCell.textContent = item.Stage;
          row.appendChild(stageCell);

          // Actions cell
          if (this._showQuickActions) {
            const actionsCell = document.createElement('td');
            actionsCell.className = 'ncq-cell ncq-actions-cell';

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'ncq-actions';

            // Open button
            const openBtn = document.createElement('button');
            openBtn.className = 'ncq-action-btn ncq-action-open';
            openBtn.type = 'button';
            openBtn.disabled = true;

            const openIcon = document.createElement('span');
            openIcon.className = 'material-icons';
            openIcon.textContent = 'open_in_new';
            openBtn.appendChild(openIcon);

            // Redirect button
            const redirectBtn = document.createElement('button');
            redirectBtn.className = 'ncq-action-btn ncq-action-redirect';
            redirectBtn.type = 'button';
            redirectBtn.disabled = true;

            const redirectIcon = document.createElement('span');
            redirectIcon.className = 'material-icons';
            redirectIcon.textContent = 'forward';
            redirectBtn.appendChild(redirectIcon);

            // Push button (move down)
            const pushBtn = document.createElement('button');
            pushBtn.className = 'ncq-action-btn ncq-action-push';
            pushBtn.type = 'button';
            pushBtn.disabled = true;

            const pushIcon = document.createElement('span');
            pushIcon.className = 'material-icons';
            pushIcon.textContent = 'arrow_downward';
            pushBtn.appendChild(pushIcon);

            // Pull button (move up)
            const pullBtn = document.createElement('button');
            pullBtn.className = 'ncq-action-btn ncq-action-pull';
            pullBtn.type = 'button';
            pullBtn.disabled = true;

            const pullIcon = document.createElement('span');
            pullIcon.className = 'material-icons';
            pullIcon.textContent = 'arrow_upward';
            pullBtn.appendChild(pullIcon);

            actionsContainer.appendChild(openBtn);
            actionsContainer.appendChild(redirectBtn);
            actionsContainer.appendChild(pushBtn);
            actionsContainer.appendChild(pullBtn);
            actionsCell.appendChild(actionsContainer);
            row.appendChild(actionsCell);
          }

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        this._container.appendChild(tableWrapper);

        // Pagination preview
        if (this._showPagination) {
          const paginationContainer = document.createElement('div');
          paginationContainer.className = 'ncq-pagination';

          const infoText = document.createElement('div');
          infoText.className = 'ncq-pagination-info';
          infoText.textContent = `Showing 1-${this._sampleItems.length} of ${this._sampleItems.length} items`;
          paginationContainer.appendChild(infoText);

          const controlsContainer = document.createElement('div');
          controlsContainer.className = 'ncq-pagination-controls';

          // Previous button
          const prevBtn = document.createElement('button');
          prevBtn.className = 'ncq-pagination-btn';
          prevBtn.type = 'button';
          prevBtn.disabled = true;

          const prevIcon = document.createElement('span');
          prevIcon.className = 'material-icons';
          prevIcon.textContent = 'chevron_left';
          prevBtn.appendChild(prevIcon);

          controlsContainer.appendChild(prevBtn);

          // Page 1 button (active)
          const page1Btn = document.createElement('button');
          page1Btn.className = 'ncq-pagination-btn ncq-pagination-active';
          page1Btn.type = 'button';
          page1Btn.disabled = true;
          page1Btn.textContent = '1';
          controlsContainer.appendChild(page1Btn);

          // Next button
          const nextBtn = document.createElement('button');
          nextBtn.className = 'ncq-pagination-btn';
          nextBtn.type = 'button';
          nextBtn.disabled = true;

          const nextIcon = document.createElement('span');
          nextIcon.className = 'material-icons';
          nextIcon.textContent = 'chevron_right';
          nextBtn.appendChild(nextIcon);

          controlsContainer.appendChild(nextBtn);
          paginationContainer.appendChild(controlsContainer);

          this._container.appendChild(paginationContainer);
        }

        this.appendChild(this._container);
      }

      _applyStyles() {
        this.style.display = this._isVisible ? 'block' : 'none';

        if (this._container) {
          this._container.style.setProperty('--ncq-bg', this._backgroundColor);
          this._container.style.setProperty('--ncq-header-bg', this._headerBackground);
          this._container.style.setProperty('--ncq-header-text', this._headerTextColor);
          this._container.style.setProperty('--ncq-row-bg', this._rowBackground);
          this._container.style.setProperty('--ncq-row-hover', this._rowHoverBackground);
          this._container.style.setProperty('--ncq-row-border', this._rowBorderColor);
          this._container.style.setProperty('--ncq-text', this._textColor);
          this._container.style.setProperty('--ncq-title-color', this._titleColor);
          this._container.style.setProperty('--ncq-border-radius', this._borderRadius);
          this._container.style.setProperty('--ncq-font-family', this._fontFamily);
          this._container.style.setProperty('--ncq-font-size', `${this._fontSize}px`);
        }
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) this._render();
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

      get title() { return this._title; }
      set title(v) {
        this._title = v || 'Case Queue';
        if (this._hasRendered) this._render();
      }
      get Title() { return this.title; }
      set Title(v) { this.title = v; }

      get showTitle() { return this._showTitle; }
      set showTitle(v) {
        this._showTitle = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowTitle() { return this.showTitle; }
      set ShowTitle(v) { this.showTitle = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get headerBackground() { return this._headerBackground; }
      set headerBackground(v) {
        this._headerBackground = v || '#F5F5F5';
        if (this._hasRendered) this._applyStyles();
      }
      get HeaderBackground() { return this.headerBackground; }
      set HeaderBackground(v) { this.headerBackground = v; }

      get headerTextColor() { return this._headerTextColor; }
      set headerTextColor(v) {
        this._headerTextColor = v || '#666666';
        if (this._hasRendered) this._applyStyles();
      }
      get HeaderTextColor() { return this.headerTextColor; }
      set HeaderTextColor(v) { this.headerTextColor = v; }

      get rowBackground() { return this._rowBackground; }
      set rowBackground(v) {
        this._rowBackground = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get RowBackground() { return this.rowBackground; }
      set RowBackground(v) { this.rowBackground = v; }

      get rowHoverBackground() { return this._rowHoverBackground; }
      set rowHoverBackground(v) {
        this._rowHoverBackground = v || '#F9F9F9';
        if (this._hasRendered) this._applyStyles();
      }
      get RowHoverBackground() { return this.rowHoverBackground; }
      set RowHoverBackground(v) { this.rowHoverBackground = v; }

      get rowBorderColor() { return this._rowBorderColor; }
      set rowBorderColor(v) {
        this._rowBorderColor = v || '#E0E0E0';
        if (this._hasRendered) this._applyStyles();
      }
      get RowBorderColor() { return this.rowBorderColor; }
      set RowBorderColor(v) { this.rowBorderColor = v; }

      get textColor() { return this._textColor; }
      set textColor(v) {
        this._textColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TextColor() { return this.textColor; }
      set TextColor(v) { this.textColor = v; }

      get titleColor() { return this._titleColor; }
      set titleColor(v) {
        this._titleColor = v || '#1C1B1F';
        if (this._hasRendered) this._applyStyles();
      }
      get TitleColor() { return this.titleColor; }
      set TitleColor(v) { this.titleColor = v; }

      get borderRadius() { return this._borderRadius; }
      set borderRadius(v) {
        this._borderRadius = v || '8px';
        if (this._hasRendered) this._applyStyles();
      }
      get BorderRadius() { return this.borderRadius; }
      set BorderRadius(v) { this.borderRadius = v; }

      get fontFamily() { return this._fontFamily; }
      set fontFamily(v) {
        this._fontFamily = v || 'Poppins, sans-serif';
        if (this._hasRendered) this._applyStyles();
      }
      get FontFamily() { return this.fontFamily; }
      set FontFamily(v) { this.fontFamily = v; }

      get fontSize() { return this._fontSize; }
      set fontSize(v) {
        this._fontSize = parseInt(v) || 14;
        if (this._hasRendered) this._applyStyles();
      }
      get FontSize() { return this.fontSize; }
      set FontSize(v) { this.fontSize = v; }

      get showSearch() { return this._showSearch; }
      set showSearch(v) {
        this._showSearch = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowSearch() { return this.showSearch; }
      set ShowSearch(v) { this.showSearch = v; }

      get searchPlaceholder() { return this._searchPlaceholder; }
      set searchPlaceholder(v) {
        this._searchPlaceholder = v || 'Search cases...';
        if (this._hasRendered) this._render();
      }
      get SearchPlaceholder() { return this.searchPlaceholder; }
      set SearchPlaceholder(v) { this.searchPlaceholder = v; }

      get showPagination() { return this._showPagination; }
      set showPagination(v) {
        this._showPagination = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowPagination() { return this.showPagination; }
      set ShowPagination(v) { this.showPagination = v; }

      get pageSize() { return this._pageSize; }
      set pageSize(v) {
        this._pageSize = parseInt(v) || 10;
        if (this._hasRendered) this._render();
      }
      get PageSize() { return this.pageSize; }
      set PageSize(v) { this.pageSize = v; }

      get showQuickActions() { return this._showQuickActions; }
      set showQuickActions(v) {
        this._showQuickActions = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowQuickActions() { return this.showQuickActions; }
      set ShowQuickActions(v) { this.showQuickActions = v; }

      get showConfig() { return this._showConfig; }
      set showConfig(v) {
        this._showConfig = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowConfig() { return this.showConfig; }
      set ShowConfig(v) { this.showConfig = v; }

      get configIcon() { return this._configIcon; }
      set configIcon(v) {
        this._configIcon = v || 'settings';
        if (this._hasRendered) this._render();
      }
      get ConfigIcon() { return this.configIcon; }
      set ConfigIcon(v) { this.configIcon = v; }

      get configIconColor() { return this._configIconColor; }
      set configIconColor(v) {
        this._configIconColor = v || '#FFFFFF';
        if (this._hasRendered) this._render();
      }
      get ConfigIconColor() { return this.configIconColor; }
      set ConfigIconColor(v) { this.configIconColor = v; }

      get configButtonColor() { return this._configButtonColor; }
      set configButtonColor(v) {
        this._configButtonColor = v || '#667eea';
        if (this._hasRendered) this._render();
      }
      get ConfigButtonColor() { return this.configButtonColor; }
      set ConfigButtonColor(v) { this.configButtonColor = v; }

      get configButtonHoverColor() { return this._configButtonHoverColor; }
      set configButtonHoverColor(v) {
        this._configButtonHoverColor = v || '#5568d3';
        if (this._hasRendered) this._render();
      }
      get ConfigButtonHoverColor() { return this.configButtonHoverColor; }
      set ConfigButtonHoverColor(v) { this.configButtonHoverColor = v; }

      get IsVisible() { return this._isVisible; }
      set IsVisible(val) {
        this._isVisible = (val === true || val === 'true');
        this.style.display = this._isVisible ? 'block' : 'none';
      }

      get IsEnabled() { return this._isEnabled; }
      set IsEnabled(val) {
        this._isEnabled = (val === true || val === 'true');
      }
    });
  }
})();


}
