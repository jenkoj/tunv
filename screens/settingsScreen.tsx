import React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';

import * as firebase from 'firebase';

import { Container, Content, Header, Form, Input, Button, Label, Item } from 'native-base';
import { Foundation, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import {storeData,getData} from "../storage/storageHandler"


var firebaseConfig = {
  apiKey: "AIzaSyBsLLrz2GAvKwgj-jiSJ4O-aaWGC-WSyKQ",
  authDomain: "tunvproject.firebaseapp.com",
  projectId: "tunvproject",
  storageBucket: "tunvproject.appspot.com",
  messagingSenderId: "1845743549",
  appId: "1:1845743549:web:5202260f1e9d4ffc7a8cd4",
  measurementId: "G-3ECEV5H61K"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
    
  constructor() {
    super();
    this.state = {
      show: false,
      show2: false,
      username: "buddy",
      updateUsername: 1
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal2 = this.showModal2.bind(this);
    this.hideModal2 = this.hideModal2.bind(this);
  }


  signUp = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("Enter at least six characters");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Signup successful.');
          this.setState({
            response: 'Account Created!'
          })
          alert("Signup sucessful.")
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          alert(error.message)
        });
    }
    catch (error) {
      console.log(error.toString())
    }
  }

login = (email, password) =>
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Login successful.');
        alert('Login successful.');
        this.hideModal()
        storeData(email,"@email").then(()=>{
            console.log("data stored to local storage!");
            this.state.updateUsername = 2;
            this.forceUpdate()
        });
        
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert(error.message)
      });


  showModal = () => {
    this.setState({ show: true });
    console.log(this.state.show)
  };

  hideModal = () => {
    this.setState({ show: false });
    console.log(this.state.show)
  };
  showModal2 = () => {
    this.setState({ show2: true });
    console.log(this.state.show2)
  };

  hideModal2 = () => {
    this.setState({ show2: false });
    console.log(this.state.show2)
  };

  componentDidMount(){

    getData("@email").then((data)=>{
        console.log("parsing letter: ", data);
        let parsed_mail = data.split(".");
        this.setState({username: parsed_mail[0]})
        //this.username = parsed_mail[0];
        console.log("name from settings", this.state.username)
      })
      
  }

  componentDidUpdate(){
    
    if(this.state.updateUsername == 2 ){
        getData("@email").then((data)=>{
            console.log("parsing letter: ", data);
            let parsed_mail = data.split(".");
            this.setState({username: parsed_mail[0]})
            //this.username = parsed_mail[0];
            console.log("name from settings", this.state.username)
        })
        this.state.updateUsername = 1;
        console.log("updating name")
    }
      
  }
    

  //let colorScheme = useColorScheme();

  render() {
    return (

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} fadingEdgeLength={0}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
          <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 40, fontWeight: "bold", marginTop: 20 }}>Hello {this.state.username}!</Text>
          </View>
          <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 18, marginTop: 1,fontWeight: "bold" }}>Here are your settings.</Text>
          </View>
          <View style={styles.settingName}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 20 }}>PROFILE</Text>
          </View>
          <View style={[styles.button, { backgroundColor: "#686868" }]}>
            <Pressable
              style={styles.button}
              onPress={this.showModal}
            >
              <Modal
                transparent={true}
                visible={this.state.show}
              >
                <Container style={styles.containerpopUp}>
                  <View style={{ flex: 0.3, backgroundColor: "white", marginTop:10 }}>
                    <Pressable
                      onPress={this.hideModal}
                    >

                     <AntDesign name="closecircleo" size={24} color="black" />

                    </Pressable>
                  </View>
                  <View style={{ flex: 0.7, backgroundColor: "white", alignContent: "center", alignItems: "center", marginBottom: 70 }}>
                    <Form>
                      <Item floatingLabel>
                        <Label>E-mail</Label>
                        <Input
                          //disable things 
                          autoCorrect={false}
                          autoCapitalize="none"
                          onChangeText={(email) => this.setState({ email })}
                        />
                      </Item>

                      <Item floatingLabel>
                        <Label>Password</Label>
                        <Input
                          //disable things
                          secureTextEntry={true}
                          autoCorrect={false}
                          autoCapitalize="none"
                          onChangeText={(password) => this.setState({ password })}
                        />
                      </Item>

                      <Button style={[styles.buttonpopUp, { marginTop: 20, backgroundColor: "black" }]}
                        full
                        rounded
                        success

                        onPress={() => this.login(this.state.email, this.state.password)}
                      >
                        <Text>Login</Text>
                      </Button>

                      <Button style={[styles.buttonpopUp, { backgroundColor: "black" }]}
                        full
                        rounded
                        primary
                        onPress={() => this.signUp(this.state.email, this.state.password)}
                      >
                        <Text>Sign Up</Text>
                      </Button>
                    </Form>
                  </View>
                </Container>
              </Modal>


              <View style={[styles.text, { backgroundColor: "#686868" }]}>
                <Text>
                  Login
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: "#686868" }]}>
                <AntDesign name="login" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={styles.settingName}>
                <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 10 }}>CONNECT</Text>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  Share access code
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                <AntDesign name="sharealt" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  Add new lock
                </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                <MaterialIcons name="add-link" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={[styles.settingName, { marginTop: 60 }]}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 10 }}>MORE INFO</Text>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            //onPress={toggleLock}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text >
                  Help
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
              <Ionicons name="md-help-buoy-outline" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
              
              onPress={this.showModal2}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text >
                  About
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                 <Feather name="help-circle" size={24} color="black" />
              </View>
            </Pressable>
            <Modal
            transparent={true}
            visible={this.state.show2}
          >  
           <Container style={styles.containerpopUpSmall}>
                  <View style={{ flex: 0.3, backgroundColor: "white", marginTop:10 }}>
                    <Pressable
                    onPress={this.hideModal2}
                    >

                     <AntDesign name="closecircleo" size={24} color="black" />

                    </Pressable>
                  </View>
                  <View style={{ flex: 0.7, backgroundColor: "white", alignContent: "center", alignItems: "center", marginTop: 0 }}>
                      <Text style={{ fontSize: 30, color: "#000000", marginLeft: 10 }}>TAPLOCK APP</Text>
                  </View>
                  <View style={{ backgroundColor: "white", alignContent: "center", alignItems: "center", marginBottom:50, marginTop: 0}}> 
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 15, color: "#000000", marginLeft: 10,margin:3 }}> V1.0  </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 20, color: "#000000", marginLeft: 10 }}> developed by</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 20, color: "#000000", marginLeft: 10 }}>Urh and Jakob</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", flexDirection: "row" }}>
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                      <Text style={{ fontSize: 15, color: "#000000", marginLeft: 10,margin:5 }}>June 2021</Text>
                    </View>
                  </View>
                  </View>
                </Container>
          </Modal>
          </View>
                   
        
        </ScrollView>
      </SafeAreaView>




    )
  }
}

