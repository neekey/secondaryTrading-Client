(function(){

    var PicSlideCls = Ext.extend( Ext.Carousel, {

        // todo 添加动态设置item的方法
        height: 300,
//        width: '100%', 若添加了该属性，将导致组件在初始化时安装当时的100%计算，此后该width作为固定式使用，不会根据窗口变化而变化
        picWraps: [],
        indicator: true,
        flex: 1,
        pics: [],
        defaults: {
//            xtype: 'picSlideItem'
        },
        items: [
//            {},{},{}
        ],
        listeners: {
            afterrender: function (){

                var that = this;

//                this.items.each( function ( item, index ){
//
//                    item.setPicSlide( that );
//                    item.picUrl = that.pics[ index ];
//                });

                this.setPics( this.pics );

                this.addListener( 'resize', function (){

                    console.log( 'reresize' );
                });
            }
        },

        resizePicWraps: function ( width, height ){

            this.items.each( function ( item ){

                item.resizePicWrap();
            });
        },

        setPics: function ( pics ){

            this.pics = pics;
            this.removeAll();

            var pic;
            var i;

            for( i = 0; pic = pics[ i ]; i++ ){

                this.insert( i, Ext.ComponentMgr.create({
                    xtype: 'picSlideItem',
                    picUrl: pic,
                    picSlide: this
                } ));
            }

            // 否则图片显示不出来
            this.doLayout();
        }

    });

    var PicItemCls = Ext.extend( Ext.Panel, {

        html: '<div class="slide-pic-item"><img src=""></div>',
        picMargin: 10,
        listeners: {
            afterrender: function (){

                this.picWrap = this.body.child( '.slide-pic-item' );
                this.pic = this.picWrap.child( 'img' );

                this.picSlide.picWraps.push( this.picWrap );
                this.setImg( this.picUrl );

                this.resizePicWrap();
            },

            afterlayout: function (){

                this.resizePicWrap();
            }
        },

        setImg: function ( url ){

            if( url ){
                this.pic.set({
                    src: url
                });

                this.picUrl = url;
            }
            else {

                this.hide();
            }

        },

        setPicSlide: function ( picSlide ){

            this.picSlide = picSlide;
        },

        /**
         * 更新 slide-pic-item 宽高 并设置 img的宽高
         */
        resizePicWrap: function (){

            var newWidth = this.picSlide.el.getWidth();
            var newHeight = this.picSlide.el.getHeight();
            var imgHeight = newWidth > newHeight ? newHeight - this.picMargin  - 30 + 'px' : 'auto';
            var imgWidth = newWidth > newHeight ? 'auto' : newWidth - this.picMargin + 'px';

            this.picWrap.setWidth( newWidth );
            this.picWrap.setHeight( newHeight );

            this.pic.setStyle({
                'max-width': imgWidth,
                'max-height': imgHeight
            });
        }

    });

    Ext.reg( 'picSlide', PicSlideCls );
    Ext.reg( 'picSlideItem', PicItemCls );
})();