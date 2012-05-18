(function(){

    var Auth = App.mods.auth;
    var Mods = App.mods;

    var PreferenceCls = Ext.extend( Ext.Panel, {

        defaults: {
//            xtype: 'button',
            margin: '30% 10%'
//            height: 45
        },
//        scroll: false,

        initComponent: function (){

            var that = this;
            var defaultCats = App.models.categories;
            var options = [];

            Ext.each( defaultCats, function ( cat ){

                options.push( { text: cat, value: cat } );
            });

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '偏好设置',
                        items: [
                            {
                                xtype: 'goBackButton'
                            },
                            {   xtype: 'spacer' },
                            {
                                text: '保存',
                                ui: 'confirm',
                                handler: function(){

//                            Mods.route.redirect( 'profile/preferences' );
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'categorySelect',
                        ifUseSaveBtn: true
                    }
                ]
            });

            PreferenceCls.superclass.initComponent.call( this );
        },
        listeners: {
            afterrender: function (){

//                this.catSelect = this.query( '#preset-cat' )[ 0 ];
//                this.ifUseCustom = this.query( 'checkboxfield' )[ 0 ];
//                this.customField = this.query( '#custom-cat' )[ 0 ];
//
//                this.customField.hide();
            }
        }
    });

    Ext.reg( 'preference', PreferenceCls );
})();
