(function(){

    var JSONP = Ext.util.JSONP,
        ComQuery = Ext.ComponentQuery;
    
    var APIHost = Ext.STConfig.APIHOST;
    var Request = Ext.MODS.request;
    var APILogin = APIHost + 'login';
    
    var loginModule = {};
    var loginInstance;


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

    var loginTabPanelConfig = loginModule.config = {

        title: '登陆',
        xtype: 'form',
        scroll: 'vertical',
        id: 'login',
        items: [
            {
                xtype: 'fieldset',
                title: '用户登陆',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name : 'email',
                        label: '邮箱',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: '密码',
                        useClearIcon: true,
                        autoCapitalize : false
                    }
                ]
            }
        ],
        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            },
            afterrender: function(){
                loginModule.instance = loginInstance = this;
            }
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    {xtype: 'spacer'},
                    {
                        text: '重置',
                        handler: function() {

                            loginInstance.reset();
                        }
                    },
                    {
                        text: '登陆',
                        id: 'btLogin',
                        ui: 'confirm',
                        handler: function() {

                            var values = loginInstance.getValues();
                            var model = Ext.ModelMgr.create( values, 'Login' );

                            var errors = model.validate();
                            var message = "";
                            
                            if( errors.isValid() ){

                                Request.jsonp({
                                    type: 'login',
                                    data: values,
                                    callback: function( data ){

                                        if( data.result ){
                                            Ext.Msg.alert( "登陆成功！", '登陆成功!', function(){

                                                Ext.UIS.loginReg.instance.fireEvent( 'login' );

                                                // 重置表单
                                                loginInstance.reset();
                                            });
                                        }
                                        else {
                                            Ext.Msg.alert( "登陆失败！", data.error );
                                        }
                                    }
                                }, true );

                            } else {

                                Ext.each( errors.items, function( rec, i ){

                                    message += rec.message+"<br>";
                                });

                                Ext.Msg.alert( "表单有误：", message );

                                return false;
                            }
                        }
                    }
                ]
            }
        ]
    };

    Ext.UIS.login = loginModule;
})();