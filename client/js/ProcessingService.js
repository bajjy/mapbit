export class ProcessingService {
    constructor() {
        this.baseURL = 'http://localhost:3012/api';
    }
    
    async orthogonalize(features, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}/process/orthogonalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    features,
                    options
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Error processing features:', error);
            throw new Error(`Failed to process features: ${error.message}`);
        }
    }
    
    async getProcessingStats(features) {
        try {
            const response = await fetch(`${this.baseURL}/process/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ features })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const stats = await response.json();
            return stats;
            
        } catch (error) {
            console.error('Error getting processing stats:', error);
            throw new Error(`Failed to get processing stats: ${error.message}`);
        }
    }
    
    // Client-side processing utilities
    simplifyPolygon(coordinates, tolerance = 0.0001) {
        // Simple Douglas-Peucker-like simplification
        if (coordinates.length <= 3) return coordinates;
        
        const simplified = [coordinates[0]];
        
        for (let i = 1; i < coordinates.length - 1; i++) {
            const prev = coordinates[i - 1];
            const curr = coordinates[i];
            const next = coordinates[i + 1];
            
            // Calculate distance from current point to line between prev and next
            const distance = this.pointToLineDistance(curr, prev, next);
            
            if (distance > tolerance) {
                simplified.push(curr);
            }
        }
        
        simplified.push(coordinates[coordinates.length - 1]);
        return simplified;
    }
    
    pointToLineDistance(point, lineStart, lineEnd) {
        const [px, py] = point;
        const [x1, y1] = lineStart;
        const [x2, y2] = lineEnd;
        
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        let param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    snapToGrid(coordinates, gridSize) {
        return coordinates.map(([lng, lat]) => [
            Math.round(lng / gridSize) * gridSize,
            Math.round(lat / gridSize) * gridSize
        ]);
    }
    
    createBoundingBox(coordinates) {
        let minLng = Infinity, maxLng = -Infinity;
        let minLat = Infinity, maxLat = -Infinity;
        
        coordinates.forEach(([lng, lat]) => {
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
        });
        
        return [
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
            [minLng, minLat] // Close the polygon
        ];
    }
}
