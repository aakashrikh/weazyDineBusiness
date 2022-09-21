import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image,
    TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import { Icon, Header,} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const win = Dimensions.get('window');
//Global StyleSheet Import
const styles = require('../Components/Style.js');


class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            page: 1,
            wallet: 0
        }

    }

    componentDidMount() {
        this.fetch_order(1);
    }

    //for header left component
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
                <Text style={style.text}>Payment History</Text>
            </View>

        )
    }

    fetch_order = (page_id) => {

        fetch(global.vendor_api + 'fetch_vendor_txn', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                page: page_id

            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {


                }
                else {
                    var obj = json.data.data;
                    // this.setState({ data: json.data.data });
                    // if(page_id==1)
                    // {
                    //   this.setState({data:[] , isLoading:false})
                    // }
                    this.setState({ data: this.state.data.concat(obj) });
                    this.setState({ wallet: json.wallet });
                    // this.props.navigation.navigate("More")

                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isLoading: false })

            });



    }

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
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("VoucherDetails", { code: item.order_code }) }}>
                <View style={{ flexDirection: "row", marginTop: 10,  borderWidth: 1, width: "95%", alignSelf: "center", borderRadius: 10, backgroundColor: "white", borderColor: "#d3d3d3", padding: 5 }}>

                    <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 15, width: '100%' }}>

                        <View style={{ width: '65%' }}>


                            <Text style={[styles.h4,{fontFamily:"Poppins-Medium",fontSize:RFValue(10,580)}]}>
                                {item.txn_comment}
                            </Text>
                            <Text style={{ marginTop: 5, fontSize:RFValue(10,580), fontFamily:"Poppins-Medium" }}>
                                {moment(item.updated_at).format('llll')}
                            </Text>
                            <Text >

                            </Text>
                        </View>

                        <View style={{ width: '30%' }}>
                            {
                                item.txn_type == "credit" ?
                                    <Text style={ { color: '#000', fontWeight: 'bold', paddingTop: 20, color: 'green', fontFamily:"Poppins-Medium", alignSelf: 'flex-end' }}>+ ₹{item.txn_amount}/-</Text>
                                    :
                                    <Text style={{ color: '#000', fontWeight: 'bold', paddingTop: 20, color: 'red', fontFamily:"Poppins-Medium", alignSelf: 'flex-end' }}>- ₹{item.txn_amount}/-</Text>
                            }

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
                {(!this.state.isLoading) ?
                    [
                        <View style={{ backgroundColor: '#fff', padding: 20 }}>
                            <Text style={styles.h4}>WeazyDine Balance</Text>
                            <Text style={{ fontSize: 30 }}>₹ {this.state.wallet}</Text>
                        </View>
                    ] :
                    <></>

                }

                {(!this.state.isLoading) ?
                    [

                        (this.state.data.length > 0) ?
                            <FlatList
                                data={this.state.data}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                                style={{ flex: 1 }}
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

export default Wallet;

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

}
)