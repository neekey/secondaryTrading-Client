(function(){

    var NewItemCls = Ext.extend( Ext.Panel, {

//        layout: 'fit',
        items: [
            { xtype: 'newItemForm' },
            { xtype: 'newItemLocation' },
            { xtype: 'newItemImg' }
//            submitSellConfig
        ],
        listeners: {

        },
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '新商品',
                items: [
                    {
                        text: '返回',
                        ui: 'back',
                        handler: function() {
                            Ext.redirect( 'main/sell' );
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        text: '发布',
                        ui: 'confirm',
                        align: 'end',
                        handler: function (){

                        }
                    }
                ]
            }
        ]
    });

    Ext.reg( 'newItem', NewItemCls );
})();
