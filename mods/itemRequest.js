/**
 * 商品数据请求相关的方法
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    var Auth = Mods.auth;
    // 缓存item信息 { id -> itemOBj }
    var ItemCache = {};

    Mods.itemRequest = {

        addItem: function ( item, next ){

            Mods.request.send({
                method: 'post',
                data: item,
                type: 'NEW_ITEM',
                callback: function ( resData ){

                    var result = resData.result;
                    var itemId;

                    if( result ){

                        itemId = resData.data.itemId;
                        Ext.Msg.alert( '商品添加成功', '', function (){

                            Mods.route.redirect( 'sell/sellList' );
                        });

                        next( true, itemId );
                    }
                    else {
                        Ext.Msg.alert( '商品添加失败！', resData.error, function (){

                            Mods.route.redirect( 'sell' );
                        } );

                        next( false, resData );
                    }
                }
            }, true );
        },

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
         * (根据用户的email)获取当前用户的正在出售的商品
         * @param {Function} next( err, items )
         */
        getSellingItem: function ( next ){

            var email = Auth.getUserEmail();
            var that = this;

            Mods.request.send({
                method: 'get',
                disableCaching: true,
                data: {
                    email: email
                },
                type: 'SELLING_LIST',
                callback: function ( resData ){

                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, that.imgPathHandle( data.items ) );
                    }
                    else {

                        Ext.Msg.alert( resData.error + ': ' + JSON.stringify( resData.data ) );
                        next( resData )
                    }
                }
            }, true );

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

                        img.url = Config.APIHOST + 'img?id=' + img._id;
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
         * @param next （ data, items ) --> data = { result:, error, type, data }若成功，则data为undefined
         */
        query: function ( data, next ){

            Mods.request.send({
                method: 'get',
                disableCaching: true,
                data: data,
                type: 'QUERY_ITEM',
                callback: function ( resData ){

                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, data );
                    }
                    else {

                        next( resData )
                    }
                }
            }, true );
        },

        /**
         * 更新item
         * @param itemId
         * @param updateObj
         * @param next
         */
        updateItem: function ( itemId, updateObj, next ){

            updateObj.id = itemId;

            Mods.request.send({
                method: 'post',
                data: updateObj,
                disableCaching: true,
                type: 'UPDATE_ITEM',
                callback: function ( resData ){

                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, resData );
                    }
                    else {

                        next( resData )
                    }
                }
            }, true );

            // 删除缓存
            delete ItemCache[ itemId ];
        },

        /**
         * 删除item
         * @param itemId itemId
         * @param next ( err )
         */
        delItem: function ( itemId, next ){

            var data = {
                id: itemId
            };

            Mods.request.send({
                method: 'get',
                data: data,
                type: 'DEL_ITEM',
                callback: function ( resData ){

                    var result = resData.result;
                    var data = resData.data;

                    if( result ){

                        next( undefined, resData );
                    }
                    else {

                        next( resData )
                    }
                }
            }, true );

            // 删除缓存
            delete ItemCache[ itemId ];
        }
    };

})();