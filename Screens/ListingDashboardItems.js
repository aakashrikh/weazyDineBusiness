import React, { Component } from 'react';
import {
    Text, View,
    StyleSheet, Image, ActivityIndicator,
     FlatList
} from 'react-native';
import { Icon, Header} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
//Global StyleSheet Import
const styles = require('../Components/Style.js');


class ListingDashboardItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            save: true,
            isloading:true,
            page:1
        }
    }

    componentDidMount() {
        if (this.state.title == "visits") {
            this.setState({ title: "Shop Visits" })
            this.shop_visit(1);
        }
        else if (this.state.title == "followings") {
            this.setState({ title: "Your Followers" })
            this.get_followers();
        }
        else if (this.state.title == "contact") {
            this.setState({ title: "Contact" })
            this.get_contact();
        }
        else if (this.state.title == "saved") {
            this.setState({ title: "Saved Feeds" })
            this.get_saved_feed();
        }
    }

    shop_visit = (page_id) => {
        fetch(global.vendor_api + 'vendor_shop_visit?page='+page_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },

        }).then((response) => response.json())
            .then((json) => {
                // console.warn(json)
                if (json.status) {
                    var obj=json.data.data;
                    var joined = this.state.item.concat(obj);

                    this.setState({ item: joined })
                    console.warn("visits", this.state.item)
                    //    alert(this.state.item.shop_visit)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    load_more = ()=>
    {
        var data_size=this.state.item.length;
        if(data_size>9)
        {
            var page=this.state.page+1;
            this.setState({load_more:true,page:page});
            // this.fetch_data(this.state.select_cat);
            if (this.state.title == "Shop Visits") {
                this.shop_visit(page);
            }
            else if (this.state.title == "Your Followers") {
                this.get_followers();
            }
            else if (this.state.title == "contact") {
                this.get_contact();
            }
            else if (this.state.title == "Saved Feeds") {
                this.get_saved_feed();
            }
            this.shop_visit(page);
        }
    }

    get_followers = (page_id) => {
        fetch(global.vendor_api + 'get_vendor_follower?page='+page_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },

        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (json.status) {
                    this.setState({ item: json.data.data })
                    console.warn(this.state.item)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }
    get_contact = (page_id) => {
        fetch(global.vendor_api + 'get_contacts_detail?page='+page_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },

        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (json.status) {
                    this.setState({ item: json.data.data })
                    console.warn(this.state.item)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }

    get_saved_feed = (page_id) => {
        fetch(global.vendor_api + 'get_saved_feed_user_detail?page='+page_id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },

        }).then((response) => response.json())
            .then((json) => {
                console.warn(json)
                if (json.status) {
                    this.setState({ save: false })
                    this.setState({ item: json.data.data })
                    console.warn(this.state.item)
                    //    alert(this.state.item.shop_visit)
                }
                return json;
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                this.setState({ isloading: false })
            });
    }


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

                <Text style={style.text}>
                    Store Visit
                </Text>
            </View>

        )
    }

    card = ({ item }) => {
        return (
            <View style={{ flexDirection: "row",marginTop:-3, paddingBottom:10, margin: 10,marginBottom:2, borderWidth:1,marginTop:5,borderColor:"#d3d3d3",width:"95%",alignSelf:"center",borderRadius:10 }}>
                <Image source={{ uri:item.profile_pic }} style={{ width: 40, height: 40, borderRadius: 50,marginLeft:10,marginTop:10 }} />
                {this.state.save ?
                <View style={{paddingTop:10}}>
                    <Text style={[styles.h4, { marginLeft: 20, fontFamily: "Roboto-Regular" }]}>
                        {item.name}
                    </Text>
                    <Text style={style.postTime}>
                    {moment.utc(item.created_at).local().startOf('seconds').fromNow()}
                      </Text>
                    </View>
                    :
                    <Text style={[styles.h4, { marginLeft: 20, marginTop: 5 }]}>
                        {item.username}
                    </Text>
                }
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
                {!this.state.isloading ?
                <>
                {this.state.item.length>0 ?

                <FlatList
                    navigation={this.props.navigation}
                    showsVerticalScrollIndicator={false}
                    data={this.state.item}
                    renderItem={this.card}
                    keyExtractor={(item, index) => item.id}
                    onEndReached={()=>{this.load_more()}}
                    onEndReachedThreshold={0.5}
                // onEndReachedThreshold={0.5}
                // onEndReached={()=>{this.load_data()}}
                />
                :
                <View>
                <Image  source={require("../img/nofeeds.jpg")} style={{width:"100%",height:250,alignSelf:"center",marginTop:50}} />
                 <Text style={[styles.h3,{alignSelf:"center",marginTop:20}]}>
                     No Results Found!
                 </Text>
                </View>
    }
    </>
    :
    <View style={{marginTop:50}} >
    <ActivityIndicator color="#EDA332" size="large" />
    </View>
}
                {/* <View style={{ flexDirection: "row", marginLeft: 20, margin: 10 }}>
                    <Image source={require("../img/user.jpg")} style={{ width: 40, height: 40,borderRadius:50 }} />
                    <Text style={[styles.h3, { marginLeft: 20,marginTop:5 }]}>
                        Aman
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20, margin: 10 }}>
                    <Image source={require("../img/user.jpg")} style={{ width: 40, height: 40,borderRadius:50 }} />
                    <Text style={[styles.h3, { marginLeft: 20,marginTop:5 }]}>
                        Aman
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 20, margin: 10 }}>
                    <Image source={require("../img/user.jpg")} style={{ width: 40, height: 40,borderRadius:50 }} />
                    <Text style={[styles.h3, { marginLeft: 20,marginTop:5 }]}>
                        Aman
                    </Text>
                </View> */}

            </View>
        )
    }
}

export default ListingDashboardItems;

//Styling
const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },
    postTime:{
        fontFamily:"Roboto-Regular",
        color:"grey",
        marginLeft:20,
        fontSize:11
      },

}
)