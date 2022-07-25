import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,
    TouchableOpacity,Dimensions, Linking
} from 'react-native';
import {Icon,Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import OneSignal from 'react-native-onesignal';
import { AuthContext } from '../AuthContextProvider.js';
import DeviceInfo from 'react-native-device-info';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class More extends Component{

    constructor(props){
        super(props);
    }


      //for header left component
      renderLeftComponent(){
        return(
        <View style={{width:win.width}} >
            <Text style={[styles.h3]}>More</Text> 
        </View>
        )
    }

    render(){
        return(
            <View style={styles.container}>

            <View>
            <Header 
                statusBarProps={{ barStyle: 'light-content' }}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                    colors: ['#fff', '#fff'],
                
                
                }}
            />
            </View>

            <Buttons navigation={this.props.navigation}/>
            
            </View>
        )
    }
}

export default More;

//Touchable button

class Buttons extends Component{
    static contextType=AuthContext;
constructor(props){
    super(props);
    this.state={
        empty:global.contact
    }
}
    
    logOut=()=>{
        fetch(global.vendor_api+'logout_vendor', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                   }, 
                    body: JSON.stringify({ 

                            })}).then((response) => response.json())
                            .then((json) => {
                                OneSignal.sendTag("id",''+json.usr);
                                OneSignal.sendTag("acount_type","vendor"); 
                               AsyncStorage.setItem('@auth_login','')
                               global.token=null;
                               Toast.show("Logout Successfully!")
                               this.context.logout();
                                 
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isLoading:false})
                                });

        // try{
        //     AsyncStorage.setItem('token',"");
        //     AsyncStorage.setItem('login',"");
        //     global.login_data=false
        // }
        // catch(e)
        // {
        //     Toast.show("Login Failed")
        // }
        // Toast.show("Logged out successfully!")
        // this.props.navigation.navigate("MobileLogin")
        
    }

    render(){
        console.log(this.state.empty)
        return(
            <View style={{borderTopWidth:0.2,borderColor:"#d3d3d3"}}>
                    {/* Profile */}
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("Profile")}>
                        <View style={style.questView} >
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/profile.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Profile</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>
                        </View>
                    </TouchableOpacity >

                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("OtherCharges")}>
                        <View style={style.questView} >
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/about.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Other Charges</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>
                        </View>
                    </TouchableOpacity >

                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChangeShopTime")}>
                        <View style={style.questView} >
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/times.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Update Store Timing</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>
                        </View>
                    </TouchableOpacity >
                     {/* Profile */}
                     <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChangeLocation")}>
                        <View style={style.questView} >
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/placeholder.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Change Store Location</Text>
                        </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>
                        </View>
                    </TouchableOpacity >
                    
                    {/* Category change */}
                    {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("CategoryChange")}>    
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/list.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Change Category</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity> */}

                    {/* Notifications */}
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("Notification")}>
                        <View style={style.questView} >
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/notification-bell.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Notifications</Text>
                        </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>
                        </View>
                    </TouchableOpacity >
                    

                    {/* About us */}
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("AboutUs")}>    
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/about.png')} style={style.Icon}/>
                                <Text style={style.texxt}>About Us</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity>
                    
                    {/* privacy policy */}
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("PrivacyPolicy")}>
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/pp.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Privacy Policy</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity>
                   
                   {/* Contact us */}
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("ContactUs")}>
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/phone.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Support</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity>

                    {/* How to use */}
                    <TouchableOpacity onPress={()=>Linking.openURL('https://www.youtube.com/channel/UCQ85cK-wQljpJN56ERsbWCA')}>    
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/question.png')} style={style.Icon}/>
                                <Text style={style.texxt}>How to use the application?</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity>
                    
                    {/* logout */}
                    <TouchableOpacity onPress={()=>this.logOut()}>
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/logout.png')} style={style.Icon}/>
                                <Text style={style.texxt}>Logout</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity>
                    <Text
                style={{
                  alignSelf: 'center',
                  marginTop:10,
                  color: '#d3d3d3',

                }}>
                App Version: {DeviceInfo.getVersion()}
              </Text>
                </View>
        )
    }
}

const style=StyleSheet.create({
    icon:{
        margin:10
    },
    image:{
        height:100,
        width:100,
        alignSelf:"center",
        marginTop:50
    },
    questView:{
        padding:10,
        borderBottomWidth:1,
        borderColor:"#d3d3d3",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    texxt:{
        fontSize:RFValue(15,580),
        fontFamily:"Roboto-Regular",
        padding:5,
        paddingLeft:30
    },
    Icon:{
        height:30,
        width:30,
        alignSelf:"center",
        marginLeft:10
    }
})