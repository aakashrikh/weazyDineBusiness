import React, { Component } from 'react';
import {
  Text, View,
  StyleSheet, Image, TextInput,
  ScrollView, Dimensions, TouchableOpacity, FlatList, ActivityIndicator
} from 'react-native';
import { Icon, Header, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
// import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import MultiSelect from 'react-native-multiple-select';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import { Picker } from '@react-native-picker/picker';
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const order_cancel = [{ "id": "1", "name": "Low Driver Rating" }, { "id": "2", "name": "High delivery charge" }, { "id": "3", "name": "Not ready to order" }, { "id": "4", "name": "Driver asked to cancel" }, { "id": "5", "name": "Other reason" }];;

const variant = []
class ProductVariants extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      Varients: true,
      v_data: [],
      AddOns: true,
      add_data: [],
      object: [],
      isLoading2: false,
      variants_price:'',
      variants_discounted_price:''
    }
  }

  componentDidMount() {
    this.fetch_addon();


    if (this.props.route.params.variants.length > 0) {
      this.setState({
        v_data: this.props.route.params.variants,
        Varients: true,
      });
    }

    if (this.props.route.params.addons != undefined && this.props.route.params.addons.length > 0) {
      this.props.route.params.addons.map((item, index) => {
        this.cat_update(item.pivot.addon_id);
      });

    }

  }

  //for header center component
  renderCenterComponent() {
    return (
      <View>
        <Text style={style.text}>Product Varients</Text>
      </View>

    )
  }


  update_product_variant = () => {
    const add = [];
    this.state.object.map((item, index) => {
      if (item) {
        add.push(index);
      }

    });

    fetch(global.vendor_api + 'vendor_update_product_options', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.context.token
      },
      body: JSON.stringify({
        variants: this.state.v_data,
        addons: add,
        product_id: this.props.route.params.product_id,
      })
    }).then((response) => response.json())
      .then((json) => {
        if (!json.status) {
          Toast.show(json.msg);
        }
        else {
          if (this.props.route.params.refresh) {
            this.props.navigation.navigate("Products", { refresh: true, active_cat:0});
          }
          else {
            this.props.navigation.goBack({ refresh: true });
          }

        }

        this.setState({ isLoading2: false });
        return json;
      }).catch((error) => {
        console.error(error);
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


  show_varient = () => {
    if (this.state.Varients) {
      this.setState({ Varients: false });
    }
    else {
      this.setState({ Varients: true });
    }

  }

  show_addon = () => {
    if (this.state.AddOns) {
      this.setState({ AddOns: false });
    }
    else {
      this.setState({ AddOns: true });
    }
  }

  add_variant = () => {
    const vari = [{ "id": 1, "variants_name": "", "variants_price": "", "variants_discounted_price": "" }];
    this.setState({ v_data: [...this.state.v_data, ...vari] });
  }

  // add_addons = () =>
  // {
  //   const vari = [{"id":1,"variant_name":"aakash","price":20,"offer_price":'30'}];
  //   this.setState({add_data:[...this.state.add_data, ...vari]});
  // }
  remove_variant = (index) => {

    var array = [...this.state.v_data]; // make a separate copy of the array
    array.splice(index, 1);
    this.setState({ v_data: array });
  }

  update_name = (index, value) => {
    var obj = this.state.v_data;
    obj[index].variants_name = value;

    this.setState({ v_data: obj });
  }

  offer_price = (index, value) => {
    var obj = this.state.v_data;
    obj[index].variants_discounted_price = value;

    this.setState({ v_data: obj });
  }

  price = (index, value) => {
    var obj = this.state.v_data;
    obj[index].variants_price = value;

    this.setState({ v_data: obj });
  }


  cat_update = (str) => {
    if (this.state.object[str]) {
      const object = this.state.object;
      object[str] = false;
      this.setState({ object });
    }
    else {
      const object = this.state.object;
      object[str] = true;
      this.setState({ object });
    }

  }

  deselect = () => {
    var one = this.state.object
    var keys = Object.entries(one);
    keys.map(([key, value]) => {
      const object = this.state.object;
      object[key] = false;
      this.setState({ object });
    });

  }

  variant = ({ item, index }) => (
    <View style={{ marginTop: 30 }}>
      <View>
        <Text style={style.fieldsTitle}>
          Variant Name
        </Text>
        <TextInput
          onChangeText={(e) => { this.update_name(index, e) }}
          style={style.textInput}
          value={item.variants_name}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={{ width: '48%' }}>
          <Text style={style.fieldsTitle}>
            Price
          </Text>
          <TextInput
            onChangeText={(e) => { this.price(index, e) }}
            style={style.textInput2}
            keyboardType='number-pad'
            value={item.variants_price.toString()}
          />

        </View>

        <View style={{ width: '48%' }}>
          <Text style={style.fieldsTitle}>
            Offer price
          </Text>
          <TextInput
            value={item.variants_discounted_price.toString()}
            onChangeText={(e) => { this.offer_price(index, e) }}
            keyboardType='number-pad'
            style={style.textInput2} />
        </View>



      </View>
      <TouchableOpacity onPress={() => { this.remove_variant(index) }} style={{ width: '100%', alignSelf: 'flex-end', marginTop: 20 }}>
        <Text style={{ color: 'red', fontSize: 16, alignSelf: 'flex-end' }}>
          DELETE
        </Text>

      </TouchableOpacity>
    </View>
  )


  addons = ({ item }) => (
    (!this.state.object[item.id]) ?
      <View>
        <TouchableOpacity style={{
          flexDirection: "row", justifyContent: "space-between",
          backgroundColor: '#fff',
          borderRadius: 5, marginTop: -10,



          width: Dimensions.get("window").width / 1.25, alignSelf: "center"
        }}>
          <Text style={{ paddingLeft: 10, alignSelf: "center" }}>{item.addon_name} (+Rs. {item.addon_price})</Text>
          <Text style={{ alignSelf: "center" }}>
            <CheckBox checked={this.state.checked}
              onPress={() => { this.cat_update(item.id) }}
            />
          </Text>
        </TouchableOpacity>


      </View>
      :
      <View >
        <TouchableOpacity style={{
          flexDirection: "row", justifyContent: "space-between",
          backgroundColor: '#fff',
          borderRadius: 5, marginTop: -10,

          width: Dimensions.get("window").width / 1.25, alignSelf: "center",

        }}
          onPress={() => { this.cat_update(item.id) }}>
          <Text style={{ paddingLeft: 10, alignSelf: "center" }}>{item.addon_name} (+Rs. {item.addon_price})</Text>
          <Text style={{ alignSelf: "center" }}>
            <CheckBox checked={true}
              onPress={() => { this.cat_update(item.id) }}
              checkedColor="green"
            />
          </Text>
        </TouchableOpacity>

      </View>
  )


  fetch_addon = () => {
    fetch(global.vendor_api + 'fetch_product_addon', {
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
          Toast.show(json.msg);
        }
        else {
          this.setState({ add_data: json.data });
        }

        this.setState({ isLoading: false });
        return json;
      }).catch((error) => {
        console.error(error);
      });
  }


  render() {
    return (
      <View>

        <View>
          <Header
            statusBarProps={{ barStyle: 'light-content' }}
            leftComponent={this.renderLeftComponent()}
            centerComponent={this.renderCenterComponent()}
            ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
              colors: ['#fff', '#fff'],


            }}
          />
        </View>

        <ScrollView style={{ padding: 10, flexGrow: 1, marginBottom: 100 }}>

          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 5, marginTop: 10 }}>
            <TouchableOpacity onPress={() => { this.show_varient() }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.h3}>Variants</Text>
                {(this.state.Varients) ?
                  <Icon name="chevron-up-outline" type="ionicon"
                    style={{ top: 3 }} />
                  :
                  <Icon name="chevron-down-outline" type="ionicon"
                    style={{ top: 3 }} />

                }

              </View>
            </TouchableOpacity>
            {(this.state.Varients) ?
              <>
                <View style={{ marginTop: 20, padding: 5 }}>

                  <FlatList
                    navigation={this.props.navigation}
                    showsVerticalScrollIndicator={false}
                    data={this.state.v_data}
                    renderItem={this.variant}
                    keyExtractor={item => item.id}
                  />


                </View>
                <TouchableOpacity onPress={() => { this.add_variant() }} style={{ alignSelf: 'center', padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ececec', marginTop: 15 }}>
                  <Text>Add variant</Text>
                </TouchableOpacity>
              </> :
              <></>
            }
          </View>


          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 5, marginTop: 10 }}>
            <TouchableOpacity onPress={() => { this.show_addon() }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.h3}>Add-Ons</Text>
                {(this.state.AddOns) ?
                  <Icon name="chevron-up-outline" type="ionicon"
                    style={{ top: 3 }} />
                  :
                  <Icon name="chevron-down-outline" type="ionicon"
                    style={{ top: 3 }} />

                }

              </View>
            </TouchableOpacity>
            {(this.state.AddOns) ?
              <>
                <View style={{ marginTop: 20, padding: 5 }}>


                  {
                    (this.state.add_data.length > 0) ?
                      <FlatList
                        navigation={this.props.navigation}
                        showsVerticalScrollIndicator={false}
                        data={this.state.add_data}
                        renderItem={this.addons}
                        keyExtractor={item => item.id}
                      />
                      :
                      <></>
                  }


                </View>
                <TouchableOpacity onPress={() => this.RBSheet.open()} style={{ alignSelf: 'center', padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ececec', marginTop: 15 }}>
                  <Text>Add Add-On</Text>
                </TouchableOpacity>
              </> :
              <></>
            }



          </View>


          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={300}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center"
              }
            }}
          >
            {/* <YourOwnComponent /> */}
            <Addons fetch_addon={this.fetch_addon} RBSheet={this.RBSheet} />
          </RBSheet>


          {(!this.state.isLoading2) ?
            <TouchableOpacity onPress={() => this.update_product_variant()} style={{ alignSelf: 'center', padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ececec', backgroundColor: 'rgba(233,149,6,1)', width: '80%', height: 50, marginTop: 30, marginBottom: 30 }}>
              <Text style={{ color: '#fff', alignSelf: 'center', marginTop: 5, fontSize: 16 }}>Save & continue</Text>
            </TouchableOpacity>

            :
            <ActivityIndicator size="large" color="rgba(233,149,6,1)" />
          }

        </ScrollView>

      </View>
    );
  }
}


