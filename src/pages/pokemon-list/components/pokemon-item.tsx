import React, {Component} from 'react';
import PokemonListModel from '../pokemon-list-model';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {navigate} from '../../../app-navigation/router';
import {Routes} from '../../../app-navigation/routes';
import {constructPokemonSpriteUrl} from "../../../utils/utils";

interface ListItemProps {
  // must be specified when this component is used (for navigation purpose)
  navigationComponentId: string;
  pokemon: PokemonListModel;
}

export default class PokemonItem extends Component<ListItemProps, any> {
  render() {
    const {pokemon} = this.props;

    return (
      // Card
      <Card style={styles.card}>
        {/** Card container */}
        <View style={styles.cardContainer}>
          {/** Card header */}
          <View style={styles.itemHeader}>
            <Image
              style={styles.pokeBallHeader}
              source={require('../../../../assets/images/pokeball_color.png')}
            />
            <View
              style={{
                width: 5,
              }}
            />
            <Text>No. {('00' + pokemon.id).slice(-3)}</Text>
          </View>

          {/** Card body */}
          <TouchableOpacity
            onPress={() =>
              navigate(
                this.props.navigationComponentId,
                Routes.PokemonDetails,
                {
                  pokemonId: pokemon.id,
                },
              )
            }>
            {/** Body container */}
            <View style={styles.itemBody}>
              {/** PokeBall background */}
              <Image
                style={styles.itemBodyPokeBallBg}
                source={require('../../../../assets/images/pokeball_white.png')}
              />
              {/** Pokemon sprite */}
              <Image
                style={styles.pokemonSprite}
                source={{
                  uri: constructPokemonSpriteUrl(pokemon.id),
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EED6EE',
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  itemHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B7A3E0',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
  },
  pokeBallHeader: {
    width: 19,
    height: 19,
  },
  itemBody: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  itemBodyPokeBallBg: {
    width: 95,
    height: 95,
    position: 'absolute',
    zIndex: -1,
    opacity: 0.3,
  },
  pokemonSprite: {
    width: 82,
    height: 82,
  },
});
