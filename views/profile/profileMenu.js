/**
 * setting部分的主菜单
 */
(function(){

    var Auth = App.mods.auth;
    var Mods = App.mods;

    var profileMenuCls = Ext.extend( Ext.Panel, {

        defaults: {
            xtype: 'button',
            margin: '30% 10%',
            height: 45
        },
        scroll: false,
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '个人中心'
            }
        ],
        items: [
            {
                text: '我的资料',
                ui: 'confirm',
                handler: function (){

                    Mods.route.redirect( 'profile/myProfile' );
                }
            },
            {
                text: '偏好设置',
                ui: 'confirm',
                handler: function(){

                    Mods.route.redirect( 'profile/preferences' );
                }
            },
            {
                text: '注销',
                handler: function(){

                    Auth.logout(function (){
                        Mods.route.redirect( 'welcome/login' );
                    });
                }
            }
        ]
    });

    Ext.reg( 'profileMenu', profileMenuCls );
})();
