(function(){

    var SellMainCls = App.views.sellMain = Ext.extend( Ext.Panel, {
        title: '我要卖',
        iconCls: 'compose',
        layout: 'card',
        cls: 'card2',
//        badgeText: '4',
        items: [
            {
                xtype: 'sellMenu'
            },
            {
                xtype: 'newItem'
            },
            {
                xtype: 'positionSearch',
                scroll: false
            },
            {
                xtype: 'sellingList'
            },
            {
                xtype: 'itemEdit'
            }
        ]
    });

    Ext.reg( 'sell', SellMainCls );
})();
