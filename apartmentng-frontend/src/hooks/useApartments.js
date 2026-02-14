import { useState, useEffect } from 'react';
import { getAllApartments } from '../services/apartmentService';

export const useApartments = (filters = {}) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await getAllApartments(filters);
      setApartments(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load apartments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [JSON.stringify(filters)]);

  return { apartments, loading, error, refetch: fetchApartments };
};