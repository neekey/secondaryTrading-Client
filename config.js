(function(){

    var LOCAL_HOST = 'http://' + document.location.host + '/'; //'http://localhost:3000/';
//    var REMOTE_HOST = 'http://192.168.137.66:3000/';
    var REMOTE_HOST = 'http://secondary_trading.cnodejs.net/';
//    var REMOTE_HOST = 'http://secondary_trading.dev.cnodejs.net/';
    var IF_DEVICE = !!( location.href.indexOf( 'file:///') >= 0 );
    var API_HOST = IF_DEVICE ? REMOTE_HOST : LOCAL_HOST;

    App.config = {
        APIHOST: API_HOST,
        // 接口
        APIS: {
            LOGIN: API_HOST + 'login',
            REGISTER: API_HOST + 'register',
            LOGOUT: API_HOST + 'logout',
            CHECKAUTH: API_HOST + 'checkauth',
            GET_USER: API_HOST + 'userinfo',
            UPDATE_USER: API_HOST + 'updateuser',
            NEW_ITEM: API_HOST + 'newItem',
            DEL_ITEM: API_HOST + 'itemdel',
            UPDATE_ITEM: API_HOST + 'updateitem',
            GEO: 'http://maps.google.com/maps/api/geocode/json',
            QUERY_ITEM: API_HOST + 'searchitem',
            SELLING_LIST: API_HOST + 'sellinglist',
            GUESS_YOU_LIKE: API_HOST + 'guessyoulike',
            USER_BUY_RECORD: API_HOST + 'userbuyrecord'
        },
        // 用于JSONP请求的KEY
        API_JSONP_KEY: 'callback',
        SESSION: {
            ID_NAME: 'secondary_trading_session_id',
            RES_SESSION_FIELD_NAME: 'secondary_trading_session'
        },
        IF_DEVICE: IF_DEVICE
    };
})();
