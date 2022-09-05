import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet,  ActivityIndicator,
    TouchableOpacity, Dimensions, TextInput
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
//Global StyleSheet Import
const styles = require('../Components/Style.js');


class TopDeals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.route.params.screen,
            item: [],
            first_deal: this.props.route.params.first_deal.toString(),
            all_deal: this.props.route.params.all_deal.toString(),
            isloading: false
        }
    }

    componentDidMount() {
        if (this.state.first_deal == undefined) {
            this.setState({ first_deal: 0 })
        }
        else if (this.state.all_deal == undefined) {
            this.setState({ all_deal: 0 })
        }
        // else if (this.state.title == "followings") {
        //     this.setState({ title: "Your Followers" })
        //     this.get_followers();
        // }
        // else if (this.state.title == "contact") {
        //     this.setState({ title: "Contact" })
        //     this.get_contact();
        // }
        // else if (this.state.title == "saved") {
        //     this.setState({ title: "Saved Feeds" })
        //     this.get_saved_feed();
        // }
    }


    get_contact = () => {
        fetch(global.vendor_api + 'get_contacts_detail', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },

        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (json.status) {
                    this.setState({ item: json.data.data })
                    console.warn(this.state.item)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }



    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ top: 10 }}>
                <Icon type="ionicon" name="arrow-back-outline"
                    onPress={() => { this.props.navigation.goBack() }} />
            </View>
        )
    }
    //for header center component
    renderCenterComponent() {
        return (
            <View>

                <Text style={style.text}>
                    {this.state.title}
                </Text>
            </View>

        )
    }

    update_deal = () => {
        this.setState({ isloading: true })
        if (this.state.first_deal < 100 && this.state.all_deal < 100) {
            fetch(global.vendor_api + 'update_flat_deals', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                },
                body: JSON.stringify({
                    first_time: this.state.first_deal,
                    all_time: this.state.all_deal

                })
            }).then((response) => response.json())
                .then((json) => {
                    console.warn(json)
                    if (!json.status) {

                        // Toast.show(json.errors[0])
                    }
                    else {
                        Toast.show("Deal Upated Successfully")
                        this.props.navigation.navigate("Home")

                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ isloading: false })

                });
        }
        else {
            Toast.show("Deal could not be grator then 100")
        }

    }


    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    centerComponent={this.renderCenterComponent()}
                    leftComponent={this.renderLeftComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['white', 'white'],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },

                    }}
                />
                <View style={{ flex: 1, backgroundColor: "#fafafa", paddingHorizontal: 10, height: Dimensions.get("window").height, }} >
                    {this.state.title == "New Customer" ?
                        <View style={{ backgroundColor: 'white', paddingLeft: 10, marginTop: 20, paddingVertical: 10, width: "93%", alignSelf: "center", shadowRadius: 10, borderRadius: 5, paddingVertical: 30, elevation: 5 }}>
                            <Text style={style.fieldsText}>Deals(%) for new customer</Text>
                            <TextInput
                                value={this.state.first_deal}
                                maxLength={2}
                                keyboardType="number-pad"
                                onChangeText={(e) => { this.setState({ first_deal: e }) }}
                                style={{
                                    width: "90%", color: '#5d5d5d',
                                    height: 40,
                                    borderColor: "#d3d3d3",
                                    borderWidth: 1,
                                    marginTop: 10,
                                    paddingLeft: 10,
                                    borderRadius: 5,
                                }} />

                            {(!this.state.isloading) ?
                                <TouchableOpacity
                                    onPress={() => this.update_deal()}
                                    style={[styles.buttonStyles, { marginTop: 50, alignSelf: "center", width: "60%", height: 45 }]}>
                                    <LinearGradient
                                        colors={['#EDA332', '#EDA332']}
                                        style={[styles.signIn, { height: 45 }]}>

                                        <Text style={[styles.textSignIn, {
                                            color: '#fff'
                                        }]}>Update</Text>

                                    </LinearGradient>
                                </TouchableOpacity>
                                :
                                <View style={style.loader}>
                                    <ActivityIndicator size="large" color="#EDA332" />
                                </View>
                            }

                        </View>
                        :

                        <View style={{ backgroundColor: 'white', paddingLeft: 10, marginTop: 20, paddingVertical: 10, width: "93%", alignSelf: "center", shadowRadius: 10, borderRadius: 5, paddingVertical: 30, elevation: 5 }}>
                            <Text style={style.fieldsText}>Deals(%) for all customer</Text>
                            <TextInput
                                value={this.state.all_deal}
                                maxLength={2}
                                onChangeText={(e) => { this.setState({ all_deal: e }) }}
                                keyboardType="number-pad"
                                style={{
                                    width: "90%", color: '#5d5d5d',
                                    height: 40,
                                    borderColor: "#d3d3d3",
                                    borderWidth: 1,
                                    marginTop: 10,
                                    paddingLeft: 10,
                                    borderRadius: 5,
                                }} />

                            {(!this.state.isloading) ?
                                <TouchableOpacity
                                    onPress={() => this.update_deal()}
                                    style={[styles.buttonStyles, { marginTop: 50, alignSelf: "center", width: "60%", height: 45 }]}>
                                    <LinearGradient
                                        colors={['#EDA332', '#EDA332']}
                                        style={[styles.signIn, { height: 45 }]}>

                                        <Text style={[styles.textSignIn, {
                                            color: '#fff'
                                        }]}>Update</Text>

                                    </LinearGradient>
                                </TouchableOpacity>
                                :
                                <View style={style.loader}>
                                    <ActivityIndicator size="large" color="#EDA332" />
                                </View>
                            }

                        </View>
                    }
                </View>


            </View>
        )
    }
}

export default TopDeals;

//Styling
const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },

    fieldsText: {
        fontSize: RFValue(11, 580),
        fontFamily: "Montserrat-SemiBold",
        color: "grey",
        // marginLeft: 10,
        alignSelf: "flex-start",
        marginTop: 10
    },
    inputText: {
        fontSize: RFValue(12, 580),
        fontFamily: "Montserrat-Regular",
        color: "black",
        // marginLeft:10
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:20,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },

}
)