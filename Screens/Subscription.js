import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from "react-native-responsive-fontsize";

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const data = [
   {
      id: 1,
      title: 'Silver',
      description: 'For new businesses and influencers',
      Price: '1300',
   },
   {
      id: 2,
      title: 'Gold',
      description: 'For agencies, D2C brands and influencers',
      Price: '2500',
   },
   {
      id: 3,
      title: 'Platinum',
      description: 'For growing businesses with a comprehensive marketing strategy',
      Price: '5000',
   },
]

class Subscription extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   //for header left component
   renderLeftComponent() {
      return (
         <View style={{ top: 5 }}>
            <Icon type="ionicon" name="arrow-back-outline"
               onPress={() => { this.props.navigation.goBack() }} />
         </View>
      )
   }
   //for header center component
   renderCenterComponent() {
      return (
         <View>
            <Text style={style.text}>Subscription</Text>
         </View>

      )
   }

   renderItem = ({ item }) => (
      <View>
         <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ChoosePaymentType",{data:data})}}>
            <View style={style.card}>
               <View>
                  <Text style={style.title}>{item.title}</Text>
                  <Text style={style.description}>{item.description}</Text>
               </View>
               <View style={{ justifyContent: 'center' }}>
                  <Text style={style.price}>
                     <Text style={{fontFamily:"Poppins-SemiBold",fontSize: RFValue(13, 580)}}>₹{item.Price}</Text>/month
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
      </View>
   )

   render() {
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

            <FlatList
               data={data}
               renderItem={this.renderItem}
               keyExtractor={item => item.id}
               showsVerticalScrollIndicator={false}
            />
         </View>
      );
   }
}

export default Subscription;


//Styling
const style = StyleSheet.create({
   text: {
      fontFamily: "Raleway-SemiBold",
      // fontSize:20,
      fontSize: RFValue(14.5, 580),
      margin: 5
   },
   card: {
      backgroundColor: '#fff',
      margin: 10,
      padding: 10,
      borderRadius: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
   },
   title:{
      fontFamily:"Poppins-SemiBold",
      fontSize: RFValue(13, 580),
      color:"#000",
   },
   description:{
      fontFamily:"Poppins-Regular",
      fontSize: RFValue(9, 580),
      marginTop:-5
   },
   price:{
      fontFamily:"Poppins-Regular",
      fontSize: RFValue(9, 580),
      color:"#000",
      marginTop:10
   }


})