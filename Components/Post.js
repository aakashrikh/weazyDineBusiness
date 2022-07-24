import React, { Component } from 'react';
import {
    View,
    StyleSheet,ActivityIndicator,
    Image,Text,Dimensions, ScrollView, TouchableOpacity, Alert, FlatList
} from 'react-native';
import {Header,Icon} from "react-native-elements";
import Share from 'react-native-share';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "react-native-simple-toast";
import moment from 'moment';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Loading from '../Screens/Loading.js';

//Global Style Import
const styles = require('../Components/Style.js');

//this is the component for Post 
class Post extends Component{

    constructor(props) {
      super(props);
      // Don't call this.setState() here!
      this.state = {
        object:{},
        like:{},  
        isLoading: true,
        follow:{},
        token:'',
        id:"",
        page:1,
        feed_id:'',
        type:"",
        report:'',
        feed_content:[],
        noPost:true,
        load_more:false,
        feed_index:''
      };
    }
  

       //function for share
       myShare = async (title,content,url)=>{
        const shareOptions={
            title:title,
            message:content,
            url:url,
        }
        try{
            const ShareResponse = await Share.open(shareOptions);
    
        }catch(error){
            console.log("Error=>",error)
        }
    }
  
    
      //Function for delete
      alertFunc=()=>{
        this.RBSheet.close()
        Alert.alert(
          "Are you sure?",
          "Do you really want to delete the Post",
          [
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "yes", onPress: () => this.deleteFeed() }
          ]
        )
      }

        deleteFeed =()=>{
          // var aa=this.state.data.splice(this.state.feed_index,1);
          // this.setState({data:aa});

          // alert(this.state.id)
          fetch(global.vendor_api+'delete_feed_vendor',{
            method:"POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization':global.token 
            },
            body:JSON.stringify({
              feed_id:this.state.id,
              vendor_id:global.vendor,
              action_type:"vendor"
            })
          })
          .then((response)=>response.json())
          .then((json)=>{
            console.warn(json)
            if(!json.status){
              Toast.show(json.msg)
            }
            else
            {
              Toast.show("Deleted successfully")
              this.props.fetch_feeds(0);
              
            }   
          })
          
        }

        sheet(id,feed_index){
          this.setState({id:id,feed_index:feed_index})
          this.RBSheet.open();
        }

       

        
    render(){
     const {item} = this.props;
     console.warn(item);
      return(
        <View>
        {/* this is the card component for post */}
        <View style={style.card}>
          {/* Card Header */}
          <View style={style.cardHeader}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")}>
            <View style={{flexDirection:"row"}}>
              {/* logo */}
            <Image source={{uri:global.image_url+item.vendor_profile_pic}} style={style.profileImage}/>
            {/* name and time */}
            <View style={{flexDirection:"column",paddingLeft:15}}>
              <Text style={style.name}>{item.shop_name}</Text>
              <Text style={style.postTime}>
              {moment.utc(item.created_at).local().startOf('seconds').fromNow()}
                </Text>
            </View>
            </View>
            </TouchableOpacity>
            {/* follow button */}
            <View style={{flexDirection:"row"}}>
            
              <Text style={{alignContent:"flex-end",top:5,left:5}}
              onPress={() => this.sheet(item.id)}>

                <Icon name="ellipsis-vertical" type="ionicon" size={25}/>
              </Text>
              </View>
          </View>

           {/* Bottom Sheet for Post options */}

           <RBSheet
                        ref={ref=>{this.RBSheet = ref;}}
                        // animationType="slide"
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={180}
                        customStyles={{
                            container: {
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                              },
                        draggableIcon: {
                            backgroundColor: ""
                        }
                        }}
                    >
                        {/* bottom sheet elements */}
                    <View >
                        {/* new container search view */}
                            <View>
                                {/* to share */}
                                <View style={{flexDirection:"row",padding:10}}>
                                <TouchableOpacity style={{flexDirection:"row"}} 
                               onPress={()=>this.myShare(item.feed_description,'Checkout Our Latest Update',global.shareLink+'/feedView/'+item.id)}>
                                    <View style={{backgroundColor:"#f5f5f5",
                                    height:40,width:40,justifyContent:"center",borderRadius:50}}>
                                    <Icon type="ionicon" name="share-social"/>
                                    </View>
                                    <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}>
                                    Share</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* to unfollow */}
                                <View style={{flexDirection:"row",padding:10}} >
                                  
                                  <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>this.alertFunc()}>
                                  <View style={{backgroundColor:"#f5f5f5",
                                  height:40,width:40,justifyContent:"center",borderRadius:50}}>
                                    <Icon type="ionicon" name="trash-outline"/>
                                  </View>
                                  <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}>
                                    Delete</Text>
                                  </TouchableOpacity>
                                 
                                </View>
                            </View>
                    </View>
                    </RBSheet>


          {/* Image */}
          <View>
            {item.feed_content.map(feed=>{
              return(
            <Image 
            source={{uri:global.image_url+feed.content_src}} 
            // source={require("../img/post.jpg")}
            style={style.postImage}
            PlaceholderContent={<ActivityIndicator size="small" color="#0000ff" />}/>
              )
            })}
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>

              <View 
              style={{margin:3, marginLeft:10,flexDirection:"row"}}>
              <Icon type="ionicon" name="eye-outline" size={22}/>
              <Text style={[styles.h5,{fontFamily:"Roboto-Regular",marginTop:4,marginLeft:5}]}>
                {item.feed_view}
              </Text>
              </View>

              <View
              style={{margin:3,marginTop:4, marginLeft:10,flexDirection:"row"}}>
                <Text >
              <Icon type="ionicon" name="heart-outline"
              color="black" size={20}/>
              </Text>
              <Text style={[styles.h5,{fontFamily:"Roboto-Regular",marginTop:2,marginLeft:5}]}>
                {item.feed_like_count}
              </Text>
              </View>

              <View
              style={{margin:3,marginTop:4, marginLeft:10,flexDirection:"row"}}>
              <Icon type="ionicon" name="chatbubble-outline" size={18} onPress={()=>this.props.navigation.navigate("Comments",{description:item.feed_description,name:item.shop_name, time:item.created_at,id:item.id,pic:item.vendor_profile_pic})}/>
              <Text style={[styles.h5,{fontFamily:"Roboto-Regular",marginTop:2,marginLeft:5}]}>
                {item.feed_comment_count}
              </Text>
              </View>

              <View
              style={{margin:3,marginTop:4, marginLeft:10,flexDirection:"row"}}>
              <Icon type="ionicon" name="share-social" size={18} onPress={()=>this.myShare(item.feed_description,'Checkout Our Latest Update',global.shareLink+'/feedView/'+item.id)}/>
              <Text style={[styles.h5,{fontFamily:"Roboto-Regular",marginTop:2,marginLeft:5}]}>
                {item.feed_share}
              </Text>
              </View>


