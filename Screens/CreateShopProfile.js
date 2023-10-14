import React, { Component } from 'react';
import {
    View, TouchableOpacity,
    StyleSheet, Text,
    Image, ActivityIndicator, ScrollView, Dimensions, Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Input } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import moment from 'moment';
import { AuthContext } from '../AuthContextProvider.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Global StyleSheet Import
const styles = require('../Components/Style.js');


const options = {
    title: "Pick an Image",
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}
class CreateShopProfile extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            name: "",
            shopName: "",
            mail: "",
            shopDescription: "",
            msg: "",
            isloading: false,
            data: "",
            image: '',
            image_load: '',
            whatsapp_number: "",
            website: "",
            icon: "square-outline",
            whatsapp:false,
            contact:''
        };
    }

    componentDidMount =()=> {
        this.get_profile();
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
                if(json.message=="Unauthenticated.")
                {
                  this.get_profile();
                }
                
                if (!json.status) {
                    
                }
                else {

                    this.setState({ data: json.data });
                    var value= json.data[0];

                        this.setState({ name: value.name })
                        this.setState({ shopName: value.shop_name })
                        this.setState({ mail: value.email })
                        this.setState({ contact: value.contact })
                        this.setState({ shopDescription: value.description })
                        this.setState({ website: value.website });
                       
                        if(value.contact == value.whatsapp)
                        {
                           this.whatsapp();
                        }
              

                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isLoading: false })

            });
    }
    // Create profile button
    vendor_registration = () => {
      
        // let nameValidation=/^[a-zA-Z" "]+$/;
        // let isValid=nameValidation.test(this.state.name);        
        this.setState({ msg: "" });
        if (this.state.name == "" || this.state.shopName == "" || this.state.shopDescription == "") {
            Toast.show("All fields are required !");
        }
        else if (this.state.shopName == "") {
            Toast.show("Enter your Shop name!");
        }
        else if(this.state.name == ""){
            Toast.show("Enter your name!");
        }
        // else if(!isValid)
        // {
        //     Toast.show("Enter a valid name!");
        // }
        else {
            this.setState({ isloading: true });
            var name = this.state.name;
            var mail = this.state.mail;
            var shopName = this.state.shopName;
            var shopDescription = this.state.shopDescription
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
                    description: shopDescription,
                    whatsapp:this.state.whatsapp_number,
                    website:this.state.website

                })
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        Toast.show(json.msg)

                    }
                    else {
                        this.props.navigation.navigate("ShopTiming")
                    }

                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ isloading: false })
                });
        }
    }

    whatsapp=()=>{
        if(this.state.icon=="square-outline"){
        this.setState({ icon: "checkbox-outline",whatsapp:!this.state.whatsapp })
           this.setState({whatsapp_number:this.state.contact});
        }
        else{
            this.setState({ icon: "square-outline",whatsapp:!this.state.whatsapp })
            this.setState({whatsapp_number:''});
        }
    }



    render() {
        return (
            <View style={styles.container}>
                <ScrollView>



                    {/* <Steps /> */}

                    <Text style={[styles.h4, { alignSelf: "center", fontFamily: "Roboto-Medium", marginTop: 40 }]}>
                        Step 1 of 4
                    </Text>

                    {/* heading */}
                    <Text style={[styles.heading, { marginLeft: 20, marginTop: 10, alignSelf: "center" }]}>Fill Shop Details</Text>

                    {/* View for fields */}
                    <View>

                    <View style={{ paddingLeft: 10, marginTop: 20 }}>
                            <Text style={style.fieldsText}>Name*</Text>
                            <Input
                                maxLength={60}
                                value={this.state.name}
                                onChangeText={(e) => { this.setState({ name: e }) }}
                                style={{
                                    fontSize: RFValue(11, 580),
                                    color: "black",
                                    borderWidth:1,
                                    borderRadius:5,
                                    borderColor:'#5d5d5d',
                                    marginTop:10,
                                }}
                                inputContainerStyle={{
                                    width: Dimensions.get("window").width / 1.12,
                                }} />
                        </View>
                        <View style={{ paddingLeft: 10}}>
                            <Text style={style.fieldsText}>Shop Name*</Text>
                            <Input
                                maxLength={60}
                                value={this.state.shopName}
                                onChangeText={(e) => { this.setState({ shopName: e }) }}
                                style={{
                                    fontSize: RFValue(11, 580),
                                    color: "black",
                                    borderWidth:1,
                                    borderRadius:5,
                                    borderColor:'#5d5d5d',
                                    marginTop:10,
                                }}
                                inputContainerStyle={{
                                    width: Dimensions.get("window").width / 1.12,
                                }} />
                        </View>

                        
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={style.fieldsText}>Shop Description*</Text>
                            <Input
                                maxLength={500}
                                multiline={true}
                                value={this.state.shopDescription}
                                onChangeText={(e) => { this.setState({ shopDescription: e }) }}
                                style={{
                                    fontSize: RFValue(11, 580),
                                    color: "black",
                                    borderWidth:1,
                                    borderRadius:5,
                                    borderColor:'#5d5d5d',
                                    marginTop:10,
                                }}
                                inputContainerStyle={{
                                    width: Dimensions.get("window").width / 1.12,
                                }} />
                        </View>
                        {this.state.whatsapp ? null :
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={style.fieldsText}>Whatsapp Number (Optional)</Text>
                                <Input
                                    value={this.state.whatsapp_number}
                                    maxLength={10}
                                    keyboardType="numeric"
                                    onChangeText={(e) => { this.setState({ whatsapp_number: e }) }}
                                    style={{
                                        fontSize: RFValue(11, 580),
                                    color: "black",
                                    borderWidth:1,
                                    borderRadius:5,
                                    borderColor:'#5d5d5d',
                                    marginTop:10,
                                    }}
                                    inputContainerStyle={{
                                        width: Dimensions.get("window").width / 1.12,
                                    }} />
                            </View>
                        }
                        <View style={{ flexDirection: "row", marginLeft: 20 }}>
                            <Icon name={this.state.icon} type="ionicon" size={20} onPress={() => this.whatsapp()} />
                            <Text style={[styles.h6, { marginLeft: 7, marginTop: 2 }]}>
                                Is registered number is your whatsapp number?
                            </Text>
                        </View>
                    </View>

                    {/* Continue Button */}
                    {!this.state.isloading ?
                        <View>
                            <TouchableOpacity
                                onPress={() => this.vendor_registration()}
                                style={[styles.buttonStyles, {width:'90%', marginBottom: 15, marginTop: 25, alignSelf: "center" }]}>
                                <LinearGradient
                                     colors={['#5BC2C1', '#296e84']}
                                    style={[styles.signIn]}>

                                    <Text style={[styles.textSignIn, {
                                        color: '#fff'
                                    }]}>
                                        Next
                                    </Text>

                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={style.loader}>
                            <ActivityIndicator size={"large"} color="#5BC2C1" />
                        </View>
                    }


                </ScrollView>
            </View>
        )
    }
}

