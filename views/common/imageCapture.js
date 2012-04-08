/**
 * 图片获取组件
 */

(function(){

    var Mods = App.mods;

    var ImageCaptureCls = Ext.extend( Ext.Component, {
        style: {
            overflow: 'hidden'
        },
        html: '<div class="pic-wrap"><img class="pic" /></div>',
        ifData: false,
        initComponent: function(){

            var that = this;

            this.addListener( 'click', function(){

                that.imgInitialized = false;

                Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                    var ifCamera = !!(result === 'yes');

//                    alert( that.ifData );

                    Mods.getPicture({
                        ifCamera: ifCamera,
                        ifData: that.ifData,
                        quality: 50,
                        success: function( url ){

                            if( url ){

                                if( that.ifData ){

                                    url = 'data:image/png;base64,' + url;
                                }
                                that.onGetImgSuccess( url );
                            }
                        },
                        error: function(){

                        }
                    });

                    // that.onGetImgSuccess( 'http://localhost:8888/dropbox/eclipse/HelloPhoneGap/assets/www/sencha-touch-1.1.1/examples/kitchensink/resources/img/sencha.png' );
                });

                console.log( that.getImage() );
            }, this, { element: 'el' } );
        },
        listeners: {
            afterrender: function(){

                this.imageEl = Ext.get( this.el.query( '.pic' )[ 0 ] );
                this.imageWrap = Ext.get( this.el.query( '.pic-wrap' )[ 0 ] );
            }
        },
        /**
         * 初始化图片元素，根据组建容器设置其高度和宽度
         * 同时设置图片wrap，实现垂直和水平居中
         */
        imgInit: function(){

            var maxHeight = this.el.getHeight();
            var maxWidth = this.el.getWidth();

            // 实现图片的水平和垂直居中
            // 该方法在低版本的IE下会有兼容性问题，需要Hack
            this.imageWrap.set({
                style: {
                    textAlign: 'center',
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    width: maxWidth + 'px',
                    height: maxHeight + 'px'
                }
            });
            this.imageEl.set( {
                style: {
                    'max-height': maxHeight + 'px',
                    'max-width': maxWidth + 'px'
                }
            });
            this.imgInitialized = true;
        },
        /**
         * 图片重新获取的回调函数
         * @param url 返回的Url
         */
        onGetImgSuccess: function( url ){
            this.setImage( url );
        },
        /**
         * 设置图片的URL，同时储存Url
         * @param url
         */
        setImage: function( url ){

            if( !this.imgInitialized ){

                this.imgInit();
            }
            this.imageEl.set( { src: url } );
            this.imageUrl = url;
        },
        /**
         * 获取当前用户选取的图片的url
         */
        getImage: function(){

            return this.imageUrl || '';
        }
    });

    Ext.reg( 'imageCapture', ImageCaptureCls );
})();