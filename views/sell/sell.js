(function(){

    var SellMainCls = App.views.sellMain = Ext.extend( Ext.Panel, {
        title: '我要卖',
        iconCls: 'organize',
        layout: 'card',
        cls: 'card2',
        badgeText: '4',
        items: [
            {
                xtype: 'sellMenu'
            },
            {
                xtype: 'newItem'
            },
            {
                xtype: 'sellingList'
            },
            {
                xtype: 'itemEdit'
            }
        ]
//        layout: 'auto',
//        scroll: 'vertical'
    });

    Ext.reg( 'sell', SellMainCls );
})();
