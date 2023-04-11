import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,Dimensions,
    TouchableOpacity,Pressable,PermissionsAndroid, ActivityIndicator, 
} from 'react-native';
import {Icon,Input} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CategoriesSelect from '../Components/CategoriesSelect';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

class ChooseSubCategory extends Component{
    constructor(props){
        super(props);
        this.state={
            id:this.props.route.params.id
        }
    }
    render(){
        return(
            <View style={styles.container}>
                
                <ScrollView>

                   

                    <View style={[styles.header,{marginTop:40,alignSelf:"center"}]}>    
                      
                        {/* heading */}
                        <View style={{marginTop:10}}>
                        <Text style={[styles.heading,{marginTop:5,alignSelf:"center"}]}>Choose</Text>
                        <Text style={[styles.h3,{alignSelf:"center"}]}>Sub- Categories</Text>
                        </View>

                        {/* Component for Categories select */}
                        <CategoriesSelect navigation={this.props.navigation}
                        id={this.state.id}/>
                        
                        {/* <View>
                        <TouchableOpacity  
                        onPress={()=>this.props.navigation.navigate("UnderVerification")}
                        style={style.buttonStyles}>
                        <LinearGradient 
                            colors={['#326bf3', '#0b2654']}
                            style={styles.signIn}>

                            <Text style={[styles.textSignIn, {color:'#fff'}]}>
                            Submit</Text>
                        
                        </LinearGradient>
                        </TouchableOpacity>
                        </View> */}

                    </View>
                </ScrollView>

                
            </View>
        )
    }
}

export default ChooseSubCategory;



const style=StyleSheet.create({
    icon:{
        margin:10
    },
    buttonStyles:{
        width:"45%",
        alignSelf:"center",
        margin:10,
        
    },
    image:{
        height:40,
        width:40,
        alignContent:"center",
        alignSelf:"center",
        alignItems:"center",
    },
    text:{
        fontFamily:"Roboto-Regular",
        fontSize:RFValue(9,580),
        textAlign:"center",
        marginTop:5
    },
    button:{
        padding:10,
        height:105,
        width:"26%",
        // borderWidth:0.2,
        backgroundColor:"#fff",
        margin:10,
        borderRadius:20,
        shadowColor: 'grey',
        shadowOpacity: 1.5,
        elevation: 10,
        shadowRadius: 10,
        shadowOffset: { width:1, height: 1 },
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginTop:50,
        bottom:5,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",
        width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },
})


var  main_category_id=[]
class CategoriesSelect extends Component{
    constructor(props){
        super(props);
        this.state={
            object:{},
            bgColor:"#3e3737",
            buttonloading:true,
            data:[],
           isloading:true,
        }
    }

    componentDidMount(){
        this.get_all_category();
        // this.get_selected_category();
        this.focusListener=this.props.navigation.addListener('focus',() =>
        {
            this.get_all_category();

        });
    }

    get_all_category=()=>
    {      main_category_id.push(this.props.id);
            fetch(global.vendor_api+'get_all_category?category_id='+this.props.id, {
            method: 'GET',
            })
            .then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if(json.data.length>0){
                    json.data.map((value,key)=>{
                    const object = this.state.object;
                    object[value.id]=false
                    this.setState({object})
                    })
                }
                else{
                    this.props.navigation.navigate("EnableLocation")
                }
                this.setState({data:json.data })   
                    
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isloading: false,buttonloading:false });
            });
    }

    update_cat(id)
    {   
        
        // console.warn(str)
        const object=this.state.object;
        if(object[id])
        {
            object[id]=false;
            main_category_id.pop(id);
        }
        else
        {
            object[id]=true; 
            main_category_id.push(id);
        }
        this.setState({object})
        console.warn(main_category_id)
        
    }

    submit=()=>{
    
        if(main_category_id.length<2){
            
            Toast.show('Please choose a category!');
       
        }
        
        else{
                this.setState({buttonloading:true});   
                
                fetch(global.vendor_api+'update_main_category_vendor', { 
                     method: 'POST',
                       headers: {    
                           Accept: 'application/json',  
                             'Content-Type': 'application/json',
                             'Authorization':global.token  
                            }, 
                             body: JSON.stringify({   
                                category_id: main_category_id, 
    
                                     })}).then((response) => response.json())
                                     .then((json) => {
                                         console.warn(json)
                                         if(!json.status)
                                         {
                                             var msg=json.msg;
                                             Toast.show(msg);
                                         }
                                         else{
                                             Toast.show(json.msg)
                                                  this.props.navigation.navigate("VerificationDone")
                                            // this.props.navigation.navigate("Home")
                                         }
                                        return json;    
                                    }).catch((error) => {  
                                            console.error(error);   
                                         }).finally(() => {
                                            this.setState({buttonloading:false})
                                         });
            }

    }

    render(){
        
        return(
            
            <View>
                
                <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* first row */}
                
                {this.state.data.slice(0,3).map((value)=>{
                        
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                            
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                 <Image source={{uri: value.link}}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
        </View>
        <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Second row */}
                
                {
                    
                    this.state.data.slice(3,6).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                     <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                 <Image source={{uri: value.link}}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
            </View>
            <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Third row */}
                
                {
                    this.state.data.slice(6,9).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                     <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                 <Image source={{uri: value.link}}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
<View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Fourth row */}
                
                {
                    this.state.data.slice(9,12).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                 <Image source={{uri: value.link}}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                        </TouchableOpacity>
                        )
                    })
                    
                }               
    </View>
    <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                    {/* Fifth row */}
                    
                    {
                        
                        this.state.data.slice(12,15).map((value)=>{
                            return(
                                (!this.state.object[value.id])?
                                
                                <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                        <Image source={{uri: value.link}}
                                        style={style.image} />
                                        <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                                </TouchableOpacity>
                            :
                            <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                                
                            )
                        })
                        
                    }               
    </View>

    <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                    {/* Fifth row */}
                    
                    {
                        
                        this.state.data.slice(15,18).map((value)=>{
                            return(
                                (!this.state.object[value.id])?
                                
                                <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                        <Image source={{uri: value.link}}
                                        style={style.image} />
                                        <Text style={[style.text,{color:"black"}]}>{value.category_name}</Text>
                                </TouchableOpacity>
                            :
                            <TouchableOpacity style={[style.button,{backgroundColor:this.state.bgColor}]}  onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={{uri: value.link}}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"white"}]}>{value.category_name}</Text>
                            </TouchableOpacity>
                                
                            )
                        })
                        
                    }               
    </View>
                    {!this.state.buttonloading?
                        <View>
                        <TouchableOpacity  
                        onPress={()=>this.submit()}
                        style={[style.buttonStyles,]}>
                        <LinearGradient 
                            colors={['#5BC2C1', '#296e84']}
                            style={[styles.signIn]}>

                            <Text style={[styles.textSignIn, {color:'#fff'}]}>
                            Submit</Text>
                        
                        </LinearGradient>
                        </TouchableOpacity>
                        </View>
                        :
                        <View style={style.loader}>
                        <ActivityIndicator size={'large'} color="#5BC2C1" />
                        </View>
                    }
            </View>
            
        )
    
    }
}
