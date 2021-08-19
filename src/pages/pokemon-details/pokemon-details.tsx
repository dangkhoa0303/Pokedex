import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {AppState} from '../../app-state-store';
import {
  isLoadingPokemonDetails,
  PokemonDetailsState,
} from './pokemon-details-reducer';
import {loadPokemon} from './pokemon-details-actions';
import {Headline, Paragraph, Text} from 'react-native-paper';
import {NavigationComponentProps, Options} from 'react-native-navigation';
import PokemonModel from './pokemon-model';

interface PokemonDetailsProps extends NavigationComponentProps {
  // receive from PokemonList page via navigation
  pokemonId: number;
  PokemonDetailsLocalState: PokemonDetailsState;
  loadPokemon: (idOrName: string) => any;
}

const mapStateToProps = (state: AppState) => {
  return {
    PokemonDetailsLocalState: state.PokemonDetailsLocalState,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    loadPokemon: (idOrName: string) => dispatch(loadPokemon(idOrName)),
  };
};

class PokemonDetails extends Component<PokemonDetailsProps, any> {
  // set options to hide appbar
  static options(): Options {
    return {
      topBar: {
        visible: false,
      },
    };
  }

  componentDidMount() {
    this.props.loadPokemon(this.props.pokemonId.toString());
  }

  render() {
    const {PokemonDetailsLocalState} = this.props;
    const pokemon: PokemonModel | undefined = PokemonDetailsLocalState.pokemon;

    if (!pokemon) {
      return null;
    }

    return isLoadingPokemonDetails(PokemonDetailsLocalState) ? null : (
      <View>
        <ScrollView style={styles.scrollView}>
          {/** Pokemon image section */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                height: 200,
                width: 200,
              }}
              source={{
                uri: `${PokemonDetailsLocalState.pokemon?.sprites[0]}`,
              }}
            />
          </View>

          {/** Form section */}
          <View />

          {/** Name section */}
          <View style={[styles.row, styles.centered]}>
            <Image
              style={{width: 24, height: 24}}
              source={{
                uri: 'https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Menu%20Icons/btn_pokeball_white_shadow.png',
              }}
            />
            <View style={{width: 12}} />
            <Headline style={{color: 'white', fontWeight: '400'}}>
              {('00' + pokemon.id).slice(-3) + ' ' + pokemon.name.toUpperCase()}
            </Headline>
          </View>

          {/** Info section */}
          <View
            style={[
              styles.row,
              styles.centered,
              {justifyContent: 'space-between', marginTop: 8},
            ]}>
            <Text style={{color: 'white', fontWeight: '500'}}>
              WEIGHT: {Number(pokemon.weight).toFixed(1)}kg
            </Text>
            <Text style={{color: 'white', fontWeight: '500'}}>
              HEIGHT: {Number(pokemon.height).toFixed(1)}m
            </Text>
            <Text style={{color: 'white', fontWeight: '500'}}>
              {`TYPE: ${pokemon.types[0].toUpperCase()} ${
                pokemon.types.length === 1
                  ? ''
                  : `/${pokemon.types[1].toUpperCase()}`
              }`}
            </Text>
          </View>

          {/** Description section */}
          <View
            style={[
              styles.col,
              {marginTop: 14, marginLeft: 8, marginRight: 8},
            ]}>
            <Text style={styles.sectionTitle}>
              {pokemon.genus.toUpperCase()}
            </Text>
            <View style={{height: 4}} />
            <Paragraph style={{color: '#DEDFFF'}}>
              {pokemon.description}
            </Paragraph>
          </View>

          {/** Divider */}
          <View style={[styles.row, styles.centered]}>
            <View style={styles.divider} />
          </View>

          {/** Evolution section */}
          <View style={[styles.col, styles.centered]}>
            <Text style={styles.sectionTitle}>EVOLUTION</Text>
          </View>
        </ScrollView>

        <ImageBackground
          style={[styles.fixed, styles.container]}
          source={{
            uri: 'https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokedex/ui_bg_purple_02.png',
          }}
        />

        <Image
          style={[styles.fixed, styles.container, {opacity: 0.35}]}
          source={{
            uri: 'https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokedex/Holo_NetPatternBG.png',
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonDetails);

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    backgroundColor: 'transparent',
    paddingLeft: 12,
    paddingRight: 12,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flexDirection: 'column',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 20,
    height: 1,
    width: '80%',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16.5,
    fontWeight: '500',
  },
});
