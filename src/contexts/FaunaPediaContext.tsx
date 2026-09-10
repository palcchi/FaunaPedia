import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { SearchFilters, Species } from '../types/species';

type State = {
  species: Species[];
  favorites: string[];
  searchQuery: string;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_SPECIES'; payload: Species[] }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: State = {
  species: [],
  favorites: [],
  searchQuery: '',
  filters: {},
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SPECIES':
      return { ...state, species: action.payload };
    case 'ADD_FAVORITE':
      return state.favorites.includes(action.payload)
        ? state
        : { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter((id) => id !== action.payload) };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, searchQuery: '', filters: {} };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

type FaunaPediaContextValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFilteredSpecies: () => Species[];
  clearFilters: () => void;
};

const FaunaPediaContext = createContext<FaunaPediaContextValue | undefined>(undefined);

export function FaunaPediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleFavorite = useCallback(
    (id: string) => {
      dispatch({
        type: state.favorites.includes(id) ? 'REMOVE_FAVORITE' : 'ADD_FAVORITE',
        payload: id,
      });
    },
    [state.favorites]
  );

  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  const getFilteredSpecies = useCallback(() => {
    const query = state.searchQuery.trim().toLowerCase();
    return state.species.filter((species) => {
      const matchesQuery =
        !query ||
        species.name.toLowerCase().includes(query) ||
        species.latin_name.toLowerCase().includes(query) ||
        species.habitat.toLowerCase().includes(query) ||
        species.animal_type.toLowerCase().includes(query);

      const matchesAnimalType =
        !state.filters.animalType ||
        species.animal_type.toLowerCase() === state.filters.animalType.toLowerCase();
      const matchesHabitat =
        !state.filters.habitat ||
        species.habitat.toLowerCase().includes(state.filters.habitat.toLowerCase());
      const matchesConservation =
        !state.filters.conservationStatus ||
        species.conservation_status === state.filters.conservationStatus;
      const matchesActiveTime =
        !state.filters.activeTime ||
        species.active_time.toLowerCase() === state.filters.activeTime.toLowerCase();
      const matchesDiet =
        !state.filters.diet || species.diet.toLowerCase() === state.filters.diet.toLowerCase();

      return matchesQuery && matchesAnimalType && matchesHabitat && matchesConservation && matchesActiveTime && matchesDiet;
    });
  }, [state.species, state.searchQuery, state.filters]);

  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);

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

  return <FaunaPediaContext.Provider value={value}>{children}</FaunaPediaContext.Provider>;
}

export function useFaunaPedia() {
  const context = useContext(FaunaPediaContext);
  if (!context) throw new Error('useFaunaPedia harus digunakan di dalam FaunaPediaProvider');
  return context;
}
