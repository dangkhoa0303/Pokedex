import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-native-paper';
import {isLoadingPokemons, PokemonListState} from './pokemon-list-reducer';
import {AppState} from '../../app-state-store';
import {ThunkDispatch} from 'redux-thunk';
import {loadPokemons} from './pokemon-list-actions';
import {AnyAction} from 'redux';
import {FlatList} from 'react-native';
import PokemonItem from './components/pokemon-item';
import {NavigationComponentProps, Options} from 'react-native-navigation';

// props interface of this page
interface PokemonListProps extends NavigationComponentProps {
  PokemonListLocalState: PokemonListState;
  loadPokemons: () => any;
}

const mapStateToProps = (state: AppState) => {
  return {
    PokemonListLocalState: state.PokemonListLocalState,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    loadPokemons: () => dispatch(loadPokemons()),
  };
};

class PokemonList extends Component<PokemonListProps, any> {
  // set options to hide appbar
  static options(): Options {
    return {
      topBar: {
        visible: false,
      },
    };
  }

  componentDidMount() {
    // load pokemons when components are mounted
    this.props.loadPokemons();
  }

  render() {
    const {PokemonListLocalState} = this.props;

    return (
      <>
        {/** Pokemon list -- display when pokemons are loaded */}
        {isLoadingPokemons(PokemonListLocalState) ? (
          <Text>Loading ...</Text>
        ) : (
          <FlatList
            numColumns={3}
            data={PokemonListLocalState.pokemons}
            renderItem={({item}) => (
              <PokemonItem
                navigationComponentId={this.props.componentId}
                pokemon={item}
              />
            )}
            // @ts-ignore
            keyExtractor={(item, index) => index}
            style={{
              backgroundColor: '#E7CDEA85',
            }}
          />
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonList);
