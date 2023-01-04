import React, { Component } from 'react';
import {
  Text, View, ScrollView,
  StyleSheet, Image, StatusBar,
  TouchableOpacity, Linking, Dimensions, SafeAreaView, Platform
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class Home extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      data: "",
      image_load: false,
      isloading: true,
      id: "",
      covers: [],
      image: "",
      step: 0,
      per: 0,
      cover_load: true,
      cover_step: true,
      image_loade: true,
      link: "",
      gstin: "",
      image_loade: true,
      status: true,
      // subscription:true,
      remove_last_slash_and_word: "",
    };


  }

  componentDidMount = () => {



    // this.setState({subscription:false});

    this.get_profile();
    this.get_cover();
    this.checkBankDetails();
    var remove_last_slash_and_word = global.vendor_api
      .split('/')
      .slice(0, -2)
      .join('/')
      .concat('/');
    this.setState({ remove_last_slash_and_word: remove_last_slash_and_word });
    console.warn(remove_last_slash_and_word)
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.get_profile();
      this.get_cover();
      this.checkBankDetails();
      var remove_last_slash_and_word = global.vendor_api
        .split('/')
        .slice(0, -2)
        .join('/')
        .concat('/');
      this.setState({ remove_last_slash_and_word: remove_last_slash_and_word });
    })


  }

  checkBankDetails = () => {
    fetch(global.vendor_api + "fetch_bank_account_vendor", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.context.token
      },
    }).then((response) => response.json())
      .then((json) => {
        this.setState({ buttonLoading: true });
        if (json != null && json != '') {
          this.setState({ status: false })
        }
        else {
          this.setState({ status: true })
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }


  get_profile = () => {
    fetch(global.vendor_api + 'get_vendor_profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.context.token
      }
    }).then((response) => response.json())
      .then((json) => {
        if (!json.status) {

        }
        else {
          this.setState({ data: json.data })
          this.setState({ id: json.data.id })
          this.setState({ link: json.link })
          json.data.map(value => {
            this.setState({ step: value.step });
            if (value.step == 2) {
              this.setState({ per: 0.8 })
            }
            else if (value.step == 1) {
              this.setState({ per: 0.9 })
            }
            else {
              this.setState({ per: 1 })
            }

            this.setState({ image: value.profile_pic })

            if (value.profile_pic == "" || value.profile_pic == null) {
              this.setState({ image_loade: false })
            }
            this.setState({ id: value.id })
            this.setState({ name: value.name, gstin: value.gstin })
            global.category_type = value.category_type
          })
        }
        global.vendor = this.state.id,
          global.pic = this.state.image,
          global.name = this.state.name
        return json;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isloading: false })

      });
  }

  get_cover = () => {
    fetch(global.vendor_api + 'get_cover_vendor', {
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
        }
        else {
          if (json.covers.length == 0) {
            this.setState({ cover_step: false })
          }
          else {
            this.setState({ cover_step: true })
          }
          this.setState({ covers: json.covers })

        }

        return json;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isloading: false, cover_load: false })

      });
  }

  share_whatsapp = (link, name) => {
    Linking.openURL('whatsapp://send?text=Hey there!\n\n Now you can order online from ' + name + ' using this link: \n' + link).catch(e => Toast.show("WhatsApp is not installed in your device"));
  }

  //for header center component
  renderCenterComponent() {
    return (
      <></>
      // <View style={{ width: Dimensions.get('window').width / 1.02, padding: 5, right: 10 }}>
      //   <Text style={{ color: '#222', fontSize: RFValue(18, 580), fontWeight: 'bold', alignSelf: "center" }}>Welcome To Weazy Dine</Text>
      // </View>

    )
  }

  //for right component
  renderRightComponent() {
    return (
      <View style={{ padding: 5, right: 5, marginTop: 5, flexDirection: "row" }}>
        <TouchableOpacity 
        onPress={() => Linking.openURL(this.state.remove_last_slash_and_word + "qr-shop/" + this.context.user.id)}
        style={{ backgroundColor: "#ececec", height: 35, width: 35, borderRadius: 50, justifyContent: "center", marginLeft: 5, }}>
          <Icon name='qr-code-outline' type='ionicon' size={20} color='#5BC2C1' />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: "#ececec", height: 35, width: 35, borderRadius: 50, justifyContent: "center", marginLeft: 5, }}
          onPress={() => this.props.navigation.navigate("Notification")}>
          <Icon name='notifications' type='ionicon' size={20} color='#5BC2C1' />
        </TouchableOpacity>
      </View>
    )
  }

  //for right component
  renderLeftComponent() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Image source={
            require('../img/logo/mp.png')
          }
            style={
              {
                width: 55,
                height: 55,
                // marginTop:-5
              }
            } />
        </View>
        <View style={{ width: Dimensions.get('window').width / 1.02, padding: 5, left: 0 }}>
          <Text style={[styles.h3, { color: '#222', fontSize: RFValue(16, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>{this.context.user.name} </Text>
          <Text>Welcome to WeazyDine</Text>
        </View>
      </View>
    )
  }

  render() {

    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={[styles.container, { backgroundColor: "#fff" }]}>

          {Platform.OS == 'ios' ?
            <>


              <View style={{
                flexDirection: 'row', borderBottomColor: '#ececec',
                borderBottomWidth: 1, marginTop: 10
              }}>
                <View>
                  <Image source={
                    require('../img/logo/mp.png')
                  }
                    style={
                      {
                        width: 70,
                        height: 70,
                        marginTop: -5
                      }
                    } />
                </View>
                <View style={{ width: Dimensions.get('window').width / 1.45, padding: 5, left: 0 }}>
                  <Text style={[styles.h3, { color: '#222', fontSize: RFValue(16, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>{this.context.user.name} </Text>
                  <Text>Welcome to WeazyDine</Text>
                </View>

                <TouchableOpacity style={{ backgroundColor: "#ececec", height: 30, width: 30, borderRadius: 50, justifyContent: "center", marginTop: 10 }}
                  onPress={() => this.props.navigation.navigate('Notification')}>
                  <Icon name="notifications" size={20} type="ionicon" color="#5BC2C1" />
                </TouchableOpacity>
              </View>


            </>
            :
            <>

              <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                centerComponent={this.renderCenterComponent()}
                rightComponent={this.renderRightComponent()}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                  colors: ['#fff', '#fff'],
                  start: { x: 0, y: 0.5 },
                  end: { x: 1, y: 0.5 },
                }}
                containerStyle={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderBottomColor: '#ececec',
                  borderBottomWidth: 1,
                  marginTop: 10
                }}
                backgroundColor="#ffffff"
              />
            </>
          }

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* for account details */}
            {this.state.isloading ?
              <SkeletonPlaceholder>
                <View style={[style.viewBox, { height: 80 }]} />
              </SkeletonPlaceholder>
              :
              <>
                {this.state.status ?
                  <>
                    <TouchableOpacity style={{
                      width: Dimensions.get('window').width / 1.05, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5, marginTop: 20, borderRadius: 10, padding: 10
                    }} onPress={() => { this.props.navigation.navigate("OnlinePayment") }} >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: '20%', paddingTop: 5, }}>
                          <Image source={require('../img/bank.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 10 }} />
                        </View>
                        <View style={{ width: '80%', paddingTop: 10, paddingBottom: 10 }}>
                          <Text style={{ fontSize: RFValue(12, 580), fontFamily: "Roboto-Bold" }}>Add Your Bank Account Details</Text>
                          <Text style={{ fontSize: RFValue(10, 580), fontFamily: "Roboto-Regular", marginTop: 2 }}>Add your bank account details to receive online payments.</Text>

                        </View>

                      </View>

                    </TouchableOpacity>
                  </>
                  :
                  <></>
                }
              </>
            }


            {/* for cover photo */}
            {this.state.isloading ?
              <SkeletonPlaceholder>
                <View style={[style.viewBox, { height: 80 }]} />
              </SkeletonPlaceholder>
              :
              <>
                {(!this.state.cover_step) ?
                  <TouchableOpacity style={{
                    width: Dimensions.get('window').width / 1.05, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5, marginTop: 20, borderRadius: 10, padding: 10
                  }} onPress={() => { this.props.navigation.navigate("MultipleImage") }} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <View style={{ width: '20%', paddingTop: 5, }}>
                        <Image source={require('../img/photo.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 10 }} />
                      </View>
                      <View style={{ width: '80%', paddingTop: 10, paddingBottom: 10 }}>
                        <Text style={{ fontSize: RFValue(12, 580), fontFamily: "Roboto-Bold" }}>Upload Your First Cover Picture</Text>
                        <Text style={{ fontSize: RFValue(10, 580), fontFamily: "Roboto-Regular", marginTop: 2 }}>Upload your cover picture to showcase your profile good to your customers</Text>

                      </View>

                    </View>

                  </TouchableOpacity>
                  :
                  <></>
                }
              </>
            }

            {/* Component for business and flat discounts */}
            <Demo navigation={this.props.navigation} />

            {/* share more to earn */}
            <View style={{
              width: Dimensions.get('window').width / 1.05, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4, marginBottom: 10,
              elevation: 5, marginTop: 20, borderRadius: 10, padding: 10,
            }}>
              <Text style={[styles.h3]}>Share More to Earn More </Text>
              <Text style={[styles.p, { fontFamily: "Raleway-SemiBold" }]}>Your customer can visit your online store and place the orders from this link</Text>
              <View style={{ flexDirection: 'row', width: Dimensions.get('window').width / 1.05 }}>
                <View style={{ width: "50%" }}>
                  <Text numberOfLines={3} style={[styles.p, { marginTop: 15, fontFamily: "Raleway-SemiBold" }]}>{this.state.link}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <TouchableOpacity onPress={() => { this.share_whatsapp(this.state.link, this.state.name) }} style={[styles.catButton, { backgroundColor: "#25d366", width: 100, padding: 5, alignSelf: 'flex-end', borderRadius: 5, marginLeft: 10, marginTop: 20 }]}>
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                      <MaterialCommunityIcons name="whatsapp" color={"#fff"} type="ionicon" size={20} />
                      <Text style={[style.buttonText, { color: "#fff", marginLeft: 3, marginTop: -1 }]}>Share</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </ScrollView>

          {/* {this.state.subscription ?
          <></>
        :
        <View style={{position:"absolute",bottom:0,backgroundColor:"#5BC2C1",
        width:Dimensions.get('window').width,height:50,flexDirection:"row",justifyContent:"space-evenly"
        }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Subscription")}
           style={{width:"80%",justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"white",fontSize:RFValue(12,580),fontFamily:"Poppins-SemiBold"}}>
              Your trial will end in 12 Days!
            </Text>
          </TouchableOpacity>
          <View style={{width:"20%",justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity style={{backgroundColor:"#fff",borderRadius:100,
              width:30, height:30,justifyContent:"center"}} onPress={()=>{this.setState({subscription:true})}}>
              <Icon size={18} type="ionicon" name="close" />
            </TouchableOpacity>
          </View>

        </View>} */}
        </View>
      </SafeAreaView>


    )
  }
}



export default Home;



const style = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: RFValue(11, 580),
    // paddingLeft:10,
    fontFamily: "Roboto-Regular",
  },
  mainContainer: {
    backgroundColor: "#fff",
    flex: 1,
    // top:-50,
    // position:"absolute",
    width: "100%",
    height: "100%",
    marginTop: -330,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  viewBox: {
    width: Dimensions.get('window').width / 1.05,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 50,
      height: 50
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    backgroundColor: "#5BC2C1",
    flexDirection: "row",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

})