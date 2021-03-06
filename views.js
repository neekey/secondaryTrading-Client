/**
 * 主界面视图
 */
(function(){

    var Mods = App.mods;

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
            },
            cardswitch: function ( main, newCard, oldCard, index ){

                var newXtype = newCard.xtype;
                var currentHash = Mods.route.getHash();

                switch( newXtype ){

                    case 'sell': {

                        if( currentHash.split( '/' )[ 0 ] !== 'sell' ){
                            Mods.route.redirect( 'sell' );
                        }
                        break;
                    }
                    case 'buy': {

                        if( currentHash.split( '/' )[ 0 ] !== 'buy' ){
                            Mods.route.redirect( 'buy' );
                        }
                        break;
                    }
                    case 'profile': {

                        if( currentHash.split( '/' )[ 0 ] !== 'profile' ){
                            Mods.route.redirect( 'profile' );
                        }
                        break;
                    }
                    case 'guessYouLike': {

                        if( currentHash.split( '/' )[ 0 ] !== 'guessYouLike' ){
                            Mods.route.redirect( 'guessYouLike' );
                        }
                        break;
                    }
                }
            }
        },
        items: [
            { xtype: 'sell' },
            { xtype: 'buy' },
            { xtype: 'profile' },
            { xtype: 'guessYouLike' }
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
        iconCls: 'search',
        layout: 'card',
        cls: 'card2',
//        badgeText: '4',
        items: [
            {
                // 商品搜索
                xtype: 'itemSearch'
            },
            {
                // 商品详情
                xtype: 'itemDetail'
            },
            {
                // 购买页面
                xtype: 'buyIt'
            }
        ]
    });

    Ext.reg( 'buy', BuyMainCls );
})();
(function(){

    var Mods = App.mods;

    var BuyIt = App.views.buyIt = Ext.extend( Ext.Panel, {

        scroll: 'vertical',
        html: '',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        title: '购买',
                        items: [
                            {
                                xtype: 'button',
                                text: '返回',
                                ui: 'back',
                                handler: function(){

                                    // 返回宝贝详情，并附加上原有的参数
                                    var originParam = Mods.route.getPreviousParam();

                                    Mods.route.goBack( originParam );
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'panel',
                        html: '<div class="danbao-wrap"><img class="danbao-pic" src="images/danbao.png"><p><a class="danbao-link" href="http://www.baidu.com" target="_blank">进入支付宝担保交易</a></p></div>',
                        height: 400
                    }
                ]
            });

            BuyIt.superclass.initComponent.call( this );
        }
    });

    Ext.reg( 'buyIt', BuyIt );
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
(function(){


    var CategorySelectCls = Ext.extend( Ext.form.FieldSet, {

        cls: 'cat-select-fieldset',
        // 显示说明
        title: '我感兴趣的<span class="title-desc">（根据你设定的关键词向你推荐商品）</span>',
        // 是否需要添加按钮
        ifUseSaveBtn: false,
        saveBtnText: '添加',
        initComponent: function (){

            var that = this;

            this.ifUseCustomCat = false;

            // 构造默认分类
            var defaultCats = App.models.categories;
            var options = [{ text: '请选择', value: '' }];

            Ext.each( defaultCats, function ( cat ){

                options.push( { text: cat, value: cat } );
            });

            this.defaultCatOptions = options;

            var comConfig = {
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'checkboxfield',
                        name : 'custom-cat',
                        label: '使用自定义分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        listeners: {
                            check: function (){

                                that.ifUseCustomCat = true;

                                that.hiddenCat.setValue( that.customField.getValue() );
                                that.catSelect.hide();
                                that.customField.show();
                            },
                            uncheck: function (){

                                that.ifUseCustomCat = false;

                                that.hiddenCat.setValue( that.catSelect.getValue() );
                                that.catSelect.show();
                                that.customField.hide();
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'category',
                        id: 'hidden-cat'
                    },
                    {
                        xtype: 'selectfield',
                        name : 'preset-cat',
                        id: 'preset-cat',
                        label: '默认分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true,
                        options: options,
                        listeners: {
                            change: function (){

                                if( that.ifUseCustomCat === false ){

                                    that.hiddenCat.setValue( this.getValue() );
                                }
                            }
                        }
                    },

                    {
                        xtype: 'textfield',
                        name : 'custom-cat',
                        id: 'custom-cat',
                        label: '自定义分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        listeners: {

                            // keyup在android上貌似无效
                            keyup: function (){

                                if( that.ifUseCustomCat === true ){

                                    that.hiddenCat.setValue( this.getValue() );
                                }
                            },

                            // 只有在blur的时候才会触发，在android上点击添加按钮也不会blur...
                            change: function (){

                                if( that.ifUseCustomCat === true ){

                                    that.hiddenCat.setValue( this.getValue() );
                                }
                            }
                        }
                    }
                ]
            };

            if( this.ifUseSaveBtn ){

                comConfig.items.push(
                    {
                        xtype: 'button',
                        text: that.saveBtnText,
                        ui: 'action',
                        width: '30%',
                        style: {
                            margin: '5px 0 5px 69%'
                        },
                        handler: function (){

                            // 在android上，监听keyup无效，而change事件只有在blur时才会触发，因此只能在此做这样的处理
                            if( that.ifUseCustomCat ){

                                that.hiddenCat.setValue( that.customField.getValue() );
                            }

                            var newCatName = that.hiddenCat.getValue();

                            // todo 此处还可以再对分类的名字做验证,限定格式什么的
                            if( newCatName ){

                                that.fireEvent( 'saveCat', newCatName );
                            }
                            else {

                                Ext.Msg.alert( '请选择/输入要添加的类别' );
                            }

                        }
                    }
                );
            }

            Ext.apply( this, comConfig );

            CategorySelectCls.superclass.initComponent.call( this );
        },

        listeners: {
            afterrender: function (){

                this.catSelect = this.query( '#preset-cat' )[ 0 ];
                this.ifUseCustom = this.query( 'checkboxfield' )[ 0 ];
                this.customField = this.query( '#custom-cat' )[ 0 ];
                this.hiddenCat = this.query( '#hidden-cat' )[ 0 ];

                // 默认隐藏自定义
                this.customField.hide();

                // 设置默认值 默认会显示第一项，但是实际getValue()出来为''
//                this.catSelect.setValue( '' );
                this.hiddenCat.setValue( this.catSelect.getValue() );
            }
        },

        // 获取当前用户选择的分类
        getCategory: function (){

            return this.hiddenCat.getValue();
        },

        /**
         * 设置表单中的分类
         * @param catName 分类名称，会自动识别是否为默认分类
         */
        setCategory: function ( catName ){

            // 检查是否为默认分类
            var cats = App.models.categories;
            var catType = 'custom';

            if( catName ){

                Ext.each( cats, function ( cat ){

                    if( cat === catName ){

                        catType = 'preset';
                    }
                });
            }
            // 若catName为空，则设置为默认设置类型
            // 由于值为空，因此会默认显示“请选择'
            else {

                catType = 'preset';
            }

            if( catType === 'preset' ){

                this.ifUseCustom.uncheck();
                this.customField.hide();
                this.catSelect.show();
                this.catSelect.setValue( catName );
            }
            else {

                this.ifUseCustom.check();
                this.customField.show();
                this.catSelect.hide();
                this.customField.setValue( catName );
            }

            this.hiddenCat.setValue( catName );
        }
    });

    Ext.reg( 'categorySelect', CategorySelectCls );
})();
(function(){

    var Mods = App.mods;

    var GoBackButtonCls = Ext.extend( Ext.Button, {

        ui: 'back',
        text: '返回',
        handler: function (){

//            var previousHash = Mods.route.getPreviousHash();
//            var backHash = previousHash.indexOf( '/' ) > 0 ? previousHash.split( '/' )[ 0 ] : previousHash;

            Mods.route.goBack();
        }
    });

    Ext.reg( 'goBackButton', GoBackButtonCls );
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

    // todo toolbar 无法自适应宽度
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
            // 是否已经自动获取过当前位置
            this.isAutoGetLocation = false;

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

                                    Mods.route.goBack( Mods.route.getPreviousParam() );
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
                                width: '50%'
                            },
                            {
                                xtype: 'button',
//                                text: '定位',
                                width: '20%',
                                ui: 'action',
                                iconAlign: 'top',
                                iconCls: 'locate',
                                iconMask: true,

                                handler: function (){

                                    that.searchCurrentPosition();
                                }
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

                                    var address = that.searchField.getValue();

                                    if( address ){

                                        that.setLoading( true );

                                        Mods.map.geocode( { address: address }, function ( err, results ){

                                            // 先清楚所有的点
                                            that.clearMap();

                                            console.log( results );

                                            that.setLoading( false );
                                            if( err ){

                                                Ext.Msg.alert( '搜索位置信息出错：', err );
                                            }
                                            else {

                                                if( results.length > 0 ){

                                                    var latlngs = [];
                                                    var bound;

                                                    Ext.each( results, function ( result ){

                                                        that.addPosition( result.address, result.location );
                                                        latlngs.push( result.location );
                                                    });

                                                    // 获取包含所有结果的bound
                                                    bound = Mods.map.getBoundsByLocations( latlngs );

                                                    // 使地图自适应bound
                                                    that.map.fitBounds( bound );

                                                    // todo 貌似在bound很小的情况下 地图会放的很大，目前先这样fix（但是无法fix多个结果，但是靠的很近的情况）
                                                    if( results.length === 1 ){

                                                        that.map.setZoom( 12 );
                                                    }
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

                // 由于mapDiv被hidden过，因此google map在其show之后需要重新计算地图的显示尺寸
                // 因此需要出发google提供的事件接口
                google.maps.event.trigger(this.map, 'resize');

                if( !this.isAutoGetLocation ){

                    this.searchCurrentPosition();
                }
            }
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

//                    var position = new google.maps.LatLng( latlng.lat, latlng.lng );
                    var position = new google.maps.LatLng( 30.2244392, 120.02992629999994 );

                    that.map.setCenter( position );

                    // 其中resultLatLng为 google Map的 LatLng对象
                    Mods.map.geocode( { latLng: position }, function ( err, address, resultLatLng ){

                        that.setLoading( false );

                        if( err ){

                            alert( err + '您可以手动搜索位置!' );
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
         * @param latlngUrl {String} longitude,latitude
         */
        sendPositionBack: function ( address, latlngUrl ){

            var originParam = Mods.route.getPreviousParam();

            // 对于itemEdit来说只去第一个参数
            // todo 这个有问题, 就是地图数据返回后，变成 itenid/address/latlng --> 第一次没问题，后续会约加越多
            originParam = originParam.splice( 0, 1 );

            var returnParam = originParam.concat( [ address, latlngUrl ] );

            Mods.route.goBack( returnParam );
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
        },

        /**
         * 返回到上一视图
         */
        goBack: function (){

            var latlngUrlValue = this.latlng.toUrlValue ? ( this.latlng.lng() + ',' +this.latlng.lat() ) : '';
            this.sendPositionBack( this.address, latlngUrlValue );
            this.clearMap();
        }
    });

    Ext.reg( 'positionSearch', positionSearchCls );
})();
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

                    try{

                        that.map = new google.maps.Map( that.mapDiv, {
                            zoom: 8,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                    }
                    catch( e ){}

                }

                // 由于mapDiv被hidden过，因此google map在其show之后需要重新计算地图的显示尺寸
                // 因此需要出发google提供的事件接口
                try {
                    google.maps.event.trigger(this.map, 'resize');
                }
                catch( e ){

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

                // 将自己的位置添加到当前位置
                that.addMyPosition( that.currentLocation.latitude, that.currentLocation.longitude );

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

        /**
         * 将自己的位置添加到地图，使用蓝色小球作为图标
         * @param latitude
         * @param longitude
         */
        addMyPosition: function( latitude, longitude ){

            if( !this.map ){

                this.map = new google.maps.Map( this.mapDiv, {
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            // location 从服务器中获取到的是 [ longitude, latitude ] 但是google的顺序是 ( latitude, longitude )
            var itemLatlng = new google.maps.LatLng( latitude, longitude );

            // 保存 latlng 对象
            this.resultLatLngs.push( itemLatlng );

            //
            var newMarker = this.addMarker({
                position: itemLatlng,
                title:"您所在的位置",
                icon: 'images/myLocation.png'
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
        // 用来记录是否处于选取位置信息的状态
        isSearchLocation: false,
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
                                xtype: 'goBackButton'
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
                                        location: Ext.isArray( locationData.latlng ) ? locationData.latlng.join( ',' ) : locationData.latlng,
                                        address: locationData.address
                                    };

                                    // 进行表单验证
                                    var model = Ext.ModelMgr.create( data, 'Profile' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        that.setLoading( true );

                                        // 发送请求
                                        Mods.profile.updateUserInfo( undefined, data, function ( errObj ){

                                            that.setLoading( false );

                                            if( !errObj ){

                                                Ext.Msg.alert( '保存成功!' );
                                            }
                                            else {

                                                Ext.Msg.alert( '保存出错', ( errObj.error || '' ) + ( JSON.stringify( errObj.data ) || '' ) );
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

                var that = this;

                this.myProfileLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.myProfileForm = this.query( 'myProfileForm' )[ 0 ];

                // 若定位按钮被点击，就会触发该事件
                this.myProfileLocation.addListener( 'searchLocation', function (){

                    that.isSearchLocation = true;
                });
            },
            // 一旦被激活，就请求数据
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
         * 请求当前用户信息
         */
        fetch: function (){

            var that = this;
            this.setLoading( true );

            Mods.profile.getUserInfo( undefined, function ( data, user ){

                that.setLoading( false );
                if( data ){

                    Ext.Msg.alert( '获取用户信息失败! ', ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
                }
                else {

                    that.userInfo = user;
                    that.updateView();
                }
            });
        },

        setLocationInfo: function ( address, latlng ){

            this.myProfileLocation.setLocationInfo( {
                address: address,
                latlng: latlng
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
        locationSearchHash: 'sell/positionSearch',
        address: undefined,
        latlng: undefined,

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
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
                        xtype: 'button',
                        width: '25%',
                        text: '定位',
                        ui: 'confirm',
                        handler: function (){

                            Mods.route.redirect( that.locationSearchHash );
                            that.fireEvent( 'searchLocation' );
                        }
                    }
                ]
            });

            myProfileLocationCls.superclass.initComponent.call( this );
        },

        listeners: {

            afterlayout: function (){

                this.adjustSize();
            }
        },

        /**
         * 根据位置信息文字，来调整容器高度
         */
        adjustSize: function (){

            var currentLocationWrap = this.body.query( '.current-location-wrap' )[ 0 ];
            var locationButton = this.query( 'button' )[ 0 ];
            var currentHeight = Ext.get( currentLocationWrap).getHeight();
            var buttonHeight = locationButton.getHeight();
            var targetHeight = currentHeight > buttonHeight ? currentHeight : buttonHeight;

            this.body.setHeight( targetHeight );
        },

        /**
         * 获取当前的location信息
         * @return {Object} { address:, latlng: }
         */
        getLocationInfo: function (){

            return {
                address: this.address,
                latlng: this.latlng
            };
        },

        /**
         * 设置location信息，并更新视图
         * @param infoObj  { address: , latlng: }
         */
        setLocationInfo: function ( infoObj ){

            if( !this.currentLocationSpan ){

                // todo 会出现这样的错误： Cannot call method 'query' of undefined
                this.currentLocationSpan = Ext.get( this.body.query( '.current-location' )[ 0 ] );
            }

            this.address = infoObj.address;
            this.latlng = infoObj.latlng;
            var address = infoObj.address ? infoObj.address : '点击“定位”设置您的当前位置!';

            this.currentLocationSpan.setHTML( address );

            // 每次设置文字后重新设置高度
            this.adjustSize();
            Ext.get( this.el.dom ).setStyle( {
                height: 'auto'
            });
        }
    });

    Ext.reg( 'myProfileForm', myProfileFormCls );
    Ext.reg( 'myProfileLocation', myProfileLocationCls );
    Ext.reg( 'myProfile', myProfileCls );
})();
(function(){

    var Auth = App.mods.auth;
    var Mods = App.mods;

    var PreferenceCls = Ext.extend( Ext.Panel, {

        defaults: {
            margin: '30% 10%'
        },
        scroll: 'vertical',
        // 用户的偏好列表 [ 'cat1', 'cat2',...]
        userFavorList: [],

        initComponent: function (){

            var that = this;
            var defaultCats = App.models.categories;
            var options = [];

            Ext.each( defaultCats, function ( cat ){

                options.push( { text: cat, value: cat } );
            });

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '偏好设置',
                        items: [
                            {
                                xtype: 'goBackButton'
                            },
                            {   xtype: 'spacer' },
                            {
                                text: '保存',
                                ui: 'confirm',
                                handler: function(){

                                    that.setLoading( true );
                                    // 发送请求
                                    Mods.profile.updateUserInfo( undefined, { favorite: that.userFavorList.join( ',' ) }, function ( errObj ){

                                        that.setLoading( false );

                                        if( !errObj ){

                                            Ext.Msg.alert( '保存成功!' );
                                        }
                                        else {

                                            Ext.Msg.alert( '保存出错', ( errObj.error || '' ) + ( JSON.stringify( errObj.data ) || '' ) );
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'categorySelect',
                        ifUseSaveBtn: true
                    },
                    {
                        xtype: 'panel',
                        id: 'user-favor-list-panel'
                    }
                ]
            });

            PreferenceCls.superclass.initComponent.call( this );
        },
        listeners: {
            afterrender: function (){

                var that = this;

                this.favorListTpl = new Ext.XTemplate( Ext.get( 'user-favor-list-tpl' ).getHTML() );
                this.favorItemTpl = new Ext.XTemplate( Ext.get( 'user-favor-item-tpl' ).getHTML() );
                this.userFavorPanel = this.query( '#user-favor-list-panel' )[ 0 ];
                this.categorySelect = this.query( 'categorySelect' )[ 0 ];

                this.categorySelect.addListener( 'saveCat', function ( catName ){

                    // 检查分类是否已经存在
                    if( that.userFavorList.contains( catName ) ){

                        Ext.Msg.alert( '错误：', '分类:' + catName + ' 已经存在!' );
                    }
                    else {
                        that.insertFavor( catName );
                        that.userFavorList.push( catName );
                    }
                });
            },

            /**
             * 当一个分类被移除是触发
             * @param catName 被移除的分类名称
             */
            favorRemove: function ( catName ){

                debugger;
                // 从列表中清除
                this.userFavorList.remove( catName );
            },

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

                    Ext.Msg.alert( '获取用户信息失败! ', ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
                }
                else {

                    that.userFavorList = user.favorite || [];
                    that.renderFavorList();
                }
            });
        },

        /**
         * 根据 userFavorLst 渲染列表
         */
        renderFavorList: function (){

            this.favorListTpl.overwrite( this.userFavorPanel.body, this.userFavorList );
            this.attachDelCat();
        },

        /**
         * 想分类列表中插入单个分类
         * @param catName
         */
        insertFavor: function ( catName ){

            if( !this.favorUl ){

                this.favorUl = this.userFavorPanel.body.child( '.user-favor-list ul' );
            }

            this.favorItemTpl.append( this.favorUl, { name: catName } );
        },

        /**
         * 为分类列表添加 点击删除的事件
         */
        attachDelCat: function ( ){

            var that = this;

            if( !this.favorUl ){

                this.favorUl = this.userFavorPanel.body.child( '.user-favor-list ul' );
            }

            // 添加对于删除分类事件的监听
            Ext.EventManager.addListener( this.favorUl.dom, 'tap', function ( favorUl, delSpan ){

                var catName = delSpan.getAttribute( 'data-name' );
                // 删除该节点
                Ext.get( delSpan.parentNode).remove();

                // 出发 favorRemove事件
                that.fireEvent( 'favorRemove', catName );

            }, this.favorUl, { delegate: '.delete-cat' } );
        }
    });

    Ext.reg( 'preference', PreferenceCls );
})();
(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'settings',
        badgeText: '',
        layout: 'card',
        items: [
            {
                xtype: 'profileMenu'
            },
            {
                xtype: 'myProfile'
//                locationSearchHash: 'profile/positionSearch'
            },
            {
                xtype: 'preference'
//                scroll: false
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

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
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

                            that.setLoading( true );
                            Auth.logout(function ( ifSuccess, data ){

                                that.setLoading( false );

                                if( ifSuccess ){

                                    Ext.Msg.alert( '注销成功!', '', function (){

                                        Mods.route.redirect( 'welcome/login' );
                                    });
                                }
                                else {

                                    Ext.Msg.alert( "注销失败！", ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
                                }
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        text: '退出',
                        handler: function (){

                            if( navigator && navigator.app && navigator.app.exitApp ){

                                Ext.Msg.confirm( '你确定要退出么？','', function ( result ){

                                    if( result === 'yes' ){
                                        navigator.app.exitApp();
                                    }
                                } );
                            }
                        }
                    }
                ]
            });

            profileMenuCls.superclass.initComponent.call( this );
        }
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
        iconCls: 'compose',
        layout: 'card',
        cls: 'card2',
//        badgeText: '4',
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
                                xtype: 'goBackButton'
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

                Mods.route.redirect( 'sell/edit', [ item.getAttribute( 'data-id' ) ] );
            }
        },

        getSellingItem: function (){

            var that = this;

            this.setLoading( true );
            Mods.itemRequest.getSellingItem(function ( err, items ){

                if( err ){

                    Ext.Msg.alert( '获取商品列表失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
                }
                else {

                    that.resultList.clearList();
                    that.resultList.saveItems( items );
                    that.resultList.renderItems();
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

                                    // 在android下面，password被激活后貌似拥有很高的z-index，会遮挡住alert，甚至到了新的视图，依旧存在
                                    // 此处让email的textfield focus，以取消掉password部分的focus效果
                                    that.emailTextField.focus();

                                    var values = that.getValues();
                                    var model = Ext.ModelMgr.create( values, 'Login' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        that.setLoading( true );

                                        Auth.login( values.email, values.password, function( ifLogin, data ){

                                            that.setLoading( false );

                                            if( ifLogin ){

                                                Ext.Msg.alert( '登陆成功!', '', function (){

                                                    Mods.route.redirect( 'main' );
                                                    // 重置表单
                                                    that.reset();
                                                });
                                            }
                                            else {

                                                Ext.Msg.alert( "登陆失败！", ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
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
            afterrender: function (){

                this.emailTextField = this.query( 'textfield' )[ 0 ];
            },
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
    var Mods = App.mods;

    var RegisterCls =  App.views.login = Ext.extend( Ext.form.FormPanel, {
        title: '注册',
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

                                        that.setLoading( true );

                                        Request.send({
                                            method: 'post',
                                            type: that.apiType,
                                            data: values,
                                            callback: function( data ){

                                                that.setLoading( false );

                                                if( data.result ){

                                                    Ext.Msg.alert( "注册成功！", '注册成功，请登陆！', function (){

                                                        Mods.route.redirect( 'welcome/login' );
                                                    });

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
        ],
        // 所有结果id
        resultIds: [],
        // 需要被渲染到页面中的item
        resultItemsToRender: [],
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },
        listeners: {
            afterRender:function (){

                var that = this;

                this.tpl = new Ext.Template( Ext.get( 'result-item-tpl').getHTML() );
                this.initRender();

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

                this.saveItems( itemBak );
                this.renderItems();
            }
        },

        /**
         * 清空列表
         */
        clearList: function (){

            this.body.setHTML( '' );
            this.resultItems = [];
            this.resultItemsToRender = [];
            this.resultIds = [];
        },

        /**
         * 插入结果项
         * @param itemInfo {Object|Array} 可以插入一个或者多个
         */
        insertItem: function ( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            var that = this;
            this.resultItems = this.resultItems.concat( newItems );
        },

        /**
         * 保存结果以便后期渲染
         * @param itemInfo
         */
        saveItems: function( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            // 新的item都将放入 用来表明这些item尚未被渲染过
            this.resultItemsToRender = this.resultItemsToRender.concat( newItems );
            this.resultItems = this.resultItems.concat( newItems );
        },

        /**
         * 渲染所有还未渲染的item
         */
        renderItems: function (){

            var that = this;

            Ext.each( this.resultItemsToRender, function ( item ){

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

            // 渲染完毕，清空
            this.resultItemsToRender = [];
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

            // 对文字内容描述做裁剪
            item.title = item.title.length > 6 ? item.title.substring( 0, 6 ) : item.title;
            item.desc = item.desc.length > 18 ? item.desc.substring( 0, 18 ) : item.desc;
            item.address = item.address.length > 9 ? item.address.substring( 0, 9 ) : item.address;

            // 对标题进行裁剪

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
                                xtype: 'goBackButton'
                            },
                            { xtype: 'spacer' },
                            {
                                text: '购买',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                    Mods.profile.addBuyRecord( that.itemId );
                                    Mods.route.redirect( 'buy/buyIt' );
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
                address: item.address,
//                sellerName: item.user.email,
//                date: 'hello~',
                email: item.user.email,
                QQ: item.user.qq,
                wangwang: item.user.wangwang
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

            this.itemId = itemId;
            var that = this;
            this.setLoading( true );
            Mods.itemRequest.getItemById( itemId, function ( err, item ){

                if( err ){

                    Ext.Msg.alert( '获取商品信息失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
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
            // 每次重新渲染之后都清空
            this.addImgs = [];
            this.removeImgs = [];

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
(function(){

    var Mods = App.mods;
    var Config = App.config;

    var NewItemCls = Ext.extend( Ext.Panel, {

        defaults: {
            margin: '30% 10%'
        },
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
                                xtype: 'goBackButton'
                            },
                            { xtype: 'spacer' },
                            {
                                text: '发布',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                    var data = that.getNewItemInfo();
                                    var model = Ext.ModelMgr.create( data, 'Item' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        that.setLoading( true );

                                        Mods.itemRequest.addItem( data, function ( ifSuccess, d ){

                                            that.setLoading( false );

                                            if( ifSuccess ){

                                                Ext.Msg.alert( '商品添加成功', '', function (){

                                                    Mods.route.redirect( 'sell/sellList' );
                                                });
                                            }
                                            else {
                                                Ext.Msg.alert( '商品添加失败！', ( d.error || '' ) + ( JSON.stringify(d.data) || ''), function (){

                                                    Mods.route.redirect( 'sell' );
                                                } );
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
                ]
            });

            NewItemCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            { xtype: 'newItemForm' },
            {
                xtype: 'categorySelect',
                ifUseSaveBtn: false,
                title: '设置商品类别<span class="title-desc">（买家能通过类别更好地定位到你的商品）</span>'
            },
            { xtype: 'myProfileLocation' },
            { xtype: 'newItemImg' }
        ],
        listeners: {
            afterRender:function (){

                this.newItemImg = this.query( 'newItemImg' )[ 0 ];
                this.newItemForm = this.query( 'newItemForm' )[ 0 ];
                this.newItemLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.categorySelect = this.query( 'categorySelect' )[ 0 ];
            }
        },

        /**
         * 设置位置信息
         * @param address 地址
         * @param latlng google的latlng对象
         */
        setLocationInfo: function ( address, latlng ){

            this.newItemLocation.setLocationInfo( {
                address: address,
                latlng: latlng
            });
        },

        getNewItemInfo: function (){

            // 若为在浏览器中调试，则使用测试数据
            var pics = Config.IF_DEVICE ? this.newItemImg.getImageUrl() : [
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi4Kz/ARBgAAIVAYFMFtU7AAAAAElFTkSuQmCC',
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpi6OXhAQgwAAHPAKaGfcCLAAAAAElFTkSuQmCC'
            ];

            var location = this.newItemLocation.getLocationInfo();
            var formData = this.newItemForm.getValues();
            var category = this.categorySelect.getCategory();
            var data = {
                title: formData.title,
                desc: formData.desc,
                price: formData.price,
                latlng: location.latlng,
                address: location.address,
                pic1: pics[ 0 ],
                pic2: pics[ 1 ],
                pic3: pics[ 2 ],
                category: category
            };

            return data;
        }
    });

    Ext.reg( 'newItem', NewItemCls );
})();
(function(){

    var NewItemFormCls = Ext.extend( Ext.form.FormPanel, {
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
