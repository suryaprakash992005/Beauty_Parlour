import { useState, useEffect } from 'react';
import { getServices, getCategories } from '../services/serviceApi';
import type { ServiceItem } from '../services/services';

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [servicesData, categoriesData] = await Promise.all([
        getServices(),
        getCategories()
      ]);

      // Only display active services on customer front-end
      setServices(servicesData.filter(s => s.active !== false));
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Failed to load services:', err);
      setError(err?.message || 'Unable to load services at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return { services, categories, loading, error, refetch: fetchAllData };
}
