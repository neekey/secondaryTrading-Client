(function(){

    var Request = App.mods.request;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4',
        defaults: {
            xtype: 'button'
        },
        items: [
            {
                text: '注销',
                handler: function(){

                    Request.jsonp({
                        type: 'LOGOUT',
                        callback: function( data ){

                            if( data.result ){

                                Ext.Msg.alert( '注销成功', '成功注销!', function(){

                                    Ext.redirect( 'welcome/login' );
                                });
                            }
                            else {

                                Ext.Msg.alert( '注销失败', data.error );
                            }
                        }
                    }, true );
                }
            }
        ]
    });

    Ext.reg( 'profile', ProfileMainCls );
})();
