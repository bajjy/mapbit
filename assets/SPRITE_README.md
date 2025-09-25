# 🎨 Sprite Atlas for Pixelated Building System

This directory contains the complete sprite configuration system for creating pixelated RPG-style buildings with borders and patterns.

## 📁 Files Overview

### 1. `sprite_atlas.csv`
- **Purpose**: Complete spreadsheet mapping of all sprites
- **Format**: CSV with columns: category, sprite_name, x, y, width, height, description, usage, hex_color, priority
- **Usage**: Import into spreadsheet applications or parse programmatically

### 2. `SpriteAtlas.js`
- **Purpose**: JavaScript module with organized sprite data
- **Features**: 
  - Categorized sprite definitions
  - Building pattern configurations
  - Helper functions for sprite lookup
  - Color palette definitions
- **Usage**: Import in your JavaScript/TypeScript code

### 3. `sprite_config.json`
- **Purpose**: JSON configuration for easy integration
- **Features**:
  - Building style definitions
  - Sprite categories and coordinates
  - Color palette
  - Implementation examples
- **Usage**: Load in any programming language

## 🏠 Building Styles Available

### Basic House
- **Materials**: Solid tiles, brick patterns
- **Roof**: Simple peak with tile pattern
- **Border**: Thin corner borders
- **Use Case**: Standard residential buildings

### Stone House
- **Materials**: Stone tiles with variations
- **Roof**: Angled peak with shingle pattern
- **Border**: Thick corner borders
- **Use Case**: Fortified or historical buildings

### Wooden House
- **Materials**: Wood grain and plank patterns
- **Roof**: Sloped sides with shingle pattern
- **Border**: Thin edge borders
- **Use Case**: Traditional or rural buildings

### Modern House
- **Materials**: Solid and textured tiles
- **Roof**: Clean peak with tile pattern
- **Border**: Square frame borders
- **Use Case**: Contemporary buildings

### Castle
- **Materials**: Stone tiles with large blocks
- **Roof**: Angled peak with tile pattern
- **Border**: Thick corner borders
- **Use Case**: Fortified structures

### Cottage
- **Materials**: Mixed wood and brick
- **Roof**: Sloped with shingle pattern
- **Border**: Thin corner borders
- **Use Case**: Charming small buildings

## 🎯 Implementation Guide

### 1. Load Sprite Sheet
```javascript
import { SPRITE_ATLAS, getBuildingPattern } from './SpriteAtlas.js';

// Load the sprite sheet image
const spriteSheet = new Image();
spriteSheet.src = 'assets/minimal_8_base_v2_2-bit - blue.png';
```

### 2. Create Building with Sprites
```javascript
// Get building pattern
const pattern = getBuildingPattern('stone');

// Use sprites for walls, corners, edges, roof, and borders
const wallSprite = SPRITE_ATLAS.BUILDING_TILES.STONE_01;
const cornerSprite = SPRITE_ATLAS.BUILDING_TILES.CORNER_TL;
const roofSprite = SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_02;
```

### 3. Render with Canvas
```javascript
// Draw sprite at specific position
function drawSprite(ctx, sprite, x, y) {
    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y, sprite.width, sprite.height,
        x, y, sprite.width, sprite.height
    );
}
```

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Teal | `#008080` | Main building color |
| Light Teal | `#40E0D0` | Highlights and roofs |
| Dark Teal | `#004D4D` | Shadows and details |
| Accent Blue | `#4682B4` | UI elements and borders |
| White | `#FFFFFF` | Text and highlights |
| Black | `#000000` | Background |

## 🔧 Integration with Orthogonalization

This sprite system works perfectly with the improved orthogonalization system:

1. **Process Building**: Use orthogonalization to create 90-degree angles
2. **Apply Sprites**: Use sprite patterns to fill walls and create borders
3. **Add Roof**: Apply roof sprites to building tops
4. **Border**: Add decorative borders around the building perimeter

## 📊 Sprite Categories

### Building Tiles (High Priority)
- Core construction sprites
- Wall, corner, and edge pieces
- Material variations (brick, stone, wood)

### Roof Elements (High Priority)
- Peak and slope sprites
- Tile and shingle patterns
- Roof texture variations

### Border Elements (Medium Priority)
- Frame and corner sprites
- Edge and junction pieces
- Border thickness variations

### UI Elements (Medium Priority)
- Circles, squares, and symbols
- Interface components
- Decorative elements

### Numbers (High Priority)
- Digits 0-9 for text display
- Punctuation marks
- Score and quantity display

### Decorative (Low Priority)
- Small shapes and textures
- Environmental details
- Fine decorative elements

## 🚀 Usage Examples

### Basic Building Construction
```javascript
// 1. Get building pattern
const housePattern = getBuildingPattern('basic');

// 2. Build walls with corner sprites
drawSprite(ctx, SPRITE_ATLAS.BUILDING_TILES.CORNER_TL, x, y);
drawSprite(ctx, SPRITE_ATLAS.BUILDING_TILES.EDGE_H, x + 8, y);
drawSprite(ctx, SPRITE_ATLAS.BUILDING_TILES.CORNER_TR, x + 16, y);

// 3. Add roof
drawSprite(ctx, SPRITE_ATLAS.ROOF_ELEMENTS.PEAK_01, x + 8, y - 8);

// 4. Add border
drawSprite(ctx, SPRITE_ATLAS.BORDER_ELEMENTS.CORNER_TL_THIN, x - 1, y - 1);
```

### Dynamic Building Style Selection
```javascript
function createBuilding(style, x, y, width, height) {
    const pattern = getBuildingPattern(style);
    
    // Build walls
    for (let i = 0; i < width; i += 8) {
        for (let j = 0; j < height; j += 8) {
            const wallSprite = pattern.wallSprites[Math.floor(Math.random() * pattern.wallSprites.length)];
            drawSprite(ctx, SPRITE_ATLAS.BUILDING_TILES[wallSprite.toUpperCase()], x + i, y + j);
        }
    }
    
    // Add roof
    const roofSprite = pattern.roofSprites[0];
    drawSprite(ctx, SPRITE_ATLAS.ROOF_ELEMENTS[roofSprite.toUpperCase()], x + width/2 - 4, y - 8);
}
```

## 🎮 Integration with Map System

This sprite system integrates seamlessly with the existing MapManager:

1. **Process GeoJSON**: Use orthogonalization to create clean building shapes
2. **Apply Sprites**: Use sprite patterns to render buildings with pixel art styling
3. **Add Borders**: Use border sprites to create decorative outlines
4. **Pattern Fill**: Use wall and roof sprites to fill building interiors

The result is authentic pixel art RPG-style buildings that maintain the orthogonal 90-degree angles while looking like classic game graphics! 🏠✨
