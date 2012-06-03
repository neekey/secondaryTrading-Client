(function(){

    Ext.regApplication({

        name: 'App',
        defaultUrl: 'welcome',
//        useLoadMask: true,
        mods: {},
        config: {},
        launch: function (){

            var that = this;
            var timer;
            var timeout = 30000;
            var ifTimeout = false;

            // 作为google map脚本载入回调
            window.initialize = function (){

                if( ifTimeout === false ){

                    setLoadingMask( false );
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

                setLoadingMask( true, '地图模块加载失败!与地图相关的功能将不可用- -#');

                // 个两秒后初始化界面，让用户看清楚提示
                setTimeout(function (){

                    setLoadingMask( false );
                    window.initialize();
                    ifTimeout = true;

                }, 2000 );

            }, timeout );

        }
    });

    function loadScript() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initialize";
        document.body.appendChild(script);
    }

    function setLoadingMask( ifShow, text ){

        var mask = Ext.get( 'st-loading-mask' );
        var loadingTip = mask.child( '.loading-tip' );

        if( text ){

            loadingTip.setHTML( text );
        }
        if( ifShow ){

            mask.show();
        }
        else {
            mask.hide();
        }
    }

})();
