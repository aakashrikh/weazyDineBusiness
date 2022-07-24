import React, { Component } from 'react';
import {
    Text, View, ScrollView,
    StyleSheet, Image, Pressable, ActivityIndicator,
    TouchableOpacity, ImageBackground, FlatList, Dimensions, TextInput
} from 'react-native';
import { Icon, Header, Input, ThemeConsumer } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';

import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";

import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
//Global StyleSheet Import
const styles = require('../Components/Style.js');
var radio_props = [
    {label: 'Invaild Customer', value: 0 },
    {label: 'Invalid Amount Details', value: 1 }
  ];

class VoucherDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            decline:true,
            isloading:false,
            load:true,
            data:'',
            comment:"Invaild Customer"
        }

    }

    componentDidMount(){
        this.fetch_data()
     }
   
     fetch_data=()=>{
 
         fetch(global.vendor_api+"get_orders_details_vendor", {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           'Authorization':global.token 
           },
           body: JSON.stringify({
             order_code:this.props.route.params.code
           })
           })
           .then((response) => response.json())
           .then((json) => {
               console.warn(json)
             if(!json.status){
     
             }
             else{
                
                 this.setState({data:json.data[0]})
                 this.setState({ load: false });
             }
           })
           .catch((error) => console.error(error))
           .finally(() => {
             
           });
     }
    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ top: 10 }}>
                <Icon type="ionicon" name="arrow-back-outline"
                    onPress={() => { this.props.navigation.navigate('Home') }} />
            </View>
        )
    }
    //for header center component
    renderCenterComponent() {
        return (
            <View>

                <Text style={style.text}>
                Voucher: {this.props.route.params.code}
                </Text>
            </View>

        )
    }

    update_order = (status) => {
        this.RBSheet.close();
            this.setState({isloading:true});
            fetch(global.vendor_api + 'update_order_status', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                },
                body: JSON.stringify({
                    order_id: this.props.route.params.code,
                    message: this.state.comment,
                    status:status

                })
            }).then((response) => response.json())
                .then((json) => {
                  console.warn(json);
                    if (!json.status) {

                        Toast.show(json.errors[0])
                    }
                    else {
                        Toast.show("Upated Successfully")
                         this.props.navigation.goBack()

                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({isloading: false })
                });
   
    }


    render() {
        return (
            <View style={[styles.container,{backgroundColor:'#f2f2f2'}]}>
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

                {(!this.state.load)?
                 <View style={{backgroundColor:'#fff',marginTop:10,padding:10}}>
                <View style={{ flexDirection: "row", marginTop: 20,marginLeft:20 }}>
                    <Image source={{uri:this.state.data.user.profile_pic}} style={{ width: 60, height: 60, borderRadius: 60 }} />
                    <View style={{ marginTop: 0, marginLeft: 15 }}>
                        <Text style={styles.h3}>
                            {this.state.data.user.name}
                        </Text>
                        <Text style={styles.h4}>
                            {moment(this.state.data.created_at).format('ddd, MMMM Do YYYY, h:mm a')}
                        </Text>
                    </View>

                </View>

                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                <View style={{ flexDirection: "row",  marginTop: 10, }} >
                        <Text style={styles.h4}>
                          Voucher Code:
                        </Text>
                        <Text style={[styles.h4, { fontFamily: "Roboto-Regular",marginLeft:10,borderWidth:1,padding:2,paddingHorizontal:20, borderStyle:"dotted" }]}>
                        {this.state.data.order_code}
                        </Text>
                    </View>
                    <View
  style={{
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginTop:10
  }}
/>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                        <Text style={styles.h4}>
                          Order Amount 
                        </Text>
                        <Text style={[styles.h4 , { fontFamily: "Roboto-Regular", }]}>
                        Rs.{this.state.data.order_amount}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                        <Text style={[styles.h4,{color:"green"}]}>
                         {(this.state.data.order_discount/this.state.data.order_amount*100).toFixed(1)} % Discount Applied
                        </Text>
                        <Text style={[styles.h4, { color: "green", fontFamily: "Roboto-Regular", }]}>
                       Rs.  {this.state.data.order_discount}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                        <Text style={styles.h4}>
                            Final Total
                        </Text>
                        <Text style={[styles.h4, { fontFamily: "Roboto-Regular", }]}>
                       Rs. {this.state.data.total_amount}
                        </Text>
                    </View>


                   
                </View>
                </View>
                :
               <ActivityIndicator size="large" color="#0000ff" style={{marginTop:50}}></ActivityIndicator>
}

                {!this.state.isloading ?
                (this.state.data.order_status == 'pending')?
                        <View style={{ flexDirection: "row", justifyContent: "space-between",position:'absolute',bottom:0,width:'100%',padding:10 }} >
                            <Pressable onPress={() => this.RBSheet.open()} style={{ width: '48%', backgroundColor: "#900f02", height: 45, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                                <Text style={[styles.textSignIn, { color: "white" }]}>
                                    Decline
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => this.update_order('accepted')} style={{ width: '48%', backgroundColor: "#347c2c", height: 45, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                                <Text style={[styles.textSignIn, { color: "white" }]}>
                                    Accept
                                </Text>
                            </Pressable>
                        </View>
                        :
                        <></>
                        :
                        <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#326bf3" />
                        </View>
                    }


   {/* Bottom Sheet fot FAB */}
   <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={300}
                        customStyles={{
                            container:{
                                borderTopLeftRadius:20,
                                borderTopRightRadius:20
                            },
                        wrapper: {
                            // backgroundColor: "transparent",
                            borderWidth: 1
                        },
                        draggableIcon: {
                            backgroundColor: "grey"
                        }
                        }}
                    >
                        {/* bottom sheet elements */}
                    <View>
                        
                       

                        {/* Bottom sheet View */}
                        <View style={{width:"100%",padding:20,paddingTop:5}}>
                            <Text style={styles.h3}>
                            Please Select a Reason
                        </Text>
                            <RadioForm
          radio_props={radio_props}
          initial={0}
          onPress={(value) => {this.setState({comment:value})}}
          style={{marginTop:20}}
        />

                                        <Pressable onPress={() => this.update_order('declined')} style={{ width: '100%', backgroundColor: "#900f02", height: 45, alignItems: "center", justifyContent: "center", borderRadius: 5,marginTop:50 }}>
                                <Text style={[styles.textSignIn, { color: "white" }]}>
                                    Update
                                </Text>
                            </Pressable>
                            </View>
                        
                    </View>
                    </RBSheet>
            </View>
        )
    }
}

export default VoucherDetails;

//Styling
const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(12, 580),
        margin: 5, color: "#000000"
    },

    fieldsText: {
        fontSize: RFValue(11, 580),
        fontFamily: "Montserrat-SemiBold",
        color: "grey",
        // marginLeft: 10
    },
    inputText: {
        fontSize: RFValue(12, 580),
        fontFamily: "Montserrat-Regular",
        color: "black",
        // marginLeft:10
    },

}
)