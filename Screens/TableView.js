import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,
    ScrollView, Dimensions, TouchableOpacity, FlatList,
    Modal,
    Linking
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
// import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import MultiSelect from 'react-native-multiple-select';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import { Picker } from '@react-native-picker/picker';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var categ = []

class TableView extends Component {

    constructor(props) {

        super(props);
        console.warn(props)
        this.state = {
            category: "",
            status: "active",
            data: [],
            isloading: true,
            cart: [],
            modalVisible: false,
            total_price: 0,
            bill: []
        };

    }


    componentDidMount() {
        //   this.RBSheet.open();
        this.fetch_table_order()
    }

    fetch_table_order = () => {
        fetch(global.vendor_api + 'fetch_ongoing_order_for_table', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_id,
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    console.warn(json.data);
                    if (json.data.length > 0) {
                        // console.warn(json.data)
                        this.setState({ data: json.data[0] })
                        this.setState({ cart: json.data[0].cart })
                        console.warn("cart", cart)
                    }

                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();

                    // }, 10000);

                    // this.setState({interval:myInterval});
                    // Toast.show(json.msg)


                }
                this.setState({ isloading: false })
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
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
                <Text style={style.text}>{this.props.route.params.table_name}</Text>
            </View>

        )
    }

    renderRightComponent() {
        return (
            <View style={{ top: 5 }}>
                <Icon type="ionicon" name="ellipsis-vertical-outline"
                    onPress={() => this.RBSheet.open()} />
            </View>

        )
    }


    delete_table = () => {

        fetch(global.vendor_api + 'delete_table_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_id
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                }
                else {
                    Toast.show(json.msg)
                    this.props.navigation.navigate('Tables');
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    save_qr = () => {
        alert("Sss");
    }


    complete_order = (status) => {
        fetch(global.vendor_api + 'update_order_status_by_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                order_status: status,
                order_id: this.state.data.order_code,
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    console.warn(json.data);
                    if (json.data.length > 0) {
                        // console.warn(json.data)
                        this.setState({ data: json.data[0] })
                        this.setState({ cart: json.data[0].cart })
                    }
                    this.setState({ modalVisible: true })
                }
                // this.setState({isloading:false})
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                // this.setState({ isloading:false })
            });
    }

    genrate_bill = () => {
        fetch(global.vendor_api + 'generate_bill_by_table', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_id,
                order_id: this.state.data.order_code,
            })
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    console.warn(json.data);
                    if (json.data.length > 0) {
                        // console.warn(json.data)
                        this.setState({ bill: json.data[0] })
                        this.setState({ cart: json.data[0].cart })
                    }
                    this.setState({ modalVisible: true })
                }
                // this.setState({isloading:false})
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                // this.setState({ isloading:false })
            });
    }


    addonItem = ({ item }) => (
        <View style={{ margin: 5, borderWidth: 1, padding: 5, borderRadius: 5,borderColor:"#EDA332" }}>
            <Text>{item.addon_name}</Text>
        </View>
    )


    render() {
        const { modalVisible } = this.state;
        return (
            <View style={[styles.container]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        rightComponent={this.renderRightComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                    />
                </View>

                <ScrollView style={{ backgroundColor: '#fff' }}>

                    {
                        (!this.state.isloading) ? (

                            (this.state.cart.length > 0) ?

                                (this.state.cart.map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: 'row', width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ececec' }}>
                                            <View style={{ width: '20%', width: 50, height: 50, backgroundColor: '#EDA332', borderRadius: 5 }}>
                                                <Text style={{ fontSize: 45, alignSelf: 'center', color: '#eee' }}>T</Text>
                                            </View>

                                            <View style={{ marginLeft: 20, width: '60%' }}>
                                                {
                                                    (item.product == null) ?
                                                        <></>
                                                        :
                                                        <Text style={{ fontSize: 20, color: '#000' }}>{item.product.product_name}
                                                            {(item.variant != null) ? <Text>- {item.variant.variant_name}</Text>
                                                                :
                                                                ('')
                                                            }
                                                        </Text>
                                                }
                                                {/* <Text style={styles.h4}>{item.product.product_name} 
                    {(item.variant != null)?<Text>- {item.variant.variant_name}</Text>:('')} */}

                                                {/* </Text> */}

                                                <View style={{ flexDirection: 'column' }}>
                                                    {(item.addons.length > 0) ? (

                                                        <FlatList
                                                            numColumns={3}
                                                            data={item.addons}
                                                            renderItem={this.addonItem}
                                                            keyExtractor={item => item.id}
                                                        />

                                                    ) :
                                                        <></>
                                                    }
                                                </View>

                                                <Text style={styles.p}>{item.product_quantity} * {item.product_price / item.product_quantity} </Text>
                                            </View>

                                            <View style={{ marginLeft: 20, width: '20%' }}>
                                                <Text style={styles.h3}>₹{item.product_price}</Text>
                                            </View>

                                        </View>
                                    )
                                }))
                                :
                                <View style={{ paddingTop: 120, alignItems: "center" }}>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image source={require("../img/no-product.png")}
                                            style={{ width: 300, height: 300 }} />
                                        <Text style={[styles.h3, { top: -10, alignSelf: "center" }]}>
                                            No Order Found!
                                        </Text>
                                    </View>
                                </View>


                        ) :
                            <Loaders />

                    }

                    {
                        (!this.state.isloading) ? (

                            (this.state.cart.length > 0) ?
                                <View style={{ marginBottom: 100 }}>
                                    <View style={{ flexDirection: 'row', width: '100%', paddingLeft: 20, marginTop: 10, marginBottom: 5 }}>
                                        <Text style={[styles.h4, { width: '80%' }]}>Item Total</Text>
                                        <Text style={[styles.h4, { width: '20%', alignSelf: 'flex-end' }]}>₹{this.state.data.order_amount}</Text>
                                    </View>

                                    {/* <View style={{flexDirection:'row',width:'100%',paddingLeft:20,marginTop:5,marginBottom:5}}>
                        <Text style={[styles.h4,{width:'80%'}]}>GST (15%)</Text>
                        <Text style={[styles.h4,{width:'20%',alignSelf:'flex-end'}]}>300</Text>
                    </View> */}


                                </View>
                                :
                                <Text></Text>
                        ) :
                            <></>
                    }


                </ScrollView>

                <View style={{ width: '100%', height: 50, backgroundColor: '#fff', position: 'absolute', bottom: 0 }}>

                    {(this.state.cart.length > 0) ?
                        <TouchableOpacity
                            // onPress={this.send_otp}
                            onPress={() => this.genrate_bill()}
                            style={[styles.buttonStyle, { bottom: 10 }]}>
                            <LinearGradient
                                colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                                style={[styles.signIn, { borderRadius: 10, width: '80%', alignSelf: 'center' }]}>

                                <Text style={[styles.textSignIn, {
                                    color: '#fff'
                                }]}>Generate Bill</Text>

                            </LinearGradient>
                        </TouchableOpacity> :
                        <></>
                    }
                </View>

                {/* Bottom Sheet for Camera */}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={150}
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
                        <View style={{ width: "100%", padding: 20 }}>
                            <TouchableOpacity onPress={() => { Linking.openURL(this.props.route.params.table_url) }} style={{ flexDirection: 'row' }}>
                                <Text style={style.iconPencil}>
                                    <Icon name='qr-code-outline' type="ionicon" color={'#EDA332'} size={30} />
                                </Text>
                                <Text style={[styles.h4, { marginLeft: 20, marginTop: 4 }]}>View Table QR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { this.delete_table() }} style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={style.iconPencil}>
                                    <Icon name='trash-outline' type="ionicon" color={'#EDA332'} size={30} />
                                </Text>
                                <Text style={[styles.h4, { marginLeft: 20, marginTop: 4 }]}>Delete Table</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </RBSheet>
                <View style={style.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            this.setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.modalView}>
                                <Text style={[styles.h4, { alignSelf: 'center' }]}>Generating your Bill!</Text>

                                <Text style={[styles.h3, { marginTop: 5 }]}>Total -  ₹{this.state.bill.total_amount}</Text>
                                <TouchableOpacity
                                    // onPress={this.send_otp}
                                    // onPress={()=>this.complete_order()}
                                    onPress={() => this.props.navigation.navigate("GenerateBill", { bill: this.state.bill })}
                                >
                                    <LinearGradient
                                        colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                                        style={[{ borderRadius: 10, width: '80%', alignSelf: 'center', backgroundColor: 'red', padding: 5, borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginTop: 20 }]}>
                                        <Text style={[styles.textSignIn, {
                                            color: '#fff'
                                        }]}>Mark Complete</Text>

                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }

}



