// Mock API functions
const api = {
    login: async (username, password) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(username === 'admin' && password === 'admin');
            }, 1000);
        });
    },

    getInventoryData: async () => {
        return {
            labels: ['Electronics', 'Furniture', 'Supplies', 'Equipment'],
            data: [30, 20, 25, 15]
        };
    },

    getExpiryData: async () => {
        return {
            labels: ['This Week', 'Next Week', 'Next Month', '3+ Months'],
            data: [5, 8, 15, 42]
        };
    },

    getUpcomingExpiries: async () => {
        return [
            { id: '001', name: 'Laptop Battery', expiryDate: '2024-04-15' },
            { id: '002', name: 'Office Supplies', expiryDate: '2024-04-20' },
            { id: '003', name: 'Software License', expiryDate: '2024-04-25' }
        ];
    },

    getItemsForReview: async () => {
        return [
            { id: '004', name: 'Printer Cartridge', reviewDate: '2024-04-10' },
            { id: '005', name: 'First Aid Kit', reviewDate: '2024-04-12' },
            { id: '006', name: 'Fire Extinguisher', reviewDate: '2024-04-18' }
        ];
    },

    addInventory: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Adding inventory:', data);
                resolve({ success: true, message: 'Inventory added successfully' });
            }, 1000);
        });
    },

    getInventoryList: async () => {
        return [
            { 
                id: '001', 
                name: 'Laptop Battery', 
                owner: 'IT Department',
                description: 'Replacement battery for Dell laptops',
                keyDate: '2024-06-15',
                comments: 'Regular maintenance required'
            },
            { 
                id: '002', 
                name: 'Office Supplies', 
                owner: 'Admin',
                description: 'General office supplies including paper and pens',
                keyDate: '2024-05-20',
                comments: 'Monthly restocking needed'
            },
            { 
                id: '003', 
                name: 'Software License', 
                owner: 'IT Department',
                description: 'Annual software subscription',
                keyDate: '2024-12-31',
                comments: 'Renewal pending'
            }
        ];
    },

    searchInventory: async (query) => {
        const allItems = await api.getInventoryList();
        return allItems.filter(item => 
            item.id.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.owner.toLowerCase().includes(query.toLowerCase())
        );
    },

    updateInventory: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Updating inventory:', id, data);
                resolve({ success: true, message: 'Inventory updated successfully' });
            }, 1000);
        });
    },

    deleteInventory: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Deleting inventory:', id);
                resolve({ success: true, message: 'Inventory deleted successfully' });
            }, 1000);
        });
    },

    generateReport: async (type) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const reports = {
                    expiry: 'Expiry Report Data...',
                    inventory: 'Inventory Status Report Data...',
                    owner: 'Owner-wise Report Data...'
                };
                resolve({ data: reports[type] });
            }, 1000);
        });
    }
};

// Authentication functions
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const success = await api.login(username, password);
    if (success) {
        document.getElementById('username-display').textContent = `Welcome, ${username}`;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('main-app').classList.add('active');
        initializeDashboard();
    } else {
        alert('Invalid credentials! Try admin/admin');
    }
}

function logout() {
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-app').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Navigation functions
function showPage(pageId) {
    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show selected page
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Initialize page content
    switch (pageId) {
        case 'dashboard':
            initializeDashboard();
            break;
        case 'update-inventory':
        case 'delete-inventory':
            loadInventoryList(pageId);
            break;
    }
}

// Search functions
async function searchInventory() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    const results = await api.searchInventory(query);
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(item => `
        <div class="inventory-item">
            <div>
                <strong>${item.name}</strong>
                <div>ID: ${item.id}</div>
                <div>Owner: ${item.owner}</div>
                <div>Description: ${item.description}</div>
            </div>
        </div>
    `).join('');
}

// Dashboard functions
async function initializeDashboard() {
    const inventoryData = await api.getInventoryData();
    const expiryData = await api.getExpiryData();
    
    // Create inventory distribution chart
    new Chart(document.getElementById('inventoryChart'), {
        type: 'pie',
        data: {
            labels: inventoryData.labels,
            datasets: [{
                data: inventoryData.data,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Inventory Distribution'
                }
            }
        }
    });

    // Create expiry timeline chart
    new Chart(document.getElementById('expiryChart'), {
        type: 'bar',
        data: {
            labels: expiryData.labels,
            datasets: [{
                label: 'Items',
                data: expiryData.data,
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Expiry Timeline'
                }
            }
        }
    });

    // Load upcoming expiries
    const expiries = await api.getUpcomingExpiries();
    document.getElementById('upcomingExpiries').innerHTML = expiries
        .map(item => `
            <div class="inventory-item">
                <span>${item.name}</span>
                <span>Expires: ${item.expiryDate}</span>
            </div>
        `).join('');

    // Load items for review
    const reviews = await api.getItemsForReview();
    document.getElementById('itemsForReview').innerHTML = reviews
        .map(item => `
            <div class="inventory-item">
                <span>${item.name}</span>
                <span>Review: ${item.reviewDate}</span>
            </div>
        `).join('');
}

// Inventory management functions
async function handleAddInventory(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const result = await api.addInventory(data);
    if (result.success) {
        alert(result.message);
        event.target.reset();
    }
}

async function loadInventoryList(pageId) {
    const items = await api.getInventoryList();
    const container = document.getElementById(`${pageId}List`);
    
    container.innerHTML = items.map(item => `
        <div class="inventory-item">
            <div>
                <strong>${item.name}</strong>
                <div>ID: ${item.id}</div>
                <div>Owner: ${item.owner}</div>
                <div>Description: ${item.description}</div>
            </div>
            <button onclick="${pageId === 'update-inventory' ? `showUpdateForm('${item.id}')` : `deleteItem('${item.id}')`}"
                    class="${pageId === 'update-inventory' ? 'update-btn' : 'delete-btn'}">
                ${pageId === 'update-inventory' ? 'Update' : 'Delete'}
            </button>
        </div>
    `).join('');
}

async function showUpdateForm(id) {
    const items = await api.getInventoryList();
    const item = items.find(i => i.id === id);
    
    if (item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editName').value = item.name;
        document.getElementById('editDescription').value = item.description;
        document.getElementById('editOwner').value = item.owner;
        document.getElementById('editKeyDate').value = item.keyDate;
        document.getElementById('editComments').value = item.comments;
        
        document.getElementById('updateForm').style.display = 'block';
    }
}

function cancelUpdate() {
    document.getElementById('updateForm').style.display = 'none';
    document.getElementById('editInventoryForm').reset();
}

async function handleUpdateInventory(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const id = data.id;
    delete data.id;
    
    const result = await api.updateInventory(id, data);
    if (result.success) {
        alert(result.message);
        cancelUpdate();
        loadInventoryList('update-inventory');
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const result = await api.deleteInventory(id);
        if (result.success) {
            alert(result.message);
            loadInventoryList('delete-inventory');
        }
    }
}

// Report functions
async function generateReport(type) {
    const result = await api.generateReport(type);
    document.getElementById('reportResults').innerHTML = `
        <h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>
        <pre>${result.data}</pre>
    `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Start with login page
    document.getElementById('login-page').classList.add('active');
    document.getElementById('main-app').classList.remove('active');
});