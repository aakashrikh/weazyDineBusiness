import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View,ImageBackground,Alert,
    StyleSheet,Pressable,Switch,
    Image,Text,Dimensions,TouchableHighlight,
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {Header,Icon} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import Loading from './Loading.js';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import Categories from './Categories.js';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');


class Packages extends Component{
    constructor(props){
        super(props);
        this.state={
            data:'',
            category:'',
            object:{},
            // vendor_category_id:0,
            isloading:true,
            isLoading:false,
            select:{},
            last_select:'',
            page:1,
            load_data:true,
            active_cat :0
            // prod_id:''
        }
    }
    componentDidMount = async()=>
    {  
        this.get_category();
        this.get_vendor_product(0,1)
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.get_category();
        })
    }

    // Function to load data while scrolling
    load_more=()=>{
        var data_size=this.state.data.length
        if(data_size>9){
            var page=this.state.page+1
            this.setState({page:page})
            this.get_vendor_product(this.state.last_select,page)
        }
    }

    get_vendor_product=(category_id,page)=>{
        // console.warn(global.token)
        this.setState({load_data:true,isloading:true});
        fetch(global.vendor_api+'vendor_get_vendor_product', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                   }, 
                    body: JSON.stringify({ 
                        vendor_category_id:category_id ,
                        product_type:'package',
                        page:page
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                
                                if(!json.status)
                                {
                                    
                                    var msg=json.msg;
                                    // Toast.show(msg);
                                    this.setState({isloading:false,load_data:false})
                                    // Toast.show(json.errors[0])
                                }
                                else{
                                    if(json.data.length>0)
                                    {   
                                        json.data.map((value,key)=>{
                                            const object = this.state.object;
                                           
                                            if(value.status=='active')
                                            {
                                                object[value.id] =true;
                                            }
                                            else{
                                                object[value.id] =false;
                                            }
                                          
                                            this.setState({ object });
                                        })      
                                        this.setState({data:json.data})
                                    }
                                    else{
                                        this.setState({data:''})
                                        
                                    }
                                 
                                   
                                //    this.setState({prod_id:json.data[0].id})
                                //    alert(this.state.prod_id)
                                this.setState({isloading:false,load_data:false})
                                }
                               return json;    
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   
                                });
    }
    

    get_category=()=>{
        // this.setState({isLoading:true})
        fetch(global.vendor_api+'get_category_vendor?vendor_id='+global.vendor
         ,{
        method: 'GET',
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.status)
            {
                if(json.data.length>0)
                {
                    this.get_vendor_product(0,1);
                    this.setState({category:json.data,isloading:false });
                    
                }
                
            } 
            else{
                this.setState({isloading:false,category:""}) 
            }         
            return json;
        })
        .catch((error) => console.error(error))
        .finally(() => {
            
            
        });
}  
filter=(id)=>{
    this.setState({isloading:true})
    this.get_vendor_product(id,1);
    
    this.setState({active_cat:id});
    }

