import React, { Component } from 'react';
import { Text, View,
  StyleSheet, Dimensions, 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
navigator.geolocation = require('@react-native-community/geolocation');

const latitudeDelta = 0.015;
const longitudeDelta = 0.0121;

const win = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      position: 'absolute',
      height:400,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
  
  class Location extends Component {
  
    constructor() {
      super();
    }
  
    render() {
      return (
          <View style={styles.container}>
              
        <MapView
         provider={PROVIDER_GOOGLE}
          style={ styles.map }
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
            </MapView>
        </View>
      );
    }
  
  }
  
  export default Location;
  
  