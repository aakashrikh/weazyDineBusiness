import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,Linking,
    ScrollView, Dimensions, TouchableOpacity,FlatList,ActivityIndicator
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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var categ = []

class Tables extends Component {

    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            isloading:true,
            data:[],
            table_load:false,
            interval:''

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
                <Text style={style.text}>Tables</Text>
            </View>

        )
    }

    //for right component
    renderRightComponent() {
        return (
            <View>
                {(!this.state.table_load )?
                <TouchableOpacity style={{backgroundColor:"#EDA332",padding:5,borderRadius:5}}>
                    <Icon type="ionicon" name="add" size={30} color="#fff"
                    onPress={() => this.add()} />
                </TouchableOpacity>
                :
                <View style={style.loader}>
                    <ActivityIndicator size={"small"} color="rgba(233,149,6,1)" />
                </View>

                }
            </View>
        )
    }

    componentDidMount () 
    {
        this.fetch_table_vendors();

        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.fetch_table_vendors();
        });

    }

    fetch_table_vendors = ()=>
    {
        fetch(global.vendor_api + 'fetch_table_vendors', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
              
            })
        }).then((response) => response.json())
            .then((json) => {
                // console.warn(json)
                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);
                  //  clearInterval(myInterval);
                }
                else {
                   console.warn(json.data);
                    if(json.data.length>0)
                    {
                       // console.warn(json.data)
                        this.setState({data:json.data})
                    }

                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();
        
                    // }, 10000);

                 //   this.setState({interval:myInterval});
                    // Toast.show(json.msg)
                    
                    
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading:false })
            });
    }



    add = () => {

        this.setState({table_load:true});
            fetch(global.vendor_api + 'add_new_table_vendor', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                },
                body: JSON.stringify({
                })
            }).then((response) => response.json())
                .then((json) => {
                    console.warn(json)
                    if (!json.status) {
                        var msg = json.msg;
                        // Toast.show(msg);
                    }
                    else {
                        Toast.show(json.msg)
                        
                        this.fetch_table_vendors();
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({table_load:false});
                });

       
    }

    productCard = ({item}) =>
    (
        <>
        {(item.table_status == 'active')?
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TableView',{table_uu_id:item.table_uu_id,table_name:item.table_name,table_url:item.qr_link})}} style={[style.viewBox,
            {marginTop:10,padding:10,backgroundColor:'#fff',width:Dimensions.get('window').width/1.05,marginBottom:2,alignSelf:'center',borderRadius:5,flexDirection:"row"}]}>
                   {/* <View style={{flexDirection:'row'}}>
                        <View style={{width:60,height:60,backgroundColor:'#EDA332',borderRadius:5}}>
                            <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
                        </View>
                        <View style={{marginLeft:20}}>
                            <Text style={styles.h3}>{item.table_name}</Text>
                            <Text style={[styles.p,{fontSize:RFValue(12,580)}]}>{item.table_status}</Text>
                        </View>
                        <View style={{padding:5,backgroundColor:'#EDA332',borderRadius:5,}}>

                        </View>
                    </View> */}
                    <View style={{width:"20%"}}>
                        <View style={{width:60,height:60,backgroundColor:'#EDA332',borderRadius:5}}>
                            <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
                        </View>
                    </View>

                    <View style={{width:"50%"}}>
                        <Text style={styles.h3}>{item.table_name}</Text>
                        <Text style={[styles.p,{fontSize:RFValue(12,580)}]}>{item.table_status}</Text>
                    </View>

                    <View style={{width:"30%",alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity onPress={()=>{Linking.openURL(item.qr_link)}}
                        style={{backgroundColor:"#EDA332",padding:5,paddingTop:2,paddingHorizontal:10,flexDirection:"row",borderRadius:5}}>
                            <Text style={{color:"#fff",fontSize:RFValue(12,580),fontFamily:"Raleway-Bold"}}>View QR</Text>
                            <Icon type="ionicon" name="qr-code-outline" size={20} color="#fff" style={{marginLeft:5,marginTop:2}} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                :
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TableView',{table_uu_id:item.table_uu_id,table_name:item.table_name,table_url:item.qr_link})}} style={[style.viewBox,
                {width:Dimensions.get('window').width/1.05,marginTop:10,padding:10,backgroundColor:'#EDA332',alignSelf:'center',borderRadius:5,marginBottom:2}]}>
            <View style={{flexDirection:'row'}}>
            <View style={{width:60,height:60,backgroundColor:'#E47635',borderRadius:5}}>
                <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
            </View>
            <View style={{marginLeft:20}}>
            <Text style={[styles.h3,{color:'#eee'}]}>{item.table_name}</Text>
            <Text style={[styles.p,{color:'#eee',fontSize:RFValue(12,580)}]}>{item.table_status}</Text>
            
            </View>
            </View>
        </TouchableOpacity>

        }
        </>
        
    )
    render() {

        return (
            <View style={[styles.container]}>
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
                {!this.state.isloading ? 
                      (this.state.data.length >0) ?

                      <FlatList
                      navigation={this.props.navigation}
                      data={this.state.data}
                      renderItem={this.productCard}
                      keyExtractor={item=>item.id} 
                      style={{marginBottom:10}}
                      />
                
                :
                <View style={{paddingTop:150,alignItems:"center"}}>
                <View style={{alignSelf:"center"}}>
                <Image source={require("../img/no-table.webp")}
                style={{width:340,height:200}} />
                 <Text style={[styles.h3,{top:20,alignSelf:"center"}]}>
        No Record Found!
    </Text>
            </View>  
            </View>


                :
                <Loaders />
    }
                 

                    {/* <View>
                    <Text style={style.fieldsTitle}>
                      Sub-Category
                    </Text>
                    <TextInput 
                    style={style.textInput}/>
                </View> */}

                {/* {(!this.state.table_load )?
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.add()} >
                        <Text style={style.buttonText}>
                            Add New Table
                        </Text>
                    </TouchableOpacity>
                    :
                    <View style={style.loader}>
           <ActivityIndicator size={"large"} color="rgba(233,149,6,1)" />
           </View>

                } */}
                    
            </View>
        )
    }
}


class Loaders extends Component {
    render() {
       return (
        <View>
        <SkeletonPlaceholder>
            <View>
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />     
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />  
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} /> 
           <View style={{height:90,width:"95%",marginTop:10,borderRadius:10,alignSelf:"center"}} />           
            </View>
        </SkeletonPlaceholder>

    </View>
       )
    }
 }

export default Tables;

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
        backgroundColor: "rgba(233,149,6,1)",
        // width: 105,
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        alignSelf: "center",
        alignItems: "center",
        // marginLeft:20,
        marginTop: 70,
        paddingHorizontal:15
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
    loader:{

        shadowOffset:{width:50,height:50},
        // marginTop:20,
        shadowRadius:50,
        elevation:5,
        alignSelf:"center",
        justifyContent:"center",
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,
    },
    viewBox:{

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})