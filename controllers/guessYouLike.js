/**
 * 我要买部分控制器
 */
(function(){

    Ext.regController( 'guessYouLike', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VGSMain = this.VMain.query( 'guessYouLike' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VGSMain );
        },

        index: function (){

            this.resume();
        }
    });
})();
