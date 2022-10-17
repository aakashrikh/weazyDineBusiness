import React, {Component} from 'react';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import {
  View,
  ImageBackground,
  Alert,
  StyleSheet,
  Pressable,
  Switch,
  Image,
  Text,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import {Header, Icon, Input} from 'react-native-elements';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-simple-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import {ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import Modal from "react-native-modal";
import {AuthContext} from '../AuthContextProvider.js';

//Global Style Import
const styles = require('../Components/Style.js');

class OrderDetails extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      user: [],
      cart: [],
      load_data: false,
      mark_complete_buttonLoading: false,
      modalVisible:false
    };
  }

  //for header left component
  renderLeftComponent() {
    return (
      <View style={{top: 5}}>
        <Icon
          type="ionicon"
          name="arrow-back-outline"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  }
  //for header center component
  renderCenterComponent() {
    return (
      <View>
        <Text style={style.text}>Order #{this.state.data.order_code}</Text>
      </View>
    );
  }

  componentDidMount = () => {
    this.orderDetails(this.props.route.params.id);
    window.Echo.private(`orderstatus.`+this.props.route.params.id).listen('.order.status', data => {
     console.warn(data)
    });
  };

  orderDetails = id => {
    fetch(global.vendor_api + 'get_orders_details_vendor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.context.token,
      },
      body: JSON.stringify({
        order_code: id,
      }),
    })
      .then(response => response.json())
      .then(json => {
        if (!json.status) {
        } else {
          json.data.map(item => {
            this.setState({data: item});
          });

          this.setState({
            cart: json.data[0].cart,
            user: json.data[0].user,
            isLoading: false,
          });
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  change_order_status = status => {
    this.setState({mark_complete_buttonLoading: true});
    fetch(global.vendor_api + 'update_order_status_by_vendor', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.context.token,
      },
      body: JSON.stringify({
        order_id: this.state.data.id,
        order_status: status,
      }),
    })
      .then(response => response.json())
      .then(json => {
        if (!json.status) {
        } else {
          this.orderDetails(this.state.data.id);
          Toast.show('Order Status Updated Successfully');
          this.props.navigation.navigate('Orders', {active_cat: 0});
        }
        return json;
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        // this.orderDetails(this.state.data.id);
        this.setState({mark_complete_buttonLoading: false});
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{barStyle: 'light-content'}}
          leftComponent={this.renderLeftComponent()}
          centerComponent={this.renderCenterComponent()}
          ViewComponent={LinearGradient} // Don't forget this!
          linearGradientProps={{
            colors: ['#fff', '#fff'],
          }}
        />

        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              width: '100%',
              padding: 5,
              justifyContent: 'space-evenly',
            }}>
            <View style={{width: '50%'}}>
              <Text>Order #{this.state.data.order_code}</Text>
            </View>
            <View style={{width: '50%'}}>
              <Text>{moment(this.state.data.created_at).format('llll')}</Text>
            </View>
          </View>

          {this.state.isLoading ? (
            <Loader />
          ) : (
            <Card
              navigation={this.props.navigation}
              cart={this.state.cart}
              data={this.state.data}
              user={this.state.user}
              change_order_status={this.change_order_status}
              modalVisible={this.state.modalVisible}
            />
          )}
        </ScrollView>

      </View>
    );
  }
}

