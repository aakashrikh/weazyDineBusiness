import React, { Component } from 'react';
import {
    Text, View, Dimensions,
    StyleSheet, Pressable, Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { AuthContext } from '../AuthContextProvider.js';
import SelectDropdown from 'react-native-select-dropdown'
import moment from 'moment';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const sort = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "Last Month",
    "This Month",
    "Lifetime",
]

class Demo extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            item: {
                total_earnning: 0,
                orders: 0,
                shop_visit: 0,
                customer: 0,
                cashsale: 0,
                online: 0,
                weazypay: 0,
            },
            first_deal: "",
            recurring_deal: "",
            data: {},
            to: new Date(),
            from: new Date(),
            range: "today",
            isloading: false,
        }
    }

    componentDidMount = async () => {
        this.get_vendor_data(this.state.range);
        this.get_profile();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_vendor_data(this.state.range);
            this.get_profile();
        })
    }

    get_profile = () => {
        fetch(global.vendor_api + 'get_vendor_profile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({

            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                }
                else {
                    this.setState({ data: json.data })
                    json.data.map(value => {

                        this.setState({ first_deal: value.flat_deal_first_time })
                        this.setState({ recurring_deal: value.flat_deal_all_time })
                    })
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isLoading: false })

            });
    }

    get_vendor_data = (range) => {
        fetch(global.vendor_api + 'get_vendor_data', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                range: range,
                from: this.state.from,
                to: this.state.to
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status) {
                    // console.warn(json.data)
                    this.setState({ item: json.data })
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    render() {
        let { item } = this.state;

        return (
            <View style={style.containerMain}>


                {/* Business */}
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width / 1.1, alignItems:"center", justifyContent: "space-between" }}>
                    <Text style={[styles.h3, { paddingTop: 10, fontWeight: 'bold', marginLeft: 15 }]}>Overview</Text>

                    <SelectDropdown
                        data={sort}
                        onSelect={(selectedRange, index) => {
                            if(selectedRange == "Today"){
                                this.get_vendor_data("today")
                            }
                            else if(selectedRange == "Yesterday"){
                                this.get_vendor_data("yesterday")
                            }
                            else if(selectedRange == "This Week"){
                                this.get_vendor_data("thisweek")
                            }
                            else if(selectedRange == "Last Week"){
                                this.get_vendor_data("lastweek")
                            }
                            else if(selectedRange == "Last Month"){
                                this.get_vendor_data("lastmonth")
                            }
                            else if(selectedRange == "This Month"){
                                this.get_vendor_data("thismonth")
                            }
                            else if(selectedRange == "Lifetime"){
                                this.get_vendor_data("lifetime")
                            }
                            this.setState({ range: selectedRange })
                        }}

                        buttonTextAfterSelection={(selectedRange, index) => {
                            return selectedRange
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                        buttonTextStyle={{
                            fontFamily: "Raleway-Medium", fontSize: RFValue(12, 580), color: "#000"
                        }}
                        buttonStyle={style.buttonStyle}
                        defaultButtonText="Today"
                        renderDropdownIcon={() => {
                            return (
                                <Icon
                                    name='chevron-down' type='ionicon' color='#000' size={20} />
                            )
                        }}
                        dropdownIconPosition="right"
                    />

                </View>
                {/* total orders */}
                <View style={{ flexDirection: "row", width: Dimensions.get('window').width/1.02, alignSelf:"center", justifyContent: "space-around", marginTop: 30 }}>
                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/order.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Total Orders
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.orders}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={()=> this.props.navigation.navigate("Report",{
                        range:this.state.range, to: this.state.to, from: this.state.from, type: "Total", method: "all"
                    })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { width: "100%", marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/totalSales.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Total Sales
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.total_earnning.toFixed(2)}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={()=> this.props.navigation.navigate("Report",{
                        range:this.state.range, to: this.state.to, from: this.state.from, type: "Cash", method:"cash"
                    })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/cashSales.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Cash Sales
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.cashsale.toFixed(2)}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </View>


                <View style={{ flexDirection: "row",width: Dimensions.get('window').width/1.02, alignSelf:"center", justifyContent: "space-around", marginTop: 20 }}>
                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={()=> this.props.navigation.navigate("Report",{
                        range:this.state.range, to: this.state.to, from: this.state.from, type: "Online", method:"upi",
                    })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/onlineSales.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Online Sales
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.online.toFixed(2)}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={()=>this.props.navigation.navigate("TotalCustomers")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { width: "100%", marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/totalCustomers.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Total Customer
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.customer}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    <Pressable style={{ width: Dimensions.get("window").width / 3.3 }}
                    onPress={() => this.props.navigation.navigate("Wallet")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#5BC2C1', '#296e84']}
                            style={[style.gradientView1, { marginTop: 20 }]}>
                            <View>
                                <Image source={require('../img/weazyPay.png')} style={{
                                    height: 45, width: 45,
                                    position: "absolute",
                                    justifyContent: "center", top: -40, left: -5,
                                }} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", marginTop: 20, fontSize: RFValue(11, 580) }}>
                                    Weazy Pay
                                </Text>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", alignSelf: "center", fontSize:RFValue(12,580), marginBottom: 10 }}>
                                    {item.weazypay.toFixed(2)}
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </View>




            </View>
        )
    }
}

export default Demo;

const style = StyleSheet.create({
    containerMain: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 10
        // position:"absolute"
    },
    gradientView: {
        width: '45%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: "row",
        // justifyContent:"space-evenly",
        // marginLeft: 15,
        flexDirection: "column",
        justifyContent: "space-around",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        shadowColor: "#000",
    },
    gradientView1: {
        width: "100%",
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: "column",
        justifyContent: "space-around",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        shadowColor: "#000",
        borderTopRightRadius: 50,
    },
    buttonStyle: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        color: "#fff",
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        width: Dimensions.get("window").width / 3,
        height: 40,
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: RFValue(11, 580),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        right:-10,
        top:5
    },

})