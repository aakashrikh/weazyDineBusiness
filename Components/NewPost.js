import React, { Component } from 'react';
import {
    Text, View, ScrollView, RBSheet, ActivityIndicator,
    StyleSheet, Image, Pressable, Dimensions,
    TouchableOpacity, TextInput
} from 'react-native';
import { Icon, Header, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from "react-native-image-crop-picker";
import Toast from "react-native-simple-toast";
import { RFValue } from 'react-native-responsive-fontsize';
//Global StyleSheet Import
const styles = require('../Components/Style.js');

const win = Dimensions.get('window');

const options = {
    title: "Pick an Image",
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 0.5
}
class NewPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            description: '',
            maxLength: 250,
            textLength: 0,
            image: '',
            isloading: false
        }
    }

    onChangeText(text) {
        this.setState({
            textLength: text.length,
            description: text
        });
    }

    //function to launch camera
    camera = () => {
        launchCamera(options, (response) => {

            if (response.didCancel) {
                console.warn(response)
                console.warn("User cancelled image picker");
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else {
                // const source = {uri: response.assets.uri};
                let path = response.assets.map((path) => {
                    return (
                        //  console.warn(path.uri) 
                        this.setState({ image: path.uri })
                    )
                });
                // this.RBSheet.close()
            }
        })
    }


    // function to launch gallery
    gallery = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 450,
            cropping: true,
        }).then(image => {
            console.log(image);
            // this.setState({image:"Image Uploaded"})
            this.setState({ image: image.path });
        })
    }


    //for header left component
          //for header left component
renderLeftComponent(){
    return(
      <View style={{top:5}}>
        <Icon type="ionicon" name="arrow-back-outline"
        onPress={()=>{this.props.navigation.goBack()}}/> 
      </View>
    )
  }
  //for header center component
  renderCenterComponent()
  {
  return(
  <View>
  <Text style={style.text}>New Post</Text>
  </View>
  
  )
  }

    renderRightComponent() {
        return (
            <View style={{ top: 10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Feeds")} >
                    <Icon type="ionicon" name="checkmark-sharp" size={25} color="#326bf3" />
                </TouchableOpacity>
                {/* <Icon type="ionicon" name="checkmark-sharp" size={25} color="#326bf3"
                onPress={()=>this.go()}/> */}
            </View>
        )
    }
    post = () => {
        if (this.state.description == "") {
            Toast.show("Please write something to post")
        }
        else {
            this.setState({ isloading: true });
            if (this.state.image != '') {
                var photo = {
                    uri: this.state.image,
                    type: 'image/jpg',
                    name: 'akash.jpg'
                };

            }
            var form = new FormData();
            form.append("user_type", "vendor");
            form.append("description", this.state.description);
            form.append("tag_id", global.vendor);
            form.append("feed_file[0]", photo);

            fetch(global.vendor_api + 'add_feed', {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': global.token
                },
            }).then((response) => response.json())
                .then((json) => {
                    if (!json.status) {
                        var msg = json.msg;
                        Toast.show("Failed to post");
                    }
                    else {
                       // console.warn("Sddd",json.last_added_data);
                        this.props.navigation.navigate("Feeds",{last_feed:json.last_added_data})
                    }
                    return json;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setState({ isloading: false })
                });
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                <Header 
                statusBarProps={{ barStyle: 'dark-content' }}
                centerComponent={this.renderCenterComponent()}
                leftComponent={this.renderLeftComponent()}
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                colors: ['white', 'white'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
                
                }}
                />
                </View>

                <View style={{
                    backgroundColor: "#d3d3d3", width: "100%",
                    height: 0.5, top: 5
                }}></View>

                <View style={{ flexDirection: 'row', top: 10,paddingBottom:90,borderWidth:1,borderColor:"#d3d3d3",width:"98%",alignSelf:"center",borderRadius:10 }}>

                    <Image source={{ uri: global.pic }} style={style.image} />
                    <TextInput
                        placeholder="Write something.."
                        maxLength={250}
                        value={this.state.description}
                        placeholderTextColor="#5d5d5d"
                        multiline={true}
                        onChangeText={this.onChangeText.bind(this)}
                        style={{ width: "100%", fontSize: 16, margin: 10, color: "#000", marginTop: 5 }}
                    />
                    {/* <Text style={[styles.h3,{marginTop:17}]}>
                        {global.name}
                    </Text> */}
                </View>
                {/* <View style={{backgroundColor:"#d3d3d3",width:"100%",
            height:1,top:15}}></View> */}
                {/* <TextInput
                    placeholder="Write something.."
                    maxLength={250}
                    value={this.state.description}
                    placeholderTextColor="#5d5d5d"
                    multiline={true}
                    onChangeText={this.onChangeText.bind(this)}
                    style={{width:"100%",fontSize:16,margin:10,color:"#000" }}
                    /> */}
                <Text style={{
                    fontSize: 12,
                    color: 'grey',
                    marginTop: -10,
                    marginRight: 15,
                    textAlign: 'right'
                }}>
                    {this.state.textLength}/250
                </Text>

                {/* <View style={{
                    backgroundColor: "#d3d3d3", width: "100%",
                    height: 1, top: 15
                }}></View> */}

                {this.state.image == "" ?
                    null :
                    <View style={{ flexDirection: "row",alignSelf:"center",width:"100%",paddingHorizontal:20, }}>
                        <Image
                            source={{ uri: this.state.image }}
                            style={{ height: 250, width: "100%", borderRadius: 5, marginTop: 40, alignSelf: "center" }} />
                        <Pressable onPress={() => this.gallery()} style={{ backgroundColor: "white", height: 24, right: 25, top: 40, borderWidth: 1, borderRadius: 5, padding: 2 }} >
                            <Icon name="edit" size={20} />
                        </Pressable>
                    </View>
                }

                <View >
                    {this.state.image == "" ?
                        <View style={{ flexDirection: "row", marginTop: 60 }}>
                            {/* <Image source={require('../img/addProduct.png')}
                                style={style.serviceImg}/> */}
                            <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.gallery()}>
                                <View style={style.add}>
                                    <Icon name="add" size={35} color="#326bf3" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }

                </View>
                {!this.state.isloading ?
                    <View>
                        <TouchableOpacity
                            onPress={() => this.post()}
                            style={[style.buttonStyles,]}>
                            <LinearGradient
                                colors={['#326BF3', '#0b2564']}
                                style={styles.signIn}>

                                <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                    Post</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={"large"} color="#326bf3" />
                    </View>
                }
            </View>
        )
    }
}

export default NewPost;

const style = StyleSheet.create({
    text: {
        fontFamily: "Raleway-SemiBold",
        fontSize: RFValue(14.5, 580),
        margin: 5, color: "#000000"
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 25,
        margin: 10,
        borderColor: "#aaa",
        borderWidth: 0.5
    },
    buttonStyles: {
        width: "35%",
        alignSelf: "center",
        marginTop: 50,
        marginRight: 5
    },
    add: {
        height: 80,
        width: 80,
        borderWidth: 1,
        marginLeft: 20,
        borderStyle: "dashed",
        borderRadius: 10,
        alignItems: "center",
        paddingTop: 20
    },
    Img: {
        height: 140,
        width: 120,
        borderRadius: 10,

    },
    loader: {
        shadowOffset: { width: 50, height: 50 },
        marginTop: 30,
        marginBottom: 5,
        shadowRadius: 50,
        elevation: 5,
        backgroundColor: "#fff", width: 40, height: 40, borderRadius: 50, padding: 5, alignSelf: "center"
    },
})