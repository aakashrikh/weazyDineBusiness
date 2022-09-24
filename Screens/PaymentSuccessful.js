import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   Image, Text, Dimensions, ScrollView, Platform
} from 'react-native';
import { Header, Icon } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';


//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class PaymentSuccessful extends Component {
   constructor(props) {
      super(props);
      this.state = {

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
         </View>
      )
   }


   render() {

      return (
         <View style={styles.container}>
            {/* view for header */}
            <Header
               // statusBarProps={{ barStyle: 'light-content' }}
               leftComponent={this.renderLeftComponent()}
               ViewComponent={LinearGradient} // Don't forget this!
               linearGradientProps={{
                  colors: ['white', 'white'],
                  start: { x: 0, y: 0.5 },
                  end: { x: 1, y: 0.5 }

               }}
               containerStyle={{
                  // elevation:2,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderBottomColor: '#fff',
               }}
            />

            <ScrollView>
               <View>
                  <Image source={require('../img/payment_success.webp')} style={{ height: 200, width: 200, alignSelf: "center", marginTop: 100 }} />
                  
                  <Text style={{ alignSelf: "center", marginTop: 10,fontSize:RFValue(13,580),fontFamily:"Poppins-Medium" }}>Your payment has been processed!</Text>
                  <Text style={{ alignSelf: "center",textAlign:"center", fontSize:RFValue(13,580),fontFamily:"Poppins-Medium" }}>Details of the transaction are included below!</Text>



               </View>
            </ScrollView>

         </View>
      )
   }
}

export default PaymentSuccessful;


const style = StyleSheet.create({
   text: {
      fontSize: RFValue(10, 580),
      color: "grey",
   },
   input: {
      borderWidth: 1,
      width: Dimensions.get('window').width / 1.05,
      borderRadius: 5,
      marginLeft: 10,
      marginTop: 5,
      borderColor: "#326bf3",
      paddingLeft: 20,
      color: '#222'
   },
   catButton: {
      borderRadius: 5,
      justifyContent: "center",
      borderColor: "#EBEBEB",
      borderWidth: 1,
      height: 40,
      marginTop: 50,
      width: Dimensions.get('window').width / 1.5
   },
   buttonText: {
      alignSelf: "center",
      color: "#fff",
      fontFamily: Platform.OS == "android" ? "Roboto-Medium" : null,
      fontSize: 14,
   }
})