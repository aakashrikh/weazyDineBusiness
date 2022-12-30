<View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>

                    {/* Total Feed Views */}
                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("Wallet")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    Total Orders
                                </Text>
                            </View>
                            <Text style={{ color: '#222', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.orders}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>




                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12, 580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    Total Sales
                                </Text>
                            </View>
                            <Text style={{ color: '#222', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                ₹{parseFloat(item.total_earnning).toFixed(2)}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>

                    {/* Total Feed Views */}
                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("Wallet")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="cash-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, fontSize: RFValue(12, 580), top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    Cash Sales
                                </Text>
                            </View>
                            <Text style={{ color: '#222', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                ₹{item.cashsale}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>



                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12, 580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    Online Sales
                                </Text>
                            </View>
                            <Text style={{ color: '#222', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.online}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {/* Total Feed Views */}
                    {/* <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
    <LinearGradient
        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
        colors={['#ffffff', '#ffffff']}
        style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
        <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
            <Icon type="ionicon" name="person-outline" color='#5BC2C1'
                style={{ marginRight: 10,fontSize:16, top: 2 }} size={25} />
            <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4,fontSize: RFValue(12,580) }}>
                TOTAL CUSTOMER
            </Text>
        </View>
        <Text style={{ color: '#5BC2C1', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
            {item.customer}
        </Text>
    </LinearGradient>
</TouchableOpacity> */}

                </View>
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>
                    {/* Shop Visits View  */}
                    {/* <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("ListingDashboardItems", { screen: "visits" })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="eye-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12,580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    STORE VISIT
                                </Text>
                            </View>
                            <Text style={{ color: '#5BC2C1', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.shop_visit}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                    {/* Shop Visits View  */}
                    {/* <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("CashbackHistory")}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="fast-food-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontSize: RFValue(12,580), fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    ORDERS
                                </Text>
                            </View>
                            <Text style={{ color: '#5BC2C1', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {item.orders}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                </View>

                {/* Deals */}
                {/* <Text style={[styles.h3, { color: "#000", paddingTop: 10, fontWeight: 'bold', marginLeft: 15, marginTop: 10 }]}>Flat Discounts Deals</Text> */}
                {/* <View style={{ flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "space-around", marginTop: 10, }}>

                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "New Customer", first_deal: this.state.first_deal, all_deal: this.state.recurring_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="person-add-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    New Customer
                                </Text>
                            </View>
                            <Text style={{ color: '#5BC2C1', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.first_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={[style.gradientView, { width: "45%" }]} onPress={() => this.props.navigation.navigate("TopDeals", { screen: "All Customer", all_deal: this.state.recurring_deal, first_deal: this.state.first_deal })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            colors={['#ffffff', '#ffffff']}
                            style={[style.gradientView, { width: "100%", marginLeft: 0 }]}>
                            <View style={{ flexDirection: "row", marginLeft: -20, marginTop: 5 }}>
                                <Icon type="ionicon" name="people-outline" color='#5BC2C1'
                                    style={{ marginRight: 10, top: 2 }} size={25} />
                                <Text style={{ color: '#222', fontFamily: "Roboto-Medium", marginTop: 4 }}>
                                    All Customer
                                </Text>
                            </View>
                            <Text style={{ color: '#5BC2C1', fontFamily: "Roboto-Bold", fontSize: RFValue(14, 580), marginBottom: 10 }}>
                                {this.state.recurring_deal}%
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View> */}
