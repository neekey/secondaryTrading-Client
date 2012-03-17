var JSONP = Ext.util.JSONP;
var APIHost = Ext.STConfig.APIHOST;
var APICheckAuth = APIHost + 'checkauth';
var Auth = Ext.MODS.auth;
var Request = Ext.MODS.request;

Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        var mainStruct = new Ext.TabPanel( Ext.UIS.mainStruct.config );
        var loginReg = new Ext.TabPanel( Ext.UIS.loginReg.config );

        // 先请求是否已经登陆
        Request.jsonp({
            type: 'checkauth',
            callback: function( data ){

                if( data.result && data.data ){

                    mainStruct.show();
                    loginReg.hide();
                }
                else {

                    mainStruct.hide();

                    loginReg.on( 'login', function(){

                        loginReg.hide();
                        mainStruct.show();
                    });

                    loginReg.show();
                }
            }
        });

        mainStruct.hide();
        loginReg.show();
    }
});

/*
(function(){

    var app = new Ext.Application({
        name: 'MyApp',

        launch: function() {
            this.viewport = new Ext.Panel({
                fullscreen: true,

                id    : 'mainPanel',
                layout: 'card',
                items : [
                    {
                        html: 'Welcome to My App!'
                    },
                    {
                        html: '<div id="googleMap" style="width: 100%; height: 100%;"></div>'
                    }
                ]
            }).setActiveItem(1);

            var myOptions = {
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

            var userLocation = navigator.geolocation.getCurrentPosition(function(position) {

                initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                map.setCenter(initialLocation);
                var marker = new google.maps.Marker({
                    position: initialLocation,
                    map: map,
                    title:"You are here"
                });

                console.log( 'success' );
                console.log( initialLocation );

            }, function(){

                console.log( 'error' );
            });
        }
    });
})();
    */