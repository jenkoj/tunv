import {BleManager, State, Device, Subscription} from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export interface Observer {
  onStarted: (started: boolean) => void;
  onStateChanged: (state: State) => void;
  onDeviceDetected: (device: Device) => void;
  onDeviceConnected: (connected: boolean) => void;
  onLockStateChanged: (state: String) => void;
  onError: (error: any) => void;
}

/**
 * Sets up BLE scanning and returns functions for controlling it externally.
 */
export default () => {
  const bleManager = new BleManager();

  // also acts as 'started' flag
  let subscription: Subscription | null = null;
  // stores external observer callbacks
  let observer: Observer = {
    onStarted: () => {},
    onStateChanged: () => {},
    onDeviceDetected: () => {},
    onDeviceConnected: () => {},
    onLockStateChanged: () => {},
    onError: () => {},

  };
  
  const observe = (newObserver: Observer) => (observer = newObserver);

  let peripheralId: string;

  let lastDetectedDevice =  "0";

  const deviceVals = (vals: any, services: any) => { return { vals: vals, services: services } }

  const start = () => {
    if (subscription) {
      try {
        subscription.remove();
      } catch (error) {
        observer.onError(error);
      }
    }
    try {
      // listen to ble manager state changes (e.g. PowerOff, PowerOn, ...)
      subscription = bleManager.onStateChange((state) => {
        observer.onStateChanged(state);

        if (state === State.PoweredOn) {
          try {
            // Start scan, will stop previous scans
            bleManager.startDeviceScan(null, null, (error, device) => {
              if (error) {
                observer.onError(error);
                return;
              }

              if (device) {
                
                //if (device.localName == "MI1S" && device.id != lastDetectedDevice){
                console.log("--------------------names:")
                console.log(device.name)
                console.log(device.localName)
                console.log(device.id)
                console.log("--------------------end:")
                if (device.localName == "taplock" ){//&& device.id != lastDetectedDevice){
                //if (device.id != lastDetectedDevice){
                  
                  //detect only arduino
                  observer.onDeviceDetected(device);
                  lastDetectedDevice = device.id
                } 
                
                
              }
            });
          } catch (error) {
            observer.onError(error);
          }
        }
      }, true);
      observer.onStarted(true);
    } catch (error) {
      observer.onError(error);
      stop();
    }
  };

  const stop = () => {
    if (subscription) {
      try {
        subscription.remove();
        bleManager.stopDeviceScan();
      } catch (error) {
        observer.onError(error);
      }
      subscription = null;
      observer.onStarted(false);
    }
  };

 
  const conn = (id: string) => {
    console.log(id);
    

    console.log('isConneting:',id);    
    return new Promise( (resolve, reject) =>{
      bleManager.connectToDevice(id)
            .then(device=>{                           
                console.log('connect success:',device.name,device.id);
                
                //alert("connected");
                peripheralId = device.id;
                deviceVals.vals = device;       
                resolve(device);
                return device.discoverAllServicesAndCharacteristics();
    
            })
            .then(device=>{
                return fetchServicesAndCharacteristicsForDevice(device)
            })
            .then(services=>{
                deviceVals.services = services;

                console.log('get uuid',services);
    
                getUUID(services); 
                observer.onDeviceConnected(true)                             
            })
            .catch(error=>{
                console.log('connect fail: ',error);
                //alert("Can not connect")
                
                observer.onError("CANTCONN");    
                //throw error      
                reject(error);

            })         
    });
  
  };

  function disconn() {
    return new Promise( (resolve, reject) =>{
      bleManager.cancelDeviceConnection(peripheralId)
          .then(res=>{
              console.log('disconnect success',res.localName);
              observer.onDeviceConnected(false)
              resolve(res);
          })
          .catch(err=>{
              reject(err);
              console.log('disconnect fail',err);
          })     
  });
  }


  function read(lastValue:string){
  

  if(lastValue == "locked"){
    lastValue = "1"
  }else{
    lastValue = "0"
  }

  try{
    console.log("Pref ID: ", deviceVals.vals.id );
    console.log("Device charasteistic ", deviceVals.services.readCharacteristicUUID[0].toString() );
    console.log("Device serviceIDS: ", deviceVals.services.readServiceUUID[0].toString() )  
  }catch{
    console.log("id read failed")
  }
    return new Promise( (resolve, reject) =>{
        bleManager.readCharacteristicForDevice(deviceVals.vals.id, deviceVals.services.readServiceUUID[0].toString(), deviceVals.services.readCharacteristicUUID[0].toString())
            .then(characteristic=>{                    
                let buffer = Buffer.from(characteristic.value,'base64'); 
                let bleValue = buffer.toJSON().data.toString() 
                console.log('***************read success',bleValue );
                //when reading periodic, check if value has changed!
                console.log("comparing lastValue",lastValue,"and",bleValue[0])

                if(lastValue != bleValue[0]){
                  if (bleValue[0] == "1" ){
                    console.log("log from read func locked")
                    observer.onLockStateChanged("locked")
                  }else{
                    console.log("log from read func unlocked")
                    observer.onLockStateChanged("unlocked")
                  }
                }else{
                  console.log("read value is the same as stored one, skipping!")
                }
                lastValue = bleValue[0]
                resolve(bleValue);  
            },error=>{
                console.log('read fail: ',error);
                //alert('read fail: ' + error.reason);
                reject(error);
            }).catch(()=>{
              console.log("read fail")
            })
    });
}

function write(value:string){
  
  let Buffer = require("buffer").Buffer;
  let formatValue = new Buffer(value).toString("base64");
  
  //for mi only! remove arrays for write chrachetirstics add for arduino
  return new Promise( (resolve, reject) =>{      
      bleManager.writeCharacteristicWithResponseForDevice(deviceVals.vals.id,deviceVals.services.writeWithResponseServiceUUID[0].toString(), 
      deviceVals.services.writeWithResponseCharacteristicUUID[0].toString(),formatValue)
          .then(characteristic=>{                    
              console.log('write success',formatValue);

              if(value == "0"){
                observer.onLockStateChanged("locked")
              }
              if(value == "1"){
                observer.onLockStateChanged("unlocked")
              }

              resolve(characteristic);
          },error=>{
              console.log('write fail: ',error);
              //alert('write fail: ',error.reason);
              reject(error);
          }).catch(()=>{
            console.log("write failed!")
          })
  });
}
  return {
    start,
    stop,
    observe,
    conn,
    disconn,
    read,
    write,
  };
};

