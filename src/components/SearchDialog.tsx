import { useState, useMemo, useEffect } from 'react';
import { Search, Command, History, Filter, X, ArrowUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../services/localStorageService';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useAdvancedSearch, SearchFilters } from '../hooks/useAdvancedSearch';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  
  const { 
    addToHistory, 
    getRecentSearches, 
    getPopularSearches,
    clearHistory 
  } = useSearchHistory();
  
  const { 
    searchResults, 
    filters, 
    updateFilters, 
    resetFilters,
    isLoading 
  } = useAdvancedSearch(query);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQuery('');
        setShowHistory(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setShowHistory(false);
      setShowFilters(false);
    }
  }, [open]);

  const recentSearches = getRecentSearches(5);
  const popularSearches = getPopularSearches(3);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Project';
      case 'purchase-order': return 'Purchase Order';
      case 'catalog-item': return 'Catalog Item';
      case 'supplier': return 'Supplier';
      case 'warehouse': return 'Warehouse';
      case 'invoice': return 'Invoice';
      case 'shipment-log': return 'Shipment';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-500';
      case 'purchase-order': return 'bg-green-500';
      case 'catalog-item': return 'bg-purple-500';
      case 'supplier': return 'bg-orange-500';
      case 'warehouse': return 'bg-teal-500';
      case 'invoice': return 'bg-red-500';
      case 'shipment-log': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const handleResultClick = (result: any) => {
    addToHistory(query, searchResults.length);
    navigate(result.url);
    setOpen(false);
    setQuery('');
    setShowHistory(false);
    setShowFilters(false);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setShowHistory(false);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    updateFilters(newFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-64 justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search everything...
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search everything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-24"
                autoFocus
                onFocus={() => !query && setShowHistory(true)}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-16 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => {
                    setQuery('');
                    setShowHistory(true);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-3 w-3" />
              </Button>
            </div>
            
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {(filters.types.length > 0 || filters.status?.length || 0 > 0) && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {filters.types.length + (filters.status?.length || 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Search Filters</h4>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content Types</label>
                    <div className="mt-2 space-y-2">
                      {['project', 'purchase-order', 'catalog-item', 'supplier', 'warehouse', 'invoice', 'shipment-log'].map(type => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.types.includes(type)}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...filters.types, type]
                                : filters.types.filter(t => t !== type);
                              handleFilterChange({ types: newTypes });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{getTypeLabel(type)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium">Sort By</label>
                    <div className="mt-2 flex gap-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                        className="flex-1 rounded border px-2 py-1 text-sm"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="date">Date</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Search History */}
        {showHistory && !query.trim() && (recentSearches.length > 0 || popularSearches.length > 0) && (
          <div className="border-t">
            <ScrollArea className="max-h-60">
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                      <Button variant="ghost" size="sm" onClick={clearHistory}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleHistoryClick(item.query)}
                        >
                          <History className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{item.query}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {item.resultsCount} results
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {popularSearches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Popular Searches</h4>
                    <div className="space-y-1">
                      {popularSearches.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleHistoryClick(item.query)}
                        >
                          <Search className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{item.query}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {item.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Search Results */}
        {query.trim() && (
          <div className="border-t">
            <ScrollArea className="max-h-80">
              {isLoading ? (
                <div className="p-6 text-center text-muted-foreground">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="p-2">
                  <div className="mb-2 px-3 py-1 text-xs text-muted-foreground">
                    {searchResults.length} results
                  </div>
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <Badge
                        variant="secondary"
                        className={`${getTypeColor(result.type)} text-white text-xs px-2 py-1 shrink-0`}
                      >
                        {getTypeLabel(result.type)}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      </div>
                      
                      {result.matchScore && (
                        <div className="text-xs text-muted-foreground shrink-0">
                          {Math.round(result.matchScore)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
        
        <div className="px-6 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Press Enter to navigate to first result</span>
              <span>Use filters to refine search</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                  ⌘K
                </kbd>
                <span>to search</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                  Esc
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}