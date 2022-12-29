import React, { Component } from "react";
import {
   View, Text, StyleSheet, Dimensions,
   Image, Linking,
   TouchableOpacity,
   ActivityIndicator,
   ScrollView,
} from "react-native";
import { Header, Icon, Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from '../AuthContextProvider.js';
import SelectDropdown from "react-native-select-dropdown";

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const businessType = [
    "Individual" ,
    "Public Limited" ,
     "Trust" ,
    "Society" ,
    "Partnership" ,
   "LLP" ,
    "NGO" ,
   "Private Limited" ,
   "Proprietorship" ,
];
class OnlinePayment extends Component {
   static contextType = AuthContext;
   constructor(props) {
      super(props);
      this.state = {
         status: true,
         bankAccountNo: '',
         confirmBankAccountNo: '',
         bankIFSC: '',
         beneficiaryName: '',
         isLoading: true,
         buttonLoading: false,
         email: "",
         businessType: "",
      };
   }

   //for header left component
   renderLeftComponent() {
      return (
         <View style={{ top: 5 }}>
            <Icon type="ionicon" name="arrow-back-outline"
               onPress={() => { this.props.navigation.goBack() }} />
         </View>
      )
   }
   //for header center component
   renderCenterComponent() {
      return (
         <View>
            <Text style={[style.text, { fontFamily: "Raleway-SemiBold" }]}>Active Payout</Text>
         </View>

      )
   }

   componentDidMount() {
      this.get_profile()
      this.fetchDetails();
      this.focusListener = this.props.navigation.addListener('focus', () => {
         this.fetchDetails();
         this.get_profile()
      }
      );
   }



   get_profile = () => {
      fetch(global.vendor_api + 'get_vendor_profile', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.context.token
         },
         body: JSON.stringify({

         })
      }).then((response) => response.json())
         .then((json) => {
            if (!json.status) {
               this.setState({ email: "" })
            }
            else {
               json.data.map(value => {
                  this.setState({ email: value.email })
               })
            }
            return json;
         }).catch((error) => {
            console.error(error);
         }).finally(() => {
            this.setState({ isLoading: false })

         });
   }


   fetchDetails = () => {
      fetch(global.vendor_api + "fetch_bank_account_vendor", {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.context.token
         },
      }).then((response) => response.json())
         .then((json) => {
            this.setState({ buttonLoading: true });
            if (json != null && json != '') {
               json.map((item) => {

                  this.setState({
                     bankAccountNo: item.bank_account_no,
                     confirmBankAccountNo: item.bank_account_no,
                     bankIFSC: item.bank_ifsc,
                     beneficiaryName: item.beneficiary_name,
                  })
               }
               )
               this.setState({ status: false })
            }
            else {
               this.setState({ status: true })
            }
         })
         .catch((error) => console.error(error))
         .finally(() => {
            this.setState({ isLoading: false, buttonLoading: false });
         });
   }

   updateDetails = () => {
      let bank_IFSC = this.state.bankIFSC;
      let bank_ifsc = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;
      let isValid = bank_ifsc.test(bank_IFSC);

      if (this.state.bankAccountNo == '') {
         Toast.show('Please enter bank account number');
      } else if (this.state.confirmBankAccountNo == '') {
         Toast.show('Please enter confirm bank account number');
      } else if (this.state.bankIFSC == '') {
         Toast.show('Please enter bank IFSC code');
      } else if (this.state.beneficiaryName == '') {
         Toast.show('Please enter beneficiary name');
      } else if (this.state.bankAccountNo != this.state.confirmBankAccountNo) {
         Toast.show('Bank account number and confirm bank account number should be same');
      }
      else if (this.state.businessType == '') {
         Toast.show('Please select business type');
      }
      else if (!isValid) {
         Toast.show('Please enter valid IFSC code');
      } else {
         fetch(global.vendor_api + "update_bank_account_vendor", {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization': this.context.token,
            },
            body: JSON.stringify({
               bank_account_no: this.state.bankAccountNo,
               confirm_bank_account_no: this.state.confirmBankAccountNo,
               bank_ifsc: bank_IFSC,
               beneficiary_name: this.state.beneficiaryName,
               businessType: this.state.businessType,
            })
         }).then((response) => response.json())
            .then((json) => {
               if (json.status) {
                  this.setState({ status: false });
               } else {
                  Toast.show(json.msg);
               }
            })
            .catch((error) => {
               console.error(error);
            });
      }
   }

   render() {
      return (
         <View style={styles.container}>
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

            <ScrollView>
               {
                  this.state.isLoading ?
                     <Loaders />
                     :
                     <>
                        {this.state.status ? (
                           <>
                              {this.state.email == "" || this.state.email == null || this.state.email == undefined ?
                                 (
                                    <TouchableOpacity style={{
                                       width: Dimensions.get('window').width / 1.05, backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
                                       shadowOffset: {
                                          width: 0,
                                          height: 2
                                       },
                                       shadowOpacity: 0.25,
                                       shadowRadius: 4,
                                       elevation: 5, marginTop: 20, borderRadius: 10, padding: 10,
                                       marginBottom: 10
                                    }} onPress={() => { this.props.navigation.navigate("Profile") }} >
                                       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                          <View style={{ width: '20%', paddingTop: 5, }}>
                                             <Image source={require('../img/icons/email.png')} style={{ width: 50, height: 50, marginLeft: 10, }} />
                                          </View>
                                          <View style={{ width: '80%', paddingTop: 10, paddingBottom: 10 }}>
                                             <Text style={{ fontSize: RFValue(12, 580), fontFamily: "Roboto-Bold" }}>Add Your Email</Text>
                                             <Text style={{ fontSize: RFValue(10, 580), fontFamily: "Roboto-Regular", marginTop: 2 }}>Add your email to receive payment from us</Text>

                                          </View>

                                       </View>

                                    </TouchableOpacity>

                                 ) : (
                                    <>
                                       <View style={{ marginTop: 10 }}>
                                          <Text style={style.fieldsText}>Bank Account No </Text>
                                          <Input
                                             value={this.state.bankAccountNo}
                                             placeholder="Enter Bank Account No"
                                             onChangeText={(e) => { this.setState({ bankAccountNo: e }) }}
                                             inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.05, borderColor: 'transparent',
                                             }}
                                             secureTextEntry={true}
                                             keyboardType="numeric"
                                             containerStyle={style.inputText}
                                             style={{ fontFamily: "Raleway-Medium" }}
                                          />
                                       </View>

                                       <View style={{ marginTop: 10 }}>
                                          <Text style={style.fieldsText}>Confirm Bank Account No</Text>
                                          <Input
                                             keyboardType="numeric"
                                             placeholder="Enter Confirm Bank Account Number"
                                             value={this.state.accountNumber}
                                             onChangeText={(e) => { this.setState({ confirmBankAccountNo: e }) }}
                                             inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.05, borderColor: 'transparent',
                                             }}
                                             containerStyle={style.inputText}
                                             style={{ fontFamily: "Raleway-Medium" }}
                                          />
                                       </View>

                                       <View style={{ marginTop: 10 }}>
                                          <Text style={style.fieldsText}>Bank IFSC Code</Text>
                                          <Input
                                             value={this.state.bankName}
                                             placeholder="Enter Bank ISFC Code"
                                             autoCapitalize="characters"
                                             onChangeText={(e) => { this.setState({ bankIFSC: e }) }}
                                             inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.05, borderColor: 'transparent',
                                             }}
                                             maxLength={11}
                                             containerStyle={style.inputText}
                                             style={{ fontFamily: "Raleway-Medium" }}
                                          />
                                       </View>

                                       <View style={{ marginTop: 10 }}>
                                          <Text style={style.fieldsText}>Beneficiary Name</Text>
                                          <Input
                                             value={this.state.beneficiaryName}
                                             placeholder="Enter Beneficiary Name"
                                             onChangeText={(e) => { this.setState({ beneficiaryName: e }) }}
                                             inputContainerStyle={{
                                                width: Dimensions.get("window").width / 1.05, borderColor: 'transparent'
                                             }}
                                             containerStyle={style.inputText}
                                             style={{ fontFamily: "Raleway-Medium" }}
                                          />
                                       </View>

                                       <View style={{ marginTop: 10 }}>
                                          <Text style={style.fieldsText}>Business Type</Text>
                                          <SelectDropdown
                                             data={businessType}
                                             onSelect={(selectedCategories, index) => {
                                                this.setState({ businessType: selectedCategories })
                                             }}
                                             buttonTextAfterSelection={(selectedCategories, index) => {
                                                return selectedCategories
                                             }}
                                             rowTextForSelection={(item, index) => {
                                                return item
                                             }}
                                             buttonTextStyle={{ fontFamily: "Raleway-Medium", fontSize: RFValue(12, 580), color: "#000",
                                          position: "absolute", right: 10, top: 10 }}
                                             buttonStyle={style.inputText}
                                             renderDropdownIcon={() => {
                                                return (
                                                   <Icon name="chevron-down" type="ionicon"/>
                                                )
                                             }}
                                          />
                                       </View>

                                       {/* update button */}
                                       {this.state.buttonLoading ?
                                          <View style={style.loader}>
                                             <ActivityIndicator size={"large"} color="#5BC2C1" />
                                          </View>
                                          :
                                          <View style={{ alignItems: "center", marginTop: 20 }}>
                                             <TouchableOpacity
                                                onPress={() => { this.updateDetails() }}>
                                                <LinearGradient
                                                   style={style.updateButton}
                                                   colors={['#5BC2C1', '#296e84']}>
                                                   <Text style={style.updateText}>Update</Text>
                                                </LinearGradient>
                                             </TouchableOpacity>
                                          </View>
                                       }</>
                                 )
                              }
                           </>
                        ) : (
                           <>
                              {/* view for image */}
                              <View>
                                 <Image source={require('../img/activepayout.png')} style={style.img} />
                              </View>

                              {/* view for details */}
                              <View style={style.viewBox}>
                                 <Text style={style.text}>
                                    Beneficiary Name: <Text style={{ fontFamily: "Roboto-Medium" }}>{this.state.beneficiaryName}</Text>
                                 </Text>

                                 <Text style={style.text}>
                                    Account Number: <Text style={{ fontFamily: "Roboto-Medium" }}>{this.state.bankAccountNo}</Text>
                                 </Text>

                                 <Text style={style.text}>
                                    IFSC Code: <Text style={{ fontFamily: "Roboto-Medium" }}>{this.state.bankIFSC}</Text>
                                 </Text>

                              </View>

                              {/* view for support */}
                              <View style={{ width: Dimensions.get('window').width / 1.05, alignSelf: "center", justifyContent: "center", alignContent: "center" }}>
                                 <Text style={{
                                    fontSize: RFValue(14, 580),
                                    fontFamily: "Roboto-Bold",
                                    alignSelf: "center", color: "#000", marginTop: 25
                                 }}>Want to change your details? Contact us...</Text>

                                 <View>
                                    <TouchableOpacity onPress={() => Linking.openURL('mailto:support@weazy.in')}>
                                       <LinearGradient
                                          style={style.mailButton}
                                          colors={['#5BC2C1', '#296e84']}>
                                          <Icon name="mail" size={25} type="ionicon" color="#fff" />
                                          <Text style={[style.text, { color: "#fff" }]}>Mail Us</Text>
                                       </LinearGradient>
                                    </TouchableOpacity>
                                 </View>
                              </View>
                           </>)}
                     </>
               }
            </ScrollView>
         </View>
      );
   }
}

