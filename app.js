// CSC Database App
const SHEET_ID = '1Hs3ZVmxTZMvgCBpnYuAzX28TmW2mxaqT6GenpgkDMKM';
const API_KEY = 'AIzaSyDGLCN8wWs_JqWqKqWqKqWqKqWqKqWqKqQ'; // Replace with your API key
const SHEET_NAME = 'Sheet1';
const ITEMS_PER_PAGE = 20;

let allData = [];
let filteredData = [];
let currentPage = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    registerServiceWorker();
});

// Load data from Google Sheets
async function loadData() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        allData = json.table.rows.map(row => ({
            slNo: row.c[0]?.v || '',
            cscId: row.c[1]?.v || '',
            rolloutMonth: row.c[2]?.v || '',
            vlesName: row.c[3]?.v || '',
            mobNo: row.c[4]?.v || '',
            altContact: row.c[5]?.v || '',
            mailId: row.c[6]?.v || '',
            gender: row.c[7]?.v || '',
            kioskName: row.c[8]?.v || '',
            state: row.c[9]?.v || '',
            district: row.c[10]?.v || '',
            subdistrict: row.c[11]?.v || '',
            dmDc: row.c[12]?.v || '',
            block: row.c[13]?.v || '',
            gp: row.c[14]?.v || '',
            village: row.c[15]?.v || '',
            txnStatus: row.c[16]?.v || ''
        }));
        
        filteredData = [...allData];
        populateFilters();
        updateStats();
        renderResults();
    } catch (error) {
        document.getElementById('resultsContainer').innerHTML = `
            <div class="no-results">
                <h3>Error loading data</h3>
                <p>Please check your internet connection and try again.</p>
            </div>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterData);
    document.getElementById('stateFilter').addEventListener('change', filterData);
    document.getElementById('districtFilter').addEventListener('change', filterData);
    document.getElementById('genderFilter').addEventListener('change', filterData);
}

// Populate filter dropdowns
function populateFilters() {
    const states = [...new Set(allData.map(item => item.state))].filter(Boolean).sort();
    const stateFilter = document.getElementById('stateFilter');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });
}

// Update district filter based on state
function updateDistrictFilter(selectedState) {
    const districtFilter = document.getElementById('districtFilter');
    districtFilter.innerHTML = '<option value="">All Districts</option>';
    
    if (selectedState) {
        const districts = [...new Set(
            allData.filter(item => item.state === selectedState)
                   .map(item => item.district)
        )].filter(Boolean).sort();
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtFilter.appendChild(option);
        });
    }
}

// Filter data
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const stateFilter = document.getElementById('stateFilter').value;
    const districtFilter = document.getElementById('districtFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;
    
    if (stateFilter) {
        updateDistrictFilter(stateFilter);
    }
    
    filteredData = allData.filter(item => {
        const matchesSearch = !searchTerm || 
            item.cscId.toLowerCase().includes(searchTerm) ||
            item.vlesName.toLowerCase().includes(searchTerm) ||
            item.district.toLowerCase().includes(searchTerm) ||
            item.state.toLowerCase().includes(searchTerm) ||
            item.mobNo.includes(searchTerm);
            
        const matchesState = !stateFilter || item.state === stateFilter;
        const matchesDistrict = !districtFilter || item.district === districtFilter;
        const matchesGender = !genderFilter || item.gender === genderFilter;
        
        return matchesSearch && matchesState && matchesDistrict && matchesGender;
    });
    
    currentPage = 1;
    updateStats();
    renderResults();
}

// Update statistics
function updateStats() {
    document.getElementById('totalRecords').textContent = allData.length.toLocaleString();
    document.getElementById('filteredRecords').textContent = filteredData.length.toLocaleString();
    
    const uniqueStates = new Set(allData.map(item => item.state).filter(Boolean));
    const uniqueDistricts = new Set(allData.map(item => item.district).filter(Boolean));
    
    document.getElementById('statesCount').textContent = uniqueStates.size;
    document.getElementById('districtsCount').textContent = uniqueDistricts.size;
}

// Render results
function renderResults() {
    const container = document.getElementById('resultsContainer');
    
    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No results found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    container.innerHTML = pageData.map(item => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${item.vlesName}</div>
                <div class="card-id">${item.cscId}</div>
            </div>
            <div class="card-details">
                <div class="detail-item">
                    <div class="detail-label">Kiosk Name</div>
                    <div class="detail-value">${item.kioskName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${item.village || item.block}, ${item.district}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">State</div>
                    <div class="detail-value">${item.state}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Gender</div>
                    <div class="detail-value">${item.gender === 'M' ? 'Male' : 'Female'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Rollout Month</div>
                    <div class="detail-value">${item.rolloutMonth}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Transaction Status</div>
                    <div class="detail-value">${item.txnStatus || 'N/A'}</div>
                </div>
            </div>
            <div class="card-actions">
                <a href="tel:${item.mobNo}" class="btn btn-primary">📞 ${item.mobNo}</a>
                ${item.altContact ? `<a href="tel:${item.altContact}" class="btn btn-primary">📞 Alt: ${item.altContact}</a>` : ''}
                ${item.mailId ? `<a href="mailto:${item.mailId}" class="btn btn-secondary">✉️ Email</a>` : ''}
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;
    
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    html += `
        <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;
    
    paginationContainer.innerHTML = html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Register service worker for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
}