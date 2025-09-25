import express from 'express';
import osmtogeojson from 'osmtogeojson';

const router = express.Router();

// OpenStreetMap API endpoint
const OSM_API = 'https://www.openstreetmap.org/api/0.6/map.json';

/**
 * Fetch OSM data for a specific bounding box
 */
router.post('/fetch', async (req, res) => {
  try {
    const { bounds } = req.body;
    
    if (!bounds || !bounds.north || !bounds.south || !bounds.east || !bounds.west) {
      return res.status(400).json({ error: 'Invalid bounds provided' });
    }

    // Build OSM API URL with bounding box
    const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
    const url = `${OSM_API}?bbox=${bbox}`;

    console.log('Fetching OSM data from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'OSM-RPG-Converter/1.0'
      },
      timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const osmData = await response.json();

    if (!osmData || !osmData.elements) {
      return res.status(500).json({ error: 'No data received from OSM API' });
    }

    // Convert OSM data to GeoJSON
    const geoJson = osmtogeojson(osmData);
    
    // Filter features based on type (buildings, roads, etc.)
    const filteredFeatures = filterFeaturesByType(geoJson.features || [], req.body.features || ['buildings']);
    
    // Add metadata
    const result = {
      type: 'FeatureCollection',
      features: filteredFeatures,
      metadata: {
        bounds,
        requestedFeatures: req.body.features || ['buildings'],
        featureCount: filteredFeatures.length,
        totalElements: osmData.elements.length,
        timestamp: new Date().toISOString(),
        osmData: {
          version: osmData.version,
          generator: osmData.generator,
          copyright: osmData.copyright
        }
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Error fetching OSM data:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout - try a smaller area' });
    }
    
    res.status(500).json({ error: 'Failed to fetch OSM data', details: error.message });
  }
});

/**
 * Get user's current location (mock for now - in production, use geolocation API)
 */
router.get('/location', (req, res) => {
  // Default to your specific location
  const defaultLocation = {
    lat: 41.127489,
    lng: -8.593545,
    name: 'Default Location'
  };
  
  res.json(defaultLocation);
});

/**
 * Filter features by type based on OSM tags
 */
function filterFeaturesByType(features, requestedTypes) {
  if (!requestedTypes || requestedTypes.length === 0) {
    return features;
  }

  return features.filter(feature => {
    if (!feature.properties) return false;

    const props = feature.properties;
    
    // Check for buildings
    if (requestedTypes.includes('buildings') && props.building) {
      return true;
    }
    
    // Check for roads
    if (requestedTypes.includes('roads') && props.highway) {
      return true;
    }
    
    // Check for water
    if (requestedTypes.includes('water') && (props.natural === 'water' || props.waterway)) {
      return true;
    }
    
    // Check for parks
    if (requestedTypes.includes('parks') && (props.leisure === 'park' || props.landuse === 'recreation_ground')) {
      return true;
    }
    
    return false;
  });
}

export { router as osmRoutes };
