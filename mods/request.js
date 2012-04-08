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

            var timeout = obj.timeout || 5000;
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

        send: function( obj, ifAuthAttach ){

            ifAuthAttach = ifAuthAttach || false;

            var type = obj.type;
            var callback = obj.callback;
            var data = obj.data || {};
            var url = obj.url || APIS[ type ];
            var method = obj.method;

            Ext.Ajax.request({
                url: url,
                params: data,
                method: method,
                callback: function( options, success, response ){

                    var resObj = {
                        result: success,
                        type: type,
                        error: response,
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
})();
