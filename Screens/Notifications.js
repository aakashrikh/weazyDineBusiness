import React, { Component } from 'react';
import {
    View,
    StyleSheet,Pressable,
    Image,Text,Dimensions,ScrollView,FlatList,ActivityIndicator,Linking, TouchableOpacity 
} from 'react-native';
import {Header,Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "react-native-simple-toast";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


//Global Style Import
const styles = require('../Components/Style.js');


const win = Dimensions.get('window');

class Notifications extends Component{

    constructor(props){
        super(props);
        this.state={
            data:[],
            page:0,
            load_more:false,
            isloading:true
        }
    }

  //for header left component
  renderLeftComponent(){
    return(
      <View style={{top:5}}>
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
  <Text style={style.text}>Notifications</Text>
  </View>
  
  )
  }

  fetch_notifications=()=>{
    var page=this.state.page+1;
    this.setState({page:page,load_more:true});
    fetch(global.vendor_api+'fetch_vendor_notification',{
        method:"POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          'Authorization':global.token 
        },
        body:JSON.stringify({
            page:page
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
            var obj=json.data.data;     
            console.warn(obj)
            this.setState({data:[...obj] , isloading:false})
          }
          this.setState({load_more:false});
      })
  }

  loadmore()
  {
    var data_size=this.state.data.length;
    if(data_size>9)
    {
        
        this.fetch_notifications
    }
  }
  componentDidMount()
  {
      this.fetch_notifications();
  }
  renderItem =({item})=>(
    <View >
    <View style={{flexDirection:"row",width:"100%",padding:10,borderBottomWidth:1,borderColor:"#d3d3d3"}}>
        {/* {/ For profile Image/ user image /} */}
        <View style={{width:"15%"}}>
        <Image source={{uri:global.image_url+item.profile_pic}} style={style.Image}/>
        </View>
        
        <View style={{justifyContent:"space-between",width:"85%"}}>
        {/* {/ View for Notification Text content and time /} */}
        <TouchableOpacity onPress={()=>{Linking.openURL(item.notification_url)}}>
        <View style={{flexDirection:"column",marginLeft:15,marginTop:0}}>
            <Text style={[styles.h5,{fontFamily:"Raleway-Bold"}]} > {item.notification_title}
              
            </Text>
            <Text style={[styles.p,{fontFamily:"Raleway-Regular",fontSize:12}]}>{item.notification_description}</Text>
            <Text style={[styles.h6,{color:"grey",marginTop:-13}]}>
            {moment.utc(item.created_at).local().startOf('seconds').fromNow()}
            </Text>
        </View>
        </TouchableOpacity>
        {/* {/ View for ellipsis icon /} */}
       
        </View>

    </View>
</View>
  )
    render(){
        return(
            <View style={styles.container}>
                
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                leftComponent={this.renderLeftComponent()}    
                centerComponent={this.renderCenterComponent()}        
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 }
                
                }}
                />

                {!this.state.isloading?
                (this.state.data.length>0) ?
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    onEndReached={()=>{this.loadmore()}}
                    onEndReachedThreshold={0.5}
                />
                :
                <View>
                   <Image source={require('../img/nonotification.png')} style={{height:180,width:180,alignSelf:"center",marginTop:100}}/>
                   <Text style={{alignSelf:"center",
                    fontFamily:"Raleway-SemiBold",fontSize:RFValue(14,580),color:"grey"}}>No Notifications</Text>
                </View>
                :
                
                <View>
                
            </View>
                }

                {this.state.load_more?
                <View style={style.loader}>
                     <ActivityIndicator color="#EDA332" size="large" />
                     </View>
                     :
                     <View></View>
                }
            </View>
        )
    }
}

export default Notifications;

class Notify extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
          <View>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    style={{flex:1}}
                />
          </View>
        )
    }
}

const style=StyleSheet.create({
    Image:{
        height:52,
        width:55,
        borderRadius:100,
        borderColor:"grey",
        borderWidth:0.2
    },
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5
    },
    loader:{
        shadowOffset:{width:50,height:50},
        marginBottom:5,
        marginTop:80,
        shadowRadius:50,
        elevation:5,
        backgroundColor:"#fff",width:40,height:40,borderRadius:50,padding:5,alignSelf:"center"
    },
})