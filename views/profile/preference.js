(function(){

    var Auth = App.mods.auth;
    var Mods = App.mods;

    var PreferenceCls = Ext.extend( Ext.Panel, {

        defaults: {
            margin: '30% 10%'
        },
        scroll: 'vertical',
        // 用户的偏好列表 [ 'cat1', 'cat2',...]
        userFavorList: [],

        initComponent: function (){

            var that = this;
            var defaultCats = App.models.categories;
            var options = [];

            Ext.each( defaultCats, function ( cat ){

                options.push( { text: cat, value: cat } );
            });

            Ext.apply( this, {
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        title: '偏好设置',
                        items: [
                            {
                                xtype: 'goBackButton'
                            },
                            {   xtype: 'spacer' },
                            {
                                text: '保存',
                                ui: 'confirm',
                                handler: function(){

                                    that.setLoading( true );
                                    // 发送请求
                                    Mods.profile.updateUserInfo( undefined, { favorite: that.userFavorList.join( ',' ) }, function ( errObj ){

                                        that.setLoading( false );

                                        if( !errObj ){

                                            Ext.Msg.alert( '保存成功!' );
                                        }
                                        else {

                                            Ext.Msg.alert( '保存出错', ( errObj.error || '' ) + ( JSON.stringify( errObj.data ) || '' ) );
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'categorySelect',
                        ifUseSaveBtn: true
                    },
                    {
                        xtype: 'panel',
                        id: 'user-favor-list-panel'
                    }
                ]
            });

            PreferenceCls.superclass.initComponent.call( this );
        },
        listeners: {
            afterrender: function (){

                var that = this;

                this.favorListTpl = new Ext.XTemplate( Ext.get( 'user-favor-list-tpl' ).getHTML() );
                this.favorItemTpl = new Ext.XTemplate( Ext.get( 'user-favor-item-tpl' ).getHTML() );
                this.userFavorPanel = this.query( '#user-favor-list-panel' )[ 0 ];
                this.categorySelect = this.query( 'categorySelect' )[ 0 ];

                this.categorySelect.addListener( 'saveCat', function ( catName ){

                    // 检查分类是否已经存在
                    if( that.userFavorList.contains( catName ) ){

                        Ext.Msg.alert( '错误：', '分类:' + catName + ' 已经存在!' );
                    }
                    else {
                        that.insertFavor( catName );
                        that.userFavorList.push( catName );
                    }

                });
            },

            /**
             * 当一个分类被移除是触发
             * @param catName 被移除的分类名称
             */
            favorRemove: function ( catName ){

                debugger;
                // 从列表中清除
                this.userFavorList.remove( catName );
            },

            activate: function (){

                this.fetch();
            }
        },

        /**
         * 请求当前用户信息
         */
        fetch: function (){

            var that = this;
            this.setLoading( true );

            Mods.profile.getUserInfo( undefined, function ( data, user ){

                that.setLoading( false );
                if( data ){

                    Ext.Msg.alert( '获取用户信息失败! ', ( data.error || '' ) + ( JSON.stringify( data.data ) || '' ) );
                }
                else {

                    that.userFavorList = user.favorite || [];
                    that.renderFavorList();
                }
            });
        },

        /**
         * 根据 userFavorLst 渲染列表
         */
        renderFavorList: function (){

            this.favorListTpl.overwrite( this.userFavorPanel.body, this.userFavorList );
            this.attachDelCat();
        },

        /**
         * 想分类列表中插入单个分类
         * @param catName
         */
        insertFavor: function ( catName ){

            alert( typeof this.favorUl );

            if( !this.favorUl ){

                alert( 'in!');
                this.favorUl = this.userFavorPanel.body.child( '.user-favor-list ul' );
            }

            alert( 'out!' );

            this.favorItemTpl.append( this.favorUl, { name: catName } );
        },

        /**
         * 为分类列表添加 点击删除的事件
         */
        attachDelCat: function ( ){

            var that = this;

            if( !this.favorUl ){

                this.favorUl = this.userFavorPanel.body.child( '.user-favor-list ul' );
            }

            // 添加对于删除分类事件的监听
            Ext.EventManager.addListener( this.favorUl.dom, 'tap', function ( favorUl, delSpan ){

                alert( 'hello!' );
                var catName = delSpan.getAttribute( 'data-name' );
                // 删除该节点
                Ext.get( delSpan.parentNode).remove();

                // 出发 favorRemove事件
                that.fireEvent( 'favorRemove', catName );

            }, this.favorUl, { delegate: '.delete-cat' } );
        }
    });

    Ext.reg( 'preference', PreferenceCls );
})();
