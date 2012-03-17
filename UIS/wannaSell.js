(function(){

    var wannaSellModule = {};
    var wannaSellInstance;
    var wannaSellConfig = wannaSellModule.config = {
        title: '我要卖',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4',
        items: [
            Ext.UIS.WS.index.config,
            Ext.UIS.WS.newItem.config
        ]
    };

    Ext.UIS.wannaSell = wannaSellModule;
})();