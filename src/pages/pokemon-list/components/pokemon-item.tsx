import React, {Component} from 'react';
import PokemonListModel from '../pokemon-list-model';
import {Image, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {navigate} from '../../../app-navigation/router';
import {Routes} from '../../../app-navigation/routes';

interface ListItemProps {
  // must be specified when this component is used (for navigation purpose)
  navigationComponentId: string;
  pokemon: PokemonListModel;
}

export default class PokemonItem extends Component<ListItemProps, any> {
  render() {
    const {pokemon} = this.props;

    return (
      <Card
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#E0D0ED40',
          marginBottom: 15,
          marginLeft: 5,
          marginRight: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#B6A6D7',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              paddingTop: 2,
              paddingBottom: 2,
            }}>
            <Image
              style={{
                width: 26,
                height: 26,
              }}
              source={{
                uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
              }}
            />
            <Text>No. {pokemon.id}</Text>
          </View>
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
            <View
              style={{
                flex: 3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 86,
                  height: 86,
                }}
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}
