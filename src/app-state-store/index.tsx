import {combineReducers} from 'redux';
import pokemonListReducer, {PokemonListState} from '../pages/pokemon-list/pokemon-list-reducer';

export interface AppState {
  PokemonListLocalState: PokemonListState;
}

const appReducer = combineReducers<AppState>({
  PokemonListLocalState: pokemonListReducer,
});

export default appReducer;
