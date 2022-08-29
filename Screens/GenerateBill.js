import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, TextInput,
    ScrollView, Dimensions, TouchableOpacity,Pressable,
    Modal
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
 
var radio_props = [
    {label: 'Google Pay/Paytm/UPI', value: 'UPI' },
    {label: 'Credit/Debit Card', value: 'card' },
    {label: 'Cash', value: 'cash' }
  ];
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

class GenerateBill extends Component {

    constructor(props) {

        super(props);
        this.state = {
            category: "",
            status: "active",
            data:[],
            isloading:true,
            cart:[],
            modalVisible: false,
            total_price:0,
            payment:0
        };
       
    }


    componentDidMount(){
    }

    //for header left component
    renderLeftComponent() {
        return (
            <View style={{ top:5}}>
                <Icon type="ionicon" name="arrow-back-outline"
                    onPress={() => { this.props.navigation.goBack() }} />
            </View>
        )
    }
    //for header center component
    renderCenterComponent() {
        return (
            <View>
                <Text style={style.text}>Tables 1</Text>
            </View>

        )
    }

    mark_complete = ()=>
    {
        fetch(global.vendor_api + 'update_order_status_by_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
              order_id: this.props.route.params.bill.id,
              payment_method:this.state.payment,
              order_status:'completed'
            })
        }).then((response) => response.json())
            .then((json) => {
           console.warn(json);
                if (!json.status) {
                    var msg = json.msg;
                    Toast.show(msg);
                  //  clearInterval(myInterval);
                }
                else {
                   this.props.navigation.navigate('Tables');
                    console.warn(json.data);
                    
                    // let myInterval = setInterval(() => {
                    //     this.fetch_table_vendors();
                    //     // this.get_profile();
        
                    // }, 10000);

                    // this.setState({interval:myInterval});
                    // Toast.show(json.msg)
              
                    
                }
                this.setState({isloading:false})
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading:false })
            });
    }


    
    render() {
        return (
            <View style={[styles.container,{backgroundColor:'#fff'}]}>
                <View>
                    <Header
                        statusBarProps={{ barStyle: 'light-content' }}
                        leftComponent={this.renderLeftComponent()}
                        centerComponent={this.renderCenterComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],


                        }}
                    />
                </View>
                <ScrollView style={{ flex: 1, marginBottom: 15, borderTopWidth: 1, borderColor: "#d3d3d3",marginBottom:60 }}>
                    <View
                        style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'space-between',
                        }}>
                        <View style={{marginTop: 10, paddingLeft: 20}}>
                        <Text style={style.text}>Total Bill Amount</Text>
                        </View>

                        <View style={{paddingRight: 20, marginTop: 10}}>
                        <Text style={style.text}>₹{this.props.route.params.bill.total_amount}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:20,marginBottom:20}}>
                  <View style={{backgroundColor:"#EDEDED",padding:10}}>
                     <Text style={[style.text1,{color:"#5d5d5d",fontSize:RFValue(10,580)}]}>Choose Method</Text>
                  </View>
<View style={{padding:20}}>
                  <RadioForm
          radio_props={radio_props}
          initial={0}
          buttonColor={'#2196f3'}
          onPress={(value) => {
            console.warn(value)
            this.setState({payment:value})}}
        />
</View>

                  {/* <Pressable style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}}>
                     <View style={{flexDirection:"row",width:"60%",padding:10}}>
                        <Image source={require('../img/bhim.png')} style={{height:40,width:27}}/>
                        <Text style={{alignSelf:"center",marginLeft:12}}>
                           Pay Using UPI
                        </Text>
                     </View>
                     <View style={{width:"40%",paddingRight:10}}>
                        <Icon name="chevron-forward-outline" type="ionicon" size={25} style={{alignSelf:"flex-end",marginTop:20}}/>
                     </View>
                  </Pressable >


                  <Pressable style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}} >
                     <View style={{flexDirection:"row",width:"60%",padding:10}}>
                        <Image source={require('../img/cash.png')} style={{height:30,width:30}}/>
                        <Text style={{alignSelf:"center",marginLeft:10}}>
                           Pay Using Cash
                        </Text>
                     </View>
                     <View style={{width:"40%",paddingRight:10}}>
                        <Icon name="chevron-forward-outline" type="ionicon" size={25} style={{alignSelf:"flex-end",marginTop:20}}/>
                     </View>
                  </Pressable >


                  <Pressable style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}}>
                     <View style={{flexDirection:"row",width:"60%",padding:10}}>
                        <Image source={require('../img/card.png')} style={{height:30,width:30}}/>
                        <Text style={{alignSelf:"center",marginLeft:10}}>
                           Pay Using Debit/Credit Card
                        </Text>
                     </View>
                     <View style={{width:"40%",paddingRight:10}}>
                        <Icon name="chevron-forward-outline" type="ionicon" size={25} style={{alignSelf:"flex-end",marginTop:20}}/>
                     </View>
                  </Pressable > */}
                

                {/* <View style={{height:1,backgroundColor:"#f2f2f2",marginTop:20}}/> */}

                {/* for discount field */}
                    {/* <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 30,
                        justifyContent: 'space-between',height:50,
                    }}>
                    <View style={{marginTop:5, marginLeft: 20}}>
                        <Text style={[style.text,{color:'#222'}]}>Any Discount</Text>
                    </View> */}

                    {/* for input amount */}
                    {/* <View style={{borderWidth:0.5,marginRight:20,borderRadius:10,}}>
                        <Input
                        onChangeText={(e)=>{this.handleChange(e)}}
                        placeholder="Enter Discount Amount"
                        placeholderTextColor="#5d5d5d"
                        // maxLength={4}
                        autoFocus={true}
                        // ref={ref => (this.textInputef = ref)}
                        inputStyle={{
                            fontWeight: 'bold',
                            color: 'grey',
                            fontSize:
                            Platform.OS == 'ios'
                                ? RFValue(12.5, 580)
                                : RFValue(12.5, 580),
                        }}
                        inputContainerStyle={{borderBottomColor: 'transparent', textAlign: 'right'}}
                        containerStyle={{width: Dimensions.get('window').width / 2}}
                        keyboardType="number-pad"
                        />
                    </View> */}


                    {/* </View> */}

                    
               </View>
                </ScrollView>

                <View style={{width:'100%',height:50,backgroundColor:'#fff',position:'absolute',bottom:0}}>
                <TouchableOpacity
                onPress={()=>{this.mark_complete()}}
            style={[styles.buttonStyle,{bottom:10}]}>
                <LinearGradient 
                    colors={['rgba(233,149,6,1)', 'rgba(233,149,6,1)']}
                    style={[styles.signIn,{borderRadius:10,width:'80%',alignSelf:'center'}]}>

                    <Text style={[styles.textSignIn, {
                    color:'#fff'}]}>Complete This Order</Text>
                    
                </LinearGradient>
            </TouchableOpacity>
                </View>
            </View>
        )
    }
    
}


export default GenerateBill

const style = StyleSheet.create({
    text:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5,
        color:'#000',
    },
    heading:{
        fontFamily:"Raleway-SemiBold",
        fontSize:RFValue(14.5, 580),
        margin:5,
        color:'#000',
        marginLeft:10,
    },
    text1:{
        fontSize:RFValue(12,580),
    }  
})