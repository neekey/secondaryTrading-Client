/**
 * 欢迎 包含 登陆 和 注册
 */
(function(){

    Ext.regController( 'welcome', {


        index: function (){

            if( !this.VWelcome ){

                this.VWelcome = this.render({
                    xtype: 'welcome'
                });

                this.VLogin = this.VWelcome.query( '#welcome-login' )[ 0 ];
                this.VRegister = this.VWelcome.query( '#welcome-register' )[ 0 ];
            }

            this.application.viewport.setActiveItem( this.VWelcome );
//            this.login();
        },

        /**
         * 登陆
         */
        login: function (){

            this.index();

            this.VWelcome.setActiveItem( this.VLogin );

        },

        /**
         * 注册
         */
        register: function (){

            this.index();

            this.VWelcome.setActiveItem( this.VRegister );
        }
    });
})();
