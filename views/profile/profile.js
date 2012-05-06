(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        badgeText: '',
        layout: 'card',
        items: [
            {
                xtype: 'profileMenu'
            },
            {
                xtype: 'myProfile'
            }
        ]
    });



    Ext.reg( 'profile', ProfileMainCls );
})();
