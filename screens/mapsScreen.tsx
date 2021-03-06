import * as React from 'react';
import { StyleSheet, Alert, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import AsyncStorage from '@react-native-community/async-storage';
import { resolveUri } from 'expo-asset/build/AssetSources';

import {storeData,getData} from "../storage/storageHandler"

import Geolocation from '@react-native-community/geolocation';

export default class App extends React.Component {

  constructor(props: {} | Readonly<{}>) {
    super(props)
  
    this.state = {
      location: [,],
      latitude: 46.11956480,
      longitude: 14.83770500,
      error: null,
      marker: null,
      latitudeMarker: 0,
      longitudeMarker: 0,   
    }
  }
  
  componentDidMount(){
      console.log("fetching...")
      getData("@location").then((data: any)=> {
      
       this.state.latitudeMarker = data.latitude;
       this.state.longitudeMarker = data.longitude;
  
      this.setState({
                latitude: data.latitude,
                longitude: data.longitude,
                error: null
              })
  
        console.log("longitude: ",data.longitude)
        console.log("latituude: ",data.latitude)
        console.log("...fin")
        
  
    
      }).catch((err: any) => {
          console.log(err)
    
      });
      //console.log(data)
      
      Geolocation.getCurrentPosition(position =>{
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
  
  
  setMarker = (location: any)  => {
    //dispatch(setMarkerLocationAction(location));
    console.log("data to be stored: ")
    console.log(location);
    console.log("stroing!........");
    storeData(location,"@location");  
    console.log("........stored!");
    
    console.log("data stored: ")
    
    getData("@location").then((result: any)=> {
      console.log("longitude: ",result.longitude)
      console.log("latitude: ", result.latitude)
  
    }).catch((err: any) => {
        console.log(err)
  
    });
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
  
  
      <Marker 
        coordinate={{ latitude : this.state.latitudeMarker , longitude : this.state.longitudeMarker }} 
        pinColor={'red'}
        title={'BIKE LOCATION'}
      />  
  
  
      {
            this.state.marker &&
            <Marker 
              coordinate={this.state.marker}
              title={'SAVED!'}  
            />
      }
  
  
      </MapView>
      
    );
  }
  }
  
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
  