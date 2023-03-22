import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import MyCategories from './MyCategories';
import Packages from './Packages';
import Services from './Services';

//Global StyleSheet Import
const styles = require('../Components/Style.js');


class TabTop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  segmentClick = (index) => {
    this.setState({
      activeIndex: index
    })
  }


  renderSection = () => {

    if (this.state.activeIndex == 0) {
      return (
        <View style={{ flex: 1 }}>
          <MyCategories navigation={this.props.navigation}/>
        </View>
      )
    }

    else if (this.state.activeIndex == 1) {
      return (
        <View style={{ flex: 1 }}>
          <Services navigation={this.props.navigation}/>
        </View>
      )
    }
    else if (this.state.activeIndex == 2) {
      return (
        <View style={{ flex: 1 }}>
          <Packages navigation={this.props.navigation}/>
        </View>
      )
    }

  }



  render() {
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: "row", width: Dimensions.get('window').width, marginTop: 20 }}>
          <TouchableOpacity style={[style.button,{
            borderBottomColor: this.state.activeIndex == 0 ? "#5BC2C1" : "white",
            borderBottomWidth: 2,
          }]} onPress={() => this.segmentClick(0)}
            activeOpacity={this.state.activeIndex == 0}>
            <Text style={[styles.h4,{ color: this.state.activeIndex == 0 ? "#5BC2C1" : "grey" }]}>Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[style.button,{
            borderBottomColor: this.state.activeIndex == 1 ? "#5BC2C1" : "white",
            borderBottomWidth: 2,
          }]} onPress={() => this.segmentClick(1)}
            activeOpacity={this.state.activeIndex == 1}>
            <Text style={[styles.h4,{ color: this.state.activeIndex == 1 ? "#5BC2C1" : "grey" }]}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[style.button,{
            borderBottomColor: this.state.activeIndex == 2 ? "#5BC2C1" : "white",
            borderBottomWidth: 2,
          }]} onPress={() => this.segmentClick(2)}
            activeOpacity={this.state.activeIndex == 2}>
            <Text style={[styles.h4,{ color: this.state.activeIndex == 2 ? "#5BC2C1" : "grey" }]}>Combos</Text>
          </TouchableOpacity>
        </View>


        {this.renderSection()}
      </View>
    );
  }
}

export default TabTop;


const style = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width / 3,
    borderColor: "#f5f5f5",
    borderBottomWidth: 1,
    padding: 10,
    alignContent: "center",
    alignItems: "center"
  }
})