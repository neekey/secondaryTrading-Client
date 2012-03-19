/**
 * 整个界面的主视图
 */
(function(){

    App.views.Viewport = Ext.extend(Ext.Panel, {
        fullscreen: true,
        layout: 'card',
        cardSwitchAnimation: 'fade',
        dockedItems: [
            {
                xtype: 'toolbar',
                title: 'MvcTouch'
            }
        ]
    });
})();
