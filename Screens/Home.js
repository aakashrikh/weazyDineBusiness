import React, { Component } from 'react';
import {
    Text, View, ScrollView,
    StyleSheet, Image, Pressable, ActivityIndicator, 
    TouchableOpacity, ImageBackground, Linking, Dimensions, SafeAreaView
} from 'react-native';
import { Icon, LinearProgress } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Accordion } from 'react-native-paper/lib/typescript/components/List/List.js';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
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
        };
    }


    //function to launch camera
    camera = () => {

        launchCamera(options, (response) => {

            if (response.didCancel) {
                // console.warn(response)
                console.warn("User cancelled image picker");
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else {
                console.warn(response)
                const source = { uri: response.assets.uri };
                let path = response.assets.map((path) => {
                    return (
                        this.setState({ image: path.uri })
                    )
                });
                this.upload_image();
            }
        })
    }


    //function to launch gallery
    gallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            compressImageQuality: 0.5
        }).then(image => {
            this.setState({ image: image.path });
            this.upload_image();
        })
    }

    componentDidMount = async () => {
        // alert(global.vendor)
        this.get_profile()
        this.get_cover()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_profile()
            this.get_cover()
        })
    }

    get_profile = () => {
        fetch(global.vendor_api + 'get_vendor_profile', {
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
                console.warn(json)
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

    //function to upload image
    upload_image = () => {
        this.RBSheet.close()
        this.setState({ image_load: true });
        var form = new FormData();
        if (this.state.image != '') {
            var photo = {
                uri: this.state.image,
                type: 'image/jpeg',
                name: 'aakash.jpg',
            };
            form.append("update_profile_picture", photo);
        }
        form._parts.map(value => {
            console.warn(value)
        })

        fetch(global.vendor_api + 'update_profile_picture_vendor', {
            method: 'POST',
            body: form,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': global.token
            },
        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (json.status) {
                    this.setState({ photo: global.image_url + json.profile_pic })
                    this.get_profile();
                }

                return json
            }).catch((error) => {
                console.error(error);

            }).finally(() => {
                this.setState({ image_load: false });
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
                console.warn(json)
                if (!json.status) {
                }
                else {
                    console.warn(json.covers.length)
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

    share_whatsapp = (link) => {
        Linking.openURL('whatsapp://send?text=Hey there! Sign-up on the MarketPluss app using my referral code and get ₹' + this.state.earner + ' \n\nDownload the app: ' + link).catch(e => Toast.show("WhatsApp is not installed in your device"));
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={[styles.container, { backgroundColor: "#fff" }]}>


                    <View style={style.header}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",width:"100%"}}>
                            <Text style={ { color: '#eee', fontSize: RFValue(18, 580), fontWeight: 'bold'}}>Welcome to Weazy Dine</Text>
                                <TouchableOpacity style={{ backgroundColor: "#fff", height: 30, width: 30, borderRadius: 50, justifyContent: "center",  }} 
                                onPress={() => this.props.navigation.navigate('Notifications')}>
                                    <Icon name="notifications" size={20} type="ionicon" color="#EDA332" />
                                </TouchableOpacity>
                        </View>
                    </View>



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
                    <ScrollView>

                    {this.state.isloading ?
                        <SkeletonPlaceholder>
                            <View style={[style.viewBox, { height: 80 }]} />
                        </SkeletonPlaceholder>
                        :
                        <>
                            {(!this.state.cover_step) ?
                                <TouchableOpacity style={[style.viewBox, { flexDirection: "row", justifyContent: "space-between" }]} onPress={() => { this.props.navigation.navigate("MultipleImage") }} >
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
                        <View style={style.viewBox}>
                            <Text style={{ color: '#000', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580) }}>Hi,
                                <Text style={{ color: 'rgba(233,149,6,1)', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10, marginLeft: 20 }}>
                                    {this.state.name}
                                </Text> </Text>
                            {this.state.gstin == "" || this.state.gstin == null ?
                                <></>
                                :
                                <Text style={{ color: '#000', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginTop: 10 }}>GSTIN :
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
                        shadowRadius: 4,
                        elevation: 5, marginTop: 20, borderRadius: 10, padding: 10
                    }}>
                        <Text style={[styles.h3]}>Share More to Earn More </Text>
                        <Text style={[styles.p, { fontFamily: "Raleway-SemiBold" }]}>Your customer can visit your online store and place the orders from this link</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.p, { marginTop: 15, fontFamily: "Raleway-SemiBold" }]}>{this.state.link}</Text>
                            <TouchableOpacity onPress={() => { this.share_whatsapp(this.state.link) }} style={[styles.catButton, { backgroundColor: "#25d366", width: 100, padding: 5, alignSelf: 'flex-end', borderRadius: 5, marginLeft: 10, marginTop: 10 }]}>
                                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                    <MaterialCommunityIcons name="whatsapp" color={"#fff"} type="ionicon" size={20} />
                                    <Text style={[style.buttonText, { color: "#fff", marginLeft: 3, marginTop: -1 }]}>Share</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* payment and payout */}
                    <View style={{
                        width: Dimensions.get('window').width / 1.05, height: 130, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5, marginTop: 20, borderRadius: 10, padding: 10
                    }}>
                        
                    </View>
                    </ScrollView>
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
    
})