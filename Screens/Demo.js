import React, { Component } from 'react';
import {
    Text, View, Dimensions,
    StyleSheet, TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            first_deal: "",
            recurring_deal: "",
        }
    }
    
    componentDidMount = async () => {
        this.get_vendor_data();
        this.get_profile();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_vendor_data();
            this.get_profile();
        })
    }

    get_profile = () => {
        fetch(global.vendor_api + 'get_vendor_profile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({

            })
        }).then((response) => response.json())
            .then((json) => {
                //console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);
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

    get_vendor_data = () => {
        fetch(global.vendor_api + 'get_vendor_data', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
            })
        }).then((response) => response.json())
            .then((json) => {
                if (json.status) {

                    this.setState({ item: json.data })
                    //   console.warn(json.data)
                    //    alert(this.state.item.shop_visit)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    render() {
        const chartConfig = {
            backgroundColor: "grey",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 3, // optional, default 3
            barPercentage: 3,
            useShadowColorFromDataset: false, // optional
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 0.5,
        };

        const data = [
            {
                name: "5 Star",
                population: 9150000,
                color: "green",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "4 Star",
                population: 11920000,
                color: "#01A7E5",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "3 Star",
                population: 8538000,
                color: "#FFE234",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "2 Star",
                population: 7800000,
                color: "#FFA534",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "1 Star",
                population: 3527612,
                color: "#F21616",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        ];

        let { item } = this.state;

        return (
            <View style={style.containerMain}>


                {/* Business */}
                <Text style={[styles.h3, { paddingTop: 10, fontWeight: 'bold', marginLeft: 15 }]}>Business</Text>
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    
                    {/* Total Feed Views */}
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("Wallet")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="cash-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, fontSize: RFValue(12,580), top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    TOTAL SALES
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                Rs.{item.total_earnning}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12,580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    ORDERS
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.orders}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {/* Total Feed Views */}
                    {/* <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="person-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10,fontSize:16, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4,fontSize: RFValue(12,580) }}>
                                    TOTAL CUSTOMER
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.customer}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                </View>


                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    {/* Shop Visits View  */}
                    {/* <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "visits" })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="eye-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12,580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    STORE VISIT
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.shop_visit}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                    {/* Shop Visits View  */}
                    {/* <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12,580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    ORDERS
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.orders}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                </View>

                {/* Deals */}
                <Text style={[styles.h3, { color: "#000", paddingTop: 10, fontWeight: 'bold', marginLeft: 15,marginTop:10 }]}>Flat Discounts Deals</Text>
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "New Customer", first_deal: this.state.first_deal, all_deal: this.state.recurring_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="person-add-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    New Customer
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.first_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "All Customer", all_deal: this.state.recurring_deal, first_deal: this.state.first_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="people-outline" color='rgba(233,149,6,1)'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    All Customer
                                </Text>
                            </View>
                            <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.recurring_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

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
        marginLeft: 15,
        flexDirection: "column",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})