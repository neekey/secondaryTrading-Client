(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome',
        mods: {},
        config: {},
        launch: function (){

            var that = this;

            // 作为google map脚本载入回调
            window.initialize = function (){

                that.viewport = Ext.ComponentMgr.create({
                    xtype: 'viewport'
                });

                App.mods.route.applyHash();
            };

            // 动态载入google map脚本
            loadScript();

        }
    });

    function loadScript() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initialize";
        document.body.appendChild(script);
    }

})();
