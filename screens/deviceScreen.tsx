import React, {useCallback, useEffect, useMemo, useState} from 'react';

import { StyleSheet } from 'react-native';
import { Text, View,Switch} from '../components/Themed';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



const getBackgroundColor = (value) => {
  let color
  if (value === 0) {
      color = 'green';
  } else {
      color = 'red';
  }
  return color;
};

const getIcon = (value) => {
  let name;
  if (value === 0) {
      name = 'link';
  } else {
      name = 'times';
  }
  return name;
};


export default function deviceScreen() {


  return (
    <View style={styles.container}>
        <View style={styles.container}>
          
      
      
        </View>
      <View
      style={styles.bar}>
        <View style={styles.icon}>
          <FontAwesome5 name={getIcon(1)} size={20} color={'white'}/>
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
    borderRadius: 3,
    width: 200, 
    height: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: getBackgroundColor(0)
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  icon: {
    alignSelf: 'flex-end',
    margin: 10,
    padding: 2,
    borderRadius: 3,
    backgroundColor: getBackgroundColor(0)
  },
  lock: {
    alignSelf: 'flex-start',
  }
});
