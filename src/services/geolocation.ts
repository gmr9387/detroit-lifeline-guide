// Browser Geolocation Service
// Uses native browser geolocation APIs for location-based features

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

class GeolocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;

  // Get current location using browser geolocation API
  async getCurrentLocation(options?: PositionOptions): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser'
        });
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.currentLocation = locationData;
          resolve(locationData);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: this.getErrorMessage(error.code)
          };
          reject(locationError);
        },
        defaultOptions
      );
    });
  }

  // Watch location changes
  watchLocation(
    onLocationUpdate: (location: LocationData) => void,
    onError: (error: LocationError) => void,
    options?: PositionOptions
  ): number | null {
    if (!navigator.geolocation) {
      onError({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      });
      return null;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        this.currentLocation = locationData;
        onLocationUpdate(locationData);
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: this.getErrorMessage(error.code)
        };
        onError(locationError);
      },
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching location
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get cached location
  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'miles' | 'kilometers' = 'miles'
  ): number {
    const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get location from zip code using browser APIs
  async getLocationFromZipCode(zipCode: string): Promise<LocationData | null> {
    try {
      // Use the browser's built-in geocoding if available
      // This is a simplified implementation - in production you'd use a proper geocoding service
      const detroitZipCodes: Record<string, { lat: number; lng: number }> = {
        '48201': { lat: 42.3189, lng: -83.2195 },
        '48202': { lat: 42.3736, lng: -83.0774 },
        '48203': { lat: 42.3831, lng: -83.1024 },
        '48204': { lat: 42.3467, lng: -83.1141 },
        '48205': { lat: 42.4014, lng: -83.0458 },
        '48206': { lat: 42.3736, lng: -83.0324 },
        '48207': { lat: 42.3581, lng: -82.9988 },
        '48208': { lat: 42.3320, lng: -83.0699 },
        '48209': { lat: 42.2881, lng: -83.2133 },
        '48210': { lat: 42.2975, lng: -83.1466 },
        '48211': { lat: 42.4228, lng: -83.1466 },
        '48212': { lat: 42.4078, lng: -83.0958 },
        '48213': { lat: 42.3736, lng: -82.9541 },
        '48214': { lat: 42.3189, lng: -82.9988 },
        '48215': { lat: 42.2975, lng: -83.0958 },
        '48216': { lat: 42.2881, lng: -83.1699 },
        '48217': { lat: 42.2639, lng: -83.1966 },
        '48218': { lat: 42.4078, lng: -83.1699 },
        '48219': { lat: 42.3467, lng: -83.1699 },
        '48220': { lat: 42.4384, lng: -83.1699 },
        '48221': { lat: 42.4384, lng: -83.0291 },
        '48222': { lat: 42.2975, lng: -83.0458 },
        '48223': { lat: 42.2639, lng: -83.1466 },
        '48224': { lat: 42.3189, lng: -83.0824 },
        '48225': { lat: 42.3189, lng: -83.1341 },
        '48226': { lat: 42.3292, lng: -83.0458 },
        '48227': { lat: 42.2881, lng: -83.2854 },
        '48228': { lat: 42.2639, lng: -83.2854 }
      };

      const coordinates = detroitZipCodes[zipCode];
      if (coordinates) {
        return {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          accuracy: 1000, // Approximate accuracy for zip code
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting location from zip code:', error);
      return null;
    }
  }

  // Check if location permissions are granted
  async checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
      return 'prompt'; // Assume prompt if permissions API is not available
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return 'prompt';
    }
  }

  // Request location permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      const location = await this.getCurrentLocation();
      return !!location;
    } catch (error) {
      return false;
    }
  }

  // Get nearby services based on location
  async getNearbyServices(
    location: LocationData,
    category?: string,
    radius: number = 25
  ): Promise<any[]> {
    // This would integrate with the Detroit API to find nearby services
    // For now, returning sample data based on Detroit area
    const nearbyServices = [
      {
        id: 'service-1',
        name: 'Detroit MDHHS Office',
        category: 'government',
        address: '3415 E Jefferson Ave, Detroit, MI 48207',
        distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          42.3601,
          -83.0519
        ),
        services: ['SNAP', 'Medicaid', 'Cash Assistance']
      },
      {
        id: 'service-2',
        name: 'Gleaners Community Food Bank',
        category: 'food',
        address: '2131 Beaufait St, Detroit, MI 48207',
        distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          42.3586,
          -83.0458
        ),
        services: ['Food Pantry', 'Mobile Food Pantry']
      }
    ];

    // Filter by category if specified
    const filtered = category 
      ? nearbyServices.filter(service => service.category === category)
      : nearbyServices;

    // Filter by radius and sort by distance
    return filtered
      .filter(service => service.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  // Private helper methods
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied by user';
      case 2:
        return 'Location unavailable';
      case 3:
        return 'Location request timed out';
      default:
        return 'Unknown location error';
    }
  }

  // Get location-based recommendations
  async getLocationBasedRecommendations(userLocation: LocationData): Promise<any[]> {
    const recommendations = [];

    // Distance-based recommendations
    const nearbyOffices = await this.getNearbyServices(userLocation);
    
    for (const office of nearbyOffices) {
      if (office.distance <= 5) { // Within 5 miles
        recommendations.push({
          type: 'nearby_office',
          title: `${office.name} is nearby`,
          description: `This office is only ${office.distance.toFixed(1)} miles away`,
          action: 'View Details',
          priority: 'high'
        });
      }
    }

    // Add transportation recommendations
    recommendations.push({
      type: 'transportation',
      title: 'Transportation Assistance',
      description: 'Find public transit routes and transportation vouchers',
      action: 'Find Transportation',
      priority: 'medium'
    });

    return recommendations;
  }
}

export const geolocationService = new GeolocationService();
export default geolocationService;