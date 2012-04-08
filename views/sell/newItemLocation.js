(function(){
    var Mods = App.mods;

    var NewItemLocationCls = Ext.extend( Ext.Button, {
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'decline',
        text: '为商品定位',
        margin: '0 15% 0 15%',
        handler: function(){

            alert( 'test!@');
            Mods.map.getCurrentLocation(function ( result ){

                alert( JSON.stringify( result ) );
            });
//            Map.getCurrentLatLng(function( err, latLng ){
//
//                console.log( latLng );
//                Map.getRAR( latLng.lat, latLng.lng, function( res ){
//
//                    alert( JSON.stringify( res ) );
//                });
//            });
        }
    });

    Ext.reg( 'newItemLocation', NewItemLocationCls );
})();
