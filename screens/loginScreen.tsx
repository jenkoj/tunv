import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import * as firebase from 'firebase';

import {Container, Content, Header, Form, Input, Button, Label, Item} from 'native-base';

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
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component{
  constructor(props){
    super(props);

    this.state = ({
      email:'',
      password:''

    })
  }

  signUp = (email, password) => {
    try{
      if(this.state.password.length < 6){
        alert("Enter at least six characters");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(()=>{
        console.log('Signup successful.');
        this.setState({
                response: 'Account Created!'
            })
       })
       .catch((error)=> {
        console.log(error.code);
        console.log(error.message);
        alert("User already exist!")
      });
    }
    catch(error){
      console.log(error.toString())
    }
  }

  login = (email, password) => 
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(()=>{
        console.log('Login successful.');
       })
    .catch((error)=> {
        console.log(error.code);
        console.log(error.message);
      });
   

  render(){
    return(
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>E-mail</Label>
            <Input
            //disable things 
            autoCorrect={false} 
            autoCapitalize="none"
            onChangeText={(email)=>this.setState({email})}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
            //disable things
            secureTextEntry={true} 
            autoCorrect={false} 
            autoCapitalize="none"
            onChangeText={(password)=>this.setState({password})}
            />
          </Item>

          <Button style={styles.button}
            full
            rounded
            success
            onPress={()=>this.login(this.state.email, this.state.password)}
          >
            <Text>Login</Text>
          </Button>

          <Button style={styles.button}
            full
            rounded
            primary
            onPress={()=>this.signUp(this.state.email, this.state.password)}
          >
            <Text>Sign Up</Text>
          </Button>


        </Form>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    marginTop: 10,
  }
});
