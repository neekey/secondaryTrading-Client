/**
 * 我要买部分控制器
 */
(function(){

    Ext.regController( 'buy', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VBuyMain = this.VMain.query( 'buy' )[ 0 ];
                this.VBuySearch = this.VBuyMain.query( 'itemSearch' )[ 0 ];
                this.VBuyItemDetail = this.VBuyMain.query( 'itemDetail' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VBuyMain );
        },

        index: function (){

            this.search();
        },

        // 索索页部分
        search: function (){

            this.resume();

            this.VBuyMain.setActiveItem( this.VBuySearch );
        },

        /**
         * 商品页详情部分
         * @param {String} itemId 商品id
         */
        detail: function ( itemId ){

            this.resume();

            this.VBuyMain.setActiveItem( this.VBuyItemDetail );

            // 根据商品id请求数据
            this.VBuyItemDetail.fetch( itemId );
        }
    });
})();
(function(){

    var Mods = App.mods;
    var Auth = Mods.auth;

    Ext.regController( 'main', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
            }

            this.viewport.setActiveItem( this.VMain );
        },

        index: function (){

            this.sell();
        },

        sell: function (){

            this.resume();
            Ext.ControllerManager.get( 'sell' ).menu();

        },

        buy: function (){

            this.resume();
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

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VProfileMain = this.VMain.query( 'profile' )[ 0 ];
                this.VProfileMenu = this.VProfileMain.query( 'profileMenu' )[ 0 ];
                this.VProfileMyProfile = this.VProfileMain.query( 'myProfile' )[ 0 ];
                this.VProfilePreference = this.VProfileMain.query( 'preference' )[ 0 ];
//                this.VProfilPositionSearch = this.VProfileMain.query( 'positionSearch' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VProfileMain );
        },

        index: function (){

            this.menu();
        },

        menu: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfileMenu );
        },

        myProfile: function ( address, latlng ){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfileMyProfile );

            if( address && latlng ){
                this.VProfileMyProfile.setLocationInfo( address, latlng );
            }
        },

        positionSearch: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfilPositionSearch );
        },

        preferences: function (){

            this.resume();
            this.VProfileMain.setActiveItem( this.VProfilePreference );
        }


    })
})();
(function(){

    var Mods = App.mods;

    Ext.regController( 'sell', {

        resume: function (){

            if( !this.VMain ){

                this.viewport = this.application.viewport;
                this.VMain = this.viewport.query( 'main' )[ 0 ];
                this.VSellMain = this.VMain.query( 'sell' )[ 0 ];
                this.VSellMenu = this.VSellMain.query( 'sellMenu' )[ 0 ];
                this.VSellNewItem = this.VSellMain.query( 'newItem' )[ 0 ];
                this.VSellItemDetail = this.VSellMain.query( 'itemDetail' )[ 0 ];
                this.VSellPositionSearch = this.VSellMain.query( 'positionSearch' )[ 0 ];
                this.VSellList = this.VSellMain.query( 'sellingList' )[ 0 ];
                this.VSellItemEdit = this.VSellMain.query( 'itemEdit' )[ 0 ];

                this.CMain = Ext.ControllerManager.get( 'main' );
            }

            this.CMain.resume();

            this.VMain.setActiveItem( this.VSellMain );
        },

        index: function (){

            this.menu();
        },

        newItem: function ( address, latlng ){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellNewItem );

            if( address && latlng ){
                this.VSellNewItem.setLocationInfo( address, latlng );
            }

        },

        positionSearch: function (){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellPositionSearch );
            this.VSellPositionSearch.setTargetHash();
        },

        itemDetail: function (){

            this.resume();

            this.VSellMain.setActiveItem( this.VSellItemDetail );
        },

        menu: function (){

            this.resume();
            this.VSellMain.setActiveItem( this.VSellMenu );
        },

        sellList: function (){

            this.resume();
            this.VSellMain.setActiveItem( this.VSellList );

            this.VSellList.getSellingItem();
        },

        edit: function ( itemId, address, latlng ){

            if( itemId ){
                this.resume();
                this.VSellItemEdit.setItemId( itemId );

                if( address && latlng ){

                    this.VSellItemEdit.setLocationInfo( address, latlng );
                }

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
