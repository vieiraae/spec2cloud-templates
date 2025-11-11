# Template Gallery Application - Technical Specification

## Single Prompt for Complete Application Creation

Use this comprehensive prompt to create the entire template gallery application:

---

**CREATE A COMPLETE TEMPLATE GALLERY WEB APPLICATION**

Build a professional, responsive template gallery web application with the following exact specifications:

**CORE STRUCTURE:**
Create these files:
- `docs/index.html` - Main application page
- `docs/script.js` - All JavaScript functionality 
- `docs/styles.css` - Complete styling with theme support
- `docs/templates.json` - Sample template data
- `docs/featured-templates.json` - Featured template IDs

**TEMPLATE DATA SCHEMA:**
Each template must support:
```json
{
  "template-id": {
    "title": "Template Name",
    "description": "Detailed description",
    "category": "AI Apps & Agents | App Modernization | Data Centric Apps",
    "thumbnail": "path/to/image.png", // OPTIONAL
    "version": "1.0.0", // OPTIONAL
    "frameworks": ["React", "Node.js"], // Array
    "tags": ["ai", "chatbot"], // OPTIONAL array
    "last-commit-date": "2025-11-10T15:30:00Z", // ISO format
    "demo-url": "https://example.com", // OPTIONAL
    "video-url": "https://youtube.com/...", // OPTIONAL
    "repo-url": "https://github.com/..." // REQUIRED
  }
}
```

**REQUIRED FEATURES:**

