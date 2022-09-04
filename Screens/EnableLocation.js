import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,
    TouchableOpacity,Pressable, PermissionsAndroid,Linking
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import {Icon,Input} from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import RNLocation from 'react-native-location';
//Global Style Import
const styles = require('../Components/Style.js');

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

class EnableLocation extends Component{
    constructor(props){
        super(props);

        this.state={
            app_location:false,
            device_location:false
        }
    }

    location=  async () =>
    {
      RNLocation.configure({
        distanceFilter: 5.0
      })
      this.setState({app_location:false})
      if(Platform.OS === 'android')
      {
        try {
      
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  );
            
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                      (info) => {
                        console.warn("info", info);
                        this.props.navigation.navigate('LocationAccess')
                    
                      },
                      (error) => {
                   
                       this.enable_device_location();
                      }
                    );
                  }
              else if (granted == "never_ask_again")
              {
                  this.setState({app_location:true})
                 
               // this.fetch_location(30.3165, 78.0322);
              }
              else
              {
                Geolocation.getCurrentPosition(
                  (info) => {
                    console.warn("info", info);
                    this.props.navigation.navigate('LocationAccess')
                
                  },
                  (error) => {
               
                   this.enable_device_location();
                  }
                );
              }
                }
                catch (err) {
                  console.warn(err)
                }
        }
        else
        {
          RNLocation.requestPermission({
            ios: "whenInUse",
          }).then(granted => {
              if (granted) {
                this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                  // console.warn(locations[0].latitude)
                  var latitude=locations[0].latitude;
                  var longitude=locations[0].longitude;
                  global.latitude=latitude;
                  global.longitude=longitude;
                  // this.fetch_location(latitude,longitude);
                  this.props.navigation.navigate('LocationAccess')
                })
              }
            })
          
        }
  }
    // {
    //     try {
      
    //         const granted = await PermissionsAndroid.request(
    //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         );
      
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //           Geolocation.getCurrentPosition(
    //             (info) => {
    //               console.warn("info", info);
    //               this.props.navigation.navigate('LocationAccess')
              
    //             },
    //             (error) => {
             
    //              this.enable_device_location();
    //             }
    //           );
    //         }
    //     else if (granted == "never_ask_again")
    //     {
    //         this.setState({app_location:true})
           
    //      // this.fetch_location(30.3165, 78.0322);
    //     }
    //     else
    //     {
    //       Geolocation.getCurrentPosition(
    //         (info) => {
    //           console.warn("info", info);
    //           this.props.navigation.navigate('LocationAccess')
          
    //         },
    //         (error) => {
         
    //          this.enable_device_location();
    //         }
    //       );
    //     }
    //       }
    //       catch (err) {
    //         console.warn(err)
    //       }

    // }

    enable_device_location = () =>
    {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 1000,
            fastInterval: 50,
          })
            .then((data) => {
                this.props.navigation.navigate('LocationAccess')
              // The user has accepted to enable the location services
              // data can be :
              //  - "already-enabled" if the location services has been already enabled
              //  - "enabled" if user has clicked on OK button in the popup
            })
            .catch((err) => {
              // The user has not accepted to enable the location services or something went wrong during the process
              // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
              // codes :
              //  - ERR00 : The user has clicked on Cancel button in the popup
              //  - ERR01 : If the Settings change are unavailable
              //  - ERR02 : If the popup has failed to open
              //  - ERR03 : Internal error
            });
    }


   enable_location = async () =>
   {
        try {
      
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (info) => {
              console.warn("info", info);
              this.props.navigation.navigate('LocationAccess')
            },
            (error) => {
               // this.props.navigation.navigate('LocationAccess')
           //console.warn(error)
              // See error code charts below.
             // this.fetch_location(30.3165, 78.0322);
             this.props.navigation.navigate('LocationAccess')
            }
          );
        }
    else
    {
        Linking.openSettings();
     // this.fetch_location(30.3165, 78.0322);
    }
      }
      catch (err) {
        console.warn(err)
      }
   }

    render(){
        return(
            <View style={styles.container}>
                
                <Text style={[styles.h4,{alignSelf:"center",fontFamily:"Roboto-Medium",marginTop:40}]}>
                    Step 6 of 6
                    </Text> 
                {/* Image */}

                {(!this.state.app_location)?
                <View>
                <View style={{marginTop:30}}>
                    <Image source={require("../img/brochure.png")} style={style.image}/>
                </View>

                {/* Text */}
                <View style={{marginTop:30}}>
                <Text style={[style.heading,{color:"#1F449B",fontSize: RFValue(18, 580)}]}>
                <Text style={[style.heading,{color:"#ffbf0b",fontSize: RFValue(18, 580)}]}>Allow
                </Text> your location</Text>
                <Text style={style.text}>We need to enable your</Text>
                <Text style={style.text}>location services for this.</Text>
                </View>

                <View>

                {/* Button */}
                <Pressable 
                onPress={()=>this.location()}
                style={style.buttonStyles}>
                <LinearGradient 
                    colors={['#326BF3', '#0b2564']}
                    style={styles.signIn}>

                    <Text style={[styles.textSignIn, {color:'#fff'}]}>
                    Sure I'd like that</Text>
                </LinearGradient>
                </Pressable>
                </View> 
                </View>
                :
                <View>
                <View style={{marginTop:30}}>
                    <Image source={require("../img/enable-location.jpg")} style={style.image}/>
                </View>

                {/* Text */}
                <View style={{marginTop:30}}>
                <Text style={[style.heading,{color:"#1F449B",fontSize: RFValue(18, 580)}]}>
                <Text style={[style.heading,{color:"#222",fontSize: RFValue(12, 580)}]}>Location permission not enabled
                </Text></Text>
                <Text style={style.text}>It look like you have turned off permission required for this feature. it can be enabled under Phone Settings -Apps - MP Partner  Permissions</Text>

                <Text style={style.text}></Text>
                </View>

                <View>

                {/* Button */}
                <Pressable 
                onPress={()=>this.enable_location()}
                style={style.buttonStyles}>
                <LinearGradient 
                    colors={['#326BF3', '#0b2564']}
                    style={styles.signIn}>

                    <Text style={[styles.textSignIn, {color:'#fff'}]}>
                    Go To Settings</Text>
                </LinearGradient>
                </Pressable>
                </View> 
                </View>
    }

            </View>
        )
    }
}

