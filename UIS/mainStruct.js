(function(){

    var mainStructModule = {};

    var mainStructConfig = mainStructModule.config = {
        tabBar: {
            dock: 'bottom',
            layout: {
                pack: 'center'
            }
        },
        fullscreen: true,
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade',
            cover: true
        },
        defaults: {
            scroll: 'vertical'
        },
        listeners: {
            afterrender: function(){
                mainStructModule.instance = this;
            }
        },
        items:[ Ext.UIS.wannaBuy.config, Ext.UIS.wannaSell.config, Ext.UIS.settings.config ]
    };

    Ext.UIS.mainStruct = mainStructModule;

})();