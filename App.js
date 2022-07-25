import React, { Component } from 'react';
import {Image, View,Text, Platform 
} from 'react-native';
import {Icon} from "react-native-elements";
import codePush from "react-native-code-push";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator} from '@react-navigation/stack';
import linking from './Components/Linking';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";
//Import screens 
import MobileLogin from './Screens/MobileLogin';
import OtpVerify from './Screens/OtpVerify';
import CreateShopProfile from './Screens/CreateShopProfile';
import EnableLocation from './Screens/EnableLocation';
import LocationAccess from './Screens/LocationAccess';
import LocationDetails from './Screens/LocationDetails';
import ChooseCategories from './Screens/ChooseCategory';
import AddCover from './Screens/AddCover';
import UnderVerification from './Screens/UnderVerification';
import VerificationDone from './Screens/VerificationDone';
import Home from './Screens/Home';
import TopTab from './Components/TopTab';
import Feeds from './Screens/Feeds';
import More from './Screens/More';
import Offers from './Screens/Offers'
import Shops from './Screens/Services';
import Profile from './Screens/Profile';
import PrivacyPolicy from './Screens/PrivacyPolicy';
import ContactUs from './Screens/ContactUs';
import AboutUs from './Screens/AboutUs';
import Answers from './Screens/Answers';
import CreateOffers from './Screens/CreateOffers';
import Demo from './Screens/Demo';
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
import UploadLogo from './Screens/UploadLogo';
import UploadCovers from './Screens/UploadCovers';
import Answer1 from './Screens/Answer1';
import Answer2 from './Screens/Answer2';
import Answer3 from './Screens/Answer3';
import Answer4 from './Screens/Answer4';
import Answer5 from './Screens/Answer5';
import Loading from './Screens/Loading';
import ChooseSubCategory from './Screens/ChooseSubCategory';
import ChangeSubCategory from './Screens/ChangeSubCategory';
import ShopTiming from './Screens/ShopTiming';
import {AuthContext} from './AuthContextProvider';
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
//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("797f6c8e-274b-4455-a7b8-41300ca5d882");

//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log("Prompt response:", response);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.warn("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.warn("OneSignal: notification opened:", notification.additionalData);
});



//Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Stacks = createStackNavigator();
const LogIn = createStackNavigator();

global.google_key="AIzaSyBbEZPYEYtC9sMCTjvDdM1LmlzpibLXOIc";
//for production
 global.vendor_api="http://10.0.2.2:8000/api/";
// global.image_url="https://api.marketpluss.com/";

//for demo
// global.vendor_api="http://172.20.10.3:8000/api/";
// global.vendor_api="https://beta-api.marketpluss.com/api/";
// global.image_url="https://beta-api.marketpluss.com/";
global.image_url=""

global.login_data=true
global.msg="Welcome"

global.shareLink="https://marketpluss.com";


class TabNav extends Component{
  render(){
    return(
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({route})=>({
        headerShown:false,
        tabBarIcon:({focused, color,tintColor})=>{
          let iconName;
          if(route.name=="Tables"){
            return(
              <Image source={require('./img/icons/feeds.png')} 
              style={{width:25,height:25,marginTop:5,tintColor: focused ? "": color}}/>
            )
          }
          else if(route.name=="Products"){
            return(
              <Image source={require('./img/icons/services.png')} 
              style={{width:22,height:22,marginTop:5,tintColor: focused ? "": color}}/>
            )
          }
          else if(route.name=="Home"){
            return(
              <Image source={require('./img/icons/mp.png')} 
              style={{width:23,height:23,marginTop:5,tintColor: focused ? "": color}}/>
            )
          }
          else if(route.name=="Offers"){
            return(
              <Image source={require('./img/icons/offers.png')} 
              style={{width:22,height:22,marginTop:5,tintColor: focused ? "": color}}/>
            )
          }
          else if(route.name=="More"){
            return(
              <Image source={require('./img/icons/more.png')} 
              style={{width:22,height:22,marginTop:5,tintColor: focused ? "": color}}/>
            )          }
          return(
            <Icon name={iconName} color={color} type="ionicon" size={22} />
          )
        }
      })}
      tabBarOptions={{
        labelPosition: "below-icon",
        activeTintColor: "#326bf3",
        inactiveTintColor:"#c0c0c0",
        style: {
        backgroundColor: "white",
        height:Platform.OS=="android" ? 60 : 90,
        borderTopLeftRadius:15,
        borderTopRightRadius:15
      },
      
      labelStyle: {
        fontSize: 14,
        paddingBottom:5,
      },
    }}>
        
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Tables" component={Tables}/>

        <Tab.Screen name="Products" component={TopTab}/>

        

        <Tab.Screen name="Offers" component={Offers}/>

        <Tab.Screen name="More" component={More}/>

      </Tab.Navigator>
    )
  }
}

