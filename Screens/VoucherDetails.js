import React, { Component } from 'react';
import {
    Text, View, ScrollView,
    StyleSheet, Image, Pressable, ActivityIndicator,
    TouchableOpacity, ImageBackground, FlatList, Dimensions, TextInput
} from 'react-native';
import { Icon, Header, Input, ThemeConsumer } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import * as Animatable from 'react-native-animatable';

//Global StyleSheet Import
const styles = require('../Components/Style.js');
var radio_props = [
    { label: 'Invaild Customer', value: 0 },
    { label: 'Invalid Amount Details', value: 1 }
];

class VoucherDetails extends Component {
    constructor(props){
        console.warn("props", props)
        super(props);
        this.state = {
            code: "",
            decline: true,
            isloading: false,
            load: true,
            data: '',
            cart: [],
            comment: "Invaild Customer"
        }

    }

    componentDidMount() {
        this.fetch_data()
    }

    fetch_data = () => {

        fetch(global.vendor_api + "get_orders_details_vendor", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                order_code: this.props.route.params.code
            })
        })
            .then((response) => response.json())
            .then((json) => {
                // console.warn(json)
                if (!json.status) {

                }
                else {
                    // console.warn(json.data[0].cart)
                    this.setState({ data: json.data[0] })
                    this.setState({ cart: json.data[0].cart })
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

                <Text style={[style.text, { fontSize: RFValue(13, 580) }]}>
                    Order Details
                </Text>
            </View>

        )
    }

    update_order = (status) => {
        this.RBSheet.close();
        this.setState({ isloading: true });
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
                status: status

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
                this.setState({ isloading: false })
            });

    }

    addonItem = ({ item }) => (
        <View style={{ margin: 5, borderWidth: 1, padding: 5, borderRadius: 5 }}>
            <Text>{item.addon_name}</Text>
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
                <ScrollView>
                    {
                        (!this.state.load) ?


                            <>
                            <View style={style.viewBox}>

                                <View >
                                    {this.state.data.order_status == "ongoing" ?
                                    <Animatable.View style={{ flexDirection: "row", marginRight: 10, alignSelf:"flex-end" }}
                                        animation="pulse"
                                        duraton="1500" iterationCount="infinite">
                                        <Icon type="ionicon" name="time-outline" size={20} color="#fff" />
                                        <Text style={{ fontSize: RFValue(11, 580), color: "#fff", fontWeight: "bold", paddingLeft: 5 }}>20 Mins</Text>
                                    </Animatable.View>
                                    :
                                    <></>}
                                </View>

                                <View style={{flexDirection:"row"}}>
                                <View style={{width:"20%"}}>
                                    <Image source={require('../img/order.png')} style={{height:60,width:60}}/>
                                </View>

                                <View style={{width:"80%"}}>
                                    <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}>Table No. : {this.state.data.table_no}</Text>
                                    <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}>Order ID : {this.state.data.order_code}</Text>
                                    <Text style={[style.textWhite,{fontSize:RFValue(12,580)}]}>Status : 
                                    <Text>
                                        <Text style={{  paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                            <Text style={[style.textWhite,{fontSize:RFValue(12,580),textTransform:"capitalize"}]}> {this.state.data.order_status}</Text>
                                        </Text>
                                    </Text></Text>

                                    <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}>
                                        Order Type :
                                        <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}>

                                        {
                                            (this.state.data.order_type == 'delivery' || this.state.data.order_type == 'takeaway') ?
                                                <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}> {this.state.data.order_type}</Text>
                                                :
                                                <Text style={[style.textWhite,{fontFamily:"Poppins-SemiBold"}]}> Dine In</Text>
                                        }
                                        </Text>
                                    </Text>
                                    <Text style={[style.textWhite,{fontSize:RFValue(12,580)}]}>{moment(this.state.data.created_at).format('ddd, MMMM Do YYYY, h:mm a')}</Text>
                                </View>
                                </View>
                            </View>

                            
                            <View style={{width:"95%",flexDirection:"row",marginTop:20,alignSelf:"center",
                            marginBottom:10,borderBottomWidth:1,borderBottomColor:"#f1f1f1"}}>
                                {/* quantity */}
                                <View style={{width:"10%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                    <Text style={[style.text,{fontSize:RFValue(12,580)}]}>No.</Text>
                                </View>
                                
                                {/* name */}
                                <View style={{width:"40%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                    <Text style={[style.text,{fontSize:RFValue(12,580)}]}>Item</Text>
                                </View>

                                {/* price */}
                                <View style={{width:"20%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                    <Text style={[style.text,{fontSize:RFValue(12,580)}]}>Price</Text>
                                </View>

                                {/* quantity */}
                                <View style={{width:"15%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                    <Text style={[style.text,{fontSize:RFValue(12,580)}]}>Qty.</Text>
                                </View>

                                {/* amount */}
                                <View style={{width:"15%"}}>
                                    <Text style={[style.text,{fontSize:RFValue(12,580)}]}>Amt.</Text>
                                </View>
                            </View>

                            {
                                (!this.state.load) ? (

                                    (this.state.cart.length > 0) ?

                                        (this.state.cart.map((item, index) => {
                                            return (
                                                <View style={{width:"95%",flexDirection:"row",alignSelf:"center",
                                                    marginBottom:10,borderBottomWidth:1,borderBottomColor:"#f1f1f1"}}>
                                                        {/* quantity */}
                                                        <View style={{width:"10%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                                            <Text style={[style.text,{fontSize:RFValue(12,580)}]}>{this.state.cart.indexOf(item)+1}</Text>
                                                        </View>
                                                        
                                                        {/* name */}
                                                        <View style={{width:"40%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                                            <Text style={[style.text,{fontSize:RFValue(12,580)}]}>{item.product.product_name}</Text>
                                                        </View>

                                                        {/* price */}
                                                        <View style={{width:"20%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                                            <Text style={[style.text,{fontSize:RFValue(12,580)}]}>{item.product_price/item.product_quantity}</Text>
                                                        </View>

                                                        {/* quantity */}
                                                        <View style={{width:"15%",borderRightWidth:1,borderColor:"#f1f1f1"}}>
                                                            <Text style={[style.text,{fontSize:RFValue(12,580)}]}>x {item.product_quantity}</Text>
                                                        </View>

                                                        {/* amount */}
                                                        <View style={{width:"15%"}}>
                                                            <Text style={[style.text,{fontSize:RFValue(12,580)}]}>{item.product_price}</Text>
                                                        </View>
                                                    </View>
                                            )
                                        }))
                                        :
                                        <Text>No OnGoing Orders</Text>


                                ) :
                                    <Text>Loading...</Text>

                            }
                            
                            <View style={{ backgroundColor: '#fff', marginTop: 10, padding: 10 }}>
                                
                                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                                    
                                    <View
                                        style={{
                                            borderBottomColor: '#ececec',
                                            borderBottomWidth: 1,
                                            marginTop: 10
                                        }}
                                    />


                                

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                        <Text style={{fontFamily:"Poppins-SemiBold",color:"#EDA332",fontSize:RFValue(12,580)}}>
                                            Item Total
                                        </Text>
                                        <Text style={{ fontFamily: "Poppins-SemiBold",fontSize:RFValue(12,580) }}>
                                             ₹ {this.state.data.order_amount.toFixed(2)}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                        <Text style={{ color: "green",fontFamily: "Poppins-SemiBold",fontSize:RFValue(10,580) }}>
                                            Taxes and Charges
                                        </Text>
                                        <Text style={ { color: "green", fontFamily: "Roboto-Regular",fontFamily: "Poppins-SemiBold",fontSize:RFValue(10,580) }}>
                                           + ₹ {this.state.data.sgst + this.state.data.cgst}
                                        </Text>
                                    </View>

                                    {(this.state.data.order_discount > 0) ?
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                            <Text style={{ color: "red",fontFamily: "Poppins-SemiBold",fontSize:RFValue(10,580) }}>
                                                {(this.state.data.order_discount / this.state.data.order_amount * 100).toFixed(1)} % Discount Applied
                                            </Text>
                                            <Text style={{ color: "red",fontFamily: "Poppins-SemiBold",fontSize:RFValue(10,580) }}>
                                                ₹  {this.state.data.order_discount}
                                            </Text>
                                        </View>
                                        :
                                        <></>
                                    }



                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                        <Text style={{fontFamily:"Poppins-SemiBold",color:"#EDA332",fontSize:RFValue(12,580)}}>
                                            Grand Total
                                        </Text>
                                        <Text style={{fontFamily:"Poppins-SemiBold",color:"#EDA332",fontSize:RFValue(12,580)}}>
                                            ₹ {this.state.data.total_amount.toFixed(2)}
                                        </Text>
                                    </View>



                                </View>
                            </View>
                            </>
                            :
                            <View style={style.loader}>
                                <ActivityIndicator size="large" color="#EDA332" ></ActivityIndicator>
                            </View>
                            
                    }
                </ScrollView>

                {/* {!this.state.isloading ?
                    (this.state.data.order_status == 'pending') ?
                        <View style={{ flexDirection: "row", justifyContent: "space-between", position: 'absolute', bottom: 0, width: '100%', padding: 10 }} >
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
                        <ActivityIndicator size="large" color="#EDA332" />
                    </View>
                } */}


                {/* Bottom Sheet fot FAB */}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={300}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
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
                        <View style={{ width: "100%", padding: 20, paddingTop: 5 }}>
                            <Text style={styles.h3}>
                                Please Select a Reason
                            </Text>
                            <RadioForm
                                radio_props={radio_props}
                                initial={0}
                                onPress={(value) => { this.setState({ comment: value }) }}
                                style={{ marginTop: 20 }}
                            />

                            <Pressable onPress={() => this.update_order('declined')} style={{ width: '100%', backgroundColor: "#900f02", height: 45, alignItems: "center", justifyContent: "center", borderRadius: 5, marginTop: 50 }}>
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
        fontFamily: "Poppins-SemiBold",
        fontSize: RFValue(12, 580),
        margin: 5, color: "#696969"
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
    viewBox:{
        // flexDirection: "row",
        width:Dimensions.get("window").width/1.05,
        backgroundColor:"#EDA332",
        alignSelf:"center",
        borderRadius:10,
        marginTop:10,
        justifyContent:"space-between",
        padding:10
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:20,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center",
        marginBottom:10
    },
    textWhite:{ 
        fontSize: RFValue(12, 580), 
        color:"#fff",
        fontFamily:"Poppins-Medium"
    }
}
)