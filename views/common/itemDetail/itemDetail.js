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
                                xtype: 'goBackButton'
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
        setPics: function ( imgs ){

            var pics = [];

            Ext.each( imgs, function ( img ){
                pics.push( img.url );
            });

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

                    Ext.Msg.alert( '获取商品信息失败! ', ( err.error || '' ) + ( JSON.stringify( err.data ) || '' ) );
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
