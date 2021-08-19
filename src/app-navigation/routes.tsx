import {applyMiddleware, createStore, Store} from 'redux';
import appReducer, {AppState} from '../app-state-store';
import thunk from 'redux-thunk';
import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import PokemonList from '../pages/pokemon-list/pokemon-list';
import PokemonDetails from '../pages/pokemon-details/pokemon-details';

// create app state store to pass in Redux Provider
const appStateStore: Store<AppState> = createStore(
  appReducer,
  applyMiddleware(thunk),
);

// WrapperComponent to wrap component within Redux Provider (state management) and Paper Provider (theme management)
const WrapperComponent = ({
  component: Component,
  ...rest
}: {
  component: React.ComponentType;
}) => (
  <Provider store={appStateStore}>
    <PaperProvider>
      <SafeAreaView>
        <Component {...rest} />
      </SafeAreaView>
    </PaperProvider>
  </Provider>
);

// class to contain all routes --> avoid hard-coding route names
export class Routes {
  public static PokemonList = 'pokemon-list';
  public static PokemonDetails = 'pokemon-details';
}

// register all routes within the app
export const registerScreens = () => {
  // register PokemonList route
  Navigation.registerComponent(
    Routes.PokemonList,
    () => props => <WrapperComponent component={PokemonList} {...props} />,
    () => PokemonList,
  );

  // register PokemonDetails route
  Navigation.registerComponent(
    Routes.PokemonDetails,
    () => props => <WrapperComponent component={PokemonDetails} {...props} />,
    () => PokemonDetails,
  );
};
