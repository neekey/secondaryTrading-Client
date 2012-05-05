(function(){

    var SellMenuCls = App.views.sellMenu = Ext.extend( Ext.Panel, {

        id: 'wannaSell-index',
        defaults: {
            xtype: 'button',
            cls  : 'demobtn',
            height: '50',
            margin: '0 0 10 0'
        },
        items: [
            {
                ui  : 'action',
                text: '添加新商品',
                handler: function(){

                    Ext.redirect( 'sell/newItem' );
                }
            },
            {
                ui  : 'action',
                text: '出售中的商品',
                handler: function (){

                    Ext.redirect( 'sell/sellList' );
                }
            }
        ],
        dockedItems: [

        ]
    });

    Ext.reg( 'sellMenu', SellMenuCls );
})();
