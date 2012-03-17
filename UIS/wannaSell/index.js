/**
 * 我要卖的主页
 */
(function(){

    var indexModule = {};
    var indexInstance;
    var indexConfig = indexModule.config = {
        id: 'wannaSell-index',
        defaults: {
            xtype: 'button',
            cls  : 'demobtn',
            flex : 1,
            height: '50',
            margin: '0 0 10 0'
        },
        items: [
            {
                ui  : 'action',
                text: '添加新商品',
                handler: function(){

                    var newItemInstance = Ext.UIS.WS.newItem.instance;
                    indexInstance.hide();
                    newItemInstance.show();
                }
            },
            {
                ui  : 'action',
                text: '出售中的商品'
            }
        ],
        listeners: {
            afterrender: function(){
                indexModule.instance = indexInstance = this;
            }
        }
    };

    Ext.UIS.WS.index = indexModule;
})();