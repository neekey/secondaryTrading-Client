(function(){

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4'
    });

    Ext.reg( 'profile', ProfileMainCls );
})();
