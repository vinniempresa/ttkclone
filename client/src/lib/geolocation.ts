// Geolocation service to detect user's country
export interface GeolocationData {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  ip?: string;
}

class GeolocationService {
  private cachedLocation: GeolocationData | null = null;

  async detectLocation(): Promise<GeolocationData | null> {
    // Check if we already have cached location
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    // Check localStorage cache first
    const cached = localStorage.getItem('user_location');
    const cachedIp = localStorage.getItem('user_location_ip');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 5 minutes old (reduced from 24h for faster updates)
        const cacheTime = localStorage.getItem('user_location_time');
        if (cacheTime) {
          const minutesSinceCache = (Date.now() - parseInt(cacheTime)) / (1000 * 60);
          
          // Fetch current IP to check if it changed
          const currentIpResponse = await fetch('/api/geolocation');
          if (currentIpResponse.ok) {
            const currentData = await currentIpResponse.json();
            const currentIp = currentData.ip;
            
            // Use cache only if:
            // 1. Cache is less than 5 minutes old
            // 2. IP hasn't changed
            if (minutesSinceCache < 5 && cachedIp === currentIp) {
              this.cachedLocation = parsed;
              console.log('🌍 Using cached location:', parsed.country, '(' + parsed.countryCode + ')');
              return parsed;
            } else if (cachedIp !== currentIp) {
              console.log('🔄 IP changed from', cachedIp, 'to', currentIp, '- invalidating cache');
              // IP changed, will re-detect below
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached location');
      }
    }

    try {
      console.log('🔍 Detecting user location...');
      // Use backend endpoint to avoid CORS issues
      const response = await fetch('/api/geolocation');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Geolocation API error:', response.status, errorText);
        throw new Error(`Geolocation API failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('📍 Geolocation response:', data);
      
      if (!data.country || !data.countryCode) {
        console.error('❌ Invalid response data:', data);
        throw new Error('Invalid geolocation response');
      }

      const locationData: GeolocationData = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.region,
        ip: data.ip
      };

      // Cache the result with IP for invalidation
      this.cachedLocation = locationData;
      localStorage.setItem('user_location', JSON.stringify(locationData));
      localStorage.setItem('user_location_ip', data.ip || 'unknown');
      localStorage.setItem('user_location_time', Date.now().toString());

      console.log('✅ Location detected:', locationData.country, '(' + locationData.countryCode + ')');
      return locationData;
    } catch (error) {
      console.error('❌ Failed to detect location:', error instanceof Error ? error.message : String(error), error);
      return null;
    }
  }

  getCachedLocation(): GeolocationData | null {
    return this.cachedLocation;
  }

  clearCache(): void {
    this.cachedLocation = null;
    localStorage.removeItem('user_location');
    localStorage.removeItem('user_location_ip');
    localStorage.removeItem('user_location_time');
    console.log('🗑️ Geolocation cache cleared');
  }
}

// Função para limpar cache (útil para testes)
if (typeof window !== 'undefined') {
  (window as any).clearGeoCache = () => {
    geolocationService.clearCache();
    console.log('✅ Cache cleared! Reload the page to detect location again.');
  };
}

export const geolocationService = new GeolocationService();
