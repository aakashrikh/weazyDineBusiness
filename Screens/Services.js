import React, { Component, PureComponent } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View, Alert,
    StyleSheet, Switch,
    Image, Text, Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { AuthContext } from '../AuthContextProvider.js';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');


class Services extends PureComponent {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            active_cat: 0,
            // vendor_category_id:0,
            isloading: true,
            object: {},
            select: {},
            last_select: '',
            load_data: false,
            page: 1,
            category: [],
            isOn: false,
            isOff: true,
            object: {},
            id: [],
            prod_id: '',
            // prod_id:''
        }
    }
    componentDidMount = () => {
        this.get_category();
        this.get_vendor_product(0, 1);
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.get_category();
            this.get_vendor_product(0, 1);
            if (this.props.route.params != undefined) {
                this.get_category();
                this.get_vendor_product(0, 1);
                this.setState({ active_cat: this.props.route.params.active_cat })
            }
        })

    }

    // function to load data while scrolling
    load_more = () => {
        if (this.state.data.length > 9) {
            this.setState({ page: this.state.page + 1, load_data: true })
            this.get_vendor_product(this.state.active_cat, this.state.page + 1)
            console.log("load more")
        }
        else {
            this.setState({ load_data: false })
        }

    }

    get_vendor_product = (category_id, page) => {
        fetch(global.vendor_api + 'vendor_get_vendor_product', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token
            },
            body: JSON.stringify({
                vendor_category_id: category_id,
                product_type: 'product',
                page: page,
                page_length: 10
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    if (page == 1) {
                        this.setState({ data: [] })
                    }
                }
                else {
                    if (json.data?.data?.length > 0) {
                        var obj = json.data.data;
                     
                        if (page == 1) {
                            this.setState({ data: obj })
                        }
                        else {
                            this.setState({ data: [...this.state.data, ...obj] })
                        }
                    }

                }
                this.setState({ isloading: false, load_data: false })
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    get_category = () => {
        fetch(global.vendor_api + 'fetch_vendor_category'
            , {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                })
            })
            .then((response) => response.json())
            .then((json) => {
                if (json.status) {
                    if (json.data.length > 0) {
                        this.setState({ category: json.data });
                    }
                }
                else {
                    this.setState({ category: [] });
                }
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isloading: false })
            });
    }

    filter = (id) => {
        // alert(id,1)
        this.setState({ isloading: true })
        this.get_vendor_product(id, 1);
        this.setState({ active_cat: id })
    }

    toggle = (id,index) => {
        
       if(this.state.isOn){
              this.setState({isOn:false})
         }
            else{
                this.setState({isOn:true})
            }

        var status = this.state.data[index].status == "active" ? "inactive" : "active"
        this.state.data[index].status = status
        this.setState({ data: this.state.data })
        
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                action_id: id,
                type: 'product',
                status: status
            })
        }).then((response) => response.json())
            .then((json) => {

                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);

                }
                else {
                    //   Toast.show("jhsd")
                }
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    alertFunc = () => {
        this.RBSheet.close()
        Alert.alert(
            "",
            "Are you sure you want to delete this Menu?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_product() }
            ]
        )
    }

    delete_product = () => {
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                action_id: this.state.prod_id,
                type: 'product',
                status: "delete"
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);

                }
                else {
                    Toast.show("Product deleted")
                    this.get_vendor_product(0, 1)
                }
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
        this.get_vendor_product(0, 1)
        this.get_category()
    }

    editNavigation = () => {
        this.props.navigation.navigate("EditService",
            {
                data: this.state.id,
                category: this.state.category,
                get_cat: this.get_category,
                get_vendor_product: this.get_vendor_product
            })
        this.RBSheet.close()
    }

    sheet = (id) => {
        this.setState({ id: id })
        this.RBSheet.open();
        this.setState({ prod_id: id.id })

    }

    productCard = ({ item,index }) => {
        return (
            <View>
                <TouchableOpacity style={style.card} onPress={() => this.props.navigation.navigate("ProductDetails", { data: item })}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        {/* View for Image */}
                        <View style={{ width: "27%" }}>
                            {item.is_veg ?
                                <Image source={require('../img/veg.png')} style={{ width: 15, height: 15, zIndex: 1, top: 5, left: 10 }} />
                                :
                                <Image source={require('../img/non_veg.png')} style={{ width: 15, height: 15, zIndex: 1, top: 5, left: 10 }} />
                            }
                            {
                                item.product_img == "" ?
                                    <Image source={require('../img/logo/mp.png')} style={{ width: 80, height: 80, marginTop: 10 }} />
                                    :

                                    <ProgressiveFastImage
                                        thumbnailSource={require('../img/logo/mp.png')}
                                        source={{ uri: item.product_img }}
                                        style={style.logo}

                                    />

                            }

                        </View>
                        {/* View for Content */}

                        <View style={style.contentView}>
                            {/* View for name and heart */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                {/* Text View */}
                                <View style={{ width: 170, }}>
                                    <Text style={[styles.smallHeading, { top: 10, }]}>
                                        {item.product_name}
                                    </Text>
                                    <Text numberOfLines={3} style={[styles.p, { top: 5, fontSize: RFValue(9.5, 580), }]}>
                                        {item.description}
                                    </Text>
                                </View>
                                {/* View for toggle icon  */}
                                <View style={{ margin: 5, marginTop: 10, marginLeft: -5, flexDirection: "row" }}>
                                    <View style={{ marginRight: 10 }} >
                                        <Switch
                                            trackColor={{ false: "#d3d3d3", true: "#5BC2C1" }}
                                            thumbColor={item.status ? "white" : "white"}
                                            value={item.status == "active" ? true : false}
                                            onValueChange={() => this.toggle(item.id,index)}

                                        />
                                    </View>

                                    <Icon type="ionicon" name="ellipsis-vertical" onPress={() => this.sheet(item)} size={22} />
                                </View>
                            </View>

                            {/* Bottom Sheet for edit or delete options */}

                            <RBSheet
                                ref={ref => { this.RBSheet = ref; }}
                                closeOnDragDown={true}
                                closeOnPressMask={true}
                                height={170}
                                customStyles={{
                                    container: {
                                        borderTopRightRadius: 20,
                                        borderTopLeftRadius: 20,
                                    },
                                    draggableIcon: {
                                        backgroundColor: ""
                                    }
                                }}
                            >
                                {/* bottom sheet elements */}
                                <View >
                                    {/* new container search view */}
                                    <View>
                                        {/* to share */}
                                        <View style={{ flexDirection: "row", padding: 10 }}>
                                            <TouchableOpacity style={{ flexDirection: "row" }}
                                                onPress={() => this.editNavigation()}>
                                                <View style={{
                                                    backgroundColor: "#f5f5f5",
                                                    height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 50
                                                }}>
                                                    <Icon type="ionicon" name="create-outline" />
                                                </View>
                                                <Text style={[styles.h4, { alignSelf: "center", marginLeft: 20 }]}>
                                                    Edit </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* to report */}
                                        <View style={{ flexDirection: "row", padding: 10 }}>


                                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.alertFunc()
                                            }>
                                                <View style={{
                                                    backgroundColor: "#f5f5f5",
                                                    height: 40, width: 40, justifyContent: "center", borderRadius: 50
                                                }} >
                                                    <Icon type="ionicon" name="trash-bin" />
                                                </View>
                                                <Text style={[styles.h4, { alignSelf: "center", marginLeft: 20 }]}
                                                >Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </RBSheet>
                            {/* View for Price and offer */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "flex-end", marginTop: 8 }}>
                                <View style={{ flexDirection: "row" }}>
                                    {/* <Text style={[styles.p, {
                                fontFamily: "Roboto-Regular", color: "grey", textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid'
                            }]}>
                                {item.market_price}/-
                            </Text> */}
                                    <Text style={[styles.p, { marginLeft: 10, fontFamily: "Roboto-Bold" }]}>
                                        ₹ {item.our_price}/-
                                    </Text>
                                </View>
                            </View>

                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    };


    render() {

        return (
            <View style={[styles.container,]}>
                {/* Component for  Filter Services */}

                <View style={{ borderBottomWidth: 1, borderColor: "#dedede", paddingVertical: 0 }}>

                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Categories
                            navigation={this.props.navigation}
                            category={this.state.category}
                            filter={this.filter}
                            active_cat={this.state.active_cat}
                            get_vendor_product={this.get_vendor_product}
                        />

                    </View>
                </View>

                {/* <ScrollView style={{ flex: 1 }}> */}
                {/* Particular Card Component */}
                {this.state.isloading ?
                    <>
                        <View >
                            <Loaders />
                        </View>

                    </>
                    :
                    <>
                        {
                            (this.state.data.length > 0) ?

                                <>

                                    <FlatList
                                        navigation={this.props.navigation}
                                        showsVerticalScrollIndicator={false}
                                        data={this.state.data}
                                        renderItem={this.productCard}
                                        keyExtractor={item => item.id}
                                        onEndReachedThreshold={0.9}
                                        onEndReached={() => this.load_more()}
                                        initialNumToRender={10}
                                        getItemLayout={(data, index) => (
                                            { length: 100, offset: 100 * index, index }
                                        )}
                                        viewabilityConfig={{
                                            waitForInteraction: true,
                                            itemVisiblePercentThreshold: 50,
                                            minimumViewTime: 1000,
                                        }}
                                        extraData={this.state.isOn}
                                    />
                                </>



                                :
                                <View style={{ paddingTop: 120, alignItems: "center" }}>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image source={require("../img/no-product.webp")}
                                            style={{ width: 300, height: 250 }} />
                                        <Text style={[styles.h3, { top: -5, alignSelf: "center" }]}>
                                            No Products Found!
                                        </Text>
                                    </View>
                                </View>
                        }
                    </>
                }


                {(this.state.load_data) ?
                    <View style={{ alignItems: "center", flex: 1, backgroundColor: "white", flex: 1, paddingTop: 20 }}>
                        <ActivityIndicator animating={true} size="small" color="#5BC2C1" />
                        <Text style={styles.p}>Please wait...</Text>
                    </View>
                    :
                    <View></View>
                }

                {/* </ScrollView> */}

                {/* fab button */}
                <View>
                    {(this.state.category.length == 0) ?
                        <TouchableOpacity style={style.fab}
                            onPress={() => this.props.navigation.navigate("AddCategory", { get_cat: this.get_category })}>
                            <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{ alignSelf: "center" }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={style.fab}
                            onPress={() => this.props.navigation.navigate("CreateService", { back: "Services", get_cat: this.get_category, get_vendor_product: this.get_vendor_product })}>
                            <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{ alignSelf: "center" }} />
                        </TouchableOpacity>
                    }
                </View>

            </View>

        )
    }
}