export default OnlinePayment;

class Loaders extends Component {
   render() {
      return (
         <View>
            <SkeletonPlaceholder>
               <View style={style.questView} >
                  <View style={{ flexDirection: "row" }}>
                     <View style={style.Icon} />
                     <View style={{ width: 370, marginTop: 12, marginLeft: 20, height: 70 }} />
                  </View>
               </View>
               <View style={style.questView} >
                  <View style={{ flexDirection: "row" }}>
                     <View style={style.Icon} />
                     <View style={{ width: 370, marginTop: 12, marginLeft: 20, height: 70 }} />
                  </View>
               </View>
               <View style={style.questView} >
                  <View style={{ flexDirection: "row" }}>
                     <View style={style.Icon} />
                     <View style={{ width: 370, marginTop: 12, marginLeft: 20, height: 70 }} />
                  </View>
               </View>
               <View style={style.questView} >
                  <View style={{ flexDirection: "row" }}>
                     <View style={style.Icon} />
                     <View style={{ width: 370, marginTop: 12, marginLeft: 20, height: 70 }} />
                  </View>
               </View>
               <View style={style.questView} >
                  <View style={{ flexDirection: "row" }}>
                     <View style={style.Icon} />
                     <View style={{ width: 370, marginTop: 12, marginLeft: 20, height: 70 }} />
                  </View>
               </View>



            </SkeletonPlaceholder>

         </View>
      )
   }
}

