/**
 * 添加新商品的主页面
 */
(function(){

    var Map = Ext.MODS.map;
    var Request = Ext.MODS.request;
    var newItemModule = {};
    var newItemInstance;
    var formInstance;
    var locationInstance;
    var picInstance;

    Ext.regModel('item', {
        fields: [
            { name: 'title', type: 'string' },
            { name: 'desc', type: 'string' },
            { name: 'price', type: 'string' },
            { name: 'pic1', type: 'string' },
            { name: 'pic2', type: 'string' },
            { name: 'pic3', type: 'string' }
        ],
        validations: [
            { type: 'presence', name: 'title',message:"商品标题不能为空" },
            { type: 'presence', name: 'desc', message : "商品表述不能为空" },
            { type: 'presence', name: 'price', message: '价格不能为空' },
            { type: 'format',   name: 'price', matcher: /^[\d.]*$/, message:"无效的价格" }
        ]
    });

    // 新商品基本信息表单
    var newItemFormConfig = {

        xtype: 'form',
        scroll: 'vertical',
        id: 'new-item',
        defaults: {
            required: true,
            labelAlign: 'left',
            labelWidth: '40%',
            useClearIcon: true,
            autoCapitalize : false
        },
        title: '商品简介',
        items: [

            {
                xtype: 'textfield',
                name : 'title',
                label: '标题'
            },
            {
                xtype: 'textareafield',
                name : 'desc',
                label: '商品表述'
            },
            {
                xtype: 'textfield',
                name: 'price',
                label: '价格'
            },
            {
                xtype: 'hiddenfield',
                name : 'location'
            }
        ],
        listeners : {
            submit : function(form, result){
                console.log('success', Ext.toArray(arguments));
            },
            exception : function(form, result){
                console.log('failure', Ext.toArray(arguments));
            },
            afterrender: function(){
                formInstance = this;
            }
        }
    };

    // 获取用户地理位置按钮
    //todo 添加直接定位和让用户自己属于位置的选择
    //todo 两种方式最终都会请求到候选列表让用户进行选择
    var locationConfig = {
        xtype: 'button',
        cls  : 'demobtn',
        flex : 1,
        height: '50',
        ui  : 'decline',
        text: '为商品定位',
        margin: '0 15% 0 15%',
        handler: function(){
            Map.getCurrentLatLng(function( err, latLng ){

                console.log( latLng );
                Map.getRAR( latLng.lat, latLng.lng, function( res ){

                    alert( JSON.stringify( res ) );
                });
            });
        }
    };

    /**
     * 用户提交表单按钮
     * @type {Object}
     */
    var submitSellConfig = {
        xtype: 'button',
        cls: 'submit',
        flex: 1,
//        height: '50',
//        width: '50%',
        ui  : 'confirm',
        text: '发布商品',
        margin: '0 15% 0 15%',
        handler: function(){

            debugger;
            var values = formInstance.getValues();
            // 根据xtype 获取三个图片获取组件
            var pics = picInstance.query( 'imageCapture' );
            var pic;
            var index;
            var model;
            var errors;
            var message = '';

            // 添加图片数据
            for( index = 0; pic = pics[ index ]; index++ ){

                values[ 'pic' + index ] = pic.getImage();
            }

            model = Ext.ModelMgr.create( values, 'item' );
            errors = model.validate();

            if( errors.isValid() ){

                Request.send({
                    method: 'POST',
                    type: 'newItem',
                    data: values,
                    callback: function ( data ){

                        if( data.result ){
                            Ext.Msg.alert( '商品添加成功' );
                        }
                        else {
                            Ext.Msg.alert( '商品添加失败', data.error );
                        }
                    }
                });
            } else {

                Ext.each( errors.items, function( rec, i ){

                    message += rec.message+"<br>";
                });

                Ext.Msg.alert( "表单有误：", message );

                return false;
            }
        }
    };

    // 图片选取
    var imageConfig = {
        xtype: 'panel',
        layout: 'hbox',
        cls: 'new-item-imgs',
        height: 150,
        defaults: {
            /*
            cls: 'new-item-img',
            height: 100,
            centered: true,
            width: '30%',
            margin: '0 5.2% 0 5.2%',    // 这个margin使用百分比时，相对的是自身的宽度或者高度
            html: '<div style="display: inline-block; width: 100px; height: 100px; background: red;"><img class="pic" /></div>',
            style: {
                textAlign: 'center'
            },
            listeners: {
                click: {
                    element: 'el',
                    fn:function(){
                        Ext.Msg.confirm( "选择图片", "是否拍照上传?", function( result ){
                            console.log( result );
                        });


                    console.log( this );
                    }
                },
                afterrender: function(){
                    console.log( 'afterrender' );
                    window[ '_imageInstance' ] = this;
                    window[ '_img' ] = Ext.get( this.el.query( '.pic' )[ 0 ] );
                    this.imageWrap = this.el.dom;
                }
            }
            */
            xtype: 'imageCapture',
            height: 100,
            width: '30%',
            margin: '0 5.2% 0 5.2%',
            style: {
                background: 'red'
            },
            ifData: true
        },
        items: [
            {},{},{}
        ],
        listeners: {
            afterRender: function (){
                picInstance = this;
            }
        }
    };

    newItemModule.config = {
        items: [
            newItemFormConfig,
            locationConfig,
            imageConfig,
            submitSellConfig
        ],
        listeners: {
            afterrender: function(){
                var that = this;
                newItemModule.instance = newItemInstance = that;

                // 直接hide会导致再次show的时候子组件都无法显示
                // 借此推断，sencha的组件是延迟渲染的，因此一开始延迟hide，让所有子组件都渲染完成
                // 再hide
                setTimeout( function(){
                    that.hide();
                }, 1 );
            }
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                title: '新商品',
                items: [
                    {
                        text: '返回',
                        ui: 'back',
                        handler: function() {

                            newItemInstance.hide();
                            Ext.UIS.WS.index.instance.show();
                        }
                    }
                ]
            }
        ]
    };

    Ext.UIS.WS.newItem = newItemModule;
})();