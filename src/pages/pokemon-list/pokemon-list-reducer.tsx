import {
  CompleteLoadingPokemonsAction,
  PokemonListAction,
  PokemonListEvents,
} from './pokemon-list-actions';
import PokemonListModel from './pokemon-list-model';

// Pokemon List State
export interface PokemonListState {
  loadingPokemons: boolean;
  pokemons: PokemonListModel[];
  error?: string;
}

// initial state
const initialState: PokemonListState = {
  loadingPokemons: false,
  pokemons: [],
};

export const isLoadingPokemons = (state: PokemonListState) => {
  return state.loadingPokemons;
};

// Pokemon List reducer
const pokemonListReducer = (
  state = initialState,
  action: PokemonListAction,
) => {
  switch (action.type) {
    case PokemonListEvents.LoadingPokemons:
      return {
        ...state,
        loadingPokemons: true,
      };
    // handle state changes when pokemons are loaded
    case PokemonListEvents.CompleteLoadingPokemons:
      const completeLoadingPokemonsAction: CompleteLoadingPokemonsAction =
        action as CompleteLoadingPokemonsAction;
      return {
        ...state,
        loadingPokemons: false,
        pokemons: [
          //...state.pokemons,
          ...completeLoadingPokemonsAction.pokemons,
        ],
        error: completeLoadingPokemonsAction.error,
      };
    default:
      return state;
  }
};

export default pokemonListReducer;
