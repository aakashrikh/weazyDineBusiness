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
                   
                    <Text style={{fontSize:RFValue(12, 580),fontFamily:"Roboto-Regular", color:"grey", lineHeight:23, marginTop:5,textAlign:"justify", paddingLeft:20,paddingRight:20}}>
                        Webixun Infoways Private Limited started working on this idea in 2022. 
                        The company is an IT firm with a Dehradun base that has built over 200 applications
                         for different niches so far. One of our hallmarks is our high rate of customer satisfaction and repeat business.{"\n"}
                    </Text>

                    <Text style={{textAlign:"justify",fontFamily:"Poppins-SemiBold",
                    fontSize:RFValue(13, 580),alignSelf:"center",color:"grey",paddingHorizontal:10}}>
                       Let us discuss the USP’s & Features of Weazy-Dine App and our innovation in detail because 
                       catering your requirement and converting it into a final product is our main goal.
                    </Text>

                    <Text style={{textAlign:"justify",fontFamily:"Poppins-SemiBold",
                    fontSize:RFValue(13, 580),marginTop:10, color:"grey",paddingLeft:15}}>
                      USP of Application: 
                    </Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}Through WeazyDine, it is possible for restaurant and hotel owners to share food menus electronically with customers. {"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,}}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}Using the app, hotels & restaurants can share promotions, discounts, coupons, cash-back, and other offers via app.  {"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify",paddingHorizontal: 15 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}There will be QR Codes available at every hotel, restaurant, cafe, and open-dining.Simply scan the barcode & the food menu for that specific restaurant or hotel will appear on the phone. {"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580),fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify",paddingHorizontal: 15}}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}It is compatible with Android and IOS. {"\n"}</Text>

                    <Text style={{textAlign:"justify",fontFamily:"Poppins-SemiBold",
                    fontSize:RFValue(13, 580),marginTop:10, color:"grey",paddingLeft:18}}>
                     Benefits of Digital Food Menu For Vendors: : 
                    </Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}Menus do not have to be printed.{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,}}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}This app increases your sales by 40% with zero commission or zero charges as you can create your 
                    audience on the app itself. {"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify",paddingHorizontal: 15 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}Food images and videos can be featured on a QR menu to upsell your products.  
                    Your guests are hooked by your food and will definitely get tempted to order more!{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580),fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify",paddingHorizontal: 15}}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}By creating QR codes by table number or room number, our platform creates unique QR codes 
                    for hotels and poolside/beachside activities. In this case, the system already knows where the 
                    order is coming from when the guest scans the QR code.{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}It is more efficient because orders and reorders can be  placed without the staff approaching the guest.{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}You can create marketing campaigns that display popup images and videos at a 
                    certain time or when an item is selected, giving you the chance to upsell or promote upcoming or ongoing items.{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}You can reserve an event and other party in advance after viewing the property's 
                    photos and menu of foods. Using the app, you can make payments online{"\n"}</Text>

                    <Text style={{ fontFamily: "Roboto-Bold",fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", textAlign: "justify", paddingHorizontal: 15,marginTop:10 }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" color="#696969" /> 
                    {" "}Each open-dining establishment, such as hotels, restaurants, cafes, & buffets, 
                    will have its own profile on the app.{"\n"}</Text>

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
        fontFamily:"Poppins-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5
    },

}
)