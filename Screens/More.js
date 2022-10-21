import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView
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
  }


  // for header left component
  renderLeftComponent() {
    return (
      <View style={
        { width: win.width }
      }>
        <Text style={
          [styles.h3]
        }>More</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={
        styles.container
      }>

        <View>
          <Header statusBarProps={
            { barStyle: 'light-content' }
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
            } />
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
      <View style={
        {
          borderTopWidth: 0.2,
          borderColor: "#d3d3d3"
        }
      }>
        <ScrollView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
                <Icon name="person-circle-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Profile</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate("MultipleImage")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="camera-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Add  Covers Pictures</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate("OtherCharges")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="apps-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Other Charges</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate("ChangeShopTime")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="time-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Update Store Timing</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          {/* Online Payment */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate("OnlinePayment")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="cash-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Online Payment</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>


          {/* Notifications */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Notification") }>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="notifications-circle-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Notifications</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>


          {/* About us */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate("AboutUs")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="alert-circle-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>About Us</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>


          {/* privacy policy */}
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("PrivacyPolicy",{title: "Terms & Conditions" ,url:"https://dine.weazy.in/customer-term-condition.html"})}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="settings-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Terms & Conditions</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("PrivacyPolicy",{title: "Privacy Policy" ,url:"https://marketpluss.com/customer-privacy-policy.html"})}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="lock-closed-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Privacy Policy</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("PrivacyPolicy",{title:"Refunds And Cancellation",url:"https://marketpluss.com/customer-refund-cancellation.html"})}>
            <View style={style.questView}>
              <View style={
                {flexDirection: "row"}
              }>
                <Icon name="git-compare-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Refunds And Cancellation</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>

          {/* Contact us */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate("ContactUs")}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="headset-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Support</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
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
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
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

          {/* logout */}
          <TouchableOpacity onPress={() => this.logOut()}>
            <View style={style.questView}>
              <View style={{flexDirection: "row"}}>
              <Icon name="log-out-outline" type='ionicon' size={30} color="#EDA332"/>
                <Text style={style.texxt}>Logout</Text>
              </View>
              <Icon name="chevron-forward-outline" type='ionicon' color="#EDA332" size={25}/>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  questView: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth:1,
    borderBottomColor:"#f5f5f5",
    justifyContent: "space-between"
  },
  texxt: {
    fontSize: RFValue(13, 580),
    fontFamily: "Roboto-Medium",
    padding: 2,
    marginTop:2,
    paddingLeft: 20
  }

})