const styles = StyleSheet.create({

 
 
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerpopUp: {
    //flex: 1,
    paddingHorizontal: 10,
    //alignItems: 'center',
    //justifyContent: 'center',
    margin: 20,
    marginTop: 100,
    marginBottom: 90,
    //height: 50,
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "column"
  },
  containerpopUpSmall: {
    paddingHorizontal: 10,
    margin: 60,
    marginTop: 300,
    marginBottom: 290,
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "column"
  },
  icon: {

  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    alignContent: "space-between",
    height: 50,
    width: "95%",
    margin: 7,
  },
  buttonpopUp: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    alignContent: "space-between",
    height: 40,
    width: 250,
    margin: 5,
  },
  buttonBack: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: "space-between",
    height: 40,
    width: 100,
    marginLeft: 130,
    marginBottom: 30,
    backgroundColor: "black",
    position: 'absolute',
    bottom: 0
  },
  text: {
    flex: 0.8,
    fontSize: 20,
    
  },
  text2:{
    fontWeight:"bold",
  },
  scrollView: {
    
    marginTop: 0,
    marginBottom: 0,
   
  },
  settingName: {
    marginLeft: 10,
    marginTop: 10,
    //alignItems: 'center',
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
  },
  welcomeMsg: {
   marginLeft: 10,

  }
});

