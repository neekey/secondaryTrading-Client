/**
 * 个人信息设置
 */
(function(){

    var Mods = App.mods;

    /**
     * 我的资料
     * @type {*}
     */
    var myProfileCls = Ext.extend( Ext.Panel, {

        scroll: 'vertical',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '个人信息设置',
                        items: [
                            {
                                xtype: 'button',
                                text: '返回',
                                ui: 'back',
                                handler: function (){

                                    Ext.redirect( 'profile/menu' );
                                }
                            },
                            {
                                xtype: 'spacer'
                            },
                            {
                                xtype: 'button',
                                text: '保存',
                                ui: 'confirm',
                                handler: function (){

                                    // 获取我的资料数据
                                    var formData = that.myProfileForm.getFormData();
                                    var locationData = that.myProfileLocation.getLocationInfo();

                                    var data = {
                                        sex: formData.sex,
                                        cellphone: formData.cellphone,
                                        qq: formData.qq,
                                        wangwang: formData.wangwang,
                                        location: Ext.isArray( locationData.location ) ? locationData.location.join( ',' ) : locationData.location,
                                        address: locationData.address
                                    };

                                    // 进行表单验证
                                    var model = Ext.ModelMgr.create( data, 'Profile' );
                                    var errors = model.validate();
                                    var message = "";

                                    if( errors.isValid() ){

                                        // 发送请求
                                        Mods.profile.updateUserInfo( undefined, data, function ( errObj ){

                                            if( !errObj ){

                                                Ext.Msg.alert( '保存成功!' );
                                            }
                                        });
                                    }
                                    else {

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
                ],

                items: [
                    {
                        xtype: 'myProfileForm'
                    },
                    {
                        xtype: 'myProfileLocation'
                    }
                ]
            });

            myProfileCls.superclass.initComponent.call( this );
        },

        listeners: {

            afterrender: function (){

                this.myProfileLocation = this.query( 'myProfileLocation' )[ 0 ];
                this.myProfileForm = this.query( 'myProfileForm' )[ 0 ];
            },
            // 一旦被激活，就请求数据
            activate: function (){

                this.fetch();
            }
        },

        /**
         * 请求当前用户信息
         */
        fetch: function (){

            var that = this;
            this.setLoading( true );

            Mods.profile.getUserInfo( undefined, function ( data, user ){

                that.setLoading( false );
                if( data ){

                    Ext.Msg.alert( '获取用户信息失败: ' + data.error );
                }
                else {

                    that.userInfo = user;
                    that.updateView();
                }
            });
        },

        /**
         * 根据当前的userInfo来更新视图
         */
        updateView: function (){

            this.myProfileLocation.setLocationInfo( this.userInfo );
            this.myProfileForm.setFormData( this.userInfo );
        }
    });

    // 我的资料 表单
    var myProfileFormCls = Ext.extend( Ext.form.FormPanel, {

        scroll: false,
        items: [
            {
                xtype: 'fieldset',
                title: '个人信息 & 联系方式',
                instructions: '请填写您的个人信息，以便其他人能联系到您.',
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'selectfield',
                        name : 'sex',
                        label: '性别',
                        options: [
                            {text: '男',  value: 'male'},
                            {text: '女', value: 'female'}
                        ],
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'textfield',
                        name : 'cellphone',
                        label: '手机',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true
                    },
                    {
                        xtype: 'textfield',
                        name : 'qq',
                        label: 'QQ',
                        useClearIcon: true,
                        autoCapitalize : false
                    },
                    {
                        xtype: 'textfield',
                        name : 'wangwang',
                        label: '旺旺',
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
        },

        /**
         * 返回formData数据
         */
        getFormData: function (){

            return this.getValues();
        },

        /**
         * 设置表单的数据
         * @param {Object} userInfo
         */
        setFormData: function ( userInfo ){

            this.userInfo = userInfo;
            // 创建一个model 用于填写表单
            var model = Ext.ModelMgr.create( this.userInfo, 'Profile' );
            this.loadRecord( model );
        }
    });

    // 当前用户地理位置信息
    var myProfileLocationCls = Ext.extend( Ext.Panel, {
        layout: 'hbox',
        cls: 'myprofile-location-container',

        address: undefined,
        location: undefined,
        listeners: {

            afterlayout: function (){

                var currentLocationWrap = this.body.query( '.current-location-wrap' )[ 0 ];
                var locationButton = this.query( 'locationButton' )[ 0 ];
                var currentHeight = Ext.get( currentLocationWrap).getHeight();
                var buttonHeight = locationButton.getHeight();
                var targetHeight = currentHeight > buttonHeight ? currentHeight : buttonHeight;

                this.body.setHeight( targetHeight );
            }
        },
        items: [
            {
                xtype: 'panel',
                width: '70%',
                layout: 'fit',
                cls: 'current-location-info',
                tplId: 'current-location-info-tpl',
                html: '',
                listeners: {

                    afterrender: function (){

                        this.tpl = new Ext.XTemplate( Ext.get( this.tplId ).getHTML() );
                        this.tpl.overwrite( this.body, {} );
                    }
                }
            },
            {
                xtype: 'locationButton',
                width: '25%',
                text: '定位'
            }
        ],

        /**
         * 获取当前的location信息
         * @return {Object} { address:, location: }
         */
        getLocationInfo: function (){

            return {
                address: this.address,
                location: this.location
            };
        },

        /**
         * 设置location信息，并更新视图
         * @param infoObj  { address: , location: }
         */
        setLocationInfo: function ( infoObj ){

            if( !this.currentLocationSpan ){

                this.currentLocationSpan = Ext.get( this.body.query( '.current-location' )[ 0 ] );
            }

            this.address = infoObj.address;
            this.location = infoObj.location;
            var address = infoObj.address ? infoObj.address : '点击“定位”设置您的当前位置!';

            this.currentLocationSpan.setHTML( address );
        }
    });

    Ext.reg( 'myProfileForm', myProfileFormCls );
    Ext.reg( 'myProfileLocation', myProfileLocationCls );
    Ext.reg( 'myProfile', myProfileCls );
})();