</View> 
            </View>
            <Text style={{padding:10,fontFamily:"Roboto-Regular"}}
            numberOfLines={3}>{item.feed_description}
            </Text>
          </View>

          {/* <View>
            <Icon type="ionicon" name="heart" />
          </View> */}
        </View>
          </View>
      )
  
  }
    
  }
  
export default Post;  





//internal stylesheet 
const style=StyleSheet.create({
    
    card:{
      backgroundColor:"#fff",
      marginBottom:10,
     
    },
    cardHeader:{
      flexDirection:"row",
      padding:10,
      justifyContent:"space-between",
      // backgroundColor:"red"
    },
    profileImage:{
        height:37,
        width:37,
        borderRadius:50
    },
    name:{
      fontFamily:"Raleway-SemiBold",
      // fontSize:15,
      fontSize:RFValue(11, 580),
    },
    postTime:{
      fontFamily:"Roboto-Regular",
      color:"grey"
    },
    postImage:{
      width:Dimensions.get("window").width,
      height:450
      // height:"100%"

    },followButton:{
      borderRadius:25,
      borderColor:"#000",
      borderWidth:1,
      alignItems:"center",
      alignContent:"center",
      justifyContent:"center",
      // padding:5,
      height:28,  
      width:90,
      top:5,
      // left:5
    },
    followButtonText:{
      fontFamily:"Roboto-SemiBold",
      // fontSize:13,
      fontSize:RFValue(9, 580),
      // alignSelf:"center",
      textAlign:"center",
      top:-5.8,
      left:3,
      color:"#fff",
    },
    
    unFollowButtonText:{
      color:"#000",
      fontFamily:"Roboto-SemiBold",
      // fontSize:13,
      fontSize:RFValue(9, 580),
      // alignSelf:"center",
      textAlign:"center",
      top:0,
      // left:3
    },

})