export default OrderDetails;

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  productCard = ({item}) => (
    <View style={style.card}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          width: '100%',
          padding: 5,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text>1 ITEM</Text>
        </View>
        <View>{/* <Text>RECEIPT</Text> */}</View>
      </View>

      <View style={{flexDirection: 'row', width: '100%'}}>
        {/* View for Image */}
        <View style={{width: '20%'}}>
          <Image source={{uri: item.product.product_img}} style={style.logo} />
        </View>
        {/* View for Content */}
        <View style={style.contentView}>
          {/* View for name and heart */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* Text View */}
            <View style={{width: 200}}>
              <Text style={[styles.smallHeading, {top: 10}]}>
                {item.product.product_name}
              </Text>

              <View style={{marginTop: 20, flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor: '#E6EFF6',
                    width: 25,
                    justifyContent: 'center',
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: '#186AB1',
                  }}>
                  <Text style={{alignSelf: 'center'}}>
                    {item.product_quantity}
                  </Text>
                </View>

                <Icon
                  name="close-outline"
                  type="ionicon"
                  size={20}
                  style={{left: 2}}
                />

                <Text style={{fontSize: RFValue(12, 580)}}>
                  {' '}
                  ₹ {item.product_price / item.product_quantity}
                </Text>
              </View>
            </View>
            {/* View for payment mode  */}
            <View style={{margin: 5, marginTop: 20, marginLeft: -5}}>
              <Text>₹ {item.product_price}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  render() {
    return (
      <View>
        <FlatList
          navigation={this.props.navigation}
          showsVerticalScrollIndicator={false}
          data={this.props.cart}
          renderItem={this.productCard}
        />

        <View
          style={{backgroundColor: '#fff', marginTop: 10, paddingBottom: 10}}>
          <View
            style={[
              style.detailsView,
              {borderBottomWidth: 0, paddingVertical: 10, alignItems: 'center'},
            ]}>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.h4, {fontSize: RFValue(11.5, 580)}]}>
                Item Total
              </Text>
            </View>
            <Text style={[styles.h4, {fontSize: RFValue(12, 580)}]}>
              ₹ {this.props.data.order_amount}
            </Text>
          </View>
          {this.props.data.cgst > 0 || this.props.data.sgst > 0 ? (
            <View
              style={[
                style.detailsView,
                {paddingVertical: 0, paddingBottom: 10},
              ]}>
              <Text style={[styles.h4, {fontSize: RFValue(11.5, 580)}]}>
                Taxes & Other Charges
              </Text>
              <Text
                style={[
                  styles.h4,
                  {fontSize: RFValue(11.5, 580), color: '#ff9933'},
                ]}>
                + {this.props.data.cgst + this.props.data.sgst}
              </Text>
            </View>
          ) : (
            <></>
          )}

          {this.props.data.order_discount > 0 ? (
            <View
              style={[
                style.detailsView,
                {paddingVertical: 0, paddingBottom: 10},
              ]}>
              <Text style={[styles.h4, {fontSize: RFValue(11.5, 580)}]}>
                Discount
              </Text>
              <Text
                style={[
                  styles.h4,
                  {fontSize: RFValue(11.5, 580), color: 'green'},
                ]}>
                - {this.props.data.order_discount}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View style={[style.detailsView, {borderBottomWidth: 0}]}>
            <Text
              style={[styles.h4, {color: '#000', fontSize: RFValue(12, 580)}]}>
              Grand Total
            </Text>
            <Text style={{fontSize: RFValue(12, 580), color: '#000'}}>
              {' '}
              ₹ {this.props.data.total_amount}/-
            </Text>
          </View>
        </View>

        <View style={{height: 2, backgroundColor: '#F5f5f5'}} />

        {/* for customer details */}
        <View
          style={{backgroundColor: '#fff', marginTop: 5, paddingBottom: 10}}>
          <Text
            style={{
              fontSize: RFValue(11.5, 580),
              color: '#696969',
              fontWeight: '600',
              marginLeft: 10,
            }}>
            Customer Details
          </Text>

          <View style={{padding: 5, paddingLeft: 12}}>
            <Text
              style={[styles.h4, {color: '#000', fontSize: RFValue(12, 580)}]}>
              {this.props.user.name}
            </Text>
            <Text style={{color: '#000', fontSize: RFValue(12, 580)}}>
              +91-{this.props.user.contact}
            </Text>
          </View>

          {this.props.data.order_type == 'Delivery' ||
          this.props.data.order_type == 'TakeAway' ? (
            <>
              {this.props.user.address == null  ? (
                <></>
              ) : (
                <>
                  <View style={{padding: 5, paddingLeft: 12}}>
                    <Text
                      style={[
                        styles.h4,
                        {color: '#000', fontSize: RFValue(12, 580)},
                      ]}>
                      Address
                    </Text>
                    <Text style={{color: '#000', fontSize: RFValue(12, 580)}}>
                      {this.props.user.address}
                    </Text>
                  </View>

                </>
              )}
            </>
          ) : (
            <></>
          )}
        </View>
          



        {/* accept decline button */}

        <View style={{marginBottom: 30}}>
          {this.props.data.order_status == 'placed' ? (
            <>
              {this.state.mark_complete_buttonLoading ? (
                <ActivityIndicator size="small" color="#EDA332" />
              ) : (
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: 40,
                  }}>
                  <TouchableOpacity
                    style={style.acceptButton}
                    onPress={() => this.props.change_order_status('confirmed')}>
                    <Text style={style.buttonText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={style.declineButton}
                    onPress={() => this.props.change_order_status('cancelled')}>
                    <Text style={[style.buttonText, {color: '#000'}]}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : this.props.data.order_status == 'confirmed' ? (
            <>
              {this.state.mark_complete_buttonLoading ? (
                <ActivityIndicator size="small" color="#EDA332" />
              ) : (
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: 40,
                  }}>
                  <TouchableOpacity
                    style={[
                      style.acceptButton,
                      {backgroundColor: '#EDA332', width: '50%'},
                    ]}
                    // onPress={() => {this.setState({modalVisible:true})}}

                    onPress={()=>this.change_order_status('in_progress')}
                    >
                    <Text style={[style.buttonText]}>Order In Progress</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[style.declineButton, {width: '40%'}]}
                    onPress={() => this.props.change_order_status('cancelled')}>
                    <Text style={[style.buttonText, {color: '#000'}]}>
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )
          : this.props.data.order_status == 'in_process' ? (
            <>
              {this.state.mark_complete_buttonLoading ? (
                <ActivityIndicator size="small" color="#EDA332" />
              ) : (
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: 40,
                  }}>
                  <TouchableOpacity
                    style={[
                      style.acceptButton,
                      {backgroundColor: '#EDA332', width: '50%'},
                    ]}
                    onPress={() => this.props.change_order_status('processed')}>
                    <Text style={[style.buttonText]}>Order In Progress</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[style.declineButton, {width: '40%'}]}
                    onPress={() => this.props.change_order_status('cancelled')}>
                    <Text style={[style.buttonText, {color: '#000'}]}>
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) 
           : this.props.data.order_status == 'processed' ? (
            this.props.data.order_type == 'Delivery' ? (
              <>
                {this.state.mark_complete_buttonLoading ? (
                  <ActivityIndicator size="small" color="#EDA332" />
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-evenly',
                      flexDirection: 'row',
                      marginTop: 40,
                    }}>
                    <TouchableOpacity
                      style={style.acceptButton}
                      onPress={() =>
                        this.props.change_order_status('out for delivery')
                      }>
                      <Text style={style.buttonText}>Out for Delivery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={style.declineButton}
                      onPress={() => this.change_order_status('cancelled')}>
                      <Text style={[style.buttonText, {color: '#000'}]}>
                        Cancel Order
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View
                style={{
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  marginTop: 40,
                }}>
                <TouchableOpacity
                  style={style.acceptButton}
                  onPress={() => this.props.change_order_status('completed')}>
                  <Text style={style.buttonText}>Completed</Text>
                </TouchableOpacity>
              </View>
            )
          ) : this.props.data.order_status == 'out for delivery' ? (
            <>
              {this.state.mark_complete_buttonLoading ? (
                <ActivityIndicator size="small" color="#EDA332" />
              ) : (
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: 40,
                  }}>
                  <TouchableOpacity
                    style={style.acceptButton}
                    onPress={() => this.props.change_order_status('completed')}>
                    <Text style={style.buttonText}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <></>
          )}
        </View>


        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.props.modalVisible}
                        onBackdropPress={() => {
                            this.setState({ modalVisible: false })
                        }}
                    >
                        <View style={style.centeredView}>
                            <View style={style.modalView}>
                            <Input  
             onChangeText={(e) => {this.setState({contact_no:e})}}
             placeholder='Enter your mobile number'
             maxLength={10}
             keyboardType="number-pad"
            
            style ={{marginTop:15,marginLeft:15}}
           />
                            </View>
                        </View>
                    </Modal>
      </View>
    );
  }
}

