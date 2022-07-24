import React, { Component } from 'react';
import {
    View,TouchableOpacity,Pressable,
    StyleSheet,Text,Alert,
    Image,ActivityIndicator,ScrollView,Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon,Input} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';

import {Header} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
//Global StyleSheet Import
const styles = require('../Components/Style.js');
const win = Dimensions.get('window');

const options = {
    title: "Pick an Image",
    storageOptions:{
        skipBackup: true,
        path:'images'
    },
    quality:0.5
}

class UploadCovers extends Component{
     
    constructor(props){
        super(props);
        this.state={
            image:'',
            image_load:'',
            isloading:false,
            data:[]
            
        
    };
}
    //for header left component
 renderLeftComponent(){
    return(
    <View style={{width:win.width,flexDirection:"row"}} >
        <Icon name="arrow-back-outline"  type="ionicon"
        onPress={()=>this.props.navigation.goBack()} style={{top:2.5}}/>
        <Text style={[styles.h3,{paddingLeft:15,bottom:1}]}>Upload Cover Images</Text> 
    </View>
    )
}



//function to launch camera
camera = () => {
    launchCamera(options, response => {
      if (response.didCancel) {
        console.warn(response);
        console.warn('User cancelled image picker');
      } else if (response.error) {
        console.warn('ImagePicker Error: ', response.error);
      } else {
        // const source = {uri: response.assets.uri};
        let path = response.assets.map(path => {
          return (
            //  console.warn(path.uri)
            this.setState({image: path.uri})
          );
        });
        //  this.setState({image:path.uri})
        this.RBSheet.close();
      }
    });
  };
    
    
    //function to launch gallery
    gallery =()=>{
    ImagePicker.openPicker({
        width:Dimensions.get('window').width,
        height:600,
        cropping:true,
    }).then(image=>{
        
        console.log(image);
        // this.setState({image:"Image Uploaded"})
        this.setState({image:image.path});
        this.RBSheet.close()
        // this.upload_image();      
    })
    }
    
    //function to upload image
    upload_image = () =>
    {
        this.setState({isloading:true})
    
    this.setState({image_load:true});
    if(this.state.image != '')
            {
                var photo = {
                    uri: this.state.image,
                    type: 'image/jpg',
                    name:'akash.jpg'
                };
                 
            }
            var form = new FormData();    
            form.append("cover_picture", photo);
            
            fetch(global.vendor_api+'update_cover_vendor', { 
                method: 'POST',
                body: form,
                   headers: {    
                    'Content-Type': 'multipart/form-data',
                         'Authorization':global.token  
                        }, 
                         }).then((response) => response.json())
                                 .then((json) => {
                                     console.warn(json)
                                     if(json.status)
                                     {
                                         Toast.show('Image uploaded successfully!')
                                         this.props.navigation.navigate("ChooseCategories")
                                     }
                                    return json;    
                                }).catch((error) => {  
                                        console.error(error);   
                                     }).finally(() => {
                                        this.setState({isloading:false})
                                     });
        
    }

