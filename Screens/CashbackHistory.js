import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image,
    TouchableOpacity, FlatList, Dimensions, Platform,
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../AuthContextProvider.js';

const win = Dimensions.get('window');

//Global StyleSheet Import
const styles = require('../Components/Style.js');


class CashbackHistory extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            page: 1,
        }

    }

    componentDidMount() {
        this.fetch_order(1);
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetch_order(1);
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
                <Text style={style.text}>Total Orders</Text>
            </View>

        )
    }

    fetch_order = (page_id) => {

        fetch(global.vendor_api + 'get_orders_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                page: page_id

            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    if (page_id == 1) {
                        this.setState({ data: [] });
                    }
                }
                else {
                    // var refresh = setInterval(() => {
                    //     this.fetch_order(1);
                    // }, 20000);
                    
                    
                    if (json.data.data.length > 0) {
                        var obj = json.data.data;
                        if (page_id == 1) {
                            this.setState({ data: obj });
                        }
                        else {
                            this.setState({ data: [...this.state.data, ...obj] });
                        }
                        // this.setState({ data: json.data.data });
                        console.warn(json)
                        // clearInterval(refresh);
                    }
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

                <View style={{ marginTop: 10, borderWidth: 1, width: "95%", alignSelf: "center", borderRadius: 10, backgroundColor: "white", borderColor: "#d3d3d3", padding: 7 }}>

                    <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 15, width: '100%' }}>

                        <View style={{ width: '65%' }}>
                            {
                                (item.table == null) ?
                                <Text style={[styles.h5, { marginBottom: 5, fontFamily: "Roboto-Bold" }]}>
                                    Order Type : {item.order_type}
                                </Text>
                                :
                                <Text style={[styles.h5, { marginBottom: 5, fontFamily: "Roboto-Bold" }]}>
                                    Table No : {item.table.table_name}
                                </Text>
                            }
                            <Text style={[styles.h5, { marginBottom: 5, fontFamily: "Roboto-Bold" }]}>
                                {item.order_code}
                            </Text>

                            <Text style={[styles.h4, { fontFamily: "Roboto-Bold" }]}>
                                {item.user.name}
                            </Text>
                            <Text style={[styles.h5, { marginBottom: 10, fontFamily: "Roboto-Medium" }]}>
                                {moment(item.created_at).format('ddd, MMMM Do YYYY, h:mm a')}
                            </Text>
                            <Text >
                                <Text style={[styles.h4, { color: '#000', fontWeight: 'bold', paddingTop: 20,fontFamily:"Poppins-Bold" }]}>Rs {item.total_amount}/-</Text>
                            </Text>
                        </View>

                        <View style={{ width: '30%', justifyContent: "space-between" }}>
                            <>
                                {
                                    (item.order_status == 'pending') ?
                                        <Text style={{ backgroundColor: 'orange', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                            <Text style={[styles.p, { color: '#fff', alignSelf: 'center' }]}>Pending</Text>
                                        </Text>
                                        :
                                        (item.order_status == 'cancelled') ?
                                            <Text style={{ backgroundColor: 'red', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                <Text style={[styles.p, { color: '#fff', alignSelf: 'center' }]}>Cancelled</Text>
                                            </Text>
                                            :
                                            (item.order_status == 'completed') ?
                                                <Text style={{ backgroundColor: 'green', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                    <Text style={[styles.p, { color: '#fff', alignSelf: 'center', fontFamily: "Roboto-Bold" }]}>Completed</Text>
                                                </Text>

                                                :
                                                (item.order_status == 'in_process') ?
                                                    <Text style={{ backgroundColor: '#EDA332', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                        <Text style={[styles.p, { color: '#fff', alignSelf: 'center', fontFamily: "Roboto-Bold" }]}>Ongoing</Text>
                                                    </Text>
                                                    :
                                                    (item.order_status == "processed") ?
                                                    <Text style={{ backgroundColor: '#EDA332', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                        <Text style={[styles.p, { color: '#fff', alignSelf: 'center', fontFamily: "Roboto-Bold"  }]}>Processed</Text>
                                                    </Text>
                                                    :
                                                    <Text style={{ backgroundColor: '#EDA332', paddingLeft: 10, alignSelf: 'center', paddingRight: 10, borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
                                                        <Text style={[styles.p, { color: '#fff', alignSelf: 'center', fontFamily: "Roboto-Bold", textTransform:"capitalize"  }]}>{item.order_status}</Text>
                                                    </Text>

                                }
                            </>

                            {/* {item.order_status == "in_process" ?
                                <Animatable.View style={{ flexDirection: "row", }}
                                    animation="pulse"
                                    duraton="1500" iterationCount="infinite">
                                    <Icon type="ionicon" name="time-outline" size={20} color="green" />
                                    <Text style={{ fontSize: RFValue(11, 580), color: "green", fontWeight: "bold",marginTop:Platform.OS == "ios" ? 2 : 0, paddingLeft: 5 }}>{moment(item.estimate_prepare_time).local().startOf('seconds').fromNow()}</Text>
                                </Animatable.View>
                                :
                                <></>
                            } */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: "#fff" }]}>
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


                {(!this.state.isLoading) ?
                    [
                        (this.state.data.length > 0) ?
                            <FlatList
                                data={this.state.data}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                                style={{ flex: 1, marginBottom:20 }}
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

export default CashbackHistory;

//Styling
const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },

}
)