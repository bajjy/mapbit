/**
 * SpriteRenderer - Handles rendering of pixel art sprites for building construction
 * Integrates with the sprite atlas system to create borders and patterns
 */
export class SpriteRenderer {
    constructor(canvas, spriteSheetPath = '../assets/minimal_8_base_v2_2-bit - blue.png') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spriteSheet = null;
        this.spriteSheetPath = spriteSheetPath;
        this.spriteSize = 8; // Base sprite size
        this.scale = 1; // Scale factor for sprites
        
        // Try multiple sprite sheet paths
        this.spriteSheetPaths = [
            'minimal_8_base_v2_2-bit - blue.png',  // Vite publicDir serves from ../assets
            '../assets/minimal_8_base_v2_2-bit - blue.png',
            'assets/minimal_8_base_v2_2-bit - blue.png',
            './assets/minimal_8_base_v2_2-bit - blue.png',
            '/assets/minimal_8_base_v2_2-bit - blue.png',
            'http://localhost:3011/minimal_8_base_v2_2-bit - blue.png'  // Direct server path
        ];
        
        // Load sprite sheet
        this.loadSpriteSheet();
    }

    /**
     * Load the sprite sheet image
     */
    async loadSpriteSheet() {
        return new Promise((resolve, reject) => {
            this.tryLoadSpriteSheet(0, resolve, reject);
        });
    }

    /**
     * Try to load sprite sheet from different paths
     */
    tryLoadSpriteSheet(pathIndex, resolve, reject) {
        if (pathIndex >= this.spriteSheetPaths.length) {
            console.error('❌ Failed to load sprite sheet from any path');
            console.warn('Creating fallback sprite sheet');
            this.createFallbackSpriteSheet();
            resolve(); // Don't reject, just continue with fallback
            return;
        }

        const currentPath = this.spriteSheetPaths[pathIndex];
        console.log(`🔄 Trying to load sprite sheet from: ${currentPath}`);

        this.spriteSheet = new Image();
        this.spriteSheet.onload = () => {
            console.log('✅ Sprite sheet loaded successfully:', currentPath);
            this.spriteSheetPath = currentPath;
            resolve();
        };
        this.spriteSheet.onerror = () => {
            console.warn(`❌ Failed to load sprite sheet from: ${currentPath}`);
            this.tryLoadSpriteSheet(pathIndex + 1, resolve, reject);
        };
        this.spriteSheet.src = currentPath;
    }

    /**
     * Create a fallback sprite sheet using canvas
     */
    createFallbackSpriteSheet() {
        console.log('🎨 Creating fallback sprite sheet');
        
        // Create a canvas for the fallback sprite sheet
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 96;
        fallbackCanvas.height = 88;
        const ctx = fallbackCanvas.getContext('2d');
        
        // Fill with a simple pattern
        ctx.fillStyle = '#008080'; // Teal color
        ctx.fillRect(0, 0, 96, 88);
        
        // Add some simple patterns
        ctx.fillStyle = '#40E0D0'; // Light teal
        for (let x = 0; x < 96; x += 8) {
            for (let y = 0; y < 88; y += 8) {
                if ((x + y) % 16 === 0) {
                    ctx.fillRect(x, y, 8, 8);
                }
            }
        }
        
        // Convert canvas to image
        this.spriteSheet = new Image();
        this.spriteSheet.src = fallbackCanvas.toDataURL();
        this.spriteSheet.onload = () => {
            console.log('✅ Fallback sprite sheet created');
        };
    }

    /**
     * Set the scale factor for sprites
     * @param {number} scale - Scale factor (1 = original size, 2 = double size, etc.)
     */
    setScale(scale) {
        this.scale = scale;
    }

    /**
     * Draw a single sprite at specified coordinates
     * @param {Object} sprite - Sprite object with x, y, width, height properties
     * @param {number} canvasX - X position on canvas
     * @param {number} canvasY - Y position on canvas
     * @param {number} scale - Optional scale override
     */
    drawSprite(sprite, canvasX, canvasY, scale = this.scale) {
        if (!this.spriteSheet || !this.spriteSheet.complete) {
            console.warn('Sprite sheet not loaded yet');
            return;
        }

        const scaledWidth = sprite.width * scale;
        const scaledHeight = sprite.height * scale;

        this.ctx.drawImage(
            this.spriteSheet,
            sprite.x, sprite.y, sprite.width, sprite.height,
            canvasX, canvasY, scaledWidth, scaledHeight
        );
    }

    /**
     * Draw a pattern of sprites to fill an area
     * @param {Array} sprites - Array of sprite objects to choose from
     * @param {number} startX - Starting X position
     * @param {number} startY - Starting Y position
     * @param {number} width - Width of area to fill
     * @param {number} height - Height of area to fill
     * @param {boolean} randomize - Whether to randomize sprite selection
     */
    drawPattern(sprites, startX, startY, width, height, randomize = true) {
        const spriteWidth = this.spriteSize * this.scale;
        const spriteHeight = this.spriteSize * this.scale;
        
        const cols = Math.ceil(width / spriteWidth);
        const rows = Math.ceil(height / spriteHeight);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + (col * spriteWidth);
                const y = startY + (row * spriteHeight);
                
                // Choose sprite (randomize or cycle through)
                const spriteIndex = randomize ? 
                    Math.floor(Math.random() * sprites.length) : 
                    (row + col) % sprites.length;
                
                const sprite = sprites[spriteIndex];
                this.drawSprite(sprite, x, y);
            }
        }
    }

    /**
     * Draw a border around a rectangular area using border sprites
     * @param {Object} borderSprites - Object containing border sprite definitions
     * @param {number} x - X position of the area
     * @param {number} y - Y position of the area
     * @param {number} width - Width of the area
     * @param {number} height - Height of the area
     * @param {number} borderThickness - Thickness of the border
     */
    drawBorder(borderSprites, x, y, width, height, borderThickness = 1) {
        const spriteSize = this.spriteSize * this.scale;
        const borderSize = borderThickness * spriteSize;

        // Top border
        if (borderSprites.edgeH) {
            for (let i = 0; i < width; i += spriteSize) {
                this.drawSprite(borderSprites.edgeH, x + i, y - borderSize);
            }
        }

        // Bottom border
        if (borderSprites.edgeH) {
            for (let i = 0; i < width; i += spriteSize) {
                this.drawSprite(borderSprites.edgeH, x + i, y + height);
            }
        }

        // Left border
        if (borderSprites.edgeV) {
            for (let i = 0; i < height; i += spriteSize) {
                this.drawSprite(borderSprites.edgeV, x - borderSize, y + i);
            }
        }

        // Right border
        if (borderSprites.edgeV) {
            for (let i = 0; i < height; i += spriteSize) {
                this.drawSprite(borderSprites.edgeV, x + width, y + i);
            }
        }

        // Corners
        if (borderSprites.cornerTL) {
            this.drawSprite(borderSprites.cornerTL, x - borderSize, y - borderSize);
        }
        if (borderSprites.cornerTR) {
            this.drawSprite(borderSprites.cornerTR, x + width, y - borderSize);
        }
        if (borderSprites.cornerBL) {
            this.drawSprite(borderSprites.cornerBL, x - borderSize, y + height);
        }
        if (borderSprites.cornerBR) {
            this.drawSprite(borderSprites.cornerBR, x + width, y + height);
        }
    }

    /**
     * Draw a roof pattern on top of a building
     * @param {Array} roofSprites - Array of roof sprite objects
     * @param {number} x - X position of the building
     * @param {number} y - Y position of the building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the roof
     * @param {string} roofType - Type of roof ('peak', 'slope', 'flat')
     */
    drawRoof(roofSprites, x, y, width, height, roofType = 'peak') {
        const spriteSize = this.spriteSize * this.scale;
        const centerX = x + (width / 2) - (spriteSize / 2);

        switch (roofType) {
            case 'peak':
                // Draw peak at center
                if (roofSprites.peak) {
                    this.drawSprite(roofSprites.peak, centerX, y - height);
                }
                // Draw slopes on sides
                if (roofSprites.slopeL && roofSprites.slopeR) {
                    const slopeWidth = (width - spriteSize) / 2;
                    for (let i = 0; i < slopeWidth; i += spriteSize) {
                        this.drawSprite(roofSprites.slopeL, x + i, y - height);
                        this.drawSprite(roofSprites.slopeR, x + width - spriteSize - i, y - height);
                    }
                }
                break;

            case 'slope':
                // Draw sloped roof
                if (roofSprites.slopeL) {
                    for (let i = 0; i < width; i += spriteSize) {
                        this.drawSprite(roofSprites.slopeL, x + i, y - height);
                    }
                }
                break;

            case 'flat':
                // Draw flat roof with tiles
                if (roofSprites.tile) {
                    for (let i = 0; i < width; i += spriteSize) {
                        this.drawSprite(roofSprites.tile, x + i, y - height);
                    }
                }
                break;
        }
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Set canvas size
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Check if sprite sheet is loaded and ready
     * @returns {boolean} True if sprite sheet is ready
     */
    isReady() {
        return this.spriteSheet && this.spriteSheet.complete;
    }

}
