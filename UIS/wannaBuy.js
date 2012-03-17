(function(){

    var wannaBuyModule = {};
    var wannaBuyConfig = wannaBuyModule.config = {

        title: '我要买',
        html: '<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light", though the standard type is dark. Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
        iconCls: 'search',
        cls: 'card1',
        items: [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        title: '我要买',
                        html: '<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light", though the standard type is dark. Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
                        iconCls: 'search'
                    }
                ]
            }
        ]
    };

    Ext.UIS.wannaBuy = wannaBuyModule;
})();