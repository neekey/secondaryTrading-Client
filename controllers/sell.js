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
