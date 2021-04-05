import {BleManager, State, Device, Subscription} from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export interface Observer {
  onStarted: (started: boolean) => void;
  onStateChanged: (state: State) => void;
  onDeviceDetected: (device: Device) => void;
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
    onError: () => {},
  };

  const observe = (newObserver: Observer) => (observer = newObserver);

  let peripheralId: string;

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
                observer.onDeviceDetected(device);
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
    console.log(id)

    console.log('isConneting:',id);      
    return new Promise( (resolve, reject) =>{
      bleManager.connectToDevice(id)
            .then(device=>{                           
                console.log('connect success:',device.name,device.id);    
                peripheralId = device.id;       
                resolve(device);
                return device.discoverAllServicesAndCharacteristics();
    
            })
            .then(device=>{
                return fetchServicesAndCharacteristicsForDevice(device)
            })
            .then(services=>{
                console.log('get uuid',services);    
                getUUID(services);                              
            })
            .catch(err=>{
                console.log('connect fail: ',err);
                reject(err);                    
            })
    });

  };

  function disconn() {
    return new Promise( (resolve, reject) =>{
      bleManager.cancelDeviceConnection(peripheralId)
          .then(res=>{
              console.log('disconnect success',res.localName);
              resolve(res);
          })
          .catch(err=>{
              reject(err);
              console.log('disconnect fail',err);
          })     
  });
  }


  function read(id:string, index: number){
    console.log("ratal",index)
    let serviceUUID = "0000180f-0000-1000-8000-00805f9b34fb"
    let charUUID = "00002a19-0000-1000-8000-00805f9b34fb"
    // let serviceUUID = "ade3d529-c784-4f63-a987-eb69f70ee816"
    // let charUUID = "e9241982-4580-42c4-8831-95048216b256"
    return new Promise( (resolve, reject) =>{
        bleManager.readCharacteristicForDevice(id,serviceUUID, charUUID)
            .then(characteristic=>{                    
                let buffer = Buffer.from(characteristic.value,'base64');  
                // let value = buffer.toString();       
                const value = byteToString(buffer);          
                console.log('read success', buffer, value);
                resolve(value);     
            },error=>{
                console.log('read fail: ',error);
                alert('read fail: ' + error.reason);
                reject(error);
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

