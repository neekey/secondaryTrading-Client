(function(){

    var Mods = App.mods;

    var locationButtonCls = Ext.extend( Ext.Button, {
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'decline',
        text: '为商品定位',
        margin: '0 15% 0 15%',
        handler: function(){

//            Mods.map.getCurrentLocation(function ( result ){
//
//                alert( JSON.stringify( result ) );
//            });

            console.log( this.overlay.show );

            this.overlay.show();
//            this.overlay.setLoading( true );

//
        },
        listeners: {
            afterRender: function (){

                this.overlay = Ext.ComponentMgr.create({
                    xtype: 'locationOverlay'
                });

                this.overlay.hide();
            }
        }
    });

    Ext.reg( 'locationButton', locationButtonCls );

    var locationOverlayCls = Ext.extend( Ext.Panel, {
        floating: true,
        draggable: true,
        modal: true,
        centered: true,
        width: Ext.is.Phone ? 260 : 400,
        height: Ext.is.Phone ? 220 : 400,
        styleHtmlContent: true,
        dockedItems: [
            {
                xtype: 'toolbar',
                doc: 'top',
                items: [
                    {
                        xtype: 'searchfield',
                        placeHolder: 'Search',
                        name: 'searchfield',
                        width: '80%'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        ui: 'confirm',
                        text: '搜索'
                    }
                ]
            }
        ],
        items: [
            {
                xtype: 'locationResultList'
            }
        ],
        scroll: 'vertical',
        cls: 'htmlcontent'
    });

    Ext.reg( 'locationOverlay', locationOverlayCls );

    Ext.regModel( 'LocationResult', {
        fileds: [ 'address' ]
    });


    function getStore(){

        return new Ext.data.Store({
            model: 'LocationResult',
            sorters: 'address',
//            getGroupString : function(record) {
//                return record.get('firstName')[0];
//            },
            data: [
                { address: 'testet' },
                { address: 'testet' },
                { address: 'testet' }
            ]
        });
    }

    var locationResultListCls = Ext.extend( Ext.List, {

        initComponent: function (){
            Ext.apply( this, {
                store: getStore()
            });

            locationResultListCls.superclass.initComponent.call( this );
        },

        itemTpl: '{address}',

        refreshResult: function ( result ){

            this.store.loadData( result );
            this.refresh();
        },
        listeners: {
            afterRender: function (){
//                this.setLoading( true );
            },
            itemtap: function (){

                console.log( arguments );
            }
        }
    });

    Ext.reg( 'locationResultList', locationResultListCls );


})();
