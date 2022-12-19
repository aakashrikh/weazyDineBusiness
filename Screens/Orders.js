import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
    View, Alert,
    StyleSheet, Switch,
    Image, Text, Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-simple-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { AuthContext } from '../AuthContextProvider.js';
import moment from 'moment'
import * as Animatable from 'react-native-animatable';
//Global Style Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');


class Orders extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            active_cat: 0,
            // vendor_category_id:0,
            isloading: true,
            isLoading: false,
            object: {},
            select: {},
            last_select: '',
            load_data: false,
            page: 1,
            category: []
            // prod_id:''
        }
    }
    componentDidMount = () => {

        this.get_vendor_product(0, 1);
        this.focusListener = this.props.navigation.addListener('focus', () => {

            this.get_vendor_product('', 1);
            
        })

    }

    // function to load data while scrolling
    load_more = () => {
        var data_size = this.state.data.length
        if (data_size > 9) {

            var page = this.state.page + 1
            this.setState({ page: page })
            this.setState({ load_data: true });
            this.get_vendor_product(this.state.active_cat, page)
        }
    }

    get_vendor_product = (status, page) => {
        fetch(global.vendor_api + 'get_orders_vendor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.context.token
            },
            body: JSON.stringify({
              page: page,
              status: status,
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    if (page == 1) {
                        this.setState({ data: [] })
                    }
                }
                else {
                    if (json.data.data.length > 0) {
                        var obj = json.data.data;
                        json.data.data.map((value, key) => {
                            const object = this.state.object;

                            if (value.status == 'active') {
                                object[value.id] = true;
                            }
                            else {
                                object[value.id] = false;
                            }

                            this.setState({ object });
                        })
                        if (page == 1) {
                            this.setState({ data: obj })
                        }
                        else {
                            this.setState({ data: [...this.state.data, ...obj] })
                            
                        }
                    }
                    else {

                    }

                }
                this.setState({ isloading: false, load_data: false })
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    filter = (id) => {

        this.setState({ isloading: true })
        this.get_vendor_product(id, 1);
        this.setState({ active_cat: id })
    }

    toggle = (id) => {
        // alert(id)
        const object = this.state.object;
        if (object[id] == true) {
            object[id] = false;
            var status = "inactive"
        }
        else {
            object[id] = true;
            var status = "active"
        }
        this.setState({ object });
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                action_id: id,
                type: 'product',
                status: status
            })
        }).then((response) => response.json())
            .then((json) => {

                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);

                }
                else {
                    //   Toast.show("jhsd")
                }
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }



    render() {

        return (
            <View style={[styles.container]}>
                {/* Component for  Filter Services */}

                <View style={{ borderBottomWidth: 1, borderColor: "#dedede", paddingVertical: 0 }}>
                
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                    <OrderType
              navigation={this.props.navigation}
              filter={this.filter}
              active_cat={this.state.active_cat}
              fetch_order={this.fetch_order}
            />

                    </View>
                </View>

                <ScrollView style={{ flex: 1}}>
                    {/* Particular Card Component */}
                    {!this.state.isloading ?
                        <>
                            {(this.state.data != "") ?
                                <Card navigation={this.props.navigation}
                                    data={this.state.data}
                                    category={this.state.category}
                                    load_more={this.load_more}
                                    load_data={this.state.load_data}
                                    toggle={this.toggle}
                                    get_category={this.get_category}
                                    get_vendor_product={this.get_vendor_product}
                                    object={this.state.object}
                                />

                                :
                                <View style={{ paddingTop: 120, alignItems: "center" }}>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image source={require("../img/no-product.png")}
                                            style={{ width: 300, height: 300 }} />
                                        <Text style={[styles.h3, { top: -20, alignSelf: "center" }]}>
                                            No Products Found!
                                        </Text>
                                    </View>
                                </View>
                            }
                        </>
                        :
                        <View >
                            <Loaders />
                        </View>
                    }


                    {(this.state.load_data) ?
                        <View style={{ alignItems: "center", flex: 1, backgroundColor: "white", flex: 1, paddingTop: 20 }}>
                            <ActivityIndicator animating={true} size="small" color="#EDA332" />
                            <Text style={styles.p}>Please wait...</Text>
                        </View>
                        :
                        <View></View>
                    }

                </ScrollView>

                {/* fab button */}
              

            </View>

        )
    }
}

