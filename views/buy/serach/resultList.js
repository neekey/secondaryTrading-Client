(function(){

    var Mods = App.mods;
    var Config = App.config;

    var ResultListCls = Ext.extend( Ext.Panel, {

        // 清欠结果的所有id
        resultItems: [
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            },
            {
                address: 'nihaoaijoa',
                pic: 'http://wenwen.soso.com/p/20110816/20110816162728-1441696951.jpg',
                title: 'dafadfa',
                desc: 'daffddaffda',
                price: '1243414',
                _id: 'test'
            }
        ],
        // 所有结果id
        resultIds: [],
        // 需要被渲染到页面中的item
        resultItemsToRender: [],
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },
        listeners: {
            afterRender:function (){

                var that = this;

                this.tpl = new Ext.Template( Ext.get( 'result-item-tpl').getHTML() );
                this.initRender();

            }
        },

        /**
         * 组件第一次初始化后，若默认有数据，则渲染
         */
        initRender: function (){

            var that = this;
            var itemBak = this.resultItems;
            if( this.resultItems.length > 0 ){

                this.resultItems = [];

                this.saveItems( itemBak );
                this.renderItems();
            }
        },

        /**
         * 清空列表
         */
        clearList: function (){

            this.body.setHTML( '' );
            this.resultItems = [];
            this.resultItemsToRender = [];
            this.resultIds = [];
        },

        /**
         * 插入结果项
         * @param itemInfo {Object|Array} 可以插入一个或者多个
         */
        insertItem: function ( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            var that = this;
            this.resultItems = this.resultItems.concat( newItems );
        },

        /**
         * 保存结果以便后期渲染
         * @param itemInfo
         */
        saveItems: function( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            // 新的item都将放入 用来表明这些item尚未被渲染过
            this.resultItemsToRender = this.resultItemsToRender.concat( newItems );
            this.resultItems = this.resultItems.concat( newItems );
        },

        /**
         * 渲染所有还未渲染的item
         */
        renderItems: function (){

            var that = this;

            Ext.each( this.resultItemsToRender, function ( item ){

                that.tpl.append( that.body, that.itemInfoHandle( item ) );

                // 获取刚刚插入的item
                var child = that.body.last( '.result-item' );

                // 为item内的pic容器添加tap事件
                // 只有点击pic部分才会出发转移到商品详情的逻辑
                // 之所以这么做，是因为添加了tap，会导致在tap区域滚动会出问题...
                // 因此只好部分添加tap事件了... 肯跌啊...
                child.child( '.result-item-pic' ).addListener( 'tap', function (){

                    that.fireEvent( 'itemTaped', child );
                });
            } );

            that.doLayout();

            // 渲染完毕，清空
            this.resultItemsToRender = [];
        },

        /**
         * 对item数据进行处理
         * 1、选取第一个img 组装成图片地址，并赋值给pic
         * @param item { title, desc, title, imgs: [] ..} -> { title, desc, pic: url , ... }
         * @return {Object}
         */
        itemInfoHandle: function ( item ){

            var imgs = item.imgs;
            var pic;

            if( imgs && imgs.length > 0 ){

                pic = Config.APIHOST + 'img?id=' + imgs[ 0 ][ '_id' ];
            }
            else {
                pic = undefined;
            }

            item.pic = pic;

            return item;
        },

        /**
         * 储存所有结果id
         * @param ids
         */
        saveResultIds: function ( ids ){

            this.resultIds = ids;
        },

        /**
         * 获取接下来要获取的ids
         * @param maxLen 一次最多多少id
         * @return {Array}
         */
        getMoreResultIds: function ( maxLen ){

            var currentIndex = this.resultItems.length;

            return this.resultIds.slice( currentIndex, currentIndex + ( maxLen || 10 ) );
        }

    });

    Ext.reg( 'resultList', ResultListCls );
})();