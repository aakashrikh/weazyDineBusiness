import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,
    ScrollView, Dimensions, TouchableOpacity, FlatList, Alert, Linking, Platform
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
import Modal from "react-native-modal";
import RadioForm from 'react-native-simple-radio-button';
import { AuthContext } from '../AuthContextProvider.js';


//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var radio_props = [
    { label: 'Google Pay/Paytm/UPI', value: 'UPI' },
    { label: 'Credit/Debit Card', value: 'card' },
    { label: 'Cash', value: 'cash' }
];

class TableView extends Component {
    static contextType = AuthContext;

    constructor(props) {

        super(props);
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
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_uu_id,
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
                        this.setState({ data: json.data[0] })
                        this.setState({ cart: json.data[0].cart })
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
                    onPress={() => {
                        //Linking.openURL("weazydine://home/");
                         this.props.navigation.navigate("Orders") 
                    }}
                        
                        />
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
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_uu_id
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    console.warn(msg);
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

    genrate_bill = () => {
        fetch(global.vendor_api + 'generate_bill_by_table', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                table_id: this.props.route.params.table_uu_id,
                order_id: this.state.data.order_code,
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

    deleteAlert = () => {
        Alert.alert(
            "",
            "Are you sure you want to delete this table?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_table() }
            ],
            { cancelable: false }
        );
    }

    noDeleteAlert = () => {
        Alert.alert(
            "",
            "You can not delete this table because it has an active order.",
            [
                {
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }

    mark_complete = () => {
        fetch(global.vendor_api + 'update_order_status_by_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                order_id: this.state.bill.id,
                payment_method: this.state.payment,
                order_status: 'completed'
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    console.warn(json)
                    var msg = json.message;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    this.setState({ modalVisible: false });
                    this.props.navigation.navigate('Tables');

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
                                        <View style={{ flexDirection: 'row', width: '98%', padding: 10,backgroundColor:"#fff",shadowColor: "#000",marginTop:10,
                                        shadowOffset: {width: 0,height: 2},shadowOpacity: 0.25,shadowRadius: 4,elevation: 5,borderRadius:10,alignSelf:"center" }}>
                                            <View style={{ width: '20%', width: 45, height: 45, backgroundColor: '#EDA332', borderRadius: 5 }}>
                                                <Text style={{ fontSize: 42, alignSelf: 'center', color: '#eee' }}>T</Text>
                                            </View>

                                            <View style={{ marginLeft: 20, width: '60%' }}>
                                                {
                                                    (item.product == null) ?
                                                        <></>
                                                        :
                                                        <Text style={{ fontSize: RFValue(12,580), color: '#000' }}>{item.product.product_name}
                                                            {(item.variant != null) ? <Text> - {item.variant.variants_name}</Text>
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

                                                <View style={{flexDirection:"row"}}>
                                                    <Text style={[styles.p,{fontFamily:"Poppins-Medium"}]}>{item.product_quantity} </Text>
                                                    <Icon name="close-outline" type='ionicon' style={{marginTop:6}} size={20}/> 
                                                    <Text style={[styles.p,{fontFamily:"Poppins-Medium"}]}> {item.product_price / item.product_quantity} </Text>
                                                </View>
                                            </View>

                                            <View style={{ marginLeft: 20, width: '20%' }}>
                                                <Text style={[styles.h4,{fontFamily:"Poppins-Medium"}]}>₹{item.product_price}</Text>
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
                                <View style={{ marginBottom: 100, }}>
                                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width/1.05, alignSelf:"center", marginTop: 10, marginBottom: 5,padding:10, backgroundColor: '#fff',
                                     shadowColor: "#000",shadowOffset: {width: 0,height: 2},shadowOpacity: 0.25,alignItems:"center",shadowRadius: 4,elevation: 5,borderRadius:10}}>
                                        <Text style={[styles.h4, { width: '80%',marginLeft:20}]}>Item Total</Text>
                                        <Text style={[styles.h4, { width: '20%', alignSelf: 'flex-end',fontFamily:"Poppins-Medium" }]}>₹{this.state.data.order_amount}</Text>
                                    </View>

                                </View>
                                :
                                <Text></Text>
                        ) :
                            <></>
                    }


                </ScrollView>

                <View style={{ width: '100%', height: 50, backgroundColor: '#fff', position: 'absolute', bottom: 0, zIndex: 1 }}>

                    {(this.state.cart.length > 0) ?
                        <TouchableOpacity
                            onPress={() => this.genrate_bill()}
                            style={[styles.buttonStyle, { bottom: Platform.OS == "ios" ? 30 : 10}]}>
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

                            <TouchableOpacity onPress={() => {this.state.cart.length > 0 ? this.noDeleteAlert() : this.deleteAlert() }} style={{ flexDirection: 'row', marginTop: 10 }}>
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
                        onBackdropPress={() => {
                            this.setState({ modalVisible: false })
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.modalView}>
                                <Text style={[styles.h4, { alignSelf: 'center' }]}>Generating your Bill!</Text>

                                <Text style={[styles.h4, { marginTop: 5 }]}>Total Bill Amount-  ₹ { parseFloat(this.state.bill.total_amount).toFixed(2)}</Text>
                                <View style={{ backgroundColor: "#FFECB6", padding: 5,width:"100%", marginTop:20,borderRadius:5 }}>
                                    <Text style={[style.text1, { color: "#696969", fontSize: RFValue(10, 580),alignSelf:"center" }]}>Choose Selected Payment Method </Text>
                                </View>
                                <View style={{ padding: 20 }}>
                                    <RadioForm
                                        radio_props={radio_props}
                                        initial={0}
                                        buttonSize={10}
                                        buttonColor={'#EDA332'}
                                        selectedButtonColor={'#EDA332'}
                                        onPress={(value) => {
                                            this.setState({ payment: value })
                                        }}
                                        labelStyle={{ fontSize: RFValue(13, 580), margin:10,marginTop:0,marginBottom:0 }}
                                    />
                                </View>


                                <TouchableOpacity
                                    onPress={()=>this.mark_complete()}>
                                    <LinearGradient
                                        colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                                        style={[{ borderRadius: 10, alignSelf: 'center', backgroundColor: 'red', padding: 5, borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginTop: 20 }]}>
                                        <Text style={[styles.textSignIn, {
                                            color: '#fff',fontSize:RFValue(12,580)
                                        }]}>Complete Order & Generate Bill</Text>

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
    textInput: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        color: "#5d5d5d",
        borderRadius: 5,
        padding: 5,
        width: Dimensions.get("window").width / 1.1,
        height: 40,
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: RFValue(11, 580),
    },
    text: {
        fontFamily: "Roboto-Medium",
        fontSize: RFValue(14.5, 580),
        margin: 5
    },
    text1: {
        fontSize: RFValue(12, 580),
    }

})