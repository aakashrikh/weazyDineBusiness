const config={
    screens:{
        Offers:'offer_details/:offer_id',
        Home:'home/',
        VoucherDetails:'OrderDetails/:code',
        Wallet:'ViewTransaction',
        TableView:'TableOrderDetails/:table_uu_id',
    }
}

const linking={
    prefixes:["weazydine://",'http://myweazy.com', 'https://myweazy.com'],
    config,
};

export default linking