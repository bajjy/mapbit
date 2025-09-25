import express from 'express';
import * as turf from '@turf/turf';

const router = express.Router();

/**
 * Process GeoJSON features for RPG-style rendering
 */
router.post('/orthogonalize', (req, res) => {
  try {
    const { features, options = {} } = req.body;
    
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Invalid features array provided' });
    }

    const {
      tolerance = 0.0001,      // Simplification tolerance
      gridSize = 0.0001,       // Grid alignment size
      minArea = 0.000001,      // Minimum area to keep
      maxVertices = 20,        // Maximum vertices per polygon
      angleTolerance = 15,     // Angle tolerance in degrees (how close to 90°)
      forceOrthogonal = true,  // Force all edges to be horizontal/vertical
      preserveShape = false    // Try to preserve original shape while orthogonalizing
    } = options;

    const processedFeatures = features.map(feature => {
      try {
        return processFeature(feature, { tolerance, gridSize, minArea, maxVertices, angleTolerance, forceOrthogonal, preserveShape });
      } catch (error) {
        console.warn('Error processing feature:', error);
        return feature; // Return original if processing fails
      }
    }).filter(feature => feature !== null);

    res.json({
      type: 'FeatureCollection',
      features: processedFeatures,
      metadata: {
        originalCount: features.length,
        processedCount: processedFeatures.length,
        options
      }
    });

  } catch (error) {
    console.error('Error processing features:', error);
    res.status(500).json({ error: 'Failed to process features' });
  }
});

/**
 * Process a single feature for RPG-style rendering
 */
function processFeature(feature, options) {
  const { tolerance, gridSize, minArea, maxVertices, angleTolerance, forceOrthogonal, preserveShape } = options;
  
  if (!feature.geometry || feature.geometry.type !== 'Polygon') {
    return feature; // Only process polygons
  }

  let processedGeometry = feature.geometry;

  // 1. Simplify the polygon
  if (tolerance > 0) {
    const simplified = turf.simplify(feature, { tolerance, highQuality: true });
    processedGeometry = simplified.geometry;
  }

  // 2. Calculate area and filter small features
  const area = turf.area(feature);
  if (area < minArea) {
    return null; // Skip very small features
  }

  // 3. Orthogonalize the polygon (convert to 90-degree angles)
  processedGeometry = orthogonalizePolygon(processedGeometry, gridSize, angleTolerance, forceOrthogonal, preserveShape);

  // 4. Limit vertices
  if (processedGeometry.coordinates[0].length > maxVertices) {
    processedGeometry = reduceVertices(processedGeometry, maxVertices);
  }

  // 5. Create bounding box approximation for very complex shapes
  if (isComplexShape(processedGeometry)) {
    processedGeometry = createBoundingBoxApproximation(processedGeometry);
  }

  return {
    ...feature,
    geometry: processedGeometry,
    properties: {
      ...feature.properties,
      _processed: true,
      _originalArea: area,
      _processedArea: turf.area({ type: 'Feature', geometry: processedGeometry })
    }
  };
}

/**
 * Orthogonalize a polygon by ensuring all angles are as close to 90 degrees as possible
 */
function orthogonalizePolygon(geometry, gridSize, angleTolerance = 15, forceOrthogonal = true, preserveShape = false) {
  const coordinates = geometry.coordinates[0];
  
  if (coordinates.length < 4) {
    return geometry; // Need at least 3 vertices + closing point
  }

  // Remove duplicate closing point for processing
  const vertices = coordinates.slice(0, -1);
  
  // First, snap all vertices to grid
  const snappedVertices = vertices.map(([lng, lat]) => [
    Math.round(lng / gridSize) * gridSize,
    Math.round(lat / gridSize) * gridSize
  ]);

  // Apply orthogonalization algorithm
  const orthogonalized = orthogonalizeVertices(snappedVertices, gridSize, angleTolerance, forceOrthogonal, preserveShape);

  // Close the polygon
  if (orthogonalized.length > 0) {
    orthogonalized.push(orthogonalized[0]);
  }

  return {
    type: 'Polygon',
    coordinates: [orthogonalized]
  };
}