export default Orders;

class Loaders extends Component {
    render() {
        return (
            <View>
                <SkeletonPlaceholder >
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <View style={{ marginLeft: 5 }}>
                            <View style={{ width: win.width / 3.5, height: 110, borderRadius: 10 }} />
                        </View>

                        <View>
                            <View style={{ flexDirection: "row", }}>
                                <View>
                                    <View style={{ width: 150, height: 15, marginLeft: 10, top: 5 }} />
                                    <View style={{ width: 250, height: 20, marginLeft: 10, top: 10 }} />
                                </View>
                                <View style={{ height: 20, width: 35, right: 60, bottom: 5 }}></View>
                                <View style={{ height: 20, width: 20, right: 50, bottom: 5 }}></View>
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "flex-end", left: -35, marginRight: 20, marginTop: 15 }}>
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                                <View style={{ width: 50, height: 15, marginLeft: 10, top: 15 }} />
                            </View>
                        </View>



                    </View>


                </SkeletonPlaceholder>

            </View>
        )
    }
}

class OrderType extends Component {
  render() {
    return (
      <View style={{marginTop:30}}>
         <Text style={[styles.h3,{ color: '#222', fontSize: RFValue(16, 580), fontWeight: 'bold', alignSelf: "flex-start" }]}>Orders </Text>
       
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
       
      
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly',marginTop:10}}>
          {this.props.active_cat != '' ? (
            <TouchableOpacity onPress={() => this.props.filter('')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>All</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>All</Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'placed' ? (
            <TouchableOpacity onPress={() => this.props.filter('placed')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Pending</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('placed')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Pending
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'confirmed' ? (
            <TouchableOpacity onPress={() => this.props.filter('confirmed')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Confirmed</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('confirmed')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Confirmed
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'in_process' ? (
            <TouchableOpacity onPress={() => this.props.filter('in_process')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>In Process</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('in_process')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  In Process
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'processed' ? (
            <TouchableOpacity onPress={() => this.props.filter('processed')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Processed</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('processed')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Processed
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'out for delivery' ? (
            <TouchableOpacity
              onPress={() => this.props.filter('out for delivery')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Out for Delivery</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.filter('out for delivery')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Out for Delivery
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'completed' ? (
            <TouchableOpacity onPress={() => this.props.filter('completed')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Completed</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('completed')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Completed
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {this.props.active_cat != 'cancelled' ? (
            <TouchableOpacity onPress={() => this.props.filter('cancelled')}>
              <View style={style.catButton}>
                <Text style={style.catButtonText}>Cancelled</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.filter('cancelled')}>
              <View style={[style.catButton, {backgroundColor: '#EDA332'}]}>
                <Text style={[style.catButtonText, {color: '#fff'}]}>
                  Cancelled
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      </View>
    );
  }
}

class Card extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isOn: false,
            isOff: true,
            object: {},
            id: [],
            prod_id: '',
        }
    }


    alertFunc = () => {
        this.RBSheet.close()
        Alert.alert(
            "",
            "Are you sure you want to delete this Menu?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.delete_product() }
            ]
        )
    }

    delete_product = () => {
        fetch(global.vendor_api + 'update_status_product_offer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            body: JSON.stringify({
                action_id: this.state.prod_id,
                type: 'product',
                status: "delete"
            })
        }).then((response) => response.json())
            .then((json) => {
                if (!json.status) {
                    var msg = json.msg;
                    // Toast.show(msg);

                }
                else {
                    Toast.show("Product deleted")
                    this.props.get_vendor_product(0, 1)
                }
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
        this.props.get_vendor_product(0, 1)
        this.props.get_category()
    }

    editNavigation = () => {
        this.props.navigation.navigate("EditService",
            {
                data: this.state.id,
                category: this.props.category,
                get_cat: this.props.get_category,
                get_vendor_product: this.props.get_vendor_product
            })
        this.RBSheet.close()
    }

    sheet = (id) => {
        this.setState({ id: id })
        this.RBSheet.open();
        this.setState({ prod_id: id.id })

    }

    productCard = ({item}) => (
      <View>
      <TouchableOpacity  onPress={() =>
        this.props.navigation.navigate('OrderDetails', {
          id: item.order_code,
        } )}  style={style.card}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            padding: 5,
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: '40%'}}>
            <Text style={style.heading}>{item.order_code}</Text>
          </View>
          <View style={{width: '60%'}}>
            <Text style={style.heading}>
              {moment(item.created_at).format('llll')}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', width: '100%'}}>
          {/* View for Content */}
          <View style={style.contentView}>
            {item.channel == 'website' ? (
              <View>
                {item.table != null ? (
                  <Text style={style.content}>
                    Table No - {item.table.table_name}
                  </Text>
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <Text style={style.heading}>Order from {item.channel}</Text>
            )}
            {/* View for name and heart */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* Text View */}
              <View style={{width: 200}}>
                <Text style={[styles.h4, {top: 10, textTransform: 'capitalize'}]}>
                  {(item.user != undefined ) ?item.user.name : 'Guest'}
  
                
                  {/* {item.user.name} */}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{
                    marginTop: 10,
                    fontSize: RFValue(12, 580),
                    color: '#222',
                    fontWeight: 'bold',
                  }}>
                  ₹ {item.total_amount}
                </Text>
              </View>
              <View
                  style={{
                    margin: 5,
                    marginTop: 20,
                    marginLeft: Platform.OS == 'ios' ? -30 : -20,
                  }}>
                  <View
                    style={{
                      marginRight: 10,
                      backgroundColor: '#f2f2f2',
                      padding: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 5,
                    }}>
  
              {item.order_type != 'TakeAway' && item.order_type != 'Delivery' ? (
               
                    <Text
                      style={{
                        fontSize: RFValue(10, 580),
                        color: '#222',
                        fontWeight: 'bold',
                      }}>
                      Dine-In 
                    </Text>
             
              ) : (
               
                    <Text
                      style={{
                        fontSize: RFValue(10, 580),
                        color: '#222',
                        fontWeight: 'bold',
                      }}>
                      {item.order_type}
                    </Text>
                
              )}
              </View>
              </View>
              
            </View>
          </View>
        </View>
  
        <View
          style={{
            height: 1,
            backgroundColor: '#F2F2F2',
            width: '95%',
            alignSelf: 'center',
          }}
        />
  
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* for order status */}
          {item.order_status == 'placed' ? (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="#EDA332"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {marginTop: Platform.OS == 'ios' ? 4 : 1, color: '#ff9933'},
                ]}>
                Pending
              </Text>
            </View>
          ) : item.order_status == 'confirmed' ? (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="#EDA332"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {marginTop: Platform.OS == 'ios' ? 4 : 1, color: '#EDA332'},
                ]}>
                Confirmed
              </Text>
            </View>
          ) : item.order_status == 'in_process' ? (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="#ffdf00"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {marginTop: Platform.OS == 'ios' ? 4 : 1, color: '#ffdf00'},
                ]}>
                In Process
              </Text>
            </View>
          ) : item.order_status == 'cancelled' ? (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="red"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {marginTop: Platform.OS == 'ios' ? 4 : 1, color: 'red'},
                ]}>
                Cancelled
              </Text>
            </View>
          ) : item.order_status == 'processed' ? (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="#ffdf00"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {marginTop: Platform.OS == 'ios' ? 4 : 1, color: '#ffdf00'},
                ]}>
                Processed
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <Icon
                name="ellipse"
                type="ionicon"
                size={15}
                color="green"
                style={{margin: 5}}
              />
              <Text
                style={[
                  styles.smallHeading,
                  {
                    marginTop: Platform.OS == 'ios' ? 4 : 1,
                    color: 'green',
                    textTransform: 'capitalize',
                  },
                ]}>
                {item.order_status}
              </Text>
            </View>
          )}
  
