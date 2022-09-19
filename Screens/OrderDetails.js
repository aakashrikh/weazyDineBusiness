import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View,ImageBackground,Alert,
    StyleSheet,Pressable,Switch,
    Image,Text,Dimensions,TouchableHighlight,
} from 'react-native';
import {Header,Icon} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

//Global Style Import
const styles = require('../Components/Style.js');

class OrderDetails extends Component{
  constructor(props){
    super(props);
    this.state={

    }
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
              <Text style={style.text}>Order #222222</Text>
          </View>

      )
  }


componentDidMount = ()=>
    { 
    
    }


  render(){
    return(
      <View style={styles.container}>

        {/* for header */}
        <View>
            <Header
            statusBarProps={{ barStyle: 'light-content' }}
            leftComponent={this.renderLeftComponent()}
            centerComponent={this.renderCenterComponent()}
            ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
              colors: ['#fff', '#fff'],
            }}
            />

        <View style={{flexDirection:"row",paddingHorizontal:10,width:"100%",padding:5,justifyContent:"space-between" }}>
          <View>
            <Text>Order #12345</Text>
          </View>
          <View>
            <Text>Today, 05:40 PM</Text>
          </View>
        </View>

          <Card 
          />

      </View>
      </View>
    )
  }
}


export default OrderDetails;


class Card extends Component{
  constructor(props){
    super(props);
    this.state={
    }
}

  productCard = ({item}) => (
    <View style={style.card}>
      <View style={{flexDirection:"row",paddingHorizontal:10,width:"100%",padding:5,justifyContent:"space-between" }}>
        <View>
          <Text>1 ITEM</Text>
        </View>
        <View>
          {/* <Text>RECEIPT</Text> */}
        </View>
      </View>


      <View style={{flexDirection:"row",width:"100%" }}>
              {/* View for Image */}
              <View style={{width:"20%"}}>
                <Image source={require('../img/01.png')}
                style={style.logo}/>
              </View>
                {/* View for Content */}
              <View style={style.contentView}>
                    {/* View for name and heart */}
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                         {/* Text View */}
                        <View style={{width:200,}}>
                        <Text style={[styles.smallHeading,{top:10,}]}>
                            Bande
                        </Text>

                        <View style={{marginTop:20,flexDirection:"row"}}>
                          <View style={{backgroundColor:"#E6EFF6",width:25,justifyContent:'center',borderRadius:3,borderWidth:1,borderColor:"#186AB1",}}>
                            <Text style={{alignSelf:"center"}}>1</Text>
                          </View>

                          <Icon name="close-outline" type="ionicon" size={20} style={{left:2}}/>
                          
                          <Text style={{fontSize:RFValue(12,580)}}> ₹ 20</Text>
                        </View>
                    </View>
                    {/* View for payment mode  */}
                    <View style={{margin:5,marginTop:20,marginLeft:-5, }}>
                     <Text>₹ 20</Text>
                    </View>
                </View>
              </View>
                
                
      </View>

      
    </View>
  );


