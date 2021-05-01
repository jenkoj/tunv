import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
  DatePickerIOSComponent,
} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {Header, ListItem, ThemeProvider, Input, Button} from 'react-native-elements';
import { useColorScheme } from 'react-native-appearance';

import scanner from '../components/ble/scanner';

declare var global: {HermesInternal: null | {}};

const DEVICE_LIST_LIMIT = 10;

const BleScanner = () => {
  const [bleState, setBleState] = useState(State.Unknown);
  const [error, setError] = useState<any>('-');
  const [started, setStarted] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]); 

  const {start, stop, observe, conn, disconn, read,write} = useMemo(() => scanner(), []);

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
        console.log('device:', device.id, device.name, device.rssi, device.serviceUUIDs);
        // insert at front, remove last items if list is too long
        setDevices([device].concat(devices.slice(0, DEVICE_LIST_LIMIT)));
      },
      onError: (err) => {
        console.log('error', err);
        setError(err.toString());
      },
    });
  }, [observe, setStarted, setBleState, setDevices, devices, setError]);

  useEffect(() => setError(''), [started]);
  
  const toggleStarted = useCallback(() => {
    console.log('toggleStarted');
    if (started) {
      stop();
    } else {
      start();
    }
  }, [started, start, stop]);

  

  const [selID, setSelID] = useState<string>("17F59367-027E-401D-28C6-44CC608B7B1C");
  const [startedConn, setStartedConn] = useState(false);
  const [locked, setToggleLock] = useState(false);
  //button
  const [startedRead] = useState(false);
  //
  let [BleReadVal,onBleValueChange] = useState<any>(0);

  useEffect(() => setError(''), [startedConn]);

  const toggleConn = useCallback(() => { 
    if (!startedConn) {
      console.log('connecting');
      setStartedConn(true);
      conn(selID);
    } else {
      console.log('disconnecting');
      setStartedConn(false);
      disconn();
    }
  }, [startedConn]);

  let ReadFromBle;

  const setStartedRead = useCallback(() => { 
   console.log("pressed")
   read().then(response=>{
    console.log("temp: ", response);
    BleReadVal = response;
    onBleValueChange(response);
   });
   
  }, [startedRead]);

  const toggleLock= useCallback(() => {
    console.log('toggleStarted');
    let state
    if (locked) {
      setToggleLock(false)
      
      write("1")
      console.log("lock")
    } else {
      setToggleLock(true)
      write("0")
      console.log("unlock")
    }
  }, [locked]);




  let colorScheme = useColorScheme();

  return (
   <ThemeProvider useDark={colorScheme === 'dark'}>
      <SafeAreaView style={styles.container}>
        <Header
          centerComponent={{text: 'BLE Scanner', style: {color: '#fff'}}}
          leftComponent={
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={started ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleStarted}
              value={started}
            />
          }
        />
        <View style={styles.statusPanel}>
          <ListItem title={'Last Error'} subtitle={error} bottomDivide><Text style={styles.titleText}>{bleState}</Text></ListItem > 
        </View>

        <View style={styles.statusPanel}>
          <Text style={styles.titleText}>connect to device</Text>
          <Switch
              trackColor={{false: '#000', true: '#fff'}}
              thumbColor={startedConn ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleConn}
              value={startedConn}
            />
            <Text style={styles.titleText}>Device to connect to: </Text>
            <Text style={styles.titleText}>{selID}</Text>
        </View>

        <View style={styles.containerButton}>
          <Text style={styles.titleText}>read from device</Text>
          <Button 
            full
            rounded
            success
            onPress={setStartedRead}
          >
          </Button>
          <Text style={styles.titleText}>value from sensor: {BleReadVal}</Text>
        </View>
        
        <View style={styles.statusPanel}>
          <Text style={styles.titleText}>toggle lock</Text>
          <Switch
              trackColor={{false: '#000', true: '#fff'}}
              thumbColor={locked ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleLock}
              value={locked}
            />
          
        </View>

        <View style={styles.list}>
          <FlatList
            style={styles.list}
            data={devices}
            renderItem={({item, index}) => (
              <ListItem 

    
                button onPress={() => {setSelID(item.id)}}

                key={index} 
                title={item.name || ''}
                subtitle={`RSSI: ${item.rssi}`}
                
                bottomDivider
              >
                <Text style={styles.titleText}>{item.name || ' '}{` RSSI: ${item.rssi}`|| ' '}{` ID: ${item.id}`}</Text>
                <Text style={styles.titleText}>{item.isConnectable}</Text>
              </ListItem>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  
  },
  containerButton: {
    flex: 0,
    justifyContent: 'center',
    padding: 30

  },
  
  statusPanel: {
    color: "white",
    backgroundColor: 'black',
    flex: 0,
    marginBottom: 15
  },
  list: {
    flex: 1,
    color: "red",
    backgroundColor: '#000'
  },
  titleText: {
    color:"white",
    fontSize: 13,
    fontWeight: "bold",
    
  },
});

export default BleScanner;