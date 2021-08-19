import {Action, ActionCreator, Dispatch} from 'redux';
import PokemonModel from './pokemon-model';
import {AppState} from '../../app-state-store';
import {isLoadingPokemonDetails} from './pokemon-details-reducer';
import PokemonEndpoints from '../../api/pokemon-endpoints';

export enum PokemonDetailsEvents {
  LoadingPokemonDetails = 'PokemonDetailsEvents.LoadingPokemonDetails',
  CompleteLoadingPokemonDetails = 'PokemonDetailsEvents.CompleteLoadingPokemonDetails',
}

export interface PokemonDetailsAction extends Action {}

export interface CompleteLoadingPokemonDetailsAction
  extends PokemonDetailsAction {
  pokemon?: PokemonModel;
  error?: string;
}

export const loadPokemon: ActionCreator<any> = (idOrName: string) => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    // do not continue when pokemon details have already been loaded
    if (isLoadingPokemonDetails(getState().PokemonDetailsLocalState)) {
      return;
    }

    dispatch({
      type: PokemonDetailsEvents.LoadingPokemonDetails,
    });

    const completeAction: CompleteLoadingPokemonDetailsAction = {
      type: PokemonDetailsEvents.CompleteLoadingPokemonDetails,
    };

    try {
      completeAction.pokemon = await new PokemonEndpoints().get(idOrName);
      return dispatch(completeAction);
    } catch (error) {
      completeAction.error = error.toString();
      return dispatch(completeAction);
    }
  };
};
