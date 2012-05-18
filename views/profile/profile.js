(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'settings',
        badgeText: '',
        layout: 'card',
        items: [
            {
                xtype: 'profileMenu'
            },
            {
                xtype: 'myProfile'
//                locationSearchHash: 'profile/positionSearch'
            },
            {
                xtype: 'preference'
//                scroll: false
            }
        ]
    });



    Ext.reg( 'profile', ProfileMainCls );
})();