class Addons extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      addon_name: '',
      addon_price: '',
      isLoading: false,
    }
  }


  create_addon = () => {

    if (this.state.addon_name == '' || this.state.addon_price == '') {
      Toast.show("All field is required!");
    }
    else {
      this.setState({ isLoading: true });
      fetch(global.vendor_api + 'add_product_addon', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.context.token
        },
        body: JSON.stringify({
          addon_name: this.state.addon_name,
          addon_price: this.state.addon_price,
        })
      }).then((response) => response.json())
        .then((json) => {
          if (!json.status) {
            console.warn(json)
            Toast.show(json.msg);
          }
          else {
            this.props.fetch_addon();
            Toast.show(json.msg);
            this.props.RBSheet.close();
          }

          this.setState({ isLoading: false });
          return json;
        }).catch((error) => {
          console.error(error);
        });
    }
  }
  render() {
    return (
      <View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, paddingTop: 10, marginTop: -120 }}>Add-Ons</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -70 }}>
          <View style={{ width: '48%' }}>
            <Text style={style.fieldsTitle}>
              Add-on Name
            </Text>
            <TextInput
              value={this.state.addon_name}
              onChangeText={(e) => { this.setState({ addon_name: e }) }}
              style={style.textInput2} />

          </View>

          <View style={{ width: '48%' }}>
            <Text style={style.fieldsTitle}>
              Addition Price
            </Text>
            <TextInput
              value={this.state.addon_price}
              onChangeText={(e) => { this.setState({ addon_price: e }) }}
              style={style.textInput2}
              keyboardType='number-pad' />
          </View>



        </View>

        {(!this.state.isLoading) ?
          <TouchableOpacity
            onPress={() => this.create_addon()}
            style={[style.buttonStyles, { marginTop: 20, width: '80%', borderRadius: 5, alignSelf: 'center' }]}>
            <LinearGradient
              colors={['#EDA332', '#EDA332']}
              style={styles.signIn}>
              <Text style={[styles.textSignIn, { color: '#fff' }]}>
                Create New</Text>
            </LinearGradient>
          </TouchableOpacity> :
          <ActivityIndicator size="large" color="#EDA332" />
        }

      </View>
    )
  }
}
export default ProductVariants;

//Styling
const style = StyleSheet.create({
  text: {
    fontFamily: "Raleway-SemiBold",
    // fontSize:20,
    fontSize: RFValue(14.5, 580),
    margin: 5
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    color: "#5d5d5d",
    //   backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 5,
    width: '100%',
    height: 40,
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: RFValue(11, 580),
  },
  textInput2: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    color: "#5d5d5d",
    //   backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 5,
    width: "100%",
    height: 40,
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: RFValue(11, 580),
  },
  fieldsTitle:
  {
    marginBottom: 5
  }

}
)