export interface Species {
  id: string;
  name: string;
  latin_name: string;
  animal_type: string;
  active_time: string;
  lifespan: string;
  habitat: string;
  diet: string;
  geo_range: string;
  image_link: string;
  conservation_status:
    | 'Least Concern'
    | 'Near Threatened'
    | 'Vulnerable'
    | 'Endangered'
    | 'Critically Endangered'
    | 'Extinct';
  characteristics: {
    length?: string;
    weight?: string;
    top_speed?: string;
    distinctive_feature?: string;
  };
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
}

export interface SearchFilters {
  animalType?: string;
  habitat?: string;
  conservationStatus?: string;
  activeTime?: string;
  diet?: string;
}
