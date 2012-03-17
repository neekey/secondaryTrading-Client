(function(){

    var JSONP = Ext.util.JSONP,
        ComQuery = Ext.ComponentQuery;


    var loginRegModule = {};
    var loginRegInstance;
    var loginRegConfig = loginRegModule.config = {
        tabBar: {
            dock: 'top',
            layout: {
                pack: 'center'
            }
        },
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade'
        },
        items: [
            Ext.UIS.login.config, Ext.UIS.register.config
        ],
        listeners: {
            afterrender: function(){
                loginRegModule.instance = loginRegInstance = this;
            }
        }
    };

    /*
    if (Ext.is.Phone) {
        loginRegConfig.fullscreen = true;
    } else {
        Ext.apply(loginRegConfig, {
            //fullscreen: true,
            autoRender: true,
            floating: true,
            modal: true,
            centered: true,
            hideOnMaskTap: false,
            height: 385,
            width: 480
        });
    }
    */

    loginRegConfig.fullscreen = true;

    Ext.UIS.loginReg = loginRegModule;
})();