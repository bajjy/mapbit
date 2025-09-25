# 🗺️ OSM RPG Map Converter

Convert OpenStreetMap vector objects to RPG-style pixel art maps with interactive features like zoom, scroll, and pathfinding.

## 🎮 Features

- **Vector Processing**: Fetch OSM data and convert complex polygons to 90-degree orthogonal shapes
- **RPG Styling**: Apply pixel art patterns and retro aesthetics
- **Interactive Map**: Full Leaflet integration with zoom, pan, and feature interaction
- **Real-time Processing**: Client-side and server-side processing options
- **Customizable**: Adjustable grid size, simplification tolerance, and styling options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   cd mapbit
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Server on `http://localhost:3001`
   - Client on `http://localhost:3000`

### Manual Setup

If you prefer to set up each part separately:

**Server:**
```bash
cd server
npm install
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## 🏗️ Project Structure

```
mapbit/
├── server/                 # Express.js backend
│   ├── routes/
│   │   ├── osm.js         # OSM data fetching
│   │   └── process.js     # Vector processing
│   └── index.js           # Server entry point
├── client/                 # Vite + Leaflet frontend
│   ├── js/
│   │   ├── MapManager.js  # Leaflet map management
│   │   ├── OSMService.js  # OSM API client
│   │   ├── ProcessingService.js # Vector processing client
│   │   └── UIManager.js   # UI state management
│   ├── index.html         # Main HTML
│   ├── style.css          # RPG-themed styles
│   └── main.js            # App entry point
└── assets/                # Pixel art textures and patterns
```

## 🎯 Usage

1. **Load Location**: Click "📍 Load My Location" or use the default NYC location
2. **Load Buildings**: Click "🏠 Load Buildings" to fetch OSM data for the current view
3. **Process for RPG**: Click "✨ Process for RPG" to orthogonalize and style the data
4. **Customize**: Use the sidebar controls to adjust grid size, simplification, and features

## 🔧 Configuration

### Server Environment Variables

Copy `server/env.example` to `server/.env` and adjust:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OSM_API_URL=https://www.openstreetmap.org/api/0.6/map.json
```

### Processing Options

- **Grid Size**: Controls the granularity of orthogonalization (0.00001 - 0.001)
- **Tolerance**: Simplification tolerance for reducing vertices (0 - 0.01)
- **Min Area**: Minimum area threshold for keeping features
- **Max Vertices**: Maximum vertices per polygon after processing

## 🎨 Styling

The app uses a retro RPG theme with:
- Pixel art patterns for different feature types
- Custom color schemes for buildings, roads, water, and parks
- Grid overlay for RPG map aesthetics
- Smooth animations and transitions

## 🔌 API Endpoints

### OSM Data
- `POST /api/osm/fetch` - Fetch OSM data for bounds and features
- `GET /api/osm/location` - Get default location

### Processing
- `POST /api/process/orthogonalize` - Process features for RPG styling
- `POST /api/process/stats` - Get processing statistics

## 🛠️ Development

### Adding New Features

1. **Server**: Add new routes in `server/routes/`
2. **Client**: Add new services in `client/js/`
3. **UI**: Update `client/index.html` and `client/style.css`

### Testing

```bash
# Test server
curl http://localhost:3001/health

# Test OSM fetch
curl -X POST http://localhost:3001/api/osm/fetch \
  -H "Content-Type: application/json" \
  -d '{"bounds":{"north":40.8,"south":40.7,"east":-74.0,"west":-74.1},"features":["buildings"]}'
```

## 📦 Dependencies

### Server
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **turf**: Geospatial analysis
- **osmtogeojson**: OSM to GeoJSON conversion
- **native fetch**: HTTP client (no external dependencies)

### Client
- **leaflet**: Interactive maps
- **turf**: Geospatial utilities
- **vite**: Build tool and dev server
- **native fetch**: HTTP client (no external dependencies)

## 🎮 RPG Features

- **Orthogonalization**: Convert complex shapes to 90-degree angles
- **Pixel Art Mode**: Apply retro styling with square line caps
- **Grid Overlay**: Optional grid for RPG map aesthetics
- **Feature Filtering**: Toggle buildings, roads, water, and parks
- **Interactive Popups**: Click features for detailed information

## 🚧 Roadmap

- [ ] Pathfinding algorithms
- [ ] Custom texture patterns
- [ ] Export functionality (PNG, SVG)
- [ ] WebGL shader effects
- [ ] Mobile optimization
- [ ] Offline mode with cached data

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

**Server won't start:**
- Check if port 3001 is available
- Verify all dependencies are installed
- Check environment variables

**Client won't load:**
- Ensure server is running on port 3001
- Check browser console for errors
- Verify CORS settings

**OSM data not loading:**
- Check internet connection
- Verify Overpass API is accessible
- Try a smaller bounding box

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub
# mapbit
