import React, {Component, useState} from 'react';
import { View, Text , 
    ScrollView, Image,Alert,
    TextInput, Button,
    StyleSheet,TouchableOpacity,
    BackHandler, ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


//Global StyleSheet Import
const styles = require('../Components/Style.js');

class UnderVerification  extends Component{
    constructor(props){
        super(props);
    }
    
    // backAction = () => {
    //     Alert.alert("Sorry!", "You can't go back, \nYou are under verification.",
    //      [
    //       {
    //         text: "Ok",
    //         onPress: () => null,
    //         style: "cancel"
    //       },
    //     ]);
    //     return true;
    //   };
    
    //   componentDidMount() {
    //     this.backHandler = BackHandler.addEventListener(
    //       "hardwareBackPress",
    //       this.backAction
    //     );
      
    
    // }
        
        render(){
        return (
            <View style={styles.container}>
                {/* heading */}
                <Text style={[styles.h2,{color:"#000",alignSelf:"center",marginTop:110}]}>You Are Under</Text>
                <Text style={[styles.h2,{color:"#000",alignSelf:"center"}]}>Verification Process!</Text>
                
                {/* view for image and circle */}
                {/* <View style={style.circle}> */}
                <Image source={require('../img/verification.png')} style={style.logo}></Image>
                {/* </View>   */}
                
                {/* Button */}
                <TouchableOpacity  
                onPress={()=>this.props.navigation.navigate("VerificationDone")}
                style={style.buttonStyles}>
                <LinearGradient 
                    colors={['#326bf3', '#0b2654']}
                    style={styles.signIn}>

                    <Text style={[styles.textSignIn, {color:'#fff'}]}>
                    Refresh</Text>
                
                </LinearGradient>
                </TouchableOpacity>

            </View>
                )
            }
        }

export default UnderVerification;

// Internal Styling
const style = StyleSheet.create({
    container:{
        // backgroundColor:"#5B6071",
        flex:1
    },
    circle:{
        backgroundColor:"#DCDCDC",
        alignSelf:"center",
        width:200,
        height:200,
        borderRadius:250/2,
        marginTop:30,
        justifyContent:"center"
    },
    // logo:{
    //     width:130,
    //     height:130,
    //     alignSelf:"center",
    // },
    buttonStyles:{
        width:"40%",
        alignSelf:"center",
        marginTop:30,
        marginRight:5
    },
    logo:{
        width:300,
        height:300,
        alignSelf:"center",
    }
})