(function(){

    var Config = App.config;
    var Mods = App.mods;
    var Session = Config.SESSION;
    var ID_NAME = Session.ID_NAME;
    var RES_NAME = Session.RES_SESSION_FIELD_NAME;
    var sessionStore;
    var session;

    var ifAuthCheck = false;
    var ifLogin = false;

    Mods.auth = {

        /**
         * 检查当前用户是否登陆
         * @param {Function} next ( ifLogin, data ) --> data = { result:,error,data,type }
         *
         */
        checkAuth: function ( next ){

            if( !ifAuthCheck ){

                Mods.request.jsonp({

                    type: 'CHECKAUTH',
                    callback: function ( data ){

                        ifAuthCheck = true;

                        if( data.result && data.data ){

                            ifLogin = true;

                            next( true, data );
                        }
                        else {

                            ifLogin = false;

                            next( false, data );
                        }
                    }
                });
            }
            else {

                next( ifLogin );
            }
        },

        /**
         * 登陆
         * @param email
         * @param password
         * @param next ( ifLogin, data ) --> data = { result, data, error, type, login }
         */
        login: function( email, password, next ){

            var values = {
                email: email,
                password: password
            };

            Mods.request.jsonp({
                type: 'LOGIN',
                data: values,
                callback: function( data ){

                    if( data.result ){

                        ifLogin = true;

                        Ext.Msg.alert( "登陆成功！", '登陆成功!', function(){

                            next( true, data );
                        });
                    }
                    else {

                        // 该login字段表明在发送请求是是否已经处于login的状态
                        // 若已经login了，显然该请求会失败（提示已经登陆过）那么则直接人为已经登陆
                        if( data.login ){

                            ifLogin = true;

                            next( true, data );
                        }
                        else {

                            ifLogin = false;

                            Ext.Msg.alert( "登陆失败！", data.error + ': ' + JSON.stringify( data.data ), function (){

                                next( false, data );
                            });
                        }
                    }
                }
            }, true );
        },

        /**
         * 注销
         * @param next （ ifLogout )
         */
        logout: function ( next ){

            Mods.request.jsonp({
                type: 'LOGOUT',
                callback: function( data ){

                    if( data.result ){

                        Ext.Msg.alert( '注销成功', '成功注销!', function(){

                            ifLogin = false;

                            next( true, data );
                        });
                    }
                    else {

                        Ext.Msg.alert( '注销失败', data.error + ': ' + JSON.stringify( data.data ) );
                    }
                }
            }, true );
        },

        /**
         * 为需要发送的数据添加上用于session的auth数据
         */
        attach: function( data ){

            data[ RES_NAME ] = JSON.stringify({
                email: session.get( 'email' ),
                serial: session.get( 'serial' ),
                token: session.get( 'token' )
            });

            data[ ID_NAME ] = session.get( ID_NAME );

            return data;
        },

        /**
         * 从服务器返回的数据中解析出session数据, 并保存
         */
        parse: function( data ){

            var resData = data[ RES_NAME ];

            session.set( 'email', resData[ 'email'] );
            session.set( 'serial', resData[ 'serial' ] );
            session.set( 'token', resData[ 'token' ] );

            session.set( ID_NAME, data[ ID_NAME ] );

            this.save();
        },

        /**
         * 保存session数据
         */
        save: function(){

            session.save();
        },

        /**
         * 初始化
         */
        init: function(){

            sessionStore =  new Ext.data.Store({
                model: "Session"
            });

            sessionStore.load();

            if( ! ( session = sessionStore.first() ) ){

                sessionStore.add({ email: '' });

                session = sessionStore.first();

            }

            sessionStore.sync();
            sessionStore.save();
        }
    };

    Mods.auth.init();
    
})();/**
 * 获取图片模块
 */
