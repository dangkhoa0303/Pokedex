import PokemonModel from './pokemon-model';
import {
  CompleteLoadingPokemonDetailsAction,
  PokemonDetailsAction,
  PokemonDetailsEvents,
  SelectSpriteModeAction,
} from './pokemon-details-actions';

export interface PokemonDetailsState {
  loadingPokemonDetails: boolean;
  pokemon?: PokemonModel;
  spriteMode:
    | 'frontDefault'
    | 'frontShiny'
    | 'frontFemale'
    | 'frontShinyFemale';
  error?: string;
}

const initialState: PokemonDetailsState = {
  loadingPokemonDetails: false,
  spriteMode: 'frontDefault',
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
        ...initialState,
        loadingPokemonDetails: true,
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
    case PokemonDetailsEvents.SelectSpriteMode:
      const selectSpriteModeAction: SelectSpriteModeAction =
        action as SelectSpriteModeAction;
      return {
        ...state,
        spriteMode: selectSpriteModeAction.spriteMode,
      };
    default:
      return state;
  }
};

export default pokemonDetailsReducer;
