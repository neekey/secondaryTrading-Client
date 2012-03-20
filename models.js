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

})();(function(){

    Ext.regModel('Login', {
        fields: [
            {name: 'email',     type: 'string'},
            {name: 'password', type: 'password'}
        ],
        validations: [
            {type: 'presence', name: 'email',message:"邮箱不能为空"},
            {type: 'presence', name: 'password', message : "密码不能为空"},
            {type: 'format',   name: 'email', matcher: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message:"无效的email格式"}
        ]
    });

})();
(function(){

    Ext.regModel('Register', {
        fields: [
            { name: 'email', type: 'string' },
            { name: 'password', type: 'password' },
            { name: 'password-confirm', type: 'password' }
        ],
        validations: [
            { type: 'presence', name: 'email',message:"邮箱不能为空" },
            { type: 'presence', name: 'password', message : "密码不能为空" },
            { type: 'presence', name: 'password-confirm', message : "密码确认不能为空" },
            { type: 'format',   name: 'email', matcher: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message:"无效的email格式" }
        ]
    });

})();
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