import React, { Component } from 'react';
import {
    Text, View, ScrollView,
    StyleSheet, Image, Pressable, ActivityIndicator,
    TouchableOpacity, ImageBackground, FlatList, Dimensions, TextInput
} from 'react-native';
import { Icon, Header, Input, ThemeConsumer } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist'
import moment from 'moment';
//Global StyleSheet Import
const styles = require('../Components/Style.js');


class VerifyVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            isloading:false
        }

    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ top: 10 }}>
                <Icon type="ionicon" name="arrow-back-outline"
                    onPress={() => { this.props.navigation.goBack() }} />
            </View>
        )
    }
    //for header center component
    renderCenterComponent() {
        return (
            <View>

                <Text style={style.text}>
                    Verify Voucher
                </Text>
            </View>

        )
    }

    update_deal = () => {
        setTimeout(() => {
            fetch(global.vendor_api + 'update_flat_deals', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                },
                body: JSON.stringify({
                    first_time: this.state.first_deal,
                    all_time: this.state.all_deal

                })
            }).then((response) => response.json())
                .then((json) => {
                    console.warn(json)
                    if (!json.status) {

                        Toast.show(json.errors[0])
                    }
                    else {
                        Toast.show("Deal Updated Successfully")
                        // this.props.navigation.navigate("More")

                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ buttonloading: false })

                });
        }, 1000);


    }
verify=()=>{
    this.setState({isloading:true});
    fetch(global.vendor_api + 'verify_order_id', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': global.token
        },
        body: JSON.stringify({
            order_id: "MP-"+this.state.code,

        })
    }).then((response) => response.json())
        .then((json) => {
            //console.warn(json)
            if (!json.status) {

                Toast.show("Order Code is not valid")
            }
            else {
               // Toast.show("Deal Updated Successfully")
              this.props.navigation.navigate("VoucherDetails",{code:"MP-"+this.state.code})

            }
            return json;
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setState({isloading:false});

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

                <View style={{backgroundColor:'white', paddingLeft: 10, marginTop: 20,paddingVertical:10, width:"93%",alignSelf:"center",borderWidth:1,borderColor:"#d3d3d3",elevation:0.5,shadowRadius:10,borderRadius:5 }}>
                    <Text style={style.fieldsText}>Enter code</Text>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{marginTop:20,marginRight:5}}>MP- </Text><TextInput 
                    placeholder='Enter Code Here'
                    placeholderTextColor="#5d5d5d"
                    onChangeText={(e)=>{this.setState({code:e})}}
                    style={{width: "80%",color:'#5d5d5d',
                    height:40,
                    borderColor:"#d3d3d3",
                    borderWidth: 1,
                    marginTop: 10,
                    paddingLeft:10,
                    borderRadius: 5,}}/>

</View>
                    {(!this.state.isloading)?
                    <TouchableOpacity
                    onPress={() => this.verify()}
                    style={[styles.buttonStyles, { marginTop: 30, alignSelf: "center", width: "80%",height:45 }]}>
 <LinearGradient
     colors={['#EDA332', '#EDA332']}
     style={[styles.signIn,{height:45}]}>

     <Text style={[styles.textSignIn, {
         color: '#fff'
     }]}>Verify</Text>

 </LinearGradient>
</TouchableOpacity>
:
<View style={styles.loader}>
            <ActivityIndicator size="large" color="#EDA332" />
            </View>
                    }
                   
                </View>

                



            </View>
        )
    }
}

export default VerifyVoucher;

//Styling
const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },

    fieldsText: {
        fontSize: RFValue(11, 580),
        fontFamily: "Montserrat-SemiBold",
        color: "#5d5d5d",
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