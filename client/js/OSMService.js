export class OSMService {
    constructor() {
        this.baseURL = 'http://localhost:3012/api';
    }
    
    async fetchOSMData(bounds, features = ['buildings']) {
        try {
            const response = await fetch(`${this.baseURL}/osm/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bounds,
                    features
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Error fetching OSM data:', error);
            throw new Error(`Failed to fetch OSM data: ${error.message}`);
        }
    }
    
    async getDefaultLocation() {
        try {
            const response = await fetch(`${this.baseURL}/osm/location`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const location = await response.json();
            return location;
            
        } catch (error) {
            console.error('Error getting default location:', error);
            // Fallback to a default location
            return {
                lat: 40.7128,
                lng: -74.0060,
                name: 'New York City (Fallback)'
            };
        }
    }
    
    async getLocationStats(bounds) {
        try {
            const response = await fetch(`${this.baseURL}/osm/stats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bounds })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const stats = await response.json();
            return stats;
            
        } catch (error) {
            console.error('Error getting location stats:', error);
            throw new Error(`Failed to get location stats: ${error.message}`);
        }
    }
}
