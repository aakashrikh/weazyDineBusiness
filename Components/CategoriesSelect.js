import React, { Component } from 'react';
import {
    View,ImageBackground,
    StyleSheet,Pressable,
    Image,Text, TouchableOpacity
} from 'react-native';
import { DataTable } from 'react-native-paper';
import {Icon,Input} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';



class CategoriesSelect extends Component{
    constructor(props){
        super(props);
        this.state={
            selected:false,
            object:{},
            data:[]
        }
    }


    componentDidMount(){
        this.get_all_category();
        this.focusListener=this.props.navigation.addListener('focus',() =>
        {
            this.get_all_category();

        });
    }

    get_all_category=()=>
    {
            fetch(global.vendor_api+'get_all_category?category_id=0', {
            method: 'GET',
            })
            .then((response) => response.json())
            .then((json) => {
                console.warn(json.data)
                this.setState({data:json.data })                
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    update_cat(str)
    {
        const object=this.state.object;
        if(object[str])
        {
            object[str]=false;
        }
        else
        {
            object[str]=true; 
        }
        
        this.setState({object})
    }

    render(){
        
        return(
            <View>
                <View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* first row */}
                <Text>fhuduf</Text>
                {
                    
                    category.slice(0,3).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={value.img}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.name}fguyfuyfuf</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:"#3e3737"}]}  onPress={()=>{this.update_cat(value.id)}}>
                                <Image source={value.img}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.name}aa</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
<View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Row row */}
                
                {
                    
                    category.slice(3,6).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={value.img}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.name}</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:"#3e3737"}]}  onPress={()=>{this.update_cat(value.id)}}>
                                <Image source={value.img}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
<View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Row row */}
                
                {
                    
                    category.slice(6,9).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={value.img}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.name}</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:"#3e3737"}]}  onPress={()=>{this.update_cat(value.id)}}>
                                <Image source={value.img}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
<View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Row row */}
                
                {
                    
                    category.slice(9,12).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={value.img}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.name}</Text>
                            </TouchableOpacity>
                            
        
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:"#3e3737"}]}  onPress={()=>{this.update_cat(value.id)}}>
                                <Image source={value.img}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
<View style={{flexDirection:"row",justifyContent:"center",marginTop:10}}>
                {/* Row row */}
                
                {
                    
                    category.slice(12,15).map((value)=>{
                        return(
                            (!this.state.object[value.id])?
                            
                            <TouchableOpacity style={style.button} onPress={()=>{this.update_cat(value.id)}}>
                                    <Image source={value.img}
                                    style={style.image} />
                                    <Text style={[style.text,{color:"black"}]}>{value.name}</Text>
                            </TouchableOpacity>
                        :
                        <TouchableOpacity style={[style.button,{backgroundColor:"#3e3737"}]}  onPress={()=>{this.update_cat(value.id)}}>
                                <Image source={value.img}
                                style={style.image} />
                                <Text style={[style.text,{color:"white"}]}>{value.name}</Text>
                        </TouchableOpacity>
                            
                        )
                    })
                    
                }               
</View>
            </View>
            
        )
    
    }
}

export default CategoriesSelect;

const style=StyleSheet.create({
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
        height:95,
        width:"25%",
        // borderWidth:0.2,
        backgroundColor:"#fff",
        margin:10,
        borderRadius:20,
        shadowColor: 'grey',
        shadowOpacity: 1.5,
        elevation: 10,
        shadowRadius: 10,
        shadowOffset: { width:1, height: 1 },
    }
})