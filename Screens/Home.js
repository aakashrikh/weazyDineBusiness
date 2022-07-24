import React, { Component } from 'react';
import {
    Text,View,ScrollView,
    StyleSheet,Image,Pressable,ActivityIndicator,
    TouchableOpacity,ImageBackground
} from 'react-native';
import {Icon,LinearProgress} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist'

//Global StyleSheet Import
const styles = require('../Components/Style.js');


const options = {
    title: "Pick an Image",
    storageOptions:{
        skipBackup: true,
        path:'images'
    }
}

class Home extends Component{

    constructor(props){
        super(props);
        this.state={
            name:"",
            data:"",
            image_load:false,
            isloading:true,
            id:"",
            covers:[],
            image:"" ,
            step:0,
            per:0,
            cover_load:true,
            cover_step:true,
            image_loade:true
    };
}


//function to launch camera
camera =()=>{

    launchCamera(options, (response)=>{
        
        if(response.didCancel){
            // console.warn(response)
            console.warn("User cancelled image picker");
        } else if (response.error){
            console.warn('ImagePicker Error: ', response.error);
        }else{
            console.warn(response)
            const source = {uri: response.assets.uri};
          let path = response.assets.map((path)=>{
              return (
                  this.setState({image:path.uri}) 
              )
          });
          this.upload_image();
        }
    })
  }


//function to launch gallery
gallery =()=>{
    ImagePicker.openPicker({
        width:300,
        height:400,
        cropping:true,
        compressImageQuality:0.5
    }).then(image=>{
        this.setState({image:image.path});
        this.upload_image();      
    })  
}

componentDidMount = async()=>
{   
    // alert(global.vendor)
    this.get_profile()
    this.get_cover()
    this.focusListener=this.props.navigation.addListener('focus', ()=>{
        this.get_profile()
        this.get_cover()
    })
}
get_profile=()=>{
    fetch(global.vendor_api+'get_vendor_profile', { 
        method: 'POST',
          headers: {    
              Accept: 'application/json',  
                'Content-Type': 'application/json',
                'Authorization':global.token  
               }, 
                body: JSON.stringify({ 

                        })}).then((response) => response.json())
                        .then((json) => {
                            console.warn(json)
                            if(!json.status)
                            {
                                
                            }
                            else{
                               
                                this.setState({data:json.data})
                                this.setState({id:json.data.id})
                                json.data.map(value=>{
                                    this.setState({step:value.step});
                                    if(value.step == 2)
                                    {
                                        this.setState({per:0.8})
                                    }
                                    else if(value.step == 1)
                                    {
                                        this.setState({per:0.9})
                                    }
                                    else 
                                    {
                                        this.setState({per:1})
                                    }
                                    
                                    this.setState({image:value.profile_pic})
                                    
                                    if(value.profile_pic == "" || value.profile_pic == null)
                                    {
                                        this.setState({image_loade:false})
                                    }
                                    this.setState({id:value.id})
                                    this.setState({name:value.name})
                                    // alert(value.category_type)
                                 global.category_type=value.category_type
                                }) 
                            }
                            global.vendor=this.state.id,
                            global.pic=this.state.image,
                            global.name=this.state.name
                           return json;    
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isloading:false})

                            });
}

//function to upload image
upload_image = () =>
{
    this.RBSheet.close()
    this.setState({image_load:true});
    var form = new FormData();
    if(this.state.image != '')
    {
        var photo = {
            uri: this.state.image,
            type: 'image/jpeg',
            name: 'aakash.jpg',
          };
          form.append("update_profile_picture", photo);  
    }
    form._parts.map(value=>{
        console.warn(value)
    })
    
      fetch(global.vendor_api+'update_profile_picture_vendor', { 
        method: 'POST',
        body: form,
          headers: {  
            'Content-Type': 'multipart/form-data', 
            'Authorization':global.token
               }, 
                }).then((response) => response.json())
                        .then((json) => {
                            console.warn(json)
                            if(json.status){
                                this.setState({photo:global.image_url+json.profile_pic})
                               this.get_profile();
                            }  
                            
                            return json
                       }).catch((error) => {  
                               console.error(error);   
                               
                            }).finally(() => {
                                this.setState({image_load:false});
                            });
}