export default CreateShopProfile;


{/* Step to complete profiles */ }
class Steps extends Component {
    render() {
        return (
            <View style={{ flexDirection: "row", marginHorizontal: 15, marginVertical: 20 }}>

                <View style={style.activestep}>

                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.step}>
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.step}>
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.step}>
                </View>
                <View style={style.stepBorder}>
                </View>
                <View style={style.step}>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    icon: {
        margin: 10
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 100,
        // borderWidth:1,
        borderColor: "#000",
        alignSelf: "center",
    },
    fieldsText: {
        fontSize: RFValue(11, 580),
        fontFamily: "Raleway-SemiBold",
        color: "grey",
        marginLeft: 10
    },
    Text: {
        position: "absolute",
        fontSize: RFValue(18, 580),
        marginLeft: 80,
        fontFamily: "Raleway-Medium"
    },
    activestep: {
        width: 25,
        height: 25,
        // backgroundColor:"#5BC2C1",
        borderColor: "#5BC2C1",
        borderWidth: 1,
        borderRadius: 50
    },
    step: {
        width: 25,
        height: 25,
        backgroundColor: "#d3d3d3",
        borderRadius: 50
    },
    stepBorder: {
        width: 60,
        borderTopWidth: 1,
        marginTop: 13,
        borderColor: "#696969"
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})