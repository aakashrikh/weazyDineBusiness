import React, { Component } from 'react';
import {
    Text,View,ScrollView,Dimensions,Alert,
    StyleSheet,Image,Pressable,ActivityIndicator,
    TouchableOpacity,ImageBackground, ImageStore
} from 'react-native';
import {Icon,Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Demo from './Demo.js';
import RBSheet from 'react-native-raw-bottom-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import Toast from "react-native-simple-toast";
import { AuthContext } from '../AuthContextProvider.js';
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

class MultipleImage extends Component{
    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.state={
            image:'',
            image_load:'',
            isloading:true,
            data:[]
            
        
    };
}
    //for header left component
 renderLeftComponent(){
    return(
    <View style={{width:win.width,flexDirection:"row"}} >
        <Icon name="arrow-back-outline"  type="ionicon"
        onPress={()=>this.props.navigation.goBack()} style={{top:2.5}}/>
        <Text style={[styles.h3,{paddingLeft:15,bottom:1}]}>Select images</Text> 
    </View>
    )
}

componentDidMount(){
    this.get_cover()
}

get_cover=()=>{
    fetch(global.vendor_api+'get_cover_vendor', { 
        method: 'POST',
          headers: {    
              Accept: 'application/json',  
                'Content-Type': 'application/json',
                'Authorization':this.context.token
               }, 
                body: JSON.stringify({ 
                        })}).then((response) => response.json())
                        .then((json) => {
                            console.warn(json)
                            if(!json.status)
                            {
                                var msg=json.msg;
                                Toast.show(msg);
                            }
                            else{
                                this.setState({data:json.covers}) 
                            }
                            
                           return json;    
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isloading:false})

                            });
}

//function to launch camera
camera =()=>{
    launchCamera(options, (response)=>{
        
        if(response.didCancel){
            console.warn(response)
            console.warn("User cancelled image picker");
        } else if (response.error){
            console.warn('ImagePicker Error: ', response.error);
        }else{
            // const source = {uri: response.assets.uri};
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
        width:600,
        height:500,
        cropping:true,
    }).then(image=>{
        
        console.log(image);
        // this.setState({image:"Image Uploaded"})
        this.setState({image:image.path});
        this.upload_image();      
    })
    }
    
    //function to upload image
    upload_image = () =>
    {
        this.setState({isloading:true})
    this.RBSheet.close()
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
            console.warn(photo)
            fetch(global.vendor_api+'update_cover_vendor', { 
                method: 'POST',
                body: form,
                   headers: {    
                         'Authorization':this.context.token
                        }, 
                         }).then((response) => response.json())
                                 .then((json) => {
                                     console.warn(json)
                                     if(json.status)
                                     {
                                         Toast.show('Image uploaded successfully!')
                                     }
                                    return json;    
                                }).catch((error) => {  
                                        console.error(error);   
                                     }).finally(() => {
                                        this.get_cover()
                                        this.setState({isloading:false})
                                        
                                     });
        
    }

    alertFunc=(id)=>{
        
        Alert.alert(
          "",
          "Are you sure you want to delete this cover image?",
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
        this.setState({isloading:true})
        fetch(global.vendor_api+'delete_cover_vendor', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization':this.context.token  
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
                                    Toast.show("Cover deleted")
                                }
                                
                               return json;    
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isloading:false})
                                    this.get_cover()
                                });
        
    }

    render(){ 
        let covers = this.state.data.map((covers,id)=>{
        return(
            
            <View>
                
                
            <Image
            resizeMode="cover"
            style={{ width:"100%", height: 300,marginBottom:10 }}
            source={{
                uri: covers.image
            }}
            />
           <Pressable 
               onPress={()=>this.alertFunc(covers.id)}
                style={style.buttonStyles}>
                    <Icon name="close-outline" size={20} type="ionicon" />
                
                </Pressable> 
               
                
        </View>
        )
    })
        return(
            <View style={styles.container}>
                    <View>
                <Header 
                    statusBarProps={{ barStyle: 'dark-content' }}
                    leftComponent={this.renderLeftComponent()}
                    ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: ['#fff', '#fff'],
                    }}
                    backgroundColor="#ffffff"
                />
            </View>
            <ScrollView >
            <Text style={[styles.p,{fontSize:13,marginLeft:7}]}>
                                *You can select more than one cover image
                                </Text>
                             <View >   
                             <TouchableOpacity style={{ width:80,height:80,marginTop:20}} onPress={()=>this.RBSheet.open()}>
                                <View style={style.add}>
                                    <Icon name="add" size={35} color="#5BC2C1" />
                                    </View>
                                    </TouchableOpacity>
                       
                        <View style={{ marginTop: 10 }}>
                            {!this.state.isloading ?
                        <View>
                            {covers}
                            </View>
                            :
                            <View style={style.loader}>
                            <ActivityIndicator size="large" color="#5BC2C1" />
                            </View>
        }
                            
                        </View>
                        
                        </View>               
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
                                            <Icon name='camera' type="ionicon" color={'#5BC2C1'} size={25}/>
                                        </Text>
                                        <Text style={style.Text}>Take a picture</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.gallery} > 
                                        <Text style={style.iconPencil}>
                                            <Icon name='folder' type="ionicon" color={'#5BC2C1'} size={25}/>
                                        </Text>
                                        <Text style={style.Text}>Select from library</Text>
                                        </TouchableOpacity>
                            </View>
                        
                        </View>
                        </RBSheet>
                        
                {/* Button */}
                {/* <Pressable 
                onPress={()=>this.props.navigation.navigate("Home")}
                style={style.buttonStyles}>
                <LinearGradient 
                    colors={['#5BC2C1', '#0b2564']}
                    style={styles.signIn}>

                    <Text style={[styles.textSignIn, {color:'#fff'}]}>
                    Done</Text>
                </LinearGradient>
                </Pressable> */}
            </View>
        )
    }
}

export default MultipleImage


const style=StyleSheet.create({
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginBottom:5,
        marginTop:80,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
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
        // padding:2
        
      },
      add:{
        height:80,
        width:80,
        borderWidth:1,
        marginLeft:20,
        borderStyle:"dashed",
        borderRadius:10,
        alignItems:"center",
        paddingTop:20
    }
})