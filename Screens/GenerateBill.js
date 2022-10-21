import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet,
    ScrollView, Dimensions, TouchableOpacity,
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import RadioForm from 'react-native-simple-radio-button';
import { AuthContext } from '../AuthContextProvider.js';

var radio_props = [
    { label: 'Google Pay/Paytm/UPI', value: 'UPI' },
    { label: 'Credit/Debit Card', value: 'card' },
    { label: 'Cash', value: 'cash' }
];

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class GenerateBill extends Component {
    static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            data: [],
            isloading: true,
            cart: [],
            modalVisible: false,
            total_price: 0,
            payment: 0
        };

    }


    componentDidMount() {
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
                <Text style={style.text}>Tables 1</Text>
            </View>

        )
    }

    mark_complete = () => {
        fetch(global.vendor_api + 'update_order_status_by_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                order_id: this.props.route.params.bill.id,
                payment_method: this.state.payment,
                order_status: 'completed'
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                    //  clearInterval(myInterval);
                }
                else {
                    this.props.navigation.navigate('Dine-In');
                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();

                    // }, 10000);

                    // this.setState({interval:myInterval});
                    // Toast.show(json.msg)


                }
                this.setState({ isloading: false })
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }



    render() {
        return (
            <View style={[styles.container, { backgroundColor: '#fff' }]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                    />
                </View>
                <ScrollView style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3", marginBottom: 60 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ marginTop: 10, paddingLeft: 20 }}>
                            <Text style={style.text}>Total Bill Amount</Text>
                        </View>

                        <View style={{ paddingRight: 20, marginTop: 10 }}>
                            <Text style={[style.text,{fontFamily:"Roboto-Bold"}]}>₹ {this.props.route.params.bill.total_amount}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <View style={{ backgroundColor: "#FFECB6", padding: 10 }}>
                            <Text style={[style.text1, { color: "#696969", fontSize: RFValue(12, 580) }]}>Choose Method</Text>
                        </View>
                        <View style={{ padding: 20 }}>
                            <RadioForm
                                radio_props={radio_props}
                                initial={0}
                                buttonColor={'#EDA332'}
                                selectedButtonColor={'#EDA332'}
                                onPress={(value) => {
                                    this.setState({ payment: value })
                                }}
                                labelStyle={{ fontSize: RFValue(13, 580), margin:10,marginTop:0,marginBottom:0 }}
                            />
                        </View>

                     


                    </View>
                </ScrollView>

                <View style={{ width: '100%', height: 50, backgroundColor: '#fff', position: 'absolute', bottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => { this.mark_complete() }}
                        style={[styles.buttonStyle, { bottom: 10 }]}>
                        <LinearGradient
                            colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                            style={[styles.signIn, { borderRadius: 10, width: '80%', alignSelf: 'center' }]}>

                            <Text style={[styles.textSignIn, {
                                color: '#fff'
                            }]}>Complete This Order</Text>

                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}


export default GenerateBill

const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5,
        color: '#000',
    },
    text1: {
        fontSize: RFValue(12, 580),
    }
})