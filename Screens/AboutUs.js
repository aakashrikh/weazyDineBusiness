import React, {Component} from 'react';
import { View, Text , ScrollView, Image,
    TextInput, Button, StyleSheet,TouchableOpacity, ImageBackground} from 'react-native';
import {Header,Icon} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
//Global Style Import
const styles = require('../Components/Style.js');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class AboutUs extends Component{
        
    //for header left component
renderLeftComponent(){
    return(
      <View style={{top:5}}>
        <Icon type="ionicon" name="arrow-back-outline"
        onPress={()=>{this.props.navigation.goBack()}}/> 
      </View>
    )
  }
  //for header center component
  renderCenterComponent()
  {
  return(
  <View>
  <Text style={style.text}>About Us</Text>
  </View>
  
  )
  }

        render(){
        return (
            <View style={styles.container}>
                <Header 
                statusBarProps={{ barStyle: 'light-content' }}
                centerComponent={this.renderCenterComponent()}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
                
                }}
                />
            
                <ScrollView showsVerticalScrollIndicator={false}>
            
                <View >
                {/* <Image source={require("../img/logo/logo.png")} style={{width:188,height:80,margin:17,alignSelf:"center"}}/> */}
                    <Text style={{textAlign:"justify",fontFamily:"Roboto-SemiBold",
                    fontSize:RFValue(14.5, 580),alignSelf:"center",color:"grey"}}>
                        We're Your Partner in Success
                    </Text>
                    <Text style={{fontSize:RFValue(12, 580),fontFamily:"Roboto-Regular", color:"grey", lineHeight:23, marginTop:5,textAlign:"justify", paddingLeft:20,paddingRight:20}}>
                    After analyzing the current market situation, and realizing the problems of both vendors and users, which they face in their daily lives. We with our intensive effort tried to come up with a platform that would surely help in resolving problems of both within the minimum time.{"\n"}{"\n"}
                    Market Pluss is an application with an appealing interface that allows the customers in keeping track of the best offers and deals available and offering rich varieties of options to choose from distinct categories to customers and allowing vendors to focus more on their business growth.{"\n"}{"\n"}
                    Being powerful and effective yet user-friendly, Market Pluss is suitable for examining the market in the best possible way with amazing discounts and offers, and we assure to provide consistent updates in the future.{"\n"}
                    </Text>

                    <Text style={{textAlign:"justify",fontFamily:"Roboto-SemiBold",
                    fontSize:RFValue(14.5, 580),alignSelf:"center",color:"grey"}}>
                        Our Story
                    </Text>

                    <Text style={{fontSize:RFValue(12, 580),fontFamily:"Roboto-Regular", color:"grey", lineHeight:23, marginTop:5,textAlign:"justify", paddingLeft:20,paddingRight:20}}>
                    The story of the Market Pluss started in 2017 with the goal to help in connecting local vendors to consumers and to make the availability of more options within less time.
                    There are so many people out there who face problems while selecting various products from several places but due to high prices and lack of options, 
                    they fail to make the fair choice for choosing the exact goods with their exact needs.{"\n"}{"\n"}
                    We’ve come up with a platform that abolishes all such problems which one has to face while making choices for purchasing products and giving the asset of choosing from 
                    different categories without any hustle. We wish that everyone should be able to make better choices and get the results they are looking for.{"\n"}{"\n"}
                    Market Pluss eliminates your stress and stops you to endeavor in search of the modest prices that you can get for the product you are looking for. 
                    We’ll let you know the places around you where users can get the best-in-class deals and get the chance to look for more choices rather than being forced to buy the same old deals.{'\n'}
                    </Text>

                    <Text style={{textAlign:"justify",fontFamily:"Roboto-SemiBold",
                    fontSize:RFValue(14.5, 580),alignSelf:"center",color:"grey"}}>
                        Mission & Vision
                    </Text>

                    <Text style={{fontSize:RFValue(12, 580),fontFamily:"Roboto-Regular", color:"grey", lineHeight:23, marginTop:5,textAlign:"justify", paddingLeft:20,paddingRight:20}}>
                    We Endeavour to create, secure and enhance businesses on a digital platform, and also help Entrepreneurs in this process.{"\n"}{"\n"}
                    To create the most trust worthy Platform through best services & customer experience while helping businesses to explore their potential and increase their skills.{"\n"}
                    </Text>
                </View>
                     
            </ScrollView>
            </View>
            
        )
    }
}

export default AboutUs;

      //Styling
const style = StyleSheet.create({
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5
    },

}
)