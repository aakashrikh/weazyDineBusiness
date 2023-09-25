import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Platform, Dimensions, TouchableOpacity,
    ActivityIndicator, Switch, ScrollView
} from 'react-native';
import { Input, Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
import { AuthContext } from '../AuthContextProvider.js';
import RadioForm from 'react-native-simple-radio-button';

var radio_props = [
    { label: 'inclusive', value: 'inclusive' },
    { label: 'exclusive', value: 'exclusive' }
];
//Global StyleSheet Import
const styles = require('../Components/Style.js');
class OtherCharges extends Component {
    static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            isloading: true,
            data: [],
            table_load: false,
            gst: true,
            sc: true,
            gstin: '',
            gstper: '',
            scamount: '',
            gst_type: ''
        };

    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ top: 5 }}>
                <Icon type="ionicon" name="arrow-back-outline"
                    onPress={() => { this.props.navigation.goBack() }} />
            </View>
        )
    }

    //for header center component
    renderCenterComponent() {
        return (
            <View>
                <Text style={style.text}>Other Charges</Text>
            </View>

        )
    }

    componentDidMount() {
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
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                }
                else {
                    const value = json.data[0];

                    // alert(value.website)

                    if (value.gstin == null) {
                        this.setState({ gst: false });
                    }

                    if (value.service_charge == '') {
                        this.setState({ sc: false });
                    }

                    this.setState({ gstin: value.gstin })
                    this.setState({ scamount: value.service_charge })
                    this.setState({ gstper: value.gst_percentage })
                    this.setState({ gst_type: value.gst_type })



                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isLoading: false })

            });
    }

    update_profile = () => {
        var gstin = this.state.gstin;
        var gst_percentage = this.state.gstper;
        var service_charge = this.state.scamount;

        let rjx = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
        let isValid = rjx.test(gstin);
        if (this.state.gst == false) {
            gstin = '';
            gst_percentage = 0;
        }
        if (this.state.sc == false) {
            service_charge = 0;
        }
        if (this.state.gst && this.state.gstin == "") {
            gstin = "";
            Toast.show("GSTIN is required!");
        }
        else if (this.state.gst && this.state.gstper == "") {
            gst_percentage = 0;

            Toast.show("GST Percentage is required!");
        }
        // else if (this.state.sc && this.state.scamount == "") {
        //     Toast.show("Service Charge is required!");
        //     alert(gstin)
        //     service_charge = 0;
        // }
        else if (!isValid) {
            Toast.show("GST format is not valid!");

            alert(gstin)
        }
        else {
            this.setState({ table_load: true });
            fetch(global.vendor_api + 'update_other_charges_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                    gstin: gstin,
                    gst_percentage: gst_percentage,
                    service_charge: service_charge,
                    gst_type: this.state.gst_type
                })
            }).then((response) => response.json())
                .then((json) => {
                    console.warn(json)
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg);
                        this.props.navigation.goBack();
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ table_load: false });
                });


        }

    }

    update_toggle = () => {
        if (this.state.gst) {
            this.setState({ gst: false })
        }
        else {
            this.setState({ gst: true })
        }
    }

    update_toggle2 = () => {
        if (this.state.sc) {
            this.setState({ sc: false })
        }
        else {
            this.setState({ sc: true })
        }
    }


    render() {

        return (
            <View style={styles.container}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'dark-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                        backgroundColor="#ffffff"
                    />
                </View>
                <ScrollView>
                    <View style={{ marginBottom: 10, marginTop: 10, borderRadius: 20, borderTopWidth: 1, borderColor: "#d3d3d3" }}>
                        <View style={{
                            width: '95%', backgroundColor: '#fff', alignSelf: 'center', padding: 10,
                            shadowColor: "#000", backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000", borderRadius: 5,
                            shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5
                        }}>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Text style={[styles.h3, { width: '80%' }]}>GST</Text>

                                <Switch
                                    trackColor={{ false: "#d3d3d3", true: '#5BC2C1' }}
                                    thumbColor={"white"}
                                    value={this.state.gst}
                                    onValueChange={() => this.update_toggle()}
                                />
                            </View>
                            {(this.state.gst) ?
                                <View>
                                    <View style={{ paddingLeft: 10, marginTop: 20 }}>
                                        <Text style={style.fieldsText}>GSTIN </Text>
                                        <Input

                                            placeholder='GSTIN / GST Number'
                                            style={style.inputText}
                                            value={this.state.gstin}
                                            autoCapitalize={true}
                                            returnKeyType='done'
                                            onChangeText={(e) => { this.setState({ gstin: e }) }}
                                            inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.3,
                                            }} />
                                    </View>

                                    <View style={{ paddingLeft: 10, marginTop: 10 }}>
                                        <Text style={style.fieldsText}>GST Percentage</Text>
                                        <Input
                                            placeholder='GST %'
                                            style={style.inputText}
                                            value={this.state.gstper.toString()}
                                            keyboardType="numeric"
                                            returnKeyType='done'
                                            onChangeText={(e) => { this.setState({ gstper: e }) }}
                                            inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.3,
                                            }} />
                                    </View>

                                    <View style={{ marginTop: 20, alignSelf: 'center' }}>
                                        <RadioForm
                                            formHorizontal={true}
                                            radio_props={radio_props}
                                            animation={true}
                                            initial={this.state.gst_type == "inclusive" ? 0 : 1}
                                            buttonColor={'#5BC2C1'}
                                            selectedButtonColor={'#5BC2C1'}
                                            labelHorizontal={false}
                                            labelStyle={{ marginRight: 10, marginLeft: 10 }}
                                            onPress={(value) => {
                                                this.setState({ gst_type: value })
                                            }}
                                        />
                                    </View>
                                </View>
                                :
                                <></>
                            }

                        </View>



                    </View>

                    <View style={{ borderRadius: 10, borderTopWidth: 1, borderColor: "#d3d3d3", paddingBottom: 10 }}>
                        <View style={{
                            width: '95%', backgroundColor: '#fff', alignSelf: 'center', padding: 10,
                            shadowColor: "#000", backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000", borderRadius: 5,
                            shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, marginTop: 20
                        }}>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Text style={[styles.h3, { width: '80%' }]}>Service Charge</Text>

                                <Switch
                                    trackColor={{ false: "#d3d3d3", true: '#5BC2C1' }}
                                    thumbColor={"white"}
                                    value={this.state.sc}
                                    onValueChange={() => this.update_toggle2()}
                                />
                            </View>
                            {(this.state.sc) ?
                                <View>
                                    <View style={{ paddingLeft: 10, marginTop: 10 }}>
                                        <Text style={style.fieldsText}>Server Charge Percentage</Text>
                                        <Input
                                            placeholder='Service Charge %'
                                            style={style.inputText}
                                            value={this.state.scamount.toString()}
                                            keyboardType="numeric"
                                            returnKeyType='done'
                                            onChangeText={(e) => { this.setState({ scamount: e }) }}
                                            inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.3,
                                            }} />
                                    </View>
                                </View>
                                :
                                <></>
                            }

                        </View>



                    </View>

                    {(!this.state.table_load) ?
                    <View style={{ width: '100%', height: 50, backgroundColor: '#fff', marginTop:50}}>
                        <TouchableOpacity
                            // onPress={this.send_otp}
                            onPress={() => { this.update_profile() }}
                            style={[styles.buttonStyle, { bottom: Platform.OS == "ios" ? 25 : 15 }]}>
                            <LinearGradient
                                colors={['#5BC2C1', '#296e84']}
                                style={[styles.signIn, { borderRadius: 25, width: '80%', alignSelf: 'center' }]}>

                                <Text style={[styles.textSignIn, {
                                    color: '#fff'
                                }]}>Save Changes</Text>

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
                                                       

export default OtherCharges;

const style = StyleSheet.create({
    fieldsTitle: {
        fontFamily: "Raleway-Regular",
        // color:"grey",
        fontSize: RFValue(14, 580),
        padding: 10,
        paddingLeft: 20

    },
    textInput: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        color: "#5d5d5d",
        //   backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 5,
        width: Dimensions.get("window").width / 1.1,
        height: 40,
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: RFValue(11, 580),
    },
    uploadButton: {
        backgroundColor: "#5BC2C1",
        width: 105,
        height: 40,
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        alignSelf: "center",
        alignItems: "center",
        // marginLeft:20,
        marginTop: 20
    },
    buttonText: {
        fontFamily: "Raleway-SemiBold",
        color: "#fff",
        fontSize: RFValue(14, 580)
    },
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5
    },
    inputText: {
        fontSize: RFValue(12, 580),
        fontFamily: "Poppins-Regular",
        color: "black",
        // marginLeft:10
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        shadowRadius: 50,
        elevation: 5,
        alignSelf: 'center',
        backgroundColor: "#fff",
        width: 40,
        height: 40,
        borderRadius: 50,
        padding: 5,
        marginBottom: 10
    },
})
