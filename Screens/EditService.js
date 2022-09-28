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
import RadioForm from 'react-native-simple-radio-button';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import SelectDropdown from 'react-native-select-dropdown';

var radio_props = [
    { label: 'Veg', value: 1 },
    { label: 'Non-Veg', value: 0 }
];

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

class EditService extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            // id:this.props.route.params.prod_id,
            id: '',
            data: this.props.route.params.data,
            category: this.props.route.params.category,
            image_upload: "",
            image:""
        }
    }

    componentDidMount() {
        console.log("Sssss", this.props.route.params.category)
    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ width: win.width, flexDirection: "row", paddingBottom: 10, }} >
                <Icon name="arrow-back-outline" type="ionicon"
                    onPress={() => this.props.navigation.goBack()} style={{ top: 2.5 }} />
                <Text style={[styles.h3, { paddingLeft: 15, bottom: 1 }]}>Edit Menu</Text>
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
                        prod_id={this.state.id}
                        category={this.state.category}
                        get_cat={this.props.route.params.get_cat}
                        get_product={this.props.route.params.get_vendor_product}
                        data={this.state.data} />
                </ScrollView>

            </View>

        )
    }
}

export default EditService;

class Fields extends Component {
    constructor(props) {
        super(props);
// console.warn(';;',this.props.data.addon_map);
        this.state = {
            name: "",
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
            vendor_category_id: 0,
            product_type: "product",
            type: 'product',
            prod_id: "",
            height: 0,
            is_veg: this.props.data.is_veg,
            image_upload: "",
            image:''
        };
    }


