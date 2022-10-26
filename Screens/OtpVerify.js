import React, { Component } from 'react';
import {
  View, ImageBackground, ScrollView,
  TouchableOpacity,
  StyleSheet, Platform,
  Image, ActivityIndicator, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-elements';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import OneSignal from 'react-native-onesignal';
import CountDown from 'react-native-countdown-component';
import { AuthContext } from '../AuthContextProvider';
import RNOtpVerify from 'react-native-otp-verify';
import DeviceInfo from 'react-native-device-info';
import OTPInputView from '@twotalltotems/react-native-otp-input'

//Global StyleSheet Import
const style = require('../Components/Style.js');


class OtpVerify extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      otpInput: '',
      inputText: '',
      isLoading: false,
      resend: false,
      code: ""
    }
  }

  componentDidMount() {

    if (Platform.OS == "android") {
      this.getHash();
      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(this.otpHandler))
        .catch(p => console.log(p));
    }

  }


  getHash = () =>
    RNOtpVerify.getHash()
      .then(console.log)
      .catch(console.log);


  otpHandler = (message) => {
    //  alert("sss");
    if (message != undefined) {
      const otp = /(\d{4})/g.exec(message)[1];
      this.setState({ code: otp })
      this.event_call(otp);
      //   RNOtpVerify.removeListener();
      Keyboard.dismiss();
    }

  }

  componentWillUnmount() {
    RNOtpVerify.removeListener();
  }
  updateOtpText = () => {
    // will automatically trigger handleOnTextChange callback passed
    this.input1.setValue(this.state.inputText);
  };

  //for first time otp
  event_call = (input) => {
    // alert(this.state.code)
    if (input.length == 4) {
      Keyboard.dismiss();
      if (input == "") {
        Toast.show("OTP is required!");
      }
      else {

        this.setState({ isLoading: true });
        var contact_no = this.props.route.params.contact_no;

        fetch(global.vendor_api + 'otp-verification', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contact: contact_no,
            otp: input,
            verification_type: "vendor",
          })
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.msg == 'ok') {
          
              global.vendor = json.usr;
              global.token = json.token;
              global.msg = "Welcome"

              if (json.user_type == 'login') {

                const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "done" }
                AsyncStorage.setItem('@auth_login', JSON.stringify(data));
                this.context.login("done",json.data,json.token);
                global.msg = "Welcome Back"
              }
              else {

                const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "steps" }
                AsyncStorage.setItem('@auth_login', JSON.stringify(data));
                this.context.login("steps",json.data,json.token);
                global.msg = "Welcome"
              }
            }
            else {
              Toast.show(json.error)
            }
          }
          )
          .catch((error) => console.error(error))
          .finally(() => {
            this.setState({ isLoading: false });
          });
      }
    }
  }

  mobile_verify = () => {
    if (this.state.otpInput == "") {
      Toast.show("OTP is required!")
    }
    else {

      this.setState({ isLoading: true });
      var contact_no = this.props.route.params.contact_no;

      fetch(global.vendor_api + 'otp-verification', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contact: contact_no,
          otp: this.state.otpInput,
          verification_type: "vendor"
        })
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.msg == 'ok') {
            OneSignal.sendTag("id", '' + json.usr);
            OneSignal.sendTag("account_type", "vendor-bmguj1sfd77232927ns");
            // global.vendor = json.usr;
            // global.token = json.token;

            if (json.user_type == 'login') {

              const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "done" }
              AsyncStorage.setItem('@auth_login', JSON.stringify(data));
              this.context.login("done",json.data,json.token);
            }
            else {

              const data = { 'token': json.token, 'vendor_id': json.usr, "use_type": "steps" }
              AsyncStorage.setItem('@auth_login', JSON.stringify(data));
              this.context.login("steps",json.data,json.token);
            }
          }
          else {
            Toast.show(json.error)
          }
        }
        )
        .catch((error) => console.error(error))
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  resend = () => {
    this.setState({ resend: false });
    fetch(global.vendor_api + "mobile-verification", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: this.props.route.params.contact_no,
        verification_type: "vendor",
        request_type:'resend'
      })
    }).then((response) => response.json())
      .then((json) => {

        if (json.msg == 'ok') {
          console.warn(json.msg)
          Toast.show('Resent successfully!');

        }
        else {
          Toast.show(json.error);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {

    // ()=>this.props.navigation.navigate('FirstUserProfile')
    return (
      <View style={style.container}>
        <ScrollView>
          {/* header */}
          <View style={[styles.header, { marginTop: 30 }]}>


            {/* <View style={{flexDirection:"row",justifyContent:"space-between"}}>
              
                <Image source={require("../img/logo/mp.png")} 
               style={{height:50,width:52,alignSelf:"flex-end",margin:10}}/>
                </View> */}

            {/* Image */}
            <Image source={require('../img/tickotp.png')} style={styles.image} />

          </View>

          {/* Heading */}
          <Text style={[styles.heading, { color: '#ffbf0b' }]} >OTP
            <Text style={styles.heading}> Verification</Text></Text>


          <Text style={styles.p} >Enter your OTP code we have sent to :</Text>
          <Text style={[styles.p, { top: -15 }]}>+91 {this.props.route.params.contact_no} <Text style={{ color: "#EDA332", fontFamily: "Raleway-Regular" }} onPress={() => this.props.navigation.navigate('MobileLogin')} > Edit</Text></Text>


          {/* OTP TextInput */}
          {/* <OTPTextView
              
                ref={(e) => (this.input1 = e)}
                containerStyle={styles.textInputContainer}
                handleTextChange={(text) => this.setState({otpInput: text})}
                inputCount={4}
                keyboardType="numeric"
              /> */}
          <OTPInputView
            style={{ width: '70%', height: 100, alignSelf: 'center', fontSize: 55 }}
            pinCount={4}

            code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => { this.setState({ code }) }}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(text) => { this.event_call(text) }}
          />


          {this.state.isLoading ?
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#EDA332" />
            </View>
            :
            <View>
              {/* <TouchableOpacity  
            onPress={this.mobile_verify}
            // onPress={()=>this.props.navigation.navigate("CreateShopProfile")}
            style={styles.buttonStyles}>
              <LinearGradient 
                colors={['#EDA332', '#0b2654']}
                style={style.signIn}>

                <Text style={[style.textSignIn, {color:'#fff'}]}>
                  Verify & Proceed</Text>
              
              </LinearGradient>
            </TouchableOpacity> */}
              {!this.state.resend ?
                <View style={{ flexDirection: "row", marginTop: -20, alignSelf: "center" }}>
                  <Text style={[styles.p, { marginTop: 10 }]}>Request OTP in</Text>
                  <CountDown
                    style={{ marginTop: 10 }}
                    // size={30}
                    until={30}
                    onFinish={() => this.setState({ resend: true })}
                    digitStyle={{ backgroundColor: '#FFF', }}
                    digitTxtStyle={{ color: '#EDA332', fontFamily: "Raleway-Regular" }}
                    separatorStyle={{ color: '#EDA332' }}
                    timeToShow={['M', 'S']}
                    timeLabels={{ m: null, s: null }}
                    showSeparator
                  />
                </View>
                :
                <View style={{ alignSelf: "center", marginTop: -32 }}>
                  <Text onPress={() => this.resend()} style={[styles.p, { color: "#EDA332" }]} >RESEND OTP?
                  </Text>
                </View>
              }
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

export default OtpVerify;

//Internal StyleSheet
const styles = StyleSheet.create({
  textInputContainer: {
    marginBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
  },
  image: {
    height: 250,
    width: 200,
    //marginTop:30,
    justifyContent: "center",
    alignSelf: "center"
  },
  icon: {
    margin: 15
  },
  heading: {
    color: "#1F449B",
    fontSize: RFValue(18, 580),
    fontFamily: "Montserrat-SemiBold",
    marginTop: 10,
    alignSelf: "center"
  },
  p:
  {
    fontSize: RFValue(10, 580),
    fontFamily: "Montserrat-Regular",
    marginTop: 25,
    alignSelf: "center"
  },
  buttonStyles: {
    width: "60%",
    alignSelf: "center",
    marginTop: 25,
    marginRight: 5,
    marginBottom: 20
  },
  loader: {
    shadowOffset: { width: 50, height: 50 },
    marginTop: 20,
    bottom: 5,
    shadowRadius: 50,
    elevation: 5,
    backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
  }, underlineStyleBase: {
    width: 50,
    height: 45,
    borderWidth: 0,
    borderWidth: 1,
    fontSize: 24,
    borderColor: '#eee',
    color: "#EDA332"
  },

  underlineStyleHighLighted: {
    borderColor: "skyblue",
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  }, borderStyleBase: {
    width: 30,
    height: 45
  },
});