(function(){

    var Mods = App.mods;
    /**
     *
     * @param config
     *      ifCamera: 是否拍照上传
     *      quality: 图片质量
     *      ifData: 是否以Data_URI的形式返回图片数据
     *      success: 图片获取成功回调
     *      error: 图片获取失败回调
     */
    Mods.getPicture = function( config ){

        var Camera = navigator.camera;
        var ifCamera = config.ifCamera || false;
        var quality = config.quality || 50;
        var ifData = config.ifData || false;
        var onSuccess = config.success || Ext.emptyFn;
        var onError = config.success || Ext.emptyFn;

        Camera.getPicture( onSuccess, onError, {
            quality: quality,
            destinationType: ifData ? Camera.DestinationType.DATA_URI : Camera.DestinationType.FILE_URI,
            sourceType: ifCamera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };
})();/**
 * 商品数据请求相关的方法
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    // 缓存item信息 { id -> itemOBj }
    var ItemCache = {};

    Mods.itemRequest = {

        /**
         * 根据itemid获取商品信息
         * @param id
         * @param next ( err, item ) item 返回的是单个item对象
         */
        getItemById: function ( id, next ){

            var item;
            var data;
            var that = this;

            // 先检查本地缓存中是否有数据
            if( item = ItemCache[ id ] ){

                next( undefined, item );
            }
            else {

                data = { id: id };

                this.query( data, function ( err, data ){

                    if( err ){
                        next( err );
                    }
                    else {

                        ItemCache[ id ] = data.items[ 0 ];
                        next( undefined, that.imgPathHandle( data.items[ 0 ] ) );
                    }
                });
            }
        },

        /**
         * 处理数据中包含的img信息，转化为可以请求的图片地址
         * @param items
         * @return {*}
         */
        imgPathHandle: function ( items ){

            var isArray = Ext.isArray( items );
            var item;
            var imgs;
            var img;
            var i;
            var j;
            items = isArray ? items : [ items ];

            for( j = 0; item = items[ j ]; j++, i = 0 ){

                imgs = item.imgs;

                if( imgs ){

                    for( i = 0; img = imgs[ i ]; i++ ){

                        imgs[ i ] = Config.APIHOST + 'img?id=' + img._id;
                    }
                }
            }

            return isArray ? items : items[ 0 ];
        },

        /**
         * 根据给定的id数组，返回item数组
         * @param ids
         * @param next ( err, items )
         */
        getItemsByIds: function ( ids, next ){

            var data = { ids: ids.join( ',' ) };
            var that = this;

            this.query( data, function ( err, data ){

                if( err ){
                    next( err );
                }
                else {
                    next( err, that.imgPathHandle( data.items ) );
                }
            });
        },

        /**
         * 检索商品
         * @param data
         * @param next （ data, items ) --> data = { result:, error, type, data }若成功，则data为undefined
         */
        query: function ( data, next ){

            Mods.request.send({
                method: 'get',
                data: data,
                type: 'QUERY_ITEM',
                callback: function ( d ){

                    var resData = d.data;
                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, data );
                    }
                    else {

                        next( d )
                    }
                }
            }, true );
        }
    };

})();/**
 * 与地图以及位置相关的模块
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    var APIS = Config.APIS;

    Mods.map = {

        /**
         * 获取当前的地理位置信息
         * @param next ( ifSuccess, resultData ) resultData = { addressConponent, formattedAddress, location}
         */
        getCurrentLocation: function ( next ){
            var that = this;

            this.getCurrentLatLng( function ( err, latlng ){

//                alert( 'getCurrentLatLng callback' );

                if( err ){

                    Ext.Msg.alert( '获取当前GPS信息出错: ' + JSON.stringify( err ), function(){

                        next( false );
                    });
                }
                else {
                    that.getRAR(latlng.lat, latlng.lng, function ( errData, result ){

                        if( errData ){

                            Ext.Msg.alert( '获取当前位置信息失败! ', '', function (){

                                next( true, result );
                            } );
                        }
                        else {
                            next( true, result );
                        }
                    });
                }

            });
        },

        /**
         * 获取当前GPS信息
         */
        getCurrentLatLng: function( next ){

//            alert( 'getCurrentLatLng' );
            navigator.geolocation.getCurrentPosition(function(position) {

                var coords = position.coords;

                next( undefined, {
                    lat: coords.latitude,
                    lng: coords.longitude
                });
            }, function( err ){

                next( err );
            }, { enableHighAccuracy: true });
        },
        /**
         * 反向地址解析
         * Reverse Address Resolution
         * @param {String} lat
         * @param {String} lng
         * @param {Function} next( data, resultData ) --> data = { result, type, data }
         */
        getRAR:function( lat, lng, next ){

//            alert( 'getRAR' );
            var Request = Mods.request;
            var that = this;
            var url = APIS[ 'GEO' ];

            Request.send({
                url: url + '?latlng=' + lat + ',' + lng + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

                    var result = res.result;
                    var data = res.data;

                    if( result ){

                        next( undefined, that.resultHandle( res.data ) );
                    }
                    else {

                        next( data, that.resultHandle( res.data ) );
                    }
                }
            });
        },

        /**
         * 地址解析
         * Address Resolution
         * @param {String} address 地址
         * @param {Function} next( data, addressData ) 若请求成功，data为undefined data = { result, type, data }
         * //todo 比如"浙江工业大学“这样的地址无法得到搜索结果的问题
         */
        getAR: function ( address, next ){

            var Request = Mods.request;
            var that = this;
            var url = APIS[ 'GEO' ];

            alert( 'getAR' );
            alert( 'url:' +url + '?address=' + encodeURIComponent( address ) + '&sensor=true&t=' + Date.now() );
            Request.send({
                url: url + '?address=' + address + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

                    var result = res.result;
                    var data = res.data;

                    if( result ){
                        next( undefined, that.resultHandle( res.data ) );
                    }
                    else {
                        next( res, that.resultHandle( res.data ) );
                    }
                }
            });
        },

        /**
         * 对数据进行预处理
         * @param data
         * @return {Object}
         * //todo 对结果进行重构   应该将多个result成员都呈现出来
         */
        resultHandle: function ( data ){

            if( !data ){
                data = {};
            }

            if( !data.results ){

                data.results = [{
                    address_components: [],
                    formatted_address: '',
                    geometry: {
                        location: {}
                    }
                }];
            }

            var result = {
                addressConponent: data.results[ 0 ].address_components,
                formattedAddress: data.results[ 0 ].formatted_address,
                location: data.results[ 0 ].geometry.location
            };

            return result;
        }
    };
    
})();(function(){

    var Config = App.config;
    var Mods = App.mods;
    var APIS = Config.APIS;
    var JSONP_KEY = Config.API_JSONP_KEY;
    var JSONP = Ext.util.JSONP;
    var Auth = Mods.auth;

    Mods.request = {

        /**
         * 进行jsonp请求
         * @param obj
         *      type: url类型（指定在config.js中定义的url)
         *      data: 附加的请求参数
         *      callback: 回调
         *      timeout: 超时的毫秒数
         * @param {Boolean} ifAuthAttach 是否附带上认证参数
         */
        jsonp: function( obj, ifAuthAttach ){

            ifAuthAttach = ifAuthAttach || false;

            var type = obj.type;
            var callback = obj.callback;
            var data = obj.data || {};

            var timeout = obj.timeout || 30000;
            var ifTimeout = false;
            var timer;

            var url = obj.url || APIS[ type ];

            if( url ){

                if( type !== 'GEO' ){
                    Auth.attach( data );

                }

                // 先请求是否已经登陆
                JSONP.request({
                    url: url,
                    callbackKey: JSONP_KEY,
                    params: data,
                    callback: function( data ){

                        if( !ifTimeout ){

                            clearTimeout( timer );

                            ifAuthAttach && Auth.parse( data );

                            if( typeof callback === 'function' ){

                                callback( data );
                            }
                        }
                    }
                });

                // 用于超时检测
                timer = setTimeout(function (){

                    ifTimeout = true;
                    callback( { result: false } );
                }, timeout );
            }
        },

        /**
         * 发送请求
         * @param obj {
         *      type: 数据请求类型 一个对应请求url的字符串 比如 （ LOGIN ),
         *      callback: 回调  ( data ) data --> { result: 请求是否成功, type: 与obj.type一致，data: 服务器返回的数据 }
         *      data: 附带的数据
         *      url: 若制定url则会覆盖type对应的连接
         *      method: 制定 post 还是 get
         * }
         * @param ifAuthAttach
         */
        send: function( obj, ifAuthAttach ){

            ifAuthAttach = ifAuthAttach || false;

            var type = obj.type;
            var callback = obj.callback;
            var data = obj.data || {};
            var url = obj.url || APIS[ type ];
            var method = obj.method;

            if( url ){

                if( type !== 'GEO' ){
                    Auth.attach( data );

                }

                //todo 添加超时
                Ext.Ajax.request({
                    url: url,
                    params: data,
                    method: method,
                    callback: function( options, success, response ){

                        var resObj = {
                            result: success,
                            type: type,
                            data: JSON.parse( response.responseText || '{}' )
                        };

                        if( type !== 'GEO' ){
                            ifAuthAttach && Auth.parse( resObj.data );

                        }

                        if( typeof callback === 'function' ){

                            callback( resObj );
                        }
                    },
                    disableCaching: false
                });
            }
        }
    }
})();
(function(){

    var FILE_KEY = 'image';
    var Mods = App.mods;

    Mods.upload = {

        /**
         * 进行图片上传
         * @param {String} url 图片上传地址
         * @param {String} imageURI 图片本地URI
         * @param {Object} op {
         *  success
         *  error
         *  params      和图片一起发送的其他字段
         * }
         */
        upload: function( url, imageURI, op ){

            var options = new FileUploadOptions();
            var Auth = Ext.MODS.auth;
            var params = op.params || {};
            var ft = new FileTransfer();

            options.fileKey= FILE_KEY;
            options.fileName= imageURI.substr( imageURI.lastIndexOf('/') + 1 );
            options.mimeType= "image/png";

            // 附加权限验证字段
            Auth.attach( params );

            options.params = params;

            ft.upload( imageURI, url, op.success, op.error, options );
        }
    }
})();