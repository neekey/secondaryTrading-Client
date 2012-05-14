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
