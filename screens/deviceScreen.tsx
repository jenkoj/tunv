import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Image, Button, Modal } from 'react-native';
import { Text, View } from '../components/Themed';
import { useColorScheme } from 'react-native-appearance';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container} from 'native-base';

import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons'; 

import {storeData,getData} from "../storage/storageHandler"

const deviceScreen = () => {

  const [locked, setToggleLock] = useState(false);
  const [buttonStyle, setButtonStyle] = useState('red');
  const [iconStyle, setIconStyle] = useState('unlink');
  const [popUp, setpopUpState] = useState(false);
  const [lockState, setLockState] = useState<any>("unknown");

  const [name, setName] = useState<any>("Urh");

  const toggleLock = useCallback(() => {
    console.log('toggleStarted');
    let state
    if (locked) {
      setToggleLock(false)
      setIconStyle("link")
      setButtonStyle('green')
      console.log("lock")
      setLockState("locked")
    } else {
      setToggleLock(true)
      setIconStyle("unlink")
      setButtonStyle('red')
      console.log("unlock")
      setLockState("unlocked")
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