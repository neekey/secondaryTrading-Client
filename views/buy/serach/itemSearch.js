(function(){

    var Mods = App.mods;
    var Config = App.config;

    var SearchCls = Ext.extend( Ext.Panel, {

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',

        html: '<div class="location-map"></div>',

        // 地图类型搜索结果相关数据
        mapResult: {

            // 地图对象
            map: undefined,
            markers: [],
            infoWindows: [],
            // 每个infoWindow中商品信息模板
            tpl: undefined,
            // 所有的结果中的LatLng对象
            resultLatLngs: [],
            // 所有的结果
            results: []
        },

        // 当前结果呈现类型 'list' || 'map'
        currentResultType: 'list',

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '商品搜索'
                    }
                ],
                items: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                            items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: '输入你需要的商品',
                                width: '50%'
                            },
                            {
//                                text: '搜索',
                                ui: 'confirm',
                                align: 'end',
                                width: '20%',
                                iconCls: 'search',
                                iconAlign: 'top',
                                iconMask: true,
                                handler: function (){

                                    var keyword = that.searchField.getValue();
                                    var data = undefined;

                                    if( keyword ){

                                        data = {
                                            title: keyword
//                                            desc: keyword 暂时进搜索标题
                                        };

                                        that.setLoading( true );

                                        Mods.itemRequest.query( data, function ( err, data ){

                                            that.setLoading( false );

                                            if( err ){

                                                Ext.Msg.alert( '获取商品信息失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
                                            }
                                            else {

                                                // 若结果为空，则提示
                                                if( data.items.length === 0 ){

                                                    Ext.Msg.alert( '抱歉!', '没有找到匹配的商品' );
                                                }

                                                // 清空地图和结果列表
                                                that.resultList.clearList();
                                                that.resultList.removeAll();
                                                that.clearMap();
                                                // 保存数据
                                                that.resultList.saveItems( data.items );
                                                that.saveMapResults( data.items );
                                                // 保存所有的结果ids，在获取更多结果中需要使用到
                                                that.resultList.saveResultIds( data.ids );

                                                // 若当前为list类型
                                                if( that.currentResultType === 'list' ){

                                                    // 渲染
                                                    that.resultList.renderItems();

                                                    // 若结果已经全部展示出来，则隐藏获取更多商品按钮
                                                    if( data.items.length >= data.ids.length ){

                                                        that.getMoreResultBtn.hide();
                                                    }
                                                    else {
                                                        that.getMoreResultBtn.show();
                                                    }
                                                }
                                                // 若为map类型
                                                else if( that.currentResultType === 'map' ){

                                                    that.renderMapResults();
                                                }

                                                that.onResize();
                                                that.doLayout();
                                            }
                                        });
                                    }
                                    else {

                                        Ext.Msg.alert( '关键词不能为空!' );
                                    }
                                }
                            },
                            {
                                xtype: 'button',
//                                text: '定位',
                                width: '20%',
                                ui: 'action',
                                iconAlign: 'top',
                                iconCls: 'settings',
                                iconMask: true,

                                handler: function (){

                                    that.listStyleMenu.show();
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'resultList'
                    },
                    {
                        xtype: 'button',
                        text: '查看更多结果',
                        handler: function (){

                            var moreIds = that.resultList.getMoreResultIds();
                            var buttonSelf = this;

                            if( moreIds.length > 0  ){

                                buttonSelf.setText( '数据加载中...' );
                                buttonSelf.setDisabled( true );

                                Mods.itemRequest.getItemsByIds( moreIds, function ( err, items ){

                                    that.resultList.saveItems( items );
                                    that.renderItems( items );
                                    that.doLayout();

                                    if( that.resultList.getMoreResultIds().length <= 0 ){

                                        buttonSelf.hide();
                                    }

                                    buttonSelf.setText( '查看更多结果...' );
                                    buttonSelf.setDisabled( false );

                                });
                            }
                            else {

                                Ext.Msg.alert( '没有更多匹配的结果' );
                                this.hide();
                            }
                        }
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

        listeners: {
            afterRender:function (){

                var that = this;

                this.mapDiv = this.body.query( '.location-map' )[ 0 ];
                this.resultList = this.query( 'resultList')[ 0 ];
                this.searchField = this.query( 'searchfield' )[ 0 ];
                this.getMoreResultBtn = this.query( 'button' )[ 0 ];

                // 默认隐藏
                this.getMoreResultBtn.hide();

                this.resultList.addListener( 'itemTaped', function ( item ){
                    that.fireEvent( 'itemTaped', item );
                });

                // 结果呈现类型选择菜单
                this.listStyleMenu = new Ext.ActionSheet({
                    exitAnimation: 'fade',
                    items: [
                        {
                            text: '地图视图',
                            ui  : 'action',
                            iconAlign: 'top',
                            iconCls: 'maps',
                            iconMask: true,
                            handler: function (){

                                that.switchToMapStyle();
                                that.listStyleMenu.hide();

                            }
                        },
                        {
                            text: '列表视图',
                            handler: function (){

                                that.switchToListStyle();
                                that.listStyleMenu.hide();
                            }
                        },
                        {
                            text: '取消',
                            ui  : 'confirm',
                            handler: function (){

                                that.listStyleMenu.hide();
                            }
                        }
                    ]
                });

                this.listStyleMenu.hide();

            },
            itemTaped: function ( item ){

                Mods.route.redirect( 'buy/detail', [ item.getAttribute( 'data-id' ) ] );
            },
            // 当窗口尺寸改变
            afterlayout: function (){

            }
        },

        // 转换为 地图 视图
        switchToMapStyle: function (){

            this.currentResultType = 'map';

            this.resultList.hide();
            this.getMoreResultBtn.hide();

            if( !this.mapResult.map ){

                this.mapResult.map = new google.maps.Map( this.mapDiv, {
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            // 动态调整mapDiv的高度
            Ext.get( this.mapDiv ).setHeight( this.body.getHeight() );
            Ext.get( this.mapDiv ).show();

            // 设置不可滚动
            this.setScrollable( false );
            // 由于mapDiv被hidden过，因此google map在其show之后需要重新计算地图的显示尺寸
            // 因此需要出发google提供的事件接口
            google.maps.event.trigger(this.mapResult.map, 'resize');

            // 将结果显示在map中
            this.renderMapResults();
        },

        // 转化到 列表 视图
        switchToListStyle: function (){

            this.currentResultType = 'list';
            this.setScrollable( {
                direction: 'vertical'
            } );
            Ext.get( this.mapDiv ).hide();
            this.resultList.show();
            this.getMoreResultBtn.show();
            this.resultList.renderItems();

            this.doLayout();
        },

        // 将结果显示在地图中
        renderMapResults: function (){

            var that = this;

            // 若没有结果，则什么也不做
            if( this.mapResult.results && this.mapResult.results.length > 0 ){

                Ext.each( this.mapResult.results, function ( item ){

                    that.addPosition( item );
                });

                var bound = Mods.map.getBoundsByLocations( this.mapResult.resultLatLngs );
                this.mapResult.map.fitBounds( bound );
            }
        },

        // 保存结果，以便后期渲染
        saveMapResults: function ( items ){

            if( !Ext.isArray( items ) ){

                items = [ items ];
            }

            this.mapResult.results = this.mapResult.results.concat( items );
        },

        /**
         * 清理地图上的masker 和 infoWindow
         */
        clearMap: function (){

            // 清理所有的 masker 和 infoWindow
            Ext.each( this.mapResult.markers, function ( masker ){

                masker.setMap( null );
            });

            Ext.each( this.mapResult.infoWindows, function ( infoWindow ){

                infoWindow.close();
            });

            this.mapResult.markers = [];
            this.mapResult.infoWindows = [];
            this.mapResult.resultLatLngs = [];
            this.mapResult.results = [];
        },

        /**
         * 关闭所有的infoWindow
         */
        closeAllInfoWindow: function (){

            Ext.each( this.mapResult.infoWindows, function ( infoWindow ){

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
            this.mapResult.markers.push( newMarker );

            return newMarker;
        },

        /**
         * 添加一个新的infowindow，添加进this.infoWindows中，并返回
         * @param options
         * @return {google.maps.InfoWindow}
         */
        addInfoWindow: function ( options ){

            var newInfoWindow = new google.maps.InfoWindow( options );
            this.mapResult.infoWindows.push( newInfoWindow );

            return newInfoWindow;
        },

        /**
         * 在地图上添加一个地点
         * @param {String} address
         * @param {LatLng} google map 的 LatLng对象
         */
        addPosition: function ( item ){

            if( !this.mapResult.tpl ){

                this.mapResult.tpl = new Ext.Template( Ext.get( 'map-result-item-tpl').getHTML() );
            }

            if( !this.mapResult.map ){

                debugger;
                this.mapResult.map = new google.maps.Map( this.mapDiv, {
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            // location 从服务器中获取到的是 [ longitude, latitude ] 但是google的顺序是 ( latitude, longitude )
            var itemLatlng = new google.maps.LatLng( item.location[ 1 ], item.location[ 0 ] );

            this.mapResult.resultLatLngs.push( itemLatlng );

            var newMarker = this.addMarker({
                position: itemLatlng,
                title:"您所在的位置"
            });

            var infoNode = Mods.dom.create( '<div class="result-info-win"></div>' );
            this.mapResult.tpl.append( infoNode, this.itemInfoHandle( item ) );
            var newInfoWin = this.addInfoWindow({
                content: infoNode,
                position: itemLatlng
            });

            var that = this;

            // 为消息窗口添加点击事件
            Ext.EventManager.addListener( Ext.get( infoNode ).query( '.map-result-item')[ 0 ], 'click', function (){
                that.switchToListStyle();

                Mods.route.redirect( 'buy/detail', [ item._id ] );
            } );

            // sencha touch 1.1 在 google maps api >= 3.4 的bug（click无效），配合map.marker.click.fix.js 并改为mouseup
            google.maps.event.addListener( newMarker, 'mouseup', function (){

                // 先关掉所有的infoWindow
                that.closeAllInfoWindow();
                newInfoWin.open( that.mapResult.map, newMarker );
            });

            newMarker.setMap( this.mapResult.map );
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

    Ext.reg( 'itemSearch', SearchCls );
})();
