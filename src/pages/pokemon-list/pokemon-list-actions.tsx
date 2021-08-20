import {Action, ActionCreator, Dispatch} from 'redux';
import {AppState} from '../../app-state-store';
import PokemonListModel from './pokemon-list-model';
import PokemonEndpoints from '../../api/pokemon-endpoints';
import {isLoadingPokemons, isSearchingPokemon} from './pokemon-list-reducer';
import PokemonModel from '../pokemon-details/pokemon-model';

// events that trigger state changes in PokemonList screen
export enum PokemonListEvents {
  LoadingPokemons = 'PokemonListEvents.LoadingPokemon',
  CompleteLoadingPokemons = 'PokemonListEvents.CompleteLoadingPokemons',
  OnSearchTextChanged = 'PokemonListEvents.OnSearchTextChanged',
  SearchingPokemon = 'PokemonListEvents.SearchingPokemon',
  CompleteSearchingPokemon = 'PokemonListEvents.CompleteSearchingPokemon',
}

// abstract action for PokemonList screen
export interface PokemonListAction extends Action {}

// action to be broadcast when pokemons are loaded (successfully or not)
export interface CompleteLoadingPokemonsAction extends PokemonListAction {
  pokemons: PokemonListModel[];
  error?: string;
}

// action to be broadcast when search text changes its value
export interface SearchTextChangedAction extends PokemonListAction {
  value: string;
}

// action to be broadcast when completing searching for pokemon (successfully or not)
export interface CompleteSearchingPokemonAction extends PokemonListAction {
  pokemon?: PokemonModel;
  error?: string;
}

/**
 * Load pokemons action
 */
export const loadPokemons: ActionCreator<any> = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    const {pokemons} = getState().PokemonListLocalState;

    // don't continue when pokemons are being loaded
    if (isLoadingPokemons(getState().PokemonListLocalState)) {
      return;
    }

    // change state to loading
    dispatch({
      type: PokemonListEvents.LoadingPokemons,
    });

    const completeAction: CompleteLoadingPokemonsAction = {
      type: PokemonListEvents.CompleteLoadingPokemons,
      pokemons: [],
    };

    try {
      // complete loading pokemons
      completeAction.pokemons = await new PokemonEndpoints().list(
        pokemons.length,
      );
      return dispatch(completeAction);
    } catch (error) {
      completeAction.error = error.toString();
      return dispatch(completeAction);
    }
  };
};

/**
 * Listen for search text changes action
 * @param value
 */
export const onSearchTextChanged = (value: string) => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const action: SearchTextChangedAction = {
      type: PokemonListEvents.OnSearchTextChanged,
      value: value,
    };
    return dispatch(action);
  };
};

/**
 * Search pokemon action
 */
export const searchForPokemon = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    const {searchText} = getState().PokemonListLocalState;

    // don't continue when pokemon is being searched
    if (isSearchingPokemon(getState().PokemonListLocalState)) {
      return;
    }

    // change state to searching
    dispatch({
      type: PokemonListEvents.SearchingPokemon,
    });

    const completeAction: CompleteSearchingPokemonAction = {
      type: PokemonListEvents.CompleteSearchingPokemon,
    };

    try {
      // complete searching pokemon
      completeAction.pokemon = await new PokemonEndpoints().get(
        searchText.toLowerCase(),
      );
      return dispatch(completeAction);
    } catch (error) {
      completeAction.error = error.toString();
      return dispatch(completeAction);
    }
  };
};
