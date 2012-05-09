/**
 * 主界面视图
 */
(function(){

    var MainCls = App.views.main = Ext.extend( Ext.TabPanel, {

        tabBar: {
            dock: 'bottom',
            layout: {
                pack: 'center'
            }
        },
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade',
            cover: true
        },
        listeners: {
            afterrender: function(){
            }
        },
        items: [
            { xtype: 'sell' },
            { xtype: 'buy' },
            { xtype: 'profile' }
        ]
    });

    Ext.reg( 'main', MainCls );
})();/**
 * 整个界面的主视图
 */
(function(){

    App.views.Viewport = Ext.extend(Ext.Panel, {
        fullscreen: true,
        layout: 'card',
        cardSwitchAnimation: 'fade',
        items: [
            {
                xtype: 'welcome'
            },
            {
                xtype: 'main'
            }
        ]
//        dockedItems: [
//            {
//                xtype: 'toolbar',
//                title: 'MvcTouch'
//            }
//        ]
    });

    Ext.reg( 'viewport', App.views.Viewport );
})();
(function(){

    var BuyMainCls = App.views.buyMain = Ext.extend( Ext.Panel, {
        title: '我要买',
        iconCls: 'organize',
        layout: 'card',
        cls: 'card2',
        badgeText: '4',
        items: [
            {
                // 商品搜索
                xtype: 'itemSearch'
            },
            {
                // 商品详情
                xtype: 'itemDetail'
            }
        ]
    });

    Ext.reg( 'buy', BuyMainCls );
})();
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
/**
 * 图片获取组件
 */

