(function(){

    var Mods = App.mods;




    var locationButtonCls = Ext.extend( Ext.Button, {
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'confirm',
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

        /**
         * 设置当前按钮的 locationInfo 并更新按钮文字
         * @param locationInfo
         */
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
                html: '<div class="location-map"></div>',
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


                                }
                            }
                        ]
                    }
                ]
            });

            locationOverlayCls.superclass.initComponent.call( this );

        },
        floating: true,
        draggable: false,
        modal: true,
        centered: true,
        width: Ext.is.Phone ? '70%' : 700,
        height: Ext.is.Phone ? '70%' : 600,
//        styleHtmlContent: true,

//        items: [
//            {
//                xtype: 'locationResultList'
//            }
//        ],

        listeners: {

            afterRender: function (){

                this.mapDiv = this.body.query( '.location-map' )[ 0 ];
                var that = this;

                that.map = new google.maps.Map( that.mapDiv, {
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });



                function codeAddress() {
                    var address = document.getElementById("address").value;
                    geocoder.geocode( { 'address': address}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                        } else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
                }
            },

            addressSelected: function ( address ){

                this.hide();
            },

            show: function (){

                var that = this;
                var fakePostion = [30.2329954, 120.0376216];

                Mods.map.getCurrentLatLng(function ( err, latlng ){

                    if( err ){

                        Ext.Msg.alert( err );
                    }
                    else {

                        var position = new google.maps.LatLng( latlng.lat, latlng.lng );
                        var currentMarker = new google.maps.Marker({
                            position: position,
                            title:"Hello World!"
                        });

                        var infowindow = new google.maps.InfoWindow();

                        if( !that.map ){

                            that.map = new google.maps.Map( that.mapDiv, {
                                zoom: 16,
                                center: position,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });
                        }
                        else {

                            that.map.setCenter( position );

                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({'latLng': position }, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    if (results[1]) {
                                        that.map.setZoom(11);
                                        infowindow.setContent(results[0].formatted_address);
                                        infowindow.open(that.map, currentMarker);
                                    }
                                } else {
                                    Ext.Msg.alert("Geocoder failed due to: " + status);
                                }
                            });
//                            currentMarker.setMap( that.map );
                        }
                    }
                });
            }
        }
//        scroll: 'vertical'
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
