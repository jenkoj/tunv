import * as React from 'react';
import { StyleSheet, Alert, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {connect} from 'react-redux';
import {setMarkerLocationAction} from '../redux/actions/markerAction';
//import { Button } from 'react-native-paper';
//import { Button } from 'reactstrap';

const mapStateToProps = state => {
  return {
    marker: state.location,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMarker: location => {
      dispatch(setMarkerLocationAction(location));
    },
  };
};
/*
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(mapsScreen);
*/
const Connected = connect(mapStateToProps,mapDispatchToProps);


export default class App extends React.Component {


constructor(props) {
  super(props)

  this.state = {
    location: [,],
    latitude: 46.11956480,
    longitude: 14.83770500,
    error: null,
    marker: null
  }
}


  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position =>{
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
    },
    error => this.setState({error: error.message}),
    { enableHighAccuracy: true, timeout:2000, maximumAge:2000}
    );
  }
/*
  savePosition = () => {
    Alert.alert(
      'Click ok to save location',
      'test',
      [
        {
          text:'Cancel',
          style: 'Cancel'
        },
        {
          text: 'ok'
        }
      ]
    )
  }
*/

render(){
  const {setMarker} = this.props;
  const {location} = this.state;
  return (

    <MapView
    showsCompass
    showsUserLocation 
    loadingEnabled 
    key={this.state.forceRefresh} 
    style={styles.map} 
    region={{
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.01, 
      longitudeDelta: 0.01,
    }}

    onLongPress={(e) => this.setState({ marker: e.nativeEvent.coordinate, location: e.nativeEvent.coordinate})}
    //onMarkerPress={e => { console.log(e.nativeEvent.coordinate); }}
    onMarkerPress={() => setMarker(location)}
    
    >

     <Marker coordinate={{latitude: 46.142, longitude: 14.9689}} onPress={()=>console.log({location})}>
      
     </Marker>


    {
          this.state.marker &&
          <Marker 
            coordinate={this.state.marker}
            title={'Bike'}  
          />
    }


    </MapView>
    
  );
}
}


/* 
    <Marker
        pinColor = '#0000FF' 
        fixed
        coordinate={this.state}
        title={'You are here!'}
    />
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    height: '100%'
  }
});
