import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View, ImageBackground, Alert,
    StyleSheet, Pressable, Switch, TextInput,
    Image, Text, Dimensions, TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header, Icon, Input } from 'react-native-elements'
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../AuthContextProvider.js';
import SelectDropdown from 'react-native-select-dropdown';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

const type = ["Percentage", "Fixed"]

class CreateOffers extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            startDate: "YYYY-MM-DD",
            endDate: "YYYY-MM-DD",
            isloading: false,
            isVisible: false,
            isStartVisible: false,
            height: 0,
            coupon_code: '',
            uses_per_customer: '',
            discount: '',
            minimum_order_value: '',
            maximum_discount: '',
            offer_description: '',
            maximum_uses: '',
            discount_type: 'percentage',
            loading: false,
            show_to_customer: 0,
            offer_name: '',
            status: true,

        }
    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ width: win.width, flexDirection: "row" }} >
                <Icon name="arrow-back-outline" type="ionicon"
                    onPress={() => this.props.navigation.goBack()} style={{ top: 2.5 }} />
                <Text style={[styles.h3, { paddingLeft: 15, bottom: 1 }]}>Create Offers</Text>
            </View>
        )
    }

    componentDidMount() {
        this.setState({ startDate: moment().format('YYYY-MM-DD') })
        this.setState({ endDate: moment().add(1, 'days').format('YYYY-MM-DD') })
        this.focusListener = this.props.navigation.addListener('focus', () => {
        })
    }


    // Date picker function
    showPicker = () => {
        // alert("hi");
        this.setState({
            isVisible: true
        })

    }

    handlePicker = (date) => {
        if (this.state.endDate == "YYYY-MM-DD") {
            this.setState({ endDate: this.state.endDate })
        }
        this.setState({
            isVisible: false,
            endDate: moment(date).format('YYYY-MM-DD')
        })
    }

    hidePicker = () => {
        this.setState({
            isVisible: false
        })
    }

    startShowPicker = () => {
        this.setState({
            isStartVisible: true
        })

    }

    startHandlePicker = (date) => {
        if (this.state.startDate == "YYYY-MM-DD") {
            this.setState({ startDate: this.state.startDate })
        }
        this.setState({
            isStartVisible: false,
            startDate: moment(date).format('YYYY-MM-DD')
        })
    }

    startHidePicker = () => {
        this.setState({
            isStartVisible: false
        })
    }

    // Create offer function
    create_offer = () => {
        if (this.state.maximum_discount == '') {
            var max_discount = 0;
        } else {
            var max_discount = this.state.maximum_discount;
        }

        if (this.state.maximum_discount != '') {
            var max_discount_text = 'upto ₹' + this.state.maximum_discount;
        } else {
            var max_discount_text = '';
        }

        if (this.state.minimum_order_value != '') {
            var minimum_order_value = ' above ₹' + this.state.minimum_order_value;
        } else {
            var minimum_order_value = '';
        }

        if (this.state.discount_type == 'percentage') {
            var offer_name =
                this.state.discount +
                '% OFF on all orders' +
                ' ' +
                minimum_order_value +
                ' ' +
                max_discount_text;
        } else {
            var offer_name =
                '₹' + this.state.discount + ' OFF on all orders' + minimum_order_value;
        }

        this.setState({ loading: true });
        fetch(global.vendor_api + 'create_offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: this.context.token,
            },
            body: JSON.stringify({
                offer_code: this.state.coupon_code,
                offer_description: this.state.offer_description,
                start_from: moment(this.state.startDate).format('YYYY-MM-DD'),
                discount_type: this.state.discount_type,
                offer_discount: this.state.discount,
                start_to: moment(this.state.endDate).format('YYYY-MM-DD'),
                max_discount: max_discount,
                min_order_value: this.state.minimum_order_value,
                per_customer: this.state.uses_per_customer,
                show_customer: this.state.show_to_customer,
                max_uses: this.state.maximum_uses,
                status: 'active',
                offer_name: offer_name,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status) {
                    Toast.show('Coupon created successfully');
                    this.props.navigation.navigate('Offers');
                } else {
                    Toast.show(json.errors[0]);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    toggleSwitch = (value) => {
        if (value == true) {
            this.setState({ show_to_customer: 1 })
        }
        else {
            this.setState({ show_to_customer: 0 })
        }
    }

    render() {
        return (
            <View style={styles.container}>
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
                <ScrollView >
                    <View style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3" }}>
                        {/* coupon code */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Coupon Code
                            </Text>
                            <TextInput
                                value={this.state.coupon_code}
                                maxLength={10}
                                minLength={5}
                                autoCapitalize="characters"
                                keyboardType='name-phone-pad'
                                onChangeText={(e) => { this.setState({ coupon_code: e }) }}
                                style={style.textInput} />
                        </View>

                        {/* uses per customer */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Uses per customer
                            </Text>
                            <TextInput
                                value={this.state.uses_per_customer}
                                keyboardType='numeric'
                                onChangeText={(e) => { this.setState({ uses_per_customer: e }) }}
                                style={style.textInput} />
                        </View>

                        {/* maximum uses */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Maximum Uses
                            </Text>
                            <TextInput
                                value={this.state.maximum_uses}
                                keyboardType='numeric'
                                onChangeText={(e) => { this.setState({ maximum_uses: e }) }}
                                style={style.textInput} />
                        </View>

                        {/* discount types */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Discount Type
                            </Text>
                            <SelectDropdown
                                data={type}
                                onSelect={(selectedType, index) => {
                                    if (selectedType == "Fixed") {
                                        this.setState({ discount_type: "fixed" })
                                        this.setState({ status: false })
                                    }
                                    else if (selectedType == "Percentage") {
                                        this.setState({ staff_role: "percentage" })
                                        this.setState({ status: true })
                                    }

                                }}
                                buttonTextAfterSelection={(selectedRole, index) => {
                                    return selectedRole
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                                defaultValueByIndex={0}
                                buttonTextStyle={{
                                    fontFamily: "Montserrat-Medium", fontSize: RFValue(12, 580), color: "#000",
                                    position: "absolute", right: 2, top: 7
                                }}
                                buttonStyle={[style.textInput, { backgroundColor: "#fff" }]}
                                renderDropdownIcon={() => {
                                    return (
                                        <Icon name="chevron-down" type="ionicon" />
                                    )
                                }}

                            />
                        </View>

                        {/* discount */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Discount
                            </Text>
                            <TextInput
                                value={this.state.discount}
                                keyboardType='numeric'
                                onChangeText={(e) => { this.setState({ discount: e }) }}
                                style={style.textInput} />
                        </View>

                        {/* minimum order value */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Minimum Order Value
                            </Text>
                            <TextInput
                                value={this.state.minimum_order_value}
                                keyboardType='numeric'
                                onChangeText={(e) => { this.setState({ minimum_order_value: e }) }}
                                style={style.textInput} />
                        </View>

                        {/*  maximum discount */}
                        {
                            this.state.status == true ?
                                <View>
                                    <Text style={style.fieldsTitle}>
                                        Maximum Discount
                                    </Text>
                                    <TextInput
                                        value0={this.state.maximum_discount}
                                        keyboardType='numeric'
                                        onChangeText={(e) => { this.setState({ maximum_discount: e }) }}
                                        style={style.textInput} />
                                </View>
                                :
                                <></>
                        }

                        <View>
                            {!this.state.status ? (
                                this.state.discount === '' ? (
                                    <></>
                                ) : (
                                    <Text style={[styles.h6,{marginLeft:20, marginTop:5, color:"#296e84", fontFamily:"Roboto-SemiBold"}]}>
                                        Flat ₹{this.state.discount} off on all orders
                                        {this.state.minimum_order_value === '' ? (
                                            <></>
                                        ) : (
                                            <Text >
                                                {' '}
                                                above ₹{this.state.minimum_order_value}
                                            </Text>
                                        )}
                                    </Text>
                                )
                            ) : this.state.discount === '' ? (
                                <></>
                            ) : (
                                <Text style={[styles.h6,{marginLeft:20, marginTop:5, color:"#296e84", fontFamily:"Roboto-SemiBold"}]}>
                                    {this.state.discount}% off on all orders
                                    {this.state.minimum_order_value === '' ? (
                                        <></>
                                    ) : (
                                        <Text>
                                            {' '}
                                            above ₹{this.state.minimum_order_value}
                                        </Text>
                                    )}
                                    {this.state.maximum_discount === '' ? (
                                        <></>
                                    ) : (
                                        <Text>
                                            {' '}
                                            upto ₹{this.state.maximum_discount}
                                        </Text>
                                    )}
                                </Text>
                            )}
                        </View>

                        {/* offer description */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Offer description
                            </Text>
                            <TextInput
                                multiline={true}
                                onContentSizeChange={(event) => {
                                    this.setState({ height: event.nativeEvent.contentSize.height })
                                }}

                                value={this.state.offer_description}
                                onChangeText={(e) => { this.setState({ offer_description: e }) }}
                                // keyboardType="numeric"
                                style={[style.textInput, { alignItems: "flex-start", height: Math.max(35, this.state.height) }]}
                            />
                        </View>

                        {/* starts from */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Starts from
                            </Text>
                            <View style={{ borderBottomWidth: 1, borderColor: "#d3d3d3", marginLeft: 20, marginRight: 30, paddingBottom: 10 }}>
                                <Pressable onPress={() => this.startShowPicker()}>
                                    <Text style={[styles.h4, { color: "#5d5d5d", fontFamily: "Montserrat-SemiBold" }]}>
                                        {this.state.startDate}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                        {/* date picker */}
                        <DateTimePicker
                            isVisible={this.state.isStartVisible}
                            mode={"date"}
                            is24Hour={false}
                            minimumDate={new Date()}
                            onConfirm={this.startHandlePicker}
                            onCancel={this.startHidePicker}
                        />

                        {/* ends on */}
                        <View>
                            <Text style={style.fieldsTitle}>
                                Ends on
                            </Text>
                            <View style={{ borderBottomWidth: 1, borderColor: "#d3d3d3", marginLeft: 20, marginRight: 30, paddingBottom: 10 }}>
                                <Pressable onPress={() => this.showPicker()}>
                                    <Text style={[styles.h4, { color: "#5d5d5d", fontFamily: "Montserrat-SemiBold" }]}>
                                        {this.state.endDate}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                        {/* date picker */}
                        <DateTimePicker
                            isVisible={this.state.isVisible}
                            mode={"date"}
                            is24Hour={false}
                            minimumDate={new Date()}
                            onConfirm={this.handlePicker}
                            onCancel={this.hidePicker}
                        />

                        <View>
                            <Text style={style.fieldsTitle}>
                                Show Coupon to Customer
                            </Text>

                            <Switch
                                trackColor={{ false: "#d3d3d3", true: "#5BC2C1" }}
                                thumbColor={this.state.show_to_customer ? "white" : "white"}
                                value={this.state.show_to_customer == 1 ? true : false}
                                onValueChange={(value) => {
                                    this.toggleSwitch(value)
                                }}
                                style={{ alignSelf: "flex-start", marginLeft: 20 }}
                            />
                        </View>


                        {!this.state.isloading ?
                            <View>
                                <TouchableOpacity
                                    onPress={() => this.create_offer()}
                                    style={style.buttonStyles}>
                                    <LinearGradient
                                        colors={['#5BC2C1', '#296e84']}
                                        style={styles.signIn}>

                                        <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                            Save</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={style.loader}>
                                <ActivityIndicator size={"small"} color="#5BC2C1" />
                            </View>
                        }

                    </View>
                </ScrollView>
            </View>
        )
    }
}
export default CreateOffers


const style = StyleSheet.create({
    fieldsTitle: {
        fontFamily: "Raleway-Regular",
        fontSize: RFValue(15, 580),
        paddingLeft: 20,
        padding: 10,
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
        fontSize: 15,
    },
    buttonStyles: {
        width: "35%",
        alignSelf: "center",
        marginTop: 50,
        marginRight: 5,
        marginBottom: 20
    },
    uploadButton: {
        // backgroundColor:"#5BC2C1",
        borderColor: "black",
        borderWidth: 1,
        width: 90,
        height: 30,
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        alignItems: "center",
        alignSelf: "flex-end",
        marginLeft: 30,
        marginTop: 20,
        marginRight: 20
    },
    buttonText: {
        fontFamily: "Raleway-SemiBold",
        color: "#000"
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        justifyContent: "center",
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})