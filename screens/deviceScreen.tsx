import React,{useCallback, useEffect, useMemo, useState} from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { Foundation } from '@expo/vector-icons'; 
import { useColorScheme } from 'react-native-appearance';
import {storeData,getData} from "../storage/storageHandler"
import {Device, State} from 'react-native-ble-plx';
import scanner from '../components/ble/scanner';
import Geolocation from '@react-native-community/geolocation';

const DEVICE_LIST_LIMIT = 10;

const deviceScreen = () => {

  const {start, stop, observe, conn, disconn, read, write} = useMemo(() => scanner(), []);

  //observer
  const [bleState, setBleState] = useState(State.Unknown);
  const [error, setError] = useState<any>('-');
  const [started, setStarted] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceConected, setDeviceConnected] = useState(false)
  const [lockState, setLockState] = useState<any>("unknown");

  //render flags, they stop from useEffect from running the first time around
  const [rendered, setRendered] = useState(false);
  const [rendered2, setRendered2] = useState(false);
  const [rendered3, setRendered3] = useState(false);
  const [rendered4, setRendered4] = useState(false);

  //locks and styles
  const [locked, setToggleLock] = useState(false);
  const [buttonStyle, setButtonStyle] = useState('red')
  const [iconStyle, setIconStyle] = useState('unlink')

  //ids and con
  const [selID, setSelID] = useState<string>("11E20B87-A590-6A88-3CC4-340E8781081C");

  //loc
  const [userPos, setUserPos] = useState({latitude: null, longitude: null})


  useEffect(() => {
    // register observer functions

    observe({
      
      onStarted: (startedState) => {
        console.log('startedState:', startedState);
        setStarted(startedState);
      },
      onStateChanged: (changedBleState) => {
        console.log('changedBleState', changedBleState);
        setBleState(changedBleState);
      },
      onDeviceDetected: (device: Device) => {
        console.log('device:', device.id, device.name, device.localName, device.serviceUUIDs);
        // insert at front, remove last items if list is too long
        setDevices([device].concat(devices.slice(0, DEVICE_LIST_LIMIT)));
      },
      onDeviceConnected:(connectedState) =>{
        console.log("device conneted!: ",connectedState)
        setDeviceConnected(connectedState)
        
      },
      onLockStateChanged:(changedLockState)=>{
        console.log("lock state changed! new state: ", changedLockState)
        console.log("saving state to storage")
        storeData(changedLockState,"@lock").then(()=>{
         //after data is stored we can trigger all screens to read new state form storage
         console.log("saved to storage!")
         setLockState(changedLockState)

        }).catch(()=>{
          console.log("error storing data")
        })
        
      },

      onError: (err) => {
        console.log("much error, very bad");
        console.log('error', err);
        setError(err.toString());
        
      },
    });

  }, [observe, setStarted, setBleState, setDevices, devices,locked,setLockState,setError,setDeviceConnected]);

  useEffect(() => {
    // this will when lockState has changed!
    // lets check if lock state is locked
    if (lockState == "locked"){
        //stroing location only when bike is being locked
        Geolocation.getCurrentPosition((position) => {
            //console.log(position.coords.latitude + " " + position.coords.longitude) // display VALUE
            const location = { 
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
            };
            setUserPos(location) // store data in usestate
            console.log("bike locked, storing user location: ", location) // Display your values
            storeData(location,"@location")
        }, (err) => {
                console.log(err);
          });
  }else{
    //we do not need to store location!
    console.log("will not store location, happy riding!")
  }  
  }, [lockState])
  

//important async stuff
useEffect(()=>{
    //first effect that starts the chaing of commands 
    //before connecting lets check last lock state in storage
    console.log("checking state in storage!")
    getData("@lock").then((data)=>{
      console.log("state in storage: ", data)
      
      //set states based on storage
      if (data == "locked"){
        setButtonStyle('green')
        setToggleLock(true)
      }else{
        setButtonStyle('red')
        setToggleLock(false)
      }

    }).catch(()=>{})
    //in case connecting to last device fails we set of the effect bellow
    console.log("try to connect to last device")
    conn(selID).catch(()=>{});
     
}, [started]);



useEffect(()=>{
  //this effect is triggered when app could not connect to ble device
  if(rendered){
   if(error == "CANTCONN"){
     console.log("ble conn problems")
     console.log("scanning again")
     //start the means of scaning
     start()
   }
  }
  if(!rendered){
    setRendered(true)
  }
}, [error]);

useEffect(()=>{
  //this effect is ran when device was detected
  if(rendered2){
   //program will detect devices with pre spefified local name
   console.log("found lock:",devices[0].id)
   console.log("connecting to this one")
   conn(devices[0].id)
  }
  if(!rendered2){
    setRendered2(true)
  }
}, [devices]);

useEffect(()=>{
  //this effect is triggerd when device was connected
  if(rendered3){
   console.log("connected:",deviceConected)
  
   //it changes the icon 
   if(deviceConected){
    setIconStyle("link")
   }else{
    setIconStyle("unlink")
   }

  read();

  }
  if(!rendered3){
    setRendered3(true)
  }
}, [deviceConected]);

  useEffect(()=>{
  //effect is triggered when state of lock has changed
    if(rendered3){
      console.log("new value!:",lockState)
      
      //changes toggle state, and button style - important!
      if(lockState == "locked"){
        setToggleLock(true)
        setButtonStyle('green')
      }else{
        setToggleLock(false)
        setButtonStyle('red')
      }
  }

  if(!rendered4){
    setRendered4(true)
  }
}, [lockState]);

//it writes to the ble device
//cant toggle until ble state has changed
const toggleLock= useCallback(() => {
  console.log('toggleStarted');
  let state
  if (locked) {
    write("1")
    console.log("lock")
    
  } else {
    write("0")
    console.log("unlock")
  }
}, [locked]);

let colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      
    <View style={[styles.button,{ backgroundColor: buttonStyle }]}>
      <Pressable
        style={styles.button}
        onPress={toggleLock}
      >
        <View style={[styles.text,{ backgroundColor: buttonStyle }]}>
          <Text>
            Bike
          </Text>
        </View>
        <View style={[styles.icon,{ backgroundColor: buttonStyle }]}>
           <Foundation name={iconStyle} size={24} color="white" />
        </View>
      </Pressable>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
  
  },
  button: {
    borderRadius: 3,
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: "row",
    alignContent: "space-between",
    height: 50,
    width: 200,
  },
  text: {
    flex: 0.8,
    fontSize:20,
  }
});


export default deviceScreen;