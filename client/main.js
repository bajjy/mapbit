import { MapManager } from './js/MapManager.js';
import { OSMService } from './js/OSMService.js';
import { ProcessingService } from './js/ProcessingService.js';
import { UIManager } from './js/UIManager.js';
class App {
    constructor() {
        console.log('🔧 Creating App instance...');
        this.mapManager = new MapManager();
        console.log('✅ MapManager created');
        this.osmService = new OSMService();
        console.log('✅ OSMService created');
        this.processingService = new ProcessingService();
        console.log('✅ ProcessingService created');
        this.uiManager = new UIManager();
        console.log('✅ UIManager created');
        
        this.currentLocation = null;
        this.currentData = null;
        this.processedData = null;
        this.isProcessing = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize the map
            await this.mapManager.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load default location
            await this.loadDefaultLocation();
            
            console.log('🎮 OSM RPG Map Converter initialized!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.uiManager.showError('Failed to initialize the application');
        }
    }
    
    setupEventListeners() {
        // Button events
        document.getElementById('loadLocation').addEventListener('click', () => this.loadUserLocation());
        document.getElementById('loadBuildings').addEventListener('click', () => this.loadOSMData());
        document.getElementById('processMap').addEventListener('click', () => this.processForRPG());
        document.getElementById('toggleGrid').addEventListener('click', () => this.toggleGrid());
        document.getElementById('setManualLocation').addEventListener('click', () => this.setManualLocation());
        
        // Sprite system events
        this.setupSpriteEventListeners();
        
        // Feature toggles
        document.getElementById('showBuildings').addEventListener('change', (e) => this.toggleFeature('buildings', e.target.checked));
        document.getElementById('showRoads').addEventListener('change', (e) => this.toggleFeature('roads', e.target.checked));
        document.getElementById('showWater').addEventListener('change', (e) => this.toggleFeature('water', e.target.checked));
        document.getElementById('showParks').addEventListener('change', (e) => this.toggleFeature('parks', e.target.checked));
        
        // Style controls
        document.getElementById('gridSize').addEventListener('input', (e) => this.updateGridSize(e.target.value));
        document.getElementById('tolerance').addEventListener('input', (e) => this.updateTolerance(e.target.value));
        document.getElementById('pixelArtMode').addEventListener('change', (e) => this.togglePixelArtMode(e.target.checked));
        
        // Map events
        this.mapManager.on('boundsChanged', (bounds) => this.onMapBoundsChanged(bounds));
    }
    
    async loadDefaultLocation() {
        try {
            // Use your specific location as default
            this.currentLocation = {
                lat: 41.127489,
                lng: -8.593545,
                name: 'Default Location'
            };
            this.mapManager.setView(this.currentLocation.lat, this.currentLocation.lng);
            console.log('📍 About to add location marker for:', this.currentLocation);
            this.mapManager.addLocationMarker(this.currentLocation);
            console.log('📍 Loaded default location:', this.currentLocation);
        } catch (error) {
            console.error('Failed to load default location:', error);
        }
    }
    
    setManualLocation() {
        const input = document.getElementById('manualLocation');
        const coords = input.value.trim();
        
        if (!coords) {
            this.uiManager.showError('Please enter coordinates in format: lat, lng');
            return;
        }
        
        try {
            const [latStr, lngStr] = coords.split(',').map(s => s.trim());
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            
            if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Invalid coordinates format');
            }
            
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error('Coordinates out of valid range');
            }
            
            this.currentLocation = {
                lat: lat,
                lng: lng,
                name: 'Manual Location'
            };
            
