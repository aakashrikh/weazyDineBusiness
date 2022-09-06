import React, { Component } from 'react';
import {
    Text,View,ScrollView,Switch,Alert,
    StyleSheet,Image,
    TouchableOpacity,Dimensions, ImageBackground, Pressable
} from 'react-native';
import {Icon,Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';


//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class OfferProduct extends Component{

    constructor(props){
        console.warn(props.route.params)
        super(props);
        this.state={
            isOn:false,
            category:[],
            data:this.props.route.params.offer,
            latitude:1,
            longitude:1,
            vendor_category_id:0,
            product:"",
            package:""
        }
    }

    componentDidMount(){
        console.warn(this.state.data)
    }
     //for header left component
     renderLeftComponent(){
        return(
            <View style={{width:win.width,flexDirection:"row"}} >
            <Icon name="arrow-back-outline"  type="ionicon"
            onPress={()=>this.props.navigation.goBack()} style={{top:3}}/>
            <Text style={[styles.h3,{paddingLeft:15}]}>Offer details</Text> 
        </View>
        )
    }
    renderRightComponent(){
        return(
            <View >
            <Pressable onPress={()=>this.props.navigation.navigate("EditOffer",{data:this.state.data})} style={{
                backgroundColor:"#EDA332",justifyContent:"center",alignItems:"center",borderRadius:10,padding:5,width:50,paddingTop:2
            }}>
            <Text style={[styles.h4,{color:"#fff"}]}>Edit</Text> 
            </Pressable>
        </View>
        )
    }

    //for header left component
    render(){
        return(
            <View style={styles.container}>
                <View>
                <Header 
                    statusBarProps={{ barStyle: 'light-content' }}
                    leftComponent={this.renderLeftComponent()}
                    rightComponent={this.renderRightComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['#fff', '#fff'],
                    }}
                    />
                </View>
                <ScrollView>
                <View>
                        <View style={[styles.card,
                            {shadowRadius: 50,
                                shadowOffset: {width: 1, height: 1},
                                elevation: 4,borderRadius:10,width:Dimensions.get('window').width/1.08,
                            alignSelf:"center",marginTop:10,height:80}]}>
                            <Text style={[styles.h3,{padding:10}]}>
                              {this.state.data.offer_name}
                            </Text>
                            <Text style={[styles.h4,{marginLeft:10,marginTop:-7}]}>
                              {this.state.data.offer}% OFF
                            </Text>
                        </View>

                        <View style={style.card1}>
                            {/* expiry data*/}
                            <View style={style.button}>
                                <View style={{flexDirection: 'row'}}>
                                <Icon type="ionicon" size={26} name="calendar-outline" />
                                <Text style={style.buttonText}>Expires on :</Text>
                                <Text style={[style.buttonText,{marginLeft:10}]}>{this.state.data.start_to}</Text>
                                </View>
                            </View>

                            <View style={style.button}>
                                <View style={{flexDirection: 'row'}}>                               
                                <Text style={[style.buttonText,]}>{this.state.data.offer_description}</Text>
                                </View>
                            </View>

                           
                        </View>
                                <View>  
                                <View>
                                <OffersCard 
                                data={this.state.data.products}
                                product={this.state.product}
                                package={this.state.package}
                                navigation={this.props.navigation}
                                />
                                </View>
                              
                                  
                                </View>

                </View>        
                </ScrollView>
            </View>
        )
    }
}

export default OfferProduct;


