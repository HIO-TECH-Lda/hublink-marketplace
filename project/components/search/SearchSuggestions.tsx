'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'product' | 'category';
  count?: number;
}

interface SearchSuggestionsProps {
  query: string;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  trendingSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
  onClearRecent: () => void;
  onRemoveRecent: (search: string) => void;
  isVisible: boolean;
}

export default function SearchSuggestions({
  query,
  suggestions,
  recentSearches,
  trendingSearches,
  onSuggestionClick,
  onClearRecent,
  onRemoveRecent,
  isVisible
}: SearchSuggestionsProps) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      const totalItems = suggestions.length + recentSearches.length + trendingSearches.length;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < totalItems - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : totalItems - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            const allItems = [
              ...suggestions,
              ...recentSearches.map(search => ({ id: search, text: search, type: 'recent' as const })),
              ...trendingSearches.map(search => ({ id: search, text: search, type: 'trending' as const }))
            ];
            const selectedItem = allItems[highlightedIndex];
            if (selectedItem) {
              onSuggestionClick(selectedItem.text);
            }
          }
          break;
        case 'Escape':
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, recentSearches, trendingSearches, highlightedIndex, onSuggestionClick]);

  if (!isVisible) return null;

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-gray-4" />;
      case 'product':
        return <Search className="w-4 h-4 text-gray-4" />;
      case 'category':
        return <Search className="w-4 h-4 text-gray-4" />;
      default:
        return <Search className="w-4 h-4 text-gray-4" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Pesquisas recentes';
      case 'trending':
        return 'Tendências';
      case 'product':
        return 'Produtos';
      case 'category':
        return 'Categorias';
      default:
        return 'Sugestões';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderSuggestionItem = (item: SearchSuggestion, index: number) => {
    const isHighlighted = index === highlightedIndex;
    
    return (
      <button
        key={item.id}
        onClick={() => onSuggestionClick(item.text)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-1 transition-colors ${
          isHighlighted ? 'bg-gray-1' : ''
        }`}
        onMouseEnter={() => setHighlightedIndex(index)}
      >
        {getSuggestionIcon(item.type)}
        <span className="flex-1 text-gray-7">
          {highlightText(item.text, query)}
        </span>
        {item.count && (
          <span className="text-xs text-gray-5">({item.count})</span>
        )}
      </button>
    );
  };

  const renderRecentSearch = (search: string, index: number) => {
    const globalIndex = suggestions.length + index;
    const isHighlighted = globalIndex === highlightedIndex;
    
    return (
      <div
        key={search}
        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-1 transition-colors ${
          isHighlighted ? 'bg-gray-1' : ''
        }`}
        onMouseEnter={() => setHighlightedIndex(globalIndex)}
      >
        <Clock className="w-4 h-4 text-gray-4 flex-shrink-0" />
        <button
          onClick={() => onSuggestionClick(search)}
          className="flex-1 text-left text-gray-7"
        >
          {highlightText(search, query)}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveRecent(search);
          }}
          className="text-gray-4 hover:text-gray-6 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderTrendingSearch = (search: string, index: number) => {
    const globalIndex = suggestions.length + recentSearches.length + index;
    const isHighlighted = globalIndex === highlightedIndex;
    
    return (
      <button
        key={search}
        onClick={() => onSuggestionClick(search)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-1 transition-colors ${
          isHighlighted ? 'bg-gray-1' : ''
        }`}
        onMouseEnter={() => setHighlightedIndex(globalIndex)}
      >
        <TrendingUp className="w-4 h-4 text-gray-4" />
        <span className="flex-1 text-gray-7">
          {highlightText(search, query)}
        </span>
      </button>
    );
  };

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 z-50 mt-1">
      <Card className="shadow-lg border border-gray-2">
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-1 border-b border-gray-2">
                <h3 className="text-sm font-medium text-gray-7">
                  {getSuggestionLabel(suggestions[0]?.type)}
                </h3>
              </div>
              {suggestions.map((suggestion, index) => 
                renderSuggestionItem(suggestion, index)
              )}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-1 border-b border-gray-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-7">
                  Pesquisas recentes
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearRecent}
                  className="text-xs text-gray-5 hover:text-gray-7"
                >
                  Limpar
                </Button>
              </div>
              {recentSearches.map((search, index) => 
                renderRecentSearch(search, index)
              )}
            </div>
          )}

          {/* Trending Searches */}
          {trendingSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-1 border-b border-gray-2">
                <h3 className="text-sm font-medium text-gray-7">
                  Tendências
                </h3>
              </div>
              {trendingSearches.map((search, index) => 
                renderTrendingSearch(search, index)
              )}
            </div>
          )}

          {/* No Results */}
          {suggestions.length === 0 && recentSearches.length === 0 && trendingSearches.length === 0 && query && (
            <div className="px-4 py-8 text-center">
              <Search className="w-8 h-8 text-gray-3 mx-auto mb-2" />
              <p className="text-gray-5">Nenhuma sugestão encontrada</p>
            </div>
          )}

          {/* Empty State */}
          {suggestions.length === 0 && recentSearches.length === 0 && trendingSearches.length === 0 && !query && (
            <div className="px-4 py-8 text-center">
              <Search className="w-8 h-8 text-gray-3 mx-auto mb-2" />
              <p className="text-gray-5">Digite para buscar produtos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 