class App extends Component{
  constructor(props){
    super(props);
    this.state={
        isloading:true,
        islogin:false,
        step:'done',
        netconnected:true
    }
}

componentDidMount(){

  NetInfo.addEventListener(state => {
    this.handleConnectivityChange(state.isConnected);
  });

   AsyncStorage.getItem('@auth_login', (err, result) => { 
    console.warn(result)
    if(JSON.parse(result)!=null){
      this.login(JSON.parse(result).use_type);
      global.token=JSON.parse(result).token;
      global.vendor=JSON.parse(result).vendor_id;
      global.step=this.state.step
      global.msg="Welcome Back"
      this.get_profile();
      setTimeout(() => {SplashScreen.hide(); }, 50)
    }
    else{
      this.get_profile();
      setTimeout(() => {SplashScreen.hide(); }, 50)
    }
});

}


handleConnectivityChange = isConnected => {
  if (isConnected) {
    this.setState({ netconnected:true });
  } else {
   // alert("Oops!! No Internet Connection Available");
    this.setState({ netconnected:false });
  }
};

login = (step) => 
  {
    this.setState({islogin:true,step:step});
  }

  logout = () =>
  {
    this.setState({islogin:false})
  }

  get_profile=()=>{
    fetch(global.vendor_api+'get_vendor_profile', { 
      method: 'POST',
        headers: {    
            Accept: 'application/json',  
              'Content-Type': 'application/json',
              'Authorization':global.token  
             }, 
              body: JSON.stringify({ 
    
                      })}).then((response) => response.json())
                      .then((json) => {
                        console.warn(json)
                        if(json.message=="Unauthenticated.")
                        {
                          this.loggedOut();
                        }
                          if(!json.status)
                          {
                              
                          }
                          else{
                              json.data.map(value=>{
                                // alert(value.category_type)
                                 global.category_type=value.category_type
                              })  
                          }
                          
                          global.vendor=this.state.id,
                          global.pic=this.state.image,
                          global.name=this.state.name
                         return json;    
                     }).catch((error) => {  
                             console.error(error);   
                          }).finally(() => {
                             this.setState({isloading:false})
    
                          });
  }

  loggedOut=()=>{
    fetch(global.vendor_api+'logout_vendor', { 
        method: 'POST',
          headers: {    
              Accept: 'application/json',  
                'Content-Type': 'application/json',
                'Authorization': global.token
               }, 
                body: JSON.stringify({ 

                        })}).then((response) => response.json())
                        .then((json) => {
                            OneSignal.sendTag("id",''+json.usr);
                            OneSignal.sendTag("acount_type","vendor"); 
                           AsyncStorage.setItem('@auth_login','')
                           global.token=null;
                          //  Toast.show("Logout Successfully!")
                           this.logout();
                             
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isLoading:false})
                            });
    
}

