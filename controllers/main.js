(function(){

    var Mods = App.mods;
    var Auth = Mods.auth;

    Ext.regController( 'main', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
            }

            this.viewport.setActiveItem( this.VMain );
        },

        index: function (){

            this.sell();
        },

        sell: function (){

            this.resume();
            Ext.ControllerManager.get( 'sell' ).menu();

        },

        buy: function (){

            this.resume();
            Ext.ControllerManager.get( 'sell' ).menu();
        }
    });
})();
