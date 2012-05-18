/**
 * 我的资料部分控制器
 */
(function(){

    var Mods = App.mods;

    Ext.regController( 'profile', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VProfileMain = this.VMain.query( 'profile' )[ 0 ];
                this.VProfileMenu = this.VProfileMain.query( 'profileMenu' )[ 0 ];
                this.VProfileMyProfile = this.VProfileMain.query( 'myProfile' )[ 0 ];
                this.VProfilePreference = this.VProfileMain.query( 'preference' )[ 0 ];
//                this.VProfilPositionSearch = this.VProfileMain.query( 'positionSearch' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VProfileMain );
        },

        index: function (){

            this.menu();
        },

        menu: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfileMenu );
        },

        myProfile: function ( address, latlng ){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfileMyProfile );

            if( address && latlng ){
                this.VProfileMyProfile.setLocationInfo( address, latlng );
            }
        },

        positionSearch: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfilPositionSearch );
        },

        preferences: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfilePreference );
        }


    })
})();
