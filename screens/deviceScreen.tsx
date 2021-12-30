import React,{useCallback, useEffect, useMemo, useState} from 'react';
import { Pressable, StyleSheet, Modal } from 'react-native';
import { Text, View } from '../components/Themed';
import { Foundation } from '@expo/vector-icons'; 
import { useColorScheme } from 'react-native-appearance';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {storeData,getData} from "../storage/storageHandler"
import {Device, State} from 'react-native-ble-plx';
import scanner from '../components/ble/scanner';
import Geolocation from '@react-native-community/geolocation';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 


import { Container} from 'native-base';

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

  //timer
  const [timerState,setTrigerTimer] = useState<boolean>(false);
  //ids and con
  const [selID, setSelID] = useState<string>("5231F26B-1C63-1BB7-6268-7F327180BB94");
  //popup
  const [popUp, setpopUpState] = useState(false);
  //loc
  const [userPos, setUserPos] = useState({latitude: null, longitude: null})

  const [name, setName] = useState<any>("user");

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
        setLockState("locked")
      }else{
        setButtonStyle('red')
        setToggleLock(false)
        setLockState("unlocked")
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
   conn(devices[0].id).catch(e=>{
    console.log("device not in reach")
  });
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
    console.log("trying to reconect!!")
    conn(devices.id).catch(e=>{
      console.log("device not in reach")
    });
   }

  read("force read").catch(e=>{
    console.log("device not in reach")
  });

  }
  if(!rendered3){
    setRendered3(true)
  }
}, [deviceConected]);

  useEffect(()=>{
  //effect is triggered when state of lock has changed
  if(rendered4){
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

useEffect(()=>{

  //setLockState(lockState)
  console.log("i am awake, keeping the heartbeat, reading from arduino... state is ",locked)
  read(lockState).catch(e =>{
    console.log("cant read not conn!")
    setDeviceConnected(false)
  });
  // write("MQQQ").catch(e =>{
  //   console.log("cant write not connected!")
  //   setDeviceConnected(false)
  // })

}, [timerState]);


useEffect(()=>{

const interval = setInterval(()=>{
  //trigerTimer(timerState+1)
  
  if(timerState == true){
    console.log("if stavek true",timerState)
    setTrigerTimer(false)
  }else{
    console.log("if stavek false",timerState)
    setTrigerTimer(true)
  }
  console.log("timer state         :", timerState)
}, 3000); //debug! 
return () => clearInterval(interval);
   
});


//it writes to the ble device
//cant toggle until ble state has changed
const toggleLock= useCallback(() => {
  console.log('toggleStarted');
  let state
  if (locked) {
    write("1").catch(e =>{
      console.log("not conn")
      setDeviceConnected(false)
    })
    console.log("lock")
  
  } else {  
    write("0").catch(e =>{
      console.log("not conn")
      setDeviceConnected(false)
    })
    console.log("unlock")
  }
}, [locked]);

useEffect(() => {
  getData("@email").then((data)=>{
    //console.log("parsing letter: ", data);
    let parsed_mail = data.split(".");
    setName(parsed_mail[0])
    console.log("name", parsed_mail[0])
  })
});



let colorScheme = useColorScheme();

return (

  <SafeAreaView style={styles.container}>
    <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 40, fontWeight: "bold", marginTop: 20 }}>Hello {name}!</Text>
          </View>
          <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 18, marginTop: 1,fontWeight: "bold" }}>Your locks are ready to use.</Text>
    </View>
  
   <View style={styles.container2} >
   
    <View style={styles.myDevices}>      
    </View>
    <ScrollView style={styles.scrollView} fadingEdgeLength={0}>
      <View style={[styles.button, { backgroundColor: buttonStyle }]}> 
        <Pressable
          style={styles.button}
          onPress={toggleLock}
          onLongPress={() => { setpopUpState(true) }}
        >
          <Modal
            transparent={true}
            visible={popUp}
          >  
           <Container style={styles.containerpopUp}>
                  <View style={{ flex: 0.3, backgroundColor: "white", marginTop:10 }}>
                    <Pressable
                      onPress={() => { setpopUpState(false) }}
                    >

                     <AntDesign name="closecircleo" size={24} color="black" />

                    </Pressable>
                  </View>
                  <View style={{ flex: 0.7, backgroundColor: "white", alignContent: "center", alignItems: "center", marginTop: 0 }}>
                      <Text style={{ fontSize: 30, color: "#000000", marginLeft: 10 }}>lock status</Text>
                  </View>
                  <View style={{ backgroundColor: "white", alignContent: "center", alignItems: "center", marginBottom:50, marginTop: 0}}> 
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <FontAwesome name="lock" size={24} color="black" />
                  </View>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 20, color: "#000000", marginLeft: 10 }}> {lockState} </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Foundation name={"battery-half"} size={24} color="black" />
                  </View>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 20, color: "#000000", marginLeft: 10 }}>  56%</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Foundation name={"compass"} size={24} color="black" />
                    </View>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 20, color: "#000000", marginLeft: 10 }}>350 m</Text>
                    </View>
                  </View>
                  </View>
                </Container>
          
          </Modal>


          <View style={[styles.text, { backgroundColor: buttonStyle }]}>
            <Text>
              Bike is {lockState}
                          </Text>
          </View>
          <View style={[styles.icon, { backgroundColor: buttonStyle }]}>
            <Foundation name={iconStyle} size={24} color="white" />
          </View>
        </Pressable>
      </View>
      <View style={[styles.button, { backgroundColor: 'red' }]}>
        <Pressable
          style={styles.button}
        //onPress={toggleLock}
        >
          <View style={[styles.text, { backgroundColor: 'red' }]}>
            <Text>
              MTB is unlocked
            </Text>
          </View>
          <View style={[styles.icon, { backgroundColor: 'red' }]}>
            <Foundation name={'link'} size={24} color="white" />
          </View>
        </Pressable>
      </View>
      <View style={[styles.button, { backgroundColor: 'red' }]}>
        <Pressable
          style={styles.button}
        //onPress={toggleLock}
        >
          <View style={[styles.text, { backgroundColor: 'red' }]}>
            <Text>
              Road bike is unlocked
            </Text>
          </View>
          <View style={[styles.icon, { backgroundColor: 'red' }]}>
            <Foundation name={'link'} size={24} color="white" />
          </View>
        </Pressable>
      </View>
      
    </ScrollView>
  </View>
  </SafeAreaView>
)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  paddingHorizontal: 10,
  paddingBottom:5,

},
container2: {
  flex: 1,
  paddingHorizontal: 10,
  paddingBottom:5,
  alignItems: 'center',
  justifyContent: 'center',
},
icon: {

},

containerpopUp: {
  //flex: 1,
  paddingHorizontal: 10,
  //alignItems: 'center',
  //justifyContent: 'center',
  margin: 60,
  marginTop: 300,
  marginBottom: 300,
  //height: 50,
  borderRadius: 10,
  backgroundColor: "white",
  flexDirection: "column"
},

button: {
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: "row",
  alignContent: "space-between",
  height: 70,
  width: 300,
  margin: 10,
},

welcomeMsg: {
  marginLeft: 30,
 },
text: {
  flex: 0.8,
  fontSize: 20,
},
scrollView: {
  //backgroundColor: 'pink',
  //marginHorizontal: 0,
  marginTop: 10,
  marginBottom: 70,
},
myDevices: {
  marginTop: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
text1: {
  fontSize: 20,
},
imgConn: {
  marginBottom: 15,
  //maxHeight: 'height',
  //maxWidth: 'width',
  height: 135,
  width: 325,
  borderRadius: 10,
}
});


export default deviceScreen;