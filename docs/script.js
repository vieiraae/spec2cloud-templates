// Global state
let allTemplates = [];
let featuredTemplateIds = [];
let filteredTemplates = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeTheme();
    renderFeaturedTemplates();
    buildFilterOptions();
    renderGallery();
    attachEventListeners();
});

// Load templates.json and featured-templates.json
async function loadData() {
    try {
        const [templatesResponse, featuredResponse] = await Promise.all([
            fetch('./templates.json'),
            fetch('./featured-templates.json')
        ]);

        const templatesData = await templatesResponse.json();
        featuredTemplateIds = await featuredResponse.json();

        // Convert templates object to array
        allTemplates = Object.entries(templatesData).map(([key, value]) => ({
            id: key,
            ...value
        }));

        filteredTemplates = [...allTemplates];
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Render featured templates
function renderFeaturedTemplates() {
    const featuredGrid = document.getElementById('featured-grid');
    const featuredTemplates = allTemplates.filter(t => featuredTemplateIds.includes(t.id));

    featuredGrid.innerHTML = featuredTemplates.map(template => createTemplateCard(template, true)).join('');
}

// Build filter options dynamically
function buildFilterOptions() {
    const categories = new Set();
    const industries = new Set();
    const languages = new Set();
    const services = new Set();
    const frameworks = new Set();

    allTemplates.forEach(template => {
        if (template.category) categories.add(template.category);
        if (template.industry) industries.add(template.industry);
        if (template.languages) template.languages.forEach(lang => languages.add(lang));
        if (template.services) template.services.forEach(svc => services.add(svc));
        if (template.frameworks) template.frameworks.forEach(fw => frameworks.add(fw));
    });

    populateSelect('category-filter', Array.from(categories).sort());
    populateSelect('industry-filter', Array.from(industries).sort());
    populateCheckboxes('language-filters', Array.from(languages).sort());
    populateCheckboxes('service-filters', Array.from(services).sort());
    populateCheckboxes('framework-filters', Array.from(frameworks).sort());
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option;
        optElement.textContent = option;
        select.appendChild(optElement);
    });
}

function populateCheckboxes(id, options) {
    const container = document.getElementById(id);
    container.innerHTML = options.map(option => `
        <label>
            <input type="checkbox" value="${option}" onchange="applyFilters()">
            ${option}
        </label>
    `).join('');
}

