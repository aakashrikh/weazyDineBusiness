import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView, Switch
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import OneSignal from 'react-native-onesignal';
import { AuthContext } from '../AuthContextProvider.js';
import DeviceInfo from 'react-native-device-info';

// Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class More extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      isOn: 1,
    }
  }

  componentDidMount() {
    this.setState({ isOn: this.context.user.shop_open })
  }

  toggle(e) {
    this.setState({ isOn: e });
    fetch(global.vendor_api + 'update_shop_status', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.context.token,
      },
      body: JSON.stringify({
        shop_status: e ? 1 : 0,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status) {
          Toast.show("Shop Status Updated Successfully!");
          this.context.getProfile(this.context.token);
        } else {
          this.setState({ isOn: this.context.user.shop_open });
        }
        return json;
      })
      .catch((error) => console.error(error))
      .finally(() => { });
  }


  // for header left component
  renderLeftComponent() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")} style={{
        flexDirection: 'row',
        width: Dimensions.get('window').width
      }}>
        {/* <View>
      <Image source={
                     require('../img/logo/mp.png')
                   }
                   style={
                     {
                       width:70,
                       height:70,
                       marginTop:-5
                     }
                   }/>
      </View> */}
        <View style={{ width: "80%", padding: 5, left: 0 }}>
          <Text style={[styles.h3, { color: '#222', fontSize: RFValue(16, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>Hello! {this.context.user.name} </Text>
          <Text>+91 - {this.context.user.contact}</Text>
          <Text numberOfLines={2}>{this.context.user.address}</Text>
        </View>

        <View style={{ justifyContent: "center" }}>
          <Switch
            trackColor={{ false: "#d3d3d3", true: "#5BC2C1" }}
            thumbColor={this.state.isOn ? "white" : "white"}
            value={this.state.isOn == 1 ? true : false}
            // onValueChange={() => this.toggle()}
            onValueChange={(value) => {
              this.toggle(value)
            }}
          />
        </View>
      </TouchableOpacity>

    )
  }

  render() {
    return (
      <View style={
        styles.container
      }>

        <View>
          <Header statusBarProps={
            { barStyle: 'dark-content' }
          }
            leftComponent={
              this.renderLeftComponent()
            }
            ViewComponent={LinearGradient}
            // Don't forget this!
            linearGradientProps={
              {
                colors: ['#fff', '#fff']


              }
            }
            backgroundColor="#ffffff"
          />
        </View>

        <ScrollView>
          <Buttons navigation={
            this.props.navigation
          } />

          <Text style={
            {
              alignSelf: 'center',
              marginTop: 10,
              color: '#d3d3d3',
              marginBottom: 10

            }
          }>
            App Version: {
              DeviceInfo.getVersion()
            } </Text>
        </ScrollView>

      </View>
    )
  }
}

export default More;

// Touchable button

class Buttons extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      empty: global.contact
    }
  }

  logOut = () => {
    fetch(global.vendor_api + 'logout_vendor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.context.token
      },
      body: JSON.stringify({})
    }).then((response) => response.json()).then((json) => {
      OneSignal.sendTag("id", '' + json.usr);
      OneSignal.sendTag("acount_type", "vendor");
      AsyncStorage.setItem('@auth_login', '')
      this.context.token = null;
      Toast.show("Logout Successfully!")
      this.context.logout();

    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      this.setState({ isLoading: false })
    });

  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={
          {
            borderTopWidth: 0.2,
            borderColor: "#d3d3d3"
          }
        }>
          <ScrollView>

            <Text style={[styles.h3, { marginLeft: 10, marginTop: 5 }]}>Setup</Text>

            {/* taxes an setup */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("OtherCharges")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="receipt-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Tax & Charges Setup</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* Online Payment */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("OnlinePayment")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="cash-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Online Payment Setup</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* add staff account */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("StaffAccount")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="people-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Manage Staff Account</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* offers setup */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Offers")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="people-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Offers Setup</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.h3, { marginLeft: 10, marginTop: 5 }]}>Accounts</Text>

            {/* feeds */}
            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("Feeds")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="reader-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Feeds</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity> */}

            {/* Change Category */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("CategoryChange")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="apps-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Change Category</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* add cover images */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("MultipleImage")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="camera-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Add  Covers Pictures</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>


            {/* shop time */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ChangeShopTime")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="time-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Update Store Timing</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* update address */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ChangeLocation")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="location-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Update Address</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.h3, { marginLeft: 10, marginTop: 5 }]}>Legal</Text>

            {/* About us */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("PrivacyPolicy", { title: "About Us", url: "https://weazydine.com/about-us.html" })}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="alert-circle-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>About Us</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* privacy policy */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("PrivacyPolicy", { title: "Terms & Conditions", url: "https://weazydine.com/termsandconditions.html" })}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="settings-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Terms & Conditions</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate("PrivacyPolicy", { title: "Privacy Policy", url: "https://weazydine.com/privacy-policy.html" })}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="lock-closed-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Privacy Policy</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate("PrivacyPolicy", { title: "Refunds And Cancellation", url: "https://weazydine.com/refund.html" })}>
              <View style={style.questView}>
                <View style={
                  { flexDirection: "row" }
                }>
                  <Icon name="git-compare-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Refunds And Cancellation</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>


            {/* Subscription */}
            {/* <TouchableOpacity onPress={
            () => this.props.navigation.navigate("Subscription")
          }>
            <View style={
              style.questView
            }>
              <View style={
                {flexDirection: "row"}
              }>
                <Image source={
                    require('../img/icons/subscription.png')
                  }
                  style={
                    style.Icon
                  }/>
                <Text style={style.texxt}>Subscription</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#5BC2C1" size={25}/>
            </View>
          </TouchableOpacity> */}


            {/* How to use */}
            {/* <TouchableOpacity onPress={()=>Linking.openURL('https://www.youtube.com/channel/UCQ85cK-wQljpJN56ERsbWCA')}>    
                        <View style={style.questView}>
                            <View style={{flexDirection:"row"}}>
                                <Image source={require('../img/icons/question.png')} style={style.Icon}/>
                                <Text style={style.texxt}>How to use the application?</Text>
                            </View>
                            <Image source={require('../img/icons/right-arrow.png')}
                            style={{height:20,width:20,alignSelf:"center"}}/>                        
                        </View>
                    </TouchableOpacity> */}

            <Text style={[styles.h3, { marginLeft: 10, marginTop: 5 }]}>More</Text>

            {/* Contact us */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ContactUs")}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="headset-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={style.texxt}>Support</Text>
                </View>
                <Icon name="chevron-forward-outline" type='ionicon' color="#222222" size={25} />
              </View>
            </TouchableOpacity>

            {/* logout */}
            <TouchableOpacity onPress={() => this.logOut()}>
              <View style={style.questView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="log-out-outline" type='ionicon' size={25} color="#5BC2C1" />
                  <Text style={[style.texxt, { color: "#296E84" }]}>Logout</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const style = StyleSheet.create({
  questView: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    justifyContent: "space-between"
  },
  texxt: {
    fontSize: RFValue(12, 550),
    fontFamily: "Roboto-Regular",
    padding: 2,
    marginTop: 2,
    paddingLeft: 20
  }

})
