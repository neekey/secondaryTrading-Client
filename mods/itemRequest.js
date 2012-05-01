/**
 * 商品数据请求相关的方法
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    // 缓存item信息 { id -> itemOBj }
    var ItemCache = {};

    Mods.itemRequest = {

        /**
         * 根据itemid获取商品信息
         * @param id
         * @param next ( err, item ) item 返回的是单个item对象
         */
        getItemById: function ( id, next ){

            var item;
            var data;
            var that = this;

            // 先检查本地缓存中是否有数据
            if( item = ItemCache[ id ] ){

                next( undefined, item );
            }
            else {

                data = { id: id };

                this.query( data, function ( err, data ){

                    if( err ){
                        next( err );
                    }
                    else {

                        ItemCache[ id ] = data.items[ 0 ];
                        next( undefined, that.imgPathHandle( data.items[ 0 ] ) );
                    }
                });
            }
        },

        /**
         * 处理数据中包含的img信息，转化为可以请求的图片地址
         * @param items
         * @return {*}
         */
        imgPathHandle: function ( items ){

            var isArray = Ext.isArray( items );
            var item;
            var imgs;
            var img;
            var i;
            var j;
            items = isArray ? items : [ items ];

            for( j = 0; item = items[ j ]; j++, i = 0 ){

                imgs = item.imgs;

                if( imgs ){

                    for( i = 0; img = imgs[ i ]; i++ ){

                        imgs[ i ] = Config.APIHOST + 'img?id=' + img._id;
                    }
                }
            }

            return isArray ? items : items[ 0 ];
        },

        /**
         * 根据给定的id数组，返回item数组
         * @param ids
         * @param next ( err, items )
         */
        getItemsByIds: function ( ids, next ){

            var data = { ids: ids.join( ',' ) };
            var that = this;

            this.query( data, function ( err, data ){

                if( err ){
                    next( err );
                }
                else {
                    next( err, that.imgPathHandle( data.items ) );
                }
            });
        },

        /**
         * 检索商品
         * @param data
         * @param next （ err, items )
         */
        query: function ( data, next ){

            Mods.request.send({
                method: 'get',
                data: data,
                type: 'QUERY_ITEM',
                callback: function ( d ){

                    var resData = d.data;
                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, data );
                    }
                    else {

                        next( resData.error )
                    }
                }
            }, true );
        }
    };

})();