          {/* {item.order_status == 'in_process' ? (
            <Animatable.View
              style={{flexDirection: 'row', paddingTop: 10}}
              animation="pulse"
              duraton="1500"
              iterationCount="infinite">
              <Icon type="ionicon" name="time-outline" size={20} style={{paddingRight:-5}} color="green" />
               <Text
                style={{
                  fontSize: RFValue(11, 580),
                  color: 'green',
                  fontWeight: 'bold',
                  marginTop: Platform.OS == 'ios' ? 2 : 0,
                  paddingLeft: 5,
                }}>
                {moment(item.estimate_prepare_time)
                  .local()
                  .startOf('seconds')
                  .fromNow()}
              </Text> 
              
              {
                  item.estimate_prepare_time != null ? 
                      <>
                      {
                           this.state.isTimerFinished == false ? 
                          <CountDown
                      style={{ marginTop: -10 }}
                      until={moment(item.estimate_prepare_time).diff(moment())}
                      onFinish={() => {this.setState({isTimerFinished: true})}}
                      digitStyle={{ backgroundColor: '#FFF', }}
                      digitTxtStyle={{ color: 'green', fontFamily: "Raleway-Regular" }}
                      separatorStyle={{ color: 'green',marginTop:-2 }}
                      timeToShow={['M', 'S']}
                      timeLabels={{ m: null, s: null }}
                      showSeparator
                    />
                     :
                     <Text style={[styles.h4,{color:"red"}]}>Order Time is up</Text>
  
                      }
                      </> 
                       :
                       <></>
              }
              
            </Animatable.View>
          ) : (
            <></>
          )} */}
  
