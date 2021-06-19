import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import { useColorScheme } from 'react-native-appearance';
import MapsScreen from '../screens/mapsScreen'

import BleScreen from '../screens/BleScanScreen'
import deviceScreen from '../screens/deviceScreen';
import settingsScreen from '../screens/settingsScreen';

import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList } from '../types';
import { Text, View} from '../components/Themed';
import { StyleSheet } from 'react-native'
import {getData} from "../storage/storageHandler"

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
let letter: {} | null | undefined;

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  
//get data from storage and parse it
  getData("@email").then((data)=>{
    let parsed_mail = data.split(".");
    let name = parsed_mail[0];
    letter = name[0].toUpperCase();
  })

  
//define all three screens add icons to navigation and header bar
  return (
    <BottomTab.Navigator
      initialRouteName="login"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="devices"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) =>  <FontAwesome name="lock" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="maps"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="map-marker" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="settings"
        component={TabThreeNavigator}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="ios-settings-outline" size={24} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {

  
return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="deviceScreen"
        component={deviceScreen}
        options={{ 
          headerTitle: '',
          headerLeft: () => (
            <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 28}}>TAPLOCK</Text>
          ),
          headerRight: () => (
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              
                <Text style={{fontSize: 25}}>{letter}</Text>
              
            </View>
          </View>
          ),
        }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={MapsScreen}
        options={{ 
          headerTitle: '',
          headerLeft: () => (
            <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 28}}>TAPLOCK</Text>
          ),
          headerRight: () => (
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              
                <Text style={{fontSize: 25}}>{letter}</Text>
              
            </View>
          </View>
          ),
        }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="TabThreeScreen"
        component={settingsScreen}
        options={{ 
          headerTitle: '',
          headerLeft: () => (
            <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 28}}>TAPLOCK</Text>
          ),
          headerRight: () => (
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              
                <Text style={{fontSize: 25}}>{letter}</Text>
              
            </View>
          </View>
          ),
        }}
      />
    </TabThreeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  
  outerCircle: {
    marginRight: 15,
    marginBottom: 10,
    width: 42,
    height: 42,
    borderRadius: 42/2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    
    width: 40,
    height: 40,
    borderRadius: 40/2,
    justifyContent: 'center',
    alignItems: 'center',
  
    }
});  