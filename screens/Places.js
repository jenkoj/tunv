import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import LocationList from '../../components/LocationList/LocationList';
import { connect } from 'react-redux';
import { deletePlaces } from '../../store/actions/index';
class Places extends Component {
placeDeletedHandler = (key) => {
    this.props.onDeletePlace(key);
  }
render() {
    return (
      <View style={styles.container}>
        <LocationList
          locations={this.props.locations}
          onItemSelected={this.placeDeletedHandler}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  }
});
const mapStateToProps = state => {
  return {
    locations: state.locationsList.locations
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onDeletePlace: (key) => dispatch(deletePlaces(key))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Places);