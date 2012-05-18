(function(){

    var Config = App.config;
    var Mods = App.mods;
    var imgEditCls = Ext.extend( Ext.Panel, {
//        layout: 'vbox',
        cls: 'new-item-imgs',
        height: 150,
        // 当前可以显示的图像信息
        imgs: [],
        // 新增的图像信息
        addImgs: [],
        // 被删除的图像新
        removeImgs: [],
        // 事件监听
        listeners: {
            afterRender: function (){

                this.tpl = new Ext.XTemplate( Ext.get( 'item-edit-imgs').getHTML() );
            },
            // 图像被点击
            imgWrapTaped: function ( imgItem, imgWrap, removeImgBtn ){

                var img = imgWrap.child( 'img' );
                var url = img.dom.getAttribute( 'src');
                var that = this;

                if( url ){
                    Ext.Msg.confirm( "更换图片", "继续将覆盖原有图片，是否继续？", function( result ){

                        if( result === 'yes' ){

                            // 直接出现发现有问题...直接展开 然后就关闭了...
                            setTimeout(function (){
                                Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                                    var ifCamera = !!(result === 'yes');

                                    that.processImageCapture( ifCamera, imgItem, imgWrap, removeImgBtn );
                                });
                            }, 1500 )
                        }
                    });
                }
                else {

                    Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){

                        var ifCamera = !!(result === 'yes');

                        that.processImageCapture( ifCamera, imgItem, imgWrap, removeImgBtn );
                    });
                }
            },
            // 移除按钮被点击到
            imgRemoveTaped: function (){

                var that = this;
                var _arguments = arguments;

                Ext.Msg.confirm( "选择图片", "真心要删除图片?", function( result ){

                    if( result === 'yes' ){

                        that.removeImg.apply( that, _arguments );
                    }
                });
            }
        },

        /**
         * 渲染视图
         */
        renderImg: function (){

            this.tpl.overwrite( this.body, this.imgs );
            // 每次重新渲染之后都清空
            this.addImgs = [];
            this.removeImgs = [];

            this.doLayout();
            this.attachImgs();
        },

        /**
         * 绑定事件（每次render后要重新绑定）
         */
        attachImgs: function (){

            var imgItems = this.body.query( '.item-edit-imgs-item' );
            var that = this;

            Ext.each( imgItems, function ( imgItem, index ){

                imgItem = Ext.get( imgItem );
                var imgWrap = imgItem.child( '.item-edit-pic-wrap' );
                var imgRemoveBtn = imgItem.child( '.item-edit-pic-remove' );

                // 为图像添加tap事件
                imgWrap.addListener( 'tap', function (){

                    that.fireEvent( 'imgWrapTaped', imgItem, imgWrap, imgRemoveBtn, index );
                });

                // 为remove按钮添加tap事件
                imgRemoveBtn.addListener( 'tap', function (){

                    that.fireEvent( 'imgRemoveTaped', imgItem, imgWrap, imgRemoveBtn, index );
                });
            });
        },

        /**
         * 删除图像...
         * 如果该位置原来是已经上传过的图片，则会将其_id添加到 removeImgs中
         * @param {ExtElement} imgItem
         * @param {ExtElement} imgWrap
         * @param {ExtElement} imgRemoveBtn
         */
        removeImg: function ( imgItem, imgWrap, imgRemoveBtn ){

            var _id = imgItem.dom.getAttribute( 'data-id' );
            var tipSpan = imgWrap.child( '.item-edit-img-tip' );
            var img = imgWrap.child( 'img' );

            // 若存在id，则将删除一个服务器上已经有的图片，做好记录
            if( _id ){

                this.removeImgs.push( _id );
            }

            // 设置图片地址为空
            img.set({
                src: ''
            });

            // 隐藏图像
            if( !img.hasCls( 'hidden' ) ){

                img.toggleCls( 'hidden' );
            }

            // 显示tip
            if( tipSpan.hasCls( 'hidden' ) ){

                tipSpan.toggleCls( 'hidden' );
            }

            // 隐藏btn
            if( !imgRemoveBtn.hasCls( 'hidden' ) ){

                imgRemoveBtn.toggleCls( 'hidden' );
            }
        },

        /**
         * 执行获取图片的操作（读取本地文件或者使用像机）
         * @param ifCamera 是否使用相机
         * @param imgItem
         * @param imgWrap
         * @param removeBtn
         */
        processImageCapture: function ( ifCamera, imgItem, imgWrap, removeBtn ){

            var that = this;

            if( Config.IF_DEVICE ){
                Mods.getPicture({
                    ifCamera: ifCamera,
                    ifData: true,
                    quality: 50,
                    success: function( url ){

                        if( url ){

                            url = 'data:image/png;base64,' + url;
                            that.onImgCaptureSuccess( url, imgItem, imgWrap, removeBtn );
                        }
                    },
                    error: function(){
                        Ext.msg.alert( '图片获取失败!' );
                    }
                });
            }
            else {

                setTimeout(function (){
                    Ext.Msg.alert( '当前环境不支持添加图像' );
                }, 1000 );

            }
        },

        /**
         * 图片获取成功后的操作
         * @param url
         * @param imgItem
         * @param imgWrap
         * @param removeBtn
         */
        onImgCaptureSuccess: function ( url, imgItem, imgWrap, removeBtn ){

            var img = imgWrap.child( 'img' );
            var tipSpan = imgWrap.child( '.item-edit-img-tip' );

            // 设置图像
            img.set({
                src: url
            });

            // 显示图像
            if( img.hasCls( 'hidden' ) ){

                img.toggleCls( 'hidden' );
            }

            // 隐藏tip
            if( !tipSpan.hasCls( 'hidden' ) ){

                tipSpan.toggleCls( 'hidden' );
            }

            // 显示btn
            if( removeBtn.hasCls( 'hidden' ) ){

                removeBtn.toggleCls( 'hidden' );
            }
        },

        /**
         * 返回修改的item的图片请求,包括删除的旧的图像，以及新增的新图像
         * @return {Object} { addItems: [ base64图像数据数组 ], removeImgs: [ 被删除的旧图像的id数组 ] }
         */
        getUpdateInfo: function (){

            var addImgs = [];

            var imgItem = this.body.query( '.item-edit-imgs-item' );

            Ext.each( imgItem, function ( item ){

                // 若没有id，则说明是新图片
                if( !item.getAttribute( 'data-id' ) ){

                    var img = Ext.get( item ).query( 'img')[ 0 ];
                    var url;

                    if( img ){

                        url = img.getAttribute( 'src' );
                    }

                    if( url ){
                        addImgs.push( url );
                    }
                }
            });

            return {
                addImgs: addImgs,
                removeImgs: this.removeImgs
            };
        },

        /**
         * 设置图像信息
         * @param imgs
         */
        setImages: function ( imgs ){

            this.imgs = this.imgsHandle( imgs );
            this.renderImg();
        },

        /**
         * 处理图片信息，以便渲染，如果不足三个，则添加空
         */
        imgsHandle: function ( imgs ){

            var imgLen;
            var i;

            imgs = Ext.isArray( imgs ) ? imgs : [ imgs ];
            imgLen = imgs.length;

            Ext.each( imgs, function ( img ){

                if( !img.url ){

                    img.url = Config.APIHOST + 'img?id=' + img._id;
                }
            });

            // 若不足三个，则补全
            if( imgLen < 3 ){

                for( i = 0; i < 3 - imgLen; i++ ){

                    imgs.push({});
                }
            }

            return imgs;
        }

    });

    Ext.reg( 'imgEdit', imgEditCls );
})();
