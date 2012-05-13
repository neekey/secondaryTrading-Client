(function(){

    var Mods = App.mods;

    Ext.regController( 'sell', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VSellMain = this.VMain.query( 'sell' )[ 0 ];
                this.VSellMenu = this.VSellMain.query( 'sellMenu' )[ 0 ];
                this.VSellNewItem = this.VSellMain.query( 'newItem' )[ 0 ];
                this.VSellItemDetail = this.VSellMain.query( 'itemDetail' )[ 0 ];
                this.VSellPositionSearch = this.VSellMain.query( 'positionSearch' )[ 0 ];
                this.VSellList = this.VSellMain.query( 'sellingList' )[ 0 ];
                this.VSellItemEdit = this.VSellMain.query( 'itemEdit' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VSellMain );
        },

        index: function (){

            this.menu();
        },

        newItem: function ( address, latlng ){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellNewItem );

            if( address && latlng ){
                this.VSellNewItem.setLocationInfo( address, latlng );
            }

        },

        positionSearch: function (){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellPositionSearch );
            this.VSellPositionSearch.setTargetHash();
        },

        itemDetail: function (){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellItemDetail );
        },

        menu: function (){

            this.resume();
            this.VSellMain.setActiveItem( this.VSellMenu );
        },

        sellList: function (){

            this.resume();
            this.VSellMain.setActiveItem( this.VSellList );

            this.VSellList.getSellingItem();
        },

        edit: function ( itemId ){

            if( itemId ){
                this.resume();
                this.VSellItemEdit.setItemId( itemId );
                this.VSellMain.setActiveItem( this.VSellItemEdit );
            }
        }
    });
})();
