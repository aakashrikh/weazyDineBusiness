import React, { Component } from 'react'
import {
    View, Text, StyleSheet, ScrollView, FlatList, TextInput,
    Platform, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator
} from 'react-native';
import { Header, Icon, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from "react-native-responsive-fontsize";
import RBSheet from 'react-native-raw-bottom-sheet';
import { Modal } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import Toast from 'react-native-simple-toast';
import { AuthContext } from '../AuthContextProvider.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import RNPrint from 'react-native-print';



//Global Style Import
const styles = require('../Components/Style.js');

var radio_props = [
    { label: 'Google Pay/Paytm/UPI', value: 'UPI' },
    { label: 'Credit/Debit Card', value: 'Card' },
    { label: 'Cash', value: 'Cash' },
    { label: "Split Payment", value: 'split' }
];



class CartPos extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalVisibleName: false,
            contact: "",
            cart: [],
            // cart: this.props.route.params.cart,
            grandTotal: 0,
            subTotal: "",
            taxes: "",
            payment_step: 0,
            contact: '',
            user_id: '',
            name: "",
            splitModalVisible: false,
            split_payment: [
                { amount: 0, method: 'Cash' },
                { amount: 0, method: 'Card' },
                { amount: 0, method: 'UPI' },
            ],
            split_total: 0,
            generateModalVisible: false,
            table_uu_id: this.props.route.params.table_uu_id,
            check_product_cart: [],
            order_method_type: this.props.route.params.order_method_type,
            status: true,
            status1: true,
            is_buttonloding: false,
            notes: "",
            islanding: false,
            isloading: false,
            order_code: ""

        }
        console.warn("check_product_cart", this.props.route.params.table_uu_id);
    }

    componentDidMount() {
        AsyncStorage.getItem('cart_and_final').then((value) => {
            this.setState({
                cart: JSON.parse(value).cart, check_product_cart: JSON.parse(value).check_product_cart,
                grandTotal: JSON.parse(value).final_price, subTotal: JSON.parse(value).subTotal,
                taxes: JSON.parse(value).taxes
            })
        })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('cart_and_final').then((value) => {
                this.setState({
                    cart: JSON.parse(value).cart, check_product_cart: JSON.parse(value).check_product_cart,
                    grandTotal: JSON.parse(value).final_price, subTotal: JSON.parse(value).subTotal,
                    taxes: JSON.parse(value).taxes
                })
            })
        });

        if (this.props.route.params.table_uu_id != undefined) {
            this.fetch_table_order();
        }
    }

    fetch_table_order = () => {
        this.setState({ isloading: true })
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
                    this.setState({
                        name: [],
                        user_id: [],
                        status: true,
                        contact: []
                    })

                }
                else {
                    if (json.data.length > 0) {

                        this.setState({
                            status: false,
                            name: json.data[0].user.name,
                            user_id: json.data[0].user.id,
                            contact: json.data[0].user.contact,
                        });
                    }
                    else {
                        this.props.navigation.navigate("Home")
                    }


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
                <Text style={style.text}>Cart</Text>
            </View>

        )
    }

    //for header right component
    renderRightComponent() {
        return (
            <View style={{ top: 5 }}>
                {
                    this.state.cart.length > 0 ?
                        <TouchableOpacity style={[style.addCart, { marginTop: 0, width: 70, marginRight: 0 }]} onPress={() => this.clear_cart()}>
                            <Text style={[style.addCartText, { fontSize: RFValue(9, 580) }]}>
                                Clear Cart
                            </Text>
                        </TouchableOpacity>
                        : null
                }

            </View>
        )
    }

    clear_cart = () => {

        Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear cart?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => this.clear_cart_main(),
                },
            ],
            { cancelable: false },
        );
    };

    clear_cart_main = () => {
        this.setState({ cart: [], check_product_cart: [] });

        var data = {
            "cart": [],
            "final_price": 0,
            "taxes": 0,
            "subTotal": 0,
            "check_product_cart": []
        }

        AsyncStorage.setItem('cart_and_final', JSON.stringify(data));


    }

    update_cart = (index, quantity, type) => {
        var final_price = this.state.subTotal;
        var tax = this.state.taxes;
        var ff_cart = this.state.cart;


        var obj = this.state.check_product_cart;

        if (obj[ff_cart[index]] != undefined) {
            if (type == "add") {
                obj[ff_cart[index].product_id] = obj[ff_cart[index].product_id] + 1;
            }
            else {
                obj[ff_cart[index].product_id] = obj[ff_cart[index].product_id] - 1;
            }
        }
        else {
            obj[ff_cart[index].product_id] = obj[ff_cart[index].product_id] - 1;
        }


        var price = (ff_cart[index].price / ff_cart[index].quantity).toFixed(2);
        final_price = final_price - ff_cart[index].price + price * quantity;

        var product_price = ff_cart[index].price / ff_cart[index].quantity;
        var product_tax = parseFloat(product_price * (ff_cart[index].product.tax / 100)).toFixed(2);

        tax =
            parseFloat(tax) -
            parseFloat(product_tax) +
            (parseFloat(price) * parseFloat(quantity)) * (ff_cart[index].product.tax / 100);


        if (quantity == 0) {


            ff_cart.splice(index, 1);
        }
        else {

            ff_cart[index].tax = (parseFloat(price) * parseFloat(quantity)) * (ff_cart[index].product.tax / 100);
            ff_cart[index].quantity = quantity;
            ff_cart[index].price = (price * quantity).toFixed(2);

        }

        this.setState({
            subTotal: final_price.toFixed(2),
            taxes: tax.toFixed(2),
            grandTotal: Math.round(final_price + tax),
        });

        var data = {
            "cart": ff_cart,
            "final_price": Math.round(final_price + tax),
            "taxes": tax.toFixed(2),
            "subTotal": final_price.toFixed(2),
            "check_product_cart": obj
        }

        AsyncStorage.setItem('cart_and_final', JSON.stringify(data));

    };

    productCard = ({ item, index }) => (
        <View style={style.card} >
            <View style={{ flexDirection: "row", width: "100%" }}>
                {/* View for Image */}
                <View style={{ width: "18%" }}>
                    {item.product.is_veg == 1 ?
                        <Image source={require('../img/veg.png')} style={{ width: 15, height: 15, position:"absolute",zIndex:1, top:10, left:10}} />
                        :
                        <Image source={require('../img/non_veg.png')} style={{ width: 15, height: 15, position:"absolute",zIndex:1, top:10, left:10 }} />
                    }
                    {
                        item.product.product_img == "" ?
                            <Image source={require('../img/logo/mp.png')} style={{ width: 55, height: 55, marginTop: 10, }} />
                            :

                            <Image source={{ uri: item.product.product_img }} style={{ width: 50, height: 50, marginTop: 10, marginLeft:10 }} />

                    }

                </View>
                {/* View for Content */}

                <View style={style.contentView}>
                    {/* View for name and heart */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {/* Text View */}
                        <View style={{ width: 170, }}>
                            <Text style={[styles.smallHeading, { top: 10, }]}>
                                {/* {item.product.product_name} - {item.variant_id} {
                                    
                                } */}
                                {item.product.product_name}
                                {item.product.variants.length > 0 ?
                                    <>
                                        {item.product.variants.map((val, index) => {
                                            if (val.id == item.variant_id) {
                                                return (
                                                    <Text style={styles.smallHeading}> - ({val.variants_name})</Text>
                                                )
                                            }
                                        }
                                        )}
                                    </> : null
                                }
                            </Text>

                            {
                                item.product.addon_map.length > 0 ?
                                    <Text style={{ marginTop: 10 }}>
                                        {
                                            item.product.addon_map.map((value, index) => {
                                                if (item.cart_addon.includes(value.id)) {
                                                    return (
                                                        <Text style={[styles.smallHeading, { color: "#296E84", }]}>{value.addon_name}, </Text>
                                                    )
                                                }
                                            })
                                        }
                                    </Text>
                                    :
                                    <></>
                            }

                            <Text style={[styles.p, { marginTop: 5, fontFamily: "Poppins-SemiBold" }]}>
                                {(item.price / item.quantity).toFixed(2)} X {item.quantity} = {item.price}
                            </Text>
                        </View>

                    </View>


                    <View style={{ flexDirection: 'row', marginTop: 0, width: "40%", justifyContent: "space-evenly", alignSelf: "flex-end", marginRight: 20 }}>
                        <TouchableOpacity style={style.button}

                            //console.warn the index of the item of check_product_cart
                            onPress={() => {
                                this.update_cart(index, item.quantity - 1, 'remove')
                            }}
                        >
                            <Icon name="remove" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84" />
                        </TouchableOpacity>
                        <View style={style.button}>
                            <Text style={[style.h4, { alignSelf: "center", color: "#296E84" }]}>

                                {item.quantity}
                            </Text>
                        </View>

                        <TouchableOpacity style={style.button}
                            onPress={() => { this.update_cart(index, item.quantity + 1, 'add') }}>
                            <Icon name="add" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84" />
                        </TouchableOpacity>
                    </View>


                </View>

            </View>
        </View>
    );

    next_step = () => {
        if (
            this.state.contact != null &&
            this.state.contact != '' &&
            this.state.order_method == 'DineIn'
        ) {
            this.setState({ payment_step: 2 });
        } else {
            this.setState({ user_id: '', contact: '', name: '' });
        }

        // this.setState({ modalVisible: true });
        this.setState({ status: true })
    };

    guest = () => {
        this.setState({ user_id: '1', contact: '0000000000', name: 'Guest' });
        this.setState({ payment_step: 2 });
        this.setState({ modalVisible: false, status: false });
        {
            this.state.table_uu_id == null || this.state.table_uu_id == '' || this.state.table_uu_id == undefined ?
                this.setState({ status1: false }) : this.setState({ status1: true })
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
                            this.setState({ payment_step: 1, modalVisibleName: true, modalVisible: false, });
                        } else {
                            this.setState({ name: json.data.name, modalVisible: false, status: false }); {
                                this.state.table_uu_id == null || this.state.table_uu_id == '' || this.state.table_uu_id == undefined ?
                                    this.setState({ status1: false }) : this.setState({ status1: true })
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
                    {
                        this.state.table_uu_id == null || this.state.table_uu_id == '' || this.state.table_uu_id == undefined ?
                            this.setState({ status1: false }) : this.setState({ status1: true })
                    }
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
        console.warn(global.vendor_api + this.state.order_code + '/bill.pdf')
        await RNPrint.print({ filePath: global.vendor_api + this.state.order_code + '/bill.pdf' })
    }

    place_order = (payment_method) => {
        this.setState({ is_buttonloding: true });
        console.warn(this.state.payment_method);
        // var order_method = this.state.order_method_type;
        // if (
        //     this.state.order_method_type != 0 &&
        //     this.state.order_method_type != 1
        // ) {
        //     var order_method = this.state.table_uu_id;
        // }

        if (this.state.order_method_type == 2) {
            var order_method = this.state.table_uu_id;
        }
        else if (this.state.order_method_type == 0) {
            var order_method = "TakeAway";
        }
        else if (this.state.order_method_type == 1) {
            var order_method = "Delivery";
        }

        console.warn(this.state.cart);
        fetch(global.vendor_api + 'place_pos_order', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                user_id: this.state.user_id,
                cart: this.state.cart,
                method: order_method,
                payment_method: payment_method,
                split_payment: this.state.split_payment,
                instruction: this.state.notes,
                discount: 0,
                discount_type: "fixed"
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    console.warn(json);
                    var msg = json.msg;
                    Toast.show(msg);
                } else {
                    this.setState({order_code: json.data[0].order_code})
                    Toast.show('Order Placed');
                    this.clear_cart_main();

                   
                    this.setState({ payment_step: 0, name: "", contact: "", splitModalVisible: false, modalVisibleName: false, modalVisible: false, generateModalVisible: false });
                    {
                        this.state.order_method_type == 2 ?

                            this.props.navigation.navigate('TabNav', { screen: 'Dine-In' })
                            :
                            this.printRemotePDF();
                            this.props.navigation.navigate('OrderDetailsUpdatesPos', { id: json.data[0].order_code });
                    }
                }
                this.setState({ is_buttonloding: false });
                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setState({ is_buttonloding: false });
            });
    };

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

    render() {
        return (
            <View style={styles.container}>

                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    leftComponent={this.renderLeftComponent()}
                    rightComponent={this.renderRightComponent()}
                    centerComponent={this.renderCenterComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['white', 'white'],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 }

                    }}
                    backgroundColor="#ffffff"
                />

                <ScrollView>
                    {
                        this.state.cart.length > 0 ?
                            <View>
                                <View style={{ marginTop: 10, marginBottom: Platform.OS == "ios" ? 20 : 10 }}>
                                    <FlatList
                                        navigation={this.props.navigation}
                                        showsVerticalScrollIndicator={false}
                                        data={this.state.cart}
                                        renderItem={this.productCard}
                                        keyExtractor={item => item.id}
                                    />
                                </View>


                                <View style={[style.card, { paddingHorizontal: 10 }]}>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#5BC2C1", fontSize: RFValue(12, 580) }}>
                                            Item Total
                                        </Text>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: RFValue(12, 580) }}>
                                            ₹ {this.state.subTotal}
                                        </Text>
                                    </View>

                                    {
                                        this.state.taxes == 0 ?
                                            null
                                            :
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                                <Text style={{ color: "green", fontFamily: "Poppins-SemiBold", fontSize: RFValue(10, 580) }}>
                                                    Taxes and Charges
                                                </Text>
                                                <Text style={{ color: "green", fontFamily: "Roboto-Regular", fontFamily: "Poppins-SemiBold", fontSize: RFValue(10, 580) }}>
                                                    + ₹ {this.state.taxes}
                                                </Text>
                                            </View>
                                    }


                                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                            <Text style={{ color: "red", fontFamily: "Poppins-SemiBold", fontSize: RFValue(10, 580) }}>
                                Discount
                            </Text>
                            <Text style={{ color: "red", fontFamily: "Poppins-SemiBold", fontSize: RFValue(10, 580) }}>
                                - ₹  200
                            </Text>
                        </View> */}

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, }} >
                                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#5BC2C1", fontSize: RFValue(12, 580) }}>
                                            Grand Total
                                        </Text>
                                        <Text style={{ fontFamily: "Poppins-SemiBold", color: "#5BC2C1", fontSize: RFValue(12, 580) }}>
                                            ₹ {this.state.grandTotal}
                                        </Text>
                                    </View>

                                </View>

                                {/* <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Comment</Text>
                                <View style={[style.card, { paddingHorizontal: 10 }]}>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(10, 580) }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl sit amet
                                    </Text>
                                </View>

                                <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Customer Name</Text>
                                <View style={[style.card, { paddingHorizontal: 10, borderRadius: 10 }]}>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(10, 580) }}>
                                        Sunaina Singh
                                    </Text>
                                </View>

                                <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Payment Method</Text>
                                <View style={[style.card, { paddingHorizontal: 10, borderRadius: 10 }]}>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(10, 580) }}>
                                        Cash
                                    </Text>
                                </View> */}

                                <View>
                                    <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Add Instructions +</Text>
                                    <TextInput
                                        style={style.addNote}
                                        multiline={true}
                                        placeholderTextColor="#5d5d5d"
                                        value={this.state.notes}
                                        onChangeText={(text) => { this.setState({ notes: text }) }}
                                        placeholder='Add Notes' />
                                </View>

                                {
                                    this.state.isloading ?
                                        <SkeletonPlaceholder>
                                            <View style={{ height: 45, borderRadius: 10, width: 390, alignSelf: "center", marginTop: 10 }} />
                                            <View style={{ height: 45, borderRadius: 10, width: 390, alignSelf: "center", marginTop: 10 }} />
                                        </SkeletonPlaceholder>
                                        :
                                        <>
                                            {
                                                this.state.status ?
                                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 50 }}>
                                                        <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}
                                                            onPress={() => this.setState({ modalVisible: true })}>Add Customer +</Text>
                                                        <Text style={[styles.h4, { paddingRight: 15, marginTop: 10 }]}
                                                            onPress={() => this.guest()}>Skip</Text>
                                                    </View>
                                                    :
                                                    <View>
                                                        <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Customer's Name</Text>
                                                        <View style={[style.card, { paddingHorizontal: 10, borderRadius: 10 }]}>
                                                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(12, 580) }}>
                                                                {this.state.name}
                                                            </Text>
                                                        </View>

                                                        <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Customer's Contact No.</Text>
                                                        <View style={[style.card, { paddingHorizontal: 10, borderRadius: 10 }]}>
                                                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(12, 580) }}>
                                                                {this.state.contact}
                                                            </Text>
                                                        </View>

                                                    </View>
                                            }
                                        </>

                                }
                                {/* {
                                    this.state.status1 ?
                                        <></>
                                        :
                                        <View>
                                            <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Customer Name</Text>
                                            <View style={[style.card, { paddingHorizontal: 10, borderRadius: 10 }]}>
                                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: RFValue(12, 580) }}>
                                                    {this.state.name}
                                                </Text>
                                            </View>

                                        </View>

                                } */}

                                {
                                    this.state.status1 ?
                                        <></>
                                        :
                                        <View>
                                            <Text style={[styles.h4, { paddingLeft: 15, marginTop: 10 }]}>Choose Payment Method</Text>
                                            <View style={{ width: Dimensions.get('window').width / 1.05, justifyContent: "space-evenly", marginTop: 10, flexDirection: "row", alignSelf: "center" }}>
                                                <TouchableOpacity style={style.payButtons} onPress={() => {
                                                    this.place_order("Cash")
                                                }}>
                                                    <Icon name="cash-outline" size={30} color="#296E84" type="ionicon" />
                                                    <Text style={styles.h4}>Cash</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={style.payButtons} onPress={() => {
                                                    this.place_order("Card")
                                                }}>
                                                    <Icon name="card-outline" size={30} color="#296E84" type="ionicon" />
                                                    <Text style={styles.h4}>Card</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={style.payButtons} onPress={() => {
                                                    this.place_order("UPI")
                                                }}>
                                                    <Icon name="qr-code-outline" size={30} color="#296E84" type="ionicon" />
                                                    <Text style={styles.h4}>Scan</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={style.payButtons} onPress={() => {
                                                    this.setState({ splitModalVisible: true });
                                                }}>
                                                    <Icon name="git-merge-outline" size={30} color="#296E84" type="ionicon" />
                                                    <Text style={styles.h4}>Split</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                }

                                {

                                    !this.state.status ?
                                        <>
                                            {
                                                this.state.table_uu_id == "" || this.state.table_uu_id == undefined || this.state.table_uu_id == null ?
                                                    // <View>
                                                    //     <TouchableOpacity
                                                    //         // onPress={() => { this.next_step() }}
                                                    //         onPress={() => { this.place_order() }}
                                                    //         style={style.buttonStyles}>
                                                    //         <LinearGradient
                                                    //             colors={['#5BC2C1', '#296E84']}
                                                    //             style={styles.signIn}>

                                                    //             <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                                    //                 Place Order</Text>

                                                    //         </LinearGradient>
                                                    //     </TouchableOpacity>
                                                    // </View>
                                                    <></>
                                                    :
                                                    <>
                                                        {
                                                            this.state.is_buttonloding ?
                                                                <View style={[style.loader, { marginRight: 20 }]}>
                                                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                                                </View>
                                                                : <View>
                                                                    <TouchableOpacity
                                                                        // onPress={() => { this.next_step() }}
                                                                        onPress={() => { this.setState({ payment_method: "offline-cash" }); this.place_order("offline-cash") }}
                                                                        style={style.buttonStyles}>
                                                                        <LinearGradient
                                                                            colors={['#5BC2C1', '#296E84']}
                                                                            style={styles.signIn}>

                                                                            <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                                                                Confirm Order</Text>

                                                                        </LinearGradient>
                                                                    </TouchableOpacity>
                                                                </View>
                                                        }

                                                    </>

                                            }
                                        </>
                                        :
                                        <></>
                                }


                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                                <Image source={require('../img/no-product.webp')} style={{ width: 300, height: 250, marginTop: 100 }} />
                                <Text style={styles.h3}>
                                    Your Cart is Empty
                                </Text>


                                <TouchableOpacity style={[styles.buttonStyles, { alignItems: "center", marginTop: 50 }]}
                                    onPress={() => { this.props.navigation.navigate("Dine-In") }}
                                >
                                    <LinearGradient
                                        colors={['#5BC2C1', '#296E84']}
                                        style={[styles.signIn, { width: Dimensions.get('window').width / 1.8 }]}
                                    >
                                        <Text style={[styles.h4, { color: "#fff" }]}>Add Products</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                    }

                </ScrollView>

                {/* add customer */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    // visible={true}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}
                    onBackdropPress={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <Text style={styles.h4}>Add Customer</Text>
                                <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
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

                            {/* <View style={{ flexDirection: "row", marginTop: -20, paddingLeft: 40, width: "100%", alignItems: "center", justifyContent: "space-evenly" }}>
                                <TouchableOpacity
                                    onPress={() => this.guest()}
                                    style={[style.buttonStyles, { width: "50%" }]}>
                                    <LinearGradient
                                        colors={['#5BC2C1', '#296E84']}
                                        style={[styles.signIn, { width: "80%" }]}>
                                        <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                            Skip
                                        </Text>

                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.verifyCustomer()}
                                    style={[style.buttonStyles, { width: "50%" }]}>
                                    <LinearGradient
                                        colors={['#5BC2C1', '#296E84']}
                                        style={[styles.signIn, { width: "80%" }]}>
                                        <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                            Verify
                                        </Text>

                                    </LinearGradient>
                                </TouchableOpacity>

                            </View> */}
                        </View>
                    </View>
                </Modal>

                {/* add customer name */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleName}
                    // visible={true}
                    onBackdropPress={() => {
                        this.setState({ modalVisibleName: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <TouchableOpacity style={{ alignSelf: "flex-end" }}
                                onPress={() => this.setState({ modalVisibleName: false, modalVisible: true })}>
                                <Icon name="close-circle-outline" size={25} color="#000" type='ionicon' />
                            </TouchableOpacity>
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
                        width: Dimensions.get('window').width / 1.1,
                        alignSelf: 'center',
                    }]}>
                        <View style={[style.modalView, { width: Dimensions.get('window').width / 1.1 }]}>
                            <Text style={[styles.h4, { alignSelf: 'center' }]}>Split Bill Amount</Text>

                            <Text style={[styles.h4, { marginTop: 5 }]}>Total Bill Amount-  ₹ {parseFloat(this.state.grandTotal).toFixed(2)}</Text>

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
                                ((this.state.split_total) == (parseFloat(this.state.grandTotal))) && (
                                    <>
                                        {
                                            this.state.isButtonLoading ?
                                                <View style={style.loader}>
                                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ splitModalVisible: false }, this.setState({ payment_method: "offline-cash" }), this.place_order("offline-cash"))
                                                    }}>
                                                    <LinearGradient
                                                        colors={['#5BC2C1', '#296E84']}
                                                        style={[{ borderRadius: 10, alignSelf: 'center', backgroundColor: 'red', padding: 10, borderRadius: 5, paddingLeft: 10, paddingRight: 10, marginTop: 20 }]}>
                                                        <Text style={[styles.textSignIn, {
                                                            color: '#fff', fontSize: RFValue(12, 580)
                                                        }]}>Complete Order</Text>

                                                    </LinearGradient>
                                                </TouchableOpacity>
                                        }
                                    </>
                                )
                            }
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}

