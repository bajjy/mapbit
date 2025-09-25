#!/usr/bin/env node

/**
 * Test script for the improved orthogonalization algorithm
 * This script creates test polygons with sharp angles and demonstrates
 * how the new algorithm converts them to 90-degree angles
 */

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// Test data - polygons with various sharp angles
const testPolygons = [
  {
    name: "Sharp Triangle",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [0, 0],
        [0.001, 0.001],
        [0.002, 0],
        [0, 0]
      ]]
    }
  },
  {
    name: "Irregular Pentagon",
    geometry: {
      type: "Polygon", 
      coordinates: [[
        [0, 0],
        [0.002, 0.001],
        [0.001, 0.002],
        [0.0015, 0.0015],
        [0, 0.002],
        [0, 0]
      ]]
    }
  },
  {
    name: "Complex Building Shape",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [0, 0],
        [0.003, 0.0005],
        [0.0025, 0.0015],
        [0.001, 0.002],
        [0.0005, 0.001],
        [0, 0]
      ]]
    }
  }
];

async function testOrthogonalization() {
  console.log('🧪 Testing Improved Orthogonalization Algorithm\n');
  
  const serverUrl = 'http://localhost:3001';
  
  // Test different configurations
  const testConfigs = [
    {
      name: "Default (Force Orthogonal)",
      options: {
        gridSize: 0.0001,
        angleTolerance: 15,
        forceOrthogonal: true,
        preserveShape: false
      }
    },
    {
      name: "Preserve Shape",
      options: {
        gridSize: 0.0001,
        angleTolerance: 10,
        forceOrthogonal: false,
        preserveShape: true
      }
    },
    {
      name: "Strict Orthogonal",
      options: {
        gridSize: 0.0001,
        angleTolerance: 5,
        forceOrthogonal: true,
        preserveShape: false
      }
    }
  ];

  for (const config of testConfigs) {
    console.log(`\n📋 Testing: ${config.name}`);
    console.log('=' .repeat(50));
    
    for (const testPolygon of testPolygons) {
      console.log(`\n🏠 ${testPolygon.name}:`);
      
      try {
        const response = await fetch(`${serverUrl}/process/orthogonalize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            features: [testPolygon],
            options: config.options
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const processedFeature = result.features[0];
        
        if (processedFeature) {
          const originalVertices = testPolygon.geometry.coordinates[0].length - 1;
          const processedVertices = processedFeature.geometry.coordinates[0].length - 1;
          
          console.log(`  ✅ Original vertices: ${originalVertices}`);
          console.log(`  ✅ Processed vertices: ${processedVertices}`);
          console.log(`  ✅ Original area: ${processedFeature.properties._originalArea.toFixed(8)}`);
          console.log(`  ✅ Processed area: ${processedFeature.properties._processedArea.toFixed(8)}`);
          
          // Calculate angle analysis
          const angles = calculateAngles(processedFeature.geometry.coordinates[0]);
          const rightAngles = angles.filter(angle => Math.abs(angle - 90) < 15 || Math.abs(angle - 270) < 15).length;
          const rightAnglePercentage = (rightAngles / angles.length * 100).toFixed(1);
          
          console.log(`  ✅ Right angles (90°±15°): ${rightAngles}/${angles.length} (${rightAnglePercentage}%)`);
          console.log(`  ✅ Angle distribution: ${angles.map(a => a.toFixed(0) + '°').join(', ')}`);
        } else {
          console.log('  ❌ No processed feature returned');
        }
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
  }
}

/**
 * Calculate angles at each vertex of a polygon
 */
function calculateAngles(coordinates) {
  const angles = [];
  const vertices = coordinates.slice(0, -1); // Remove duplicate closing point
  
  for (let i = 0; i < vertices.length; i++) {
    const prev = vertices[(i - 1 + vertices.length) % vertices.length];
    const curr = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    const angle = calculateAngle(prev, curr, next);
    angles.push(angle);
  }
  
  return angles;
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

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testOrthogonalization().catch(console.error);
}

export { testOrthogonalization };
