import React, { Component } from "react";
import {
  Text, View, ScrollView, Dimensions,
  StyleSheet, TouchableOpacity, FlatList, Platform, Alert
} from "react-native";
import { Header, Icon, SearchBar } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import RadioButtonRN from "radio-buttons-react-native";
import { AuthContext } from "../AuthContextProvider.js";
import RadioForm from "react-native-simple-radio-button";
import { RFValue } from "react-native-responsive-fontsize";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Global Style Import
const styles = require('../Components/Style.js');

const radio = [
  {
    label: 'TakeAway'
  },
  {
    label: "Delivery"
  },
  {
    label: 'Dine-In'
  },
];

var radio_props = [
  { label: 'TakeAway', value: "TakeAway" },
  { label: 'Delivery', value: "Delivery" },
  { label: 'Dine-In', value: "DineIn" }
];


class AddOrder extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: '',
      loading: false,
      category: [],
      products: [],
      active_cat: 0,
      isloading: true,
      cart: [],
      offers: [],
      table_uu_id: this.props.route.params.table_uu_id,
      order_method_type: this.props.route.params.order_method_type,
      grandTotal: "",

    }
  }

  //for header left component
  renderLeftComponent() {
    return (
      <View style={{ top: 5 }}>
        <Icon type="ionicon" name="arrow-back-outline"
          onPress={() => { this.props.navigation.goBack(null) }} />
      </View>
    )
  }


  //for header center component
  renderCenterComponent() {
    return (
      <View>
        <Text style={styles.text}>Add Order</Text>
      </View>

    )
  }

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

  componentWillUnmount() {
    this.setState({
      table_uu_id: "",
      order_method_type: 0
    })
  }

  componentDidMount() {
    this.fetchCategories();

    AsyncStorage.getItem('cart_and_final').then((value) => {
      this.setState({
        cart: JSON.parse(value).cart, check_product_cart: JSON.parse(value).check_product_cart,
        grandTotal: JSON.parse(value).final_price, subTotal: JSON.parse(value).subTotal,
        taxes: JSON.parse(value).taxes
      })
    })

    if (this.props.route.params != undefined) {
      this.setState({
        table_uu_id: this.props.route.params.table_uu_id,
        order_method_type: this.props.route.params.order_method_type
      })
    }
    else {
      this.setState({
        table_uu_id: "",
        order_method_type: 0
      })
    }

    this.focuslistener = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params != undefined) {
        this.setState({
          table_uu_id: this.props.route.params.table_uu_id,
          order_method_type: this.props.route.params.order_method_type
        })
        // alert(this.props.route.params.order_method_type)
      }
      else {
        this.setState({
          table_uu_id: "",
          order_method_type: 0
        })
      }
    })


  }

  renderItem = ({ item }) => (
    <>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 5 }}
        onPress={() => this.props.navigation.navigate("ProductListPos", {
          products: item.products,
          table_uu_id: this.state.table_uu_id,
          order_method_type: this.state.order_method_type,
        })}>
        <LinearGradient
          colors={['#fff', '#fff']}
          style={[styles.box1, { marginBottom: 10 }]}>
          <View>
            <Text style={[styles.h5, {
              fontSize: RFValue(10, 580), textAlign: "center",
              margin: 5
            }]} numberOfLines={2}>{item.name} ({item.products_count})</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  )

  fetchCategories = () => {
    fetch(global.vendor_api + 'fetch_vendor_category', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.context.token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.status) {
        } else {
          this.setState({ category: json.data });
          // this.fetchProducts(0, this.state.type, 1);
        }
        this.setState({ load_item: false, isloading: false });
        return json;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        // this.setState({ isloading: false });
      });
  };


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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={{ width: "100%" }}>
                        <SearchBar placeholder="Search"
                            lightTheme
                            placeholderTextColor="#5d5d5d"
                            clearIcon
                            onClear={() => this.setState({ data: [], nosearch: false })}
                            value={this.state.search}
                            ref={ref => (this.textInputRef = ref)}
                            onChangeText={e => this.search(e, this.state.page)}
                            autoFocus={false}
                            inputContainerStyle={{ backgroundColor: "white", height: 3, paddingBottom: 5 }}
                            style={{ fontSize: 14, }}
                            containerStyle={{
                                backgroundColor: "white", color: "#fff", alignSelf: "center",
                                width: "80%", height: 45, borderRadius: 10,
                                shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25,
                                shadowRadius: 3.84, elevation: 5, marginTop: 10
                            }}
                        />
                    </View> */}


          <View style={{ width: Dimensions.get('window').width / 1.1, alignSelf: "center" }}>
            {/* <RadioButtonRN
                            data={radio}
                            selectedBtn={(e) => console.warn(e)}
                            style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}

                            circleSize={10}
                            cirleActiveColor="#2c9dd1"
                            boxStyle={{
                                backgroundColor: 'white', borderRadius: 10, padding: 10, marginVertical: 5,
                                width: Dimensions.get('window').width / 3.4, alignSelf: "center",
                                shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
                            }}
                            activeColor={"#5BC2C1"}
                            textStyle={[styles.h6, { color: "#5d5d5d", padding: 5 }]}
                            animationTypes={['shake']}
                        /> */}

            <RadioForm
              formHorizontal={true}
              radio_props={radio_props}
              animation={false}
              selectedButtonColor="#5BC2C1"
              buttonColor="#5BC2C1"
              buttonSize={12}
              buttonOuterSize={25}
              initial={this.state.order_method_type}
              // onPress={(value) => { this.setState({ order_method_type: value }) }}
              onPress={(value) => {
                if (value == "TakeAway") {
                  this.setState({ order_method_type: 0 })
                }
                else if (value == "Delivery") {
                  this.setState({ order_method_type: 1 })
                }
                else if (value == "DineIn") {
                  // this.props.navigation.navigate("MPosDashBoard", { screen: "Home" })
                  this.props.navigation.navigate("TabNav", { screen: "Dine-In", params: { table_uu_id: this.state.table_uu_id } })
                  this.setState({ order_method_type: 2 })
                }
              }}
              labelStyle={{ fontSize: RFValue(12, 580), marginRight: 10, fontWeight: 'bold' }}
              style={{ marginTop: 20, alignSelf: "center" }}
            />
          </View>

          <View style={{ marginTop: 20, marginBottom: Platform.OS == "ios" ? 100 : 100 }}>
            {
              this.state.isloading ?
                <Loaders />
                :
                <>
                  {
                    this.state.category.length > 0 ?
                    
                     <>
                      <FlatList
                        numColumns={3}
                        data={this.state.category}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        style={{ marginBottom: Platform.OS === "ios" ? 20 : 10 }}
                      />
      
                     </>

                      :
                      <></>
                  }
                </>
            }
          </View>

        </ScrollView>

        {/* cart */}
        {/* {
          this.state.cart.length > 0 ?
            <View style={{
              position: "absolute", bottom: 30, backgroundColor: "#5BC2C1", alignSelf: "center", borderRadius: 10,
              width: Dimensions.get('window').width / 1.05, height: 60, flexDirection: "row", justifyContent: "space-evenly"
            }}>

              <View style={{ width: "50%", padding: 10 }}>
                <Text style={[styles.h5, { color: "#fff" }]}>{this.state.cart.length} Items</Text>
                <Text style={[styles.h5, { color: "#fff" }]}>₹ {this.state.grandTotal} ({this.state.subTotal} + {this.state.taxes})</Text>
              </View>

              <View style={{ width: "50%" }}>
                <TouchableOpacity style={{
                  width: "80%", height: "80%", backgroundColor: "#fff", borderRadius: 10, alignSelf: "flex-end", marginTop: 5,
                  justifyContent: "center", alignItems: "center", marginRight: 10
                }}>
                  <Text style={[styles.h4, { color: "#5BC2C1" }]}>Go To Cart</Text>
                </TouchableOpacity>
              </View>


            </View>
            :
            <></>
        } */}
      </View>
    )
  }
}

export default AddOrder;

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
    )
  }
}

const style = StyleSheet.create({
  button: {
    backgroundColor: "#ececec",
    height: 40,
    width: 110,
    borderRadius: 10,
    justifyContent: "center",
    marginRight: 10,
    alignItems: "center",
    marginTop: 15
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