(function(){

    var ItemTextInfoCls = Ext.extend( Ext.Panel, {
        // todo 添加内容的动态设置方法
        style: {
            margin: '5%'
        },
        itemTextInfo: {
            title: '',
            desc: '',
            price: '',
            location: '',
            sellerName: '',
            date: '',
            email: '',
            QQ: '',
            wangwang: ''
        },
        listeners: {
            afterrender: function (){


                this.tpl = new Ext.Template( Ext.get( 'item-detail-tpl').getHTML() );
                this.setInfo();
            }
        },

        setInfo: function ( info ){

            this.itemTextInfo = info || this.itemTextInfo || {};
            this.tpl.overwrite( this.body, this.itemTextInfo );

        }
    }) ;

    Ext.reg( 'itemTextInfo', ItemTextInfoCls );
})();
