import { useState, useEffect } from 'react';

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultsCount: number;
}

const STORAGE_KEY = 'franchise_search_history';
const MAX_HISTORY_ITEMS = 50;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(withDates);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [history]);

  const addToHistory = (query: string, resultsCount: number) => {
    if (!query.trim()) return;

    setHistory(prev => {
      // Remove any existing entry with the same query
      const filtered = prev.filter(item => item.query !== query);
      
      // Add new entry at the beginning
      const newHistory = [
        { query, timestamp: new Date(), resultsCount },
        ...filtered
      ];
      
      // Limit to MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => prev.filter(item => item.query !== query));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getRecentSearches = (limit: number = 10) => {
    return history
      .slice(0, limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getPopularSearches = (limit: number = 5) => {
    // Group by query and count occurrences
    const queryCount = history.reduce((acc, item) => {
      acc[item.query] = (acc[item.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and return top queries
    return Object.entries(queryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentSearches,
    getPopularSearches
  };
};