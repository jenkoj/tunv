import * as React from 'react';
import { StyleSheet, Alert, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import AsyncStorage from '@react-native-community/async-storage';

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
    console.log("fetching..")
    this.getData()
    console.log("...fin")
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

storeData = async (value: string) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@location', jsonValue)
  } catch (e) {
    console.log("async store err!")
  }
}

getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@location').then(() =>
      console.log("read"!)
    )
    return jsonValue != null ? JSON.parse(jsonValue) : null;
    
  } catch(e) {
    console.log("async read err!")    
  }
}


setMarker = (location: any)  => {
  //dispatch(setMarkerLocationAction(location));
  console.log("data to be stored: ")
  console.log(location);
  console.log("stroing!........");
  
  this.storeData(location);
  console.log("data",this.getData())
  //console.log(data);
  console.log("........stored!");
}


render(){
  //const {setMarker} = this.props;
  const {marker} = this.state;
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
    onMarkerPress={() => this.setMarker(marker)}
    
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