          {/* details button */}
          <View style={{paddingTop: 5, paddingVertical: 5}}>
            {/* <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('OrderDetails', {
                  id: item.order_code,
                })
              }
              style={{
                marginRight: 10,
                padding: 5,
                borderRadius: 5,
                flexDirection: 'row',
                borderWidth: 1,
              }}>
              <Text
                style={{
                  fontSize: RFValue(10, 580),
                  color: '#000',
                  marginTop: Platform.OS == 'ios' ? 1 : 0,
                }}>
                Details
              </Text>
              <Icon
                name="chevron-forward"
                type="ionicon"
                size={15}
                color="#000"
                style={{marginTop: 2}}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
      </View>
    );


    render() {
        return (
            <View>
                {/* {details} */}
                <FlatList
                    navigation={this.props.navigation}
                    showsVerticalScrollIndicator={false}
                    data={this.props.data}
                    renderItem={this.productCard}
                    keyExtractor={item => item.id}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => this.props.load_more()}
                />


            </View>
        )
    }
}
const style = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: Dimensions.get('window').width / 1.05,
    top: 7,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 15,
    padding: 6,
  },
  contentView: {
    flexDirection: 'column',
    width: '100%',
    marginRight: 10,
    padding: 5,
    // paddingBottom:10,
    // borderBottomWidth:0.5,
    // borderColor:"#d3d3d3",
    //  marginLeft:10,
    //  marginTop:10,
  },
  button: {
    backgroundColor: '#EDA332',
    padding: 4,
    borderRadius: 25,
    width: 100,
    height: 30,
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    color: '#fff',
    // fontFamily:"Roboto-Regular",
    fontFamily: 'Montserrat-Regular',
    fontSize: RFValue(9, 580),
  },
  catButton: {
    // backgroundColor:"#BC3B3B",
    // padding:7,
    height: 30,
    marginLeft: 10,
    borderRadius: 25,
    justifyContent: 'center',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    width: 100,
  },
  catButtonText: {
    alignSelf: 'center',
    color: '#222222',
    // fontFamily:"Roboto-Regular",
    fontFamily: 'Montserrat-Regular',
    fontSize: RFValue(9, 580),
  },
  add: {
    // borderWidth: 1,
    // borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    position: 'absolute',
    bottom: 15,
    right: 10,
    height: 50,
    backgroundColor: '#bc3b3b',
    borderRadius: 100,
  },
  heading: {
    color: '#000',
    fontFamily: 'Roboto-bold',
  },
});
