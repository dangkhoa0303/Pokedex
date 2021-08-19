import {Action, ActionCreator, Dispatch} from 'redux';
import {AppState} from '../../app-state-store';
import PokemonListModel from './pokemon-list-model';
import PokemonEndpoints from '../../api/pokemon-endpoints';
import {isLoadingPokemons} from './pokemon-list-reducer';

// events that trigger state changes in Pokemon List
export enum PokemonListEvents {
  LoadingPokemons = 'PokemonListEvents.LoadingPokemon',
  CompleteLoadingPokemons = 'PokemonListEvents.CompleteLoadingPokemons',
}

export interface PokemonListAction extends Action {}

// action to be broadcast when pokemons are loaded (successfully or not)
export interface CompleteLoadingPokemonsAction extends PokemonListAction {
  pokemons: PokemonListModel[];
  error?: string;
}

export const loadPokemons: ActionCreator<any> = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    const {pokemons} = getState().PokemonListLocalState;

    if (isLoadingPokemons(getState().PokemonListLocalState)) {
      return;
    }

    dispatch({
      type: PokemonListEvents.LoadingPokemons,
    });

    const completeAction: CompleteLoadingPokemonsAction = {
      type: PokemonListEvents.CompleteLoadingPokemons,
      pokemons: [],
    };

    try {
      // load pokemons
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
