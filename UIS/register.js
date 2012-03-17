(function(){

    var JSONP = Ext.util.JSONP,
        ComQuery = Ext.ComponentQuery;

    var APIHost = Ext.STConfig.APIHOST;
    var APIRegister = APIHost + 'register';
    
    var registerModule = {};
    var registerInstance;

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

    var registerTabPanelConfig = registerModule.config = {
        title: '注册',
        xtype: 'form',
        scroll: 'vertical',
        iconCls: 'search',
        id: 'reg',
        items: [
            {
                xtype: 'fieldset',
                title: 'Personal Info',
                instructions: 'Please enter the information above.',
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
                        autoCapitalize : false
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: '密码',
                        useClearIcon: true,
                        autoCapitalize : false
                    },
                    {
                        xtype: 'passwordfield',
                        name : 'password-confirm',
                        label: '密码确认',
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
                registerModule.instance = registerInstance = this;
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

                            registerInstance.reset();
                        }
                    },
                    {
                        text: '注册',
                        id: 'btRegister',
                        ui: 'confirm',
                        handler: function() {

                            var values = registerInstance.getValues();
                            var model = Ext.ModelMgr.create( values, 'Register' );

                            var errors = model.validate();
                            var message = "";

                            if( errors.isValid() && values.password === values[ 'password-confirm' ] ){

                                Request.jsonp({
                                    type: 'register',
                                    data: values,
                                    callback: function( data ){

                                        if( data.result ){

                                            Ext.Msg.alert( "注册成功！", '注册成功，请登陆！' );

                                            registerInstance.reset();
                                        }
                                        else {

                                            Ext.Msg.alert( '注册失败！', data.error );
                                        }

                                    }
                                }, true );

                            } else {

                                Ext.each( errors.items, function( rec, i ){

                                    message += rec.message+"<br>";
                                });

                                if( values.password !== values[ 'password-confirm' ] ){

                                    message += "两次密码输入不一致<br>";
                                }

                                Ext.Msg.alert( "表单有误：", message );

                                return false;
                            }
                        }
                    }
                ]
            }
        ]
    };

    Ext.UIS.register = registerModule;
})();