(function(){


    var Mods = App.mods;
    // 1. list 部分的点击响应时间
    // 2. 默认自动查找地理位置
    // 3. 搜索功能
    // 4. 结果保存
    var locationButtonCls = Ext.extend( Ext.Button, {
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'decline',
        text: '为商品定位',
        margin: '0 15% 0 15%',
        location: {
            // 测试数据 todo 去掉测试数据
            latlng: '12,32',
            address: '32'
        },
        // 是否已经自动获取过当前位置
        ifAutoLocation: false,
        handler: function(){

            this.overlay.show();
        },

        /**
         * 请求位置信息
         * @param address 用户输入的搜索词
         * @param next( err, addressObj )
         */
        requestLocation: function ( address, next ){

            if( address ){

                Mods.map.getAR( address, next );
            }
            else {

                Mods.map.getCurrentLocation(function ( ifSuccess, result ){

                    next( ifSuccess, result );
                });
            }
        },

        setLocationInfo: function ( locationInfo ){

            this.location = {
                latlng: locationInfo.latlng,
                address: locationInfo.address
            };

            this.setText( this.location.address );
        },

        /**
         * 保存位置信息
         * @param location
         */
        saveLocation: function ( location ){

            this.location = location;

            this.fireEvent( 'locationChanged' );
        },

        /**
         * 获取位置信息
         * @return {*}
         */
        getLocation: function (){

            return this.location;
        },

        listeners: {
            afterRender: function (){

                var that = this;

                this.overlay = Ext.ComponentMgr.create({
                    xtype: 'locationOverlay'
                });

                this.overlay.locationButton = this;

                // 绑定当一个结果项被选中的事件
                this.overlay.addListener( 'addressSelected', function ( location ){

                    that.saveLocation( location );
                    this.hide();

                    console.log( that.getLocation());
                });


                this.overlay.addListener( 'show', function (){

                    // 若第一次，则自动请求当前位置
                    if( !that.ifAutoLocation ){

                        that.overlay.setLoading( true );

                        that.requestLocation( undefined, function ( ifSuccess, result ){

                            that.overlay.setLoading( false );

                            that.ifAutoLocation = true;
                            that.overlay.addressList.refreshResult( result );
                        });
                    }
                    else {

                        that.overlay.setLoading( false );
                    }
                });

                this.overlay.hide();
            },

            /**
             * 若locatioin信息改变，修改按钮上的文字
             */
            locationChanged: function (){

                var location = this.getLocation();

                this.setText( location.address );
            }
        }
    });

    Ext.reg( 'locationButton', locationButtonCls );

    /**
     * Overlay
     */
    var locationOverlayCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        doc: 'top',
                        items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: 'Search',
                                name: 'searchfield',
                                width: '60%'
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                ui: 'confirm',
                                text: '搜索',
                                handler: function (){

                                    var address = that.searchfield.getValue();

                                    if( address ){

                                        that.setLoading( true );

                                        that.locationButton.requestLocation( address, function ( ifSuccess, result ){

                                            that.setLoading( false );
                                            that.addressList.refreshResult( result );
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            });

            locationOverlayCls.superclass.initComponent.call( this );

        },
        floating: true,
        draggable: true,
        modal: true,
        centered: true,
        width: Ext.is.Phone ? 300 : 400,
        height: Ext.is.Phone ? '70%' : 400,
        styleHtmlContent: true,

        items: [
            {
                xtype: 'locationResultList'
            }
        ],

        listeners: {

            afterRender: function (){

                var that = this;

                this.addressList = this.query( 'locationResultList' )[ 0 ];
                this.addressList.addListener( 'addressSelected', function ( location ){

                    that.fireEvent( 'addressSelected', location );
                });

                this.searchfield = this.query( 'searchfield' )[ 0 ];
            },

            addressSelected: function ( address ){

                this.hide();
            }
        },
        scroll: 'vertical',
        cls: 'htmlcontent'
    });

    Ext.reg( 'locationOverlay', locationOverlayCls );

    // 列表数据模型
    Ext.regModel( 'LocationResult', {
        fileds: [ 'address', 'latlng', 'formattedAddress' ]
    });

    /**
     * 返回一个以locationResult为模型的store实例对象
     * @return {*}
     */
    function getStore(){

        return new Ext.data.Store({
            model: 'LocationResult',
//            sorters: 'address',
//            getGroupString : function(record) {
//                return record.get('firstName')[0];
//            },
            data: [
                { address: 'd' },
                { address: 'b' },
                { address: 'c' }
            ]
        });
    }

    /**
     * 位置结果list
     */
    var locationResultListCls = Ext.extend( Ext.List, {

        initComponent: function (){
            Ext.apply( this, {
                store: getStore()
            });

            locationResultListCls.superclass.initComponent.call( this );
        },

        itemTpl: '{address}',

        refreshResult: function ( result ){

            result = this.resultHandle( result );
            this.store.loadData( result );
            this.refresh();
        },

        resultHandle: function ( result ){

            var formattedAddress = result.formattedAddress;
            var addressConponent = result.addressConponent;
            var latlng = location.lat + ',' + location.lng;

            var data = [];
            var index;
            var conponent;

            if( formattedAddress ){

                data.push({
                    address: formattedAddress,
                    latlng: latlng,
                    formattedAddress: formattedAddress
                });
            }

            if( addressConponent ){
                for( index = 0; conponent = addressConponent[ index ]; index++ ){

                    data.push({
                        address: conponent.long_name,
                        latlng: latlng,
                        formattedAddress: formattedAddress
                    });
                }
            }



            return data;
        },

        listeners: {
            afterRender: function (){
//                this.setLoading( true );
            },
            itemtap: function ( self, index ){


                var dataItem = self.store.getAt( index );
                var location;

                if( dataItem ){

                    location = {
                        address: dataItem.get( 'address' ),
                        latlng: dataItem.get( 'latlng' )
                    };
                }

                self.fireEvent( 'addressSelected', location );
            }
        }
    });

    Ext.reg( 'locationResultList', locationResultListCls );


})();
