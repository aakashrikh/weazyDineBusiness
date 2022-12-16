const config={
    screens:{
        Offers:'offerdetails/:offer_id',
        Home:'home/',
        VoucherDetails:'orderdetails/:code',
        Wallet:'ViewTransaction',
        TableView:'ViewTableOrder/:table_uu_id',
    }
}

const linking={
    prefixes:['http://pos.myweazy.com', 'https://pos.myweazy.com'],
    config,
};

export default linking