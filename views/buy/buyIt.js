(function(){

    var BuyIt = App.views.buyIt = Ext.extend( Ext.Panel, {

        scroll: 'vertical',
        html: '',
        initComponent: function (){

            var that = this;

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        title: '购买',
                        items: [
                            {
                                xtype: 'goBackButton'
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'panel',
                        html: '<div class="danbao-wrap"><img class="danbao-pic" src="images/danbao.png"><p><a class="danbao-link" href="http://www.baidu.com" target="_blank">进入支付宝担保交易</a></p></div>',
                        height: 400
                    }
                ]
            });

            BuyIt.superclass.initComponent.call( this );
        }
    });

    Ext.reg( 'buyIt', BuyIt );
})();
