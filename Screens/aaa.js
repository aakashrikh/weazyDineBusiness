import React, { Component } from 'react';
import {
  Text, View,
  StyleSheet, Image, Dimensions, ActivityIndicator, Alert,
  TouchableOpacity, Pressable, PermissionsAndroid,
} from 'react-native';
import { Icon } from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
import { Searchbar } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import LocationEnabler from 'react-native-location-enabler';
import Geocoder from "react-native-geocoding";
//Global Style Import
const styles = require('../Components/Style.js');

const latitudeDelta = 0.015;
const longitudeDelta = 0.0121;

const win = Dimensions.get('window');

const {
  PRIORITIES: { HIGH_ACCURACY },
  addListener,
  checkSettings,
  requestResolutionSettings
} = LocationEnabler


class LocationAccess extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={style.container}>
        {/* Component call for map */}
        <Map navigation={this.props.navigation} />

        {/* Component call for bottom container */}
        {/* <Card navigation={this.props.navigation}/> */}
      </View>
    )
  }
}
export default LocationAccess;

//this component is for map
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
      latitude: '',
      longitude: '',
      on: false,
      // modalVisibleSorry:false,
      isloading: false,
      msg: '',
      timing: '',
      address: '',
      city: "",
      postal_code: "",
      area: "",
      state: "",
      object: {},
      home: ''
    }

  }


  //Current location
  componentDidMount = async () => {
    // console.warn('hellloooo')
    try {
      
      this.locationOn();

      const listener = addListener(({ locationEnabled }) =>
      console.log(`Location are ${locationEnabled ? 'enabled' : 'disabled'}`));

    config = {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: false, // default false
    };

    // Check if location is enabled or not
    checkSettings(config);

    // If location is disabled, prompt the user to turn on device location
    requestResolutionSettings(config);

    // ...
    // Removes this subscription
    listener.remove();

      // Fetching current location
     
    }

    catch (err) {
      console.warn(err);
    }
  }

  locationOn = async() => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (info) => {
          this.setState({ latitude: info.coords.latitude, longitude: info.coords.longitude })

          this.fetch_location(this.state.latitude, this.state.longitude);
          // console.warn(info.coords.latitude);
          // alert(this.state.latitude, this.state.longitude)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          fastestInterval: 1000,
        }
      );
    }
    else {
      alert("Location Denied")
    }
  }



  // Marker 

  onRegionChange = region => {
    this.setState({ latitude: region.latitude, longitude: region.longitude });
    this.fetch_location(region.latitude, region.longitude);
  }


  // For location search
  search_location = (data, details) => {

    console.log(details);
    // alert(details.address_components[0].long_name)
    this.setState({ address: details.address_components[0].long_name })
    this.setState({ postal_code: details.address_components[1].long_name })
    this.setState({ city: details.address_components[3].long_name })
    this.setState({ area: details.address_components[2].long_name })
    this.setState({ state: details.address_components[4].long_name })
    this.setState({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    });
    this.setState({ latitude: this.state.latitude, longitude: this.state.longitude })
  }

  // changeMarker =(details,data)=>{
  //   const latitude=this.state.latitude;
  //   const longitude=this.state.longitude;
  //   const address=this.state.address

  //   // alert(latitude)
  //   this.setState({latitude,longitude,address})
  // }



  fetch_location = (lati, longi) => {
    Geocoder.init(global.google_key);
    Geocoder.from(lati, longi).then(json => {
      // alert(longi)
      this.setState({ address: json.results[1].address_components[1].long_name })
      this.setState({ postal_code: json.results[0].address_components[1].long_name })
      this.setState({ city: json.results[0].address_components[3].long_name })
      this.setState({ area: json.results[0].address_components[2].long_name })
      this.setState({ state: json.results[0].address_components[4].long_name })
      // this.locationOn();
      var addressComponent = json.results[1].address_components[1].long_name;
      // console.warn(addressComponent);
      console.log(json.results[1].address_components[1]);
    }).catch(error => console.warn(error));
  }

  // Confirm Button
  confirm_location = () => {

    this.props.navigation.navigate("LocationDetails",
      {
        address: this.state.address,
        area: this.state.area,
        city: this.state.city,
        state: this.state.state,
        home: "home"
      })
    global.address = this.state.address;
    global.area = this.state.area;
    global.city = this.state.city;
    global.state = this.state.state;
  }


  render() {
    let { region } = this.state;
    return (
      <View style={{ height: "100%" }}>
        {
          (this.state.latitude != '' && this.state.longitude != '') ?
            <View style={{ height: "70%" }}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={style.map}
                onRegionChangeComplete={this.onRegionChange}
                region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }}
              >
              </MapView>

              <View style={{ position: "absolute", alignSelf: "center", top: 220, }}>
                <Image source={require('../img/pin.png')}
                  style={{ height: 35, width: 35, }} />
              </View>
            </View>
            :
            <View style={{ alignSelf: "center", marginTop: 270, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#326bf3" />
              <Text style={styles.h4}>
                Locating...
              </Text>
            </View>
        }

        <Pressable style={style.backIcon}
          onPress={() => this.props.navigation.goBack()}  >
          <Icon type="ionicon" name="arrow-back-outline" size={20} />
        </Pressable>

        <GooglePlacesAutocomplete
          placeholder='Search'
          fetchDetails={true}
          returnKeyType={'default'}
          onPress={(data, details = null) => {
            this.search_location(data, details)
          }}
          query={{
            key: global.google_key,
            language: 'en',
          }}
          styles={{
            container: {
              borderRadius: 10,
              position: "absolute",
              top: 28,
              left: 68,
              width: "80%",
              alignSelf: "center",
              fontFamily: "Raleway-Regular",
              shadowColor: 'grey',
              // shadowOpacity: 1.5,
              elevation: 1,
              // shadowRadius: 10,
              color: "#000",
              // shadowOffset: { width:1, height: 1 },
            }
          }}
        />

        <View style={style.bottomContainer}>

          <Text style={style.select}>SELECT YOUR LOCATION </Text>
          <View style={{ width: win.width, padding: 10 }}>

            {/* Location address area loading */}
            {
              (this.state.address != '') ?
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Image source={require("../img/icons/pin1.png")}
                      style={{ height: 20, width: 20, marginTop: 5 }} />


                    {/* change button row view */}
                    <View style={{ flexDirection: "row", width: "100%" }}>

                      <Text numberOfLines={1} style={style.text}>{this.state.address}</Text>
                      {/* <Pressable style={style.changeButton}>
             <Text style={style.changeText} >CHANGE</Text>
         </Pressable> */}
                    </View>

                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: "Raleway-Regular", fontSize: RFValue(10, 580) }}
                    >{this.state.postal_code} {this.state.area},{this.state.city},{this.state.state}</Text>
                  </View>

                  <Pressable
                    onPress={() => this.confirm_location()}
                    style={style.confirmbutton}>
                    <LinearGradient
                      colors={['#326BF3', '#0b2564']}
                      style={styles.signIn}>

                      <Text style={[styles.textSignIn, { color: '#fff' }]}>
                        CONFIRM LOCATION</Text>


                    </LinearGradient>
                  </Pressable>
                </View>
                :
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../img/icons/pin1.png")}
                    style={{ height: 20, width: 20, marginTop: 5 }} />


                  {/* change button row view */}
                  <View style={{ flexDirection: "row", width: "100%" }}>

                    <Text numberOfLines={1} style={style.text}>Locating...</Text>

                  </View>

                </View>
            }
          </View>
        </View>

      </View>
    )
  }
}

// Internal styling 

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    height: "100%"
  },
  map: {
    height: "100%",
    // flex:0.7
  },
  bottomContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    // flex:0.3,
    height: "30%"
  },
  text: {
    fontFamily: "Raleway-Bold",
    // fontSize:20,
    fontSize: RFValue(16, 580),
    marginLeft: 5,
  },
  changeButton: {
    position: "absolute",
    right: 20,
    borderWidth: 0.4,
    borderRadius: 7,
    backgroundColor: "#f3f3f3",

  },
  backIcon: {
    position: "absolute",
    top: 30,
    backgroundColor: "white",
    borderRadius: 50,
    left: 10,
    width: 40,
    justifyContent: "center",
    height: 40,
    padding: 5
  },
  select: {
    // fontSize:14,
    fontSize: RFValue(10, 580),
    color: "grey",
    fontFamily: "Raleway-SemiBold",
    padding: 10
  },
  confirmbutton: {
    width: "70%",
    alignSelf: "center",
    marginTop: 15,
    marginRight: 2,
    marginBottom: 10
  },
  changeText: {
    color: "#1F449B",
    padding: 3.5,
    fontSize: 13,
    fontFamily: "Roboto-SemiBold",
  }
});