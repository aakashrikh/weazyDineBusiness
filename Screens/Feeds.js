import React, { Component } from 'react';
import {
    Text,View,ScrollView,
    StyleSheet,Image,Pressable,Dimensions,
    TouchableOpacity,ImageBackground,ActivityIndicator,FlatList
} from 'react-native';
import {Icon,Header,Input} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Post from '../Components/Post';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');
const options = {
    title: "Pick an Image",
    storageOptions:{
        skipBackup: true,
        path:'images'
    }
}


class Feeds extends Component{

    constructor(props){
        super(props);
        this.state={
           page:1,
           load_more:false,
           isloading:true,
           data:[]
        }
    }

    componentDidMount ()
    {
        this.fetch_feeds(this.state.page);
        this.focusListener = this.props.navigation.addListener('focus', () => {
          this.fetch_feeds(this.state.page);
          //   if(this.props.route.params != undefined && this.props.route.params.last_feed)
          // {
          //     console.warn("aakash",this.props.route.params.last_feed)
          //     var abs=[this.props.route.params.last_feed];
          //     this.setState({data:[...abs, ...this.state.data]})
          // }
  
          });
    }

    fetch_feeds = (page) =>
    {
        fetch(global.vendor_api+"get_user_feeds_vendor", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':global.token 
          },
          body: JSON.stringify({
              page:page,
              vendor_id:global.vendor,
              action_type:"vendor"
              // token:token,
          })})
          .then((response) => response.json())
          .then((json) => {
            console.warn(json)
            if(json.data.length>0){    
              this.setState({data:json.data})
                this.setState({feed_content:json.data[0].feed_content})
            // var obj=json.data;
            // var joined = this.state.data.concat(obj);
            // this.setState({ data: joined }) 
            //   this.setState({feed_content:json.data[0].feed_content})
            }
            this.setState({isloading:false})
            return json 
          })
          .catch((error) => {  
                console.error(error);   
              }).finally(() => {
                this.setState({isloading:false,load_more:false})
              })
    }

    //to load more feeds
    load_data = ()=>
    {
        var data_size=this.state.data.length;
        if(data_size>9)
        {
          var page=this.state.page+1;
          this.setState({page:page,first_data:[],load_more:true})
            this.fetch_feeds(page);

        }
    }

    //for header left component
    renderLeftComponent(){
        return(
        <View style={{width:win.width}} >
            <Text style={[styles.h3,]}>Feeds</Text> 
        </View>
        )
    }

    renderRightComponent(){
        return(
            <View>
                 <TouchableOpacity onPress={()=>this.props.navigation.navigate("NewPost")}>
                    <Image source={require('../img/add.png')} 
                    style={{height:25,width:25}}/>
                </TouchableOpacity>
            </View>
        )
    }

    gallery =()=>{
        // alert("chl be")
        ImagePicker.openPicker({
            width:"100%",
            height:700,
            cropping:true,
        }).then(image=>{
            console.log(image);
            this.setState({image:"Image Uploaded"})
            
            this.props.navigation.navigate("NewPost")

        })
    }

 postCard = ({item})=>
 {
     return(
        <View>
        <Post item={item} navigation={this.props.navigation} fetch_feeds={this.fetch_feeds} />
      </View>
     )
   
 }

  
    render(){
        return(
            <View style={[styles.container,{backgroundColor:"#fafafa"}]}>

            <View>
            <Header 
                statusBarProps={{ barStyle: 'light-content' }}
                leftComponent={this.renderLeftComponent()}
                // rightComponent={this.renderRightComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                    colors: ['#fff', '#fff'],
                
                
                }}
                />
            </View>

                {/* Component call for add post card */}
                {/* <AddPost/> */}
                
                {/* Component call for posts/feeds card */}
                <View style={{marginTop:10,backgroundColor:"#fafafa"}}>
                    
                <View>
          {(!this.state.isloading) ? 
          [
            (this.state.data.length>0)?
            <FlatList
            navigation={this.props.navigation}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={this.postCard}
            keyExtractor={(item, index)=>item.id}
            onEndReachedThreshold={0.5}
            onEndReached={()=>{this.load_data()}}
            />
            :
            <View >
               <Image source={require("../img/NP.png")}
             style={{width:Dimensions.get('window').width,height:300,marginTop:100}} />
             <Text style={{alignSelf:"center",marginTop:10,fontFamily:"Raleway-SemiBold",fontSize:RFValue(14,580)}}>No feeds found</Text>
           </View>
          ]
        : 
        <View>
        <SkeletonPlaceholder>
        <View style={{flexDirection: 'row', alignItems: 'center',marginLeft:25}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20}}>
            <View style={{width: 120, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
            />
          </View>
        </View>
        <View style={{marginTop: 10, marginBottom: 30,marginLeft:25}}>
          <View style={{width: 300, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
          />
          <View
            style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
          />
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={{flexDirection: 'row', alignItems: 'center',marginLeft:25}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20}}>
            <View style={{width: 120, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
            />
          </View>
        </View>
        <View style={{marginTop: 10, marginBottom: 30,marginLeft:25}}>
          <View style={{width: 300, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
          />
          <View
            style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
          />
        </View>
      </SkeletonPlaceholder>
      
      </View>
        }
         {this.state.load_more?
                                <View style={{alignItems:"center",flex:1,backgroundColor:"white",flex:1, paddingTop:20}}>
                      <ActivityIndicator animating={true} size="large" color="#326bf3" />
                      <Text style={styles.p}>Please wait...</Text>
                    </View>
                             :
                     <View></View>
                }
        </View>
                </View>

            <AddPost navigation={this.props.navigation} />
            
            </View>
        )
    }
}



class AddPost extends Component{
    render(){
        return(
            <View style={style.add}>
            <Pressable 
            onPress={()=>{this.props.navigation.navigate("NewPost")}}
            // onPress={()=>this.RBSheet.open()}
             >
                <Icon name="add-outline" 
                size={28}
                color='white' 
                style={{margin:10}}
                type="ionicon"  />
            </Pressable>
            {/* Bottom Sheet fot FAB */}
           
        </View>
                     


        )
    }
}


export default Feeds;

const style=StyleSheet.create({
    icon:{
        margin:10
    },
    image:{
        height:100,
        width:100,
        alignSelf:"center",
        marginTop:50
    },
    addPostCard:{
        backgroundColor:"#fff",
        borderRadius:10,
        alignSelf:"center",
        width:Dimensions.get("window").width/1.02,
        // width:"98%",
        padding:15,
        shadowColor: 'grey', 
        shadowOpacity: 1.5,
        elevation:10,
        shadowRadius: 10,
        shadowOffset: { width:1, height: 1 },
        marginTop:5
        
    },
    profileImage:{
        height:50,
        width:50,
        borderWidth:0.2 ,
        borderColor:"grey",
        borderRadius:50,
        marginTop:15
    },
    firstView:{
        flexDirection:"column",
        alignItems:"center",
        // padding:7,
        // backgroundColor:"red",
        borderRightColor:"#d3d3d3",
        borderRightWidth:1,
     
         
    },
    iconPencil:{
        marginLeft:20,
        fontSize:20,
        marginBottom:10
    },
    Text:{
        position:"absolute",
        fontSize:RFValue(16,580),
        marginLeft:80,
        fontFamily:"Raleway-Medium"
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
        backgroundColor: '#326bf3',
        borderRadius: 100,
   
}
})