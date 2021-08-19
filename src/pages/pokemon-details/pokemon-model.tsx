export default interface PokemonModel {
  // pokedex number (nationally) of the pokemon
  id: number;
  name: string;
  species: string;
  height: number;
  weight: number;
  // must query pokemon-species endpoint to achieve this
  genus: string;
  // must query pokemon-species endpoint to achieve this
  description: string;
  types: string[];
  // normal and shiny + gender (if has)
  sprites: {
    frontDefault: string;
    frontShiny?: string;
    frontFemale?: string;
    frontShinyFemale?: string;
  };
  isGenderless: boolean;
  evolutionChains: Evolution[][];
}

export interface Evolution {
  // pokedex number (nationally) of the pokemon
  pokemonId: number;
  species: string;
  speciesId: number;
  sprite: string;
}
