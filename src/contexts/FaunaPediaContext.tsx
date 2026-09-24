import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { SearchFilters, Species } from '../types/species';

interface FaunaPediaState {
  species: Species[];
  favorites: string[];
  searchQuery: string;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
}

type FaunaPediaAction =
  | { type: 'SET_SPECIES'; payload: Species[] }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: SearchFilters }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: FaunaPediaState = {
  species: [],
  favorites: [],
  searchQuery: '',
  filters: {},
  loading: false,
  error: null,
};

const faunaPediaReducer = (
  state: FaunaPediaState,
  action: FaunaPediaAction
): FaunaPediaState => {
  switch (action.type) {
    case 'SET_SPECIES':
      return { ...state, species: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {}, searchQuery: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface FaunaPediaContextType {
  state: FaunaPediaState;
  dispatch: React.Dispatch<FaunaPediaAction>;
  toggleFavorite: (speciesId: string) => Promise<void>;
  isFavorite: (speciesId: string) => boolean;
  getFilteredSpecies: () => Species[];
  clearFilters: () => void;
}

const FaunaPediaContext = createContext<FaunaPediaContextType | undefined>(
  undefined
);

export function FaunaPediaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(faunaPediaReducer, initialState);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (state.favorites.length > 0) {
      saveFavorites();
    }
  }, [state.favorites]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('faunapedia_favorites');
      if (stored) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(
        'faunapedia_favorites',
        JSON.stringify(state.favorites)
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (speciesId: string) => {
    if (state.favorites.includes(speciesId)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: speciesId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: speciesId });
    }
  };

  const isFavorite = (speciesId: string) => {
    return state.favorites.includes(speciesId);
  };

  const getFilteredSpecies = () => {
    console.log('🔍 Filtering species:', {
      totalSpecies: state.species.length,
      searchQuery: state.searchQuery,
      filters: state.filters,
    });

    let filtered = [...state.species];

    if (state.searchQuery && state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (species) =>
          species.name.toLowerCase().includes(query) ||
          species.latin_name.toLowerCase().includes(query) ||
          species.animal_type.toLowerCase().includes(query) ||
          species.habitat.toLowerCase().includes(query)
      );
      console.log('🔍 After search filter:', filtered.length);
    }

    if (state.filters.animalType && state.filters.animalType !== 'all') {
      filtered = filtered.filter(
        (species) =>
          species.animal_type.toLowerCase() ===
          state.filters.animalType?.toLowerCase()
      );
      console.log('🔍 After animal type filter:', filtered.length);
    }

    if (state.filters.habitat) {
      filtered = filtered.filter((species) =>
        species.habitat
          .toLowerCase()
          .includes(state.filters.habitat?.toLowerCase() || '')
      );
      console.log('🔍 After habitat filter:', filtered.length);
    }

    if (state.filters.conservationStatus) {
      filtered = filtered.filter(
        (species) =>
          species.conservation_status === state.filters.conservationStatus
      );
      console.log('🔍 After conservation filter:', filtered.length);
    }

    console.log('🔍 Final filtered species:', filtered.length);
    return filtered;
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const value = {
    state,
    dispatch,
    toggleFavorite,
    isFavorite,
    getFilteredSpecies,
    clearFilters,
  };

  return (
    <FaunaPediaContext.Provider value={value}>
      {children}
    </FaunaPediaContext.Provider>
  );
}

export function useFaunaPedia() {
  const context = useContext(FaunaPediaContext);
  if (context === undefined) {
    throw new Error(
      'useFaunaPedia must be used within a FaunaPediaProvider'
    );
  }
  return context;
}
