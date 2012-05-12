(function(){

    var Mods = App.mods;
    var DefaultAction = 'index';

    Mods.route = (function (){

        var Route = {
            /**
             * 设置hash
             * @param newHash 要设置的hash值
             * @param ifSilent 是否为安静地设置，而不出发route事件
             */
            redirect: function ( newHash, ifSilent ){

                if( ifSilent ){

                    Ext.History.add( newHash );
                }
                else {
                    window.location.hash = newHash;
                }
            },

            /**
             * 获取当前的hash
             * @return {*}
             */
            getHash: function (){

                return Ext.History.getToken();
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

                var slugs = newHash.split( '/' );
                // 第一个参数为控制器
                var controllerSlug = slugs[ 0 ] || 'welcome';
                // 第二个参数为action
                var actionSlug = slugs[ 1 ] || DefaultAction;
                // 剩下的参数为传递给控制器的参数
                var _arguments = slugs.slice( 2 );

                var controller = Ext.ControllerManager.get( controllerSlug );
                var action;

                if( controller ){

                    action = controller[ actionSlug ];

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
