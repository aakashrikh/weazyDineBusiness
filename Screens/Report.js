import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image,
    TouchableOpacity, FlatList, Dimensions, Platform,
} from 'react-native';
import { Icon, Header, } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from '../AuthContextProvider.js';
import SelectDropdown from 'react-native-select-dropdown';

const win = Dimensions.get('window');
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

class Report extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        console.warn(props)
        this.state = {
            isLoading: true,
            data: [],
            page: 1,
            wallet: 0,
            to: new Date(),
            from: new Date(),
            range: this.props.route.params.range,
            allData: [],
            total_earnning: 0,
            orders: 0,
            shop_visit: 0,
            customer: 0,
            cashsale: 0,
            online: 0,
            weazypay: 0,
            method:this.props.route.params.method

        }

    }

    componentDidMount() {
        console.warn(this.state.range,this.state.method)
        this.fetch_order(1, this.state.range,this.state.method);
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
                <Text style={style.text}>{this.props.route.params.type} Sales</Text>
            </View>

        )
    }

    // fetch_order = (page_id) => {

    //     fetch(global.vendor_api + 'fetch_vendor_txn', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': this.context.token
    //         },
    //         body: JSON.stringify({
    //             page: page_id

    //         })
    //     }).then((response) => response.json())
    //         .then((json) => {
    //             if (!json.status) {


    //             }
    //             else {
    //                 var obj = json.data.data;
    //                 // this.setState({ data: json.data.data });
    //                 // if(page_id==1)
    //                 // {
    //                 //   this.setState({data:[] , isLoading:false})
    //                 // }
    //                 this.setState({ data: this.state.data.concat(obj) });
    //                 this.setState({ wallet: json.wallet });
    //                 // this.props.navigation.navigate("More")

    //             }
    //             return json;
    //         }).catch((error) => {
    //             console.error(error);
    //         }).finally(() => {
    //             this.setState({ isLoading: false })

    //         });



    // }

    fetch_order = (page_id, range,method) => {
        fetch(global.vendor_api + 'fetch_sales_reports', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                page: page_id,
                range: range,
                start_date: this.state.from,
                end_date: this.state.to,
                method: method,
                page_length: 50,
                staff_id: 0

            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.warn("gg", this.state.from,this.state.to, );
                if (!json.status) {
                    if (page_id == 1) {
                        this.setState({ data: [], isLoading: false });
                        this.setState({
                            total_earnning: 0, orders: 0, shop_visit: 0, customer: 0, cashsale: 0, online: 0, weazypay: 0,
                        })
                    }
                } else {
                    var obj = json.data.data;
                    this.setState({ data: this.state.data.concat(obj) });
                    console.warn("sss",this.state.data);
                    this.setState({
                        total_earnning: json.total_earnning,
                        online: json.online,
                        cashsale: json.cashsale,
                        weazypay: json.weazypay,
                    });

                }
                this.setState({ isLoading: false });
                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => { });
    };


    load_more = () => {
        var data_size = this.state.data.length;
        if (data_size > 9) {
            var page = this.state.page + 1;
            this.setState({ page: page, load_more: true });
            this.fetch_order(page);
        }
    }

    renderItem = ({ item, id }) => {
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("VoucherDetails", { code: item.txn_id }) }}>
                <View style={{ flexDirection: "row", marginTop: 10, borderWidth: 1, width: "95%", alignSelf: "center", borderRadius: 10, backgroundColor: "white", borderColor: "#d3d3d3", padding: 5 }}>

                    <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 15, width: '100%' }}>

                        <View style={{ width: '65%' }}>


                            <Text style={[styles.h4, { fontFamily: "Poppins-Medium", fontSize: RFValue(10, 580) }]}>
                                {item.payment_txn_id}
                            </Text>
                            <Text style={{ marginTop: 5, fontSize: RFValue(10, 580), fontFamily: "Poppins-Medium" }}>
                                {moment(item.updated_at).format('llll')}
                            </Text>
                            <Text >

                            </Text>
                        </View>

                        <View style={{ width: '30%' }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', paddingTop: 20, color: 'green', fontFamily: "Poppins-Medium", alignSelf: 'flex-end' }}>+ ₹{item.txn_amount}/-</Text>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    centerComponent={this.renderCenterComponent()}
                    leftComponent={this.renderLeftComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['white', 'white'],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },

                    }}
                    backgroundColor="#ffffff"
                />
                <SelectDropdown
                    data={sort}
                    onSelect={(selectedRange, index) => {
                        // this.setState({ range: selectedRange })
                        if (selectedRange == "Today") {
                            this.fetch_order(1, "today")
                        }
                        else if (selectedRange == "Yesterday") {
                            this.fetch_order(1, "yesterday")
                        }
                        else if (selectedRange == "This Week") {
                            this.fetch_order(1, "thisweek")
                        }
                        else if (selectedRange == "Last Week") {
                            this.fetch_order(1, "lastweek")
                        }
                        else if (selectedRange == "Last Month") {
                            this.fetch_order(1, "lastmonth")
                        }
                        else if (selectedRange == "This Month") {
                            this.fetch_order(1, "thismonth")
                        }
                        else if (selectedRange == "Lifetime") {
                            this.fetch_order(1, "lifetime")
                        }
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

                {this.state.isLoading ?
                    <></>
                    :
                    <View>

                        {
                            (this.props.route.params.type == "Cash") ?
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center", marginLeft: 20
                            }}>
                                <Text style={styles.h4}>Cash Sales</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.cashsale}</Text>
                            </View>
                            :
                            (this.props.route.params.type == "Online") ?
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center", marginLeft: 20
                            }}>
                                <Text style={styles.h4}>Online Sales</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.total_earnning}</Text>
                            </View>
                            :
                            
                        <View>
                            <View style={{
                            flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10,
                            width: Dimensions.get('window').width, marginTop: 10, alignItems: "center"
                        }}>
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center"
                            }}>
                                <Text style={styles.h4}>Total Sales</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.total_earnning}</Text>
                            </View>
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center"
                            }}>
                                <Text style={styles.h4}>Cash Sales</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.cashsale}</Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10,
                            marginTop: 10, alignItems: "center"
                        }}>
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center"
                            }}>
                                <Text style={styles.h4}>Online Sales</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.online}</Text>
                            </View>
                            <View style={{
                                backgroundColor: '#fff', padding: 10, borderRadius: 15, borderWidth: 1,
                                width: "47%", alignItems: "center"
                            }}>
                                <Text style={styles.h4}>Weazy Pay</Text>
                                <Text style={{ fontSize: RFValue(18, 580) }}>₹ {this.state.weazypay}</Text>
                            </View>
                        </View>
                        </View>
    }
                    </View>
                }

                {(!this.state.isLoading) ?
                    [

                        (this.state.data.length > 0) ?
                            <FlatList
                                data={this.state.data}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                                style={{ marginBottom: Platform.OS == "ios" ? 20 : 10 }}
                                onEndReached={() => { this.load_more() }}
                                onEndReachedThreshold={0.5}
                            /> :
                            <View>

                                <Image source={require('../img/record.jpg')} style={{ width: '80%', height: 200, marginLeft: 10, marginTop: 150, alignSelf: 'center' }} />
                                <Text style={[styles.h4, { alignSelf: 'center', marginTop: 20 }]} >
                                    No Records Found.
                                </Text>

                            </View>
                    ]
                    :

                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
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
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
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
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
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
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
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

                    </SkeletonPlaceholder>

                }

            </View>
        )
    }
}

export default Report;

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
        color: "grey",
        // marginLeft: 10
    },
    inputText: {
        fontSize: RFValue(12, 580),
        fontFamily: "Montserrat-Regular",
        color: "black",
        // marginLeft:10
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
        alignSelf: 'flex-end',
        fontSize: RFValue(11, 580),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        right: 10,
    },

}
)