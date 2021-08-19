import {combineReducers} from 'redux';
import pokemonListReducer, {
  PokemonListState,
} from '../pages/pokemon-list/pokemon-list-reducer';
import pokemonDetailsReducer, {
  PokemonDetailsState,
} from '../pages/pokemon-details/pokemon-details-reducer';

export interface AppState {
  PokemonListLocalState: PokemonListState;
  PokemonDetailsLocalState: PokemonDetailsState;
}

const appReducer = combineReducers<AppState>({
  PokemonListLocalState: pokemonListReducer,
  PokemonDetailsLocalState: pokemonDetailsReducer,
});

export default appReducer;
