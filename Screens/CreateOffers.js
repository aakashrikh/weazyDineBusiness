import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View,ImageBackground,Alert,
    StyleSheet,Pressable,Switch,TextInput,
    Image,Text,Dimensions,TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {Header,Icon,Input} from 'react-native-elements'
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import moment  from 'moment';
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import MultiSelect from 'react-native-multiple-select';
// import Categories from './Categories.js';

//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class CreateOffers extends Component{
    constructor(props){
        super(props);
        this.state={
            title:"",
            offer:"",
            product_name:"",
            product_id:"",
            package_name:"",
            package_id:"",
            offer_description:"",
            startDate:"YYYY-MM-DD",
            endDate:"YYYY-MM-DD",
            isloading:false,
            products:[],
            packages:[],
            selectedProduct:[],
            selectedPackage:[],
            isVisible:false,
            isStartVisible:false,
            height:0

        }
    }
     //for header left component
     renderLeftComponent(){
        return(
            <View style={{width:win.width,flexDirection:"row"}} >
                <Icon name="arrow-back-outline"  type="ionicon"
                onPress={()=>this.props.navigation.goBack()} style={{top:2.5}}/>
                <Text style={[styles.h3,{paddingLeft:15,bottom:1}]}>Create Offers</Text> 
            </View>
            )
    }
    componentDidMount(){
        this.get_product();
        this.get_package();
        this.setState({startDate:moment().format('YYYY-MM-DD')})
        this.setState({endDate:moment().add(1, 'days').format('YYYY-MM-DD')})
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
            this.get_product();
            this.get_package();
        })
    }

    

    //   Fetching vendor products
    get_product=()=>{
            var product_type="product"
            // console.warn(global.token)
            fetch(global.vendor_api+'vendor_get_vendor_product', { 
                method: 'POST',
                  headers: {    
                      Accept: 'application/json',  
                        'Content-Type': 'application/json',
                        'Authorization': global.token
                       }, 
                        body: JSON.stringify({ 
                            vendor_category_id:0 ,
                            product_type:product_type 
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
                                       this.setState({products:json.data})
                                       var nn=[];
                                       json.data.map((value,key) =>{
                                        var pp={};
                                        pp['id']=value.id;
                                        pp['name']=value.product_name;
                                        nn.push(pp)                                           
                                       });
                                       this.setState({product_name:nn})
                                       console.warn(this.state.product_name)
                                    }
                                   return json;    
                               }).catch((error) => {  
                                       console.error(error);   
                                    }).finally(() => {
                                       this.setState({isloading:false})
                                    });
    }
    onSelectedProductsChange = selectedProduct => {
        this.setState({ selectedProduct });
        console.log(this.state.selectedProduct)
      };

    // Fetching Vendor Packages
    get_package=()=>{
        var product_type="package"
        fetch(global.vendor_api+'vendor_get_vendor_product', { 
            method: 'POST',
              headers: {    
                  Accept: 'application/json',  
                    'Content-Type': 'application/json',
                    'Authorization': global.token
                   }, 
                    body: JSON.stringify({ 
                        vendor_category_id:0 ,
                        product_type:product_type 
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
                                   this.setState({packages:json.data})
                                   var nn=[];
                                   json.data.map((value,key) =>{
                                    var pp={};
                                    pp['id']=value.id;
                                    pp['name']=value.product_name;
                                    nn.push(pp)                                           
                                   });
                                   this.setState({package_name:nn})
                                   console.warn(this.state.package_name)
                                }
                               return json;    
                           }).catch((error) => {  
                                   console.error(error);   
                                }).finally(() => {
                                   this.setState({isloading:false})
                                });
    }
    onSelectedPackagesChange = selectedPackage => {
    this.setState({ selectedPackage });
    };

    // Date picker function
    showPicker =()=>{
        // alert("hi");
        this.setState({
            isVisible:true
        })
    
    }

    handlePicker=(date)=>{
        if(this.state.endDate=="YYYY-MM-DD"){
            this.setState({endDate:this.state.endDate})
        }
        this.setState({
            isVisible:false,
            endDate: moment(date).format('YYYY-MM-DD')
        })
    }

    hidePicker =()=>{
        this.setState({
            isVisible:false
        })
    }

    startShowPicker =()=>{
        this.setState({
            isStartVisible:true
        })
    
    }

    startHandlePicker=(date)=>{
        if(this.state.startDate=="YYYY-MM-DD"){
            this.setState({startDate:this.state.startDate})
        }
        this.setState({
            isStartVisible:false,
            startDate:moment(date).format('YYYY-MM-DD')
        })
    }

    startHidePicker =()=>{
        this.setState({
            isStartVisible:false
        })
    }
    // Create offer function
    create_offer=()=>{
        
        let numberValidation=/^[0-9]+$/;
        let isnumValid=numberValidation.test(this.state.offer);

        if(this.state.title =="" || this.state.offer =="" || this.state.offer_description==""  || this.state.startDate =="YYYY-MM-DD" || this.state.endDate  == "YYYY-MM-DD")
        {
            Toast.show("All fields are required !");
        }
        else if(this.state.title == "")
        {
            Toast.show("Title is required !");
        }
        else if (!isnumValid)
        {
            Toast.show("Enter valid offer value!");
        }
       
        else if (this.state.startDate == "YYYY-MM-DD")
        {
            Toast.show("Offer Start date is required !");
        }else if (this.state.endDate == "YYYY-MM-DD")
        {
            Toast.show(" Offer End date required !");
        }
         else{
            this.setState({isloading:true});
            var title=this.state.title;
            var offer_percentage=this.state.offer;
            var selectedProduct=this.state.selectedProduct;
            var selectedPackage=this.state.selectedPackage;
            var startDate=this.state.startDate;
            var endDate=this.state.endDate;
            var description=this.state.offer_description
            fetch(global.vendor_api+'add_vendor_offer', {                
                 method: 'POST',
                   headers: {    
                       Accept: 'application/json',  
                         'Content-Type': 'application/json',
                         'Authorization':global.token  
                        }, 
                         body: JSON.stringify({   
                            offer_name: title, 
                            offer: offer_percentage,
                            start_date:startDate,
                            end_date:endDate,
                            offer_description:this.state.offer_description

                                 })}).then((response) => response.json())
                                 .then((json) => {
                                     console.warn(json)
                                     if(!json.status)
                                     {
                                         var msg=json.msg;
                                         Toast.show(msg);
                                     }
                                     else{
                                         Toast.show(json.msg)
                                        this.props.navigation.navigate("Offers"
                                        )
                                     }
                                    return json;    
                                }).catch((error) => {  
                                        console.error(error);   
                                     }).finally(() => {
                                        this.setState({isloading:false})
                                     });
        }
    }

    render(){
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
                <ScrollView >
                <View style={{flex:1,marginBottom:15,borderTopWidth:1,borderColor:"#d3d3d3"}}>
                <View>
                    <Text style={style.fieldsTitle}>
                        Offer Title
                    </Text>
                    <TextInput 
                    value={this.state.title}
                    onChangeText={(e)=>{this.setState({title:e})}}
                    style={style.textInput}/>
                </View>

                <View>
                    <Text style={style.fieldsTitle}>
                        Offer (%)
                    </Text>
                    <TextInput 
                    value={this.state.offer}
                    onChangeText={(e)=>{this.setState({offer:e})}}
                    keyboardType="numeric"
                    maxLength={2}
                    style={style.textInput}/>
                </View>

                {/* Category View */}

                {/* <View>
                <Text style={style.fieldsTitle}>Menu</Text>
                    <View style={{marginLeft:20,marginRight:20,}}>
                    <MultiSelect
                    items={this.state.product_name}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedProductsChange}
                    selectedItems={this.state.selectedProduct}
                    selectText="Select Menu"
                    searchInputPlaceholderText="Search Menu..."
                    onChangeInput={ (text)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#EDA332"
                    selectedItemIconColor="#000"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#000' }}
                    submitButtonColor="#EDA332"
                    submitButtonText="Submit"
                    />
                 </View>
                 <TouchableOpacity style={style.uploadButton} onPress={()=>this.props.navigation.navigate("CreateService",{back:"CreateOffers"})} >
                                <Text style={style.buttonText}>
                                    Add new
                                </Text>
                            </TouchableOpacity>
                </View>
                <View>
                <Text style={style.fieldsTitle}>Combos</Text>
                    <View style={{marginLeft:20,marginRight:20,}}>
                    <MultiSelect
                    items={this.state.package_name}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedPackagesChange}
                    selectedItems={this.state.selectedPackage}
                    selectText="Select Combo"
                    searchInputPlaceholderText="Search Combo..."
                    onChangeInput={ (text)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#EDA332"
                    selectedItemIconColor="#000"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#000' }}
                    submitButtonColor="#EDA332"
                    submitButtonText="Submit"
                    />
                 </View>
                 <TouchableOpacity style={style.uploadButton} onPress={()=>this.props.navigation.navigate("CreatePackages",{back:"CreateOffers"})} >
                                <Text style={style.buttonText}>
                                    Add new
                                </Text>
                            </TouchableOpacity>
                </View> */}

                <View>
                    <Text style={style.fieldsTitle}>
                        Offer description
                    </Text>
                    <TextInput 
                    multiline={true}
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height })
                    }}
                    
                    value={this.state.offer_description}
                    onChangeText={(e)=>{this.setState({offer_description:e})}}
                    // keyboardType="numeric"
                    style={[style.textInput,{alignItems:"flex-start",height: Math.max(35, this.state.height)}]}
                    />
                </View>
                    <View>
                    <Text style={style.fieldsTitle}>
                        Starts from
                    </Text>
                    <View style={{borderBottomWidth:1,borderColor:"#d3d3d3",marginLeft:20,marginRight:30, paddingBottom:10}}>
                        <Pressable onPress={()=>this.startShowPicker()}>
                            <Text style={[styles.h4,{color:"#5d5d5d"}]}>
                        {this.state.startDate}
                    </Text>
                        </Pressable>
                        </View>
                </View>
                 {/* date picker */}
                 <DateTimePicker
                    isVisible={this.state.isStartVisible}
                    mode={"date"} 
                    is24Hour={false}
                    minimumDate={new Date()}
                    onConfirm={this.startHandlePicker}
                    onCancel={this.startHidePicker}
                />

                <View>
                    <Text style={style.fieldsTitle}>
                        Ends on
                    </Text>
                    <View style={{borderBottomWidth:1,borderColor:"#d3d3d3",marginLeft:20,marginRight:30, paddingBottom:10}}>
                        <Pressable onPress={()=>this.showPicker()}>
                            <Text style={[styles.h4,{color:"#5d5d5d"}]}>
                        {this.state.endDate}
                    </Text>
                        </Pressable>
                        </View>
                </View>
                 {/* date picker */}
                 <DateTimePicker          
                    isVisible={this.state.isVisible}
                    mode={"date"} 
                    is24Hour={false}             
                    minimumDate={new Date()}
                    onConfirm={this.handlePicker}
                    onCancel={this.hidePicker}
                />
                {!this.state.isloading?
<View>
                <TouchableOpacity 
                onPress={()=>this.create_offer()}
                style={style.buttonStyles}>
                <LinearGradient 
                    colors={['#EDA332', '#EDA332']}
                    style={styles.signIn}>

                    <Text style={[styles.textSignIn, {color:'#fff'}]}>
                    Save</Text>
                </LinearGradient>
                </TouchableOpacity>
                </View>
                :
                <View style={style.loader}>
                <ActivityIndicator size={"small"} color="#EDA332" />
            </View>
    }

            </View>
                </ScrollView>
            </View>
        )
    }
}
export default CreateOffers


const style=StyleSheet.create({
    fieldsTitle:{
        fontFamily:"Raleway-Regular",
            fontSize:RFValue(15,580),
            paddingLeft:20,
            padding:10,
    },
    textInput:{
      borderWidth: 1,
      borderColor:"#d3d3d3",
        color:"#5d5d5d",
    //   backgroundColor: '#f5f5f5',
      borderRadius:5,
      padding:5,
      width:Dimensions.get("window").width/1.1,
      height: 40,
      alignContent: 'center',
      alignSelf: 'center',
      fontSize:15,
    },  
    buttonStyles:{
        width:"35%",
        alignSelf:"center",
        marginTop:50,
        marginRight:5,
        marginBottom:20
      },
      uploadButton:{
        // backgroundColor:"#EDA332",
        borderColor:"black",
        borderWidth:1,
        width:90,
        height:30,
        justifyContent:"center",
        padding:5,
        borderRadius:5,
        alignItems:"center",
        alignSelf:"flex-end",
        marginLeft:30,
        marginTop:20,
        marginRight:20
    },
    buttonText:{
        fontFamily:"Raleway-SemiBold",
        color:"#000"
    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 20,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        justifyContent:"center",
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})