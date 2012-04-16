(function(){

    var PicSlideCls = Ext.extend( Ext.Carousel, {

        // todo 添加动态设置item的方法
        height: 300,
//        width: '100%', 若添加了该属性，将导致组件在初始化时安装当时的100%计算，此后该width作为固定式使用，不会根据窗口变化而变化
        picWraps: [],
        indicator: true,
        flex: 1,
        defaults: {
            html: '<div class="slide-pic-item"><img src="http://dummyimage.com/400x600/985236/fff.png"></div>',
            picMargin: 10,
            listeners: {
                afterrender: function (){

                    this.picWrap = this.body.child( '.slide-pic-item' );
                    this.pic = this.picWrap.child( 'img' );

                    this.picSlide.picWraps.push( this.picWrap );

                    this.resizePicWrap();
                },

                afterlayout: function (){

                    this.resizePicWrap();
                }
            },

            /**
             * 更新 slide-pic-item 宽高 并设置 img的宽高
             */
            resizePicWrap: function (){

                var newWidth = this.picSlide.el.getWidth();
                var newHeight = this.picSlide.el.getHeight();
                var imgHeight = newWidth > newHeight ? newHeight - this.picMargin  - 30 + 'px' : 'auto';
                var imgWidth = newWidth > newHeight ? 'auto' : newWidth - this.picMargin + 'px';

                debugger;
                this.picWrap.setWidth( newWidth );
                this.picWrap.setHeight( newHeight );

                this.pic.setStyle({
                    'width': imgWidth,
                    'height': imgHeight
                });
            }
        },
        items: [
            {},{},{}
        ],
        listeners: {
            afterrender: function (){

                var that = this;

                this.items.each( function ( item ){

                    item.picSlide = that;
                });

                this.addListener( 'resize', function (){

                    console.log( 'reresize' );
                });


            }
        },

        resizePicWraps: function ( width, height ){

            this.items.each( function ( item ){

                item.resizePicWrap();
            });
        }

    });

    Ext.reg( 'picSlide', PicSlideCls );
})();