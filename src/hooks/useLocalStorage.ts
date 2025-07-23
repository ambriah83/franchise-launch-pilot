import { useState, useEffect } from 'react';
import { localStorageService } from '../services/localStorageService';
import * as mockData from '../data/mockData';

// Initialize localStorage with mock data on first load
export const useInitializeStorage = () => {
  useEffect(() => {
    localStorageService.initializeWithMockData(mockData);
  }, []);
};

// Enhanced hook for managing data with localStorage persistence and real-time updates
export const useLocalStorageData = <T>(
  key: string,
  getData: () => T[],
  initialData?: T[]
) => {
  const [data, setData] = useState<T[]>(() => {
    const stored = getData();
    return stored.length > 0 ? stored : (initialData || []);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newData = getData();
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data when localStorage changes (from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  useEffect(() => {
    refreshData();
  }, []);

  return {
    data,
    refreshData,
    setData,
    isLoading,
    error
  };
};

// Hook for optimistic updates
export const useOptimisticUpdate = <T extends { id: string }>(
  data: T[],
  updateFn: (id: string, updates: Partial<T>) => Promise<T | null>
) => {
  const [optimisticData, setOptimisticData] = useState(data);

  useEffect(() => {
    setOptimisticData(data);
  }, [data]);

  const optimisticUpdate = async (id: string, updates: Partial<T>) => {
    // Apply optimistic update immediately
    setOptimisticData(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );

    try {
      // Perform actual update
      const result = await updateFn(id, updates);
      if (!result) {
        // Revert on failure
        setOptimisticData(data);
        throw new Error('Update failed');
      }
      return result;
    } catch (error) {
      // Revert on error
      setOptimisticData(data);
      throw error;
    }
  };

  return {
    data: optimisticData,
    optimisticUpdate
  };
};

// Hook for data caching with expiration
export const useCachedData = <T>(
  key: string,
  fetchFn: () => T[],
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchData = async (force: boolean = false) => {
    const now = Date.now();
    if (!force && lastFetch && (now - lastFetch) < ttl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const newData = fetchFn();
      setData(newData);
      setLastFetch(now);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    refresh: () => fetchData(true)
  };
};