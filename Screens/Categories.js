import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
    View,ImageBackground,Alert,
    StyleSheet,Pressable,Switch,
    Image,Text,Dimensions
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {Header,Icon} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window')


class Categories extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }
    }
    componentDidMount = async()=>
    {  
        
        this.get_category()
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.get_category()
        })
    }


    get_category=()=>{
            fetch(global.vendor_api+'get_category_vendor?vendor_id='+global.vendor_id, {
            method: 'GET',
            })
            .then((response) => response.json())
            .then((json) => {
                // console.warn(json.data)
                this.setState({data:json.data })              
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }
    render(){
        const {data} = this.state;

        let cat = data.map((cat,id)=>{
            global.vendor_id=cat.vendor_id
            return(
                <TouchableOpacity style={style.catButton}>
                    <Text style={style.catButtonText}>
                    {cat.name}
                    </Text>
            </TouchableOpacity>
            )
        })
        return(
            
<View style={{borderBottomWidth:1,borderColor:"#dedede",paddingVertical:0}}>
    
                <View style={{flexDirection:'row',padding:10}}>
                    <TouchableOpacity style={style.button} onPress={()=>this.props.navigation.navigate("AddCategory")}>
                        <Text style={style.buttonText}>Add Category</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                        <View style={{flexDirection:'row',justifyContent:"space-evenly"}}>
                        {cat}
                        </View>

                    </ScrollView>
                </View>
            </View>
        )
    }
}
export default Categories;



const style=StyleSheet.create({
    img:{
        width:"100%",
        height:"100%",
    },
    storyimg:{
        width:"100%",
        height:"100%",
        borderRadius:30

    },
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10,
        // color:"#bc3b3b"
    },
    Text:{
        position:"absolute",
        fontSize:RFValue(13,580),
        marginLeft:80,
        // fontFamily:"Raleway-Medium",
        fontFamily: "Montserrat-Regular",
    },

    button:{
        backgroundColor:"#326bf3",
        padding:4,
        borderRadius:25,
        width:100,
        height:30,
        justifyContent:"center"

    },
    buttonText:{
        alignSelf:"center",
        color:"#fff",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Regular",
        fontSize:RFValue(9,580)
    },
    catButton:{
        // backgroundColor:"#BC3B3B",
        // padding:7,
        height:30,
        marginLeft:10,
        borderRadius:25,
        justifyContent:"center",
        borderColor:"#EBEBEB",
        borderWidth:1,
        width:100
    },
    catButtonText:{
        alignSelf:"center",
        color:"#222222",
        // fontFamily:"Roboto-Regular",
        fontFamily: "Montserrat-Regular",
        fontSize:RFValue(9,580)

    },
    add:{
        
            // borderWidth: 1,
            // borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            position: 'absolute',
            bottom: 15,
            right: 10,
            height: 50,
            backgroundColor: '#bc3b3b',
            borderRadius: 100,
         
    }
})