class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder >
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <View style={{ marginLeft: 5 }}>
                            <View style={{ width: win.width / 3.5, height: 110, borderRadius: 10 }} />
                        </View>

                        <View>
                            <View style={{ flexDirection: "row", }}>
                                <View>
                                    <View style={{ width: 150, height: 15, marginLeft: 10, top: 5 }} />
                                    <View style={{ width: 250, height: 20, marginLeft: 10, top: 10 }} />
                                </View>
                                <View style={{ height: 20, width: 35, right: 60, bottom: 5 }}></View>
                                <View style={{ height: 20, width: 20, right: 50, bottom: 5 }}></View>
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "flex-end", left: -35, marginRight: 20, marginTop: 15 }}>
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                            </View>
                        </View>



                    </View>


                </SkeletonPlaceholder>

            </View>
        )
    }
}
export default TableView

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        width: 300,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    fieldsTitle: {
        fontFamily: "Raleway-Regular",
        // color:"grey",
        fontSize: RFValue(14, 580),
        padding: 10,
        paddingLeft: 20

    },
    textInput: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        color: "#5d5d5d",
        //   backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 5,
        width: Dimensions.get("window").width / 1.1,
        height: 40,
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: RFValue(11, 580),
    },
    uploadButton: {
        backgroundColor: "#326bf3",
        width: 105,
        height: 40,
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        alignSelf: "center",
        alignItems: "center",
        // marginLeft:20,
        marginTop: 20
    },
    buttonText: {
        fontFamily: "Raleway-SemiBold",
        color: "#fff",
        fontSize: RFValue(14, 580)
    },
    text: {
        fontFamily: "Roboto-Medium",
        fontSize: RFValue(14.5, 580),
        margin: 5
    },

})