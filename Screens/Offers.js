import React, { Component } from 'react';
import {
    Text, View, Switch, Alert,
    StyleSheet, Image, ActivityIndicator,
    TouchableOpacity, Dimensions, Pressable, FlatList
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class Offers extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isOn: false,
            isOff: true,
            object: {},
            id: [],
            prod_id: '',
            product_type: "offer",
            product: {},
            isloading: true,
            category: [],
            data: [],
            latitude: 1,
            longitude: 1,
            load_more: false,
            page: 1,
            total_sales_generated: 0,
            total_uses: 0,

        }
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
                <Text style={[style.text, { fontFamily: "Raleway-SemiBold" }]}>Offers</Text>
            </View>

        )
    }

    componentDidMount = async () => {
        this.get_vendor_offer()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_vendor_offer()
        })
    }

    // Function to load while scrolling
    load_more = () => {
        var data_size = this.state.data.length
        if (data_size > 9) {
            var page = this.state.page + 1
            this.setState({ page: page })
        }
    }

    // Fetching offers
    get_vendor_offer = () => {
        fetch(global.vendor_api + 'fetch_offers', {
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
                    if (json.data.length >= 0) {
                        this.setState({ data: json.data })
                        json.data.map((value, key) => {
                            const object = this.state.object;

                            if (value.status == 'active') {
                                object[value.id] = true;
                            }
                            else {
                                object[value.id] = false;
                            }

                            this.setState({ object });
                        })

                    }
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    toggle = (id) => {
        const object = this.state.object;
        if (object[id] == true) {
            object[id] = false;
            var status = "inactive"
        }
        else {
            object[id] = true;
            var status = "active"
        }
        this.setState({ object });
        fetch(global.vendor_api + 'update_offer_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                status: status,
                id: id,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status == true) {
                    Toast.show('Offer status updated successfully');
                    this.get_vendor_offer();
                } else {
                    Toast.show('Something went wrong');
                }
            })
            .catch((error) => {
                Toast.show(error.message);
            })
            .finally(() => {
                this.setState({ isloading: false });
            });
    };


    // Alert to delete 
    alertFunc = (id) => {

        Alert.alert(
            "",
            "Are you sure you want to delete this Offer?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_offer(id) }
            ]
        )
    }

    //   Delete product function
    delete_offer = (id) => {
        fetch(global.vendor_api + 'delete_offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': this.context.token,
            },
            body: JSON.stringify({
                offer_id: id,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status) {
                    this.get_vendor_offer();
                    Toast.show("Offer deleted successfully")
                }
                else {
                    Toast.show("Something went wrong")
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
            });
    };

    //   Particular offer card for flatlist
    offerCard = ({ item }) => (
        <View>
            <Pressable >
                <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>



                    {/* View for Content */}

                    <View style={style.contentView}>
                        {/* View for name and heart */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            {/* Text View */}
                            <View style={{ width: 250, marginLeft: 10 }} >
                                {/* type heading */}
                                <Text numberOfLines={1} style={[styles.small, {
                                    top: 10, fontSize: RFValue(10, 580),
                                    marginLeft: 0, color: "#000",
                                    marginLeft: 5, fontFamily: "Montserrat-Bold"
                                }]}>
                                    {item.offer_code}</Text>

                                <Text style={[styles.small, {
                                    marginLeft: 5, marginTop: 10, fontFamily: "Montserrat-Regular"
                                }]}>{item.offer_name}</Text>

                            </View>

                            {/* View for toggle icon  */}
                            <View style={{ margin: 5, marginTop: 10, flexDirection: "row" }}>
                                <View style={{ marginRight: 10 }} >
                                    <Switch
                                        trackColor={{ false: "#d3d3d3", true: "#5BC2C1" }}
                                        thumbColor={this.state.isOn[item.id] ? "white" : "white"}
                                        value={this.state.object[item.id] ? true : false}
                                        onValueChange={() => this.toggle(item.id)}
                                    />
                                </View>

                                <Text style={{ marginRight: 10 }}>
                                    <Icon type="ionicon" name="trash-outline" onPress={() => this.alertFunc(item.id)} size={22}
                                        color="red" />
                                </Text>
                            </View>

                            

                        </View>
                        <View style={{justifyContent:"space-between", flexDirection:"row", paddingHorizontal:10}}>
                                    <View>
                                    <Text style={[styles.small, {
                                        top: 10, fontSize: RFValue(10, 580),
                                        marginLeft: 0, color: "#000",
                                        marginLeft: 5, fontFamily: "Montserrat-Bold"
                                    }]}>Time Used</Text>
                                    <Text style={[styles.small, {
                                    alignSelf:"center", marginTop: 10, fontFamily: "Montserrat-SemiBold"}]}>{this.state.total_uses}</Text>
                                    </View>

                                    <View>
                                    <Text style={[styles.small, {
                                        top: 10, fontSize: RFValue(10, 580),
                                        marginLeft: 0, color: "#000",
                                        marginLeft: 5, fontFamily: "Montserrat-Bold"
                                    }]}>Total Sales Generated</Text>
                                    <Text style={[styles.small, {
                                    alignSelf:"center", marginTop: 10, fontFamily: "Montserrat-SemiBold"}]}>
                                        ₹ {this.state.total_sales_generated}</Text>
                                    </View>
                                    
                                </View>
                    </View>

                </View>
            </Pressable>
        </View>
    )

    render() {
        return (
            <View style={[styles.container, { flex: 1, backgroundColor: "#fff" }]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'dark-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        }}
                        backgroundColor="#ffffff"
                    />
                </View>


                {!this.state.isloading ?
                    [
                        (this.state.data.length > 0) ?
                            <FlatList
                                navigation={this.props.navigation}
                                showsVerticalScrollIndicator={false}
                                data={this.state.data}
                                renderItem={this.offerCard}
                                keyExtractor={item => item.id}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => this.load_more()}
                            />
                            :
                            <View style={{ alignSelf: "center", flex: 1, marginTop: 150 }}>
                                <Image source={require("../img/nooffers.png")}
                                    style={{ width: 300, height: 300 }} />
                                <Text style={[styles.h3, { top: 20, alignSelf: "center" }]}>
                                    No offers found
                                </Text>
                            </View>
                    ]
                    :
                    <View>
                        <Loaders />
                    </View>
                }

                <View>
                    <TouchableOpacity style={style.fab}
                        onPress={() => this.props.navigation.navigate("CreateOffers")}>
                        <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{ alignSelf: "center" }} />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
export default Offers;

class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder>
                    <View>
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                    </View>
                </SkeletonPlaceholder>

            </View>
        )
    }
}

