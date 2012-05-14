(function(){

    var Mods = App.mods;

    Mods.util = {

        /**
         * 为一个异步方法设置超时
         * @param {Function} action 异步方法
         * @param {Array} args 异步方法执行需要的参数
         * @param {Function} next 回调函数
         * @param {Number} timeout 超时时间
         * @param {Function} timeoutNext 如果超时执行的方法
         * @param {Object} scope action 执行时的上下文
         */
        timeoutWrap: function ( action, args, next, timeout, timeoutNext, scope ){

            timeout = timeout || 20000;
            var timer;
            var ifTimeout = false;

            var _next = function (){

                if( ifTimeout ){
                    return;
                }

                clearTimeout( timer );

                next.apply( window, arguments );
            };

            scope = scope || window;

            timer = setTimeout(function (){

                ifTimeout = true;
                timeoutNext();

            }, timeout );

            action.apply( scope, Array.prototype.slice.call( args, 0 ).concat( [ _next ] ) );

        }
    };

})();
