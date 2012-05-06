/**
 * 我要买部分控制器
 */
(function(){

    Ext.regController( 'buy', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VBuyMain = this.VMain.query( 'buy' )[ 0 ];
                this.VBuySearch = this.VBuyMain.query( 'itemSearch' )[ 0 ];
                this.VBuyItemDetail = this.VBuyMain.query( 'itemDetail' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VBuyMain );
        },

        // 索索页部分
        search: function (){

            this.index();
            debugger;

            this.VBuyMain.setActiveItem( this.VBuySearch );
        },

        /**
         * 商品页详情部分
         * @param {String} itemId 商品id
         */
        itemDetail: function ( itemId ){

            this.index();

            this.VBuyMain.setActiveItem( this.VBuyItemDetail );

            // 根据商品id请求数据
            this.VBuyItemDetail.fetch( itemId );
        }
    });
})();
(function(){

    /**
     * 对于所有路由的预处理
     */
    Ext.Dispatcher.addListener( 'dispatch', function ( obj ){

        var Auth = App.mods.auth;

        console.log( 'router dispatch:', obj );

        // 检查登陆状态
        Auth.checkAuth(function ( ifLogin ){

            var action = obj.action;
            var controller = obj.controller;
            // 由于sencha 的 route 只能有 controller/action 不能继续加参数，因此用这种方式实现 detail 的的id
            // itemdetail/id 由于 itemdetail 这个控制其没有定义过，因此 controller为null，但是还是可以从historyUrl中读取到
            // action为id值
            var controllerName = controller ? controller.id : obj.historyUrl.split( '/' )[ 0 ];

            if( controllerName === 'welcome' ){

                if( ifLogin ){

                    Ext.redirect( 'main' );
                }
            }
            else {

                if( !ifLogin ){

                    Ext.redirect( 'welcome' );
                    return;
                }

                // 若为商品详情
                if( controllerName === 'itemdetail' ){

                    var buyController = Ext.ControllerManager.get( 'buy' );
                    buyController.itemDetail( action );
                }
                else if( controllerName === 'itemedit' ){

                    var buyController = Ext.ControllerManager.get( 'sell' );
                    buyController.itemEdit( action );
                }
            }
        });
    });
})();
(function(){

    var Mods = App.mods;
    var Auth = Mods.auth;

    Ext.regController( 'main', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
            }

            this.viewport.setActiveItem( this.VMain );
        },

        sell: function (){

            Ext.ControllerManager.get( 'sell' ).menu();

        },

        buy: function (){

            alert( 'test' );
            Ext.ControllerManager.get( 'sell' ).menu();

        }
    });
})();
/**
 * 我的资料部分控制器
 */
(function(){

    var Mods = App.mods;

    Ext.regController( 'profile', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VProfileMain = this.VMain.query( 'profile' )[ 0 ];
                this.VProfileMenu = this.VProfileMain.query( 'profileMenu' )[ 0 ];
                this.VProfileMyProfile = this.VProfileMain.query( 'myProfile' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VProfileMain );
        },

        menu: function (){

            this.index();
            this.VProfileMain.setActiveItem( this.VProfileMenu );
        },

        myProfile: function (){

            this.index();
            this.VProfileMain.setActiveItem( this.VProfileMyProfile );
        },

        preferences: function (){

        }


    })
})();
(function(){

    var Mods = App.mods;

    Ext.regController( 'sell', {

        index: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VSellMain = this.VMain.query( 'sell' )[ 0 ];
                this.VSellMenu = this.VSellMain.query( 'sellMenu' )[ 0 ];
                this.VSellNewItem = this.VSellMain.query( 'newItem' )[ 0 ];
                this.VSellItemDetail = this.VSellMain.query( 'itemDetail' )[ 0 ];
                this.VSellList = this.VSellMain.query( 'sellingList' )[ 0 ];
                this.VSellItemEdit = this.VSellMain.query( 'itemEdit' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.index();

            this.VMain.setActiveItem( this.VSellMain );
        },

        newItem: function (){

            this.index();

            this.VSellMain.setActiveItem( this.VSellNewItem );
        },

        itemDetail: function (){

            this.index();

            this.VSellMain.setActiveItem( this.VSellItemDetail );
        },

        menu: function (){

            this.index();
            this.VSellMain.setActiveItem( this.VSellMenu );
        },

        sellList: function (){

            this.index();
            this.VSellMain.setActiveItem( this.VSellList );

            this.VSellList.getSellingItem();
        },

        itemEdit: function ( itemId ){

            if( itemId ){
                this.index();
                this.VSellItemEdit.setItemId( itemId );
                this.VSellMain.setActiveItem( this.VSellItemEdit );
            }
        }
    });
})();
/**
 * 欢迎 包含 登陆 和 注册
 */
(function(){

    Ext.regController( 'welcome', {


        index: function (){

            if( !this.VWelcome ){

                this.viewport = this.application.viewport;
                this.VWelcome = this.viewport.query( 'welcome' )[0];

                this.VLogin = this.VWelcome.query( 'login' )[ 0 ];
                this.VRegister = this.VWelcome.query( 'register' )[ 0 ];
            }

            this.application.viewport.setActiveItem( this.VWelcome );
//            this.login();
        },

        /**
         * 登陆
         */
        login: function (){

            this.index();

            this.VWelcome.setActiveItem( this.VLogin );

        },

        /**
         * 注册
         */
        register: function (){

            this.index();

            this.VWelcome.setActiveItem( this.VRegister );
        }
    });
})();
