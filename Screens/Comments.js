import React, { Component } from 'react';
import {
    View,TouchableOpacity,
    StyleSheet,ActivityIndicator,
    Image,Text,Keyboard
} from 'react-native';
import { FlatList} from "react-native-gesture-handler";
import LinearGradient from 'react-native-linear-gradient';
import {Header,Icon} from "react-native-elements";
import { TextInput } from 'react-native-gesture-handler';
import Toast from "react-native-simple-toast";
import RBSheet from "react-native-raw-bottom-sheet";
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';

//Global Style Import
const styles = require('../Components/Style.js');

class Comments extends Component{
    constructor(props){
        super(props);
        console.warn(props);
        this.taskInput=React.createRef();
        this.textInput=React.createRef();
        this.state={
            input:"",
            object:{},
            data:[],
            feed_id:this.props.route.params.id,
            isLoading:true,
            posting:true,
            edit:false
        };
    }
    componentDidMount(){
        this.fetch_comment();
        this.focusListener=this.props.navigation.addListener('focus',() =>
        {
            this.fetch_comment();

        });
    }

    fetch_comment=()=>
    {
        console.warn(this.state.feed_id)
            fetch(global.vendor_api+'get_feed_comment_vendor?feed_id='+this.state.feed_id, {
            method: 'GET',
            headers: {    
                Accept: 'application/json',  
                  'Content-Type': 'application/json',
                  'Authorization':global.token
                 }, 
            })
            .then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if(!json.status){
                    // Toast.show("No data found")
                }           
                else{
                    this.setState({data:json.data })     
                }
                return json;
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    
    add_comment=(id)=>{
        if(this.state.input=="" || this.state.input==null){
            Toast.show("Write a comment")
        }
        else{
            this.setState({input:""})
            
        fetch(global.user_api+"add_feed_comment", {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':global.token 
            },
            body: JSON.stringify({
                feed_id:id,
                comment:this.state.input
            })
            }).then((response) => response.json())
            .then((json) => {
                console.log(json)
               if(!json.status){
                //    Toast.show(json.msg)
               }
                else
                {
                //  Toast.show(json.msg)   
                }
                this.fetch_comment();
                Keyboard.dismiss();
            })
            .catch((error) => console.error(error))
            .finally(() => {
              this.setState({ isLoading: false });
            });
        }
    }

    
    delete_comment=(id)=>{
        // console.warn(item_id)
        this.RBSheet.close()
        fetch(global.user_api+"delete_feed_comment", {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization':global.token 
            },
            body: JSON.stringify({
                comment_id:id,
                // token:token,
            })})
            .then((response) => response.json())
            .then((json) => {
            //   console.warn(json)
              if(json.status){
                //   Toast.show(json.msg);
                  Toast.show("Comment Deleted")

              }else{
                  Toast.show(json.msg)
              }
              this.fetch_comment()

              return json;    
            })
            .catch((error) => {  
                  console.error(error);   
                }).finally(() => {
                  this.setState({isLoading:false})
                })

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
  <Text style={style.text}>Comments</Text>
  </View>
  
  )
  }

  renderItem = ({item}) => (
    
    <View style={{flexDirection:"row", paddingTop:20,paddingLeft:10,paddingRight:20,paddingBottom:10}}>
    <Image source={
        {uri:global.image_url+item.profile_pic}} style={style.profileImage}/>
    <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
    <View style={{width:"82%"}}>
    <Text style={style.name}>{item.name}</Text>

        <Text style={{marginLeft:10, fontSize:RFValue(10,580),fontFamily:"Roboto-Regular",}}>
            {item.comment}
        </Text>

  
        <Text style={style.postTime}>
        {moment.utc(item.updated_at).local().startOf('seconds').fromNow()}</Text>
        </View>
        {/* <View style={{width:"18%"}}>
            <Icon name="ellipsis-vertical" type="ionicon" size={18} onPress={() => this.RBSheet.open()} />
        </View> */}
        
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
                                    onPress={()=>this.props.navigation.navigate("EditComment",{name:item.name,id:item.id, pic:item.profile_pic,comment:item.comment})}>
                                        <View style={{backgroundColor:"#f5f5f5",
                                        height:40,width:40,justifyContent:"center",borderRadius:50}}>
                                        <Icon type="ionicon" name="create-outline"/>
                                        </View>
                                        <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}>
                                        Edit</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* to report */}
                                    <View style={{flexDirection:"row",padding:10}}>
                                        <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>this.delete_comment(item.id)}>
                                        <View style={{backgroundColor:"#f5f5f5",
                                        height:40,width:40,justifyContent:"center",borderRadius:50}} >
                                        <Icon type="ionicon" name="trash-outline"/>
                                        </View>
                                        <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}
                                        >Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        </View>
           </RBSheet>

                        
        </View>

        
  );
 
    render(){
        let data =this.state;
        return (
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
                <View style={style.descriptionView}>

                <Image source={{uri:global.image_url+this.props.route.params.pic}} style={style.profileImage}/>
                <View style={{width:"80%"}}>
                
                    <Text style={{marginLeft:10, fontSize:14,fontFamily:"Roboto-Regular", color:"grey"}}>
                        {this.props.route.params.description} {data.name}
                    </Text>
                    <Text style={style.postTime}>
                    {moment.utc(this.props.route.params.time).local().startOf('seconds').fromNow()}
                    </Text>
                    </View>
                </View>

                    {/* Indivudual comment View */}
                    {
                        !this.state.isLoading ?
                        (this.state.data!="")?
                        <View style={{flex:1,marginBottom:70}}>
                            
                            <FlatList navigation={this.props.navigation}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={item=>item.id} />
                             
                            </View>
                            :
                            <View style={{marginTop:10,flex:1}}>
                                 <Image source={require('../img/no-comments.png')} style={{height:250,width:250,alignSelf:"center",marginTop:100,}}/>
                  
                                <Text style={{alignSelf:"center",fontFamily:"Raleway-SemiBold",color:"grey"}}>
                                    No comments found.
                                </Text>
                                </View>
                                :
                                <View style={{alignItems:"center",flex:1,backgroundColor:"white", paddingTop:250}}>
                                <ActivityIndicator size="large" color="#326bf3" />
                                <Text style={styles.p}>Please wait...</Text>
                            </View>

                    }
                    

                    {/* Comment Post View */}
                {/* <View>
                <View style={{flexDirection:"row",position:"absolute",
                borderRadius:50,bottom:0,width:"100%",borderTopWidth:1,borderColor:"#fafafa",
                paddingLeft:10,backgroundColor:"#f5f5f5",
                height:60,marginBottom:10}}>
                <Image source={{uri:global.image_url+data.profile_pic}} style={[style.profileImage,{marginTop:10}]}/>
                <TextInput style={{width:"80%",paddingLeft:10,fontSize:14,fontFamily:"Roboto-Regular"}}
                // ref={this.taskInput}
                placeholder="Comment here..."
                value={this.state.input }
                onChangeText={(v)=>{this.setState({input:v})}} />
                

                {this.state.posting ?
                <Text style={{marginTop:15}}>
                <Icon name="send" size={24} type="ionicon"
                onPress={() => {this.add_comment(this.state.feed_id)}}/>
                </Text>
                :
                <View>
                    <ActivityIndicator size="small" color="#326bf3"
                    style={{top:20}} />
                </View>
                }
                </View>
                </View> */}
                
              
            </View>
        )
    }
}
export default Comments




//internal stylesheet 



const style=StyleSheet.create({
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:20,
        margin:5
    },
    descriptionView:{flexDirection:"row",paddingTop:20,paddingLeft:10,paddingRight:20,paddingBottom:10, borderBottomWidth:0.2},
    
    profileImage:{
        height:35,
        width:35,
        borderRadius:20,
        marginTop:-5,
        // marginLeft:10,
        marginBottom:10
    },
    name:{
      fontFamily:"Raleway-Bold",
      fontSize:RFValue(11,580),
      marginLeft:10,
      marginTop:-15,
    },
    postTime:{
        fontFamily:"Roboto-Regular",
        color:"grey",
        marginLeft:10,
        fontSize:RFValue(9,580)
      },

})