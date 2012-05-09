(function(){

    var Mods = App.mods;

    Mods.dom = {
        create: function ( string ){

            var undefinedDom = document.createElement();
            undefinedDom.innerHTML = string;

            return undefinedDom.children[ 0 ];
        }
    }
})();
