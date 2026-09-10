import { Species } from '../types/species';
import MockData, { mockSpeciesData } from './MockData';

const FaunaService = {
  getSpecies: async (): Promise<Species[]> => MockData.getAllSpecies(),
  getAllSpecies: async (): Promise<Species[]> => MockData.getAllSpecies(),
  getRandomSpecies: async (count: number = 10): Promise<Species[]> => MockData.getRandomSpecies(count),
  getSpeciesById: async (id: string): Promise<Species | null> => MockData.getSpeciesById(id),
  getSpeciesByType: async (animalType: string): Promise<Species[]> => MockData.getSpeciesByType(animalType),
  searchSpecies: async (query: string, filters?: any): Promise<Species[]> => MockData.searchSpecies(query, filters),
  getMockData: (): Species[] => mockSpeciesData,
};

export default FaunaService;