// Create template card HTML
function createTemplateCard(template, isFeatured = false) {
    const title = truncateText(template.title, 60);
    const description = truncateText(template.description, 200);
    const thumbnailUrl = template.thumbnail 
        ? `https://raw.githubusercontent.com/vieiraae/spec2cloud-templates/main/templates/${template.id}/${template.thumbnail}` 
        : 'https://via.placeholder.com/640x360?text=No+Image';
    const hasVideo = template.video && template.video !== '';
    const vscodeUrl = `vscode://yourpublisher.spec2cloud/command/spec2cloud.createProject?${encodeURIComponent(JSON.stringify({ template: template.id }))}`;

    return `
        <div class="template-card ${isFeatured ? 'featured' : ''}" data-template='${JSON.stringify(template)}'>
            <div class="template-thumbnail">
                <img src="${thumbnailUrl}" alt="${title}" loading="lazy">
                ${hasVideo ? `
                    <button class="video-play-button" onclick="openVideoModal('${template.video}')">
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="template-content">
                <h3 class="template-title">${title}</h3>
                <p class="template-description">${description}</p>
                <div class="template-badges">
                    ${template.category ? `<span class="badge category">${template.category}</span>` : ''}
                    ${template.industry ? `<span class="badge industry">${template.industry}</span>` : ''}
                </div>
                <div class="icon-badges">
                    ${renderIconBadges(template.languages, 'languages')}
                    ${renderIconBadges(template.services, 'services')}
                    ${renderIconBadges(template.frameworks, 'frameworks')}
                </div>
                <div class="template-actions">
                    <a href="https://github.com/vieiraae/spec2cloud-templates/tree/main/templates/${template.id}" 
                       target="_blank" 
                       class="btn-secondary">
                        View on GitHub
                    </a>
                    <a href="${vscodeUrl}" class="btn-primary">
                        Download to VS Code
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderIconBadges(items, type) {
    if (!items || items.length === 0) return '';
    
    return items.map(item => {
        const iconName = item.toLowerCase().replace(/\s+/g, '-');
        const iconPath = `media/${type}/${iconName}.svg`;
        return `<span class="icon-badge ${type}" title="${item}">
            <img src="${iconPath}" alt="${item}" onerror="this.style.display='none'">
            ${item}
        </span>`;
    }).join('');
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Render gallery
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    if (filteredTemplates.length === 0) {
        galleryGrid.innerHTML = '';
        noResults.style.display = 'block';
        resultsCount.textContent = `Showing 0 of ${allTemplates.length} templates`;
    } else {
        noResults.style.display = 'none';
        galleryGrid.innerHTML = filteredTemplates.map(template => createTemplateCard(template)).join('');
        resultsCount.textContent = `Showing ${filteredTemplates.length} of ${allTemplates.length} templates`;
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const industryFilter = document.getElementById('industry-filter').value;
    
    const selectedLanguages = getCheckedValues('language-filters');
    const selectedServices = getCheckedValues('service-filters');
    const selectedFrameworks = getCheckedValues('framework-filters');

    // Filter templates
    filteredTemplates = allTemplates.filter(template => {
        // Search filter
        const matchesSearch = !searchTerm || 
            template.title.toLowerCase().includes(searchTerm) ||
            template.description.toLowerCase().includes(searchTerm) ||
            (template.category && template.category.toLowerCase().includes(searchTerm)) ||
            (template.industry && template.industry.toLowerCase().includes(searchTerm)) ||
            (template.languages && template.languages.some(l => l.toLowerCase().includes(searchTerm))) ||
            (template.services && template.services.some(s => s.toLowerCase().includes(searchTerm))) ||
            (template.frameworks && template.frameworks.some(f => f.toLowerCase().includes(searchTerm)));

        // Category filter
        const matchesCategory = !categoryFilter || template.category === categoryFilter;

        // Industry filter
        const matchesIndustry = !industryFilter || template.industry === industryFilter;

        // Language filter
        const matchesLanguages = selectedLanguages.length === 0 || 
            (template.languages && selectedLanguages.some(lang => template.languages.includes(lang)));

        // Service filter
        const matchesServices = selectedServices.length === 0 || 
            (template.services && selectedServices.some(svc => template.services.includes(svc)));

        // Framework filter
        const matchesFrameworks = selectedFrameworks.length === 0 || 
            (template.frameworks && selectedFrameworks.some(fw => template.frameworks.includes(fw)));

        return matchesSearch && matchesCategory && matchesIndustry && 
               matchesLanguages && matchesServices && matchesFrameworks;
    });

    // Sort templates
    sortTemplates(sortBy);

    renderGallery();
}

function getCheckedValues(containerId) {
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function sortTemplates(sortBy) {
    switch (sortBy) {
        case 'alpha-asc':
            filteredTemplates.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'alpha-desc':
            filteredTemplates.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'date-asc':
            filteredTemplates.sort((a, b) => (a.version || '0').localeCompare(b.version || '0'));
            break;
        case 'date-desc':
            filteredTemplates.sort((a, b) => (b.version || '0').localeCompare(a.version || '0'));
            break;
    }
}

// Video modal
function openVideoModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    videoPlayer.src = videoUrl;
    modal.style.display = 'flex';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    videoPlayer.pause();
    videoPlayer.src = '';
    modal.style.display = 'none';
}

// Toggle advanced filters
function toggleAdvancedFilters() {
    const panel = document.getElementById('advanced-filters');
    const button = document.querySelector('[onclick="toggleAdvancedFilters()"]');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'grid';
        button.textContent = 'Hide Filters';
    } else {
        panel.style.display = 'none';
        button.textContent = 'More Filters';
    }
}

// Attach event listeners
function attachEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('industry-filter').addEventListener('change', applyFilters);
    
    // Close modal on click outside
    document.getElementById('video-modal').addEventListener('click', (e) => {
        if (e.target.id === 'video-modal') {
            closeVideoModal();
        }
    });
}