/**
 * Advanced orthogonalization algorithm that ensures 90-degree angles
 */
function orthogonalizeVertices(vertices, gridSize, angleTolerance = 15, forceOrthogonal = true, preserveShape = false) {
  if (vertices.length < 3) return vertices;

  const result = [...vertices];
  const tolerance = gridSize * 0.1; // Small tolerance for angle detection
  
  // Iterate through vertices and adjust angles
  for (let i = 0; i < result.length; i++) {
    const prev = result[(i - 1 + result.length) % result.length];
    const curr = result[i];
    const next = result[(i + 1) % result.length];
    
    // Calculate the angle at current vertex
    const angle = calculateAngle(prev, curr, next);
    
    // Determine the target angle (closest 90-degree increment)
    const targetAngle = snapToRightAngle(angle);
    
    // If angle needs significant correction, adjust the vertex
    if (Math.abs(angle - targetAngle) > angleTolerance) {
      const adjustedVertex = adjustVertexForAngle(prev, curr, next, targetAngle, gridSize, preserveShape);
      if (adjustedVertex) {
        result[i] = adjustedVertex;
      }
    }
  }

  // Post-process to ensure all edges are either horizontal or vertical
  if (forceOrthogonal) {
    return ensureOrthogonalEdges(result, gridSize);
  }
  
  return result;
}

/**
 * Calculate the angle between three points (in degrees)
 */
function calculateAngle(p1, p2, p3) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  
  // Vectors from p2 to p1 and p2 to p3
  const v1x = x1 - x2;
  const v1y = y1 - y2;
  const v2x = x3 - x2;
  const v2y = y3 - y2;
  
  // Calculate angle using dot product
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  let angle = Math.acos(cosAngle) * (180 / Math.PI);
  
  // Determine if it's a left or right turn
  const cross = v1x * v2y - v1y * v2x;
  if (cross < 0) {
    angle = 360 - angle;
  }
  
  return angle;
}

/**
 * Snap an angle to the nearest 90-degree increment (0, 90, 180, 270)
 */
function snapToRightAngle(angle) {
  const normalized = ((angle % 360) + 360) % 360;
  
  if (normalized <= 45 || normalized > 315) return 0;
  if (normalized <= 135) return 90;
  if (normalized <= 225) return 180;
  return 270;
}

/**
 * Adjust a vertex position to achieve the target angle
 */
function adjustVertexForAngle(prev, curr, next, targetAngle, gridSize, preserveShape = false) {
  const [px, py] = prev;
  const [cx, cy] = curr;
  const [nx, ny] = next;
  
  // Calculate current vectors
  const v1x = px - cx;
  const v1y = py - cy;
  const v2x = nx - cx;
  const v2y = ny - cy;
  
  // Calculate current angle
  const currentAngle = calculateAngle(prev, curr, next);
  const angleDiff = targetAngle - currentAngle;
  
  // For small adjustments, try to move the vertex slightly
  if (Math.abs(angleDiff) < 30) {
    // Calculate adjustment direction
    const adjustmentFactor = preserveShape ? 0.05 : 0.1; // Smaller adjustments if preserving shape
    const adjX = (v1x + v2x) * adjustmentFactor;
    const adjY = (v1y + v2y) * adjustmentFactor;
    
    const newX = cx + adjX;
    const newY = cy + adjY;
    
    // Snap to grid
    return [
      Math.round(newX / gridSize) * gridSize,
      Math.round(newY / gridSize) * gridSize
    ];
  }
  
  // For larger adjustments, try to align with grid lines
  return alignVertexToGrid(curr, gridSize);
}

/**
 * Align vertex to grid lines to encourage orthogonal edges
 */