(function(){

    var Mods = App.mods;

    var ImageCaptureCls = Ext.extend( Ext.Component, {
        style: {
            overflow: 'hidden'
        },
        html: '<div class="pic-wrap"><img class="pic" /></div>',
        ifData: false,
        initComponent: function(){

            var that = this;

            this.addListener( 'click', function(){

                that.imgInitialized = false;

                Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                    var ifCamera = !!(result === 'yes');

//                    alert( that.ifData );

                    Mods.getPicture({
                        ifCamera: ifCamera,
                        ifData: that.ifData,
                        quality: 50,
                        success: function( url ){

                            if( url ){

                                if( that.ifData ){

                                    url = 'data:image/png;base64,' + url;
                                }
                                that.onGetImgSuccess( url );
                            }
                        },
                        error: function(){

                        }
                    });

                    // that.onGetImgSuccess( 'http://localhost:8888/dropbox/eclipse/HelloPhoneGap/assets/www/sencha-touch-1.1.1/examples/kitchensink/resources/img/sencha.png' );
                });

                console.log( that.getImage() );
            }, this, { element: 'el' } );
        },
        listeners: {
            afterrender: function(){

                this.imageEl = Ext.get( this.el.query( '.pic' )[ 0 ] );
                this.imageWrap = Ext.get( this.el.query( '.pic-wrap' )[ 0 ] );
            }
        },
        /**
         * 初始化图片元素，根据组建容器设置其高度和宽度
         * 同时设置图片wrap，实现垂直和水平居中
         */
        imgInit: function(){

            var maxHeight = this.el.getHeight();
            var maxWidth = this.el.getWidth();

            // 实现图片的水平和垂直居中
            // 该方法在低版本的IE下会有兼容性问题，需要Hack
            this.imageWrap.set({
                style: {
                    textAlign: 'center',
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    width: maxWidth + 'px',
                    height: maxHeight + 'px'
                }
            });
            this.imageEl.set( {
                style: {
                    'max-height': maxHeight + 'px',
                    'max-width': maxWidth + 'px'
                }
            });
            this.imgInitialized = true;
        },
        /**
         * 图片重新获取的回调函数
         * @param url 返回的Url
         */
        onGetImgSuccess: function( url ){
            this.setImage( url );
        },
        /**
         * 设置图片的URL，同时储存Url
         * @param url
         */
        setImage: function( url ){

            if( !this.imgInitialized ){

                this.imgInit();
            }
            this.imageEl.set( { src: url } );
            this.imageUrl = url;
        },
        /**
         * 获取当前用户选取的图片的url
         */
        getImage: function(){

            return this.imageUrl || '';
        }
    });

    Ext.reg( 'imageCapture', ImageCaptureCls );
})();//(function(){
//
//
//    var Mods = App.mods;
//    // 1. list 部分的点击响应时间
//    // 2. 默认自动查找地理位置
//    // 3. 搜索功能
//    // 4. 结果保存
//    var locationButtonCls = Ext.extend( Ext.Button, {
//        cls  : 'demobtn',
//        flex : 1,
//        height: '50',
//        ui  : 'confirm',
//        text: '为商品定位',
//        margin: '0 15% 0 15%',
//        location: {
//            // 测试数据 todo 去掉测试数据
//            latlng: '12,32',
//            address: '32'
//        },
//        // 是否已经自动获取过当前位置
//        ifAutoLocation: false,
//        handler: function(){
//
//            this.overlay.show();
//        },
//
//        /**
//         * 请求位置信息
//         * @param address 用户输入的搜索词
//         * @param next( err, addressObj )
//         */
//        requestLocation: function ( address, next ){
//
//            if( address ){
//
//                Mods.map.getAR( address, next );
//            }
//            else {
//
//                Mods.map.getCurrentLocation(function ( ifSuccess, result ){
//
//                    next( ifSuccess, result );
//                });
//            }
//        },
//
//        /**
//         * 设置当前按钮的 locationInfo 并更新按钮文字
//         * @param locationInfo
//         */
//        setLocationInfo: function ( locationInfo ){
//
//            this.location = {
//                latlng: locationInfo.latlng,
//                address: locationInfo.address
//            };
//
//            this.setText( this.location.address );
//        },
//
//        /**
//         * 保存位置信息
//         * @param location
//         */
//        saveLocation: function ( location ){
//
//            this.location = location;
//
//            this.fireEvent( 'locationChanged' );
//        },
//
//        /**
//         * 获取位置信息
//         * @return {*}
//         */
//        getLocation: function (){
//
//            return this.location;
//        },
//
//        listeners: {
//            afterRender: function (){
//
//                var that = this;
//
//                this.overlay = Ext.ComponentMgr.create({
//                    xtype: 'locationOverlay'
//                });
//
//                this.overlay.locationButton = this;
//
//                // 绑定当一个结果项被选中的事件
//                this.overlay.addListener( 'addressSelected', function ( location ){
//
//                    that.saveLocation( location );
//                    this.hide();
//
//                    console.log( that.getLocation());
//                });
//
//
//                this.overlay.addListener( 'show', function (){
//
//                    // 若第一次，则自动请求当前位置
//                    if( !that.ifAutoLocation ){
//
//                        that.overlay.setLoading( true );
//
//                        that.requestLocation( undefined, function ( ifSuccess, result ){
//
//                            that.overlay.setLoading( false );
//
//                            that.ifAutoLocation = true;
//                            that.overlay.addressList.refreshResult( result );
//                        });
//                    }
//                    else {
//
//                        that.overlay.setLoading( false );
//                    }
//                });
//
//                this.overlay.hide();
//            },
//
//            /**
//             * 若locatioin信息改变，修改按钮上的文字
//             */
//            locationChanged: function (){
//
//                var location = this.getLocation();
//
//                this.setText( location.address );
//            }
//        }
//    });
//
//    Ext.reg( 'locationButton', locationButtonCls );
//
//    /**
//     * Overlay
//     */
//    var locationOverlayCls = Ext.extend( Ext.Panel, {
//
//        initComponent: function (){
//
//            var that = this;
//
//            Ext.apply( this, {
//                dockedItems: [
//                    {
//                        xtype: 'toolbar',
//                        doc: 'top',
//                        items: [
//                            {
//                                xtype: 'searchfield',
//                                placeHolder: 'Search',
//                                name: 'searchfield',
//                                width: '60%'
//                            },
//                            {
//                                xtype: 'spacer'
//                            },
//                            {
//                                xtype: 'button',
//                                ui: 'confirm',
//                                text: '搜索',
//                                handler: function (){
//
//                                    var address = that.searchfield.getValue();
//
//                                    if( address ){
//
//                                        that.setLoading( true );
//
//                                        that.locationButton.requestLocation( address, function ( ifSuccess, result ){
//
//                                            that.setLoading( false );
//                                            that.addressList.refreshResult( result );
//                                        });
//                                    }
//                                }
//                            }
//                        ]
//                    }
//                ]
//            });
//
//            locationOverlayCls.superclass.initComponent.call( this );
//
//        },
//        floating: true,
//        draggable: true,
//        modal: true,
//        centered: true,
//        width: Ext.is.Phone ? 300 : 400,
//        height: Ext.is.Phone ? '70%' : 400,
//        styleHtmlContent: true,
//
//        items: [
//            {
//                xtype: 'locationResultList'
//            }
//        ],
//
//        listeners: {
//
//            afterRender: function (){
//
//                var that = this;
//
//                this.addressList = this.query( 'locationResultList' )[ 0 ];
//                this.addressList.addListener( 'addressSelected', function ( location ){
//
//                    that.fireEvent( 'addressSelected', location );
//                });
//
//                this.searchfield = this.query( 'searchfield' )[ 0 ];
//            },
//
//            addressSelected: function ( address ){
//
//                this.hide();
//            }
//        },
//        scroll: 'vertical',
//        cls: 'htmlcontent'
//    });
//
//    Ext.reg( 'locationOverlay', locationOverlayCls );
//
//    // 列表数据模型
//    Ext.regModel( 'LocationResult', {
//        fileds: [ 'address', 'latlng', 'formattedAddress' ]
//    });
//
//    /**
//     * 返回一个以locationResult为模型的store实例对象
//     * @return {*}
//     */
//    function getStore(){
//
//        return new Ext.data.Store({
//            model: 'LocationResult',
////            sorters: 'address',
////            getGroupString : function(record) {
////                return record.get('firstName')[0];
////            },
//            data: [
//                { address: 'd' },
//                { address: 'b' },
//                { address: 'c' }
//            ]
//        });
//    }
//
//    /**
//     * 位置结果list
//     */
//    var locationResultListCls = Ext.extend( Ext.List, {
//
//        initComponent: function (){
//            Ext.apply( this, {
//                store: getStore()
//            });
//
//            locationResultListCls.superclass.initComponent.call( this );
//        },
//
//        itemTpl: '{address}',
//
//        refreshResult: function ( result ){
//
//            result = this.resultHandle( result );
//            this.store.loadData( result );
//            this.refresh();
//        },
//
//        resultHandle: function ( result ){
//
//            var formattedAddress = result.formattedAddress;
//            var addressConponent = result.addressConponent;
//            var latlng = location.lat + ',' + location.lng;
//
//            var data = [];
//            var index;
//            var conponent;
//
//            if( formattedAddress ){
//
//                data.push({
//                    address: formattedAddress,
//                    latlng: latlng,
//                    formattedAddress: formattedAddress
//                });
//            }
//
//            if( addressConponent ){
//                for( index = 0; conponent = addressConponent[ index ]; index++ ){
//
//                    data.push({
//                        address: conponent.long_name,
//                        latlng: latlng,
//                        formattedAddress: formattedAddress
//                    });
//                }
//            }
//
//
//
//            return data;
//        },
//
//        listeners: {
//            afterRender: function (){
////                this.setLoading( true );
//            },
//            itemtap: function ( self, index ){
//
//
//                var dataItem = self.store.getAt( index );
//                var location;
//
//                if( dataItem ){
//
//                    location = {
//                        address: dataItem.get( 'address' ),
//                        latlng: dataItem.get( 'latlng' )
//                    };
//                }
//
//                self.fireEvent( 'addressSelected', location );
//            }
//        }
//    });
//
//    Ext.reg( 'locationResultList', locationResultListCls );
//
//
//})();
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
                var fakePostion = [30.2329954, 120.0376216];

                this.setLoading( true );

                Mods.map.getCurrentLatLng(function ( err, latlng ){

                    that.setLoading( false );

                    if( err ){

                        Ext.Msg.alert( err + ' 您可以手动搜索位置!' );
                    }
                    else {

                        var position = new google.maps.LatLng( latlng.lat, latlng.lng );

                        if( !that.map ){

                            that.map = new google.maps.Map( that.mapDiv, {
                                zoom: 16,
                                center: position,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });

                            window.map = that.map;
                        }

                        that.map.setCenter( position );

                        // 其中resultLatLng为 google Map的 LatLng对象
                        Mods.map.geocode( { latLng: position }, function ( err, address, resultLatLng ){

                            if( err ){

                                Ext.Msg.alert( err );
                            }
                            else {

                                that.map.setZoom( 16 );

                                that.addPosition( address, resultLatLng );
                                that.address = address;
                                that.latlng = resultLatLng;
                            }
                        });
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

            google.maps.event.addListener( newMarker, 'click', function (){

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

            this.sendPositionBack( this.address, this.latlng.toUrlValue() );
            this.clearMap();
        }
    });

    Ext.reg( 'positionSearch', positionSearchCls );
})();
/**
 * 个人信息设置
 */
