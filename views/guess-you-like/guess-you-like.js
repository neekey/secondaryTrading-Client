(function(){

    var Mods = App.mods;

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

                // 解决偶尔地位位置有问题的情况
//                this.doLayout();

                var that = this;
                var fakePostion = [30.23304355,120.03763513000001];

                if( !that.map ){

                    that.map = new google.maps.Map( that.mapDiv, {
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                }

                if( !this.isAutoGetLocation ){

//                    this.searchCurrentPosition();
                }
            }
        },

        items: [
            {
                xtype: 'button',
                text: '获取推荐数据',
                handler: function (){

                    Mods.itemRequest.guessYouLike(function ( err, items ){

                        if( err ){

                            alert( '出错啦!' + JSON.stringify( err ) );
                        }
                        else {

                            console.log( items );
                            alert( JSON.stringify( items ) );
                        }
                    });
                }
            }
        ],

        /**
         * 获取用户的推荐数据
         */
        fetchYouLike: function (){


        },

        /**
         * 获取当前位置
         */
        searchCurrentPosition: function (){

            this.setLoading( true );
            var that = this;

            Mods.map.getCurrentLatLng(function ( err, latlng ){


                if( err ){

                    that.setLoading( false );
                    alert( err + ' 您可以手动搜索位置!' );
                }
                else {

                    var position = new google.maps.LatLng( latlng.lat, latlng.lng );
//                    获取当前位置，用于和推荐的搜有结果做bounds
                }
            });
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
        }
    });

    Ext.reg( 'guessYouLike', GuessYouLikeMainCls );
})();
