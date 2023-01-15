import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,Dimensions,
    TouchableOpacity,Pressable,PermissionsAndroid,ActivityIndicator
} from 'react-native';
import {Icon} from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
// import MapView, {Marker,  PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
import Geocoder from "react-native-geocoding";
import Toast from "react-native-simple-toast";
import { AuthContext } from '../AuthContextProvider.js';

//Global Style Import
const styles = require('../Components/Style.js');

const latitudeDelta = 0.015;
const longitudeDelta=0.0121;

const win = Dimensions.get('window');



class ChangeLocation extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={style.container}>
                {/* Component call for map */}
                <Map navigation={this.props.navigation}
                state={this.props.state}/>
            </View>
        )
}
}
export default ChangeLocation;

//this component is for map

class Map extends Component {
  static contextType = AuthContext;
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
      landmark:'',
      object: {},
      home: '',
      pin:true
    }

  }

  //Current location
  componentDidMount = async () => {
    // console.warn('hellloooo')
   this.locationGet();
  }

 

  locationGet = async() => 
  {
    // RNLocation.configure({
    //   distanceFilter: 5.0
    // })
    this.setState({app_location:false})
    if(Platform.OS === 'android')
    {
      try{
            // this.locationOn();
      
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
            );
          }
        }
        catch(err){
          console.warn(err)
        }
      }
      else
      {
        Geolocation.getCurrentPosition(
        (info) => {
          var latitude=info.coords.latitude;
          var longitude=info.coords.longitude;
          global.latitude=latitude;
          global.longitude=longitude;
          this.setState({ latitude: info.coords.latitude, longitude: info.coords.longitude })
          this.fetch_location(this.state.latitude,this.state.longitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
}

  onRegionChange = (data, details) => {

    if (Platform.OS === 'android') {
      if (details.isGesture) {
        this.setState({ latitude: data.latitude,
          longitude: data.longitude, });
        
        this.fetch_location(data.latitude,data.longitude);;
        this.setState({pin:true})
      }
    } else {
      this.setState({ latitude: data.latitude,
        longitude: data.longitude, });
      this.fetch_location(data.latitude,data.longitude);
      this.setState({pin:true})
    }
    
  }

  // For location search
  search_location = (data, details) => {
    this.setState({pin:false})
    // alert(details.address_components[0].long_name)
    this.setState({ landmark: details.address_components[0].long_name })
    this.setState({ city: details.address_components[2].long_name })
    this.setState({ area: details.address_components[1].long_name })
    this.setState({ state: details.address_components[3].long_name })
    this.setState({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    });
    this.setState({address:data.description });

    this.setState({ latitude: this.state.latitude, longitude: this.state.longitude })
  }


  fetch_location = (lati, longi) => {
    console.warn(lati,longi)
    Geocoder.init(global.google_key);
    Geocoder.from(lati, longi).then(json => {
  
      this.setState({address:json.results[0].formatted_address })
      global.latitude=this.state.latitude,
      global.longitude=this.state.longitude

      var addressComponent = json.results[1].address_components[1].long_name;
    global.address=json.results[0].formatted_address;
      var results=json;
        var data=json.results[0].address_components;
        data.map((values,index)=>
        {
          if(values.types[0]=="locality")
          { 
             global.city=values.long_name ;
             this.setState({ city: values.long_name })
          }
          if(values.types[0] == "neighborhood")
          {
            this.setState({landmark: values.long_name })
            global.landmark=values.long_name ;
          }
          if(values.types[0] == "political")
          {
            this.setState({ landmark: values.long_name })
          }

          if(values.types[0] == "administrative_area_level_1")
          {
            global.state=values.long_name ;
             this.setState({ state: values.long_name })
          }
          if(values.types[0] == "postal_code")
          {
             this.setState({ postal_code: values.long_name })
          }

        });
       

    }).catch(error => console.warn(error));
  }

  update_data = () =>
  { 
    this.setState({isloading:true})
    fetch(global.vendor_api+'update_store_location', { 
      method: 'POST',
        headers: {    
            Accept: 'application/json',  
              'Content-Type': 'application/json',
              'Authorization':this.context.token  
             }, 
              body: JSON.stringify({ 
                 latitude:this.state.latitude, 
                 longitude:this.state.longitude, 
                 area:this.state.landmark,
                 city:this.state.city,
                 state:this.state.state,
                 address:this.state.address,
                 pincode:this.state.postal_code
                 

                      })}).then((response) => response.json())
                      .then((json) => {
                          console.warn(json)
                          if(!json.status)
                          {
                              var msg=json.msg;
                              Toast.show(msg);
                          }
                          else{
                              Toast.show(json.msg)
                              this.props.navigation.navigate("More")
                              
                          }
                         return json;    
                     }).catch((error) => {  
                             console.error(error);   
                          }).finally(() => {
                             this.setState({isloading:false})
                          });


    // this.props.navigation.navigate("More",
    //   {
    //     address: this.state.address,
    //     area: this.state.area,
    //     city: this.state.city,
    //     state: this.state.state,
    //     latitude:this.state.latitude,
    //     longitude:this.state.longitude,
    //     home: "home"
    //   })
    // global.address = this.state.address;
    // global.area = this.state.area;
    // global.city = this.state.city;
    // global.state = this.state.state;
  }


  render() {
    let { region } = this.state;
    return (
      <View style={{ height: "100%" }}>
        {
          (this.state.latitude != '' && this.state.longitude != '') ?
            <View style={{ height: "70%" }}>
              {/* <MapView
                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={style.map}
                onRegionChangeComplete={this.onRegionChange}
                region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }}
              > */}
                {/* <MapView.Marker
          coordinate={{latitude: this.state.latitude,
          longitude: this.state.longitude}}
          title={"title"}
          description={"description"}
       /> */}
   
              {/* </MapView> */}
            {this.state.pin ?
              <View style={{    
                zIndex: 3,
                position: 'absolute',
                marginTop: -37,
                marginLeft: -11,
                left: '50%',
                top: '50%'}} >
                <Image source={require('../img/pin.png')}
                  style={{ height: 35, width: 35, }} />
              </View>
              :
              null
              }
            </View>
            :
            <View style={{marginTop:200,alignItems:"center"}}>
              <ActivityIndicator size="large" color="#5BC2C1" />
              <Text style={style.h4}>
                Locating...
              </Text>
            </View>
        }

        <Pressable style={style.backIcon}
          onPress={() => this.props.navigation.goBack()}  >
          <Icon type="ionicon" name="arrow-back-outline" size={20} />
        </Pressable>

        

        <GooglePlacesAutocomplete
  placeholder='Enter Location'
  minLength={2}
  autoFocus={true}
  returnKeyType={'default'}
  fetchDetails={true}
 
  onPress={(data, details = null) => 
      { this.search_location(data, details)
  }}

query={{
  key: global.google_key,
language: 'en',
}}
styles={{
  container: {
    borderRadius: 10,
    position: "absolute",
    top: 40,
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

                      <Text numberOfLines={1} style={style.text}>{this.state.landmark}</Text>
                      {/* <Pressable style={style.changeButton}>
             <Text style={style.changeText} >CHANGE</Text>
         </Pressable> */}
                    </View>

                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: "Raleway-Regular", fontSize: 12 }}
                    >{this.state.address}</Text>
                  </View>
                  {!this.state.isloading ?
                  <Pressable
                    onPress={() => this.update_data()}
                    style={style.confirmbutton}>
                    <LinearGradient
                      colors={['#5BC2C1', '#296e84']}
                      style={styles.signIn}>

                      <Text style={[styles.textSignIn, { color: '#fff' }]}>
                        CONFIRM LOCATION</Text>


                    </LinearGradient>
                  </Pressable>
                :
                <View style={style.loader}>
                <ActivityIndicator size={"large"} color="#5BC2C1"  />
                </View>
                  }
                </View>
                :
                <View style={{ flexDirection: "row" }}>
                  {/* <Image source={require("../img/icons/pin1.png")}
                    style={{ height: 20, width: 20, marginTop: 5 }} /> */}


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
  buttonorange: {
      minWidth: '80%',
      marginBottom: 5,
      backgroundColor: "#ffa46e",
      borderRadius: 10,
      height: 50,
      justifyContent: "center",
      alignSelf: "center",
      top:10
      
  },
  bottomContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0, 
  //   flex:0.5,
    height: "30%"
  },
  text: {
    fontFamily: "Raleway-Bold",
    // fontSize:20,
    fontSize: 16,
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
    top: 40,
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
    fontSize:14,
    color: "grey",
    fontFamily: "Raleway-SemiBold",
    padding: 10
  },
  confirmbutton: {
    width: "70%",
    alignSelf: "center",
    marginTop: 25,
    marginRight: 2,
    marginBottom: 10
  },
  changeText: {
    color: "#1F449B",
    padding: 3.5,
    fontSize: 13,
    fontFamily: "Raleway-SemiBold",
  },
  loader:{
    shadowOffset:{width:50,height:50},
    marginTop:30,
    marginBottom:5,
    shadowRadius:50,
    elevation:5,
    backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
},
});