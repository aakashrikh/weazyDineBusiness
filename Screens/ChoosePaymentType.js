import React, { Component } from 'react';
import {
   View,
   StyleSheet, ActivityIndicator,
   Image, Text, Dimensions, ScrollView, Pressable, TouchableOpacity,
} from 'react-native';
import { Header, Icon, Input } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');


class ChoosePaymentType extends Component {
   constructor(props) {
      super(props);
      this.state = {
         is_loading: false,
         data: [],
         buttonLoading: false
      }

   }
   //for header left component
   renderLeftComponent() {
      return (
         <View style={{ width: win.width, flexDirection: 'row' }}>
            <Text
               onPress={() => {
                  this.props.navigation.goBack();
               }}>
               <Icon
                  name="arrow-back-outline"
                  type="ionicon"
                  style={{ marginTop: 5, paddingRight: 10 }}
               />
            </Text>
            <Text style={[styles.h3, { paddingVertical: 5 }]}>Payment Methods</Text>
         </View>
      )
   }


   render() {


      return (
         <View style={styles.container}>

            {/* view for header */}
            <Header
               // statusBarProps={{ barStyle: 'dark-content' }}
               leftComponent={this.renderLeftComponent()}
               ViewComponent={LinearGradient} // Don't forget this!
               linearGradientProps={{
                  colors: ['white', 'white'],
                  start: { x: 0, y: 0.5 },
                  end: { x: 1, y: 0.5 }

               }}
               backgroundColor="#ffffff"
               containerStyle={{
                  // elevation:2,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderBottomColor: '#fff',
               }}
            />

            <ScrollView>
               <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>


                  <View>
                     <Text style={style.text}>Plan</Text>
                     <Text style={style.text1}>{this.props.route.params.data[0].title}</Text>
                  </View>
                  <View>
                     <Text style={style.text}>Amount</Text>
                     <Text style={style.text1}>₹ {this.props.route.params.data[0].Price}</Text>
                  </View>
               </View>
               <View style={{ borderWidth: 0.5, borderColor: "#f2f2f2", marginTop: 10 }} />

               {/* add to card */}
               <View style={{ marginTop: 10 }}>
                  <View style={{ backgroundColor: "#EDEDED", padding: 10 }}>
                     <Text style={[style.text1, { color: "#5d5d5d", fontSize: RFValue(10, 580) }]}>DEBIT/CREDIT CARDS</Text>
                  </View>
                  <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }} onPress={()=>{this.props.navigation.navigate("PaymentSuccessful")}}>
                     <View style={{ flexDirection: "row", width: "60%", padding: 10 }}>
                        <Image source={require('../img/card.png')} style={{ height: 40, width: 40 }} />
                        <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                           Add new card
                        </Text>
                     </View>
                     <View style={{ width: "40%" }}>
                        <Icon name="chevron-forward-outline" type="ionicon" size={20} style={{ alignSelf: "flex-end", marginTop: 20 }} />
                     </View>
                  </TouchableOpacity>
               </View>


               {/* upi  */}
               <View style={{ marginTop: 10, marginBottom: 20 }}>
                  <View style={{ backgroundColor: "#EDEDED", padding: 10 }}>
                     <Text style={[style.text1, { color: "#5d5d5d", fontSize: RFValue(10, 580) }]}>UPI</Text>
                  </View>
                  <Pressable style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }} onPress={()=>{this.props.navigation.navigate("PaymentFailed")}}>
                     <View style={{ flexDirection: "row", width: "60%", padding: 10 }}>
                        <Image source={require('../img/bhim.png')} style={{ height: 40, width: 27 }} />
                        <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                           Pay Using UPI
                        </Text>
                     </View>
                     <View style={{ width: "40%", paddingRight: 10 }}>
                        <Icon name="chevron-forward-outline" type="ionicon" size={25} style={{ alignSelf: "flex-end", marginTop: 20 }} />
                     </View>
                  </Pressable >
               </View>



            </ScrollView>


         </View>
      )
   }
}

export default ChoosePaymentType;


const style = StyleSheet.create({
   modalText: {
      marginBottom: 15,
      textAlign: "center"
   },
   modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      backgroundColor: 'red',
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
   },
   centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'red'
   },
   text: {
      fontSize: RFValue(10, 580),
      color: "grey",

   },
   text1: {
      fontSize: RFValue(12, 580),
      fontWeight: "600"
   },
   addressView: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderColor: "#f5f5f5",
      paddingVertical: 10
   },
   pay: {
      paddingHorizontal: 20,
      justifyContent: "space-between",
      borderRadius: 7,
      borderBottomWidth: 0.5,
      borderBottomColor: "grey"

   },

})