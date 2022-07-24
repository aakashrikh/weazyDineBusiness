import React, { Component } from 'react';
import {
    Text, View, ScrollView, Dimensions,
    StyleSheet, Image, Pressable,
    TouchableOpacity, ImageBackground
} from 'react-native';
import { Icon, AirbnbRating, Rating, LinearProgress } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { RFValue } from 'react-native-responsive-fontsize';
//Global StyleSheet Import
const styles = require('../Components/Style.js');
const screenWidth = Dimensions.get("window").width;

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
                // console.warn(json)
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
                <Text style={[styles.h4, { paddingTop: 10, fontWeight: 'bold', marginLeft: 15 }]}>Business</Text>
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    {/* Shop Visits View  */}
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("VerifyVoucher")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#171D34', '#5658EB']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="server-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    Verify Voucher
                                </Text>
                            </View>
                            {/* <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {this.state.first_deal}%
                                </Text> */}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Total Feed Views */}
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#870833', '#DC4A82']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="cash-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    Total Earning
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                Rs.{item.total_earnning}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>


                {/* Deals */}
                <Text style={[styles.h4, { color: "#000", paddingTop: 10, fontWeight: 'bold', marginLeft: 15 }]}>Flat Discounts Deals</Text>
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    {/* Shop Visits View  */}
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "New Customer", first_deal: this.state.first_deal, all_deal: this.state.recurring_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#568FF2', '#53B6EA']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="gift-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    New Customer
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.first_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Total Feed Views */}
                    <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "All Customer", all_deal: this.state.recurring_deal, first_deal: this.state.first_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#01DF99', '#84D856']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="gift-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    All Customer
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.recurring_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>


                {/* heading */}
                <Text style={[styles.h4, { paddingTop: 10, fontWeight: 'bold', marginLeft: 15 }]}>Your Insights</Text>

                {/* view for data components */}
                <View>
                    <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                        {/* Shop Visits View  */}
                        <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "visits" })}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#7B33A2', '#C04398']}
                                style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="location-outline" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Shop Visits
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.shop_visit}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Total Feed Views */}
                        <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("Feeds")} >
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#FE8C01', '#FFB831']}
                                style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="eye-outline" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Total Feed Views
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.feed_view}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                    {/* Followings */}
                    <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                        {/* Shop Visits View  */}
                        <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "followings" })}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#F43F69', '#FD7487']}
                                style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="location-outline" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Followings
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.followers}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Total Feed Views */}
                        <TouchableOpacity style={{ width: "45%" }} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "contact" })}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#0A7F6C', '#4ECBB1']}
                                style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="eye-outline" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Contact Us
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.contact}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>


                    {/* <View style={{ flexDirection: "row", marginTop: 20, }}>
                    <TouchableOpacity style={{width:"43%"}} onPress={()=>this.props.navigation.navigate("ListingDashboardItems")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#F43F69', '#FD7487']}
                            style={[style.gradientView,{width:"100%"}]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="person-add-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    Followings
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.followers}
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity>

                        contact us
                        <TouchableOpacity style={{width:"43%"}} onPress={()=>this.props.navigation.navigate("ListingDashboardItems")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#0A7F6C', '#4ECBB1']}
                            style={[style.gradientView,{width:"100%",marginLeft:0}]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="call-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    Contact Us
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.contact}
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity>

                    </View> */}

                    {/* total saved feeds */}
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('VendorReviews') }} >
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#B903FF', '#FD7487']}
                                style={[style.gradientView, { width: "93.5%" }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="star" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Your Rating
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.current_rating}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "saved" })} >
                            <LinearGradient
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                colors={['#B903FF', '#7830FF']}
                                style={[style.gradientView, { width: "93.5%" }]}>
                                <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                    <Icon type="ionicon" name="bookmarks-outline" color="#fff"
                                        style={{ marginRight: 10, top: 2 }} size={20} />
                                    <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                        Total Saved Feeds
                                    </Text>
                                </View>
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                    {item.feed_save}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>



                    {/* <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { this.props.navigation.navigate('TopDeals') }} >
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#FD7487', '#ffbf09']}
                            style={[style.gradientView, { width: "93.5%" }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="gift-outline" color="#fff"
                                    style={{ marginRight: 10, top: 2 }} size={20} />
                                <Text style={{ color: '#fff', fontFamily: "Roboto-Regular", marginTop: 4 }}>
                                    Deals Offered
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.current_rating}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                </View>




                {/* Graphs */}

                <View style={{ marginTop: 15, }}>
                    <View style={{ backgroundColor: "#d3d3d3", width: "100%", height: 1 }}></View>
                    {/* <View style={{marginTop:10,alignItems:"center",marginBottom:10, marginLeft:-40}} width={Dimensions.get('window').width}>
                    <Text style={[styles.h3,{color:"#326bf3",fontSize:RFValue(16,580),alignSelf:"center", marginLeft:90,fontFamily:"Roboto-Bold",marginBottom:20,marginTop:5}]}>
                        Power Zone Analysis
                        </Text>
                    <BarChart
                        data={{
                            labels:["10","20","30","40","50","60","70"],
                            datasets: [
                            {
                                data: [20, 25, 35, 30, 25, 20,24],
                                colors:[
                                    (opacity = 1) => `#3a5898`,
                                    (opacity = 1) => `#3a5898`,
                                    (opacity = 1) =>`#3a5898`,
                                    (opacity = 1) => `#3a5898`,
                                    (opacity = 1) => `#3a5898`,
                                    (opacity = 1) => `#3a5898`,
                                    (opacity = 1) => `#3a5898`,
                                    // (opacity = 1) => `#ffff1f`,
                                ]
                            },
                            ],
                        }}
                        width={Dimensions.get('window').width}
                        height={190}
                        // showValuesOnTopOfBars={true}
                        withInnerLines={true}
                        segments={1}
                        chartConfig={{
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            backgroundColor: 'white',
                            backgroundGradientFromOpacity:0,
                            backgroundGradientToOpacity:0,
                            // labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
                            color: (opacity = 1) => "#326bf3",
                            propsForBackgroundLines: {
                                strokeWidth: 1,
                                stroke: 'white',
                                strokeDasharray: '5',
                            },

                        }}
                        flatColor={true}
                        withCustomBarColorFromData={true}
                        showValuesOnTopOfBars={true}
                        fromZero={true}
                        showBarTops={false}
                        withHorizontalLabels={false}
                        />
                    </View>
                    <View style={{backgroundColor:"#d3d3d3",width:"100%",height:1}}></View>
                    <View style= {{width:Dimensions.get('window').width,alignItems:"center", paddingLeft:10}}> */}


                    {/* <PieChart
                    data={data}
                    width={screenWidth}
                    height={230}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"5"}
                    paddingBottom={"15"}
                    paddingTop={"15"}
                    // center={[10, 50]}
                    absolute
                    /> */}
                </View>
                {/* <View style={{backgroundColor:"#d3d3d3",width:"100%",height:1}}></View>
                    </View> */}

            </View>
        )
    }
}

export default Demo;

const style = StyleSheet.create({
    containerMain: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // position:"absolute"
    },
    gradientView: {
        width: '45%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: "row",
        // justifyContent:"space-evenly",
        marginLeft: 15,
        flexDirection: "column",
        justifyContent: "space-around"
    }
})