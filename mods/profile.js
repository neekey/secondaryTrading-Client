/**
 * 对用户信息进行各种操作的封装
 */
(function(){

    var Config = App.config;
    var Mods = App.mods;
    var Auth = Mods.auth;
    var Request = Mods.request;

    Mods.profile = {

        /**
         * 获取用户信息
         * @param userEmail 用户email 若不给定，则直接使用当前用户email
         * @param next ( err, userData )
         */
        getUserInfo: function ( userEmail, next ){

            userEmail = userEmail || Auth.getUserEmail();

            Mods.request.send({
                method: 'get',
                type: 'GET_USER',
                disableCaching: true,
                data: {
                    email: userEmail
                },
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
            })
        },

        /**
         * 更新用户信息
         * @param userEmail 用户email 若不给定，则直接使用当前用户email
         * @param updateObj {
         *      sex: 'male' || 'female',
         *      location: '233,444',
         *      address: 'address',
         *      cellphone: 132255,
         *      qq: 23151,
         *      wangwang: 234151,
         *      favorite: [ 1,3,4,4]
         * }
         * @param next ( err, userData )
         */
        updateUserInfo: function ( userEmail, updateObj, next ){

            userEmail = userEmail || Auth.getUserEmail();

            updateObj.email = userEmail;

            Mods.request.send({
                method: 'post',
                type: 'UPDATE_USER',
                disableCaching: true,
                data: updateObj,
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
            })
        }
    };

})();
