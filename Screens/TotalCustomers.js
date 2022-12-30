import React, { Component } from "react";
import {
    View, Text, StyleSheet, Dimensions,
    Image, TouchableOpacity, ScrollView,
    FlatList, ActivityIndicator
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AuthContext } from "../AuthContextProvider.js";
import { Header, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


const win = Dimensions.get('window');

//Global StyleSheet Import
const styles = require('../Components/Style.js');


class TotalCustomers extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.fetchData();
    }


    fetchData = () => {
        fetch(global.vendor_api + 'fetch_customer_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                status: "all"
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.warn(json);
                if (!json.status) {

                } else {
                    this.setState({ data: json.data.data });
                }

                return json;
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
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
                <Text style={style.text}>Total Customers</Text>
            </View>

        )
    }

    renderItem = ({ item, id }) => {
        return (
            <View>
                <View style={style.box}>
                    <Text style={styles.h4}>Name: {item.name == null ? 'N/A' : item.name}</Text>
                    <Text style={styles.h4}>Contact No.: {item.contact}</Text>
                    <Text style={styles.h4}>Orders: {item.orders == null || item.orders == 0 ? 'N/A' : item.orders}</Text>
                    <Text style={styles.h4}>DOB: {item.dob == null || item.dob == '02/02/1996' ? 'N/A' : item.dob}</Text>
                </View>
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

                {(!this.state.isLoading) ?
                    [

                        (this.state.data.length > 0) ?
                            <View>
                                <FlatList
                                data={this.state.data}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                                style={{ marginBottom: Platform.OS == "ios" ? 20 : 10, }}
                            />
                            </View> :
                            <View>

                                <Image source={require('../img/record.jpg')} style={{ width: '80%', height: 200, marginLeft: 10, marginTop: 150, alignSelf: 'center' }} />
                                <Text style={[styles.h4, { alignSelf: 'center', marginTop: 20 }]} >
                                    No Records Found.
                                </Text>

                            </View>
                    ]
                    :

                    <SkeletonPlaceholder>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
                                        <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                                        <View style={{ marginLeft: 20 }}>
                                            <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                                            <View
                                                style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                                            />
                                            <View
                                                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
                                        <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                                        <View style={{ marginLeft: 20 }}>
                                            <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                                            <View
                                                style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                                            />
                                            <View
                                                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
                                        <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                                        <View style={{ marginLeft: 20 }}>
                                            <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                                            <View
                                                style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                                            />
                                            <View
                                                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ width: win.width, height: 100, borderRadius: 10 }} >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginLeft: 10 }}>
                                        <View style={{ width: 80, height: 80, borderRadius: 10 }} />
                                        <View style={{ marginLeft: 20 }}>
                                            <View style={{ width: 250, height: 20, borderRadius: 4 }} />
                                            <View
                                                style={{ marginTop: 6, width: 180, height: 20, borderRadius: 4 }}
                                            />
                                            <View
                                                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </SkeletonPlaceholder>

                }


            </View>
        );
    }

}

const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },
    box: {  
        marginTop:5,
        width: "95%",
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        marginBottom: 10
    }
});

export default TotalCustomers;