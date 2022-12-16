import React, { Component } from 'react';
import { View,Dimensions,StyleSheet,Pressable ,ActivityIndicator,Text, Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import { Icon, Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
//Global Style Import
const styles = require('../Components/Style.js');
const win = Dimensions.get('window');


class PrivacyPolicy extends Component{

   constructor(props) {
      super(props);
      console.log(props.route.params);
      this.state = {
        bodayText: "",
      };
    }

      //for header left component
      renderLeftComponent() {
        return (
            <View style={{ width: win.width, flexDirection: "row", paddingBottom: 10, borderBottomWidth: 1, borderColor: "#d3d3d3" }} >
                <Icon name="arrow-back-outline" type="ionicon"
                    onPress={() => this.props.navigation.goBack()} style={{ top: 2.5 }} />
                <Text style={[styles.h3, { paddingLeft: 15, bottom: 1 }]}>{this.props.route.params.title}</Text>
            </View>
        )
    }

   IndicatorLoadingView() {
      return (
         <View >
            <ActivityIndicator
               color="#326bf3"
               size="large"
               style={style.IndicatorStyle}
            />
         </View>
      );
    }

   render(){
      return(
         <View style={styles.container}>
             <View>
                    <Header
                        statusBarProps={{ barStyle: 'dark-content' }}
                        leftComponent={this.renderLeftComponent()}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ['#fff', '#fff'],
                        }}
                        backgroundColor="#ffffff"
                    />
                </View>

            <WebView
            source={{
               uri: this.props.route.params.url,
            }}
            
            renderLoading={this.IndicatorLoadingView}
            startInLoadingState={true}
            />
            
            {/* <View>
               <Pressable onPress={() => { this.props.navigation.navigate('ReviewScan') }} style={[style.catButton, { backgroundColor: "#326bf3", width: '100%', alignSelf: 'center' }]}>
                    <Text style={style.buttonText}>
                        Refer And Earn
                    </Text>
                </Pressable>
            </View> */}
         </View>
      )
   }
}

export default PrivacyPolicy;

const style=StyleSheet.create({
   catButton: {
      // backgroundColor:"#BC3B3B",
      // padding:7,
      marginTop: 10,
      height: 40,
      marginLeft: 10,
      borderRadius: 5,
      justifyContent: "center",
      borderColor: "#EBEBEB",
      borderWidth: 1,
      position: "absolute",
      bottom: 0,
      height: 50

  },
  buttonText: {
   alignSelf: "center",
   color: "#fff",
   // fontFamily:"Roboto-Regular",
   fontFamily: Platform.OS == "android" ? "Montserrat-Medium" : null,
   fontSize: 16,
},
IndicatorStyle: {
   alignItems: "center",
   justifyContent: "center",
   marginTop:-800,
 }
})