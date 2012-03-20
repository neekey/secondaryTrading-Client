(function(){

    Ext.regController( 'main', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
            }

            this.viewport.setActiveItem( this.VMain );
        },

        sell: function (){

            Ext.ControllerManager.get( 'sell' ).menu();
        },

        buy: function (){
            alert( 'test' );
        }
    });
})();
(function(){

    Ext.regController( 'sell', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VSellMain = this.VMain.query( 'sell' )[ 0 ];
                this.VSellMenu = this.VSellMain.query( 'sellMenu' )[ 0 ];
                this.VSellNewItem = this.VSellMain.query( 'newItem' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VSellMain );
        },

        newItem: function (){

            this.index();

            this.VSellMain.setActiveItem( this.VSellNewItem );
        },

        menu: function (){

            this.index();
            this.VSellMain.setActiveItem( this.VSellMenu );
        }
    });
})();
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
