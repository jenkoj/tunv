import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Image, Button, Modal } from 'react-native';
import { Text, View } from '../components/Themed';
import { Foundation } from '@expo/vector-icons';
import { useColorScheme } from 'react-native-appearance';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const deviceScreen = () => {

  const [locked, setToggleLock] = useState(false);
  const [buttonStyle, setButtonStyle] = useState('red');
  const [iconStyle, setIconStyle] = useState('unlink');
  const [popUp, setpopUpState] = useState(false);


  const toggleLock = useCallback(() => {
    console.log('toggleStarted');
    let state
    if (locked) {
      setToggleLock(false)
      setIconStyle("unlink")
      setButtonStyle('green')
      console.log("lock")
    } else {
      setToggleLock(true)
      setIconStyle("link")
      setButtonStyle('red')
      console.log("unlock")
    }
  }, [locked]);


  let colorScheme = useColorScheme();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.myDevices}>
        <Image
          //resizeMode='contain'
          style={styles.imgConn}
          source={{
            uri: 'https://i.pinimg.com/736x/e5/4a/07/e54a071e4abe3340ddfb2222712fac51.jpg'
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>My devices</Text>
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
              <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: 300, marginBottom: 300, marginLeft: 20, marginRight: 20, padding: 40, borderRadius: 10, flex: 1 }}>
                  <View style={{ flexDirection: "column", backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row", marginBottom: 20 }}>
                    <Text style={{ fontSize: 30, color: "#000000", marginLeft: 10 }}>lock status</Text>
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
                    <View style={{ marginTop: 40, backgroundColor: "#FFFFFF", height: 40, width: 70, justifyContent: 'center', alignItems: 'center' }}>
                      <Pressable
                        onPress={() => { setpopUpState(false) }}
                      >
                        <Foundation name={"x"} size={30} color="red" />
                      </Pressable>

                    </View>
                  </View>
                </View>
              </View>
            </Modal>


            <View style={[styles.text, { backgroundColor: buttonStyle }]}>
              <Text>
                Bike is unlocked
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {

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