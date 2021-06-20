import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { Text, View } from '../components/Themed';

import * as firebase from 'firebase';

import { Container, Content, Header, Form, Input, Button, Label, Item } from 'native-base';
import { Foundation, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';

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
      show: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
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
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          alert("User already exist!")
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
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert("E-mail or password is invalid.")
      });


  showModal = () => {
    this.setState({ show: true });
    console.log(this.state.show)
  };

  hideModal = () => {
    this.setState({ show: false });
    console.log(this.state.show)
  };

  //let colorScheme = useColorScheme();


  render() {
    return (

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} fadingEdgeLength={0}>
          <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Hello Urh!</Text>
          </View>
          <View style={styles.welcomeMsg}>
            <Text style={{ fontSize: 18, marginTop: 1 }}>Here are your settings.</Text>
          </View>
          <View style={styles.myDevices}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Profile</Text>
          </View>
          <View style={[styles.button, { backgroundColor: "#686868" }]}>
            <Pressable
              style={styles.button}
              onLongPress={this.showModal}
            >
              <Modal
                transparent={true}
                visible={this.state.show}
              >
                <Container style={styles.containerpopUp}>
                  <View style={{ flex: 0.3, backgroundColor: "white" }}>
                    <Pressable
                      onPress={this.hideModal}
                    >

                      <Foundation name={"x"} size={40} color="red" />

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
          <View style={styles.myDevices}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>Connect</Text>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            //onPress={toggleLock}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  Share code
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
            //onPress={toggleLock}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  Add device
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                <AntDesign name="addfile" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={[styles.myDevices, { marginTop: 60 }]}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>More info</Text>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            //onPress={toggleLock}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  Help
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                <Feather name="help-circle" size={24} color="black" />
              </View>
            </Pressable>
          </View>
          <View style={[styles.button, { backgroundColor: '#686868' }]}>
            <Pressable
              style={styles.button}
            //onPress={toggleLock}
            >
              <View style={[styles.text, { backgroundColor: '#686868' }]}>
                <Text>
                  About
                            </Text>
              </View>
              <View style={[styles.icon, { backgroundColor: '#686868' }]}>
                <MaterialIcons name="read-more" size={24} color="black" />
              </View>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>




    )
  }
}

const styles = StyleSheet.create({

  /*
  button: {
    marginTop: 10,
  },
  */
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
  icon: {

  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    alignContent: "space-between",
    height: 50,
    width: 380,
    margin: 10,
    //backgroundColor: 'transparent'
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
  scrollView: {
    //backgroundColor: 'pink',
    //marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 70,
  },
  myDevices: {
    marginTop: 10,
    alignItems: 'center',
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

  }
});