(function(){

    var Mods = App.mods;

    /**
     * 我的资料
     * @type {*}
     */
    var myProfileCls = Ext.extend( Ext.Panel, {

        scroll: 'vertical',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '个人信息设置',
                        items: [
                            {
                                xtype: 'button',
                                text: '返回',
                                ui: 'back',
                                handler: function (){

                                    Mods.route.redirect( 'profile/menu' );
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                text: '保存',
                                ui: 'confirm',
                                handler: function (){

                                    // 获取我的资料数据
                                    var formData = that.myProfileForm.getFormData();
                                    var locationData = that.myProfileLocation.getLocationInfo();

                                    var data = {
                                        sex: formData.sex,
                                        cellphone: formData.cellphone,
                                        qq: formData.qq,
                                        wangwang: formData.wangwang,
                                        location: Ext.isArray( locationData.location ) ? locationData.location.join( ',' ) : locationData.location,
                                        address: locationData.address
                                    };

                                    // 进行表单验证
                                    var model = Ext.ModelMgr.create( data, 'Profile' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        // 发送请求
                                        Mods.profile.updateUserInfo( undefined, data, function ( errObj ){

                                            if( !errObj ){

                                                Ext.Msg.alert( '保存成功!' );
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
                            }
                        ]
                    }
                ],

                items: [
                    {
                        xtype: 'myProfileForm'
                    },
                    {
                        xtype: 'myProfileLocation'
                    }
                ]
            });

            myProfileCls.superclass.initComponent.call( this );
        },

        listeners: {

            afterrender: function (){

                this.myProfileLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.myProfileForm = this.query( 'myProfileForm' )[ 0 ];
            },
            // 一旦被激活，就请求数据
            activate: function (){

                this.fetch();
            }
        },

        /**
         * 请求当前用户信息
         */
        fetch: function (){

            var that = this;
            this.setLoading( true );

            Mods.profile.getUserInfo( undefined, function ( data, user ){

                that.setLoading( false );
                if( data ){

                    Ext.Msg.alert( '获取用户信息失败: ' + data.error );
                }
                else {

                    that.userInfo = user;
                    that.updateView();
                }
            });
        },

        /**
         * 根据当前的userInfo来更新视图
         */
        updateView: function (){

            this.myProfileLocation.setLocationInfo( this.userInfo );
            this.myProfileForm.setFormData( this.userInfo );
        }
    });

    // 我的资料 表单
    var myProfileFormCls = Ext.extend( Ext.form.FormPanel, {

        scroll: false,
        items: [
            {
                xtype: 'fieldset',
                title: '个人信息 & 联系方式',
                instructions: '请填写您的个人信息，以便其他人能联系到您.',
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'selectfield',
                        name : 'sex',
                        label: '性别',
                        options: [
                            {text: '男',  value: 'male'},
                            {text: '女', value: 'female'}
                        ],
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'textfield',
                        name : 'cellphone',
                        label: '手机',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'textfield',
                        name : 'qq',
                        label: 'QQ',
                        useClearIcon: true,
                        autoCapitalize : false
                    },
                    {
                        xtype: 'textfield',
                        name : 'wangwang',
                        label: '旺旺',
                        useClearIcon: true,
                        autoCapitalize : false
                    }

                ]
            }
        ],

        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            }
        },

        /**
         * 返回formData数据
         */
        getFormData: function (){

            return this.getValues();
        },

        /**
         * 设置表单的数据
         * @param {Object} userInfo
         */
        setFormData: function ( userInfo ){

            this.userInfo = userInfo;
            // 创建一个model 用于填写表单
            var model = Ext.ModelMgr.create( this.userInfo, 'Profile' );
            this.loadRecord( model );
        }
    });

    // 当前用户地理位置信息
    var myProfileLocationCls = Ext.extend( Ext.Panel, {
        layout: 'hbox',
        cls: 'myprofile-location-container',

        address: undefined,
        location: undefined,
        listeners: {

            afterlayout: function (){

                var currentLocationWrap = this.body.query( '.current-location-wrap' )[ 0 ];
                var locationButton = this.query( 'locationButton' )[ 0 ];
                var currentHeight = Ext.get( currentLocationWrap).getHeight();
                var buttonHeight = locationButton.getHeight();
                var targetHeight = currentHeight > buttonHeight ? currentHeight : buttonHeight;

                this.body.setHeight( targetHeight );
            }
        },
        items: [
            {
                xtype: 'panel',
                width: '70%',
                layout: 'fit',
                cls: 'current-location-info',
                tplId: 'current-location-info-tpl',
                html: '',
                listeners: {

                    afterrender: function (){

                        this.tpl = new Ext.XTemplate( Ext.get( this.tplId ).getHTML() );
                        this.tpl.overwrite( this.body, {} );
                    }
                }
            },
            {
                xtype: 'locationButton',
                width: '25%',
                text: '定位'
            }
        ],

        /**
         * 获取当前的location信息
         * @return {Object} { address:, location: }
         */
        getLocationInfo: function (){

            return {
                address: this.address,
                location: this.location
            };
        },

        /**
         * 设置location信息，并更新视图
         * @param infoObj  { address: , location: }
         */
        setLocationInfo: function ( infoObj ){

            if( !this.currentLocationSpan ){

                this.currentLocationSpan = Ext.get( this.body.query( '.current-location' )[ 0 ] );
            }

            this.address = infoObj.address;
            this.location = infoObj.location;
            var address = infoObj.address ? infoObj.address : '点击“定位”设置您的当前位置!';

            this.currentLocationSpan.setHTML( address );
        }
    });

    Ext.reg( 'myProfileForm', myProfileFormCls );
    Ext.reg( 'myProfileLocation', myProfileLocationCls );
    Ext.reg( 'myProfile', myProfileCls );
})();
(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        badgeText: '',
        layout: 'card',
        items: [
            {
                xtype: 'profileMenu'
            },
            {
                xtype: 'myProfile'
            }
        ]
    });



    Ext.reg( 'profile', ProfileMainCls );
})();
/**
 * setting部分的主菜单
 */
