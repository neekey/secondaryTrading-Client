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
         */
        getCurrentLatLng: function( next ){

//            alert( 'getCurrentLatLng' );
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