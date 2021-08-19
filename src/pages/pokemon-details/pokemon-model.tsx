export default interface PokemonModel {
  id: number;
  name: string;
  height: number;
  weight: number;
  // must query pokemon-species endpoint to achieve this
  genus: string;
  // must query pokemon-species endpoint to achieve this
  description: string;
  types: string[];
  // normal and shiny + gender (if has)
  sprites: string[];
}

export interface EvolutionChain {
  name: string;
  evolvesTo: EvolutionChain[];
}
