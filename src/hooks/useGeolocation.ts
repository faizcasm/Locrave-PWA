import { useState, useEffect } from 'react';
import { Location } from '../types/global.types';

interface UseGeolocationResult {
  location: Location | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export const useGeolocation = (): UseGeolocationResult => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to retrieve location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setLoading(false);

        // Fallback to default location
        const defaultLat = parseFloat(import.meta.env.VITE_DEFAULT_LATITUDE || '0');
        const defaultLng = parseFloat(import.meta.env.VITE_DEFAULT_LONGITUDE || '0');
        setLocation({ latitude: defaultLat, longitude: defaultLng });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { location, error, loading, refetch: fetchLocation };
};
