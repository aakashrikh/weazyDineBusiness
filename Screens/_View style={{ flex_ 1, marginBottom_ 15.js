<View style={{ flex: 1, marginBottom: 15, }}>
                <View>
                    <Text style={style.fieldsTitle}>
                        Name
                    </Text>
                    <TextInput
                        value={this.state.name}
                        onChangeText={(e) => { this.setState({ name: e }) }}
                        style={style.textInput} />
                </View>
                <View>
                    <Text style={style.fieldsTitle}>Category</Text>
                    <View style={{ marginLeft: 20, marginRight: 20, }}>
                        <SelectDropdown
                            buttonStyle={{ width: "100%" }}
                            data={this.state.cat_name}
                            onSelect={(selectedCategories, index) => {
                                this.set_value(index);
                            }}
                            buttonTextAfterSelection={(selectedCategories, index) => {
                                return selectedCategories
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                            defaultValue={this.state.cat_name[this.state.cat_id.indexOf(this.props.data.vendor_category_id)]}
                        />
                    </View>
                    <TouchableOpacity style={style.uploadButton} onPress={() => this.props.navigation.navigate("AddCategory")} >
                        <Text style={style.buttonText}>
                            Add new
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={style.fieldsTitle}>
                        Market Price
                    </Text>

                    <TextInput
                        keyboardType="numeric"
                        value={this.state.market_price}
                        onChangeText={(e) => { this.setState({ market_price: e }) }}
                        style={[style.textInput, { paddingLeft: 30 }]} />
                    <Text style={{ left: 25, top: 55, position: "absolute" }} >
                        <MaterialCommunityIcons name="currency-inr" size={20} />
                    </Text>

                </View>

                <View>
                    <Text style={style.fieldsTitle}>
                        Our Price
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={this.state.our_price}
                        onChangeText={(e) => { this.setState({ our_price: e }) }}
                        style={[style.textInput, { paddingLeft: 30 }]} />
                    <Text style={{ left: 25, top: 55, position: "absolute" }} >
                        <MaterialCommunityIcons name="currency-inr" size={20} />
                    </Text>
                </View>

                <View style={{ marginTop: 20, alignSelf: 'center' }}>
                    <RadioForm
                        formHorizontal={true}
                        radio_props={radio_props}
                        animation={true}
                        initial={0}
                        labelHorizontal={false}
                        labelStyle={{ marginRight: 20 }}
                        selectedButtonColor={"#EDA332"}
                        buttonColor={"#EDA332"}
                        onPress={(value) => { this.setState({ is_veg: value }) }}
                    />
                </View>

                <View>
                    <Text style={style.fieldsTitle}>
                        Description <Text style={{ color: "grey" }}>(50words) </Text>
                    </Text>
                    <TextInput
                        multiline={true}
                        onContentSizeChange={(event) => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}

                        value={this.state.description}
                        onChangeText={(e) => { this.setState({ description: e }) }}
                        // keyboardType="numeric"
                        style={[style.textInput, { alignItems: "flex-start", height: Math.max(35, this.state.height) }]}
                    />
                </View>

                <View>

                </View>
                <View>

                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProductVariants', { product_id: this.state.prod_id, variants: this.props.data.variants, addons: this.props.data.addons,refresh:false }) }}>
                                <Text style={style.fieldsTitle}> + VARIANTS & ADD-ONS</Text>


                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{justifyContent:"center"}} onPress={() => { this.props.navigation.navigate('ProductVariants', { product_id: this.state.prod_id, variants: this.props.data.variants, addons: this.props.data.addons,refresh:false }) }}>
                            <Text style={[style.textInput,{justifyContent:"center",paddingTop:8}]}>
                                {this.props.data.variants.length} Variants
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", width: "100%" }}>


                        <View style={{ width: "60%" }}>
                            <Text style={style.fieldsTitle}>
                                Upload Image
                            </Text>
                            <View style={{ flexDirection: "column" }}>

                                {this.state.image == "" ?
                                    <View style={{ flexDirection: "row", }}>
                                        {/* <Image source={require('../img/addProduct.png')}
                                style={style.serviceImg}/> */}
                                        <TouchableOpacity style={{ width: 80, height: 80 }} onPress={() => this.RBSheet.open()}>
                                            <View style={style.add}>
                                                <Icon name="add" size={35} color="#EDA332" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row", }}>
                                        <Image
                                            source={{ uri: this.state.image }}
                                            style={style.serviceImg} />
                                        <Pressable onPress={() => this.RBSheet.open()} style={{ backgroundColor: "white", height: 28, right: 27, borderWidth: 1, borderRadius: 5, padding: 2 }} >
                                            <Icon name="edit" size={20} />
                                        </Pressable>
                                    </View>
                                }

                                {/* <TouchableOpacity style={style.uploadButton} onPress={()=>this.RBSheet.open()} >
                                <Text style={style.buttonText}>
                                    Choose Photo
                                </Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                </View>
                {/* Bottom Sheet fot FAB */}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={150}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20
                        },
                        wrapper: {
                            // backgroundColor: "transparent",
                            borderWidth: 1
                        },
                        draggableIcon: {
                            backgroundColor: "grey"
                        }
                    }}
                >
                    {/* bottom sheet elements */}
                    <View>

                        {/* Bottom sheet View */}

                        <View style={{ width: "100%", padding: 20 }}>
                            <TouchableOpacity onPress={this.camera}>
                                <Text style={style.iconPencil}>
                                    <Icon name='camera' type="ionicon" color={'#0077c0'} size={25} />
                                </Text>
                                <Text style={style.Text}>Take a picture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.gallery} >
                                <Text style={style.iconPencil}>
                                    <Icon name='folder' type="ionicon" color={'#0077c0'} size={25} />
                                </Text>
                                <Text style={style.Text}>Select from library</Text>
                            </TouchableOpacity>

                        </View>


                    </View>
                </RBSheet>
                {!this.state.isLoading ?
                    <View>
                        <TouchableOpacity
                            onPress={() => this.create()}
                            style={style.buttonStyles}>
                            <LinearGradient
                                colors={['#EDA332', '#EDA332']}
                                style={styles.signIn}>

                                <Text style={[styles.textSignIn, { color: '#fff' }]}>
                                    Save</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.loader}>
                        <ActivityIndicator size={"large"} color="#EDA332" />
                    </View>
                }
            </View>



