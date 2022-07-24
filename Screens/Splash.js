import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
    View,ImageBackground,
    StyleSheet,
    Image,Text,Dimensions, ToastAndroid,
} from 'react-native';
import {Icon} from "react-native-elements";
import { RFValue } from 'react-native-responsive-fontsize';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class Splash extends Component{
    // componentDidMount(){
    //     setTimeout(()=>{
    //                 if(global.token==null){
    //                     console.log(global.token)
    //                     this.props.navigation.navigate("LogIn")
    //                 }
    //                 else {
    //                     this.props.navigation.navigate("CreateShopProfile")
    //                 }
                    
    //                 // this.props.navigation.navigate("MobileLogin")
                
            
    //         // this.props.navigation.navigate("LogIn")
    //     },2000)
    // }
    render(){
        return(
            <View style={{flex:1,}}>
               
                   <View>
                    <Image source={require('../img/logo/logo.png')} style={style.logo}/>
                    
                    </View>
                    <View style={{flexDirection:"column",position:"absolute",alignSelf:"center",bottom:30,}}>
                        <Text style={style.text}>
                            A Quality Product by Webixun Infoways.</Text>
                        
                        <View>
                        
                        <Text style={style.text}>Made With <Image source={require('../img/heart.png')} style={style.image}/>
                         <Text> in India.</Text></Text>
                        </View>
                       
                    </View>
                
            </View>
        )
    }
}

export default Splash;

const style=StyleSheet.create({
    logo:{
       height:180,
       width:330,
       alignSelf:"center",
       marginRight:35,
       top:250
    // height:100,
    // width:232,
    // justifyContent:"center",
    // alignSelf:"center",
    // top:250
    },
    text:{
        alignItems:"center",
        alignSelf:"center",
    },
    image:{
        height:18,
        width:21   
    }
    
})