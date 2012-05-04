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
                price: '1243414'
            }
        ],
        resultIds: [],
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
            });

            ResultListCls.superclass.initComponent.call( this );
        },
//        layout: 'auto',
//        scroll: false,
        listeners: {
            afterRender:function (){

                var that = this;

                this.tpl = new Ext.Template( Ext.get( 'result-item-tpl').getHTML() );
                this.initRender();

                // 添加item被tap委托事件
                this.body.addListener( 'tap', function ( e ){

                    var target = Ext.get( e.target );
                    var item = target.findParent( '.result-item' );

                    if( item ){

                        that.fireEvent( 'itemClicked', item );
                    }
                });
            },
            resize: function (){
            },
            bodyresize: function (){
            },
            // 当窗口尺寸改变
            afterlayout: function (){
            },
            // item被点击
            itemClicked: function ( item ){

                Ext.redirect( 'itemdetail/' + item.getAttribute( 'data-id' ) );
            }
        },

        /**
         * 组件第一次初始化后，若默认有数据，则渲染
         */
        initRender: function (){

            var that = this;
            if( this.resultItems.length > 0 ){

                Ext.each( this.resultItems, function ( item ){

                    that.tpl.append( that.body, item );
                } );

                that.doLayout();
            }
        },

        clearList: function (){

            this.body.setHTML( '' );
        },

        /**
         * 插入结果项
         * @param itemInfo {Object|Array} 可以插入一个或者多个
         */
        insertItem: function ( itemInfo ){

            var newItems = Ext.isArray( itemInfo ) ? itemInfo : [ itemInfo ];
            var that = this;
            this.resultItems.concat( newItems );

            Ext.each( newItems, function ( item ){

                that.tpl.append( that.body, that.itemInfoHandle( item ) );
            } );

            that.doLayout();
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