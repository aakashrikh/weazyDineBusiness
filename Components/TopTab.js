import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Packages from '../Screens/Packages';
import Services from '../Screens/Services';
import { RFValue } from 'react-native-responsive-fontsize';
import MyCategories from '../Screens/MyCategories';


const Tabs = createMaterialTopTabNavigator();

class TopTab extends Component{
  constructor (props)
  {
    super(props)
  
  }

  componentDidMount = ()=>
    { 
        this.focusListener=this.props.navigation.addListener('focus', ()=>{
          console.warn(this.props);
        })  
    
    }
  render(){
    return(
      <Tabs.Navigator 
      initialRouteName="MyCategory"  
      tabBarPosition="top"  
      lazy="true"
      tabBarOptions={
        {
        tabStyle: { marginTop:28},
        labelPosition: "below-icon",
        activeTintColor: "#5BC2C1",
        inactiveTintColor:"#c0c0c0",
        indicatorStyle: { backgroundColor: "#5BC2C1", height: 2 },
        style: {
        backgroundColor: "white",
        marginTop:15
        // height:55,
        
      },
      
      labelStyle: {
        fontSize: RFValue(11,580),
        fontFamily:"Raleway-Bold"
        // paddingBottom:5,
      },
    }}
    >
      <Tabs.Screen name="MyCategory" component={MyCategories} options={{title:"Categories"}} props={this.props}/>
      <Tabs.Screen name="Service" component={Services} options={{title:"Menu"}} props={this.props}/>
      <Tabs.Screen name="Package" component={Packages} options={{title:"Combos"}} props={this.props}/>
      
    </Tabs.Navigator>
    )
  }
}
export default TopTab