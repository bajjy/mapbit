/**
 * Sprite Atlas Configuration
 * Maps all sprites from the pixel art sprite sheet for building construction
 */
export const SPRITE_ATLAS = {
    // Building construction sprites
    BUILDING_TILES: {
        SOLID: { x: 0, y: 0, width: 8, height: 8, name: 'tile_solid_01' },
        TEXTURED: { x: 8, y: 0, width: 8, height: 8, name: 'tile_textured_01' },
        CORNER_TL: { x: 16, y: 0, width: 8, height: 8, name: 'tile_corner_tl' },
        CORNER_TR: { x: 24, y: 0, width: 8, height: 8, name: 'tile_corner_tr' },
        CORNER_BL: { x: 32, y: 0, width: 8, height: 8, name: 'tile_corner_bl' },
        CORNER_BR: { x: 40, y: 0, width: 8, height: 8, name: 'tile_corner_br' },
        EDGE_H: { x: 48, y: 0, width: 8, height: 8, name: 'tile_edge_h' },
        EDGE_V: { x: 56, y: 0, width: 8, height: 8, name: 'tile_edge_v' },
        BRICK_01: { x: 16, y: 8, width: 8, height: 8, name: 'tile_brick_01' },
        BRICK_02: { x: 24, y: 8, width: 8, height: 8, name: 'tile_brick_02' },
        STONE_01: { x: 32, y: 8, width: 8, height: 8, name: 'tile_stone_01' },
        STONE_02: { x: 40, y: 8, width: 8, height: 8, name: 'tile_stone_02' },
        WOOD_01: { x: 48, y: 8, width: 8, height: 8, name: 'tile_wood_01' },
        WOOD_02: { x: 56, y: 8, width: 8, height: 8, name: 'tile_wood_02' }
    },

    // Roof construction sprites
    ROOF_ELEMENTS: {
        PEAK_01: { x: 0, y: 32, width: 8, height: 8, name: 'roof_peak_01' },
        PEAK_02: { x: 8, y: 32, width: 8, height: 8, name: 'roof_peak_02' },
        SLOPE_L: { x: 16, y: 32, width: 8, height: 8, name: 'roof_slope_l' },
        SLOPE_R: { x: 24, y: 32, width: 8, height: 8, name: 'roof_slope_r' },
        TILE_01: { x: 32, y: 32, width: 8, height: 8, name: 'roof_tile_01' },
        TILE_02: { x: 40, y: 32, width: 8, height: 8, name: 'roof_tile_02' },
        SHINGLE_01: { x: 48, y: 32, width: 8, height: 8, name: 'roof_shingle_01' },
        SHINGLE_02: { x: 56, y: 32, width: 8, height: 8, name: 'roof_shingle_02' }
    },

    // Border construction sprites
    BORDER_ELEMENTS: {
        FRAME_THIN: { x: 64, y: 0, width: 8, height: 8, name: 'frame_square_thin' },
        FRAME_THICK: { x: 72, y: 0, width: 8, height: 8, name: 'frame_square_thick' },
        FRAME_OCTAGON: { x: 80, y: 0, width: 8, height: 8, name: 'frame_octagon' },
        CORNER_TL_THIN: { x: 64, y: 16, width: 8, height: 8, name: 'corner_tl_thin' },
        CORNER_TR_THIN: { x: 72, y: 16, width: 8, height: 8, name: 'corner_tr_thin' },
        CORNER_BL_THIN: { x: 80, y: 16, width: 8, height: 8, name: 'corner_bl_thin' },
        CORNER_BR_THIN: { x: 88, y: 16, width: 8, height: 8, name: 'corner_br_thin' },
        EDGE_H_THIN: { x: 64, y: 24, width: 8, height: 8, name: 'edge_h_thin' },
        EDGE_V_THIN: { x: 72, y: 24, width: 8, height: 8, name: 'edge_v_thin' },
        JUNCTION_T: { x: 80, y: 24, width: 8, height: 8, name: 'junction_t' },
        JUNCTION_L: { x: 88, y: 24, width: 8, height: 8, name: 'junction_l' }
    },

    // Structural elements
    STRUCTURAL: {
        BLOCK_SMALL: { x: 0, y: 24, width: 4, height: 4, name: 'block_small' },
        BLOCK_MEDIUM: { x: 4, y: 24, width: 6, height: 6, name: 'block_medium' },
        BLOCK_LARGE: { x: 10, y: 24, width: 8, height: 8, name: 'block_large' },
        LINE_H_SHORT: { x: 0, y: 16, width: 8, height: 2, name: 'line_h_short' },
        LINE_H_MEDIUM: { x: 8, y: 16, width: 8, height: 2, name: 'line_h_medium' },
        LINE_H_LONG: { x: 16, y: 16, width: 8, height: 2, name: 'line_h_long' }
    },

    // UI elements
    UI_ELEMENTS: {
        CIRCLE_SOLID: { x: 0, y: 48, width: 8, height: 8, name: 'circle_solid' },
        CIRCLE_RING_01: { x: 8, y: 48, width: 8, height: 8, name: 'circle_ring_01' },
        CIRCLE_RING_02: { x: 16, y: 48, width: 8, height: 8, name: 'circle_ring_02' },
        CIRCLE_RADIAL: { x: 24, y: 48, width: 8, height: 8, name: 'circle_radial' },
        SQUARE_SOLID: { x: 0, y: 56, width: 8, height: 8, name: 'square_solid' },
        SQUARE_BORDER: { x: 8, y: 56, width: 8, height: 8, name: 'square_border' },
        SQUARE_CROSS: { x: 16, y: 56, width: 8, height: 8, name: 'square_cross' },
        SYMBOL_PLUS: { x: 24, y: 56, width: 8, height: 8, name: 'symbol_plus' }
    },

    // Numbers for text display
    NUMBERS: {
        '0': { x: 0, y: 72, width: 8, height: 8, name: 'number_0' },
        '1': { x: 8, y: 72, width: 8, height: 8, name: 'number_1' },
        '2': { x: 16, y: 72, width: 8, height: 8, name: 'number_2' },
        '3': { x: 24, y: 72, width: 8, height: 8, name: 'number_3' },
        '4': { x: 32, y: 72, width: 8, height: 8, name: 'number_4' },
        '5': { x: 40, y: 72, width: 8, height: 8, name: 'number_5' },
        '6': { x: 48, y: 72, width: 8, height: 8, name: 'number_6' },
        '7': { x: 56, y: 72, width: 8, height: 8, name: 'number_7' },
        '8': { x: 0, y: 80, width: 8, height: 8, name: 'number_8' },
        '9': { x: 8, y: 80, width: 8, height: 8, name: 'number_9' }
    },

    // Decorative elements
    DECORATIVE: {
        SHAPE_CIRCLE_SMALL: { x: 64, y: 32, width: 4, height: 4, name: 'shape_circle_small' },
        SHAPE_OVAL: { x: 68, y: 32, width: 6, height: 4, name: 'shape_oval' },
        SHAPE_DIAMOND: { x: 72, y: 32, width: 4, height: 4, name: 'shape_diamond' },
        SHAPE_CROSS: { x: 76, y: 32, width: 4, height: 4, name: 'shape_cross' },
        TEXTURE_DOTS: { x: 64, y: 40, width: 8, height: 8, name: 'texture_dots' },
        TEXTURE_LINES: { x: 72, y: 40, width: 8, height: 8, name: 'texture_lines' },
        TEXTURE_CHECKER: { x: 80, y: 40, width: 8, height: 8, name: 'texture_checker' }
    },

    // Navigation arrows
    NAVIGATION: {
        ARROW_UP: { x: 64, y: 48, width: 4, height: 4, name: 'arrow_up' },
        ARROW_DOWN: { x: 68, y: 48, width: 4, height: 4, name: 'arrow_down' },
        ARROW_LEFT: { x: 72, y: 48, width: 4, height: 4, name: 'arrow_left' },
        ARROW_RIGHT: { x: 76, y: 48, width: 4, height: 4, name: 'arrow_right' }
    }
};

