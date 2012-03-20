(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome',
        mods: {},
        config: {},
        launch: function (){

//            Ext.ControllerManager.get( 'welcome' ); 可以利用此方法获得controller实例对象
            this.viewport = Ext.ComponentMgr.create({
                xtype: 'viewport'
            });
        }
    });

//Ext.setup({
//    icon: 'icon.png',
//    tabletStartupScreen: 'tablet_startup.png',
//    phoneStartupScreen: 'phone_startup.png',
//    glossOnIcon: false,
//    onReady: function() {
//
//        var mainStruct = new Ext.TabPanel( Ext.UIS.mainStruct.config );
//        var loginReg = new Ext.TabPanel( Ext.UIS.loginReg.config );
//
//        // 先请求是否已经登陆
//        Request.jsonp({
//            type: 'checkauth',
//            callback: function( data ){
//
//                if( data.result && data.data ){
//
//                    mainStruct.show();
//                    loginReg.hide();
//                }
//                else {
//
//                    mainStruct.hide();
//
//                    loginReg.on( 'login', function(){
//
//                        loginReg.hide();
//                        mainStruct.show();
//                    });
//
//                    loginReg.show();
//                }
//            }
//        });
//
//        mainStruct.hide();
//        loginReg.show();
//    }
//});

})();