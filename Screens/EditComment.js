import React, { Component } from 'react';
import {
    View,ImageBackground,TouchableOpacity,
    StyleSheet,Pressable,ActivityIndicator,
    Image,Text,Dimensions, ScrollView, ToastAndroid
} from 'react-native';
import { FlatList} from "react-native-gesture-handler";
import LinearGradient from 'react-native-linear-gradient';
import {Header,Icon} from "react-native-elements";
import { TextInput } from 'react-native-gesture-handler';
import Toast from "react-native-simple-toast";
import RBSheet from "react-native-raw-bottom-sheet";
//Global Style Import
const styles = require('../Components/Style.js');

class EditComment extends Component{
    constructor(props){
        super(props);
        console.warn(props)
        this.state={
            input:this.props.route.params.comment,
            comment_id:this.props.route.params.id,
            feed_id:this.props.route.params.feed_id,
            object:{},
            data:[],
            isLoading:true,
            posting:true,
            edit:false
        };
    }

    send=()=>{
    //  console.warn(item_id)
     if(this.state.input=="" || this.state.input==null){
        Toast.show("Write a comment")
    }
    else{
        this.setState({input:""})
        
    fetch(global.vendor_api+"reply_feed_comment_vendor", {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization':global.token 
        },
        body: JSON.stringify({
            comment_id:this.state.comment_id,
            reply:this.state.input,
            feed_id:this.state.feed_id
        })
        }).then((response) => response.json())
        .then((json) => {
            console.warn(json)
           if(!json.status){
               Toast.show(json.msg)
           }
            else
            {
             Toast.show(json.msg)   
            }
            this.props.navigation.navigate("Comments")
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
}
      //for header left component
renderLeftComponent(){
    return(
      <View style={{top:10}}>
        <Icon type="ionicon" name="arrow-back-outline"
        onPress={()=>{this.props.navigation.goBack()}}/> 
      </View>
    )
  }
  //for header center component
  renderCenterComponent()
  {
  return(
  <View>
  <Text style={style.text}>Reply Comment</Text>
  </View>
  
  )
  }
    render(){
        return(
            <View style={[styles.container,{backgroundColor:"#fff",height:"100%"}]}>
                               
            <Header 
            statusBarProps={{ barStyle: 'dark-content' }}
            centerComponent={this.renderCenterComponent()}
            leftComponent={this.renderLeftComponent()}
            ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
            colors: ['white', 'white'],
            start: { x: 0, y: 0.5 },
            end: { x: 1, y: 0.5 },
            }}
            backgroundColor="#ffffff"
            />
            <View style={{flexDirection:"row",bottom:0,width:"100%",borderTopWidth:1,borderColor:"#fafafa", paddingLeft:10,backgroundColor:"#f5f5f5", paddingBottom:10}}>
                <Image source={{uri:global.image_url+this.props.route.params.pic}} style={[style.profileImage,{marginTop:10}]}/>
                <TextInput style={{width:"80%",paddingLeft:10,fontSize:14,color:"#5d5d5d",fontFamily:"Roboto-Regular"}}
                // ref={this.taskInput}
                 placeholder="Reply to a comment"
                 placeholderTextColor='#5d5d5d'
                 value={this.state.input}
                onChangeText={(v)=>{this.setState({input:v})}} />

                {this.state.posting ?
                <Text style={{marginTop:15}}>
                <Icon name="send" size={24} type="ionicon"
                onPress={() => {this.send(this.props.route.params.id)}}/>
                </Text>
                :
                <View>
                    <ActivityIndicator size="small" color="#326bf3"
                    style={{top:20}} />
                </View>
                }
                </View>

            </View>
        )
    }
}

export default EditComment

const style=StyleSheet.create({
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:20,
        margin:5
    },
    profileImage:{
        height:37,
        width:37,
        borderRadius:20,
        // marginTop:20,
        // marginLeft:10
    },
    name:{
      fontFamily:"Raleway-Bold",
      fontSize:15,
      marginLeft:10,
      marginTop:-15,
    },
    postTime:{
        fontFamily:"Roboto-Regular",
        color:"grey",
        marginLeft:10
      },

}
)