/**
 * Building pattern configurations
 * Defines how to combine sprites to create different building styles
 */
export const BUILDING_PATTERNS = {
    // Basic house patterns
    BASIC_HOUSE: {
        walls: ['tile_solid_01', 'tile_brick_01'],
        corners: ['tile_corner_tl', 'tile_corner_tr', 'tile_corner_bl', 'tile_corner_br'],
        edges: ['tile_edge_h', 'tile_edge_v'],
        roof: ['roof_peak_01', 'roof_tile_01'],
        border: ['corner_tl_thin', 'corner_tr_thin', 'corner_bl_thin', 'corner_br_thin']
    },

    // Stone house patterns
    STONE_HOUSE: {
        walls: ['tile_stone_01', 'tile_stone_02'],
        corners: ['tile_corner_tl', 'tile_corner_tr', 'tile_corner_bl', 'tile_corner_br'],
        edges: ['tile_edge_h', 'tile_edge_v'],
        roof: ['roof_peak_02', 'roof_shingle_01'],
        border: ['corner_tl_thick', 'corner_tr_thick', 'corner_bl_thick', 'corner_br_thick']
    },

    // Wooden house patterns
    WOODEN_HOUSE: {
        walls: ['tile_wood_01', 'tile_wood_02'],
        corners: ['tile_corner_tl', 'tile_corner_tr', 'tile_corner_bl', 'tile_corner_br'],
        edges: ['tile_edge_h', 'tile_edge_v'],
        roof: ['roof_slope_l', 'roof_slope_r', 'roof_shingle_02'],
        border: ['edge_h_thin', 'edge_v_thin']
    },

    // Modern house patterns
    MODERN_HOUSE: {
        walls: ['tile_solid_01', 'tile_textured_01'],
        corners: ['tile_corner_tl', 'tile_corner_tr', 'tile_corner_bl', 'tile_corner_br'],
        edges: ['tile_edge_h', 'tile_edge_v'],
        roof: ['roof_peak_01', 'roof_tile_02'],
        border: ['frame_square_thin']
    }
};

