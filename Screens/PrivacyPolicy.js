import React, {Component} from 'react';
import { View, Text , ScrollView, Image,
    TextInput, Button, StyleSheet,TouchableOpacity, ImageBackground} from 'react-native';
import {Header,Icon} from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
//Global Style Import
const styles = require('../Components/Style.js');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class PrivacyPolicy extends Component{
        
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
  <Text style={style.text}>Privacy Policies</Text>
  </View>
  
  )
  }

        render(){
        return (
            <View style={styles.container}>
                <Header 
                statusBarProps={{ barStyle: 'light-content' }}
                centerComponent={this.renderCenterComponent()}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
                
                }}
                />
            
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View >
                    <Text style={{fontSize:RFValue(12, 580),lineHeight:23, fontFamily:"Roboto-Regular", color:"grey",marginTop:5,textAlign:"justify", padding:15,}}>
                    This Privacy Policy applies to the Market Pluss. We respect your privacy and are protecting personally identifiable information you may provide us through the Website. 
                    We have adopted this Privacy Policy to explain what information may be collected by us on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. 
                    This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other physical sources.{"\n"}

                    This Privacy Policy, together with the Terms of Use posted on our Website, set forth the general standards and policies governing your use of our Website.
                    Depending on your go-through when visiting our Website, you may be required to agree to additional terms and conditions associated with the company. 
                    We generally keep this Privacy Policy showcased on our Website and you should keep a look at it frequently, as it may vary from time to time without any notice provided to users. 
                    Any changes will be implied immediately upon the posting of the revised Privacy Policy.{"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Information We Collect:{"\n"}</Text>

                    <Text style={{fontFamily:"Roboto-Bold"}}>Personally Identifiable Information:{"\n"}</Text>

                    Our definition of personally identifiable information includes any information that may be used to specifically identify or contact you, such as your name, location, mail address, contact number.{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Non-Personal Information:{"\n"}</Text>

                    Our definition of non-personal information is any information that does not personally identify you either affect you. 
                    Non-personal information can include certain personal information that has been de-identified; that is, information that has been rendered anonymously. 
                    We collect non-personal information about you from information that is provided by you, either separately or collaborated with your personally identifiable information. 
                    We also automatically collect certain non-personal information from you when you access our Websites.{"\n"}


                    <Text style={{fontFamily:"Roboto-Bold"}}>Personally Identifiable Information:{"\n"}</Text>

                    The personally identifiable information you submit to us is used to maintain the database.
                    In the event of time if you have become a Market Pluss Member, the personally identifiable
                    information you submit to us will be used to identify you as a Market Pluss Member and to facilitate your access to Membership profits. 
                    We may also use this information to connect to you for numerous reasons, such as customer service, providing you promotional information about our upcoming updates,
                    or communicating regarding the services we have served you.

                    Except as provided in this Privacy Policy or these Terms of Use, your personally identifiable information will not be shared or sold to any third parties without your prior approval.

                    {"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Non-Personal Information:{"\n"}</Text>

                    We use non-personal information in various ways, including to help control website traffic, analyze customer demand and trends, carry out needed promotional activities, and improve our services.
                    We may use your non-personal information originally or by adding some more information to it. We may share your non-personal information with our affiliated companies and third parties to achieve these objectives,
                    but remember that aggregate information is anonymous information that does not personally identify you.
                    {"\n"}
                    {"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Other Needed Information:{"\n"}</Text>

                    <Text style={{fontFamily:"Roboto-Bold"}}>IP Addresses:{"\n"}</Text>

                    An IP address is a number that is automatically assigned to your device whenever you are surfing the Internet. Web servers (computers that "serve up" web pages) automatically identify your computer by its IP address.
                    When visitors request pages from our Websites, our servers typically log their IP addresses. We collect IP addresses for purposes of system administration, report non-personal aggregate information to others, and track the use of our Website. 
                    IP addresses are considered non-personal information and may also be shared as provided above. We reserve the right to use IP addresses and any personally identifiable information to identify a visitor when we feel it is necessary to enforce compliance 
                    with our Website rules or to: (a) fulfill a government request (b) confirm with the requirements of the law or legal process © protect or defend our legal rights or property, our Website, or other users or (d) in an emergency to protect the health and safety of our Website's users or the general public.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Cookies:{"\n"}</Text>

                    "Cookies" are small text files from a website that are stored on your hard drive. These text files make using our Website more convenient by, among other things, saving your passwords and preferences for you. Cookies themselves do not typically contain any personally identifiable information.
                    We may analyze the information derived from these cookies and match this information with the data provided by you.
                    If you are concerned about the storage and use of cookies, you may be able to direct your internet browser to notify you i.e. 
                    manually from your hard drive through your internet browser or other programs. Please note, however, that some features of our Website will not function properly or be available to you if you refuse to accept a cookie or choose to disable the acceptance of cookies.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Email Communications:{"\n"}</Text>

                    If you send us an email with questions or comments, we may use your personally identifiable information to respond to your questions or comments, and we may save your questions or comments for future reference. For security reasons, we do not recommend that you send non-public personal information, such as passwords, social security numbers, or bank account information, to us by email. However, aside from our reply to such an email, it is not our standard practice to send you an email unless you request a particular service or sign up for a feature that involves email communications it relates to purchases you have made with us (e.g., product updates, services, maintenance, etc.) we are sending you information about our other services, or you consented to be contacted by email for a particular purpose. In certain instances, we may provide you with the filter to set your preferences for receiving emails from us; that is, agree to some communications but not others.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Transfer of Assets:{"\n"}</Text>

                    As we continue to develop our business, we may sell or purchase assets. If another entity acquires us or all (or substantially all) of our assets, the personally identifiable information and non-personal information we have about you will be transferred to and used by this acquiring entity.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Other:{"\n"}</Text>

                    Notwithstanding anything here into the contrary, we reserve the right to disclose any personally identifiable information or non-personal information about you if we are required to do so by law, with respect to copyright or other intellectual property infringement claims, or if we believe that such action is necessary to (a) fulfill a government request; (b) confirm with the requirements of the law or legal process; © protect or defend our legal rights or property, our Website, or other users; or (d) in an emergency to protect the health and safety of our Website's users or the general public.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Keeping Your Information Secure:{"\n"}</Text>

                    We have implemented security measures we consider reasonable and appropriate manners to protect against the loss, misuse, and alteration of the information under our control. Please be advised, however, that while we strive to protect your personally identifiable information and privacy, we cannot guarantee or warrant the security of any information you disclose or transmit to us online and are not responsible for the theft, destruction, or inadvertent disclosure of your personally identifiable information.
                    {"\n"}{"\n"}

                    <Text style={{fontFamily:"Roboto-Bold"}}>Contact Information:{"\n"}</Text>

                    You have Queries or feedbacks about our Privacy Policy
                    Wish to make corrections to any personally identifiable information you have provided:
                    {"\n"}

                    We will respond to your request and, if applicable and appropriate, make the requested change in our active databases at the earliest possible time. Please make a note that we may not be able to fulfill certain requests while letting you access different features and services offered on or through our Website
                    </Text>
                </View>
            </ScrollView>
            </View>
            
        )
    }
}

export default PrivacyPolicy;

      //Styling
const style = StyleSheet.create({
    text:{
        fontFamily:"Raleway-SemiBold",
        // fontSize:20,
        fontSize:RFValue(14.5, 580),
        margin:5
    },

}
)