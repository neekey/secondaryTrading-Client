(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome',
        mods: {},
        config: {},
        launch: function (){

            this.viewport = Ext.ComponentMgr.create({
                xtype: 'viewport'
            });

            App.mods.route.applyHash();
        }
    });

})();