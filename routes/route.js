(function(){

    Ext.Router.draw(function ( map ){

        map.connect( ':controller/:action' );

        map.connect( '', { controller: 'welcome', action: 'index' } );
        map.connect( 'index', { controller: 'welcome', action: 'index' } );
        map.connect( 'welcome', { controller: 'welcome', action: 'index' } );
        map.connect( 'main', { controller: 'main', action: 'sell' } );
    });
})();
