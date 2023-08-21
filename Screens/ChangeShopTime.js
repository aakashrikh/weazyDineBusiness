import React, { Component } from 'react';
import {
  View, TouchableOpacity, Switch,
  StyleSheet, Text,
  ActivityIndicator, ScrollView, Dimensions, Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Header } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { AuthContext } from '../AuthContextProvider.js';

//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');


const objectd =
  [
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Mon" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Tue" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Wed" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Thurs" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Fri" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Sat" },
    { status: false, open: "09:00 AM", close: "10:00 PM", day_name: "Sun" }
  ];

class ChangeShopTime extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      isOpenVisible: false,
      isCloseVisible: false,
      current_day: '',
      current_time: '',
      timing: objectd,
      isLoading: false
    }
    //  object['Monday']={open:"09:00 AM",close:"10:00 PM"};
  }


  componentDidMount() {
    this.get_vendor_details();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.get_vendor_details();
    })

  }



  get_vendor_details = async () => {
    await fetch(global.vendor_api + 'get_vendor_profile', {
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
        const obj = json.data[0].timings;
        const object = this.state.timing;
        if (obj.length > 0) {
          obj.map((value, id) => {
            this.state.timing.map((value2, id2) => {
              if (value2.day_name == value.day_name) {
                if (value.day_status == 1) {
                  var op = '2016-05-02T' + value.open_timing;
                  var cp = '2016-05-02T' + value.close_timing;
                  object[id2] = { status: true, open: moment(op).format('hh:mm A'), close: moment(cp).format('hh:mm A'), day_name: value.day_name };
                }
                else {
                  object[id2] = { status: false, open: moment(op).format('hh:mm A'), close: moment(cp).format('hh:mm A'), day_name: value.day_name };
                }
              }
            });
          });
          this.setState({ timing: object })
        }
        else {
          this.setState({ open: false })
        }
        return json;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isLoading: false })
      });
  }

  //for header left component
  renderLeftComponent() {
    return (
      <View style={{ width: win.width, flexDirection: "row", paddingBottom: 5, }} >
        <Icon name="arrow-back-outline" type="ionicon"
          onPress={() => this.props.navigation.goBack()} style={{ top: 2.5 }} />
        <Text style={[styles.h3, { paddingLeft: 15, bottom: 1 }]}>Store Timing </Text>
      </View>
    )
  }

  update_vendor_timing = () => {
    this.setState({ isLoading: true })
    fetch(global.vendor_api + 'update_store_timing', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.context.token
      },
      body: JSON.stringify({
        days: this.state.timing
      })
    }).then((response) => response.json())
      .then((json) => {
        if (json.status) {

          this.props.navigation.navigate("More")

        }
        else{
          console.log(json);
        }
        return json;
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.setState({ isLoading: false })

      });

  }
  // Function for Open time picker
  showOpenPicker = (day, time) => {
    this.setState({ current_day: day, current_time: time });
    // alert("hi");
    this.setState({
      isOpenVisible: true
    })
  }

  handleOpenPicker = (time) => {

    const object = this.state.timing;

    if (this.state.current_time == 'open') {
      object[this.state.current_day].open = moment(time).format('hh:mm A');
    }
    else {
      object[this.state.current_day].close = moment(time).format('hh:mm A');
    }


    if (this.state.current_day == 0 && this.state.current_time == 'open') {
      object[1].open = moment(time).format('hh:mm A');
      object[2].open = moment(time).format('hh:mm A');
      object[3].open = moment(time).format('hh:mm A');
      object[4].open = moment(time).format('hh:mm A');
      object[5].open = moment(time).format('hh:mm A');
      object[6].open = moment(time).format('hh:mm A');

    }
    else {
      if (this.state.current_day == 0) {
        object[1].close = moment(time).format('hh:mm A');
        object[2].close = moment(time).format('hh:mm A');
        object[3].close = moment(time).format('hh:mm A');
        object[4].close = moment(time).format('hh:mm A');
        object[5].close = moment(time).format('hh:mm A');
        object[6].close = moment(time).format('hh:mm A');
      }
    }


    this.setState({ timing: object })
    this.setState({
      isOpenVisible: false
    })
  }

  update_time = (timing) => {
    const object = this.state.timing;

    if (object[timing].status == true) {
      object[timing].status = false;
    }
    else {
      object[timing].status = true;
    }
    this.setState({ timing: object });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{ barStyle: 'dark-content' }}
          leftComponent={this.renderLeftComponent()}
          ViewComponent={LinearGradient} // Don't forget this!
          linearGradientProps={{
            colors: ['#fff', '#fff'],


          }}
          backgroundColor="#ffffff"
        />
        <ScrollView>
          <View style={{ marginTop: 30 }}>

          </View>


          {/* Per day details */}
          <View >
            {this.state.timing.map((value, id) => {
              return (
                <View style={{ flexDirection: "row", padding: 19, paddingLeft: 10, width: Dimensions.get('window').width, backgroundColor: "#fff" }}>
                  <View style={{ width: "18%", }}>
                    <Text style={[styles.h3, { fontSize: 15 }]}>
                      {value.day_name}
                    </Text>
                  </View>
                  <View style={{ width: "10%", marginLeft: 10 }}>
                    <Switch
                      trackColor={{ false: "#d3d3d3", true: "#5BC2C1" }}
                      thumbColor={"white"}

                      value={value.status}
                      onValueChange={() => this.update_time(id)}
                    />
                  </View>
                  {value.status ?
                    <View style={{ flexDirection: "row", marginLeft: 25, top: 3 }}>
                      <Text style={[styles.h4, { marginTop: 2 }]}>Open</Text>
                      <Pressable
                        style={{ width: Dimensions.get('window').width / 5, marginLeft: 8, marginTop: 3, borderBottomWidth: 1, borderColor: "#7c7d7e", }} onPress={() => { this.showOpenPicker(id, 'open') }}>
                        <Text style={[styles.h4, { marginLeft: 7, fontSize: 14, fontFamily: "Roboto-Medium" }]}>
                          {value.open}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={{ width: Dimensions.get('window').width / 5, marginTop: 3, borderBottomWidth: 1, borderColor: "#7c7d7e", marginLeft: 8 }} onPress={() => this.showOpenPicker(id, 'close')}>
                        <Text style={[styles.h4, { marginLeft: 7, fontSize: 14, fontFamily: "Roboto-Medium" }]}>
                          {value.close}
                        </Text>
                      </Pressable>
                    </View>
                    :
                    <View style={{ width: "60%", marginLeft: 25, top: 3 }}>
                      <Text style={[styles.h4, { marginTop: 2 }]}>Closed</Text>
                    </View>
                  }
                </View>
              )
            })

            }



            <DateTimePicker
              isVisible={this.state.isOpenVisible}
              mode={"time"}
              is24Hour={false}
              // minimumDate={new Date()}
              onConfirm={this.handleOpenPicker}
              onCancel={this.hideOpenPicker}
            />
          </View>
          {!this.state.isLoading ?
            <View>
              <TouchableOpacity
                onPress={() => this.update_vendor_timing()}
                style={[styles.buttonStyles, { marginBottom: 15, marginTop: 25, width: "60%", alignSelf: "center" }]}>
                <LinearGradient
                  colors={['#5BC2C1', '#296e84']}
                  style={[styles.signIn]}>

                  <Text style={[styles.textSignIn, {
                    color: '#fff'
                  }]}>
                    Update Time
                  </Text>

                </LinearGradient>
              </TouchableOpacity>
            </View>
            :
            <View style={style.loader}>
              <ActivityIndicator size={"large"} color="#5BC2C1" />
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

export default ChangeShopTime

const style = StyleSheet.create({
  loader: {
    shadowOffset: { width: 50, height: 50 },
    marginTop: 20,
    marginBottom: 5,
    shadowRadius: 50,
    elevation: 5,
    backgroundColor: "#fff", width: 40,
    height: 40, borderRadius: 50,
    padding: 5, alignSelf: "center"
  },
}
)