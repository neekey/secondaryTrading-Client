(function(){

    var BuyMainCls = App.views.buyMain = Ext.extend( Ext.Panel, {
        title: '我要买',
        iconCls: 'search',
        layout: 'card',
        cls: 'card2',
//        badgeText: '4',
        items: [
            {
                // 商品搜索
                xtype: 'itemSearch'
            },
            {
                // 商品详情
                xtype: 'itemDetail'
            }
        ]
    });

    Ext.reg( 'buy', BuyMainCls );
})();
