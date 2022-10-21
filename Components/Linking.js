const config={
    screens:{
        Offers:'offerdetails/:offer_id',
        Home:'home/',
        VoucherDetails:'orderdetails/:code',
        Wallet:'ViewTransaction',
        TableView:'tableorderdetails/:table_uu_id',
    }
}

const linking={
    prefixes:["weazydine://",'http://pos.myweazy.com', 'https://pos.myweazy.com'],
    config,
};

export default linking