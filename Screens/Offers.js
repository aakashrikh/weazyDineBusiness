import React, { Component } from 'react';
import {
    Text, View, ScrollView, Switch, Alert,
    StyleSheet, Image, ActivityIndicator,
    TouchableOpacity, Dimensions, ImageBackground, Pressable, FlatList
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import Loading from './Loading.js';
import Share from 'react-native-share';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class Offers extends Component {
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
            page: 1
        }
    }

    renderLeftComponent() {
        return (
            <View style={{ width: win.width }} >
                <Text style={[styles.h3]}>Offers</Text>
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
            this.get_vendor_offer1()
        }
    }

    // Fetching offers
    get_vendor_offer = () => {
        fetch(global.vendor_api + 'get_vendor_offers_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                page: 0
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    // Toast.show(json.errors[0])
                }
                else {
                    if (json.data.length >= 0) {
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
                        this.setState({ data: json.data })
                        console.warn(json.data)
                    }
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    get_vendor_offer1 = () => {
        var page = this.state.page + 1;
        this.setState({ page: page, load_more: true });
        fetch(global.vendor_api + 'get_vendor_offers_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                page: page
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    // Toast.show(json.errors[0])
                }
                else {
                    if (json.data.length > 0) {
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
                        var obj = json.data;
                        var joined = this.state.data.concat(obj);
                        this.setState({ data: joined })
                        console.warn(json.data)
                    }
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false, load_more: false })
            });
    }

    // Function to active/Inactive Offers
    toggle = (id) => {
        // alert(id)
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
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                action_id: id,
                type: 'offer',
                status: status
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);

                }

            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
                this.get_vendor_offer();
            });

    }

    // Alert to delete 
    alertFunc = () => {
        Alert.alert(
            "",
            "Are you sure you want to delete this Offer?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_product() }
            ]
        )
        this.RBSheet.close()
    }
    
    //   Delete product function
    delete_product = () => {
        //   alert(this.state.prod_id)
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                action_id: this.state.prod_id,
                type: 'offer',
                status: "delete"
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    // Toast.show(json.errors[0])
                }
                else {
                    Toast.show("Offer deleted")
                    this.get_vendor_offer()
                }
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    //   Edit offer function
    editNavigation = () => {
        // alert(this.state.id)
        console.warn(this.state.id)
        this.props.navigation.navigate("EditOffer",
            {
                data: this.state.id,
                // category:this.props.category
            })
        this.RBSheet.close()
    }

    myShare = async (title, content, url) => {
        const shareOptions = {
            title: title,
            message: title + content,
            url: url,
        }
        try {
            const ShareResponse = await Share.open(shareOptions);
            const { isInstalled } = await Share.isPackageInstalled(
                "com.marketpluss_user"
            );

            if (isInstalled) {
                await Share.myShare(shareOptions);
            } else {
                Alert.alert(
                    "Whatsapp not installed",
                    "Whatsapp not installed, please install.",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                );
            }

        } catch (error) {
            console.log("Error=>", error)
        }
    }

    // Function to open Bottom sheet 
    sheet = (id) => {
        this.setState({ id: id })
        this.RBSheet.open();
        this.setState({ prod_id: id.id })
    }

    //   Particular offer card for flatlist
    offerCard = ({ item }) => (
        <View>
            <Pressable onPress={() => this.props.navigation.navigate("OfferProduct", { offer: item })} >
                <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>
                    {/* View for Image */}
                    {/* <View style={{width:"27%"}}>
 <Image source={require("../img/image.jpg")}
 style={style.logo}/>


 <View style={{width:"85%",backgroundColor:"#EDA332",height:30,top:85,justifyContent:"center",  left:15,position:"absolute", alignItems:"center",borderRadius:5}} >
               
                <Text style={{fontFamily:"Montserrat-Bold",
            fontSize:RFValue(11,580),color:"#fff"}}>
                    {details.offer}% Off</Text>
    </View>
</View> */}


                    {/* View for Content */}

                    <View style={style.contentView}>
                        {/* View for name and heart */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            {/* Text View */}
                            <View style={{ width: 250, marginLeft: 10 }} >
                                {/* type heading */}
                                <Text numberOfLines={1} style={[styles.small, {
                                    top: 10, fontSize: RFValue(10.66, 580),
                                    marginLeft: 0, color: "#000",
                                    marginLeft: 5, fontFamily: "Raleway-Bold"
                                }]}>
                                    {item.offer_name}</Text>

                                {/* description */}
                                <Text numberOfLines={3} style={[styles.small, {
                                    top: 10, fontSize: RFValue(9, 580),
                                    marginLeft: 5
                                }]}>
                                    {item.offer_description}</Text>

                                <Text style={[styles.smallHeading, { top: 10, marginLeft: 5 }]}>
                                    Expires on : {item.start_to}

                                </Text>

                            </View>

                            {/* View for toggle icon  */}
                            <View style={{ margin: 5, marginTop: 10, flexDirection: "row" }}>
                                <View style={{ marginRight: 10 }} >
                                    <Switch
                                        trackColor={{ false: "#d3d3d3", true: "#EDA332" }}
                                        thumbColor={this.state.isOn[item.id] ? "white" : "white"}
                                        value={this.state.object[item.id]}
                                        onValueChange={() => this.toggle(item.id)}
                                    />
                                </View>

                                <Text style={{ marginRight: 10 }}>
                                    <Icon type="ionicon" name="ellipsis-vertical" onPress={() => this.sheet(item)} size={22} />
                                </Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", alignSelf: "flex-end", justifyContent: "space-evenly" }}>
                            <Text style={{
                                fontFamily: "Montserrat-Bold",
                                fontSize: RFValue(11, 580), position: "absolute", right: 40, bottom: 0
                            }}>
                                {item.offer}% Off</Text>

                            <View style={{ right: 10 }}>
                                <Icon name="share-social-outline"
                                    onPress={() => this.myShare("Checkout this crazy deal on Market Pluss |\n", item.offer_name + "- ", "\n" + global.shareLink + '/offerView/' + item.id)}
                                    type="ionicon" size={20} />
                            </View>
                        </View>

                        {/* Bottom Sheet for edit or delete options */}

                        <RBSheet
                            ref={ref => { this.RBSheet = ref; }}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={170}
                            customStyles={{
                                container: {
                                    borderTopRightRadius: 20,
                                    borderTopLeftRadius: 20,
                                },
                                draggableIcon: {
                                    backgroundColor: ""
                                }
                            }}
                        >
                            {/* bottom sheet elements */}
                            <View >
                                {/* new container search view */}
                                <View>
                                    {/* to share */}
                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: "row" }}
                                            onPress={() => this.editNavigation()}>
                                            <View style={{
                                                backgroundColor: "#f5f5f5",
                                                height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 50
                                            }}>
                                                <Icon type="ionicon" name="create-outline" />
                                            </View>
                                            <Text style={[styles.h4, { alignSelf: "center", marginLeft: 20 }]}>
                                                Edit</Text>
                                        </TouchableOpacity>
                                    </View>



                                    {/* to report */}
                                    <View style={{ flexDirection: "row", padding: 10 }}>


                                        <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.alertFunc()
                                        }>
                                            <View style={{
                                                backgroundColor: "#f5f5f5",
                                                height: 40, width: 40, justifyContent: "center", borderRadius: 50
                                            }} >
                                                <Icon type="ionicon" name="trash-bin" />
                                            </View>
                                            <Text style={[styles.h4, { alignSelf: "center", marginLeft: 20 }]}
                                            >Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </RBSheet>
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
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        }}
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
                                    <Text style={[styles.h3, { top: -20, alignSelf: "center" }]}>
                                        No offers found
                                    </Text>
                                </View>
                        ]
                        :
                        <View>
                            <Loaders />
                        </View>
                    }
                    {this.state.load_more ?
                        <View style={style.loader}>
                            <ActivityIndicator size="small" color="#EDA332" />
                        </View>
                        :
                        <View>
                        </View>}
                    {/* {this.state.isloading ? 
                    <View style={{paddingTop:120,alignItems:"center"}}>
                    <ActivityIndicator size='small' color="#EDA332" />
                    <Text style={styles.p}>Please wait</Text>
                    </View>
                        :
                <View >  
                {/* {details}
                 */}
                    {/* <FlatList
                 navigation={this.props.navigation}
                 showsVerticalScrollIndicator={false}
                 data={this.state.data}
                 renderItem={this.offerCard}
                 keyExtractor={item=>item.id}  
                 onEndReachedThreshold={0.5}
                 onEndReached={()=>this.load_more()}
                />
                </View>
                        } */}


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
export default Offers

class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder>
                    <View>
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />     
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />  
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
                   <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />           
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
    logo: {
        height: 90,
        width: "95%",
        // borderWidth:0.2,
        // borderRadius:10,
        borderColor: "black",
        margin: 10,
        marginLeft: 10
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
        backgroundColor: "#EDA332",
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

    button: {
        backgroundColor: "#EDA332",
        padding: 4,
        borderRadius: 25,
        width: 80,
        height: 30,
        justifyContent: "center"

    },
    buttonText: {
        alignSelf: "center",
        color: "#fff",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Medium",
        fontSize: RFValue(9, 580)
    },
    catButton: {
        // backgroundColor:"#BC3B3B",
        // padding:7,
        height: 30,
        marginLeft: 10,
        borderRadius: 25,
        justifyContent: "center",
        borderColor: "#EBEBEB",
        borderWidth: 1,
        width: 100
    },
    catButtonText: {
        alignSelf: "center",
        color: "#222222",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Regular",
        fontSize: RFValue(9, 580)

    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginBottom: 5,
        marginTop: 30,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fbf9f9", width: 30, height: 30, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})