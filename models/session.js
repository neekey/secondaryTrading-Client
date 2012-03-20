(function(){

    var Config = App.config;
    var Session = Config.SESSION;
    var ID_NAME = Session.ID_NAME;

    // Set up a model to use in our Store
    Ext.regModel('Session', {
        fields: [ 'email', 'serial', 'token', ID_NAME, 'id' ],
        proxy: {
            type: 'localstorage',
            id  : 'secondaryTradingSession'
        }
    });

})();