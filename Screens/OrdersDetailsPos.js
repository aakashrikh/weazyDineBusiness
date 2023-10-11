import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput, ActivityIndicator,
    ScrollView, Dimensions, TouchableOpacity, FlatList, Alert, Linking, Platform
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Modal from "react-native-modal";
import RadioForm from 'react-native-simple-radio-button';
import { AuthContext } from '../AuthContextProvider.js';
import Counter from 'react-native-counters';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';


//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var radio_props = [
    { label: 'Google Pay/Paytm/UPI', value: 'UPI' },
    { label: 'Credit/Debit Card', value: 'Card' },
    { label: 'Cash', value: 'Cash' },
    { label: "Split Payment", value: 'split' }
];

class OrdersDetailsPos extends Component {
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
            bill: [],
            payment: "UPI",
            isButtonLoading: false,
            splitModalVisible: false,
            split_payment: [
                { amount: 0, method: 'Cash' },
                { amount: 0, method: 'Card' },
                { amount: 0, method: 'UPI' },
            ],
            split_total: 0,
            tableSwapModal: false,
            isTableLoading: true,
            tables: [],
            clear_table_buttonLoading: false,
            updateOrderModal: false,
            product_name: "",
            product_quantity: "",
            edit_cart_id: "",
            edit_quantity: "",
            update_product_quantity_buttonLoading: false,
            print_receipt: "",
            user: [],
            addCustomerModal: false,
            is_buttonloding: false,
            modalVisibleName: false,
            table_uu_id: this.props.route.params.table_uu_id,
            contact: "",
            name: "",
            status: true,
            update_product_quantity_buttonLoading: false,
            printBillModal: false,
        };

    }


    componentDidMount() {
        //   this.RBSheet.open();
        console.log(this.props.route.params.table_uu_id)
        this.fetch_table_order()

    }

    add_split_amount = (amount, index) => {
        if (amount == '') {
            amount = 0;
        }
        var split = this.state.split_payment;

        var tt = 0;
        split.map((item, i) => {
            if (i != index) {
                tt = parseFloat(tt) + parseFloat(item.amount);
            } else {
                tt = parseFloat(tt) + parseFloat(amount);
            }
        });

        split[index].amount = amount;
        this.setState({ split_payment: split, split_total: tt });
    };

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
                    console.warn(json.data)
                    if (json.data.length > 0) {
                        this.setState({ data: json.data[0] })
                        this.setState({ cart: json.data[0].cart })
                        this.setState({ user: json.data[0].user })
                        this.setState({ print_receipt: json.data[0].order_for })
                    }
                    else {
                        this.props.navigation.navigate("Dine-In")
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
                        // this.props.navigation.navigate("TabNav", { screen: "Dine-In" })
                        this.props.navigation.goBack();
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
                <Icon type="ionicon" name="qr-code-outline" color="#5BC2C1"
                    onPress={() => { Linking.openURL(this.props.route.params.table_url) }} />
            </View>

        )
    }

    // API call to delete table
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
                    this.props.navigation.navigate('Dine-In');
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    // API call to generate bill
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
        <View style={{ margin: 5, borderWidth: 1, padding: 5, borderRadius: 5, borderColor: "#5BC2C1" }}>
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

    // API call to complete mark order
    _mark_complete = () => {
        this.setState({ isButtonLoading: true });
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
                order_status: 'completed',
                split_payment: this.state.split_payment
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    console.warn(json);
                    var msg = json.message;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    this.setState({ modalVisible: false });
                    Toast.show("Order Complete!");
                    this.printRemotePDF();

                    this.props.navigation.navigate('Dine-In');
                    // this.setState({ printBillModal: true })

                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();
                    // }, 10000);
                    // this.setState({interval:myInterval});
                    // Toast.show(json.msg)
                }
                this.setState({ isloading: false });
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false, isButtonLoading: false });
            });
    };
    get mark_complete() {
        return this._mark_complete;
    }
    set mark_complete(value) {
        this._mark_complete = value;
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
                }
                else {
                    if (json.data.length > 0) {
                        this.setState({ tables: json.data })
                    }

                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isTableLoading: false })
            });
    }

    swap_table = (id) => {

        fetch(global.vendor_api + 'swapp_table_order', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                order_code: this.state.data.order_code,
                current_table_id: this.props.route.params.table_uu_id,
                new_table_id: id,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg)
                } else {
                    this.setState({ tableSwapModal: false });
                    Toast.show("Table Swapped!")
                    this.props.navigation.navigate("Dine-In");
                }
                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
            });
    };

    swapTableAlert = (id) => {
        Alert.alert(
            "",
            "Are you sure you want to swap this table order?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.swap_table(id) }
            ],
            { cancelable: false }
        );
    }

    // API call to clear table order
    clear_table_order = () => {
        this.setState({ clear_table_buttonLoading: true });

        fetch(global.vendor_api + 'clear_table', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                order_code: this.state.data.order_code,
                table_id: this.props.route.params.table_uu_id,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg)
                } else {
                    Toast.show('Table Cleared');
                    this.props.navigation.navigate("Dine-In")
                }
                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setState({ clear_table_buttonLoading: false });
            });
    };

    productCard = ({ item }) =>
    (
        <>
            {(item.table_status == 'active') ?
                <TouchableOpacity onPress={() => { this.swapTableAlert(item.table_uu_id) }} style={style.tableBox}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 60, height: 60, backgroundColor: '#5BC2C1', borderRadius: 5 }}>
                            <Text style={{ fontSize: 45, alignSelf: 'center', color: '#eee' }}>T</Text>
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.h3}>{item.table_name}</Text>
                            <Text style={[styles.h5, { fontSize: RFValue(12, 580), color: "green", textTransform: "capitalize" }]}>{item.table_status}</Text>

                        </View>
                    </View>

                </TouchableOpacity>
                :
                <></>

            }
        </>

    )

    onChange(number, type) {
        this.setState({ edit_quantity: number });
        // console.log(number, type) // 1, + or -
    }

    renderMinusIcon = () => {
        return (
            <View>
                <Icon
                    name="remove-circle-outline"
                    type="ionicon"
                    color="#000"
                    size={30}
                />
            </View>
        );
    };

    renderPlusIcon = () => {
        return (
            <View>
                <Icon name="add-circle-outline" type="ionicon" color="#000" size={30} />
            </View>
        );
    };

    update_product_quantity = (quantity) => {
        if (this.state.print_receipt == "gen_receipt") {
            Toast.show("You can't update quantity after printing receipt, Please contact admin")
        }
        else {
            this.setState({ update_product_quantity_buttonLoading: true });
            fetch(global.vendor_api + 'update_order_items_pos', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: this.context.token,
                },
                body: JSON.stringify({
                    item_id: this.state.edit_cart_id,
                    quantity: quantity,
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    } else {
                        this.setState({ updateOrderModal: false });
                        this.fetch_table_order(this.props.route.params.table_uu_id);
                        Toast.show('Product Quantity Updated');
                    }
                    return json;
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setState({ update_product_quantity_buttonLoading: false });
                });
        }
    };

    verifyCustomer = (e) => {
        this.setState({ is_buttonloding: true });
        var phoneNumber = e;
        let rjx = /^[0]?[6789]\d{9}$/;
        let isValid = rjx.test(phoneNumber);
        if (!isValid) {
            Toast.show('Please enter valid mobile number');
            this.setState({ is_buttonloding: false });
        }
        else if (e.length != 10) {
            Toast.show('Please enter valid mobile number');
            this.setState({ is_buttonloding: false });
        }
        else {
            fetch(global.vendor_api + 'verify_contact', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: this.context.token,
                },
                body: JSON.stringify({
                    contact: e,
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    } else {
                        this.setState({ user_id: json.data.id });
                        if (json.data.name == null || json.data.name == '') {
                            this.setState({ payment_step: 1, modalVisibleName: true, addCustomerModal: false, });
                        } else {
                            this.setState({ name: json.data.name, addCustomerModal: false, status: false }); {

                            }
                        }
                        Toast.show('done');
                    }
                    return json;
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setState({ is_buttonloding: false });
                });
        }
    };

    updateCustomer = () => {
        this.setState({ is_buttonloding: true });
        fetch(global.vendor_api + 'update_customer_name', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                contact: this.state.contact,
                name: this.state.name,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                } else {
                    this.setState({ payment_step: 2, modalVisibleName: false, modalVisible: false, status: false });

                    Toast.show('done');
                }
                this.setState({ is_buttonloding: false });
                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                // this.setState({ isloading: false });
            });
    };

    async printRemotePDF() {
        console.warn(global.vendor_api + this.state.data.order_code + '/bill.pdf')
        await RNPrint.print({ filePath: global.vendor_api + this.state.data.order_code + '/bill.pdf' })
        this.billPrint();
    }

    billPrint = () => {
        this.setState({printBillModal:false});
        this.props.navigation.navigate('Dine-In');
    }

    render() {
        const { modalVisible } = this.state;
        return (
            <View style={[styles.container]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'dark-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        rightComponent={this.renderRightComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        }}
                        backgroundColor="#ffffff"
                    />
                </View>

                <ScrollView style={{ backgroundColor: '#fff' }}>

                    {
                        (!this.state.isloading) ? (

                            (this.state.cart.length > 0) ?
                                <>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                                        <View>
                                            {
                                                this.state.status ?
                                                    <>
                                                        {
                                                            this.state.user.name == "Guest" ?
                                                                <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}
                                                                    onPress={() => this.setState({ addCustomerModal: true, })}>Add Customer +</Text>
                                                                :
                                                                <></>
                                                        }
                                                    </>
                                                    :
                                                    <></>
                                            }


                                        </View>

                                        <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.navigation.navigate("AddOrder", { table_uu_id: this.props.route.params.table_uu_id, order_method_type: 2 })
                                                }}
                                                style={{ alignSelf: "flex-end" }}>
                                                <LinearGradient
                                                    colors={['#5BC2C1', '#296E84']}
                                                    style={[{ borderRadius: 10, alignSelf: 'flex-end', backgroundColor: 'red', padding: 10, marginRight: 10, borderRadius: 5, paddingHorizontal: 10, marginTop: 20 }]}>
                                                    <Text style={[styles.textSignIn, {
                                                        color: '#fff', fontSize: RFValue(12, 580)
                                                    }]}>Add Item</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ tableSwapModal: true }), this.fetch_table_vendors()
                                                }}
                                                style={{ alignSelf: "flex-end" }}>
                                                <LinearGradient
                                                    colors={['#5BC2C1', '#296E84']}
                                                    style={[{ borderRadius: 10, alignSelf: 'flex-end', backgroundColor: 'red', padding: 10, marginRight: 10, borderRadius: 5, paddingHorizontal: 10, marginTop: 20 }]}>
                                                    <Text style={[styles.textSignIn, {
                                                        color: '#fff', fontSize: RFValue(12, 580)
                                                    }]}>Swap Table</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>

                                        </View>


                                        {/* {
                                            this.state.clear_table_buttonLoading ?
                                                <View style={[style.loader, { marginRight: 20 }]}>
                                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.clear_table_order()
                                                    }}>
                                                    <LinearGradient
                                                        colors={['red', '#DC3545']}
                                                        style={[{ borderRadius: 10, alignSelf: 'flex-end', backgroundColor: 'red', padding: 10, marginRight: 10, borderRadius: 5, paddingHorizontal: 10, marginTop: 20 }]}>
                                                        <Text style={[styles.textSignIn, {
                                                            color: '#fff', fontSize: RFValue(12, 580)
                                                        }]}>Clear Table</Text>

                                                    </LinearGradient>
                                                </TouchableOpacity>
                                        } */}

                                    </View>
                                    <>
                                        {(this.state.cart.map((item, index) => {
                                            return (



                                                <View style={{
                                                    flexDirection: 'row', width: '98%', padding: 10, backgroundColor: "#fff", shadowColor: "#000", marginTop: 10,
                                                    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius: 10, alignSelf: "center"
                                                }}>

                                                    <View style={{ width: '20%', width: 45, height: 45, backgroundColor: '#5BC2C1', borderRadius: 5 }}>
                                                        <Text style={{ fontSize: 42, alignSelf: 'center', color: '#eee' }}>T</Text>
                                                    </View>

                                                    <TouchableOpacity style={{ marginLeft: 20, width: '60%' }}
                                                        onPress={() => {
                                                            this.setState({
                                                                updateOrderModal: true, product_name: item.product.product_name,
                                                                edit_quantity: item.product_quantity, edit_cart_id: item.id
                                                            })
                                                        }}>
                                                        {
                                                            (item.product == null) ?
                                                                <></>
                                                                :
                                                                <Text style={{ fontSize: RFValue(12, 580), color: '#000' }}>{item.product.product_name}
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

                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={[styles.p, { fontFamily: "Poppins-Medium" }]}>{item.product_quantity} </Text>
                                                            <Icon name="close-outline" type='ionicon' style={{ marginTop: 6 }} size={20} />
                                                            <Text style={[styles.p, { fontFamily: "Poppins-Medium" }]}> {item.product_price / item.product_quantity} </Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <View style={{ marginLeft: 20, width: '20%' }}>
                                                        <Text style={[styles.h4, { fontFamily: "Poppins-Medium" }]}>₹{item.product_price}</Text>
                                                    </View>

                                                </View>
                                            )
                                        }))}</>
                                </>
                                :
                                <View style={{ paddingTop: 120, alignItems: "center" }}>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image source={require("../img/no-product.webp")}
                                            style={{ width: 300, height: 250 }} />
                                        <Text style={[styles.h3, { top: 10, alignSelf: "center" }]}>
                                            No Order Found!
                                        </Text>
                                    </View>
                                </View>


                        ) :
                            <Loaders />

                    }

                    {
                        this.state.data.instruction != null || this.state.data.instruction == "" ?

                            <View style={{
                                flexDirection: 'row', alignSelf: "center", width: Dimensions.get('window').width / 1.05, marginTop: 10, marginBottom: 5, padding: 10, backgroundColor: '#fff',
                                shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, alignItems: "center", shadowRadius: 4, elevation: 5, borderRadius: 10,
                            }}>
                                <Text style={styles.h4}>Instructions : <Text style={{ fontFamily: "Poppins-Medium" }}>{this.state.data.instruction}</Text></Text>
                            </View>

                            :
                            <></>
                    }

                    {

                        (!this.state.isloading) ? (

                            (this.state.cart.length > 0) ?
                                <View style={{ marginBottom: 100, }}>
                                    <View style={{
                                        width: Dimensions.get('window').width / 1.05, alignSelf: "center", marginTop: 10, marginBottom: 5, padding: 10, backgroundColor: '#fff',
                                        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, alignItems: "center", shadowRadius: 4, elevation: 5, borderRadius: 10, justifyContent: "space-between"
                                    }}>
                                        <View  style={[
                                                    style.detailsView,
                                                    { paddingVertical: 0, paddingBottom: 10 },
                                                ]}>
                                            <Text style={styles.h4}>Item Total</Text>
                                            <Text style={styles.h4}>₹ {this.state.data.order_amount}</Text>
                                        </View>

                                        {this.state.data.cgst > 0 || this.state.data.sgst > 0 ? (
                                            <View
                                                style={[
                                                    style.detailsView,
                                                    { paddingVertical: 0, paddingBottom: 10 },
                                                ]}>
                                                <Text style={styles.h4}>
                                                    Taxes & Other Charges
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.h4,
                                                        { color: 'green' },
                                                    ]}>
                                                    + {this.state.data.cgst + this.state.data.sgst}
                                                </Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )}

                                        {this.state.data.order_discount > 0 ? (
                                            <View
                                                style={[
                                                    style.detailsView,
                                                    { paddingVertical: 0, paddingBottom: 10 },
                                                ]}>
                                                <Text style={styles.h4}>
                                                    Discount
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.h4,
                                                        { color: 'green' },
                                                    ]}>
                                                    - {this.state.data.order_discount}
                                                </Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )}

                                        <View style={[style.detailsView, { borderBottomWidth: 0 }]}>
                                            <Text
                                                style={styles.h4}>
                                                Grand Total
                                            </Text>
                                            <Text style={styles.h4}>
                                                {' '}
                                                ₹ {this.state.data.total_amount}/-
                                            </Text>
                                        </View>
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
                            style={[styles.buttonStyle, { bottom: Platform.OS == "ios" ? 30 : 10 }]}>
                            <LinearGradient
                                colors={['#5BC2C1', '#296E84']}
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
                                    <Icon name='qr-code-outline' type="ionicon" color={'#5BC2C1'} size={30} />
                                </Text>
                                <Text style={[styles.h4, { marginLeft: 20, marginTop: 4 }]}>View Table QR</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </RBSheet>

                {/* modal for generate bill */}
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

                                <Text style={[styles.h4, { marginTop: 5 }]}>Total Bill Amount-  ₹ {parseFloat(this.state.bill.total_amount).toFixed(2)}</Text>
                                <View style={{ backgroundColor: "#FFECB6", padding: 5, width: "100%", marginTop: 20, borderRadius: 5 }}>
                                    <Text style={[style.text1, { color: "#696969", fontSize: RFValue(10, 580), alignSelf: "center" }]}>Choose Selected Payment Method </Text>
                                </View>
                                <View style={{ padding: 20 }}>
                                    <RadioForm
                                        radio_props={radio_props}
                                        initial={0}
                                        buttonSize={10}
                                        buttonColor={'#5BC2C1'}
                                        selectedButtonColor={'#5BC2C1'}
                                        onPress={(value) => {
                                            // alert(value)
                                            {
                                                value == "split" ?
                                                    this.setState({ splitModalVisible: true, modalVisible: false, payment: value })
                                                    :
                                                    this.setState({ payment: value })
                                            }
                                        }}
                                        labelStyle={{ fontSize: RFValue(13, 580), margin: 10, marginTop: 0, marginBottom: 0 }}
                                    />
                                </View>

                                {
                                    this.state.isButtonLoading ?
                                        <View style={style.loader}>
                                            <ActivityIndicator size={"large"} color="#5BC2C1" />
                                        </View>
                                        :
                                        <TouchableOpacity
                                            onPress={() => this.mark_complete()}>
                                            <LinearGradient
                                                colors={['#5BC2C1', '#296E84']}
                                                style={[{ borderRadius: 10, alignSelf: 'center', backgroundColor: 'red', padding: 5, borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginTop: 20 }]}>
                                                <Text style={[styles.textSignIn, {
                                                    color: '#fff', fontSize: RFValue(11, 580)
                                                }]}>Complete Order & Generate Bill</Text>

                                            </LinearGradient>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </Modal>
                </View>
                
                {/* modal for print bill */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.printBillModal}
                    onBackdropPress={() => {
                        this.setState({ printBillModal: false })
                    }}
                >
                    <View style={[style.centeredView, {
                        width: Dimensions.get('window').width / 1.1
                    }]}>
                        <View style={[style.modalView, { width: Dimensions.get('window').width / 1.1, }]}>
                            <Text style={styles.h4}>
                                Want to print the receipt?
                            </Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, width: Dimensions.get('window').width / 1.1 }}>
                                <TouchableOpacity style={{ backgroundColor: "#F83030", width: 100, padding: 10, borderRadius: 5, alignItems: "center" }}
                                    onPress={() => this.billPrint()}>
                                    <Text style={[styles.h4, { color: "#fff" }]}>No</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: "#437E14", width: 100, padding: 10, borderRadius: 5, alignItems: "center" }}
                                    onPress={() => this.printRemotePDF()}>
                                    <Text style={[styles.h4, { color: "#fff" }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                {/* modal for split payment */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.splitModalVisible}
                    onBackdropPress={() => {
                        this.setState({ splitModalVisible: false })
                    }}
                >
                    <View style={[style.centeredView, {
                        width: Dimensions.get('window').width / 1.1
                    }]}>
                        <View style={[style.modalView, { width: Dimensions.get('window').width / 1.1 }]}>
                            <Text style={[styles.h4, { alignSelf: 'center' }]}>Split Bill Amount</Text>

                            <Text style={[styles.h4, { marginTop: 5 }]}>Total Bill Amount-  ₹ {parseFloat(this.state.bill.total_amount).toFixed(2)}</Text>

                            {this.state.split_payment.map((value, index) => {
                                var tt = value.amount;
                                return (
                                    <View>
                                        <Text style={[styles.h4, { marginTop: 5 }]}>{value.method}</Text>
                                        <Input
                                            onChangeText={e => {
                                                this.add_split_amount(e, index)
                                            }}
                                            returnKeyType="done"
                                            inputContainerStyle={{
                                                // width: Dimensions.get('window').width / 1.05,
                                                borderColor: 'transparent',
                                            }}
                                            keyboardType="number-pad"
                                            style={{
                                                fontFamily: 'Poppins-Medium',
                                                top: Platform.OS == 'ios' ? 0 : 5,
                                                fontSize: RFValue(14, 580),
                                                // paddingLeft: 100,
                                                color: "#000"
                                            }}
                                            containerStyle={style.inputText}
                                        />
                                    </View>
                                )
                            })}

                            <Text style={[styles.h4, { marginTop: 10, alignSelf: "flex-start", paddingLeft: 20 }]}>Split Total - {this.state.split_total}</Text>

                            {
                                ((this.state.split_total) == (parseFloat(this.state.bill.total_amount))) && (
                                    <>
                                        {
                                            this.state.isButtonLoading ?
                                                <View style={style.loader}>
                                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ splitModalVisible: false }, this.mark_complete())
                                                    }}>
                                                    <LinearGradient
                                                        colors={['#5BC2C1', '#296E84']}
                                                        style={[{ borderRadius: 10, alignSelf: 'center', backgroundColor: 'red', padding: 10, borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginTop: 20 }]}>
                                                        <Text style={[styles.textSignIn, {
                                                            color: '#fff', fontSize: RFValue(12, 580)
                                                        }]}>Complete Order & Generate Bill</Text>

                                                    </LinearGradient>
                                                </TouchableOpacity>
                                        }
                                    </>
                                )
                            }
                        </View>
                    </View>
                </Modal>

                {/* modal for table swap */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.tableSwapModal}
                    onBackdropPress={() => {
                        this.setState({ tableSwapModal: false })
                    }}
                >
                    <View style={[style.centeredView, {
                        width: Dimensions.get('window').width / 1.1
                    }]}>
                        <View style={[style.modalView, { width: Dimensions.get('window').width / 1.1, padding: 5 }]}>
                            {!this.state.isTableLoading ?
                                (this.state.tables.length > 0) ?

                                    <FlatList
                                        data={this.state.tables}
                                        renderItem={this.productCard}
                                        keyExtractor={item => item.id}
                                        style={{ marginBottom: 10 }}
                                        showsVerticalScrollIndicator={false}
                                    />

                                    :
                                    <View style={{ paddingVertical: 50, alignItems: "center", }}>
                                        <View style={{ alignSelf: "center" }}>
                                            <Image source={require("../img/no-table.webp")}
                                                style={{ width: 240, height: 150 }} />
                                            <Text style={[styles.h3, { top: 20, alignSelf: "center" }]}>
                                                No Record Found!
                                            </Text>
                                        </View>
                                    </View>


                                :
                                <View style={style.loader}>
                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                </View>
                            }
                        </View>
                    </View>
                </Modal>

                {/* modal for update quantity */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.updateOrderModal}
                    onBackdropPress={() => {
                        this.setState({ updateOrderModal: false })
                    }}
                >
                    <View style={[style.centeredView, {
                        width: Dimensions.get('window').width / 1.1
                    }]}>
                        <View style={[style.modalView, { width: Dimensions.get('window').width / 1.1, }]}>
                            <Text style={styles.h4}>
                                Edit Quantity of {this.state.product_name}
                            </Text>
                            <Counter
                                start={this.state.edit_quantity}
                                max={100}
                                min={1}
                                onChange={this.onChange.bind(this)}
                                minusIcon={this.renderMinusIcon}
                                plusIcon={this.renderPlusIcon}
                                countTextStyle={{
                                    color: '#000',
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: RFValue(15, 580),
                                    marginTop: 12
                                }}
                                buttonStyle={{ borderColor: '#fff', marginTop: 15 }}

                            />



                            {
                                this.state.update_product_quantity_buttonLoading ?
                                    <View style={[style.loader, { marginRight: 20 }]}>
                                        <ActivityIndicator size={"large"} color="#5BC2C1" />
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.update_product_quantity(this.state.edit_quantity)
                                            }}>
                                            <LinearGradient
                                                colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                                                style={[{ borderRadius: 10, alignSelf: 'flex-end', backgroundColor: 'red', padding: 10, marginRight: 10, borderRadius: 5, paddingHorizontal: 10, marginTop: 20 }]}>
                                                <Text style={[styles.textSignIn, {
                                                    color: '#fff', fontSize: RFValue(12, 580)
                                                }]}>Update Qunatity</Text>

                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.update_product_quantity(0)
                                            }}>
                                            <LinearGradient
                                                colors={['#DC3545', '#DC3545']}
                                                style={[{ borderRadius: 10, alignSelf: 'flex-end', backgroundColor: 'red', padding: 10, marginRight: 10, borderRadius: 5, paddingHorizontal: 10, marginTop: 20 }]}>
                                                <Text style={[styles.textSignIn, {
                                                    color: '#fff', fontSize: RFValue(12, 580)
                                                }]}>Remove Product</Text>

                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                            }

                        </View>
                    </View>
                </Modal>


                {/* add customer */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.addCustomerModal}
                    // visible={true}
                    onRequestClose={() => {
                        this.setState({ addCustomerModal: false });
                    }}
                    onBackdropPress={() => {
                        this.setState({ addCustomerModal: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <Text style={styles.h4}>Add Customer</Text>
                                <TouchableOpacity onPress={() => this.setState({ addCustomerModal: false })}>
                                    <Icon name="close-circle-outline" size={25} color="#000" type='ionicon' />
                                </TouchableOpacity>
                            </View>
                            <Input
                                value={this.state.contact}
                                onChangeText={(e) => {
                                    this.setState({ contact: e });
                                    if (e.length === 10) {
                                        this.verifyCustomer(e)
                                    }
                                }}
                                inputContainerStyle={{
                                    width: Dimensions.get('window').width / 1.2,
                                    borderColor: 'transparent',
                                    paddingLeft: 10
                                }}
                                placeholder="Enter Customer's Number"
                                keyboardType='numeric'
                                maxLength={10}
                                autoFocus={true}
                                style={{
                                    fontFamily: 'Poppins-Medium',
                                    fontSize: RFValue(12.5, 580),
                                }}
                                containerStyle={[styles.inputText, {
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    width: Dimensions.get('window').width / 1.2,
                                }]}
                            />
                        </View>
                    </View>
                </Modal>

                {/* add customer name */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleName}
                    onBackdropPress={() => {
                        this.setState({ modalVisibleName: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.h4}>Add Customer's Name</Text>
                            <Text style={styles.h4}>Contact No. : {this.state.contact}</Text>
                            <Input
                                value={this.state.name}
                                onChangeText={(e) => { this.setState({ name: e }) }}
                                inputContainerStyle={{
                                    width: Dimensions.get('window').width / 1.3,
                                    borderColor: 'transparent',
                                    paddingLeft: 10
                                }}
                                placeholder="Enter Customer's Name"
                                maxLength={10}
                                style={{
                                    fontFamily: 'Poppins-Medium',
                                    fontSize: RFValue(12.5, 580),
                                }}
                                containerStyle={[styles.inputText, {
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    width: Dimensions.get('window').width / 1.3,
                                }]}
                            />


                            <TouchableOpacity
                                onPress={() => this.updateCustomer()}
                                style={[style.buttonStyles,]}>
                                <LinearGradient
                                    colors={['#5BC2C1', '#296E84']}
                                    style={[styles.signIn]}>
                                    <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                        Update
                                    </Text>

                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

            </View >
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
export default OrdersDetailsPos;


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
    detailsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        width: Dimensions.get('window').width / 1.05
    }
    ,
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
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
    inputText: {
        marginTop: 15,
        width: Dimensions.get('window').width / 1.3,
        height: 50,
        alignSelf: 'center',
        borderRadius: 5,
        color: "#000",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 15
    },
    tableBox: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width / 1.3,
        marginBottom: 2,
        alignSelf: 'center',
        borderRadius: 5,
        flexDirection: "row",
        shadowColor: 'grey',
        shadowOpacity: 1.5,
        elevation: 2,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 1 },
    }

})