(function(){


    var CategorySelectCls = Ext.extend( Ext.form.FieldSet, {

        cls: 'cat-select-fieldset',
        // 显示说明
        title: '我感兴趣的<span class="title-desc">（根据你设定的关键词向你推荐商品）</span>',
        // 是否需要添加按钮
        ifUseSaveBtn: false,
        saveBtnText: '添加',
        initComponent: function (){

            var that = this;

            this.ifUseCustomCat = false;

            // 构造默认分类
            var defaultCats = App.models.categories;
            var options = [{ text: '请选择', value: '' }];

            Ext.each( defaultCats, function ( cat ){

                options.push( { text: cat, value: cat } );
            });

            this.defaultCatOptions = options;

            var comConfig = {
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'checkboxfield',
                        name : 'custom-cat',
                        label: '使用自定义分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        listeners: {
                            check: function (){

                                that.ifUseCustomCat = true;

                                that.hiddenCat.setValue( that.customField.getValue() );
                                that.catSelect.hide();
                                that.customField.show();
                            },
                            uncheck: function (){

                                that.ifUseCustomCat = false;

                                that.hiddenCat.setValue( that.catSelect.getValue() );
                                that.catSelect.show();
                                that.customField.hide();
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'category',
                        id: 'hidden-cat'
                    },
                    {
                        xtype: 'selectfield',
                        name : 'preset-cat',
                        id: 'preset-cat',
                        label: '默认分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        required: true,
                        options: options,
                        listeners: {
                            change: function (){

                                if( that.ifUseCustomCat === false ){

                                    that.hiddenCat.setValue( this.getValue() );
                                }
                            }
                        }
                    },

                    {
                        xtype: 'textfield',
                        name : 'custom-cat',
                        id: 'custom-cat',
                        label: '自定义分类',
                        useClearIcon: true,
                        autoCapitalize : false,
                        listeners: {
                            change: function (){

                                if( that.ifUseCustomCat === true ){

                                    that.hiddenCat.setValue( this.getValue() );
                                }
                            }
                        }
                    }
                ]
            };

            if( this.ifUseSaveBtn ){

                comConfig.items.push(
                    {
                        xtype: 'button',
                        text: that.saveBtnText,
                        ui: 'action',
                        width: '20%',
                        style: {
                            margin: '5px 0 5px 79%'
                        },
                        handler: function (){

                            that.fireEvent( 'saveCat', that.hiddenCat.getValue() );
                        }
                    }
                );
            }

            Ext.apply( this, comConfig );

            CategorySelectCls.superclass.initComponent.call( this );
        },

        listeners: {
            afterrender: function (){

                this.catSelect = this.query( '#preset-cat' )[ 0 ];
                this.ifUseCustom = this.query( 'checkboxfield' )[ 0 ];
                this.customField = this.query( '#custom-cat' )[ 0 ];
                this.hiddenCat = this.query( '#hidden-cat' )[ 0 ];

                // 默认隐藏自定义
                this.customField.hide();

                // 设置默认值 默认会显示第一项，但是实际getValue()出来为''
//                this.catSelect.setValue( '' );
                this.hiddenCat.setValue( this.catSelect.getValue() );
            }
        },

        getCategory: function (){

            return this.hiddenCat.getValue();
        },

        setCategory: function ( catName ){

            // 检查是否为默认分类
            var cats = App.models.categories;
            var catType = 'custom';

            if( catName ){

                Ext.each( cats, function ( cat ){

                    if( cat === catName ){

                        catType = 'preset';
                    }
                });
            }
            // 若catName为空，则设置为默认设置类型
            // 由于值为空，因此会默认显示“请选择'
            else {

                catType = 'preset';
            }

            if( catType === 'preset' ){

                this.customField.hide();
                this.catSelect.show();
                this.catSelect.setValue( catName );
            }
            else {

                this.customField.show();
                this.catSelect.hide();
                this.customField.setValue( catName );
            }

            this.hiddenCat.setValue( catName );
        }
    });

    Ext.reg( 'categorySelect', CategorySelectCls );
})();
