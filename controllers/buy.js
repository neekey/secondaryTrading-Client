/**
 * 我要买部分控制器
 */
(function(){

    Ext.regController( 'buy', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VBuyMain = this.VMain.query( 'buy' )[ 0 ];
                this.VBuySearch = this.VBuyMain.query( 'itemSearch' )[ 0 ];
                this.VBuyItemDetail = this.VBuyMain.query( 'itemDetail' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VBuyMain );
        },

        index: function (){

            this.search();
        },

        // 索索页部分
        search: function (){

            this.resume();

            this.VBuyMain.setActiveItem( this.VBuySearch );
        },

        /**
         * 商品页详情部分
         * @param {String} itemId 商品id
         */
        detail: function ( itemId ){

            this.resume();

            this.VBuyMain.setActiveItem( this.VBuyItemDetail );

            // 根据商品id请求数据
            this.VBuyItemDetail.fetch( itemId );
        }
    });
})();
