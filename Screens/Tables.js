import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,
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
            table_load:false

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
                    Toast.show(msg);
                  //  clearInterval(myInterval);
                }
                else {

                    let myInterval = setInterval(() => {
                        this.fetch_table_vendors();
                        // this.get_profile();
        
                    }, 5000);

                    // Toast.show(json.msg)
                    
                    if(json.data.length>0)
                    {
                       // console.warn(json.data)
                        this.setState({data:json.data})
                    }
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
                    // console.warn(json)
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show(msg);
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
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TableView',{table_id:item.id})}} style={{width:'100%',marginTop:10,padding:10,backgroundColor:'#fff',width:'90%',alignSelf:'center',borderRadius:5}}>
                   <View style={{flexDirection:'row'}}>
                    <View style={{width:60,height:60,backgroundColor:'darkred',borderRadius:5}}>
                        <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
                    </View>
                    <View style={{marginLeft:20}}>
                    <Text style={styles.h3}>{item.table_name}</Text>
                    <Text style={styles.p}>{item.table_status}</Text>
                    </View>
                    </View>
                </TouchableOpacity>
        :
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('TableView',{table_id:item.id})}} style={{width:'100%',marginTop:10,padding:10,backgroundColor:'darkred',width:'90%',alignSelf:'center',borderRadius:5}}>
        <View style={{flexDirection:'row'}}>
         <View style={{width:60,height:60,backgroundColor:'darkred',borderRadius:5}}>
             <Text style={{fontSize:45,alignSelf:'center',color:'#eee'}}>T</Text>
         </View>
         <View style={{marginLeft:20}}>
         <Text style={[styles.h3,{color:'#eee'}]}>{item.table_name}</Text>
         <Text style={[styles.p,{color:'#eee'}]}>{item.table_status}</Text>
         </View>
         </View>
     </TouchableOpacity>

        }
        </>
        
    )
    render() {

        return (
            <View style={[styles.container,{backgroundColor:'#f2f2f2'}]}>
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
                {!this.state.isloading ? 
                      (this.state.data.length >0) ?

                      <FlatList
                      navigation={this.props.navigation}
                      data={this.state.data}
                      renderItem={this.productCard}
                      keyExtractor={item=>item.id} 
                      />
                
                :
                <Text>No Tables Found</Text>
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

                {(!this.state.table_load )?
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.add()} >
                        <Text style={style.buttonText}>
                            Add New Table
                        </Text>
                    </TouchableOpacity>
                    :
                    <View style={style.loader}>
           <ActivityIndicator size={"large"} color="rgba(233,149,6,1)" />
           </View>

                }
                    
                </View>
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
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:20,
        shadowRadius:50,
        elevation:5,
        alignSelf:"center",
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,
    },
})
