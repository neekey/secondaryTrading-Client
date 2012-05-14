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

    // Set up a model to use in our Store
    Ext.regModel('Item', {
        fields: [ 'title', 'desc', 'price', 'latlng', 'address', 'pic1', 'pic2', 'pic3' ],
        validations: [
            {type: 'presence', name: 'title',message:"商品标题不能为空"},
            {type: 'presence', name: 'desc',message:"描述不能为空"},
//            {type: 'presence', name: 'latlng', message : "位置不能为空"},
            //todo 价格的格式还是数据类型添加验证
            {type: 'presence', name: 'price', message : "价格不能为空"}
        ]
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

    Ext.regModel('Profile', {
        fields: [
            {name: 'sex',     type: 'string'},
            {name: 'cellphone', type: 'string'},
            {name: 'qq', type: 'string'},
            {name: 'wangwang', type: 'string'},
            {name: 'location', type: 'string'},
            {name: 'address', type: 'string'}
        ],
        validations: [
            {type: 'presence', name: 'sex',message:"性别必须填写"},
            {type: 'presence', name: 'cellphone', message : "必须填写手机号"},
            {type: 'format', name: 'cellphone', matcher: /^\d+$/, message : "手机号码格式不正确"},
            {type: 'format', name: 'qq', matcher: /^\d*$/, message : "QQ号码只能为数字"},
//            {type: 'format', name: 'wangwang', matcher: /^\d*$/, message : "旺旺号码只能为数字"}
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