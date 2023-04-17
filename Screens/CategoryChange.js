import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { Header, Icon } from 'react-native-elements';
import Toast from "react-native-simple-toast";
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class ChangeCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
                {/* <Text style={style.headerText}>C</Text> */}
            </View>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                leftComponent={this.renderLeftComponent()}    
                centerComponent={this.renderCenterComponent()}        
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 }
                
                }}
                backgroundColor="#ffffff"
                />

                <ScrollView>
                    <View style={[styles.header, {alignSelf: "center" }]}>

                        {/* heading */}
                        <View style={{ marginTop: 5 }}>
                            <Text style={[styles.heading, { marginTop: 10, alignSelf: "center" }]}>Change</Text>
                            <Text style={[styles.h3, { alignSelf: "center" }]}>Your Business Category</Text>
                        </View>

                        {/* Component for Categories select */}
                        <CategoriesSelect navigation={this.props.navigation} />


                    </View>
                </ScrollView>


            </View>
        )
    }
}

export default ChangeCategory;



const style = StyleSheet.create({

    buttonStyles: {
        width: "45%",
        alignSelf: "center",
        margin: 0,

    },
    image: {
        height: 40,
        width: 40,
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center",
    },
    text: {
        fontFamily: "Roboto-Regular",
        fontSize: RFValue(9, 580),
        textAlign: "center",
        marginTop: 5
    },
    button: {
        padding: 10,
        height: 95,
        width: "25%",
        // borderWidth:0.2,
        backgroundColor: "#fff",
        margin: 10,
        borderRadius: 20,
        shadowColor: 'grey',
        shadowOpacity: 1.5,
        elevation: 10,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 1 },
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        shadowRadius: 50,
        bottom: 5,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
    headerText:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5
    }
})


var main_category_id = []

class CategoriesSelect extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            bgColor: "#3e3737",
            buttonloading: true,
            data: [],
            isloading: true,
            selected: 0
        }
    }

    componentDidMount() {
        this.get_all_category();
        this.get_selected_category();
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_all_category();
            this.get_selected_category();

        });
    }

    get_all_category = () => {
        fetch(global.vendor_api + 'get_all_category', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({ data: json.data })

                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isloading: false, buttonloading: false });
            });
    }

    get_selected_category = () => {
        fetch(global.vendor_api + 'get_selected_category_vendor', {
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
                console.warn(json.data)
                if (json.data.length > 0) {
                    json.data.map((value, key) => {
                        this.update_cat(value.parent_id)
                    })
                }
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isloading: false, buttonloading: false });
            });
    }

    update_cat(id) {
        console.warn(id)
        this.setState({ selected: id });

    }

    submit = () => {

        if (this.state.selected == 0) {

            Toast.show('Please choose a category!');

        }

        else {
            this.setState({ buttonloading: true });
            main_category_id.push(this.state.selected);
            fetch(global.vendor_api + 'update_main_category_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                    category_id: main_category_id,

                })
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)
                        this.props.navigation.navigate("ChangeSubCategory",
                            { id: this.state.selected })
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ buttonloading: false })
                });
        }

    }


    render() {

        return (

            <View>


                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>

                    {/* first row */}

                    {this.state.data.slice(0, 3).map((value) => {

                        return (
                            (value.id != this.state.selected)
                                ?

                                <TouchableOpacity style={style.button} onPress={() => { this.update_cat(value.id) }}>
                                    <Image source={{ uri: value.link }}
                                        style={style.image} />
                                    <Text style={[style.text, { color: "black" }]}>{value.category_name}</Text>
                                </TouchableOpacity>

                                :
                                <TouchableOpacity style={[style.button, { backgroundColor: this.state.bgColor }]} onPress={() => { this.update_cat(value.id) }}>
                                    <Image source={{ uri: value.link }}
                                        style={style.image} />
                                    <Text style={[style.text, { color: "white" }]}>{value.category_name}</Text>
                                </TouchableOpacity>

                        )
                    })

                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    {/* Second row */}

                    {

                        this.state.data.slice(3, 6).map((value) => {
                            return (
                                (value.id != this.state.selected) ?

                                    <TouchableOpacity style={style.button} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "black" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>


                                    :
                                    <TouchableOpacity style={[style.button, { backgroundColor: this.state.bgColor }]} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "white" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>

                            )
                        })

                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    {/* Third row */}

                    {
                        this.state.data.slice(6, 9).map((value) => {
                            return (
                                (value.id != this.state.selected) ?

                                    <TouchableOpacity style={style.button} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "black" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>


                                    :
                                    <TouchableOpacity style={[style.button, { backgroundColor: this.state.bgColor }]} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "white" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>

                            )
                        })

                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    {/* Fourth row */}

                    {
                        this.state.data.slice(9, 12).map((value) => {
                            return (
                                (value.id != this.state.selected) ?

                                    <TouchableOpacity style={style.button} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "black" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={[style.button, { backgroundColor: this.state.bgColor }]} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "white" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>
                            )
                        })

                    }
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    {/* Fifth row */}

                    {

                        this.state.data.slice(12, 15).map((value) => {
                            return (
                                (value.id != this.state.selected) ?

                                    <TouchableOpacity style={style.button} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "black" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={[style.button, { backgroundColor: this.state.bgColor }]} onPress={() => { this.update_cat(value.id) }}>
                                        <Image source={{ uri: value.link }}
                                            style={style.image} />
                                        <Text style={[style.text, { color: "white" }]}>{value.category_name}</Text>
                                    </TouchableOpacity>

                            )
                        })

                    }
                </View>
                {!this.state.buttonloading ?
                    <View>
                        <TouchableOpacity
                            onPress={() => this.submit()}
                            style={[style.buttonStyles,]}>
                            <LinearGradient
                                colors={['#5BC2C1', '#296E84']}
                                style={[styles.signIn]}>

                                <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                    Submit</Text>

                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={'large'} color="#296E84" />
                    </View>
                }
            </View>

        )

    }
}
