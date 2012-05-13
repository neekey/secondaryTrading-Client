(function(){

    var Mods = App.mods;
    var Config = App.config;

    var SellingList = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '正在出售的商品',
                        items: [
                            {
                                xtype: 'goBackButton'
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'resultList'
                    }
                ]
            });

            SellingList.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',

        listeners: {
            afterRender:function (){

                var that = this;

                this.resultList = this.query( 'resultList')[ 0 ];

                this.resultList.addListener( 'itemTaped', function ( item ){
                    that.fireEvent( 'itemTaped', item );
                });

            },
            itemTaped: function ( item ){

                Mods.route.redirect( 'sell/edit/' + item.getAttribute( 'data-id' ) );
            }
        },

        getSellingItem: function (){

            var that = this;

            this.setLoading( true );
            Mods.itemRequest.getSellingItem(function ( err, items ){

                if( err ){

                }
                else {

                    that.resultList.clearList();
                    that.resultList.insertItem( items );
                }

                that.setLoading( false );
            });
        }
    });

    Ext.reg( 'sellingList', SellingList );
})();
