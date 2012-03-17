(function(){

var JSONP = Ext.util.JSONP;
var APIHost = Ext.STConfig.APIHOST;
var APICheckAuth = APIHost + 'checkauth';
var Auth = Ext.MODS.auth;
var Request = Ext.MODS.request;

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome/login',
        launch: function (){

        }
    });
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        var mainStruct = new Ext.TabPanel( Ext.UIS.mainStruct.config );
        var loginReg = new Ext.TabPanel( Ext.UIS.loginReg.config );

        // 先请求是否已经登陆
        Request.jsonp({
            type: 'checkauth',
            callback: function( data ){

                if( data.result && data.data ){

                    mainStruct.show();
                    loginReg.hide();
                }
                else {

                    mainStruct.hide();

                    loginReg.on( 'login', function(){

                        loginReg.hide();
                        mainStruct.show();
                    });

                    loginReg.show();
                }
            }
        });

        mainStruct.hide();
        loginReg.show();
    }
});

})();