import { Species } from '../types/species';

const speciesData: Species[] = [
  {
    id: '1',
    name: 'Harimau Sumatra',
    latin_name: 'Panthera tigris sumatrae',
    animal_type: 'Mammal',
    active_time: 'Malam',
    lifespan: '15-20 tahun',
    habitat: 'Hutan hujan tropis Sumatra',
    diet: 'Karnivora',
    geo_range: 'Pulau Sumatra, Indonesia',
    image_link: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5',
    conservation_status: 'Critically Endangered',
    characteristics: {
      length: '2,2-2,5 m',
      weight: '75-140 kg',
      top_speed: '65 km/jam',
      distinctive_feature: 'Subspesies harimau terkecil dengan loreng rapat',
    },
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Mammalia',
      order: 'Carnivora',
      family: 'Felidae',
      genus: 'Panthera',
      species: 'P. tigris',
    },
  },
];

const FaunaService = {
  async getSpecies(): Promise<Species[]> {
    return speciesData;
  },
  async getSpeciesById(id: string): Promise<Species | null> {
    return speciesData.find((species) => species.id === id) ?? null;
  },
};

export default FaunaService;
