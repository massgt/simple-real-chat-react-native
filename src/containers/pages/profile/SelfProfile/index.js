import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator,
  ToastAndroid,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import Logo from '../../../../assets/images/No_Image_Available.png';
import fire from '../../../../config/firebase';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'

export default class SelfProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      dob: '',
      number: '',
      gender: '',
      status: '',
      url: '',
      latitude: '',
      longitude: '',
      address: '',

      isLoadingLocation: false
    };
    this.getProfile();
    this.getUser()
    this.updateLocation();
  }

  handleLogout = async () => {
    const uid = firebase.auth().currentUser.uid
    const ref = firebase.database().ref(`/users/${uid}`)
    await ref.update({
      status: 'offline',
      last_seen: firebase.database.ServerValue.TIMESTAMP
    })
    firebase.auth().signOut();
    this.props.navigation.navigate('Login');
  };

  getUser = async () => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`/users/${uid}`);
    ref
      .on('value', snapshot => {
        this.setState({
          name: snapshot.val() != null ? snapshot.val().name : '',
          dob: snapshot.val() != null ? snapshot.val().dob : '',
          number: snapshot.val() != null ? snapshot.val().number : '',
          gender: snapshot.val() != null ? snapshot.val().gender : '',
          status: snapshot.val() != null ? snapshot.val().status : ''
        });
      })
      .then(res => {
        res
          ? console.log('statedaataa', this.state.spesificData)
          : ToastAndroid.showWithGravity(
              `Insert Your Data`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
      })
      .catch(err => {
        console.log(err);
      });

      
  };

  getProfile = async () => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`/users/${uid}`);
    ref.on('value', snapshot => {
      this.setState({
        name: snapshot.val() != null ? snapshot.val().name : '',
        url: snapshot.val() != null ? snapshot.val().urlImage : '',
      });
    });
  };

  updateLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location ',
      },
    );
    if (granted) {
      await Geolocation.getCurrentPosition(
        async position => {
          console.log('My current location', JSON.stringify(position));
          await this.setState({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          await axios
            .get(
              `http://us1.locationiq.com/v1/reverse.php?key=68e73a2b14084c&lat=${this.state.latitude}&lon=${this.state.longitude}&format=json`,
            )
            .then(res =>
              this.setState({
                address: `${res.data.display_name}`,
              }),
            );
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      this.watchID = Geolocation.watchPosition(position => {
         let region = {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           latitudeDelta: 0.00922 * 1.5,
           longitudeDelta: 0.00421 * 1.5,
         };
        //  console.log('region', region)
        // this.setState({lastPosition});
        
      });
    }
  };

  handleUpdateLocation = async () => {
    const uid = firebase.auth().currentUser.uid;
    const {name, dob, gender, number, latitude, longitude, url} = this.state;
    const email = firebase.auth().currentUser.email;
    const ref = firebase.database().ref(`/users/${uid}`);
    setTimeout(async () => {
      await ref.set({
        email,
        uid,
        name,
        dob,
        gender,
        number,
        latitude,
        longitude,
        status: 'online',
        urlImage: url,
        date: new Date().getTime(),
      });
      this.setState({
        isLoadingLocation: false
      })
      ToastAndroid.showWithGravity(
        `Location Updated`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }, 2000);
    this.setState({
      isLoadingLocation: true
    })
  }

  updateStatus = async () => {
    const uid = firebase.auth().currentUser.uid
    const email = firebase.auth().currentUser.email
    const ref = firebase.database().ref(`/users/${uid}`)
    ref.update({
      email,
      uid,
      status: 'online',
      date: new Date().getTime(),
    })
  }

  async componentDidMount() {
    const {latitude, longitude} = this.state
    const uid = firebase.auth().currentUser.uid
    const ref = firebase.database().ref(`/users/${uid}`)

    await this.updateStatus()
    await this.updateLocation()  
    this.getProfile();
    this.getUser();
   
    ref.onDisconnect().update({
      status: 'offline',
      last_seen: firebase.database.ServerValue.TIMESTAMP
    })
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#FAF8F0',
        }}>
        <View style={{height: 315}}>
          <View
            style={{
              height: 250,
              width: 500,
              backgroundColor: 'pink',
              alignSelf: 'center',
              borderBottomRightRadius: 230,
              borderBottomLeftRadius: 230,
            }}></View>
          <View
            style={{
              height: 125,
              width: 125,
              position: 'absolute',
              top: '50%',
              left: '32%',
              
              borderRadius: 125,
              elevation: 20,
            }}>
            <Image
              source={this.state.url ? {uri: `${this.state.url}`} : Logo}
              borderRadius={125}
              style={{height: 125, width: 125}}
            />
          </View>
          <Text
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: 100,
              fontSize: 22,
              color: '#FAF8F0',
            }}>
            {this.state.name}
          </Text>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('EditProfile')}
            style={{
              height: 50,
              width: 50,
              backgroundColor: '#FAF8F0',
              elevation: 4,
              borderRadius: 50,
              justifyContent: 'center',
              position: 'absolute',
              top: 200,
              left: 30,
            }}
            underlayColor="white"
            activeOpacity={0.5}>
            {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
            <Icon
              name="gear"
              style={{alignSelf: 'center'}}
              size={25}
              color="pink"
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.handleLogout()}
            style={{
              height: 50,
              width: 50,
              backgroundColor: '#FAF8F0',
              elevation: 4,
              borderRadius: 50,
              justifyContent: 'center',
              position: 'absolute',
              top: 200,
              right: 30,
            }}
            underlayColor="white"
            activeOpacity={0.5}>
            {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
            <Icon
              name="power-off"
              style={{alignSelf: 'center'}}
              size={25}
              color="pink"
            />
          </TouchableHighlight>
          <Text
            style={{
              position: 'absolute',
              bottom: 10,
              alignSelf: 'center',
              fontSize: 12,
              color: 'gray',
            }}>
            {this.state.status}
          </Text>
        </View>
        <ScrollView style={{position: 'relative',marginBottom:20}}>
          {this.state.isLoadingLocation ? 
            <ActivityIndicator color="pink" size="large" style={{marginBottom:10}} />
          :
          <View
            style={{
              alignItems: 'center',
              justifyContent:'center',
                marginBottom: 10
            }}>
            <TouchableHighlight
              onPress={() => this.handleUpdateLocation()}
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#FAF8F0',
                elevation: 4,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom:5
              }}
              underlayColor="white"
              activeOpacity={0.5}>
              {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
              <Icon
                name="map-marker"
                style={{ alignSelf: 'center' }}
                size={23}
                color="pink"
              />
            </TouchableHighlight>
            <View style={{alignItems:'center', width:200,paddingLeft:25}}>
              <Text style={{ fontSize: 14, letterSpacing: 0.5, color:'gray'}}>
              {this.state.address}
            </Text>
            </View>
          </View>
          }
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
            <TouchableHighlight
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#FAF8F0',
                elevation: 4,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: 5
              }}
              underlayColor="white"
              activeOpacity={0.5}>
              {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
              <Icon
                name="birthday-cake"
                style={{ alignSelf: 'center' }}
                size={23}
                color="pink"
              />
            </TouchableHighlight>
            <Text style={{ fontSize: 16, letterSpacing: 0.5, color: 'gray' }}>
              {this.state.dob}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
            <TouchableHighlight
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#FAF8F0',
                elevation: 4,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: 5
              }}
              underlayColor="white"
              activeOpacity={0.5}>
              {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
              <Icon
                name="odnoklassniki"
                style={{ alignSelf: 'center' }}
                size={23}
                color="pink"
              />
            </TouchableHighlight>
            <Text style={{ fontSize: 16, letterSpacing: 0.5, color: 'gray' }}>
              {this.state.gender}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              
            }}>
            <TouchableHighlight
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#FAF8F0',
                elevation: 4,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: 5
              }}
              underlayColor="white"
              activeOpacity={0.5}>
              {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
              <Icon
                name="address-book"
                style={{ alignSelf: 'center' }}
                size={23}
                color="pink"
              />
            </TouchableHighlight>
            <Text style={{ fontSize: 16, letterSpacing: 0.5, color: 'gray' }}>
              {this.state.number}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
