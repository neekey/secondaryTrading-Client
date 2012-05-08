(function(){

    var Mods = App.mods;
    var Config = App.config;

    var positionSearchCls = Ext.extend( Ext.Panel, {

        html: '<div class="location-map"></div>',
        initComponent: function (){

            var that = this;

            that.address = '';
            that.latlng = {};
            that.geocoder = new google.maps.Geocoder();

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '定位',
                        items: [
                            {
                                text: '返回',
                                ui: 'back',
                                handler: function() {

                                    that.sendPositionBack( that.address, that.latlng );
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: '输入地点',
                                width: '75%'
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                text: '搜索',
                                ui: 'confirm',
                                align: 'end',
                                width: '20%',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ]
            });

            positionSearchCls.superclass.initComponent.call( this );
        },

        listeners: {
            afterRender:function (){

                var that = this;

                this.mapDiv = this.body.query( '.location-map' )[ 0 ];
                this.map = new google.maps.Map( that.mapDiv, {
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            },

            activate: function (){

                var that = this;
                var fakePostion = [30.2329954, 120.0376216];

                this.setLoading( true );

                Mods.map.getCurrentLatLng(function ( err, latlng ){

                    that.setLoading( false );

                    if( err ){

                        Ext.Msg.alert( err + ' 您可以手动搜索位置!' );
                    }
                    else {

                        var position = new google.maps.LatLng( latlng.lat, latlng.lng );
                        var currentMarker = new google.maps.Marker({
                            position: position,
                            title:"您所在的位置"
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
                            currentMarker.setMap( that.map );

                            Mods.map.geocode( { latLng: position }, function ( err, address, resultLatLng ){

                                if( err ){

                                    Ext.Msg.alert( err );
                                }
                                else {

                                    that.map.setZoom( 16 );
                                    infowindow.setContent( address );
                                    infowindow.open( that.map, currentMarker );

                                    that.address = address;
                                    that.latlng = resultLatLng;
                                }
                            });
                        }
                    }
                });
            }
        },

        /**
         * 设置目标视图对应的hash地址，也就是是从那个hash转变过来的
         * @param {String} hash
         */
        setTargetHash: function ( hash ){

            this.targetHash = hash;
        },

        /**
         * 将选定的位置信息送回到上一个视图（调用它的视图）
         * @param address
         * @param latlng { latitude: 111, longitude: 2341 }
         */
        sendPositionBack: function ( address, latlng ){

            Mods.route.redirect( this.targetHash + '/' + address + '/' + latlng.latitude + ',' + latlng.longitude );
        }
    });

    Ext.reg( 'positionSearch', positionSearchCls );
})();
