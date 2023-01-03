import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, TextInput,
    Dimensions, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
import { AuthContext } from '../AuthContextProvider.js';
import SelectDropdown from 'react-native-select-dropdown';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const role = ["Admin", "Manager", "Waiter", "Staff"]

class AddStaffAccount extends Component {
    static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            buttonLoading: false,
            staff_contact: '',
            staff_name: '',
            staff_role: '',

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
                <Text style={style.text}>Add Staff Account</Text>
            </View>

        )
    }


    add_staff = () => {
        const { staff_contact, staff_name, staff_role } = this.state;
        if (staff_contact == '' || staff_name == '' || staff_role == '') {
            Toast.show('Please fill all the fields');
        } else {
            this.setState({ buttonLoading: true });
            fetch(global.vendor_api + 'add_staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.context.token,
                },
                body: JSON.stringify({
                    staff_contact: staff_contact,
                    staff_name: staff_name,
                    staff_role: staff_role,
                }),
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.status) {
                        Toast.show("Staff Added Successfully");
                        this.props.navigation.goBack();
                        this.setState({ buttonLoading: false });
                    } else {
                        this.setState({ buttonLoading: false });
                        Toast.show(json.message);
                    }
                })
                .catch((err) => {
                    // toast.error('Something went wrong');
                    // this.setState({ newaddonLoading: false });
                });
        }
    };

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
                <View style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3" }}>
                    <ScrollView>
                        {/* staff name */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Staff Name
                            </Text>
                            <Input
                                placeholder='Enter Staff Name'
                                returnKeyType='done'
                                value={this.state.staff_name}
                                onChangeText={(e) => { this.setState({ staff_name: e }) }}
                                containerStyle={style.inputText}
                                style={{ fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580) }}
                                inputContainerStyle={{
                                    width: Dimensions.get("window").width / 1.05, borderColor: 'transparent',
                                }}
                            />
                        </View>

                        {/* staff contact */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Staff Contact Number
                            </Text>
                            <Input
                                returnKeyType='done'
                                value={this.state.staff_contact}
                                onChangeText={(e) => { this.setState({ staff_contact: e }) }}
                                placeholder='Enter Staff Contact Number'
                                containerStyle={style.inputText}
                                keyboardType="numeric"
                                maxLength={10}
                                style={{ fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580) }}
                                inputContainerStyle={{
                                    width: Dimensions.get("window").width / 1.05, borderColor: 'transparent',
                                }}
                            />
                        </View>

                        {/* staff role */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Staff Role
                            </Text>
                            <SelectDropdown
                                data={role}
                                onSelect={(selectedRole, index) => {
                                    if(selectedRole == "Admin"){
                                        this.setState({ staff_role: "admin" })
                                    }
                                    else if(selectedRole == "Manager"){
                                        this.setState({ staff_role: "manager" })
                                    }
                                    else if(selectedRole == "Waiter"){
                                        this.setState({ staff_role: "waiter" })
                                    }
                                    else if(selectedRole == "Staff"){
                                        this.setState({ staff_role: "staff" })
                                    }
                                }}
                                buttonTextAfterSelection={(selectedRole, index) => {
                                    return selectedRole
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                                buttonTextStyle={{
                                    fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580), color: "#000",
                                    position: "absolute", right: 10, top: 10
                                }}
                                buttonStyle={style.inputText}
                                renderDropdownIcon={() => {
                                    return (
                                        <Icon name="chevron-down" type="ionicon" />
                                    )
                                }}

                            />
                        </View>

                        {/* add button */}
                        {
                            this.state.buttonLoading ?
                                <View style={style.loader}>
                                    <ActivityIndicator size={"large"} color="#5BC2C1" />
                                </View>
                                :
                                <TouchableOpacity onPress={() => this.add_staff()} >
                                    <LinearGradient
                                        style={style.uploadButton} colors={['#5BC2C1', '#296e84']}>

                                        <Text style={style.buttonText}>
                                            Add
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                        }

                    </ScrollView>
                </View>
            </View>
        )
    }
}

export default AddStaffAccount;

const style = StyleSheet.create({
    fieldsTitle: {
        fontFamily: "Montserrat-SemiBold",
        // color:"grey",
        fontSize: RFValue(12, 580),
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
        marginTop: 5,
        width: Dimensions.get("window").width / 1.1,
        height: 50,
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        color: '#000',
        paddingLeft: 15,
        shadowColor: "#000",
        backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5

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