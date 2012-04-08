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

            this.getCurrentLatLng( function ( err, latlng ){

                alert( 'getCurrentLatLng callback' );

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

            Request.send({
                url: url + '?latlng=' + lat + ',' + lng + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

//                    res = res.data;
                    alert( 'getRAR callback' );
                    next( that.resultHandle( res.data ) );
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
            var url = APIS[ 'GEO' ];

            alert( 'getAR' );
            Request.send({
                url: url + '?address=' + encodeURIComponent( address ) + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

                    alert( 'getAR cb' );
                    next( that.resultHandle( res.data ) );
                }
            });
        },

        /**
         * 对数据进行预处理
         * @param data
         * @return {Object}
         */
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