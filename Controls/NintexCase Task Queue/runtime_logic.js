if (!window.__nintexcasetaskqueueRuntimeLoaded) {
  window.__nintexcasetaskqueueRuntimeLoaded = true;

/**
 * NintexCase Task Queue Control for K2 SmartForms
 * List view for task management with columns
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

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);
  }

  // Load Material Icons
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="fonts.googleapis.com/icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }

  if (!window.customElements.get('nintexcase-task-queue')) {
    window.customElements.define('nintexcase-task-queue', class NintexCaseTaskQueue extends HTMLElement {

      constructor() {
        super();
        this._hasRendered = false;

        // Sample data for preview/testing
        this._sampleItems = [
          { TaskName: 'Review customer documents', DueDate: '2025-12-15', AssignedBy: 'Alice Manager', AssignedTo: 'John Doe', Priority: 'High', Status: 'In Progress', Stage: 'Review', Case: 'Onboarding - Acme Corp' },
          { TaskName: 'Process payment refund', DueDate: '2025-12-13', AssignedBy: 'Bob Supervisor', AssignedTo: 'Jane Smith', Priority: 'Critical', Status: 'Pending', Stage: 'Approval', Case: 'Support - Payment Issue' },
          { TaskName: 'Verify contract terms', DueDate: '2025-12-18', AssignedBy: 'Carol Lead', AssignedTo: 'Mike Johnson', Priority: 'Medium', Status: 'In Progress', Stage: 'Review', Case: 'Contract - TechCo' },
          { TaskName: 'Reproduce login bug', DueDate: '2025-12-14', AssignedBy: 'David Manager', AssignedTo: 'Sarah Williams', Priority: 'High', Status: 'Assigned', Stage: 'Investigation', Case: 'Bug - Login Error' },
          { TaskName: 'Draft API specifications', DueDate: '2025-12-20', AssignedBy: 'Eve Director', AssignedTo: 'Tom Brown', Priority: 'Low', Status: 'Pending', Stage: 'Planning', Case: 'Feature - API Integration' }
        ];

        // Properties
        this._selectedValue = '';
        this._configJSON = '';
        this._enableSwipe = true;
        this._title = 'Task Queue';
        this._showTitle = true;
        this._showSearch = true;
        this._searchPlaceholder = 'Search tasks...';
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

        // K2 list binding
        this._listConfig = null;
        this._listItems = [];

        // Sorting and filtering
        this._sortColumn = '';
        this._sortDirection = 'asc';
        this._searchQuery = '';

        // Pagination
        this._showPagination = true;
        this._pageSize = 10;
        this._currentPage = 1;

        // Quick actions
        this._showQuickActions = true;

        // Configuration
        this._showConfig = true;
        this._configOpen = false;
        this._configIcon = 'settings';
        this._configIconColor = '#FFFFFF';
        this._configButtonColor = '#667eea';
        this._configButtonHoverColor = '#5568d3';
        this._configSettings = {
          sortByDate: false,
          sortBySLA: false,
          showTodayOnly: false,
          showThisWeekOnly: false,
          showOpenOnly: false,
          showInProgressOnly: false,
          showAssignedOnly: false
        };

        // Swipe tracking
        this._touchStartX = 0;
        this._touchStartY = 0;
        this._touchStartTime = 0;
        this._swipeThreshold = 50;

        // DOM refs
        this._container = null;
        this._searchInput = null;
        this._configPanel = null;
      }

      connectedCallback() {
        if (this._hasRendered) return;
        loadGoogleFonts();
        loadMaterialIcons();
        this._hasRendered = true;
        setTimeout(() => {
          this._render();
        }, 0);
      }

      // Parse SLA string to minutes for sorting (not used for tasks, but kept for compatibility)
      _parseSLA(sla) {
        if (!sla) return Infinity; // No SLA = lowest priority

        const str = String(sla).toLowerCase();
        const match = str.match(/(\d+(?:\.\d+)?)\s*(minute|min|hour|hr|day|week|month)/);

        if (!match) return Infinity;

        const value = parseFloat(match[1]);
        const unit = match[2];

        // Convert to minutes for consistent comparison
        if (unit.startsWith('min')) return value;
        if (unit.startsWith('hour') || unit.startsWith('hr')) return value * 60;
        if (unit.startsWith('day')) return value * 60 * 24;
        if (unit.startsWith('week')) return value * 60 * 24 * 7;
        if (unit.startsWith('month')) return value * 60 * 24 * 30;

        return Infinity;
      }

      // K2 List Binding Callbacks
      listConfigChangedCallback(config, listname) {
        this._listConfig = config;
      }

      listItemsChangedCallback(itemsChangedEventArgs) {
        const items = itemsChangedEventArgs?.NewItems;
        if (items && Array.isArray(items)) {
          this._listItems = items;
          if (this._hasRendered) {
            this._render();
          }
        }
      }

      _render() {
        this.innerHTML = '';
        this._buildQueue();
        this._applyStyles();
        this._bindEvents();
      }

      // Get filtered and sorted items
      _getFilteredSortedItems() {
        let items = this._listItems.length > 0 ? [...this._listItems] : [...this._sampleItems];

        // Apply search filter
        if (this._searchQuery && this._searchQuery.trim() !== '') {
          const query = this._searchQuery.toLowerCase();
          items = items.filter(item => {
            const taskName = (item.TaskName || item.taskName || '').toLowerCase();
            const dueDate = (item.DueDate || item.dueDate || '').toLowerCase();
            const assignedBy = (item.AssignedBy || item.assignedBy || '').toLowerCase();
            const assignedTo = (item.AssignedTo || item.assignedTo || '').toLowerCase();
            const status = (item.Status || item.status || '').toLowerCase();
            const stage = (item.Stage || item.stage || '').toLowerCase();
            const caseName = (item.Case || item.case || '').toLowerCase();
            return taskName.includes(query) || dueDate.includes(query) || assignedBy.includes(query) ||
                   assignedTo.includes(query) || status.includes(query) || stage.includes(query) || caseName.includes(query);
          });
        }

        // Apply config filters
        if (this._configSettings.showTodayOnly) {
          const today = new Date().toDateString();
          items = items.filter(item => {
            const itemDate = item.Date ? new Date(item.Date).toDateString() : null;
            return itemDate === today;
          });
        }

        if (this._configSettings.showThisWeekOnly) {
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 7);

          items = items.filter(item => {
            const itemDate = item.Date ? new Date(item.Date) : null;
            return itemDate && itemDate >= startOfWeek && itemDate < endOfWeek;
          });
        }

        if (this._configSettings.showOpenOnly) {
          items = items.filter(item => {
            const status = (item.Status || item.status || '').toLowerCase();
            return status === 'open';
          });
        }

        if (this._configSettings.showInProgressOnly) {
          items = items.filter(item => {
            const status = (item.Status || item.status || '').toLowerCase();
            return status === 'in progress' || status === 'in-progress';
          });
        }

        if (this._configSettings.showAssignedOnly) {
          items = items.filter(item => {
            const status = (item.Status || item.status || '').toLowerCase();
            return status === 'assigned';
          });
        }

        // Apply sorting
        if (this._sortColumn) {
          items.sort((a, b) => {
            let aVal = a[this._sortColumn] || a[this._sortColumn.toLowerCase()] || '';
            let bVal = b[this._sortColumn] || b[this._sortColumn.toLowerCase()] || '';

            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();

            if (aVal < bVal) return this._sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this._sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        } else if (this._configSettings.sortByDate) {
          // Config sort by date
          items.sort((a, b) => {
            const dateA = a.Date ? new Date(a.Date) : new Date(0);
            const dateB = b.Date ? new Date(b.Date) : new Date(0);
            return dateB - dateA; // Newest first
          });
        } else if (this._configSettings.sortBySLA) {
          // Config sort by SLA (shortest/most urgent first)
          items.sort((a, b) => {
            const slaA = this._parseSLA(a.SLA || a.sla || '');
            const slaB = this._parseSLA(b.SLA || b.sla || '');
            return slaA - slaB; // Shortest SLA first (most urgent)
          });
        }

        return items;
      }

      // Get paginated items
      _getPaginatedItems() {
        const allItems = this._getFilteredSortedItems();

        if (!this._showPagination) {
          return allItems;
        }

        const startIndex = (this._currentPage - 1) * this._pageSize;
        const endIndex = startIndex + this._pageSize;
        return allItems.slice(startIndex, endIndex);
      }

      // Get total pages
      _getTotalPages() {
        const allItems = this._getFilteredSortedItems();
        return Math.ceil(allItems.length / this._pageSize);
      }

      // Handle column header click for sorting
      _handleSort(columnId) {
        if (this._sortColumn === columnId) {
          // Toggle direction
          this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this._sortColumn = columnId;
          this._sortDirection = 'asc';
        }
        this._render();
      }

      // Handle search input
      _handleSearch(event) {
        this._searchQuery = event.target.value;
        this._currentPage = 1; // Reset to first page on search
        this._updateTableContent();
      }

      // Check if any filters are active
      _hasActiveFilters() {
        return (this._searchQuery && this._searchQuery.trim() !== '') ||
               this._configSettings.sortByDate ||
               this._configSettings.sortBySLA ||
               this._configSettings.showTodayOnly ||
               this._configSettings.showThisWeekOnly ||
               this._configSettings.showOpenOnly ||
               this._configSettings.showInProgressOnly ||
               this._configSettings.showAssignedOnly;
      }

      // Clear all filters
      _clearFilters() {
        this._searchQuery = '';
        this._configSettings.sortByDate = false;
        this._configSettings.sortBySLA = false;
        this._configSettings.showTodayOnly = false;
        this._configSettings.showThisWeekOnly = false;
        this._configSettings.showOpenOnly = false;
        this._configSettings.showInProgressOnly = false;
        this._configSettings.showAssignedOnly = false;
        this._currentPage = 1;

        // Update search input value
        if (this._searchInput) {
          this._searchInput.value = '';
        }

        this._render();
      }

      // Update table content without full re-render (preserves search input focus)
      _updateTableContent() {
        const tbody = this._container?.querySelector('.ncq-tbody');
        const paginationContainer = this._container?.querySelector('.ncq-pagination');
        const filterIndicator = this._container?.querySelector('.ncq-filter-indicator');

        if (!tbody) return;

        // Update tbody
        tbody.innerHTML = '';
        const items = this._getPaginatedItems();

        items.forEach((item, index) => {
          const taskName = item.TaskName || item.taskName || '';
          const dueDate = item.DueDate || item.dueDate || '';
          const assignedBy = item.AssignedBy || item.assignedBy || '';
          const assignedTo = item.AssignedTo || item.assignedTo || '';
          const priority = item.Priority || item.priority || '';
          const status = item.Status || item.status || '';
          const stage = item.Stage || item.stage || '';
          const caseName = item.Case || item.case || '';

          const row = document.createElement('tr');
          row.className = 'ncq-row';
          row.dataset.title = taskName;
          row.dataset.index = index;
          row.tabIndex = 0;
          row.setAttribute('role', 'button');

          // Task Name cell with task icon
          const taskNameCell = document.createElement('td');
          taskNameCell.className = 'ncq-cell ncq-cell-title';

          const taskIcon = document.createElement('div');
          taskIcon.className = 'ncq-type-icon';
          taskIcon.style.background = '#00ACC1';

          const iconEl = document.createElement('span');
          iconEl.className = 'material-icons';
          iconEl.style.color = '#FFFFFF';
          iconEl.textContent = 'assignment';
          taskIcon.appendChild(iconEl);

          const taskText = document.createElement('div');
          taskText.className = 'ncq-title-text';
          taskText.textContent = taskName;
          taskText.style.color = this._textColor;

          taskNameCell.appendChild(taskIcon);
          taskNameCell.appendChild(taskText);
          row.appendChild(taskNameCell);

          // Due Date cell
          const dueDateCell = document.createElement('td');
          dueDateCell.className = 'ncq-cell';
          dueDateCell.textContent = dueDate;
          row.appendChild(dueDateCell);

          // Assigned By cell
          const assignedByCell = document.createElement('td');
          assignedByCell.className = 'ncq-cell';
          assignedByCell.textContent = assignedBy;
          row.appendChild(assignedByCell);

          // Assigned To cell
          const assignedToCell = document.createElement('td');
          assignedToCell.className = 'ncq-cell';
          assignedToCell.textContent = assignedTo;
          row.appendChild(assignedToCell);

          // Priority cell with badge
          const priorityCell = document.createElement('td');
          priorityCell.className = 'ncq-cell';
          const priorityBadge = document.createElement('span');
          priorityBadge.className = 'ncq-badge ncq-badge-priority-' + priority.toLowerCase().replace(/\s+/g, '-');
          priorityBadge.textContent = priority;
          priorityCell.appendChild(priorityBadge);
          row.appendChild(priorityCell);

          // Status cell with badge
          const statusCell = document.createElement('td');
          statusCell.className = 'ncq-cell';
          const statusBadge = document.createElement('span');
          statusBadge.className = 'ncq-badge ncq-badge-' + status.toLowerCase().replace(/\s+/g, '-');
          statusBadge.textContent = status;
          statusCell.appendChild(statusBadge);
          row.appendChild(statusCell);

          // Stage cell
          const stageCell = document.createElement('td');
          stageCell.className = 'ncq-cell';
          stageCell.textContent = stage;
          row.appendChild(stageCell);

          // Case cell
          const caseCell = document.createElement('td');
          caseCell.className = 'ncq-cell';
          caseCell.textContent = caseName;
          row.appendChild(caseCell);

          // Task Actions cell
          if (this._showQuickActions) {
            const actionsCell = document.createElement('td');
            actionsCell.className = 'ncq-cell ncq-actions-cell';

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'ncq-actions';

            // Action button
            const actionBtn = document.createElement('button');
            actionBtn.className = 'ncq-action-btn ncq-action-task-action';
            actionBtn.type = 'button';
            actionBtn.title = 'Action Task';
            actionBtn.dataset.action = 'action';
            actionBtn.dataset.title = taskName;

            const actionIcon = document.createElement('span');
            actionIcon.className = 'material-icons';
            actionIcon.textContent = 'check_circle';
            actionBtn.appendChild(actionIcon);

            // Redirect button
            const redirectBtn = document.createElement('button');
            redirectBtn.className = 'ncq-action-btn ncq-action-redirect';
            redirectBtn.type = 'button';
            redirectBtn.title = 'Redirect Task';
            redirectBtn.dataset.action = 'redirect';
            redirectBtn.dataset.title = taskName;

            const redirectIcon = document.createElement('span');
            redirectIcon.className = 'material-icons';
            redirectIcon.textContent = 'forward';
            redirectBtn.appendChild(redirectIcon);

            // Sleep button
            const sleepBtn = document.createElement('button');
            sleepBtn.className = 'ncq-action-btn ncq-action-task-sleep';
            sleepBtn.type = 'button';
            sleepBtn.title = 'Sleep Task';
            sleepBtn.dataset.action = 'sleep';
            sleepBtn.dataset.title = taskName;

            const sleepIcon = document.createElement('span');
            sleepIcon.className = 'material-icons';
            sleepIcon.textContent = 'snooze';
            sleepBtn.appendChild(sleepIcon);

            // Share button
            const shareBtn = document.createElement('button');
            shareBtn.className = 'ncq-action-btn ncq-action-task-share';
            shareBtn.type = 'button';
            shareBtn.title = 'Share Task';
            shareBtn.dataset.action = 'share';
            shareBtn.dataset.title = taskName;

            const shareIcon = document.createElement('span');
            shareIcon.className = 'material-icons';
            shareIcon.textContent = 'share';
            shareBtn.appendChild(shareIcon);

            actionsContainer.appendChild(actionBtn);
            actionsContainer.appendChild(redirectBtn);
            actionsContainer.appendChild(sleepBtn);
            actionsContainer.appendChild(shareBtn);
            actionsCell.appendChild(actionsContainer);
            row.appendChild(actionsCell);
          }

          tbody.appendChild(row);
        });

        // Update pagination
        if (paginationContainer) {
          paginationContainer.remove();
        }
        if (this._showPagination) {
          this._buildPaginationControls();
        }

        // Update filter indicator
        if (filterIndicator) {
          if (this._hasActiveFilters()) {
            filterIndicator.style.display = 'flex';
          } else {
            filterIndicator.style.display = 'none';
          }
        }

        // Re-bind events for new rows
        this._bindEvents();
      }

      _buildQueue() {
        this._container = document.createElement('div');
        this._container.className = 'ncq-container';

        // Header area (title + search)
        const headerArea = document.createElement('div');
        headerArea.className = 'ncq-header-area';

        // Section title
        if (this._showTitle && this._title) {
          const titleEl = document.createElement('h2');
          titleEl.className = 'ncq-title';
          titleEl.textContent = this._title;
          headerArea.appendChild(titleEl);
        }

        // Filter indicator
        const filterIndicator = document.createElement('div');
        filterIndicator.className = 'ncq-filter-indicator';
        filterIndicator.style.display = this._hasActiveFilters() ? 'flex' : 'none';

        const filterIcon = document.createElement('span');
        filterIcon.className = 'material-icons';
        filterIcon.textContent = 'filter_alt';

        const filterText = document.createElement('span');
        filterText.textContent = 'Filters Active';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'ncq-filter-clear';
        clearBtn.type = 'button';
        clearBtn.title = 'Clear all filters';

        const clearIcon = document.createElement('span');
        clearIcon.className = 'material-icons';
        clearIcon.textContent = 'close';
        clearBtn.appendChild(clearIcon);

        filterIndicator.appendChild(filterIcon);
        filterIndicator.appendChild(filterText);
        filterIndicator.appendChild(clearBtn);
        headerArea.appendChild(filterIndicator);

        // Config button
        if (this._showConfig) {
          const configBtn = document.createElement('button');
          configBtn.className = 'ncq-config-btn';
          configBtn.type = 'button';
          configBtn.setAttribute('aria-label', 'Configuration');
          configBtn.style.background = this._configButtonColor;

          const configIcon = document.createElement('span');
          configIcon.className = 'material-icons';
          configIcon.textContent = this._configIcon;
          configIcon.style.color = this._configIconColor;

          configBtn.appendChild(configIcon);
          headerArea.appendChild(configBtn);
        }

        // Search bar
        if (this._showSearch) {
          const searchWrapper = document.createElement('div');
          searchWrapper.className = 'ncq-search-wrapper';

          const searchIcon = document.createElement('span');
          searchIcon.className = 'material-icons ncq-search-icon';
          searchIcon.textContent = 'search';

          this._searchInput = document.createElement('input');
          this._searchInput.type = 'text';
          this._searchInput.className = 'ncq-search-input';
          this._searchInput.placeholder = this._searchPlaceholder;
          this._searchInput.value = this._searchQuery;

          searchWrapper.appendChild(searchIcon);
          searchWrapper.appendChild(this._searchInput);
          headerArea.appendChild(searchWrapper);
        }

        if (headerArea.children.length > 0) {
          this._container.appendChild(headerArea);
        }

        // Config panel
        if (this._showConfig) {
          this._buildConfigPanel();
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
          { id: 'TaskName', label: 'Task Name', width: this._showQuickActions ? '18%' : '25%' },
          { id: 'DueDate', label: 'Due Date', width: '10%' },
          { id: 'AssignedBy', label: 'Assigned By', width: '12%' },
          { id: 'AssignedTo', label: 'Assigned To', width: '12%' },
          { id: 'Priority', label: 'Priority', width: '8%' },
          { id: 'Status', label: 'Status', width: '10%' },
          { id: 'Stage', label: 'Stage', width: '10%' },
          { id: 'Case', label: 'Case', width: '12%' }
        ];

        if (this._showQuickActions) {
          columns.push({ id: 'Actions', label: 'Actions', width: '15%', sortable: false });
        }

        columns.forEach(col => {
          const th = document.createElement('th');
          th.className = col.sortable === false ? 'ncq-header-cell' : 'ncq-header-cell ncq-sortable';
          th.style.width = col.width;
          th.dataset.column = col.id;

          // Add label text
          th.appendChild(document.createTextNode(col.label));

          // Add sort icon (only for sortable columns)
          if (col.sortable !== false) {
            const sortIcon = document.createElement('span');
            sortIcon.className = 'material-icons ncq-sort-icon';
            if (this._sortColumn === col.id) {
              sortIcon.textContent = this._sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
              sortIcon.classList.add('ncq-sort-active');
            } else {
              sortIcon.textContent = 'unfold_more';
            }

            th.appendChild(sortIcon);
          }

          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        tbody.className = 'ncq-tbody';

        // Use paginated items
        const items = this._getPaginatedItems();

        items.forEach((item, index) => {
          const taskName = item.TaskName || item.taskName || '';
          const dueDate = item.DueDate || item.dueDate || '';
          const assignedBy = item.AssignedBy || item.assignedBy || '';
          const assignedTo = item.AssignedTo || item.assignedTo || '';
          const priority = item.Priority || item.priority || '';
          const status = item.Status || item.status || '';
          const stage = item.Stage || item.stage || '';
          const caseName = item.Case || item.case || '';

          const row = document.createElement('tr');
          row.className = 'ncq-row';
          row.dataset.title = taskName;
          row.dataset.index = index;
          row.tabIndex = 0;
          row.setAttribute('role', 'button');

          // Task Name cell with task icon
          const taskNameCell = document.createElement('td');
          taskNameCell.className = 'ncq-cell ncq-cell-title';

          const taskIcon = document.createElement('div');
          taskIcon.className = 'ncq-type-icon';
          taskIcon.style.background = '#00ACC1';

          const iconEl = document.createElement('span');
          iconEl.className = 'material-icons';
          iconEl.style.color = '#FFFFFF';
          iconEl.textContent = 'assignment';
          taskIcon.appendChild(iconEl);

          const taskText = document.createElement('div');
          taskText.className = 'ncq-title-text';
          taskText.textContent = taskName;
          taskText.style.color = this._textColor;

          taskNameCell.appendChild(taskIcon);
          taskNameCell.appendChild(taskText);
          row.appendChild(taskNameCell);

          // Due Date cell
          const dueDateCell = document.createElement('td');
          dueDateCell.className = 'ncq-cell';
          dueDateCell.textContent = dueDate;
          row.appendChild(dueDateCell);

          // Assigned By cell
          const assignedByCell = document.createElement('td');
          assignedByCell.className = 'ncq-cell';
          assignedByCell.textContent = assignedBy;
          row.appendChild(assignedByCell);

          // Assigned To cell
          const assignedToCell = document.createElement('td');
          assignedToCell.className = 'ncq-cell';
          assignedToCell.textContent = assignedTo;
          row.appendChild(assignedToCell);

          // Priority cell with badge
          const priorityCell = document.createElement('td');
          priorityCell.className = 'ncq-cell';
          const priorityBadge = document.createElement('span');
          priorityBadge.className = 'ncq-badge ncq-badge-priority-' + priority.toLowerCase().replace(/\s+/g, '-');
          priorityBadge.textContent = priority;
          priorityCell.appendChild(priorityBadge);
          row.appendChild(priorityCell);

          // Status cell with badge
          const statusCell = document.createElement('td');
          statusCell.className = 'ncq-cell';
          const statusBadge = document.createElement('span');
          statusBadge.className = 'ncq-badge ncq-badge-' + status.toLowerCase().replace(/\s+/g, '-');
          statusBadge.textContent = status;
          statusCell.appendChild(statusBadge);
          row.appendChild(statusCell);

          // Stage cell
          const stageCell = document.createElement('td');
          stageCell.className = 'ncq-cell';
          stageCell.textContent = stage;
          row.appendChild(stageCell);

          // Case cell
          const caseCell = document.createElement('td');
          caseCell.className = 'ncq-cell';
          caseCell.textContent = caseName;
          row.appendChild(caseCell);

          // Task Actions cell
          if (this._showQuickActions) {
            const actionsCell = document.createElement('td');
            actionsCell.className = 'ncq-cell ncq-actions-cell';

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'ncq-actions';

            // Action button
            const actionBtn = document.createElement('button');
            actionBtn.className = 'ncq-action-btn ncq-action-task-action';
            actionBtn.type = 'button';
            actionBtn.title = 'Action Task';
            actionBtn.dataset.action = 'action';
            actionBtn.dataset.title = taskName;

            const actionIcon = document.createElement('span');
            actionIcon.className = 'material-icons';
            actionIcon.textContent = 'check_circle';
            actionBtn.appendChild(actionIcon);

            // Redirect button
            const redirectBtn = document.createElement('button');
            redirectBtn.className = 'ncq-action-btn ncq-action-redirect';
            redirectBtn.type = 'button';
            redirectBtn.title = 'Redirect Task';
            redirectBtn.dataset.action = 'redirect';
            redirectBtn.dataset.title = taskName;

            const redirectIcon = document.createElement('span');
            redirectIcon.className = 'material-icons';
            redirectIcon.textContent = 'forward';
            redirectBtn.appendChild(redirectIcon);

            // Sleep button
            const sleepBtn = document.createElement('button');
            sleepBtn.className = 'ncq-action-btn ncq-action-task-sleep';
            sleepBtn.type = 'button';
            sleepBtn.title = 'Sleep Task';
            sleepBtn.dataset.action = 'sleep';
            sleepBtn.dataset.title = taskName;

            const sleepIcon = document.createElement('span');
            sleepIcon.className = 'material-icons';
            sleepIcon.textContent = 'snooze';
            sleepBtn.appendChild(sleepIcon);

            // Share button
            const shareBtn = document.createElement('button');
            shareBtn.className = 'ncq-action-btn ncq-action-task-share';
            shareBtn.type = 'button';
            shareBtn.title = 'Share Task';
            shareBtn.dataset.action = 'share';
            shareBtn.dataset.title = taskName;

            const shareIcon = document.createElement('span');
            shareIcon.className = 'material-icons';
            shareIcon.textContent = 'share';
            shareBtn.appendChild(shareIcon);

            actionsContainer.appendChild(actionBtn);
            actionsContainer.appendChild(redirectBtn);
            actionsContainer.appendChild(sleepBtn);
            actionsContainer.appendChild(shareBtn);
            actionsCell.appendChild(actionsContainer);
            row.appendChild(actionsCell);
          }

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        this._container.appendChild(tableWrapper);

        // Pagination controls
        if (this._showPagination) {
          this._buildPaginationControls();
        }

        this.appendChild(this._container);
      }

      _buildConfigPanel() {
        this._configPanel = document.createElement('div');
        this._configPanel.className = 'ncq-config-panel';
        if (!this._configOpen) {
          this._configPanel.classList.add('ncq-config-hidden');
        }

        const configContent = document.createElement('div');
        configContent.className = 'ncq-config-content';

        // Header
        const configHeader = document.createElement('div');
        configHeader.className = 'ncq-config-header';

        const configTitle = document.createElement('h3');
        configTitle.textContent = 'Queue Settings';
        configHeader.appendChild(configTitle);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'ncq-config-close';
        closeBtn.type = 'button';

        const closeIcon = document.createElement('span');
        closeIcon.className = 'material-icons';
        closeIcon.textContent = 'close';
        closeBtn.appendChild(closeIcon);
        configHeader.appendChild(closeBtn);

        configContent.appendChild(configHeader);

        // Settings
        const configSettings = document.createElement('div');
        configSettings.className = 'ncq-config-settings';

        // Sort by date
        const sortByDateRow = document.createElement('div');
        sortByDateRow.className = 'ncq-config-row';

        const sortByDateLabel = document.createElement('label');
        sortByDateLabel.className = 'ncq-config-label';

        const sortByDateCheckbox = document.createElement('input');
        sortByDateCheckbox.type = 'checkbox';
        sortByDateCheckbox.id = 'ncq-sort-date';
        sortByDateCheckbox.checked = this._configSettings.sortByDate;

        sortByDateLabel.appendChild(sortByDateCheckbox);
        sortByDateLabel.appendChild(document.createTextNode(' Sort by Date (Newest first)'));
        sortByDateRow.appendChild(sortByDateLabel);
        configSettings.appendChild(sortByDateRow);

        // Sort by SLA
        const sortBySLARow = document.createElement('div');
        sortBySLARow.className = 'ncq-config-row';

        const sortBySLALabel = document.createElement('label');
        sortBySLALabel.className = 'ncq-config-label';

        const sortBySLACheckbox = document.createElement('input');
        sortBySLACheckbox.type = 'checkbox';
        sortBySLACheckbox.id = 'ncq-sort-sla';
        sortBySLACheckbox.checked = this._configSettings.sortBySLA;

        sortBySLALabel.appendChild(sortBySLACheckbox);
        sortBySLALabel.appendChild(document.createTextNode(' Sort by SLA (Most urgent first)'));
        sortBySLARow.appendChild(sortBySLALabel);
        configSettings.appendChild(sortBySLARow);

        // Divider
        const divider1 = document.createElement('div');
        divider1.className = 'ncq-config-divider';
        configSettings.appendChild(divider1);

        // Show today only
        const todayOnlyRow = document.createElement('div');
        todayOnlyRow.className = 'ncq-config-row';

        const todayOnlyLabel = document.createElement('label');
        todayOnlyLabel.className = 'ncq-config-label';

        const todayOnlyCheckbox = document.createElement('input');
        todayOnlyCheckbox.type = 'checkbox';
        todayOnlyCheckbox.id = 'ncq-show-today';
        todayOnlyCheckbox.checked = this._configSettings.showTodayOnly;

        todayOnlyLabel.appendChild(todayOnlyCheckbox);
        todayOnlyLabel.appendChild(document.createTextNode(' Show Today\'s Tasks Only'));
        todayOnlyRow.appendChild(todayOnlyLabel);
        configSettings.appendChild(todayOnlyRow);

        // Show this week only
        const thisWeekRow = document.createElement('div');
        thisWeekRow.className = 'ncq-config-row';

        const thisWeekLabel = document.createElement('label');
        thisWeekLabel.className = 'ncq-config-label';

        const thisWeekCheckbox = document.createElement('input');
        thisWeekCheckbox.type = 'checkbox';
        thisWeekCheckbox.id = 'ncq-show-week';
        thisWeekCheckbox.checked = this._configSettings.showThisWeekOnly;

        thisWeekLabel.appendChild(thisWeekCheckbox);
        thisWeekLabel.appendChild(document.createTextNode(' Show This Week\'s Tasks Only'));
        thisWeekRow.appendChild(thisWeekLabel);
        configSettings.appendChild(thisWeekRow);

        // Divider
        const divider2 = document.createElement('div');
        divider2.className = 'ncq-config-divider';
        configSettings.appendChild(divider2);

        // Show open only
        const openOnlyRow = document.createElement('div');
        openOnlyRow.className = 'ncq-config-row';

        const openOnlyLabel = document.createElement('label');
        openOnlyLabel.className = 'ncq-config-label';

        const openOnlyCheckbox = document.createElement('input');
        openOnlyCheckbox.type = 'checkbox';
        openOnlyCheckbox.id = 'ncq-show-open';
        openOnlyCheckbox.checked = this._configSettings.showOpenOnly;

        openOnlyLabel.appendChild(openOnlyCheckbox);
        openOnlyLabel.appendChild(document.createTextNode(' Show Open Tasks Only'));
        openOnlyRow.appendChild(openOnlyLabel);
        configSettings.appendChild(openOnlyRow);

        // Show in progress only
        const inProgressRow = document.createElement('div');
        inProgressRow.className = 'ncq-config-row';

        const inProgressLabel = document.createElement('label');
        inProgressLabel.className = 'ncq-config-label';

        const inProgressCheckbox = document.createElement('input');
        inProgressCheckbox.type = 'checkbox';
        inProgressCheckbox.id = 'ncq-show-inprogress';
        inProgressCheckbox.checked = this._configSettings.showInProgressOnly;

        inProgressLabel.appendChild(inProgressCheckbox);
        inProgressLabel.appendChild(document.createTextNode(' Show In Progress Tasks Only'));
        inProgressRow.appendChild(inProgressLabel);
        configSettings.appendChild(inProgressRow);

        // Show assigned only
        const assignedOnlyRow = document.createElement('div');
        assignedOnlyRow.className = 'ncq-config-row';

        const assignedOnlyLabel = document.createElement('label');
        assignedOnlyLabel.className = 'ncq-config-label';

        const assignedOnlyCheckbox = document.createElement('input');
        assignedOnlyCheckbox.type = 'checkbox';
        assignedOnlyCheckbox.id = 'ncq-show-assigned';
        assignedOnlyCheckbox.checked = this._configSettings.showAssignedOnly;

        assignedOnlyLabel.appendChild(assignedOnlyCheckbox);
        assignedOnlyLabel.appendChild(document.createTextNode(' Show Assigned Tasks Only'));
        assignedOnlyRow.appendChild(assignedOnlyLabel);
        configSettings.appendChild(assignedOnlyRow);

        configContent.appendChild(configSettings);

        // Apply button
        const applyBtn = document.createElement('button');
        applyBtn.className = 'ncq-config-apply';
        applyBtn.type = 'button';
        applyBtn.textContent = 'Apply Settings';
        configContent.appendChild(applyBtn);

        this._configPanel.appendChild(configContent);
        this._container.appendChild(this._configPanel);
      }

      _buildPaginationControls() {
        const totalPages = this._getTotalPages();
        const allItems = this._getFilteredSortedItems();
        const totalItems = allItems.length;

        if (totalItems === 0 || totalPages <= 1) {
          return; // No pagination needed
        }

        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'ncq-pagination';

        // Info text
        const startIndex = (this._currentPage - 1) * this._pageSize + 1;
        const endIndex = Math.min(this._currentPage * this._pageSize, totalItems);

        const infoText = document.createElement('div');
        infoText.className = 'ncq-pagination-info';
        infoText.textContent = `Showing ${startIndex}-${endIndex} of ${totalItems} items`;
        paginationContainer.appendChild(infoText);

        // Controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'ncq-pagination-controls';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'ncq-pagination-btn';
        prevBtn.type = 'button';
        prevBtn.disabled = this._currentPage === 1;
        prevBtn.dataset.page = 'prev';

        const prevIcon = document.createElement('span');
        prevIcon.className = 'material-icons';
        prevIcon.textContent = 'chevron_left';
        prevBtn.appendChild(prevIcon);

        controlsContainer.appendChild(prevBtn);

        // Page numbers (show current and surrounding pages)
        const maxPageButtons = 5;
        let startPage = Math.max(1, this._currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
          startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        if (startPage > 1) {
          const firstBtn = document.createElement('button');
          firstBtn.className = 'ncq-pagination-btn';
          firstBtn.type = 'button';
          firstBtn.textContent = '1';
          firstBtn.dataset.page = '1';
          controlsContainer.appendChild(firstBtn);

          if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ncq-pagination-ellipsis';
            ellipsis.textContent = '...';
            controlsContainer.appendChild(ellipsis);
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'ncq-pagination-btn';
          pageBtn.type = 'button';
          pageBtn.textContent = i.toString();
          pageBtn.dataset.page = i.toString();

          if (i === this._currentPage) {
            pageBtn.classList.add('ncq-pagination-active');
          }

          controlsContainer.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ncq-pagination-ellipsis';
            ellipsis.textContent = '...';
            controlsContainer.appendChild(ellipsis);
          }

          const lastBtn = document.createElement('button');
          lastBtn.className = 'ncq-pagination-btn';
          lastBtn.type = 'button';
          lastBtn.textContent = totalPages.toString();
          lastBtn.dataset.page = totalPages.toString();
          controlsContainer.appendChild(lastBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'ncq-pagination-btn';
        nextBtn.type = 'button';
        nextBtn.disabled = this._currentPage === totalPages;
        nextBtn.dataset.page = 'next';

        const nextIcon = document.createElement('span');
        nextIcon.className = 'material-icons';
        nextIcon.textContent = 'chevron_right';
        nextBtn.appendChild(nextIcon);

        controlsContainer.appendChild(nextBtn);
        paginationContainer.appendChild(controlsContainer);

        this._container.appendChild(paginationContainer);
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
          this._container.style.setProperty('--ncq-config-btn-hover', this._configButtonHoverColor);
        }

        // Apply disabled state
        if (this._container) {
          this._container.classList.toggle('ncq-disabled', !this._isEnabled);
        }
      }

      _bindEvents() {
        // Bind search input
        if (this._searchInput) {
          this._searchInput.addEventListener('input', (e) => this._handleSearch(e));
        }

        // Bind sortable headers
        const headers = this._container?.querySelectorAll('.ncq-sortable');
        if (headers) {
          headers.forEach(header => {
            header.addEventListener('click', () => {
              const column = header.dataset.column;
              this._handleSort(column);
            });
          });
        }

        // Bind config button
        const configBtn = this._container?.querySelector('.ncq-config-btn');
        if (configBtn) {
          configBtn.addEventListener('click', () => this._openConfig());
        }

        // Bind filter clear button
        const filterClearBtn = this._container?.querySelector('.ncq-filter-clear');
        if (filterClearBtn) {
          filterClearBtn.addEventListener('click', () => this._clearFilters());
        }

        // Bind config panel events
        if (this._configPanel) {
          const closeBtn = this._configPanel.querySelector('.ncq-config-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => this._closeConfig());
          }

          const applyBtn = this._configPanel.querySelector('.ncq-config-apply');
          if (applyBtn) {
            applyBtn.addEventListener('click', () => this._applyConfig());
          }
        }

        // Bind pagination buttons
        const paginationBtns = this._container?.querySelectorAll('.ncq-pagination-btn');
        if (paginationBtns) {
          paginationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              const page = btn.dataset.page;
              this._handlePageChange(page);
            });
          });
        }

        // Bind action buttons
        const actionBtns = this._container?.querySelectorAll('.ncq-action-btn');
        if (actionBtns) {
          actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent row click
              this._handleQuickAction(btn);
            });
          });
        }

        // Bind row events
        const rows = this._container?.querySelectorAll('.ncq-row');
        if (!rows) return;

        rows.forEach(row => {
          // Click and double-click
          row.addEventListener('click', (e) => this._handleRowClick(e));
          row.addEventListener('dblclick', (e) => this._handleRowDoubleClick(e));
          row.addEventListener('keydown', (e) => this._handleKeyDown(e));

          // Touch/swipe gestures with animation (only if enabled)
          if (this._enableSwipe) {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;
            const minSwipeDistance = 50;

            row.addEventListener('touchstart', (e) => {
              touchStartX = e.changedTouches[0].screenX;
              touchStartY = e.changedTouches[0].screenY;
              touchStartTime = Date.now();
              row.style.transition = 'none';
            }, { passive: true });

            row.addEventListener('touchmove', (e) => {
              const touchX = e.changedTouches[0].screenX;
              const touchY = e.changedTouches[0].screenY;
              const deltaX = touchX - touchStartX;
              const deltaY = touchY - touchStartY;

              // Only apply transform if horizontal swipe is dominant
              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const translateX = Math.max(-100, Math.min(100, deltaX * 0.5)); // Limit movement
                row.style.transform = `translateX(${translateX}px)`;
                row.style.opacity = 1 - Math.abs(translateX) / 200;
              }
            }, { passive: true });

            row.addEventListener('touchend', (e) => {
              const touchEndX = e.changedTouches[0].screenX;
              const touchEndY = e.changedTouches[0].screenY;
              const swipeDistance = touchEndX - touchStartX;
              const swipeTime = Date.now() - touchStartTime;
              const deltaY = touchEndY - touchStartY;

              // Reset with animation
              row.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
              row.style.transform = 'translateX(0)';
              row.style.opacity = '1';

              // Check if horizontal swipe is dominant and meets threshold
              if (Math.abs(swipeDistance) > Math.abs(deltaY) &&
                  Math.abs(swipeDistance) > minSwipeDistance &&
                  swipeTime < 500) {

                // Animate swipe out
                const direction = swipeDistance > 0 ? 'right' : 'left';
                row.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
                row.style.opacity = '0';

                // Fire event and remove item
                setTimeout(() => {
                  this._handleRowSwipe(e, direction, row);
                }, 300);
              }
            }, { passive: true });
          }

          // Mouse drag/swipe gestures (only if enabled)
          if (this._enableSwipe) {
            let mouseStartX = 0;
            let mouseStartY = 0;
            let mouseStartTime = 0;
            let isDragging = false;
            const minSwipeDistance = 50;

            row.addEventListener('mousedown', (e) => {
              // Ignore if clicking on action buttons
              if (e.target.closest('.ncq-action-btn')) return;

              mouseStartX = e.clientX;
              mouseStartY = e.clientY;
              mouseStartTime = Date.now();
              isDragging = true;
              row.style.transition = 'none';
              row.style.cursor = 'grabbing';
              e.preventDefault(); // Prevent text selection
            });

            row.addEventListener('mousemove', (e) => {
              if (!isDragging) return;

              const mouseX = e.clientX;
              const mouseY = e.clientY;
              const deltaX = mouseX - mouseStartX;
              const deltaY = mouseY - mouseStartY;

              // Only apply transform if horizontal drag is dominant
              if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                const translateX = Math.max(-100, Math.min(100, deltaX * 0.5)); // Limit movement
                row.style.transform = `translateX(${translateX}px)`;
                row.style.opacity = 1 - Math.abs(translateX) / 200;
              }
            });

            row.addEventListener('mouseup', (e) => {
              if (!isDragging) return;

              const mouseEndX = e.clientX;
              const mouseEndY = e.clientY;
              const swipeDistance = mouseEndX - mouseStartX;
              const swipeTime = Date.now() - mouseStartTime;
              const deltaY = mouseEndY - mouseStartY;

              isDragging = false;
              row.style.cursor = '';

              // Reset with animation
              row.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
              row.style.transform = 'translateX(0)';
              row.style.opacity = '1';

              // Check if horizontal swipe is dominant and meets threshold
              if (Math.abs(swipeDistance) > Math.abs(deltaY) &&
                  Math.abs(swipeDistance) > minSwipeDistance &&
                  swipeTime < 1000) {

                // Animate swipe out
                const direction = swipeDistance > 0 ? 'right' : 'left';
                row.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
                row.style.opacity = '0';

                // Fire event and remove item
                setTimeout(() => {
                  this._handleRowSwipe(e, direction, row);
                }, 300);
              }
            });

            row.addEventListener('mouseleave', (e) => {
              if (!isDragging) return;

              isDragging = false;
              row.style.cursor = '';

              // Reset with animation
              row.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
              row.style.transform = 'translateX(0)';
              row.style.opacity = '1';
            });
          }
        });
      }

      _handleRowClick(event) {
        if (!this._isEnabled) return;

        const row = event.currentTarget;
        const title = row.dataset.title;
        const index = parseInt(row.dataset.index);

        // Update selected value
        this._selectedValue = title;

        // Update active state
        const rows = this._container.querySelectorAll('.ncq-row');
        rows.forEach(r => r.classList.remove('ncq-active'));
        row.classList.add('ncq-active');

        // Raise property changed event for K2
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }

        // Get the item data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;
        const item = items[index];

        // Fire custom event
        this.dispatchEvent(new CustomEvent('RowClicked', {
          bubbles: true,
          detail: {
            title: title,
            index: index,
            item: item
          }
        }));
      }

      _handleRowDoubleClick(event) {
        if (!this._isEnabled) return;

        const row = event.currentTarget;
        const title = row.dataset.title;
        const index = parseInt(row.dataset.index);

        // Get the item data
        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;
        const item = items[index];

        // Fire double-click event
        this.dispatchEvent(new CustomEvent('RowDoubleClicked', {
          bubbles: true,
          detail: {
            title: title,
            index: index,
            item: item
          }
        }));
      }

      _handleRowSwipe(event, direction, row) {
        if (!this._isEnabled) return;

        const title = row.dataset.title;
        const index = parseInt(row.dataset.index);

        // Get the item data from paginated items
        const paginatedItems = this._getPaginatedItems();
        const item = paginatedItems[index];

        // Fire swipe event
        const eventName = direction === 'left' ? 'RowSwipedLeft' : 'RowSwipedRight';
        this.dispatchEvent(new CustomEvent(eventName, {
          bubbles: true,
          detail: {
            title: title,
            index: index,
            item: item,
            direction: direction
          }
        }));

        // Remove item from data (both real and sample)
        if (this._listItems.length > 0) {
          // Find and remove from actual list items
          const actualIndex = this._listItems.findIndex(i =>
            (i.Title || i.title) === title
          );
          if (actualIndex !== -1) {
            this._listItems.splice(actualIndex, 1);
          }
        } else {
          // Remove from sample items if using sample data
          const sampleIndex = this._sampleItems.findIndex(i =>
            (i.Title || i.title) === title
          );
          if (sampleIndex !== -1) {
            this._sampleItems.splice(sampleIndex, 1);
          }
        }

        // Re-render to update pagination and counts after a brief delay
        setTimeout(() => {
          this._render();
        }, 350);
      }

      _handleKeyDown(event) {
        if (!this._isEnabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this._handleRowClick(event);
        }
      }

      _handlePageChange(page) {
        if (!this._isEnabled) return;

        const totalPages = this._getTotalPages();

        if (page === 'prev') {
          if (this._currentPage > 1) {
            this._currentPage--;
          }
        } else if (page === 'next') {
          if (this._currentPage < totalPages) {
            this._currentPage++;
          }
        } else {
          const pageNum = parseInt(page);
          if (pageNum >= 1 && pageNum <= totalPages) {
            this._currentPage = pageNum;
          }
        }

        this._updateTableContent();
      }

      _handleQuickAction(btn) {
        if (!this._isEnabled) return;

        const action = btn.dataset.action;
        const title = btn.dataset.title;

        // Find the row and item
        const row = btn.closest('.ncq-row');
        const index = parseInt(row.dataset.index);

        const items = this._listItems.length > 0 ? this._listItems : this._sampleItems;
        const item = items[index];

        // Fire action event
        this.dispatchEvent(new CustomEvent('ActionClicked', {
          bubbles: true,
          detail: {
            action: action,
            title: title,
            index: index,
            item: item
          }
        }));
      }

      _openConfig() {
        this._configOpen = true;
        if (this._configPanel) {
          this._configPanel.classList.remove('ncq-config-hidden');
        }
      }

      _closeConfig() {
        this._configOpen = false;
        if (this._configPanel) {
          this._configPanel.classList.add('ncq-config-hidden');
        }
      }

      _applyConfig() {
        if (!this._configPanel) return;

        const sortByDateCheckbox = this._configPanel.querySelector('#ncq-sort-date');
        const sortBySLACheckbox = this._configPanel.querySelector('#ncq-sort-sla');
        const showTodayCheckbox = this._configPanel.querySelector('#ncq-show-today');
        const showWeekCheckbox = this._configPanel.querySelector('#ncq-show-week');
        const showOpenCheckbox = this._configPanel.querySelector('#ncq-show-open');
        const showInProgressCheckbox = this._configPanel.querySelector('#ncq-show-inprogress');
        const showAssignedCheckbox = this._configPanel.querySelector('#ncq-show-assigned');

        const oldSettings = { ...this._configSettings };

        this._configSettings.sortByDate = sortByDateCheckbox?.checked || false;
        this._configSettings.sortBySLA = sortBySLACheckbox?.checked || false;
        this._configSettings.showTodayOnly = showTodayCheckbox?.checked || false;
        this._configSettings.showThisWeekOnly = showWeekCheckbox?.checked || false;
        this._configSettings.showOpenOnly = showOpenCheckbox?.checked || false;
        this._configSettings.showInProgressOnly = showInProgressCheckbox?.checked || false;
        this._configSettings.showAssignedOnly = showAssignedCheckbox?.checked || false;

        // Reset to first page when config changes
        this._currentPage = 1;

        // Serialize config to JSON output
        this._configJSON = JSON.stringify(this._configSettings);
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'configJSON');
        }

        // Fire config changed event
        this.dispatchEvent(new CustomEvent('ConfigChanged', {
          bubbles: true,
          detail: {
            settings: this._configSettings,
            oldSettings: oldSettings
          }
        }));

        this._closeConfig();
        this._render();
      }

      // Public Methods
      clearSelection() {
        this._selectedValue = '';
        const rows = this._container?.querySelectorAll('.ncq-row');
        if (rows) {
          rows.forEach(row => row.classList.remove('ncq-active'));
        }
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'selectedValue');
        }
      }

      reloadData() {
        // Reset to first page
        this._currentPage = 1;

        // Re-render the control with current data
        if (this._hasRendered) {
          this._render();

          // Fire DataReloaded event
          this.dispatchEvent(new CustomEvent('DataReloaded', {
            bubbles: true,
            detail: {
              itemCount: this._listItems.length,
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      // Properties
      get selectedValue() { return this._selectedValue; }
      set selectedValue(v) {
        this._selectedValue = v || '';
        if (this._hasRendered) {
          const rows = this._container?.querySelectorAll('.ncq-row');
          if (rows) {
            rows.forEach(row => {
              if (row.dataset.title === this._selectedValue) {
                row.classList.add('ncq-active');
              } else {
                row.classList.remove('ncq-active');
              }
            });
          }
        }
      }
      get SelectedValue() { return this.selectedValue; }
      set SelectedValue(v) { this.selectedValue = v; }

      get Value() { return this._selectedValue; }
      set Value(v) { this.selectedValue = v; }

      get title() { return this._title; }
      set title(v) {
        this._title = v || 'Task Queue';
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

      get showSearch() { return this._showSearch; }
      set showSearch(v) {
        this._showSearch = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get ShowSearch() { return this.showSearch; }
      set ShowSearch(v) { this.showSearch = v; }

      get searchPlaceholder() { return this._searchPlaceholder; }
      set searchPlaceholder(v) {
        this._searchPlaceholder = v || 'Search tasks...';
        if (this._hasRendered) this._render();
      }
      get SearchPlaceholder() { return this.searchPlaceholder; }
      set SearchPlaceholder(v) { this.searchPlaceholder = v; }

      get backgroundColor() { return this._backgroundColor; }
      set backgroundColor(v) {
        this._backgroundColor = v || '#FFFFFF';
        if (this._hasRendered) this._applyStyles();
      }
      get BackgroundColor() { return this.backgroundColor; }
      set BackgroundColor(v) { this.backgroundColor = v; }

      get headerBackground() { return this._headerBackground; }
      set headerBackground(v) {
        this._headerBackground = v || '#667eea';
        if (this._hasRendered) this._applyStyles();
      }
      get HeaderBackground() { return this.headerBackground; }
      set HeaderBackground(v) { this.headerBackground = v; }

      get headerTextColor() { return this._headerTextColor; }
      set headerTextColor(v) {
        this._headerTextColor = v || '#FFFFFF';
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
        this._currentPage = 1; // Reset to first page
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
        if (this._hasRendered) this._applyStyles();
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
        if (this._hasRendered) this._applyStyles();
      }

      get configJSON() { return this._configJSON; }
      set configJSON(v) {
        this._configJSON = v || '';
        // Parse and apply config if valid JSON
        if (v && v.trim() !== '') {
          try {
            const parsed = JSON.parse(v);
            this._configSettings = { ...this._configSettings, ...parsed };
            if (this._hasRendered) {
              this._render();
            }
          } catch (e) {
            console.error('Invalid config JSON:', e);
          }
        }
      }
      get ConfigJSON() { return this.configJSON; }
      set ConfigJSON(v) { this.configJSON = v; }

      get enableSwipe() { return this._enableSwipe; }
      set enableSwipe(v) {
        this._enableSwipe = (v === true || v === 'true');
        if (this._hasRendered) this._render();
      }
      get EnableSwipe() { return this.enableSwipe; }
      set EnableSwipe(v) { this.enableSwipe = v; }
    });
  }
})();


}
