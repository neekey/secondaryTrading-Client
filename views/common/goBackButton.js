(function(){

    var Mods = App.mods;

    var GoBackButtonCls = Ext.extend( Ext.Button, {

        ui: 'back',
        text: '返回',
        handler: function (){

//            var previousHash = Mods.route.getPreviousHash();
//            var backHash = previousHash.indexOf( '/' ) > 0 ? previousHash.split( '/' )[ 0 ] : previousHash;

            Mods.route.goBack();
        }
    });

    Ext.reg( 'goBackButton', GoBackButtonCls );
})();