function alignVertexToGrid(vertex, gridSize) {
  const [x, y] = vertex;
  
  // Try both X and Y alignment
  const xAligned = [Math.round(x / gridSize) * gridSize, y];
  const yAligned = [x, Math.round(y / gridSize) * gridSize];
  
  // Return the one that's closer to original position
  const distX = Math.abs(x - xAligned[0]);
  const distY = Math.abs(y - yAligned[1]);
  
  return distX < distY ? xAligned : yAligned;
}

/**
 * Ensure all edges are either horizontal or vertical
 */
function ensureOrthogonalEdges(vertices, gridSize) {
  const result = [...vertices];
  
  for (let i = 0; i < result.length - 1; i++) {
    const curr = result[i];
    const next = result[i + 1];
    
    const [x1, y1] = curr;
    const [x2, y2] = next;
    
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    
    // If edge is not horizontal or vertical, adjust it
    if (dx > gridSize * 0.1 && dy > gridSize * 0.1) {
      // Make it horizontal or vertical based on which is longer
      if (dx > dy) {
        // Make horizontal
        result[i + 1] = [x2, y1];
      } else {
        // Make vertical
        result[i + 1] = [x1, y2];
      }
    }
  }
  
  return result;
}

/**
 * Reduce vertices by removing redundant points
 */
function reduceVertices(geometry, maxVertices) {
  const coordinates = geometry.coordinates[0];
  
  if (coordinates.length <= maxVertices) {
    return geometry;
  }

  // Simple decimation - keep every nth point
  const step = Math.ceil(coordinates.length / maxVertices);
  const reduced = [];
  
  for (let i = 0; i < coordinates.length; i += step) {
    reduced.push(coordinates[i]);
  }

  // Ensure we close the polygon
  if (reduced[reduced.length - 1] !== reduced[0]) {
    reduced.push(reduced[0]);
  }

  return {
    type: 'Polygon',
    coordinates: [reduced]
  };
}

/**
 * Check if a polygon is too complex for good RPG styling
 */
function isComplexShape(geometry) {
  const coordinates = geometry.coordinates[0];
  
  // Consider complex if it has many vertices or irregular shape
  if (coordinates.length > 15) {
    return true;
  }

  // Check for very irregular shapes (high perimeter to area ratio)
  const feature = { type: 'Feature', geometry };
  const area = turf.area(feature);
  const perimeter = turf.length(feature);
  
  if (area > 0 && (perimeter * perimeter) / area > 50) {
    return true;
  }

  return false;
}

/**
 * Create a simple bounding box approximation for complex shapes
 */
function createBoundingBoxApproximation(geometry) {
  const bbox = turf.bbox({ type: 'Feature', geometry });
  const bboxPolygon = turf.bboxPolygon(bbox);
  
  return bboxPolygon.geometry;
}

/**
 * Get processing statistics
 */
router.post('/stats', (req, res) => {
  try {
    const { features } = req.body;
    
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: 'Invalid features array provided' });
    }

    const stats = {
      totalFeatures: features.length,
      polygons: 0,
      lines: 0,
      points: 0,
      totalArea: 0,
      averageVertices: 0,
      buildingTypes: {},
      totalVertices: 0
    };

    features.forEach(feature => {
      if (feature.geometry) {
        switch (feature.geometry.type) {
          case 'Polygon':
            stats.polygons++;
            stats.totalArea += turf.area(feature);
            stats.totalVertices += feature.geometry.coordinates[0].length;
            break;
          case 'LineString':
            stats.lines++;
            stats.totalVertices += feature.geometry.coordinates.length;
            break;
          case 'Point':
            stats.points++;
            break;
        }

        // Count building types
        if (feature.properties && feature.properties.building) {
          const buildingType = feature.properties.building;
          stats.buildingTypes[buildingType] = (stats.buildingTypes[buildingType] || 0) + 1;
        }
      }
    });

    stats.averageVertices = stats.totalFeatures > 0 ? stats.totalVertices / stats.totalFeatures : 0;

    res.json(stats);

  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

export { router as processRoutes };
