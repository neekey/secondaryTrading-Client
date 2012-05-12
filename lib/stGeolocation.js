(function(){

    var STGGeolocation = function (){

    };

    STGGeolocation.prototype.get = function (next){


        function onSuccess( result ){

            next( undefined, result );
        }

        function onError( err ){

            next( err );
        }

        return cordova.exec( onSuccess,
            onError,
            'STGGeolocation',
            'get',
            []);

    };

    cordova.addConstructor(function (){
        cordova.addPlugin( 'stGeolocation', new STGGeolocation() );
    });

})();