export default EnableLocation;

{/* Step to complete profiles */}
class Steps extends Component{
    render(){
        return(
            <View style={{flexDirection:"row",marginHorizontal:15,marginVertical:10,marginBottom:10}}>
                
                <View style={style.activestep}>
                <Icon name="done" size={20} color="white" />
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.activestep}>
                <Icon name="done" size={20} color="white" />
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.activestep}>
                <Icon name="done" size={20} color="white" />
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.activestep}>
                <Icon name="done" size={20} color="white" />
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.runningstep}>
                </View>
            </View>
        )
    }
}

//internal style
const style=StyleSheet.create({
      icon:{
          margin:10
      },

      p:
      {
        fontSize:RFValue(11,580),
        fontFamily:"Raleway-Regular",
        marginTop:25,
        alignSelf:"center",
        color:"#1F449B",
      },
      image:{
          height:250,
          width:250,
          justifyContent:"center",
          alignSelf:"center",
          marginTop:10
      },
      buttonStyles:{
        width:"70%",
        alignSelf:"center",
        marginTop:50,
        marginRight:5
      },
      heading:{
          fontSize:RFValue(18,580),
          fontFamily:"Raleway-SemiBold",
          justifyContent:"center",
          alignSelf:"center",
          marginBottom:10
      },
      text: {
          color: 'grey',
          fontSize: RFValue(11,580),
          fontFamily:"Raleway-SemiBold",
          justifyContent:"center",
          alignSelf:"center",
          marginRight:20,
          marginLeft:20
      },
      notNowButton:{
          alignSelf:"center",
          marginTop:20
      },
      notNowButtonText:{
        fontSize:RFValue(14,580),
        fontFamily:"Raleway-SemiBold",
        color:"#1F449B",
      },
      activestep:{
        width:25,
        height:25,
        backgroundColor:"#326bf3",
        borderColor:"#326bf3",
        borderWidth:1,
        borderRadius:50
    },
    runningstep:{
        width:25,
        height:25,
        // backgroundColor:"#326bf3",
        borderColor:"#326bf3",
        borderWidth:1,
        borderRadius:50
    },
    step:{
        width:25,
        height:25,
        backgroundColor:"#d3d3d3",
        borderRadius:50
    },
    stepBorder:{
        width:60,
        borderTopWidth:1,
        marginTop:13,
        borderColor:"#696969"
    }

})