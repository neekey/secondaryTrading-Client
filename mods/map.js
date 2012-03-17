/**
 * 与地图以及位置相关的模块
 */
(function(){

    Ext.MODS.map = {

        /**
         * 获取当前GPS信息
         */
        getCurrentLatLng: function( next ){

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

            var Request = Ext.MODS.request;

            Request.send({
                method: 'GET',
                type: 'geo',
                data: {
                    latlng: lat + ',' + lng,
                    sensor: true
                },
                callback: function( res ){

                    next( res );
                }
            });
        }
    };
    
})();