render(){
  if(!this.state.netconnected)
  {
    return(<NoInternet />)
  }
  else
  {
        return (
          <AuthContext.Provider value={{login:this.login,logout:this.logout}}>
            <NavigationContainer linking={linking}>
          <Stacks.Navigator >
        {!this.state.islogin ? (
          <>
          <Stacks.Screen options={{headerShown: false}} name="MobileLogin" component={MobileLogin}/>
          <Stacks.Screen name="OtpVerify" component={OtpVerify} options={{headerShown: false}}/>
        
          </>
           )
      : 
       ( 
         (this.state.islogin && this.state.step=='steps')?   
        <>
        <Stacks.Screen name="CreateShopProfile" component={CreateShopProfile} options={{headerShown: false}}/>
        <Stacks.Screen name="ShopTiming" component={ShopTiming} options={{headerShown: false}}/>
         
          {/* <Stacks.Screen name="EnableLocation" component={EnableLocation} options={{headerShown: false}}/> */}
          {/* <Stacks.Screen name="LocationAccess" component={LocationAccess} options={{headerShown: false}}/> */}
          {/* <Stacks.Screen name="LocationDetails" component={LocationDetails} options={{headerShown: false}}/> */}
          {/* <Stacks.Screen name="ChooseCategories" component={ChooseCategories} options={{headerShown: false}}/> */}
          {/* <Stacks.Screen name="UnderVerification" component={UnderVerification} options={{headerShown: false}}/> */}
          <Stacks.Screen name="VerificationDone" component={VerificationDone} options={{headerShown: false}}/>
          {/* <Stacks.Screen name="UploadLogo" component={UploadLogo} options={{headerShown:false}}/> */}
          {/* <Stacks.Screen name="UploadCovers" component={UploadCovers} options={{headerShown:false}}/> */}
          {/* <Stacks.Screen name="ChooseSubCategories" component={ChooseSubCategory} options={{headerShown: false}}/> */}
         

          </> 
         : 
         // User is signed in  
          <>  
         <Stacks.Screen name="TabNav" component={TabNav} options={{headerShown:false}}/>
          <Stacks.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
          <Stacks.Screen name="ChangeSubCategory" component={ChangeSubCategory} options={{headerShown: false}}/>
          <Stacks.Screen name="ChangeShopTime" component={ChangeShopTime} options={{headerShown: false}}/>
          <Stacks.Screen name="AboutUs" component={AboutUs} options={{headerShown:false}}/>

          <Stacks.Screen name="ContactUs" component={ContactUs} options={{headerShown:false}}/>

          <Stacks.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{headerShown:false}}/>

          <Stacks.Screen name="Answers" component={Answers} options={{headerShown:false}}/>
          <Stacks.Screen name="Answer1" component={Answer1} options={{headerShown:false}}/>
          <Stacks.Screen name="Answer2" component={Answer2} options={{headerShown:false}}/>
          <Stacks.Screen name="Answer3" component={Answer3} options={{headerShown:false}}/>
          <Stacks.Screen name="Answer4" component={Answer4} options={{headerShown:false}}/>
          <Stacks.Screen name="Answer5" component={Answer5} options={{headerShown:false}}/>

          <Stacks.Screen name="CreateOffers" component={CreateOffers} options={{headerShown:false}}/>

          <Stacks.Screen name="CreateService" component={CreateService} options={{headerShown:false}}/>

          <Stacks.Screen name="CreatePackages" component={CreatePackages} options={{headerShown:false}}/>
          <Stacks.Screen name="AddCategory" component={AddCategory} options={{headerShown:false}}/>

          <Stacks.Screen name="Comments" component={Comments} options={{headerShown:false}}/>
          <Stacks.Screen name="MultipleImage" component={MultipleImage} options={{headerShown:false}}/>
          <Stacks.Screen name="ChangeLocation" component={ChangeLocation} options={{headerShown:false}}/>
          <Stacks.Screen name="Loading" component={Loading} options={{headerShown:false}}/>
          <Stacks.Screen name="EditCategory" component={EditCategory} options={{headerShown:false}}/>
          <Stacks.Screen name="EditService" component={EditService} options={{headerShown:false}}/>
          <Stacks.Screen name="EditPackage" component={EditPackage} options={{headerShown:false}}/>
          <Stacks.Screen name="AddPackageCategory" component={AddPackageCategory} options={{headerShown:false}}/>
          
          <Stacks.Screen name="EditOffer" component={EditOffer} options={{headerShown:false}}/>
          <Stacks.Screen name="NewPost" component={NewPost} options={{headerShown:false}}/>
          <Stacks.Screen name="EditComment" component={EditComment} options={{headerShown:false}}/>
          <Stacks.Screen name="OfferProduct" component={OfferProduct} options={{headerShown:false}}/>
          <Stacks.Screen name="SingleFeed" component={SingleFeed} options={{headerShown:false}}/>
          <Stacks.Screen name="Notification" component={Notifications} options={{headerShown:false}}/>
          <Stacks.Screen name="CategoryChange" component={CategoryChange} options={{headerShown:false}}/>
          <Stacks.Screen name="VendorReviews" component={VendorReviews} options={{headerShown:false}}/>
          <Stacks.Screen name="ListingDashboardItems" component={ListingDashboardItems} options={{headerShown:false}}/>
          <Stacks.Screen name="TopDeals" component={TopDeals} options={{headerShown:false}}/>
          <Stacks.Screen name="VerifyVoucher" component={VerifyVoucher} options={{headerShown:false}}/>  
          <Stacks.Screen name="VoucherDetails" component={VoucherDetails} options={{headerShown:false}}/>
          <Stacks.Screen name="CashbackHistory" component={CashbackHistory} options={{headerShown:false}}/> 
          <Stacks.Screen name="TableView" component={TableView} options={{headerShown:false}}/> 
          <Stacks.Screen name="OtherCharges" component={OtherCharges } options={{headerShown:false}}/> 
               
   </>
      ) 
      }  

      </Stacks.Navigator>
      </NavigationContainer>
      </AuthContext.Provider>
          
      );
     
  }
    
  }
}

export default codePush(App);