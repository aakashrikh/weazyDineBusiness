import {Dimensions, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

module.exports =  StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#ffffff'
    },

    h1: {
        fontSize:RFValue(25,580),
        fontFamily:"Ralway-SemiBold",
      },

      h2: {
        fontSize:RFValue(18,580),
        fontFamily:"Raleway-SemiBold",
        color:'#222222'
      },

      h3: {
        fontSize:RFValue(14.72,580),
        fontFamily:"Raleway-SemiBold",
        color:'#222222'
      },

      h4: {
        fontSize:RFValue(12,580),
        fontFamily:"Raleway-SemiBold",
        color:'#222222'
      },

      h5: {
        fontSize:RFValue(9.25,580),
        fontFamily:"Raleway-SemiBold",
        color:'#222222'
      },

      h6: {
        fontSize:RFValue(9,580),
        fontFamily:"Raleway-SemiBold",
        color:'#222222'
      },
      smallHeading:
      {
        fontSize:RFValue(11,580),
        fontFamily:"Raleway-SemiBold",
        color:'#5d5d5d',
      },
      small:
      {
        fontSize:RFValue(10,580),
        fontFamily:"Raleway-Regular",
        color:'#5d5d5d',
        marginLeft:15
      },
      p:
      {
        fontSize:RFValue(11,580),
        fontFamily:"Raleway-Regular",
        marginTop:5,
        color:'#5d5d5d',
      },
      signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection:"row",
        justifyContent:"space-evenly",
        borderRadius:50
    },
    textSignIn:{
      fontFamily:"Roboto-Bold",
      // fontSize:18,
      fontSize: RFValue(14, 580),
    },
    heading:{
        color:"#296E84",
       // color:"#000",
        // fontSize:24,
        fontSize: RFValue(18, 580),
        fontFamily:"Raleway-Bold",
        marginTop:10,
        marginLeft:15
    },
    buttonStyles:{
      width:"100%",
      justifyContent:"center",
      alignSelf:"center",
      marginTop:25,
      marginRight:5,
 
    },
    textInput: {
      marginTop: 20,
      //borderWidth: 0.2,
      backgroundColor: '#fff',
      borderRadius:5,
      width: "80%",
      height: 50,
      alignContent: 'center',
      alignSelf: 'center',
      shadowColor: 'grey',
      shadowOpacity: 1.5,
      elevation: 2,
      shadowRadius: 10,
      shadowOffset: { width:1, height: 1 },
      fontSize:RFValue(14.5,580),
      fontFamily:"Roboto-Regular",
    },
    inputText: {
      marginTop: 15,
      width: Dimensions.get('window').width / 1.1,
      height: 50,
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor: "#fff",
      shadowColor: '#000',
      elevation: 4,
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    card:{
      backgroundColor:"#fff",
      height:215
    },
    arrow:{
    
      left:12,
      top:30
  },
  headingSmall:{
    fontSize:12,
    fontFamily:"Raleway-Medium",
    color:"#000"
  },
  box: {
    flexDirection: "row",
    backgroundColor: '#fff',
    height: 70,
    shadowColor: 'grey',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  box1: {
    flexDirection: "row",
    backgroundColor: '#fff',
    height: 70,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#5BC2C1"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  });
