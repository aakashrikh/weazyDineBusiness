import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Switch, Dimensions,
    FlatList, TouchableOpacity, Image, ScrollView, Platform, Alert
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Icon, Header, SearchBar, CheckBox } from 'react-native-elements';
import { AuthContext } from '../AuthContextProvider.js';
import LinearGradient from 'react-native-linear-gradient';
import RadioForm from "react-native-simple-radio-button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import RadioButtonRN from 'radio-buttons-react-native';


//Global Style Import
const styles = require('../Components/Style.js');

var radio_props = [
    { label: 'param1 + hhh', value: 0 },
    { label: 'param2', value: 1 }
];


class ProductListPos extends Component {

    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params.products,
            quantity: 0,
            page: 1,
            nosearch: '',
            search: '',
            single_product: [],
            variantType: "",
            checked: false,
            addon: [],
            cart: [],
            category: [],
            products: [],
            active_cat: 0,
            isloading: true,
            load_item: true,
            grandTotal: 0,
            subTotal: 0,
            taxes: 0,
            isModalOpen: false,
            is_buttonloding: false,
            contact: '',
            user_id: '',
            name: '',
            payment_step: 0,
            order_method: 'TakeAway',
            show_table: false,
            table_no: 0,
            type: 'product',
            split: false,
            split_payment: [
                { amount: 0, method: 'Cash' },
                { amount: 0, method: 'Card' },
                { amount: 0, method: 'UPI' },
            ],
            split_total: 0,
            product_show: false,
            posOrderComplete: false,
            order_code: '',
            if_table_order: false,
            order: [],
            bill_show: false,
            order_table_no: '',
            kot_id: '',
            offers: [],
            table_uu_id: "",
            order_method_type: '',
            check_product_cart: [],
            variants_id: 0,

        }

        // if(this.props.route.params.product.variants.length >0){
        //     var vv = this.props.route.params.product.variants[0].id;
        // }
        // else{
        //     var vv = 0;
        // }
        // console.warn("prod list",this.props.route.params.order_method_type, this.props.route.params.table_uu_id);
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
                <Text style={styles.text}>Products</Text>
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

    componentDidMount() {

        AsyncStorage.getItem('cart_and_final').then((cart) => {
            if (cart != null) {
                if (JSON.parse(cart).cart.length > 0) {
                    this.setState({ cart: JSON.parse(cart).cart, grandTotal: JSON.parse(cart).final_price, check_product_cart: JSON.parse(cart).check_product_cart, subTotal: JSON.parse(cart).subTotal, taxes: JSON.parse(cart).taxes });
                }
                else {
                    this.setState({ cart: [], grandTotal: 0, subTotal: 0, taxes: 0, check_product_cart: [] });
                }

            }
        }
        )

        if (this.props.route.params.order_method_type == 2) {
            this.setState({ table_uu_id: this.props.route.params.table_uu_id, order_method_type: this.props.route.params.order_method_type })
        }
        else {
            this.setState({ order_method_type: this.props.route.params.order_method_type })
        }


        this.focusListener = this.props.navigation.addListener('focus', () => {
            AsyncStorage.getItem('cart_and_final').then((cart) => {
                if (cart != null) {
                    if (JSON.parse(cart).cart.length > 0) {
                        this.setState({ cart: JSON.parse(cart).cart, grandTotal: JSON.parse(cart).final_price, check_product_cart: JSON.parse(cart).check_product_cart, subTotal: JSON.parse(cart).subTotal, taxes: JSON.parse(cart).taxes });
                    }
                    else {
                        this.setState({ cart: [], grandTotal: 0, check_product_cart: [], subTotal: 0, taxes: 0 });
                    }

                }

            }
            )

            if (this.props.route.params.order_method_type == 2) {
                this.setState({ table_uu_id: this.props.route.params.table_uu_id, order_method_type: this.props.route.params.order_method_type })
            }
            else {
                this.setState({ order_method_type: this.props.route.params.order_method_type })
            }
        });

    }

    add_to_cart = (product, vv_id, addons) => {
        let final_price = 0;
        let tax = 0;
        var bb = [];
        addons.map((item, index) => {
            bb.push(item);
        });

        var match = false;
        var key = 0;
        var breaknow = false;

        for (var i = 0; i < this.state.cart.length; i++) {
            var item = this.state.cart[i];
            console.warn("gg", vv_id);
            if (item.product.id == product.id && item.variant_id == vv_id) {
                if (bb.length == 0 && item.cart_addon.length == 0) {
                    key = i;
                    match = true;
                    break;
                } else {
                    if (bb.length == item.cart_addon.length) {
                        for (var j = 0; j < bb.length; j++) {
                            var item1 = bb[j];
                            if (item.cart_addon.includes(item1)) {
                                key = i;
                                match = true;
                            } else {
                                match = false;
                                break;
                            }
                        }
                    }
                }

                if (breaknow) {
                    break;
                }
            }
        }
        var cart = this.state.cart;

        this.state.cart.map((item, index) => {
            final_price = parseFloat(final_price) + parseFloat(item.price);
            tax = parseFloat(tax) + parseFloat(item.tax);
        });

        if (match) {
            var quantity = cart[key].quantity + 1;
            var price = cart[key].price / cart[key].quantity;
            final_price =
                parseFloat(final_price) -
                parseFloat(cart[key].price) +
                parseFloat(price) * parseFloat(quantity);

            var product_price = cart[key].price / cart[key].quantity;
            var product_tax = parseFloat(product_price * (product.tax / 100)).toFixed(2);

            tax =
                parseFloat(tax) -
                parseFloat(product_tax) +
                (parseFloat(price) * parseFloat(quantity)) * (product.tax / 100);


            cart[key].quantity = quantity;

            cart[key].price = (parseFloat(price) * parseFloat(quantity)).toFixed(2);
            cart[key].tax = (parseFloat(price) * parseFloat(quantity)) * (product.tax / 100);

            this.setState({ cart: cart });


            var obj = this.state.check_product_cart;

            if (obj[product.id] == null || obj[product.id] == undefined) {
                obj[product.id] = 1;
            }
            else {
                obj[product.id] = parseInt(obj[product.id]) + 1;
            }

            var data = {
                "cart": cart,
                "final_price": final_price,
                "check_product_cart": obj
            }
        } else {
            let total = parseFloat(product.our_price);
            product.variants.map((item, index) => {
                if (item.id == vv_id) {
                    total = item.variants_discounted_price;
                }
            });

            product.addon_map.map((item, index) => {
                if (addons.includes(item.id)) {
                    total = total + item.addon_price;
                }
            });

            if (this.context.user.gstin != null) {
                if (this.context.user.gst_type == 'inclusive') {
                    total = parseFloat(total / (1 + product.tax / 100));
                }
                tax = parseFloat(tax) + parseFloat(total * (product.tax / 100));
            }

            var cart2 = {
                product_id: product.id,
                product: product,
                variant_id: vv_id,
                cart_addon: bb,
                quantity: 1,
                price: total.toFixed(2),
                tax: parseFloat(total * (product.tax / 100))
            };

            final_price = parseFloat(final_price) + parseFloat(total);
            this.setState({ cart: [...this.state.cart, cart2] });

            var obj = this.state.check_product_cart;

            if (obj[product.id] == null || obj[product.id] == undefined) {
                obj[product.id] = 1;
            }
            else {
                obj[product.id] = parseInt(obj[product.id]) + 1;
            }

            var data = {
                "cart": [...this.state.cart, cart2],
                "final_price": Math.round(final_price + tax),
                "taxes": tax.toFixed(2),
                "subTotal": final_price.toFixed(2),
                "check_product_cart": obj
            }
        }

        AsyncStorage.setItem('cart_and_final', JSON.stringify(data));
        console.warn(JSON.stringify(data));

        this.setState({
            subTotal: final_price.toFixed(2),
            taxes: tax.toFixed(2),
            grandTotal: Math.round(final_price + tax),
        });

        //   this.calculateTotal(final_price);
    };

    calculateTotal = (finalPrice) => {
        if (this.context.user.gstin != null) {
            let gst = parseFloat(finalPrice * 5) / 100;
            let total = parseFloat(finalPrice) + parseFloat(gst);
            this.setState({
                subTotal: finalPrice.toFixed(2),
                taxes: gst.toFixed(2),
                grandTotal: total.toFixed(2),
            });
        } else {
            this.setState({
                subTotal: finalPrice,
                taxes: 0,
                grandTotal: finalPrice,
            });
        }
    };

    update_cart_main = (key_id, quantity) => {

        var final_price = this.state.subTotal;
        var tax = this.state.taxes;
        var obj = this.state.check_product_cart;

        if (obj[key_id] == null || obj[key_id] == undefined) {
            obj[key_id] = quantity;
        }
        else {
            obj[key_id] = quantity;
        }


        var ff_cart = this.state.cart;
        this.state.cart.map((item, index) => {
            if (item.product_id == key_id) {

                if (quantity == 0) {
                    final_price = final_price - ff_cart[index].price;
                    var product_price = ff_cart[index].price / ff_cart[index].quantity;
                    var product_tax = parseFloat(product_price * (ff_cart[index].product.tax / 100)).toFixed(2);
                    tax =
                        parseFloat(tax) -
                        parseFloat(product_tax) +
                        (parseFloat(price) * parseFloat(quantity)) * (ff_cart[index].product.tax / 100);

                    ff_cart.splice(index, 1);
                }
                else {

                    var price = (ff_cart[index].price / ff_cart[index].quantity).toFixed(2);
                    final_price = final_price - ff_cart[index].price + price * quantity;

                    var product_price = ff_cart[index].price / ff_cart[index].quantity;
                    var product_tax = parseFloat(product_price * (ff_cart[index].product.tax / 100)).toFixed(2);

                    tax =
                        parseFloat(tax) -
                        parseFloat(product_tax) +
                        (parseFloat(price) * parseFloat(quantity)) * (ff_cart[index].product.tax / 100);

                    ff_cart[index].tax = (parseFloat(price) * parseFloat(quantity)) * (ff_cart[index].product.tax / 100);
                    ff_cart[index].quantity = quantity;
                    ff_cart[index].price = (price * quantity).toFixed(2);

                }
            }

        });

        this.setState({ cart: ff_cart });


        var data = {
            "cart": ff_cart,
            "final_price": Math.round(final_price + tax),
            "taxes": tax.toFixed(2),
            "subTotal": final_price.toFixed(2),
            "check_product_cart": obj
        }

        this.setState({ check_product_cart: obj });

        AsyncStorage.setItem('cart_and_final', JSON.stringify(data));

        this.setState({
            subTotal: final_price.toFixed(2),
            taxes: tax.toFixed(2),
            grandTotal: Math.round(final_price + tax),
        });

        // this.calculateTotal(final_price);
    }

    update_from_cart = (cart, product_final_cart) => {
        this.setState({ cart: cart, check_product_cart: product_final_cart });
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

    add_cart(product, index) {

        if (product.addon_map.length > 0 || product.variants.length > 0) {
            this[RBSheet + index].open();
        } else {
            // this.RBSheet.open()
            if (product.variants.length > 0) {
                this.setState({ variants_id: product.variants[0].id })
            }
            else {
                this.setState({ variants_id: 0 })
            }
            this.add_to_cart(product, this.state.variants_id, this.state.addon);

        }
    }

    select_addon = (id) => {
        console.log(id);
        if (this.state.addon.includes(id)) {
            var index = this.state.addon.indexOf(id);
            if (index > -1) {
                this.state.addon.splice(index, 1);
            }
        } else {
            this.state.addon.push(id);
        }
        this.setState({ addon: this.state.addon });
    };

    productCard = ({ item, index }) => (
        <View>
            <TouchableOpacity style={style.card}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    {/* View for Image */}
                    <View style={{ width: "18%" }}>
                        {item.is_veg ?
                            <Image source={require('../img/veg.png')} style={{ width: 10, height: 10, position: "absolute", zIndex: 1, top: 10 }} />
                            :
                            <Image source={require('../img/non_veg.png')} style={{ width: 10, height: 10, position: "absolute", zIndex: 1, top: 10 }} />
                        }
                        {
                            item.product_Images == "" ?
                                <Image source={require('../img/logo/mp.png')} style={{ width: 50, height: 50, marginTop: 10 }} />
                                :
                                <Image source={{ uri: item.product_img }} style={{ width: 50, height: 50, marginTop: 10 }} />
                        }
                    </View>
                    {/* View for Content */}

                    <View style={style.contentView}>
                        {/* View for name and heart */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            {/* Text View */}
                            <View style={{ width: "40%", }}>
                                <Text style={[styles.smallHeading, { top: 10, }]}>
                                    {item.product_name}
                                </Text>

                                <Text style={[styles.p, { marginTop: 10, fontFamily: "Poppins-Bold" }]}>
                                    ₹ {item.our_price}/-
                                </Text>
                            </View>
                            {
                                this.state.check_product_cart[item.id] != null && this.state.check_product_cart[item.id] != undefined
                                    && this.state.check_product_cart[item.id] != 0 ?
                                    <View style={{ flexDirection: 'row', marginTop: 0, width: "40%", justifyContent: "space-evenly", alignSelf: "flex-end", marginRight: 30 }}>
                                        <TouchableOpacity style={style.button}
                                            onPress={() => {
                                                this.update_cart_main(item.id, this.state.check_product_cart[item.id] - 1)
                                            }}>
                                            <Icon name="remove" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84" />
                                        </TouchableOpacity>
                                        <View style={style.button}>
                                            <Text style={[style.h4, { alignSelf: "center", color: "#296E84" }]}>
                                                {this.state.check_product_cart[item.id]}
                                            </Text>
                                        </View>

                                        <TouchableOpacity style={style.button}
                                            onPress={() => { this.add_cart(item, index) }}>
                                            <Icon name="add" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity style={style.addCart} onPress={() => this.add_cart(item, index)}>
                                        <Text style={style.addCartText}>Add to Cart</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                        {/* <Text>{this.state.check_product_cart}</Text> */}

                    </View>

                </View>
            </TouchableOpacity>

            <RBSheet
                ref={ref => {
                    this[RBSheet + index] = ref;
                }}
                onOpen={(e) => {
                    console.log(e)
                }}

                closeOnDragDown={true}
                closeOnPressMask={true}
                height={Dimensions.get('window').height - 100}
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
                    <ScrollView>
                        <View>
                            {
                                item.variants.length > 0 ?
                                    <View>
                                        <Text style={[styles.h4, { marginTop: 10, marginLeft: 10, fontFamily: "Poppins-Bold" }]}>
                                            Select Variant
                                        </Text>

                                        {/* <RadioForm
                                            radio_props={item.variants.map(
                                                (item, index) => {
                                                    return { label: (item.variants_name +" "+ "( + Rs." + item.variants_discounted_price +")"), value: item.id }
                                                }
                                            )}
                                            animation={false}
                                            selectedButtonColor="#5BC2C1"
                                            buttonColor="#5BC2C1"
                                            buttonSize={12}
                                            buttonOuterSize={25}
                                            initial={item.variants.map(
                                                (item, index) => {
                                                    if (index == 0) {
                                                        return index;
                                                    }
                                                }
                                            )}
                                            onPress={(value) => { this.setState({ variantType: value}) , console.warn(this.state.variantType) }}
                                            labelStyle={{ fontSize: RFValue(12, 580), marginRight: 10, fontWeight: 'bold' }}
                                            style={{ marginTop: 20, marginLeft: 20 }}
                                        /> */}

                                        <RadioButtonRN
                                            data={item.variants.map(
                                                (item, index) => {
                                                    return { label: (item.variants_name + " " + "( + Rs." + item.variants_discounted_price + ")"), value: item.id }
                                                }
                                            )}
                                            initial={1}
                                            selectedBtn={(e) => { e.value, this.setState({ variantType: e.value }) }}
                                            circleSize={10}
                                            cirleActiveColor="#296e84"
                                            boxStyle={{ width: Dimensions.get("window").width / 1.05, alignSelf: "center", marginTop: 10 }}
                                            activeColor={"#296e84"}
                                            textStyle={{ fontSize: RFValue(12, 580), marginRight: 10, fontWeight: 'bold' }}
                                            animationTypes={['shake']}
                                        />
                                    </View>
                                    :
                                    <></>
                            }

                            {
                                item.addon_map.length > 0 ?
                                    <View>
                                        <Text style={[styles.h4, { marginTop: 15, marginLeft: 10, fontFamily: "Poppins-Bold" }]}>
                                            Select Addons
                                        </Text>

                                        {item.addon_map.map(value => {
                                            return (
                                                <View>
                                                    <TouchableOpacity style={{
                                                        flexDirection: "row", justifyContent: "space-between",
                                                        backgroundColor: '#fff',
                                                        width: Dimensions.get("window").width / 1.05, alignSelf: "center"
                                                    }}>
                                                        <Text style={{ fontSize: RFValue(12, 580), marginRight: 10, color: "#000", fontWeight: '700' }}>{value.addon_name} (+ Rs. {value.addon_price})</Text>
                                                        <Text style={{ alignSelf: "center" }}>
                                                            <CheckBox
                                                                checked={this.state.addon.includes(value.id)}
                                                                onPress={() => { this.select_addon(value.id); }}
                                                            />
                                                        </Text>
                                                    </TouchableOpacity>


                                                </View>
                                            )
                                        })}


                                    </View>
                                    :
                                    <></>
                            }
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    // alert(this.state.variantType)
                                    this[RBSheet + index].close(); this.add_to_cart(item, this.state.variantType, this.state.addon)
                                }}
                                style={[style.buttonStyles, { marginTop: 10, width: Dimensions.get('window').width / 2, alignSelf: "center" }]}>
                                <LinearGradient
                                    colors={['#5BC2C1', '#296E84']}
                                    style={styles.signIn}>

                                    <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                        Add</Text>

                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </RBSheet>
        </View>
    );

    search = (e) => {
        if (e.length >= 3) {
            fetch(global.vendor_api + 'search_product', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: this.context.token,
                },
                body: JSON.stringify({
                    search_query: e,
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    // console.warn(json)
                    if (json.status) {
                        this.setState({ data: json.data });
                    }
                    else {
                        this.setState({ data: [] });
                    }
                    return json;
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setState({ isloading: false });
                });
        } else {

            this.setState({ data: this.props.route.params.products });
        }
    };

    // clearCart = () => {
    //     AsyncStorage.removeItem('check_product_cart');
    //     this.setState({ check_product_cart: [] });
    // };

    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    centerComponent={this.renderCenterComponent()}
                    leftComponent={this.renderLeftComponent()}
                    rightComponent={this.renderRightComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['white', 'white'],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },

                    }}
                    backgroundColor="#ffffff"
                />

                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-evenly" }}>
                    <View style={{ width: "100%", marginBottom: 10 }}>
                        <SearchBar placeholder="Search"
                            lightTheme
                            placeholderTextColor="#5d5d5d"
                            clearIcon
                            onClear={() => this.setState({ data: this.props.route.params.products, nosearch: false })}
                            value={this.state.search}
                            ref={ref => (this.textInputRef = ref)}
                            onChangeText={e => { this.setState({ search: e }), this.search(e) }}
                            autoFocus={false}
                            inputContainerStyle={{ backgroundColor: "white", height: 3, paddingBottom: 5 }}
                            style={{ fontSize: 14, }}
                            containerStyle={{
                                backgroundColor: "white", color: "#fff", alignSelf: "center",
                                width: "90%", height: 45, borderRadius: 10,
                                shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                                shadowRadius: 3.84, elevation: 5, marginTop: 10
                            }}
                        />
                    </View>
                    <View>
                        {/* <TouchableOpacity  onPress={()=> this.clear_cart()}>
                            <Text>
                                Clear Cart
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 10, marginBottom: Platform.OS == "ios" ? 100 : 100 }}>
                        <FlatList
                            navigation={this.props.navigation}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data}
                            renderItem={this.productCard}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </ScrollView>

                {/* cart_buttn */}
                {
                    this.state.cart.length > 0 ? (
                        <View style={{
                            position: "absolute", bottom: 30, backgroundColor: "#5BC2C1", alignSelf: "center", borderRadius: 10,
                            width: Dimensions.get('window').width / 1.05, height: 60, flexDirection: "row", justifyContent: "space-evenly"
                        }}>

                            <View style={{ width: "50%", padding: 10 }}>
                                <Text style={[styles.h5, { color: "#fff" }]}>{this.state.cart.length} Items</Text>
                                <Text style={[styles.h5, { color: "#fff" }]}>₹ {this.state.grandTotal} ({this.state.subTotal} + {this.state.taxes})</Text>
                            </View>

                            <View style={{ width: "50%" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate("CartPos", {
                                            update_from_cart: this.state.update_from_cart,
                                            table_uu_id: this.state.table_uu_id,
                                            order_method_type: this.state.order_method_type,
                                        })
                                    }}
                                    style={{
                                        width: "80%", height: "80%", backgroundColor: "#fff", borderRadius: 10, alignSelf: "flex-end", marginTop: 5,
                                        justifyContent: "center", alignItems: "center", marginRight: 10
                                    }}>
                                    <Text style={[styles.h4, { color: "#5BC2C1" }]}>Go To Cart</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    ) : (<></>)
                }




            </View>

        )
    }
}

