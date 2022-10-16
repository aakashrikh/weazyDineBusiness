import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, TextInput,
    Dimensions, TouchableOpacity
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class AddCategory extends Component {
static contextType = AuthContext;
    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active"

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
                <Text style={style.text}>Add Category</Text>
            </View>

        )
    }
    add = () => {
        if (this.state.category != "") {
            fetch(global.vendor_api + 'create_category_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                    category_name: this.state.category,
                    status: this.state.status
                })
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)
                        this.props.navigation.goBack()
                        this.props.route.params.get_cat();

                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ isloading: false })
                });

        }
        else {
            Toast.show('Please add Category first!');
        }
    }

    render() {

        return (
            <View style={styles.container}>
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
                <View style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3" }}>

                    {/* Category View */}
                    <View>
                        <Text style={style.fieldsTitle}>
                            Category Name
                        </Text>
                        <TextInput
                        returnKeyType='done'
                            value={this.state.category}
                            onChangeText={(e) => { this.setState({ category: e }) }}
                            style={style.textInput}
                        />
                    </View>
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.add()} >
                        <Text style={style.buttonText}>
                            Add
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default AddCategory

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
        backgroundColor: "#EDA332",
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
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5
    },

})