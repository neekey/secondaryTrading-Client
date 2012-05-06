/**
 * 我的资料部分控制器
 */
(function(){

    var Mods = App.mods;

    Ext.regController( 'profile', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VProfileMain = this.VMain.query( 'profile' )[ 0 ];
                this.VProfileMenu = this.VProfileMain.query( 'profileMenu' )[ 0 ];
                this.VProfileMyProfile = this.VProfileMain.query( 'myProfile' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VProfileMain );
        },

        menu: function (){

            this.index();
            this.VProfileMain.setActiveItem( this.VProfileMenu );
        },

        myProfile: function (){

            this.index();
            this.VProfileMain.setActiveItem( this.VProfileMyProfile );
        },

        preferences: function (){

        }


    })
})();
