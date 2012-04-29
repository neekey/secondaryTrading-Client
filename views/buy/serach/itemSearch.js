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

                                    var keyword = that.searchField.getValue();
                                    var data = undefined;

                                    if( keyword ){

                                        data = {
                                            query: 'this.title.indexOf("' + keyword + '") >= 0 || this.desc.indexOf("' + keyword + '")'
                                        };

                                        that.resultList.setLoading( true );

                                        Mods.request.send({
                                            method: 'get',
                                            data: data,
                                            type: 'QUERY_ITEM',
                                            callback: function ( d ){

                                                var resData = d.data;
                                                var result = resData.result;
                                                var data = resData.data;
                                                console.log( 'response',d );

                                                if( result ){

                                                    that.resultList.removeAll();
                                                    that.resultList.insertItem( data.items );
                                                    that.doLayout();
                                                    that.resultList.setLoading( false );
                                                }
                                                else {
                                                    Ext.Msg.alert( '商品搜索失败！', resData.error );
                                                }
                                            }
                                        }, true );
                                    }
                                    else {

                                        Ext.Msg.alert( '关键词不能为空!' );
                                    }

                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'resultList'
                    },
                    {
                        xtype: 'button',
                        text: '查看更多结果',
                        style: {
                            margin: '1% 5% 10px 5%'
                        },
                        handler: function (){

                            that.resultList.insertItem({
                                address: 'nihaoaijoa',
                                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                                title: 'dafadfa',
                                desc: 'daffddaffda',
                                price: '1243414'
                            });

                            that.doLayout();
                        }
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: false,

        listeners: {
            afterRender:function (){

                this.resultList = this.query( 'resultList')[ 0 ];
                this.searchField = this.query( 'searchfield' )[ 0 ];

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
