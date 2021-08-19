import Api from './api';
import PokemonListModel from '../pages/pokemon-list/pokemon-list-model';

export default class PokemonEndpoints {
  /**
   * List pokemons
   * @param offset
   */
  public async list(offset?: number) {
    try {
      const response: any = await new Api().request('get', '/', {
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
}
