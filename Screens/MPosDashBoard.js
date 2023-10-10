import React, { Component } from "react";
import {
    View, Text, StyleSheet, Platform, ScrollView,
    Image, TouchableOpacity, SafeAreaView, Dimensions, Linking, FlatList
} from "react-native";
import { Header, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from "../AuthContextProvider.js";


//Global StyleSheet Import
const styles = require('../Components/Style.js');

const data = [
    { title: 'Title Text', key: 'item1' },
    { title: 'Title Text', key: 'item1' },
    { title: 'Title Text', key: 'item1' },
    { title: 'Title Text', key: 'item1' },
    { title: 'Title Text', key: 'item1' },
    { title: 'Title Text', key: 'item1' },
]

class MPosDashBoard extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props)
        this.state = {
            status: "active",
            isloading: true,
            data: [],
            table_load: false,
            interval: '',
            isFetching: false
        }
    }


    //for right component
    renderRightComponent() {
        return (
            <View style={{ padding: 5, right: 5, marginTop: 5, flexDirection: "row" }}>
                <TouchableOpacity style={{ backgroundColor: "#ececec", height: 35, width: 35, borderRadius: 50, justifyContent: "center", marginLeft: 5, }}
                    onPress={() => this.props.navigation.navigate("Notifications")}>
                    <Icon name='notifications' type='ionicon' size={20} color='#5BC2C1' />
                </TouchableOpacity>
            </View>
        )
    }

    //for right component
    renderLeftComponent() {
        return (
            <View style={{ flexDirection: 'row', width: Dimensions.get('window').width }}>
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity style={{ alignSelf: "center", marginLeft: 5 }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' type='ionicon' size={30} color='#000000' />
                    </TouchableOpacity>
                    <Image source={require('../img/logo/mp.png')}
                        style={{ width: 45, height: 45, marginTop: 8, marginLeft: 10 }} />
                </View>
                <View style={{ width: Dimensions.get('window').width / 1.2, padding: 5, left: 0 }}>
                    <Text style={[styles.h3, { color: '#222', fontSize: RFValue(16, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>Hello, {this.context.user.shop_name} </Text>
                    <Text style={styles.smallHeading}>Welcome to WeazyDine M-POS</Text>
                </View>
            </View>
        )
    }

    componentDidMount() {
        // this.fetch_table_vendors();

        // window.Echo.private(`checkTableStatus.`+this.context.user.id).listen('.server.created', (data) => {
        //     //logic here
        //     // alert("hello")
        //     // this.setState({data:data.tables})
        //     });

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetch_table_vendors();
            // window.Pusher = Pusher;
            // window.Echo.private(`checkTableStatus.`+this.context.user.id).listen('.server.created', (data) => {
            //     //logic here
            //     // this.setState({data:data.tables})
            //     });
        }
        );
    }

    fetch_table_vendors = () => {
        fetch(global.vendor_api + 'fetch_table_vendors', {
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
                    var msg = json.msg;
                    // Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    if (json.data.length > 0) {
                        this.setState({ data: json.data })
                    }

                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();

                    // }, 10000);

                    //   this.setState({interval:myInterval});
                    // Toast.show(json.msg)


                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false, isFetching: false })
            });
    }

    renderItem = ({ item }) => (
        <>
            {/* <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
                <View style={[styles.box,{borderWidth:1, borderColor: "#5d5d5d"}]}>
                    <View>
                        <Text style={styles.h3}>Table 1</Text>
                    </View>
                </View>
            </TouchableOpacity> */}

            <TouchableOpacity style={{ flex: 1, marginTop: 10, flexDirection: 'column', padding: 5 }}

                onPress={() =>
                    item.table_status == "active" ? this.props.navigation.navigate("AddOrder", {
                        table_uu_id: item.table_uu_id,
                        order_method_type: 2
                    }) :
                        this.props.navigation.navigate("OrdersDetailsPos", {
                            table_uu_id: item.table_uu_id, table_url: global.qr_link + item.qr_link
                        })
                }>
                <LinearGradient
                    colors={item.table_status == 'active' ? ["#fff", '#fff'] : ['#5BC2C1', '#296E84']}
                    style={item.table_status == 'active' ? styles.box1 : styles.box}>
                    <View>
                        <Text numberOfLines={2} style={[styles.h3, { fontFamily: "Roboto-medium", color: item.table_status == "active" ? "#000" : "#fff" }]}>{item.table_name}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </>
    )

    //to refresh tables on swipe down
    onRefresh() {
        //   this.setState({isloading:true,data:[],page:1,});
        //   this.fetch_table_vendors();
        this.setState({ isFetching: true, isloading: true, data: [], page: 1, }, () => { this.fetch_table_vendors(); });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={[styles.container, { backgroundColor: "#fff" }]}>
                    {Platform.OS == 'ios' ?
                        <>
                            <View style={{
                                flexDirection: 'row', borderBottomColor: '#ececec',
                                borderBottomWidth: 1, marginTop: 5, paddingBottom: 5, width: Dimensions.get('window').width
                            }}>
                                <TouchableOpacity style={{ alignSelf: "center", marginLeft: 5 }}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Icon name='arrow-back' type='ionicon' size={30} color='#000000' />
                                </TouchableOpacity>
                                <View>
                                    <Image source={require('../img/logo/mp.png')}
                                        style={
                                            {
                                                width: 45,
                                                height: 45,
                                                marginTop: 5,
                                                marginLeft: 10
                                            }
                                        } />
                                </View>
                                <View style={{ width: Dimensions.get('window').width / 1.2, padding: 5, marginTop: 2, left: 0 }}>
                                    <Text style={[styles.h3, { color: '#222', fontSize: RFValue(15, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>Hello, {this.context.user.shop_name}</Text>
                                    <Text style={styles.smallHeading}>Welcome to WeazyDine M-POS</Text>
                                </View>


                                {/* <TouchableOpacity style={{ backgroundColor: "#ececec", height: 35, width: 35, borderRadius: 50, justifyContent: "center", marginLeft: 5, }}
                                    onPress={() => this.props.navigation.navigate("Notifications")}>
                                    <Icon name='notifications' type='ionicon' size={20} color='#5BC2C1' />
                                </TouchableOpacity> */}
                            </View>


                        </>
                        :
                        <>
                            <Header
                                statusBarProps={{ barStyle: 'dark-content' }}
                                // rightComponent={this.renderRightComponent()}
                                leftComponent={this.renderLeftComponent()}
                                ViewComponent={LinearGradient} // Don't forget this!
                                linearGradientProps={{
                                    colors: ['#fff', '#fff'],
                                    start: { x: 0, y: 0.5 },
                                    end: { x: 1, y: 0.5 },
                                }}
                                containerStyle={{
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    borderBottomColor: '#ececec',
                                    borderBottomWidth: 1,
                                    marginTop: 10
                                }}
                                backgroundColor="#ffffff"
                            />
                        </>
                    }

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 10, }}>

                            {!this.state.isloading ?
                                (this.state.data.length > 0) ?

                                    <View>
                                        {/* heading */}
                                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                            <View>
                                                <Text style={[styles.h2, { paddingLeft: 15 }]}>Dine-In</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginRight: 15 }}
                                            onPress={()=> this.props.navigation.navigate("AddOrder")}>
                                                <LinearGradient
                                                    style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, justifyContent: "center", }}
                                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                                    colors={['#5BC2C1', '#296e84']}>
                                                    <Text style={[styles.h3, { color: "#ffffff" }]}>Add Order</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>

                                        <FlatList
                                            numColumns={3}
                                            data={this.state.data}
                                            renderItem={this.renderItem}
                                            keyExtractor={item => item.id}
                                            style={{ marginBottom: 10 }}
                                            onRefresh={() => this.onRefresh()}
                                            refreshing={this.state.isFetching}
                                        />
                                    </View>

                                    :
                                    <View style={{ paddingTop: 10, alignItems: "center", }}>
                                        <View style={{ alignSelf: "center", marginTop: 50 }}>
                                            <Image source={require('../img/no-product.webp')} style={style.img} />
                                            <Text style={[styles.h3, { top: 0, alignSelf: "center" }]}>
                                                No Record Found!
                                            </Text>
                                        </View>
                                    </View>


                                :
                                <Loaders />
                            }

                        </View>
                    </ScrollView>
                </View>

            </SafeAreaView>
        );
    }
}

export default MPosDashBoard;

class Loaders extends Component {
    render() {
        return (
            <SkeletonPlaceholder>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10 }}>
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                    <View style={{ height: 80, width: 120, borderRadius: 15 }} />
                </View>
            </SkeletonPlaceholder>
        );
    }
}

const style = StyleSheet.create({

    img: {
        width: 320,
        height: 280,
        alignSelf: "center"
    }
});