toggle=(id)=>{
    // alert(id)
    const object=this.state.object;
    if(object[id]==true)
    {
        object[id]=false;
        var status="inactive"
    }
    else
    {
        object[id]=true; 
        var status="active"
    }
    this.setState({object});
    fetch(global.vendor_api+'update_status_product_offer', { 
        method: 'POST',
          headers: {    
              Accept: 'application/json',  
                'Content-Type': 'application/json',
                'Authorization': global.token
               }, 
                body: JSON.stringify({ 
                    action_id:id,
                    type:'package' ,
                    status:status
                        })
                    }).then((response) => response.json())
                        .then((json) => {
                            // console.warn(json)
                            if(!json.status)
                            {
                                var msg=json.msg;
                                // Toast.show(msg);
                                
                            }
                            else{
                            //   Toast.show(json.msg)
                           }                                 
                       }).catch((error) => {  
                               console.error(error);   
                            }).finally(() => {
                               this.setState({isloading:false})
                            });
}



    render(){

        return(
            <View style={[styles.container,]}>
                            
                 
                      {/* Component for  Filter Services */}
                    
                          <View style={{borderBottomWidth:1,borderColor:"#dedede",paddingVertical:0}}>
    
                          <View style={{flexDirection:'row',padding:10}}>
                          {/* <TouchableOpacity style={style.button} onPress={()=>this.props.navigation.navigate("AddCategory")}>
                              <Text style={style.buttonText}>Add Category</Text>
                          </TouchableOpacity>   */}
                            <Categories  
                            navigation={this.props.navigation}
                            category={this.state.category}
                            filter={this.filter}
                            active_cat={this.state.active_cat}
                            get_vendor_product={this.get_vendor_product}
                            />
      
                          </View>
                          </View>
                     
                    <ScrollView style={{flex:1}}>
                      {/* Particular Card Component */}
                      {!this.state.isloading ? 
                      (this.state.data !="") ?
                        <Card navigation={this.props.navigation}
                        data={this.state.data}
                        category={this.state.category}
                        load_more={this.load_more}
                        load_data={this.state.load_data}
                        get_category={this.get_category}
                        get_vendor_product={this.get_vendor_product}
                        toggle={this.toggle}
                        object={this.state.object}
                         />
                        :
                        <View style={{paddingTop:120,alignItems:"center"}}>
                        <View style={{alignSelf:"center"}}>
                        <Image source={require("../img/no-product.png")}
                        style={{width:300,height:300}} />
                         <Text style={[styles.h3,{top:-20,alignSelf:"center"}]}>
                        No Products Found!
                        </Text>
                    </View>  
                    </View>
                        
                        :
                        <View >
                        <Loaders />
                        </View>
                      }
                  </ScrollView>
                 
               {/* fab button */}
                <View>
                {this.state.category=="" ?
                <TouchableOpacity style={style.fab}
                onPress={()=>this.props.navigation.navigate("AddCategory",{get_cat:this.get_category})}>
                        <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{alignSelf:"center"}}/>
                </TouchableOpacity>
                :
                <TouchableOpacity style={style.fab}
                onPress={()=>this.props.navigation.navigate("CreatePackages",{back:"Package",get_cat:this.get_category,get_vendor_product:this.get_vendor_product})}>
                        <Icon name="add-outline" color="#fff" size={25} type="ionicon" style={{alignSelf:"center"}}/>
                </TouchableOpacity>
                }
                </View>
               
            </View>

    )
}
}

export default Packages;

class Loaders extends Component {
    render() {
       return (
          <View>
             <SkeletonPlaceholder >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                   <View style={{ marginLeft: 5 }}>
                      <View style={{ width: win.width / 3.5, height: 110, borderRadius: 10 }} />
                   </View>
        
                   <View>
                      <View style={{ flexDirection: "row", }}>
                         <View>
                            <View style={{ width: 150, height: 15, marginLeft: 10, top: 5 }} />
                            <View style={{ width: 250, height: 20, marginLeft: 10, top: 10 }} />
                         </View>
                         <View style={{ height: 20, width: 35, right: 60, bottom: 5 }}></View>
                         <View style={{ height: 20, width: 20, right: 50, bottom: 5 }}></View>
                      </View>
                      <View style={{flexDirection:"row",alignSelf:"flex-end",left:-35,marginRight:20,marginTop:15}}>
                      <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                      <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                      </View>
                   </View>
 
 
                   
                </View>
 
               
             </SkeletonPlaceholder>
 
          </View>
       )
    }
 }

class Categories extends Component{   
    state={
        object:{},
        last_select:""
    }
    componentDidMount(){
        // console.warn(this.props.category)
        this.setState({data:this.props.category})
    }
   
