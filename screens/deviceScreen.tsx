import React,{useCallback, useEffect, useMemo, useState} from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { Foundation } from '@expo/vector-icons'; 
import { useColorScheme } from 'react-native-appearance';


const deviceScreen = () => {
  
  const [locked, setToggleLock] = useState(false);
  const [buttonStyle, setButtonStyle] = useState('red')
  const [iconStyle, setIconStyle] = useState('unlink')

  const toggleLock= useCallback(() => {
    console.log('toggleStarted');
    let state
    if (locked) {
      setToggleLock(false)
      //setIconStyle("unlink")
      setButtonStyle('green')
      console.log("lock")
    } else {
      setToggleLock(true)
      //setIconStyle("link")
      setButtonStyle('red')
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