//Styling
const style = StyleSheet.create({
   text: {
      fontFamily: "Roboto-Bold",
      // fontSize:20,
      fontSize: RFValue(14.5, 580),
      margin: 5,
   },
   viewBox: {
      backgroundColor: "#fff",
      width: Dimensions.get('window').width / 1.05,
      backgroundColor: '#fff',
      alignSelf: 'center',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center'
   },
   img: {
      height: 250,
      width: 350,
      alignSelf: "center",
   },
   mailButton: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: "#5BC2C1",
      borderRadius: 5,
      alignSelf: "center",
      marginTop: 10,
      width: 120,
      padding: 5,
      alignContent: "center",
      alignItems: "center"
   },
   inputText: {
      marginTop: 15,
      width: Dimensions.get("window").width / 1.1,
      height: 50,
      alignContent: 'center',
      alignSelf: 'center',
      borderRadius: 5,
      color: '#000',
      paddingLeft: 15,
      shadowColor: "#000",
      backgroundColor: '#fff', alignSelf: 'center', shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5

   },
   fieldsText: {
      fontSize: RFValue(12, 580),
      fontFamily: "Montserrat-SemiBold",
      color: "#696969",
      marginLeft: 10
   },
   updateButton: {
      width: Dimensions.get("window").width / 2,
      padding: 10,
      backgroundColor: "#5BC2C1",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20
   },
   updateText: {
      color: "#fff",
      fontFamily: "Raleway-SemiBold",
      fontSize: RFValue(14, 580)
   },
   loader: {
      shadowOffset: { width: 50, height: 50 },
      marginBottom: 5,
      shadowRadius: 50,
      elevation: 5,
      backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
   },
})