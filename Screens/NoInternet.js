import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,
    TouchableOpacity,Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

//Global Style Import
const styles = require('../Components/Style.js');

class NoInternet extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false,
        }
    }


    render(){
        return(
            <View style={styles.container}>

                {/* Image */}
                <View>
                    <Image source={require("../img/nic.png")} style={style.image}/>
                </View>

                {/* Text */}
                <View style={{marginTop:30}}>
                <Text style={[style.heading,{color:"#1F449B",fontSize:RFValue(18, 580),}]}>
                Ooops!</Text>
                <Text style={style.text}>It seems there is something wrong with your</Text>
                <Text style={style.text}>interent connection. Please Connect to the</Text>
                <Text style={style.text}>internet and start SPHERE again</Text>
                </View>


                <Pressable 
                        onPress={()=> {}}
                        style={style.buttonStyles}>
                        {/* <LinearGradient 
                            colors={['#EDA332', '#0b2564']}
                            style={styles.signIn}>

                            <Text style={[styles.textSignIn, {color:'#fff'}]}>
                            Try Again</Text>
                        </LinearGradient> */}
                    </Pressable>

            </View>
        )
    }
}

export default NoInternet;

//internal style
const style=StyleSheet.create({
      heading:{
          color:"#1F449B",
        //   fontSize:24,
        fontSize:RFValue(18, 580),
          fontFamily:"Raleway-Bold",
          marginTop:45,
          alignSelf:"center"
      },
      p:
      {
        // fontSize:14,
        fontSize:RFValue(10, 580),
        fontFamily:"Raleway-Regular",
        marginTop:25,
        alignSelf:"center",
        color:"#1F449B",
      },
      image:{
          height:300,
          width:300,
          justifyContent:"center",
          alignSelf:"center",
          marginTop:100
      },
      buttonStyles:{
        width:"50%",
        alignSelf:"center",
        marginTop:50,
        marginRight:5
      },
      heading:{
    //    fontSize:25,
          fontSize:RFValue(18, 580),
          fontFamily:"Raleway-Bold",
          justifyContent:"center",
          alignSelf:"center",
          marginBottom:10
      },
      text: {
          color: 'grey',
        //   fontSize: 15,
         fontSize:RFValue(11, 580),
          fontFamily:"Raleway-SemiBold",
          justifyContent:"center",
          alignSelf:"center",
          textAlign:"center"
      }

})