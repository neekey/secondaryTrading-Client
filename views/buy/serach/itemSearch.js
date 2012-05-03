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
                                            title: keyword
//                                            desc: keyword 暂时进搜索标题
                                        };

                                        that.resultList.setLoading( true );

                                        Mods.itemRequest.query( data, function ( err, data ){

                                            if( err ){

                                                Ext.Msg.alert( '获取商品信息出错：' + JSON.stringify( err ) );
                                            }
                                            else {

                                                that.resultList.clearList();
                                                that.resultList.removeAll();
                                                that.resultList.insertItem( data.items );
                                                // 保存所有的结果ids，在获取更多结果中需要使用到
                                                that.resultList.saveResultIds( data.ids );
                                                that.onResize();
                                                that.doLayout();
                                                that.resultList.setLoading( false );

                                                // 若结果已经全部展示出来，则隐藏获取更多商品按钮
                                                if( data.items.length >= data.ids.length ){

                                                    that.getMoreResultBtn.hide();
                                                }
                                                else {
                                                    that.getMoreResultBtn.show();
                                                }
                                            }
                                        });
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
                        handler: function (){

                            var moreIds = that.resultList.getMoreResultIds();
                            var buttonSelf = this;

                            if( moreIds.length > 0  ){

                                buttonSelf.setText( '数据加载中...' );
                                buttonSelf.setDisabled( true );

                                Mods.itemRequest.getItemsByIds( moreIds, function ( err, items ){

                                    that.resultList.insertItem( items );
                                    that.doLayout();

                                    if( that.resultList.getMoreResultIds().length <= 0 ){

                                        buttonSelf.hide();
                                    }

                                    buttonSelf.setText( '查看更多结果...' );
                                    buttonSelf.setDisabled( false );

                                });
                            }
                            else {

                                Ext.Msg.alert( '没有更多匹配的结果' );
                            }
                        }
                    },
                    {
                        xtype: 'panel',
                        text: 'hello',
                        heigth: 50
                    }
                ]
            });

            SearchCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',

        listeners: {
            afterRender:function (){

                this.resultList = this.query( 'resultList')[ 0 ];
                this.searchField = this.query( 'searchfield' )[ 0 ];
                this.getMoreResultBtn = this.query( 'button' )[ 0 ];

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
