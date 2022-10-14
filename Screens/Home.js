import React, { Component } from 'react';
import {
  Text, View, ScrollView,
  StyleSheet, Image, StatusBar,
  TouchableOpacity, Linking, Dimensions, SafeAreaView, Platform
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import { launchCamera } from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
    
//Global StyleSheet Import
const styles = require('../Components/Style.js');


const options = {
  title: "Pick an Image",
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

class Home extends Component {

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
      // subscription:true
    };

    
  }

  componentDidMount= ()=> {

    window.Echo.private(`checkTableStatus.1`).listen('.server.created', (e) => {
      alert(e.id);
  });


  //   // alert(global.vendor)
  //   // this.setState({subscription:false});

    this.get_profile();
    this.get_cover();
    this.checkBankDetails();
  //   this.focusListener = this.props.navigation.addListener('focus', () => {
  //     this.get_profile();
  //     this.get_cover();
  //     this.checkBankDetails();
  //   })

  
  }

  checkBankDetails = () => {
    fetch(global.vendor_api + "fetch_bank_account_vendor", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.token
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
        'Authorization': global.token
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
            // alert(value.category_type)
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
        'Authorization': global.token
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
      <View style={{ width: Dimensions.get('window').width / 1.02, padding: 5, right: 10 }}>
        <Text style={{ color: '#eee', fontSize: RFValue(18, 580), fontWeight: 'bold', alignSelf: "center" }}>Welcome To Weazy Dine</Text>
      </View>

    )
  }

  //for right component
  renderRightComponent() {
    return (
      <View style={{ padding: 5, right: 5 }}>
        <TouchableOpacity style={{ backgroundColor: "#fff", height: 30, width: 30, borderRadius: 50, justifyContent: "center", marginLeft: 5, }}
          onPress={() => this.props.navigation.navigate("Notification")}>
          <Icon name='notifications' type='ionicon' size={20} color='rgba(233,149,6,1)' />
        </TouchableOpacity>
      </View>
    )
  }

  render() {

    return (
  
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={[styles.container, { backgroundColor: "#fff" }]}>

          {Platform.OS == 'ios' ?
            <>
              <StatusBar backgroundColor="#fff" barStyle="dark-content" />
              <View style={style.header}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", paddingTop: 20 }}>
                  <Text style={{ color: '#eee', fontSize: RFValue(18, 580), fontWeight: 'bold' }}>Welcome to Weazy Dine</Text>
                  <TouchableOpacity style={{ backgroundColor: "#fff", height: 30, width: 30, borderRadius: 50, justifyContent: "center", }}
                    onPress={() => this.props.navigation.navigate('Notification')}>
                    <Icon name="notifications" size={20} type="ionicon" color="#EDA332" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
            :
            <>

              <Header
                statusBarProps={{ barStyle: 'light-content' }}
                centerComponent={this.renderCenterComponent()}
                rightComponent={this.renderRightComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                  colors: ['#EDA332', '#EDA332'],
                  start: { x: 0, y: 0.5 },
                  end: { x: 1, y: 0.5 },
                }}
                containerStyle={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              />
            </>
          }

          {/* <View style={style.header}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",width:"100%",paddingTop:20}}>
                            <Text style={ { color: '#eee', fontSize: RFValue(18, 580), fontWeight: 'bold'}}>Welcome to Weazy Dine</Text>
                                <TouchableOpacity style={{ backgroundColor: "#fff", height: 30, width: 30, borderRadius: 50, justifyContent: "center",  }} 
                                onPress={() => this.props.navigation.navigate('Notification')}>
                                    <Icon name="notifications" size={20} type="ionicon" color="#EDA332" />
                                </TouchableOpacity>
                        </View>
                    </View> */}

          {/* <View style={{ width: '100%', height: 100, backgroundColor: 'rgba(233,149,6,1)', flexDirection: "row", borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
                        <View style={{ width: '80%', paddingTop: 20 }}>
                            <Text style={[styles.heading, { color: '#eee', fontSize: RFValue(18, 580), fontWeight: 'bold', marginTop: 25, left: 20 }]}>Welcome to Weazy Dine</Text>
                        </View>
                        <View style={{ width: '20%', padding: 20, paddingTop: 30, }}>
                            <TouchableOpacity style={{ backgroundColor: "#fff", height: 30, width: 30, borderRadius: 50, justifyContent: "center", marginLeft: 5, marginTop: 17 }}>
                                <Icon name='notifications' type='ionicon' size={20} color='rgba(233,149,6,1)' />
                            </TouchableOpacity>
                        </View>
                    </View> */}

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

            {/* for profile photo */}
            {/* {this.state.isloading ?
                        <SkeletonPlaceholder>
                            <View style={[style.viewBox,{height:80}]} />
                        </SkeletonPlaceholder>
                        :
                        <>
                        {(!this.state.image_loade )?
                        <TouchableOpacity onPress={()=>this.RBSheet.open()} style={[style.cardView,{marginTop:15, borderWidth:1,borderRadius:10,borderColor:'#ececec', flexDirection:"row",justifyContent:"space-between",paddingTop:0,paddingBottom:0,paddingRight:0,marginLeft:20,marginRight:20}]}>
                            <View style={{width:'20%',paddingTop:5,}}>
                                <Image source={require('../img/user-2.png')} style={{width:50,height:50,marginLeft:10,marginTop:10}} />
                            </View>
                            <View style={{width:'80%',paddingTop:10,paddingBottom:10}}>
                              <Text style={{fontSize:RFValue(12,580),fontFamily:"Roboto-Bold"}}>Upload Your Profile Picture</Text>
                              <Text style={{fontSize:RFValue(10,580),fontFamily:"Roboto-Regular",marginTop:2}}>Upload your profile picture to showcase your profile good to your customers</Text>
                          
                            </View>
                            
                        </TouchableOpacity>
                          :
                          <></>
                        }
                        </>} */}


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


            {this.state.isloading ?
              <SkeletonPlaceholder>
                <View style={[style.viewBox, { height: 80 }]} />
              </SkeletonPlaceholder>
              :
              <View style={{
                width: Dimensions.get('window').width / 1.05, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5, marginTop: 20, borderRadius: 10, padding: 15
              }}>
                <Text style={{ color: '#000', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginRight: 5 }}>Hi,{" "}
                  <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10, }}>
                    {this.state.name}
                  </Text> </Text>
                {this.state.gstin == "" || this.state.gstin == null ?
                  <></>
                  :
                  <Text style={{ color: '#000', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginTop: 10 }}>GSTIN :{" "}
                    <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>{this.state.gstin}</Text>
                  </Text>
                }
              </View>}


            {/* Component for business and flat discounts */}
            <Demo navigation={this.props.navigation} />

            {/* share more to earn */}
            <View style={{
              width: Dimensions.get('window').width / 1.05, height: 130, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4, marginBottom: 10,
              elevation: 5, marginTop: 20, borderRadius: 10, padding: 10
            }}>
              <Text style={[styles.h3]}>Share More to Earn More </Text>
              <Text style={[styles.p, { fontFamily: "Raleway-SemiBold" }]}>Your customer can visit your online store and place the orders from this link</Text>
              <View style={{ flexDirection: 'row', width: Dimensions.get('window').width / 1.05 }}>
                <View style={{ width: "50%" }}>
                  <Text numberOfLines={2} style={[styles.p, { marginTop: 15, fontFamily: "Raleway-SemiBold" }]}>{this.state.link}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <TouchableOpacity onPress={() => { this.share_whatsapp(this.state.link, this.state.name) }} style={[styles.catButton, { backgroundColor: "#25d366", width: 100, padding: 5, alignSelf: 'flex-end', borderRadius: 5, marginLeft: 10, marginTop: 10 }]}>
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
        <View style={{position:"absolute",bottom:0,backgroundColor:"#EDA332",
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
  bannerImg: {
    height: "100%",
    width: "100%",
    // marginTop:10
  },
  child: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 5,
  },
  carousel: {
    width: "100%",
    borderRadius: 15,
    height: 200,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    // marginTop:5,
  },
  camIcon: {
    top: 60, right: 20, backgroundColor: "#dcdcdc",
    height: 30, width: 30, padding: 5, alignContent: "center",
    borderRadius: 30, justifyContent: "center"
  },

  editIcon: {
    position: "absolute",
    top: 40,
    right: 5, backgroundColor: "#dcdcdc",
    height: 30, width: 30, padding: 5, alignContent: "center",
    borderRadius: 30, justifyContent: "center"
  },
  iconPencil: {
    marginLeft: 20,
    fontSize: 20,
    marginBottom: 10
  },
  Text: {
    position: "absolute",
    fontSize: RFValue(15, 580),
    marginLeft: 80,
    fontFamily: "Raleway-Medium"
  },

  profileImg: {
    height: 85,
    width: 85,
    borderRadius: 100,
    // marginLeft:10
  },
  nameText: {
    color: '#fff',
    fontSize: RFValue(17, 580),
    // paddingLeft:0,
    fontFamily: "Raleway-Regular",
  },
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
  loader: {
    shadowOffset: { width: 50, height: 50 },
    marginBottom: 5,
    marginTop: 30,
    shadowRadius: 50,
    elevation: 5,
    backgroundColor: "#fbf9f9", width: 30, height: 30, borderRadius: 50, padding: 5, alignSelf: "center"
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
    backgroundColor: "#EDA332",
    flexDirection: "row",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  }

})