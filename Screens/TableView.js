import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,
    ScrollView, Dimensions, TouchableOpacity
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
// import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import MultiSelect from 'react-native-multiple-select';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import { Picker } from '@react-native-picker/picker';
import { RFValue } from 'react-native-responsive-fontsize';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var categ = []

class TableView extends Component {

    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active"

        };
       
    }


    componentDidMount()
    {
     //   this.RBSheet.open();
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

    renderRightComponent() {
        return (
            <View style={{ top: 5 }}>
                <Icon type="ionicon" name="ellipsis-vertical-outline"
                    onPress={()=>this.RBSheet.open()} />
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
                    'Authorization': global.token
                },
                body: JSON.stringify({
                    category_name: this.state.category,
                    status: this.state.status
                })
            }).then((response) => response.json())
                .then((json) => {
                    // console.warn(json)
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


    delete_table = () =>
    {
        alert(this.props.route.params.table_id);
        fetch(global.vendor_api + 'delete_table_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
              table_id:this.props.route.params.table_id
            })
        }).then((response) => response.json())
            .then((json) => {
                 console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                }
                else {
                    Toast.show(json.msg)
                    this.props.navigation.navigate('Tables');
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading:false })
            });
    }

    save_qr = () =>
    {
        alert("Sss");
    }
    render() {

        return (
            <View style={[styles.container,{backgroundColor:'#f2f2f2'}]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        rightComponent={this.renderRightComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                    />
                </View>
                <View style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3" }}>
                    
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TableView')}} style={{width:'100%',marginTop:10,backgroundColor:'#fff',width:'100%',alignSelf:'center',borderRadius:5}}>
                   <View style={{width:'100%'}}>
                    <View style={{flexDirection:'row',width:'100%',padding:10, borderBottomWidth:1,borderBottomColor:'#ececec'}}>
                    <View style={{width:'20%',width:50,height:50,backgroundColor:'darkred',borderRadius:5}}>
                        <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
                    </View>
                   
                    <View style={{marginLeft:20,width:'60%'}}>
                    <Text style={styles.h4}>Coffie</Text>
                    <Text style={styles.p}>2 * 30</Text>
                    </View>

                    <View style={{marginLeft:20,width:'20%'}}>
                    <Text style={styles.h3}>302</Text>
                    </View>

                    </View>

                    <View style={{flexDirection:'row',width:'100%',padding:10, borderBottomWidth:1,borderBottomColor:'#ececec'}}>
                    <View style={{width:'20%',width:50,height:50,backgroundColor:'darkred',borderRadius:5}}>
                        <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
                    </View>

                    <View style={{marginLeft:20,width:'60%'}}>
                    <Text style={styles.h4}>Coffie</Text>
                    <Text style={styles.p}>2 * 30</Text>
                    </View>

                    <View style={{marginLeft:20,width:'20%'}}>
                    <Text style={styles.h3}>302</Text>
                    </View>

                    </View>


                    <View style={{flexDirection:'row',width:'100%',paddingLeft:20,marginTop:10,marginBottom:5}}>
                        <Text style={[styles.h4,{width:'80%'}]}>Item Total</Text>
                        <Text style={[styles.h4,{width:'20%',alignSelf:'flex-end'}]}>300</Text>
                    </View>

                    <View style={{flexDirection:'row',width:'100%',paddingLeft:20,marginTop:5,marginBottom:5}}>
                        <Text style={[styles.h4,{width:'80%'}]}>GST (15%)</Text>
                        <Text style={[styles.h4,{width:'20%',alignSelf:'flex-end'}]}>300</Text>
                    </View>

                    <View style={{flexDirection:'row',width:'100%',paddingLeft:20,marginTop:10,marginBottom:15}}>
                        <Text style={[styles.h3,{width:'80%'}]}>Grand Total</Text>
                        <Text style={[styles.h3,{width:'20%',alignSelf:'flex-end'}]}>300</Text>
                    </View>

                    </View>
                </TouchableOpacity>
                 

                </View>

                <View style={{width:'100%',height:50,backgroundColor:'#fff',position:'absolute',bottom:0}}>
                <TouchableOpacity
            // onPress={this.send_otp}
            onPress={()=>this.sendOtp()}
            style={[styles.buttonStyle,{bottom:10}]}>
                <LinearGradient 
                    colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                    style={[styles.signIn,{borderRadius:10,width:'80%',alignSelf:'center',position:'absolute'}]}>

                    <Text style={[styles.textSignIn, {
                    color:'#fff'}]}>Generate Bill</Text>
                    
                </LinearGradient>
            </TouchableOpacity>
                </View>

                 {/* Bottom Sheet for Camera */}
                 <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={150}
                        customStyles={{
                            container:{
                                borderTopLeftRadius:20,
                                borderTopRightRadius:20
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
                            <View style={{width:"100%",padding:20}}>
                            <TouchableOpacity onPress={()=>{this.save_qr()}} style={{flexDirection:'row'}}>
                                        <Text style={style.iconPencil}>
                                            <Icon name='qr-code-outline' type="ionicon" color={'#0077c0'} size={30}/>
                                        </Text>
                                        <Text style={[styles.h4,{marginLeft:20,marginTop:4}]}>Download Table QR</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=>{this.delete_table()}} style={{flexDirection:'row',marginTop:10}}> 
                                        <Text style={style.iconPencil}>
                                            <Icon name='trash-outline' type="ionicon" color={'#0077c0'} size={30}/>
                                        </Text>
                                        <Text style={[styles.h4,{marginLeft:20,marginTop:4}]}>Delete Table</Text>
                                        </TouchableOpacity>

                            </View>
                        
                        </View>
                        </RBSheet>
            </View>
        )
    }
    
}



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
                      <View style={{flexDirection:"row",alignSelf:"flex-end",left:-35,marginRight:20,marginTop:15}}>
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
export default TableView

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
        backgroundColor: "#326bf3",
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