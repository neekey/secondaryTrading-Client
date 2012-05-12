/**
 * 与地图以及位置相关的模块
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    var APIS = Config.APIS;

    Mods.map = {

        /**
         * 获取当前的地理位置信息
         * @param next ( ifSuccess, resultData ) resultData = { addressConponent, formattedAddress, location}
         */
        getCurrentLocation: function ( next ){
            var that = this;

            this.getCurrentLatLng( function ( err, latlng ){

//                alert( 'getCurrentLatLng callback' );

                if( err ){

                    Ext.Msg.alert( '获取当前GPS信息出错: ' + JSON.stringify( err ), function(){

                        next( false );
                    });
                }
                else {
                    that.getRAR(latlng.lat, latlng.lng, function ( errData, result ){

                        if( errData ){

                            Ext.Msg.alert( '获取当前位置信息失败! ', '', function (){

                                next( true, result );
                            } );
                        }
                        else {
                            next( true, result );
                        }
                    });
                }

            });
        },

        /**
         * 获取当前GPS信息
         * @param {Function} next( errMsg, { lat, lng }
         * @param {Number} timeout
         */
        getCurrentLatLng: function( next, timeout ){

            // 默认超时1分钟
            timeout = timeout || 60000;

            var browserSupportFlag =  new Boolean();

            // Try W3C Geolocation (Preferred)
            if( window.plugins.stGeolocation ){

                browserSupportFlag = true;

                window.plugins.stGeolocation.get( function ( err, location ){

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
                });
            }
            else if(navigator.geolocation) {
                browserSupportFlag = true;

                // 获取地理位置，并设置超时1分钟
                navigator.geolocation.getCurrentPosition( onSuccess, onError, { enableHighAccuracy: true, timeout: timeout });

                // Try Google Gears Geolocation
            } else if (google.gears) {

                browserSupportFlag = true;
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

                next( undefined, {
                    lat: coords.latitude,
                    lng: coords.longitude
                });
            }

            function onError( err ){

                var code = err.code;
                var message = err.message;

                var msg = '地理位置信息获取失败：Code: ' + code + ' Message: ' + message;

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

            this.geocoder.geocode( obj, function ( results, status ){

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
            });

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
         * 反向地址解析
         * Reverse Address Resolution
         * @param {String} lat
         * @param {String} lng
         * @param {Function} next( data, resultData ) --> data = { result, type, data }
         */
        getRAR:function( lat, lng, next ){

//            alert( 'getRAR' );
            var Request = Mods.request;
            var that = this;
            var url = APIS[ 'GEO' ];

            Request.send({
                url: url + '?latlng=' + lat + ',' + lng + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

                    var result = res.result;
                    var data = res.data;

                    if( result ){

                        next( undefined, that.resultHandle( res.data ) );
                    }
                    else {

                        next( data, that.resultHandle( res.data ) );
                    }
                }
            });
        },

        /**
         * 地址解析
         * Address Resolution
         * @param {String} address 地址
         * @param {Function} next( data, addressData ) 若请求成功，data为undefined data = { result, type, data }
         * //todo 比如"浙江工业大学“这样的地址无法得到搜索结果的问题
         */
        getAR: function ( address, next ){

            var Request = Mods.request;
            var that = this;
            var url = APIS[ 'GEO' ];

            alert( 'getAR' );
            alert( 'url:' +url + '?address=' + encodeURIComponent( address ) + '&sensor=true&t=' + Date.now() );
            Request.send({
                url: url + '?address=' + address + '&sensor=true&t=' + Date.now(),
                method: 'POST',
                type: 'GEO',
                callback: function( res ){

                    var result = res.result;
                    var data = res.data;

                    if( result ){
                        next( undefined, that.resultHandle( res.data ) );
                    }
                    else {
                        next( res, that.resultHandle( res.data ) );
                    }
                }
            });
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