get_cover=()=>{
    fetch(global.vendor_api+'get_cover_vendor', { 
        method: 'POST',
          headers: {    
              Accept: 'application/json',  
                'Content-Type': 'application/json',
                'Authorization':global.token  
               }, 
                body: JSON.stringify({ 
                        })}).then((response) => response.json())
                        .then((json) => {
                            // console.warn(json)
                            if(!json.status)
                            {
                                
                            }
                            else{
                                if(json.covers.length==0)
                                {
                                    this.setState({cover_step:false})
                                }
                                this.setState({covers:json.covers}) 
                               
                            }
                            
                           return json;    
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isloading:false,cover_load:false})

                            });
}
    render(){
    
        return(
           
            <View style={[styles.container,{backgroundColor:"transparent"}]}>
            {/* View for Banner Image */}
           
            <View style={[style.card,{backgroundColor:"#fff",height:450}]} >
                {(this.state.covers.length==0)?
                <View>
                      <Image resizeMode="cover" source={require('../img/MarketBoi.png')} style={{width:"100%",height:300,marginTop:-60}} />
                  
                    </View>:
                    <>
                    {(this.state.covers.length==1)?
                <View>
                      <Image resizeMode="cover" source={{uri:global.image_url+this.state.covers[0].image}} style={{width:"100%",height:300,marginTop:-60}} />
                  
                    </View>:
                <Swiper style={styles.wrapper}
                 autoplay={true}>
                     {
               this.state.covers.map((covers,id)=>{
            return(
                
                <View>
                   
                    <Image resizeMode="cover" source={{uri:global.image_url+covers.image}} style={{width:"100%",height:300}} />
                    </View>
                    )
                })
            }
                </Swiper>
    }
                </>
    }
                </View>
                {/* edit button */}
                <TouchableOpacity style={style.editIcon}
                onPress={()=>this.props.navigation.navigate("MultipleImage")}>
                    <Icon  name="camera" type="ionicon" size={20} color="#000"/>
                    
                </TouchableOpacity>

                {/* View for profile image and name */}
                <View style={{top:-350,padding:15, flexDirection:"row"}}>
                {this.state.image_load ? 
                <View style={style.profileImg}> 
                <View style={style.loader}>
                <ActivityIndicator size="small" color="#326bf3" />
                </View>
                </View>
                :
                          <Image source={{uri:this.state.image}} style={style.profileImg} />
                          }
                        

                    <Pressable onPress={()=>this.RBSheet.open()}  style={style.camIcon}>
                    <Icon type="ionicon" name="camera"  size={20} color="#000"/>
                    </Pressable>

                    
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
                            <TouchableOpacity onPress={this.camera}>
                                        <Text style={style.iconPencil}>
                                            <Icon name='camera' type="ionicon" color={'#0077c0'} size={25}/>
                                        </Text>
                                        <Text style={style.Text}>Take a picture</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.gallery} > 
                                        <Text style={style.iconPencil}>
                                            <Icon name='folder' type="ionicon" color={'#0077c0'} size={25}/>
                                        </Text>
                                        <Text style={style.Text}>Select from library</Text>
                                        </TouchableOpacity>

                            </View>
                        
                        </View>
                        </RBSheet>
                    <View style={{flexDirection:"column",alignSelf:"center"}}>
                        {/* name text */}
                        <Text style={style.nameText}>
                            <Text style={{fontFamily:"Raleway-Bold",marginLeft:10}}>
                                 {this.state.name}
                            </Text>
                        </Text>
                        
                        <Text style={style.text}>
                            {global.msg}
                        </Text>
                    </View>
                </View>
                
            {/* View for main container */}
            <View style={style.mainContainer}>
                    <ScrollView>
                        {(this.state.step>0)?
                    <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:20}}>
                    <LinearProgress value={this.state.per}
                        trackColor="#f2f2f2"
                        style={{ marginVertical: 5, marginTop: 20, width: "90%", alignSelf: "center", height: 7, borderRadius: 10 }}
                        variant="determinate"
                        color="#326bf3" />
                        <Text style={{ color: '#000', fontFamily: "Roboto-Regular", marginTop: 12,marginLeft:10 }}>
                        {this.state.per*100}%
                                </Text>
                                <Text style={[styles.h5,{marginLeft:21}]}>
                    You are just {this.state.step} steps away to complete your profile
                </Text>
              </View>
              :
              <></>
                        }
               
            
            {(!this.state.image_loade )?
                <TouchableOpacity onPress={()=>this.RBSheet.open()} style={[style.cardView,{marginTop:15, borderWidth:1,borderRadius:10,borderColor:'#ececec', flexDirection:"row",justifyContent:"space-between",paddingTop:0,paddingBottom:0,paddingRight:0,marginLeft:20,marginRight:20}]}>
                <View style={{width:'20%',paddingTop:5,}}>
                            <Image source={require('../img/shop-icon.png')} style={{width:40,height:40,marginLeft:10,marginTop:10}} />
                            </View>
                            <View style={{width:'80%',paddingTop:10,paddingBottom:10}}>
                              <Text style={{fontSize:RFValue(12,580),fontFamily:"Roboto-Bold"}}>Upload Your Profile Picture</Text>
                              <Text style={{fontSize:RFValue(10,580),fontFamily:"Roboto-Regular",marginTop:2}}>Upload your profile picture to showcase your profile good to your customers</Text>
                          
                            </View>
                            
                          </TouchableOpacity>
                          :
                          <></>
            }
                
                {(!this.state.cover_step)?
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate("MultipleImage")}} style={[style.cardView,{marginTop:15, borderWidth:1,borderColor:'#ececec',borderRadius:10, flexDirection:"row",justifyContent:"space-between",paddingTop:0,paddingBottom:0,paddingRight:0,marginLeft:20,marginRight:20}]}>
                <View style={{width:'20%',paddingTop:5,}}>
                            <Image source={require('../img/cam.png')} style={{width:40,height:40,marginLeft:10,marginTop:10}} />
                            </View>
                            <View style={{width:'80%',paddingTop:10,paddingBottom:10}}>
                              <Text style={{fontSize:RFValue(12,580),fontFamily:"Roboto-Bold"}}>Upload Your First Cover Picture</Text>
                              <Text style={{fontSize:RFValue(10,580),fontFamily:"Roboto-Regular",marginTop:2}}>Upload your cover picture to showcase your profile good to your customers</Text>
                          
                            </View>
                            
                          </TouchableOpacity>

                            :
                            <></>
                }
                          
                          <Demo navigation={this.props.navigation}/>
                   </ScrollView>
            </View>
               

        

          
           
            </View>
           
        )
    }
}



