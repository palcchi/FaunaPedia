import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Species } from '../types/species';
import MockDataService, { mockSpeciesData } from './MockData';

class FaunaService {
  private cacheKeys = {
    species: 'faunapedia_species',
    lastUpdate: 'faunapedia_last_update',
  };

  async getAllSpecies(): Promise<Species[]> {
    try {
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        return await this.getCachedSpecies();
      }

      const lastUpdate = await AsyncStorage.getItem(this.cacheKeys.lastUpdate);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (lastUpdate && now - parseInt(lastUpdate) < oneHour) {
        const cached = await this.getCachedSpecies();
        if (cached.length > 0) return cached;
      }

      const allSpecies = await MockDataService.getAllSpecies();

      await AsyncStorage.setItem(
        this.cacheKeys.species,
        JSON.stringify(allSpecies)
      );
      await AsyncStorage.setItem(this.cacheKeys.lastUpdate, now.toString());

      return allSpecies;
    } catch (error) {
      console.error('Service Error:', error);
      return mockSpeciesData;
    }
  }

  private async getCachedSpecies(): Promise<Species[]> {
    try {
      const cached = await AsyncStorage.getItem(this.cacheKeys.species);
      if (cached) {
        return JSON.parse(cached);
      }
      return mockSpeciesData;
    } catch {
      return mockSpeciesData;
    }
  }

  async searchSpecies(query: string, filters?: any): Promise<Species[]> {
    return MockDataService.searchSpecies(query, filters);
  }

  async getSpeciesById(id: string): Promise<Species | null> {
    return MockDataService.getSpeciesById(id);
  }

  async getSpeciesByType(animalType: string): Promise<Species[]> {
    return MockDataService.getSpeciesByType(animalType);
  }

  async getRandomSpecies(count: number = 10): Promise<Species[]> {
    return MockDataService.getRandomSpecies(count);
  }

  // Compatibility alias for older screen code in this repository.
  async getSpecies(): Promise<Species[]> {
    return this.getAllSpecies();
  }
}

export default new FaunaService();
