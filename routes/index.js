(function(){

    Ext.Router.draw(function ( map ){

        map.connect( 'index', { controller: 'home', action: 'index' } );
    });
})();
