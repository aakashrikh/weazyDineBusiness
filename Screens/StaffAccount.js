import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View, Alert,
    StyleSheet, Pressable,
    Image, Text
} from 'react-native';
import { Icon, Header } from 'react-native-elements'
import Toast from 'react-native-simple-toast';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from '../AuthContextProvider.js';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

//Global Style Import
const styles = require('../Components/Style.js')

class StaffAccount extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            add_data: [],
            isloading: false
        }
    }

    componentDidMount = async () => {
        this.fetch_staff();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetch_staff();

        })
    }

    fetch_staff = () => {
        this.setState({ isloading: true });
        fetch(global.vendor_api + 'fetch_staff', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
        })
            .then((res) => res.json())
            .then((json) => {
                console.warn(json);
                if (json.status) {
                    this.setState({ add_data: json.data, isloading: false });
                } else {
                    this.setState({ isloading: false });
                }
            })
            .catch((err) => {
                this.setState({ isloading: false });
            });
    };

    alertFunc = (id) => {
        Alert.alert(
            "",
            "Are you sure you want to delete this Staff Account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_staff(id) }
            ]
        )
    }

    delete_staff = (id) => {
        fetch(global.vendor_api + 'delete_staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                staff_id: id,
            }),
        })
            .then((res) => res.json())
            .then((json) => {
                console.warn(json);
                if (json.status) {
                    this.fetch_staff();
                    Toast.show("Staff Account Deleted Successfully");
                } else {
                    Toast.show(json.msg);
                }
            })
            .catch((err) => {
                // toast.error('Something went wrong');
                // this.setState({ newaddonLoading: false });
            });
    };

    edit = (id,name,contact,role) => {
        this.props.navigation.navigate("EditStaffAccount", { id: id, name: name, contact: contact, role: role })
    }

    detailsCard = ({ item }) => (
        <View style={{ paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", borderWidth: 1, marginTop: 5, borderColor: "#d3d3d3", width: "97%", alignSelf: "center", borderRadius: 10, alignItems: "center" }}>
            <View style={{ width: "70%" }}>
                <Text style={styles.h4} numberOfLines={2}>{item.staff_name}</Text>
                <Text style={[styles.h5, { fontFamily: "Raleway-Bold" }]} >{item.staff_role}</Text>
                <Text style={[styles.h5, { fontFamily: "Poppins-SemiBold" }]} numberOfLines={2}>{item.staff_contact}</Text>

            </View>
            {
                item.staff_role != "owner" ?
                    <View style={{ flexDirection: "row", width: "27%" }} >
                        <Pressable style={[style.uploadButton, { marginRight: 15, backgroundColor: "#f2f2f2" }]} onPress={() => this.edit(item.staff_id,
                            item.staff_name,item.staff_contact,item.staff_role )} >
                            <Icon type="ionicon" name="create-outline" />
                        </Pressable>
                        <Pressable style={style.uploadButton} onPress={() => this.alertFunc(item.staff_id)} >
                            <Icon type="ionicon" name="trash-outline" color="#ff0000" />
                        </Pressable>
                    </View>
                    :
                    <></>
            }
        </View>
    );

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
                <Text style={[style.text, { fontFamily: "Raleway-SemiBold" }]}>Manage Staff Account</Text>
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    centerComponent={this.renderCenterComponent()}
                    leftComponent={this.renderLeftComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['white', 'white'],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    backgroundColor="#ffffff"
                />
                {!this.state.isloading ?
                    (this.state.add_data != "") ?
                        <FlatList
                            navigation={this.props.navigation}
                            showsVerticalScrollIndicator={false}
                            data={this.state.add_data}
                            renderItem={this.detailsCard}
                            keyExtractor={item => item.id}
                        />
                        :
                        <View style={{ paddingTop: 120, alignItems: "center" }}>
                            <View style={{ alignSelf: "center" }}>
                                <Image source={require("../img/noAccount.webp")}
                                    style={{ width: 250, height: 250 }} />
                                <Text style={[styles.h3, { top: 20, alignSelf: "center" }]}>
                                    No Staff Accounts Found!
                                </Text>
                            </View>
                        </View>

                    :
                    <View >
                        <Loader />
                    </View>
                }

                <TouchableOpacity style={style.fab}
                    onPress={() => this.props.navigation.navigate("AddStaffAccount", { fetch_staff: this.fetch_staff })}>
                    <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{ alignSelf: "center" }} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default StaffAccount;


class Loader extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder>
                    <View style={style.questView} >
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                        <View style={{ width: 360, marginTop: 12, marginLeft: 17, height: 80, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>

            </View>
        )
    }
}

const style = StyleSheet.create({
    text: {
        fontFamily: "Roboto-Bold",
        // fontSize:20,
        fontSize: RFValue(14.5, 580),
        margin: 5,
    },
    uploadButton: {
        backgroundColor: "#ff000017",
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",

    },
    fab: {
        backgroundColor: "#5BC2C1",
        borderRadius: 100,
        height: 50,
        width: 50,
        bottom: 10,
        right: 10,
        // alignSelf:"flex-end",
        // margin:20,
        justifyContent: "center",
        position: "absolute"
    },
})