(function(){

    var Auth = App.mods.auth;
    var Mods = App.mods;

    var profileMenuCls = Ext.extend( Ext.Panel, {

        defaults: {
            xtype: 'button',
            margin: '30% 10%',
            height: 45
        },
        scroll: false,
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '个人中心'
            }
        ],
        items: [
            {
                text: '我的资料',
                ui: 'confirm',
                handler: function (){

                    Mods.route.redirect( 'profile/myProfile' );
                }
            },
            {
                text: '偏好设置',
                ui: 'confirm',
                handler: function(){

                    Mods.route.redirect( 'profile/preferences' );
                }
            },
            {
                text: '注销',
                handler: function(){

                    Auth.logout(function (){
                        Mods.route.redirect( 'welcome/login' );
                    });
                }
            }
        ]
    });

    Ext.reg( 'profileMenu', profileMenuCls );
})();
(function(){

    var Mods = App.mods;
    var SellMenuCls = App.views.sellMenu = Ext.extend( Ext.Panel, {

        id: 'wannaSell-index',
        defaults: {
            xtype: 'button',
            cls  : 'demobtn',
            height: 45,
            margin: '30% 10%'
        },
        scroll: false,
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '我是卖家'
            }
        ],
        items: [
            {
                ui  : 'confirm',
                text: '添加新商品',
                handler: function(){

                    Mods.route.redirect( 'sell/newItem' );
                }
            },
            {
                ui  : 'action',
                text: '出售中的商品',
                handler: function (){

                    Mods.route.redirect( 'sell/sellList' );
                }
            }
        ]
    });

    Ext.reg( 'sellMenu', SellMenuCls );
})();
(function(){

    var SellMainCls = App.views.sellMain = Ext.extend( Ext.Panel, {
        title: '我要卖',
        iconCls: 'organize',
        layout: 'card',
        cls: 'card2',
        badgeText: '4',
        items: [
            {
                xtype: 'sellMenu'
            },
            {
                xtype: 'newItem'
            },
            {
                xtype: 'positionSearch',
                scroll: false
            },
            {
                xtype: 'sellingList'
            },
            {
                xtype: 'itemEdit'
            }
        ]
    });

    Ext.reg( 'sell', SellMainCls );
})();
(function(){

    var Mods = App.mods;
    var Config = App.config;

    var SellingList = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '正在出售的商品',
                        items: [
                            {
                                xtype: 'button',
                                text: '返回',
                                handler: function (){

                                    Mods.route.redirect( 'sell/menu' );
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'resultList'
                    }
                ]
            });

            SellingList.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',

        listeners: {
            afterRender:function (){

                var that = this;

                this.resultList = this.query( 'resultList')[ 0 ];

                this.resultList.addListener( 'itemTaped', function ( item ){
                    that.fireEvent( 'itemTaped', item );
                });

            },
            itemTaped: function ( item ){

                Mods.route.redirect( 'sell/edit/' + item.getAttribute( 'data-id' ) );
            }
        },

        getSellingItem: function (){

            var that = this;

            this.setLoading( true );
            Mods.itemRequest.getSellingItem(function ( err, items ){

                if( err ){

                }
                else {

                    that.resultList.clearList();
                    that.resultList.insertItem( items );
                }

                that.setLoading( false );
            });
        }
    });

    Ext.reg( 'sellingList', SellingList );
})();
(function(){

    var Request = App.mods.request;
    var Auth = App.mods.auth;
    var Mods = App.mods;

    var LoginCls = App.views.login = Ext.extend( Ext.form.FormPanel, {

        title: '登陆',
        scroll: 'vertical',
        id: 'welcome-login',
        apiType: 'LOGIN',
        scroll: false,


        /**
         * 组件初始化
         */
        initComponent:  function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            {
                                xtype: 'spacer'
                            },
                            {
                                text: '重置',
                                handler: function() {

                                    that.reset();
                                }
                            },
                            {
                                text: '登陆',
                                id: 'btLogin',
                                ui: 'confirm',
                                handler: function() {

                                    var values = that.getValues();
                                    var model = Ext.ModelMgr.create( values, 'Login' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        Auth.login( values.email, values.password, function( ifLogin ){

                                            if( ifLogin ){

                                                Mods.route.redirect( 'main' );
                                                // 重置表单
                                                that.reset();
                                            }
                                        });

                                    } else {

                                        Ext.each( errors.items, function( rec, i ){

                                            message += rec.message+"<br>";
                                        });

                                        Ext.Msg.alert( "表单有误：", message );

                                        return false;
                                    }
                                }
                            }
                        ]
                    }
                ]

            });

            LoginCls.superclass.initComponent.call( this );
        },

        items: [
            {
                xtype: 'fieldset',
                title: '用户登陆',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name : 'email',
                        label: '邮箱',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: '密码',
                        useClearIcon: true,
                        autoCapitalize : false
                    }
                ]
            }
        ],

        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            }
        }
    });

    Ext.reg( 'login', LoginCls );
})();(function(){

    var Request = App.mods.request;

    var RegisterCls =  App.views.login = Ext.extend( Ext.form.FormPanel, {
        title: '注册',
        scroll: 'vertical',
        iconCls: 'search',
        id: 'welcome-register',
        apiType: 'REGISTER',
        scroll: false,

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            {
                                xtype: 'spacer'
                            },
                            {
                                text: '重置',
                                handler: function() {

                                    that.reset();
                                }
                            },
                            {
                                text: '注册',
                                id: 'btRegister',
                                ui: 'confirm',
                                handler: function() {

                                    var values = that.getValues();
                                    var model = Ext.ModelMgr.create( values, 'Register' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() && values.password === values[ 'password-confirm' ] ){

                                        Request.jsonp({
                                            type: that.apiType,
                                            data: values,
                                            callback: function( data ){

                                                if( data.result ){

                                                    Ext.Msg.alert( "注册成功！", '注册成功，请登陆！' );

                                                    that.reset();
                                                }
                                                else {

                                                    Ext.Msg.alert( '注册失败！', data.error );
                                                }

                                            }
                                        }, true );

                                    } else {

                                        Ext.each( errors.items, function( rec, i ){

                                            message += rec.message+"<br>";
                                        });

                                        if( values.password !== values[ 'password-confirm' ] ){

                                            message += "两次密码输入不一致<br>";
                                        }

                                        Ext.Msg.alert( "表单有误：", message );

                                        return false;
                                    }
                                }
                            }
                        ]
                    }
                ]
            });

            RegisterCls.superclass.initComponent.call( this );
        },

        items: [
            {
                xtype: 'fieldset',
                title: 'Personal Info',
                instructions: 'Please enter the information above.',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name : 'email',
                        label: '邮箱',
                        useClearIcon: true,
                        autoCapitalize : false
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: '密码',
                        useClearIcon: true,
                        autoCapitalize : false
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password-confirm',
                        label: '密码确认',
                        useClearIcon: true,
                        autoCapitalize : false
                    }
                ]
            }
        ],
        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            }
        }
    });

    Ext.reg( 'register', RegisterCls );
})();
(function(){

    var welcomeCls = Ext.extend( Ext.TabPanel, {

        tabBar: {
            dock: 'top',
            layout: {
                pack: 'center'
            }
        },
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade'
        },
        items: [
            { xtype: 'login' },
            { xtype: 'register' }
        ],
        listeners: {
            beforecardswitch: function ( that, newTab, oldTab, index ){

                if( newTab.getId() === 'welcome-login' ){

                    if( location.hash !== 'welcome/login' ){

                        location.hash = 'welcome/login';
                    }
                }
                else if( newTab.getId() === 'welcome-register' ){

                    if( location.hash !== 'welcome/register' ){

                        location.hash = 'welcome/register';
                    }
                }
            }
        }
    });

    Ext.reg( 'welcome', welcomeCls );
})();
(function(){

    var Mods = App.mods;
    var Config = App.config;

    var SearchCls = Ext.extend( Ext.Panel, {

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
                        title: '商品搜索',
                            items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: '输入你需要的商品',
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

                                    var keyword = that.searchField.getValue();
                                    var data = undefined;

                                    if( keyword ){

                                        data = {
                                            title: keyword
//                                            desc: keyword 暂时进搜索标题
                                        };

                                        that.resultList.setLoading( true );

                                        Mods.itemRequest.query( data, function ( err, data ){

                                            if( err ){

                                                Ext.Msg.alert( '获取商品信息出错：' + JSON.stringify( err ) );
                                            }
                                            else {

                                                that.resultList.clearList();
                                                that.resultList.removeAll();
                                                that.resultList.insertItem( data.items );
                                                // 保存所有的结果ids，在获取更多结果中需要使用到
                                                that.resultList.saveResultIds( data.ids );
                                                that.onResize();
                                                that.doLayout();
                                                that.resultList.setLoading( false );

                                                // 若结果已经全部展示出来，则隐藏获取更多商品按钮
                                                if( data.items.length >= data.ids.length ){

                                                    that.getMoreResultBtn.hide();
                                                }
                                                else {
                                                    that.getMoreResultBtn.show();
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

                                    that.resultList.insertItem( items );
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
                            }
                        }
                    },
                    {
                        xtype: 'panel',
                        text: 'hello',
                        heigth: 50
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',

        listeners: {
            afterRender:function (){

                var that = this;

                this.resultList = this.query( 'resultList')[ 0 ];
                this.searchField = this.query( 'searchfield' )[ 0 ];
                this.getMoreResultBtn = this.query( 'button' )[ 0 ];

                this.resultList.addListener( 'itemTaped', function ( item ){
                    that.fireEvent( 'itemTaped', item );
                });

            },
            itemTaped: function ( item ){

                Mods.route.redirect( 'buy/detail/' + item.getAttribute( 'data-id' ) );
            },
            // 当窗口尺寸改变
            afterlayout: function (){

            }
        }
    });

    Ext.reg( 'itemSearch', SearchCls );
})();
(function(){

    var Mods = App.mods;
    var Config = App.config;
    var ITEM_HEIGHT = 130;

    var ResultItemCls = Ext.extend( Ext.Panel, {

        height: ITEM_HEIGHT,
        margin: '20px 0 0 0',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {

            });

            ResultItemCls.superclass.initComponent.call( this );
        },

        // 水平布局
        layout: 'hbox',
        // 每个item包含的信息
        itemInfo: {
            address: '',
            pic: '',
            title: '',
            desc: '',
            price: '',
            _id: ''
        },
        // todo 解决自动按照百分比调整宽度的问题
        items: [
            {
                xtype: 'resultItemPic',
                flex: 3
            },
            {
                xtype: 'resultItemText',
                flex: 7
            }
        ],
        listeners: {
            afterRender:function (){

                this.itemPic = this.query( 'resultItemPic' )[ 0 ];
                this.itemText = this.query( 'resultItemText' )[ 0 ];
                this.setItemInfo();

                var that = this;

                // 添加touch事件
                this.mon( this.el, {
                    'tap': function (){

                        console.log( that.itemInfo._id );
                        Mods.route.redirect( 'itemdetail/' + that.itemInfo._id );
                    }
                });
            },
            // 当窗口尺寸改变
            afterlayout: function (){

//                this.itemPic.doLayout();
//                this.onResize()
            }
        },

        // 设置item信息
        setItemInfo: function ( info ){

            this.itemInfo = info || this.itemInfo || {};
            this.itemPic.setImg( this.itemInfo.pic );
            this.itemText.setInfo( this.itemInfo );
        }
    });

    Ext.reg( 'resultItem', ResultItemCls );

    /**
     * item 图片部分，水平 居中
     * @type {*}
     */
    var ResultItemPicCls = Ext.extend( Ext.Panel, {

        html: '<div class="pic-item"><img src=""></div>',
        picMargin: 10,
        height: ITEM_HEIGHT,
        picUrl: '',
        listeners: {
            afterrender: function (){

                this.picWrap = this.body.child( '.pic-item' );
                this.pic = this.picWrap.child( 'img' );

                this.setImg();

                this.resizePicWrap();
            },

            afterlayout: function (){

                this.resizePicWrap();
            }
        },

        /**
         * 设置图片地址
         * @param url
         */
        setImg: function ( url ){

            this.picUrl = url || this.picUrl || '';

            this.pic && this.pic.set({
                src: this.picUrl
            });
        },

        /**
         * 更新 slide-pic-item 宽高 并设置 img的宽高
         */
        resizePicWrap: function (){

            var bodyWidth = this.body.getWidth();
            var bodyHeight = this.body.getHeight();
            var imgHeight = bodyWidth > bodyHeight ? bodyHeight + 'px' : 'auto';
            var imgWidth = bodyWidth > bodyHeight ? 'auto' : bodyWidth + 'px';

            this.picWrap.setHeight( bodyHeight );
            this.picWrap.setWidth( bodyWidth );

            this.pic.setStyle({
                'max-height': imgHeight,
                'max-width': imgWidth
            });

        }
    });

    Ext.reg( 'resultItemPic', ResultItemPicCls );

    /**
     * 商品文字描述部分
     * @type {*}
     */
    var ResultItemTextCls = Ext.extend( Ext.Panel, {

        // todo 添加内容的动态设置方法
        itemTextInfo: {
            title: '',
            desc: '',
            price: '',
            address: ''
        },

        listeners: {
            afterrender: function (){

                this.tpl = new Ext.Template( Ext.get( 'result-item-text-tpl').getHTML() );
                this.setInfo();
            }
        },

        /**
         * 设置文字
         * @param info
         */
        setInfo: function ( info ){

            this.itemTextInfo = info || this.itemTextInfo || {};
            this.tpl && this.tpl.overwrite( this.body, this.itemTextInfo );

        }
    });

    Ext.reg( 'resultItemText', ResultItemTextCls );
})();
(function(){

    var Mods = App.mods;
    var Config = App.config;

    var ResultListCls = Ext.extend( Ext.Panel, {

        // 清欠结果的所有id
        resultItems: [
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            }
        ],
        resultIds: [],
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },
//        layout: 'fit',
//        scroll: 'vertical',
        listeners: {
            afterRender:function (){

                var that = this;

                this.tpl = new Ext.Template( Ext.get( 'result-item-tpl').getHTML() );
                this.initRender();

                // 添加item被tap委托事件
                // 该方法会导致整个列表无法滚动...尼玛!!!!!!!
//                this.body.addListener( 'tap', function ( e ){
//
//                    var target = Ext.get( e.target );
//                    var item = target.findParent( '.result-item' );
//
//                    if( item ){
//
//                        that.fireEvent( 'itemClicked', item );
//                    }
//                });
            },
            resize: function (){
            },
            bodyresize: function (){
            },
            // 当窗口尺寸改变
            afterlayout: function (){
            }
        },

        /**
         * 组件第一次初始化后，若默认有数据，则渲染
         */
        initRender: function (){

            var that = this;
            var itemBak = this.resultItems;
            if( this.resultItems.length > 0 ){

                this.resultItems = [];
                this.insertItem( itemBak );
            }
        },

        /**
         * 清空列表
         */
        clearList: function (){

            this.body.setHTML( '' );
        },

        /**
         * 插入结果项
         * @param itemInfo {Object|Array} 可以插入一个或者多个
         */
        insertItem: function ( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            var that = this;
            this.resultItems.concat( newItems );

            Ext.each( newItems, function ( item ){

                that.tpl.append( that.body, that.itemInfoHandle( item ) );

                // 获取刚刚插入的item
                var child = that.body.last( '.result-item' );

                // 为item内的pic容器添加tap事件
                // 只有点击pic部分才会出发转移到商品详情的逻辑
                // 之所以这么做，是因为添加了tap，会导致在tap区域滚动会出问题...
                // 因此只好部分添加tap事件了... 肯跌啊...
                child.child( '.result-item-pic' ).addListener( 'tap', function (){

                    that.fireEvent( 'itemTaped', child );
                });
            } );

            that.doLayout();
        },

        /**
         * 对item数据进行处理
         * 1、选取第一个img 组装成图片地址，并赋值给pic
         * @param item { title, desc, title, imgs: [] ..} -> { title, desc, pic: url , ... }
         * @return {Object}
         */
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
        },

        /**
         * 储存所有结果id
         * @param ids
         */
        saveResultIds: function ( ids ){

            this.resultIds = ids;
        },

        /**
         * 获取接下来要获取的ids
         * @param maxLen 一次最多多少id
         * @return {Array}
         */
        getMoreResultIds: function ( maxLen ){

            var currentIndex = this.resultItems.length;

            return this.resultIds.slice( currentIndex, currentIndex + ( maxLen || 10 ) );
        }

    });

    Ext.reg( 'resultList', ResultListCls );
})();(function(){

    var Mods = App.mods;
    var Config = App.config;

    var ItemDetailCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '商品详情',
                        items: [
                            {
                                text: '返回',
                                ui: 'back',
                                handler: function() {
                                    Mods.route.redirect( 'buy/search' );
                                }
                            },
                            { xtype: 'spacer' },
                            {
                                text: '购买',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ]
            });

            ItemDetailCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            {
                xtype: 'picSlide'
            },
            {
                xtype: 'itemTextInfo'
            }
        ],
        listeners: {
            afterRender:function (){

                var that = this;
                this.picSlide = this.query( 'picSlide' )[ 0 ];
                this.itemTextInfo = this.query( 'itemTextInfo' )[ 0 ];

                // 下面仅为测试
                // 由于在此时 自组件的afterrender事件都还未被出发，因此直接设置会有问题
                setTimeout( function (){
//                    that.setItemTextInfo( {
//                        title: '标题',
//                        desc: '这是商品描述。商品九成新！橙色非常不错，由于买了更好的，所以转让！',
//                        price: '9999',
//                        location: '浙江工业大学',
//                        sellerName: 'Neekey',
//                        date: '2011-01-02',
//                        email: 'ni@gmail.com',
//                        QQ: '1987987979',
//                        wangwang: '9879790'
//                    });
//
//                    that.setPics( [
//                        'http://3.s3.envato.com/files/1124114/1item_preview.jpg',
////                    'http://3.s3.envato.com/files/1209789/0_itempreview.jpg',
//                        'http://0.s3.envato.com/files/1208187/pdfs_php.jpg'
//                    ]);
                }, 1000 ) ;
            },
            resize: function (){

                console.log( 'itemDetail resize' );
            },
            bodyresize: function (){
                console.log( 'itemDetail bodyresize' );

            },
            // 当窗口尺寸改变
            afterlayout: function (){

            }
        },

        /**
         * 设置当前商品详情信息
         * @param item
         */
        setDetailInfo: function ( item ){

            this.setPics( item.imgs );

            var textInfo = {
                title: item.title,
                desc: item.desc,
                price: item.price,
                location: item.location,
                sellerName: 'neekey',
                date: 'hello~',
                email: 'ni184775761@gmail.com',
                QQ: '184775761',
                wangwang: 'hello~'
            };

            this.setItemTextInfo( textInfo );
        },

        /**
         * 设置图片
         * @param pics
         */
        setPics: function ( imgs ){

            var pics = [];

            Ext.each( imgs, function ( img ){
                pics.push( img.url );
            });

            this.picSlide.setPics( pics );
        },

        /**
         * 根据商品id请求数据
         * @param itemId
         */
        fetch: function ( itemId ){

            var that = this;
            this.setLoading( true );
            Mods.itemRequest.getItemById( itemId, function ( err, item ){

                if( err ){

                    Ext.Msg.alert( '获取商品信息失败! ' + err );
                }
                else {

                    that.setDetailInfo( item );
                }

                that.setLoading( false );
            });

        },

        /**
         * 设置商品的其他信息
         * @param obj
         */
        setItemTextInfo: function ( obj ){

            this.itemTextInfo.setInfo( obj );
        }
    });

    Ext.reg( 'itemDetail', ItemDetailCls );
})();
(function(){

    var ItemTextInfoCls = Ext.extend( Ext.Panel, {
        // todo 添加内容的动态设置方法
        style: {
            margin: '5%'
        },
        itemTextInfo: {
            title: '',
            desc: '',
            price: '',
            location: '',
            sellerName: '',
            date: '',
            email: '',
            QQ: '',
            wangwang: ''
        },
        listeners: {
            afterrender: function (){


                this.tpl = new Ext.Template( Ext.get( 'item-detail-tpl').getHTML() );
                this.setInfo();
            }
        },

        setInfo: function ( info ){

            this.itemTextInfo = info || this.itemTextInfo || {};
            this.tpl && this.tpl.overwrite( this.body, this.itemTextInfo );

        }
    }) ;

    Ext.reg( 'itemTextInfo', ItemTextInfoCls );
})();
(function(){

    var PicSlideCls = Ext.extend( Ext.Carousel, {

        // todo 添加动态设置item的方法
        height: 300,
//        width: '100%', 若添加了该属性，将导致组件在初始化时安装当时的100%计算，此后该width作为固定式使用，不会根据窗口变化而变化
        picWraps: [],
        indicator: true,
        flex: 1,
        pics: [],
        defaults: {
//            xtype: 'picSlideItem'
        },
        items: [
//            {},{},{}
        ],
        listeners: {
            afterrender: function (){

                var that = this;

//                this.items.each( function ( item, index ){
//
//                    item.setPicSlide( that );
//                    item.picUrl = that.pics[ index ];
//                });

                this.setPics( this.pics );

                this.addListener( 'resize', function (){

                    console.log( 'reresize' );
                });
            }
        },

        resizePicWraps: function ( width, height ){

            this.items.each( function ( item ){

                item.resizePicWrap();
            });
        },

        setPics: function ( pics ){

            this.pics = pics;
            this.removeAll();

            var pic;
            var i;

            for( i = 0; pic = pics[ i ]; i++ ){

                this.insert( i, Ext.ComponentMgr.create({
                    xtype: 'picSlideItem',
                    picUrl: pic,
                    picSlide: this
                } ));
            }

            // 否则图片显示不出来
            this.doLayout();
        }

    });

    var PicItemCls = Ext.extend( Ext.Panel, {

        html: '<div class="slide-pic-item"><img src=""></div>',
        picMargin: 10,
        listeners: {
            afterrender: function (){

                this.picWrap = this.body.child( '.slide-pic-item' );
                this.pic = this.picWrap.child( 'img' );

                this.picSlide.picWraps.push( this.picWrap );
                this.setImg( this.picUrl );

                this.resizePicWrap();
            },

            afterlayout: function (){

                this.resizePicWrap();
            }
        },

        setImg: function ( url ){

            if( url ){
                this.pic.set({
                    src: url
                });

                this.picUrl = url;
            }
            else {

                this.hide();
            }

        },

        setPicSlide: function ( picSlide ){

            this.picSlide = picSlide;
        },

        /**
         * 更新 slide-pic-item 宽高 并设置 img的宽高
         */
        resizePicWrap: function (){

            var newWidth = this.picSlide.el.getWidth();
            var newHeight = this.picSlide.el.getHeight();
            var imgHeight = newWidth > newHeight ? newHeight - this.picMargin  - 30 + 'px' : 'auto';
            var imgWidth = newWidth > newHeight ? 'auto' : newWidth - this.picMargin + 'px';

            this.picWrap.setWidth( newWidth );
            this.picWrap.setHeight( newHeight );

            this.pic.setStyle({
                'max-width': imgWidth,
                'max-height': imgHeight
            });
        }

    });

    Ext.reg( 'picSlide', PicSlideCls );
    Ext.reg( 'picSlideItem', PicItemCls );
})();(function(){

    var Config = App.config;
    var Mods = App.mods;
    var imgEditCls = Ext.extend( Ext.Panel, {
//        layout: 'vbox',
        cls: 'new-item-imgs',
        height: 150,
        // 当前可以显示的图像信息
        imgs: [],
        // 新增的图像信息
        addImgs: [],
        // 被删除的图像新
        removeImgs: [],
        // 事件监听
        listeners: {
            afterRender: function (){

                this.tpl = new Ext.XTemplate( Ext.get( 'item-edit-imgs').getHTML() );
            },
            // 图像被点击
            imgWrapTaped: function ( imgItem, imgWrap, removeImgBtn ){

                var img = imgWrap.child( 'img' );
                var url = img.dom.getAttribute( 'src');
                var that = this;

                if( url ){
                    Ext.Msg.confirm( "更换图片", "继续将覆盖原有图片，是否继续？", function( result ){

                        if( result === 'yes' ){

                            // 直接出现发现有问题...直接展开 然后就关闭了...
                            setTimeout(function (){
                                Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                                    var ifCamera = !!(result === 'yes');

                                    that.processImageCapture( ifCamera, imgItem, imgWrap, removeImgBtn );
                                });
                            }, 1500 )
                        }
                    });
                }
                else {

                    Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                        var ifCamera = !!(result === 'yes');

                        that.processImageCapture( ifCamera, imgItem, imgWrap, removeImgBtn );
                    });
                }
            },
            // 移除按钮被点击到
            imgRemoveTaped: function (){

                var that = this;
                var _arguments = arguments;

                Ext.Msg.confirm( "选择图片", "真心要删除图片?", function( result ){

                    if( result === 'yes' ){

                        that.removeImg.apply( that, _arguments );
                    }
                });
            }
        },

        /**
         * 渲染视图
         */
        renderImg: function (){

            this.tpl.overwrite( this.body, this.imgs );
            this.doLayout();
            this.attachImgs();
        },

        /**
         * 绑定事件（每次render后要重新绑定）
         */
        attachImgs: function (){

            var imgItems = this.body.query( '.item-edit-imgs-item' );
            var that = this;

            Ext.each( imgItems, function ( imgItem, index ){

                imgItem = Ext.get( imgItem );
                var imgWrap = imgItem.child( '.item-edit-pic-wrap' );
                var imgRemoveBtn = imgItem.child( '.item-edit-pic-remove' );

                // 为图像添加tap事件
                imgWrap.addListener( 'tap', function (){

                    that.fireEvent( 'imgWrapTaped', imgItem, imgWrap, imgRemoveBtn, index );
                });

                // 为remove按钮添加tap事件
                imgRemoveBtn.addListener( 'tap', function (){

                    that.fireEvent( 'imgRemoveTaped', imgItem, imgWrap, imgRemoveBtn, index );
                });
            });
        },

        /**
         * 删除图像...
         * 如果该位置原来是已经上传过的图片，则会将其_id添加到 removeImgs中
         * @param {ExtElement} imgItem
         * @param {ExtElement} imgWrap
         * @param {ExtElement} imgRemoveBtn
         */
        removeImg: function ( imgItem, imgWrap, imgRemoveBtn ){

            var _id = imgItem.dom.getAttribute( 'data-id' );
            var tipSpan = imgWrap.child( '.item-edit-img-tip' );
            var img = imgWrap.child( 'img' );

            // 若存在id，则将删除一个服务器上已经有的图片，做好记录
            if( _id ){

                this.removeImgs.push( _id );
            }

            // 设置图片地址为空
            img.set({
                src: ''
            });

            // 隐藏图像
            if( !img.hasCls( 'hidden' ) ){

                img.toggleCls( 'hidden' );
            }

            // 显示tip
            if( tipSpan.hasCls( 'hidden' ) ){

                tipSpan.toggleCls( 'hidden' );
            }

            // 隐藏btn
            if( !imgRemoveBtn.hasCls( 'hidden' ) ){

                imgRemoveBtn.toggleCls( 'hidden' );
            }
        },

        /**
         * 执行获取图片的操作（读取本地文件或者使用像机）
         * @param ifCamera 是否使用相机
         * @param imgItem
         * @param imgWrap
         * @param removeBtn
         */
        processImageCapture: function ( ifCamera, imgItem, imgWrap, removeBtn ){

            var that = this;

            if( Config.IF_DEVICE ){
                Mods.getPicture({
                    ifCamera: ifCamera,
                    ifData: true,
                    quality: 50,
                    success: function( url ){

                        if( url ){

                            url = 'data:image/png;base64,' + url;
                            that.onImgCaptureSuccess( url, imgItem, imgWrap, removeBtn );
                        }
                    },
                    error: function(){
                        Ext.msg.alert( '图片获取失败!' );
                    }
                });
            }
            else {

                setTimeout(function (){
                    Ext.Msg.alert( '当前环境不支持添加图像' );
                }, 1000 );

            }
        },

        /**
         * 图片获取成功后的操作
         * @param url
         * @param imgItem
         * @param imgWrap
         * @param removeBtn
         */
        onImgCaptureSuccess: function ( url, imgItem, imgWrap, removeBtn ){

            var img = imgWrap.child( 'img' );
            var tipSpan = imgWrap.child( '.item-edit-img-tip' );

            // 设置图像
            img.set({
                src: url
            });

            // 显示图像
            if( img.hasCls( 'hidden' ) ){

                img.toggleCls( 'hidden' );
            }

            // 隐藏tip
            if( !tipSpan.hasCls( 'hidden' ) ){

                tipSpan.toggleCls( 'hidden' );
            }

            // 显示btn
            if( removeBtn.hasCls( 'hidden' ) ){

                removeBtn.toggleCls( 'hidden' );
            }
        },

        /**
         * 返回修改的item的图片请求,包括删除的旧的图像，以及新增的新图像
         * @return {Object} { addItems: [ base64图像数据数组 ], removeImgs: [ 被删除的旧图像的id数组 ] }
         */
        getUpdateInfo: function (){

            var addImgs = [];

            var imgItem = this.body.query( '.item-edit-imgs-item' );

            Ext.each( imgItem, function ( item ){

                // 若没有id，则说明是新图片
                if( !item.getAttribute( 'data-id' ) ){

                    var img = Ext.get( item ).query( 'img')[ 0 ];
                    var url;

                    if( img ){

                        url = img.getAttribute( 'src' );
                    }

                    if( url ){
                        addImgs.push( url );
                    }
                }
            });

            return {
                addImgs: addImgs,
                removeImgs: this.removeImgs
            };
        },

        /**
         * 设置图像信息
         * @param imgs
         */
        setImages: function ( imgs ){

            this.imgs = this.imgsHandle( imgs );
            this.renderImg();
        },

        /**
         * 处理图片信息，以便渲染，如果不足三个，则添加空
         */
        imgsHandle: function ( imgs ){

            var imgLen;
            var i;

            imgs = Ext.isArray( imgs ) ? imgs : [ imgs ];
            imgLen = imgs.length;

            Ext.each( imgs, function ( img ){

                if( !img.url ){

                    img.url = Config.APIHOST + 'img?id=' + img._id;
                }
            });

            // 若不足三个，则补全
            if( imgLen < 3 ){

                for( i = 0; i < 3 - imgLen; i++ ){

                    imgs.push({});
                }
            }

            return imgs;
        }

    });

    Ext.reg( 'imgEdit', imgEditCls );
})();
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
                                    Mods.route.redirect( 'sell/sellList' );
                                }
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
(function(){

    var Mods = App.mods;
    var Config = App.config;

    var NewItemCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '新商品',
                        items: [
                            {
                                text: '返回',
                                ui: 'back',
                                handler: function() {
                                    Mods.route.redirect( 'main/sell' );
                                }
                            },
                            { xtype: 'spacer' },
                            {
                                text: '发布',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                    // 若为在浏览器中调试，则使用测试数据
                                    var pics = Config.IF_DEVICE ? that.newItemImg.getImageUrl() : [
                                        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi4Kz/ARBgAAIVAYFMFtU7AAAAAElFTkSuQmCC',
                                        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi6OXhAQgwAAHPAKaGfcCLAAAAAElFTkSuQmCC'
                                    ];

                                    var location = that.newItemLocation.getLocation();
                                    var formData = that.newItemForm.getValues();

                                    var data = that.itemDataHandle( formData, location, pics );
                                    var model = Ext.ModelMgr.create( data, 'Item' );
                                    var errors = model.validate();
                                    var message = "";

//                                    console.log( data );
                                    if( errors.isValid() ){

                                        Mods.request.send({
                                            method: 'post',
                                            data: data,
                                            type: 'NEW_ITEM',
                                            callback: function ( d ){

                                                var resData = d.data;
                                                var result = resData.result;
                                                var itemId;
                                                console.log( 'response',d );

                                                if( result ){
                                                    itemId = resData.data.itemId;
                                                    Ext.Msg.alert( '商品添加成功' );
                                                }
                                                else {
                                                    Ext.Msg.alert( '商品添加失败！', resData.error );
                                                }
                                            }
                                        }, true );
                                    }
                                    else {
                                        Ext.each( errors.items, function( rec, i ){

                                            message += rec.message+"<br>";
                                        });

                                        Ext.Msg.alert( "表单有误：", message );

                                        return false;
                                    }

                                }
                            }
                        ]
                    }
                ]
            });

            NewItemCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            { xtype: 'newItemForm' },