    //function to launch camera
    camera = () => {
        launchCamera(options, (response) => {

            if (response.didCancel) {
                // console.warn(response)
                // console.warn("User cancelled image picker");
            } else if (response.error) {
                // console.warn('ImagePicker Error: ', response.error);
            } else {
                // const source = {uri: response.assets.uri};
                let path = response.assets.map((path) => {
                    return (
                        //  console.warn(path.uri) 
                        // this.setState({ image_upload: path.uri })
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
            width: 600,
            height: 500,
            cropping: true,
        }).then(image => {
            console.log(image);
            // this.setState({image:"Image Uploaded"})
            // this.setState({ image_upload: image.path });
            this.setState({ image: image.path })
            this.RBSheet.close()
            // this.upload_image();      
        })
    }

    componentDidMount = async () => {

        this.get_category()
        this.get_vendor_product()
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_category()
            this.get_vendor_product()

        })
    }

    // Fetching vendor categories
    get_category = () => {
        // console.warn(this.props.category)
        var nn = [];
        var pp = [];
        this.props.category.map((value, key) => {
            nn.push(value.name);
            pp.push(value.id);
        });
        this.setState({ cat_name: nn })
        this.setState({ cat_id: pp });
        pp.indexOf(this.props.data.vendor_category_id);
    }

    // Fetching vendor products
    get_vendor_product = () => {

        this.setState({ prod_id: this.props.data.id })
        this.setState({ name: this.props.data.product_name })
        this.setState({ market_price: this.props.data.market_price })
        this.setState({ our_price: this.props.data.our_price })
        this.setState({ description: this.props.data.description })
        this.setState({ image: global.image_url + this.props.data.product_img })
        this.setState({ c_id: this.props.data.vendor_category_id });
        this.setState({ is_veg: this.props.data.is_veg }); 
    }

    set_value = (index) => {
        var vv = this.state.cat_id[index];
        this.setState({ c_id: vv })
        // console.warn(this.state.c_id)
    }

    //Create service button
    create = () => {
        var form = new FormData();
        let numberValidation = /^[0-9]+$/;
        let isnumValid = numberValidation.test(this.state.market_price + this.state.our_price);

        if (this.state.name == "" || this.state.market_price == "" || this.state.our_price == "" || this.state.description == "") {
            Toast.show("All fields are required !");
        }

        else if (this.state.c_id == "") {
            Toast.show("Category is required !");
        }
        // else if (this.state.our_price < this.state.market_price  ) {
        //     Toast.show("Your price should be less than market price !");
        // }
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
                // console.warn("jkkj")
                var photo = {
                    uri: this.state.image,
                    type: 'image/jpg',
                    name: 'akash.jpg'
                };
                form.append("product_img", photo);
            }
            // console.warn(this.state.name, this.state.c_id, this.state.market_price, this.state.our_price, this.state.description, photo, this.state.prod_id, this.state.is_veg)

            form.append("product_name", this.state.name);
            // form.append("token",global.token);
            form.append("vendor_category_id", this.state.c_id);
            form.append("market_price", this.state.market_price);
            form.append("price", this.state.our_price);
            form.append("description", this.state.description);
            form.append("type", this.state.type);

            form.append("product_id", this.state.prod_id);
            form.append("is_veg", this.state.is_veg);
            // console.warn(form)
            fetch(global.vendor_api + 'vendor_update_product', {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': global.token
                },
            }).then((response) => response.json())
                .then((json) => {
                    // console.warn(json)
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)
                        this.props.get_cat();
                        this.props.get_product(0);

                        this.props.navigation.navigate("Products", { refresh: true,active_cat:0 })
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

        return (
            <View>
                <View>
                    <Text style={style.fieldsTitle}>
                        Name{this.state.is_veg}
                    </Text>
                    <TextInput
                        value={this.state.name}
                        onChangeText={(e) => { this.setState({ name: e }) }}
                        style={style.textInput} />
                </View>

                <View>
                    <Text style={style.fieldsTitle}>Category</Text>
                    <View style={{ marginLeft: 20, marginRight: 20, }}>
                        <SelectDropdown
                            buttonStyle={style.textInput}
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
                            defaultValue={this.state.cat_name[this.state.cat_id.indexOf(this.props.data.vendor_category_id)]}
                        />
                    </View>
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.props.navigation.navigate("AddCategory")} >
                        <Text style={style.buttonText}>
                            Add new
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

                <RadioForm
                    formHorizontal={true}
                    radio_props={radio_props}
                    animation={false}
                    selectedButtonColor="#EDA332"
                    buttonColor="#EDA332"
                    buttonSize={12}
                    buttonOuterSize={25}
                    initial={this.state.is_veg == 1 ? 0 : 1}
                    onPress={(value) => { this.setState({ is_veg: value }) }}
                    labelStyle={{ fontSize: RFValue(12, 580), marginRight: 30, fontWeight: 'bold' }}
                    style={{ marginTop: 20, alignSelf: "center" }}
                />

                {/* <View style={{ marginTop: 20, alignSelf: 'center' }}>
                    <RadioForm
                        formHorizontal={true}
                        radio_props={radio_props}
                        animation={true}
                        initial={0}
                        labelHorizontal={false}
                        labelStyle={{ marginRight: 20 }}
                        selectedButtonColor={"#EDA332"}
                        buttonColor={"#EDA332"}
                        onPress={(value) => { this.setState({ is_veg: value }) }}
                    />
                </View> */}



                <View>
                    <Text style={style.fieldsTitle}>
                        Description <Text style={{ color: "grey" }}>(50words) </Text>
                    </Text>
                    <TextInput
                        multiline={true}
                        onContentSizeChange={(event) => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}

                        value={this.state.description}
                        onChangeText={(e) => { this.setState({ description: e }) }}
                        // keyboardType="numeric"
                        style={[style.textInput, { alignItems: "flex-start", height: Math.max(35, this.state.height) }]}
                    />
                </View>


                <View>

                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProductVariants', { product_id: this.state.prod_id, variants: this.props.data.variants, addons: this.props.data.addon_map, refresh: false }) }}>
                                <Text style={[style.fieldsTitle,{fontFamily:"Raleway-Bold"}]}> + Variants & Add-Ons</Text>
                            </TouchableOpacity>
                        </View>
                        {/* {this.props.data.variants.length > 0 && this.props.data.addon_map.length > 0 ?
                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => { this.props.navigation.navigate('ProductVariants', { product_id: this.state.prod_id, variants: this.props.data.variants, addons: this.props.data.addon_map, refresh: false }) }}>
                                <Text style={[style.textInput, { justifyContent: "center", paddingTop: 8 }]}>
                                    {this.props.data.variants.length} Variants & {this.props.data.addon_map.length} Add-Ons
                                </Text>
                            </TouchableOpacity>
                            :
                            <></>
                        } */}
                    </View>

                    <View style={{ flexDirection: "row", width: "100%" }}>


                        <View style={{ width: "60%" }}>
                            <Text style={style.fieldsTitle}>
                                Upload Image
                            </Text>
                            <View style={{ flexDirection: "column" }}>

                                {this.state.image == "" ?
                                    <View style={{ flexDirection: "row", }}>
                                        {/* <Image source={require('../img/addProduct.png')}
                                style={style.serviceImg}/> */}
                                        <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.RBSheet.open()}>
                                            <View style={style.add}>
                                                <Icon name="add" size={35} color="#EDA332" />
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
                                    <Icon name='camera' type="ionicon" color={'#EDA332'} size={25} />
                                </Text>
                                <Text style={style.Text}>Take a picture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.gallery} >
                                <Text style={style.iconPencil}>
                                    <Icon name='folder' type="ionicon" color={'#EDA332'} size={25} />
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
                                colors={['#EDA332', '#EDA332']}
                                style={styles.signIn}>

                                <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                    Save</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={"large"} color="#EDA332" />
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
        marginTop: 50,
        marginRight: 5,
        marginBottom: 20
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
        marginLeft: 20,
        borderRadius: 10
    },
    uploadButton: {
        // backgroundColor:"#EDA332",
        borderColor: "#EDA332",
        paddingTop: 2,
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