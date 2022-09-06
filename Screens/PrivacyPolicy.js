import React, { Component } from 'react';
import {
    View, Text, ScrollView, Image,
    TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground
} from 'react-native';
import { Header, Icon } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
//Global Style Import
const styles = require('../Components/Style.js');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class PrivacyPolicy extends Component {

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
                <Text style={style.text}>Privacy Policies</Text>
            </View>

        )
    }

    render() {
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
                        <Text style={{ fontSize: RFValue(12, 580), lineHeight: 23, fontFamily: "Roboto-Regular", color: "grey", marginTop: 5, textAlign: "justify", padding: 15, }}>
                            We take your privacy very seriously. Weazy Dine will only use your personal information in accordance with
                            the terms of our privacy policy. By using the App you acknowledge and agree that you have read and accept the
                            terms of our privacy policy and these Terms. {"\n"}{"\n"}

                            <Text style={{ fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580) }}>Disclaimer / Liability{"\n"}</Text>

                            <Text style={{ fontFamily: "Roboto-Bold", fontSize: RFValue(11, 580) }}>USE OF THE APP IS AT YOUR OWN RISK. THE APP IS PROVIDED ON AN “AS IS” BASIS.
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW: (A) WEAZY DINE DISCLAIMS ALL LIABILITY WHATSOEVER,
                                WHETHER ARISING IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE IN RELATION TO THE APP; AND (B)
                                ALL IMPLIED WARRANTIES, TERMS AND CONDITIONS RELATING TO THE APP (WHETHER IMPLIED BY STATUE, COMMON LAW OR OTHERWISE),
                                INCLUDING (WITHOUT LIMITATION) ANY WARRANTY, TERM OR CONDITION AS TO ACCURACY, COMPLETENESS,
                                SATISFACTORY QUALITY, PERFORMANCE, FITNESS FOR PURPOSE OR ANY SPECIAL PURPOSE, AVAILABILITY, NON INFRINGEMENT,
                                INFORMATION ACCURACY, AS BETWEEN WEAZY DINE AND YOU, ARE HEREBY EXCLUDED. IN PARTICULAR, BUT WITHOUT PREJUDICE TO THE
                                FOREGOING, WE ACCEPT NO RESPONSIBILITY FOR ANY TECHNICAL FAILURE OF THE INTERNET AND/OR THE APP; OR ANY DAMAGE OR INJURY
                                TO USERS OR THEIR EQUIPMENT AS A RESULT OF OR RELATING TO THEIR USE OF THE APP. YOUR STATUTORY RIGHTS ARE NOT AFFECTED.{"\n"}{"\n"}</Text>

                            Weazy Dine  will not be liable, in contract, tort (including, without limitation, negligence), under statute or otherwise, as a result of or in connection with the App, for any: {"\n"}

                            <Text style={{ fontFamily: "Roboto-Bold" }}>
                                <Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> economic loss (including, without limitation, loss of revenues, profits, contracts, business or anticipated savings); or{"\n"}</Text>

                            <Text style={{ fontFamily: "Roboto-Bold" }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> loss of goodwill or reputation; or{"\n"}</Text>


                            <Text style={{ fontFamily: "Roboto-Bold" }}><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> special or indirect or consequential loss.{"\n"}{"\n"}</Text>


                            <Text style={{ fontFamily: "Roboto-Bold" }}>IF WEAZY DINE IS LIABLE TO YOU DIRECTLY OR INDIRECTLY IN RELATION TO THE APP, THAT LIABILITY (HOWSOEVER ARISING) SHALL BE LIMITED TO THE SUMS PAID BY YOU UPON PURCHASING THE APP, OR ANY IN-APP SPEND, INCLUDING SUBSCRIPTIONS.{"\n"}{"\n"}</Text>

                            <Text style={{ fontFamily: "Roboto-Bold" }}>Advertisers In The App{"\n"}</Text>

                            We accept no responsibility for advertisements contained within the App.
                            If you agree to purchase goods and/or services from any third party who advertises in the App,
                            you do so at your own risk. The advertiser, not Weazy Dine  is responsible for such goods and/or services
                            and if you have any queries or complaints in relation to them, your only recourse is against the advertiser.

                            {"\n"}{"\n"}

                            <Text style={{ fontFamily: "Roboto-Bold" }}>Service Suspension{"\n"}</Text>

                            Weazy Dine reserves the right to suspend or cease providing any services relating to the apps published by it,
                            with or without notice, and shall have no liability or responsibility to you in any manner whatsoever if it chooses to do so.
                            {"\n"}{"\n"}

                            <Text style={{ fontFamily: "Roboto-Bold" }}>General{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> These Terms (as amended from time to time) constitute the entire agreement between
                                you and Weazy Dine concerning your use of the App.{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> Weazy Dine reserves the right to update these Terms from time to time. If it does so,
                                the updated version will be effective immediately, and the current Terms are available through a link in the
                                App to this page. You are responsible for regularly reviewing these Terms so that you are aware of any changes
                                to them and you will be bound by the new policy upon your continued use of the App. No other variation to these
                                Terms shall be effective unless in writing and signed by an authorized representative on behalf of Weazy Dine{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> We will send you information relating to your account (e.g. payment authorizations, invoices, changes in password or Payment Method,
                                confirmation messages, notices) in electronic form only.{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> These Terms shall be governed by and construed in accordance with Indian laws and you agree to
                                submit to the exclusive jurisdiction of the Ahmedabad, Gujarat, India.{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> If any provision(s) of these Terms is held by a court of competent jurisdiction to be invalid or unenforceable,
                                then such provision(s) shall be construed, as nearly as possible, to reflect the intentions of the
                                parties (as reflected in the provision(s)) and all other provisions shall remain in full force and effect.{"\n"}</Text>

                            <Text><Icon name='ellipse' style={{ marginTop: 2 }} size={8} type="ionicon" /> Weazy Dine failure to exercise or enforce any right or provision of these Terms shall not constitute a waiver
                                of such right or provision unless acknowledged and agreed to by Weazy Dine in writing.{"\n"}</Text>
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
    text: {
        fontFamily: "Raleway-SemiBold",
        // fontSize:20,
        fontSize: RFValue(14.5, 580),
        margin: 5
    },

}
)