/**
 * Color palette for the sprite sheet
 */
export const COLOR_PALETTE = {
    PRIMARY_TEAL: '#008080',
    LIGHT_TEAL: '#40E0D0',
    DARK_TEAL: '#004D4D',
    ACCENT_BLUE: '#4682B4',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    RED: '#FF0000'
};

/**
 * Sprite sheet metadata
 */
export const SPRITE_SHEET_INFO = {
    imagePath: 'assets/minimal_8_base_v2_2-bit - blue.png',
    totalWidth: 96,
    totalHeight: 88,
    spriteSize: 8,
    categories: [
        'Building Tiles',
        'Roof Elements', 
        'Border Elements',
        'Structural',
        'UI Elements',
        'Numbers',
        'Decorative',
        'Navigation'
    ]
};

/**
 * Helper function to get sprite coordinates
 * @param {string} category - The sprite category
 * @param {string} spriteName - The sprite name
 * @returns {Object} Sprite coordinates and metadata
 */
export function getSprite(category, spriteName) {
    const categoryData = SPRITE_ATLAS[category.toUpperCase()];
    if (!categoryData) {
        console.warn(`Category ${category} not found in sprite atlas`);
        return null;
    }
    
    const sprite = categoryData[spriteName.toUpperCase()];
    if (!sprite) {
        console.warn(`Sprite ${spriteName} not found in category ${category}`);
        return null;
    }
    
    return sprite;
}

/**
 * Helper function to get building pattern
 * @param {string} patternName - The pattern name
 * @returns {Object} Building pattern configuration
 */
export function getBuildingPattern(patternName) {
    const pattern = BUILDING_PATTERNS[patternName.toUpperCase()];
    if (!pattern) {
        console.warn(`Building pattern ${patternName} not found`);
        return BUILDING_PATTERNS.BASIC_HOUSE; // Default fallback
    }
    
    return pattern;
}

/**
 * Helper function to get all sprites in a category
 * @param {string} category - The sprite category
 * @returns {Array} Array of sprite objects
 */
export function getCategorySprites(category) {
    const categoryData = SPRITE_ATLAS[category.toUpperCase()];
    if (!categoryData) {
        console.warn(`Category ${category} not found in sprite atlas`);
        return [];
    }
    
    return Object.values(categoryData);
}
