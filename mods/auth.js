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
    
})();