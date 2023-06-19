import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, Linking, StatusBar, Modal,
    Dimensions, TouchableOpacity, FlatList, ActivityIndicator, Platform
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AuthContext } from '../AuthContextProvider.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Modal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const capacity = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "23", "24", "25"];

class Tables extends Component {

    static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            isloading: true,
            data: [],
            table_load: false,
            interval: '',
            capacity: "4",
            dinein_name: '',
            modalVisible: false,
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
                <Text style={style.text}>Dine-In Management</Text>
            </View>

        )
    }

    //for right component
    renderRightComponent() {
        return (
            <View>
                {(!this.state.table_load) ?
                    <TouchableOpacity style={{ backgroundColor: "#5BC2C1", padding: 5, borderRadius: 5 }}>
                        <Icon type="ionicon" name="add" size={30} color="#fff"
                            onPress={() => this.setState({ modalVisible: true })} />
                    </TouchableOpacity>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={"small"} color="#5BC2C1" />
                    </View>

                }
            </View>
        )
    }

    componentDidMount() {
        this.fetch_table_vendors();


        window.Echo.private(`checkTableStatus.` + this.context.user.id).listen('.server.created', (data) => {
            //logic here
            // alert("hello")
            // this.setState({data:data.tables})
        });
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetch_table_vendors();

            window.Echo.private(`checkTableStatus.` + this.context.user.id).listen('.server.created', (data) => {
                //logic here
                this.setState({ data: data.tables })
            });
        });

    }

    fetch_table_vendors = () => {


        fetch(global.vendor_api + 'fetch_table_vendors', {
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
                    // Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    if (json.data.length > 0) {
                        this.setState({ data: json.data })
                    }

                    console.warn("data", this.state.data)
                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();

                    // }, 10000);

                    //   this.setState({interval:myInterval});
                    // Toast.show(json.msg)


                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });

    }



    add = () => {
        if (this.state.capacity == '') {
            Toast.show("Please enter capacity")
        }
        else {
            this.setState({ table_load: true });
            fetch(global.vendor_api + 'add_new_table_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                    capacity: this.state.capacity,
                    table_name: this.state.dinein_name
                })
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        var msg = json.msg;
                        // Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)

                        this.fetch_table_vendors();
                        this.setState({ modalVisible: false, capacity: '4', dinein_name: '' })
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ table_load: false });
                });

        }
    }

    productCard = ({ item }) =>
    (
        <>
            {(item.table_status == 'active') ?
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('TableView', { table_uu_id: item.table_uu_id, table_name: item.table_name, table_url: global.qr_link + item.qr_link }) }} style={[style.viewBox,
                { marginTop: 10, padding: 10, backgroundColor: '#fff', width: Dimensions.get('window').width / 1.05, marginBottom: 2, alignSelf: 'center', borderRadius: 5, flexDirection: "row" }]}>
                    <View style={{ width: "20%" }}>
                        <View style={{ width: 60, height: 60, backgroundColor: '#5BC2C1', borderRadius: 5 }}>
                            <Text style={{ fontSize: 45, alignSelf: 'center', color: '#eee' }}>T</Text>
                        </View>
                    </View>

                    <View style={{ width: "50%" }}>
                        <Text style={styles.h3}>{item.table_name}</Text>
                        <Text style={[styles.h5, { fontSize: RFValue(12, 580), color: "green", textTransform: "capitalize" }]}>{item.table_status}</Text>
                    </View>

                    <View style={{ width: "30%", alignItems: "center", justifyContent: "center" }}>

                        <View style={{ flexDirection: "row", padding: 5 }}>
                            <Icon name="people-outline" type='ionicon' size={20} />
                            <Text style={{ fontFamily: "Roboto-Bold", fontSize: RFValue(12, 580), paddingLeft: 5 }}>{item.capacity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { Linking.openURL(global.qr_link + item.qr_link) }}
                            style={{ backgroundColor: "#5BC2C1", padding: 5, paddingTop: 2, paddingHorizontal: 10, flexDirection: "row", borderRadius: 5 }}>
                            <Text style={{ color: "#fff", fontSize: RFValue(12, 580), fontFamily: "Raleway-Bold", marginTop: Platform.OS == "ios" ? 3 : 0 }}>View QR</Text>
                            <Icon type="ionicon" name="qr-code-outline" size={20} color="#fff" style={{ marginLeft: 5, marginTop: 2 }} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                :
                <View>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('TableView', { table_uu_id: item.table_uu_id, table_name: item.table_name, table_url: global.qr_link + item.qr_link }) }} style={[style.viewBox,
                    { width: Dimensions.get('window').width / 1.05, marginTop: 10, padding: 10, backgroundColor: '#5BC2C1', alignSelf: 'center', borderRadius: 5, marginBottom: 2 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 60, height: 60, backgroundColor: '#296E84', borderRadius: 5 }}>
                                <Text style={{ fontSize: 45, alignSelf: 'center', color: '#eee' }}>T</Text>
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={[styles.h3, { color: '#eee' }]}>{item.table_name}</Text>
                                <Text style={[styles.h5, { color: '#eee', fontSize: RFValue(12, 580), textTransform: "capitalize" }]}>{item.table_status}</Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

            }


        </>

    )

    render() {

        return (
            <SafeAreaProvider>
                <View style={[styles.container]}>
                    <View>
                        <Header
                            statusBarProps={{ barStyle: 'dark-content' }}
                            leftComponent={this.renderLeftComponent()}
                            centerComponent={this.renderCenterComponent()}
                            rightComponent={this.renderRightComponent()}
                            ViewComponent={LinearGradient} // Don't forget this!
                            linearGradientProps={{
                                colors: ['#fff', '#fff'],
                            }}
                            backgroundColor="#ffffff"
                        />
                    </View>
                    {!this.state.isloading ?
                        (this.state.data.length > 0) ?

                            <FlatList
                                navigation={this.props.navigation}
                                data={this.state.data}
                                renderItem={this.productCard}
                                keyExtractor={item => item.id}
                                style={{ marginBottom: 10 }}
                            />

                            :
                            <View style={{ paddingTop: 150, alignItems: "center" }}>
                                <View style={{ alignSelf: "center" }}>
                                    <Image source={require("../img/no-table.webp")}
                                        style={{ width: 340, height: 200 }} />
                                    <Text style={[styles.h3, { top: 20, alignSelf: "center" }]}>
                                        No Record Found!
                                    </Text>
                                </View>
                            </View>


                        :
                        <Loaders />
                    }

                    <Modal
                        // animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onBackdropPress={() => {
                            this.setState({ modalVisible: false });
                        }}>
                        <View style={style.centeredView}>
                            <View style={style.modalView}>
                                <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}
                                    style={{ alignSelf: "flex-end", }}>
                                    <Icon name="close-circle-outline" size={30} type="ionicon" />
                                </TouchableOpacity>

                                <Text style={[styles.p, { fontFamily: "Poppins-SemiBold" }]}>New Dine-In Name <Text style={[styles.h6, { fontFamily: "Poppins-Medium" }]}>(Name will be auto generated if not filled.)</Text> </Text>
                                <Input
                                    onChangeText={e => {
                                        this.setState({ dinein_name: e });
                                    }}
                                    placeholder="Enter Here"
                                    maxLength={10}
                                    inputContainerStyle={{
                                        // width: Dimensions.get('window').width / 1.05,
                                        borderColor: 'transparent',
                                    }}
                                    keyboardType="default"
                                    style={{
                                        fontFamily: 'Poppins-SemiBold',
                                        fontSize: RFValue(11, 580),
                                        color: "grey",

                                    }}
                                    containerStyle={[style.inputText, {
                                        borderRadius: 10, marginTop: 10,
                                        marginBottom: 10,
                                    }]}
                                />

                                <Text style={[styles.p, { fontFamily: "Poppins-SemiBold", alignSelf: "flex-start", paddingLeft: 25 }]}>Sitting</Text>

                                <SelectDropdown
                                    data={capacity}
                                    onSelect={(selectedCapacity, index) => {
                                        this.setState({ capacity: selectedCapacity })
                                    }}
                                    buttonTextAfterSelection={(selectedCapacity, index) => {
                                        return selectedCapacity
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item
                                    }}
                                    defaultValue={this.state.capacity}
                                    buttonTextStyle={{
                                        fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580), color: "#000",
                                        position: "absolute", right: 10, top: 10
                                    }}
                                    buttonStyle={[style.inputText, { shadowOpacity: 0 }]}
                                    renderDropdownIcon={() => {
                                        return (
                                            <Icon name="chevron-down" type="ionicon" />
                                        )
                                    }}

                                />

                                <TouchableOpacity
                                    onPress={() => this.add()}
                                    style={[style.buttonStyles, { marginTop: 20 }]}>
                                    <LinearGradient
                                        colors={['#5BC2C1', '#296E84']}
                                        style={[styles.signIn]}>

                                        <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                            Add Table</Text>

                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaProvider>
        )
    }
}


class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder>
                    <View>
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                        <View style={{ height: 90, width: "95%", marginTop: 10, borderRadius: 10, alignSelf: "center" }} />
                    </View>
                </SkeletonPlaceholder>

            </View>
        )
    }
}

export default Tables;

const style = StyleSheet.create({

    text: {

        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5
    },
    loader: {

        shadowOffset: { width: 50, height: 50 },
        // marginTop:20,
        shadowRadius: 50,
        elevation: 5,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5,
    },
    viewBox: {

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        width: 350,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        shadowColor: 'grey',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    inputText: {
        marginTop: 15,
        width: Dimensions.get('window').width / 1.5,
        height: 50,
        alignSelf: 'center',
        borderRadius: 10,
        color: "black",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonStyles: {
        width: "45%",
        alignSelf: "center",
        margin: 10,

    }

})