import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import {
  isInSearchMode,
  isLoadingPokemons,
  isSearchingPokemon,
  PokemonListState,
} from './pokemon-list-reducer';
import {AppState} from '../../app-state-store';
import {ThunkDispatch} from 'redux-thunk';
import {
  loadPokemons,
  onSearchTextChanged,
  searchForPokemon,
} from './pokemon-list-actions';
import {AnyAction} from 'redux';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import PokemonItem from './components/pokemon-item';
import {NavigationComponentProps, Options} from 'react-native-navigation';
import PokemonModel from '../pokemon-details/pokemon-model';

// props interface of this page
interface PokemonListProps extends NavigationComponentProps {
  PokemonListLocalState: PokemonListState;
  loadPokemons: () => any;
  onSearchTextChanged: (value: string) => any;
  searchForPokemon: () => any;
}

const mapStateToProps = (state: AppState) => {
  return {
    PokemonListLocalState: state.PokemonListLocalState,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    loadPokemons: () => dispatch(loadPokemons()),
    onSearchTextChanged: (value: string) =>
      dispatch(onSearchTextChanged(value)),
    searchForPokemon: () => dispatch(searchForPokemon()),
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
    const {
      PokemonListLocalState,
      loadPokemons,
      onSearchTextChanged,
      searchForPokemon,
    } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            height: 25,
          }}
        />

        {/** Search bar */}
        <View>
          <Searchbar
            placeholder="Search for Pokemon"
            value={PokemonListLocalState.searchText}
            onChangeText={onSearchTextChanged}
            onIconPress={() => searchForPokemon()}
            style={{elevation: 0, backgroundColor: '#E8E9EB', borderRadius: 25}}
          />
        </View>

        {/** Indicator - display when searching for pokemon (not loading pokemons list) */}
        {isSearchingPokemon(PokemonListLocalState) ? (
          <ActivityIndicator style={{marginTop: 25}} />
        ) : null}

        <View
          style={{
            height: 25,
          }}
        />

        <FlatList
          numColumns={3}
          data={
            isInSearchMode(PokemonListLocalState)
              ? [PokemonListLocalState.searchedPokemon as PokemonModel]
              : PokemonListLocalState.pokemons
          }
          renderItem={({item}) => (
            <PokemonItem
              key={item.id}
              navigationComponentId={this.props.componentId}
              pokemon={item}
            />
          )}
          // @ts-ignore
          keyExtractor={(item, index) => index}
          // a number which indicates the user's scroll position in relation to how far it is from the end of the
          // visible content, when the user reaches the specified position, the onEndReached callback is triggered
          // e.g., a value of 0.5 will trigger onEndReached when the end of the content is within half
          // the visible length of the list
          onEndReachedThreshold={
            isInSearchMode(PokemonListLocalState) ? -1 : 0.8
          }
          onEndReached={
            isInSearchMode(PokemonListLocalState)
              ? () => {}
              : () => loadPokemons()
          }
          initialNumToRender={21}
          initialScrollIndex={0}
          ListFooterComponent={() => (
            <View
              style={{
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {isLoadingPokemons(PokemonListLocalState) ? (
                <ActivityIndicator />
              ) : null}
            </View>
          )}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonList);

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#E7C9ED',
  },
});
