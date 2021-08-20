import {
  CompleteLoadingPokemonsAction,
  CompleteSearchingPokemonAction,
  PokemonListAction,
  PokemonListEvents,
  SearchTextChangedAction,
} from './pokemon-list-actions';
import PokemonListModel from './pokemon-list-model';
import PokemonModel from '../pokemon-details/pokemon-model';

// Pokemon List State
export interface PokemonListState {
  // state to check if pokemons from list are being loaded
  loadingPokemons: boolean;
  // pokemons from list
  pokemons: PokemonListModel[];
  // search text in Search bar
  searchText: string;
  // pokemon that has been successfully searched has value other than undefined
  searchedPokemon?: PokemonModel;
  // state to check if pokemon is being searched
  searchingPokemon: boolean;
  // error if happens
  error?: string;
}

// initial state
const initialState: PokemonListState = {
  loadingPokemons: false,
  searchText: '',
  searchingPokemon: false,
  pokemons: [],
};

export const isLoadingPokemons = (state: PokemonListState) => {
  return state.loadingPokemons;
};

export const isSearchingPokemon = (state: PokemonListState) => {
  return state.searchingPokemon;
};

export const isInSearchMode = (state: PokemonListState) => {
  return !state.searchingPokemon && !state.error && state.searchedPokemon;
};

// Pokemon List reducer
const pokemonListReducer = (
  state = initialState,
  action: PokemonListAction,
) => {
  switch (action.type) {
    // handle state changes when pokemons start being loaded
    case PokemonListEvents.LoadingPokemons:
      return {
        ...state,
        loadingPokemons: true,
        error: undefined,
      };
    // handle state changes when pokemons are loaded
    case PokemonListEvents.CompleteLoadingPokemons:
      const completeLoadingPokemonsAction: CompleteLoadingPokemonsAction =
        action as CompleteLoadingPokemonsAction;
      return {
        ...state,
        loadingPokemons: false,
        pokemons: [
          ...state.pokemons,
          ...completeLoadingPokemonsAction.pokemons,
        ],
        error: completeLoadingPokemonsAction.error,
      };
    // handle state changes when search text changes
    case PokemonListEvents.OnSearchTextChanged:
      const searchTextChangedAction: SearchTextChangedAction =
        action as SearchTextChangedAction;
      return {
        ...state,
        searchText: searchTextChangedAction.value,
        searchedPokemon:
          searchTextChangedAction.value.trim().length === 0
            ? undefined
            : state.searchedPokemon,
      };
    // handle state changes when searching for pokemon
    case PokemonListEvents.SearchingPokemon:
      return {
        ...state,
        searchingPokemon: true,
        error: undefined,
      };
    // handle state changes when completing search for pokemon
    case PokemonListEvents.CompleteSearchingPokemon:
      const completeSearchingPokemonAction: CompleteSearchingPokemonAction =
        action as CompleteSearchingPokemonAction;
      return {
        ...state,
        searchingPokemon: false,
        searchedPokemon: completeSearchingPokemonAction.pokemon,
        error: completeSearchingPokemonAction.error,
      };
    default:
      return state;
  }
};

export default pokemonListReducer;
