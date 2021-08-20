import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {AppState} from '../../app-state-store';
import {
  hasErrorLoadingPokemonDetails,
  hasSuccessfullyLoadedPokemonDetails,
  isLoadingPokemonDetails,
  PokemonDetailsState,
} from './pokemon-details-reducer';
import {loadPokemon, selectSpriteMode} from './pokemon-details-actions';
import {
  ActivityIndicator,
  Button,
  Headline,
  Paragraph,
  Text,
} from 'react-native-paper';
import {NavigationComponentProps, Options} from 'react-native-navigation';
import PokemonModel, {Evolution} from './pokemon-model';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {navigate, popToRoot} from '../../app-navigation/router';
import {Routes} from '../../app-navigation/routes';

interface PokemonDetailsProps extends NavigationComponentProps {
  // receive from PokemonList page via navigation
  pokemonId: number;
  PokemonDetailsLocalState: PokemonDetailsState;
  loadPokemon: (idOrName: string) => any;
  selectSpriteMode: (
    sprite: 'frontDefault' | 'frontShiny' | 'frontFemale' | 'frontShinyFemale',
  ) => any;
}

const mapStateToProps = (state: AppState) => {
  return {
    PokemonDetailsLocalState: state.PokemonDetailsLocalState,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    loadPokemon: (idOrName: string) => dispatch(loadPokemon(idOrName)),
    selectSpriteMode: (
      sprite:
        | 'frontDefault'
        | 'frontShiny'
        | 'frontFemale'
        | 'frontShinyFemale',
    ) => dispatch(selectSpriteMode(sprite)),
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
    // eslint-disable-next-line no-shadow
    const {pokemonId, PokemonDetailsLocalState, loadPokemon, selectSpriteMode} =
      this.props;
    // obtain the pokemon from state
    const pokemon: PokemonModel | undefined = PokemonDetailsLocalState.pokemon;

    if (!pokemon) {
      return null;
    }

    // construct a uiEvolutionChains object to help displaying the evolution chains more easily
    // in this object, there will be a dummy node (evolution) between each pair of pokemons in the chain
    // this dummy node represents the arrow pointing to the next pokemon in the chain
    const uiEvolutionChains: Evolution[][] = [];
    pokemon.evolutionChains.forEach(evoChain => {
      const uiEvoChain: Evolution[] = [];
      evoChain.forEach((evo, index) => {
        uiEvoChain.push(evo);
        if (index < evoChain.length - 1) {
          uiEvoChain.push({
            pokemonId: -1,
            species: 'arrowRight',
            speciesId: 1,
            sprite: 'unknown',
          });
        }
      });
      uiEvolutionChains.push(uiEvoChain);
    });

    return (
      <View style={[styles.container, styles.centered]}>
        {/** Indicator - display when pokemon details are being loaded */}
        {isLoadingPokemonDetails(PokemonDetailsLocalState) ? (
          <ActivityIndicator />
        ) : null}

        {/** Error section - display when pokemon details fail to be loaded */}
        {!hasErrorLoadingPokemonDetails(PokemonDetailsLocalState) ? null : (
          <View style={[styles.col, styles.centered]}>
            <Text style={styles.errorText}>
              Error happens. Please try again!
            </Text>
            <View style={{height: 15}} />
            {/** Button to retry loading pokemons */}
            <Button
              mode="contained"
              color="#FF3333"
              uppercase={false}
              onPress={() => loadPokemon(pokemonId.toString())}>
              Retry
            </Button>
          </View>
        )}

        {/** Pokemon details section - display ONLY when pokemon details are successfully loaded */}
        {!hasSuccessfullyLoadedPokemonDetails(
          PokemonDetailsLocalState,
        ) ? null : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {/** Space from top */}
            <View
              style={{
                height: 20,
              }}
            />

            {/** Pokemon sprite section */}
            <View style={[styles.row, styles.centered]}>
              {/** Pokemon sprite */}
              <Image
                style={styles.mainSpriteImg}
                source={{
                  uri: pokemon.sprites[PokemonDetailsLocalState.spriteMode],
                }}
              />
            </View>

            {/** Sprite modes section */}
            <View style={[styles.row, styles.centered, {marginBottom: 18}]}>
              {pokemon.isGenderless ? (
                <View style={[styles.row, styles.centered]}>
                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontDefault')}>
                    <Image
                      style={
                        PokemonDetailsLocalState.spriteMode === 'frontDefault'
                          ? styles.spriteIconSelected
                          : styles.spriteIcon
                      }
                      source={require('../../../assets/images/genderless_l.png')}
                    />
                  </TouchableOpacity>

                  <View style={{width: 20}} />

                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontShiny')}>
                    <View>
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode === 'frontShiny'
                            ? styles.spriteIconSelected
                            : styles.spriteIcon
                        }
                        source={require('../../../assets/images/genderless_l.png')}
                      />
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode === 'frontShiny'
                            ? styles.miniShinyIconSelected
                            : styles.miniShinyIcon
                        }
                        source={require('../../../assets/images/shiny_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.row, styles.centered]}>
                  {/** Male (default) sprite */}
                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontDefault')}>
                    <Image
                      style={
                        PokemonDetailsLocalState.spriteMode === 'frontDefault'
                          ? styles.spriteIconSelected
                          : styles.spriteIcon
                      }
                      source={require('../../../assets/images/male_l.png')}
                    />
                  </TouchableOpacity>

                  <View style={{width: 20}} />

                  {/** Male shiny sprite */}
                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontShiny')}>
                    <View>
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode === 'frontShiny'
                            ? styles.spriteIconSelected
                            : styles.spriteIcon
                        }
                        source={require('../../../assets/images/male_l.png')}
                      />
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode === 'frontShiny'
                            ? styles.miniShinyIconSelected
                            : styles.miniShinyIcon
                        }
                        source={require('../../../assets/images/shiny_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>

                  <View style={{width: 20}} />

                  {/** Female sprite */}
                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontFemale')}>
                    <Image
                      style={
                        PokemonDetailsLocalState.spriteMode === 'frontFemale'
                          ? styles.spriteIconSelected
                          : styles.spriteIcon
                      }
                      source={require('../../../assets/images/female_l.png')}
                    />
                  </TouchableOpacity>

                  <View style={{width: 20}} />

                  {/** Female shiny sprite */}
                  <TouchableOpacity
                    onPress={() => selectSpriteMode('frontShinyFemale')}>
                    <View>
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode ===
                          'frontShinyFemale'
                            ? styles.spriteIconSelected
                            : styles.spriteIcon
                        }
                        source={require('../../../assets/images/female_l.png')}
                      />
                      <Image
                        style={
                          PokemonDetailsLocalState.spriteMode ===
                          'frontShinyFemale'
                            ? styles.miniShinyIconSelected
                            : styles.miniShinyIcon
                        }
                        source={require('../../../assets/images/shiny_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/** Name section */}
            <View style={[styles.row, styles.centered]}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../../../assets/images/pokeball_white.png')}
              />
              <View style={{width: 12}} />
              <Headline
                style={{color: 'white', fontWeight: '500', fontSize: 26}}>
                {('00' + pokemon.id).slice(-3) +
                  ' ' +
                  pokemon.name.toUpperCase()}
              </Headline>
            </View>

            <View style={{height: 15}} />

            {/** Basic info section */}
            <View
              style={[
                styles.row,
                styles.centered,
                {justifyContent: 'space-around'},
              ]}>
              {/** Weight text */}
              <Text style={styles.basicInfoText}>
                WEIGHT: {Number(pokemon.weight / 10).toFixed(1)}kg
              </Text>
              {/** Height text */}
              <Text style={styles.basicInfoText}>
                HEIGHT: {Number(pokemon.height / 10).toFixed(1)}m
              </Text>
              {/** Type(s) text */}
              <Text style={styles.basicInfoText}>
                {`TYPE: ${pokemon.types[0].toUpperCase()} ${
                  pokemon.types.length === 1
                    ? ''
                    : `/${pokemon.types[1].toUpperCase()}`
                }`}
              </Text>
            </View>

            <View style={{height: 25}} />

            {/** Description section */}
            <View style={[styles.col, {marginLeft: 8, marginRight: 8}]}>
              {/** Pokemon gene type text */}
              <Text style={styles.sectionTitle}>
                {pokemon.genus.toUpperCase()}
              </Text>
              <View style={{height: 6}} />
              {/** Description text */}
              <Paragraph
                style={{color: '#D8DFFF', fontSize: 15.5, fontWeight: '500'}}>
                {pokemon.description}
              </Paragraph>
            </View>

            {/** Divider */}
            <View style={[styles.row, styles.centered]}>
              <View style={styles.divider} />
            </View>

            {/** Evolution section */}
            <View style={[styles.col, styles.centered, {paddingBottom: 150}]}>
              {/** Evolution section title */}
              <Text style={styles.sectionTitle}>EVOLUTION</Text>
              <View style={{height: 12}} />
              {/** Evolution chains section */}
              <View style={[styles.col]}>
                {
                  // iterate through each evolution chain
                  uiEvolutionChains.map((evoChain, index) => (
                    // evolution chain row
                    <View
                      key={index}
                      style={[styles.row, {justifyContent: 'space-around'}]}>
                      {evoChain.map((evo, index1) => (
                        <View
                          key={index1}
                          style={[styles.col, styles.centered]}>
                          {/** each pokemon in the evolution chain */}
                          {evo.pokemonId === -1 ? null : (
                            // pokemon sprite + text view
                            <TouchableOpacity
                              onPress={() =>
                                navigate(
                                  this.props.componentId,
                                  Routes.PokemonDetails,
                                  {pokemonId: evo.pokemonId},
                                )
                              }>
                              <View style={[styles.col, styles.centered]}>
                                <Image
                                  style={{width: 94, height: 94}}
                                  source={{uri: evo.sprite}}
                                />
                                <Text
                                  style={{
                                    color: 'white',
                                    fontWeight: '500',
                                    fontSize: 13.2,
                                  }}>
                                  {evo.species.toUpperCase()}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}

                          <View style={{height: 3}} />

                          {/** arrow pointing to the next pokemon in the evolution chain */}
                          {evo.pokemonId !== -1 ? null : (
                            <MaterialIcons
                              name="east"
                              color="white"
                              size={35}
                              style={{marginLeft: 10, marginRight: 10}}
                            />
                          )}
                        </View>
                      ))}
                    </View>
                  ))
                }
              </View>
            </View>
          </ScrollView>
        )}

        {/** Close button */}
        <View style={styles.closeBtnContainer}>
          <TouchableOpacity onPress={() => popToRoot(this.props.componentId)}>
            <Image
              style={styles.closeBtn}
              source={require('../../../assets/images/btn_close_normal.png')}
            />
          </TouchableOpacity>
        </View>

        {/** Gradient image background */}
        <ImageBackground
          style={[styles.fixed, styles.container]}
          source={require('../../../assets/images/ui_bg_purple_02.png')}
        />

        {/** Holo-net image background */}
        <Image
          style={[styles.fixed, styles.container, {opacity: 0.3}]}
          source={require('../../../assets/images/Holo_NetPatternBG.png')}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonDetails);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  mainSpriteImg: {
    height: 250,
    width: 250,
  },
  divider: {
    backgroundColor: 'white',
    marginTop: 24,
    marginBottom: 24,
    height: 1,
    width: '80%',
  },
  basicInfoText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 13.2,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18.5,
    fontWeight: '500',
  },
  spriteIcon: {
    width: 28,
    height: 28,
  },
  miniShinyIcon: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 15,
    height: 15,
    zIndex: 1,
  },
  spriteIconSelected: {
    width: 36,
    height: 36,
  },
  miniShinyIconSelected: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    zIndex: 1,
  },
  closeBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  closeBtn: {
    width: 52,
    height: 52,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3333',
  },
});
