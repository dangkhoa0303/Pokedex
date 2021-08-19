import Api from './api';
import PokemonListModel from '../pages/pokemon-list/pokemon-list-model';
import PokemonModel from '../pages/pokemon-details/pokemon-model';

export default class PokemonEndpoints {
  /**
   * List pokemons
   * @param offset
   */
  public async list(offset?: number) {
    try {
      const response: any = await new Api().request('get', '/pokemon', {
        queryParameters: offset || 0,
      });
      const pokemonResults: any[] = response.data.results;
      const pokemons: PokemonListModel[] = [];
      pokemonResults.forEach(pokemonResult => {
        // split url to get id
        const urlSplits: any[] = pokemonResult.url.split('/');
        // push to pokemons array
        pokemons.push({
          id: Number(urlSplits[urlSplits.length - 2]),
          name: pokemonResult.name,
        });
      });
      return pokemons;
    } catch (error) {
      return error;
    }
  }

  /**
   * Get pokemon details
   * @param idOrName
   */
  public async get(idOrName: string) {
    try {
      const pokemonResponse: any = await new Api().request(
        'get',
        `/pokemon/${idOrName}`,
      );
      const pokemonResult: any = pokemonResponse.data;

      const pokemon: PokemonModel = {
        id: pokemonResult.id,
        name: pokemonResult.name,
        height: pokemonResult.height,
        weight: pokemonResult.weight,
        types: pokemonResult.types.map((item: any) => item.type.name),
        sprites: [],
        genus: 'placeholder',
        description: 'placeholder',
      };

      // populate pokemon sprites
      // front_default always exists
      if (pokemonResult.sprites.hasOwnProperty('front_default')) {
        pokemon.sprites.push(pokemonResult.sprites.front_default);
      }
      // check if default form has shiny
      if (pokemonResult.sprites.hasOwnProperty('front_shiny')) {
        pokemon.sprites.push(pokemonResult.sprites.front_shiny);
      }
      // check if the pokemon has gender (male is always a default one, so we only need to check for female one)
      if (pokemonResult.sprites.hasOwnProperty('front_female')) {
        pokemon.sprites.push(pokemonResult.sprites.front_female);
      }
      // check if female form has shiny
      if (pokemonResult.sprites.hasOwnProperty('front_shiny_female')) {
        pokemon.sprites.push(pokemonResult.sprites.front_shiny_female);
      }

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
      return pokemon;
    } catch (error) {
      return error;
    }
  }
}
