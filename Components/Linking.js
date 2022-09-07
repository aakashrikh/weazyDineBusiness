const config={
    screens:{
        Offers:'offer_details/:offer_id',
        SingleFeed:'feedView/:id',
        Home:'home/',
        Comments:'feedComment/:id',
        VoucherDetails:'voucher/:code',
        Wallet:'ViewTransaction',
        TableView:'ViewTableOrder/:table_id',
    }
}

const linking={
    prefixes:["weazydine://",'http://myweazy.com', 'https://myweazy.com'],
    config,
};

export default linking