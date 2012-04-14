(function(){

    var Mods = App.mods;
    var Config = App.config;

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

                                    // 若为在浏览器中调试，则使用测试数据
                                    var pics = Config.IF_DEVICE ? that.newItemImg.getImageUrl() : [
                                        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi4Kz/ARBgAAIVAYFMFtU7AAAAAElFTkSuQmCC',
                                        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi6OXhAQgwAAHPAKaGfcCLAAAAAElFTkSuQmCC'
                                    ];

                                    var location = that.newItemLocation.getLocation();
                                    var formData = that.newItemForm.getValues();

                                    var data = that.itemDataHandle( formData, location, pics );
                                    var model = Ext.ModelMgr.create( data, 'Item' );
                                    var errors = model.validate();
                                    var message = "";

//                                    console.log( data );
                                    if( errors.isValid() ){

                                        Mods.request.send({
                                            method: 'post',
                                            data: data,
                                            type: 'NEW_ITEM',
                                            callback: function ( d ){

                                                var resData = d.data;
                                                var result = resData.result;
                                                var itemId;
                                                console.log( 'response',d );

                                                if( result ){
                                                    itemId = resData.data.itemId;
                                                    Ext.Msg.alert( '商品添加成功' );
                                                }
                                                else {
                                                    Ext.Msg.alert( '商品添加失败！', resData.error );
                                                }
                                            }
                                        }, true );
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

//        layout: 'fit',
        items: [
            { xtype: 'newItemForm' },
//            { xtype: 'newItemLocation' },
            { xtype: 'locationButton' },
            { xtype: 'newItemImg' }
//            submitSellConfig
        ],
        listeners: {
            afterRender:function (){

                this.newItemImg = this.query( 'newItemImg' )[ 0 ];
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'locationButton' )[ 0 ];
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
        }
    });

    Ext.reg( 'newItem', NewItemCls );
})();