export default ProductListPos;


class PlusMinus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }




    render() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 0, width: "70%", justifyContent: "space-evenly", alignSelf: "flex-end" }}>
                <TouchableOpacity style={style.button}
                    onPress={() => { this.props.update_cart(this.props.product.id, this.props.check_product_cart[this.props.product.id]) }}>
                    <Icon name="remove" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84"
                        style={{ top: Platform.OS == "android" ? -2 : 0 }} />
                </TouchableOpacity>

                <View style={style.button}>
                    <Text style={[style.h4, { alignSelf: "center", color: "#296E84" }]}>
                        {/* {this.state.quantity} */}
                        {this.props.check_product_cart[this.props.product.id]}
                    </Text>
                </View>

                <TouchableOpacity style={style.button}
                    onPress={() => { this.props.add_cart(this.props.product.id) }}>
                    <Icon name="add" type="ionicon" size={Platform.OS == "android" ? 20 : 15} color="#296E84"
                        style={{ top: Platform.OS == "android" ? -2 : 0 }} />
                </TouchableOpacity>
            </View>
        )
    }
}



const style = StyleSheet.create({
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
    button: {
        borderColor: "#5BC2C1",
        borderWidth: 1,
        borderRadius: 5,
        width: 35,
        justifyContent: "center",
        alignItems: "center",
        height: 35,
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
})