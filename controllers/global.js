(function(){

    /**
     * 对于所有路由的预处理
     */
    Ext.Dispatcher.addListener( 'dispatch', function ( obj ){

        var action = obj.action;
        var controller = obj.controller;
        var controllerName = controller.id;
        var Auth = App.mods.auth;

        console.log( action, controllerName );
        // 检查登陆状态
        Auth.checkAuth(function ( ifLogin ){

            if( controllerName === 'welcome' ){

                if( ifLogin ){

                    Ext.redirect( 'main' );
                }
            }
            else {

                if( !ifLogin ){

                    Ext.redirect( 'welcome' );
                }
            }
        });

    });
})();
