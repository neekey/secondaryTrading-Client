/**
 * 与地图以及位置相关的模块
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;

    var CachedCurrentLocation;

    Mods.map = {

        /**
         * 获取当前GPS信息
         * @param {Function} next( errMsg, { lat, lng }
         * @param {Number} timeout
         */
        getCurrentLatLng: function( next, timeout ){

            var stTimeout = 2000;
            timeout = timeout || 30000;

            var browserSupportFlag =  new Boolean();
            var geolocationType = '';

            // 设置2s超时，若超时，则再次请求GPS进行定位
            if( window.plugins.stGeolocation ){

                browserSupportFlag = true;
                geolocationType = 'stGeolocation';

                Mods.util.timeoutWrap( window.plugins.stGeolocation.get, [], function ( err, location ){

                    if( err ){

                        onError( err );
                    }
                    else {

                        location.coords = {
                            latitude: location.latitude,
                            longitude: location.longitude
                        };

                        onSuccess( location );
                    }
                }, stTimeout, stTimeoutHandle, window.plugins.stGeolocation );
            }
            // Try W3C Geolocation (Preferred)
            else if(navigator.geolocation) {

                browserSupportFlag = true;
                geolocationType = 'geolocation';

                // 获取地理位置，并设置超时
                navigator.geolocation.getCurrentPosition( onSuccess, onError, { enableHighAccuracy: true, timeout: timeout });

                // Try Google Gears Geolocation
            } else if (google.gears) {

                browserSupportFlag = true;
                geolocationType = 'gears';

                var geo = google.gears.factory.create('beta.geolocation');
                geo.getCurrentPosition( onSuccess, onError );

                // Browser doesn't support Geolocation
            } else {
                browserSupportFlag = false;
                handleNoGeolocation(browserSupportFlag);
            }

            /**
             * 成功获取到地理位置信息
             * @param position { coords: { latitude: , longitude: }, timestamp: }
             */
            function onSuccess( position ){

                var coords = position.coords;

                // 缓存结果
                CachedCurrentLocation = {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                };

                next( undefined, {
                    lat: coords.latitude,
                    lng: coords.longitude
                });
            }

            function onError( err ){

                var code = err.code;
                var message = err.message;
                var msg;


                if( !code && !message ){

                    msg = '地理位置信息获取失败：' + err ;
                }else {

                    msg = '地理位置信息获取失败：Code: ' + code + ' Message: ' + message;
                }

                handleNoGeolocation( browserSupportFlag, msg )
            }

            function handleNoGeolocation(errorFlag, msg ) {

                if (errorFlag == true) {
                    msg = msg || ''
                } else {
                   msg = '您当前设备不支持地理信息获取';
                }

                next( msg );
            }

            function stTimeoutHandle(){

                if( geolocationType === 'stGeolocation' ){

                    browserSupportFlag = true;
                    geolocationType = 'geolocation';

                    // 获取地理位置，并设置超时1分钟
                    navigator.geolocation.getCurrentPosition( onSuccess, onError, { enableHighAccuracy: true, timeout: timeout });
                }
            }

        },

        /**
         * 进行地址解析
         * @param obj { address: '', latLng: 一个google Map LatLng对象 }
         * @param next ( err, address, latlng ) 若使用 address 搜索 结果为 [ { address: , location: }]
         */
        geocode: function ( obj, next ){

            if( !this.geocoder ){

                this.geocoder = new google.maps.Geocoder();
            }

            Mods.util.timeoutWrap( this.geocoder.geocode, [ obj ], function ( results, status ){

                if ( status == google.maps.GeocoderStatus.OK ) {

                    if( obj.latLng ){
                        // 结果的范围由精确到大范围 比如 .....华星路 最后到 中国 所以一般我们选 第一个
                        if ( results[ 0 ]) {

                            next( undefined, results[0].formatted_address, results[0].geometry.location );
                        }
                    }
                    else if( obj.address ) {

                        var addressResult = [];

                        Ext.each( results, function ( result ){

                            addressResult.push({
                                address: result.formatted_address,
                                location: result.geometry.location
                            });
                        });

                        next( undefined, addressResult );
                    }

                } else {

                    next( '地址查询失败! 错误代码：' + status );
                }
            }, 20000, onTimeout, this.geocoder );

            function onTimeout(){

                next( '地址解析超时，请重试!' );
            }

        },

        /**
         * 根据给定的一群点，获取一个bounds
         * @param {Array} locations google map LatLng 对象数组
         */
        getBoundsByLocations: function ( locations ){

            var maxLat = undefined;
            var maxLng = undefined;
            var minLat = undefined;
            var minLng = undefined;

            Ext.each( locations, function ( location ){

                var lat = location.lat();
                var lng = location.lng();

                if( maxLat === undefined || lat > maxLat ){

                    maxLat = lat;
                }

                if( minLat === undefined || lat < minLat ){

                    minLat = lat;
                }

                if( maxLng === undefined || lng > maxLng ){

                    maxLng = lng;
                }

                if( minLng === undefined || lng < minLng ){

                    minLng = lng;
                }
            });

            return new google.maps.LatLngBounds( new google.maps.LatLng( maxLat, minLng ),
                new google.maps.LatLng( minLat, maxLng ) );
        },

        /**
         * 获取已经缓存过的位置信息
         * @return {Object} { latitude: , longitude }
         */
        getCachedCurrentLocation: function (){

            return CachedCurrentLocation;
        },

        /**
         * 对数据进行预处理
         * @param data
         * @return {Object}
         * //todo 对结果进行重构   应该将多个result成员都呈现出来
         */
        resultHandle: function ( data ){

            if( !data ){
                data = {};
            }

            if( !data.results ){

                data.results = [{
                    address_components: [],
                    formatted_address: '',
                    geometry: {
                        location: {}
                    }
                }];
            }

            var result = {
                addressConponent: data.results[ 0 ].address_components,
                formattedAddress: data.results[ 0 ].formatted_address,
                location: data.results[ 0 ].geometry.location
            };

            return result;
        }
    };
    
})();