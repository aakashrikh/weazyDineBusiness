import React, { Component } from 'react';
import {
    Text,View,ScrollView,
    StyleSheet,Image,Pressable,ActivityIndicator,
    TouchableOpacity,ImageBackground
} from 'react-native';


class Loading extends Component{
    render(){
        return(
            <View style={{flex:1}}>

            <Image  source={require('../img/loader.gif')} 
            style={{width:65,height:60,alignSelf:"center",marginTop:270}} />

            </View>
        )
    }
}
export default Loading