import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
    View, StyleSheet, Text
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';


class Categories extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }
    }
    componentDidMount ()
    {  
        
        this.get_category()
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.get_category()
        })
    }

    get_category = () => {
        fetch(global.vendor_api + 'fetch_vendor_category'
            , {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.context.token
                },
                body: JSON.stringify({
                })
            })
            .then((response) => response.json())
            .then((json) => {
                console.warn(json)
                this.setState({data:json.data })              
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false })
            });
    }
    
    render(){
        const {data} = this.state;

        let cat = data.map((cat,id)=>{
            global.vendor_id=cat.vendor_id
            return(
                <TouchableOpacity style={style.catButton}>
                    <Text style={style.catButtonText}>
                    {cat.name}fff
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
})