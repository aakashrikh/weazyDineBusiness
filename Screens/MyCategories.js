import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View,ImageBackground,Alert,
    StyleSheet,Pressable,Switch,
    Image,Text,Dimensions,TouchableHighlight,
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {Header,Icon} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import Loading from './Loading.js';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

//Global Style Import
const styles = require('../Components/Style.js')

class MyCategories extends Component{
    constructor(props){
        super(props);
        this.state={
            category:'', 
            isloading:true  
        }
    }
    componentDidMount = async()=>
    {  
        this.get_category();
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.get_category();

        })
    }

    get_category=()=>{
        fetch(global.vendor_api+'get_category_vendor?vendor_id='+global.vendor
         ,{
        method: 'GET',
        })
        .then((response) => response.json())
        .then((json) => {
            console.warn(json)
            if(json.status)
            {
                if(json.data.length >0)
                {
                    this.setState({category:json.data }); 
                }   
            }
            else{
                this.setState({category:[] }); 
            }         
            return json;
        })
        .catch((error) => console.error(error))
        .finally(() => {
            this.setState({isloading:false})
        });
    }

    alertFunc=(id,name)=>{
       console.warn(id, name)
        Alert.alert(
          "",
          "Are you sure you want to delete this category?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => this.delete(id,name) }
          ]
        )
      }

    delete=(id,name)=>{
        console.warn(id)
            fetch(global.vendor_api+'update_category_vendor', { 
                method: 'POST',
                  headers: {    
                      Accept: 'application/json',  
                        'Content-Type': 'application/json',
                        'Authorization': global.token
                       }, 
                        body: JSON.stringify({ 
                            category_id:id,
                            category_name:name,
                            category_status:"delete"
                                })
                            }).then((response) => response.json())
                                .then((json) => {
                                    console.warn(json)
                                    if(!json.status)
                                    {
                                        var msg=json.msg;
                                        // Toast.show(msg);  
                                    }
                                    else{
                                      Toast.show("Category deleted"),
                                      this.get_category()
                                   }                                 
                               }).catch((error) => {  
                                       console.error(error);   
                                    }).finally(() => {
                                       this.setState({isloading:false})
                                    });
                                    
    }

    edit=(id,name)=>{
        console.warn(id,name)
        this.props.navigation.navigate("EditCategory",{id:id,name:name})
    }

    productCard=({item})=>(
        <View style={{paddingHorizontal:20,paddingVertical:12,flexDirection:"row",justifyContent:"space-between",borderWidth:1,marginTop:5,borderColor:"#d3d3d3",width:"97%",alignSelf:"center",borderRadius:10,alignItems:"center"}}>
            <Text style={styles.h3}>{item.name}</Text>
            <View style={{flexDirection:"row"}} >
            <Pressable style={[style.uploadButton,{marginRight:15,backgroundColor:"#f2f2f2"}]} onPress={()=>this.edit(item.id,item.name)} >
                <Icon type="ionicon" name="create-outline"  />
            </Pressable>
            <Pressable style={style.uploadButton} onPress={()=>this.alertFunc(item.id,item.name)} >
                <Icon type="ionicon" name="trash-outline" color="#ff0000" />
            </Pressable>
            </View>
        </View>
    );
    render(){
        return(
            <View style={styles.container}>
                {!this.state.isloading ? 
                      (this.state.category !="") ?
                      <FlatList
                      navigation={this.props.navigation}
                      showsVerticalScrollIndicator={false}
                      data={this.state.category}
                      renderItem={this.productCard}
                      keyExtractor={item=>item.id} 
                      />
                        :
                        <View style={{paddingTop:120,alignItems:"center"}}>
                        <View style={{alignSelf:"center"}}>
                        <Image source={require("../img/no-product.png")}
                        style={{width:300,height:300}} />
                         <Text style={[styles.h3,{top:-20,alignSelf:"center"}]}>
                        No Categories Found! 
                        </Text>
                    </View>  
                    </View>
                        
                        :
                        <View >
                        <Loader />
                        </View>
                      }
                
                <TouchableOpacity style={style.fab}
                onPress={()=>this.props.navigation.navigate("AddCategory")}>
                        <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{alignSelf:"center"}}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default MyCategories


class Loader extends Component{
    render(){
        return(
            <View>
            <SkeletonPlaceholder>
                <View style={style.questView} >
                    <View style={{ flexDirection: "row" }}>
                        <View style={style.Icon} />
                        <View style={{ width: 350, marginTop: 12, marginLeft: 20, height: 40 }} />
                    </View>
                </View>
            </SkeletonPlaceholder>
           
        </View>
        )
    }
}

const style=StyleSheet.create({
    uploadButton:{
        backgroundColor:"#ff000017",
        width:40,
        height:40,
        borderRadius:50,
        justifyContent:"center",
        alignSelf:"center",
        alignItems:"center",
        
    },
    fab:{
        backgroundColor:"#EDA332",
        borderRadius:100,
        height:50,
        width:50,
        bottom:10,
        right:10,
        // alignSelf:"flex-end",
        // margin:20,
        justifyContent:"center",
        position:"absolute"
    },
})