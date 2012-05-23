(function(){

    var Mods = App.mods;
    var Config = App.config;

    var GuessYouLikeMainCls = App.views.GuessYouLikeMainCls = Ext.extend( Ext.Panel, {
        title: '猜你喜欢',
        iconCls: 'favorites',
        html: '<div class="location-map"></div>',
        initComponent: function (){

            var that = this;

            that.address = '';
            that.latlng = {};

            // 用于记录所有的marker
            this.markers = [];
            // 用于记录搜有的infoWindow
            this.infoWindows = [];
            // 是否已经自动获取过当前位置
            this.isAutoGetLocation = false;
            this.isAutoFetchItems = false;
            // 当前位置信息
            this.currentLocation = undefined;
            this.map = undefined;
            this.resutls = undefined;
            this.resultLatLngs = [];
            this.resultItemTpl = undefined;

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        title: '猜你喜欢',
                        items: [
                            { xtype: 'spacer' },
                            {
                                // 刷新按钮
                                xtype: 'button',
                                align: 'right',
                                ui: 'action',
                                iconCls: 'refresh',
                                iconAlign: 'top',
                                iconMask: true,
                                handler: function (){

                                    that.fetchYouLike();
                                }
                            }
                        ]
                    }
                ]
            });

            GuessYouLikeMainCls.superclass.initComponent.call( this );
        },

        listeners: {
            afterRender:function (){

                this.mapDiv = this.body.query( '.location-map' )[ 0 ];
                this.refreshBtn = this.query( 'button' )[ 0 ];
            },

            activate: function (){

                var that = this;
                var fakePostion = [30.23304355,120.03763513000001];

                if( !that.map ){

                    that.map = new google.maps.Map( that.mapDiv, {
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                }

                // 判断是否自动获取过地理位置
                if( !this.isAutoGetLocation ){

                    this.searchCurrentPosition(function (){

                        that.fetchYouLike();
                    });
                }
                else {

                    // 判断是否已经自动请求过 推荐 数据
                    if( !this.isAutoFetchItems ){

                        this.fetchYouLike();

                        this.isAutoFetchItems = true;
                    }
                }
            }
        },

        /**
         * 获取用户的推荐数据
         */
        fetchYouLike: function (){

            var location = this.currentLocation;
            var that = this;

            if( location ){

                location = [ location.longitude, location.latitude ].join( ',' );
            }

            this.setLoading( true );
            Mods.itemRequest.guessYouLike({ location: location }, function ( err, items ){

                that.setLoading( false );
                if( err ){

                    Ext.Msg.alert( '错误', err.error + JSON.stringify( err.data ) );
                }
                else {

                    that.results = items;
                    that.updateMap();
                }
            });
        },

        /**
         * 获取当前位置
         */
        searchCurrentPosition: function ( next ){

            this.setLoading( true );
            var that = this;

            // 先直接使用缓存
            var location = Mods.map.getCachedCurrentLocation();

            if( location ){

                that.setLoading( false );

                that.isAutoGetLocation = true;
                this.currentLocation = location;

                if( next ){

                    next();
                }
            }
            else {
                // 若缓存中不存在，则重新查询
                Mods.map.getCurrentLatLng(function ( err, latlng ){

                    that.setLoading( false );

                    that.isAutoGetLocation = true;

                    if( err ){

                        // 若失败，什么也不做，直接使用用户已经设置过的地理位置
                    }
                    else {

                        that.currentLocation = { latitude: latlng.lat, longitude: latlng.lng };
                    }

                    if( next ){

                        next();
                    }
                });
            }

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
            this.resutls = undefined;
            this.resultLatLngs = [];
        },

        /**
         * 更新地图中的结果
         */
        updateMap: function (){

            this.clearMap();
            var that = this;

            if( this.results && this.results.length > 0 ){

                Ext.each( this.results, function ( item ){

                    that.addPosition( item );
                });

                var currentLocationLatlng = new google.maps.LatLng( that.currentLocation.latitude, that.currentLocation.longitude );
                var bound = Mods.map.getBoundsByLocations( this.resultLatLngs.concat( [currentLocationLatlng]) );
                this.map.fitBounds( bound );
            }
            else {

                Ext.Msg( '抱歉!', '暂时木有可以推荐的商品~' );
            }
        },

        /**
         * 关闭所有的infoWindow
         */
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
        addPosition: function ( item ){

            if( !this.resultItemTpl ){

                this.resultItemTpl = new Ext.Template( Ext.get( 'map-result-item-tpl').getHTML() );
            }

            if( !this.map ){

                this.map = new google.maps.Map( this.mapDiv, {
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            // location 从服务器中获取到的是 [ longitude, latitude ] 但是google的顺序是 ( latitude, longitude )
            var itemLatlng = new google.maps.LatLng( item.location[ 1 ], item.location[ 0 ] );

            // 保存 latlng 对象
            this.resultLatLngs.push( itemLatlng );

            var newMarker = this.addMarker({
                position: itemLatlng,
                title:"您所在的位置"
            });

            var infoNode = Mods.dom.create( '<div class="result-info-win"></div>' );
            this.resultItemTpl.append( infoNode, this.itemInfoHandle( item ) );
            var newInfoWin = this.addInfoWindow({
                content: infoNode,
                position: itemLatlng
            });

            var that = this;

            // 为消息窗口添加点击事件
            Ext.EventManager.addListener( Ext.get( infoNode ).query( '.map-result-item')[ 0 ], 'click', function (){

                Mods.route.redirect( 'buy/detail', [ item._id ] );
            } );

            // sencha touch 1.1 在 google maps api >= 3.4 的bug（click无效），配合map.marker.click.fix.js 并改为mouseup
            google.maps.event.addListener( newMarker, 'mouseup', function (){

                // 先关掉所有的infoWindow
                that.closeAllInfoWindow();
                newInfoWin.open( that.map, newMarker );
            });

            newMarker.setMap( this.map );
        },

        itemInfoHandle: function ( item ){

            var imgs = item.imgs;
            var pic;

            if( imgs && imgs.length > 0 ){

                pic = Config.APIHOST + 'img?id=' + imgs[ 0 ][ '_id' ];
            }
            else {
                pic = undefined;
            }

            item.pic = pic;

            return item;
        }
    });

    Ext.reg( 'guessYouLike', GuessYouLikeMainCls );
})();