    render(){
        return(
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

            <View style={{flexDirection:'row',justifyContent:"space-evenly"}}>
            {(!this.props.active_cat == 0) ?
                 <TouchableOpacity 
                 onPress={()=>this.props.filter(0)}>
                 <View style={style.catButton}>
                 <Text style={style.catButtonText}>
                     All
                 </Text>
                 </View>
             </TouchableOpacity>
             :
             <TouchableOpacity 
             onPress={()=>this.props.filter(0)}>
             <View style={[style.catButton,{backgroundColor:"#EDA332"}]}>
                <Text style={[style.catButtonText,{color:"#fff"}]}>
                 All
             </Text>
             </View>
         </TouchableOpacity>}     
            {(this.props.category != '')?
            this.props.category.map((cat,id)=>{
               
                return(
                <View>
                    {(this.props.active_cat != cat.id) ?
                <TouchableOpacity onLongPress={()=>this.delete_cat(cat.id)}
                onPress={()=>this.props.filter(cat.id)}>
                <View style={style.catButton}>
                <Text style={style.catButtonText}>
                    {cat.name}
                </Text>
                </View>
            </TouchableOpacity>
            :
            <TouchableOpacity 
                onPress={()=>this.props.filter(cat.id)}>
                <View style={[style.catButton,{backgroundColor:"#EDA332"}]}>
                <Text style={[style.catButtonText,{color:"#fff"}]}>
                    {cat.name}
                </Text>
                </View>
            </TouchableOpacity>
                    }
            </View>
               
                )
            
        })
        :
        <View></View>
        }
                        </View>

                    </ScrollView>
        )
    }
}

class Card extends Component{
    constructor(props){
        super(props);
        this.state={
            isOn:false,
            isOff:true,
            object:{},
            id:[],
            prod_id:'',
            
        }
    }
    
   
    alertFunc=()=>{
        this.RBSheet.close()
        Alert.alert(
          "Are you sure?",
          "Delete this Combo",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => this.delete_product() }
          ]
        )
      }

      delete_product=()=>{
        fetch(global.vendor_api+'update_status_product_offer', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                   }, 
                    body: JSON.stringify({ 
                        action_id:this.state.prod_id,
                        type:'product' ,
                        status:"delete"
                            })
                        }).then((response) => response.json())
                            .then((json) => {
                                // console.warn(json)
                                if(!json.status)
                                {
                                    var msg=json.msg;
                                    // Toast.show(msg);
                                    
                                }
                                else{
                                  Toast.show("Product deleted")
                                  this.props.get_vendor_product(0,1)
                               }                                 
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isloading:false})
                                });
                                
                                
      }
      
      editNavigation =()=>{
        // alert(this.state.id)
        // console.warn(this.props.category)
        this.props.navigation.navigate("EditPackage",
        {data:this.state.id,
        category:this.props.category,
        get_cat:this.props.get_category,
        get_vendor_product:this.props.get_vendor_product
    })
        this.RBSheet.close()
      }

      sheet=(id)=>{
          this.setState({id:id})
          this.RBSheet.open();
          this.setState({prod_id:id.id})
            
      }
     
      productCard = ({item}) => (
        <View style={style.card}>
        <View style={{flexDirection:"row",width:"100%" }}>
              {/* View for Image */}
               <View style={{width:"27%"}}>
                <Image source={{uri:global.image_url+item.product_img}}
                style={style.logo}/>
                </View>
                {/* View for Content */}
                
                <View style={style.contentView}>
                    {/* View for name and heart */}
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                         {/* Text View */}
                        <View style={{width:170,}}>
                <Text style={[styles.smallHeading,{top:10,}]}>
                    {item.product_name}
                    </Text>
                <Text numberOfLines={3} style={[styles.p,{top:5,fontSize:RFValue(9.5,580), }]}> 
                {item.description} 
                 </Text>
                </View>
                {/* View for toggle icon  */}
                <View style={{margin:5,marginTop:10,marginLeft:-5, flexDirection:"row"}}>
                    <View style={{marginRight:10}} >
                    <Switch 
                    trackColor={{false: "#d3d3d3", true : "#EDA332"}}
                    thumbColor={this.state.isOn[item.id] ? "white" : "white"}
                    value={this.props.object[item.id]}
                    onValueChange={()=>this.props.toggle(item.id)}
                    />
                    </View>
                    
                    <Icon type="ionicon" name="ellipsis-vertical"  onPress={()=>this.sheet(item)}  size={22} />
                </View>
                </View>

                  {/* Bottom Sheet for edit or delete options */}

                <RBSheet
                    ref={ref=>{this.RBSheet = ref;}}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={170}
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
                            onPress={()=>this.editNavigation()}>
                                <View style={{backgroundColor:"#f5f5f5",
                                height:40,width:40,alignItems:"center",justifyContent:"center", borderRadius:50}}>
                                <Icon type="ionicon" name="create-outline"/>
                                </View>
                                <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}>
                                Edit </Text>
                                </TouchableOpacity>
                            </View>

                            {/* to report */}
                            <View style={{flexDirection:"row",padding:10}}>
                             

                                <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>this.alertFunc()
                                  }>
                                <View style={{backgroundColor:"#f5f5f5",
                                height:40,width:40,justifyContent:"center",borderRadius:50}} >
                                <Icon type="ionicon" name="trash-bin"/>
                                </View>
                                <Text style={[styles.h4,{alignSelf:"center",marginLeft:20}]}
                                >Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


   
                </View>
                </RBSheet>
                {/* View for Price and offer */}
                <View style={{flexDirection:"row",justifyContent:"space-between",alignSelf:"flex-end", marginTop:8 }}>
                    <View style={{flexDirection:"row"}}>
                <Text style={[styles.p,{fontFamily:"Roboto-Regular",color:"grey" ,textDecorationLine: 'line-through',
                textDecorationStyle: 'solid'}]}>
                    {item.market_price}/-
                    </Text>
                    <Text style={[styles.p,{marginLeft:10, fontFamily:"Roboto-Bold"}]}>
                    {item.our_price}/-
                    </Text>
                    </View>
                    </View>

                </View>
                
           </View>
           </View>
      );

      render(){
        return(
            <View>
                <FlatList
                navigation={this.props.navigation}
                showsVerticalScrollIndicator={false}
                data={this.props.data}
                renderItem={this.productCard}
                keyExtractor={item=>item.id} 
                onEndReachedThreshold={0.5}
                onEndReached={()=>this.props.load_more()}
                />
                {this.props.load_data?
                     <View style={{alignItems:"center",flex:1,backgroundColor:"white",flex:1, paddingTop:20}}>
                      <ActivityIndicator animating={true} size="small" color="#EDA332" />
                    </View>
                             :
                     <View></View>
                }
            </View>
        )
    }
}

