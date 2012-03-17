Ext.namespace( 'Ext.UIS', 'Ext.UIS.WS', 'Ext.DATAS', 'Ext.STConfig', 'Ext.MODS', 'Ext.COMS' );
(function(){

    var LOCAL_HOST = 'http://localhost:3000/';
    var REMOTE_HOST = 'http://secondary_trading.cnodejs.net/';
    var IF_DEVICE = !!( location.href.indexOf( 'file:///') >= 0 );
    var API_HOST = IF_DEVICE ? REMOTE_HOST : LOCAL_HOST;

    Ext.STConfig = {
        APIHOST: API_HOST,
        APIS: {
            login: API_HOST + 'login',
            register: API_HOST + 'register',
            logout: API_HOST + 'logout',
            checkauth: API_HOST + 'checkauth',
            newItem: API_HOST + 'newItem',
            geo: 'http://maps.google.com/maps/api/geocode/json'
        },
        API_JSONP_KEY: 'callback',
        session: {
            ID_NAME: 'secondary_trading_session_id',
            RES_SESSION_FIELD_NAME: 'secondary_trading_session'
        }
    };
})();
