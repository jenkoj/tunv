import * as React from 'react';
import { Button, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const getBackgroundColor = (value) => {
  let color;
  if (value === 0) {
      color = 'green';
  } else {
      color = 'red';
  }
  return color;
};

const getIcon = (value) => {
  let name;
  if (value === 1) {
      name = 'link';
  } else {
      name = 'times';
  }
  return name;
};

const onPressButton = () => {
  alert('You tapped the button!')
}



export default function TabThreeScreen() {
  return (


    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={onPressButton}
        >
          <View style={styles.text}>
            <Text>
              TEST
            </Text>
          </View>
          <View style={styles.icon}>
            <FontAwesome5 name={getIcon(1)} size={20} color={'white'}/>
          </View>
        </Pressable>
      </View>
    </View>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    backgroundColor: getBackgroundColor(0),
  },
  button: {
    borderRadius: 3,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: getBackgroundColor(0),
    flexDirection: "row",
    alignContent: "space-between",
    height: 50,
    width: 200,
  },
  text: {
    backgroundColor: getBackgroundColor(0),
    flex: 0.8,
    fontSize:20,
  }
});
