import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-native';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {AppState} from '../../app-state-store';

interface PokemonDetailsProps {
  // receive from PokemonList page via navigation
  pokemonId: number;
}

const mapStateToProps = (state: AppState) => {
  return {};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {};
};

class PokemonDetails extends Component<PokemonDetailsProps, any> {
  render() {
    return (
      <>
        <Text>{this.props.pokemonId}</Text>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonDetails);
