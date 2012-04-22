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
        defaults: {
            scroll: 'vertical'
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
        cls: 'card2',
        badgeText: '4',
        items: [
            {
                xtype: 'itemSearch'
            }
        ]
    });

    Ext.reg( 'buy', BuyMainCls );
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
})();(function(){


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
            latlng: '',
            address: ''
        },
        // 是否已经自动获取过当前位置
        ifAutoLocation: false,
        handler: function(){

            this.overlay.show();
        },

        /**
         * 请求位置信息
         * @param address 用户输入的搜索词
         * @param next
         */
        requestLocation: function ( address, next ){

            if( address ){

                Mods.map.getAR( address, next );
            }
            else {

                Mods.map.getCurrentLocation(function ( result ){

                    next( result );
                });
            }
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

                        that.requestLocation( undefined, function ( result ){

                            console.log( 'result', result );
                            alert( 'result:' + JSON.stringify( result ) );
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

                                        that.locationButton.requestLocation( address, function ( result ){

                                            console.log( 'result', result );
                                            alert( 'result:' + JSON.stringify( result ) );
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
(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4',
        defaults: {
            xtype: 'button'
        },
        items: [
            {
                text: '注销',
                handler: function(){

                    Auth.logout(function (){
                        Ext.redirect( 'welcome/login' );
                    });
                }
            }
        ]
    });



    Ext.reg( 'profile', ProfileMainCls );
})();
(function(){

    var SellMenuCls = App.views.sellMenu = Ext.extend( Ext.Panel, {

        id: 'wannaSell-index',
        defaults: {
            xtype: 'button',
            cls  : 'demobtn',
            height: '50',
            margin: '0 0 10 0'
        },
        items: [
            {
                ui  : 'action',
                text: '添加新商品',
                handler: function(){

                    Ext.redirect( 'sell/newItem' );
                }
            },
            {
                ui  : 'action',
                text: '出售中的商品',
                handler: function (){

                    Ext.redirect( 'sell/itemDetail' );
                }
            }
        ],
        dockedItems: [

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
                xtype: 'itemDetail'
            }
        ]
    });

    Ext.reg( 'sell', SellMainCls );
})();
(function(){

    var Request = App.mods.request;
    var Auth = App.mods.auth;

    var LoginCls = App.views.login = Ext.extend( Ext.form.FormPanel, {

        title: '登陆',
        scroll: 'vertical',
        id: 'welcome-login',
        apiType: 'LOGIN',

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

                                                Ext.redirect( 'main' );
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
                        title: '商品搜索',
                        items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: '输入你需要的商品',
                                width: '80%'
                            },
                            {
                                text: '搜索',
                                ui: 'confirm',
                                align: 'end',
                                width: '15%',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'resultList'
                    },
                    {
                        xtype: 'button',
                        text: '查看更多结果',
                        style: {
                            margin: '1% 5% 10px 5%'
                        },
                        handler: function (){

                            that.resultList.insertItem({
                                address: 'nihaoaijoa',
                                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                                title: 'dafadfa',
                                desc: 'daffddaffda',
                                price: '1243414'
                            });

                            that.doLayout();
                        }
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: false,

        listeners: {
            afterRender:function (){

                this.resultList = this.query( 'resultList')[ 0 ];
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
            price: ''
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

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },

        defaults: {
            xtype: 'resultItem',
            itemInfo: {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414'
            }
        },
        items: [
            {}, {}, {}
        ],
        scroll: false,
        listeners: {
            afterRender:function (){

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

        insertItem: function ( itemInfo ){

            var items = this.items;

            this.insert( items.length, {
                xtype: 'resultItem',
                itemInfo: itemInfo
            })
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
                                    Ext.redirect( 'main/sell' );
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
                    that.setItemTextInfo( {
                        title: '标题',
                        desc: '这是商品描述。商品九成新！橙色非常不错，由于买了更好的，所以转让！',
                        price: '9999',
                        location: '浙江工业大学',
                        sellerName: 'Neekey',
                        date: '2011-01-02',
                        email: 'ni@gmail.com',
                        QQ: '1987987979',
                        wangwang: '9879790'
                    });

                    that.setPics( [
                        'http://3.s3.envato.com/files/1124114/1item_preview.jpg',
//                    'http://3.s3.envato.com/files/1209789/0_itempreview.jpg',
                        'http://0.s3.envato.com/files/1208187/pdfs_php.jpg'
                    ]);
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

        itemDataHandle: function ( formData, location, pics ){
        },

        /**
         * 设置图片
         * @param pics
         */
        setPics: function ( pics ){

            this.picSlide.setPics( pics );
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
                                    Ext.redirect( 'main/sell' );
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
            { xtype: 'locationButton' },
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
        cls: 'new-item-imgs',
        height: 150,
        defaults: {
            xtype: 'imageCapture',
            height: 100,
            width: '30%',
            margin: '0 5.2% 0 5.2%',
            style: {
                background: 'red'
            },
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
