import * as React from 'react';
import { StyleSheet } from 'react-native';
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


export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, {width: 200, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: getBackgroundColor(0)}]}>
        <View>
          <FontAwesome5 name={'link'} size={20} color={'white'}/>
        </View>
        

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bar: {
    height: 20,
    width: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
