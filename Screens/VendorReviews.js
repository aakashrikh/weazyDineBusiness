import React, { Component } from 'react';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
   AppRegistry,
   StyleSheet,
   Text,
   TouchableOpacity,
   Linking, View, Dimensions, FlatList, ActivityIndicator, Image,
   TextInput, Pressable
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Icon, AirbnbRating, Rating, LinearProgress } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
//Global StyleSheet Import
const styles = require('../Components/Style.js');
const win = Dimensions.get('window');
class VendorReviews extends Component {
   constructor(props) {
      super(props);
      this.state = {
         fav: false,
         isloading: true,
         category_type: "shop",
         data: [],
         object: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },

      }
   }

   componentDidMount() {
      this.get_liked_shops();
      this.focusListener = this.props.navigation.addListener('focus', () => {
         this.get_liked_shops();
      });

   }


   get_liked_shops = () => {
      fetch(global.vendor_api + 'vendorReviewsRating', {
         method: "POST",
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': global.token
         },
         body: JSON.stringify({
         })
      }).then((response) => response.json())
         .then((json) => {
            console.warn(json);
            if (!json.status) {
               Toast.show(json.msg)
            }
             else
             {   
                 this.setState({data:json.data})
                 const object = this.state.object;

                 json.data[0].rating_percentage.map((value,key)=>
                 {
                        object[value.vendor_rating]=parseFloat(parseFloat(value.percentage).toFixed(1));


                 });

                 this.setState({object,isloading:false});
                // console.warn(this.state.object);
             }

         })
   }
   //for header left component
   renderLeftComponent() {
      return (
         <View style={{ width: win.width, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
               <MaterialCommunityIcons name="arrow-left" color={"#222"} type="ionicon" size={25} />
            </TouchableOpacity>
            {/* <Text style={styles.h4}>{this.props.route.params.shop_name} </Text> */}
         </View>
      )
   }
   renderItem = ({ item }) => (
      <TouchableOpacity style={[{ flexDirection: "row" }]}
      >
         <View>
            <View style={[style.card,{borderBottomWidth:1,}]}>
               <View style={{ flexDirection: "row", width: "100%" }}>
                  {/* View for Image */}
                  <View style={{ width: "20%" }}>
                     <Image source={{ uri: global.image_url + item.user.profile_pic }}
                        style={style.logo} />
                  </View>
                  {/* View for Content */}
                  <View style={style.contentView}>
                     {/* View for name and heart */}
                     <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {/* Text View */}
                        <View style={{ width: 230 }}>
                           <Text style={[styles.h4, { top: 10, }]} numberOfLines={2}>
                              {item.user.name}
                           </Text>
                           <View style={{ flexDirection: "row", marginTop: 15, marginLeft: 0 }}>
                              <Text style={{ marginLeft: 0, marginTop: 0 }}>{moment.utc(item.created_at).local().startOf('seconds').fromNow()}</Text>
                           </View>
                        </View>
                        {/* View for heart icon  */}
                     </View>
                  </View>
                  <View style={{ width: "20%" }}>
                     <View style={{ flexDirection: 'row',alignItems:"center" }}>
                        <View>
                           <AirbnbRating
                              defaultRating={1}
                              count={1}
                              readonly
                              showReview="false"
                              reviewSize={0}
                              size={20}
                              style={{ marginTop: 0, marginLeft: 0 }}
                              selectedColor="#68bb59"
                              isDisabled="true"
                           />
                        </View>
                        <View>
                           <Text style={[styles.h3, { marginTop: 15, marginLeft: 5 }]}>{item.vendor_rating}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
               <Text style={[styles.p, { top: -10, fontSize: RFValue(12, 580), marginLeft: 20, marginRight: 20 }]}
               >
                  <Text style={{ fontFamily: "Roboto-Regular" }}></Text>
                  {item.vendor_review} </Text>
            </View>
         </View>
         
      </TouchableOpacity>
   )
   render() {
      return (
         <View style={[styles.container, { backgroundColor: '#fff' }]}>

            {/* View for header */}
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
            {(!this.state.isloading) ?
               <View>
                  <ScrollView>
                     <View style={[styles.container, { backgroundColor: '#ffffff', marginBottom: 100 }]}>
                        {/* <View style={{ alignSelf: 'center', marginBottom: -50 }}>
                           <Text style={{ fontSize: 60, fontWeight: 'bold', color: '#222', marginBottom: 0 }}>{this.state.data[0].vendor.current_rating}</Text>
                        </View> */}
                        <View style={{ alignSelf: 'center',marginTop:5 }}>

                           <AirbnbRating
                              defaultRating={this.state.data[0].vendor.current_rating}
                              readonly
                              showReview="false"
                              imageSize={20}
                              style={{ paddingVertical: 10, marginTop: -50, marginLeft: 0 }}
                              selectedColor="#68bb59"
                              isDisabled="true"
                              reviewColor="#68bb59"
                              reviews={[
                                 'Poor ',
                                 'Bad',
                                 'Average',
                                 'Good',
                                 'Excellent'
                              ]}
                           />
                        </View>

                        <View style={{ paddingLeft: 20, marginTop: 20, paddingRight: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                           {/* View for Image */}
                           <View style={{ width: "20%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>Excellent</Text>
                           </View>
                           {/* View for Content */}
                           <View style={{ width: "60%" }}>
                              <LinearProgress
                                 value={this.state.object[5]}
                                 trackColor="#f2f2f2"
                                 style={{ marginVertical: 10, height: 10, borderRadius: 10 }}
                                 variant="determinate"
                                 color="#299617" />
                           </View>
                           <View style={{ width: "10%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>{this.state.object[5] * 100}%</Text>
                           </View>
                        </View>
                        <View style={{ paddingLeft: 20, paddingRight: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                           {/* View for Image */}
                           <View style={{ width: "20%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>Good</Text>
                           </View>
                           {/* View for Content */}
                           <View style={{ width: "60%" }}>
                              <LinearProgress
                                 value={this.state.object[4]}
                                 trackColor="#f2f2f2"
                                 style={{ marginVertical: 10, height: 10, borderRadius: 10 }}
                                 variant="determinate"
                                 color="#68bb59" />
                           </View>
                           <View style={{ width: "10%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>{this.state.object[4] * 100}%</Text>
                           </View>
                        </View>
                        <View style={{ paddingLeft: 20, paddingRight: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                           {/* View for Image */}
                           <View style={{ width: "20%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>Average</Text>
                           </View>
                           {/* View for Content */}
                           <View style={{ width: "60%" }}>
                              <LinearProgress
                                 value={this.state.object[3]}
                                 trackColor="#f2f2f2"
                                 style={{ marginVertical: 10, height: 10, borderRadius: 10 }}
                                 variant="determinate"
                                 color="#8fd400" />
                           </View>
                           <View style={{ width: "10%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>{this.state.object[3] * 100}%</Text>
                           </View>
                        </View>
                        <View style={{ paddingLeft: 20, paddingRight: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                           {/* View for Image */}
                           <View style={{ width: "20%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>Bad</Text>
                           </View>
                           {/* View for Content */}
                           <View style={{ width: "60%" }}>
                              <LinearProgress
                                 value={this.state.object[2]}
                                 trackColor="#f2f2f2"
                                 style={{ marginVertical: 10, height: 10, borderRadius: 10 }}
                                 variant="determinate"
                                 color="#ff8c00" />
                           </View>
                           <View style={{ width: "10%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>{this.state.object[2] * 100}%</Text>
                           </View>
                        </View>
                        <View style={{ paddingLeft: 20, paddingRight: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                           {/* View for Image */}
                           <View style={{ width: "20%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>Poor</Text>
                           </View>
                           {/* View for Content */}
                           <View style={{ width: "60%" }}>
                              <LinearProgress
                                 value={this.state.object[1]}
                                 trackColor="#f2f2f2"
                                 style={{ marginVertical: 10, height: 10, borderRadius: 10 }}
                                 variant="determinate"
                                 color="#ff4f00" />
                           </View>
                           <View style={{ width: "10%" }}>
                              <Text style={[styles.h4, { marginTop: 2 }]}>{this.state.object[1] * 100}%</Text>
                           </View>
                        </View>
                        <View style={{ alignSelf: 'flex-start', marginLeft: 25, marginTop: 20 }}>
                           <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>Reviews</Text>
                        </View>
                        {
                           (this.state.data != "") ?
                              <FlatList
                                 data={this.state.data}
                                 renderItem={this.renderItem}
                                 keyExtractor={item => item.id} />
                              :
                              <View>
                                 <Image source={require('../img/no-comments.png')} style={{ height: 300, width: 300, alignSelf: "center", marginTop: 100 }} />
                                 <Text style={{
                                    alignSelf: "center",
                                    fontFamily: "Raleway-SemiBold", fontSize: RFValue(14, 580), color: "#222"
                                 }}> No Reviews Found. </Text>
                              </View>
                        }
                     </View>
                  </ScrollView>
               </View> :
               <View>
               <Image source={require('../img/nr.jpg')} style={{ height: 300, width: 300, alignSelf: "center", marginTop: 100 }} />
               <Text style={{
                  alignSelf: "center",
                  fontFamily: "Raleway-SemiBold", fontSize: RFValue(14, 580), color: "#222"
               }}> No Reviews Found. </Text>
            </View>

                     }
               {/* <SkeletonPlaceholder>
   <View style={{ flexDirection: "row", alignItems: "center" }}>
   <View style={{ marginTop:25}}>
      <View style={{ width:80, height: 80, borderRadius: 10,alignSelf:'center' }} >
    </View>
<View>
      <View style={{ flexDirection: "row", alignItems: "center",marginTop:20,marginLeft:10 }}>
     
      <View style={{ marginLeft: "25%",alignSelf:'center' }}>
      <View style={{ width: win.width/2.12, height: 40, borderRadius: 4 }} />
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center",marginTop:25 }}>
   <View style={{ marginLeft: 20,marginRight:10}}>
   <View style={{ width:win.width/1.12, height: 20 }} />
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center",marginTop:15 }}>
   <View style={{ marginLeft: 20,marginRight:10}}>
   <View style={{ width:win.width/1.12, height: 20 }} />
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center",marginTop:15 }}>
   <View style={{ marginLeft: 20,marginRight:10}}>
   <View style={{ width:win.width/1.12, height: 20 }} />
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center",marginTop:15 }}>
   <View style={{ marginLeft: 20,marginRight:10}}>
   <View style={{ width:win.width/1.12, height: 20 }} />
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center",marginTop:15 }}>
   <View style={{ marginLeft: 20,marginRight:10}}>
   <View style={{ width:win.width/1.12, height: 20 }} />
   </View>
   </View>
   </View>
   </View>
   </View>
   <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginTop:10}}>
                       <View style={{ width:win.width, height: 100, borderRadius: 10 }} >
                       <View style={{ flexDirection: "row", alignItems: "center",marginTop:20,marginLeft:10 }}>
                       <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                       <View style={{ marginLeft: 20 }}>
                       <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                       <View
                       style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                       />
                       <View
                       style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                       />
                    </View>
                    </View>
                     </View>
                    </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginTop:10}}>
                       <View style={{ width:win.width, height: 100, borderRadius: 10 }} >
                       <View style={{ flexDirection: "row", alignItems: "center",marginTop:20,marginLeft:10 }}>
                       <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                       <View style={{ marginLeft: 20 }}>
                       <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                       <View
                       style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                       />
                       <View
                       style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                       />
                    </View>
                    </View>
                     </View>
                    </View>
                    </View>
 
</SkeletonPlaceholder> */}
            


         </View>
      );
   }
}
export default VendorReviews;
//Internal StyleSheet
const style = StyleSheet.create({
   textInput: {
      borderWidth: 1,
      borderColor: "#f3f3f3",
      marginTop: 30,
      width: Dimensions.get("window").width - 20,
      height: 70,
      alignContent: 'center',
      alignSelf: 'center',
      borderRadius: 5,
      color: '#000',
   },
   catButton: {
      // backgroundColor:"#BC3B3B",
      // padding:7,
      marginTop: 10,
      height: 40,
      marginLeft: 10,
      borderRadius: 5,
      justifyContent: "center",
      borderColor: "#EBEBEB",
      borderWidth: 1,
      position: "absolute",
      bottom: 5,
      height: 50
   },
   buttonText: {
      alignSelf: "center",
      color: "#fff",
      // fontFamily:"Roboto-Regular",
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
   },
   text: {
      fontFamily: "Montserrat-SemiBold",
      // fontSize:18,
      fontSize: RFValue(14, 580),
      margin: 10
   },
   card: {
      backgroundColor: "#fff",
      alignSelf: "center",
      width: Dimensions.get("window").width,
      top: 10,
      marginBottom: 10,
      shadowRadius: 50,
      shadowOffset: { width: 50, height: 50 },
      borderBottomWidth: 0.5,
      borderColor: "#ececec",
      // elevation:2,
      //backgroundColor:"#d3d3d3"
   },
   logo: {
      height: 45,
      width: 45,
      // borderWidth:0.2,
      borderRadius: 50,
      borderColor: "black",
      margin: 10,
      marginLeft: 10
   },
   signIn: {
      width: '100%',
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      flexDirection: "row",
      elevation: 1,
   },
   viewDetailsButton: {
      backgroundColor: "#326bf3",
      height: 35,
      marginRight: 5,
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: 100,
      alignContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
      borderRadius: 3,
      // position:"absolute",
      // top:76,
      // left:145
   },
   textButton: {
      fontFamily: "Montserrat-SemiBold",
      // fontSize:14,
      fontSize: RFValue(10, 580),
      color: "#5d5d5d",
      marginTop: 3
   }, iconView: {
      width: 32,
      height: 32,
      shadowColor: '#fafafa',
      shadowOpacity: 1,
      elevation: 1,
      padding: 6,
      shadowRadius: 2,
      shadowOffset: { width: 1, height: 1 },
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100
   },
   contentView: {
      flexDirection: "column", width: "55%", marginRight: 10, paddingBottom: 10, marginLeft: 10
   },
   text1: {
      fontFamily: "Raleway-SemiBold",
      fontSize: RFValue(15, 580),
      color: "grey",
      alignSelf: "center",
      marginTop: 250
   }
})