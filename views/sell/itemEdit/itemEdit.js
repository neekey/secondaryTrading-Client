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
        // 当前是否处于获取位置的状态
        isSearchLocation: false,

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

                                        that.setLoading( true );

                                        Mods.itemRequest.updateItem( that.itemId, data, function ( errObj ){

                                            that.setLoading( false );

                                            if( !errObj ){

                                                Ext.Msg.alert( '修改商品成功!' );
                                            }
                                            else {

                                                Ext.Msg.alert( '修改商品失败! ', ( errObj.error || '' ) + ( JSON.stringify( errObj.data ) || '' ) );
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

                                    that.setLoading( true );

                                    Mods.itemRequest.delItem( itemId, function ( err ){

                                        that.setLoading( false );

                                        if( !err ){

                                            Ext.Msg.alert( '商品删除成功!', '将回到商品列表', function (){
                                                // 若删除成功，返回列表
                                                Mods.route.redirect( 'sell/sellList' );
                                            } );
                                        }
                                        else {

                                            Ext.Msg.alert( '商品删除失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
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
            {
                xtype: 'categorySelect',
                ifUseSaveBtn: false,
                title: '设置商品类别<span class="title-desc">（买家能通过类别更好地定位到你的商品）</span>',
                margin: '30% 10%'
            },
            { xtype: 'myProfileLocation' },
            { xtype: 'imgEdit' }
        ],

        listeners: {
            afterRender:function (){

                var that = this;

                this.imgEdit = this.query( 'imgEdit' )[ 0 ];
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.categorySelect = this.query( 'categorySelect' )[ 0 ];

                // 若定位按钮被点击，就会触发该事件
                this.newItemLocation.addListener( 'searchLocation', function (){

                    that.isSearchLocation = true;
                });
            },
            activate: function (){

                if( this.isSearchLocation === false ){

                    this.fetch();
                }
                else {

                    this.isSearchLocation = false;
                }
            }
        },

        /**
         * 获取相对原有商品信息的变更
         * @return {Object}
         */
        getUpdateInfo: function (){

            // 若为在浏览器中调试，则使用测试数据
            var location = this.newItemLocation.getLocationInfo();
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
                address: location.address,
                category: this.categorySelect.getCategory()
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
         * 设置位置部分的内容
         * @param address
         * @param latlng
         */
        setLocationInfo: function ( address, latlng ){

            this.newItemLocation.setLocationInfo( { address: address, latlng: latlng } );
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
            // 设置分类信息
            this.categorySelect.setCategory( itemInfo.category || '' );
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

                    Ext.Msg.alert( '获取商品信息失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
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
