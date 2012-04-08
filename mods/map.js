/**
 * 与地图以及位置相关的模块
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    var APIS = Config.APIS;

    Mods.map = {

        getCurrentLocation: function ( next ){
            var that = this;

            alert( 'getCurrentLocation' );

            this.getCurrentLatLng( function ( err, latlng ){

                alert( 'getCurrentLatLng callback' );
                latlng = {
                    lat: 30.2305832,
                    lng: 120.040726
                };

                that.getRAR(latlng.lat, latlng.lng, function ( result ){

                    next( result );
                });
            });
        },

        /**
         * 获取当前GPS信息
         */
        getCurrentLatLng: function( next ){

            alert( 'getCurrentLatLng' );
            navigator.geolocation.getCurrentPosition(function(position) {

                var coords = position.coords;

                next( undefined, {
                    lat: coords.latitude,
                    lng: coords.longitude
                });
            }, function( err ){

                next( err );
            }, { enableHighAccuracy: true });
        },
        /**
         * 反向地址解析
         * Reverse Address Resolution
         */
        getRAR:function( lat, lng, next ){

            alert( 'getRAR' );
            var Request = Mods.request;
            var that = this;
            var url = APIS[ 'GEO' ];

            Request.jsonp({
                url: url + '?latlng=' + lat + ',' + lng + '&sensor=true&t=' + Date.now(),
                method: 'GET',
                type: 'GEO',
//                data: {
//                    latlng: lat + ',' + lng,
//                    sensor: true
//                },
                callback: function( res ){

//                    res = res.data;
                    alert( 'getRAR callback' );
                    alert( JSON.stringify( res ) );
                    next( that.resultHandle( res ) );
                }
            });
        },

        /**
         * 地址解析
         * Address Resolution
         * @param {String} address 地址
         */
        getAR: function ( address, next ){

            var Request = Mods.request;
            var that = this;

            alert( 'getAR' );
            Request.send({
                method: 'POST',
                type: 'GEO',
                data: {
                    address: encodeURIComponent( address ),
                    sensor: true
                },
                callback: function( res ){

                    alert( 'getAR cb' );

                    alert( res );
                    next( that.resultHandle( JSON.parse( res ) ) );
                }
            });
        },

        resultHandle: function ( data ){

            var result = {
                addressConponent: data.results[ 0 ].address_components,
                formattedAddress: data.results[ 0 ].formatted_address,
                location: data.results[ 0 ].geometry.location
            };

            return result;
        }
    };
    
})();