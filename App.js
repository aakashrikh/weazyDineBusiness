import React, { Component } from 'react';
import {
  Image, Linking, Platform,StatusBar
} from 'react-native';
import { Icon } from "react-native-elements";
import codePush from "react-native-code-push";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import linking from './Components/Linking';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";
//Import screens 
import MobileLogin from './Screens/MobileLogin';
import OtpVerify from './Screens/OtpVerify';
import CreateShopProfile from './Screens/CreateShopProfile';
import AddCover from './Screens/AddCover';
import VerificationDone from './Screens/VerificationDone';
import Home from './Screens/Home';
import TopTab from './Components/TopTab';
import More from './Screens/More';
import Profile from './Screens/Profile';
import PrivacyPolicy from './Screens/PrivacyPolicy';
import ContactUs from './Screens/ContactUs';
import AboutUs from './Screens/AboutUs';
import Answers from './Screens/Answers';
import CreateOffers from './Screens/CreateOffers';
import CreatePackages from './Screens/CreatePackages';
import CreateService from './Screens/CreateService';
import AddCategory from './Screens/AddCategory';
import Comments from './Screens/Comments';
import MultipleImage from './Screens/MultipleImage';
import EditOffer from './Screens/EditOffer';
import EditPackage from './Screens/EditPackage';
import EditService from './Screens/EditService';
import AddPackageCategory from './Screens/AddPackageCategory';
import NewPost from './Components/NewPost';
import ChangeLocation from './Screens/ChangeLocation';
import OneSignal from 'react-native-onesignal';
import EditComment from './Screens/EditComment';
import OfferProduct from './Screens/OfferProduct';
import CategoryChange from './Screens/CategoryChange';
import SingleFeed from './Screens/SingleFeed';
import Notifications from './Screens/Notifications';
import Answer1 from './Screens/Answer1';
import Answer2 from './Screens/Answer2';
import Answer3 from './Screens/Answer3';
import Answer4 from './Screens/Answer4';
import Answer5 from './Screens/Answer5';
import Loading from './Screens/Loading';
import ChangeSubCategory from './Screens/ChangeSubCategory';
import ShopTiming from './Screens/ShopTiming';
import {AuthContext } from './AuthContextProvider';
import ChangeShopTime from './Screens/ChangeShopTime';
import SplashScreen from 'react-native-splash-screen';
import NoInternet from './Screens/NoInternet';
import VendorReviews from './Screens/VendorReviews';
import EditCategory from './Screens/EditCategory';
import ListingDashboardItems from './Screens/ListingDashboardItems';
import TopDeals from './Screens/TopDeals';
import VerifyVoucher from './Screens/VerifyVoucher';
import VoucherDetails from './Screens/VoucherDetails';
import CashbackHistory from './Screens/CashbackHistory';
import Tables from './Screens/Tables';
import OtherCharges from './Screens/OtherCharges';
import TableView from './Screens/TableView';
import ProductVariants from './Screens/ProductVariants';
import GenerateBill from './Screens/GenerateBill';
import Wallet from './Screens/Wallet';
import OnlinePayment from './Screens/OnlinePayment';
import ProductDetails from './Screens/ProductDetails';
import Subscription from './Screens/Subscription';
import ChoosePaymentType from './Screens/ChoosePaymentType';
import PaymentSuccessful from './Screens/PaymentSuccessful';
import PaymentFailed from './Screens/PaymentFailed';
import Orders from './Screens/Orders';
import OrderDetails from './Screens/OrderDetails';
import { LogBox } from 'react-native';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

LogBox.ignoreLogs(['Setting a timer']);

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("49e49fa7-d31e-42d9-b1d5-536c4d3758cc");
//END OneSignal Init Code


//Prompt for push on iOS
if(Platform.OS === 'ios')
{
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    // console.log("Prompt response:", response);
  });
}

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  let notification = notificationReceivedEvent.getNotification();

  const data = notification.additionalData

  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
});

