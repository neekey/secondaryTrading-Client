(function(){

    var Mods = App.mods;
    var Auth = Mods.auth;

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

            Ext.ControllerManager.get( 'sell' ).menu();
        }
    });
})();
