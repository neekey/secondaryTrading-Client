(function(){

    var Mods = App.mods;
    var SellMenuCls = App.views.sellMenu = Ext.extend( Ext.Panel, {

        id: 'wannaSell-index',
        defaults: {
            xtype: 'button',
            cls  : 'demobtn',
            height: 45,
            margin: '30% 10%'
        },
        scroll: false,
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '我是卖家'
            }
        ],
        items: [
            {
                ui  : 'confirm',
                text: '添加新商品',
                handler: function(){

                    Mods.route.redirect( 'sell/newItem' );
                }
            },
            {
                ui  : 'action',
                text: '出售中的商品',
                handler: function (){

                    Mods.route.redirect( 'sell/sellList' );
                }
            }
        ]
    });

    Ext.reg( 'sellMenu', SellMenuCls );
})();