    alertFunc=(id)=>{
        Alert.alert(
          "Are you sure?",
          "Delete this Cover Image",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => this.delete_cover(id) }
          ]
        )
      }

    delete_cover=(id)=>{
        // alert(id)
        fetch(global.vendor_api+'delete_cover_vendor', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization':global.token  
                   }, 
                    body: JSON.stringify({ 
                        cover_id:id
                            })}).then((response) => response.json())
                            .then((json) => {
                                console.warn(json)
                                if(!json.status)
                                {
                                    var msg=json.msg;
                                    Toast.show(msg);
                                }
                                else{
                                    Toast.show("Image deleted!") 
                                }
                                
                               return json;    
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isLoading:false})
                                    this.get_cover()
                                });
        
    }

    next=()=>{
       
        this.props.navigation.navigate("ChooseCategories")
          
    }

    render(){ 
       
        return(
            <View style={[styles.container,{flex:1}]}>
                  <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("ChooseCategories");}}
                            style={[styles.buttonStyles,{marginTop:25}]}>
                                <LinearGradient 
                                    colors={['#326bf3', '#0b2654']}
                                    style={{height:30,width:55,borderRadius:5,justifyContent:"center",
                                    alignSelf:"center",
                                    margin:10,
                                    alignSelf:"flex-end"}}>

                                    <Text style={{
                                    color:'#fff',alignSelf:"center",fontSize:RFValue(11, 580)}}>Skip</Text>
                                    
                                </LinearGradient>
                            </TouchableOpacity> 
            <ScrollView >
            
            <Text style={[styles.h4,{alignSelf:"center",fontFamily:"Roboto-Medium",marginTop:20}]}>
                    Step 4 of 6
                    </Text>    

                {/* heading */}
                <Text style={[styles.heading,{marginTop:10,alignSelf:"center"}]}>Cover Photo</Text>

                <View style={{marginTop:60}}>
                    {this.state.image=="" ?
                    <Image source={require("../img/cover.jpg")} style={style.image}/>
                :
                <View style={{height:265,width:400,padding:5,borderWidth:3,borderColor:'#ececec',alignSelf:'center',borderRadius:5}}>
                <Image source={{uri:this.state.image}} resizeMode="cover"
                style={{ width:"100%", height: 250,marginBottom:10 }} />
                
                </View>
                }
                </View>  
                        {/* Button */}
                  
            {this.state.image=="" ?
            <TouchableOpacity
            onPress={()=>this.RBSheet.open()}
            style={[styles.buttonStyles,{marginTop:100, alignSelf:"center",width: "65%",}]}>
                <LinearGradient 
                    colors={['#326bf3', '#0b2654']}
                    style={[styles.signIn]}>

                    <Text style={[styles.textSignIn, {
                    color:'#fff'}]}>Upload Cover Photo</Text>
                    
                </LinearGradient>
            </TouchableOpacity>
            :
            <View>
            {!this.state.isloading ? 
            <View>
            <TouchableOpacity
                onPress={()=>this.upload_image()}
                style={[styles.buttonStyles,{marginTop:100,alignSelf:"center",width: "65%",}]}>
                    <LinearGradient 
                        colors={['#326bf3', '#0b2654']}
                        style={[styles.signIn]}>

                        <Text style={[styles.textSignIn, {
                        color:'#fff'}]}>Next</Text>
                        
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.RBSheet.open()} style={{flexDirection:"row",marginTop:10,alignSelf:"center", position:'absolute',}}>
                    <Icon name="repeat-outline" type="ionicon" />
                    <Text style={styles.h4}>Retake</Text>
                </TouchableOpacity>
                </View>
                :
                <View style={style.loader} >
                <ActivityIndicator size="large" color="#326bf3" />
                </View>
                        }
                </View> }
                        
                        </ScrollView> 

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
                        
                
            </View>
        )
    }
}

export default UploadCovers




const style=StyleSheet.create({
    image:{
        height:250,
        width:"100%"
    },
    serviceImg:{
        height:80,
        width:120,
        // borderWidth:0.2,
        borderColor:"#000",
        alignSelf:"center",
        // marginLeft:30,
    },
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10
    },
    Text:{
        position:"absolute",
        fontSize:20,
        marginLeft:80,
        fontFamily:"Raleway-Medium"
    },
    buttonStyles:{
       backgroundColor:"#fff",
       borderRadius:50,
       height:20,
       width:20,
       alignItems:"center",
        position:"absolute",
        right:-5,
        margin:10,
        
        
      },
      activestep:{
        width:25,
        height:25,
        backgroundColor:"#326bf3",
        borderColor:"#326bf3",
        borderWidth:1,
        borderRadius:50
    },
    runningstep:{
        width:25,
        height:25,
        // backgroundColor:"#326bf3",
        borderColor:"#326bf3",
        borderWidth:1,
        borderRadius:50
    },
    step:{
        width:25,
        height:25,
        backgroundColor:"#d3d3d3",
        borderRadius:50
    },
    stepBorder:{
        width:60,
        borderTopWidth:1,
        marginTop:13,
        borderColor:"#696969"
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