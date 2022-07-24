const config={
    screens:{
        Offers:'offer_details/:offer_id',
        SingleFeed:'feedView/:id',
        Home:'home/',
        Comments:'feedComment/:id',
        VoucherDetails:'voucher/:code'
    }
}

const linking={
    prefixes:["marketplussv://","mppartner://",'http://vendor.marketpluss.com', 'https://vendor.marketpluss.com'],
    config,
};

export default linking