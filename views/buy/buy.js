(function(){

    var BuyMainCls = App.views.buyMain = Ext.extend( Ext.Panel, {
        title: '我要买',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4'
    });

    Ext.reg( 'buy', BuyMainCls );
})();
