// SignUp.js
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import firebase from 'firebase'

// const config = {
//   apiKey: 'AIzaSyBzBlZq9Noff4tXQo9i3exmPo8SnYZ6x-o',
//   authDomain: 'realchat2.firebaseapp.com',
//   databaseURL: 'https://realchat2.firebaseio.com',
//   projectId: 'realchat2',
//   storageBucket: 'realchat2.appspot.com',
//   messagingSenderId: '280883155759',
//   appId: '1:280883155759:web:7fd94042afe4f7883147da',
//   measurementId: 'G-387M9DJNPV',
// };
// firebase.initializeApp(config);

export default class SignUp extends React.Component {
  state = {email: '', password: '', errorMessage: null, isLoading: false};

  errorMessage = async error => {
    await this.setState({
      errorMessage: error.message,
    });
    this.setState({
      errorMessage: null,
      isLoading: false
    });
  };

  handleSignUp = () => {
    setTimeout(() => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate('EditProfile'))
        .catch(error => this.errorMessage(error));
    }, 2000)
    this.setState({
      isLoading: true
    })
  };


  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FAF8F0'}}>
        {this.state.errorMessage &&
          ToastAndroid.showWithGravity(
            `${this.state.errorMessage}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )}
        <View style={{height: 200}}>
          <View style={{flexDirection: 'row', position: 'relative'}}>
            <View
              style={{
                width: 150,
                paddingTop: 20,
                paddingLeft: 30,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}>
                {/* <Text></Text> */}
                <Text style={{fontSize: 18, color: 'gray'}}>LOGIN</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: 'pink',
                height: 220,
                width: 220,
                borderRadius: 150,
                position: 'absolute',
                right: -35,
                top: -20,
                elevation: 1,
              }}></View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flex: 1,
              paddingLeft: 30,
            }}>
            <Text style={{fontSize: 28, color: 'pink'}}>Sign Up</Text>
          </View>
        </View>
        <View
          style={{
            height: 180,
            justifyContent: 'center',
          }}>
          <View style={{paddingRight: 50}}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#d1d1d1"
              style={{
                borderBottomColor: '#dedede',
                borderBottomWidth: 2,
                paddingVertical: 5,
                paddingLeft: 30,
                fontSize: 16,
              }}
              onChangeText={email => this.setState({email})}
              value={this.state.email}
            />
          </View>
          <View style={{paddingRight: 120, marginTop: 20}}>
            <TextInput
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="#d1d1d1"
              style={{
                borderBottomColor: '#dedede',
                borderBottomWidth: 2,
                paddingVertical: 5,
                paddingLeft: 30,
                fontSize: 16,
                marginBottom: 10,
              }}
              onChangeText={password => this.setState({password})}
              value={this.state.password}
            />
          </View>
        </View>
        <View style={{height: 240}}>
          {this.state.isLoading ? 
            <View style={{ alignSelf: 'center' }}>
              <ActivityIndicator size="large" color="pink"/>
            </View>
          :
            <View style={{ alignSelf: 'flex-end' }}>
              <TouchableOpacity
                style={{
                  height: 65,
                  width: 150,
                  backgroundColor: 'pink',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                }}
                onPress={this.handleSignUp}>
                <Text style={{ color: 'white', fontSize: 18 }}>Let's Chat!</Text>
              </TouchableOpacity>
            </View>}
          {/* <Image source={Logo} style={{position:'absolute'}} height={250} width={210}/> */}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
});