const style = StyleSheet.create({
    icon: {
        margin: 10
    },
    image: {
        height: 200,
        width: 250,
        alignSelf: "center",
    },
    card: {
        // backgroundColor:"green",
        backgroundColor: "#FBF9F9",
        alignSelf: "center",
        width: Dimensions.get("window").width / 1.03,
        top: 10,
        marginBottom: 10,
        shadowRadius: 50,
        shadowOffset: { width: 50, height: 50 },

    },
    contentView: {
        flexDirection: "column",
        marginHorizontal: 10,
        marginBottom: 10,
        paddingBottom: 25,
        backgroundColor: '#fff',
        // position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        // height:"47%",
        width: Dimensions.get('window').width / 1.08,
        borderRadius: 10,
        // top: Dimensions.get('window').height / 2.7,
        shadowRadius: 50,
        shadowOffset: { width: 1, height: 1 },
        elevation: 4,

    },
    fab: {
        backgroundColor: "#5BC2C1",
        borderRadius: 100,
        height: 50,
        width: 50,
        bottom: 10,
        right: 10,
        // alignSelf:"flex-end",
        // margin:20,
        justifyContent: "center",
        position: "absolute"
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginBottom: 5,
        marginTop: 30,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fbf9f9", width: 30, height: 30, borderRadius: 50, padding: 5, alignSelf: "center"
    },
    text: {
        fontFamily: "Roboto-Bold",
        // fontSize:20,
        fontSize: RFValue(14.5, 580),
        margin: 5,
    }
})