            this.mapManager.setView(lat, lng);
            this.mapManager.addLocationMarker(this.currentLocation);
            this.uiManager.showSuccess(`Location set to: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            console.log('📍 Manual location set:', this.currentLocation);
            
        } catch (error) {
            this.uiManager.showError('Invalid coordinates. Use format: latitude, longitude (e.g., 40.7128, -74.0060)');
        }
    }
    
    async loadUserLocation() {
        try {
            if (navigator.geolocation) {
                // Use a promise-based approach with timeout
                const getCurrentPositionPromise = new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 300000 // 5 minutes
                        }
                    );
                });

                try {
                    const position = await getCurrentPositionPromise;
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Your Location'
                    };
                    this.mapManager.setView(this.currentLocation.lat, this.currentLocation.lng);
                    this.mapManager.addLocationMarker(this.currentLocation);
                    console.log('📍 Loaded user location:', this.currentLocation);
                    this.uiManager.showSuccess('Location loaded successfully!');
                } catch (geoError) {
                    console.warn('Geolocation failed:', geoError);
                    
                    // Try to get a more specific error message
                    let errorMessage = 'Could not get your location.';
                    switch(geoError.code) {
                        case geoError.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please allow location access and try again.';
                            break;
                        case geoError.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable.';
                            break;
                        case geoError.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                    }
                    
                    this.uiManager.showError(errorMessage + ' Using default location.');
                    this.loadDefaultLocation();
                }
            } else {
                this.uiManager.showError('Geolocation not supported by this browser. Using default location.');
                this.loadDefaultLocation();
            }
        } catch (error) {
            console.error('Failed to load user location:', error);
            this.uiManager.showError('Failed to load location. Using default location.');
            this.loadDefaultLocation();
        }
    }
    
    async loadOSMData() {
        if (!this.currentLocation) {
            this.uiManager.showError('Please set a location first');
            return;
        }
        
        try {
            this.uiManager.showLoading(true);
            
            const bounds = this.mapManager.getBounds();
            const features = this.getSelectedFeatures();
            
            console.log('🗺️ Loading OSM data for bounds:', bounds, 'features:', features);
            
            this.currentData = await this.osmService.fetchOSMData(bounds, features);
            
            // Clear existing layers
            this.mapManager.clearLayers();
            
            // Add new data to map
            this.mapManager.addGeoJSONLayer(this.currentData, this.getStyleOptions());
            
            // Update stats
            await this.updateStats(this.currentData);
            
            console.log('✅ Loaded OSM data:', this.currentData.metadata);
            
        } catch (error) {
            console.error('Failed to load OSM data:', error);
            this.uiManager.showError('Failed to load map data');
        } finally {
            this.uiManager.showLoading(false);
        }
    }
    
    async processForRPG() {
        if (!this.currentData || !this.currentData.features.length) {
            this.uiManager.showError('Please load OSM data first');
            return;
        }
        
        if (this.isProcessing) {
            return;
        }
        
        try {
            this.isProcessing = true;
            this.uiManager.showLoading(true, 'Processing for RPG style...');
            
            const options = this.getProcessingOptions();
            console.log('✨ Processing data with options:', options);
            
            this.processedData = await this.processingService.orthogonalize(this.currentData.features, options);
            
            // Clear existing layers
            this.mapManager.clearLayers();
            
            // Add processed data to map
            this.mapManager.addGeoJSONLayer(this.processedData, this.getRPGStyleOptions());
            
            // Update stats
            await this.updateStats(this.processedData);
            
            console.log('✅ Processed data for RPG style:', this.processedData.metadata);
            
        } catch (error) {
            console.error('Failed to process data:', error);
            this.uiManager.showError('Failed to process map data');
        } finally {
            this.isProcessing = false;
            this.uiManager.showLoading(false);
        }
    }
    
    toggleGrid() {
        this.mapManager.toggleGrid();
    }
    
    toggleFeature(featureType, enabled) {
        console.log(`Toggling ${featureType}:`, enabled);
        // This would filter the current data and re-render
        // For now, just log the change
    }
    
    updateGridSize(value) {
        document.getElementById('gridSizeValue').textContent = value;
        console.log('Grid size updated:', value);
    }
    
    updateTolerance(value) {
        document.getElementById('toleranceValue').textContent = value;
        console.log('Tolerance updated:', value);
    }
    
    togglePixelArtMode(enabled) {
        this.mapManager.togglePixelArtMode(enabled);
        console.log('Pixel art mode:', enabled);
    }
    
    onMapBoundsChanged(bounds) {
        console.log('Map bounds changed:', bounds);
        // Could auto-reload data when bounds change significantly
    }
    
    getSelectedFeatures() {
        const features = [];
        if (document.getElementById('showBuildings').checked) features.push('buildings');
        if (document.getElementById('showRoads').checked) features.push('roads');
        if (document.getElementById('showWater').checked) features.push('water');
        if (document.getElementById('showParks').checked) features.push('parks');
        return features;
    }
    
    getProcessingOptions() {
        return {
            tolerance: parseFloat(document.getElementById('tolerance').value),
            gridSize: parseFloat(document.getElementById('gridSize').value),
            minArea: 0.000001,
            maxVertices: 20
        };
    }
    
    getStyleOptions() {
        return {
            color: '#3498db',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3
        };
    }
    
    getRPGStyleOptions() {
        return {
            color: '#e74c3c',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7,
            pixelArt: document.getElementById('pixelArtMode').checked
        };
    }
    
    async updateStats(data) {
        const featureCount = data.features ? data.features.length : 0;
        const buildingCount = data.features ? data.features.filter(f => f.properties && f.properties.building).length : 0;
        
        // Calculate total area for polygons (if turf is available)
        let totalArea = 0;
        if (data.features) {
            try {
                // Try to load turf dynamically
                const turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/+esm');
                data.features.forEach(feature => {
                    if (feature.geometry && feature.geometry.type === 'Polygon') {
                        try {
                            totalArea += turf.area(feature);
                        } catch (error) {
                            // Ignore invalid geometries
                        }
                    }
                });
            } catch (error) {
                console.warn('Could not load turf.js for area calculation:', error);
                totalArea = 0;
            }
        }
        
        document.getElementById('featureCount').textContent = featureCount;
        document.getElementById('buildingCount').textContent = buildingCount;
        document.getElementById('totalArea').textContent = Math.round(totalArea).toLocaleString();
    }
    
    setupSpriteEventListeners() {
        // Sprite mode toggle
        const spriteToggle = document.getElementById('toggleSpriteMode');
        if (spriteToggle) {
            spriteToggle.addEventListener('click', () => {
                const enabled = spriteToggle.checked;
                this.mapManager.toggleSpriteMode(enabled);
                this.uiManager.updateSpriteModeStatus(enabled);
            });
        }
        
        // Building style selector
        const styleSelector = document.getElementById('buildingStyle');
        if (styleSelector) {
            styleSelector.addEventListener('change', (e) => {
                const style = e.target.value;
                this.mapManager.setBuildingStyle(style);
                this.uiManager.updateBuildingStyleStatus(style);
            });
        }
        
        // Sprite scale slider
        const scaleSlider = document.getElementById('spriteScale');
        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                const scale = parseFloat(e.target.value);
                this.mapManager.setSpriteScale(scale);
                this.uiManager.updateSpriteScaleStatus(scale);
            });
        }
        
        // Show shape checkbox
        const showShapeCheckbox = document.getElementById('showShape');
        if (showShapeCheckbox) {
            showShapeCheckbox.addEventListener('click', () => {
                const enabled = showShapeCheckbox.checked;
                this.mapManager.toggleShapeDisplay(enabled);
                this.uiManager.updateShapeStatus(enabled);
            });
        }
        
        // Hide map checkbox
        const hideMapCheckbox = document.getElementById('hideMap');
        if (hideMapCheckbox) {
            hideMapCheckbox.addEventListener('click', () => {
                const enabled = hideMapCheckbox.checked;
                this.mapManager.toggleMapVisibility(enabled);
                this.uiManager.updateHideMapStatus(enabled);
            });
        }
        
        // Hide original polygon checkbox
        const hidePolygonCheckbox = document.getElementById('hideOriginalPolygon');
        if (hidePolygonCheckbox) {
            hidePolygonCheckbox.addEventListener('click', () => {
                const enabled = hidePolygonCheckbox.checked;
                this.mapManager.toggleOriginalPolygonVisibility(enabled);
                this.uiManager.updateHidePolygonStatus(enabled);
            });
        }
        
        // Pattern controls
        this.setupPatternControls();
    }

    setupPatternControls() {
        // Pattern size
        const patternSizeSlider = document.getElementById('patternSize');
        if (patternSizeSlider) {
            patternSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.mapManager.setPatternSize(size);
                this.updatePatternSizeDisplay(size);
            });
        }

        // Pattern spacing
        const patternSpacingSlider = document.getElementById('patternSpacing');
        if (patternSpacingSlider) {
            patternSpacingSlider.addEventListener('input', (e) => {
                const spacing = parseInt(e.target.value);
                this.mapManager.setPatternSpacing(spacing);
                this.updatePatternSpacingDisplay(spacing);
            });
        }
        
        // Pattern scale
        const patternScaleSlider = document.getElementById('patternScale');
        if (patternScaleSlider) {
            patternScaleSlider.addEventListener('input', (e) => {
                const scale = parseFloat(e.target.value);
                this.mapManager.setPatternScale(scale);
                this.updatePatternScaleDisplay(scale);
            });
        }

        // Pattern opacity
        const patternOpacitySlider = document.getElementById('patternOpacity');
        if (patternOpacitySlider) {
            patternOpacitySlider.addEventListener('input', (e) => {
                const opacity = parseFloat(e.target.value);
                this.mapManager.setPatternOpacity(opacity);
                this.updatePatternOpacityDisplay(opacity);
            });
        }

        // Pattern color
        const patternColorPicker = document.getElementById('patternColor');
        const patternColorOpacitySlider = document.getElementById('patternColorOpacity');
        
        if (patternColorPicker && patternColorOpacitySlider) {
            const updateColor = () => {
                const color = patternColorPicker.value;
                const opacity = parseFloat(patternColorOpacitySlider.value);
                this.mapManager.setPatternColor(color, opacity);
                this.updatePatternColorDisplay(opacity);
            };

            patternColorPicker.addEventListener('change', updateColor);
            patternColorOpacitySlider.addEventListener('input', updateColor);
        }

        // Pattern alignment
        const patternAlignSelect = document.getElementById('patternAlign');
        if (patternAlignSelect) {
            patternAlignSelect.addEventListener('change', (e) => {
                const align = e.target.value;
                this.mapManager.setPatternAlign(align);
            });
        }
    }

    updatePatternSizeDisplay(size) {
        const element = document.getElementById('patternSizeValue');
        if (element) {
            element.textContent = `${size}px`;
        }
    }

    updatePatternSpacingDisplay(spacing) {
        const element = document.getElementById('patternSpacingValue');
        if (element) {
            element.textContent = `${spacing}px`;
        }
    }

    updatePatternScaleDisplay(scale) {
        const element = document.getElementById('patternScaleValue');
        if (element) {
            element.textContent = `${scale}x`;
        }
    }

    updatePatternOpacityDisplay(opacity) {
        const element = document.getElementById('patternOpacityValue');
        if (element) {
            element.textContent = `${Math.round(opacity * 100)}%`;
        }
    }

    updatePatternColorDisplay(opacity) {
        const element = document.getElementById('patternColorOpacityValue');
        if (element) {
            element.textContent = `${Math.round(opacity * 100)}%`;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing app...');
    try {
        window.app = new App();
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        document.body.innerHTML = `
            <div style="padding: 20px; color: #e74c3c; font-family: monospace;">
                <h2>❌ App Initialization Error</h2>
                <p>Error: ${error.message}</p>
                <p>Check the browser console for more details.</p>
            </div>
        `;
    }
});

