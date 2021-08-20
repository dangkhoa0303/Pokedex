import Api from './api';
import PokemonListModel from '../pages/pokemon-list/pokemon-list-model';
import PokemonModel, {Evolution} from '../pages/pokemon-details/pokemon-model';
import {flattenEvolutionChain, getIdFromPokeApiUrl} from '../utils/utils';

export default class PokemonEndpoints {
  /**
   * List pokemons
   * @param offset
   */
  public async list(offset?: number) {
    return new Promise(
      async (resolve: (pokemons: PokemonListModel[]) => void, reject) => {
        try {
          // query list of pokemons from /pokemon endpoint
          const response: any = await new Api().request('get', '/pokemon', {
            queryParameters: {
              // offset = index to the next page (pagination)
              offset: offset || 0,
              // set hard limit for each query
              limit: 21,
            },
          });
          const pokemonResults: any[] = response.data.results;
          const pokemons: PokemonListModel[] = [];
          pokemonResults.forEach(pokemonResult => {
            // push to pokemons array
            pokemons.push({
              id: Number(getIdFromPokeApiUrl(pokemonResult.url)),
              name: pokemonResult.name,
            });
          });
          return resolve(pokemons);
        } catch (error) {
          return reject(error);
        }
      },
    );
  }

  /**
   * Get pokemon details
   * @param idOrName
   */
  public async get(idOrName: string) {
    return new Promise(
      async (resolve: (pokemon: PokemonModel) => void, reject) => {
        try {
          // query pokemon from /pokemon endpoint
          const pokemonResponse: any = await new Api().request(
            'get',
            `/pokemon/${idOrName}`,
          );
          const pokemonResult: any = pokemonResponse.data;

          const pokemon: PokemonModel = {
            id: pokemonResult.id,
            name: pokemonResult.name,
            species: pokemonResult.species.name,
            height: pokemonResult.height,
            weight: pokemonResult.weight,
            types: pokemonResult.types.map((item: any) => item.type.name),
            sprites: {
              frontDefault: 'placeholder',
            }, // placeholder - to be populated later
            isGenderless: true, // placeholder - to be populated later
            genus: 'placeholder', // placeholder - to be populated later
            description: 'placeholder', // placeholder - to be populated later
            evolutionChains: [], // placeholder - to be populated later
          };

          // query pokemon-species from /pokemon-species endpoint
          const speciesResponse: any = await new Api().request(
            'get',
            `/pokemon-species/${idOrName}`,
          );
          const speciesResult: any = speciesResponse.data;

          // populate genus
          speciesResult.genera.forEach((item: any) => {
            if (item.language.name === 'en') {
              pokemon.genus = item.genus;
            }
          });

          // populate description
          speciesResult.flavor_text_entries.forEach((item: any) => {
            if (item.language.name === 'en') {
              pokemon.description = item.flavor_text;
            }
          });

          // populate isGenderless
          pokemon.isGenderless = speciesResult.gender_rate === -1;

          // populate pokemon sprites
          // front_default always exists (normal male = default)
          pokemon.sprites.frontDefault = pokemonResult.sprites.front_default;
          // check if default form has shiny
          if (pokemonResult.sprites.hasOwnProperty('front_shiny')) {
            pokemon.sprites.frontShiny = pokemonResult.sprites.front_shiny;
          }
          // check if the pokemon has gender (male is always a default one, so we only need to check for female one)
          // if pokemon doesn't have sprite for front_female, it means this pokemon is either genderless or has not differences between male and female
          if (
            pokemonResult.sprites.hasOwnProperty('front_female') &&
            pokemonResult.sprites.front_female !== null
          ) {
            pokemon.sprites.frontFemale = pokemonResult.sprites.front_female;
          }
          // therefore, female sprite is the same as male sprite
          else if (!pokemon.isGenderless) {
            pokemon.sprites.frontFemale = pokemon.sprites.frontDefault;
          }
          // check if female form has shiny
          if (
            pokemonResult.sprites.hasOwnProperty('front_shiny_female') &&
            pokemonResult.sprites.front_shiny_female !== null
          ) {
            pokemon.sprites.frontShinyFemale =
              pokemonResult.sprites.front_shiny_female;
          } else if (!pokemon.isGenderless) {
            pokemon.sprites.frontShinyFemale = pokemon.sprites.frontShiny;
          }

          // get evolution chain url
          const evoChainUrl: string = speciesResult.evolution_chain.url;
          // extract evolution chain id (this id is not related pokemon id)
          const evoChainId: string = getIdFromPokeApiUrl(evoChainUrl);

          // query evolution chains from /evolution-chain endpoint
          const evoChainResponse: any = await new Api().request(
            'get',
            `/evolution-chain/${evoChainId}`,
          );
          const evoChainResult: any = evoChainResponse.data.chain;

          // flatten evolution chains --> make it easier to process in the UI
          const flattenedEvoChains: Evolution[][] =
            flattenEvolutionChain(evoChainResult);

          // query pokemon id associated with each evolution which is not included in the api in the first call
          await Promise.all(
            flattenedEvoChains.map(evoChain => {
              return new Promise(async (resolve1, _) => {
                await Promise.all(
                  evoChain.map(evo => {
                    return new Promise(async (resolve2, _1) => {
                      const evoPokemonResponse: any = await new Api().request(
                        'get',
                        `/pokemon/${evo.species}`,
                      );
                      // get id
                      evo.pokemonId = Number(evoPokemonResponse.data.id);
                      // get default sprite
                      evo.sprite =
                        evoPokemonResponse.data.sprites.front_default;
                      return resolve2(flattenedEvoChains);
                    });
                  }),
                );
                return resolve1(flattenedEvoChains);
              });
            }),
          );

          // populate evolution chains
          pokemon.evolutionChains = flattenedEvoChains;
          return resolve(pokemon);
        } catch (error) {
          return reject(error);
        }
      },
    );
  }
}
