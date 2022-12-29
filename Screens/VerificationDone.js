import React, { Component } from 'react';
import {
    Text,View,ScrollView,
    StyleSheet,Image,Pressable,
    TouchableOpacity,ImageBackground
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class VerificationDone extends Component{
static contextType =AuthContext
    constructor(props){
        super(props);
    }

    componentDidMount(){
        setTimeout(()=>{
            global.use_type='done';

            this.context.getProfile(this.context.token);

        },2000)
    }

  
    render(){
        return(
            <View style={styles.container}>

                {/* header back icon */}
               

                {/* View for content */}
                <View>
                <Text style={[styles.h2,{alignSelf:"center",marginTop:50}]}>Profile Complete!</Text>
                {/* <Image source={require("../img/icons/check.png")} style={style.image}/> */}

                <Image source={require('../img/tick.gif')} style={style.image}/>
                <Text style={[styles.h4,{color:"#5BC2C1",marginTop:80,alignSelf:"center"}]}>Congratulations You Have </Text>
                <Text style={[styles.h4,{color:"#5BC2C1",alignSelf:"center"}]}
                >Completed Your Profile.</Text>
                </View>
            
            </View>
        )
    }
}

export default VerificationDone;

const style=StyleSheet.create({
    icon:{
        margin:10
    },
    image:{
        height:150,
        width:150,
        alignSelf:"center",
        marginTop:50
    }
})