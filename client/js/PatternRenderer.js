import { SPRITE_ATLAS } from './SpriteAtlas.js';

/**
 * Clean Pattern Renderer - Only pattern filling, no borders
 * CSS-like pattern controls for flexible building styling
 */
export class PatternRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spriteSheet = null;
        this.spriteSize = 8;
        this.scale = 1;
        this.showShape = false;
        
        // CSS-like pattern properties
        this.patternProperties = {
            // Pattern type and source
            type: 'sprite', // 'sprite', 'solid', 'gradient'
            sprite: null,
            
            // Size and spacing
            size: 8,           // Pattern element size
            spacing: 0,        // Space between pattern elements
            scale: 1,          // Overall pattern scale
            
            // Positioning and alignment
            offsetX: 0,        // Horizontal offset
            offsetY: 0,        // Vertical offset
            align: 'center',   // 'top-left', 'center', 'stretch'
            
            // Repetition
            repeat: 'repeat',  // 'repeat', 'no-repeat', 'repeat-x', 'repeat-y'
            
            // Blending and opacity
            opacity: 1.0,      // Pattern opacity
            blendMode: 'normal', // Canvas blend modes
            
            // Color overlay (for tinting)
            color: null,       // CSS color string or null
            colorOpacity: 0    // Color overlay opacity (set to 0 to see sprites clearly)
        };
        
        // Fallback sprites in case SPRITE_ATLAS import fails
        this.fallbackSprites = [
            { x: 0, y: 0, width: 16, height: 16, name: 'solid' },
            { x: 16, y: 0, width: 16, height: 16, name: 'brick' },
            { x: 0, y: 16, width: 16, height: 16, name: 'stone' },
            { x: 16, y: 16, width: 16, height: 16, name: 'wood' },
            { x: 0, y: 0, width: 16, height: 16, name: 'textured' }
        ];

        // Available patterns
        this.patterns = {
            basic: {
                name: 'Basic House',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            },
            stone: {
                name: 'Stone House',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            },
            wooden: {
                name: 'Wooden House',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            },
            castle: {
                name: 'Castle',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            },
            cottage: {
                name: 'Cottage',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            },
            modern: {
                name: 'Modern House',
                sprites: this.fallbackSprites, // Use fallback sprites directly
                properties: {
                    size: 8,
                    spacing: 0,
                    repeat: 'repeat'
                }
            }
        };
        
        this.currentPattern = 'basic';
        
        // Debug: Log available patterns and sprites
        console.log('🎨 PatternRenderer initialized with patterns:', Object.keys(this.patterns));
        console.log('🎨 Basic pattern sprites:', this.patterns.basic.sprites);
        
        this.loadSpriteSheet();
    }

    /**
     * Get sprites with fallback handling
     */
    getSprites(spriteNames) {
        try {
            if (typeof SPRITE_ATLAS !== 'undefined' && SPRITE_ATLAS.BUILDING_TILES) {
                const sprites = spriteNames.map(name => SPRITE_ATLAS.BUILDING_TILES[name]).filter(sprite => sprite);
                console.log('🎨 Loaded sprites from SPRITE_ATLAS:', sprites);
                return sprites;
            }
        } catch (error) {
            console.warn('SPRITE_ATLAS not available, using fallback sprites:', error);
        }
        
        // Return fallback sprites
        const fallbackSprites = this.fallbackSprites.slice(0, spriteNames.length);
        console.log('🎨 Using fallback sprites:', fallbackSprites);
        return fallbackSprites;
    }

    /**
     * Load sprite sheet
     */
    async loadSpriteSheet() {
        return new Promise((resolve, reject) => {
            const spriteSheetPaths = [
                'minimal_8_base_v2_2-bit - blue.png',
                '../assets/minimal_8_base_v2_2-bit - blue.png',
                'assets/minimal_8_base_v2_2-bit - blue.png',
                './assets/minimal_8_base_v2_2-bit - blue.png',
                '/assets/minimal_8_base_v2_2-bit - blue.png',
                'http://localhost:3011/minimal_8_base_v2_2-bit - blue.png'
            ];
            
            console.log('🎨 Attempting to load sprite sheet...');
            this.tryLoadSpriteSheet(0, resolve, reject, spriteSheetPaths);
        });
    }

    tryLoadSpriteSheet(pathIndex, resolve, reject, paths) {
        if (pathIndex >= paths.length) {
            console.warn('❌ All sprite sheet paths failed, creating fallback sprite sheet');
            this.createFallbackSpriteSheet();
            resolve();
            return;
        }
        
        const currentPath = paths[pathIndex];
        console.log(`🔄 Trying sprite sheet path ${pathIndex + 1}/${paths.length}: ${currentPath}`);
        
        this.spriteSheet = new Image();
        this.spriteSheet.onload = () => {
            console.log('✅ Pattern sprite sheet loaded successfully:', currentPath);
            resolve();
        };
        this.spriteSheet.onerror = () => {
            console.warn(`❌ Failed to load sprite sheet from: ${currentPath}`);
            this.tryLoadSpriteSheet(pathIndex + 1, resolve, reject, paths);
        };
        this.spriteSheet.src = currentPath;
    }

    createFallbackSpriteSheet() {
        // Create a more visible fallback pattern
        const canvas = document.createElement('canvas');
        canvas.width = 32; // Make it bigger to hold multiple sprites
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Create multiple distinct patterns
        const patterns = [
            { color: '#4682B4', pattern: 'solid' },
            { color: '#5F9EA0', pattern: 'brick' },
            { color: '#2E8B57', pattern: 'stone' },
            { color: '#8B4513', pattern: 'wood' },
            { color: '#708090', pattern: 'textured' }
        ];
        
        patterns.forEach((pattern, index) => {
            const x = (index % 2) * 16;
            const y = Math.floor(index / 2) * 16;
            
            ctx.fillStyle = pattern.color;
            ctx.fillRect(x, y, 16, 16);
            
            // Add some pattern detail
            if (pattern.pattern === 'brick') {
                ctx.fillStyle = '#2F4F4F';
                ctx.fillRect(x + 2, y + 2, 12, 4);
                ctx.fillRect(x + 2, y + 10, 12, 4);
            } else if (pattern.pattern === 'stone') {
                ctx.fillStyle = '#696969';
                ctx.fillRect(x + 4, y + 4, 8, 8);
            } else if (pattern.pattern === 'wood') {
                ctx.fillStyle = '#A0522D';
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(x + 2, y + 2 + i * 3, 12, 2);
                }
            } else if (pattern.pattern === 'textured') {
                ctx.fillStyle = '#778899';
                ctx.fillRect(x + 2, y + 2, 4, 4);
                ctx.fillRect(x + 10, y + 2, 4, 4);
                ctx.fillRect(x + 6, y + 10, 4, 4);
            }
        });
        
        this.spriteSheet = canvas;
        console.log('🎨 Created fallback sprite sheet with patterns');
    }

    /**
     * Set pattern properties (CSS-like)
     */
    setPatternProperties(properties) {
        Object.assign(this.patternProperties, properties);
        console.log('🎨 Pattern properties updated:', this.patternProperties);
    }

    /**
     * Set current pattern
     */
    setPattern(patternName) {
        if (this.patterns[patternName]) {
            this.currentPattern = patternName;
            const pattern = this.patterns[patternName];
            
            // Apply pattern-specific properties
            this.setPatternProperties(pattern.properties);
            
            console.log(`🎨 Pattern set to: ${pattern.name}`);
        } else {
            console.warn(`Unknown pattern: ${patternName}`);
        }
    }

    /**
     * Set scale
     */
    setScale(scale) {
        this.scale = scale;
        this.patternProperties.scale = scale;
    }

    /**
     * Toggle shape display
     */
    toggleShapeDisplay(enabled) {
        this.showShape = enabled;
    }

    /**
     * Check if sprite sheet is ready
     */
    isReady() {
        return this.spriteSheet !== null;
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw a single sprite
     */
    drawSprite(sprite, x, y, debugCount = 0) {
        if (!this.spriteSheet || !sprite) {
            console.warn('Cannot draw sprite: spriteSheet or sprite is null', { spriteSheet: !!this.spriteSheet, sprite });
            return;
        }
        
        if (typeof sprite.x === 'undefined' || typeof sprite.y === 'undefined') {
            console.warn('Invalid sprite object:', sprite);
            return;
        }
        
        const scaledSize = this.spriteSize * this.scale;
        
        // Calculate position offset based on alignment
        let offsetX = 0;
        let offsetY = 0;
        
        if (this.patternProperties.align === 'center') {
            // Center the sprite by offsetting the position
            // This ensures sprites grow from their center instead of top-left corner
            offsetX = (scaledSize - this.spriteSize) / 2;
            offsetY = (scaledSize - this.spriteSize) / 2;
        }
        // For 'top-left' alignment, offsets remain 0
        
        // Apply additional pattern offsets
        offsetX += this.patternProperties.offsetX;
        offsetY += this.patternProperties.offsetY;
        
        try {
            this.ctx.drawImage(
                this.spriteSheet,
                sprite.x, sprite.y, sprite.width, sprite.height,
                x - offsetX, y - offsetY, scaledSize, scaledSize
            );
            
        } catch (error) {
            console.warn('Error drawing sprite:', error, { sprite, x, y });
        }
    }

    /**
     * Draw polygon outline for debugging
     */
    drawPolygonOutline(coordinates) {
        if (coordinates.length < 3) return;
        
        const originalStrokeStyle = this.ctx.strokeStyle;
        const originalLineWidth = this.ctx.lineWidth;
        
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(coordinates[0][0], coordinates[0][1]);
        
        for (let i = 1; i < coordinates.length; i++) {
            this.ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Restore
        this.ctx.strokeStyle = originalStrokeStyle;
        this.ctx.lineWidth = originalLineWidth;
        this.ctx.setLineDash([]);
    }

    /**
     * Check if point is inside polygon (ray casting)
     */
    isPointInPolygon(point, polygon) {
        const [x, y] = point;
        let inside = false;
        
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        
        return inside;
    }

    /**
     * Fill polygon with pattern - CLEAN IMPLEMENTATION
     */
    fillPolygonWithPattern(coordinates) {
        if (coordinates.length < 3) return;
        
        const pattern = this.patterns[this.currentPattern];
        if (!pattern || !pattern.sprites || !pattern.sprites.length) {
            console.warn('No pattern or sprites available:', { pattern, currentPattern: this.currentPattern });
            return;
        }
        
        // Debug sprite sheet status
        console.log('🎨 Sprite sheet status:', {
            exists: !!this.spriteSheet,
            tagName: this.spriteSheet?.tagName,
            src: this.spriteSheet?.src,
            width: this.spriteSheet?.width,
            height: this.spriteSheet?.height
        });
        
        // If sprite sheet is not loaded, use simple colored rectangles as fallback
        if (!this.spriteSheet) {
            console.warn('❌ Sprite sheet not loaded, using colored rectangles');
            this.fillPolygonWithColoredRectangles(coordinates);
            return;
        }
        
        // Check if sprite sheet is actually an image or fallback canvas
        if (this.spriteSheet.tagName !== 'IMG' && this.spriteSheet.tagName !== 'CANVAS') {
            console.warn('❌ Invalid sprite sheet, using colored rectangles');
            this.fillPolygonWithColoredRectangles(coordinates);
            return;
        }
        
        // Sprite sheet is loaded, proceed with normal sprite rendering
        console.log('🎨 Using actual sprite images from PNG');
        
        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        coordinates.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        
        const patternSize = this.patternProperties.size * this.patternProperties.scale;
        const spacing = this.patternProperties.spacing * this.patternProperties.scale;
        const stepSize = patternSize + spacing;
        
        // Adjust step size to account for centered sprites
        // When sprites are centered, we need to ensure proper spacing
        const effectiveStepSize = Math.max(stepSize, this.spriteSize * this.scale);
        
        let spriteCount = 0;
        
        // Fill polygon with pattern
        for (let x = minX; x <= maxX; x += effectiveStepSize) {
            for (let y = minY; y <= maxY; y += effectiveStepSize) {
                // Check if this point is inside the polygon
                if (this.isPointInPolygon([x, y], coordinates)) {
                    // Select sprite based on position for variety
                    const spriteIndex = Math.floor((x - minX) / effectiveStepSize + (y - minY) / effectiveStepSize) % pattern.sprites.length;
                    const selectedSprite = pattern.sprites[spriteIndex];
                    
                    if (!selectedSprite) {
                        console.warn('Selected sprite is undefined:', { spriteIndex, sprites: pattern.sprites });
                        continue;
                    }
                    
        // Debug sprite selection
        if (spriteCount < 5) { // Only log first 5 sprites to avoid spam
            console.log('🎨 Drawing sprite:', {
                spriteIndex,
                selectedSprite,
                x, y,
                spriteSheet: !!this.spriteSheet,
                spriteSheetSize: this.spriteSheet ? `${this.spriteSheet.width}x${this.spriteSheet.height}` : 'null',
                colorOverlay: this.patternProperties.color,
                colorOpacity: this.patternProperties.colorOpacity
            });
        }
                    
                    // Apply pattern properties
                    this.ctx.save();
                    
                    // Set opacity
                    this.ctx.globalAlpha = this.patternProperties.opacity;
                    
                    // Set blend mode
                    this.ctx.globalCompositeOperation = this.patternProperties.blendMode;
                    
                    // Draw sprite
                    this.drawSprite(selectedSprite, x, y, spriteCount);
                    
                    // Apply color overlay only if specified and opacity > 0
                    if (this.patternProperties.color && this.patternProperties.colorOpacity > 0) {
                        // Use multiply blend mode to tint the sprite instead of covering it
                        this.ctx.globalCompositeOperation = 'multiply';
                        this.ctx.globalAlpha = this.patternProperties.colorOpacity;
                        this.ctx.fillStyle = this.patternProperties.color;
                        this.ctx.fillRect(x, y, patternSize, patternSize);
                        // Reset blend mode
                        this.ctx.globalCompositeOperation = 'source-over';
                    }
                    
                    this.ctx.restore();
                    spriteCount++;
                }
            }
        }
        
        console.log(`🎨 Filled polygon with ${spriteCount} pattern sprites`);
    }

    /**
     * Fill polygon with colored rectangles as fallback when sprite sheet is not available
     */
    fillPolygonWithColoredRectangles(coordinates) {
        if (coordinates.length < 3) return;
        
        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        coordinates.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        
        const patternSize = this.patternProperties.size * this.patternProperties.scale;
        const spacing = this.patternProperties.spacing * this.patternProperties.scale;
        const stepSize = patternSize + spacing;
        
        // Colors for different patterns
        const colors = ['#4682B4', '#5F9EA0', '#2E8B57', '#8B4513', '#708090'];
        
        let rectCount = 0;
        
        // Fill polygon with colored rectangles
        for (let x = minX; x <= maxX; x += stepSize) {
            for (let y = minY; y <= maxY; y += stepSize) {
                // Check if this point is inside the polygon
                if (this.isPointInPolygon([x, y], coordinates)) {
                    // Select color based on position for variety
                    const colorIndex = Math.floor((x - minX) / stepSize + (y - minY) / stepSize) % colors.length;
                    const color = colors[colorIndex];
                    
                    // Apply pattern properties
                    this.ctx.save();
                    
                    // Set opacity
                    this.ctx.globalAlpha = this.patternProperties.opacity;
                    
                    // Draw colored rectangle
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, patternSize, patternSize);
                    
                    // Apply color overlay only if specified and opacity > 0
                    if (this.patternProperties.color && this.patternProperties.colorOpacity > 0) {
                        // Use multiply blend mode to tint the rectangle instead of covering it
                        this.ctx.globalCompositeOperation = 'multiply';
                        this.ctx.globalAlpha = this.patternProperties.colorOpacity;
                        this.ctx.fillStyle = this.patternProperties.color;
                        this.ctx.fillRect(x, y, patternSize, patternSize);
                        // Reset blend mode
                        this.ctx.globalCompositeOperation = 'source-over';
                    }
                    
                    this.ctx.restore();
                    rectCount++;
                }
            }
        }
        
        console.log(`🎨 Filled polygon with ${rectCount} colored rectangles`);
    }

    /**
     * Render building with pattern
     */
    renderBuilding(coordinates, options = {}) {
        const { showShape = false } = options;
        
        // Debug canvas and coordinates
        console.log('🎨 Canvas info:', {
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            canvasStyle: this.canvas.style.cssText,
            coordinates: coordinates.slice(0, 3), // First 3 coordinates
            mapBounds: this.getMapBounds()
        });
        
        // Fill with pattern
        this.fillPolygonWithPattern(coordinates);
        
        // Draw outline if requested
        if (showShape) {
            this.drawPolygonOutline(coordinates);
        }
    }
    
    /**
     * Get map bounds for debugging
     */
    getMapBounds() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const rect = mapContainer.getBoundingClientRect();
            return {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            };
        }
        return null;
    }

    /**
     * Get available patterns
     */
    getAvailablePatterns() {
        return Object.keys(this.patterns);
    }

    /**
     * Get pattern info
     */
    getPatternInfo(patternName) {
        return this.patterns[patternName] || null;
    }

    /**
     * Get current pattern properties
     */
    getCurrentPatternProperties() {
        return { ...this.patternProperties };
    }

    /**
     * Get available patterns
     */
    getAvailablePatterns() {
        return Object.keys(this.patterns);
    }

    /**
     * Get pattern information
     */
    getPatternInfo(patternName) {
        return this.patterns[patternName] || null;
    }
}
