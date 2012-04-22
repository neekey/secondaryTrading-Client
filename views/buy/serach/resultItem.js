(function(){

    var Mods = App.mods;
    var Config = App.config;
    var ITEM_HEIGHT = 130;

    var ResultItemCls = Ext.extend( Ext.Panel, {

        height: ITEM_HEIGHT,
        margin: '20px 0 0 0',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {

            });

            ResultItemCls.superclass.initComponent.call( this );
        },

        // 水平布局
        layout: 'hbox',
        // 每个item包含的信息
        itemInfo: {
            address: '',
            pic: '',
            title: '',
            desc: '',
            price: ''
        },
        // todo 解决自动按照百分比调整宽度的问题
        items: [
            {
                xtype: 'resultItemPic',
                flex: 3
            },
            {
                xtype: 'resultItemText',
                flex: 7
            }
        ],
        listeners: {
            afterRender:function (){

                this.itemPic = this.query( 'resultItemPic' )[ 0 ];
                this.itemText = this.query( 'resultItemText' )[ 0 ];
                this.setItemInfo();
            },
            // 当窗口尺寸改变
            afterlayout: function (){

//                this.itemPic.doLayout();
//                this.onResize()
            }
        },

        // 设置item信息
        setItemInfo: function ( info ){

            this.itemInfo = info || this.itemInfo || {};
            this.itemPic.setImg( this.itemInfo.pic );
            this.itemText.setInfo( this.itemInfo );
        }
    });

    Ext.reg( 'resultItem', ResultItemCls );

    /**
     * item 图片部分，水平 居中
     * @type {*}
     */
    var ResultItemPicCls = Ext.extend( Ext.Panel, {

        html: '<div class="pic-item"><img src=""></div>',
        picMargin: 10,
        height: ITEM_HEIGHT,
        picUrl: '',
        listeners: {
            afterrender: function (){

                this.picWrap = this.body.child( '.pic-item' );
                this.pic = this.picWrap.child( 'img' );

                this.setImg();

                this.resizePicWrap();
            },

            afterlayout: function (){

                this.resizePicWrap();
            }
        },

        /**
         * 设置图片地址
         * @param url
         */
        setImg: function ( url ){

            this.picUrl = url || this.picUrl || '';

            this.pic && this.pic.set({
                src: this.picUrl
            });
        },

        /**
         * 更新 slide-pic-item 宽高 并设置 img的宽高
         */
        resizePicWrap: function (){

            var bodyWidth = this.body.getWidth();
            var bodyHeight = this.body.getHeight();
            var imgHeight = bodyWidth > bodyHeight ? bodyHeight + 'px' : 'auto';
            var imgWidth = bodyWidth > bodyHeight ? 'auto' : bodyWidth + 'px';

            this.picWrap.setHeight( bodyHeight );
            this.picWrap.setWidth( bodyWidth );

            this.pic.setStyle({
                'max-height': imgHeight,
                'max-width': imgWidth
            });

        }
    });

    Ext.reg( 'resultItemPic', ResultItemPicCls );

    /**
     * 商品文字描述部分
     * @type {*}
     */
    var ResultItemTextCls = Ext.extend( Ext.Panel, {

        // todo 添加内容的动态设置方法
        itemTextInfo: {
            title: '',
            desc: '',
            price: '',
            address: ''
        },

        listeners: {
            afterrender: function (){

                this.tpl = new Ext.Template( Ext.get( 'result-item-text-tpl').getHTML() );
                this.setInfo();
            }
        },

        /**
         * 设置文字
         * @param info
         */
        setInfo: function ( info ){

            this.itemTextInfo = info || this.itemTextInfo || {};
            this.tpl && this.tpl.overwrite( this.body, this.itemTextInfo );

        }
    });

    Ext.reg( 'resultItemText', ResultItemTextCls );
})();
