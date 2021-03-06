(function(){

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

            var timeout = obj.timeout || 20000;
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
                    disableCaching: true,
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
                    callback( { error: '请求超时', result: false } );
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
         *      disableCaching: 是否不缓存数据 默认为false
         * }
         * @param ifAuthAttach
         */
        send: function( obj, ifAuthAttach ){

            ifAuthAttach = ifAuthAttach || false;

            var type = obj.type;
            var callback = obj.callback;
            var data = obj.data || {};
            var url = obj.url || APIS[ type ];
            var disableCaching = obj.disableCaching;
            var method = obj.method;

            var timeout = obj.timeout || 20000;
            var ifTimeout = false;
            var timer;

            if( url ){

                if( type !== 'GEO' ){
                    Auth.attach( data );

                }

                Ext.Ajax.request({
                    url: url,
                    params: data,
                    method: method,
                    disableCaching: true,
                    callback: function( options, success, response ){

                        if( !ifTimeout ){

                            clearTimeout( timer );

                            if( success ){

                                var data = JSON.parse( response.responseText || '{}' );

                                if( type !== 'GEO' ){
                                    ifAuthAttach && Auth.parse( data );

                                }

                                if( typeof callback === 'function' ){

                                    callback( data );
                                }
                            }
                            else {

                                callback( { error: '请求出错', result: false } );
                            }
                        }
                    }
//                    disableCaching: disableCaching === undefined ? false : disableCaching
                });

                // 用于超时检测
                timer = setTimeout(function (){

                    ifTimeout = true;
                    callback( { error: '请求超时', result: false } );
                }, timeout );
            }
        }
    }
})();
