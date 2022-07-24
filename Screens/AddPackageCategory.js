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


const category = [{
    id: '1',
    name: 'Phone'
  }, {
    id: '2',
    name: 'Laptop'
  }, {
    id: '3',
    name: 'Gadgets'
  }, {
    id: '4',
    name: 'Spa'
  }, {
    id: '5',
    name: 'Fashion'
  }, {
    id: '6',
    name: 'Salon'
  }, {
    id: '7',
    name: 'Health'
  }, {
    id: '8',
    name: 'Restaurant'
  }, {
    id: '9',
    name: 'Gym'
    }
];


class AddPackageCategory extends Component{

    constructor(props) {
        super(props);

        this.state = {
            category:"",
            selectedCategories:[]
        };
    }

    onSelectedCategoryChange = selectedCategories => {
        this.setState({ selectedCategories});
      };

      add =()=>{
        //   alert("sfghsdf")
          if(this.state.category!="")
          {
            this.props.navigation.navigate("CreatePackages" ,{category:this.state.category})
          }
          else{
            Toast.show('Please add Category first!');
          }
      }

        //for header left component
        renderLeftComponent(){
            return(
                <View style={{width:win.width,flexDirection:"row",paddingBottom:5,}} >
                    <Icon name="arrow-back-outline"  type="ionicon"
                    onPress={()=>this.props.navigation.goBack()} style={{top:2.5}}/>
                    <Text style={[styles.h3,{paddingLeft:15,bottom:1}]}>Add Category</Text> 
                </View>
                )
        }
    
    render(){
        const { selectedCategories } = this.state;
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
                      Category 
                    </Text>
                    <TextInput 
                    value={this.state.category}
                    onChangeText={(e)=>{this.setState({category:e})}}
                    style={style.textInput}
                    />
                </View>
                <Text style={style.fieldsTitle}>Parent Category</Text>
                        <View style={{marginLeft:20,marginRight:20}}>
                        <MultiSelect
                        hideTags
                        items={category}
                        uniqueKey="id"
                        ref={(cat) => { this.multiSelect = cat}}
                        onSelectedItemsChange={this.onSelectedCategoryChange}
                        selectedItems={selectedCategories}
                        selectText="Select"
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={ (text)=> console.log(text)}
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="green"
                        selectedItemIconColor="green"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#326bf3"
                        // submitButtonStyle={{width:50}}
                        submitButtonText="Submit"
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
                                        Add
                                    </Text>
                                </TouchableOpacity>
                </View>
                </View>
        )
    }
}

export default AddPackageCategory

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
        backgroundColor:"#326bf3",
        width:105,
        height:40,
        justifyContent:"center",
        padding:5,
        borderRadius:5,
        alignSelf:"center",
        alignItems:"center",
        // marginLeft:20,
        marginTop:20
    },
    buttonText:{
        fontFamily:"Raleway-SemiBold",
        color:"#fff",
        fontSize:RFValue(14,580)
    }

})