const style=StyleSheet.create({
    header:{
        width:Dimensions.get("window").width/2-40,
        height:50,
        backgroundColor:"#fff",
        justifyContent:"center",
        borderColor:"black"
    },
    headerText:{
        fontSize:RFValue(16,580),
        borderColor:"black",
        color:"black",
        alignSelf:"center",
        fontFamily:"Raleway-SemiBold",
    },
    card:{
        backgroundColor:"#fff",
        alignSelf:"center",
        width:Dimensions.get("window").width/1.05,
        top:7,
        marginBottom:10,
        shadowRadius: 50,
        shadowOffset: { width: 50, height: 50 },
        elevation:2,
        borderRadius:15,
        padding:6
    },
    logo:{
        height:90,
        width:"95%",
        // borderWidth:0.2,
        // borderRadius:10,
        borderColor:"black",
        margin:10,
        marginLeft:10
    },
    viewDetailsButton:{
        borderColor:"#000",
        height:35,
        flexDirection:"row",
        justifyContent:"space-evenly",
        width:110,
        alignContent:"center",
        alignItems:"center",
        alignSelf:"flex-end",
        borderRadius:10,
        // position:"absolute",
        // top:80,
        // left:165
        //alignSelf:"flex-end"
    },
    textButton:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(11,580),
        color:"#000",
        marginLeft:-10

    },iconView:{
        width:32,
        height:32,
        shadowColor: '#fafafa',
        shadowOpacity: 1,
        elevation: 1,
        padding:6,
        shadowRadius: 2,
        shadowOffset: { width:1, height: 1 },
        alignContent:"center",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:100
    },

    contentView:{
        flexDirection:"column",
        width:"68%",
        marginRight:10,
        // paddingBottom:10, 
        // borderBottomWidth:0.5,
        // borderColor:"#d3d3d3",
         marginLeft:10,
        //  marginTop:10,
        
       },
       fab:{
        backgroundColor:"#EDA332",
        borderRadius:100,
        height:50,
        width:50,
        bottom:10,
        right:10,
        // alignSelf:"flex-end",
        // margin:20,
        justifyContent:"center",
        position:"absolute"
    },
    button:{
        backgroundColor:"#EDA332",
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