/**
 * 主界面视图
 */
(function(){

    var MainCls = App.views.main = Ext.extend( Ext.TabPanel, {

        tabBar: {
            dock: 'bottom',
            layout: {
                pack: 'center'
            }
        },
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade',
            cover: true
        },
        listeners: {
            afterrender: function(){
            }
        },
        items: [
            { xtype: 'sell' },
            { xtype: 'buy' },
            { xtype: 'profile' }
        ]
    });

    Ext.reg( 'main', MainCls );
})();