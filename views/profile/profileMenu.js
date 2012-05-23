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

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
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

                            that.setLoading( true );
                            Auth.logout(function ( ifSuccess, data ){

                                that.setLoading( false );

                                if( ifSuccess ){

                                    Ext.Msg.alert( '注销成功!', '', function (){

                                        Mods.route.redirect( 'welcome/login' );
                                    });
                                }
                                else {

                                    Ext.Msg.alert( "注销失败！", ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
                                }
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        text: '退出',
                        handler: function (){

                            if( navigator && navigator.app && navigator.app.exitApp ){

                                Ext.Msg.confirm( '你确定要退出么？','', function ( result ){

                                    if( result === 'yes' ){
                                        navigator.app.exitApp();
                                    }
                                } );
                            }
                        }
                    }
                ]
            });

            profileMenuCls.superclass.initComponent.call( this );
        }
    });

    Ext.reg( 'profileMenu', profileMenuCls );
})();
