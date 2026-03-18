document.addEventListener('DOMContentLoaded', () => {
    
    // --- State & DOM Elements ---
    const appState = {
        role: 'admin', // admin, employee, manager, l2manager
        financialYear: 'FY 2025-26'
    };

    // Screens
    const landingPage = document.getElementById('landing-page');
    const appShell = document.getElementById('app-shell');
    
    // Navigation
    const enterAppTile = document.getElementById('enter-app-tile');
    const roleSelector = document.getElementById('current-role');
    const navItems = document.querySelectorAll('.nav-item[data-target], .nav-subitem[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const fyDropdown = document.getElementById('fy-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // --- Initialization ---

    // Enter App from Landing Page
    enterAppTile.addEventListener('click', () => {
        landingPage.classList.remove('active');
        appShell.style.display = 'flex';
        appShell.classList.add('active');
        updateRoleUI(appState.role);
    });

    // Exit prototype
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        appShell.classList.remove('active');
        appShell.style.display = 'none';
        landingPage.classList.add('active');
        // Reset to dashboard
        navigateTo('dashboard');
    });

    // --- Navigation Logic ---

    // Role Switching Simulation
    roleSelector.addEventListener('change', (e) => {
        const newRole = e.target.value;
        appState.role = newRole;
        updateRoleUI(newRole);
        
        // Auto navigate to default page based on role
        if(newRole === 'admin') navigateTo('dashboard', 'Dashboard');
        else if (newRole === 'employee') navigateTo('emp-my-kpis', 'My KPIs');
        else if (newRole === 'manager') navigateTo('mgr-kpi-review', 'KPI Review');
        else if (newRole === 'l2manager') navigateTo('l2mgr-kpi-review', 'KPI Review');
    });

    // Financial Year switching
    fyDropdown.addEventListener('change', (e) => {
        appState.financialYear = e.target.value;
        document.querySelectorAll('.active-fy').forEach(el => el.textContent = appState.financialYear);
    });

    // Sidebar Dropdowns
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.parentElement;
            parent.classList.toggle('open');
        });
    });

    // Link Clicking
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            let titleText = item.textContent.trim();
            
            // Clean up title if it has icons
            if(item.querySelector('i')){
                 titleText = item.textContent.trim();
            }
            
            navigateTo(targetId, titleText);
        });
    });

    function navigateTo(sectionId, title = "") {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Remove active class from nav items
        navItems.forEach(item => item.classList.remove('active'));

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Force reflow for animation
            void targetSection.offsetWidth;
            targetSection.classList.add('active');
        }

        // Set active nav item
        const activeNav = document.querySelector(`[data-target="${sectionId}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
            
            // If it's a subitem, ensure parent dropdown is open and active
            if(activeNav.classList.contains('nav-subitem')) {
                const parentNav = activeNav.closest('.nav-dropdown');
                if(parentNav) parentNav.classList.add('open');
            }
        }

        // Update Title
        if(title) {
            pageTitle.textContent = title;
        } else {
            // Default titles
            if(sectionId === 'dashboard') pageTitle.textContent = 'Dashboard';
        }
    }

    function updateRoleUI(role) {
        // Hide all nav groups
        document.querySelectorAll('.nav-group').forEach(group => {
            group.style.display = 'none';
        });

        // Show relevant nav group
        const targetGroup = document.querySelector(`.role-${role}`);
        if(targetGroup) {
            targetGroup.style.display = 'block';
        }

        // Update User Profile display
        const usernameDisplay = document.getElementById('header-username');
        const avatarDisplay = document.getElementById('header-avatar');
        
        let roleNameStr = "User";
        if(role === 'admin') roleNameStr = "Admin / HR";
        if(role === 'employee') roleNameStr = "Employee (Priya Menon)";
        if(role === 'manager') roleNameStr = "Reporting Manager";
        if(role === 'l2manager') roleNameStr = "L2 Manager";

        usernameDisplay.textContent = roleNameStr;
        avatarDisplay.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(roleNameStr)}&background=0D8ABC&color=fff`;
    }

    // --- Data & Masters Logic ---
    
    // Mock Data
    const mockData = {
        kra: [
            { id: 1, name: 'Sale/Transfer of FG Stock', desc: 'Manage sale and transfer', status: true },
            { id: 2, name: 'FG Supply Schedule', desc: 'Ensure adherence to supply schedule', status: true },
            { id: 3, name: 'Freight Outward Cost', desc: 'Reduce freight costs', status: true },
            { id: 4, name: 'Transport Fleet Maintenance Cost', desc: 'Manage maintenance costs', status: true },
            { id: 5, name: 'Overtime Control', desc: 'Control worker overtime', status: true }
        ],
        kpi: [
            { id: 1, name: '0% incidents of the wrong delivery of FG. No of error SKU against total SKU vouched for the period', kra: 'Sale/Transfer of FG Stock', uom: 'Percentage', status: true },
            { id: 2, name: '100% adherence to supply schedule. Zero deviation unless requested by Sales Team / Management', kra: 'FG Supply Schedule', uom: 'Percentage', status: true },
            { id: 3, name: 'Reduce 2% from the approved Budget. Freight Outward - 75 Lakhs (1.5 Lac)', kra: 'Freight Outward Cost', uom: 'Amount', status: true },
            { id: 4, name: 'Reduce 2% from the approved Budget.Vehicle maintenance - 10.80 Lakhs ( 0.22 lac )', kra: 'Transport Fleet Maintenance Cost', uom: 'Amount', status: true },
            { id: 5, name: 'To control workers OT (Permanent/Casual) under 5% of the Total monthly working hours', kra: 'Overtime Control', uom: 'Percentage', status: true }
        ],
        uom: [
            { id: 1, name: 'Percentage', desc: 'Value in %', status: true },
            { id: 2, name: 'Number', desc: 'Absolute Numeric Value', status: true },
            { id: 3, name: 'Count', desc: 'Count of items/incidents', status: true },
            { id: 4, name: 'Amount', desc: 'Financial Amount', status: true }
        ],
        potentialFactors: [
            { 
                id: 1, name: 'Job / Technical Knowledge', 
                descE: 'Help others acquire job knowledge through knowledge sessions or one to one coaching.',
                descM: 'Proactively taken up all the challenges and opportunities to learn that has come the way.',
                descP: 'Has acquired at least one additional job or technical expertise after being pushed to do so.',
                descF: 'No drive to learn. Stagnant at the same level of expertise in spite of push to take on more.',
                status: true
            },
            { 
                id: 2, name: 'Drive for Results', 
                descE: 'Plans and completes high quality work consistently in an efficient manner in spite of hurdles.',
                descM: 'Always completes assignments timely and thoroughly.',
                descP: 'Occasionally completes assignments. Lacks follow-through or unwilling to complete some tasks.',
                descF: 'Does not complete tasks frequently leaving other team members in adverse situations.',
                status: true
            }
        ],
        starRatings: [
            { condition: '>=90', rating: 5 },
            { condition: '80-89', rating: 4 },
            { condition: '70-79', rating: 3 },
            { condition: '60-69', rating: 2 },
            { condition: '<60', rating: 1 }
        ],
        grades: [
            { grade: 'E', score: 4 },
            { grade: 'M', score: 3 },
            { grade: 'P', score: 2 },
            { grade: 'F', score: 1 }
        ]
    };

    // Render Functions
    function renderTable(tableBodyId, data, renderRowFn) {
        const tbody = document.getElementById(tableBodyId);
        if(!tbody) return;
        tbody.innerHTML = '';
        if(data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4">No records found.</td></tr>`;
            return;
        }
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = renderRowFn(item, index);
            tbody.appendChild(tr);
        });
    }

    // Toggle switch HTML generator
    const createToggle = (isChecked) => `
        <label class="switch">
            <input type="checkbox" ${isChecked ? 'checked' : ''}>
            <span class="slider"></span>
        </label>
    `;

    // Render Masters
    function renderAllMasters() {
        // KRA
        renderTable('tbody-master-kra', mockData.kra, (item, i) => `
            <td>${i + 1}</td>
            <td class="font-medium">${item.name}</td>
            <td class="text-muted">${item.desc}</td>
            <td>${createToggle(item.status)}</td>
            <td>
                <button class="action-icon"><i class="fa-solid fa-pen"></i></button>
            </td>
        `);

        // KPI
        renderTable('tbody-master-kpi', mockData.kpi, (item, i) => `
            <td>${i + 1}</td>
            <td class="font-medium" style="max-width: 300px;">${item.name}</td>
            <td><span class="badge badge-secondary">${item.kra}</span></td>
            <td>${item.uom}</td>
            <td>${createToggle(item.status)}</td>
            <td>
                <button class="action-icon"><i class="fa-solid fa-pen"></i></button>
            </td>
        `);

        // UOM
        renderTable('tbody-master-uom', mockData.uom, (item, i) => `
            <td>${i + 1}</td>
            <td class="font-medium">${item.name}</td>
            <td class="text-muted">${item.desc}</td>
            <td>${createToggle(item.status)}</td>
            <td>
                <button class="action-icon"><i class="fa-solid fa-pen"></i></button>
            </td>
        `);

        // Potential Factors
        renderTable('tbody-master-potential', mockData.potentialFactors, (item, i) => `
            <td>${i + 1}</td>
            <td class="font-medium">${item.name}</td>
            <td class="text-xs text-muted" style="line-height: 1.6;">
                <p><strong>E:</strong> ${item.descE}</p>
                <p><strong>M:</strong> ${item.descM}</p>
                <p><strong>P:</strong> ${item.descP}</p>
                <p><strong>F:</strong> ${item.descF}</p>
            </td>
            <td>${createToggle(item.status)}</td>
            <td>
                <button class="action-icon"><i class="fa-solid fa-pen"></i></button>
            </td>
        `);

        // Star Ratings
        renderTable('tbody-master-rating', mockData.starRatings, (item) => `
            <td class="font-medium">${item.condition}</td>
            <td>
                <div style="color: #F59E0B; font-size: 1.1rem;">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(item.rating)}
                </div>
            </td>
        `);

        // Grades
        renderTable('tbody-master-grade', mockData.grades, (item) => `
            <td class="font-medium text-lg">${item.grade}</td>
            <td>${item.score}</td>
        `);
    }

    // Modal Logic
    const modalOverlay = document.getElementById('modal-overlay');
    
    window.openModal = function(modalId) {
        modalOverlay.classList.add('active');
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.style.display = 'flex'; // required before class addition due to my CSS setup
            setTimeout(() => modal.classList.add('active'), 10);
        }

        // populate selects dynamically for KPI modal
        if(modalId === 'kpi-modal') {
            const kraSelect = document.getElementById('kpi-kra-input');
            const uomSelect = document.getElementById('kpi-uom-input');
            kraSelect.innerHTML = mockData.kra.map(k => `<option value="${k.name}">${k.name}</option>`).join('');
            uomSelect.innerHTML = mockData.uom.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
        }
    };

    window.closeAllModals = function() {
        modalOverlay.classList.remove('active');
        document.querySelectorAll('.custom-modal').forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300); // Wait for transition
        });
    };

    // Attach close modal listeners
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.closeAllModals();
        });
    });

    // Dummy SAVE functions for Modals
    window.saveKRA = () => { alert('KRA Saved Successfully!'); closeAllModals(); };
    window.saveKPI = () => { alert('KPI Saved Successfully!'); closeAllModals(); };
    window.saveUOM = () => { alert('UOM Saved Successfully!'); closeAllModals(); };
    window.savePotentialFactor = () => { alert('Potential Factor Saved Successfully!'); closeAllModals(); };

    // --- Allocations Logic ---
    
    // Mock Employees
    const mockEmployees = {
        'BDM': ['Anoop', 'Akash', 'Anandan'],
        'Admin': ['Adarsh', 'Anitha'],
        'Lab': ['Devika', 'Mahima'],
        'All': ['Anoop', 'Akash', 'Anandan', 'Adarsh', 'Anitha', 'Devika', 'Mahima', 'Priya Menon']
    };

    // KPI Allocation
    const kpiAllocTypeRadios = document.querySelectorAll('input[name="kpi-alloc-type"]');
    const kpiRoleContainer = document.getElementById('kpi-role-selector-container');
    const kpiRoleSelect = document.getElementById('kpi-alloc-role');
    const kpiEmpSelect = document.getElementById('kpi-alloc-emp');
    const btnLoadKpiAlloc = document.getElementById('btn-load-kpi-alloc');
    const kpiAllocWorkspace = document.getElementById('kpi-alloc-workspace');
    const kpiAllocInfo = document.getElementById('kpi-alloc-info');
    const tbodyAllocKpi = document.getElementById('tbody-alloc-kpi');
    const kpiSearchInput = document.getElementById('kpi-search-input');
    const tbodyKpiSelect = document.getElementById('tbody-kpi-select');
    const kpiSelectAll = document.getElementById('kpi-select-all');
    let currentAllocatedKPIs = [];

    // Toggle Role/Individual
    kpiAllocTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'role') {
                kpiRoleContainer.style.display = 'block';
                populateKpiEmployees([]); // clear
            } else {
                kpiRoleContainer.style.display = 'none';
                populateKpiEmployees(mockEmployees['All']);
            }
            kpiAllocWorkspace.style.display = 'none';
        });
    });

    // Populate Employees based on Role
    kpiRoleSelect.addEventListener('change', (e) => {
        const role = e.target.value;
        if(role && mockEmployees[role]) {
            populateKpiEmployees(mockEmployees[role]);
        } else {
            populateKpiEmployees([]);
        }
        kpiAllocWorkspace.style.display = 'none';
    });

    function populateKpiEmployees(emps) {
        kpiEmpSelect.innerHTML = '<option value="">-- Select Employee --</option>';
        emps.forEach(emp => {
            kpiEmpSelect.innerHTML += `<option value="${emp}">${emp}</option>`;
        });
    }

    // Initialize with all emps
    populateKpiEmployees(mockEmployees['All']);

    // Load Workspace
    btnLoadKpiAlloc.addEventListener('click', () => {
        const emp = kpiEmpSelect.value;
        if(!emp) {
            alert('Please select an employee first.');
            return;
        }
        
        // Setup Workspace
        kpiAllocWorkspace.style.display = 'block';
        let designation = 'Employee';
        if(document.querySelector('input[name="kpi-alloc-type"]:checked').value === 'role') {
            designation = kpiRoleSelect.options[kpiRoleSelect.selectedIndex].text;
        }

        kpiAllocInfo.innerHTML = `<i class="fa-solid fa-user"></i> ${emp} | ${designation} | ${appState.financialYear} | Total Weightage must = 100`;
        
        // Clear previous allocs
        currentAllocatedKPIs = [];
        renderAllocKpiTable();
        
        // Populate Modal List
        populateKpiSelectModal(mockData.kpi);
    });

    // KPI Select Modal Search
    kpiSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = mockData.kpi.filter(k => k.name.toLowerCase().includes(term) || k.kra.toLowerCase().includes(term));
        populateKpiSelectModal(filtered);
    });

    // Select All Checkbox
    kpiSelectAll.addEventListener('change', (e) => {
        const checkboxes = tbodyKpiSelect.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });

    function populateKpiSelectModal(data) {
        tbodyKpiSelect.innerHTML = '';
        if(data.length === 0) {
            tbodyKpiSelect.innerHTML = `<tr><td colspan="3" class="text-center">No KPIs found</td></tr>`;
            return;
        }
        data.forEach(item => {
            // Check if already added
            const isAdded = currentAllocatedKPIs.some(k => k.id === item.id);
            if(isAdded) return; // Hide already added KPIs

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" value="${item.id}" class="kpi-cb" style="cursor: pointer;"></td>
                <td class="font-medium text-sm" style="line-height: 1.4;">${item.name}</td>
                <td class="text-sm text-muted">${item.kra}</td>
            `;
            tbodyKpiSelect.appendChild(tr);
        });
        kpiSelectAll.checked = false;
    }

    // Submit selection from Modal
    window.submitAddedKPIs = () => {
        const selectedIds = Array.from(tbodyKpiSelect.querySelectorAll('.kpi-cb:checked')).map(cb => parseInt(cb.value));
        
        const newKpis = mockData.kpi.filter(k => selectedIds.includes(k.id)).map(k => ({
            ...k,
            target: '', // User needs to fill
            weightage: 0
        }));

        currentAllocatedKPIs = [...currentAllocatedKPIs, ...newKpis];
        renderAllocKpiTable();
        closeAllModals();
        // Repopulate to remove added ones from list
        populateKpiSelectModal(mockData.kpi); 
    };

    function renderAllocKpiTable() {
        tbodyAllocKpi.innerHTML = '';
        if(currentAllocatedKPIs.length === 0) {
            tbodyAllocKpi.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No KPIs allocated. Click 'Add KPI Row' to begin.</td></tr>`;
            updateTotalWeight();
            return;
        }

        currentAllocatedKPIs.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="font-medium text-sm" style="line-height: 1.5;">${item.name}</td>
                <td class="text-sm">${item.kra}</td>
                <td class="text-sm"><span class="badge badge-secondary">${item.uom}</span></td>
                <td>
                    <input type="text" class="modern-input" placeholder="Target" value="${item.target}" onchange="updateAllocKpi(${index}, 'target', this.value)">
                </td>
                <td>
                    <input type="number" class="modern-input weightage-input" placeholder="0" min="0" max="100" value="${item.weightage}" onchange="updateAllocKpi(${index}, 'weightage', this.value)">
                </td>
                <td>
                    <button class="action-icon" style="color:var(--danger);" onclick="removeAllocKpi(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbodyAllocKpi.appendChild(tr);
        });
        updateTotalWeight();
    }

    window.updateAllocKpi = (index, field, value) => {
        if(field === 'weightage') value = parseFloat(value) || 0;
        currentAllocatedKPIs[index][field] = value;
        if(field === 'weightage') updateTotalWeight();
    };

    window.removeAllocKpi = (index) => {
        currentAllocatedKPIs.splice(index, 1);
        renderAllocKpiTable();
        populateKpiSelectModal(mockData.kpi); // put it back in the pool
    };

    function updateTotalWeight() {
        const total = currentAllocatedKPIs.reduce((sum, item) => sum + (parseFloat(item.weightage) || 0), 0);
        const display = document.getElementById('kpi-alloc-total-weight');
        display.textContent = total;
        if(total !== 100 && currentAllocatedKPIs.length > 0) {
            display.style.color = 'var(--danger)';
        } else {
            display.style.color = 'var(--success)';
        }
    }

    document.getElementById('btn-save-kpi-alloc').addEventListener('click', () => {
        const total = currentAllocatedKPIs.reduce((sum, item) => sum + (parseFloat(item.weightage) || 0), 0);
        if(currentAllocatedKPIs.length === 0) {
            alert('Please add at least one KPI.');
            return;
        }
        if(total !== 100) {
            alert('Total Weightage must be equal to 100. Current total is ' + total);
            return;
        }
        
        // Success
        alert('KPI Allocation completed successfully.');
        // Reset
        currentAllocatedKPIs = [];
        kpiAllocWorkspace.style.display = 'none';
        kpiEmpSelect.value = '';
    });

    // --- Potential Factor Allocation ---
    const pfAllocTypeRadios = document.querySelectorAll('input[name="pf-alloc-type"]');
    const pfRoleContainer = document.getElementById('pf-role-selector-container');
    const pfRoleSelect = document.getElementById('pf-alloc-role');
    const pfEmpSelect = document.getElementById('pf-alloc-emp');
    const pfCheckboxesContainer = document.getElementById('pf-alloc-checkboxes');

    pfAllocTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'role') {
                pfRoleContainer.style.display = 'block';
                populatePfEmployees([]); 
            } else {
                pfRoleContainer.style.display = 'none';
                populatePfEmployees(mockEmployees['All']);
            }
        });
    });

    pfRoleSelect.addEventListener('change', (e) => {
        const role = e.target.value;
        if(role && mockEmployees[role]) {
            populatePfEmployees(mockEmployees[role]);
        } else {
            populatePfEmployees([]);
        }
    });

    function populatePfEmployees(emps) {
        pfEmpSelect.innerHTML = '<option value="">-- Select Employee --</option>';
        emps.forEach(emp => {
            pfEmpSelect.innerHTML += `<option value="${emp}">${emp}</option>`;
        });
    }
    
    // Initialize PF Emps
    populatePfEmployees(mockEmployees['All']);

    // Render PF Checkboxes
    function renderPfCheckboxes() {
        pfCheckboxesContainer.innerHTML = '';
        mockData.potentialFactors.forEach(pf => {
            const div = document.createElement('div');
            div.style.marginBottom = '0.5rem';
            div.innerHTML = `
                <label style="display:flex; align-items:flex-start; gap:0.5rem; cursor:pointer;">
                    <input type="checkbox" value="${pf.id}" style="margin-top: 5px;">
                    <div>
                        <div class="font-medium text-sm">${pf.name}</div>
                    </div>
                </label>
            `;
            pfCheckboxesContainer.appendChild(div);
        });
    }
    renderPfCheckboxes();

    document.getElementById('btn-save-pf-alloc').addEventListener('click', () => {
        const emp = pfEmpSelect.value;
        if(!emp) {
            alert('Please select an employee.');
            return;
        }
        const selected = Array.from(pfCheckboxesContainer.querySelectorAll('input:checked'));
        if(selected.length === 0) {
            alert('Please select at least one Potential Factor.');
            return;
        }
        alert('Potential Factor Allocation saved successfully for ' + emp);
        
        // Reset
        pfEmpSelect.value = '';
        pfCheckboxesContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
    });

    // Initial Render
    renderAllMasters();

    // --- Employee Views Logic ---
    
    // Hardcoded allocated KPIs for Priya Menon (Employee)
    const empKpis = [
        { id: 101, name: '0% incidents of the wrong delivery of FG...', kra: 'Sale/Transfer of FG Stock', uom: 'Percentage', target: '0%', weightage: 30 },
        { id: 102, name: '100% adherence to supply schedule...', kra: 'FG Supply Schedule', uom: 'Percentage', target: '100%', weightage: 40 },
        { id: 103, name: 'To control workers OT...', kra: 'Overtime Control', uom: 'Percentage', target: '<5%', weightage: 30 }
    ];

    // Behavioural Assessment Mock Data
    const empBehavioural = [
        { id: 1, factor: 'Job / Technical Knowledge', rating: 'Proactively taken up all the challenges...', grade: 'M', score: 3 },
        { id: 2, factor: 'Drive for Results', rating: 'Plans and completes high quality work consistently...', grade: 'E', score: 4 }
    ];

    function renderEmployeeMyKPIs() {
        const tbody = document.getElementById('tbody-emp-my-kpis');
        if(!tbody) return;
        tbody.innerHTML = '';
        empKpis.forEach((kpi, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="text-sm">${kpi.kra}</td>
                    <td class="font-medium text-sm" style="line-height:1.4;">${kpi.name}</td>
                    <td class="text-sm"><span class="badge badge-secondary">${kpi.uom}</span></td>
                    <td class="font-medium">${kpi.target}</td>
                    <td class="font-medium text-primary">${kpi.weightage}%</td>
                </tr>
            `;
        });
    }

    function renderEmployeeSelfAssessment() {
        const tbody = document.getElementById('tbody-emp-self-assess');
        if(!tbody) return;
        tbody.innerHTML = '';
        empKpis.forEach((kpi, i) => {
            // Give random values to populate for demo
            let v1 = Math.floor(Math.random() * 20) + 80;
            let v2 = Math.floor(Math.random() * 20) + 80;
            let v3 = Math.floor(Math.random() * 20) + 80;
            
            // Manual score entry for the quarter
            let manualScore = kpi.weightage * 0.9;
            let achv = ((manualScore / kpi.weightage) * 100).toFixed(1);
            
            let starRating = 4;
            if(achv >= 90) starRating = 5;
            
            // For first row, show the audit log changes on focus just to simulate interactivity
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="text-sm" title="${kpi.kra}">${kpi.kra.substring(0, 15)}...</td>
                    <td class="font-medium text-sm" style="line-height:1.4;" title="${kpi.name}">${kpi.name.substring(0, 30)}...</td>
                    <td class="text-sm"><span class="badge badge-secondary">${kpi.uom.substring(0, 3)}</span></td>
                    <td class="font-medium text-sm">${kpi.target}</td>
                    <td class="font-medium text-primary text-sm">${kpi.weightage}%</td>
                    
                    <!-- Q1 Months -->
                    <td style="background:rgba(238, 242, 255, 0.5);"><input type="number" class="modern-input" style="padding:0.25rem 0.5rem;" value="${v1}"></td>
                    <td style="background:rgba(238, 242, 255, 0.5);"><input type="number" class="modern-input" style="padding:0.25rem 0.5rem;" value="${v2}"></td>
                    <td style="background:rgba(238, 242, 255, 0.5);"><input type="number" class="modern-input" style="padding:0.25rem 0.5rem;" value="${v3}"></td>
                    
                    <!-- Quarter End Metrics -->
                    <td style="background:rgba(254, 243, 199, 0.3);"><input type="number" class="modern-input" style="padding:0.25rem 0.5rem; border-color:#F59E0B;" value="${manualScore.toFixed(1)}"></td>
                    <td style="background:rgba(254, 243, 199, 0.3);" class="font-medium text-center">${achv}%</td>
                    <td style="background:rgba(254, 243, 199, 0.3);" class="text-center">
                        <div style="color: #F59E0B; font-size: 0.8rem;">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(starRating)}
                        </div>
                    </td>
                </tr>
            `;
        });
        
        // Populate audit log demo
        document.getElementById('emp-audit-log').innerHTML = `
            <div style="padding: 0.5rem; background: var(--bg-main); border-radius: var(--radius-sm); border-left: 3px solid var(--info); margin-bottom: 0.5rem;">
                <strong>${appState.financialYear} Q1 - Reporting Manager (Akash):</strong> Changed Score from 27 to 28 for KPI: "100% adherence to supply schedule..."
                <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 0.2rem;">2 days ago</div>
            </div>
            <div style="padding: 0.5rem; background: var(--bg-main); border-radius: var(--radius-sm); border-left: 3px solid var(--primary); margin-bottom: 0.5rem;">
                <strong>${appState.financialYear} Q1 - You:</strong> Submitted Assessment.
                <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 0.2rem;">5 days ago</div>
            </div>
        `;
    }

    function renderEmployeeBehavioural() {
        const tbody = document.getElementById('tbody-emp-behav-h1');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        // Calculate Total Score format
        // Formula: ((No of E × Score) + ...) / Total Score × 100
        // Total possible per factor is 4 (E). For 2 factors, total max = 8.
        // Current score: 3 (M) + 4 (E) = 7.
        // Final Score = (7 / 8) * 100 = 87.5%
        
        empBehavioural.forEach((item, i) => {
            let badgeColor = 'badge-secondary';
            if(item.grade === 'E') badgeColor = 'badge-success';
            if(item.grade === 'M') badgeColor = 'badge-primary';
            
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="font-medium">${item.factor}</td>
                    <td class="text-sm text-muted" style="line-height:1.4;">${item.rating}</td>
                    <td><span class="badge ${badgeColor}">${item.grade}</span></td>
                    <td class="font-medium">${item.score} / 4</td>
                </tr>
            `;
        });

        tbody.innerHTML += `
            <tr style="background: var(--bg-main);">
                <td colspan="4" class="text-right font-medium">Final Score:</td>
                <td class="font-medium text-lg text-primary">87.5%</td>
            </tr>
        `;
    }

    // Call on load (will be hidden anyway till nav clicked)
    renderEmployeeMyKPIs();
    renderEmployeeSelfAssessment();
    renderEmployeeBehavioural();

    // --- Manager Views Logic ---
    window.renderManagerKpiReview = function() {
        const emp = document.getElementById('mgr-emp-select').value;
        if(!emp) {
            alert('Please select an employee submission.');
            return;
        }

        document.getElementById('mgr-kpi-workspace').style.display = 'block';
        const tbody = document.getElementById('tbody-mgr-kpi-review');
        tbody.innerHTML = '';
        
        empKpis.forEach((kpi, i) => {
            // Give random values to populate for demo
            let v1 = Math.floor(Math.random() * 20) + 80;
            let v2 = Math.floor(Math.random() * 20) + 80;
            let v3 = Math.floor(Math.random() * 20) + 80;
            
            let manualScore = kpi.weightage * 0.9;
            let achv = ((manualScore / kpi.weightage) * 100).toFixed(1);
            let starRating = achv >= 90 ? 5 : 4;
            
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="text-sm" title="${kpi.kra}">${kpi.kra.substring(0, 15)}...</td>
                    <td class="font-medium text-sm" style="line-height:1.4;" title="${kpi.name}">${kpi.name.substring(0, 30)}...</td>
                    <td class="text-sm"><span class="badge badge-secondary">${kpi.uom.substring(0, 3)}</span></td>
                    <td class="font-medium text-sm">${kpi.target}</td>
                    <td class="font-medium text-primary text-sm">${kpi.weightage}%</td>
                    
                    <!-- Q1 Months (Read Only) -->
                    <td style="background:var(--bg-main);" class="text-muted text-center">${v1}</td>
                    <td style="background:var(--bg-main);" class="text-muted text-center">${v2}</td>
                    <td style="background:var(--bg-main);" class="text-muted text-center">${v3}</td>
                    
                    <!-- Quarter End Metrics (Read Only) -->
                    <td style="background:rgba(254, 243, 199, 0.3);" class="text-center font-medium">${manualScore.toFixed(1)}</td>
                    <td style="background:rgba(254, 243, 199, 0.3);" class="font-medium text-center">${achv}%</td>
                    <td style="background:rgba(254, 243, 199, 0.3);" class="text-center">
                        <div style="color: #475569; font-size: 0.8rem;">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(starRating)}
                        </div>
                    </td>

                    <!-- Manager Action (Editable) -->
                    <td style="background:rgba(224, 231, 255, 0.4);">
                        <input type="number" class="modern-input" style="padding:0.25rem; border-color:var(--primary);" value="${starRating}" min="1" max="5">
                    </td>
                    <td style="background:rgba(224, 231, 255, 0.4);">
                        <textarea class="modern-textarea" style="min-height:40px; padding:0.25rem;" placeholder="Add comments..."></textarea>
                    </td>
                </tr>
            `;
        });
    };

    window.renderManagerBehavReview = function() {
        const emp = document.getElementById('mgr-behav-emp-select').value;
        if(!emp) {
            alert('Please select an employee.');
            return;
        }

        document.getElementById('mgr-behav-workspace').style.display = 'block';
        const tbody = document.getElementById('tbody-mgr-behav-review');
        tbody.innerHTML = '';
        
        empBehavioural.forEach((item, i) => {
            
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="font-medium">${item.factor}</td>
                    <td class="text-sm text-muted" style="line-height:1.4;">${item.rating}</td>
                    <td>
                        <select class="modern-select w-100 behav-grade-select" data-index="${i}">
                            <option value="E" ${item.grade === 'E' ? 'selected' : ''}>E</option>
                            <option value="M" ${item.grade === 'M' ? 'selected' : ''}>M</option>
                            <option value="P" ${item.grade === 'P' ? 'selected' : ''}>P</option>
                            <option value="F" ${item.grade === 'F' ? 'selected' : ''}>F</option>
                        </select>
                    </td>
                    <td class="font-medium text-primary behavescore-td" id="behav-score-${i}">${item.score} / 4</td>
                </tr>
            `;
        });
        
        updateBehavTotalScore();

        // Add listeners to new selects
        document.querySelectorAll('.behav-grade-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const map = { 'E':4, 'M':3, 'P':2, 'F':1 };
                const idx = e.target.getAttribute('data-index');
                const score = map[e.target.value];
                document.getElementById(`behav-score-${idx}`).textContent = `${score} / 4`;
                updateBehavTotalScore();
            });
        });
    };

    function updateBehavTotalScore() {
        const map = { 'E':4, 'M':3, 'P':2, 'F':1 };
        const selects = document.querySelectorAll('.behav-grade-select');
        let totalScore = 0;
        selects.forEach(s => totalScore += map[s.value]);
        
        let possible = selects.length * 4;
        let p = (totalScore / possible) * 100;
        document.getElementById('mgr-behav-total-score').textContent = `${p.toFixed(1)}%`;
    }

    // --- L2 Manager Views Logic ---
    window.renderL2ManagerKpiReview = function() {
        const emp = document.getElementById('l2mgr-emp-select').value;
        if(!emp) {
            alert('Please select a manager submission.');
            return;
        }

        document.getElementById('l2mgr-kpi-workspace').style.display = 'block';
        const tbody = document.getElementById('tbody-l2mgr-kpi-review');
        tbody.innerHTML = '';
        
        empKpis.forEach((kpi, i) => {
            let manualScore = kpi.weightage * 0.9;
            let achv = ((manualScore / kpi.weightage) * 100).toFixed(1);
            let starRating = achv >= 90 ? 5 : 4;
            // let's pretend mgr modified one
            let mgrStar = i === 1 ? starRating - 1 : starRating;

            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td class="text-sm" title="${kpi.kra}">${kpi.kra.substring(0, 15)}...</td>
                    <td class="font-medium text-sm" style="line-height:1.4;" title="${kpi.name}">${kpi.name.substring(0, 30)}...</td>
                    
                    <td class="font-medium text-center text-muted">${achv}%</td>
                    <td class="text-center text-muted">
                        <div style="font-size: 0.8rem;">${'<i class="fa-solid fa-star"></i>'.repeat(starRating)}</div>
                    </td>

                    <td style="background:rgba(254, 243, 199, 0.3);" class="text-center">
                        <div style="color: #F59E0B; font-size: 0.8rem;">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(mgrStar)}
                        </div>
                    </td>
                    <td style="background:rgba(254, 243, 199, 0.3);" class="text-sm">${i === 1 ? 'Needs improvement in accuracy.' : 'Agreed.'}</td>

                    <!-- L2 Manager Action (Editable) -->
                    <td style="background:rgba(209, 250, 229, 0.4);">
                        <input type="number" class="modern-input" style="padding:0.25rem; border-color:var(--success);" value="${mgrStar}" min="1" max="5">
                    </td>
                    <td style="background:rgba(209, 250, 229, 0.4);">
                        <textarea class="modern-textarea" style="min-height:40px; padding:0.25rem;" placeholder="L2 comments..."></textarea>
                    </td>
                </tr>
            `;
        });
    };

});