export default Home;



const style=StyleSheet.create({
    bannerImg:{
        height:"100%",
        width:"100%",
        // marginTop:10
    },
    child: {
        height: 200,
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        marginRight:20,
        marginLeft:20,
        borderRadius:5,    
      },
    carousel:{
        width:"100%", 
        borderRadius: 15,
        height: 200,
        alignItems: 'center', 
        alignContent: 'center',
        alignSelf: 'center',
        // marginTop:5,
    },
    camIcon:{
        top:60,right:20,backgroundColor:"#dcdcdc",
    height:30,width:30,padding:5,alignContent:"center",
    borderRadius:30, justifyContent:"center"},

    editIcon:{
        position:"absolute",
        top:40,
        right:5,backgroundColor:"#dcdcdc",
        height:30,width:30,padding:5,alignContent:"center",
        borderRadius:30, justifyContent:"center"
    },
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10
    },
    Text:{
        position:"absolute",
        fontSize:RFValue(15,580),
        marginLeft:80,
        fontFamily:"Raleway-Medium"
    },
    
    profileImg:{
        height:85,
        width:85,
        borderRadius:100,
        // marginLeft:10
    },
    nameText:{
        color:'#fff',
        fontSize:RFValue(17,580),
        // paddingLeft:0,
        fontFamily:"Raleway-Regular",
    },
    text:{
        color:'#fff',
        fontSize:RFValue(11,580),
        // paddingLeft:10,
        fontFamily:"Roboto-Regular",
    },
    mainContainer:{
        backgroundColor:"#fff",
        flex:1,
        // top:-50,
        // position:"absolute",
        width:"100%",
        height:"100%",
        marginTop:-330,
        borderTopLeftRadius:30,
        borderTopRightRadius:30
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginBottom:5,
        marginTop:30,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fbf9f9",width:30,height:30,borderRadius:50,padding:5,alignSelf:"center"
    },
})