export default CartPos;

const style = StyleSheet.create({
    text: {
        fontFamily: "Poppins-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5,
        color: "black"
    },
    card: {
        backgroundColor: "#fff",
        alignSelf: "center",
        width: Dimensions.get("window").width / 1.05,
        top: 7,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 15,
        padding: 6
    },
    logo: {
        height: 50,
        width: 50,
        // borderWidth:0.2,
        borderRadius: 5,
        borderColor: "black",
        margin: 10,
        marginTop: -10,
        marginLeft: 10,
        zIndex: -10
    },
    contentView: {
        flexDirection: "column",
        width: "82%",
        marginRight: 10,
        // paddingBottom:10, 
        // borderBottomWidth:0.5,
        // borderColor:"#d3d3d3",
        marginLeft: 10,
        //  marginTop:10,

    },
    button: {
        borderColor: "#5BC2C1",
        borderWidth: 1,
        borderRadius: 5,
        width: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 25,
    },
    buttonStyles: {
        width: "60%",
        alignSelf: "center",
        marginTop: 40,
        marginRight: 5,
        marginBottom: 20,
    },
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
    }, inputText: {
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
    addCart: {
        backgroundColor: "#5BC2C1",
        borderRadius: 5,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        height: 35,
        alignSelf: "flex-end",
        marginRight: 30,
        marginTop: -30

    },
    addCartText: {
        color: "#fff",
        fontSize: RFValue(10, 580),
        fontFamily: "Poppins-SemiBold"
    },
    payButtons: {
        width: "22%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 5,
        borderColor: "#296E84",
        borderWidth: 1,
        margin: 5,
        padding: 10,
        height: 100
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
    addNote: {
        borderRadius: 5,
        width: Dimensions.get('window').width / 1.06,
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: "#fff",
        shadowOffset: { height: 5, width: 5 },
        elevation: 5,
        shadowColor: "grey",
        paddingLeft: 10,
        color:"#5d5d5d"
    }
})