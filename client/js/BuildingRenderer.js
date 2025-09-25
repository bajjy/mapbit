/**
 * BuildingRenderer - Handles complete building construction with sprites
 * Creates pixelated buildings with borders, patterns, and roofs
 */
import { SpriteRenderer } from './SpriteRenderer.js';
import { SPRITE_ATLAS, getBuildingPattern } from './SpriteAtlas.js';

export class BuildingRenderer {
    constructor(canvas) {
        this.spriteRenderer = new SpriteRenderer(canvas);
        this.currentStyle = 'basic';
        this.buildingPatterns = {};
        this.initialized = false;
        
        // Initialize building patterns
        this.initializePatterns();
    }

    /**
     * Initialize building patterns from sprite atlas
     */
    initializePatterns() {
        this.buildingPatterns = {
            basic: {
                name: 'Basic House',
                walls: [SPRITE_ATLAS.BUILDING_TILES.SOLID, SPRITE_ATLAS.BUILDING_TILES.BRICK_01],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_01,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THIN,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THIN,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THIN,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THIN,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THIN,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THIN
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.SOLID,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.BRICK_01,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.TEXTURED_01,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_01
                }
            },
            stone: {
                name: 'Stone House',
                walls: [SPRITE_ATLAS.BUILDING_TILES.STONE_01, SPRITE_ATLAS.BUILDING_TILES.STONE_02],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_02,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_01
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THICK,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THICK,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THICK,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THICK,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THICK,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THICK
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.STONE_01,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.STONE_02,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.SOLID,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_02,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_02
                }
            },
            wooden: {
                name: 'Wooden House',
                walls: [SPRITE_ATLAS.BUILDING_TILES.WOOD_01, SPRITE_ATLAS.BUILDING_TILES.WOOD_02],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_01,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_02
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THIN,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THIN,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THIN,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THIN,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THIN,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THIN
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.WOOD_01,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.WOOD_02,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.BRICK_01,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_01,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_02
                }
            },
            castle: {
                name: 'Castle',
                walls: [SPRITE_ATLAS.BUILDING_TILES.STONE_01, SPRITE_ATLAS.BUILDING_TILES.STONE_02],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_02,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THICK,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THICK,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THICK,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THICK,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THICK,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THICK
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.STONE_01,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.STONE_02,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.SOLID,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_02
                }
            },
            cottage: {
                name: 'Cottage',
                walls: [SPRITE_ATLAS.BUILDING_TILES.WOOD_01, SPRITE_ATLAS.BUILDING_TILES.BRICK_01],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_01,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_01
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THIN,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THIN,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THIN,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THIN,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THIN,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THIN
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.WOOD_01,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.BRICK_01,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.TEXTURED_01,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_01,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.SHINGLE_02
                }
            },
            modern: {
                name: 'Modern House',
                walls: [SPRITE_ATLAS.BUILDING_TILES.SOLID, SPRITE_ATLAS.BUILDING_TILES.TEXTURED_01],
                corners: {
                    tl: SPRITE_ATLAS.BUILDING_TILES.CORNER_TL,
                    tr: SPRITE_ATLAS.BUILDING_TILES.CORNER_TR,
                    bl: SPRITE_ATLAS.BUILDING_TILES.CORNER_BL,
                    br: SPRITE_ATLAS.BUILDING_TILES.CORNER_BR
                },
                edges: {
                    h: SPRITE_ATLAS.BUILDING_TILES.EDGE_H,
                    v: SPRITE_ATLAS.BUILDING_TILES.EDGE_V
                },
                roof: {
                    peak: SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_01,
                    slopeL: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_L,
                    slopeR: SPRITE_ATLAS.ROOF_ELEMENTS.SLOPE_R,
                    tile: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01
                },
                border: {
                    cornerTL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THIN,
                    cornerTR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TR_THIN,
                    cornerBL: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BL_THIN,
                    cornerBR: SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_BR_THIN,
                    edgeH: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_H_THIN,
                    edgeV: SPRITE_ATLAS.BORDER_ELEMENTS.EDGE_V_THIN
                },
                fill: {
                    wall: SPRITE_ATLAS.BUILDING_TILES.SOLID,
                    wall2: SPRITE_ATLAS.BUILDING_TILES.TEXTURED_01,
                    wall3: SPRITE_ATLAS.BUILDING_TILES.BRICK_02,
                    roof: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_01,
                    roof2: SPRITE_ATLAS.ROOF_ELEMENTS.TILE_02
                }
            }
        };
    }

    /**
     * Set the building style
     * @param {string} style - Building style ('basic', 'stone', 'wooden', 'modern')
     */
    setStyle(style) {
        if (this.buildingPatterns[style]) {
            this.currentStyle = style;
            console.log(`Building style set to: ${this.buildingPatterns[style].name}`);
        } else {
            console.warn(`Unknown building style: ${style}. Using basic style.`);
            this.currentStyle = 'basic';
        }
    }

    /**
     * Get current building pattern
     * @returns {Object} Current building pattern
     */
    getCurrentPattern() {
        return this.buildingPatterns[this.currentStyle];
    }

    /**
     * Render a complete building with sprites
     * @param {Object} buildingData - Building data with coordinates and properties
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     * @param {Object} options - Rendering options
     */
    renderBuilding(buildingData, coordinates, options = {}) {
        const {
            showBorder = true,
            showRoof = true,
            roofType = 'peak',
            borderThickness = 1,
            scale = 1,
            showShape = false
        } = options;

        // Set scale
        this.spriteRenderer.setScale(scale);

        // Get building pattern
        const pattern = this.getCurrentPattern();

        // Calculate building bounds for interior filling
        const bounds = this.calculateBounds(coordinates);
        const { minX, minY, maxX, maxY } = bounds;
        const width = maxX - minX;
        const height = maxY - minY;

        // 1. Fill building with pattern (new approach)
        this.fillBuildingWithPattern(coordinates);

        // 2. Draw polygon outline if requested
        if (showShape) {
            this.drawPolygonOutline(coordinates);
        }

        // 3. Add roof if requested (optional)
        if (showRoof) {
            this.drawBuildingRoof(pattern, minX, minY, width, height, roofType);
        }
    }

    /**
     * Calculate bounding box for building coordinates
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     * @returns {Object} Bounding box with minX, minY, maxX, maxY
     */
    calculateBounds(coordinates) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        coordinates.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });

        return { minX, minY, maxX, maxY };
    }

    /**
     * Fill building interior with wall pattern
     * @param {Object} pattern - Building pattern
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     */
    // DISABLED: Old wall filling method to avoid interference
    /*
    fillBuildingInterior(pattern, x, y, width, height) {
        // Fill interior with wall sprites
        this.spriteRenderer.drawPattern(pattern.walls, x, y, width, height, true);
    }
    */

    /**
     * Draw building structure (corners and edges)
     * @param {Object} pattern - Building pattern
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     */
    // DISABLED: Old building structure method to avoid interference
    /*
    drawBuildingStructure(pattern, x, y, width, height) {
        const spriteSize = this.spriteRenderer.spriteSize * this.spriteRenderer.scale;

        // Draw corners
        this.spriteRenderer.drawSprite(pattern.corners.tl, x, y);
        this.spriteRenderer.drawSprite(pattern.corners.tr, x + width - spriteSize, y);
        this.spriteRenderer.drawSprite(pattern.corners.bl, x, y + height - spriteSize);
        this.spriteRenderer.drawSprite(pattern.corners.br, x + width - spriteSize, y + height - spriteSize);

        // Draw edges
        for (let i = spriteSize; i < width - spriteSize; i += spriteSize) {
            this.spriteRenderer.drawSprite(pattern.edges.h, x + i, y);
            this.spriteRenderer.drawSprite(pattern.edges.h, x + i, y + height - spriteSize);
        }

        for (let i = spriteSize; i < height - spriteSize; i += spriteSize) {
            this.spriteRenderer.drawSprite(pattern.edges.v, x, y + i);
            this.spriteRenderer.drawSprite(pattern.edges.v, x + width - spriteSize, y + i);
        }
    }
    */

    /**
     * Draw building roof
     * @param {Object} pattern - Building pattern
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} roofType - Type of roof
     */
    drawBuildingRoof(pattern, x, y, width, height, roofType) {
        const roofHeight = this.spriteRenderer.spriteSize * this.spriteRenderer.scale;
        this.spriteRenderer.drawRoof(pattern.roof, x, y, width, roofHeight, roofType);
    }

    /**
     * Draw building border
     * @param {Object} pattern - Building pattern
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} borderThickness - Border thickness
     */
    drawBuildingBorder(pattern, x, y, width, height, borderThickness) {
        this.spriteRenderer.drawBorder(pattern.border, x, y, width, height, borderThickness);
    }

    /**
     * Draw polygon outline for shape visualization
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     */
    drawPolygonOutline(coordinates) {
        if (coordinates.length < 3) return;
        
        const ctx = this.spriteRenderer.ctx;
        const originalStrokeStyle = ctx.strokeStyle;
        const originalLineWidth = ctx.lineWidth;
        
        // Set outline style
        ctx.strokeStyle = '#ff0000'; // Bright red outline
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed line
        
        // Draw the polygon outline
        ctx.beginPath();
        ctx.moveTo(coordinates[0][0], coordinates[0][1]);
        
        for (let i = 1; i < coordinates.length; i++) {
            ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        
        // Close the polygon
        ctx.closePath();
        ctx.stroke();
        
        // Restore original settings
        ctx.strokeStyle = originalStrokeStyle;
        ctx.lineWidth = originalLineWidth;
        ctx.setLineDash([]);
    }

    /**
     * Fill building with pattern - separate method to avoid interference
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     */
    fillBuildingWithPattern(coordinates) {
        if (coordinates.length < 3) return;

        const spriteSize = this.spriteRenderer.spriteSize * this.spriteRenderer.scale;
        
        console.log(`🎨 Filling building with pattern - ${coordinates.length} vertices`);
        
        // Fill the polygon with a simple pattern
        this.fillPolygonWithSimplePattern(coordinates, spriteSize);
    }

    /**
     * Fill polygon with a simple pattern of sprites
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     * @param {number} spriteSize - Size of sprites
     */
    fillPolygonWithSimplePattern(coordinates, spriteSize) {
        console.log(`🎨 Filling polygon with simple pattern - ${coordinates.length} vertices`);
        console.log(`🎨 Coordinates:`, coordinates);
        
        // Calculate bounding box of the polygon
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        coordinates.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        
        console.log(`🎨 Bounding box: [${minX.toFixed(1)}, ${minY.toFixed(1)}] to [${maxX.toFixed(1)}, ${maxY.toFixed(1)}]`);
        
        // Create a grid of sprites within the bounding box
        const stepX = spriteSize;
        const stepY = spriteSize;
        
        let spriteCount = 0;
        let insideCount = 0;
        let outsideCount = 0;
        
        // Fill the polygon with the selected pattern
        this.fillPolygonWithPattern(coordinates, spriteSize);
        
        console.log(`🎨 Filled polygon with ${spriteCount} sprites`);
        console.log(`🎨 Inside points: ${insideCount}, Outside points: ${outsideCount}`);
    }

    /**
     * Fill polygon with selected pattern from sprites
     * @param {Array} coordinates - Array of [x, y] coordinate pairs
     * @param {number} spriteSize - Size of sprites
     */
    fillPolygonWithPattern(coordinates, spriteSize) {
        console.log(`🎨 Filling polygon with pattern`);
        
        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        coordinates.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        
        // Get the current building pattern
        const pattern = this.getCurrentPattern();
        
        // Fill the polygon with sprites from the pattern
        for (let x = minX; x <= maxX; x += spriteSize) {
            for (let y = minY; y <= maxY; y += spriteSize) {
                // Check if this point is inside the polygon
                if (this.isPointInPolygonSimple([x, y], coordinates)) {
                    // Select a sprite from the pattern based on position for variety
                    const patternSprites = [
                        pattern.fill?.wall,
                        pattern.fill?.wall2,
                        pattern.fill?.wall3,
                        pattern.fill?.roof,
                        pattern.fill?.roof2
                    ].filter(sprite => sprite); // Remove undefined sprites
                    
                    if (patternSprites.length > 0) {
                        // Use position-based selection for consistent pattern
                        const spriteIndex = Math.floor((x - minX) / spriteSize + (y - minY) / spriteSize) % patternSprites.length;
                        const selectedSprite = patternSprites[spriteIndex];
                        
                        this.spriteRenderer.drawSprite(selectedSprite, x, y);
                    } else {
                        // Fallback to basic wall sprite if no pattern sprites available
                        const wallSprite = {
                            x: 0,
                            y: 0,
                            width: 8,
                            height: 8
                        };
                        this.spriteRenderer.drawSprite(wallSprite, x, y);
                    }
                }
            }
        }
        
        console.log(`🎨 Filled polygon with pattern sprites`);
    }


    /**
     * Simple point-in-polygon check using ray casting
     * @param {Array} point - [x, y] coordinates
     * @param {Array} polygon - Array of [x, y] coordinate pairs
     * @returns {boolean} True if point is inside polygon
     */
    isPointInPolygonSimple(point, polygon) {
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
     * Draw sprites along an edge following the actual line
     * @param {Object} pattern - Building pattern
     * @param {Array} start - Start coordinate [x, y]
     * @param {Array} end - End coordinate [x, y]
     * @param {number} spriteSize - Size of sprites
     */
    drawEdgeSprites(pattern, start, end, spriteSize) {
        const [startX, startY] = start;
        const [endX, endY] = end;
        
        // Calculate edge properties
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Determine edge type and sprite to use
        let edgeSprite = pattern.edges.h; // Default to horizontal
        
        // Check if edge is primarily horizontal or vertical
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal edge
            edgeSprite = pattern.edges.h;
        } else if (Math.abs(dy) > Math.abs(dx)) {
            // Vertical edge
            edgeSprite = pattern.edges.v;
        } else {
            // Diagonal edge - use horizontal sprite as fallback
            edgeSprite = pattern.edges.h;
        }
        
        // Calculate step size for continuous sprite placement
        const stepSize = spriteSize * 0.8; // Overlap sprites slightly for continuous border
        const numSteps = Math.max(1, Math.ceil(length / stepSize));
        
        console.log(`  Edge: length=${length.toFixed(1)}, steps=${numSteps}, type=${Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'}`);
        
        // Place sprites along the edge with proper spacing
        for (let i = 0; i < numSteps; i++) {
            const t = numSteps > 1 ? i / (numSteps - 1) : 0;
            const x = startX + (dx * t);
            const y = startY + (dy * t);
            
            console.log(`    Sprite ${i}: [${x.toFixed(1)}, ${y.toFixed(1)}]`);
            
            this.spriteRenderer.drawSprite(edgeSprite, x, y);
        }
    }

    /**
     * Draw corner sprite at a vertex
     * @param {Object} pattern - Building pattern
     * @param {Array} prev - Previous vertex [x, y]
     * @param {Array} curr - Current vertex [x, y]
     * @param {Array} next - Next vertex [x, y]
     * @param {number} spriteSize - Size of sprites
     */
    drawCornerSprite(pattern, prev, curr, next, spriteSize) {
        const [currX, currY] = curr;
        
        // Calculate angles to determine corner type
        const angle1 = Math.atan2(curr[1] - prev[1], curr[0] - prev[0]);
        const angle2 = Math.atan2(next[1] - curr[1], next[0] - curr[0]);
        const angleDiff = angle2 - angle1;
        
        // Normalize angle difference
        let normalizedAngle = angleDiff;
        while (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
        while (normalizedAngle >= 2 * Math.PI) normalizedAngle -= 2 * Math.PI;
        
        // Determine corner sprite based on angle
        let cornerSprite = pattern.corners.tl; // Default
        
        // Convert to degrees for easier understanding
        const angleDegrees = (normalizedAngle * 180) / Math.PI;
        
        if (angleDegrees < 45 || angleDegrees > 315) {
            // Sharp corner (0° or 360°)
            cornerSprite = pattern.corners.tl;
        } else if (angleDegrees < 135) {
            // Right turn (90°)
            cornerSprite = pattern.corners.tr;
        } else if (angleDegrees < 225) {
            // U-turn (180°)
            cornerSprite = pattern.corners.br;
        } else if (angleDegrees < 315) {
            // Left turn (270°)
            cornerSprite = pattern.corners.bl;
        }
        
        // Use exact position for better corner placement
        console.log(`  Corner at [${currX.toFixed(1)}, ${currY.toFixed(1)}] - angle: ${angleDegrees.toFixed(1)}°`);
        
        this.spriteRenderer.drawSprite(cornerSprite, currX, currY);
    }


    /**
     * Render multiple buildings
     * @param {Array} buildings - Array of building data
     * @param {Object} options - Rendering options
     */
    renderBuildings(buildings, options = {}) {
        buildings.forEach((building, index) => {
            // Randomize style for variety
            const styles = Object.keys(this.buildingPatterns);
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            this.setStyle(randomStyle);

            // Render building
            this.renderBuilding(building, building.coordinates, options);
        });
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.spriteRenderer.clear();
    }

    /**
     * Set canvas size
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    setCanvasSize(width, height) {
        this.spriteRenderer.setCanvasSize(width, height);
    }

    /**
     * Get available building styles
     * @returns {Array} Array of available style names
     */
    getAvailableStyles() {
        return Object.keys(this.buildingPatterns);
    }

    /**
     * Get building style info
     * @param {string} style - Style name
     * @returns {Object} Style information
     */
    getStyleInfo(style) {
        return this.buildingPatterns[style] || null;
    }
}
