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
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'locationButton' )[ 0 ];
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

        itemInfoHandle: function ( itemInfo ){

            itemInfo.latlng = itemInfo.location.join( ',' );

            return itemInfo;
        },

        /**
         * 设置 itemId
         * @param itemId
         */
        setItemId: function ( itemId ){

            this.itemId = itemId;
        },

        /**
         * 将itemInfo 设置给 this.itemInfo
         * @param itemInfo
         */
        setItemInfo: function ( itemInfo ){

            this.itemInfo = itemInfo;
        },

        /**
         * 根据itemInfo对视图进行更新
         */
        renderItem: function (){

            var itemInfo = this.itemInfo;
            // 创建一个model 用于填写表单
            var model = Ext.ModelMgr.create( itemInfo, 'Item' );
            this.newItemForm.loadRecord( model );
            // 设置图像
            this.imgEdit.setImages( itemInfo.imgs );
            // 设置location信息
            this.newItemLocation.setLocationInfo( itemInfo );
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

                    // 对返回的数据进行一定的预处理后，设置给 itemInfo
                    that.setItemInfo( that.itemInfoHandle( item ) );
                    // 根据 itemInfo 的值 进行渲染
                    that.renderItem();
                }

                that.setLoading( false );
            });

        }
    });

    Ext.reg( 'itemEdit', itemEditCls );
})();
