(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome',
        mods: {},
        config: {},
        launch: function (){

            var that = this;
            var timer;
            var timeout = 10000;
            var ifTimeout = false;

            // 作为google map脚本载入回调
            window.initialize = function (){

                if( ifTimeout === false ){

                    clearTimeout( timer );

                    that.viewport = Ext.ComponentMgr.create({
                        xtype: 'viewport'
                    });

                    App.mods.route.applyHash();
                }
            };

            // 动态载入google map脚本
            loadScript();

            timer = setTimeout(function (){

                window.initialize();

                ifTimeout = true;

            }, timeout );

        }
    });

    function loadScript() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initialize";
        document.body.appendChild(script);
    }

})();
