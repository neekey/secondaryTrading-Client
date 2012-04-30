(function(){

    /**
     * 对于所有路由的预处理
     */
    Ext.Dispatcher.addListener( 'dispatch', function ( obj ){

        var Auth = App.mods.auth;

        console.log( 'router dispatch:', obj );

        // 检查登陆状态
        Auth.checkAuth(function ( ifLogin ){

            var action = obj.action;
            var controller = obj.controller;
            // 由于sencha 的 route 只能有 controller/action 不能继续加参数，因此用这种方式实现 detail 的的id
            // itemdetail/id 由于 itemdetail 这个控制其没有定义过，因此 controller为null，但是还是可以从historyUrl中读取到
            // action为id值
            var controllerName = controller ? controller.id : obj.historyUrl.split( '/' )[ 0 ];

            if( controllerName === 'welcome' ){

                if( ifLogin ){

                    Ext.redirect( 'main' );
                }
            }
            else {

                if( !ifLogin ){

                    Ext.redirect( 'welcome' );
                    return;
                }

                // 若为商品详情
                if( controllerName === 'itemdetail' ){

                    var buyController = Ext.ControllerManager.get( 'buy' );
                    buyController.itemDetail( action );

                }
            }
        });
    });
})();
