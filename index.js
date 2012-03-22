(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'main',
        mods: {},
        config: {},
        launch: function (){

            this.viewport = Ext.ComponentMgr.create({
                xtype: 'viewport'
            });
        }
    });

})();