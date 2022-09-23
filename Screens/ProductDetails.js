import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class ProductDetails extends Component {
   constructor(props) {
      super(props);
      console.warn("props", props)
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
            <Text style={style.text}>Product Details</Text>
         </View>

      )
   }

   addonItem = ({ item }) => (
      <View style={{ margin: 5, justifyContent: "space-between", flexDirection: "row", width: Dimensions.get('window').width / 1.2 }}>
         <Text>{item.addon_name}</Text>
         <Text>{item.addon_price}</Text>
      </View>
   )

   variantsItem = ({ item }) => (
      <View style={{ margin: 5, justifyContent: "space-between", flexDirection: "row", width: Dimensions.get('window').width / 1.2 }}>
         <Text>{item.variants_name}</Text>
         <Text>{item.variants_price}</Text>
      </View>
   )

   render() {
      return (
         <View style={styles.container}>
            <Header
               statusBarProps={{ barStyle: 'light-content' }}
               leftComponent={this.renderLeftComponent()}
               centerComponent={this.renderCenterComponent()}
               ViewComponent={LinearGradient} // Don't forget this!
               linearGradientProps={{
                  colors: ['#fff', '#fff'],
               }}
            />

            <ScrollView>
               <View style={style.viewBox}>
                  <View style={{ width: "20%" }}>
                     <Image source={{ uri: global.image_url + this.props.route.params.data.product_img }} style={style.productImg} />
                  </View>

                  <View style={{ width: "70%", justifyContent: "center", paddingLeft: 40 }}>
                     <Text style={style.text}>{this.props.route.params.data.product_name}</Text>
                     <Text style={[style.text, { fontSize: RFValue(10, 580) }]} numberOfLines={2}>{this.props.route.params.data.description}</Text>
                     <View style={{ flexDirection: "row" }}>
                        <Text style={[style.text, {
                           fontSize: RFValue(12, 580),
                           textDecorationLine: 'line-through', textDecorationStyle: 'solid'
                        }]}>
                           ₹ {this.props.route.params.data.market_price}</Text>
                        <Text style={[style.text, { fontSize: RFValue(12, 580), paddingLeft: 20 }]}>₹ {this.props.route.params.data.our_price}</Text>
                     </View>
                  </View>

                  <View style={{ width: "10%" }}>
                     {
                        this.props.route.params.data.is_veg ?
                           <Image source={require('../img/veg.png')} style={{ height: 15, width: 15, alignSelf: "flex-end" }} />
                           :
                           <Image source={require('../img/non_veg.png')} style={{ height: 15, width: 15, alignSelf: "flex-end" }} />
                     }
                  </View>


               </View>

               {
                  this.props.route.params.data.variants.length > 0 ?
                     <View style={[style.viewBox, { flexDirection: "column" }]}>
                        <Text style={style.text}>Variant</Text>

                        <FlatList
                           data={this.props.route.params.data.variants}
                           renderItem={this.variantsItem}
                           keyExtractor={item => item.id}
                        />
                     </View>
                     :
                     <></>
               }

               {
                  this.props.route.params.data.addon_map.length > 0 ?
                     <View style={[style.viewBox, { flexDirection: "column" }]}>
                        <Text style={style.text}>Add-Ons</Text>

                        <FlatList
                           data={this.props.route.params.data.addon_map}
                           renderItem={this.addonItem}
                           keyExtractor={item => item.id}
                        />
                     </View>
                     :
                     <></>
               }


            </ScrollView>

            {/* <TouchableOpacity
               onPress={() => this.create()}
               style={style.buttonStyles}>
               <LinearGradient
                  colors={['#EDA332', '#EDA332']}
                  style={styles.signIn}>
                  <Text style={[styles.textSignIn, { color: '#fff' }]}>
                     Edit</Text>
               </LinearGradient>
            </TouchableOpacity> */}

         </View>
      )
   }
}

const style = StyleSheet.create({
   text: {
      fontFamily: "Raleway-SemiBold",
      fontSize: RFValue(14.5, 580),
      margin: 5
   },
   productImg: {
      height: 100,
      width: 100,
      borderRadius: 100
   },
   viewBox: {
      width: Dimensions.get('window').width / 1.05,
      backgroundColor: '#fff',
      alignSelf: 'center',
      borderRadius: 10,
      marginTop: 10,
      padding: 10,
      shadowColor: "grey",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginBottom: 10,
      flexDirection: "row"
   },
   text: {
      fontFamily: "Poppins-Medium",
      fontSize: RFValue(14, 580),

   },
   buttonStyles: {
      width: "50%",
      alignSelf: "center",
      marginBottom: 20,
   }

})

export default ProductDetails;