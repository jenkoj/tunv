import AsyncStorage from '@react-native-community/async-storage';


export const storeData = async (value: string) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@location', jsonValue)
    } catch (e) {
      console.log("async store err!")
    }
  }
  
export const getData = () =>{
  
    return new Promise((resolve, reject) =>{
      AsyncStorage.getItem('@location')
       .then((data) =>{
        //console.log("read! data: ");
        //console.log(data)
         
        data = (data != null)? JSON.parse(data) : null;
  
        resolve(data)
  
        return data
  
       }).catch(err=>{
        console.log('read fail: ',err);
        reject(err);                    
    })
  
    })
  }

