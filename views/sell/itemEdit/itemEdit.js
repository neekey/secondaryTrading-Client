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
                                xtype: 'goBackButton'
                            },
                            { xtype: 'spacer' },
                            {
                                text: '保存',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                    var data = that.getUpdateInfo();
                                    var model = Ext.ModelMgr.create( data, 'Item' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        data.removeImgs = data.removeImgs.join( ',' );

                                        Mods.itemRequest.updateItem( that.itemId, data, function ( errObj ){

                                            if( !errObj ){

                                                Ext.Msg.alert( '修改商品成功!' );
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
                            },
                            {
                                text: '删除',
                                ui: 'decline',
                                align: 'end',
                                handler: function (){

                                    var itemId = that.itemId;
                                    Mods.itemRequest.delItem( itemId, function ( err ){

                                        if( !err ){

                                            Ext.Msg.alert( '商品删除成功!', '将回到商品列表', function (){
                                                // 若删除成功，返回列表
                                                Mods.route.redirect( 'sell/sellList' );
                                            } );
                                        }
                                    });
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

        /**
         * 获取相对原有商品信息的变更
         * @return {Object}
         */
        getUpdateInfo: function (){

            // 若为在浏览器中调试，则使用测试数据


            var location = this.newItemLocation.getLocation();
            var formData = this.newItemForm.getValues();
            var imgUpdate = this.imgEdit.getUpdateInfo();

            return {
                title: formData.title,
                desc: formData.desc,
                price: formData.price,
                addImgNum: imgUpdate.addImgs.length,
                removeImgs: imgUpdate.removeImgs,
                pic1: imgUpdate.addImgs[ 0 ],
                pic2: imgUpdate.addImgs[ 1 ],
                pic3: imgUpdate.addImgs[ 2 ],
                latlng: location.latlng,
                address: location.address
            };
        },

        /**
         * 对iteminfo 做一些预处理(通常在fetch到数据之后）
         * @param itemInfo
         * @return {*}
         */
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

                    if( item ){

                        // 对返回的数据进行一定的预处理后，设置给 itemInfo
                        that.setItemInfo( that.itemInfoHandle( item ) );
                        // 根据 itemInfo 的值 进行渲染
                        that.renderItem();
                    }
                    else {

                        Ext.Msg.alert( '该商品不存在!', '将回到商品列表', function (){

                            Mods.route.redirect( 'sell/sellList' );
                        });
                    }
                }

                that.setLoading( false );
            });

        }
    });

    Ext.reg( 'itemEdit', itemEditCls );
})();