  render(){
    return(
      <View>
        <FlatList
        navigation={this.props.navigation}
        showsVerticalScrollIndicator={false}
        data={[{ title: 'Title Text', key: 'item1' }]}
        renderItem={this.productCard}
        />

      <View style={{ backgroundColor: "#fff", marginTop: 5, paddingBottom: 10 }}>
          <View style={[style.detailsView, { borderBottomWidth: 0, paddingVertical: 10, alignItems: "center" }]}>
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.h4, { fontSize: RFValue(11.5, 580) }]}>Item Total</Text>
            </View>
            <Text style={[styles.h4, { fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580) }]}>₹ 111</Text>
          </View>
            <View style={[style.detailsView, { paddingVertical: 0, paddingBottom: 10 }]}>
              <Text style={[styles.h4, { fontSize: RFValue(11.5, 580) }]}>Delivery Cost</Text>
              <Text style={[styles.h4, { fontFamily: "Montserrat-Medium", fontSize: RFValue(11.5, 580), color: "#ff9933" }]}>+ ₹ 11</Text>
            </View>
          <View style={[style.detailsView, { borderBottomWidth: 0 }]}>
            <Text style={[styles.h4, { color: "#000", fontSize: RFValue(12, 580) }]}>Grand Total</Text>
            <Text style={{ fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580), color: "#000" }}> ₹ 1100/-</Text>
          </View>
        </View>

        <View style={{height:2, backgroundColor:"#F5f5f5"}}/>
        {/* for customer details */}
        <View style={{ backgroundColor: "#fff", marginTop: 5, paddingBottom: 10 }}>
          <Text style={{ fontSize: RFValue(11.5, 580), color: "#696969", fontFamily: "Montserrat-Medium", fontWeight: "600", marginLeft: 10 }}>Customer Details</Text>
          
          <View style={{padding:5, paddingLeft:12}}>
            <Text style={[styles.h4, { color: "#000", fontSize: RFValue(12, 580) }]}>Aakash</Text>
            <Text style={{ color: "#000", fontSize: RFValue(12, 580) }}>+91-8006435315</Text>
          </View>

          <View style={{padding:5, paddingLeft:12}}>
            <Text style={[styles.h4, { color: "#000", fontSize: RFValue(12, 580) }]}>Address</Text>
            <Text style={{ color: "#000", fontSize: RFValue(12, 580) }}>24 house joy</Text>
          </View>


          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{padding:5, paddingLeft:12}}>
              <Text style={[styles.h4, { color: "#000", fontSize: RFValue(12, 580) }]}>Locality / Area</Text>
              <Text style={{ color: "#000", fontSize: RFValue(12, 580) }}>Mg Lage</Text>
            </View>

            <View style={{padding:5, paddingLeft:12,paddingRight:20}}>
              <Text style={[styles.h4, { color: "#000", fontSize: RFValue(12, 580) }]}>Landmark</Text>
              <Text style={{ color: "#000", fontSize: RFValue(12, 580) }}>Jama</Text>
            </View>
          </View>
        </View>



        {/* accept decline button */}

        <View style={{justifyContent:"space-evenly",flexDirection:"row",marginTop:40}}>
          <TouchableOpacity style={style.acceptButton}>
            <Text style={style.buttonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.declineButton}>
            <Text style={[style.buttonText,{color:"#000"}]}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

//Styling
const style = StyleSheet.create({
  text: {
      fontFamily: "Raleway-SemiBold",
      fontSize: RFValue(14.5, 580),
      margin: 5
  },
  card:{
    backgroundColor:"#fff",
    alignSelf:"center",
    width:Dimensions.get("window").width/1.05,
    top:7,
    marginBottom:10,
    shadowRadius: 50,
    shadowOffset: { width: 50, height: 50 },
    elevation:2,
    borderRadius:15,
    padding:6
  },
  contentView:{
    flexDirection:"column",
    width:"70%",
    marginRight:10,
    // paddingBottom:10, 
    // borderBottomWidth:0.5,
    // borderColor:"#d3d3d3",
     marginLeft:10,
    //  marginTop:10,
    
  },
  logo:{
    height:60,
    width:60,
    // borderWidth:0.2,
    borderRadius:5,
    borderColor:"black",
    margin:10,
    marginLeft:10
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  acceptButton:{
    borderColor:"green",
    backgroundColor:"green",
    borderWidth:1,
    borderRadius:5,
    alignItems:"center",
    width:"40%",
    padding:5
  },
  buttonText:{
    color:"#fff",
    alignSelf:"center",
    fontSize:RFValue(14,580)
  },
  declineButton:{
    borderColor:"red",
    borderWidth:1,
    borderRadius:5,
    alignItems:"center",
    width:"40%",
    padding:5
  },

})