(function(){

    var Request = App.mods.request;
    var Mods = App.mods;

    var RegisterCls =  App.views.login = Ext.extend( Ext.form.FormPanel, {
        title: '注册',
        iconCls: 'search',
        id: 'welcome-register',
        apiType: 'REGISTER',
        scroll: false,

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            {
                                xtype: 'spacer'
                            },
                            {
                                text: '重置',
                                handler: function() {

                                    that.reset();
                                }
                            },
                            {
                                text: '注册',
                                id: 'btRegister',
                                ui: 'confirm',
                                handler: function() {

                                    var values = that.getValues();
                                    var model = Ext.ModelMgr.create( values, 'Register' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() && values.password === values[ 'password-confirm' ] ){

                                        that.setLoading( true );

                                        Request.send({
                                            method: 'post',
                                            type: that.apiType,
                                            data: values,
                                            callback: function( data ){

                                                that.setLoading( false );

                                                if( data.result ){

                                                    Ext.Msg.alert( "注册成功！", '注册成功，请登陆！', function (){

                                                        Mods.route.redirect( 'welcome/login' );
                                                    });

                                                    that.reset();
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
            });

            RegisterCls.superclass.initComponent.call( this );
        },

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
            }
        }
    });

    Ext.reg( 'register', RegisterCls );
})();
