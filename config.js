(function(){

    //todo 设置一个全局变量用于表明当前用户是否处于登陆状态
    //todo 若注销则该变量将被重置
    //todo 脚本定期发送请求检查是否登陆

    var LOCAL_HOST = 'http://' + document.location.host + '/'; //'http://localhost:3000/';
    var REMOTE_HOST = 'http://192.168.137.66:3000/'; //http://secondary_trading.cnodejs.net/';
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
            NEW_ITEM: API_HOST + 'newItem',
            DEL_ITEM: API_HOST + 'itemdel',
            GEO: 'http://maps.google.com/maps/api/geocode/json',
            QUERY_ITEM: API_HOST + 'searchitem',
            SELLING_LIST: API_HOST + 'sellinglist'
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
