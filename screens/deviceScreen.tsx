import React,{useCallback, useEffect, useMemo, useState} from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Foundation } from '@expo/vector-icons'; 
import { useColorScheme } from 'react-native-appearance';

import {storeData,getData} from "../storage/storageHandler"

import {Device, State} from 'react-native-ble-plx';

import {Header, ListItem, ThemeProvider, Input, Button} from 'react-native-elements';

import scanner from '../components/ble/scanner';

// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync().catch(console.warn);

const DEVICE_LIST_LIMIT = 10;
declare var global: {HermesInternal: null | {}};

const deviceScreen = () => {

  const {start, stop, observe, conn, disconn, read, write} = useMemo(() => scanner(), []);

  const [bleState, setBleState] = useState(State.Unknown);
  const [error, setError] = useState<any>('-');
  const [started, setStarted] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceConected, setDeviceConnected] = useState(false)
  const [lockState, setLockState] = useState<any>("unknown");

  const [rendered, setRendered] = useState(false);
  const [rendered2, setRendered2] = useState(false);
  const [rendered3, setRendered3] = useState(false);
  const [rendered4, setRendered4] = useState(false);

  const [locked, setToggleLock] = useState(false);
  const [buttonStyle, setButtonStyle] = useState('red')
  const [iconStyle, setIconStyle] = useState('unlink')

  const [selID, setSelID] = useState<string>("11E20B87-A590-6A88-3CC4-340E8781081C");
  const [startedConn, setStartedConn] = useState(false);
  //button
  const [startedRead] = useState(false);
  //ble
  let [BleReadVal,onBleValueChange] = useState<any>("locked");

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

  // const toggleStarted = useCallback(() => {
  //   console.log('toggleStarted');
  //   if (started) {
  //     stop();
  //   } else {
  //     start();
  //   }
  // }, [started, start, stop]);

  // useEffect(() => setError(''), [startedConn]);

  // const toggleConn = useCallback(() => { 
  //   if (!startedConn) {
  //     console.log('connecting');
  //     setStartedConn(true);
  //     conn(selID);
  //   } else {
  //     console.log('disconnecting');
  //     setStartedConn(false);
  //     //disconn();
  //   }
  // }, [startedConn]);


  const toggleLock= useCallback(() => {
    console.log('toggleStarted');
    let state
    if (locked) {
      //setToggleLock(false)
      //setButtonStyle('green')

      write("1")
      //debug only
      //storeData("locked","@lock")
      console.log("lock")
      
    } else {
     // setToggleLock(true)
      //setButtonStyle('red')
      //setIconStyle("link")
      
      write("0")
      
      //debug only
      //storeData("unlocked","@lock")
      console.log("unlock")
    }
  }, [locked]);

  // let ReadFromBle;
  // let lockStatus = "locked";
  // const setStartedRead = useCallback(() => { 
  //  console.log("pressed")
  //  read().then(response=>{
  //   console.log("lock status: ", response);
    

  //   if (response == 0){
  //     BleReadVal = "unlocked";     
  //     console.log("unlocked: ", BleReadVal);

  //   }else{
  //     BleReadVal = "locked"
  //     console.log("locked: ", BleReadVal);
  //   }

  //   onBleValueChange(BleReadVal);
  //   console.log("status after val change: ", BleReadVal);
  //  });
   
  // }, [startedRead]);


useEffect(()=>{
    //first effect 
    //before connecting lets check last lock state in storage
    console.log("checking state in storage!")
    getData("@lock").then((data)=>{
      console.log("state in storage: ", data)
      
      if (data == "locked"){
        setButtonStyle('green')
        setToggleLock(true)
      }else{
        setButtonStyle('red')
        setToggleLock(false)
      }

    }).catch(()=>{})
    console.log("try to connect to last device")
    conn(selID).catch(()=>{});
     
}, [started]);

useEffect(()=>{
  if(rendered){
   if(error == "CANTCONN"){
     console.log("ble conn problems")
     console.log("scanning again")
     start()
   }
  }
  if(!rendered){
    setRendered(true)
  }
}, [error]);

useEffect(()=>{
  if(rendered2){
   console.log("found lock:",devices[0].id)
   console.log("connecting to this one")
   conn(devices[0].id)
  }
  if(!rendered2){
    setRendered2(true)
  }
}, [devices]);

useEffect(()=>{
  if(rendered3){
   console.log("connected:",deviceConected)
   
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
    if(rendered3){
      console.log("new value!:",lockState)
      
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