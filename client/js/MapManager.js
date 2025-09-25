import L from 'https://cdn.skypack.dev/leaflet@1.9.4';
import { PatternRenderer } from './PatternRenderer.js';

export class MapManager {
    constructor() {
        this.map = null;
        this.layers = new Map();
        this.gridLayer = null;
        this.pixelArtMode = false;
        this.eventListeners = new Map();
        this.patternRenderer = null;
        this.spriteMode = false;
        this.showShape = false;
        this.hideMap = false;
        this.hideOriginalPolygon = false;
    }
    
    async init() {
        console.log('🗺️ Initializing map...');
        
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            throw new Error('Leaflet is not loaded');
        }
        
        // Check if map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }
        
        // Initialize the map
        this.map = L.map('map', {
            center: [40.7128, -74.0060], // Default to NYC
            zoom: 19, // Maximum zoom level
            zoomControl: true,
            attributionControl: true,
            maxZoom: 19
        });
        
        // Add a base tile layer so the map is visible
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Set up event listeners
        this.setupMapEvents();
        
        // Initialize sprite rendering system
        this.initSpriteRendering();
        
        console.log('✅ Map initialized successfully');
    }
    
    setupMapEvents() {
        // Debounce the bounds changed event to avoid spam
        let boundsTimeout;
        const emitBoundsChanged = () => {
            clearTimeout(boundsTimeout);
            boundsTimeout = setTimeout(() => {
                this.emit('boundsChanged', this.getBounds());
            }, 100); // Wait 100ms after last event
        };
        
        this.map.on('moveend', emitBoundsChanged);
        this.map.on('zoomend', emitBoundsChanged);
        
        // Update sprite canvas size on map events
        this.map.on('moveend', () => {
            if (this.spriteMode) {
                this.updateSpriteCanvasSize();
                setTimeout(() => this.renderBuildingsWithSprites(), 100);
            }
        });
        this.map.on('zoomend', () => {
            if (this.spriteMode) {
                this.updateSpriteCanvasSize();
                setTimeout(() => this.renderBuildingsWithSprites(), 100);
            }
        });
        this.map.on('resize', () => {
            if (this.spriteMode) {
                this.updateSpriteCanvasSize();
                setTimeout(() => this.renderBuildingsWithSprites(), 100);
            }
        });
    }
    
    setView(lat, lng, zoom = 19) {
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }
    
    addLocationMarker(location) {
        // Remove existing location marker
        if (this.locationMarker) {
            this.map.removeLayer(this.locationMarker);
            this.locationMarker = null;
        }
        
        // Create a custom location marker with proper anchoring
        const locationIcon = L.divIcon({
            className: 'location-marker',
            html: '📍',
            iconSize: [30, 30],
            iconAnchor: [15, 30], // Point of the pin should be at the bottom center
            popupAnchor: [0, -30]
        });
        
        // Create marker with exact coordinates
        const markerLatLng = L.latLng(location.lat, location.lng);
        
        // Add the marker with precise positioning
        this.locationMarker = L.marker(markerLatLng, { 
            icon: locationIcon,
            zIndexOffset: 1000, // Make sure it's on top
            draggable: false // Prevent accidental dragging
        }).addTo(this.map);
        
        console.log('📍 Marker created and added to map:', {
            coordinates: markerLatLng,
            marker: this.locationMarker,
            map: this.map
        });
        
        // Add popup
        this.locationMarker.bindPopup(`
            <div class="location-popup">
                <strong>${location.name}</strong><br>
                <small>Lat: ${location.lat.toFixed(6)}<br>
                Lng: ${location.lng.toFixed(6)}</small>
            </div>
        `);
        
        // Ensure marker stays at exact coordinates
        this.locationMarker.on('dragend', () => {
            // If somehow dragged, snap back to exact coordinates
            this.locationMarker.setLatLng(markerLatLng);
        });
        
        console.log('📍 Location marker added at exact coordinates:', location);
    }
    
    getBounds() {
        if (!this.map) return null;
        
        const bounds = this.map.getBounds();
        return {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        };
    }
    
    addGeoJSONLayer(geoJsonData, styleOptions = {}) {
        if (!this.map || !geoJsonData || !geoJsonData.features) {
            console.warn('Cannot add GeoJSON layer: invalid data');
            return;
        }
        
        const defaultStyle = {
            color: '#3498db',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3,
            pixelArt: false
        };
        
        const style = { ...defaultStyle, ...styleOptions };
        
        const layer = L.geoJSON(geoJsonData, {
            style: (feature) => this.getFeatureStyle(feature, style),
            onEachFeature: (feature, layer) => this.onEachFeature(feature, layer),
            pointToLayer: (feature, latlng) => this.createPointMarker(feature, latlng)
        });
        
        layer.addTo(this.map);
        this.layers.set('main', layer);
        
        console.log(`✅ Added GeoJSON layer with ${geoJsonData.features.length} features`);
    }
    
    getFeatureStyle(feature, styleOptions) {
        const baseStyle = {
            color: styleOptions.color,
            weight: styleOptions.weight,
            opacity: styleOptions.opacity,
            fillOpacity: styleOptions.fillOpacity
        };
        
        // Apply pixel art styling if enabled
        if (styleOptions.pixelArt) {
            baseStyle.lineCap = 'square';
            baseStyle.lineJoin = 'miter';
        }
        
        // Style based on feature type
        if (feature.properties) {
            if (feature.properties.building) {
                baseStyle.color = '#e74c3c';
                baseStyle.fillColor = '#c0392b';
                baseStyle.weight = 1;
            } else if (feature.properties.highway) {
                baseStyle.color = '#95a5a6';
                baseStyle.weight = 3;
                baseStyle.fillOpacity = 0;
            } else if (feature.properties.natural === 'water' || feature.properties.waterway) {
                baseStyle.color = '#3498db';
                baseStyle.fillColor = '#2980b9';
                baseStyle.weight = 1;
            } else if (feature.properties.leisure === 'park' || feature.properties.landuse === 'recreation_ground') {
                baseStyle.color = '#27ae60';
                baseStyle.fillColor = '#2ecc71';
                baseStyle.weight = 1;
            }
        }
        
        return baseStyle;
    }
    
    onEachFeature(feature, layer) {
        // Add popup with feature information
        if (feature.properties) {
            const props = feature.properties;
            let popupContent = '<div class="feature-popup">';
            
            if (props.building) {
                popupContent += `<strong>🏠 Building</strong><br>`;
                popupContent += `Type: ${props.building}<br>`;
            } else if (props.highway) {
                popupContent += `<strong>🛣️ Road</strong><br>`;
                popupContent += `Type: ${props.highway}<br>`;
            } else if (props.natural === 'water' || props.waterway) {
                popupContent += `<strong>💧 Water</strong><br>`;
                if (props.waterway) popupContent += `Type: ${props.waterway}<br>`;
            } else if (props.leisure === 'park') {
                popupContent += `<strong>🌳 Park</strong><br>`;
            }
            
            if (props.name) {
                popupContent += `Name: ${props.name}<br>`;
            }
            
            if (props._processed) {
                popupContent += `<em>✨ Processed for RPG style</em><br>`;
            }
            
            popupContent += '</div>';
            
            layer.bindPopup(popupContent);
        }
        
        // Add click event
        layer.on('click', (e) => {
            console.log('Feature clicked:', feature);
        });
    }
    
    createPointMarker(feature, latlng) {
        // Create custom markers for points
        const icon = L.divIcon({
            className: 'custom-marker',
            html: '📍',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        return L.marker(latlng, { icon });
    }
    
    clearLayers() {
        this.layers.forEach((layer, key) => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });
        this.layers.clear();
    }
    
    toggleGrid() {
        if (this.gridLayer) {
            if (this.map.hasLayer(this.gridLayer)) {
                this.map.removeLayer(this.gridLayer);
            } else {
                this.map.addLayer(this.gridLayer);
            }
        } else {
            // Create grid layer
            this.gridLayer = L.layerGroup();
            
            // Add grid lines
            const bounds = this.map.getBounds();
            const gridSize = 0.001; // Adjust based on zoom level
            
            for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += gridSize) {
                const line = L.polyline([
                    [lat, bounds.getWest()],
                    [lat, bounds.getEast()]
                ], {
                    color: '#3498db',
                    opacity: 0.3,
                    weight: 1,
                    interactive: false
                });
                this.gridLayer.addLayer(line);
            }
            
            for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += gridSize) {
                const line = L.polyline([
                    [bounds.getSouth(), lng],
                    [bounds.getNorth(), lng]
                ], {
                    color: '#3498db',
                    opacity: 0.3,
                    weight: 1,
                    interactive: false
                });
                this.gridLayer.addLayer(line);
            }
            
            this.map.addLayer(this.gridLayer);
        }
    }
    
    togglePixelArtMode(enabled) {
        this.pixelArtMode = enabled;
        
        // Apply pixel art styling to existing layers
        this.layers.forEach((layer) => {
            layer.setStyle({
                lineCap: enabled ? 'square' : 'round',
                lineJoin: enabled ? 'miter' : 'round'
            });
        });
        
        // Add CSS class to map container
        const mapContainer = document.getElementById('map');
        if (enabled) {
            mapContainer.classList.add('pixel-art-mode');
        } else {
            mapContainer.classList.remove('pixel-art-mode');
        }
    }
    
    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => callback(data));
        }
    }

    // Sprite rendering system
    initSpriteRendering() {
        try {
            // Create a canvas for sprite rendering that overlays the map
            const canvas = document.createElement('canvas');
            canvas.id = 'sprite-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none'; // Allow clicks to pass through to map
            canvas.style.zIndex = '1000'; // Above map but below UI
            canvas.style.imageRendering = 'pixelated'; // Crisp pixel art rendering
            
            // Add canvas to map container
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.appendChild(canvas);
            } else {
                document.body.appendChild(canvas);
            }
            
            // Initialize both renderers
                this.patternRenderer = new PatternRenderer(canvas);
            
            // Wait for pattern sprite sheet to load, then retry rendering if sprite mode is enabled
            this.patternRenderer.spriteSheet.onload = () => {
                console.log('🎨 Pattern sprite sheet loaded, retrying pattern rendering');
                if (this.spriteMode) {
                    setTimeout(() => {
                        this.renderBuildingsWithPatterns();
                    }, 100);
                }
            };
            
            console.log('🎨 Pattern rendering system initialized');
        } catch (error) {
            console.warn('Failed to initialize sprite rendering:', error);
        }
    }

    /**
     * Enable sprite mode for building rendering
     * @param {boolean} enabled - Whether to enable sprite mode
     */
    toggleSpriteMode(enabled) {
        this.spriteMode = enabled;
        console.log(`🎨 Sprite mode ${enabled ? 'enabled' : 'disabled'}`);
        
        // Show/hide sprite canvas
        const spriteCanvas = document.getElementById('sprite-canvas');
        if (spriteCanvas) {
            spriteCanvas.style.display = enabled ? 'block' : 'none';
        }
        
        // Hide/show building layers based on sprite mode
        this.layers.forEach((layer, layerName) => {
            if (layerName.toLowerCase().includes('building')) {
                if (enabled) {
                    // Hide original building polygons when sprites are shown
                    layer.setStyle({ opacity: 0, fillOpacity: 0 });
                } else {
                    // Show original building polygons when sprites are hidden
                    layer.setStyle({ opacity: 0.8, fillOpacity: 0.3 });
                }
            }
        });
        
        if (enabled) {
            // Update canvas size to match map
            this.updateSpriteCanvasSize();
            // Re-render existing buildings with patterns
            this.renderBuildingsWithPatterns();
        }
    }

    /**
     * Set building style for sprite rendering
     * @param {string} style - Building style ('basic', 'stone', 'wooden', 'modern')
     */
    setBuildingStyle(style) {
        if (this.patternRenderer) {
            this.patternRenderer.setPattern(style);
            console.log(`🏠 Pattern style set to: ${style}`);
            
            // Re-render if sprite mode is enabled
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }


    /**
     * Render buildings with pattern-based graphics (NEW CLEAN METHOD)
     */
    renderBuildingsWithPatterns() {
        if (!this.patternRenderer || !this.spriteMode) {
            return;
        }

        // Check if pattern renderer is ready
        if (!this.patternRenderer.isReady()) {
            console.warn('Pattern renderer not ready yet, skipping pattern rendering');
            return;
        }

        // Clear previous pattern rendering
        this.patternRenderer.clear();

        // Get all building layers - check for GeoJSON layers with polygon features
        const buildingLayers = [];
        
        this.layers.forEach((layer, layerName) => {
            if (layer.eachLayer) {
                // This is a Leaflet GeoJSON layer
                layer.eachLayer((featureLayer) => {
                    if (featureLayer.feature && 
                        featureLayer.feature.geometry && 
                        featureLayer.feature.geometry.type === 'Polygon') {
                        buildingLayers.push(featureLayer);
                    }
                });
            }
        });

        console.log(`Found ${buildingLayers.length} building features for pattern rendering`);

        if (buildingLayers.length === 0) {
            console.log('No building layers found for pattern rendering');
            return;
        }

        // Convert building layers to pattern-renderable format
        const buildings = buildingLayers.map((layer, index) => {
            const coordinates = layer.feature.geometry.coordinates[0];
            const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
            
            // Convert to pixel coordinates
            const pixelCoords = latLngs.map(latLng => {
                const point = this.map.latLngToContainerPoint(latLng);
                return [point.x, point.y];
            });

            return {
                id: layer.feature.id || Math.random().toString(36).substr(2, 9),
                coordinates: pixelCoords,
                properties: layer.feature.properties || {}
            };
        });

        // Render buildings with patterns
        buildings.forEach((building, index) => {
            this.patternRenderer.renderBuilding(building.coordinates, {
                showShape: this.showShape
            });
        });

        console.log(`🎨 Rendered ${buildings.length} buildings with patterns`);
    }

    /**
     * Add building layer with sprite rendering
     * @param {Object} geojson - GeoJSON data
     * @param {Object} options - Layer options
     */
    addBuildingLayer(geojson, options = {}) {
        const {
            name = 'Buildings',
            style = 'basic',
            showSprites = true
        } = options;

        // Add layer to map
        const layer = L.geoJSON(geojson, {
            style: {
                color: '#008080',
                weight: 2,
                opacity: 0.8,
                fillColor: '#40E0D0',
                fillOpacity: 0.3
            }
        }).addTo(this.map);

        // Store layer
        this.layers.set(name, layer);

        // Set building style if specified
        if (this.patternRenderer) {
            this.patternRenderer.setPattern(style);
        }

        // Render with patterns if enabled
        if (showSprites && this.spriteMode) {
            setTimeout(() => {
                this.renderBuildingsWithPatterns();
            }, 100); // Small delay to ensure layer is rendered
        }

        console.log(`🏠 Added building layer: ${name}`);
        return layer;
    }

    /**
     * Get available building styles
     * @returns {Array} Array of available style names
     */
    getAvailableBuildingStyles() {
        return this.patternRenderer ? this.patternRenderer.getAvailablePatterns() : [];
    }

    /**
     * Get building style information
     * @param {string} style - Style name
     * @returns {Object} Style information
     */
    getBuildingStyleInfo(style) {
        return this.patternRenderer ? this.patternRenderer.getPatternInfo(style) : null;
    }

    /**
     * Set sprite scale
     * @param {number} scale - Scale factor for sprites
     */
    setSpriteScale(scale) {
        if (this.patternRenderer) {
            this.patternRenderer.setScale(scale);
            console.log(`🎨 Pattern scale set to: ${scale}x`);
            
            // Re-render if sprite mode is enabled
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    toggleShapeDisplay(enabled) {
        this.showShape = enabled;
        console.log(`🎨 Shape display ${enabled ? 'enabled' : 'disabled'}`);
        
        if (this.patternRenderer) {
            this.patternRenderer.toggleShapeDisplay(enabled);
        }
        
        // Re-render if sprite mode is enabled
        if (this.spriteMode) {
            this.renderBuildingsWithPatterns();
        }
    }

    toggleMapVisibility(hide) {
        this.hideMap = hide;
        console.log(`🗺️ Map visibility ${hide ? 'hidden' : 'shown'}`);
        
        if (this.map) {
            if (hide) {
                // Hide map tiles and set dark background
                this.map.getContainer().style.background = '#24192a';
                this.map.eachLayer((layer) => {
                    if (layer._url) { // This is a tile layer
                        layer.setOpacity(0);
                    }
                });
            } else {
                // Show map tiles and restore normal background
                this.map.getContainer().style.background = '';
                this.map.eachLayer((layer) => {
                    if (layer._url) { // This is a tile layer
                        layer.setOpacity(1);
                    }
                });
            }
        }
    }

    // CSS-like pattern control methods
    setPatternSize(size) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ size: size });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    setPatternSpacing(spacing) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ spacing: spacing });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    setPatternScale(scale) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ scale: scale });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    setPatternOpacity(opacity) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ opacity: opacity });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    setPatternColor(color, opacity) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ 
                color: color, 
                colorOpacity: opacity 
            });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    setPatternAlign(align) {
        if (this.patternRenderer) {
            this.patternRenderer.setPatternProperties({ align: align });
            if (this.spriteMode) {
                this.renderBuildingsWithPatterns();
            }
        }
    }

    toggleOriginalPolygonVisibility(hide) {
        this.hideOriginalPolygon = hide;
        console.log(`🏠 Original polygon visibility ${hide ? 'hidden' : 'shown'}`);
        
        // Hide/show building layers based on polygon visibility
        this.layers.forEach((layer, layerName) => {
            console.log(`🏠 Checking layer: ${layerName}`);
            
            // Check if this is a building layer (more flexible detection)
            const isBuildingLayer = layerName.toLowerCase().includes('building') || 
                                   layerName.toLowerCase().includes('house') ||
                                   layerName.toLowerCase().includes('structure') ||
                                   layerName.toLowerCase().includes('processed');
            
            if (isBuildingLayer) {
                if (hide) {
                    // Hide original building polygons when hiding is enabled
                    layer.setStyle({ 
                        opacity: 0, 
                        fillOpacity: 0,
                        weight: 0,
                        color: 'transparent'
                    });
                    console.log(`🏠 HIDING layer: ${layerName}`);
                } else {
                    // Show original building polygons when hiding is disabled
                    layer.setStyle({ 
                        opacity: 0.8, 
                        fillOpacity: 0.3,
                        weight: 1,
                        color: '#ff6b6b'
                    });
                    console.log(`🏠 SHOWING layer: ${layerName}`);
                }
            } else {
                console.log(`🏠 Skipping non-building layer: ${layerName}`);
            }
        });
        
        // Also try to hide/show all layers that might contain building data
        // This is a more aggressive approach to ensure all building polygons are hidden/shown
        this.layers.forEach((layer, layerName) => {
            // If it's a GeoJSON layer, try to hide/show it
            if (layer.eachLayer) {
                if (hide) {
                    console.log(`🏠 Force hiding GeoJSON layer: ${layerName}`);
                    layer.setStyle({ 
                        opacity: 0, 
                        fillOpacity: 0,
                        weight: 0,
                        color: 'transparent'
                    });
                } else {
                    console.log(`🏠 Force showing GeoJSON layer: ${layerName}`);
                    layer.setStyle({ 
                        opacity: 0.8, 
                        fillOpacity: 0.3,
                        weight: 1,
                        color: '#ff6b6b'
                    });
                }
            }
        });
        
        // Also try to hide/show all layers on the map directly
        this.map.eachLayer((mapLayer) => {
            if (mapLayer.setStyle && mapLayer !== this.gridLayer) {
                if (hide) {
                    console.log(`🏠 Force hiding map layer:`, mapLayer);
                    mapLayer.setStyle({ 
                        opacity: 0, 
                        fillOpacity: 0,
                        weight: 0,
                        color: 'transparent'
                    });
                } else {
                    console.log(`🏠 Force showing map layer:`, mapLayer);
                    mapLayer.setStyle({ 
                        opacity: 0.8, 
                        fillOpacity: 0.3,
                        weight: 1,
                        color: '#ff6b6b'
                    });
                }
            }
        });
    }

    /**
     * Update sprite canvas size to match map container
     */
    updateSpriteCanvasSize() {
        const mapContainer = document.getElementById('map');
        const spriteCanvas = document.getElementById('sprite-canvas');
        
        if (mapContainer && spriteCanvas && this.patternRenderer) {
            const rect = mapContainer.getBoundingClientRect();
            spriteCanvas.width = rect.width;
            spriteCanvas.height = rect.height;
            spriteCanvas.style.width = rect.width + 'px';
            spriteCanvas.style.height = rect.height + 'px';
            
            // Position canvas at 0,0 relative to map container (not absolute positioning)
            spriteCanvas.style.left = '0px';
            spriteCanvas.style.top = '0px';
            
            console.log(`🎨 Sprite canvas resized to: ${rect.width}x${rect.height}`);
            console.log(`🎨 Canvas position: [${rect.left}, ${rect.top}]`);
            console.log(`🎨 Canvas style:`, spriteCanvas.style.cssText);
            console.log(`🎨 Map container rect:`, rect);
            console.log(`🎨 Canvas rect:`, spriteCanvas.getBoundingClientRect());
        }
    }
}