load_more = () => {
    var data_size = this.state.data.length
    if (data_size > 9) {

      var page = this.state.page + 1
      this.setState({ page: page })
      this.setState({ load_data: true });
      this.get_vendor_product(this.state.active_cat, page)
    }
  }







  {this.state.discount_type === 'fixed' ? (
    this.state.discount === '' ? (
      <></>
    ) : (
      <p>
        Flat ₹{this.state.discount} off on all orders
        {this.state.minimum_order_value === '' ? (
          <></>
        ) : (
          <span>
            {' '}
            above ₹{this.state.minimum_order_value}
          </span>
        )}
      </p>
    )
  ) : this.state.discount === '' ? (
    <></>
  ) : (
    <p>
      {this.state.discount}% off on all orders
      {this.state.minimum_order_value === '' ? (
        <></>
      ) : (
        <span>
          {' '}
          above ₹{this.state.minimum_order_value}
        </span>
      )}
      {this.state.maximum_discount === '' ? (
        <></>
      ) : (
        <span>
          {' '}
          upto ₹{this.state.maximum_discount}
        </span>
      )}
    </p>
  )}





  {this.state.status ? (
    this.state.discount === '' ? (
      <></>
    ) : (
      <Text>
        Flat ₹{this.state.discount} off on all orders
        {this.state.minimum_order_value === '' ? (
          <></>
        ) : (
          <Text>
            {' '}
            above ₹{this.state.minimum_order_value}
          </Text>
        )}
      </Text>
    )
  ) : this.state.discount === '' ? (
    <></>
  ) : (
    <Text>
      {this.state.discount}% off on all orders
      {this.state.minimum_order_value === '' ? (
        <></>
      ) : (
        <Text>
          {' '}
          above ₹{this.state.minimum_order_value}
        </Text>
      )}
      {this.state.maximum_discount === '' ? (
        <></>
      ) : (
        <Text>
          {' '}
          upto ₹{this.state.maximum_discount}
        </Text>
      )}
    </Text>
  )}