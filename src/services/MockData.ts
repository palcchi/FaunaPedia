import { Species } from '../types/species';

export const mockSpeciesData: Species[] = [
  {
    id: 'lion_001',
    name: 'Lion',
    latin_name: 'Panthera leo',
    animal_type: 'Mammal',
    active_time: 'Crepuscular',
    lifespan: '10-14 years',
    habitat: 'Savannas, grasslands, and open woodlands',
    diet: 'Carnivore',
    geo_range: 'Sub-Saharan Africa',
    image_link: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800',
    conservation_status: 'Vulnerable',
    characteristics: { length: '1.4-2.5 meters', weight: '120-190 kg', top_speed: '80 km/h', distinctive_feature: 'Mane (males), powerful roar' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Carnivora', family: 'Felidae', genus: 'Panthera', species: 'P. leo' },
  },
  {
    id: 'elephant_001',
    name: 'African Elephant',
    latin_name: 'Loxodonta africana',
    animal_type: 'Mammal',
    active_time: 'Diurnal',
    lifespan: '60-70 years',
    habitat: 'Savannas, forests, deserts, and marshes',
    diet: 'Herbivore',
    geo_range: 'Sub-Saharan Africa',
    image_link: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    conservation_status: 'Endangered',
    characteristics: { length: '6-7 meters', weight: '4000-7000 kg', top_speed: '40 km/h', distinctive_feature: 'Large ears, trunk, tusks' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Proboscidea', family: 'Elephantidae', genus: 'Loxodonta', species: 'L. africana' },
  },
  {
    id: 'tiger_001',
    name: 'Tiger',
    latin_name: 'Panthera tigris',
    animal_type: 'Mammal',
    active_time: 'Nocturnal',
    lifespan: '20-26 years',
    habitat: 'Forests, grasslands, and mangrove swamps',
    diet: 'Carnivore',
    geo_range: 'Asia',
    image_link: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
    conservation_status: 'Endangered',
    characteristics: { length: '2.5-3.9 meters', weight: '65-320 kg', top_speed: '65 km/h', distinctive_feature: 'Orange coat with black stripes' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Carnivora', family: 'Felidae', genus: 'Panthera', species: 'P. tigris' },
  },
  {
    id: 'eagle_001',
    name: 'Bald Eagle',
    latin_name: 'Haliaeetus leucocephalus',
    animal_type: 'Bird',
    active_time: 'Diurnal',
    lifespan: '20-30 years',
    habitat: 'Near large bodies of open water',
    diet: 'Carnivore',
    geo_range: 'North America',
    image_link: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    conservation_status: 'Least Concern',
    characteristics: { length: '70-102 cm', weight: '3-6.3 kg', top_speed: '160 km/h', distinctive_feature: 'White head and tail, hooked beak' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Aves', order: 'Accipitriformes', family: 'Accipitridae', genus: 'Haliaeetus', species: 'H. leucocephalus' },
  },
  {
    id: 'penguin_001',
    name: 'Emperor Penguin',
    latin_name: 'Aptenodytes forsteri',
    animal_type: 'Bird',
    active_time: 'Diurnal',
    lifespan: '15-20 years',
    habitat: 'Antarctic ice and surrounding waters',
    diet: 'Carnivore',
    geo_range: 'Antarctica',
    image_link: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800',
    conservation_status: 'Near Threatened',
    characteristics: { length: '100-130 cm', weight: '22-45 kg', top_speed: '8 km/h (swimming: 9 km/h)', distinctive_feature: 'Largest penguin species, distinctive yellow markings' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Aves', order: 'Sphenisciformes', family: 'Spheniscidae', genus: 'Aptenodytes', species: 'A. forsteri' },
  },
  {
    id: 'turtle_001',
    name: 'Green Sea Turtle',
    latin_name: 'Chelonia mydas',
    animal_type: 'Reptile',
    active_time: 'Diurnal',
    lifespan: '80+ years',
    habitat: 'Tropical and subtropical waters worldwide',
    diet: 'Herbivore',
    geo_range: 'Tropical and subtropical oceans worldwide',
    image_link: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    conservation_status: 'Endangered',
    characteristics: { length: '0.9-1.2 meters', weight: '68-190 kg', top_speed: '35 km/h', distinctive_feature: 'Heart-shaped shell, flippers' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Testudines', family: 'Cheloniidae', genus: 'Chelonia', species: 'C. mydas' },
  },
  {
    id: 'iguana_001',
    name: 'Green Iguana',
    latin_name: 'Iguana iguana',
    animal_type: 'Reptile',
    active_time: 'Diurnal',
    lifespan: '12-20 years',
    habitat: 'Rainforests, lowlands, and coastal areas',
    diet: 'Herbivore',
    geo_range: 'Central and South America',
    image_link: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
    conservation_status: 'Least Concern',
    characteristics: { length: '1.2-2 meters', weight: '4-8 kg', top_speed: '35 km/h', distinctive_feature: 'Spinal crest, dewlap, third eye' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Iguanidae', genus: 'Iguana', species: 'I. iguana' },
  },
  {
    id: 'shark_001',
    name: 'Great White Shark',
    latin_name: 'Carcharodon carcharias',
    animal_type: 'Fish',
    active_time: 'Crepuscular',
    lifespan: '70+ years',
    habitat: 'Coastal and offshore waters',
    diet: 'Carnivore',
    geo_range: 'Worldwide in temperate coastal waters',
    image_link: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800',
    conservation_status: 'Vulnerable',
    characteristics: { length: '3.4-6.1 meters', weight: '522-2268 kg', top_speed: '56 km/h', distinctive_feature: 'Triangular teeth, torpedo-shaped body' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Chondrichthyes', order: 'Lamniformes', family: 'Lamnidae', genus: 'Carcharodon', species: 'C. carcharias' },
  },
  {
    id: 'clownfish_001',
    name: 'Clownfish',
    latin_name: 'Amphiprion ocellatus',
    animal_type: 'Fish',
    active_time: 'Diurnal',
    lifespan: '6-10 years',
    habitat: 'Coral reefs and lagoons',
    diet: 'Omnivore',
    geo_range: 'Indo-Pacific',
    image_link: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
    conservation_status: 'Least Concern',
    characteristics: { length: '7.5-16 cm', weight: '90-120 g', top_speed: '8 km/h', distinctive_feature: 'Bright orange with white bands, symbiotic with anemones' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Perciformes', family: 'Pomacentridae', genus: 'Amphiprion', species: 'A. ocellatus' },
  },
  {
    id: 'panda_001',
    name: 'Giant Panda',
    latin_name: 'Ailuropoda melanoleuca',
    animal_type: 'Mammal',
    active_time: 'Crepuscular',
    lifespan: '18-20 years',
    habitat: 'Temperate broadleaf and mixed forests',
    diet: 'Herbivore',
    geo_range: 'Central China',
    image_link: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?w=800',
    conservation_status: 'Vulnerable',
    characteristics: { length: '1.2-1.9 meters', weight: '70-120 kg', top_speed: '32 km/h', distinctive_feature: 'Black and white fur, round face' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Carnivora', family: 'Ursidae', genus: 'Ailuropoda', species: 'A. melanoleuca' },
  },
  {
    id: 'giraffe_001',
    name: 'Giraffe',
    latin_name: 'Giraffa camelopardalis',
    animal_type: 'Mammal',
    active_time: 'Diurnal',
    lifespan: '20-25 years',
    habitat: 'Savannas, grasslands, and open woodlands',
    diet: 'Herbivore',
    geo_range: 'Africa',
    image_link: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800',
    conservation_status: 'Vulnerable',
    characteristics: { length: '4.25-5.7 meters (height)', weight: '750-1930 kg', top_speed: '60 km/h', distinctive_feature: 'Extremely long neck and legs, spotted pattern' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Artiodactyla', family: 'Giraffidae', genus: 'Giraffa', species: 'G. camelopardalis' },
  },
  {
    id: 'dolphin_001',
    name: 'Bottlenose Dolphin',
    latin_name: 'Tursiops truncatus',
    animal_type: 'Mammal',
    active_time: 'Diurnal',
    lifespan: '40-60 years',
    habitat: 'Coastal and offshore waters',
    diet: 'Carnivore',
    geo_range: 'Worldwide in temperate and tropical waters',
    image_link: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    conservation_status: 'Least Concern',
    characteristics: { length: '2-4 meters', weight: '150-650 kg', top_speed: '37 km/h', distinctive_feature: 'Bottle-shaped snout, high intelligence' },
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia', order: 'Cetacea', family: 'Delphinidae', genus: 'Tursiops', species: 'T. truncatus' },
  },
];

export default {
  getAllSpecies: async (): Promise<Species[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockSpeciesData;
  },
  getRandomSpecies: async (count: number = 10): Promise<Species[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const shuffled = [...mockSpeciesData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
  getSpeciesById: async (id: string): Promise<Species | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSpeciesData.find((species) => species.id === id) || null;
  },
  getSpeciesByType: async (animalType: string): Promise<Species[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSpeciesData.filter((species) => species.animal_type.toLowerCase() === animalType.toLowerCase());
  },
  searchSpecies: async (query: string, filters?: any): Promise<Species[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = mockSpeciesData.filter(
      (species) =>
        species.name.toLowerCase().includes(query.toLowerCase()) ||
        species.latin_name.toLowerCase().includes(query.toLowerCase()) ||
        species.animal_type.toLowerCase().includes(query.toLowerCase())
    );
    if (filters?.animalType) filtered = filtered.filter((s) => s.animal_type.toLowerCase() === filters.animalType.toLowerCase());
    if (filters?.habitat) filtered = filtered.filter((s) => s.habitat.toLowerCase().includes(filters.habitat.toLowerCase()));
    if (filters?.conservationStatus) filtered = filtered.filter((s) => s.conservation_status === filters.conservationStatus);
    return filtered;
  },
};
