(function(){

    var Mods = App.mods;
    var Config = App.config;

    var positionSearchCls = Ext.extend( Ext.Panel, {

        html: '<div class="location-map"></div>',
        initComponent: function (){

            var that = this;

            that.address = '';
            that.latlng = {};

            // 用于记录所有的marker
            this.markers = [];
            // 用于记录搜有的infoWindow
            this.infoWindows = [];

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

                                    that.goBack();
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

                                    var address = that.searchField.getValue();

                                    if( address ){

                                        that.setLoading( true );

                                        Mods.map.geocode( { address: address }, function ( err, results ){

                                            // 先清楚所有的点
                                            that.clearMap();

                                            that.setLoading( false );
                                            if( err ){

                                                Ext.Msg.alert( '搜索位置信息出错：' + JSON.stringify( err ) );
                                            }
                                            else {

                                                if( results.length > 0 ){

                                                    var latlngs = [];
                                                    var bound;

                                                    console.log( results );

                                                    Ext.each( results, function ( result ){

                                                        that.addPosition( result.address, result.location );
                                                        latlngs.push( result.location );
                                                    });

                                                    alert( results.length );
                                                    // 获取包含所有结果的bound
                                                    bound = Mods.map.getBoundsByLocations( latlngs );

                                                    // 使地图自适应bound
                                                    that.map.fitBounds( bound );
                                                }
                                                else {

                                                    Ext.Msg.alert( '为找到任何匹配结果!' );
                                                }

                                            }
                                        });
                                    }
                                    else {

                                        Ext.Msg.alert( '关键词不能为空!' );
                                    }
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

                this.mapDiv = this.body.query( '.location-map' )[ 0 ];
                this.searchField = this.query( 'searchfield' )[ 0 ];
            },

            activate: function (){

                var that = this;
                var fakePostion = [30.23304355,120.03763513000001];

                if( !that.map ){

                    that.map = new google.maps.Map( that.mapDiv, {
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                }

//                this.map.setCenter( new google.maps.LatLng( fakePostion[ 0 ], fakePostion[ 1 ] ) );

                this.searchCurrentPosition();
            }
        },

        searchCurrentPosition: function (){

            this.setLoading( true );
            var that = this;

            Mods.map.getCurrentLatLng(function ( err, latlng ){

                that.setLoading( false );

                if( err ){

                    Ext.Msg.alert( err + ' 您可以手动搜索位置!' );
                }
                else {

                    var position = new google.maps.LatLng( latlng.lat, latlng.lng );

                    that.map.setCenter( position );

                    // 其中resultLatLng为 google Map的 LatLng对象
                    Mods.map.geocode( { latLng: position }, function ( err, address, resultLatLng ){

                        if( err ){

//                            Ext.Msg.alert( err );
                            alert( err );
                        }
                        else {

                            that.map.setZoom( 12 );

                            that.addPosition( address, resultLatLng );
                            that.address = address;
                            that.latlng = resultLatLng;
                        }
                    });
                }
            });
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
        sendPositionBack: function ( address, latlngUrl ){

            Mods.route.redirect( this.targetHash + '/' + address + '/' + latlngUrl );
        },

        /**
         * 清理地图上的masker 和 infoWindow
         */
        clearMap: function (){

            // 清理所有的 masker 和 infoWindow
            Ext.each( this.markers, function ( masker ){

                masker.setMap( null );
            });

            Ext.each( this.infoWindows, function ( infoWindow ){

                infoWindow.close();
            });

            this.markers = [];
            this.infoWindows = [];
        },

        closeAllInfoWindow: function (){

            Ext.each( this.infoWindows, function ( infoWindow ){

                infoWindow.close();
            });
        },

        /**
         * 创建一个新的marker，添加进this.markers 并返回
         * @param options
         * @return {google.maps.Marker}
         */
        addMarker: function ( options ){

            var newMarker = new google.maps.Marker( options );
            this.markers.push( newMarker );

            return newMarker;
        },

        /**
         * 添加一个新的infowindow，添加进this.infoWindows中，并返回
         * @param options
         * @return {google.maps.InfoWindow}
         */
        addInfoWindow: function ( options ){

            var newInfoWindow = new google.maps.InfoWindow( options );
            this.infoWindows.push( newInfoWindow );

            return newInfoWindow;
        },

        /**
         * 在地图上添加一个地点
         * @param {String} address
         * @param {LatLng} google map 的 LatLng对象
         */
        addPosition: function ( address, resultLatLng ){

            var newMarker = this.addMarker({
                position: resultLatLng,
                title:"您所在的位置"
            });

            var infoNode = Mods.dom.create( '<div class="position-info-win"><p>' + address + '</p><p class="set-my-pos">设为我的位置!</p></div>' );
            var newInfoWin = this.addInfoWindow({
                content: infoNode,
                position: resultLatLng
            });

            var that = this;

            // 为消息窗口添加点击事件
            Ext.EventManager.addListener( Ext.get( infoNode ).query( '.set-my-pos')[ 0 ], 'click', function (){

                Ext.Msg.confirm( '', '设置: ' + address + ' 为我的当前位置?', function ( result ){

                    // 若选择是，则设置当前地址，并返回到上一个页面
                    if( result === 'yes' ){

                        that.address = address;
                        that.latlng = resultLatLng;

                        that.goBack();
                    }
                });
            } );

            // sencha touch 1.1 在 google maps api >= 3.4 的bug（click无效），配合map.marker.click.fix.js 并改为mouseup
            google.maps.event.addListener( newMarker, 'mouseup', function (){

                // 先关掉所有的infoWindow
                that.closeAllInfoWindow();
                newInfoWin.open( that.map, newMarker );
            });

            newMarker.setMap( this.map );
        },

        /**
         * 返回到上一视图
         */
        goBack: function (){

            var latlngUrlValue = this.latlng.toUrlValue ? this.latlng.toUrlValue() : '';
            this.sendPositionBack( this.address, latlngUrlValue );
            this.clearMap();
        }
    });

    Ext.reg( 'positionSearch', positionSearchCls );
})();