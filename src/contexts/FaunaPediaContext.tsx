import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { SearchFilters, Species } from '../types/species';

export interface FaunaPediaState {
  species: Species[];
  favorites: string[];
  searchQuery: string;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
}

export type FaunaPediaAction =
  | { type: 'SET_SPECIES'; payload: Species[] }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: SearchFilters }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const FAVORITES_KEY = 'faunapedia_favorites';

const initialState: FaunaPediaState = {
  species: [],
  favorites: [],
  searchQuery: '',
  filters: {},
  loading: false,
  error: null,
};

function faunaPediaReducer(
  state: FaunaPediaState,
  action: FaunaPediaAction
): FaunaPediaState {
  switch (action.type) {
    case 'SET_SPECIES':
      return { ...state, species: action.payload };
    case 'ADD_FAVORITE':
      if (state.favorites.includes(action.payload)) return state;
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
}

interface FaunaPediaContextType {
  state: FaunaPediaState;
  dispatch: React.Dispatch<FaunaPediaAction>;
  favorites: string[];
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
  const [favoritesHydrated, setFavoritesHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored && active) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'SET_FAVORITES', payload: parsed });
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        if (active) setFavoritesHydrated(true);
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!favoritesHydrated) return;

    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites)).catch(
      (error) => console.error('Error saving favorites:', error)
    );
  }, [favoritesHydrated, state.favorites]);

  const toggleFavorite = useCallback(
    async (speciesId: string) => {
      dispatch({
        type: state.favorites.includes(speciesId)
          ? 'REMOVE_FAVORITE'
          : 'ADD_FAVORITE',
        payload: speciesId,
      });
    },
    [state.favorites]
  );

  const isFavorite = useCallback(
    (speciesId: string) => state.favorites.includes(speciesId),
    [state.favorites]
  );

  const getFilteredSpecies = useCallback(() => {
    let filtered = [...state.species];

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (species) =>
          species.name.toLowerCase().includes(query) ||
          species.latin_name.toLowerCase().includes(query) ||
          species.animal_type.toLowerCase().includes(query) ||
          species.habitat.toLowerCase().includes(query)
      );
    }

    if (state.filters.animalType && state.filters.animalType !== 'all') {
      const animalType = state.filters.animalType.toLowerCase();
      filtered = filtered.filter(
        (species) => species.animal_type.toLowerCase() === animalType
      );
    }

    if (state.filters.habitat) {
      const habitat = state.filters.habitat.toLowerCase();
      filtered = filtered.filter((species) =>
        species.habitat.toLowerCase().includes(habitat)
      );
    }

    if (state.filters.conservationStatus) {
      filtered = filtered.filter(
        (species) =>
          species.conservation_status === state.filters.conservationStatus
      );
    }

    if (state.filters.activeTime) {
      const activeTime = state.filters.activeTime.toLowerCase();
      filtered = filtered.filter(
        (species) => species.active_time.toLowerCase() === activeTime
      );
    }

    if (state.filters.diet) {
      const diet = state.filters.diet.toLowerCase();
      filtered = filtered.filter(
        (species) => species.diet.toLowerCase() === diet
      );
    }

    return filtered;
  }, [state.species, state.searchQuery, state.filters]);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      favorites: state.favorites,
      toggleFavorite,
      isFavorite,
      getFilteredSpecies,
      clearFilters,
    }),
    [state, toggleFavorite, isFavorite, getFilteredSpecies, clearFilters]
  );

  return (
    <FaunaPediaContext.Provider value={value}>
      {children}
    </FaunaPediaContext.Provider>
  );
}

export function useFaunaPedia() {
  const context = useContext(FaunaPediaContext);

  if (!context) {
    throw new Error(
      'useFaunaPedia must be used within a FaunaPediaProvider'
    );
  }

  return context;
}
