import React, { Component } from 'react';
import {
    StyleSheet, Text,
    View, Dimensions, Image, Pressable,
    ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform
} from 'react-native';
import { Input, Header, Icon } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthContext } from '../AuthContextProvider.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

const options = {
    title: "Pick an Image",
    storageOptions:{
        skipBackup: true,
        path:'images'
    }
  }
  

class Profile extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            shopName: "",
            contact: "",
            mail: "",
            description: "",
            isLoading: true,
            buttonloading: false,
            token: '',
            data: {},
            openTime: "HH:MM",
            isOpenVisible: false,
            isCloseVisible: false,
            closeTime: "HH:MM",
            website: "",
            whatsapp: "",
            image_load:false,
            image:''
        };
    }

    // Function for Open time picker
    showOpenPicker = () => {
        // alert("hi");
        this.setState({
            isOpenVisible: true
        })
    }

    handleOpenPicker = (time) => {
        if (this.state.openTime == "HH:MM") {
            this.setState({ openTime: this.state.openTime })
        }
        this.setState({
            isOpenVisible: false,
            openTime: moment(time).format('hh:mm A')
        })
    }

    hideOpenPicker = () => {
        this.setState({
            isOpenVisible: false
        })
    }

    // Function for closing time picker
    showClosePicker = () => {
        // alert("hi");
        this.setState({
            isCloseVisible: true
        })
    }

    handleClosePicker = (time) => {
        if (this.state.closeTime == "HH:MM") {
            this.setState({ closeTime: this.state.closeTime })
        }
        this.setState({
            closeTime: false,
            closeTime: moment(time).format('hh:mm A')
        })
    }

    hideClosePicker = () => {
        this.setState({
            isCloseVisible: false
        })
    }
    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ width: win.width, flexDirection: "row" }} >
                <Icon name="arrow-back-outline" type="ionicon"
                    onPress={() => this.props.navigation.goBack()} style={{ top: 3 }} />
                <Text style={[styles.h3, { paddingLeft: 15 }]}>Edit Profile</Text>
            </View>
        )
    }
    componentDidMount = async () => {
        this.get_profile()
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

  //function to upload image
upload_image = () =>
{
    this.RBSheet.close()
    this.setState({image_load:true});
    var form = new FormData();
    if(this.state.image != '')
    {
        var photo = {
            uri: this.state.image,
            type: 'image/jpeg',
            name: 'aakash.jpg',
          };
          form.append("update_profile_picture", photo);  
    }
    // form._parts.map(value=>{
    //     console.warn(value)
    // })
    
      fetch(global.vendor_api+'update_profile_picture_vendor', { 
        method: 'POST',
        body: form,
          headers: {  
            'Content-Type': 'multipart/form-data', 
            'Authorization':this.context.token
               }, 
                }).then((response) => response.json())
                        .then((json) => {
                            console.warn(json)
                            if(json.status){
                                this.setState({photo:json.profile_pic})
                               this.get_profile();
                            }  
                            
                            return json
                       }).catch((error) => {  
                               console.error(error);   
                               
                            }).finally(() => {
                                this.setState({image_load:false});
                            });
}


    get_profile = () => {
        fetch(global.vendor_api + 'get_vendor_profile', {
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
                    var msg = json.msg;
                    Toast.show(msg);
                }
                else {
                    this.setState({ data: json.data })
                    json.data.map(value => {
                        // alert(value.website)
                        if (value.whatsapp != null) {
                            this.setState({ whatsapp: value.whatsapp.toString() })
                        }
                        this.setState({ name: value.name })
                        this.setState({ shopName: value.shop_name })
                        this.setState({ mail: value.email })
                        this.setState({ contact: value.contact, website: value.website, })
                        this.setState({ description: value.description, image: value.profile_pic })


                    })

                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isLoading: false })

            });
    }

    save = () => {
        let numberValidation = /^[0]?[6789]\d{9}$/;
        let isnumValid = numberValidation.test(this.state.whatsapp);
        this.setState({ msg: "" });
        if (this.state.name == "" || this.state.contact == "" || this.state.mail == "" || this.state.mail == null
            || this.state.name == null) {
            Toast.show("All fields are required !");
        }
        else if (this.state.shopName == "") {
            Toast.show("Enter your Shop Name!");
        }
        else if (!isnumValid && this.state.whatsapp != '') {
            Toast.show("Enter valid contact number!");
        }
        else {

            this.setState({ buttonloading: true });
            var name = this.state.name;
            var mail = this.state.mail;
            var contact = this.state.contact;
            var shopName = this.state.shopName;
            var description = this.state.description


            fetch(global.vendor_api + 'update_profile_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                    email: mail,
                    name: name,
                    shop_name: shopName,
                    contact: contact,
                    description: description,
                    whatsapp: this.state.whatsapp,
                    website: this.state.website,

                })
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {

                        Toast.show(json.errors[0])
                    }
                    else {
                        Toast.show(json.msg);
                        this.props.navigation.navigate("More")

                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ buttonloading: false })
                    try {
                        AsyncStorage.setItem("name", this.state.name)
                    } catch (e) {
                        Toast.show(e)
                    }
                });
        }

    }

    render() {
        const { data } = this.state;
        return (
            <View style={[styles.container, { flex: 1, height: "100%" }]} >

                <View>
                    <Header
                        statusBarProps={{ barStyle: 'dark-content' }}
                        leftComponent={this.renderLeftComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        }}
                        backgroundColor="#ffffff"
                    />
                </View>
                <ScrollView>
                    <View style={{ borderTopWidth: 2, borderColor: "#f5f5f5", flex: 1 }}>
                        {this.state.isLoading ?
                            <View >
                                <Loader />
                            </View>
                            :

                            <View style={style.container2}>

                                <View style={{ marginTop: 10 }}>
                                    {
                                        this.state.image == null || this.state.image == ""?
                                        <Image source={require('../img/upload.png')} style={style.image} />
                                        :
                                        <Image source={{ uri: this.state.image }} style={style.image} />
                                    }

                                    <Pressable onPress={() => this.RBSheet.open()} style={style.camIcon}>
                                        <Icon type="ionicon" name="camera" size={20} color="#000" />
                                    </Pressable>


                                    {/* Bottom Sheet for Camera */}
                                    <RBSheet
                                        ref={ref => {
                                            this.RBSheet = ref;
                                        }}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        height={150}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20
                                            },
                                            wrapper: {
                                                // backgroundColor: "transparent",
                                                borderWidth: 1
                                            },
                                            draggableIcon: {
                                                backgroundColor: "grey"
                                            }
                                        }}
                                    >
                                        {/* bottom sheet elements */}
                                        <View>

                                            {/* Bottom sheet View */}
                                            <View style={{ width: "100%", padding: 20 }}>
                                                <TouchableOpacity onPress={this.camera}>
                                                    <Text style={style.iconPencil}>
                                                        <Icon name='camera' type="ionicon" color={'#5BC2C1'} size={25} />
                                                    </Text>
                                                    <Text style={style.Text}>Take a picture</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={this.gallery} >
                                                    <Text style={style.iconPencil}>
                                                        <Icon name='folder' type="ionicon" color={'#5BC2C1'} size={25} />
                                                    </Text>
                                                    <Text style={style.Text}>Select from library</Text>
                                                </TouchableOpacity>

                                            </View>

                                        </View>
                                    </RBSheet>


                                </View>
                                <View style={{ paddingLeft: 10, marginTop: 20 }}>
                                    <Text style={style.fieldsText}>Name*</Text>
                                    <Input
                                        style={style.inputText}
                                        value={this.state.name}
                                        onChangeText={(e) => { this.setState({ name: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>
                                <View style={{ paddingLeft: 10, }}>
                                    <Text style={style.fieldsText}>Shop Name* </Text>
                                    <Input
                                        style={style.inputText}
                                        value={this.state.shopName}
                                        onChangeText={(e) => { this.setState({ shopName: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>
                                <View style={{ paddingLeft: 10, }}>
                                    <Text style={style.fieldsText}>Contact Number* </Text>
                                    <Input
                                        style={style.inputText}
                                        value={this.state.contact}
                                        onChangeText={(e) => { this.setState({ contact: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }}
                                        editable={false}
                                    />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={style.fieldsText}>Email Address*</Text>
                                    <Input
                                        style={style.inputText}
                                        value={this.state.mail}
                                        onChangeText={(e) => { this.setState({ mail: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={style.fieldsText}>Website (Optional)</Text>
                                    <Input
                                        style={style.inputText}
                                        value={this.state.website}
                                        onChangeText={(e) => { this.setState({ website: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>

                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={style.fieldsText}>Shop Description* </Text>
                                    <Input
                                        style={style.inputText}
                                        multiline={true}
                                        value={this.state.description}
                                        onChangeText={(e) => { this.setState({ description: e }) }}
                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>
                                <View style={{ paddingLeft: 10, }}>
                                    <Text style={style.fieldsText}>Whatsapp Number (Optional)</Text>
                                    <Input
                                        value={this.state.whatsapp}
                                        style={style.inputText}
                                        maxLength={10}

                                        keyboardType="numeric"
                                        onChangeText={(e) => { this.setState({ whatsapp: e }) }}

                                        inputContainerStyle={{
                                            width: Dimensions.get("window").width / 1.12,
                                        }} />
                                </View>





                            </View>
                        }

                    </View>

                    {this.state.isLoading ?
                        null :
                        <>
                            {!this.state.buttonloading ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this.save()}
                                        style={[style.buttonStyles, { bottom: Platform.OS == "ios" ? 25 : 15 }]}>
                                        <LinearGradient
                                            colors={['#5BC2C1', '#296E84']}
                                            style={styles.signIn}>

                                            <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                                Save</Text>

                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={style.loader}>
                                    <ActivityIndicator size={"large"} color="#5bc2c1" />
                                </View>
                            }
                        </>

                    }
                </ScrollView>

            </View>
        )
    }
}

export default Profile;

class Loader extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder>

                    <View style={{ height: 120, width: 120, borderRadius: 100, alignSelf: "center", marginTop: 10 }} />
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>
                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>

                    <View style={style.questView} >
                        <View style={{ flexDirection: "row" }}>
                            <View style={style.Icon} />
                            <View style={{ width: 372, marginTop: 12, marginLeft: 20, height: 70 }} />
                        </View>
                    </View>



                </SkeletonPlaceholder>

            </View>
        )
    }
}

const style = StyleSheet.create({
    container2: {
        width: "100%",
    },
    fieldsText: {
        fontSize: RFValue(11, 580),
        fontFamily: "Montserrat-SemiBold",
        color: "grey",
        marginLeft: 10
    },
    inputText: {
        fontSize: RFValue(12, 580),
        fontFamily: "Montserrat-Regular",
        color: "black",
        marginTop: -7
        // marginLeft:10
    },
    buttonStyles: {
        width: "60%",
        alignSelf: "center",
        marginTop: 35,
        marginRight: 5
    },
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(16, 580),
        margin: 5
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center",
        bottom: 10
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 50,
        alignSelf: "center"
    },
    camIcon: {
        top: 90, 
        right: 150,
        backgroundColor: "#dcdcdc",
        height: 35, 
        width: 35, 
        padding: 5, 
        alignContent: "center",
        borderRadius: 30, 
        justifyContent: "center",
        position:"absolute"
    },
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10
    },
    Text:{
        position:"absolute",
        fontSize:RFValue(15,580),
        marginLeft:80,
        fontFamily:"Raleway-Medium"
    },

})