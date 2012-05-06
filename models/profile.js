(function(){

    Ext.regModel('Profile', {
        fields: [
            {name: 'sex',     type: 'string'},
            {name: 'cellphone', type: 'number'},
            {name: 'qq', type: 'number'},
            {name: 'wangwang', type: 'number'},
            {name: 'location', type: 'string'},
            {name: 'address', type: 'string'}
        ],
        validations: [
            {type: 'presence', name: 'sex',message:"性别必须填写"},
            {type: 'presence', name: 'cellphone', message : "必须填写手机号"}
        ]
    });

})();
