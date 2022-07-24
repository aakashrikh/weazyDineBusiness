import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,Dimensions,
    TouchableOpacity,Pressable,PermissionsAndroid, 
} from 'react-native';
import {Icon,Input} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class AddCover extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                   {/* header */}
                <View style={styles.header}>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                   {/* back icon */}
                   <MaterialCommunityIcons name="arrow-left" size={30}
                    onPress={()=>this.props.navigation.goBack()} style={style.icon}/>

                    {/* Skip button */}
                    <Text style={[styles.h3,{margin:10}]}>
                        Skip
                    </Text>
                </View>

                {/* heading */}
                <Text style={[styles.heading,{marginLeft:20}]}>Let's Complete Your Profile</Text>

                {/* Update cover photo view */}
                    <View style={{marginTop:15}}>
                        <Image source={require("../img/dropFile.png")}
                        style={style.image}/>
                    </View>

                    {/* Done Button View */}
                    <View>
                    <TouchableOpacity
                    onPress={()=>this.props.navigation.navigate("UnderVerification")}
                    style={styles.buttonStyles}>
                        <LinearGradient 
                            colors={['#326bf3', '#0b2654']}
                            style={[styles.signIn]}>

                            <Text style={[styles.textSignIn, {
                            color:'#fff'}]}>Done</Text>
                            
                        </LinearGradient>
                    </TouchableOpacity>
                        
                    </View>
               </View>
            </ScrollView>
            </View>
        )
    }
}

export default AddCover;



const style=StyleSheet.create({
    icon:{
        margin:10
    },
    image:{
        height:200,
        width:400,
        alignSelf:"center",
        borderWidth:0.2,
        borderColor:"#000"
    }
})