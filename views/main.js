/**
 * 主界面视图
 */
(function(){

    var Mods = App.mods;

    var MainCls = App.views.main = Ext.extend( Ext.TabPanel, {

        tabBar: {
            dock: 'bottom',
            layout: {
                pack: 'center'
            }
        },
        ui: 'light',
        cardSwitchAnimation: {
            type: 'fade',
            cover: true
        },
        listeners: {
            afterrender: function(){
            },
            cardswitch: function ( main, newCard, oldCard, index ){

                var newXtype = newCard.xtype;
                var currentHash = Mods.route.getHash();

                switch( newXtype ){

                    case 'sell': {

                        if( currentHash.split( '/' )[ 0 ] !== 'sell' ){
                            Mods.route.redirect( 'sell' );
                        }
                        break;
                    }
                    case 'buy': {

                        if( currentHash.split( '/' )[ 0 ] !== 'buy' ){
                            Mods.route.redirect( 'buy' );
                        }
                        break;
                    }
                    case 'profile': {

                        if( currentHash.split( '/' )[ 0 ] !== 'profile' ){
                            Mods.route.redirect( 'profile' );
                        }
                        break;
                    }
                    case 'guessYouLike': {

                        if( currentHash.split( '/' )[ 0 ] !== 'guessYouLike' ){
                            Mods.route.redirect( 'guessYouLike' );
                        }
                        break;
                    }
                }
            }
        },
        items: [
            { xtype: 'guessYouLike' },
            { xtype: 'sell' },
            { xtype: 'buy' },
            { xtype: 'profile' }
        ]
    });

    Ext.reg( 'main', MainCls );
})();