import PokemonModel from './pokemon-model';
import {
  CompleteLoadingPokemonDetailsAction,
  PokemonDetailsAction,
  PokemonDetailsEvents,
} from './pokemon-details-actions';

export interface PokemonDetailsState {
  loadingPokemonDetails: boolean;
  pokemon?: PokemonModel;
  error?: string;
}

const initialState: PokemonDetailsState = {
  loadingPokemonDetails: false,
};

export const isLoadingPokemonDetails = (state: PokemonDetailsState) => {
  return state.loadingPokemonDetails;
};

const pokemonDetailsReducer = (
  state = initialState,
  action: PokemonDetailsAction,
) => {
  switch (action.type) {
    case PokemonDetailsEvents.LoadingPokemonDetails:
      return {
        ...state,
        loadingPokemonDetails: true,
        pokemon: undefined,
        error: undefined,
      };
    case PokemonDetailsEvents.CompleteLoadingPokemonDetails:
      const completeLoadingPokemonDetailsAction: CompleteLoadingPokemonDetailsAction =
        action as CompleteLoadingPokemonDetailsAction;
      return {
        ...state,
        loadingPokemonDetails: false,
        pokemon: completeLoadingPokemonDetailsAction.pokemon ?? state.pokemon,
        error: completeLoadingPokemonDetailsAction.error ?? state.error,
      };
    default:
      return state;
  }
};

export default pokemonDetailsReducer;