async function fetchServicesAndCharacteristicsForDevice(device: Device){
  var servicesMap = {}
  var services = await device.services()


  for (let service of services) {
    var characteristicsMap = {}
    var characteristics = await service.characteristics()
    
    for (let characteristic of characteristics) {
      characteristicsMap[characteristic.uuid] = {
        uuid: characteristic.uuid,
        isReadable: characteristic.isReadable,
        isWritableWithResponse: characteristic.isWritableWithResponse,
        isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
        isNotifiable: characteristic.isNotifiable,
        isNotifying: characteristic.isNotifying,
        value: characteristic.value
      }
    }

    servicesMap[service.uuid] = {
      uuid: service.uuid,
      isPrimary: service.isPrimary,
      characteristicsCount: characteristics.length,
      characteristics: characteristicsMap
    }
  }
  return servicesMap
}
function getUUID(services: any) {


  services.readServiceUUID = [];
        services.readCharacteristicUUID = [];   
        services.writeWithResponseServiceUUID = [];
        services.writeWithResponseCharacteristicUUID = [];
        services.writeWithoutResponseServiceUUID = [];
        services.writeWithoutResponseCharacteristicUUID = [];
        services.nofityServiceUUID = [];
        services.nofityCharacteristicUUID = [];     

        for(let i in services){
            // console.log('service',services[i]);
            let charchteristic = services[i].characteristics;
            for(let j in charchteristic){
                // console.log('charchteristic',charchteristic[j]);                  
                if(charchteristic[j].isReadable){
                    services.readServiceUUID.push(services[i].uuid);
                    services.readCharacteristicUUID.push(charchteristic[j].uuid);        
                }
                if(charchteristic[j].isWritableWithResponse){
                    services.writeWithResponseServiceUUID.push(services[i].uuid);
                    services.writeWithResponseCharacteristicUUID.push(charchteristic[j].uuid);           
                }
                if(charchteristic[j].isWritableWithoutResponse){
                    services.writeWithoutResponseServiceUUID.push(services[i].uuid);
                    services.writeWithoutResponseCharacteristicUUID.push(charchteristic[j].uuid);           
                }
                if(charchteristic[j].isNotifiable){
                    services.nofityServiceUUID.push(services[i].uuid);
                    services.nofityCharacteristicUUID.push(charchteristic[j].uuid);     
                }            
            }                    
        }       
          
        console.log('readServiceUUID',services.readServiceUUID);
        console.log('readCharacteristicUUID',services.readCharacteristicUUID);
        console.log('writeWithResponseServiceUUID',services.writeWithResponseServiceUUID);
        console.log('writeWithResponseCharacteristicUUID',services.writeWithResponseCharacteristicUUID);
        console.log('writeWithoutResponseServiceUUID',services.writeWithoutResponseServiceUUID);
        console.log('writeWithoutResponseCharacteristicUUID',services.writeWithoutResponseCharacteristicUUID);
        console.log('nofityServiceUUID',services.nofityServiceUUID);
        console.log('nofityCharacteristicUUID',services.nofityCharacteristicUUID);    
        
}



function byteToString(arr: Buffer) {  
  if(typeof arr === 'string') {  
      return arr;  
  }  
  var str = '',  
      _arr = arr;  
  for(var i = 0; i < _arr.length; i++) {  
      var one = _arr[i].toString(2),  
          v = one.match(/^1+?(?=0)/);  
      if(v && one.length == 8) {  
          var bytesLength = v[0].length;  
          var store = _arr[i].toString(2).slice(7 - bytesLength);  
          for(var st = 1; st < bytesLength; st++) {  
              store += _arr[st + i].toString(2).slice(2);  
          }  
          str += String.fromCharCode(parseInt(store, 2));  
          i += bytesLength - 1;  
      } else {  
          str += String.fromCharCode(_arr[i]);  
      }  
  }  
  return str;  
}  

