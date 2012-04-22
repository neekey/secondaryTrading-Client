(function(){

    var Mods = App.mods;
    var Config = App.config;

    var ResultListCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },

        defaults: {
            xtype: 'resultItem',
            itemInfo: {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414'
            }
        },
        items: [
            {}, {}, {}
        ],
        scroll: false,
        listeners: {
            afterRender:function (){

            },
            resize: function (){

                console.log( 'itemDetail resize' );
            },
            bodyresize: function (){
                console.log( 'itemDetail bodyresize' );

            },
            // 当窗口尺寸改变
            afterlayout: function (){

            }
        },

        insertItem: function ( itemInfo ){

            var items = this.items;

            this.insert( items.length, {
                xtype: 'resultItem',
                itemInfo: itemInfo
            })
        }
    });

    Ext.reg( 'resultList', ResultListCls );
})();