import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AuthContext } from "../AuthContextProvider.js";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from "react-native-simple-toast";
import OneSignal from "react-native-onesignal";


//Global StyleSheet Import
const styles = require('../Components/Style.js');



class AccessDenied extends Component {
    static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
        }
    }

    logOut = () => {
        fetch(global.vendor_api + 'logout_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({})
        }).then((response) => response.json()).then((json) => {
            OneSignal.sendTag("id", '' + json.usr);
            OneSignal.sendTag("acount_type", "vendor");
            AsyncStorage.setItem('@auth_login', '')
            this.context.token = null;
            Toast.show("Logout Successfully!")
            this.context.logout();

        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            this.setState({ isLoading: false })
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/access-denied.png')} style={{ height: 250, width: 300, marginTop: 40, alignSelf: "center" }} />

                <Text style={[styles.h2, { textAlign: "center", color: "red", fontFamily:"Raleway-Bold" }]}>Access Denied</Text>

                <Text style={[styles.h3, { textAlign: "center", marginTop: 10, paddingHorizontal:10 }]}>Only the owner of 
                <Text style={{color:'#296E84', textDecorationLine:"underline"}}> {this.context.user.shop_name}</Text> can access with this number.</Text>

                <TouchableOpacity
                    style={style.buttonStyles}
                    onPress={() => this.logOut()}>
                    <LinearGradient
                        colors={['#5BC2C1', '#296E84']}
                        style={[styles.signIn,{borderRadius:10}]}>

                        <Text style={[styles.textSignIn, {
                            color: '#fff'
                        }]}>Logout</Text>

                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

export default AccessDenied;

const style = StyleSheet.create({
    buttonStyles: {
        width: "35%",
        alignSelf: "center",
        marginTop: 50,
        marginRight: 5,
        marginBottom: Platform.OS === 'ios' ? 30 : 20,
    }
});