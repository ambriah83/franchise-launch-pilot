import { useState, useEffect } from 'react';
import { localStorageService } from '../services/localStorageService';
import * as mockData from '../data/mockData';

// Initialize localStorage with mock data on first load
export const useInitializeStorage = () => {
  useEffect(() => {
    localStorageService.initializeWithMockData(mockData);
  }, []);
};

// Custom hook for managing data with localStorage persistence
export const useLocalStorageData = <T>(
  key: string,
  getData: () => T[],
  initialData?: T[]
) => {
  const [data, setData] = useState<T[]>(() => {
    const stored = getData();
    return stored.length > 0 ? stored : (initialData || []);
  });

  const refreshData = () => {
    setData(getData());
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    data,
    refreshData,
    setData
  };
};