1. **GRID LAYOUT:** Responsive cards showing title (60 char max), description (200 char max), thumbnail, framework badges, tag badges (green #10b981), optional version badge, last updated date

2. **FEATURED SECTION:** Separate area above main grid for highlighted templates

3. **SEARCH SYSTEM:** Single input searching title, description, frameworks, AND tags simultaneously with real-time filtering

4. **FILTERING SYSTEM:**
   - Category filter: "All Categories", "AI Apps & Agents", "App Modernization", "Data Centric Apps"
   - Framework filter: Multi-select checkboxes dynamically generated from data
   - Sort options: Title A-Z, Title Z-A, Date Newest First (DEFAULT), Date Oldest First

5. **THUMBNAIL SYSTEM:** 
   - Use template.thumbnail if provided
   - Category-specific defaults if missing:
     - "AI Apps & Agents" → "media/default-aiapps-thumbnail.png"
     - "App Modernization" → "media/default-appmod-thumbnail.png"
     - "Data Centric Apps" → "media/default-data-thumbnail.png"
   - Placeholder fallback for unmatched categories

6. **DETAIL MODAL:** Click card to open glassmorphism modal with large thumbnail, full description, all metadata, framework/tag badges, action buttons (repo, demo if available, video if available)

7. **VIDEO MODAL:** Separate modal for YouTube video playback when video-url provided

8. **THEME SYSTEM:** Toggle between light/dark themes with persistence, sun/moon icons, CSS variables, theme-aware logo

9. **RESPONSIVE DESIGN:** Mobile-first, grid auto-adjusts, modals work on all screens

10. **BADGE OVERFLOW:** If many frameworks/tags, show "X more" with expand functionality

**TECHNICAL REQUIREMENTS:**

- **DEFAULT SORT:** Page loads with "Date: Newest First" selected and applied
- **CONDITIONAL RENDERING:** Only show version badges, demo buttons, video buttons when data exists
- **GRACEFUL FALLBACKS:** Handle missing dates, thumbnails, optional fields elegantly
- **SMOOTH ANIMATIONS:** Hover effects, modal transitions, theme switching
- **ACCESSIBILITY:** ARIA labels, keyboard navigation, semantic HTML
- **PERFORMANCE:** Fast filtering (<100ms), efficient rendering

**JAVASCRIPT FUNCTIONS NEEDED:**
```javascript
// Core
async loadData(), renderGallery(), createTemplateCard()
// Modals  
openTemplateModal(), openVideoModal(), closeModal()
// Filtering
applyFilters(), sortTemplates(), filterBySearch()
// UI
initializeTheme(), attachEventListeners(), buildFilterOptions()
```

**CSS REQUIREMENTS:**
- CSS variables for theming
- Glassmorphism modal backgrounds with backdrop-filter
- Responsive grid layout
- Smooth transitions and hover effects
- Professional color scheme with accent colors

**SAMPLE DATA:** Include 6-8 sample templates with variety of categories, some with videos/demos, some without thumbnails/versions to test all conditional features.

**INITIALIZATION:** Page loads → fetch data → sort by newest first → render featured → render grid → attach all event listeners → initialize theme

Build a production-ready application that handles all edge cases and provides excellent user experience across all devices.

---

## Overview

A responsive web-based template gallery application that displays Azure cloud templates with advanced filtering, searching, and categorization capabilities. The application provides both a grid view for browsing templates and detailed modal views for template information.

## Core Architecture

### File Structure
```
docs/
├── index.html          # Main application markup
├── script.js           # Core JavaScript functionality (518 lines)
├── styles.css          # Application styling with theme support
├── templates.json      # Template data (generated by workflow)
└── featured-templates.json # Featured template IDs
.github/workflows/
└── update_templates_json.py # Python script to generate templates.json
templates/
├── [template-folders]/     # Individual template directories
└── _[hidden-folders]/      # Work-in-progress templates (excluded)
```

### Data Sources
- **templates.json**: Primary data source containing all template metadata
- **featured-templates.json**: Array of template IDs to feature prominently
- **Template folders**: Individual directories containing README.MD files with metadata

## Template Data Schema

Each template in templates.json follows this structure:

```json
{
  "template-id": {
    "title": "Template Title",
    "description": "Detailed description of the template",
    "category": "AI Apps & Agents | App Modernization | Data Centric Apps",
    "thumbnail": "path/to/image.png", // Optional
    "version": "1.0.0", // Optional
    "frameworks": ["React", "Node.js"], // Array of technology frameworks
    "tags": ["ai", "chatbot", "azure"], // Optional array for enhanced searching
    "last-commit-date": "2025-11-10T15:30:00Z", // ISO format for sorting
    "demo-url": "https://example.com", // Optional
    "video-url": "https://youtube.com/...", // Optional
    "repo-url": "https://github.com/..."
  }
}
```

## Core Features & Requirements

### 1. Template Display System

#### Grid View (Primary Interface)
- **Card Layout**: Responsive grid with consistent card dimensions
- **Card Content**:
  - Template thumbnail (with category-specific fallbacks)
  - Title (truncated at 60 characters)
  - Description (truncated at 200 characters)
  - Framework badges (with overflow handling)
  - Tag badges (green: #10b981)
  - Version badge (conditional display)
  - Last updated date (conditional display)
- **Card Interactions**:
  - Click to open detailed modal
  - Hover effects for better UX
  - Theme-aware styling

#### Featured Templates Section
- Separate section above main grid
- Uses same card design with "Featured" indicator
- Data driven from featured-templates.json

### 2. Advanced Filtering & Search

#### Search Functionality
- **Global Search**: Single search input
- **Search Scope**: Title, description, frameworks, and tags
- **Real-time Results**: Filter as user types
- **Case Insensitive**: Robust text matching

#### Category Filter
- **Options**: "All Categories", "AI Apps & Agents", "App Modernization", "Data Centric Apps"
- **Single Selection**: Radio-button style behavior
- **Visual Feedback**: Clear active state

#### Framework Filter
- **Dynamic Generation**: Built from available frameworks in data
- **Multi-Select**: Checkbox-style selection
- **Visual Count**: Show number of templates per framework
- **Logical OR**: Show templates matching any selected framework

#### Sort Options
- **Default**: Date: Newest First (date-desc)
- **Available Options**:
  - Sort by Title: A-Z (alpha-asc)
  - Sort by Title: Z-A (alpha-desc)
  - Sort by Date: Newest First (date-desc) - DEFAULT
  - Sort by Date: Oldest First (date-asc)
- **Date Handling**: Graceful handling of missing dates (fallback to epoch)

### 3. Template Detail Modal

#### Modal Content Structure
- **Header**: Template title and close button
- **Thumbnail**: Large image display with category fallbacks
- **Metadata Section**:
  - Version badge (conditional)
  - Last updated date (conditional)
  - Category display
- **Frameworks Section**: Framework badges matching card style
- **Tags Section**: Tag badges (displayed after frameworks)
- **Description**: Full description without truncation
- **Action Buttons**:
  - Repository link (always present)
  - Demo link (conditional)
  - Video link (conditional - opens video modal)

#### Modal Behavior
- **Glassmorphism Design**: Transparent background with blur effect
- **Responsive**: Works on mobile and desktop
- **Keyboard Support**: ESC to close, focus management
- **Background Click**: Close on backdrop click

### 4. Video Integration

#### Video Modal System
- **Separate Modal**: Dedicated video viewer
- **Supported Platforms**: YouTube integration
- **Responsive Embed**: Maintains aspect ratio
- **Modal Stacking**: Can open over template modal

### 5. Theme System

#### Theme Toggle
- **Button Location**: Header area
- **Supported Themes**: Light and Dark
- **Persistence**: Remember user preference
- **Visual Feedback**: Clear active state
- **Icons**: Sun/moon icons with theme-appropriate visibility

#### Theme Implementation
- **CSS Variables**: Consistent color system
- **Components Affected**: All UI elements adapt to theme
- **Logo Adaptation**: Theme-specific logo variants

### 6. Responsive Design

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

#### Responsive Behaviors
- **Grid Columns**: Auto-adjust based on screen size
- **Filter Layout**: Stack on mobile
- **Modal Sizing**: Full-screen on mobile
- **Typography**: Scalable font sizes

### 7. Asset Management

#### Thumbnail System
- **Custom Thumbnails**: Template-specific images when available
- **Category Defaults**: Fallback images per category:
  - AI Apps & Agents: `media/default-aiapps-thumbnail.png`
  - App Modernization: `media/default-appmod-thumbnail.png`  
  - Data Centric Apps: `media/default-data-thumbnail.png`
- **Final Fallback**: Placeholder image for unmatched categories
- **URL Format**: GitHub raw URLs for template-specific images

#### Badge System
- **Framework Badges**: Technology stack indicators
- **Tag Badges**: Searchable keywords (green styling)
- **Version Badges**: Optional version display
- **Overflow Handling**: "Show More" functionality for large lists

## Technical Implementation Details

### JavaScript Architecture (script.js)

#### Core Functions
```javascript
// Data Management
async function loadData()                    // Load JSON data sources
function buildFilterOptions()               // Generate filter UI from data

// Rendering
function renderGallery()                     // Main template grid
function renderFeaturedTemplates()           // Featured section
function createTemplateCard(template, isFeatured) // Individual cards
function openTemplateModal(template)         // Detail modal
function openVideoModal(videoUrl)           // Video viewer

// Filtering & Search  
function applyFilters()                      // Apply all active filters
function sortTemplates(sortBy)              // Sort template array
function filterBySearch(searchTerm)         // Text search logic
function filterByCategory(category)         // Category filtering
function filterByFrameworks(frameworks)     // Framework filtering

// UI Management
function initializeTheme()                  // Theme system setup
function attachEventListeners()             // Event binding
function closeModal(modalId)               // Modal management
```

#### Event Handlers
- **DOMContentLoaded**: Application initialization
- **Search Input**: Real-time filtering with debouncing
- **Filter Changes**: Category and framework selection
- **Sort Changes**: Template ordering
- **Modal Events**: Open/close interactions
- **Theme Toggle**: Switch between light/dark modes

### CSS Architecture (styles.css)

#### Design System
```css
/* CSS Variables for theming */
:root {
  --primary-color: #0066cc;
  --accent-color: #007acc;
  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #333333;
  --border-color: #e1e5e9;
  /* ... theme-specific variants */
}

/* Component Classes */
.template-card { }                /* Main template cards */
.template-modal { }               /* Detail modal overlay */
.video-modal { }                  /* Video player modal */
.filter-section { }               /* Filter controls */
.badge { }                        /* Framework/tag/version badges */
.theme-toggle { }                 /* Theme switcher */
```

#### Key Features
- **Glassmorphism**: Modal backgrounds with backdrop-filter
- **Smooth Animations**: Transitions for hovers and state changes
- **Responsive Grid**: CSS Grid with auto-fit columns
- **Typography Scale**: Consistent heading and body text sizes

### Data Generation (.github/workflows/update_templates_json.py)

#### Workflow Purpose
- **Automation**: Generate templates.json from template folders
- **Source**: Parse README.MD files in each template directory
- **Filtering**: Skip folders starting with underscore (work-in-progress)
- **Output**: Structured JSON for application consumption

#### Processing Logic
```python
# Folder Processing
for folder in template_folders:
    if folder.startswith('_'):
        continue  # Skip underscore-prefixed folders
    
    # Parse README.MD metadata
    # Extract title, description, frameworks, etc.
    # Add to templates dictionary

# Output Generation
json.dump(templates, output_file, indent=2)
```

## Quality & Performance Requirements

### Performance Standards
- **Initial Load**: < 2 seconds for data loading
- **Filtering**: < 100ms response time for filter changes
- **Search**: Real-time results with minimal delay
- **Image Loading**: Progressive loading with fallbacks

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Graceful Degradation**: Core functionality without JavaScript

### Accessibility Standards
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for interactive elements
- **Keyboard Navigation**: Full functionality via keyboard
- **Screen Reader**: Compatible with assistive technologies
- **Color Contrast**: WCAG AA compliant color ratios

## Development Phases (Historical Implementation)

### Phase 1-52: Core Foundation
- Basic HTML structure and CSS styling
- JavaScript framework setup
- Data loading and template rendering
- Search and filter functionality
- Modal system implementation
- Theme system development
- Video integration
- Responsive design implementation

### Phase 53-56: Polish & Enhancement
- Card title styling (blue accent color)
- Modal glassmorphism effects  
- Tag system implementation (searchable, green badges)
- Badge overflow handling

### Phase 57-60: Configuration & Defaults
- Optional thumbnails with category-specific defaults
- Optional version badges (conditional display)
- Skip underscore-prefixed template folders
- Default sort order (newest first)

## Testing & Validation

### Manual Testing Scenarios
1. **Template Display**: Verify all templates render correctly
2. **Search Functionality**: Test various search terms
3. **Filter Combinations**: Test multiple filters simultaneously
4. **Modal Interactions**: Open/close behavior
5. **Theme Switching**: Verify theme persistence
6. **Responsive Behavior**: Test across device sizes
7. **Video Integration**: Verify video modal functionality

### Data Validation
- **JSON Schema**: Validate template data structure
- **Image Paths**: Verify thumbnail accessibility
- **Date Formats**: Ensure consistent date formatting
- **URL Validation**: Check demo and repository links

## Deployment & Hosting

### GitHub Pages Setup
- **Source Branch**: `pages` branch for GitHub Pages hosting
- **Build Process**: Automated via GitHub Actions
- **Static Assets**: All files served statically
- **Domain**: Custom domain configuration support

### File Organization
- **docs/**: Web application files for GitHub Pages
- **templates/**: Source template directories  
- **.github/workflows/**: Automation scripts
- **media/**: Static assets (default thumbnails, logos)

## Future Enhancement Opportunities

### Potential Features
- **Search Suggestions**: Auto-complete functionality
- **Advanced Filtering**: Date range, complexity level
- **Template Comparison**: Side-by-side comparison tool
- **User Favorites**: Bookmark system
- **Export Options**: Template list export
- **Analytics**: Usage tracking and insights
- **Comments/Ratings**: Community feedback system

### Technical Improvements
- **Progressive Web App**: Offline functionality
- **Virtual Scrolling**: Performance for large datasets
- **Image Optimization**: WebP format support
- **Bundle Optimization**: Code splitting for faster loads
- **API Integration**: Real-time template updates
- **Search Analytics**: Popular search terms tracking

## Conclusion

This specification provides a complete blueprint for recreating the template gallery application. The modular architecture, comprehensive feature set, and detailed implementation guidelines ensure consistent development and maintenance of the platform.

The application successfully balances functionality with performance, providing users with an intuitive interface for discovering and exploring Azure cloud templates while maintaining high standards for accessibility, responsive design, and user experience.