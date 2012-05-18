(function(){

    var Mods = App.mods;
    var Config = App.config;

    var NewItemCls = Ext.extend( Ext.Panel, {

        defaults: {
            margin: '30% 10%'
        },
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
                                xtype: 'goBackButton'
                            },
                            { xtype: 'spacer' },
                            {
                                text: '发布',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                    var data = that.getNewItemInfo();
                                    var model = Ext.ModelMgr.create( data, 'Item' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        that.setLoading( true );

                                        Mods.itemRequest.addItem( data, function ( ifSuccess, d ){

                                            that.setLoading( false );

                                            if( ifSuccess ){

                                                Ext.Msg.alert( '商品添加成功', '', function (){

                                                    Mods.route.redirect( 'sell/sellList' );
                                                });
                                            }
                                            else {
                                                Ext.Msg.alert( '商品添加失败！', ( d.error || '' ) + ( JSON.stringify(d.data) || ''), function (){

                                                    Mods.route.redirect( 'sell' );
                                                } );
                                            }
                                        });

                                    }
                                    else {
                                        Ext.each( errors.items, function( rec, i ){

                                            message += rec.message+"<br>";
                                        });

                                        Ext.Msg.alert( "表单有误：", message );

                                        return false;
                                    }

                                }
                            }
                        ]
                    }
                ]
            });

            NewItemCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            { xtype: 'newItemForm' },
            {
                xtype: 'categorySelect',
                ifUseSaveBtn: false,
                title: '设置商品类别<span class="title-desc">（买家能通过类别更好地定位到你的商品）</span>'
            },
            { xtype: 'myProfileLocation' },
            { xtype: 'newItemImg' }
        ],
        listeners: {
            afterRender:function (){

                this.newItemImg = this.query( 'newItemImg' )[ 0 ];
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.categorySelect = this.query( 'categorySelect' )[ 0 ];
            }
        },

        setLocationInfo: function ( address, latlng ){

            this.newItemLocation.setLocationInfo( {
                address: address,
                latlng: latlng
            });
        },

        getNewItemInfo: function (){

            // 若为在浏览器中调试，则使用测试数据
            var pics = Config.IF_DEVICE ? this.newItemImg.getImageUrl() : [
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi4Kz/ARBgAAIVAYFMFtU7AAAAAElFTkSuQmCC',
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi6OXhAQgwAAHPAKaGfcCLAAAAAElFTkSuQmCC'
            ];

            var location = this.newItemLocation.getLocationInfo();
            var formData = this.newItemForm.getValues();
            var category = this.categorySelect.getCategory();
            var data = {
                title: formData.title,
                desc: formData.desc,
                price: formData.price,
                latlng: location.latlng,
                address: location.address,
                pic1: pics[ 0 ],
                pic2: pics[ 1 ],
                pic3: pics[ 2 ],
                category: category
            };

            return data;
        }
    });

    Ext.reg( 'newItem', NewItemCls );
})();
