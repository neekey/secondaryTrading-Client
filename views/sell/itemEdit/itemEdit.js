(function(){

    var Mods = App.mods;
    var Config = App.config;

    var itemEditCls = Ext.extend( Ext.Panel, {

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        // 当前显示商品的id
        itemId: '',
        // 当前的商品信息
        itemInfo: {},

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '商品编辑',
                        items: [
                            {
                                text: '返回',
                                ui: 'back',
                                handler: function() {
                                    Ext.redirect( 'sell/sellList' );
                                }
                            },
                            { xtype: 'spacer' },
                            {
                                text: '保存',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                }
                            },
                            {
                                text: '删除',
                                ui: 'decline',
                                align: 'end',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ]
            });

            itemEditCls.superclass.initComponent.call( this );
        },

        items: [
            { xtype: 'newItemForm' },
            { xtype: 'locationButton' },
            { xtype: 'imgEdit' }
        ],

        listeners: {
            afterRender:function (){

                this.imgEdit = this.query( 'imgEdit' )[ 0 ];
//                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
//                this.newItemLocation = this.query( 'locationButton' )[ 0 ];
            },
            activate: function (){

                this.fetch();
            }
        },

        itemDataHandle: function ( formData, location, pics ){

            var data = {
                title: formData.title,
                desc: formData.desc,
                price: formData.price,
                latlng: location.latlng,
                address: location.address,
                pic1: pics[ 0 ],
                pic2: pics[ 1 ],
                pic3: pics[ 2 ]
            };

            return data;
        },

        setItemId: function ( itemId ){

            this.itemId = itemId;
        },

        setItemInfo: function ( itemInfo ){

//            this.setItemId( itemInfo._id );
            this.itemInfo = itemInfo;
        },

        renderItem: function (){

            var itemInfo = this.itemInfo;
            this.imgEdit.setImages( itemInfo.imgs );
        },

        /**
         * 根据商品id请求数据
         */
        fetch: function (){

            var that = this;
            var itemId = this.itemId;

            this.setLoading( true );
            Mods.itemRequest.getItemById( itemId, function ( err, item ){

                if( err ){

                    Ext.Msg.alert( '获取商品信息失败! ' + err );
                }
                else {

                    that.setItemInfo( item );
                    that.renderItem();
                }

                that.setLoading( false );
            });

        }
    });

    Ext.reg( 'itemEdit', itemEditCls );
})();