//            { xtype: 'newItemLocation' },
            {
                xtype: 'button',
                handler: function (){

                    Mods.route.redirect( 'sell/positionSearch/sell,newItem' );
                }
            },
            { xtype: 'newItemImg' }
//            submitSellConfig
        ],
        listeners: {
            afterRender:function (){

                this.newItemImg = this.query( 'newItemImg' )[ 0 ];
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'locationButton' )[ 0 ];
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
        }
    });

    Ext.reg( 'newItem', NewItemCls );
})();
(function(){

    var NewItemFormCls = Ext.extend( Ext.form.FormPanel, {
//        scroll: 'vertical',
        title: '商品简介',
        id: 'new-item',
        defaults: {
            required: true,
            labelAlign: 'left',
            labelWidth: '40%',
            useClearIcon: true,
            autoCapitalize : false
        },
        items: [
            {
                xtype: 'textfield',
                name : 'title',
                label: '标题'
            },
            {
                xtype: 'textareafield',
                name : 'desc',
                label: '商品表述'
            },
            {
                xtype: 'textfield',
                name: 'price',
                label: '价格'
            }
        ],
        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            }
        }
    });

    Ext.reg( 'newItemForm', NewItemFormCls );
})();
(function(){

    var NewItemImgCls = Ext.extend( Ext.Panel, {
        xtype: 'panel',
        layout: 'hbox',
        height: 150,
        defaults: {
            xtype: 'imageCapture',
            height: 100,
            width: '30%',
            margin: '0 5.2% 0 5.2%',
            cls: 'new-item-imgs',
            ifData: true
        },
        items: [
            {},{},{}
        ],
        listeners: {
            afterRender: function (){
//                picInstance = this;
                this.imageCaptures = this.query( 'imageCapture' );
            }
        },

        /**
         * 获取图像的base64 uri
         * @return {Array}
         */
        getImageUrl: function (){

            var urls = [];
            var index;
            var image;

            for( index = 0; image = this.imageCaptures[ index ]; index++ ){

                urls.push( image.getImage() );
            }

            return urls;
        },

        /**
         *
         */
        getImages: function (){

        }
    });

    Ext.reg( 'newItemImg', NewItemImgCls );
})();
(function(){
    var Mods = App.mods;

    var NewItemLocationCls = Ext.extend( Ext.Button, {
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'decline',
        text: '为商品定位',
        margin: '0 15% 0 15%',
        handler: function(){

            alert( 'test!@');
            Mods.map.getCurrentLocation(function ( result ){

                alert( JSON.stringify( result ) );
            });
//            Map.getCurrentLatLng(function( err, latLng ){
//
//                console.log( latLng );
//                Map.getRAR( latLng.lat, latLng.lng, function( res ){
//
//                    alert( JSON.stringify( res ) );
//                });
//            });
        }
    });

    Ext.reg( 'newItemLocation', NewItemLocationCls );
})();
