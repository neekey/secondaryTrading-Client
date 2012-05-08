(function(){

    var Mods = App.mods;

    Ext.regController( 'sell', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VSellMain = this.VMain.query( 'sell' )[ 0 ];
                this.VSellMenu = this.VSellMain.query( 'sellMenu' )[ 0 ];
                this.VSellNewItem = this.VSellMain.query( 'newItem' )[ 0 ];
                this.VSellItemDetail = this.VSellMain.query( 'itemDetail' )[ 0 ];
                this.VSellList = this.VSellMain.query( 'sellingList' )[ 0 ];
                this.VSellItemEdit = this.VSellMain.query( 'itemEdit' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VSellMain );
        },

        newItem: function (){

            this.index();

            this.VSellMain.setActiveItem( this.VSellNewItem );
        },

        itemDetail: function (){

            this.index();

            this.VSellMain.setActiveItem( this.VSellItemDetail );
        },

        menu: function (){

            this.index();
            this.VSellMain.setActiveItem( this.VSellMenu );
        },

        sellList: function (){

            this.index();
            this.VSellMain.setActiveItem( this.VSellList );

            this.VSellList.getSellingItem();
        },

        edit: function ( itemId ){

            if( itemId ){
                this.index();
                this.VSellItemEdit.setItemId( itemId );
                this.VSellMain.setActiveItem( this.VSellItemEdit );
            }
        }
    });
})();