class Loader extends Component {
  render() {
    return (
      <View>
        <SkeletonPlaceholder>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{marginLeft: 5}}>
              <View
                style={{width: win.width / 3.5, height: 110, borderRadius: 10}}
              />
            </View>

            <View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{width: 150, height: 15, marginLeft: 10, top: 5}}
                  />
                  <View
                    style={{width: 250, height: 20, marginLeft: 10, top: 10}}
                  />
                </View>
                <View
                  style={{height: 20, width: 35, right: 60, bottom: 5}}></View>
                <View
                  style={{height: 20, width: 20, right: 50, bottom: 5}}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  left: -35,
                  marginRight: 20,
                  marginTop: 15,
                }}>
                <View
                  style={{width: 50, height: 15, marginLeft: 10, top: 15}}
                />
                <View
                  style={{width: 50, height: 15, marginLeft: 10, top: 15}}
                />
              </View>
            </View>
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  }
}

const win = Dimensions.get('window');
//Styling
const style = StyleSheet.create({
  text: {
    fontFamily: Platform.OS == 'ios' ? null : 'Roboto-SemiBold',
    fontSize: RFValue(13, 580),
    margin: 5,
  },
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
    width: '70%',
    marginRight: 10,
    // paddingBottom:10,
    // borderBottomWidth:0.5,
    // borderColor:"#d3d3d3",
    marginLeft: 10,
    //  marginTop:10,
  },
  logo: {
    height: 60,
    width: 60,
    // borderWidth:0.2,
    borderRadius: 5,
    borderColor: 'black',
    margin: 10,
    marginLeft: 10,
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
    padding: 5,
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: RFValue(14, 580),
  },
  declineButton: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
},
modalView: {
    margin: 20,
    width: 300,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
},
});
