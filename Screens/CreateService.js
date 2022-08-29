import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput, Pressable,
    ScrollView, Dimensions, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MultiSelect from 'react-native-multiple-select';
import RBSheet from 'react-native-raw-bottom-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { Picker } from '@react-native-picker/picker';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import SelectDropdown from 'react-native-select-dropdown';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

const options = {
    title: "Pick an Image",
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 0.5
}

class CreateService extends Component {
    constructor(props) {
        super(props);

    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ width: win.width, flexDirection: "row", paddingBottom: 10, borderBottomWidth: 1, borderColor: "#d3d3d3" }} >
                <Icon name="arrow-back-outline" type="ionicon"
                    onPress={() => this.props.navigation.goBack()} style={{ top: 2.5 }} />
                <Text style={[styles.h3, { paddingLeft: 15, bottom: 1 }]}>Create Menu</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                    />
                </View>

                <ScrollView>
                    <Fields navigation={this.props.navigation}
                        back={this.props.route.params.back}
                        get_cat={this.props.route.params.get_cat}
                        get_product={this.props.route.params.get_vendor_product} />
                </ScrollView>

            </View>

        )
    }
}

export default CreateService;

class Fields extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            category: [],
            cat_name: {},
            cat_id: '',
            c_id: '',
            selectedCategories: '',
            market_price: "",
            our_price: "",
            description: "",
            isLoading: false,
            image: '',
            image_load: '',
            vendor_category_id: '',
            type: "product",
            height:0


        };
    }


    //function to launch camera
    camera = () => {
        launchCamera(options, (response) => {

            if (response.didCancel) {
                console.warn(response)
                console.warn("User cancelled image picker");
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else {
                // const source = {uri: response.assets.uri};
                let path = response.assets.map((path) => {
                    return (
                        //  console.warn(path.uri) 
                        this.setState({ image: path.uri })
                    )
                });
                this.RBSheet.close()
            }
        })
    }


    //function to launch gallery
    gallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
            // this.setState({image:"Image Uploaded"})
            this.setState({ image: image.path });
            this.RBSheet.close()
            // this.upload_image();      
        })
    }

    componentDidMount = async () => {
        this.get_category()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_category()
        })
    }


    get_category = () => {
        fetch(global.vendor_api + 'get_category_vendor?vendor_id=' + global.vendor, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((json) => {
                // console.warn(json)
                if (json.status) {
                    if (json.data.length > 0) {
                        this.setState({ category: json.data })
                        var nn = [];
                        var pp = [];

                        json.data.map((value, key) => {
                            nn.push(value.name);
                            pp.push(value.id);
                        });
                        this.setState({ cat_name: nn })
                        this.setState({ cat_id: pp })
                    }
                }
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    set_value = (index) => {
        var vv = this.state.cat_id[index];
        this.setState({ c_id: vv })
        console.warn(this.state.c_id)
    }
    //Create service button
    create = () => {

        let numberValidation = /^[0-9]+$/;
        let isnumValid = numberValidation.test(this.state.market_price + this.state.our_price);

        if (this.state.name == "" || this.state.market_price == "" || this.state.image == "" || this.state.our_price == "" || this.state.description == "") {
            Toast.show("All fields are required !");
        }
        else if (this.state.category == "") {
            Toast.show("Add category first !");
        }
        else if (this.state.our_price > this.state.market_price) {
            Toast.show("Your price should be less than market price !");
        }

        else if (this.state.c_id == "") {
            Toast.show("Category is required !");
        }
        else if (!isnumValid) {
            Toast.show("Price contains digits only!");
        }
        else if (!isnumValid) {
            Toast.show("Price contains digits only!");
        }
        else if (this.state.description == "") {
            Toast.show("Description is required !");
        }
        else {
            this.setState({ isLoading: true });
            if (this.state.image != '') {
                var photo = {
                    uri: this.state.image,
                    type: 'image/jpg',
                    name: 'akash.jpg'
                };

            }
            var form = new FormData();
            form.append("product_name", this.state.name);
            // form.append("token",global.token);
            form.append("vendor_category_id", this.state.c_id);
            form.append("market_price", this.state.market_price);
            form.append("price", this.state.our_price);
            form.append("description", this.state.description);
            form.append("type", this.state.type);
            form.append("product_img", photo);

            fetch(global.vendor_api + 'vendor_add_product', {
                method: 'POST',
                body: form,
                headers: {

                    'Authorization': global.token
                },
            }).then((response) => response.json())
                .then((json) => {
                    console.warn(json)
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)
                        this.props.get_cat();
                        this.props.get_product(0);

                        
                        this.props.navigation.navigate('ProductVariants',{product_id:json.data.id,variants:json.data.variants,addons:json.data.addons,});
                        //this.props.navigation.navigate(this.props.back,{refresh:true})
                        
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ isLoading: false })
                });
        }
    }

    onSelectedCategoryChange = selectedCategories => {
        this.setState({ selectedCategories });
    };

    render() {
        const { selectedCategories } = this.state;
        return (
            <View style={{ flex: 1, marginBottom: 15, }}>
                <View>
                    <Text style={style.fieldsTitle}>
                        Name
                    </Text>
                    <TextInput
                        value={this.state.name}
                        onChangeText={(e) => { this.setState({ name: e }) }}
                        style={style.textInput} />
                </View>
                <View>
                    <Text style={style.fieldsTitle}>Category</Text>
                    {this.state.category == "" ?
                        <View>
                        </View> :
                        <View style={{ marginLeft: 20, marginRight: 20, }}>
                            <SelectDropdown
                                buttonStyle={{ width: "100%" }}
                                data={this.state.cat_name}
                                onSelect={(selectedCategories, index) => {
                                    this.set_value(index);
                                }}
                                buttonTextAfterSelection={(selectedCategories, index) => {
                                    return selectedCategories
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
                        </View>
                    }
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.props.navigation.navigate("AddCategory")} >
                        <Text style={style.buttonText}>
                            Add category
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={style.fieldsTitle}>
                        Market Price
                    </Text>

                    <TextInput
                        keyboardType="numeric"
                        value={this.state.market_price}
                        onChangeText={(e) => { this.setState({ market_price: e }) }}
                        style={[style.textInput, { paddingLeft: 30 }]} />
                    <Text style={{ left: 25, top: 55, position: "absolute" }} >
                        <MaterialCommunityIcons name="currency-inr" size={20} />
                    </Text>

                </View>

                <View>
                    <Text style={style.fieldsTitle}>
                        Our Price
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={this.state.our_price}
                        onChangeText={(e) => { this.setState({ our_price: e }) }}
                        style={[style.textInput, { paddingLeft: 30 }]} />
                    <Text style={{ left: 25, top: 55, position: "absolute" }} >
                        <MaterialCommunityIcons name="currency-inr" size={20} />
                    </Text>
                </View>

                <View>
                    <Text style={style.fieldsTitle}>
                        Descript <Text style={{ color: "grey" }}>(50words) </Text>
                    </Text>
                    <TextInput 
                    multiline={true}
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height })
                    }}
                    
                    value={this.state.description}
                    onChangeText={(e)=>{this.setState({description:e})}}
                    // keyboardType="numeric"
                    style={[style.textInput,{alignItems:"flex-start",height: Math.max(35, this.state.height)}]}
                    />
                </View>

                <View>
                  
                    <View style={{ flexDirection: "row", width: "100%" }}>


                        <View style={{ width: "60%" }}>
                            <Text style={style.fieldsTitle}>
                                Upload Image
                            </Text>
                            <View style={{ flexDirection: "column" }}>

                                {this.state.image == "" ?
                                    <View style={{ flexDirection: "row", }}>
                                        <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.RBSheet.open()}>
                                            <View style={style.add}>
                                                <Icon name="add" size={35} color="#326bf3" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", }}>
                                        <Image
                                            source={{ uri: this.state.image }}
                                            style={style.serviceImg} />
                                        <Pressable onPress={() => this.RBSheet.open()} style={{ backgroundColor: "white", height: 28, right: 27, borderWidth: 1, borderRadius: 5, padding: 2 }} >
                                            <Icon name="edit" size={20} />
                                        </Pressable>
                                    </View>
                                }

                                {/* <TouchableOpacity style={style.uploadButton} onPress={()=>this.RBSheet.open()} >
                                <Text style={style.buttonText}>
                                    Choose Photo
                                </Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                </View>
                {/* Bottom Sheet fot FAB */}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={150}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                        },
                        wrapper: {
                            // backgroundColor: "transparent",
                            borderWidth: 1
                        },
                        draggableIcon: {
                            backgroundColor: "grey"
                        }
                    }}
                >
                    {/* bottom sheet elements */}
                    <View>

                        {/* Bottom sheet View */}

                        <View style={{ width: "100%", padding: 20 }}>
                            <TouchableOpacity onPress={this.camera}>
                                <Text style={style.iconPencil}>
                                    <Icon name='camera' type="ionicon" color={'#0077c0'} size={25} />
                                </Text>
                                <Text style={style.Text}>Take a picture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.gallery} >
                                <Text style={style.iconPencil}>
                                    <Icon name='folder' type="ionicon" color={'#0077c0'} size={25} />
                                </Text>
                                <Text style={style.Text}>Select from library</Text>
                            </TouchableOpacity>

                        </View>


                    </View>
                </RBSheet>
                {!this.state.isLoading ?
                    <View>
                        <TouchableOpacity
                            onPress={() => this.create()}
                            style={style.buttonStyles}>
                            <LinearGradient
                                colors={['#326BF3', '#0b2564']}
                                style={styles.signIn}>
                                <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                    Create</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={"large"} color="#326bf3" />
                    </View>
                }
            </View>
        )
    }
}

const style = StyleSheet.create({
    fieldsTitle: {
        fontFamily: "Raleway-Regular",
        fontSize: RFValue(14, 580),
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
        fontSize: RFValue(11, 580),
    },
    buttonStyles: {
        width: "35%",
        alignSelf: "center",
        marginTop: 30,
        marginRight: 5
    },
    iconPencil: {
        marginLeft: 20,
        fontSize: 20,
        marginBottom: 10
    },
    Text: {
        position: "absolute",
        fontSize: RFValue(16, 580),
        marginLeft: 80,
        fontFamily: "Raleway-Medium"
    },
    serviceImg: {
        height: 90,
        width: 90,

        borderRadius: 10,
        marginLeft: 20
    },
    uploadButton: {
        // backgroundColor:"#326bf3",
        borderColor: "black",
        borderWidth: 1,
        width: 120,
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
    add: {
        height: 80,
        width: 80,
        borderWidth: 1,
        marginLeft: 20,
        borderStyle: "dashed",
        borderRadius: 10,
        alignItems: "center",
        paddingTop: 20
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})