import {Evolution} from '../pages/pokemon-details/pokemon-model';

/**
 * Get id from PokeApi url which has the following format:
 * https://pokeapi.co/api/v2/endpoint/{id}/
 * @param url
 */
export const getIdFromPokeApiUrl = (url: string) => {
  return url.split('/')[url.split('/').length - 2];
};

/**
 * Function to flatten evolution chain
 * @param evoChain
 */
export const flattenEvolutionChain = (evoChain: any): Evolution[][] => {
  let flattenedEvoChain: any[] = [];

  const iter =
    (temp: any) =>
    // @ts-ignore
    ({species, evolves_to = []}) =>
      evolves_to.length
        ? evolves_to.forEach(
            iter(
              temp.concat({
                pokemonId: -1, // placeholder
                species: species.name,
                speciesId: getIdFromPokeApiUrl(species.url),
                sprite: 'placeholder',
              }),
            ),
          )
        : flattenedEvoChain.push(
            temp.concat({
              pokemonId: -1, // placeholder
              species: species.name,
              speciesId: getIdFromPokeApiUrl(species.url),
              sprite: 'placeholder',
            }),
          );

  [evoChain].forEach(iter([]));
  return flattenedEvoChain;
};
