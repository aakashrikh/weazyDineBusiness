import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,Dimensions,
    TouchableOpacity,Pressable,PermissionsAndroid, ToastAndroid, ActivityIndicator, 
} from 'react-native';
import {Icon,Input} from "react-native-elements";
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class LocationDetails extends Component{
    constructor(props){
        super(props);
        
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                <View>
                   {/* back icon */}
                   <MaterialCommunityIcons address="arrow-left" size={30}
                    onPress={()=>this.props.navigation.goBack()} style={{margin:10}}/>
                </View>
                </View>
               <ScrollView>
                   {/* Component call for second container */}
                   <Card navigation={this.props.navigation} data={this.props.route.params} />
               </ScrollView>
                
            </View>
        )
    }
}


export default LocationDetails;

class Card extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            address:"",
            area:"",
            city:"",
            state:"",
            Shop_No:"",
            isLoading:false
        }
    }
    componentDidMount()
    {
      this.setState({address:global.address});
      this.setState({area:global.area});
      this.setState({city:global.city});
      this.setState({state:global.state});
      this.focusListener=this.props.navigation.addListener('focus',() =>
      {   
      this.setState({address:global.address});
      this.setState({area:global.area});
      this.setState({city:global.city});
      this.setState({state:global.state});
  
      });
    }
    confirm=()=>{
        if(this.state.Shop_No=="")
        {
            Toast.show("Shop No./Block No. is required !");
        }
        else{
            this.setState({isLoading:true})
        fetch(global.vendor_api+'update_store_location', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization':global.token  
                   }, 
                    body: JSON.stringify({ 
                       latitude:this.props.data.latitude, 
                       longitude:this.props.data.longitude, 
                       area:this.state.area,
                       city:this.state.city,
                       state:this.state.state,
                       address:this.state.address,
                       pincode:this.props.data.pin_code
                       
      
                            })}).then((response) => response.json())
                            .then((json) => {
                                console.warn(json)
                                if(!json.status)
                                {
                                    var msg=json.msg;
                                    Toast.show("Something went wrong");
                                }
                                else{
                                    Toast.show(json.msg)
                                        this.props.navigation.navigate("VerificationDone")   
                                }
                               return json;    
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isLoading:false})
                                });
                            }
    }
    render(){
        return(
            <View style={{height:"70%"}}>
                 {/* View for Location */}
                 <View style={{padding:10,marginLeft:20}}>
                        <View style={{flexDirection:"row",width:"70%",}}>
                        <Image source={require("../img/icons/pin1.png")} 
                        style={{height:20,width:20,marginTop:5}}/>
                        <Text style={{fontFamily:"Roboto-Regular",fontSize:14}}>
                            {this.state.address}
                            </Text>
                        </View>
                    
                        {/* <Text
                        style={{fontFamily:"Roboto-Regular",fontSize:12}}
                        >
                          
                          {this.state.area}, {this.state.city},{this.state.state}
                            </Text> */}
                  </View>

                  {/* View for text container */}

                  <View style={style.container1}>
                      <Text style={[styles.small,{fontFamily:"Roboto-Regular",color:"grey",padding:2}]}>
                          A detailed address will help customers to {'\n'}
                        reach you.
                      </Text>
                  </View>

                  {/* View for fields */}
                  <View>
                      <Input 
                        placeholder="Shop No. / Block No. / address"
                        value={(this.state.Shop_No)}
                        onChangeText={(e)=>{this.setState({Shop_No:e})}}
                        style={{
                            fontSize:14,
                            color:"black"
                            }}
                        inputContainerStyle={{
                            width:Dimensions.get("window").width/1.17,
                            marginLeft:20,
                            marginRight:20
                        }}/>
                      <Input
                        placeholder="Lane / Road / Area (Optional)"
                        value={(this.state.area)}
                        onChangeText={(e)=>{this.setState({area:e})}}
                        style={{
                            fontSize:14,
                            color:"black"
                            }}
                        inputContainerStyle={{
                            width:Dimensions.get("window").width/1.17,
                            marginLeft:20,
                            marginRight:20
                        }}/>
                        {/* <Text style={[styles.small,{top:-20,left:20}]}>You can't edit address fetched by google maps</Text> */}
                      <Input
                        placeholder="City "
                        value={(this.state.city) }
                        onChangeText={(e)=>{this.setState({city:e})}}
                        style={{
                            fontSize:14,
                            color:"black"
                            }}
                        inputContainerStyle={{
                            width:Dimensions.get("window").width/1.17,
                            marginLeft:20,
                            marginRight:20
                        }}/>

                        <Input
                        placeholder="State"
                        value={(this.state.state)}
                        onChangeText={(e)=>{this.setState({state:e})}}
                        style={{
                            fontSize:14,
                            color:"black"
                            }}
                        inputContainerStyle={{
                            width:Dimensions.get("window").width/1.17,
                            marginLeft:20,
                            marginRight:20
                        }}/>

                  </View>

                  {/* Button */}
                  {!this.state.isLoading?
                  <View>
                    <TouchableOpacity  
                        onPress={()=>this.confirm()}
                        style={style.buttonStyles}>
                        <LinearGradient 
                            colors={['#326bf3', '#0b2654']}
                            style={styles.signIn}>

                            <Text style={[styles.textSignIn, {color:'#fff'}]}>
                            Confirm & Save</Text>
                        
                        </LinearGradient>
                    </TouchableOpacity>
                  </View>
                :
                <View style={style.loader}>
                <ActivityIndicator size={'large'} color="#326bf3" />
                </View>
                  }
            </View>
        )
    }
}

// Internal styling 
const style = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:"transparent",
      height:"100%"
    },
    map: {
      height:"100%",
      // flex:0.7
    },
    backIcon:{
      position:"absolute",
      top:10,
    //   backgroundColor:"white",
      borderRadius:50,
      left:10, 
      width:40,
      justifyContent:"center",
      height:40,
      padding:5
    },
    text:{
        fontFamily:"Roboto-Bold",
        fontSize:20,
        marginLeft:5,
    },
    container1:{
        borderRadius:5,
        borderWidth:1,
        borderColor:"#CCDDE4",
        backgroundColor:"#F1F4F8",
        margin:10,
        marginLeft:30,
        marginRight:30
    },
    buttonStyles:{
      width:"50%",
      alignSelf:"center",
      marginTop:25,
      marginRight:5
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:30,
        bottom:5,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },
})