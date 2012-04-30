(function(){

    var Mods = App.mods;
    var Config = App.config;

    var ItemDetailCls = Ext.extend( Ext.Panel, {

        initComponent: function (){

            var that = this;

            Ext.apply( this, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '商品详情',
                        items: [
                            {
                                text: '返回',
                                ui: 'back',
                                handler: function() {
                                    Ext.redirect( 'buy/search' );
                                }
                            },
                            { xtype: 'spacer' },
                            {
                                text: '购买',
                                ui: 'confirm',
                                align: 'end',
                                handler: function (){

                                }
                            }
                        ]
                    }
                ]
            });

            ItemDetailCls.superclass.initComponent.call( this );
        },

        layout: 'auto',
        // 使得超过屏幕方向的内容可以被滑动看到
        scroll: 'vertical',
        items: [
            {
                xtype: 'picSlide'
            },
            {
                xtype: 'itemTextInfo'
            }
        ],
        listeners: {
            afterRender:function (){

                var that = this;
                this.picSlide = this.query( 'picSlide' )[ 0 ];
                this.itemTextInfo = this.query( 'itemTextInfo' )[ 0 ];

                // 下面仅为测试
                // 由于在此时 自组件的afterrender事件都还未被出发，因此直接设置会有问题
                setTimeout( function (){
//                    that.setItemTextInfo( {
//                        title: '标题',
//                        desc: '这是商品描述。商品九成新！橙色非常不错，由于买了更好的，所以转让！',
//                        price: '9999',
//                        location: '浙江工业大学',
//                        sellerName: 'Neekey',
//                        date: '2011-01-02',
//                        email: 'ni@gmail.com',
//                        QQ: '1987987979',
//                        wangwang: '9879790'
//                    });
//
//                    that.setPics( [
//                        'http://3.s3.envato.com/files/1124114/1item_preview.jpg',
////                    'http://3.s3.envato.com/files/1209789/0_itempreview.jpg',
//                        'http://0.s3.envato.com/files/1208187/pdfs_php.jpg'
//                    ]);
                }, 1000 ) ;
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

        /**
         * 设置当前商品详情信息
         * @param item
         */
        setDetailInfo: function ( item ){

            this.setPics( item.imgs );

            var textInfo = {
                title: item.title,
                desc: item.desc,
                price: item.price,
                location: item.location,
                sellerName: 'neekey',
                date: 'hello~',
                email: 'ni184775761@gmail.com',
                QQ: '184775761',
                wangwang: 'hello~'
            };

            this.setItemTextInfo( textInfo );
        },

        /**
         * 设置图片
         * @param pics
         */
        setPics: function ( pics ){

            this.picSlide.setPics( pics );
        },

        /**
         * 根据商品id请求数据
         * @param itemId
         */
        fetch: function ( itemId ){

            var that = this;
            this.setLoading( true );
            Mods.itemRequest.getItemById( itemId, function ( err, item ){

                if( err ){

                    Ext.Msg.alert( '获取商品信息失败! ' + err );
                }
                else {

                    that.setDetailInfo( item );
                }

                that.setLoading( false );
            });

        },

        /**
         * 设置商品的其他信息
         * @param obj
         */
        setItemTextInfo: function ( obj ){

            this.itemTextInfo.setInfo( obj );
        }
    });

    Ext.reg( 'itemDetail', ItemDetailCls );
})();
