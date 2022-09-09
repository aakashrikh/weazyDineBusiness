import React, { Component } from 'react';
import {
    Text,View,ScrollView,ActivityIndicator,
    StyleSheet,Image,Pressable,
    TouchableOpacity,ImageBackground
} from 'react-native';
import { 
    Input,Icon,Button 
} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContextProvider';

//Global StyleSheet Import
const styles = require('../Components/Style.js');


class PasswordLogin extends Component 
{
    static contextType = AuthContext;
    constructor(props)
        {
            super(props);
            this.state={
                contact_no:"",
                isLoading: false,
                password:''
            }
        }


    login =()=>{
        var contact_no=this.state.contact_no;
        var phoneNumber = this.state.contact_no;
        let rjx= /^[0]?[6789]\d{9}$/;
        let isValid = rjx.test(phoneNumber)
        if(!isValid){
            Toast.show('Enter Valid mobile number!');   
        }
        else if(this.state.password == ""){
            Toast.show('Enter Password!');
        }
        else{
            this.setState({isLoading:true});
            fetch(global.vendor_api+"login_by_localpart", {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact:contact_no,
                    passcode:this.state.password,
                    secret:"ggMjF4waGewcI*7#3F06"
                         })
                }).then((response) => response.json())
                .then((json) => {
                    console.log("jhkhk",json);
                   
                    if (json.msg == 'ok') {
                        OneSignal.sendTag("id", '' + json.usr);
                        OneSignal.sendTag("account_type", "vendor-bmguj1sfd77232927ns");
                        global.vendor = json.usr;
                        global.token = json.token;
          
                        if (json.user_type == 'login') {
          
                          const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "done" }
                          AsyncStorage.setItem('@auth_login', JSON.stringify(data));
                          this.context.login("done");
                        }
                        else {
          
                          const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "steps" }
                          AsyncStorage.setItem('@auth_login', JSON.stringify(data));
                          this.context.login("steps");
                        }
                      }
                      else {
                        Toast.show(json.error)
                      }
                  
                })
                .catch((error) => console.error(error))
                .finally(() => {
                  this.setState({ isLoading: false });
                });
        }
    }

    render()
    {
        
        
        let {contact_no}= this.state;
        return (
        
        <View style ={styles.container}>
           <ScrollView>
            <View style={{flex:1,marginTop:30}}>

            <Image source={require("../img/logo/mp.png")} 
            style={{height:50,width:51,alignSelf:"flex-end",margin:5,marginRight:20}}/>

            <Image source={require('../img/011.jpeg')} style={ss.image}/>
           
            </View>
            
            <View style={{flex:1,backgroundColor:"#fff",padding:10}}>
           
           <Text  style={[styles.heading]}>Welcome To Weazy Dine</Text>
            {/* <Text  style={styles.heading}> </Text> */}
            
            {/* Phone Input */}
            <Input  
             onChangeText={(e) => {this.setState({contact_no:e})}}
             placeholder='Enter your mobile number'
             maxLength={10}
             keyboardType="number-pad"
             leftIcon={
             <Icon
                name='call'
                size={25}
                type='ionicons'
                color='black'
                style ={{marginTop:15,borderRightWidth:1,paddingRight:10,borderRightColor:"grey"}}
            />
            }
            style ={{marginTop:15,marginLeft:15}}
           />


           {/* Phone Input */}
           <Input  
             onChangeText={(e) => {this.setState({password:e})}}
             placeholder='Enter your password'
             secureTextEntry={true}
             leftIcon={
             <Icon
                name='lock'
                size={25}
                type='ionicons'
                color='black'
                style ={{marginTop:15,borderRightWidth:1,paddingRight:10,borderRightColor:"grey"}}
            />
            }
            style ={{marginTop:15,marginLeft:15}}
           />


              <Text style={styles.small}>*We will never share your number with anyone ever!</Text>
          
            {/* Continue Button */}
            {this.state.isLoading ?
           <View style={ss.loader}>
           <ActivityIndicator size={"large"} color="rgba(233,149,6,1)" />
           </View>
           :
            <TouchableOpacity
            onPress={()=>this.login()}
            style={styles.buttonStyles}>
                <LinearGradient 
                    colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                    style={[styles.signIn]}>

                    <Text style={[styles.textSignIn, {
                    color:'#fff'}]}>Continue</Text>
                    
                </LinearGradient>
            </TouchableOpacity>
            }        
                        
                {/* <Button title="Send OTP" buttonStyle={{marginTop:10,borderRadius:5}}/> */}
            
            </View>
            </ScrollView>
        </View>
        );
   };
};

export default PasswordLogin;


//Internal StyleSheet
const ss=StyleSheet.create({
    image:{
        height:255,
        width:255,
        //marginTop:30,
        justifyContent:"center",
        alignSelf:"center"
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:20,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },
  
})