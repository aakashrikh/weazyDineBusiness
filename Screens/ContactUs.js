import React, { Component } from 'react';
import { Dimensions, TextInput } from 'react-native';
import {
    View,ImageBackground,
    StyleSheet,Pressable,ScrollView,Linking,
    Image,Text,TouchableOpacity, Platform
} from 'react-native';
import {Icon,Header} from "react-native-elements"
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class ContactUs extends Component{
    constructor(props){
        super(props);
    }

     //for header left component
     renderLeftComponent(){
        return(
          <View style={{flexDirection:"row",width:win.width/2}}>
           <Text style={{top:2}}>
           <Icon type="ionicon" name="arrow-back-outline"
            onPress={()=>{this.props.navigation.goBack()}}/> 
           </Text>
         
          </View>
        )
      }

    render(){
        return(
            <View style={[styles.container,{backgroundColor:"#fafafa"}]}>
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
                backgroundColor="#ffffff"
                />
                </View>

                <ScrollView>

                <SupportView />

                
                {/* Mail View */}

                <Mail />

                {/* FAQ View */}
                <FAQ navigation={this.props.navigation} />

            </ScrollView>
        </View>

        )
    }
}

// Support Top View

class SupportView extends Component{
    render(){
        return(
            <View style={{backgroundColor:"#fff",flexDirection:"row",borderTopWidth:2,borderColor:"#f5f5f5", padding:10}}>
                    <View style={style.leftView}>
                <Text style={[style.heading,{color:"#EDA332"}]}>Welcome to</Text>
                <Text style={[style.heading,{color:"#1F449B"}]}>
                 Customer Support</Text>
                 <Text style={styles.p}>
                Please get in touch and we will be happy to help you.
                 </Text>
                 </View>
                 <View style={{width:Dimensions.get("window").width/2}}>
                 <Image source={require("../img/Capture1.png")} 
                 style={{width:200,height:140,alignSelf:"center"}} />
                 </View>
                </View>
        )
    }
}

// FAQ VIew

class FAQ extends Component{
    constructor(props){
        super(props);
    }
    render(){

        return(
       <></>     
        //     <View style={{marginTop:10,backgroundColor:"#fff"}}>
        //     <Text style={[styles.heading,{fontSize:RFValue(14.5, 580),}]}>FAQ</Text>

        //     {/* Question View */}
        //     <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answers")}>
        //     <View style={style.questView} >
                
        //         <Text style={styles.p}>How to create an offer?</Text>
        //         <Icon type="ionicon" name="chevron-forward-outline" />
                
        //     </View>
        //     </TouchableOpacity >
        //         {/* Question View */}
        //         <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answer1")}>    
        //     <View style={style.questView}>
        //     <Text style={styles.p}>How to verify myself</Text>
        //     <Icon type="ionicon" name="chevron-forward-outline" />
        // </View>
        // </TouchableOpacity>
        //     {/* Question View */}
        //     <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answer2")}>
        //     <View style={style.questView}>
        //     <Text style={styles.p}>How can I add my shop?</Text>
        //     <Icon type="ionicon" name="chevron-forward-outline" />
        //     </View>
        //     </TouchableOpacity>
        //     {/* Question View */}
        //     <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answer3")}>
        //     <View style={style.questView}>
        //     <Text style={styles.p}>Are the Users genuine?</Text>
        //     <Icon type="ionicon" name="chevron-forward-outline" />
        //     </View>
        //     </TouchableOpacity>
        //     {/* Question View */}
        //     <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answer4")}>
        //     <View style={style.questView}>
        //     <Text style={styles.p}>Do I benefit from these offers?</Text>
        //     <Icon type="ionicon" name="chevron-forward-outline" />
        //     </View>
        //     </TouchableOpacity>
        //     {/* Question View */}
        //     <TouchableOpacity onPress={()=>this.props.navigation.navigate("Answer5")}>
        //     <View style={style.questView}>
        //     <Text style={styles.p}>Do these discount vary from your side?</Text>
        //     <Icon type="ionicon" name="chevron-forward-outline" />
        //     </View>
        //     </TouchableOpacity>
        //     </View>
        )
    }
}

// Mail View
class Mail extends Component{
    render(){
        return(
            <View>
            <View style={{marginTop:10,backgroundColor:"#fff",padding:10}}>
                    <Text style={[styles.heading,{fontSize:RFValue(14.5, 580),marginTop:0, marginLeft:0,color:"#EDA332"}]}>
                        Mail us
                    </Text>
                    <Text style={styles.h4} onPress={() => Linking.openURL('mailto:support@weazy.in') }>
                        support@weazy.in
                    </Text>
                </View>

<View style={{marginTop:10,backgroundColor:"#fff",padding:10}}>
<Text style={[styles.heading,{fontSize:RFValue(14.5, 580),marginTop:0, marginLeft:0,color:"#EDA332"}]}>
    Call US
</Text>
<Text style={[styles.h4,{fontFamily:Platform.OS == "ios" ? null : "Roboto-Medium"}]} onPress={() => Linking.openURL(`tel:$7060222517`) }>
    7060222517
</Text>
</View>
</View>
        )
    }
}

export default ContactUs;

const style=StyleSheet.create({
    heading:{
        color:"#1F449B",
        // fontSize:20,
        fontSize:RFValue(14.5, 580),
        fontFamily:"Raleway-SemiBold",
        // marginLeft:10
        // marginTop:45,
        // alignSelf:"center"
    },
    leftView:{
        flexDirection:"column",
        marginLeft:10,
        alignSelf:"center",
        width:Dimensions.get("window").width/2},

    questView:{padding:10,
        borderBottomWidth:1,
        borderColor:"#d3d3d3",
        flexDirection:"row",
        justifyContent:"space-between"
    }
    
})