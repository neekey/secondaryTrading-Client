(function(){

    var Auth = App.mods.auth;

    var ProfileMainCls = App.views.profileMain = Ext.extend( Ext.Panel, {
        title: '设置',
        iconCls: 'organize',
        cls: 'card2',
        badgeText: '4',
        defaults: {
            xtype: 'button',
            margin: '30% 10%',
            height: 45
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '个人中心'
//                items: [
//                    {
//                        xtype: 'button',
//                        text: '返回',
//                        handler: function (){
//
//                            Ext.redirect( 'sell/menu' );
//                        }
//                    }
//                ]
            }
        ],
        items: [
            {
                text: '偏好设置',
                ui: 'confirm',
                handler: function(){

                    Auth.logout(function (){
                        Ext.redirect( 'welcome/login' );
                    });
                }
            },
            {
                text: '注销',
                handler: function(){

                    Auth.logout(function (){
                        Ext.redirect( 'welcome/login' );
                    });
                }
            }
        ]
    });



    Ext.reg( 'profile', ProfileMainCls );
})();
