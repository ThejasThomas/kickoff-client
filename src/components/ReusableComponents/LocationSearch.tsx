import { MapPin, Search, X, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface NominatimSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    state?: string;
    country?: string;
  };
}

interface Location {
  display_name: string;
  lat: number;
  lon: number;
}

interface Props {
  onSelect: (location: Location) => void;
  placeholder?: string;
  value?: string;
  onChange?: (query: string) => void;
}

const LocationSearch: React.FC<Props> = ({ 
  onSelect, 
  placeholder = "Search location...", 
  value = "",
  onChange 
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const searchLocations = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      console.log('⚠️ Query too short:', trimmedQuery.length, 'chars');
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    console.log('🔍 Starting search for:', trimmedQuery);
    
    try {
      // Build the URL with proper parameters
      const params = new URLSearchParams({
        format: 'json',
        q: trimmedQuery,
        limit: '10',
        addressdetails: '1',
        countrycodes: 'in',
        'accept-language': 'en',
      });

      const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
      
      console.log('🌐 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: NominatimSuggestion[] = await response.json();
      console.log('✅ Raw API response:', data);
      console.log('📊 Total results:', data.length);
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('🎉 Setting', data.length, 'suggestions');
        console.log('📍 Sample result:', {
          name: data[0].display_name,
          lat: data[0].lat,
          lon: data[0].lon
        });
        
        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedIndex(-1);
        setError(null);
      } else {
        console.log('⚠️ Empty results array');
        setSuggestions([]);
        setShowSuggestions(true);
        setError(null);
      }
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        console.log('⏹️ Request aborted');
        return;
      }
      
      console.error('❌ Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      setError("Failed to load suggestions");
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 3) {
      setLoading(true);
      console.log('⏳ Debouncing search for:', trimmedQuery);
      
      debounceTimer.current = setTimeout(() => {
        searchLocations(trimmedQuery);
      }, 700);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setLoading(false);
      if (trimmedQuery.length > 0) {
        console.log('ℹ️ Need at least 3 characters');
      }
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelect = (suggestion: NominatimSuggestion) => {
    const location: Location = {
      display_name: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    };
    
    console.log('✅ Location selected:', location);
    
    setQuery(suggestion.display_name);
    onSelect(location);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    if (onChange) onChange(suggestion.display_name);
  };

  const extractLocationName = (suggestion: NominatimSuggestion): string => {
    const address = suggestion.address;
    if (!address) return suggestion.display_name.split(',')[0].trim();
    
    return address.city || address.town || address.village || suggestion.display_name.split(',')[0].trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('🔤 Input changed to:', `"${newQuery}"`, 'Length:', newQuery.length);
    setQuery(newQuery);
    if (onChange) onChange(newQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleClear = () => {
    console.log('🧹 Clearing search');
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setError(null);
    if (onChange) onChange('');
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        console.log('👆 Clicked outside, closing suggestions');
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log('🔄 Render state:', {
    query: query,
    queryLength: query.length,
    suggestionsCount: suggestions.length,
    showSuggestions,
    loading
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
          onFocus={() => {
            console.log('🎯 Input focused. Current suggestions:', suggestions.length);
            if (suggestions.length > 0 && query.trim().length >= 3) {
              setShowSuggestions(true);
            }
          }}
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Search icon */}
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        {/* Clear button */}
        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-28 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-28 top-1/2 transform -translate-y-1/2 z-10">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          </div>
        )}
      </div>
      
      {/* Helper text */}
      {query.length > 0 && query.length < 3 && !loading && (
        <p className="absolute left-0 -bottom-6 text-xs text-gray-400">
          Type {3 - query.length} more character{3 - query.length !== 1 ? 's' : ''} to search
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute left-0 -bottom-6 text-xs text-red-500 bg-red-50 px-2 py-1 rounded z-50">
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-[9999] w-full bg-white border border-gray-300 rounded-xl shadow-2xl mt-2 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.place_id}-${index}`}
              ref={el => {
                suggestionRefs.current[index] = el;
              }}
              onClick={() => {
                console.log('👆 Clicked suggestion:', suggestion.display_name);
                handleSelect(suggestion);
              }}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-start gap-3 ${
                index === selectedIndex
                  ? 'bg-emerald-50 border-l-4 border-l-emerald-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                index === selectedIndex ? 'text-emerald-600' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {extractLocationName(suggestion)}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {suggestion.display_name}
                </p>
                {suggestion.address?.postcode && (
                  <p className="text-xs text-emerald-600 mt-1">
                    PIN: {suggestion.address.postcode}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && query.trim().length >= 3 && !loading && (
        <div className="absolute z-[9999] w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-2 px-4 py-6 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">No locations found for "{query}"</p>
          <p className="text-xs text-gray-400 mt-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'].map(city => (
              <button
                key={city}
                onClick={() => {
                  setQuery(city);
                  if (onChange) onChange(city);
                }}
                className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;