//Card for Products offers
class OffersCard extends Component{
    render(){
        let details = this.props.data.map((details,id)=>{
            
            return(
                <View style={{marginBottom:15}}>
                   
                   {details.type=="product" ?
                   
                    <View>
                        <Text style={[styles.h3,{padding:10}]}>
                            Product
                        </Text>
                        
                <View style={style.card}>
                    
                <View style={{flexDirection:"row",width:"100%" }}>
                      {/* View for Image */}
                       <View style={{width:"27%"}}>
                        <Image source={{uri:global.image_url+details.product_img}}
                        style={style.logo}/>
                        </View>
                        {/* View for Content */}
                        
                        <View style={style.contentView}>
                            {/* View for name and heart */}
                            <View style={{marginLeft:60}}>
                                 {/* Text View */}
                               
                        <Text style={[styles.smallHeading,{top:10,}]}>
                            {details.product_name}
                            </Text>
                        <Text numberOfLines={3} style={[styles.p,{top:5,fontSize:RFValue(9.5,580), }]}> 
                        {details.description}
                         </Text>
                       
                        </View>

                         
                        {/* View for Price and offer */}
                        <View style={{flexDirection:"row",justifyContent:"space-between",alignSelf:"flex-end", marginTop:8 }}>
                            <View style={{flexDirection:"row"}}>
                        <Text style={[styles.p,{fontFamily:"Roboto-Regular",color:"grey" ,textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid'}]}>
                            {details.market_price}/-
                            </Text>
                            <Text style={[styles.p,{marginLeft:10, fontFamily:"Roboto-Bold"}]}>
                            {details.our_price}/-
                            </Text>
                            </View>
                            </View>
                        </View>
                        
                   </View>
            
                </View>
                </View>
                :
                null
                }
            
                {details.type=="package" ?
                    <View>
                        <Text style={[styles.h3,{padding:10}]}>
                            Package
                        </Text>
                <View style={style.card}>
                    
                <View style={{flexDirection:"row",width:"100%" }}>
                      {/* View for Image */}
                       <View style={{width:"27%"}}>
                        <Image source={{uri:global.image_url+details.product_img}}
                        style={style.logo}/>
                        </View>
                        {/* View for Content */}
                        
                        <View style={style.contentView}>
                            {/* View for name and heart */}
                            <View style={{marginLeft:60}}>
                                 {/* Text View */}
                               
                        <Text style={[styles.smallHeading,{top:10,}]}>
                            {details.product_name}
                            </Text>
                        <Text numberOfLines={3} style={[styles.p,{top:5,fontSize:RFValue(9.5,580), }]}> 
                        {details.description}
                         </Text>
                       
                        </View>

                         
                        {/* View for Price and offer */}
                        <View style={{flexDirection:"row",justifyContent:"space-between",alignSelf:"flex-end", marginTop:8 }}>
                            <View style={{flexDirection:"row"}}>
                        <Text style={[styles.p,{fontFamily:"Roboto-Regular",color:"grey" ,textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid'}]}>
                            {details.market_price}/-
                            </Text>
                            <Text style={[styles.p,{marginLeft:10, fontFamily:"Roboto-Bold"}]}>
                            {details.our_price}/-
                            </Text>
                            </View>
                            </View>
                        </View>
                        
                   </View>
            
            </View>
            </View>
                :
                null
                }
            </View>
            )
        })
    
        return(
            <View>
          {details}
           
        </View>
    
        )
    }
}

const style=StyleSheet.create({
    card1: {
        backgroundColor: '#fff',
        // position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        // height:"47%",
        width: Dimensions.get('window').width/1.08,
        borderRadius: 10,
        // top: Dimensions.get('window').height / 2.7,
        shadowRadius: 50,
        shadowOffset: {width: 1, height: 1},
        elevation: 4,
        marginTop:10,
        marginBottom:10
      },
      button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        alignContent: 'center',
        // height: 55,
        borderBottomWidth: 0.2,
        borderColor: '#b2beb5',
        alignItems: 'center',
        //backgroundColor:"red"
      },
      buttonText: {
        fontFamily: 'Raleway-Regular',
        // fontSize:17,
        fontSize: RFValue(12.5, 580),
        left: 10,
        alignSelf: 'center',
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
    logo:{
        height:90,
        width:150,
        // borderWidth:0.2,
        borderRadius:10,
        borderColor:"black",
        margin:10,
        marginLeft:10
    }, contentView:{
        flexDirection:"column",
        // backgroundColor:"red",
        width:"65%",
        marginRight:10,
        // paddingBottom:10, 
        // borderBottomWidth:0.5,
        // borderColor:"#d3d3d3",
         marginLeft:10,
        //  marginTop:10,
        
       },
})