//Navigators
const Tab = createBottomTabNavigator();
const Stacks = createStackNavigator();

global.google_key = "AIzaSyBbEZPYEYtC9sMCTjvDdM1LmlzpibLXOIc";

//for production
// global.vendor_api = "https://dine-api.weazy.in/api/";
//global.qr_link = "https://dine-api.weazy.in"


//for local 
// global.vendor_api = "http://172.16.1.111:8000/api/";

//for demo 
global.vendor_api = "https://beta-dine-api.weazy.in/api/";
global.image_url = "";
global.qr_link = ""

global.login_data = true
global.msg = "Welcome"

global.shareLink = "https://myweazy.com";


class TabNav extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, tintColor }) => {
            let iconName;
            if (route.name == "Dine-In") {
              return (
                <Image source={require('./img/icons/feeds.png')}
                  style={{ width: 25, height: 25, marginTop: 5, tintColor: focused ? "" : color }} />
              )
            }
            else if (route.name == "Products") {
              return (
                <Image source={require('./img/icons/services.png')}
                  style={{ width: 22, height: 22, marginTop: 5, tintColor: focused ? "" : color }} />
              )
            }
            else if (route.name == "Home") {
              return (
                <Image source={require('./img/icons/logo.png')}
                  style={{ width: 30, height: 30, marginTop: 5, tintColor: focused ? "" : color }} />
              )
            }
            // else if (route.name == "Offers") {
            //   return (
            //     <Image source={require('./img/icons/offers.png')}
            //       style={{ width: 22, height: 22, marginTop: 5, tintColor: focused ? "#EDA332" : color }} />
            //   )
            // }
            else if (route.name == "Orders") {
              return (
                <Image source={require('./img/icons/orders.png')}
                  style={{ width: 22, height: 22, marginTop: 5, tintColor: focused ? "" : color }} />
              )
            }
            else if (route.name == "More") {
              return (
                <Image source={require('./img/icons/more.png')}
                  style={{ width: 22, height: 22, marginTop: 5, tintColor: focused ? "" : color }} />
              )
            }
            return (
              <Icon name={iconName} color={color} type="ionicon" size={22} />
            )
          }
        })}
        tabBarOptions={{
          labelPosition: "below-icon",
          activeTintColor: "#EDA332",
          inactiveTintColor: "#c0c0c0",
          style: {
            backgroundColor: "white",
            height: Platform.OS == "android" ? 60 : 90,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          },

          labelStyle: {
            fontSize: 12,
            paddingBottom: 5,
          },
        }}>

        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Dine-In" component={Tables} />
        <Tab.Screen name="Products" component={TopTab} />
        <Tab.Screen name="Orders" component={Orders} />
        {/* <Tab.Screen name="Offers" component={Offers} /> */}
        <Tab.Screen name="More" component={More} />

      </Tab.Navigator>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: true,
      islogin: true,
      step: 'done',
      netconnected: true,
      user:[],
      token:'',
    }
  }

  componentDidMount() {

    NetInfo.addEventListener(state => {
      this.handleConnectivityChange(state.isConnected);
    });

   
    Linking.getInitialURL().then((url) => {

      if(url != null && url != undefined && url != ""){
        Linking.openURL(url);
      }
  }).catch(err => console.error('An error occurred', err));
  
    AsyncStorage.getItem('@auth_login', (err, result) => {
0
      if (JSON.parse(result) != null) {
        
        // global.token = JSON.parse(result).token;
        // global.vendor = JSON.parse(result).vendor_id;
        // global.step = this.state.step
        global.msg = "Welcome Back"
        this.setState({token:JSON.parse(result).token});
        this.get_profile(JSON.parse(result).token);
      }
      else {
        this.logout();
      }
    });

  }
  
  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ netconnected: true });
    } else {
      // alert("Oops!! No Internet Connection Available");
      this.setState({ netconnected: false });
    }
  };

  login = (step,user,token) => {
    // console.log("hhh",user)
    this.setState({ islogin: true, step: step,user:user,token:token });
    SplashScreen.hide();

    OneSignal.sendTag("id", '' + user.id);
    OneSignal.sendTag("account_type", "vendor-bmguj1sfd77232927ns");

    window.Pusher = Pusher;
     // console.log(Pusher);
      window.Echo = new Echo({
          broadcaster: 'pusher',
          key: "b8ba8023ac2fc3612e90",
          cluster: "mt",
          wsHost:'websockets.webixun.com',
          wsPort: 6001,
          forceTLS: false,
         disableStats: true,
          authEndpoint: global.vendor_api+'broadcasting/auth',
          auth: {
            headers: {
              Accept: 'application/json',
              "Authorization":token,
            }
          },
      });
  }

  logout = () => {
    this.setState({ islogin: false,token:'',user:[] });
    SplashScreen.hide();
  }

  get_profile = (token) => {

    fetch(global.vendor_api + 'get_vendor_profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({

      })
    }).then((response) => response.json())
      .then((json) => {
        // console.warn(json);
        if (json.message == "Unauthenticated.") {
          this.loggedOut();
        }
        if (!json.status) {
          this.logout();
        }
        else {
         this.login(json.step,json.data[0],token);

          json.data.map(value => {
            // alert(value.category_type)
            global.category_type = value.category_type
          })
        }

        // global.vendor = this.state.id,
        //   global.pic = this.state.image,
        //   global.name = this.state.name
        return json;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isloading: false })

      });
  }

  loggedOut = () => {
    fetch(global.vendor_api + 'logout_vendor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({

      })
    }).then((response) => response.json())
      .then((json) => {
        OneSignal.sendTag("id", '' + json.usr);
        OneSignal.sendTag("acount_type", "vendor");
        AsyncStorage.setItem('@auth_login', '')
        global.token = null;
        //  Toast.show("Logout Successfully!")
        this.logout();

      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isLoading: false })
      });

  }

  render() {
    if (!this.state.netconnected) {
      return (<NoInternet />)
    }
    else {
      return (
        <>
         <StatusBar backgroundColor="#222" barStyle="dark-content" />
        <AuthContext.Provider value={{ login: this.login, logout: this.logout,user:this.state.user,token:this.state.token }}>
          <NavigationContainer linking={linking}>
            <Stacks.Navigator >
              {!this.state.islogin ? (
                <>
                  <Stacks.Screen options={{ headerShown: false }} name="MobileLogin" component={MobileLogin} />
                  <Stacks.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }} />
                  {/* <Stacks.Screen options={{headerShown: false}} name="PasswordLogin" component={PasswordLogin}/> */}

                </>
              )
                :
                (
                  (this.state.islogin && this.state.step == 'steps') ?
                    <>
                      <Stacks.Screen name="CreateShopProfile" component={CreateShopProfile} options={{ headerShown: false }} />
                      <Stacks.Screen name="ShopTiming" component={ShopTiming} options={{ headerShown: false }} />
                      <Stacks.Screen name="VerificationDone" component={VerificationDone} options={{ headerShown: false }} />
                      

                    </>
                    :
                    // User is signed in  
                    <>
                      <Stacks.Screen name="TabNav" component={TabNav} options={{ headerShown: false }} />
                      <Stacks.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                      <Stacks.Screen name="ChangeSubCategory" component={ChangeSubCategory} options={{ headerShown: false }} />
                      <Stacks.Screen name="ChangeShopTime" component={ChangeShopTime} options={{ headerShown: false }} />
                      <Stacks.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
                      <Stacks.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }} />
                      <Stacks.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answers" component={Answers} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answer1" component={Answer1} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answer2" component={Answer2} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answer3" component={Answer3} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answer4" component={Answer4} options={{ headerShown: false }} />
                      <Stacks.Screen name="Answer5" component={Answer5} options={{ headerShown: false }} />
                      <Stacks.Screen name="CreateOffers" component={CreateOffers} options={{ headerShown: false }} />
                      <Stacks.Screen name="CreateService" component={CreateService} options={{ headerShown: false }} />
                      <Stacks.Screen name="CreatePackages" component={CreatePackages} options={{ headerShown: false }} />
                      <Stacks.Screen name="AddCategory" component={AddCategory} options={{ headerShown: false }} />
                      <Stacks.Screen name="Comments" component={Comments} options={{ headerShown: false }} />
                      <Stacks.Screen name="MultipleImage" component={MultipleImage} options={{ headerShown: false }} />
                      <Stacks.Screen name="ChangeLocation" component={ChangeLocation} options={{ headerShown: false }} />
                      <Stacks.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
                      <Stacks.Screen name="EditCategory" component={EditCategory} options={{ headerShown: false }} />
                      <Stacks.Screen name="EditService" component={EditService} options={{ headerShown: false }} />
                      <Stacks.Screen name="EditPackage" component={EditPackage} options={{ headerShown: false }} />
                      <Stacks.Screen name="AddPackageCategory" component={AddPackageCategory} options={{ headerShown: false }} />
                      <Stacks.Screen name="EditOffer" component={EditOffer} options={{ headerShown: false }} />
                      <Stacks.Screen name="NewPost" component={NewPost} options={{ headerShown: false }} />
                      <Stacks.Screen name="EditComment" component={EditComment} options={{ headerShown: false }} />
                      <Stacks.Screen name="OfferProduct" component={OfferProduct} options={{ headerShown: false }} />
                      <Stacks.Screen name="SingleFeed" component={SingleFeed} options={{ headerShown: false }} />
                      <Stacks.Screen name="Notification" component={Notifications} options={{ headerShown: false }} />
                      <Stacks.Screen name="CategoryChange" component={CategoryChange} options={{ headerShown: false }} />
                      <Stacks.Screen name="VendorReviews" component={VendorReviews} options={{ headerShown: false }} />
                      <Stacks.Screen name="ListingDashboardItems" component={ListingDashboardItems} options={{ headerShown: false }} />
                      <Stacks.Screen name="TopDeals" component={TopDeals} options={{ headerShown: false }} />
                      <Stacks.Screen name="VerifyVoucher" component={VerifyVoucher} options={{ headerShown: false }} />
                      <Stacks.Screen name="VoucherDetails" component={VoucherDetails} options={{ headerShown: false }} />
                      <Stacks.Screen name="CashbackHistory" component={CashbackHistory} options={{ headerShown: false }} />
                      <Stacks.Screen name="TableView" component={TableView} options={{ headerShown: false }} />
                      <Stacks.Screen name="OtherCharges" component={OtherCharges} options={{ headerShown: false }} />
                      <Stacks.Screen name="GenerateBill" component={GenerateBill} options={{ headerShown: false }} />
                      <Stacks.Screen name="ProductVariants" component={ProductVariants} options={{ headerShown: false }} />
                      <Stacks.Screen name="AddCover" component={AddCover} options={{ headerShown: false }} />
                      <Stacks.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
                      <Stacks.Screen name="OnlinePayment" component={OnlinePayment} options={{ headerShown: false }} />
                      <Stacks.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
                      <Stacks.Screen name="Subscription" component={Subscription} options={{ headerShown: false }} />
                      <Stacks.Screen name="ChoosePaymentType" component={ChoosePaymentType} options={{ headerShown: false }} />
                      <Stacks.Screen name="PaymentSuccessful" component={PaymentSuccessful} options={{ headerShown: false }} />
                      <Stacks.Screen name="PaymentFailed" component={PaymentFailed} options={{ headerShown: false }} />
                      <Stacks.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
                    </>
                )
              }
            </Stacks.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
        </>

      );

    }

  }
}

export default codePush(App);