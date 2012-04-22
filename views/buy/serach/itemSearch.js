(function(){

    var Mods = App.mods;
    var Config = App.config;

    var SearchCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '商品搜索',
                        items: [
                            {
                                xtype: 'searchfield',
                                placeHolder: '输入你需要的商品',
                                width: '80%'
                            },
                            {
                                text: '搜索',
                                ui: 'confirm',
                                align: 'end',
                                width: '15%',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

//        layout: 'vbox',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            {
                xtype: 'resultList'
            },
            {
                xtype: 'button',
                text: '查看更多结果',
                style: {
                    margin: '1% 5% 10px 5%'
                }
            }
        ],
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
        }
    });

    Ext.reg( 'itemSearch', SearchCls );
})();
