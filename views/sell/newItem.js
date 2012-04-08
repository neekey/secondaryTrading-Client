(function(){

    var NewItemCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

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

//                                     Ext.Msg.alert( JSON.stringify( that.newItemImg.getImageUrl() ) );
                                }
                            }
                        ]
                    }
                ]
            });

            NewItemCls.superclass.initComponent.call( this );
        },

//        layout: 'fit',
        items: [
            { xtype: 'newItemForm' },
            { xtype: 'newItemLocation' },
            { xtype: 'newItemImg' }
//            submitSellConfig
        ],
        listeners: {
            afterRender:function (){

                this.newItemImg = this.query( 'newItemImg' )[ 0 ];
                this.newItemForm = this.query( 'newItemFrorm' )[ 0 ];
                this.newItemLocation = this.query( 'newItemLocation' )[ 0 ];
            }
        }
    });

    Ext.reg( 'newItem', NewItemCls );
})();
