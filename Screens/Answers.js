import React, { Component } from 'react';
import { Dimensions, TextInput } from 'react-native';
import {
    View,ImageBackground,
    StyleSheet,Pressable,ScrollView,Linking,
    Image,Text,TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon,Header} from "react-native-elements"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

//Global Style Import
const styles = require('../Components/Style.js');

class Answers extends Component{
    constructor(props){
        super(props);
        this.state={
            likeColor:"black",
            dislikeColor:"black"
        }
    }
    like=()=>{
        
        if(this.state.likeColor="black"){
        this.state.likeColor="green",
        this.setState({likeColor:"green"}),
        this.setState({dislikeColor:"black"})
        }
    }
    dislike=()=>{
        
        if(this.state.dislikeColor="black"){
        this.state.dislikeColor="red",
        this.setState({dislikeColor:"red"}),
        this.setState({likeColor:"black"})
        }
    }
    //for header left component
    renderLeftComponent(){
        return(
          <View >
           <Text style={{top:2}}>
           <Icon type="ionicon" name="arrow-back-outline"
            onPress={()=>{this.props.navigation.goBack()}}/> 
           </Text>
         
          </View>
        )
      }
    render(){
        let {color}=this.state;
        return(
            <View>
                <View>
                <Header 
                statusBarProps={{ barStyle: 'dark-content' }}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
                
                }}
                />
                </View>
                <View style={style.answerView}>
                <Text style={[styles.p,{color:"black",
                fontFamily:"Raleway-Bold"}]}>How to create an offer?</Text>
                    <Text style={[styles.p,{paddingTop:10, color:"black"}]}>
                    You can create an offer by going to the offer page in the vendor application and adding the offer. 
                    </Text>
                </View>

                {/* <View style={style.questView} >
                <Text style={styles.h4}>Was this Helpful?</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={{paddingRight:10}}>
                <Icon type="ionicon" onPress={()=>this.like()} color={this.state.likeColor}
                 name="thumbs-up-outline"
/></Text>
                <Icon type="ionicon" name="thumbs-down-outline" onPress={()=>this.dislike()} color={this.state.dislikeColor} /> 
                </View>
            </View> */}
            <View style={[style.questView,{marginTop:10}]} >
                <Text style={styles.h4}>Still not resolved?</Text>
                <Text style={[styles.h5,{color:"#326bf3"}]} onPress={() => Linking.openURL('mailto:support@marketpluss.com') }>
                        Mail Us
                    </Text>
            </View>
            

            </View>

        )
    }
}
export default Answers


const style=StyleSheet.create({
    questView:{padding:10,
        backgroundColor:"#fff",
        marginTop:10,
        margin:10,
        borderRadius:10,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    answerView:{backgroundColor:"white",borderTopWidth:2,borderColor:"#f5f5f5", paddingTop:15,paddingBottom:20,padding:10}
    
})