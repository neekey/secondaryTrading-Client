(function(){

    var Mods = App.mods;
    var DefaultAction = 'index';

    Mods.route = (function (){

        var Route = {

            // 用来保存路由的变化的过程队列
            hashQueue: [],

            /**
             * 设置hash
             * @param newHash 要设置的hash值
             * @param ifSilent 是否为安静地设置，而不出发route事件
             */
            redirect: function ( newHash, params, ifSilent ){

                if( !Ext.isArray( params ) ){

                    ifSilent = params;
                    params = [];
                }

                var currentHash = this.getHash();

                if( currentHash !== newHash ){

                    this.saveHashQueue( currentHash );
                }

                newHash = this.attachParam( newHash, params );

                if( ifSilent ){

                    Ext.History.add( newHash );
                }
                else {
                    window.location.hash = newHash;
                }
            },

            /**
             * 返回到上一个hash
             */
            goBack: function ( params ){

                var previousHash = this.getPreviousHash( true );

                previousHash = this.attachParam( previousHash, params );

                window.location.hash = previousHash;
            },

            attachParam: function ( hash, params ){

                if( params && params.length > 0 && hash.indexOf( '?' ) < 0 ){

                    hash += '?';
                }

                Ext.each( params, function ( param ){

                    hash += ( param  + '/' );
                });

                return hash;
            },

            saveHashQueue: function ( newHash ){

                newHash = newHash || '';

                this.hashQueue.push( newHash.split( '?' )[ 0 ] );
            },

            /**
             * 获取当前的hash
             * @return {*}
             */
            getHash: function (){

                return Ext.History.getToken();
            },

            /**
             * 获取上一个hash值
             * @param ifDel 获取hash值后是否将上一个hash删除
             * @return {String}
             */
            getPreviousHash: function ( ifDel ){

                var previousHash;

                if( ifDel ){

                    previousHash = this.hashQueue.pop();
                }
                else {

                    previousHash = this.hashQueue[ this.hashQueue.length - 1 ];
                }

                return previousHash || '';
            },

            /**
             * 为当前或者制定的hash应用route规则
             * @param hash 需要指定的hash值，如果不给定，则为当前的hash
             */
            applyHash: function ( hash ){

                var oldHash = this.getHash();
                if( hash === undefined ){
                    hash = oldHash;
                }

                if( hash == oldHash ){

                    this._onHashChange( hash );
                }
                else {

                    this.redirect( hash );
                }
            },

            /**
             * hash 的 路由
             * @param newHash
             * @private
             */
            _onHashChange: function ( newHash ){

                var Auth = App.mods.auth;

                var chunks = newHash.split( '?' );
                var slugs = chunks[ 0 ].split( '/' );
                var params = chunks[ 1 ] ? chunks[ 1 ].split( '/' ) : [];
                // 第一个参数为控制器
                var controllerSlug = Ext.ControllerManager.get( slugs[ 0 ] ) ? slugs[ 0 ] : 'welcome';
                // 第二个参数为action
                var actionSlug = slugs[ 1 ] || DefaultAction;
                // 剩下的参数为传递给控制器的参数
                var _arguments = params;

                var controller = Ext.ControllerManager.get( controllerSlug );
                var action;

                if( controller ){

                    action = controller[ actionSlug ] || controller[ 'index' ];

                    if( action ){

                        // 检查登陆状态
                        Auth.checkAuth(function ( ifLogin ){

                            if( controllerSlug === 'welcome' ){

                                if( ifLogin ){

                                    Mods.route.redirect( 'main' );
                                    return;
                                }
                            }
                            else {

                                if( !ifLogin ){

                                    Mods.route.redirect( 'welcome' );
                                    return;
                                }
                            }

                            action.apply( controller, _arguments );
                        });
                    }
                }
            }
        };

        Ext.History.addListener( 'change', Route._onHashChange );

        return Route;
    })();


})();
