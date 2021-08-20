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

// state function to check if pokemon details are being loaded
export const isLoadingPokemonDetails = (state: PokemonDetailsState) => {
  return state.loadingPokemonDetails;
};

// state function to check if pokemon details are successfully loaded
export const hasSuccessfullyLoadedPokemonDetails = (
  state: PokemonDetailsState,
) => {
  return !state.loadingPokemonDetails && state.pokemon && !state.error;
};

// state function to check if error happens when loading pokemon details
export const hasErrorLoadingPokemonDetails = (state: PokemonDetailsState) => {
  return !state.loadingPokemonDetails && !state.pokemon && state.error;
};

// PokemonDetails reducer
const pokemonDetailsReducer = (
  state = initialState,
  action: PokemonDetailsAction,
) => {
  switch (action.type) {
    // handle state changes when pokemon details start being loaded
    case PokemonDetailsEvents.LoadingPokemonDetails:
      return {
        ...initialState,
        loadingPokemonDetails: true,
      };
    // handle state changes when completing loading pokemon details
    case PokemonDetailsEvents.CompleteLoadingPokemonDetails:
      const completeLoadingPokemonDetailsAction: CompleteLoadingPokemonDetailsAction =
        action as CompleteLoadingPokemonDetailsAction;
      return {
        ...state,
        loadingPokemonDetails: false,
        pokemon: completeLoadingPokemonDetailsAction.pokemon,
        error: completeLoadingPokemonDetailsAction.error,
      };
    // handle state changes when user selects pokemon sprite mode
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
