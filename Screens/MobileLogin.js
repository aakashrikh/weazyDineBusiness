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

//Global StyleSheet Import
const styles = require('../Components/Style.js');


class MobileLogin extends Component 
{
  constructor(props)
    {
        super(props);
        this.state={
        contact_no:"",
        isLoading: false}
    }

   
    sendOtp = () =>
    {
        // if(this.state.contact_no != '')
        // {
            var contact_no=this.state.contact_no;
            var phoneNumber = this.state.contact_no;
            let rjx= /^[0]?[6789]\d{9}$/;
            let isValid = rjx.test(phoneNumber)
            if(!isValid){
                Toast.show('Enter Valid mobile number!');   
            }  
            else{  
            this.setState({isLoading:true});
            fetch(global.vendor_api+"mobile-verification", {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact:contact_no,
                    verification_type:"vendor",
                    request_type:'send'
                         })
                }).then((response) => response.json())
                .then((json) => {
                    console.log(json);
                   
                 if(json.msg=='ok')
                  {
                    console.warn(json.msg)
                    Toast.show('OTP sent successfully!'); 
                    this.props.navigation.navigate('OtpVerify',{contact_no:contact_no});
                  }
                  else
                  {
                    Toast.show(json.error);
                  }
                })
                .catch((error) => console.error(error))
                .finally(() => {
                  this.setState({ isLoading: false });
                });
            }
        // }
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
              <Text style={styles.small}>*We will never share your number with anyone ever!</Text>
          
            {/* Continue Button */}
            {this.state.isLoading ?
           <View style={ss.loader}>
           <ActivityIndicator size={"large"} color="rgba(233,149,6,1)" />
           </View>
           :
            <TouchableOpacity
            // onPress={this.send_otp}
            onPress={()=>this.sendOtp()}
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

export default MobileLogin;


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