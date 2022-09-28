import React, { Component } from 'react';
import {
    Text,View,
    StyleSheet,Image,TextInput,
    ScrollView,Dimensions,TouchableOpacity
} from 'react-native';
import {Icon,Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
// import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import MultiSelect from 'react-native-multiple-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import {Picker} from '@react-native-picker/picker';
import { RFValue } from 'react-native-responsive-fontsize';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

var categ=[]

class EditCategory extends Component{

    constructor(props) {
        super(props);
        this.state = {
            category:this.props.route.params.name,
            status: "active"
           
        };
       
    }

    


        //for header left component
        renderLeftComponent(){
            return(
                <View style={{width:win.width,flexDirection:"row",paddingBottom:5,}} >
                    <Icon name="arrow-back-outline"  type="ionicon"
                    onPress={()=>this.props.navigation.goBack()} style={{top:2.5}}/>
                    <Text style={[styles.h3,{paddingLeft:15,bottom:1}]}>Edit Category </Text> 
                </View>
                )
        }
        add =()=>{
            //   alert("sfghsdf")
              if(this.state.category!="")
              { 
                fetch(global.vendor_api+'edit_category', { 
                    method: 'POST',
                      headers: {    
                          Accept: 'application/json',  
                            'Content-Type': 'application/json'  ,
                            'Authorization': global.token
                           }, 
                            body: JSON.stringify({   
                                name: this.state.category,
                                category_id:this.props.route.params.id,
                                status: this.state.status
                                    })}).then((response) => response.json())
                                    .then((json) => {
                                        // console.warn(json)
                                        if(!json.status)
                                        {
                                            var msg=json.msg;
                                            Toast.show(msg);
                                        }
                                        else{
                                           Toast.show(json.msg)
                                           this.props.navigation.goBack()
                                        
                                        }
                                       return json;    
                                   }).catch((error) => {  
                                           console.error(error);   
                                        }).finally(() => {
                                           this.setState({isloading:false})
                                        });
                
              }
              else{
                Toast.show('Please add Category first!');
              }
          }
    
    render(){
        
        return(
            <View style={styles.container}>
                    <View>
                    <Header 
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        
                        
                        }}
                    />
                </View>
                <View style={{flex:1,marginBottom:15,borderTopWidth:1,borderColor:"#d3d3d3"}}>
                
                 {/* Category View */}
                 <View>
                    <Text style={style.fieldsTitle}>
                      Category Name
                    </Text>
                    <TextInput 
                    value={this.state.category}
                    onChangeText={(e)=>{this.setState({category:e})}}
                    style={style.textInput}
                    />
                </View>
               
                {/* <View>
                    <Text style={style.fieldsTitle}>
                      Sub-Category
                    </Text>
                    <TextInput 
                    style={style.textInput}/>
                </View> */}
                <TouchableOpacity style={style.uploadButton} onPress={()=>this.add()} >
                                    <Text style={style.buttonText}>
                                        Save
                                    </Text>
                                </TouchableOpacity>
                </View>
                </View>
        )
    }
}

export default EditCategory

const style=StyleSheet.create({
    fieldsTitle:{
        fontFamily:"Raleway-Regular",
        // color:"grey",
        fontSize:RFValue(14,580),
        padding:10,
        paddingLeft:20
        
    },
    textInput:{
        borderWidth: 1,
        borderColor:"#d3d3d3",
        color:"#5d5d5d",
      //   backgroundColor: '#f5f5f5',
        borderRadius:5,
        padding:5,
        width:Dimensions.get("window").width/1.1,
        height: 40,
        alignContent: 'center',
        alignSelf: 'center',
        fontSize:RFValue(11,580),
    },
    uploadButton:{
        width:Dimensions.get("window").width/2.5,
        backgroundColor:"#EDA332",
        alignItems:"center",
        padding:10,
        borderRadius:5,
        alignSelf:"center",
        marginTop:20,
        paddingTop:1
    },
    buttonText:{
        fontFamily:"Raleway-SemiBold",
        color:"#fff",
        fontSize:RFValue(14,580)
    }

})