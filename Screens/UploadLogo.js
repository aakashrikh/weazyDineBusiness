import React, { Component } from 'react';
import {
    View,TouchableOpacity,
    StyleSheet,Text,
    Image,ActivityIndicator,ScrollView,Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon,Input} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from "react-native-simple-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');
const options = {
    title: "Pick an Image",
    storageOptions:{
        skipBackup: true,
        path:'images'
    },
    quality:0.5
}
class UploadLogo extends Component{
    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.state={
            image:"",
            image_load:true,
            isloading:false
        }
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

        const source = {uri: response.assets.uri};
        let path = response.assets.map(path => {
          return (
            this.setState({image: path.uri})
          );
        });
         this.setState({image:path.uri})
        this.RBSheet.close();
      }
    });
  };
    
    //function to launch gallery
    gallery =()=>{
    ImagePicker.openPicker({
        width:400,
        height:600,
        cropping:true,
    }).then(image=>{
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
        var photo = {
            uri: this.state.image,
            type: 'image/jpg',
            name:'aakash.jpg'
          };
          
          var form = new FormData();
          form.append("update_profile_picture", photo);
          form.append("token", this.context.token);
          form._parts.map(value=>(
            <></>
        ))
    fetch(global.vendor_api+'update_profile_picture_vendor', { 
        method: 'POST',
            body: form,
              headers: {  
                'Content-Type': 'multipart/form-data', 
                'Authorization':this.context.token
                   }, 
                   
                }).
                   then((response) => response.json())
                        .then((json)  => {
                            if(json.status)
                            {
                                Toast.show("Profile picture uploaded!")
                                this.props.navigation.navigate("UploadCovers")
                            }
                           return json;    
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isloading:false})
                            });
    }
    
    render(){
        return(
            <View style={styles.container}>
                {/* heading */}
                <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("UploadCovers");}}
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
                <Text style={[styles.h4,{alignSelf:"center",fontFamily:"Roboto-Medium",marginTop:20}]}>
                    Step 3 of 6
                    </Text>    

                {/* heading */}
                <Text style={[styles.heading,{marginTop:10,alignSelf:"center"}]}>Shop Photo</Text>

                    
                 <View style={{marginTop:100}}>
                    {this.state.image=="" ?
                    <View style={{height:220,width:220,padding:5,borderWidth:3,borderColor:'#ececec',alignSelf:'center',borderRadius:5}}>
                    <Image source={require("../img/shop.png")} style={{width:220,height:160,left:-10,top:20}}/>
                    </View>
                :
                <View style={{height:220,width:220,padding:5,borderWidth:3,borderColor:'#ececec',alignSelf:'center',borderRadius:5}}>
                <Image source={{uri:this.state.image}} style={style.image} />
                </View>
                }
                    {/* {!this.state.image_load?
                <Image source={{
                            uri: this.state.upload_profile_picture
                          }} style={style.image}/>
                          :
                          <View style={[style.image,{paddingTop:30}]}>
                              <ActivityIndicator size="large" color="#326bf3" />
                              </View>
                        } */}

                {/* <Text style={style.editIcon}>
                <Icon type="ionicon" name="create-outline" 
                onPress={()=>this.RBSheet.open()}/>
                </Text> */}
                </View>

            {this.state.image=="" ?
            <TouchableOpacity
            onPress={()=>this.RBSheet.open()}
            style={[styles.buttonStyles,{bottom:100,position:'absolute',alignSelf:"center",width: "65%",}]}>
                <LinearGradient 
                    colors={['#326bf3', '#0b2654']}
                    style={[styles.signIn]}>

                    <Text style={[styles.textSignIn, {
                    color:'#fff'}]}>Upload Photo</Text>
                    
                </LinearGradient>
            </TouchableOpacity>
            :
            <View>
            {!this.state.isloading ? 
            <View>
            <TouchableOpacity
                onPress={()=>this.upload_image()}
                style={[styles.buttonStyles,{top:70,position:'absolute',alignSelf:"center",width: "65%",}]}>
                    <LinearGradient 
                        colors={['#326bf3', '#0b2654']}
                        style={[styles.signIn]}>

                        <Text style={[styles.textSignIn, {
                        color:'#fff'}]}>Next</Text>
                        
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.RBSheet.open()} style={{flexDirection:"row",top:10,alignSelf:"center", position:'absolute', }}>
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
                
                
            
                

                {/* Bottom Sheet fot FAB */}
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

            </View>
        )
    }
}

export default UploadLogo



const style=StyleSheet.create({
    icon:{
        margin:10
    },
    image:{
        height:200,
        width:200,
        borderRadius:20,
        // borderWidth:1,
        borderColor:"#000",
        alignSelf:"center",
    },
    editIcon:{
        // position:"absolute",
        alignSelf:"center",
        left:50,
        top:-25
    },
    fieldsText:{
        fontSize:RFValue(11,580),
        fontFamily:"Raleway-SemiBold",
        color:"grey",
        marginLeft:10
    },
    iconPencil:{
        marginLeft:20,
        // fontSize:20,
        fontSize:RFValue(18,580),
        marginBottom:10
    },
    container1:{
        backgroundColor:"#326bf3",
        width:"100%",
        height:230
    },
    Text:{
        position:"absolute",
        fontSize:RFValue(18,580),
        marginLeft:80,
        fontFamily:"Raleway-Medium"
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
        marginTop:40,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },
})