export default Services;

class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder >
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <View style={{ marginLeft: 5 }}>
                            <View style={{ width: win.width / 3.5, height: 110, borderRadius: 10 }} />
                        </View>

                        <View>
                            <View style={{ flexDirection: "row", }}>
                                <View>
                                    <View style={{ width: 150, height: 15, marginLeft: 10, top: 5 }} />
                                    <View style={{ width: 250, height: 20, marginLeft: 10, top: 10 }} />
                                </View>
                                <View style={{ height: 20, width: 35, right: 60, bottom: 5 }}></View>
                                <View style={{ height: 20, width: 20, right: 50, bottom: 5 }}></View>
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "flex-end", left: -35, marginRight: 20, marginTop: 15 }}>
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                            </View>
                        </View>



                    </View>


                </SkeletonPlaceholder>

            </View>
        )
    }
}

class Categories extends Component {

    render() {
        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                    {(!this.props.active_cat == 0) ?
                        <TouchableOpacity
                            onPress={() => this.props.filter(0)}>
                            <View style={style.catButton}>
                                <Text style={style.catButtonText}>
                                    All
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.props.filter(0)}>
                            <View style={[style.catButton, { backgroundColor: "#5BC2C1" }]}>
                                <Text style={[style.catButtonText, { color: "#fff" }]}>
                                    All
                                </Text>
                            </View>
                        </TouchableOpacity>}
                    {(this.props.category != '') ?
                        this.props.category.map((cat, id) => {

                            return (
                                <View key={id}>
                                    {(this.props.active_cat != cat.id) ?
                                        <TouchableOpacity
                                            onPress={() => this.props.filter(cat.id)}>
                                            <View style={style.catButton}>
                                                <Text style={style.catButtonText}>
                                                    {cat.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            onPress={() => this.props.filter(cat.id)}>
                                            <View style={[style.catButton, { backgroundColor: "#5BC2C1" }]}>
                                                <Text style={[style.catButtonText, { color: "#fff" }]}>
                                                    {cat.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>

                            )

                        })
                        :
                        <View></View>
                    }
                </View>

            </ScrollView>
        )
    }
}



const style = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        alignSelf: "center",
        width: Dimensions.get("window").width / 1.05,
        top: 7,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 15,
        padding: 6
    },
    logo: {
        height: 80,
        width: 80,
        // borderWidth:0.2,
        borderRadius: 5,
        borderColor: "black",
        margin: 10,
        marginTop: -10,
        marginLeft: 10,
        zIndex: -10
    },
    contentView: {
        flexDirection: "column",
        width: "68%",
        marginRight: 10,
        // paddingBottom:10, 
        // borderBottomWidth:0.5,
        // borderColor:"#d3d3d3",
        marginLeft: 10,
        //  marginTop:10,

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
    button: {
        backgroundColor: "#5BC2C1",
        padding: 4,
        borderRadius: 25,
        width: 100,
        height: 30,
        justifyContent: "center"

    },
    buttonText: {
        alignSelf: "center",
        color: "#fff",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Regular",
        fontSize: RFValue(9, 580)
    },
    catButton: {
        // backgroundColor:"#BC3B3B",
        // padding:7,
        height: 30,
        marginLeft: 10,
        borderRadius: 25,
        justifyContent: "center",
        borderColor: "#EBEBEB",
        borderWidth: 1,
        width: 100
    },
    catButtonText: {
        alignSelf: "center",
        color: "#222222",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Regular",
        fontSize: RFValue(9, 580)

    },
    add: {

        // borderWidth: 1,
        // borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        position: 'absolute',
        bottom: 15,
        right: 10,
        height: 50,
        backgroundColor: '#bc3b3b',
        borderRadius: 100,

    }
})